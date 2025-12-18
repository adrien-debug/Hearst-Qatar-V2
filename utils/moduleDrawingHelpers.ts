import * as THREE from 'three';
import { HD5_DIMENSIONS } from '../components/3d/HD5Container';

export interface ModulePlacement {
  id: string;
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Détecte les collisions entre modules
 */
export function detectCollisions(
  newPosition: [number, number, number],
  existingModules: ModulePlacement[],
  moduleSize: { length: number; width: number; height: number } = HD5_DIMENSIONS
): boolean {
  const margin = 0.5; // Marge de sécurité en mètres

  for (const module of existingModules) {
    const distance = Math.sqrt(
      Math.pow(newPosition[0] - module.position[0], 2) +
      Math.pow(newPosition[2] - module.position[2], 2)
    );

    const minDistance = (moduleSize.length + moduleSize.width) / 2 + margin;

    if (distance < minDistance) {
      return true; // Collision détectée
    }
  }

  return false;
}

/**
 * Aligne une position sur une grille
 */
export function snapToGrid(
  position: [number, number, number],
  gridSize: number = 1.0
): [number, number, number] {
  return [
    Math.round(position[0] / gridSize) * gridSize,
    position[1], // Y reste inchangé
    Math.round(position[2] / gridSize) * gridSize,
  ];
}

/**
 * Snapping intelligent vers les positions proches
 */
export function smartSnap(
  position: [number, number, number],
  existingModules: ModulePlacement[],
  snapDistance: number = 2.0
): [number, number, number] {
  let snappedPosition: [number, number, number] = [...position];
  let minDistance = snapDistance;

  for (const module of existingModules) {
    const distance = Math.sqrt(
      Math.pow(position[0] - module.position[0], 2) +
      Math.pow(position[2] - module.position[2], 2)
    );

    if (distance < minDistance && distance > 0) {
      // Aligner sur l'axe X ou Z le plus proche
      const dx = Math.abs(position[0] - module.position[0]);
      const dz = Math.abs(position[2] - module.position[2]);

      if (dx < dz) {
        snappedPosition[0] = module.position[0];
      } else {
        snappedPosition[2] = module.position[2];
      }
      minDistance = distance;
    }
  }

  return snappedPosition;
}

/**
 * Valide un placement de module
 */
export function validatePlacement(
  position: [number, number, number],
  existingModules: ModulePlacement[],
  bounds?: { min: [number, number, number]; max: [number, number, number] }
): { valid: boolean; reason?: string } {
  // Vérifier les limites
  if (bounds) {
    if (
      position[0] < bounds.min[0] || position[0] > bounds.max[0] ||
      position[2] < bounds.min[2] || position[2] > bounds.max[2]
    ) {
      return { valid: false, reason: 'Hors limites' };
    }
  }

  // Vérifier les collisions
  if (detectCollisions(position, existingModules)) {
    return { valid: false, reason: 'Collision détectée' };
  }

  return { valid: true };
}

/**
 * Génère un pattern de modules
 */
export function generatePattern(
  patternType: 'grid' | 'line' | 'circle',
  center: [number, number, number],
  params: {
    count?: number;
    spacing?: number;
    rows?: number;
    columns?: number;
    radius?: number;
    angle?: number;
  }
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const spacing = params.spacing || HD5_DIMENSIONS.width + 1;

  switch (patternType) {
    case 'grid': {
      const rows = params.rows || 2;
      const columns = params.columns || 2;
      const startX = center[0] - ((columns - 1) * spacing) / 2;
      const startZ = center[2] - ((rows - 1) * spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          positions.push([
            startX + col * spacing,
            center[1],
            startZ + row * spacing,
          ]);
        }
      }
      break;
    }

    case 'line': {
      const count = params.count || 5;
      const angle = params.angle || 0;
      const startX = center[0] - ((count - 1) * spacing * Math.cos(angle)) / 2;
      const startZ = center[2] - ((count - 1) * spacing * Math.sin(angle)) / 2;

      for (let i = 0; i < count; i++) {
        positions.push([
          startX + i * spacing * Math.cos(angle),
          center[1],
          startZ + i * spacing * Math.sin(angle),
        ]);
      }
      break;
    }

    case 'circle':
      const radius = params.radius || 10;
      const circleCount = params.count || 8;

      for (let i = 0; i < circleCount; i++) {
        const angle = (i / circleCount) * Math.PI * 2;
        positions.push([
          center[0] + radius * Math.cos(angle),
          center[1],
          center[2] + radius * Math.sin(angle),
        ]);
      }
      break;
  }

  return positions;
}

/**
 * Calcule la distance entre deux points
 */
export function calculateDistance(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
    Math.pow(pos1[1] - pos2[1], 2) +
    Math.pow(pos1[2] - pos2[2], 2)
  );
}

