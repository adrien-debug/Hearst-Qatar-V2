/**
 * Utilitaires de sauvegarde et chargement de la scène 3D
 * Gestion du versioning et des migrations de données
 */

import type { ContainerScene, Container3D, Transformer3D, Road3D } from '../types/container3d';

const STORAGE_KEY = 'container_3d_scene';
const CURRENT_VERSION = '1.0.0';

/**
 * Sauvegarder la scène complète dans localStorage
 */
export function saveScene(
  containers: Container3D[],
  transformers: Transformer3D[],
  roads: Road3D[],
  metadata?: { name?: string; description?: string }
): void {
  try {
    const scene: ContainerScene = {
      version: CURRENT_VERSION,
      containers,
      transformers,
      roads,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...metadata,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scene));
    console.log('✅ Scène sauvegardée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de la scène:', error);
    throw new Error('Impossible de sauvegarder la scène');
  }
}

/**
 * Charger la scène depuis localStorage
 */
export function loadScene(): ContainerScene | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const scene = JSON.parse(stored) as ContainerScene;

    // Vérifier et migrer si nécessaire
    if (scene.version !== CURRENT_VERSION) {
      console.warn(`⚠️ Version de scène différente (${scene.version} vs ${CURRENT_VERSION}), migration...`);
      return migrateScene(scene);
    }

    return scene;
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la scène:', error);
    return null;
  }
}

/**
 * Migrer une scène vers la version actuelle
 */
function migrateScene(scene: ContainerScene): ContainerScene {
  // Pour l'instant, on retourne simplement la scène avec la nouvelle version
  // Ajoutez ici les migrations nécessaires selon les versions
  return {
    ...scene,
    version: CURRENT_VERSION,
    metadata: {
      ...scene.metadata,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Exporter la scène en JSON (pour sauvegarde externe)
 */
export function exportScene(
  containers: Container3D[],
  transformers: Transformer3D[],
  roads: Road3D[]
): string {
  const scene: ContainerScene = {
    version: CURRENT_VERSION,
    containers,
    transformers,
    roads,
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };

  return JSON.stringify(scene, null, 2);
}

/**
 * Importer une scène depuis un JSON
 */
export function importScene(json: string): ContainerScene | null {
  try {
    const scene = JSON.parse(json) as ContainerScene;

    // Vérifier la structure
    if (!scene.containers || !scene.transformers || !scene.roads) {
      throw new Error('Format de scène invalide');
    }

    // Migrer si nécessaire
    if (scene.version !== CURRENT_VERSION) {
      return migrateScene(scene);
    }

    return scene;
  } catch (error) {
    console.error('❌ Erreur lors de l\'import de la scène:', error);
    return null;
  }
}

/**
 * Supprimer la scène sauvegardée
 */
export function clearScene(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Scène supprimée');
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la scène:', error);
  }
}

/**
 * Vérifier si une scène existe
 */
export function hasSavedScene(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
















