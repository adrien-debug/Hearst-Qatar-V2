import { useMemo, useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HD5RoofModuleProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height?: number;
}

/**
 * Module toit Bitmain Antspace HD5
 * - Toit ondulé blanc/gris clair
 * - Nervures horizontales (effet tôle ondulée)
 * - Ouvertures latérales pour ventilation
 * - Coins ISO renforcés (continuité du container)
 */
export default function HD5RoofModule({
  position,
  width,
  depth,
  height = 0.4,
}: HD5RoofModuleProps) {
  const groupRef = useRef<Group>(null);
  const fanRotorsRef = useRef<Array<THREE.Group | null>>([]);

  useFrame((state) => {
    // Un seul useFrame pour faire tourner les 4 rotors
    const t = state.clock.elapsedTime;
    for (let i = 0; i < fanRotorsRef.current.length; i++) {
      const g = fanRotorsRef.current[i];
      if (!g) continue;
      const speed = (i % 2 === 0 ? 1.8 : 1.45) * Math.PI * 2; // rad/s
      g.rotation.y = t * speed;
    }
  });

  const fanMetal = useMemo(
    () => ({
      base: new THREE.MeshStandardMaterial({
        color: '#9ca3af',
        metalness: 0.7,
        roughness: 0.45,
      }),
      shroud: new THREE.MeshStandardMaterial({
        color: '#6b7280',
        metalness: 0.85,
        roughness: 0.35,
      }),
      blades: new THREE.MeshStandardMaterial({
        color: '#d1d5db',
        metalness: 0.85,
        roughness: 0.25,
        emissive: new THREE.Color('#111827'),
        emissiveIntensity: 0.08,
      }),
      hub: new THREE.MeshStandardMaterial({
        color: '#111827',
        metalness: 0.9,
        roughness: 0.2,
      }),
    }),
    []
  );

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== TOIT PRINCIPAL ==================== */}
      
      {/* Structure principale du toit */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#f3f4f6"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* ==================== NERVURES HORIZONTALES (TÔLE ONDULÉE) ==================== */}
      
      {/* Nervures sur le dessus */}
      {Array.from({ length: 20 }).map((_, i) => {
        const z = -depth / 2 + (i * (depth / 19));
        return (
          <mesh
            key={`roof-rib-top-${i}`}
            position={[0, height + 0.01, z]}
            castShadow
          >
            <boxGeometry args={[width - 0.1, 0.03, 0.08]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {/* Nervures sur les côtés (effet ondulation) */}
      {Array.from({ length: 20 }).map((_, i) => {
        const z = -depth / 2 + (i * (depth / 19));
        // Côté gauche
        return (
          <mesh
            key={`roof-rib-side-left-${i}`}
            position={[-width / 2 + 0.02, height / 2, z]}
            castShadow
          >
            <boxGeometry args={[0.04, height - 0.05, 0.08]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {Array.from({ length: 20 }).map((_, i) => {
        const z = -depth / 2 + (i * (depth / 19));
        // Côté droit
        return (
          <mesh
            key={`roof-rib-side-right-${i}`}
            position={[width / 2 - 0.02, height / 2, z]}
            castShadow
          >
            <boxGeometry args={[0.04, height - 0.05, 0.08]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        );
      })}

      {/* ==================== COINS ISO RENFORCÉS ==================== */}
      
      {/* Coins aux 4 angles (continuité du container) */}
      {[
        [-width / 2, height, -depth / 2],
        [width / 2, height, -depth / 2],
        [-width / 2, height, depth / 2],
        [width / 2, height, depth / 2],
      ].map((pos, i) => (
        <mesh key={`corner-iso-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Coins aux 4 angles du bas */}
      {[
        [-width / 2, 0, -depth / 2],
        [width / 2, 0, -depth / 2],
        [-width / 2, 0, depth / 2],
        [width / 2, 0, depth / 2],
      ].map((pos, i) => (
        <mesh key={`corner-iso-bottom-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* ==================== OUVERTURES DE VENTILATION LATÉRALES ==================== */}
      
      {/* Grilles de ventilation sur les côtés */}
      {/* Côté avant gauche */}
      <group position={[-width / 2 + 1, height / 2, depth / 2 - 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-fl-${i}`}
            position={[-0.35 + i * 0.18, 0, 0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Côté avant droit */}
      <group position={[width / 2 - 1, height / 2, depth / 2 - 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-fr-${i}`}
            position={[-0.35 + i * 0.18, 0, 0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Côté arrière gauche */}
      <group position={[-width / 2 + 1, height / 2, -depth / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-bl-${i}`}
            position={[-0.35 + i * 0.18, 0, -0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Côté arrière droit */}
      <group position={[width / 2 - 1, height / 2, -depth / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.6}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Lamelles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={`vent-louver-br-${i}`}
            position={[-0.35 + i * 0.18, 0, -0.03]}
            castShadow
          >
            <boxGeometry args={[0.02, 0.18, 0.01]} />
            <meshStandardMaterial
              color="#111827"
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* ==================== BANDES DE RENFORT ==================== */}
      
      {/* Bandes métalliques de renfort sur les bords */}
      {/* Bord avant */}
      <mesh position={[0, height / 2, depth / 2 - 0.05]} castShadow>
        <boxGeometry args={[width, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bord arrière */}
      <mesh position={[0, height / 2, -depth / 2 + 0.05]} castShadow>
        <boxGeometry args={[width, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bord gauche */}
      <mesh position={[-width / 2 + 0.05, height / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.15, depth]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Bord droit */}
      <mesh position={[width / 2 - 0.05, height / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.15, depth]} />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* ==================== EXTRACTEURS D'AIR (ROOF VENTS) ==================== */}
      
      {/* Ventilateurs dynamiques sur le toit (remplace les extracteurs statiques) */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={`roof-vent-${i}`} position={[x, height + 0.05, 0]}>
          {/* Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.1, 16]} />
            <primitive object={fanMetal.base} attach="material" />
          </mesh>

          {/* Carter (remplace le "capot" conique, plus proche d'un vrai ventilo) */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 24]} />
            <primitive object={fanMetal.shroud} attach="material" />
          </mesh>

          {/* Grille (anneau + barres) */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.205, 0.205, 0.02, 24]} />
            <primitive object={fanMetal.shroud} attach="material" />
          </mesh>
          {Array.from({ length: 6 }).map((_, j) => {
            const a = (j / 6) * Math.PI * 2;
            return (
              <mesh
                key={`vent-grill-${i}-${j}`}
                position={[0, 0.145, 0]}
                rotation={[0, a, 0]}
                castShadow
              >
                <boxGeometry args={[0.36, 0.01, 0.03]} />
                <primitive object={fanMetal.shroud} attach="material" />
              </mesh>
            );
          })}

          {/* Rotor (pales animées) */}
          <group
            ref={(el) => {
              fanRotorsRef.current[i] = el;
            }}
            position={[0, 0.105, 0]}
          >
            {/* Moyeu */}
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.03, 12]} />
              <primitive object={fanMetal.hub} attach="material" />
            </mesh>
            {/* Pales */}
            {Array.from({ length: 7 }).map((_, b) => {
              const a = (b / 7) * Math.PI * 2;
              return (
                <mesh key={`blade-${i}-${b}`} rotation={[0, a, 0]} castShadow>
                  <boxGeometry args={[0.18, 0.01, 0.05]} />
                  <primitive object={fanMetal.blades} attach="material" />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* ==================== MARQUAGE ET IDENTIFICATION ==================== */}
      
      {/* Plaque d'identification sur le côté */}
      <mesh position={[-width / 2 + 0.5, height / 2, depth / 2 - 0.02]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      {/* Texte simulé (petite plaque blanche) */}
      <mesh position={[-width / 2 + 0.5, height / 2, depth / 2 - 0.01]}>
        <boxGeometry args={[0.55, 0.1, 0.005]} />
        <meshStandardMaterial
          color="#f9fafb"
          emissive="#f9fafb"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ==================== SUPPORTS DE LEVAGE ==================== */}
      
      {/* Anneaux de levage aux 4 coins du toit */}
      {[
        [-width / 2 + 0.5, height + 0.02, -depth / 2 + 0.5],
        [width / 2 - 0.5, height + 0.02, -depth / 2 + 0.5],
        [-width / 2 + 0.5, height + 0.02, depth / 2 - 0.5],
        [width / 2 - 0.5, height + 0.02, depth / 2 - 0.5],
      ].map((pos, i) => (
        <mesh
          key={`lifting-ring-${i}`}
          position={pos as [number, number, number]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.08, 0.02, 12, 24]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}


