import React from 'react';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

interface LogisticsZoneProps extends GroupProps {
  length?: number; // La longueur totale imposée (28.9m)
  width?: number;  // Profondeur de la zone (ex: 6m)
}

export default function LogisticsZone({
  length = 28.9, // Valeur par défaut calculée (12.2 + 4.5 + 12.2)
  width = 6,
  ...props
}: LogisticsZoneProps) {

  const asphaltMaterial = new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.9, metalness: 0.1 });
  const paintMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff' });
  const yellowPaintMaterial = new THREE.MeshStandardMaterial({ color: '#f1c40f' });
  const redMaterial = new THREE.MeshStandardMaterial({ color: '#e74c3c' });

  // Répartition de l'espace (total ~40m maintenant)
  // On part de gauche (-length/2) vers la droite (+length/2)
  const truckSpotWidth = 6; // Plus raisonnable pour un camion
  const forkliftSpotWidth = 4;
  
  // Positions X relatives au centre
  // On colle les camions à gauche
  const xTruck1 = -length/2 + 2 + (truckSpotWidth/2); // Marge 2m
  const xTruck2 = -length/2 + 2 + truckSpotWidth + 2 + (truckSpotWidth/2);
  const xForklift = -length/2 + 2 + (truckSpotWidth*2) + 4 + (forkliftSpotWidth/2);
  
  // Le bâtiment occupe TOUT le reste à droite (immense)
  const xFireStart = xForklift + (forkliftSpotWidth/2) + 2;
  const fireZoneWidth = (length/2) - xFireStart - 1; // Reste jusqu'au bord droit (-1m marge)
  const xFire = xFireStart + (fireZoneWidth/2);

  return (
    <group {...props}>
      {/* 1. SOL GOUDRONNÉ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={asphaltMaterial}>
        <planeGeometry args={[length, width]} />
      </mesh>

      {/* --- PARKING CAMION 1 (EN 3D) --- */}
      <group position={[xTruck1, 0.02, 0]}>
        {/* Dalle Béton Surélevée */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
            <boxGeometry args={[truckSpotWidth - 0.5, 0.2, width - 2]} />
            <meshStandardMaterial color="#7f8c8d" roughness={0.6} />
        </mesh>
        
        {/* Butée de roue Massive (3D) */}
        <mesh position={[0, 0.3, -width/2 + 1.5]} castShadow material={yellowPaintMaterial}>
           <boxGeometry args={[3, 0.4, 0.4]} />
        </mesh>

        {/* Poteaux de protection (Bollards) aux coins */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
            // Pas possible de faire un forEach dans le JSX directement comme ça pour des meshes isolés sans return
        })}
        
        {/* Bollards Avant */}
        <mesh position={[-truckSpotWidth/2 + 0.5, 0.6, -width/2 + 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>
        <mesh position={[truckSpotWidth/2 - 0.5, 0.6, -width/2 + 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>

        {/* Bollards Arrière */}
        <mesh position={[-truckSpotWidth/2 + 0.5, 0.6, width/2 - 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>
        <mesh position={[truckSpotWidth/2 - 0.5, 0.6, width/2 - 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>

        <Text position={[0, 0.25, 0]} rotation={[-Math.PI/2, 0, Math.PI]} fontSize={1.2} color="white">
          TRUCK 1
        </Text>
      </group>

      {/* --- PARKING CAMION 2 (EN 3D) --- */}
      <group position={[xTruck2, 0.02, 0]}>
        {/* Dalle Béton Surélevée */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
            <boxGeometry args={[truckSpotWidth - 0.5, 0.2, width - 2]} />
            <meshStandardMaterial color="#7f8c8d" roughness={0.6} />
        </mesh>

        {/* Butée de roue Massive */}
        <mesh position={[0, 0.3, -width/2 + 1.5]} castShadow material={yellowPaintMaterial}>
           <boxGeometry args={[3, 0.4, 0.4]} />
        </mesh>

        {/* Bollards Avant */}
        <mesh position={[-truckSpotWidth/2 + 0.5, 0.6, -width/2 + 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>
        <mesh position={[truckSpotWidth/2 - 0.5, 0.6, -width/2 + 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>
        
        {/* Bollards Arrière */}
        <mesh position={[-truckSpotWidth/2 + 0.5, 0.6, width/2 - 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>
        <mesh position={[truckSpotWidth/2 - 0.5, 0.6, width/2 - 1]} castShadow material={yellowPaintMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
        </mesh>

        <Text position={[0, 0.25, 0]} rotation={[-Math.PI/2, 0, Math.PI]} fontSize={1.2} color="white">
          TRUCK 2
        </Text>
      </group>

      {/* --- PARKING FENWICK (CHARIOT) --- */}
      <group position={[xForklift, 0.02, 0]}>
        <mesh position={[-forkliftSpotWidth/2 + 0.2, 0, 0]} rotation={[-Math.PI/2, 0, 0]} material={paintMaterial}>
           <planeGeometry args={[0.2, width - 1]} />
        </mesh>
        {/* Zone de charge (Hachures jaunes) */}
        <mesh rotation={[-Math.PI/2, 0, 0]} material={yellowPaintMaterial}>
           <planeGeometry args={[forkliftSpotWidth - 0.5, width - 2]} />
        </mesh>
        <Text position={[0, 0.1, 1]} rotation={[-Math.PI/2, 0, Math.PI]} fontSize={0.6} color="black">
          FORKLIFT
        </Text>
        {/* Borne de recharge */}
        <mesh position={[0, 1, -width/2 + 0.5]} castShadow>
           <boxGeometry args={[0.8, 2, 0.5]} />
           <meshStandardMaterial color="#27ae60" />
        </mesh>
      </group>

      {/* --- POINT EXTINCTEUR (SIMPLE) --- */}
      <group position={[xFire, 0, 0]}>
        <mesh position={[-2.5 + 0.2, 0.02, 0]} rotation={[-Math.PI/2, 0, 0]} material={paintMaterial}>
           <planeGeometry args={[0.2, width - 1]} />
        </mesh>
        
        {/* Petit abri ouvert */}
        <mesh position={[0, 1.5, -width/2 + 1]} castShadow>
           <boxGeometry args={[3, 3, 1]} />
           <meshStandardMaterial color="#e74c3c" />
        </mesh>

        {/* Extincteurs sur Rack */}
        <group position={[0, 0.8, -width/2 + 1.2]}>
             <mesh position={[-1, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 1]} />
                <meshStandardMaterial color="#c0392b" />
             </mesh>
             <mesh position={[1, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 1]} />
                <meshStandardMaterial color="#c0392b" />
             </mesh>
        </group>
        
        <Text position={[0, 2, -width/2 + 1.6]} fontSize={0.4} color="white" rotation={[0, Math.PI, 0]}>
          FIRE POINT
        </Text>
        
        {/* Zone au sol rouge */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
           <planeGeometry args={[3, 3]} />
           <meshStandardMaterial color="#e74c3c" />
        </mesh>
      </group>

    </group>
  );
}



