/**
 * Caméra de Sécurité - Composant 3D
 * ===================================
 * 
 * Caméra de surveillance avec support et base, style moderne
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface CameraSecuriteProps {
  /** Position [x, y, z] en mètres */
  position?: [number, number, number];
  /** Rotation [x, y, z] en radians */
  rotation?: [number, number, number];
  /** Échelle (1 = taille réelle) */
  scale?: number;
  /** Callback au clic */
  onClick?: () => void;
  /** ID unique pour identification */
  id?: string;
  /** Si la caméra est sélectionnée */
  isSelected?: boolean;
  /** Couleur de la caméra */
  color?: string;
  /** Hauteur du support en mètres */
  supportHeight?: number;
}

/**
 * Caméra de Sécurité
 * 
 * Caméra de surveillance avec :
 * - Support métallique
 * - Base circulaire
 * - Corps de caméra avec objectif
 * - LED de statut
 */
export default function CameraSecurite({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  color = '#1a1a1a',
  supportHeight = 2.5,
}: CameraSecuriteProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Matériaux
  const cameraBodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.7,
    roughness: 0.4,
    envMapIntensity: 1.0,
  }), [color]);

  const supportMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2c2c2c',
    metalness: 0.8,
    roughness: 0.3,
    envMapIntensity: 1.0,
  }), []);

  const lensMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5,
  }), []);

  const ledMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00ff00',
    emissive: '#00ff00',
    emissiveIntensity: 1.0,
  }), []);

  const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.85,
    roughness: 0.25,
    envMapIntensity: 1.0,
  }), []);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'camera', id }}
      name={id || 'camera-securite'}
    >
      {/* Base circulaire */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <primitive object={baseMaterial} attach="material" />
      </mesh>

      {/* Support vertical */}
      <mesh position={[0, supportHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, supportHeight, 8]} />
        <primitive object={supportMaterial} attach="material" />
      </mesh>

      {/* Bras de support horizontal */}
      <mesh position={[0, supportHeight, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.15, 0.04, 0.04]} />
        <primitive object={supportMaterial} attach="material" />
      </mesh>

      {/* Corps de la caméra */}
      <group position={[0.1, supportHeight, 0]}>
        {/* Corps principal */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <primitive object={cameraBodyMaterial} attach="material" />
        </mesh>

        {/* Objectif */}
        <mesh position={[0.06, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <primitive object={lensMaterial} attach="material" />
        </mesh>

        {/* LED de statut (verte) */}
        <mesh position={[-0.04, 0.03, 0]} castShadow>
          <sphereGeometry args={[0.008, 8, 8]} />
          <primitive object={ledMaterial} attach="material" />
        </mesh>
      </group>

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, supportHeight, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.1]} />
          <meshBasicMaterial
            color="#00A651"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Constantes utiles pour les caméras de sécurité
 */
export const CAMERA_SECURITE_DIMENSIONS = {
  standardHeight: 2.5,
  cameraWidth: 0.12,
  cameraHeight: 0.08,
  cameraDepth: 0.06,
} as const;

export const CAMERA_SECURITE_COLORS = {
  noir: '#1a1a1a',
  blanc: '#f5f5f5',
  gris: '#4a4a4a',
  beige: '#d4c5b9',
} as const;


