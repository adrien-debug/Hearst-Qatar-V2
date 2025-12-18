/**
 * QatarFlag - Drapeau du Qatar (simple, performant)
 * Utilisé dans Mining100MWScene pour les équipements de type 'flag'
 */
import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
 
export interface QatarFlagProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}
 
export default function ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: QatarFlagProps) {
  // Texture dispo dans /public
  const texture = useLoader(THREE.TextureLoader, '/Flag_of_Qatar.svg.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
 
  const poleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2b2b2b',
        metalness: 0.7,
        roughness: 0.35,
      }),
    []
  );
 
  const flagMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        metalness: 0.0,
        roughness: 0.9,
      }),
    [texture]
  );
 
  // Dimensions (m) — volontairement simples
  const poleHeight = 6 * scale;
  const flagW = 3.2 * scale;
  const flagH = 1.6 * scale;
 
  return (
    <group position={position} rotation={rotation}>
      {/* Mât */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.06 * scale, 0.06 * scale, poleHeight, 12]} />
        <primitive object={poleMaterial} attach="material" />
      </mesh>
 
      {/* Drapeau (plan) */}
      <mesh position={[flagW / 2, poleHeight * 0.72, 0]} castShadow>
        <planeGeometry args={[flagW, flagH, 1, 1]} />
        <primitive object={flagMaterial} attach="material" />
      </mesh>
 
      {/* Socle */}
      <mesh position={[0, 0.1 * scale, 0]} receiveShadow>
        <cylinderGeometry args={[0.35 * scale, 0.35 * scale, 0.2 * scale, 16]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.2} roughness={0.9} />
      </mesh>
    </group>
  );
}
