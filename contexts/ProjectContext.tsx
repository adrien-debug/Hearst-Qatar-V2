/**
 * Context de Projet
 * Gère l'état global du projet actif et sa configuration
 * Intégré avec Supabase pour la sauvegarde cloud
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectConfiguration, EquipmentPosition, VRDElement } from '../lib/projectGenerator';
import { useAuth } from '../hooks/useAuth';
import { saveProject as saveProjectToSupabase, loadProject as loadProjectFromSupabase, loadProjects, migrateLocalProjects } from '../lib/supabase/services/projects';

interface ProjectContextType {
  // État du projet
  currentProject: ProjectConfiguration | null;
  setCurrentProject: (project: ProjectConfiguration | null) => void;
  
  // Équipements
  equipment: EquipmentPosition[];
  setEquipment: (equipment: EquipmentPosition[]) => void;
  addEquipment: (equipment: EquipmentPosition) => void;
  removeEquipment: (id: string) => void;
  updateEquipment: (id: string, updates: Partial<EquipmentPosition>) => void;
  
  // Infrastructure VRD
  vrdElements: VRDElement[];
  setVRDElements: (elements: VRDElement[]) => void;
  
  // Sélection
  selectedEquipmentId: string | null;
  setSelectedEquipmentId: (id: string | null) => void;
  
  // Actions
  clearProject: () => void;
  saveProject: () => void;
  loadProject: (projectId: string) => void;
  
  // État de chargement
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'hearst_qatar_projects';
const ACTIVE_PROJECT_KEY = 'hearst_qatar_active_project';

/**
 * Provider du contexte de projet
 */
