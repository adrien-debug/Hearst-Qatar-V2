/**
 * Barres de verrouillage arrière (portes de container) - Modèle procédural
 * ======================================================================
 *
 * Représente les 2 barres inox (argent) qu'on trouve sur les portes arrière
 * des containers maritimes (tiges verticales + poignée + gâches haut/bas).
 *
 * Objectif: avoir l'asset "barres seules" dans la galerie, pour les placer
 * manuellement sur un container ou ailleurs.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface ContainerDoorLockBarsProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  id?: string;
  isSelected?: boolean;

  /** Largeur du container (pour espacer les barres) */
  containerWidth?: number;
  /** Hauteur approximative de la porte */
  doorHeight?: number;
  /** Décalage de la barre par rapport au bord Z */
  edgeInset?: number;
  /** Décalage en X (saillie vers l'extérieur de la porte) */
  outwardOffset?: number;

  /** Couleur inox */
  steelColor?: string;
  /** Couleur pièces de maintien (gâches) */
  keeperColor?: string;
}

export default function ContainerDoorLockBars({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  containerWidth = 2.438,
  doorHeight = 2.6,
  edgeInset = 0.18,
  outwardOffset = 0.06,
  steelColor = '#E5E7EB',
  keeperColor = '#CBD5E1',
}: ContainerDoorLockBarsProps) {
  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(steelColor),
        metalness: 0.98,
        roughness: 0.12,
        envMapIntensity: 1.2,
      }),
    [steelColor]
  );

  const keeperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(keeperColor),
        metalness: 0.9,
        roughness: 0.25,
        envMapIntensity: 1.0,
      }),
    [keeperColor]
  );

  const rodRadius = 0.028;
  const rodLen = Math.max(0.4, doorHeight - 0.18);
  const handleRadius = 0.018;
  const handleLen = 0.42;

  const keeperW = 0.09;
  const keeperH = 0.06;
  const keeperD = 0.10;

  const zLeft = -containerWidth / 2 + edgeInset;
  const zRight = containerWidth / 2 - edgeInset;

  const doorHalfH = doorHeight / 2;
  const topKeeperY = doorHalfH - 0.14;
  const bottomKeeperY = -doorHalfH + 0.14;
  const handleY = -0.15;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'container-lock-bars', id }}
      name={id || 'container-door-lock-bars'}
    >
      {[
        { key: 'left', z: zLeft },
        { key: 'right', z: zRight },
      ].map(({ key, z }) => (
        <group key={`bar-${key}`}>
          {/* Tige verticale */}
          <mesh position={[outwardOffset, 0, z]} castShadow receiveShadow>
            <cylinderGeometry args={[rodRadius, rodRadius, rodLen, 18]} />
            <primitive object={steelMat} attach="material" />
          </mesh>

          {/* Gâches haut/bas */}
          <mesh position={[outwardOffset * 0.4, topKeeperY, z]} castShadow receiveShadow>
            <boxGeometry args={[keeperW, keeperH, keeperD]} />
            <primitive object={keeperMat} attach="material" />
          </mesh>
          <mesh position={[outwardOffset * 0.4, bottomKeeperY, z]} castShadow receiveShadow>
            <boxGeometry args={[keeperW, keeperH, keeperD]} />
            <primitive object={keeperMat} attach="material" />
          </mesh>

          {/* Poignée de manœuvre (barre horizontale) */}
          <mesh
            position={[outwardOffset + 0.05, handleY, z]}
            rotation={[0, 0, Math.PI / 2]} // orientée sur X
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[handleRadius, handleRadius, handleLen, 16]} />
            <primitive object={steelMat} attach="material" />
          </mesh>
        </group>
      ))}

      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.35, doorHeight + 0.2, containerWidth + 0.2]} />
          <meshBasicMaterial color="#00A651" transparent opacity={0.25} wireframe />
        </mesh>
      )}
    </group>
  );
}



