import React, { useMemo } from 'react';
import * as THREE from 'three';

interface FireExtinguisherProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function FireExtinguisher({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: FireExtinguisherProps) {
  
  // Matériaux réutilisables
  const materials = useMemo(() => ({
    redBody: new THREE.MeshStandardMaterial({
      color: '#CC0000', // Rouge sécurité incendie
      metalness: 0.3,
      roughness: 0.4,
      envMapIntensity: 1.0,
    }),
    blackRubber: new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      metalness: 0.1,
      roughness: 0.9,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.9,
      roughness: 0.1,
    }),
    label: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.0,
      roughness: 0.8,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: '#D4AF37', // Laiton
      metalness: 0.8,
      roughness: 0.3,
    })
  }), []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Corps principal (Cylindre rouge) */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow material={materials.redBody}>
        <cylinderGeometry args={[0.08, 0.08, 0.55, 16]} />
      </mesh>

      {/* Dôme supérieur */}
      <mesh position={[0, 0.575, 0]} castShadow material={materials.redBody}>
        <sphereGeometry args={[0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      
      {/* Base arrondie */}
      <mesh position={[0, 0.025, 0]} castShadow material={materials.redBody}>
        <cylinderGeometry args={[0.08, 0.07, 0.05, 16]} />
      </mesh>

      {/* Étiquette d'instruction (Rectangle blanc courbé simulé par un plan proche) */}
      <mesh position={[0, 0.35, 0.081]} material={materials.label}>
        <planeGeometry args={[0.10, 0.25]} />
      </mesh>
      {/* Simulation de texte sur l'étiquette (bandes noires) */}
      <mesh position={[0, 0.4, 0.082]} material={materials.blackRubber}>
        <planeGeometry args={[0.08, 0.02]} />
      </mesh>
      <mesh position={[0, 0.35, 0.082]} material={materials.blackRubber}>
        <planeGeometry args={[0.08, 0.01]} />
      </mesh>
      <mesh position={[0, 0.32, 0.082]} material={materials.blackRubber}>
        <planeGeometry args={[0.08, 0.01]} />
      </mesh>

      {/* Tête / Valve (Laiton/Chrome) */}
      <group position={[0, 0.65, 0]}>
        {/* Axe vertical */}
        <mesh position={[0, 0, 0]} material={materials.chrome}>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        </mesh>
        
        {/* Poignée inférieure (fixe) */}
        <mesh position={[0.05, -0.02, 0]} rotation={[0, 0, -0.2]} material={materials.blackRubber}>
          <boxGeometry args={[0.12, 0.015, 0.02]} />
        </mesh>
        
        {/* Poignée supérieure (levier) */}
        <mesh position={[0.05, 0.04, 0]} rotation={[0, 0, -0.1]} material={materials.blackRubber}>
          <boxGeometry args={[0.12, 0.015, 0.02]} />
        </mesh>

        {/* Manomètre */}
        <group position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={materials.chrome}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
          </mesh>
          {/* Face du manomètre (Vert = OK) */}
          <mesh position={[0, 0.011, 0]} rotation={[0, 0, 0]}>
             <circleGeometry args={[0.02, 12]} />
             <meshBasicMaterial color="#00ff00" />
          </mesh>
        </group>
      </group>

      {/* Tuyau (Lance) - Courbe simulée par Torus partiel ou Tubes */}
      <mesh position={[0.06, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.blackRubber}>
        <torusGeometry args={[0.15, 0.015, 8, 16, Math.PI]} />
      </mesh>
      
      {/* Embout du tuyau (buse) */}
      <mesh position={[0.06, 0.35, 0]} rotation={[Math.PI, 0, 0]} material={materials.blackRubber}>
        <cylinderGeometry args={[0.02, 0.01, 0.1, 8]} />
      </mesh>

    </group>
  );
}


