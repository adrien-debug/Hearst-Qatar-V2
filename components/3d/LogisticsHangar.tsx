import React, { useMemo } from 'react';
import { Box, Cylinder, Plane } from '@react-three/drei';
import * as THREE from 'three';

export const LogisticsHangar = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1 
}: { 
  position?: [number, number, number], 
  rotation?: [number, number, number], 
  scale?: number 
}) => {
  
  // Dimensions du hangar
  const width = 60;  // Largeur
  const depth = 40;  // Profondeur
  const height = 12; // Hauteur
  const dockHeight = 1.3; // Hauteur standard de quai de chargement

  // Matériaux
  const wallMaterial = new THREE.MeshStandardMaterial({ color: "#e0e0e0", roughness: 0.7 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: "#505050", roughness: 0.9 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: "#808080", roughness: 0.8 });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: "#304050", roughness: 0.4, metalness: 0.3 });
  const safetyMaterial = new THREE.MeshStandardMaterial({ color: "#facc15", emissive: "#d97706", emissiveIntensity: 0.2 });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: "#71717a", metalness: 0.8, roughness: 0.2 });

  // Génération des quais de chargement
  const loadingBays = useMemo(() => {
    const bays = [];
    const bayCount = 6;
    const spacing = 8;
    const startX = -((bayCount - 1) * spacing) / 2;

    for (let i = 0; i < bayCount; i++) {
      bays.push(
        <group key={i} position={[startX + i * spacing, dockHeight, depth / 2 + 0.1]}>
          {/* Porte sectionnelle (fermée ou semi-ouverte) */}
          <Box args={[4, 5, 0.2]} position={[0, 2.5, 0]} material={doorMaterial}>
             {/* Stries de la porte */}
             {[...Array(10)].map((_, j) => (
                <Box key={j} args={[3.8, 0.05, 0.25]} position={[0, -2.2 + j * 0.5, 0]} material={new THREE.MeshStandardMaterial({ color: "#1e293b" })} />
             ))}
          </Box>
          
          {/* Joint d'étanchéité (Seal) */}
          <Box args={[4.5, 5.5, 0.3]} position={[0, 2.5, -0.1]} material={new THREE.MeshStandardMaterial({ color: "#111", roughness: 1 })} />

          {/* Butoirs en caoutchouc */}
          <Box args={[0.3, 0.6, 0.4]} position={[-2.2, 0.3, 0.2]} material={new THREE.MeshStandardMaterial({ color: "black" })} />
          <Box args={[0.3, 0.6, 0.4]} position={[2.2, 0.3, 0.2]} material={new THREE.MeshStandardMaterial({ color: "black" })} />

          {/* Bollards de protection jaunes */}
          <Cylinder args={[0.15, 0.15, 1.5]} position={[-2.8, 0, 2]} material={safetyMaterial} />
          <Cylinder args={[0.15, 0.15, 1.5]} position={[2.8, 0, 2]} material={safetyMaterial} />

          {/* Numéro de quai */}
          <group position={[0, 6, 0.2]}>
             <Box args={[1, 1, 0.1]} material={new THREE.MeshStandardMaterial({ color: "white" })} />
             {/* Note: Pour du texte réel, utiliser Text de Drei, ici simulation visuelle */}
             <Box args={[0.6, 0.1, 0.11]} material={new THREE.MeshStandardMaterial({ color: "black" })} />
          </group>

          {/* Guides au sol pour camions */}
          <Plane args={[0.2, 10]} rotation={[-Math.PI/2, 0, 0]} position={[-1.5, -dockHeight + 0.02, 6]} material={new THREE.MeshStandardMaterial({ color: "yellow" })} />
          <Plane args={[0.2, 10]} rotation={[-Math.PI/2, 0, 0]} position={[1.5, -dockHeight + 0.02, 6]} material={new THREE.MeshStandardMaterial({ color: "yellow" })} />
        </group>
      );
    }
    return bays;
  }, [doorMaterial, safetyMaterial]);

  return (
    <group position={new THREE.Vector3(...position)} rotation={new THREE.Euler(...rotation)} scale={scale}>
      
      {/* Bâtiment Principal */}
      <group position={[0, height / 2, 0]}>
        {/* Murs */}
        <Box args={[width, height, depth]} material={wallMaterial} />
        
        {/* Toit (Légèrement en pente ou structuré) */}
        <group position={[0, height / 2, 0]}>
           <Box args={[width + 2, 0.5, depth + 2]} material={roofMaterial} />
           {/* Puits de lumière / Ventilation */}
           {[...Array(4)].map((_, i) => (
             <Box key={i} args={[width - 4, 1, 4]} position={[0, 0.5, -depth/3 + i * (depth/5)]} material={new THREE.MeshStandardMaterial({ color: "#88ccff", transparent: true, opacity: 0.6, roughness: 0.2 })} />
           ))}
        </group>

        {/* Structure métallique apparente sur les côtés */}
        {[...Array(6)].map((_, i) => {
            const xPos = -width/2 + 1 + i * ((width-2)/5);
            return (
                <group key={i}>
                    <Box args={[1, height, 1]} position={[xPos, 0, depth/2]} material={metalMaterial} />
                    <Box args={[1, height, 1]} position={[xPos, 0, -depth/2]} material={metalMaterial} />
                </group>
            )
        })}
      </group>

      {/* Plateforme de quai (Surélévation) */}
      <Box args={[width + 4, dockHeight, depth + 4]} position={[0, dockHeight / 2, 0]} material={floorMaterial} />

      {/* Auvent au-dessus des quais */}
      <group position={[0, 8, depth / 2 + 2.5]}>
        <Box args={[width, 0.2, 5]} material={metalMaterial} />
        {/* Supports de l'auvent */}
        {[...Array(6)].map((_, i) => {
             const xPos = -width/2 + 2 + i * ((width-4)/5);
             return <Cylinder key={i} args={[0.1, 0.1, 4]} rotation={[Math.PI/4, 0, 0]} position={[xPos, -1.5, -1.5]} material={metalMaterial} />
        })}
      </group>

      {/* Les baies de chargement */}
      {loadingBays}

      {/* Rampe d'accès (sur le côté) */}
      <group position={[width / 2 + 4, dockHeight / 2, depth / 2 - 5]}>
         {/* Pente */}
         <Box args={[4, dockHeight, 10]} rotation={[0.15, 0, 0]} position={[0, -0.4, 6]} material={floorMaterial} />
         {/* Garde-corps */}
         <Box args={[0.1, 1, 10]} position={[-1.9, 0.5, 6]} rotation={[0.15, 0, 0]} material={metalMaterial} />
         <Box args={[0.1, 1, 10]} position={[1.9, 0.5, 6]} rotation={[0.15, 0, 0]} material={metalMaterial} />
      </group>
      
      {/* Zone bétonnée devant pour les manœuvres */}
      <Plane args={[width + 10, 20]} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.01, depth/2 + 10]} material={new THREE.MeshStandardMaterial({ color: "#555", roughness: 0.9 })} />

    </group>
  );
};


