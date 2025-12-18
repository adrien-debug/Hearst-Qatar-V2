import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import HearstLogo from './HearstLogo';
import MetalStairsTwoSteps from './MetalStairsTwoSteps';
import ContainerDoorLockBars from './ContainerDoorLockBars';
import { getContainerAssets, CONTAINER_DIM } from '../../utils/containerAssets';

/**
 * ContainerPlan3DViewerExact
 * -------------------------
 * Version optimisée utilisant des assets partagés (textures, matériaux, géométries).
 * Évite la recréation de 800+ textures Canvas 2D et matériaux.
 */

export interface ContainerPlan3DViewerExactProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  includeConcreteBase?: boolean;
}

function RoofFan({
  radius,
  thickness,
  height,
  bladeCount,
  bladeLength,
  bladeWidth,
  spinRps,
  assets,
  animate
}: {
  radius: number;
  thickness: number;
  height: number;
  bladeCount: number;
  bladeLength: number;
  bladeWidth: number;
  spinRps: number;
  assets: any;
  animate: boolean;
}) {
  const bladesRef = useRef<THREE.Group>(null);

  // OPTIMISATION: Animation uniquement si nécessaire (sélectionné)
  useFrame((_, delta) => {
    if (!animate || spinRps <= 0) return;
    if (!bladesRef.current) return;
    bladesRef.current.rotation.y += delta * (Math.PI * 2) * spinRps;
  });

  const fanY = thickness / 2;
  
  return (
    <group>
      {/* Base / Socle */}
      <mesh castShadow receiveShadow geometry={assets.geometries.fanCylBase} material={assets.materials.fanShroud} />

      {/* Carter cylindrique */}
      <mesh position={[0, fanY + height / 2, 0]} castShadow receiveShadow geometry={assets.geometries.fanCylShroud} material={assets.materials.fanShroud}>
         {/* Matériau double face override si nécessaire, sinon utiliser celui par défaut */}
      </mesh>

      {/* Grille de protection (dessus) - Simplifiée pour réduire les draw calls si possible, sinon garder tel quel */}
      <group position={[0, fanY + height - 0.02, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[radius * 0.95, 0.02, 8, 32]} />
          <primitive object={assets.materials.fanShroud} attach="material" />
        </mesh>
        
        <mesh rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[radius * 1.9, 0.03, 0.05]} />
          <primitive object={assets.materials.fanShroud} attach="material" />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[radius * 1.9, 0.03, 0.05]} />
          <primitive object={assets.materials.fanShroud} attach="material" />
        </mesh>

        {[0.3, 0.6, 0.8].map((scale, i) => (
             <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]} castShadow>
             <torusGeometry args={[radius * scale, 0.015, 8, 32]} />
             <primitive object={assets.materials.fanShroud} attach="material" />
           </mesh>
        ))}
      </group>

      {/* Pales */}
      <group ref={bladesRef} position={[0, fanY + height * 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[radius * 0.2, radius * 0.2, 0.1, 16]} />
          <primitive object={assets.materials.fanHub} attach="material" />
        </mesh>

        {Array.from({ length: bladeCount }).map((_, i) => {
          const a = (i / bladeCount) * Math.PI * 2;
          const hubRadius = radius * 0.2;
          const bladeLen = radius - hubRadius - 0.05;
          
          return (
            <group key={`blade-${i}`} rotation={[0, a, 0]}>
              <mesh
                position={[hubRadius + bladeLen / 2, 0, 0]}
                rotation={[0.4, 0, 0]}
                castShadow
              >
                <boxGeometry args={[bladeLen, 0.02, bladeWidth]} />
                <primitive object={assets.materials.fanBlade} attach="material" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Moteur */}
      <mesh position={[0, fanY + 0.1, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.25, radius * 0.25, 0.2, 16]} />
        <primitive object={assets.materials.fanHub} attach="material" />
      </mesh>
    </group>
  );
}

export default function ContainerPlan3DViewerExact({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isSelected = false,
  includeConcreteBase = true,
}: ContainerPlan3DViewerExactProps) {
  const ribsRef = useRef<THREE.InstancedMesh>(null);
  const groovesRef = useRef<THREE.InstancedMesh>(null);
  const finsRef = useRef<THREE.InstancedMesh>(null);
  
  // Récupération des assets globaux
  const assets = useMemo(() => {
    if (typeof window !== 'undefined') {
        return getContainerAssets();
    }
    return null;
  }, []);

  // Calculs de positionnement des instances (mémoïsés globalement ou localement statiques)
  const layout = useMemo(() => {
    const ribCount = 50;
    const ribDepth = 0.12;
    const spacing = CONTAINER_DIM.length / ribCount;

    const grooveCount = ribCount - 1;
    const grooveDepth = 0.08;

    const coolingHeight = CONTAINER_DIM.height;
    const vAngle = (35 * Math.PI) / 180;
    const zOffset = Math.sin(vAngle) * (coolingHeight / 2);
    const finCount = 35;
    const finDepth = 0.25;

    return {
        ribCount, ribDepth, spacing,
        grooveCount, grooveDepth,
        coolingHeight, vAngle, zOffset, finCount, finDepth
    };
  }, []);

  const base = includeConcreteBase ? CONTAINER_DIM.concreteBase : 0;
  const baseY = base + CONTAINER_DIM.height;

  useLayoutEffect(() => {
    if (!assets) return;

    const tmp = new THREE.Object3D();

    if (ribsRef.current) {
      let idx = 0;
      for (let i = 0; i < layout.ribCount; i++) {
        const x = -CONTAINER_DIM.length / 2 + i * layout.spacing;
        // Nord
        tmp.position.set(x, base + CONTAINER_DIM.height / 2, CONTAINER_DIM.width / 2 + layout.ribDepth / 2);
        tmp.rotation.set(0, 0, 0);
        tmp.updateMatrix();
        ribsRef.current.setMatrixAt(idx++, tmp.matrix);
        // Sud
        tmp.position.set(x, base + CONTAINER_DIM.height / 2, -CONTAINER_DIM.width / 2 - layout.ribDepth / 2);
        tmp.updateMatrix();
        ribsRef.current.setMatrixAt(idx++, tmp.matrix);
      }
      ribsRef.current.instanceMatrix.needsUpdate = true;
    }

    if (groovesRef.current) {
      let idx = 0;
      for (let i = 0; i < layout.grooveCount; i++) {
        const x = -CONTAINER_DIM.length / 2 + (i + 0.5) * layout.spacing;
        // Nord
        tmp.position.set(x, base + CONTAINER_DIM.height / 2, CONTAINER_DIM.width / 2 + layout.grooveDepth / 2 - 0.02);
        tmp.rotation.set(0, 0, 0);
        tmp.updateMatrix();
        groovesRef.current.setMatrixAt(idx++, tmp.matrix);
        // Sud
        tmp.position.set(x, base + CONTAINER_DIM.height / 2, -CONTAINER_DIM.width / 2 - layout.grooveDepth / 2 + 0.02);
        tmp.updateMatrix();
        groovesRef.current.setMatrixAt(idx++, tmp.matrix);
      }
      groovesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (finsRef.current) {
      let idx = 0;
      for (let i = 0; i < layout.finCount; i++) {
        const y = baseY + (i / layout.finCount) * layout.coolingHeight;
        const progress = i / layout.finCount;
        const z = layout.zOffset * progress;

        // Nord
        tmp.position.set(0, y, z + layout.finDepth / 2);
        tmp.rotation.set(layout.vAngle, 0, 0);
        tmp.updateMatrix();
        finsRef.current.setMatrixAt(idx++, tmp.matrix);

        // Sud
        tmp.position.set(0, y, -z - layout.finDepth / 2);
        tmp.rotation.set(-layout.vAngle, 0, 0);
        tmp.updateMatrix();
        finsRef.current.setMatrixAt(idx++, tmp.matrix);
      }
      finsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [base, baseY, layout, assets]);

  if (!assets) return null;

  const frameThickness = 0.15;
  const coolingHeight = CONTAINER_DIM.height;
  const ribDepthForCooling = 0.12;
  const sidePanelThickness = 0.08;
  const alignedCoolingWidth = CONTAINER_DIM.width + ribDepthForCooling * 2;

  return (
    <group position={position} rotation={rotation}>
      {/* Dalle béton (Décalée de -0.3m pour réduire la marge à l'entrée à 40cm au lieu de 1m) */}
      {includeConcreteBase && (
        <mesh position={[-0.3, CONTAINER_DIM.concreteBase / 2, 0]} castShadow receiveShadow geometry={assets.geometries.boxConcrete} material={assets.materials.base} />
      )}

      {/* Container principal */}
      <mesh
        position={[0, base + CONTAINER_DIM.height / 2, 0]}
        castShadow
        receiveShadow
        geometry={assets.geometries.boxContainer}
        material={isSelected ? assets.materials.containerSelected : assets.materials.container}
      />

      {/* Logo Hearst */}
      {(() => {
        const offset = 0.12 + 0.3;
        const logoWidth = 9.2;
        const y = base + CONTAINER_DIM.height * 0.55;
        const zNorth = CONTAINER_DIM.width / 2 + offset;
        const zSouth = -CONTAINER_DIM.width / 2 - offset;
        return (
          <>
            <HearstLogo position={[0, y, zNorth]} rotation={[Math.PI, 0, 0]} width={logoWidth} />
            <HearstLogo position={[0, y, zSouth]} rotation={[Math.PI, Math.PI, 0]} width={logoWidth} />
          </>
        );
      })()}

      {/* CADRE COOLING */}
      {/* 4 montants verticaux */}
      {[
        { x: -CONTAINER_DIM.length / 2, z: -CONTAINER_DIM.width / 2 },
        { x: -CONTAINER_DIM.length / 2, z: CONTAINER_DIM.width / 2 },
        { x: CONTAINER_DIM.length / 2, z: -CONTAINER_DIM.width / 2 },
        { x: CONTAINER_DIM.length / 2, z: CONTAINER_DIM.width / 2 },
      ].map((c, i) => (
        <mesh key={`cooling-post-${i}`} position={[c.x, baseY + coolingHeight / 2, c.z]} castShadow receiveShadow geometry={assets.geometries.boxFrameV} material={assets.materials.coolingFrame} />
      ))}

      {/* Traverses haut (longueur) */}
      {[
        { z: CONTAINER_DIM.width / 2, key: 'top-front' },
        { z: -CONTAINER_DIM.width / 2, key: 'top-back' },
      ].map((t) => (
        <mesh key={`cooling-${t.key}`} position={[0, baseY + coolingHeight, t.z]} castShadow geometry={assets.geometries.boxFrameH_X} material={assets.materials.coolingFrame} />
      ))}

      {/* Traverses haut (largeur) */}
      {[
        { x: -CONTAINER_DIM.length / 2, key: 'top-left' },
        { x: CONTAINER_DIM.length / 2, key: 'top-right' },
      ].map((t) => (
        <mesh key={`cooling-${t.key}`} position={[t.x, baseY + coolingHeight, 0]} castShadow geometry={assets.geometries.boxFrameH_Z} material={assets.materials.coolingFrame} />
      ))}

      {/* Traverses bas (longueur) */}
      {[
        { z: CONTAINER_DIM.width / 2, key: 'bottom-front' },
        { z: -CONTAINER_DIM.width / 2, key: 'bottom-back' },
      ].map((t) => (
        <mesh key={`cooling-${t.key}`} position={[0, baseY, t.z]} castShadow geometry={assets.geometries.boxFrameH_X} material={assets.materials.coolingFrame} />
      ))}

       {/* Traverses bas (largeur) */}
       {[
        { x: -CONTAINER_DIM.length / 2, key: 'bottom-left' },
        { x: CONTAINER_DIM.length / 2, key: 'bottom-right' },
      ].map((t) => (
        <mesh key={`cooling-${t.key}`} position={[t.x, baseY, 0]} castShadow geometry={assets.geometries.boxFrameH_Z} material={assets.materials.coolingFrame} />
      ))}

      {/* Plancher */}
      <mesh position={[0, baseY + 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[CONTAINER_DIM.length - 0.3, 0.05, CONTAINER_DIM.width - 0.3]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.7} transparent opacity={0.85} />
      </mesh>

      {/* Toit */}
      <mesh position={[0, baseY + coolingHeight + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[CONTAINER_DIM.length, 0.1, alignedCoolingWidth]} />
        <primitive object={assets.materials.coolingPanel} attach="material" />
      </mesh>

      {/* Panneaux latéraux */}
      <mesh position={[-CONTAINER_DIM.length / 2 - sidePanelThickness / 2, baseY + coolingHeight / 2, 0]} castShadow>
        <boxGeometry args={[sidePanelThickness, coolingHeight, alignedCoolingWidth]} />
        <primitive object={assets.materials.coolingPanel} attach="material" />
      </mesh>
      <mesh position={[CONTAINER_DIM.length / 2 + sidePanelThickness / 2, baseY + coolingHeight / 2, 0]} castShadow>
        <boxGeometry args={[sidePanelThickness, coolingHeight, alignedCoolingWidth]} />
        <primitive object={assets.materials.coolingPanel} attach="material" />
      </mesh>

      {/* Poteaux intermédiaires */}
      {[-CONTAINER_DIM.length / 4, 0, CONTAINER_DIM.length / 4].flatMap((xPos, idx) => ([
        { key: `pole-n-${idx}`, x: xPos, z: CONTAINER_DIM.width / 2 - frameThickness },
        { key: `pole-s-${idx}`, x: xPos, z: -CONTAINER_DIM.width / 2 + frameThickness },
      ])).map((p) => (
        <mesh key={p.key} position={[p.x, baseY + coolingHeight / 2, p.z]} castShadow geometry={assets.geometries.boxFrameV} material={assets.materials.coolingFrame} />
      ))}

      {/* Panneaux avant/arrière réduits */}
      {(() => {
        const reducedH = coolingHeight * 0.25;
        const y = baseY + reducedH / 2;
        const z = CONTAINER_DIM.width / 2;
        return (
          <>
            <mesh position={[0, y, z]} castShadow>
              <boxGeometry args={[CONTAINER_DIM.length, reducedH, sidePanelThickness]} />
              <primitive object={assets.materials.coolingPanel} attach="material" />
            </mesh>
            <mesh position={[0, y, -z]} castShadow>
              <boxGeometry args={[CONTAINER_DIM.length, reducedH, sidePanelThickness]} />
              <primitive object={assets.materials.coolingPanel} attach="material" />
            </mesh>
          </>
        );
      })()}

      {/* Instanced Mesh - Nervures */}
      <instancedMesh ref={ribsRef} args={[assets.geometries.boxRib, assets.materials.rib, layout.ribCount * 2]} castShadow receiveShadow />

      {/* Instanced Mesh - Creux */}
      <instancedMesh ref={groovesRef} args={[assets.geometries.boxGroove, assets.materials.groove, layout.grooveCount * 2]} receiveShadow />

      {/* Instanced Mesh - Ailettes */}
      <instancedMesh ref={finsRef} args={[assets.geometries.boxFin, assets.materials.fin, layout.finCount * 2]} castShadow receiveShadow />

      {/* Ventilateurs */}
      {[
        { x: -4.5, z: 0 },
        { x: -1.5, z: 0 },
        { x: 1.5, z: 0 },
        { x: 4.5, z: 0 },
      ].map((p, i) => (
        <group key={`fan-${i}`} position={[p.x, baseY + coolingHeight + 0.15, p.z]}>
          <RoofFan
            radius={1.35}
            thickness={0.05}
            height={0.3}
            bladeCount={7}
            bladeLength={1.25}
            bladeWidth={0.3}
            spinRps={isSelected ? (i % 2 === 0 ? 3.5 : 2.8) : 0} // 0 RPM si pas sélectionné
            animate={isSelected} // Désactiver l'animation si pas sélectionné
            assets={assets}
          />
        </group>
      ))}

      {/* Marchepied centré devant les portes (Côté Est / +X) - VERT HEARST (CONSERVÉ) */}
      <group position={[CONTAINER_DIM.length / 2 + 0.48, 0, 0]}>
        <MetalStairsTwoSteps
          rotation={[0, -Math.PI / 2, 0]} // Tourné vers le container
          width={1.6} // Largeur standard
          stepDepth={0.45}
          stepHeight={0.26}
          sideColor="#8AFD81" // Vert Hearst
          treadColor="#4B5563" // Gris foncé
        />
      </group>

      {/* Barres de verrouillage Inox (Portes Est) - Couleur Vert Marchepieds */}
      <group position={[CONTAINER_DIM.length / 2, base + CONTAINER_DIM.height / 2, 0]} rotation={[0, 0, 0]}>
        <ContainerDoorLockBars
          containerWidth={CONTAINER_DIM.width}
          doorHeight={CONTAINER_DIM.height}
          edgeInset={0.6}
          outwardOffset={0.08}
          scale={1}
          steelColor="#8AFD81" // Vert Clair (identique aux marchepieds)
          keeperColor="#6FCF68" // Légèrement plus foncé pour les gâches
        />
      </group>
    </group>
  );
}


