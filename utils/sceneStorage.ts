import type { PlacedObject } from '../components/3d/SceneEditor';

const STORAGE_KEY = 'spline_scene_placed_objects';

export function savePlacedObjects(objects: PlacedObject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des objets:', e);
  }
}

export function loadPlacedObjects(): PlacedObject[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erreur lors du chargement des objets:', e);
  }
  return [];
}

export function clearPlacedObjects(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Erreur lors de la suppression des objets:', e);
  }
}



















