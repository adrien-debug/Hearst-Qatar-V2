import { ProjectConfig } from '../components/NewProjectModal';
import { LayoutElement } from './layoutGenerator';

export interface SavedProject3D {
  id: string;
  name: string;
  project: ProjectConfig;
  layout: LayoutElement[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'hearst_qatar_saved_projects_3d';
const CURRENT_PROJECT_KEY = 'current-project-3d';
const CURRENT_LAYOUT_KEY = 'current-layout-3d';

/**
 * Récupère tous les projets 3D sauvegardés
 */
export function getSavedProjects3D(): SavedProject3D[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erreur lors de la lecture des projets 3D:', e);
  }
  
  return [];
}

/**
 * Sauvegarde tous les projets 3D
 */
function saveProjects3D(projects: SavedProject3D[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des projets 3D:', e);
  }
}

/**
 * Sauvegarde un nouveau projet 3D
 */
export function saveProject3D(
  project: ProjectConfig,
  layout: LayoutElement[],
  name?: string
): SavedProject3D {
  const projects = getSavedProjects3D();
  const now = new Date().toISOString();
  
  const savedProject: SavedProject3D = {
    id: `project_3d_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || project.project_name || `Projet ${projects.length + 1}`,
    project,
    layout,
    createdAt: now,
    updatedAt: now,
  };
  
  projects.push(savedProject);
  saveProjects3D(projects);
  
  return savedProject;
}

/**
 * Met à jour un projet 3D existant
 */
export function updateProject3D(
  id: string,
  updates: Partial<SavedProject3D>
): boolean {
  const projects = getSavedProjects3D();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) {
    return false;
  }
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveProjects3D(projects);
  return true;
}

/**
 * Supprime un projet 3D
 */
export function deleteProject3D(id: string): boolean {
  const projects = getSavedProjects3D();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) {
    return false;
  }
  
  saveProjects3D(filtered);
  return true;
}

/**
 * Récupère un projet 3D par son ID
 */
export function getProject3DById(id: string): SavedProject3D | null {
  const projects = getSavedProjects3D();
  return projects.find(p => p.id === id) || null;
}

/**
 * Récupère le projet actif depuis localStorage
 */
export function getCurrentProject(): { project: ProjectConfig; layout: LayoutElement[] } | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const projectStr = localStorage.getItem(CURRENT_PROJECT_KEY);
    const layoutStr = localStorage.getItem(CURRENT_LAYOUT_KEY);
    
    if (projectStr && layoutStr) {
      return {
        project: JSON.parse(projectStr),
        layout: JSON.parse(layoutStr),
      };
    }
  } catch (e) {
    console.error('Erreur lors de la lecture du projet actif:', e);
  }
  
  return null;
}

/**
 * Sauvegarde le projet actif dans localStorage
 */
export function setCurrentProject(project: ProjectConfig, layout: LayoutElement[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
    localStorage.setItem(CURRENT_LAYOUT_KEY, JSON.stringify(layout));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde du projet actif:', e);
  }
}

