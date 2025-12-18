/**
 * Prévisualisation 3D des Layouts - Visualisations Interactives
 * =============================================================
 * 
 * Affiche des prévisualisations 3D des différentes propositions de layout
 */

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Types locaux (découplés du générateur 100MW)
export type PowerBlockLayout = {
  type: 'grid-2x2' | 'horizontal-line' | 'vertical-line' | 'l-shape';
  spacing: number;
};
export type TransformerLayout = {
  type: 'single-line' | 'double-line' | 'star';
  spacing: number;
};
export type ContainerPositioning = {
  type: 'side-by-side' | 'behind';
  distance: number;
};

interface LayoutPreview3DProps {
  powerBlockLayout?: PowerBlockLayout;
  transformerLayout?: TransformerLayout;
  containerPositioning?: ContainerPositioning;
  size?: number;
}

/**
 * Cube simple pour représenter un Power Block
 */
function PowerBlockPreview({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[4, 2.4, 2.5]} />
      <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

/**
 * Cylindre pour représenter un transformateur
 */
function TransformerPreview({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[1.25, 1.25, 3, 8]} />
      <meshStandardMaterial color="#4a4a4a" metalness={0.7} roughness={0.4} />
    </mesh>
  );
}

/**
 * Boîte pour représenter un container HD5
 */
function ContainerPreview({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[12.196, 2.896, 2.438]} />
      <meshStandardMaterial color="#4b5563" metalness={0.3} roughness={0.6} />
    </mesh>
  );
}

/**
 * Scène de prévisualisation
 */
