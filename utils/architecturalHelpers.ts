/**
 * Utilitaires pour l'analyse architecturale
 */

import * as THREE from 'three';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Line3D {
  id: string;
  start: Point3D;
  end: Point3D;
}

export interface Landmark3D {
  id: string;
  position: Point3D;
  type: 'point' | 'line' | 'zone';
  name?: string;
  data?: any;
}

export interface ArchitecturalObject {
  id: string;
  type: 'wall' | 'line' | 'landmark' | 'portal';
  position: Point3D;
  rotation?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
}

/**
 * Calcule la distance entre deux points
 */
export function distance3D(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calcule le point le plus proche sur une ligne
 */
export function closestPointOnLine(
  point: Point3D,
  lineStart: Point3D,
  lineEnd: Point3D
): Point3D {
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
    return lineStart;
  }
  
  const t = Math.max(0, Math.min(1, 
    (pointVec.x * lineVec.x + pointVec.y * lineVec.y + pointVec.z * lineVec.z) / lineLengthSq
  ));
  
  return {
    x: lineStart.x + t * lineVec.x,
    y: lineStart.y + t * lineVec.y,
    z: lineStart.z + t * lineVec.z,
  };
}

/**
 * Calcule l'angle entre deux vecteurs (en radians)
 */
export function angleBetweenVectors(
  v1: Point3D,
  v2: Point3D
): number {
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  
  if (mag1 < 0.0001 || mag2 < 0.0001) return 0;
  
  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
}

/**
 * Vérifie si deux lignes sont parallèles
 */
export function areLinesParallel(
  line1: Line3D,
  line2: Line3D,
  toleranceDegrees: number = 5
): boolean {
  const dir1 = {
    x: line1.end.x - line1.start.x,
    y: line1.end.y - line1.start.y,
    z: line1.end.z - line1.start.z,
  };
  
  const dir2 = {
    x: line2.end.x - line2.start.x,
    y: line2.end.y - line2.start.y,
    z: line2.end.z - line2.start.z,
  };
  
  const angle = angleBetweenVectors(dir1, dir2);
  const tolerance = (toleranceDegrees * Math.PI) / 180;
  
  return angle < tolerance || Math.abs(angle - Math.PI) < tolerance;
}

/**
 * Vérifie si deux lignes sont perpendiculaires
 */
export function areLinesPerpendicular(
  line1: Line3D,
  line2: Line3D,
  toleranceDegrees: number = 5
): boolean {
  const dir1 = {
    x: line1.end.x - line1.start.x,
    y: line1.end.y - line1.start.y,
    z: line1.end.z - line1.start.z,
  };
  
  const dir2 = {
    x: line2.end.x - line2.start.x,
    y: line2.end.y - line2.start.y,
    z: line2.end.z - line2.start.z,
  };
  
  const angle = angleBetweenVectors(dir1, dir2);
  const tolerance = (toleranceDegrees * Math.PI) / 180;
  const targetAngle = Math.PI / 2;
  
  return Math.abs(angle - targetAngle) < tolerance;
}

/**
 * Trouve le point de snap le plus proche
 */
export function findSnapPoint(
  point: Point3D,
  objects: ArchitecturalObject[],
  snapDistance: number = 1.0
): Point3D | null {
  let closestPoint: Point3D | null = null;
  let minDistance = snapDistance;
  
  for (const obj of objects) {
    const dist = distance3D(point, obj.position);
    
    if (dist < minDistance) {
      minDistance = dist;
      closestPoint = obj.position;
    }
    
    // Pour les lignes, vérifier aussi les points sur la ligne
    if (obj.type === 'line' && obj.dimensions) {
      // Approximation: traiter comme une ligne horizontale
      const lineStart = obj.position;
      const lineEnd = {
        x: obj.position.x + (obj.dimensions.length || 0) * Math.cos(obj.rotation || 0),
        y: obj.position.y,
        z: obj.position.z + (obj.dimensions.length || 0) * Math.sin(obj.rotation || 0),
      };
      
      const closestOnLine = closestPointOnLine(point, lineStart, lineEnd);
      const distToLine = distance3D(point, closestOnLine);
      
      if (distToLine < minDistance) {
        minDistance = distToLine;
        closestPoint = closestOnLine;
      }
    }
  }
  
  return closestPoint;
}

/**
 * Convertit Point3D en THREE.Vector3
 */
export function toVector3(point: Point3D): THREE.Vector3 {
  return new THREE.Vector3(point.x, point.y, point.z);
}

/**
 * Convertit THREE.Vector3 en Point3D
 */
export function fromVector3(vec: THREE.Vector3): Point3D {
  return { x: vec.x, y: vec.y, z: vec.z };
}


















