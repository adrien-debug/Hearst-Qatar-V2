import React, { useMemo } from 'react';
import * as THREE from 'three';

interface BarriereDesignProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  height?: number;
  color?: string;
  withExtinguisher?: boolean; // Option pour attacher un extincteur
}

export default function BarriereDesign({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  length = 2.5,
  height = 2.2, // Hauteur sécurisée standard
  color = '#2d3436', // Gris anthracite foncé (Anthracite Grey RAL 7016)
  withExtinguisher = false,
}: BarriereDesignProps) {

  // Dimensions
  const postSize = 0.10; // Poteaux carrés 10x10cm
  const slatHeight = 0.15; // Lattes de 15cm de haut
  const slatGap = 0.05; // Espace de 5cm
  const slatThickness = 0.02; // Épaisseur 2cm
  
  // Calcul du nombre de lattes
  // On commence à 20cm du sol
  const startY = 0.2;
  const availableHeight = height - startY;
  const numSlats = Math.floor(availableHeight / (slatHeight + slatGap));

  const materials = useMemo(() => ({
    post: new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.6,
      roughness: 0.4,
    }),
    slat: new THREE.MeshStandardMaterial({
      color: '#4a5568', // Un peu plus clair que les poteaux pour le contraste
      metalness: 0.3,
      roughness: 0.5,
    }),
    concrete: new THREE.MeshStandardMaterial({
      color: '#a0aec0',
      roughness: 0.9,
    })
  }), [color]);

  return (
    <group position={position} rotation={rotation}>
      
      {/* Poteau Gauche */}
      <mesh position={[-length / 2 + postSize / 2, height / 2, 0]} castShadow receiveShadow material={materials.post}>
        <boxGeometry args={[postSize, height, postSize]} />
      </mesh>
      {/* Chapeau Poteau Gauche */}
      <mesh position={[-length / 2 + postSize / 2, height + 0.01, 0]} material={materials.post}>
        <boxGeometry args={[postSize + 0.02, 0.02, postSize + 0.02]} />
      </mesh>

      {/* Poteau Droit */}
      <mesh position={[length / 2 - postSize / 2, height / 2, 0]} castShadow receiveShadow material={materials.post}>
        <boxGeometry args={[postSize, height, postSize]} />
      </mesh>
      {/* Chapeau Poteau Droit */}
      <mesh position={[length / 2 - postSize / 2, height + 0.01, 0]} material={materials.post}>
        <boxGeometry args={[postSize + 0.02, 0.02, postSize + 0.02]} />
      </mesh>

      {/* Lattes Horizontales (Design Louver) */}
      <group position={[0, startY, 0]}>
        {Array.from({ length: numSlats }).map((_, i) => (
          <mesh 
            key={i} 
            position={[0, i * (slatHeight + slatGap) + slatHeight/2, 0]} 
            castShadow 
            receiveShadow 
            material={materials.slat}
          >
            {/* Longueur totale moins les poteaux */}
            <boxGeometry args={[length - postSize * 2, slatHeight, slatThickness]} />
          </mesh>
        ))}
      </group>

      {/* Plots béton au sol (fondations visibles) */}
      <mesh position={[-length / 2 + postSize / 2, 0.05, 0]} receiveShadow material={materials.concrete}>
         <boxGeometry args={[0.3, 0.1, 0.3]} />
      </mesh>
      <mesh position={[length / 2 - postSize / 2, 0.05, 0]} receiveShadow material={materials.concrete}>
         <boxGeometry args={[0.3, 0.1, 0.3]} />
      </mesh>

    </group>
  );
}