function PreviewScene({
  powerBlockLayout,
  transformerLayout,
  containerPositioning,
}: LayoutPreview3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Rotation automatique lente
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Calculer les positions selon les layouts
  const powerBlockPositions: Array<[number, number, number]> = [];
  const transformerPositions: Array<Array<[number, number, number]>> = [];
  const containerPositions: Array<Array<Array<[number, number, number]>>> = [];

  if (powerBlockLayout) {
    const spacing = powerBlockLayout.spacing;
    switch (powerBlockLayout.type) {
      case 'grid-2x2': {
        const offsetX = spacing / 2;
        const offsetZ = spacing / 2;
        powerBlockPositions.push([-offsetX, 0, -offsetZ]);
        powerBlockPositions.push([offsetX, 0, -offsetZ]);
        powerBlockPositions.push([-offsetX, 0, offsetZ]);
        powerBlockPositions.push([offsetX, 0, offsetZ]);
        break;
      }
      case 'horizontal-line': {
        const totalWidth = spacing * 3;
        const startX = -totalWidth / 2;
        for (let i = 0; i < 4; i++) {
          powerBlockPositions.push([startX + i * spacing, 0, 0]);
        }
        break;
      }
      case 'vertical-line': {
        const totalDepth = spacing * 3;
        const startZ = -totalDepth / 2;
        for (let i = 0; i < 4; i++) {
          powerBlockPositions.push([0, 0, startZ + i * spacing]);
        }
        break;
      }
      case 'l-shape': {
        const offsetX = spacing / 2;
        const offsetZ = spacing / 2;
        powerBlockPositions.push([-offsetX, 0, -offsetZ]);
        powerBlockPositions.push([offsetX, 0, -offsetZ]);
        powerBlockPositions.push([-offsetX, 0, offsetZ]);
        powerBlockPositions.push([offsetX, 0, offsetZ]);
        break;
      }
    }
  }

  // Pour chaque Power Block, calculer les transformateurs
  if (transformerLayout && powerBlockPositions.length > 0) {
    powerBlockPositions.forEach((pbPos) => {
      const [pbX, pbY, pbZ] = pbPos;
      const spacing = transformerLayout.spacing;
      const trPositions: Array<[number, number, number]> = [];

      switch (transformerLayout.type) {
        case 'single-line': {
          const totalWidth = spacing * 4;
          const startX = pbX - totalWidth / 2;
          for (let i = 0; i < 5; i++) {
            trPositions.push([startX + i * spacing, pbY + 0.3, pbZ]);
          }
          break;
        }
        case 'double-line': {
          const totalWidth = spacing * 2;
          const startX = pbX - totalWidth / 2;
          for (let i = 0; i < 3; i++) {
            trPositions.push([startX + i * spacing, pbY + 0.3, pbZ - spacing / 2]);
          }
          trPositions.push([startX, pbY + 0.3, pbZ + spacing / 2]);
          trPositions.push([startX + spacing, pbY + 0.3, pbZ + spacing / 2]);
          break;
        }
        case 'star': {
          trPositions.push([pbX, pbY + 0.3, pbZ - spacing]);
          trPositions.push([pbX - spacing, pbY + 0.3, pbZ]);
          trPositions.push([pbX, pbY + 0.3, pbZ]);
          trPositions.push([pbX + spacing, pbY + 0.3, pbZ]);
          trPositions.push([pbX, pbY + 0.3, pbZ + spacing]);
          break;
        }
      }
      transformerPositions.push(trPositions);
    });
  }

  // Pour chaque transformateur, calculer les containers
  if (containerPositioning && transformerPositions.length > 0) {
    transformerPositions.forEach((trGroup) => {
      const containerGroup: Array<Array<[number, number, number]>> = [];
      trGroup.forEach((trPos) => {
        const [trX, trY, trZ] = trPos;
        const distance = containerPositioning.distance;
        const containerPair: Array<[number, number, number]> = [];

        switch (containerPositioning.type) {
          case 'side-by-side': {
            // Updated logic to match generator: align connection points with transformer
            const containerEffectiveWidth = 3.5; 
            const containerOffset = 2.5 / 2 + distance + containerEffectiveWidth / 2;
            const zShift = 5.1; // Shift to align connections
            containerPair.push([trX - containerOffset, trY + 0.3, trZ + zShift]);
            containerPair.push([trX + containerOffset, trY + 0.3, trZ + zShift]);
            break;
          }
          case 'behind': {
            // Updated logic to match generator
            const transformerBackZ = trZ + 3.5 / 2;
            const c1Z = transformerBackZ + distance + 3.5 / 2;
            const c2Z = c1Z + 3.5 + 2;
            containerPair.push([trX, trY + 0.3, c1Z]);
            containerPair.push([trX, trY + 0.3, c2Z]);
            break;
          }
        }
        containerGroup.push(containerPair);
      });
      containerPositions.push(containerGroup);
    });
  }

  return (
    <group ref={groupRef}>
      {/* Sol de référence */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#D4A574" roughness={0.9} />
      </mesh>

      {/* Grille */}
      <gridHelper args={[200, 20, '#4a5568', '#2d3748']} position={[0, 0.01, 0]} />

      {/* Power Blocks */}
      {powerBlockPositions.map((pos, i) => (
        <PowerBlockPreview key={`pb-${i}`} position={pos} />
      ))}

      {/* Transformateurs */}
      {transformerPositions.map((trGroup, pbIndex) =>
        trGroup.map((pos, trIndex) => (
          <TransformerPreview key={`pb-${pbIndex}-tr-${trIndex}`} position={pos} />
        ))
      )}

      {/* Containers */}
      {containerPositions.map((containerGroup, pbIndex) =>
        containerGroup.map((containerPair, trIndex) =>
          containerPair.map((pos, containerIndex) => (
            <ContainerPreview key={`pb-${pbIndex}-tr-${trIndex}-c-${containerIndex}`} position={pos} />
          ))
        )
      )}
    </group>
  );
}

/**
 * Composant principal de prévisualisation
 */
export default function LayoutPreview3D(props: LayoutPreview3DProps) {
  return (
    <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <Canvas
        camera={{ position: [50, 40, 50], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        shadows={false}
        dpr={1}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, 10, -5]} intensity={0.5} />
          
          <PreviewScene {...props} />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={30}
            maxDistance={100}
            autoRotate={true}
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
