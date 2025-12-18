import { LayoutElement } from './layoutGenerator';
import { ModulePlacement } from './moduleDrawingHelpers';

/**
 * Convertit un LayoutElement en ModulePlacement pour la scène 3D
 */
export function convertLayoutToModules(layout: LayoutElement[]): ModulePlacement[] {
  const modules: ModulePlacement[] = [];
  
  for (const element of layout) {
    // Convertir les coordonnées 2D (x, y) en coordonnées 3D
    // Dans Three.js, Y est la hauteur verticale, X et Z sont le plan horizontal
    // On centre le layout autour de (0, 0, 0)
    const position: [number, number, number] = [
      element.x,
      (element.z || 0) + (element.height || 0) / 2, // Y = hauteur + demi-hauteur de l'objet
      -element.y, // Inverser Y pour correspondre au système de coordonnées 3D
    ];
    
    const rotation: [number, number, number] = [
      0, // Rotation X
      (element.rotation * Math.PI) / 180, // Rotation Y (en radians)
      0, // Rotation Z
    ];
    
    // Déterminer le type de module selon le type d'élément
    // ModulePlacement.type est un string, donc on garde la compatibilité
    let moduleType = 'HD5';
    if (element.type === 'Transformateur') {
      moduleType = 'Transformer';
    } else if (element.type === 'PowerBlock') {
      moduleType = 'PowerBlock';
    }
    
    // Ne créer des modules que pour les équipements (pas les routes/gazon)
    if (element.type === 'Container' || element.type === 'Transformateur' || element.type === 'PowerBlock') {
      const module: ModulePlacement = {
        id: element.id,
        type: moduleType,
        position,
        rotation,
      };
      modules.push(module);
    }
  }
  
  return modules;
}

/**
 * Applique un layout à la scène 3D en créant les modules correspondants
 */
export function applyLayoutToScene(
  layout: LayoutElement[],
  existingModules: ModulePlacement[]
): ModulePlacement[] {
  // Convertir le layout en modules
  const newModules = convertLayoutToModules(layout);
  
  // Fusionner avec les modules existants (ou remplacer)
  // Ici on remplace complètement pour éviter les doublons
  return newModules;
}

