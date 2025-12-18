/**
 * Moteur d'analyse intelligente pour l'architecture
 */

import { ArchitecturalObject, Point3D, distance3D } from './architecturalHelpers';

export interface ContextualAnalysis {
  nearbyObjects: ArchitecturalObject[];
  suggestedLength?: number;
  suggestedWidth?: number;
  suggestedAxis?: { direction: Point3D; position: Point3D };
  alignmentSuggestions: AlignmentSuggestion[];
  symmetrySuggestions: SymmetrySuggestion[];
}

export interface AlignmentSuggestion {
  type: 'parallel' | 'perpendicular' | 'collinear';
  targetObjectId: string;
  confidence: number;
  adjustment?: Point3D;
}

export interface SymmetrySuggestion {
  type: 'axial' | 'central';
  axis?: { start: Point3D; end: Point3D };
  center?: Point3D;
  confidence: number;
}

export interface DimensionSuggestion {
  length?: number;
  width?: number;
  height?: number;
  reason: string;
  confidence: number;
}

/**
 * Analyse le contexte autour d'un point
 */
export function analyzeContext(
  point: Point3D,
  allObjects: ArchitecturalObject[],
  searchRadius: number = 10.0
): ContextualAnalysis {
  // Trouver les objets proches
  const nearbyObjects = allObjects.filter(obj => {
    const dist = distance3D(point, obj.position);
    return dist <= searchRadius;
  });

  // Analyser les dimensions existantes
  const lengths = nearbyObjects
    .filter(obj => obj.dimensions?.length)
    .map(obj => obj.dimensions!.length!)
    .filter(l => l > 0);

  const widths = nearbyObjects
    .filter(obj => obj.dimensions?.width)
    .map(obj => obj.dimensions!.width!)
    .filter(w => w > 0);

  // Suggestions de dimensions basées sur les moyennes
  const suggestedLength = lengths.length > 0
    ? calculateSuggestedDimension(lengths)
    : undefined;

  const suggestedWidth = widths.length > 0
    ? calculateSuggestedDimension(widths)
    : undefined;

  // Détecter les axes principaux
  const suggestedAxis = detectMainAxis(nearbyObjects, point);

  // Suggestions d'alignement
  const alignmentSuggestions = detectAlignmentOpportunities(
    point,
    nearbyObjects
  );

  // Suggestions de symétrie
  const symmetrySuggestions = detectSymmetryOpportunities(
    point,
    nearbyObjects
  );

  return {
    nearbyObjects,
    suggestedLength,
    suggestedWidth,
    suggestedAxis,
    alignmentSuggestions,
    symmetrySuggestions,
  };
}

/**
 * Calcule une dimension suggérée basée sur les valeurs existantes
 */
function calculateSuggestedDimension(values: number[]): number {
  if (values.length === 0) return 0;

  // Utiliser le mode (valeur la plus fréquente) ou la moyenne
  const sorted = [...values].sort((a, b) => a - b);
  const rounded = sorted.map(v => Math.round(v * 10) / 10);
  
  // Trouver le mode
  let maxCount = 0;
  let mode = rounded[0];
  let current = rounded[0];
  let count = 1;

  for (let i = 1; i < rounded.length; i++) {
    if (rounded[i] === current) {
      count++;
    } else {
      if (count > maxCount) {
        maxCount = count;
        mode = current;
      }
      current = rounded[i];
      count = 1;
    }
  }

  if (count > maxCount) {
    mode = current;
  }

  // Si le mode est significatif, l'utiliser, sinon utiliser la moyenne
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  
  return maxCount >= 2 ? mode : Math.round(avg * 10) / 10;
}

/**
 * Détecte l'axe principal basé sur les objets existants
 */
