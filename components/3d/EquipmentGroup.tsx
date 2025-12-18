/**
 * Groupe d'équipements (Transformateur + 2 Containers)
 * Déplaçable comme un seul bloc
 */

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { getModelById } from './UnifiedModelCatalog';

interface EquipmentGroupProps {
  groupId: string;
  transformerId: string;
  transformerModelId: string;
  containerModelId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  hasConcreteSlabs: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function EquipmentGroup({
  groupId,
  transformerId,
  transformerModelId,
  containerModelId,
  position,
  rotation,
  hasConcreteSlabs,
  isSelected,
  onSelect,
}: EquipmentGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const initializedRef = useRef(false);
  
  // Initialiser la position UNE SEULE FOIS
  React.useEffect(() => {
    if (groupRef.current && !initializedRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      initializedRef.current = true;
      console.log(`📍 Groupe ${groupId} initialisé à:`, position);
    }
  }, []);
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(groupId);
    }
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(groupId);
      console.log('🎯 Groupe sélectionné:', groupId);
    }
  };
  
  const transformerModel = getModelById(transformerModelId);
  const containerModel = getModelById(containerModelId);
  
  const containerHeight = hasConcreteSlabs ? 0.7 : 0.3;
  
  return (
    <group 
      ref={groupRef}
      name={groupId}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
      {/* Transformateur au centre */}
      <group position={[0, 0.3, 0]}>
        {transformerModel && <transformerModel.component {...transformerModel.defaultProps} />}
      </group>
      
      {/* Container Front (devant) */}
      <group position={[0, containerHeight, -8]}>
        {containerModel && <containerModel.component {...containerModel.defaultProps} />}
      </group>
      
      {/* Container Back (derrière) */}
      <group position={[0, containerHeight, 8]}>
        {containerModel && <containerModel.component {...containerModel.defaultProps} />}
      </group>
      
      {/* Indicateur de sélection */}
      {isSelected && (
        <mesh position={[0, 5, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#8AFD81" wireframe />
        </mesh>
      )}
      
      {/* Indicateur hover */}
      {hovered && !isSelected && (
        <mesh position={[0, 5, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
      )}
    </group>
  );
}















