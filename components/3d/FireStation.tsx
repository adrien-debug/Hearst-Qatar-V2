import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

export default function FireStation(props: GroupProps) {
  // Dimensions ajustées "Taille Nécessaire" pour 3 véhicules
  const depth = 14;  // Profondeur (Z)
  const width = 18;  // Largeur Façade (X)

  return (
    <group {...props}>
        {/* Abri Principal (Gris Anthracite - Style Industriel) */}
        <mesh position={[0, 3, 0]} castShadow>
           <boxGeometry args={[width, 6, depth - 0.5]} />
           <meshStandardMaterial color="#2d3436" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Portes de Garage (3 grandes portes ajustées) */}
        <group position={[0, 2, depth/2 - 0.25 + 0.1]}>
            {[-width/3.5, 0, width/3.5].map((offset, i) => (
                <group key={i} position={[offset, 0, 0]}>
                     {/* Cadre porte */}
                     <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[4, 4]} />
                        <meshStandardMaterial color="#bdc3c7" metalness={0.5} roughness={0.7} /> 
                     </mesh>
                     {/* Vitrage porte */}
                     <mesh position={[0, 1, 0.01]}>
                        <planeGeometry args={[3.5, 1]} />
                        <meshStandardMaterial color="#3498db" transparent opacity={0.5} />
                     </mesh>
                     {/* Volet roulant texture (lignes) */}
                     <mesh position={[0, -1, 0.01]}>
                        <planeGeometry args={[3.5, 2.8]} />
                        <meshStandardMaterial color="#95a5a6" />
                     </mesh>
                </group>
            ))}
        </group>

        {/* Bandeau Rouge Technique */}
        <mesh position={[0, 5, depth/2 - 0.25 + 0.2]}>
           <boxGeometry args={[width, 0.8, 0.1]} />
           <meshStandardMaterial color="#c0392b" emissive="#c0392b" emissiveIntensity={0.2} />
        </mesh>
        
        {/* Toit Débordant */}
        <mesh position={[0, 6.1, 0]} castShadow>
           <boxGeometry args={[width + 1, 0.2, depth + 1]} />
           <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>

        {/* Signalétique */}
        <Text position={[0, 5, depth/2]} fontSize={0.6} color="white" anchorX="center" anchorY="middle">
          EMERGENCY
        </Text>
        
        {/* Zone au sol : Marquage de sécurité devant les portes */}
        <mesh position={[0, 0.03, depth/2 + 2]} rotation={[-Math.PI/2, 0, 0]}>
           <planeGeometry args={[width, 4]} />
           <meshStandardMaterial color="#34495e" />
        </mesh>
    </group>
  );
}


