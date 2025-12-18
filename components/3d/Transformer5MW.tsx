/**
 * Transformateur 5 MW - Design Industriel Moderne
 * ===============================================
 * 
 * Modèle procédural "High Poly" remplaçant les GLB importés.
 * Design inspiré des transformateurs de puissance modernes (Siemens/ABB).
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Transformer5MWProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: (e: any) => void;
  id?: string;
  isSelected?: boolean;
  color?: string;
}

export default function Transformer5MW({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  color = '#E3E4E5', // Argent
}: Transformer5MWProps) {

  // --- MATÉRIAUX ---
  const hullMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.8,
    roughness: 0.3,
    envMapIntensity: 1.2
  }), [color]);

  const radiatorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#bdc3c7', // Gris plus clair pour les radiateurs
    metalness: 0.6,
    roughness: 0.5
  }), []);

  const ceramicMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8e44ad', // Violet foncé/Marron isolateur céramique
    metalness: 0.1,
    roughness: 0.1, // Brillant
    emissive: '#2c3e50',
    emissiveIntensity: 0.2
  }), []);
  
  // Variante couleur isolateur (Brun classique)
  const ceramicBrownMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#795548',
    metalness: 0.2,
    roughness: 0.2
  }), []);

  const darkMetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2c3e50',
    metalness: 0.7,
    roughness: 0.7
  }), []);

  // --- DIMENSIONS ---
  const width = 2.5;  // X
  const depth = 3.5;  // Z
  const height = 2.8; // Y (Cuve)

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {/* 1. CUVE PRINCIPALE (Main Tank) */}
      <group position={[0, height/2 + 0.2, 0]}>
        {/* Corps */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <primitive object={hullMaterial} attach="material" />
        </mesh>
        
        {/* Conservateur d'huile (Cylindre au dessus) */}
        <mesh position={[0.5, height/2 + 0.4, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, depth - 0.5, 16]} />
          <primitive object={hullMaterial} attach="material" />
        </mesh>
        
        {/* Tuyaux de connexion au conservateur */}
        <mesh position={[0.5, height/2, 0.8]}>
           <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
           <primitive object={hullMaterial} attach="material" />
        </mesh>
        <mesh position={[0.5, height/2, -0.8]}>
           <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
           <primitive object={hullMaterial} attach="material" />
        </mesh>
      </group>

      {/* 2. RADIATEURS DE REFROIDISSEMENT (Ailerons latéraux) */}
      {/* On place des blocs d'ailerons sur les côtés gauche et droit (X+ et X-) */}
      {[ -1, 1 ].map((side, idx) => (
         <group key={`rads-${idx}`} position={[side * (width/2 + 0.3), height/2, 0]}>
            {/* 4 Blocs de radiateurs par côté */}
            {[-1, -0.3, 0.3, 1].map((zPos, zIdx) => (
                <group key={`rad-${idx}-${zIdx}`} position={[0, 0, zPos]}>
                   {/* Collecteur Haut */}
                   <mesh position={[0, height/2 - 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
                      <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                      <primitive object={hullMaterial} attach="material" />
                   </mesh>
                   {/* Collecteur Bas */}
                   <mesh position={[0, -height/2 + 0.4, 0]} rotation={[0, 0, Math.PI/2]}>
                      <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
                      <primitive object={hullMaterial} attach="material" />
                   </mesh>
                   {/* Ailerons (Panneaux fins) */}
                   {Array.from({length: 8}).map((_, i) => (
                       <mesh key={`fin-${i}`} position={[0, 0.1, -0.15 + i*0.04]}>
                           <boxGeometry args={[0.6, height - 0.8, 0.02]} />
                           <primitive object={radiatorMaterial} attach="material" />
                       </mesh>
                   ))}
                </group>
            ))}
         </group>
      ))}

      {/* 3. ISOLATEURS HAUTE TENSION (Bushings) */}
      {/* 3 Phases HV sur le dessus */}
      {[-0.8, 0, 0.8].map((zPos, i) => (
         <group key={`hv-${i}`} position={[-0.6, height + 0.2, zPos]} rotation={[0, 0, Math.PI/12]}>
            {/* Isolateur annelé */}
            <mesh position={[0, 0.6, 0]} castShadow>
               <cylinderGeometry args={[0.08, 0.15, 1.2, 8]} />
               <primitive object={ceramicBrownMaterial} attach="material" />
            </mesh>
            {/* Anneaux (Torus) pour effet isolateur */}
            {Array.from({length: 6}).map((_, j) => (
               <mesh key={`ring-${j}`} position={[0, 0.2 + j*0.15, 0]} rotation={[Math.PI/2, 0, 0]}>
                  <torusGeometry args={[0.12, 0.04, 8, 16]} />
                  <primitive object={ceramicBrownMaterial} attach="material" />
               </mesh>
            ))}
            {/* Connecteur terminal */}
            <mesh position={[0, 1.25, 0]}>
               <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
               <meshStandardMaterial color="#c0c0c0" metalness={1} roughness={0.2} />
            </mesh>
         </group>
      ))}

      {/* 4. ISOLATEURS BASSE TENSION (LV Bushings) */}
      {/* 4 Phases LV (3 + Neutre) sur le côté ou dessus opposé */}
      {[-0.6, -0.2, 0.2, 0.6].map((zPos, i) => (
         <group key={`lv-${i}`} position={[0.6, height + 0.2, zPos]}>
             <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.06, 0.1, 0.6, 8]} />
                <primitive object={ceramicBrownMaterial} attach="material" />
             </mesh>
         </group>
      ))}

      {/* 5. BOÎTIER DE CONTRÔLE (Armoire latérale) */}
      <mesh position={[0, height/2, depth/2 + 0.2]} castShadow>
          <boxGeometry args={[1.2, 1.5, 0.4]} />
          <primitive object={hullMaterial} attach="material" />
      </mesh>
      
      {/* 6. SOCLE / SKID */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[width + 0.2, 0.2, depth]} />
          <primitive object={darkMetalMaterial} attach="material" />
      </mesh>

      {/* 7. TEXTE ID - SUPPRIMÉ
      <group position={[0, height + 1.8, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="white"
          rotation={[0, Math.PI, 0]} // Face arrière
        >
          {id?.replace('PB', '').replace('_TR', '.') || "3.8"}
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="white"
          rotation={[0, 0, 0]} // Face avant
        >
          {id?.replace('PB', '').replace('_TR', '.') || "3.8"}
        </Text>
      </group>
      */}

      {/* 8. CADRE DE SÉLECTION */}
      {isSelected && (
        <mesh position={[0, height/2, 0]}>
          <boxGeometry args={[width + 1, height + 1, depth + 1]} />
          <meshBasicMaterial
            color="#cccccc"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

// Export des constantes pour compatibilité
export const TRANSFORMER_5MW_DIMENSIONS = {
  length: 3.5,
  width: 2.5,
  height: 3.0,
} as const;


