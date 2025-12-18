/**
 * Escalier industriel autoporté 2 marches (procédural)
 * ===================================================
 *
 * Référence visuelle: marchepied en caillebotis avec flasques latérales jaunes
 * (découpe triangulaire) – comme sur la photo du user.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface MetalStairsTwoStepsProps {
  /** Position [x, y, z] en mètres */
  position?: [number, number, number];
  /** Rotation [x, y, z] en radians */
  rotation?: [number, number, number];
  /** Échelle (1 = taille réelle) */
  scale?: number;
  /** Callback au clic */
  onClick?: () => void;
  /** ID unique pour identification */
  id?: string;
  /** Si l'élément est sélectionné */
  isSelected?: boolean;

  /** Largeur (axe X) */
  width?: number;
  /** Profondeur d'une marche (axe Z) */
  stepDepth?: number;
  /** Hauteur d'une marche (axe Y) */
  stepHeight?: number;
  /** Épaisseur du cadre de marche */
  frameThickness?: number;

  /** Couleur des flasques latérales (jaune) */
  sideColor?: string;
  /** Couleur métal des marches/cadre */
  treadColor?: string;
}

function Grating({
  width,
  depth,
  y,
  z,
  bar,
  spacing,
  material,
}: {
  width: number;
  depth: number;
  y: number;
  z: number;
  bar: number;
  spacing: number;
  material: THREE.Material;
}) {
  const nx = Math.max(4, Math.floor(width / spacing));
  const nz = Math.max(3, Math.floor(depth / spacing));
  const x0 = -width / 2;
  const z0 = -depth / 2;

  return (
    <group position={[0, y, z]}>
      {/* Barres longitudinales (X) */}
      {Array.from({ length: nz }).map((_, iz) => {
        const zz = z0 + (iz + 0.5) * (depth / nz);
        return (
          <mesh key={`gx-${iz}`} position={[0, 0, zz]} castShadow receiveShadow>
            <boxGeometry args={[width, bar, bar]} />
            <primitive object={material} attach="material" />
          </mesh>
        );
      })}

      {/* Barres transversales (Z) */}
      {Array.from({ length: nx }).map((_, ix) => {
        const xx = x0 + (ix + 0.5) * (width / nx);
        return (
          <mesh key={`gz-${ix}`} position={[xx, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[bar, bar, depth]} />
            <primitive object={material} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function MetalStairsTwoSteps({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  width = 1.6,
  stepDepth = 0.45,
  stepHeight = 0.26,
  frameThickness = 0.035,
  sideColor = '#F59E0B',
  treadColor = '#9CA3AF',
}: MetalStairsTwoStepsProps) {
  const steps = 2;
  const totalDepth = steps * stepDepth;
  const totalRise = steps * stepHeight;
  const zBase = -totalDepth / 2;

  const treadMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(treadColor),
        metalness: 0.85,
        roughness: 0.35,
        envMapIntensity: 1.0,
      }),
    [treadColor]
  );

  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#6B7280'),
        metalness: 0.9,
        roughness: 0.45,
        envMapIntensity: 1.0,
      }),
    []
  );

  const sideMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color(sideColor),
      metalness: 0.25,
      roughness: 0.65,
      envMapIntensity: 0.6,
      side: THREE.DoubleSide,
    });
    return m;
  }, [sideColor]);

  const boltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9CA3AF'),
        metalness: 0.9,
        roughness: 0.3,
        envMapIntensity: 1.0,
      }),
    []
  );

  const plateThickness = 0.02;
  const plateClearance = 0.01;

  const sidePlateShape = useMemo(() => {
    // Shape en (x,y) où x représente Z (profondeur)
    const frontX = zBase - 0.06;
    const backX = zBase + totalDepth + 0.06;

    const lowerTopY = stepHeight + 0.05;
    const upperTopY = totalRise + 0.06;

    const s = new THREE.Shape();
    s.moveTo(frontX, 0);
    s.lineTo(backX, 0);
    s.lineTo(backX - 0.05, 0.05);
    s.lineTo(backX - 0.10, upperTopY);
    s.lineTo(frontX + 0.18, lowerTopY);
    s.lineTo(frontX + 0.02, 0.07);
    s.lineTo(frontX, 0);

    // Découpe triangulaire (comme la photo) côté avant
    const hole = new THREE.Path();
    hole.moveTo(frontX + 0.18, 0.10);
    hole.lineTo(frontX + 0.38, 0.10);
    hole.lineTo(frontX + 0.30, lowerTopY - 0.06);
    hole.lineTo(frontX + 0.18, 0.10);
    s.holes.push(hole);

    return s;
  }, [totalDepth, totalRise, stepHeight, zBase]);

  const extrudeSettings = useMemo(
    () =>
      ({
        depth: plateThickness,
        bevelEnabled: false,
      }) as const,
    [plateThickness]
  );

  // Dimensions d’une marche
  const frameHeight = 0.04;
  const gratingBar = 0.012;
  const gratingSpacing = 0.06;

  // Marche 0 (basse) -> avant, marche 1 (haute) -> arrière
  const stepsData = Array.from({ length: steps }).map((_, i) => {
    const yTop = (i + 1) * stepHeight;
    const zCenter = zBase + (i + 0.5) * stepDepth;
    return { i, yTop, zCenter };
  });

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'stairs', id }}
      name={id || 'metal-stairs-2-steps'}
    >
      {/* Flasques latérales jaunes */}
      <mesh
        position={[width / 2 + plateThickness / 2 + plateClearance, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[sidePlateShape, extrudeSettings]} />
        <primitive object={sideMat} attach="material" />
      </mesh>
      <mesh
        position={[-(width / 2 + plateThickness / 2 + plateClearance), 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[sidePlateShape, extrudeSettings]} />
        <primitive object={sideMat} attach="material" />
      </mesh>

      {/* Support central (petit renfort jaune sous la marche haute) */}
      <mesh position={[0, totalRise * 0.45, zBase + totalDepth * 0.52]} castShadow receiveShadow>
        <boxGeometry args={[plateThickness, totalRise * 0.9, 0.16]} />
        <primitive object={sideMat} attach="material" />
      </mesh>

      {/* Marches (cadre + caillebotis) */}
      {stepsData.map(({ i, yTop, zCenter }) => {
        const yFrame = yTop - frameHeight / 2;
        const innerW = width - frameThickness * 2;
        const innerD = stepDepth - frameThickness * 2;

        return (
          <group key={`tread-${i}`}>
            {/* Cadre */}
            <mesh position={[0, yFrame, zCenter]} castShadow receiveShadow>
              <boxGeometry args={[width, frameHeight, stepDepth]} />
              <primitive object={darkMetalMat} attach="material" />
            </mesh>
            {/* Creux intérieur (simulé en recouvrant avec caillebotis + une “dalle” fine) */}
            <mesh position={[0, yTop - 0.005, zCenter]} castShadow receiveShadow>
              <boxGeometry args={[innerW, 0.01, innerD]} />
              <primitive object={treadMat} attach="material" />
            </mesh>

            {/* Caillebotis */}
            <Grating
              width={innerW * 0.985}
              depth={innerD * 0.985}
              y={yTop + 0.002}
              z={zCenter}
              bar={gratingBar}
              spacing={gratingSpacing}
              material={treadMat}
            />
          </group>
        );
      })}

      {/* Petits patins au sol (avant / arrière) */}
      {([-1, 1] as const).flatMap((sx) =>
        ([-1, 1] as const).map((sz) => (
          <mesh
            key={`foot-${sx}-${sz}`}
            position={[
              sx * (width / 2 + plateThickness / 2),
              0.012,
              sz * (totalDepth / 2 + 0.02),
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.10, 0.024, 0.12]} />
            <primitive object={sideMat} attach="material" />
          </mesh>
        ))
      )}

      {/* Boulons (approx) */}
      {([-1, 1] as const).flatMap((side) =>
        [0.16, 0.40, 0.64].map((t, idx) => (
          <mesh
            key={`bolt-${side}-${idx}`}
            position={[
              side * (width / 2 + plateThickness + 0.01),
              0.18 + idx * 0.14,
              zBase + t * totalDepth - 0.05,
            ]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
            <primitive object={boltMat} attach="material" />
          </mesh>
        ))
      )}

      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, totalRise / 2, 0]}>
          <boxGeometry args={[width + 0.3, totalRise + 0.4, totalDepth + 0.3]} />
          <meshBasicMaterial color="#00A651" transparent opacity={0.25} wireframe />
        </mesh>
      )}
    </group>
  );
}