function detectMainAxis(
  objects: ArchitecturalObject[],
  referencePoint: Point3D
): { direction: Point3D; position: Point3D } | undefined {
  if (objects.length < 2) return undefined;

  // Analyser les orientations des objets
  const orientations: number[] = [];
  
  for (const obj of objects) {
    if (obj.rotation !== undefined) {
      orientations.push(obj.rotation);
    }
  }

  if (orientations.length < 2) return undefined;

  // Trouver l'orientation dominante
  const normalized = orientations.map(o => {
    // Normaliser à 0-180 degrés
    let normalized = (o * 180 / Math.PI) % 180;
    if (normalized < 0) normalized += 180;
    return normalized;
  });

  // Grouper par orientation similaire (tolérance 10 degrés)
  const groups: number[][] = [];
  for (const angle of normalized) {
    let found = false;
    for (const group of groups) {
      if (group.some(a => Math.abs(a - angle) < 10)) {
        group.push(angle);
        found = true;
        break;
      }
    }
    if (!found) {
      groups.push([angle]);
    }
  }

  // Prendre le groupe le plus grand
  const mainGroup = groups.reduce((a, b) => a.length > b.length ? a : b);
  const avgAngle = mainGroup.reduce((a, b) => a + b, 0) / mainGroup.length;
  const angleRad = (avgAngle * Math.PI) / 180;

  return {
    direction: {
      x: Math.cos(angleRad),
      y: 0,
      z: Math.sin(angleRad),
    },
    position: referencePoint,
  };
}

/**
 * Détecte les opportunités d'alignement
 */
function detectAlignmentOpportunities(
  point: Point3D,
  objects: ArchitecturalObject[]
): AlignmentSuggestion[] {
  const suggestions: AlignmentSuggestion[] = [];

  for (const obj of objects) {
    if (obj.type === 'wall' || obj.type === 'line') {
      // Vérifier l'alignement parallèle
      const dist = distance3D(point, obj.position);
      if (dist < 5.0) {
        suggestions.push({
          type: 'parallel',
          targetObjectId: obj.id,
          confidence: 1.0 - dist / 5.0,
          adjustment: obj.position,
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Détecte les opportunités de symétrie
 */
function detectSymmetryOpportunities(
  point: Point3D,
  objects: ArchitecturalObject[]
): SymmetrySuggestion[] {
  const suggestions: SymmetrySuggestion[] = [];

  if (objects.length < 2) return suggestions;

  // Calculer le centre de masse des objets existants
  const center: Point3D = {
    x: objects.reduce((sum, o) => sum + o.position.x, 0) / objects.length,
    y: objects.reduce((sum, o) => sum + o.position.y, 0) / objects.length,
    z: objects.reduce((sum, o) => sum + o.position.z, 0) / objects.length,
  };

  // Vérifier la symétrie centrale
  const distToCenter = distance3D(point, center);
  if (distToCenter < 10.0) {
    suggestions.push({
      type: 'central',
      center,
      confidence: 1.0 - distToCenter / 10.0,
    });
  }

  // Vérifier la symétrie axiale (simplifié)
  if (objects.length >= 2) {
    const firstObj = objects[0];
    const secondObj = objects[1];
    
    const midPoint: Point3D = {
      x: (firstObj.position.x + secondObj.position.x) / 2,
      y: (firstObj.position.y + secondObj.position.y) / 2,
      z: (firstObj.position.z + secondObj.position.z) / 2,
    };

    const distToAxis = distance3D(point, midPoint);
    if (distToAxis < 5.0) {
      suggestions.push({
        type: 'axial',
        axis: {
          start: firstObj.position,
          end: secondObj.position,
        },
        confidence: 1.0 - distToAxis / 5.0,
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Génère des suggestions de dimensions intelligentes
 */
export function generateDimensionSuggestions(
  context: ContextualAnalysis,
  type: 'wall' | 'line' | 'portal'
): DimensionSuggestion[] {
  const suggestions: DimensionSuggestion[] = [];

  // Suggestion basée sur les dimensions existantes
  if (context.suggestedLength) {
    suggestions.push({
      length: context.suggestedLength,
      reason: `Basé sur la longueur moyenne des objets proches (${context.suggestedLength.toFixed(1)}m)`,
      confidence: 0.8,
    });
  }

  if (context.suggestedWidth) {
    suggestions.push({
      width: context.suggestedWidth,
      reason: `Basé sur la largeur moyenne des objets proches (${context.suggestedWidth.toFixed(1)}m)`,
      confidence: 0.8,
    });
  }

  // Suggestions basées sur des standards architecturaux
  if (type === 'wall') {
    suggestions.push({
      length: 10,
      reason: 'Longueur standard pour un mur (10m)',
      confidence: 0.6,
    });
    suggestions.push({
      height: 3,
      reason: 'Hauteur standard pour un mur (3m)',
      confidence: 0.6,
    });
  } else if (type === 'portal') {
    suggestions.push({
      width: 3,
      reason: 'Largeur standard pour un portail (3m)',
      confidence: 0.7,
    });
    suggestions.push({
      height: 4,
      reason: 'Hauteur standard pour un portail (4m)',
      confidence: 0.7,
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}


















