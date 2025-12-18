/**
 * Reconnaissance de patterns architecturaux
 */

import { ArchitecturalObject, Point3D, distance3D } from './architecturalHelpers';

export interface ArchitecturalPattern {
  type: 'grid' | 'radial' | 'linear' | 'symmetrical';
  confidence: number;
  description: string;
  parameters?: any;
}

/**
 * Détecte les patterns dans un ensemble d'objets
 */
export function detectPatterns(
  objects: ArchitecturalObject[]
): ArchitecturalPattern[] {
  const patterns: ArchitecturalPattern[] = [];

  if (objects.length < 3) {
    return patterns;
  }

  // Détecter un pattern de grille
  const gridPattern = detectGridPattern(objects);
  if (gridPattern) {
    patterns.push(gridPattern);
  }

  // Détecter un pattern radial
  const radialPattern = detectRadialPattern(objects);
  if (radialPattern) {
    patterns.push(radialPattern);
  }

  // Détecter un pattern linéaire
  const linearPattern = detectLinearPattern(objects);
  if (linearPattern) {
    patterns.push(linearPattern);
  }

  // Détecter un pattern symétrique
  const symmetricalPattern = detectSymmetricalPattern(objects);
  if (symmetricalPattern) {
    patterns.push(symmetricalPattern);
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Détecte un pattern de grille
 */
function detectGridPattern(
  objects: ArchitecturalObject[]
): ArchitecturalPattern | null {
  if (objects.length < 4) return null;

  // Essayer de trouver des espacements réguliers
  const positions = objects.map(o => o.position);
  
  // Analyser les espacements en X
  const xPositions = positions.map(p => p.x).sort((a, b) => a - b);
  const xSpacings: number[] = [];
  for (let i = 1; i < xPositions.length; i++) {
    xSpacings.push(xPositions[i] - xPositions[i - 1]);
  }

  // Analyser les espacements en Z
  const zPositions = positions.map(p => p.z).sort((a, b) => a - b);
  const zSpacings: number[] = [];
  for (let i = 1; i < zPositions.length; i++) {
    zSpacings.push(zPositions[i] - zPositions[i - 1]);
  }

  // Vérifier si les espacements sont réguliers
  const xRegular = checkRegularSpacing(xSpacings);
  const zRegular = checkRegularSpacing(zSpacings);

  if (xRegular.confidence > 0.7 || zRegular.confidence > 0.7) {
    return {
      type: 'grid',
      confidence: Math.max(xRegular.confidence, zRegular.confidence),
      description: `Pattern de grille détecté (espacement: ${(xRegular.spacing || zRegular.spacing || 0).toFixed(1)}m)`,
      parameters: {
        xSpacing: xRegular.spacing,
        zSpacing: zRegular.spacing,
      },
    };
  }

  return null;
}

/**
 * Détecte un pattern radial
 */
function detectRadialPattern(
  objects: ArchitecturalObject[]
): ArchitecturalPattern | null {
  if (objects.length < 3) return null;

  // Calculer le centre potentiel
  const center: Point3D = {
    x: objects.reduce((sum, o) => sum + o.position.x, 0) / objects.length,
    y: objects.reduce((sum, o) => sum + o.position.y, 0) / objects.length,
    z: objects.reduce((sum, o) => sum + o.position.z, 0) / objects.length,
  };

  // Calculer les distances au centre
  const distances = objects.map(o => distance3D(o.position, center));
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;

  // Vérifier si les objets sont à peu près à la même distance du centre
  const variance = distances.reduce((sum, d) => {
    const diff = d - avgDistance;
    return sum + diff * diff;
  }, 0) / distances.length;

  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = avgDistance > 0 ? stdDev / avgDistance : 1;

  if (coefficientOfVariation < 0.3) {
    return {
      type: 'radial',
      confidence: 1.0 - coefficientOfVariation,
      description: `Pattern radial détecté (rayon: ${avgDistance.toFixed(1)}m)`,
      parameters: {
        center,
        radius: avgDistance,
      },
    };
  }

  return null;
}

/**
 * Détecte un pattern linéaire
 */
function detectLinearPattern(
  objects: ArchitecturalObject[]
): ArchitecturalPattern | null {
  if (objects.length < 3) return null;

  const positions = objects.map(o => o.position);

  // Essayer de trouver une ligne qui passe près de tous les points
  // Utiliser les deux points les plus éloignés comme base
  let maxDist = 0;
  let p1 = positions[0];
  let p2 = positions[1];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = distance3D(positions[i], positions[j]);
      if (dist > maxDist) {
        maxDist = dist;
        p1 = positions[i];
        p2 = positions[j];
      }
    }
  }

  // Vérifier si les autres points sont proches de cette ligne
  let totalDistance = 0;
  for (const pos of positions) {
    const dist = distanceToLine(pos, p1, p2);
    totalDistance += dist;
  }

  const avgDistance = totalDistance / positions.length;
  const maxAcceptableDistance = maxDist * 0.1; // 10% de la longueur max

  if (avgDistance < maxAcceptableDistance) {
    return {
      type: 'linear',
      confidence: 1.0 - avgDistance / maxAcceptableDistance,
      description: `Pattern linéaire détecté (longueur: ${maxDist.toFixed(1)}m)`,
      parameters: {
        start: p1,
        end: p2,
        length: maxDist,
      },
    };
  }

  return null;
}

