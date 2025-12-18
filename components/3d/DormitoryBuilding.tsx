import React from 'react';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

interface DormitoryBuildingProps extends GroupProps {
  width?: number; // Largeur (X)
  length?: number; // Profondeur (Z)
  height?: number; // Hauteur
}

export default function DormitoryBuilding({
  width = 40,
  length = 12,
  height = 7, // R+1 (~3.5m par étage)
  ...props
}: DormitoryBuildingProps) {

  // Matériaux
  const wallColor = '#ecf0f1';
  const doorColor = '#2c3e50';
  const railColor = '#95a5a6';
  
  const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.6 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#7f8c8d', roughness: 0.9 }); // Béton
  const roofMaterial = new THREE.MeshStandardMaterial({ color: '#34495e', roughness: 0.8 });

  // Paramètres modules
  const roomWidth = 4; // Largeur d'une chambre
  const nbRooms = Math.floor(width / roomWidth);
  const floorHeight = height / 2;
  const walkwayDepth = 1.5; // Largeur coursive

  // Générateur de façade (Porte + Fenêtre par chambre)
  const Facade = ({ levelY }: { levelY: number }) => (
    <group position={[0, levelY, length/2]}> {/* Façade Avant */}
      {Array.from({ length: nbRooms }).map((_, i) => {
        const x = -width/2 + (i * roomWidth) + (roomWidth/2);
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Porte */}
            <mesh position={[-0.8, 1.1, 0.05]} castShadow>
              <boxGeometry args={[0.9, 2.1, 0.1]} />
              <meshStandardMaterial color={doorColor} />
            </mesh>
            {/* Fenêtre */}
            <mesh position={[0.8, 1.4, 0.05]}>
              <boxGeometry args={[1.0, 1.2, 0.1]} />
              <meshStandardMaterial color="#87CEEB" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );

  // Coursive (Balcon)
  const Walkway = ({ levelY }: { levelY: number }) => (
    <group position={[0, levelY, length/2 + walkwayDepth/2]}>
      {/* Sol Coursive */}
      <mesh receiveShadow material={floorMaterial}>
        <boxGeometry args={[width, 0.2, walkwayDepth]} />
      </mesh>
      {/* Garde-corps */}
      <mesh position={[0, 0.6, walkwayDepth/2]} material={new THREE.MeshStandardMaterial({ color: railColor })}>
        <boxGeometry args={[width, 1.1, 0.05]} />
      </mesh>
      {/* Poteaux support */}
      {Array.from({ length: nbRooms + 1 }).map((_, i) => {
         const x = -width/2 + (i * roomWidth);
         return (
           <mesh key={`post-${i}`} position={[x, 0.5, walkwayDepth/2]} material={new THREE.MeshStandardMaterial({ color: railColor })}>
             <boxGeometry args={[0.1, 1.1, 0.1]} />
           </mesh>
         );
      })}
    </group>
  );

  return (
    <group {...props}>
      {/* Corps principal */}
      <mesh position={[0, height/2, 0]} castShadow receiveShadow material={wallMaterial}>
        <boxGeometry args={[width, height, length]} />
      </mesh>

      {/* Toit */}
      <mesh position={[0, height + 0.2, 0]} castShadow receiveShadow material={roofMaterial}>
        <boxGeometry args={[width + 1, 0.4, length + 3]} /> {/* Déborde pour couvrir coursives */}
      </mesh>

      {/* RDC */}
      <Facade levelY={0} />
      {/* Coursive RDC (Trottoir) */}
      <Walkway levelY={0.1} />

      {/* Étage 1 */}
      <Facade levelY={floorHeight} />
      <Walkway levelY={floorHeight} />

      {/* Escalier latéral (sommaire) */}
      <group position={[width/2 + 1, floorHeight/2, length/2 + walkwayDepth/2]}>
         <mesh rotation={[0, 0, 0.5]} material={new THREE.MeshStandardMaterial({ color: railColor })}>
            <boxGeometry args={[1, 5, 1]} />
         </mesh>
      </group>

    </group>
  );
}



