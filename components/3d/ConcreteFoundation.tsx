/**
 * Dalle Béton de Fondation
 * Dalle de 40cm sous les containers pour stabilité
 */

import React from 'react';
import { Box } from '@react-three/drei';

interface ConcreteFoundationProps {
  position?: [number, number, number];
  dimensions?: [number, number, number];
}

export default function ConcreteFoundation({
  position = [0, 0, 0],
  dimensions = [12.5, 0.4, 3], // Légèrement plus large que le container
}: ConcreteFoundationProps) {
  return (
    <group position={position}>
      {/* Dalle principale */}
      <Box 
        args={dimensions} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#95a5a6" 
          roughness={0.9} 
          metalness={0.1}
        />
      </Box>
      
      {/* Armatures visibles sur les bords */}
      <Box 
        args={[dimensions[0] + 0.1, 0.05, dimensions[2] + 0.1]} 
        position={[0, dimensions[1] / 2 + 0.025, 0]}
      >
        <meshStandardMaterial 
          color="#7f8c8d" 
          roughness={0.7} 
          metalness={0.3}
        />
      </Box>
    </group>
  );
}

/**
 * Dalle béton 40cm standard pour container HD5
 */
export function ConcreteSlabHD5({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  // Dimensions: container HD5 = 12.196m × 2.438m
  // Dalle: +30cm de chaque côté = 12.8m × 3m × 0.4m
  return (
    <ConcreteFoundation
      position={position}
      dimensions={[12.8, 0.4, 3]}
    />
  );
}

/**
 * Dalle béton pour transformer
 */
export function ConcreteSlabTransformer({
  position = [0, 0, 0],
}: {
  position?: [number, number, number];
}) {
  // Dimensions transformer: 4.5m × 3.5m
  // Dalle: +30cm de chaque côté = 5.1m × 4.1m × 0.4m
  return (
    <ConcreteFoundation
      position={position}
      dimensions={[5.1, 0.4, 4.1]}
    />
  );
}
