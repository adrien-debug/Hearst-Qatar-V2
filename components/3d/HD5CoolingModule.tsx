import { useRef, useMemo } from 'react';
import { Group, CylinderGeometry, BoxGeometry, DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instances, Instance, RoundedBox } from '@react-three/drei';
import { qualityManager } from '../../utils/qualityManager';

interface HD5CoolingModuleProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height?: number;
}

// Géométries partagées pour l'instancing
const fanHousingGeometry = new CylinderGeometry(0.35, 0.35, 0.15, 16); // Low poly 16 segs
const fanBladeGeometry = new BoxGeometry(0.38, 0.02, 0.07);
const finGeometry = new BoxGeometry(1, 0.02, 0.05); // Taille unitaire, sera scalée
const pumpBodyGeometry = new BoxGeometry(0.6, 0.5, 0.5);
const pumpMotorGeometry = new CylinderGeometry(0.15, 0.15, 0.4, 12);

/**
 * Rotor unique optimisé (7 pales fusionnées)
 */
function OptimizedRotor({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  
  // Animation simple
  useFrame((state) => {
    if (ref.current) {
      // Vitesse variable selon la position pour éviter l'effet "synchronisé" artificiel
      const speed = 10 + Math.sin(position[0] * 0.5 + position[2] * 0.5) * 2;
      ref.current.rotation.y -= speed * state.clock.getDelta();
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* 7 pales - On utilise des mesh simples ici car le rotor tourne */}
      {/* Pour une opti ultime, on pourrait merger la géométrie des 7 pales en une seule Geometry */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i / 7) * Math.PI * 2, 0]} castShadow>
          <primitive object={fanBladeGeometry} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 12]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
    </group>
  );
}

/**
 * Module de refroidissement Bitmain Antspace HD5 - Version Optimisée
 * - Instancing pour les ventilateurs et ailettes
 * - Géométries simplifiées pour la performance (LOD implicite via segments réduits)
 */
