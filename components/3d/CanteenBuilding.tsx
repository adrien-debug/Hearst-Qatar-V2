import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

interface CanteenBuildingProps extends GroupProps {
  width?: number; // Largeur (X)
  length?: number; // Profondeur (Z)
  height?: number; // Hauteur
}

export default function CanteenBuilding({
  width = 25,
  length = 15,
  height = 5,
  ...props
}: CanteenBuildingProps) {

  // Matériaux
  const wallsMaterial = new THREE.MeshStandardMaterial({ color: '#f5f6fa', roughness: 0.5 }); // Blanc cassé
  const glassMaterial = new THREE.MeshPhysicalMaterial({ 
    color: '#a5c9ca', 
    metalness: 0.9, 
    roughness: 0.1, 
    transparent: true, 
    opacity: 0.6,
    envMapIntensity: 1.5 
  });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: '#34495e', roughness: 0.8 });
  const woodMaterial = new THREE.MeshStandardMaterial({ color: '#d35400', roughness: 0.9 }); // Terrasse bois

  // Dimensions
  const terraceDepth = 4;
  const mainBuildingLength = length - terraceDepth;

  return (
    <group {...props}>
      {/* 1. Bâtiment Principal */}
      <mesh position={[0, height/2, -terraceDepth/2]} castShadow receiveShadow material={wallsMaterial}>
        <boxGeometry args={[width, height, mainBuildingLength]} />
      </mesh>

      {/* 2. Toit (Débordant) */}
      <mesh position={[0, height + 0.2, 0]} castShadow receiveShadow material={roofMaterial}>
        <boxGeometry args={[width + 2, 0.4, length + 2]} />
      </mesh>

      {/* 3. Grandes Baies Vitrées (Façade Avant - Sud) */}
      {/* On fait une "tranche" de verre sur la façade avant */}
      <mesh position={[0, height/2, (mainBuildingLength/2) - terraceDepth/2 + 0.1]} material={glassMaterial}>
        <boxGeometry args={[width - 4, height - 1, 0.2]} />
      </mesh>

      {/* 4. Terrasse (Devant) */}
      <group position={[0, 0.2, (mainBuildingLength/2) + terraceDepth/2 - terraceDepth/2]}>
        {/* Sol Terrasse */}
        <mesh receiveShadow material={woodMaterial}>
          <boxGeometry args={[width, 0.4, terraceDepth]} />
        </mesh>
        
        {/* Piliers Terrasse (Supportent le débord de toit) */}
        {[-width/2 + 1, width/2 - 1, -width/4, width/4].map((x, i) => (
           <mesh key={i} position={[x, height/2, terraceDepth/2 - 0.5]} castShadow material={wallsMaterial}>
             <boxGeometry args={[0.3, height, 0.3]} />
           </mesh>
        ))}
        
        {/* Tables de pique-nique (Low poly) */}
        {[-width/3, 0, width/3].map((x, i) => (
          <group key={`table-${i}`} position={[x, 0.2, 0]}>
             <mesh position={[0, 0.8, 0]} castShadow material={woodMaterial}>
               <boxGeometry args={[2, 0.1, 1]} /> {/* Plateau */}
             </mesh>
             <mesh position={[0, 0.4, 0]} castShadow material={wallsMaterial}>
               <boxGeometry args={[0.2, 0.8, 0.2]} /> {/* Pied */}
             </mesh>
             <mesh position={[0, 0.4, 0.8]} castShadow material={woodMaterial}>
               <boxGeometry args={[2, 0.1, 0.4]} /> {/* Banc 1 */}
             </mesh>
             <mesh position={[0, 0.4, -0.8]} castShadow material={woodMaterial}>
               <boxGeometry args={[2, 0.1, 0.4]} /> {/* Banc 2 */}
             </mesh>
          </group>
        ))}
      </group>

      {/* 5. Enseigne "CANTEEN" */}
      {/* (Optionnel si tu as Text de drei, je ne l'inclus pas pour rester léger, mais on peut) */}

    </group>
  );
}



