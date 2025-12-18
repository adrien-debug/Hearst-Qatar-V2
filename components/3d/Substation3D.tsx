/**
 * Substation 3D - Version Simplifiée
 * Représentation procédurale d'une substation 200MW
 */

import React from 'react';
import { Box } from '@react-three/drei';

interface Substation3DProps {
  substationId?: string;
  position?: [number, number, number];
}

export default function Substation3D({
  substationId = 'substation-main',
  position = [0, 0.5, 0],
}: Substation3DProps) {
  return (
    <group position={position} name={substationId}>
      {/* Structure principale de la substation */}
      <Box 
        args={[40, 30, 15]} 
        position={[0, 15, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#6b7280" 
          metalness={0.8}
          roughness={0.4}
        />
      </Box>
      
      {/* Toit */}
      <Box 
        args={[42, 2, 17]} 
        position={[0, 31, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color="#4b5563" 
          metalness={0.6}
          roughness={0.5}
        />
      </Box>
      
      {/* Transformateurs haute tension (4 unités) */}
      {[-15, -5, 5, 15].map((x, i) => (
        <group key={i} position={[x, 0, -10]}>
          <Box 
            args={[6, 8, 6]} 
            position={[0, 4, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial 
              color="#059669" 
              metalness={0.7}
              roughness={0.3}
            />
          </Box>
          
          {/* Isolateurs */}
          <mesh position={[0, 9, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* Panneaux de contrôle */}
      <Box 
        args={[35, 10, 1]} 
        position={[0, 5, 8]}
        castShadow
      >
        <meshStandardMaterial 
          color="#1f2937" 
          metalness={0.5}
          roughness={0.6}
        />
      </Box>
      
      {/* Lumières de signalisation */}
      <pointLight position={[0, 32, 0]} intensity={0.5} distance={50} color="#8AFD81" />
    </group>
  );
}
