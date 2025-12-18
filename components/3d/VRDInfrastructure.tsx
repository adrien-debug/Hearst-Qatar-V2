/**
 * Infrastructure VRD (Voirie et Réseaux Divers) - VERSION TECHNIQUE PBR
 * Composants 3D avec matériaux réalistes pour rendu ingénierie
 */

import React, { useMemo, useEffect } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { createAsphaltTexture, createConcreteTexture, createGrayMetalTexture } from '../../utils/textureHelpers';
import { progressiveTextureLoader } from '../../utils/progressiveTextureLoader';
import { safeAssignTexture } from '../../utils/materialHelpers';
import { getOptimalTextureSize } from '../../utils/textureCache';

// --- MATÉRIAUX TECHNIQUES REUTILISABLES ---
// Nous utilisons une factory pour les matériaux afin de pouvoir les initialiser avec les textures

// Hook pour initialiser les matériaux globaux UNE SEULE FOIS
const useVRDMaterials = () => {
  const materials = useMemo(() => {
    // 1. Béton Industriel (Murs, Fondations)
    const concrete = new THREE.MeshStandardMaterial({
      color: '#8c8c8c',
      roughness: 0.9,
      metalness: 0.1,
    });

    // 2. Asphalte Voirie (Routes)
    const asphalt = new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      roughness: 0.9,
      metalness: 0.0,
    });

    // 3. Acier Galvanisé (Clôtures, Portails)
    const galvanized = new THREE.MeshStandardMaterial({
      color: '#a0a0a0',
      roughness: 0.4,
      metalness: 0.6,
    });

    // 4. Acier Peint (Structures, Hangars)
    const painted = new THREE.MeshStandardMaterial({
      color: '#2d3436',
      roughness: 0.5,
      metalness: 0.3,
    });

    // 5. Marquage au sol
    const marking = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.8,
      emissive: '#ffffff',
      emissiveIntensity: 0.2,
    });

    return { concrete, asphalt, galvanized, painted, marking };
  }, []);

  // Chargement asynchrone des textures
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const textureSize = getOptimalTextureSize(); // 512, 1024, ou 2048 selon GPU

    // 1. Texture Béton
    progressiveTextureLoader.loadProgressive(
      () => createConcreteTexture(256) || new THREE.Texture(),
      () => createConcreteTexture(textureSize) || new THREE.Texture(),
      `concrete_tex_${textureSize}`,
      { priority: 'medium' }
    ).then(texture => {
      if (texture && texture.image) {
        safeAssignTexture(materials.concrete, 'map', texture);
        safeAssignTexture(materials.concrete, 'roughnessMap', texture); // On réutilise pour la rugosité
        materials.concrete.needsUpdate = true;
      }
    });

    // 2. Texture Asphalte
    progressiveTextureLoader.loadProgressive(
      () => createAsphaltTexture(256) || new THREE.Texture(),
      () => createAsphaltTexture(textureSize) || new THREE.Texture(),
      `asphalt_tex_${textureSize}`,
      { priority: 'medium' }
    ).then(texture => {
      if (texture && texture.image) {
        safeAssignTexture(materials.asphalt, 'map', texture);
        safeAssignTexture(materials.asphalt, 'roughnessMap', texture);
        materials.asphalt.needsUpdate = true;
      }
    });

    // 3. Texture Métal Galvanisé
    progressiveTextureLoader.loadProgressive(
      () => createGrayMetalTexture(256) || new THREE.Texture(),
      () => createGrayMetalTexture(textureSize) || new THREE.Texture(),
      `metal_tex_${textureSize}`,
      { priority: 'low' }
    ).then(texture => {
      if (texture && texture.image) {
        safeAssignTexture(materials.galvanized, 'map', texture);
        safeAssignTexture(materials.galvanized, 'roughnessMap', texture);
        safeAssignTexture(materials.galvanized, 'metalnessMap', texture);
        materials.galvanized.needsUpdate = true;
      }
    });

  }, [materials]);

  return materials;
};


/**
 * Mur d'enceinte - Béton technique
 */
