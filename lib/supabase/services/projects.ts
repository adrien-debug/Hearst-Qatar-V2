/**
 * Service Supabase pour la gestion des projets
 * CRUD operations pour les projets 3D
 */

import { supabase } from '../client';
import { ProjectConfiguration } from '../../projectGenerator';

export interface DeploymentRow {
  id: string;
  name: string;
  user_id: string;
  config: ProjectConfiguration;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Sauvegarder un projet dans Supabase
 */
export async function saveProject(
  project: ProjectConfiguration,
  userId: string
): Promise<{ data: DeploymentRow | null; error: Error | null }> {
  try {
    // Vérifier si le projet existe déjà
    const { data: existing } = await supabase
      .from('deployments')
      .select('id')
      .eq('id', project.id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Mettre à jour le projet existant
      const { data, error } = await supabase
        .from('deployments')
        .update({
          name: project.name,
          config: project as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        return { data: null, error: new Error(error.message) };
      }

      console.log('✅ Projet mis à jour:', project.name);
      return { data, error: null };
    } else {
      // Créer un nouveau projet
      const { data, error } = await supabase
        .from('deployments')
        .insert({
          id: project.id,
          name: project.name,
          user_id: userId,
          config: project as any,
          is_default: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la sauvegarde du projet:', error);
        return { data: null, error: new Error(error.message) };
      }

      console.log('✅ Projet sauvegardé:', project.name);
      return { data, error: null };
    }
  } catch (error) {
    console.error('Erreur inattendue lors de la sauvegarde:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Charger tous les projets d'un utilisateur
 */
export async function loadProjects(
  userId: string
): Promise<{ data: DeploymentRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des projets:', error);
      return { data: null, error: new Error(error.message) };
    }

    console.log(`✅ ${data?.length || 0} projets chargés`);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur inattendue lors du chargement:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Charger un projet spécifique
 */
export async function loadProject(
  projectId: string,
  userId: string
): Promise<{ data: DeploymentRow | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erreur lors du chargement du projet:', error);
      return { data: null, error: new Error(error.message) };
    }

    console.log('✅ Projet chargé:', data.name);
    return { data, error: null };
  } catch (error) {
    console.error('Erreur inattendue lors du chargement:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Supprimer un projet
 */
export async function deleteProject(
  projectId: string,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('deployments')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      return { error: new Error(error.message) };
    }

    console.log('✅ Projet supprimé');
    return { error: null };
  } catch (error) {
    console.error('Erreur inattendue lors de la suppression:', error);
    return { error: error as Error };
  }
}

/**
 * Mettre à jour un projet
 */
export async function updateProject(
  projectId: string,
  userId: string,
  updates: Partial<ProjectConfiguration>
): Promise<{ data: DeploymentRow | null; error: Error | null }> {
  try {
    // Charger le projet actuel
    const { data: current, error: loadError } = await loadProject(projectId, userId);
    
    if (loadError || !current) {
      return { data: null, error: loadError || new Error('Projet non trouvé') };
    }

    // Fusionner les mises à jour
    const updatedConfig = {
      ...current.config,
      ...updates,
    };

    // Sauvegarder
    const { data, error } = await supabase
      .from('deployments')
      .update({
        config: updatedConfig as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      return { data: null, error: new Error(error.message) };
    }

    console.log('✅ Projet mis à jour');
    return { data, error: null };
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Dupliquer un projet
 */
export async function duplicateProject(
  projectId: string,
  userId: string,
  newName?: string
): Promise<{ data: DeploymentRow | null; error: Error | null }> {
  try {
    // Charger le projet à dupliquer
    const { data: original, error: loadError } = await loadProject(projectId, userId);
    
    if (loadError || !original) {
      return { data: null, error: loadError || new Error('Projet non trouvé') };
    }

    // Créer une copie avec un nouvel ID
    const duplicatedConfig: ProjectConfiguration = {
      ...original.config,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newName || `${original.config.name} (Copie)`,
      metadata: {
        ...original.config.metadata,
        createdAt: new Date().toISOString(),
      },
    };

    // Sauvegarder la copie
    return await saveProject(duplicatedConfig, userId);
  } catch (error) {
    console.error('Erreur inattendue lors de la duplication:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Migrer les projets de localStorage vers Supabase
 */
export async function migrateLocalProjects(userId: string): Promise<{ count: number; error: Error | null }> {
  try {
    if (typeof window === 'undefined') {
      return { count: 0, error: null };
    }

    const localProjects = localStorage.getItem('hearst_qatar_projects');
    if (!localProjects) {
      console.log('Aucun projet local à migrer');
      return { count: 0, error: null };
    }

    const projects: ProjectConfiguration[] = JSON.parse(localProjects);
    let migratedCount = 0;

    for (const project of projects) {
      const { error } = await saveProject(project, userId);
      if (!error) {
        migratedCount++;
      }
    }

    // Supprimer les projets locaux après migration réussie
    if (migratedCount > 0) {
      localStorage.removeItem('hearst_qatar_projects');
      localStorage.removeItem('hearst_qatar_active_project');
      console.log(`✅ ${migratedCount} projets migrés vers Supabase`);
    }

    return { count: migratedCount, error: null };
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    return { count: 0, error: error as Error };
  }
}















