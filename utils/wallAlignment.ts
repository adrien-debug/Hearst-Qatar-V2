/**
 * Utilitaires pour aligner et ajuster les murs selon les parallèles, symétries, marges et espacements
 */

export interface WallPoint {
  x: number;
  z: number;
}

export interface Wall {
  id: string;
  startPoint: [number, number, number];
  endPoint: [number, number, number];
}

/**
 * Calcule l'angle d'un mur (en radians)
 */
export function getWallAngle(wall: Wall): number {
  const dx = wall.endPoint[0] - wall.startPoint[0];
  const dz = wall.endPoint[2] - wall.startPoint[2];
  return Math.atan2(dz, -dx); // Utiliser -dx pour corriger l'inversion Est/Ouest
}

/**
 * Vérifie si deux murs sont parallèles (tolérance de 5 degrés)
 */
export function areWallsParallel(wall1: Wall, wall2: Wall, toleranceDegrees: number = 5): boolean {
  const angle1 = getWallAngle(wall1);
  const angle2 = getWallAngle(wall2);
  const diff = Math.abs(angle1 - angle2);
  const tolerance = (toleranceDegrees * Math.PI) / 180;
  return diff < tolerance || Math.abs(diff - Math.PI) < tolerance;
}

/**
 * Groupe les murs par orientation (parallèles)
 */
export function groupWallsByOrientation(walls: Wall[]): Map<string, Wall[]> {
  const groups = new Map<string, Wall[]>();
  
  walls.forEach((wall) => {
    const angle = getWallAngle(wall);
    const angleDeg = Math.round((angle * 180) / Math.PI);
    
    // Normaliser l'angle à 0-180 degrés
    const normalizedAngle = ((angleDeg % 180) + 180) % 180;
    const key = `angle-${normalizedAngle}`;
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(wall);
  });
  
  return groups;
}

/**
 * Aligne les murs parallèles sur une grille régulière
 * Respecte les marges et espacements
 */
export function alignParallelWalls(
  walls: Wall[],
  margin: number = 0.5,
  minGap: number = 2.0
): Wall[] {
  if (walls.length === 0) return walls;
  
  // Trier les murs par position (selon la direction perpendiculaire)
  const angle = getWallAngle(walls[0]);
  const perpAngle = angle + Math.PI / 2;
  
  // Calculer la position perpendiculaire de chaque mur
  const wallPositions = walls.map((wall, index) => {
    const centerX = (wall.startPoint[0] + wall.endPoint[0]) / 2;
    const centerZ = (wall.startPoint[2] + wall.endPoint[2]) / 2;
    const perpPos = centerX * Math.cos(perpAngle) + centerZ * Math.sin(perpAngle);
    return { wall, index, perpPos, centerX, centerZ };
  });
  
  // Trier par position perpendiculaire
  wallPositions.sort((a, b) => a.perpPos - b.perpPos);
  
  // Aligner sur une grille avec espacement régulier
  const alignedWalls: Wall[] = [];
  const basePos = wallPositions[0].perpPos;
  
  wallPositions.forEach((wp, i) => {
    const targetPos = basePos + i * minGap;
    const offset = targetPos - wp.perpPos;
    
    // Calculer le décalage en X et Z
    const offsetX = offset * Math.cos(perpAngle);
    const offsetZ = offset * Math.sin(perpAngle);
    
    alignedWalls.push({
      ...wp.wall,
      startPoint: [
        wp.wall.startPoint[0] + offsetX,
        wp.wall.startPoint[1],
        wp.wall.startPoint[2] + offsetZ,
      ] as [number, number, number],
      endPoint: [
        wp.wall.endPoint[0] + offsetX,
        wp.wall.endPoint[1],
        wp.wall.endPoint[2] + offsetZ,
      ] as [number, number, number],
    });
  });
  
  return alignedWalls;
}

/**
 * Ajuste tous les murs pour respecter parallèles, symétries, marges et espacements
 */
export function adjustWallsForAlignment(
  walls: Wall[],
  options: {
    margin?: number;
    minGap?: number;
    snapToGrid?: number;
    preserveFundamental?: boolean;
  } = {}
): Wall[] {
  const {
    margin = 0.5,
    minGap = 2.0,
    snapToGrid = 0.1,
    preserveFundamental = true,
  } = options;
  
  // Grouper les murs par orientation
  const groups = groupWallsByOrientation(walls);
  const adjustedWalls: Wall[] = [];
  
  groups.forEach((groupWalls) => {
    if (groupWalls.length > 1) {
      // Aligner les murs parallèles
      const aligned = alignParallelWalls(groupWalls, margin, minGap);
      adjustedWalls.push(...aligned);
    } else {
      adjustedWalls.push(...groupWalls);
    }
  });
  
  // Snap to grid si demandé
  if (snapToGrid > 0) {
    return adjustedWalls.map((wall) => ({
      ...wall,
      startPoint: [
        Math.round(wall.startPoint[0] / snapToGrid) * snapToGrid,
        wall.startPoint[1],
        Math.round(wall.startPoint[2] / snapToGrid) * snapToGrid,
      ] as [number, number, number],
      endPoint: [
        Math.round(wall.endPoint[0] / snapToGrid) * snapToGrid,
        wall.endPoint[1],
        Math.round(wall.endPoint[2] / snapToGrid) * snapToGrid,
      ] as [number, number, number],
    }));
  }
  
  return adjustedWalls;
}


















