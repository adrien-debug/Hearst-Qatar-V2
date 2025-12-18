/**
 * Calculateur de Layout Mining - Validation et Calculs
 * =====================================================
 * 
 * Calcule les espacements, valide les chevauchements, et vérifie les distances de sécurité
 */

import { EquipmentPosition } from '../lib/mining100MWGenerator';

/**
 * Dimensions des équipements (en mètres)
 * Mises à jour pour correspondre aux modèles 3D réels (notamment HD5 élargi)
 */
const DIMENSIONS = {
  powerBlock: { length: 4.0, width: 2.5, height: 2.4 },
  transformer: { length: 3.5, width: 2.5, height: 3.0 },
  container: { length: 12.196, width: 3.5, height: 2.896 },
  substation: { length: 15.0, width: 10.0, height: 5.0 },
  foundation: { length: 0, width: 0, height: 0 }, // Dimensions variables, lues depuis l'objet
  'cable-path': { length: 0, width: 0, height: 0 }, // Pas de dimension physique pour validation
};

/**
 * Distances de sécurité minimum (en mètres)
 */
const SAFETY_DISTANCES = {
  powerBlockToPowerBlock: 25, 
  transformerToTransformer: 5,
  containerToContainer: 1,
  transformerToContainer: 1,
  electricalSafety: 2,
  substationSafety: 10,
};

/**
 * Calcule la distance entre deux points 3D
 */
