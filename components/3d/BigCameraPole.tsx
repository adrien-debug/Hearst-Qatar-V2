/**
 * Grand poteau caméra (fixe / rotatif PTZ) - Modèle procédural
 * ============================================================
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BigCameraPoleProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  id?: string;
  isSelected?: boolean;

  variant?: 'fixed' | 'ptz';
  poleHeight?: number;
  poleRadius?: number;
  baseRadius?: number;
  baseHeight?: number;

  /** PTZ */
  panSpeed?: number; // rad/s
  pitchAmplitude?: number; // rad
  pitchSpeed?: number; // rad/s
}

export default function BigCameraPole({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  variant = 'fixed',
  poleHeight = 6.5,
  poleRadius = 0.11,
  baseRadius = 0.28,
  baseHeight = 0.08,
  panSpeed = 0.45,
  pitchAmplitude = 0.22,
  pitchSpeed = 0.7,
}: BigCameraPoleProps) {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (variant !== 'ptz' || !headRef.current) return;
    headRef.current.rotation.y += delta * panSpeed;
    headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * pitchSpeed) * pitchAmplitude;
  });

  const poleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        metalness: 0.85,
        roughness: 0.35,
        envMapIntensity: 1.0,
      }),
    []
  );

  const baseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0B1220',
        metalness: 0.9,
        roughness: 0.28,
        envMapIntensity: 1.0,
      }),
    []
  );

  const housingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D1D5DB',
        metalness: 0.6,
        roughness: 0.35,
        envMapIntensity: 1.1,
      }),
    []
  );

  const lensMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#05070A',
        metalness: 0.95,
        roughness: 0.08,
        envMapIntensity: 1.6,
      }),
    []
  );

  const domeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#9CA3AF',
        metalness: 0.05,
        roughness: 0.12,
        transparent: true,
        opacity: 0.35,
      }),
    []
  );

  const ledMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#22c55e',
        emissive: '#22c55e',
        emissiveIntensity: 1.1,
      }),
    []
  );

  const topY = poleHeight + baseHeight;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'big-camera-pole', id }}
      name={id || `big-camera-pole-${variant}`}
    >
      {/* Socle */}
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[baseRadius, baseRadius, baseHeight, 24]} />
        <primitive object={baseMat} attach="material" />
      </mesh>

      {/* Poteau */}
      <mesh position={[0, baseHeight + poleHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[poleRadius, poleRadius, poleHeight, 16]} />
        <primitive object={poleMat} attach="material" />
      </mesh>

      {/* Bras / platine haut */}
      <mesh position={[0, topY, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.06, 0.18]} />
        <primitive object={poleMat} attach="material" />
      </mesh>

      {/* Tête caméra */}
      {variant === 'fixed' ? (
        <group position={[0.22, topY + 0.02, 0]}>
          {/* Corps */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.22, 0.22]} />
            <primitive object={housingMat} attach="material" />
          </mesh>
          {/* Pare-soleil */}
          <mesh position={[0.16, 0.03, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.08, 0.26]} />
            <primitive object={housingMat} attach="material" />
          </mesh>
          {/* Lentille */}
          <mesh position={[0.26, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
            <primitive object={lensMat} attach="material" />
          </mesh>
          {/* LED */}
          <mesh position={[-0.18, 0.08, 0.08]} castShadow>
            <sphereGeometry args={[0.015, 10, 10]} />
            <primitive object={ledMat} attach="material" />
          </mesh>
        </group>
      ) : (
        <group position={[0, topY + 0.02, 0]}>
          {/* Base PTZ */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.20, 0.18, 24]} />
            <primitive object={housingMat} attach="material" />
          </mesh>
          {/* Dôme */}
          <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <primitive object={domeMat} attach="material" />
          </mesh>

          {/* Tête rotative */}
          <group ref={headRef} position={[0, 0.02, 0]}>
            <mesh position={[0.18, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.36, 0.18, 0.20]} />
              <primitive object={housingMat} attach="material" />
            </mesh>
            <mesh position={[0.34, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.065, 0.065, 0.08, 20]} />
              <primitive object={lensMat} attach="material" />
            </mesh>
            <mesh position={[-0.10, 0.07, 0.10]} castShadow>
              <sphereGeometry args={[0.015, 10, 10]} />
              <primitive object={ledMat} attach="material" />
            </mesh>
          </group>
        </group>
      )}

      {isSelected && (
        <mesh position={[0, poleHeight / 2, 0]}>
          <boxGeometry args={[0.9, poleHeight + 0.8, 0.9]} />
          <meshBasicMaterial color="#00A651" transparent opacity={0.22} wireframe />
        </mesh>
      )}
    </group>
  );
}