export function PerimeterWall({ 
  width = 220, 
  depth = 95, 
  height = 4, 
  thickness = 0.3,
  position = [0, 0, -37.5] as [number, number, number],
  color = '#8c8c8c',
  microPerforated = false,
  hasGrid = false,
  materials // Injecté
}: any) {
  const WallSection = ({ args, pos }: { args: [number, number, number]; pos: [number, number, number] }) => (
    <group position={pos}>
      <Box args={args} castShadow receiveShadow>
        <primitive object={materials.concrete} attach="material" />
      </Box>
      
      {hasGrid && (
        <>
          {Array.from({ length: Math.floor(args[1] / 0.5) }).map((_, i) => (
            <Box 
              key={`h-${i}`}
              args={[args[0], 0.02, 0.02]} 
              position={[0, -args[1] / 2 + i * 0.5, args[2] / 2 + 0.02]}
            >
              <primitive object={materials.galvanized} attach="material" />
            </Box>
          ))}
          {Array.from({ length: Math.floor(args[0] / 0.5) }).map((_, i) => (
            <Box 
              key={`v-${i}`}
              args={[0.02, args[1], 0.02]} 
              position={[-args[0] / 2 + i * 0.5, 0, args[2] / 2 + 0.02]}
            >
              <primitive object={materials.galvanized} attach="material" />
            </Box>
          ))}
        </>
      )}
    </group>
  );
  
  return (
    <group position={position}>
      <WallSection args={[width, height, thickness]} pos={[0, height / 2, depth / 2]} />
      <WallSection args={[width, height, thickness]} pos={[0, height / 2, -depth / 2]} />
      <WallSection args={[thickness, height, depth]} pos={[-width / 2, height / 2, 0]} />
      <WallSection args={[thickness, height, depth]} pos={[width / 2, height / 2, 0]} />
    </group>
  );
}

/**
 * Portail coulissant - Acier technique
 */