function calculateDistance(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Récupère les dimensions effectives (largeur/longueur sur X/Z) après rotation
 */
function getEffectiveDimensions(equipment: EquipmentPosition) {
  // Pour la foundation et substation, on utilise les dimensions stockées dans l'objet s'il y en a
  if (equipment.dimensions) {
     const dim = equipment.dimensions;
     const rot = Math.abs(equipment.rotation[1] % Math.PI);
     const isRotated90 = rot > Math.PI / 4 && rot < 3 * Math.PI / 4;
     if (isRotated90) {
       return { sizeX: dim.width, sizeZ: dim.length };
     }
     return { sizeX: dim.length, sizeZ: dim.width };
  }

  // Pour les autres types standards
  // @ts-ignore - On sait que le type existe dans DIMENSIONS ou on fallback
  const dim = DIMENSIONS[equipment.type] || { length: 0, width: 0 };
  
  const rot = Math.abs(equipment.rotation[1] % Math.PI);
  const isRotated90 = rot > Math.PI / 4 && rot < 3 * Math.PI / 4;
  
  if (isRotated90) {
    return { sizeX: dim.width, sizeZ: dim.length };
  }
  
  return { sizeX: dim.length, sizeZ: dim.width };
}

/**
 * Vérifie si deux équipements se chevauchent en utilisant des boîtes englobantes (AABB)
 */
function checkOverlap(
  eq1: EquipmentPosition,
  eq2: EquipmentPosition
): { overlaps: boolean; distance: number; details: string } {
  // Ignorer les câbles et fondations pour le chevauchement (les fondations chevauchent par nature ce qui est dessus)
  if (eq1.type === 'cable-path' || eq2.type === 'cable-path' || 
      eq1.type === 'foundation' || eq2.type === 'foundation') {
    return { overlaps: false, distance: 0, details: '' };
  }

  // 1. Calculer la distance simple (centre à centre)
  const distance = calculateDistance(eq1.position, eq2.position);
  
  // 2. Vérification précise avec AABB (Axis-Aligned Bounding Box)
  const dim1 = getEffectiveDimensions(eq1);
  const dim2 = getEffectiveDimensions(eq2);
  
  const margin = 0.1;
  
  const r1x = dim1.sizeX / 2 - margin;
  const r1z = dim1.sizeZ / 2 - margin;
  const r2x = dim2.sizeX / 2 - margin;
  const r2z = dim2.sizeZ / 2 - margin;
  
  const minX1 = eq1.position[0] - r1x;
  const maxX1 = eq1.position[0] + r1x;
  const minZ1 = eq1.position[2] - r1z;
  const maxZ1 = eq1.position[2] + r1z;
  
  const minX2 = eq2.position[0] - r2x;
  const maxX2 = eq2.position[0] + r2x;
  const minZ2 = eq2.position[2] - r2z;
  const maxZ2 = eq2.position[2] + r2z;
  
  const overlapX = maxX1 > minX2 && minX1 < maxX2;
  const overlapZ = maxZ1 > minZ2 && minZ1 < maxZ2;
  
  const overlaps = overlapX && overlapZ;
  
  const details = overlaps 
    ? `Overlap: X[${minX1.toFixed(1)}..${maxX1.toFixed(1)} vs ${minX2.toFixed(1)}..${maxX2.toFixed(1)}] Z[${minZ1.toFixed(1)}..${maxZ1.toFixed(1)} vs ${minZ2.toFixed(1)}..${maxZ2.toFixed(1)}]`
    : '';
  
  return { overlaps, distance, details };
}

/**
 * Vérifie les distances de sécurité entre équipements
 */
function checkSafetyDistance(
  eq1: EquipmentPosition,
  eq2: EquipmentPosition
): { safe: boolean; distance: number; required: number } {
  // Ignorer câbles et fondations
  if (eq1.type === 'cable-path' || eq2.type === 'cable-path' || 
      eq1.type === 'foundation' || eq2.type === 'foundation') {
    return { safe: true, distance: 0, required: 0 };
  }

  const distCenter = calculateDistance(eq1.position, eq2.position);
  
  const dim1 = getEffectiveDimensions(eq1);
  const dim2 = getEffectiveDimensions(eq2);
  
  const r1 = (dim1.sizeX + dim1.sizeZ) / 4;
  const r2 = (dim2.sizeX + dim2.sizeZ) / 4;
  
  let required = 0;
  
  if (eq1.type === 'power-block' && eq2.type === 'power-block') {
    required = SAFETY_DISTANCES.powerBlockToPowerBlock;
  } else if (eq1.type === 'transformer' && eq2.type === 'transformer') {
    required = SAFETY_DISTANCES.transformerToTransformer;
  } else if (eq1.type === 'container' && eq2.type === 'container') {
    required = SAFETY_DISTANCES.containerToContainer;
  } else if (
    (eq1.type === 'transformer' && eq2.type === 'container') ||
    (eq1.type === 'container' && eq2.type === 'transformer')
  ) {
    required = SAFETY_DISTANCES.transformerToContainer;
  } else if (eq1.type === 'substation' || eq2.type === 'substation') {
    required = SAFETY_DISTANCES.substationSafety;
  } else {
    required = SAFETY_DISTANCES.electricalSafety;
  }
  
  const requiredCenterDist = required + r1 + r2;
  
  return { safe: distCenter >= requiredCenterDist, distance: distCenter, required: requiredCenterDist };
}

/**
 * Valide un layout complet
 */
export interface LayoutValidation {
  valid: boolean;
  errors: Array<{
    type: 'overlap' | 'safety-distance' | 'boundary';
    equipment1: string;
    equipment2: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    type: 'spacing' | 'optimization';
    message: string;
  }>;
  statistics: {
    totalEquipment: number;
    totalArea: number; // en m²
    powerBlocks: number;
    transformers: number;
    containers: number;
  };
}

export function validateLayout(equipment: EquipmentPosition[]): LayoutValidation {
  const errors: LayoutValidation['errors'] = [];
  const warnings: LayoutValidation['warnings'] = [];
  
  const stats = {
    powerBlocks: equipment.filter(eq => eq.type === 'power-block').length,
    transformers: equipment.filter(eq => eq.type === 'transformer').length,
    containers: equipment.filter(eq => eq.type === 'container').length,
  };
  
  // Vérifier chaque paire d'équipements
  for (let i = 0; i < equipment.length; i++) {
    // Ignorer les éléments non physiques ou purement décoratifs pour la validation
    if (equipment[i].type === 'cable-path' || equipment[i].type === 'foundation') continue;

    for (let j = i + 1; j < equipment.length; j++) {
      if (equipment[j].type === 'cable-path' || equipment[j].type === 'foundation') continue;

      const eq1 = equipment[i];
      const eq2 = equipment[j];
      
      if (Math.abs(eq1.position[0] - eq2.position[0]) > 60 || Math.abs(eq1.position[2] - eq2.position[2]) > 60) {
        continue;
      }
      
      const overlap = checkOverlap(eq1, eq2);
      if (overlap.overlaps) {
        errors.push({
          type: 'overlap',
          equipment1: eq1.id,
          equipment2: eq2.id,
          message: `${eq1.id} et ${eq2.id} se chevauchent (dist: ${overlap.distance.toFixed(2)}m) - ${overlap.details}`,
          severity: 'error',
        });
      }
      else {
        const safety = checkSafetyDistance(eq1, eq2);
        if (!safety.safe) {
          if (safety.distance < safety.required * 0.5) {
             warnings.push({
               type: 'spacing',
               message: `${eq1.id} et ${eq2.id} sont très proches (${safety.distance.toFixed(2)}m < ${safety.required.toFixed(2)}m)`
             });
          }
        }
      }
    }
  }
  
  const positions = equipment.map(eq => eq.position);
  if (positions.length > 0) {
    const minX = Math.min(...positions.map(p => p[0]));
    const maxX = Math.max(...positions.map(p => p[0]));
    const minZ = Math.min(...positions.map(p => p[2]));
    const maxZ = Math.max(...positions.map(p => p[2]));
    const totalArea = (maxX - minX) * (maxZ - minZ);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      statistics: {
        totalEquipment: equipment.length,
        totalArea: Math.round(totalArea),
        ...stats,
      },
    };
  }
  
  return {
    valid: true,
    errors: [],
    warnings: [],
    statistics: {
      totalEquipment: 0,
      totalArea: 0,
      ...stats,
    },
  };
}

export function calculateOptimalSpacing(
  type1: EquipmentPosition['type'],
  type2: EquipmentPosition['type']
): number {
  if (type1 === 'power-block' && type2 === 'power-block') {
    return SAFETY_DISTANCES.powerBlockToPowerBlock;
  } else if (type1 === 'transformer' && type2 === 'transformer') {
    return SAFETY_DISTANCES.transformerToTransformer;
  } else if (type1 === 'container' && type2 === 'container') {
    return SAFETY_DISTANCES.containerToContainer;
  } else if (
    (type1 === 'transformer' && type2 === 'container') ||
    (type1 === 'container' && type2 === 'transformer')
  ) {
    return SAFETY_DISTANCES.transformerToContainer;
  }
  return SAFETY_DISTANCES.electricalSafety;
}