/**
 * Détecte un pattern symétrique
 */
function detectSymmetricalPattern(
  objects: ArchitecturalObject[]
): ArchitecturalPattern | null {
  if (objects.length < 4) return null;

  // Calculer le centre de masse
  const center: Point3D = {
    x: objects.reduce((sum, o) => sum + o.position.x, 0) / objects.length,
    y: objects.reduce((sum, o) => sum + o.position.y, 0) / objects.length,
    z: objects.reduce((sum, o) => sum + o.position.z, 0) / objects.length,
  };

  // Vérifier la symétrie centrale
  let symmetricalPairs = 0;
  const used = new Set<number>();

  for (let i = 0; i < objects.length; i++) {
    if (used.has(i)) continue;

    let bestMatch = -1;
    let bestDist = Infinity;

    for (let j = i + 1; j < objects.length; j++) {
      if (used.has(j)) continue;

      // Calculer le point symétrique de i par rapport au centre
      const symmetricPoint: Point3D = {
        x: 2 * center.x - objects[i].position.x,
        y: 2 * center.y - objects[i].position.y,
        z: 2 * center.z - objects[i].position.z,
      };

      const dist = distance3D(symmetricPoint, objects[j].position);
      if (dist < bestDist && dist < 2.0) {
        bestDist = dist;
        bestMatch = j;
      }
    }

    if (bestMatch !== -1) {
      symmetricalPairs++;
      used.add(i);
      used.add(bestMatch);
    }
  }

  const symmetryRatio = (symmetricalPairs * 2) / objects.length;

  if (symmetryRatio > 0.5) {
    return {
      type: 'symmetrical',
      confidence: symmetryRatio,
      description: `Pattern symétrique détecté (${symmetricalPairs} paires)`,
      parameters: {
        center,
        pairs: symmetricalPairs,
      },
    };
  }

  return null;
}

/**
 * Vérifie si les espacements sont réguliers
 */
function checkRegularSpacing(spacings: number[]): {
  confidence: number;
  spacing?: number;
} {
  if (spacings.length < 2) {
    return { confidence: 0 };
  }

  // Arrondir les espacements à 0.5m près
  const rounded = spacings.map(s => Math.round(s * 2) / 2);
  
  // Trouver l'espacement le plus fréquent
  const counts = new Map<number, number>();
  for (const s of rounded) {
    counts.set(s, (counts.get(s) || 0) + 1);
  }

  let maxCount = 0;
  let commonSpacing = rounded[0];
  counts.forEach((count, spacing) => {
    if (count > maxCount) {
      maxCount = count;
      commonSpacing = spacing;
    }
  });

  const confidence = maxCount / rounded.length;
  
  return {
    confidence,
    spacing: confidence > 0.5 ? commonSpacing : undefined,
  };
}

/**
 * Calcule la distance d'un point à une ligne
 */
function distanceToLine(
  point: Point3D,
  lineStart: Point3D,
  lineEnd: Point3D
): number {
  const lineVec = {
    x: lineEnd.x - lineStart.x,
    y: lineEnd.y - lineStart.y,
    z: lineEnd.z - lineStart.z,
  };

  const pointVec = {
    x: point.x - lineStart.x,
    y: point.y - lineStart.y,
    z: point.z - lineStart.z,
  };

  const lineLengthSq = lineVec.x * lineVec.x + lineVec.y * lineVec.y + lineVec.z * lineVec.z;

  if (lineLengthSq < 0.0001) {
    return distance3D(point, lineStart);
  }

  const t = Math.max(0, Math.min(1,
    (pointVec.x * lineVec.x + pointVec.y * lineVec.y + pointVec.z * lineVec.z) / lineLengthSq
  ));

  const closestPoint = {
    x: lineStart.x + t * lineVec.x,
    y: lineStart.y + t * lineVec.y,
    z: lineStart.z + t * lineVec.z,
  };

  return distance3D(point, closestPoint);
}


















