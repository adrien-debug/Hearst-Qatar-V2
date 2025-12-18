/**
 * ═══════════════════════════════════════════════════════════════════════════
 * USE AUTO DISPOSE - HOOK POUR NETTOYAGE AUTOMATIQUE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * OBJECTIF : Nettoyer automatiquement les objets Three.js au démontage du composant
 * 
 * UTILISATION :
 * ```tsx
 * const meshRef = useRef<THREE.Mesh>(null);
 * useAutoDispose(meshRef); // Dispose automatique au démontage
 * 
 * return <mesh ref={meshRef}>...</mesh>;
 * ```
 */

import { useEffect, useRef, MutableRefObject } from 'react';
import * as THREE from 'three';

type DisposableObject = THREE.Object3D | THREE.BufferGeometry | THREE.Material | THREE.Texture;

/**
 * Hook pour disposer automatiquement un objet Three.js
 */
export function useAutoDispose<T extends DisposableObject>(
  ref: MutableRefObject<T | null>,
  deep: boolean = true
) {
  useEffect(() => {
    return () => {
      if (ref.current) {
        disposeObject(ref.current, deep);
      }
    };
  }, [ref, deep]);
}

/**
 * Dispose un objet Three.js récursivement
 */
function disposeObject(obj: any, deep: boolean = true): void {
  if (!obj) return;

  // Dispose geometry
  if (obj.geometry) {
    obj.geometry.dispose();
  }

  // Dispose material(s)
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach((mat: THREE.Material) => disposeMaterial(mat));
    } else {
      disposeMaterial(obj.material);
    }
  }

  // Dispose texture
  if (obj instanceof THREE.Texture) {
    obj.dispose();
  }

  // Dispose children (si deep)
  if (deep && obj.children) {
    obj.children.forEach((child: any) => disposeObject(child, deep));
  }
}

/**
 * Dispose un matériau et ses textures
 */
function disposeMaterial(material: THREE.Material): void {
  if (!material) return;

  // Dispose textures
  const textureProps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap'];
  textureProps.forEach((prop) => {
    const texture = (material as any)[prop];
    if (texture instanceof THREE.Texture) {
      texture.dispose();
    }
  });

  // Dispose material
  material.dispose();
}

export default useAutoDispose;
















