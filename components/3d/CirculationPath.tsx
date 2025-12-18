/**
 * Voies de Circulation
 * Allées de 3m autour des équipements
 */

import React from 'react';
import { Box } from '@react-three/drei';

interface CirculationPathProps {
  start: [number, number, number];
  end: [number, number, number];
  width?: number;
  isMainPath?: boolean;
}

export default function CirculationPath({
  start,
  end,
  width = 3,
  isMainPath = false,
}: CirculationPathProps) {
  // Calculer la longueur et l'orientation
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  return (
    <group position={[midX, 0.01, midZ]} rotation={[0, angle, 0]}>
      <Box 
        args={[length, 0.02, width]} 
        receiveShadow
      >
        <meshStandardMaterial 
          color={isMainPath ? "#333333" : "#7f8c8d"} 
          roughness={0.8} 
          metalness={0.1}
        />
      </Box>
      
      {/* Marquages au sol */}
      <Box 
        args={[length, 0.03, 0.1]} 
        position={[0, 0.02, width / 2 - 0.2]}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </Box>
      <Box 
        args={[length, 0.03, 0.1]} 
        position={[0, 0.02, -width / 2 + 0.2]}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </Box>
    </group>
  );
}

/**
 * Réseau de circulation autour d'un équipement
 */
export function CirculationNetwork({
  centerPosition,
  equipmentDimensions,
  width = 3,
}: {
  centerPosition: [number, number, number];
  equipmentDimensions: [number, number, number];
  width?: number;
}) {
  const [cx, cy, cz] = centerPosition;
  const [w, h, d] = equipmentDimensions;
  
  const offset = width / 2 + Math.max(w, d) / 2;

  return (
    <group>
      {/* Nord */}
      <CirculationPath
        start={[cx - offset, cy, cz + offset]}
        end={[cx + offset, cy, cz + offset]}
        width={width}
      />
      
      {/* Sud */}
      <CirculationPath
        start={[cx - offset, cy, cz - offset]}
        end={[cx + offset, cy, cz - offset]}
        width={width}
      />
      
      {/* Est */}
      <CirculationPath
        start={[cx + offset, cy, cz - offset]}
        end={[cx + offset, cy, cz + offset]}
        width={width}
      />
      
      {/* Ouest */}
      <CirculationPath
        start={[cx - offset, cy, cz - offset]}
        end={[cx - offset, cy, cz + offset]}
        width={width}
      />
    </group>
  );
}
