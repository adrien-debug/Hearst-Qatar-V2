/**
 * Layout Modulaire 3D
 * Place automatiquement les équipements ultra-réalistes selon la configuration
 */

import React, { useState } from 'react';
import * as THREE from 'three';
import { EquipmentPosition } from '../../lib/projectGenerator';
import { getModelById, renderModel } from './UnifiedModelCatalog';
import Transformer3D from './Transformer3D';
import Switchgear3D from './Switchgear3D';
import Substation3D from './Substation3D';
import { ConcreteSlabHD5, ConcreteSlabTransformer } from './ConcreteFoundation';
import { CirculationNetwork } from './CirculationPath';

interface ModularLayoutProps {
  equipment: EquipmentPosition[];
  showLabels?: boolean;
  selectedObjectId?: string | null;
  onSelectEquipment?: (id: string) => void;
}

/**
 * Composant pour rendre un équipement individuel
 */
function EquipmentRenderer({ 
  equipment, 
  isSelected, 
  onSelect 
}: { 
  equipment: EquipmentPosition;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const { id, type, modelId, position, rotation } = equipment;
  const [hovered, setHovered] = useState(false);
  
  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(id);
    }
  };
  
  // Récupérer le modèle depuis le catalogue unifié
  const model = getModelById(modelId);
  
  if (model) {
    // Utiliser le composant du catalogue unifié
    const Component = model.component;
    return (
      <group 
        position={position} 
        rotation={rotation}
        name={id}
        onClick={handleClick}
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
        <Component {...model.defaultProps} />
        
        {/* Outline de sélection */}
        {isSelected && (
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#8AFD81" wireframe />
          </mesh>
        )}
        
        {/* Indicateur hover */}
        {hovered && !isSelected && (
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </mesh>
        )}
      </group>
    );
  }
  
  // Fallback pour les modèles standards non dans le catalogue
  switch (type) {
    case 'transformer':
      return (
        <group position={position} rotation={rotation}>
          <Transformer3D transformerId={id} />
        </group>
      );
      
    case 'switchgear':
      return (
        <group position={position} rotation={rotation}>
          <Switchgear3D switchgearId={id} />
        </group>
      );
      
    case 'substation':
      return (
        <group position={position} rotation={rotation}>
          <Substation3D substationId={id} />
        </group>
      );
      
    case 'container':
      // Vérifier si c'est une dalle béton
      if (equipment.metadata?.isFoundation) {
        return (
          <group position={position} rotation={rotation}>
            <ConcreteSlabHD5 position={[0, 0, 0]} />
          </group>
        );
      }
      
      // Fallback pour container si pas dans catalogue
      return (
        <group position={position} rotation={rotation}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[12.196, 2.896, 2.438]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      );
      
    case 'cooling':
      // Fallback pour cooling si pas dans catalogue
      return (
        <group position={position} rotation={rotation}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[15, 3, 3]} />
            <meshStandardMaterial color="#27ae60" roughness={0.5} metalness={0.3} />
          </mesh>
        </group>
      );
      
    default:
      return null;
  }
}

/**
 * Label 3D pour identifier les équipements
 */
function EquipmentLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <group position={[position[0], position[1] + 3, position[2]]}>
      <mesh>
        <boxGeometry args={[2, 0.5, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      {/* Le texte serait ajouté avec Text de @react-three/drei si nécessaire */}
    </group>
  );
}

/**
 * Grille de référence pour le placement
 */
function ReferenceGrid({ size = 1000, divisions = 100 }) {
  return (
    <gridHelper 
      args={[size, divisions, '#666666', '#333333']} 
      position={[0, 0.01, 0]} 
    />
  );
}

/**
 * Power Block visuel (zone délimitée)
 */
