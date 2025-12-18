/**
 * Power Block 20 MW - E-House Réaliste
 * ====================================
 * 
 * Structure de type E-House (Electrical House) conteneurisée.
 * Rendu "High Poly" procédural pour un réalisme maximal sans charger de GLB externe.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface PowerBlockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: (elementId: string, event?: any) => void;
  id?: string;
  isSelected?: boolean;
  // Props "catalogue/wrappers" (optionnelles) pour compatibilité
  color?: string;
  secondaryColor?: string;
  selectedElementId?: string | null;
  selectedElementIds?: string[];
  elementStates?: Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  }>;
}

export default function PowerBlock25MW({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  color,
  secondaryColor,
}: PowerBlockProps) {

  // --- MATÉRIAUX ---

  // Métal Argenté (Principal) - Comme demandé
  const hullMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: color || '#E3E4E5',
    metalness: 0.9,
    roughness: 0.2, // Très lisse et brillant
    envMapIntensity: 1.2
  }), [color]);

  // Métal Gris Foncé (Cadres, Skids, Grilles)
  const darkMetalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: secondaryColor || '#2c3e50',
    metalness: 0.8,
    roughness: 0.5
  }), [secondaryColor]);

  // Matériau Grille (Ventilation)
  const ventMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.5,
    roughness: 0.8,
    side: THREE.DoubleSide
  }), []);

  // Matériau Sol Technique (Antidérapant - noir mat)
  const rubberMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.9,
    metalness: 0.1
  }), []);

  // --- DIMENSIONS ---
  // Basé sur un conteneur 40ft High Cube élargi (E-House typique)
  const length = 12.192;
  const width = 3.5;
  const height = 3.2;
  const skidHeight = 0.3;

  // Calculs géométriques
  const totalHeight = height + skidHeight;
  const yCenter = totalHeight / 2;

  // Génération des nervures (Ribs) pour l'effet tôle ondulée
  const ribsCount = 20;
  const ribWidth = 0.1;
  const ribDepth = 0.05;
  const ribSpacing = length / ribsCount;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id || 'pb', e);
      }}
    >
      {/* 1. SKID (Socle en IPN) */}
      <group position={[0, skidHeight/2, 0]}>
         {/* Longues poutres (Longerons) */}
         <mesh position={[0, 0, width/2 - 0.2]} castShadow receiveShadow>
           <boxGeometry args={[length, skidHeight, 0.3]} />
           <primitive object={darkMetalMaterial} attach="material" />
         </mesh>
         <mesh position={[0, 0, -width/2 + 0.2]} castShadow receiveShadow>
           <boxGeometry args={[length, skidHeight, 0.3]} />
           <primitive object={darkMetalMaterial} attach="material" />
         </mesh>
         {/* Traverses (tous les 2m) */}
         {Array.from({ length: 6 }).map((_, i) => (
           <mesh key={`skid-${i}`} position={[-length/2 + 1 + i*2, 0, 0]} receiveShadow>
             <boxGeometry args={[0.2, skidHeight - 0.05, width - 0.6]} />
             <primitive object={darkMetalMaterial} attach="material" />
           </mesh>
         ))}
      </group>

      {/* 2. CORPS PRINCIPAL (E-HOUSE) */}
      <group position={[0, skidHeight + height/2, 0]}>
        {/* Boîte principale */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length, height, width]} />
          <primitive object={hullMaterial} attach="material" />
        </mesh>

        {/* Cadres de renfort aux extrémités */}
        <mesh position={[-length/2, 0, 0]}>
          <boxGeometry args={[0.2, height + 0.1, width + 0.1]} />
          <primitive object={darkMetalMaterial} attach="material" />
        </mesh>
        <mesh position={[length/2, 0, 0]}>
          <boxGeometry args={[0.2, height + 0.1, width + 0.1]} />
          <primitive object={darkMetalMaterial} attach="material" />
        </mesh>

        {/* Nervures Verticales (Effet Conteneur) */}
        {Array.from({ length: ribsCount }).map((_, i) => {
            const x = -length/2 + (i * ribSpacing) + ribSpacing/2;
            return (
                <group key={`rib-${i}`} position={[x, 0, 0]}>
                    {/* Face Sud */}
                    <mesh position={[0, 0, width/2 + ribDepth/2]}>
                        <boxGeometry args={[ribWidth, height - 0.2, ribDepth]} />
                        <primitive object={hullMaterial} attach="material" />
                    </mesh>
                    {/* Face Nord */}
                    <mesh position={[0, 0, -width/2 - ribDepth/2]}>
                        <boxGeometry args={[ribWidth, height - 0.2, ribDepth]} />
                        <primitive object={hullMaterial} attach="material" />
                    </mesh>
                </group>
            );
        })}
      </group>

      {/* 3. SYSTÈMES HVAC (Toiture) */}
      {/* 2 Grosses unités de clim industrielle */}
      {[ -3, 3 ].map((xPos, idx) => (
        <group key={`hvac-${idx}`} position={[xPos, skidHeight + height, 0]}>
            {/* Bloc Clim */}
            <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[2.5, 1.2, 2.5]} />
                <primitive object={hullMaterial} attach="material" />
            </mesh>
            {/* Grilles Ventilateurs (Dessus) */}
            <mesh position={[0.6, 1.21, 0.6]} rotation={[-Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
                <primitive object={ventMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.6, 1.21, -0.6]} rotation={[-Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
                <primitive object={ventMaterial} attach="material" />
            </mesh>
            {/* Détails techniques */}
            <mesh position={[0, 0.6, 1.3]}>
                <boxGeometry args={[2, 0.8, 0.1]} />
                <primitive object={ventMaterial} attach="material" />
            </mesh>
        </group>
      ))}

      {/* 4. PORTES ET ACCÈS */}
      {/* Double porte latérale centrale */}
      <group position={[0, skidHeight + height/2 - 0.2, width/2 + 0.06]}>
         <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 2.2]} />
            <primitive object={darkMetalMaterial} attach="material" />
         </mesh>
         {/* Poignées */}
         <mesh position={[0.1, 0, 0.05]}>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial color="silver" />
         </mesh>
         {/* Marchepied */}
         <mesh position={[0, -1.2, 0.4]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[2.2, 0.1, 0.8]} />
            <meshStandardMaterial color="#333" metalness={0.5} />
         </mesh>
      </group>

      {/* 5. TEXTE TECHNIQUE (Nom et Puissance) - SUPPRIMÉ
      <group position={[0, skidHeight + height - 0.6, width/2 + 0.1]}>
        <Text
            fontSize={0.6}
            color="#111"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#E3E4E5"
        >
            20MW E-HOUSE
        </Text>
        <Text
            position={[0, -0.5, 0]}
            fontSize={0.25}
            color="#333"
            anchorX="center"
            anchorY="middle"
        >
            HIGH VOLTAGE DISTRIBUTION
        </Text>
      </group>
      */}

      {/* 6. LABEL ID (Au dessus) - SUPPRIMÉ
      <group position={[0, height + 2.5, 0]}>
        <Text
            fontSize={1.2}
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="white"
            rotation={[0, 0, 0]} // Face avant
        >
            {id?.replace('PB', 'BLOCK ') || "20MW"}
        </Text>
        <Text
            fontSize={1.2}
            color="black"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="white"
            rotation={[0, Math.PI, 0]} // Face arrière
        >
            {id?.replace('PB', 'BLOCK ') || "20MW"}
        </Text>
      </group>
      */}

      {/* 7. CADRE DE SÉLECTION */}
      {isSelected && (
        <mesh position={[0, totalHeight/2, 0]}>
            <boxGeometry args={[length + 1, totalHeight + 1, width + 1]} />
            <meshBasicMaterial color="#cccccc" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}