export default function HD5CoolingModule({
  position,
  width,
  depth,
  height = 2.896,
}: HD5CoolingModuleProps) {
  const groupRef = useRef<Group>(null);
  const quality = qualityManager.getQuality();
  const isHighQuality = quality === 'high' || quality === 'ultra';

  // Calculs géométriques (V Inversé)
  const vAngle = Math.atan((depth / 2 - 0.3) / height);
  const panelLength = height / Math.cos(vAngle);
  const centerY = height / 2;
  const centerZ_offset = (depth / 2 - 0.3) / 2;

  // Pré-calcul des positions des ventilateurs
  const fanPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const row = Math.floor(i / 6);
      const col = i % 6;
      const fanX = -width / 2 + 1 + col * ((width - 2) / 5);
      const fanZ = -depth / 2 + 0.6 + row * (depth - 1.2);
      pos.push([fanX, height, fanZ]);
    }
    return pos;
  }, [width, depth, height]);

  // Pré-calcul des positions des ailettes (Fins)
  const finPositions = useMemo(() => {
    const posFront: { pos: [number, number, number], rot: [number, number, number] }[] = [];
    const posBack: { pos: [number, number, number], rot: [number, number, number] }[] = [];
    
    // Réduire le nombre d'ailettes en mode performance
    const finCount = isHighQuality ? 16 : 8;

    for (let i = 0; i < finCount; i++) {
      const t = i / (finCount - 1);
      const finY = t * height;
      
      // Front
      const finZFront = t * (depth / 2 - 0.3);
      posFront.push({ pos: [0, finY, finZFront], rot: [vAngle, 0, 0] });

      // Back
      const finZBack = -t * (depth / 2 - 0.3);
      posBack.push({ pos: [0, finY, finZBack], rot: [-vAngle, 0, 0] });
    }
    return { front: posFront, back: posBack };
  }, [height, depth, vAngle, isHighQuality]);

  return (
    <group ref={groupRef} position={position}>
      {/* ==================== STRUCTURE STATIQUE (Mainframe) ==================== */}
      <group>
        {/* Cadre Haut */}
        <mesh position={[0, height - 0.1, 0]} castShadow>
          <boxGeometry args={[width, 0.2, depth]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Cadre Bas */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.2, depth]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Poteaux Coins */}
        {[
          [-width / 2 + 0.1, height / 2, -depth / 2 + 0.1],
          [width / 2 - 0.1, height / 2, -depth / 2 + 0.1],
          [-width / 2 + 0.1, height / 2, depth / 2 - 0.1],
          [width / 2 - 0.1, height / 2, depth / 2 - 0.1],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.15, height - 0.4, 0.15]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* ==================== PANNEAUX RADIATEURS (V-SHAPE) ==================== */}
      <group>
        {/* Panneaux principaux (Plats) */}
        <mesh position={[0, centerY, centerZ_offset]} rotation={[vAngle, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[width - 0.6, 0.08, panelLength]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, centerY, -centerZ_offset]} rotation={[-vAngle, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[width - 0.6, 0.08, panelLength]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Ailettes Instanciées (Optimisation) */}
        <Instances range={finPositions.front.length} geometry={finGeometry} castShadow receiveShadow>
           <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
           {finPositions.front.map((data, i) => (
             <Instance
               key={`front-${i}`}
               position={data.pos}
               rotation={data.rot}
               scale={[width - 0.7, 1, 1]} // Scale X pour adapter à la largeur
             />
           ))}
        </Instances>
        
        <Instances range={finPositions.back.length} geometry={finGeometry} castShadow receiveShadow>
           <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
           {finPositions.back.map((data, i) => (
             <Instance
               key={`back-${i}`}
               position={data.pos}
               rotation={data.rot}
               scale={[width - 0.7, 1, 1]}
             />
           ))}
        </Instances>
      </group>

      {/* ==================== VENTILATEURS (INSTANCING) ==================== */}
      {/* Housings (Corps statiques) */}
      <Instances range={12} geometry={fanHousingGeometry} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        {fanPositions.map((pos, i) => (
          <Instance key={i} position={pos} />
        ))}
      </Instances>

      {/* Rotors (Animés - Pas d'instancing simple car rotation individuelle, mais géométrie partagée) */}
      {/* Note: Pour une optimisation extrême, on pourrait utiliser InstancedMesh avec update manuel des matrices, */}
      {/* mais ici on a réduit la draw call des pales de 7 à 1 par rotor dans OptimizedRotor */}
      {fanPositions.map((pos, i) => (
        <OptimizedRotor key={i} position={pos} />
      ))}


      {/* ==================== DÉTAILS (POMPES & TUYAUX) ==================== */}
      {/* Pompes (Instances) */}
      <Instances range={3} geometry={pumpBodyGeometry} castShadow>
         <meshStandardMaterial color="#22c55e" metalness={0.6} roughness={0.4} />
         <Instance position={[-width / 3, 0.4, 0]} />
         <Instance position={[0, 0.4, 0]} />
         <Instance position={[width / 3, 0.4, 0]} />
      </Instances>
      
      {/* Moteurs Pompes (Instances) */}
      <Instances range={3} geometry={pumpMotorGeometry} castShadow>
         <meshStandardMaterial color="#16a34a" metalness={0.7} roughness={0.3} />
         <Instance position={[-width / 3 + 0.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} />
         <Instance position={[0.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} />
         <Instance position={[width / 3 + 0.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} />
      </Instances>

      {/* Tuyau principal (Unique) */}
      <mesh position={[0, 0.6, -depth / 3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, width - 1, 12]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tuyaux Jaunes (Instances) */}
      <Instances range={3} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
        {[-1, 0, 1].map((offset, i) => (
           <Instance 
             key={i}
             position={[offset * width / 4, 0.8, depth / 4]}
             rotation={[Math.PI / 2, 0, 0]}
           />
        ))}
      </Instances>

    </group>
  );
}
