/**
 * Boussole GPS Interactive - Calibration et Points de Référence
 * ============================================================
 * 
 * Affiche une boussole 3D avec points de référence GPS (Nord, Sud, Est, Ouest)
 */

import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveGPSCompassProps {
  size?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  showLabels?: boolean;
}

/**
 * Boussole GPS Interactive
 */
export default function InteractiveGPSCompass({
  size = 100,
  showGrid = true,
  showAxes = true,
  showLabels = true,
}: InteractiveGPSCompassProps) {
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef}>
      {/* Grille de référence au sol */}
      {showGrid && (
        <gridHelper
          args={[size, size / 10, '#4a5568', '#2d3748']}
          position={[0, 0.01, 0]}
        />
      )}

      {/* Axes de coordonnées colorés */}
      {showAxes && (
        <>
          {/* Axe X (Est) - Rouge */}
          <mesh position={[size / 2, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, size, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
          </mesh>
          {/* Flèche Est */}
          <mesh position={[size / 2, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.5, 2, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>

          {/* Axe Z (Nord) - Bleu - Correction: Z- est le Nord */}
          <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
             {/* Cylinder centré en 0,0,0 et allongé sur Z. On veut qu'il aille de -size/2 à size/2 */}
            <cylinderGeometry args={[0.05, 0.05, size, 8]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Flèche Nord (Z-) */}
          <mesh position={[0, 0.1, -size / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.5, 2, 8]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>
          
           {/* Flèche Sud (Z+) */}
           <mesh position={[0, 0.1, size / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.5, 2, 8]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
          </mesh>

          {/* Axe Y (Haut) - Vert */}
          <mesh position={[0, size / 4, 0]}>
            <cylinderGeometry args={[0.1, 0.1, size / 2, 8]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
          </mesh>
        </>
      )}

      {/* Points de référence GPS - Correction: Z- = NORD, Z+ = SUD */}
      <GPSReferencePoint
        position={[0, 1, -size / 2]}
        label="NORD"
        color="#3b82f6"
      />
      <GPSReferencePoint
        position={[0, 1, size / 2]}
        label="SUD"
        color="#3b82f6"
      />
      <GPSReferencePoint
        position={[size / 2, 1, 0]}
        label="EST"
        color="#ef4444"
      />
      <GPSReferencePoint
        position={[-size / 2, 1, 0]}
        label="OUEST"
        color="#ef4444"
      />
      <GPSReferencePoint
        position={[0, 1, 0]}
        label="CENTRE"
        color="#10b981"
      />
    </group>
  );
}

/**
 * Point de référence GPS
 */
function GPSReferencePoint({
  position,
  label,
  color,
}: {
  position: [number, number, number];
  label: string;
  color: string;
}) {
  const meshRef = useRef<Mesh>(null);

  // Animation de pulsation
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Sphère de référence */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Ligne vers le sol */}
      <mesh position={[0, -position[1] + 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, position[1] - 0.5, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>

      {/* Label Textuel 3D */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={1.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
        rotation={[-Math.PI / 2, 0, 0]} // Face au ciel pour vue de dessus
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * Composant pour afficher les labels GPS en HTML
 */
export function GPSLabelsOverlay({ size = 100 }: { size?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Label Nord */}
      <div
        className="absolute text-blue-500 font-bold text-sm"
        style={{
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        NORD
      </div>

      {/* Label Sud */}
      <div
        className="absolute text-blue-500 font-bold text-sm"
        style={{
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        SUD
      </div>

      {/* Label Est */}
      <div
        className="absolute text-red-500 font-bold text-sm"
        style={{
          top: '50%',
          right: '10%',
          transform: 'translateY(-50%)',
        }}
      >
        EST
      </div>

      {/* Label Ouest */}
      <div
        className="absolute text-red-500 font-bold text-sm"
        style={{
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
        }}
      >
        OUEST
      </div>

      {/* Label Centre */}
      <div
        className="absolute text-green-500 font-bold text-sm"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        CENTRE
      </div>
    </div>
  );
}



