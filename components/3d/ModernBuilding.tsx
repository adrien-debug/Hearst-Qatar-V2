/**
 * ModernBuilding - bâtiment "base vie" simplifié (SSR-safe, performant)
 * Sert de placeholder réaliste pour la scène 100MW.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
 
export type ModernBuildingType =
  | 'dormitory'
  | 'canteen'
  | 'security'
  | 'repair-center'
  | 'warehouse';
 
export interface ModernBuildingProps {
  type: ModernBuildingType | string;
  dimensions: { length: number; width: number; height: number };
  position?: [number, number, number];
  rotation?: [number, number, number];
}
 
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
 
export default function ModernBuilding({
  type,
  dimensions,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ModernBuildingProps) {
  const normalizedType: ModernBuildingType =
    (type as ModernBuildingType) || 'security';
 
  const palette = useMemo(() => {
    switch (normalizedType) {
      case 'dormitory':
        return { body: '#1f2937', accent: '#8AFD81', roof: '#111827' };
      case 'canteen':
        return { body: '#0b1120', accent: '#22c55e', roof: '#0f172a' };
      case 'repair-center':
        return { body: '#1b1b1b', accent: '#f59e0b', roof: '#111111' };
      case 'warehouse':
        return { body: '#0f172a', accent: '#38bdf8', roof: '#0b1020' };
      case 'security':
      default:
        return { body: '#111827', accent: '#ef4444', roof: '#0b1020' };
    }
  }, [normalizedType]);
 
  const length = clamp(dimensions.length, 2, 80);
  const width = clamp(dimensions.width, 2, 40);
  const height = clamp(dimensions.height, 2, 20);
 
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: palette.body,
        metalness: 0.15,
        roughness: 0.85,
      }),
    [palette.body]
  );
 
  const roofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: palette.roof,
        metalness: 0.2,
        roughness: 0.8,
      }),
    [palette.roof]
  );
 
  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: palette.accent,
        metalness: 0.35,
        roughness: 0.55,
        emissive: new THREE.Color(palette.accent),
        emissiveIntensity: 0.12,
      }),
    [palette.accent]
  );
 
  return (
    <group position={position} rotation={rotation}>
      {/* Corps principal */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height, width]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
 
      {/* Toit */}
      <mesh position={[0, height + 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[length + 0.4, 0.3, width + 0.4]} />
        <primitive object={roofMaterial} attach="material" />
      </mesh>
 
      {/* Bandeau / signalétique */}
      <mesh position={[0, height * 0.78, width / 2 + 0.06]} castShadow>
        <boxGeometry args={[length * 0.55, height * 0.12, 0.12]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
 
      {/* Fenêtres simplifiées */}
      {Array.from({ length: Math.max(2, Math.floor(length / 6)) }).map((_, i) => {
        const x = -length / 2 + 1.5 + i * 5;
        return (
          <mesh
            key={`win-${i}`}
            position={[x, height * 0.55, width / 2 + 0.051]}
          >
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial
              color="#0b1120"
              emissive="#0b1120"
              emissiveIntensity={0.15}
              metalness={0.1}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}


