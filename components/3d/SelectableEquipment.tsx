/**
 * Équipement Sélectionnable
 * Wrapper pour rendre les équipements cliquables et sélectionnables
 */

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SelectableEquipmentProps {
  id: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}

export default function SelectableEquipment({
  id,
  isSelected,
  onSelect,
  children,
}: SelectableEquipmentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animation de pulsation pour l'objet sélectionné
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
      groupRef.current.scale.setScalar(pulse);
    } else if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <group
      ref={groupRef}
      name={id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
      
      {/* Outline de sélection */}
      {isSelected && (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="#8AFD81" wireframe />
        </mesh>
      )}
      
      {/* Indicateur hover */}
      {hovered && !isSelected && (
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
}