export function EntranceGate({ 
  width = 8, 
  height = 4, 
  position = [0, 0, 10] as [number, number, number],
  isOpen = false,
  color = '#2d3436',
  materials // Injecté
}: any) {
  const slideOffset = isOpen ? width : 0;
  
  return (
    <group position={position}>
      <Box 
        args={[width / 2, height, 0.2]} 
        position={[-width / 4 - slideOffset / 2, height / 2, 0]}
        castShadow
      >
        <primitive object={materials.painted} attach="material" />
      </Box>
      
      <Box 
        args={[width / 2, height, 0.2]} 
        position={[width / 4 + slideOffset / 2, height / 2, 0]}
        castShadow
      >
        <primitive object={materials.painted} attach="material" />
      </Box>
      
      {/* Rails */}
      <Box 
        args={[width * 2, 0.1, 0.3]} 
        position={[0, 0.05, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#7f8c8d" roughness={0.4} metalness={0.6} />
      </Box>
    </group>
  );
}

/**
 * Poste de garde
 */
export function GuardHouse({ 
  dimensions = [4, 3, 3] as [number, number, number],
  position = [5, 0, 10] as [number, number, number],
  color = '#34495e',
  materials // Injecté
}: any) {
  const [width, height, depth] = dimensions;
  
  return (
    <group position={position}>
      <Box 
        args={[width, height, depth]} 
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.concrete} attach="material" />
      </Box>
      <Box 
        args={[width + 0.2, 0.3, depth + 0.2]} 
        position={[0, height + 0.15, 0]}
        castShadow
      >
        <primitive object={materials.painted} attach="material" />
      </Box>
      <Box 
        args={[2, 1, 0.05]} 
        position={[0, height / 2, depth / 2 + 0.01]}
      >
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
      </Box>
    </group>
  );
}

/**
 * Barrière de sécurité
 */
export function SecurityBarrier({ 
  position = [0, 0, 0] as [number, number, number],
  isRaised = false,
  color = '#e74c3c',
  materials // Injecté
}: any) {
  const rotation: [number, number, number] = isRaised ? [-Math.PI / 2, 0, 0] : [0, 0, 0];
  return (
    <group position={position}>
      <Cylinder args={[0.15, 0.15, 1.5, 16]} position={[0, 0.75, 0]} castShadow>
        <primitive object={materials.galvanized} attach="material" />
      </Cylinder>
      <Box args={[3, 0.1, 0.1]} position={[1.5, 1.5, 0]} rotation={rotation} castShadow>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </Box>
      {[0, 0.6, 1.2, 1.8, 2.4].map((offset, i) => (
        <Box key={i} args={[0.2, 0.12, 0.12]} position={[offset, 1.5, 0]} rotation={rotation}>
          <primitive object={materials.marking} attach="material" />
        </Box>
      ))}
    </group>
  );
}

/**
 * Logo Hearst 3D
 */
export function HearstLogo3D({ 
  position = [0, 3, 12] as [number, number, number],
  scale = 2,
  color = '#ffffff',
  materials // Injecté
}: any) {
  return (
    <group position={position} scale={scale}>
      <Box args={[6, 2, 0.2]} castShadow>
        <primitive object={materials.painted} attach="material" />
      </Box>
      <Box args={[5, 1.5, 0.3]} position={[0, 0, 0.2]} castShadow>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
      </Box>
    </group>
  );
}

/**
 * Route Asphaltée - Rendu Technique
 */
export function AsphaltRoad({ 
  length = 50, 
  width = 7, 
  position = [0, 0, 0] as [number, number, number],
  orientation = 'vertical' as 'horizontal' | 'vertical',
  showMarkings = true,
  materials // Injecté
}: any) {
  const dimensions: [number, number, number] = orientation === 'vertical' 
    ? [width, 0.1, length] 
    : [length, 0.1, width];
  
  return (
    <group position={position}>
      {/* Surface bitume */}
      <Box args={dimensions} position={[0, 0.05, 0]} receiveShadow>
        <primitive object={materials.asphalt} attach="material" />
      </Box>
      
      {/* Marquages */}
      {showMarkings && (
        <Box 
          args={orientation === 'vertical' ? [0.15, 0.11, length] : [length, 0.11, 0.15]} 
          position={[0, 0.11, 0]}
        >
          <primitive object={materials.marking} attach="material" />
        </Box>
      )}
      {showMarkings && (
        <>
          <Box 
            args={orientation === 'vertical' ? [0.1, 0.11, length] : [length, 0.11, 0.1]} 
            position={orientation === 'vertical' ? [-width / 2 + 0.2, 0.11, 0] : [0, 0.11, -width / 2 + 0.2]}
          >
            <primitive object={materials.marking} attach="material" />
          </Box>
          <Box 
            args={orientation === 'vertical' ? [0.1, 0.11, length] : [length, 0.11, 0.1]} 
            position={orientation === 'vertical' ? [width / 2 - 0.2, 0.11, 0] : [0, 0.11, width / 2 - 0.2]}
          >
            <primitive object={materials.marking} attach="material" />
          </Box>
        </>
      )}
    </group>
  );
}

/**
 * Route Béton
 */
export function ConcreteRoad({ 
  length = 95, 
  width = 6, 
  position = [0, 0, 0] as [number, number, number],
  orientation = 'vertical' as 'horizontal' | 'vertical',
  materials // Injecté
}: any) {
  const dimensions: [number, number, number] = orientation === 'vertical' 
    ? [width, 0.1, length] 
    : [length, 0.1, width];
  
  return (
    <Box 
      args={dimensions} 
      position={[position[0], position[1] + 0.05, position[2]]}
      receiveShadow
    >
      <primitive object={materials.concrete} attach="material" />
    </Box>
  );
}

/**
 * Hangar de Maintenance
 */
export function MaintenanceHangar({ 
  dimensions = [30, 8, 20] as [number, number, number],
  position = [-100, 0, -20] as [number, number, number],
  color = '#34495e',
  materials // Injecté
}: any) {
  const [width, height, depth] = dimensions;
  return (
    <group position={position}>
      <Box args={[width, height, depth]} position={[0, height / 2, 0]} castShadow receiveShadow>
        <primitive object={materials.painted} attach="material" />
      </Box>
      <Box args={[width + 0.5, 0.5, depth + 0.5]} position={[0, height + 0.25, 0]} castShadow>
        <primitive object={materials.painted} attach="material" />
      </Box>
      {[-10, 0, 10].map((offset, i) => (
        <Box key={i} args={[8, 6, 0.2]} position={[offset, 3, depth / 2 + 0.1]} castShadow>
          <primitive object={materials.galvanized} attach="material" />
        </Box>
      ))}
    </group>
  );
}

/**
 * Parking
 */
export function ParkingArea({ 
  dimensions = [30, 20] as [number, number],
  position = [-100, 0, -20] as [number, number, number],
  spots = 40,
  rows = 2,
  materials // Injecté
}: any) {
  const [width, depth] = dimensions;
  const spotsPerRow = spots / rows;
  const spotWidth = 2.5;
  const spotDepth = 5;
  
  return (
    <group position={position}>
      <Box args={[width, 0.1, depth]} position={[0, 0.05, 0]} receiveShadow>
        <primitive object={materials.asphalt} attach="material" />
      </Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <group key={rowIndex}>
          {Array.from({ length: spotsPerRow }).map((_, spotIndex) => {
            const x = -width / 2 + spotWidth / 2 + spotIndex * spotWidth;
            const z = -depth / 2 + spotDepth / 2 + rowIndex * spotDepth;
            return (
              <group key={spotIndex}>
                <Box args={[spotWidth, 0.11, 0.1]} position={[x, 0.11, z - spotDepth / 2]}>
                  <primitive object={materials.marking} attach="material" />
                </Box>
                <Box args={[0.1, 0.11, spotDepth]} position={[x - spotWidth / 2, 0.11, z]}>
                  <primitive object={materials.marking} attach="material" />
                </Box>
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}

/**
 * Signalétique
 */
type SignageType = 'entrance' | 'speed' | 'direction' | 'safety' | 'evacuation';
type SignageSize = 'small' | 'medium' | 'large';

export function Signage({
  type = 'entrance',
  text = '',
  position = [0, 0, 0],
  size = 'medium',
  materials, // Injecté
}: {
  type?: SignageType;
  text?: string;
  position?: [number, number, number];
  size?: SignageSize;
  materials: any;
}) {
  const sizeMap: Record<SignageSize, number> = { small: 1, medium: 1.5, large: 2 };
  const scale = sizeMap[size];
  const colorMap: Record<SignageType, string> = {
    entrance: '#3498db',
    speed: '#e74c3c',
    direction: '#f39c12',
    safety: '#e74c3c',
    evacuation: '#27ae60',
  };
  return (
    <group position={position}>
      <Cylinder args={[0.1, 0.1, 2, 16]} position={[0, 1, 0]} castShadow>
        <primitive object={materials.galvanized} attach="material" />
      </Cylinder>
      <Box args={[scale * 1.5, scale, 0.1]} position={[0, 2.5, 0]} castShadow>
        <meshStandardMaterial color={colorMap[type]} roughness={0.3} metalness={0.5} />
      </Box>
    </group>
  );
}

/**
 * Composant principal VRD Infrastructure
 */
export default function VRDInfrastructure({ config }: { config: any }) {
  // Initialisation unique des matériaux texturés
  const materials = useVRDMaterials();

  return (
    <group>
      <PerimeterWall {...config.perimeter_wall} materials={materials} />
      <EntranceGate {...config.entrance.gate} materials={materials} />
      <GuardHouse {...config.entrance.guard_house} materials={materials} />
      {config.entrance.barriers.positions.map((pos: [number, number, number], i: number) => (
        <SecurityBarrier key={i} position={pos} materials={materials} />
      ))}
      <HearstLogo3D {...config.hearst_logo} materials={materials} />
      <AsphaltRoad {...config.roads.layout.external} {...config.roads.main_road} materials={materials} />
      <ConcreteRoad {...config.roads.layout.internal} {...config.roads.internal_roads} materials={materials} />
      <ConcreteRoad {...config.roads.layout.parking_access} {...config.roads.internal_roads} orientation="horizontal" materials={materials} />
      <MaintenanceHangar {...config.maintenance_hangar} materials={materials} />
      <ParkingArea {...config.parking} materials={materials} />
      {config.signage?.map((sign: any, i: number) => (
        <Signage key={i} {...sign} materials={materials} />
      ))}
    </group>
  );
}
