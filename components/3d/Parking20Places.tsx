import React, { useMemo } from 'react';
import { Box, Text } from '@react-three/drei';
import { GroupProps } from '@react-three/fiber';

interface Parking20PlacesProps extends GroupProps {
  showNumbers?: boolean;
}

const PARKING_SPOT_WIDTH = 2.5;
const PARKING_SPOT_DEPTH = 5;
const LANE_WIDTH = 6;

export default function Parking20Places({ 
  showNumbers = true, 
  ...props 
}: Parking20PlacesProps) {
  
  // Dimensions totales
  const totalWidth = 10 * PARKING_SPOT_WIDTH; // 10 places de large = 25m
  const totalDepth = (PARKING_SPOT_DEPTH * 2) + LANE_WIDTH; // 5m + 6m + 5m = 16m

  // Générer les places
  const spots = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const isTopRow = i < 10;
      const colIndex = isTopRow ? i : i - 10;
      
      // Calcul de la position X (centré autour de 0)
      // On commence à gauche (-totalWidth/2) et on avance
      const x = (colIndex * PARKING_SPOT_WIDTH) - (totalWidth / 2) + (PARKING_SPOT_WIDTH / 2);
      
      // Calcul de la position Z
      // Top row : z négatif (au-dessus de la route centrale)
      // Bottom row : z positif
      const zOffset = (LANE_WIDTH / 2) + (PARKING_SPOT_DEPTH / 2);
      const z = isTopRow ? -zOffset : zOffset;
      
      // Rotation : Top row regarde vers le bas (PI), Bottom row regarde vers le haut (0)
      // Note: cela dépend de l'orientation souhaitée pour les voitures/textes
      const rotY = isTopRow ? Math.PI : 0;

      return { id: i + 1, position: [x, 0.02, z] as [number, number, number], rotation: [0, rotY, 0] as [number, number, number] };
    });
  }, [totalWidth]);

  return (
    <group {...props}>
      {/* --- SOL ASPHALTE --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[totalWidth + 2, totalDepth + 2]} />
        <meshStandardMaterial 
          color="#333333" 
          roughness={0.8} 
          metalness={0.1} 
        />
      </mesh>

      {/* --- MARQUAGES BLANCS (Lignes) --- */}
      {/* On dessine les lignes de séparation. Il y a 11 lignes pour 10 places. */}
      {Array.from({ length: 11 }).map((_, i) => {
        const x = (i * PARKING_SPOT_WIDTH) - (totalWidth / 2);
        return (
          <group key={`lines-${i}`}>
            {/* Ligne Haut */}
            <mesh position={[x, 0.03, -(LANE_WIDTH / 2) - (PARKING_SPOT_DEPTH / 2)]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[0.15, PARKING_SPOT_DEPTH]} />
              <meshBasicMaterial color="white" />
            </mesh>
            {/* Ligne Bas */}
            <mesh position={[x, 0.03, (LANE_WIDTH / 2) + (PARKING_SPOT_DEPTH / 2)]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[0.15, PARKING_SPOT_DEPTH]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        );
      })}

      {/* --- PLACES & NUMÉROS --- */}
      {spots.map((spot) => (
        <group key={spot.id} position={spot.position} rotation={spot.rotation}>
          {/* Butée de roue (Wheel stop) */}
          <Box args={[1.8, 0.1, 0.2]} position={[0, 0.05, (PARKING_SPOT_DEPTH/2) - 0.5]}>
             <meshStandardMaterial color="#eeeeee" />
          </Box>

          {/* Numéro de la place */}
          {showNumbers && (
            <Text
              position={[0, 0.04, 0]}
              rotation={[-Math.PI / 2, 0, Math.PI]} // À plat sur le sol, orienté vers le conducteur
              fontSize={1}
              color="white"
              fillOpacity={0.6}
            >
              {spot.id}
            </Text>
          )}

          {/* Helper visuel invisible pour le raycasting si besoin */}
          <mesh visible={false}>
            <planeGeometry args={[PARKING_SPOT_WIDTH, PARKING_SPOT_DEPTH]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}



