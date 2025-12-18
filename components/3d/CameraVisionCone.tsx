/**
 * Cône de Vision Caméra - Visualisation de la couverture
 * =====================================================
 * 
 * Affiche un cône semi-transparent pour visualiser la zone de couverture
 * d'une caméra de surveillance.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface CameraVisionConeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  fov?: number; // Field of View en degrés
  range?: number; // Portée en mètres
  color?: string;
  opacity?: number;
  visible?: boolean;
}

export default function CameraVisionCone({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  fov = 90, // 90° pour caméras fixes, 60° pour PTZ
  range = 25, // 25m de portée par défaut
  color = '#00A651', // Vert Hearst
  opacity = 0.15,
  visible = true,
}: CameraVisionConeProps) {
  
  // Convertir FOV en radians et calculer le rayon du cône
  const fovRadians = (fov * Math.PI) / 180;
  const radius = Math.tan(fovRadians / 2) * range;
  
  // Matériau du cône (semi-transparent)
  const coneMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        depthWrite: false, // Pour éviter les problèmes de tri Z
      }),
    [color, opacity]
  );

  // Matériau du wireframe (contour)
  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity * 2, // Plus visible
        wireframe: true,
      }),
    [color, opacity]
  );

  if (!visible) return null;

  return (
    <group position={position} rotation={rotation}>
      {/* Cône de vision principal (semi-transparent) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} // Orienter le cône vers l'avant (Z+)
        position={[0, range / 2, 0]} // Centrer à mi-hauteur du cône
      >
        <coneGeometry args={[radius, range, 32, 1, true]} />
        <primitive object={coneMaterial} attach="material" />
      </mesh>

      {/* Wireframe pour mieux voir la forme */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, range / 2, 0]}
      >
        <coneGeometry args={[radius, range, 16, 1, false]} />
        <primitive object={wireframeMaterial} attach="material" />
      </mesh>

      {/* Cercle à la base (zone de couverture au sol) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <ringGeometry args={[0, radius, 32]} />
        <primitive object={coneMaterial} attach="material" />
      </mesh>

      {/* Ligne centrale (axe de visée) */}
      <mesh position={[0, range / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, range, 8]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 3} />
      </mesh>
    </group>
  );
}

/**
 * Variante : Cône PTZ (rotation 360°)
 * Affiche un cercle au sol au lieu d'un cône
 */
export function CameraVisionConePTZ({
  position = [0, 0, 0],
  range = 25,
  color = '#00A651',
  opacity = 0.15,
  visible = true,
}: Omit<CameraVisionConeProps, 'rotation' | 'fov'>) {
  
  const circleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [color, opacity]
  );

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Cercle de couverture au sol (360°) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[0, range, 64]} />
        <primitive object={circleMaterial} attach="material" />
      </mesh>

      {/* Cercle wireframe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[range - 0.5, range, 64]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 3} />
      </mesh>

      {/* Point central */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 2} />
      </mesh>
    </group>
  );
}


