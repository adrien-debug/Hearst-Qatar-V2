/**
 * Barrière Standard - Composant 3D
 * ===================================
 * 
 * Barrière standard simple avec poteaux et barres horizontales
 * Style classique et épuré
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface BarriereStandardProps {
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
  /** Si la barrière est sélectionnée */
  isSelected?: boolean;
  /** Longueur de la barrière en mètres */
  length?: number;
  /** Hauteur de la barrière en mètres */
  height?: number;
  /** Nombre de barres horizontales (2 ou 3) */
  numBars?: number;
  /** Couleur de la barrière */
  color?: string;
}

/**
 * Barrière Standard
 * 
 * Barrière simple avec :
 * - Poteaux métalliques
 * - Barres horizontales
 * - Style classique et épuré
 */
export default function BarriereStandard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  length = 5.0,
  height = 1.2,
  numBars = 2,
  color = '#2c2c2c',
}: BarriereStandardProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Matériau pour les poteaux
  const postMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.7,
    roughness: 0.4,
    envMapIntensity: 1.0,
  }), []);

  // Matériau pour les barres horizontales
  const barMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.5,
    envMapIntensity: 1.0,
  }), [color]);

  // Espacement des poteaux
  const postSpacing = 2.5;
  const numPosts = Math.ceil(length / postSpacing) + 1;
  const postWidth = 0.08;
  const postDepth = 0.08;
  const barThickness = 0.05;
  const barDepth = 0.04;

  // Calculer les positions des barres horizontales
  const barPositions = useMemo(() => {
    if (numBars === 2) {
      return [
        height * 0.3,  // Barre du bas
        height * 0.7,  // Barre du haut
      ];
    } else {
      return [
        height * 0.25, // Barre du bas
        height * 0.5,  // Barre du milieu
        height * 0.75, // Barre du haut
      ];
    }
  }, [numBars, height]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'barriere', id }}
      name={id || 'barriere-standard'}
    >
      {/* Poteaux métalliques */}
      {Array.from({ length: numPosts }).map((_, i) => {
        const x = -length / 2 + i * postSpacing;
        return (
          <mesh
            key={`post-${i}`}
            position={[x, height / 2, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[postWidth, height, postDepth]} />
            <primitive object={postMaterial} attach="material" />
          </mesh>
        );
      })}

      {/* Barres horizontales entre les poteaux */}
      {Array.from({ length: numPosts - 1 }).map((_, i) => {
        const x = -length / 2 + i * postSpacing + postSpacing / 2;
        const sectionLength = postSpacing - postWidth;
        
        return (
          <group key={`bars-section-${i}`} position={[x, 0, 0]}>
            {barPositions.map((yPos, barIndex) => (
              <mesh
                key={`bar-${barIndex}`}
                position={[0, yPos, 0]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[sectionLength, barThickness, barDepth]} />
                <primitive object={barMaterial} attach="material" />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, height / 2, -0.1]}>
          <boxGeometry args={[length, 0.05, 0.05]} />
          <meshBasicMaterial
            color="#00A651"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Constantes utiles pour les barrières standard
 */
export const BARRIERE_STANDARD_DIMENSIONS = {
  standardLength: 5.0,
  standardHeight: 1.2,
  postSpacing: 2.5,
} as const;

export const BARRIERE_STANDARD_COLORS = {
  gris: '#2c2c2c',
  noir: '#1a1a1a',
  blanc: '#f5f5f5',
  vert: '#4a7c59',
} as const;


