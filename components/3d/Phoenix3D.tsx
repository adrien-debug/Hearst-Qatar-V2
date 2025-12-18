import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cone, Box, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

export const Phoenix3D = ({ position = [0, 0, 0], scale = 1, color = "#ff4500" }: { position?: [number, number, number], scale?: number, color?: string }) => {
  const group = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (group.current) {
      // Floating motion
      group.current.position.y = position[1] + Math.sin(t * 2) * 0.2;
      group.current.rotation.z = Math.sin(t * 1) * 0.05;
    }

    // Wing flapping
    if (leftWing.current && rightWing.current) {
      const flap = Math.sin(t * 8) * 0.4;
      leftWing.current.rotation.z = flap + 0.2;
      rightWing.current.rotation.z = -flap - 0.2;
    }

    // Tail waving
    if (tail.current) {
      tail.current.rotation.x = Math.sin(t * 3) * 0.2 - 0.2;
      tail.current.rotation.y = Math.sin(t * 2) * 0.1;
    }

    // Head bobbing
    if (head.current) {
      head.current.rotation.x = Math.sin(t * 4) * 0.1;
    }
  });

  const fieryMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: "#ff2200",
    emissiveIntensity: 0.8,
    roughness: 0.4,
    metalness: 0.6,
  });

  const featherMaterial = new THREE.MeshStandardMaterial({
    color: "#ff8800",
    emissive: "#ff4400",
    emissiveIntensity: 0.5,
    roughness: 0.5,
  });

  return (
    <group ref={group} position={new THREE.Vector3(...position)} scale={scale}>
      
      {/* Body */}
      <Sphere args={[0.5, 32, 32]} scale={[1, 1.5, 1]} material={fieryMaterial} />

      {/* Head */}
      <group ref={head} position={[0, 1, 0.3]}>
        <Sphere args={[0.35, 32, 32]} material={fieryMaterial} />
        {/* Beak */}
        <Cone args={[0.1, 0.4, 32]} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} material={new THREE.MeshStandardMaterial({ color: "#ffd700", roughness: 0.2, metalness: 0.8 })} />
        {/* Eyes */}
        <Sphere args={[0.05]} position={[0.15, 0.1, 0.25]} material={new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 1 })} />
        <Sphere args={[0.05]} position={[-0.15, 0.1, 0.25]} material={new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 1 })} />
        
        {/* Crest */}
        <group position={[0, 0.3, -0.1]} rotation={[-0.5, 0, 0]}>
             <Cone args={[0.08, 0.4, 16]} position={[0, 0, 0]} material={featherMaterial} />
             <Cone args={[0.06, 0.3, 16]} position={[0.1, -0.05, 0]} rotation={[0, 0, -0.3]} material={featherMaterial} />
             <Cone args={[0.06, 0.3, 16]} position={[-0.1, -0.05, 0]} rotation={[0, 0, 0.3]} material={featherMaterial} />
        </group>
      </group>

      {/* Wings */}
      <group position={[0, 0.2, 0]}>
        <group ref={leftWing} position={[0.4, 0, 0]}>
          {/* Main Wing Bone */}
          <Box args={[1.5, 0.1, 0.4]} position={[0.75, 0, 0]} material={fieryMaterial} />
          {/* Feathers */}
          {[...Array(5)].map((_, i) => (
             <Cone key={i} args={[0.15, 1.2, 16]} position={[0.4 + i * 0.3, 0, 0.3]} rotation={[1.5, 0, 0]} material={featherMaterial} />
          ))}
          {/* Secondary Feathers */}
           {[...Array(4)].map((_, i) => (
             <Cone key={`sec-${i}`} args={[0.12, 0.9, 16]} position={[0.6 + i * 0.3, 0, 0.5]} rotation={[1.6, 0, 0]} material={featherMaterial} />
          ))}
        </group>

        <group ref={rightWing} position={[-0.4, 0, 0]}>
          <Box args={[1.5, 0.1, 0.4]} position={[-0.75, 0, 0]} material={fieryMaterial} />
           {/* Feathers */}
           {[...Array(5)].map((_, i) => (
             <Cone key={i} args={[0.15, 1.2, 16]} position={[-0.4 - i * 0.3, 0, 0.3]} rotation={[1.5, 0, 0]} material={featherMaterial} />
          ))}
           {/* Secondary Feathers */}
           {[...Array(4)].map((_, i) => (
             <Cone key={`sec-${i}`} args={[0.12, 0.9, 16]} position={[-0.6 - i * 0.3, 0, 0.5]} rotation={[1.6, 0, 0]} material={featherMaterial} />
          ))}
        </group>
      </group>

      {/* Tail */}
      <group ref={tail} position={[0, -0.5, -0.3]} rotation={[0.5, 0, 0]}>
         <Cone args={[0.2, 1.5, 16]} position={[0, -0.5, 0]} rotation={[3.2, 0, 0]} material={featherMaterial} />
         <Cone args={[0.15, 1.2, 16]} position={[0.2, -0.4, 0.1]} rotation={[3.1, 0, -0.2]} material={featherMaterial} />
         <Cone args={[0.15, 1.2, 16]} position={[-0.2, -0.4, 0.1]} rotation={[3.1, 0, 0.2]} material={featherMaterial} />
         
         {/* Long Trail Feathers */}
         <Octahedron args={[0.1]} position={[0, -1.2, 0]} scale={[1, 5, 1]} material={fieryMaterial} />
         <Octahedron args={[0.08]} position={[0.3, -1.0, 0]} scale={[1, 4, 1]} rotation={[0, 0, -0.2]} material={fieryMaterial} />
         <Octahedron args={[0.08]} position={[-0.3, -1.0, 0]} scale={[1, 4, 1]} rotation={[0, 0, 0.2]} material={fieryMaterial} />
      </group>

      {/* Glow / Aura Effect (Simplified) */}
      <pointLight color="#ff6600" intensity={2} distance={5} decay={2} />
      
    </group>
  );
};


