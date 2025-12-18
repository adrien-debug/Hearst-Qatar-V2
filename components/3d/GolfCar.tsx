/**
 * Golf Car - Composant 3D
 * =======================
 * 
 * Voiturette de golf avec couleurs vives
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface GolfCarProps {
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
  /** Si la voiturette est sélectionnée */
  isSelected?: boolean;
  /** Couleur principale de la carrosserie */
  color?: string;
}

/**
 * Golf Car
 * 
 * Voiturette de golf avec :
 * - Carrosserie colorée
 * - Roues
 * - Pare-brise
 * - Siège
 * - Volant
 */
export default function GolfCar({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  color = '#00A651', // Vert Hearst par défaut
}: GolfCarProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Matériaux
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.3,
    roughness: 0.7,
    envMapIntensity: 1.0,
  }), [color]);

  const wheelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.4,
    roughness: 0.8,
    envMapIntensity: 1.0,
  }), []);

  const windshieldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#87CEEB',
    transparent: true,
    opacity: 0.6,
    metalness: 0.1,
    roughness: 0.1,
    envMapIntensity: 1.5,
  }), []);

  const seatMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2c2c2c',
    metalness: 0.2,
    roughness: 0.9,
    envMapIntensity: 1.0,
  }), []);

  const chassisMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a4a4a',
    metalness: 0.6,
    roughness: 0.5,
    envMapIntensity: 1.0,
  }), []);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'golf-car', id }}
      name={id || 'golf-car'}
    >
      {/* Châssis principal */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.2, 1.0]} />
        <primitive object={chassisMaterial} attach="material" />
      </mesh>

      {/* Carrosserie principale */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.6, 0.4, 0.9]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Pare-brise avant */}
      <mesh position={[0.3, 0.7, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.15, 0.05]} />
        <primitive object={windshieldMaterial} attach="material" />
      </mesh>

      {/* Siège conducteur */}
      <mesh position={[-0.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <primitive object={seatMaterial} attach="material" />
      </mesh>

      {/* Siège passager */}
      <mesh position={[0.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <primitive object={seatMaterial} attach="material" />
      </mesh>

      {/* Volant */}
      <mesh position={[-0.3, 0.65, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.12, 0.015, 8, 16]} />
        <primitive object={chassisMaterial} attach="material" />
      </mesh>

      {/* Roue avant gauche */}
      <mesh position={[-0.6, 0.2, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <primitive object={wheelMaterial} attach="material" />
      </mesh>

      {/* Roue avant droite */}
      <mesh position={[-0.6, 0.2, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <primitive object={wheelMaterial} attach="material" />
      </mesh>

      {/* Roue arrière gauche */}
      <mesh position={[0.6, 0.2, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <primitive object={wheelMaterial} attach="material" />
      </mesh>

      {/* Roue arrière droite */}
      <mesh position={[0.6, 0.2, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <primitive object={wheelMaterial} attach="material" />
      </mesh>

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.0, 0.8, 1.2]} />
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
 * Constantes utiles pour les golf cars
 */
export const GOLF_CAR_DIMENSIONS = {
  length: 1.8,
  width: 1.0,
  height: 0.9,
  wheelRadius: 0.25,
} as const;

export const GOLF_CAR_COLORS = {
  vert: '#00A651',
  rouge: '#dc2626',
  bleu: '#2563eb',
  jaune: '#fbbf24',
  blanc: '#f5f5f5',
  noir: '#1a1a1a',
} as const;


