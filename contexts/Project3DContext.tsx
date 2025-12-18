import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectConfig } from '../components/NewProjectModal';
import { LayoutElement } from '../utils/layoutGenerator';
import { 
  getCurrentProject, 
  setCurrentProject as setCurrentProjectInStorage,
  saveProject3D,
  SavedProject3D 
} from '../utils/project3DStorage';

interface Project3DContextType {
  currentProject: ProjectConfig | null;
  currentLayout: LayoutElement[];
  hasProject: boolean;
  setProject: (project: ProjectConfig, layout: LayoutElement[], saveToList?: boolean) => void;
  clearProject: () => void;
  loadProject: (savedProject: SavedProject3D) => void;
}

const Project3DContext = createContext<Project3DContextType | undefined>(undefined);

export function Project3DProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<ProjectConfig | null>(null);
  const [currentLayout, setCurrentLayout] = useState<LayoutElement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger le projet actif depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = getCurrentProject();
      if (saved) {
        setCurrentProject(saved.project);
        setCurrentLayout(saved.layout);
      }
      setIsInitialized(true);
    }
  }, []);

  const setProject = (project: ProjectConfig, layout: LayoutElement[], saveToList: boolean = true) => {
    setCurrentProject(project);
    setCurrentLayout(layout);
    
    // Sauvegarder dans localStorage pour le projet actif
    setCurrentProjectInStorage(project, layout);
    
    // Sauvegarder dans la liste des projets si demandé
    if (saveToList) {
      saveProject3D(project, layout);
    }
  };

  const clearProject = () => {
    setCurrentProject(null);
    setCurrentLayout([]);
    
    // Nettoyer localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current-project-3d');
      localStorage.removeItem('current-layout-3d');
    }
  };

  const loadProject = (savedProject: SavedProject3D) => {
    setCurrentProject(savedProject.project);
    setCurrentLayout(savedProject.layout);
    
    // Sauvegarder dans localStorage pour le projet actif
    setCurrentProjectInStorage(savedProject.project, savedProject.layout);
  };

  const hasProject = currentProject !== null && currentLayout.length > 0;

  return (
    <Project3DContext.Provider
      value={{
        currentProject,
        currentLayout,
        hasProject,
        setProject,
        clearProject,
        loadProject,
      }}
    >
      {children}
    </Project3DContext.Provider>
  );
}

export function useProject3D() {
  const context = useContext(Project3DContext);
  if (context === undefined) {
    throw new Error('useProject3D must be used within a Project3DProvider');
  }
  return context;
}

