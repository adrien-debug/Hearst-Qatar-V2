/**
 * Cage de Sécurité - Contrôle d'Accès
 * =====================================
 * 
 * Structure grillagée sécurisée pour contrôler l'accès à l'allée centrale.
 * Inclut une porte battante, des barreaux, et une structure métallique robuste.
 */

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

export interface SecurityCageProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: (e: any) => void;
  id?: string;
  isSelected?: boolean;
  width?: number;  // Largeur (X)
  depth?: number;  // Profondeur (Z)
  height?: number; // Hauteur (Y)
  color?: string;
}

export default function SecurityCage({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  width = 2.0,
  depth = 2.0,
  height = 2.5,
  color = '#2c3e50',
}: SecurityCageProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Matériaux
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.85,
        roughness: 0.35,
        envMapIntensity: 1.0,
      }),
    [color]
  );

  const meshMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.7,
        roughness: 0.5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  const doorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#34495e',
        metalness: 0.8,
        roughness: 0.4,
        envMapIntensity: 1.1,
      }),
    []
  );

  const lockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f39c12',
        metalness: 0.95,
        roughness: 0.15,
        emissive: '#f39c12',
        emissiveIntensity: 0.3,
      }),
    []
  );

  const postRadius = 0.05;
  const barThickness = 0.03;
  const doorWidth = width * 0.4; // 40% de la largeur totale

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'security-cage', id }}
      name={id || 'security-cage'}
    >
      {/* ===== STRUCTURE PRINCIPALE ===== */}
      
      {/* Poteaux d'angle (4 coins) */}
      {[
        [-width / 2, height / 2, -depth / 2], // Avant-Gauche
        [width / 2, height / 2, -depth / 2],  // Avant-Droite
        [-width / 2, height / 2, depth / 2],  // Arrière-Gauche
        [width / 2, height / 2, depth / 2],   // Arrière-Droite
      ].map((pos, i) => (
        <mesh key={`post-${i}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[postRadius, postRadius, height, 16]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      ))}

      {/* Barres horizontales supérieures (toit) */}
      {[
        { start: [-width / 2, height, -depth / 2], end: [width / 2, height, -depth / 2] },   // Avant
        { start: [-width / 2, height, depth / 2], end: [width / 2, height, depth / 2] },     // Arrière
        { start: [-width / 2, height, -depth / 2], end: [-width / 2, height, depth / 2] },   // Gauche
        { start: [width / 2, height, -depth / 2], end: [width / 2, height, depth / 2] },     // Droite
      ].map((bar, i) => {
        const start = new THREE.Vector3(...bar.start);
        const end = new THREE.Vector3(...bar.end);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);
        const dir = new THREE.Vector3().subVectors(end, start).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );

        return (
          <mesh key={`top-bar-${i}`} position={mid.toArray() as [number, number, number]} quaternion={quat} castShadow>
            <cylinderGeometry args={[barThickness, barThickness, length, 12]} />
            <primitive object={frameMaterial} attach="material" />
          </mesh>
        );
      })}

      {/* Barres horizontales inférieures (base) */}
      {[
        { start: [-width / 2, 0, -depth / 2], end: [width / 2, 0, -depth / 2] },   // Avant
        { start: [-width / 2, 0, depth / 2], end: [width / 2, 0, depth / 2] },     // Arrière
        { start: [-width / 2, 0, -depth / 2], end: [-width / 2, 0, depth / 2] },   // Gauche
        { start: [width / 2, 0, -depth / 2], end: [width / 2, 0, depth / 2] },     // Droite
      ].map((bar, i) => {
        const start = new THREE.Vector3(...bar.start);
        const end = new THREE.Vector3(...bar.end);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const length = start.distanceTo(end);
        const dir = new THREE.Vector3().subVectors(end, start).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );

        return (
          <mesh key={`bottom-bar-${i}`} position={mid.toArray() as [number, number, number]} quaternion={quat} receiveShadow>
            <cylinderGeometry args={[barThickness, barThickness, length, 12]} />
            <primitive object={frameMaterial} attach="material" />
          </mesh>
        );
      })}

      {/* ===== GRILLAGE (MAILLES) ===== */}
      
      {/* Panneau Arrière (grillage complet) */}
      <mesh position={[0, height / 2, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.1, height - 0.1, 0.02]} />
        <primitive object={meshMaterial} attach="material" />
      </mesh>

      {/* Panneau Gauche */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[depth - 0.1, height - 0.1, 0.02]} />
        <primitive object={meshMaterial} attach="material" />
      </mesh>

      {/* Panneau Droite */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[depth - 0.1, height - 0.1, 0.02]} />
        <primitive object={meshMaterial} attach="material" />
      </mesh>

      {/* Panneau Avant Gauche (à côté de la porte) */}
      <mesh 
        position={[-width / 2 + (width - doorWidth) / 4, height / 2, -depth / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[(width - doorWidth) / 2 - 0.1, height - 0.1, 0.02]} />
        <primitive object={meshMaterial} attach="material" />
      </mesh>

      {/* Panneau Avant Droit (à côté de la porte) */}
      <mesh 
        position={[width / 2 - (width - doorWidth) / 4, height / 2, -depth / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[(width - doorWidth) / 2 - 0.1, height - 0.1, 0.02]} />
        <primitive object={meshMaterial} attach="material" />
      </mesh>

      {/* ===== PORTE ===== */}
      
      {/* Cadre de porte */}
      <group position={[0, 0, -depth / 2]}>
        {/* Montant gauche */}
        <mesh position={[-doorWidth / 2, height / 2, 0]} castShadow>
          <boxGeometry args={[0.06, height, 0.06]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>

        {/* Montant droit */}
        <mesh position={[doorWidth / 2, height / 2, 0]} castShadow>
          <boxGeometry args={[0.06, height, 0.06]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>

        {/* Linteau (haut) */}
        <mesh position={[0, height, 0]} castShadow>
          <boxGeometry args={[doorWidth, 0.08, 0.06]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>

        {/* Porte battante (légèrement ouverte) */}
        <group position={[-doorWidth / 2, height / 2, 0]} rotation={[0, -0.3, 0]}>
          {/* Panneau de porte */}
          <mesh position={[doorWidth / 2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[doorWidth - 0.05, height - 0.2, 0.04]} />
            <primitive object={doorMaterial} attach="material" />
          </mesh>

          {/* Grillage de la porte */}
          <mesh position={[doorWidth / 2, 0, 0.03]} castShadow>
            <boxGeometry args={[doorWidth - 0.2, height - 0.4, 0.02]} />
            <primitive object={meshMaterial} attach="material" />
          </mesh>

          {/* Poignée */}
          <mesh position={[doorWidth - 0.15, 0, 0.05]} castShadow>
            <boxGeometry args={[0.05, 0.15, 0.08]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Serrure/Cadenas */}
          <mesh position={[doorWidth - 0.15, -0.15, 0.08]} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.04]} />
            <primitive object={lockMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ===== SIGNALÉTIQUE ===== */}
      
      {/* Panneau "ACCÈS RESTREINT" */}
      <group position={[0, height * 0.75, -depth / 2 - 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.2, 0.02]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.45, 0.15, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Spot lumineux (LED de statut) */}
      <pointLight 
        position={[0, height - 0.1, -depth / 2 - 0.1]} 
        color="#00ff00" 
        intensity={0.5} 
        distance={2} 
      />
      <mesh position={[0, height - 0.1, -depth / 2 - 0.1]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={1.5} 
        />
      </mesh>

      {/* ===== MARQUEUR DE SÉLECTION ===== */}
      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.3, height + 0.3, depth + 0.3]} />
          <meshBasicMaterial 
            color="#00A651" 
            transparent 
            opacity={0.2} 
            wireframe 
          />
        </mesh>
      )}
    </group>
  );
}


