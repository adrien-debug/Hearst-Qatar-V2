/**
 * Configuration des vues optimisées pour chaque type de modèle
 * Positions de caméra calculées pour bien cadrer et centrer chaque modèle
 */

import { ElementType } from '../types/gallery';
import * as THREE from 'three';

export interface ModelViewConfig {
  cameraPosition: [number, number, number];
  target: [number, number, number];
  fov: number;
  minDistance: number;
  maxDistance: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

/**
 * Calcule la position de caméra optimale pour cadrer un objet
 */
function calculateOptimalView(
  boundingBox: { width: number; height: number; depth: number },
  angle: number = Math.PI / 4
): ModelViewConfig {
  const maxDim = Math.max(boundingBox.width, boundingBox.height, boundingBox.depth);
  const distance = maxDim * 2.5; // Distance pour bien voir l'objet
  
  const x = distance * Math.cos(angle);
  const z = distance * Math.sin(angle);
  const y = boundingBox.height * 0.7; // Légèrement au-dessus du centre
  
  return {
    cameraPosition: [x, y, z],
    target: [0, boundingBox.height / 2, 0],
    fov: 50,
    minDistance: maxDim * 0.5,
    maxDistance: maxDim * 5,
    autoRotate: true,
    autoRotateSpeed: 1,
  };
}

/**
 * Configuration des vues pour chaque type de modèle
 */
export const MODEL_VIEW_CONFIGS: Record<ElementType, ModelViewConfig> = {
  'container': calculateOptimalView({
    width: 12.196,
    height: 2.896,
    depth: 3.5,
  }),
  
  'transformer': calculateOptimalView({
    width: 3,
    height: 2.5,
    depth: 2.5,
  }),
  
  'switchgear': calculateOptimalView({
    width: 3,
    height: 2.5,
    depth: 2,
  }),
  
  'substation': calculateOptimalView({
    width: 40,
    height: 15,
    depth: 30,
  }),
  
  'powerblock': calculateOptimalView({
    width: 15,
    height: 10,
    depth: 8,
  }),
  
  'dt-padmount': calculateOptimalView({
    width: 2.5,
    height: 2.5,
    depth: 2.5,
  }),
  
  'dt-secondary': calculateOptimalView({
    width: 2.5,
    height: 2.5,
    depth: 2.5,
  }),
  
  'pt-padmount': calculateOptimalView({
    width: 3,
    height: 3,
    depth: 3,
  }),
  
  'dt-renewable': calculateOptimalView({
    width: 2.5,
    height: 2.5,
    depth: 2.5,
  }),
  
  'pt-substation': calculateOptimalView({
    width: 4,
    height: 4,
    depth: 4,
  }),
  
  'high-voltage-power-transformer': calculateOptimalView({
    width: 5,
    height: 6,
    depth: 5,
  }),
  
  'substation-bimfra': calculateOptimalView({
    width: 40,
    height: 15,
    depth: 30,
  }),
};

/**
 * Récupère la configuration de vue pour un type de modèle
 */
export function getModelViewConfig(elementType: ElementType): ModelViewConfig {
  return MODEL_VIEW_CONFIGS[elementType] || MODEL_VIEW_CONFIGS.container;
}

/**
 * Calcule automatiquement la position de caméra pour cadrer un objet
 */
export function autoFrameObject(
  boundingBox: THREE.Box3,
  camera: THREE.PerspectiveCamera
): void {
  const size = boundingBox.getSize(new THREE.Vector3());
  const center = boundingBox.getCenter(new THREE.Vector3());
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim * 2.5;
  
  const angle = Math.PI / 4;
  const x = center.x + distance * Math.cos(angle);
  const z = center.z + distance * Math.sin(angle);
  const y = center.y + size.y * 0.5;
  
  camera.position.set(x, y, z);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}
