function PowerBlockZone({ 
  id, 
  position, 
  width = 50, 
  depth = 120 
}: { 
  id: string; 
  position: [number, number, number];
  width?: number;
  depth?: number;
}) {
  return (
    <group position={position}>
      {/* Zone au sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial 
          color="#8AFD81" 
          transparent 
          opacity={0.1} 
          roughness={0.9} 
        />
      </mesh>
      
      {/* Bordures simplifiées avec des lignes */}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={5}
            array={new Float32Array([
              -width/2, 0, -depth/2,
              width/2, 0, -depth/2,
              width/2, 0, depth/2,
              -width/2, 0, depth/2,
              -width/2, 0, -depth/2,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8AFD81" />
      </line>
    </group>
  );
}

/**
 * Composant principal ModularLayout
 */
export default function ModularLayout({ 
  equipment, 
  showLabels = false,
  selectedObjectId = null,
  onSelectEquipment,
}: ModularLayoutProps) {
  // Grouper les équipements par Power Block
  const equipmentByPowerBlock = equipment.reduce((acc, eq) => {
    const powerBlockId = eq.metadata?.powerBlockId || 'other';
    if (!acc[powerBlockId]) {
      acc[powerBlockId] = [];
    }
    acc[powerBlockId].push(eq);
    return acc;
  }, {} as Record<string, EquipmentPosition[]>);

  // Identifier les Power Blocks uniques
  const powerBlocks = Object.keys(equipmentByPowerBlock)
    .filter(id => id.startsWith('PB'))
    .sort();

  return (
    <group>
      {/* Grille de référence (optionnelle) */}
      {/* <ReferenceGrid /> */}
      
      {/* Zones des Power Blocks - Désactivé temporairement pour debug */}
      {/* {powerBlocks.map((pbId, index) => {
        const pbEquipment = equipmentByPowerBlock[pbId];
        if (pbEquipment.length === 0) return null;
        
        const avgPosition = pbEquipment.reduce(
          (acc, eq) => {
            acc[0] += eq.position[0];
            acc[1] += eq.position[1];
            acc[2] += eq.position[2];
            return acc;
          },
          [0, 0, 0]
        ).map(v => v / pbEquipment.length) as [number, number, number];
        
        return (
          <PowerBlockZone 
            key={pbId} 
            id={pbId} 
            position={avgPosition} 
          />
        );
      })} */}
      
      {/* Rendu de tous les équipements */}
      {equipment.map((eq) => (
        <React.Fragment key={eq.id}>
          <EquipmentRenderer 
            equipment={eq}
            isSelected={eq.id === selectedObjectId}
            onSelect={onSelectEquipment}
          />
          {showLabels && (
            <EquipmentLabel text={eq.id} position={eq.position} />
          )}
        </React.Fragment>
      ))}
    </group>
  );
}

/**
 * Variante avec instancing pour de meilleures performances
 */
export function ModularLayoutInstanced({ 
  equipment 
}: { 
  equipment: EquipmentPosition[] 
}) {
  // Grouper par type de modèle pour l'instancing
  const equipmentByModel = equipment.reduce((acc, eq) => {
    if (!acc[eq.modelId]) {
      acc[eq.modelId] = [];
    }
    acc[eq.modelId].push(eq);
    return acc;
  }, {} as Record<string, EquipmentPosition[]>);

  return (
    <group>
      {Object.entries(equipmentByModel).map(([modelId, instances]) => {
        const model = getModelById(modelId);
        if (!model) return null;
        
        // Pour l'instant, on rend individuellement
        // L'instancing réel nécessiterait une refonte des composants
        return instances.map((eq) => (
          <EquipmentRenderer key={eq.id} equipment={eq} />
        ));
      })}
    </group>
  );
}

/**
 * Vue d'ensemble avec caméra optimale
 */
export function ModularLayoutOverview({ 
  equipment, 
  groundSize 
}: { 
  equipment: EquipmentPosition[];
  groundSize: number;
}) {
  return (
    <>
      <ModularLayout equipment={equipment} />
      {/* La caméra sera configurée dans le Canvas parent */}
    </>
  );
}
