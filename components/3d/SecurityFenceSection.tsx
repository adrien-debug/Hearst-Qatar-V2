/**
 * Section de barrière sécurisée simplifiée "2 tubes"
 * Utilise Gallery3DEnvironment pour la cohérence visuelle
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface SecurityFenceSectionProps {
  position?: [number, number, number];
  isSelected?: boolean;
  fenceId?: string;
  length?: number;
  height?: number;
}

/**
 * Section de barrière sécurisée pour entourer le parc
 * - Style "Ranch" Industriel : Poteaux + 2 Tubes horizontaux
 */
export default function SecurityFenceSection({
  position = [0, 0, 0],
  isSelected = false,
  fenceId = 'security-fence-default',
  length = 8.0,
  height = 1.2, // Hauteur standard garde-corps
}: SecurityFenceSectionProps) {
  const groupRef = useRef<THREE.Group>(null);

  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2d3436', // Gris foncé industriel
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1.0,
  }), []);

  // Configuration
  const postSpacing = 2.0; // Poteaux tous les 2m
  const numPosts = Math.ceil(length / postSpacing) + 1;
  const postRadius = 0.04; // 8cm diamètre
  const tubeRadius = 0.03; // 6cm diamètre
  
  // Hauteurs des tubes (par rapport au sol)
  const tubeHeights = [height * 0.5, height * 0.9]; 

  return (
    <group ref={groupRef} position={position} name={fenceId}>
      {/* Poteaux Verticaux */}
      {Array.from({ length: numPosts }).map((_, i) => {
        // Centrer les poteaux sur la longueur totale
        // Si length=8, x va de -4 à +4
        // On ajuste le dernier segment si besoin, mais ici on simplifie avec un spacing fixe
        // Pour que ça tombe juste, on recalcule le spacing réel
        const realSpacing = length / (numPosts - 1);
        const x = -length / 2 + i * realSpacing;
        
        return (
          <mesh
            key={`post-${i}`}
            position={[x, height / 2, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[postRadius, postRadius, height, 16]} />
            <primitive object={metalMaterial} attach="material" />
          </mesh>
        );
      })}

      {/* Tubes Horizontaux (Lisses) */}
      {tubeHeights.map((h, index) => (
        <mesh 
            key={`tube-${index}`}
            position={[0, h, 0]} // Centré, hauteur h
            rotation={[0, 0, Math.PI / 2]} // Couché sur X
            castShadow
            receiveShadow
        >
            <cylinderGeometry args={[tubeRadius, tubeRadius, length, 16]} />
            <primitive object={metalMaterial} attach="material" />
        </mesh>
      ))}

      {/* Indicateur de sélection (Optionnel) */}
      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[length + 0.2, height + 0.2, 0.2]} />
          <meshBasicMaterial color="#8AFD81" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
