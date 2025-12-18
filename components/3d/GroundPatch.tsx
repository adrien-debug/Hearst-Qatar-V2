import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { createAsphaltTexture, createConcreteTexture, createCompactSandTexture } from '../../utils/textureHelpers';
import { progressiveTextureLoader } from '../../utils/progressiveTextureLoader';
import { safeAssignTexture } from '../../utils/materialHelpers';
import { getOptimalTextureSize } from '../../utils/textureCache';

export type GroundType = 
  | 'asphalt' | 'concrete' | 'grass' | 'gravel' | 'sand' 
  | 'dirt' | 'water' | 'paving' | 'tiles' | 'wood';

interface GroundPatchProps {
  type: GroundType;
  width?: number;
  length?: number;
  color?: string;
}

/**
 * Patch de sol générique pour créer des environnements
 * VERSION TECHNIQUE : Utilise des textures procédurales pour le réalisme
 */
export default function GroundPatch({ 
  type, 
  width = 10, 
  length = 10, 
  color 
}: GroundPatchProps) {
  
  // Configuration initiale des matériaux selon le type (Style Technique)
  const material = useMemo(() => {
    switch (type) {
      case 'asphalt':
        return new THREE.MeshStandardMaterial({ 
          color: color || '#111111', 
          roughness: 0.9, 
          metalness: 0.0 
        });
      case 'concrete':
        return new THREE.MeshStandardMaterial({ 
          color: color || '#222222', 
          roughness: 0.9, 
          metalness: 0.1 
        });
      case 'sand':
        return new THREE.MeshStandardMaterial({ 
          color: color || '#c2b280', 
          roughness: 1, 
          metalness: 0 
        });
      case 'grass':
        return new THREE.MeshStandardMaterial({ color: color || '#4a7023', roughness: 1, metalness: 0 });
      case 'gravel':
        return new THREE.MeshStandardMaterial({ color: color || '#6b7280', roughness: 0.9, metalness: 0 });
      case 'dirt':
        return new THREE.MeshStandardMaterial({ color: color || '#5d4037', roughness: 1, metalness: 0 });
      case 'water':
        return new THREE.MeshStandardMaterial({ color: color || '#3B82F6', roughness: 0, metalness: 0.8, transparent: true, opacity: 0.8 });
      case 'paving':
        return new THREE.MeshStandardMaterial({ color: color || '#9ca3af', roughness: 0.6, metalness: 0 });
      case 'wood':
        return new THREE.MeshStandardMaterial({ color: color || '#8d6e63', roughness: 0.7, metalness: 0 });
      default:
        return new THREE.MeshStandardMaterial({ color: color || '#333333', roughness: 0.5 });
    }
  }, [type, color]);

  // Chargement asynchrone de la texture procédurale si applicable
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const textureSize = getOptimalTextureSize(); // 512, 1024, ou 2048

    // Fonction de chargement générique
    const loadTex = (
      generator: (size: number) => THREE.Texture | undefined, 
      key: string
    ) => {
      progressiveTextureLoader.loadProgressive(
        () => generator(256) || new THREE.Texture(),
        () => generator(textureSize) || new THREE.Texture(),
        key,
        { priority: 'low' } // Priorité basse pour les patchs décoratifs
      ).then(texture => {
        if (texture && texture.image) {
          // Ajuster la répétition en fonction de la taille du patch (environ 1 répétition tous les 4m)
          const repeatX = Math.max(1, width / 4);
          const repeatY = Math.max(1, length / 4);
          texture.repeat.set(repeatX, repeatY);
          
          safeAssignTexture(material, 'map', texture);
          material.needsUpdate = true;
        }
      });
    };

    // Déclencher le générateur approprié
    if (type === 'asphalt') {
      loadTex(createAsphaltTexture, `asphalt_tex_${textureSize}`);
    } else if (type === 'concrete') {
      loadTex(createConcreteTexture, `concrete_tex_${textureSize}`);
    } else if (type === 'sand') {
      loadTex(createCompactSandTexture, `sand_tex_${textureSize}`);
    }

  }, [type, material, width, length]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <primitive object={material} attach="material" />
      
      {/* Bordure optionnelle pour donner du volume visuel */}
      {type !== 'water' && type !== 'grass' && (
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(width, length)]} />
          <lineBasicMaterial color="black" opacity={0.1} transparent />
        </lineSegments>
      )}
    </mesh>
  );
}