export function ProjectProvider({ children }: { children: ReactNode }) {
  // Utiliser useAuth de manière sécurisée (peut ne pas être disponible)
  let user = null;
  let isAuthenticated = false;
  
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    // AuthProvider n'est pas disponible, utiliser localStorage uniquement
    console.log('AuthProvider non disponible, utilisation de localStorage');
  }
  
  const [currentProject, setCurrentProjectState] = useState<ProjectConfiguration | null>(null);
  const [equipment, setEquipment] = useState<EquipmentPosition[]>([]);
  const [vrdElements, setVRDElements] = useState<VRDElement[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);

  // Migrer les projets locaux vers Supabase au premier login
  useEffect(() => {
    if (isAuthenticated && user && !hasMigrated) {
      migrateLocalProjects(user.id).then(({ count }) => {
        if (count > 0) {
          console.log(`✅ ${count} projets migrés de localStorage vers Supabase`);
        }
        setHasMigrated(true);
      });
    }
  }, [isAuthenticated, user, hasMigrated]);

  // Migration automatique : GRILLE 3×2 - Équipements individuels
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const migrationKey = 'hearst_layout_MIROIR_v12';
    const migrationDone = localStorage.getItem(migrationKey);
    
    if (!migrationDone) {
      try {
        // Supprimer tous les anciens projets
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
        // Log en mode debug pour éviter le spam dans la console
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Migration v12: Layout en MIROIR avec route centrale');
        }
        
        localStorage.setItem(migrationKey, 'true');
      } catch (error) {
        console.error('Erreur lors de la migration layout:', error);
      }
    }
  }, []);

  /**
   * Récupérer un projet depuis localStorage sans changer l'état
   */
  const getLocalProject = React.useCallback((projectId: string): ProjectConfiguration | null => {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEY);
      if (!storedProjects) return null;

      const projects: ProjectConfiguration[] = JSON.parse(storedProjects);
      return projects.find(p => p.id === projectId) || null;
    } catch (error) {
      console.error('❌ Erreur lecture localStorage:', error);
      return null;
    }
  }, []);

  /**
   * Charger depuis localStorage (fallback)
   */
  const loadFromLocalStorage = React.useCallback((projectId: string) => {
    const project = getLocalProject(projectId);

    if (project) {
        setCurrentProjectState(project);
        localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
        console.log('✅ Projet chargé depuis localStorage:', project.name);
        setIsLoading(false);
    } else {
        console.warn('⚠️ Projet non trouvé dans localStorage:', projectId);
        setIsLoading(false);
    }
  }, [getLocalProject]);

  /**
   * Charger un projet avec synchronisation intelligente (Cloud vs Local)
   */
  const loadProject = React.useCallback(async (projectId: string) => {
    if (typeof window === 'undefined') return;

    try {
      setIsLoading(true);
      console.log('🔄 Chargement du projet:', projectId);
      
      let projectToLoad: ProjectConfiguration | null = null;
      let source = 'none';

      // 1. Charger depuis localStorage (toujours disponible)
      const localProject = getLocalProject(projectId);

      // 2. Si authentifié, charger depuis Supabase
      if (isAuthenticated && user) {
        const { data: remoteData, error } = await loadProjectFromSupabase(projectId, user.id);
        
        if (remoteData && !error) {
          const remoteProject = remoteData.config;
          
          // COMPARARAISON DES DATES
          // On utilise lastModified ou updated_at ou createdAt comme fallback
          const localDate = localProject?.metadata?.lastModified 
            ? new Date(localProject.metadata.lastModified).getTime() 
            : (localProject?.metadata?.createdAt ? new Date(localProject.metadata.createdAt).getTime() : 0);
            
          const remoteDate = remoteProject?.metadata?.lastModified 
            ? new Date(remoteProject.metadata.lastModified).getTime() 
            : (remoteData.updated_at ? new Date(remoteData.updated_at).getTime() : 0);
          
          // Si le local est plus récent (> 5 secondes de différence pour éviter les faux positifs)
          if (localProject && localDate > remoteDate + 5000) {
            console.log('⚠️ Conflit: Version locale plus récente détectée');
            console.log(`📅 Local: ${new Date(localDate).toLocaleTimeString()} vs Cloud: ${new Date(remoteDate).toLocaleTimeString()}`);
            projectToLoad = localProject;
            source = 'local_newer';
            
            // Optionnel : on pourrait déclencher une sauvegarde asynchrone pour mettre à jour le cloud
            // mais on va laisser le soin à l'utilisateur de sauvegarder manuellement pour l'instant
          } else {
            projectToLoad = remoteProject;
            source = 'cloud';
          }
        } else {
          console.warn('⚠️ Erreur/Absence Supabase, fallback localStorage');
          projectToLoad = localProject;
          source = 'local_fallback';
        }
      } else {
        // Non authentifié -> LocalStorage
        projectToLoad = localProject;
        source = 'local_guest';
      }

      if (projectToLoad) {
        setCurrentProjectState(projectToLoad);
        localStorage.setItem(ACTIVE_PROJECT_KEY, projectToLoad.id);
        console.log(`✅ Projet chargé (${source}):`, projectToLoad.name);
      } else {
        console.warn('❌ Projet introuvable (ni local, ni cloud):', projectId);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Erreur lors du chargement du projet:', error);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, getLocalProject]);

  // Charger le projet actif au montage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsLoading(true);
    
    try {
      const activeProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (activeProjectId) {
        console.log('📂 Chargement du projet actif:', activeProjectId);
        loadProject(activeProjectId);
      } else {
        // Log en mode debug uniquement pour éviter le spam
        if (process.env.NODE_ENV === 'development') {
          console.log('ℹ️ Aucun projet actif trouvé dans localStorage');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du projet actif:', error);
      setIsLoading(false);
    }
  }, [loadProject]);

  // Synchroniser les équipements et VRD avec le projet actif
  useEffect(() => {
    if (currentProject) {
      setEquipment(currentProject.equipment);
      setVRDElements(currentProject.vrd);
    } else {
      // Si pas de projet, vider les équipements
      setEquipment([]);
      setVRDElements([]);
    }
  }, [currentProject]);

  /**
   * Définir le projet actif
   */
  const setCurrentProject = React.useCallback((project: ProjectConfiguration | null) => {
    setCurrentProjectState(project);
    
    if (project && typeof window !== 'undefined') {
      try {
        // Sauvegarder l'ID du projet actif
        localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
        
        // Sauvegarder le projet complet dans la liste des projets
        const storedProjects = localStorage.getItem(STORAGE_KEY);
        const projects: ProjectConfiguration[] = storedProjects 
          ? JSON.parse(storedProjects) 
          : [];
        
        // Vérifier si le projet existe déjà
        const existingIndex = projects.findIndex(p => p.id === project.id);
        if (existingIndex >= 0) {
          projects[existingIndex] = project;
        } else {
          projects.push(project);
        }
        
        // Sauvegarder la liste mise à jour
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        console.log('💾 Projet sauvegardé:', project.name, `(${project.equipment.length} équipements)`);
      } catch (error) {
        console.error('❌ Erreur localStorage:', error);
      }
    } else if (!project && typeof window !== 'undefined') {
      // Si projet null, effacer l'ID actif
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  }, []);

  /**
   * Ajouter un équipement
   */
  const addEquipment = (newEquipment: EquipmentPosition) => {
    setEquipment(prev => [...prev, newEquipment]);
  };

  /**
   * Supprimer un équipement
   */
  const removeEquipment = (id: string) => {
    setEquipment(prev => prev.filter(eq => eq.id !== id));
    if (selectedEquipmentId === id) {
      setSelectedEquipmentId(null);
    }
  };

  /**
   * Mettre à jour un équipement
   */
  const updateEquipment = (id: string, updates: Partial<EquipmentPosition>) => {
    setEquipment(prev => prev.map(eq => 
      eq.id === id ? { ...eq, ...updates } : eq
    ));
  };

  /**
   * Effacer le projet actif
   */
  const clearProject = () => {
    setCurrentProjectState(null);
    setEquipment([]);
    setVRDElements([]);
    setSelectedEquipmentId(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  };

  /**
   * Sauvegarder le projet actif
   */
  const saveProject = async () => {
    console.log('💾 Tentative de sauvegarde...');
    if (typeof window === 'undefined') return;

    if (!currentProject) {
        console.warn('⚠️ Aucun projet actif à sauvegarder');
        return;
    }

    try {
      console.log('📝 Préparation de la sauvegarde pour:', currentProject.name);
      
      // Mettre à jour le projet avec les équipements actuels
      const updatedProject: ProjectConfiguration = {
        ...currentProject,
        equipment, // <-- Utilise l'état local 'equipment' qui est à jour
        vrd: vrdElements, // <-- Utilise l'état local 'vrdElements' qui est à jour
        metadata: {
          ...currentProject.metadata,
          lastModified: new Date().toISOString(),
        }
      };
      
      console.log(`📦 Sauvegarde de ${updatedProject.equipment.length} équipements`);

      // Si authentifié, sauvegarder dans Supabase
      if (isAuthenticated && user) {
        console.log('☁️ Sauvegarde vers Supabase...');
        const { error } = await saveProjectToSupabase(updatedProject, user.id);
        if (error) {
          console.error('❌ Erreur Supabase, fallback vers localStorage:', error);
          // Fallback vers localStorage en cas d'erreur
          saveToLocalStorage(updatedProject);
          // IMPORTANT: Mettre à jour l'état local aussi pour refléter que c'est sauvegardé
          setCurrentProjectState(updatedProject);
        } else {
          console.log('✅ Projet sauvegardé dans Supabase:', updatedProject.name);
          
          // FORCER LA SAUVEGARDE LOCALE AUSSI POUR ÊTRE SÛR D'AVOIR LA DERNIÈRE VERSION EN LOCAL
          // Cela permet d'éviter le conflit "Cloud vs Local" au prochain chargement si le cloud lag
          saveToLocalStorage(updatedProject);
          
          setCurrentProjectState(updatedProject);
        }
      } else {
        // Si non authentifié, sauvegarder dans localStorage
        console.log('💾 Sauvegarde vers LocalStorage (non authentifié)...');
        saveToLocalStorage(updatedProject);
        setCurrentProjectState(updatedProject);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
    }
  };

  /**
   * Sauvegarder dans localStorage (fallback)
   */
  const saveToLocalStorage = (project: ProjectConfiguration) => {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEY);
      const projects: ProjectConfiguration[] = storedProjects 
        ? JSON.parse(storedProjects) 
        : [];

      const existingIndex = projects.findIndex(p => p.id === project.id);
      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Erreur localStorage:', error);
    }
  };

  const value: ProjectContextType = {
    currentProject,
    setCurrentProject,
    equipment,
    setEquipment,
    addEquipment,
    removeEquipment,
    updateEquipment,
    vrdElements,
    setVRDElements,
    selectedEquipmentId,
    setSelectedEquipmentId,
    clearProject,
    saveProject,
    loadProject,
    isLoading,
    setIsLoading,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte de projet
 */
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

/**
 * Hook pour récupérer tous les projets sauvegardés
 */
export function useAllProjects(): ProjectConfiguration[] {
  const [projects, setProjects] = useState<ProjectConfiguration[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedProjects = localStorage.getItem(STORAGE_KEY);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  }, []);

  return projects;
}

/**
 * Hook pour supprimer un projet
 */
export function useDeleteProject() {
  const { currentProject, clearProject } = useProject();

  const deleteProject = (projectId: string) => {
    if (typeof window === 'undefined') return false;

    try {
      const storedProjects = localStorage.getItem(STORAGE_KEY);
      if (!storedProjects) return false;

      const projects: ProjectConfiguration[] = JSON.parse(storedProjects);
      const filteredProjects = projects.filter(p => p.id !== projectId);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));

      // Si le projet supprimé est le projet actif, effacer
      if (currentProject?.id === projectId) {
        clearProject();
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      return false;
    }
  };

  return deleteProject;
}

/**
 * Hook pour exporter un projet en JSON
 */
export function useExportProject() {
  const { currentProject } = useProject();

  const exportProject = () => {
    if (!currentProject) return;

    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name.replace(/\s+/g, '_')}_${currentProject.powerMW}MW.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return exportProject;
}

