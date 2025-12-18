/**
 * Zone Sécurisée Électrique
 * Orchestrateur pour transformateur + 2 containers avec clôture et graviers
 */

import React from 'react';
import * as THREE from 'three';
import GravelGround from './GravelGround';
import PerforatedMeshFence from './PerforatedMeshFence';
import { Scene3DConfig } from '../../config/3d.config';

interface SecureElectricalZoneProps {
  transformerPosition: [number, number, number];
  containerPositions: [[number, number, number], [number, number, number]];
  transformerDimensions?: [number, number, number];
  containerDimensions?: [number, number, number];
  showFence?: boolean;
  showGravel?: boolean;
  gateOpen?: boolean;
  customConfig?: Partial<typeof Scene3DConfig.layout.vrd.secureZone>;
}

/**
 * Calcule les dimensions de la zone sécurisée en fonction des équipements
 */
function calculateZoneDimensions(
  transformerPos: [number, number, number],
  containerPositions: [[number, number, number], [number, number, number]],
  transformerDims: [number, number, number],
  containerDims: [number, number, number],
  config: typeof Scene3DConfig.layout.vrd.secureZone
) {
  // Récupérer toutes les positions
  const allPositions = [transformerPos, ...containerPositions];
  
  // Calculer les limites (min/max) en X et Z
  const xPositions = allPositions.map(pos => pos[0]);
  const zPositions = allPositions.map(pos => pos[2]);
  
  const minX = Math.min(...xPositions);
  const maxX = Math.max(...xPositions);
  const minZ = Math.min(...zPositions);
  const maxZ = Math.max(...zPositions);
  
  // Ajouter les demi-dimensions des équipements
  const transformerHalfWidth = transformerDims[0] / 2;
  const transformerHalfDepth = transformerDims[2] / 2;
  const containerHalfWidth = containerDims[0] / 2;
  const containerHalfDepth = containerDims[2] / 2;
  
  // Calculer les limites réelles avec les dimensions
  const actualMinX = minX - Math.max(transformerHalfWidth, containerHalfWidth);
  const actualMaxX = maxX + Math.max(transformerHalfWidth, containerHalfWidth);
  const actualMinZ = minZ - Math.max(transformerHalfDepth, containerHalfDepth);
  const actualMaxZ = maxZ + Math.max(transformerHalfDepth, containerHalfDepth);
  
  // Ajouter les marges de sécurité
  const margin = config.fenceToEquipment + Math.max(
    config.transformerClearance,
    config.containerClearance
  );
  
  const width = (actualMaxX - actualMinX) + (margin * 2);
  const depth = (actualMaxZ - actualMinZ) + (margin * 2);
  
  // Position centrale de la zone
  const centerX = (actualMinX + actualMaxX) / 2;
  const centerZ = (actualMinZ + actualMaxZ) / 2;
  
  return {
    width,
    depth,
    center: [centerX, 0, centerZ] as [number, number, number],
  };
}

/**
 * Composant principal de zone sécurisée
 */
export default function SecureElectricalZone({
  transformerPosition,
  containerPositions,
  transformerDimensions = [2.5, 2.0, 2.5],
  containerDimensions = [12.196, 2.896, 2.438],
  showFence = true,
  showGravel = true,
  gateOpen = false,
  customConfig,
}: SecureElectricalZoneProps) {
  
  // Configuration de la zone sécurisée
  const config = {
    ...Scene3DConfig.layout.vrd.secureZone,
    ...customConfig,
  };
  
  // Calculer les dimensions de la zone
  const zoneDimensions = calculateZoneDimensions(
    transformerPosition,
    containerPositions,
    transformerDimensions,
    containerDimensions,
    config
  );
  
  return (
    <group name="secure-electrical-zone">
      {/* Sol en graviers */}
      {showGravel && (
        <GravelGround
          width={zoneDimensions.width}
          depth={zoneDimensions.depth}
          position={zoneDimensions.center}
          thickness={config.gravel.thickness}
          color={config.gravel.color}
          roughness={config.gravel.roughness}
        />
      )}
      
      {/* Clôture périmétrique avec grillage perforé */}
      {showFence && (
        <PerforatedMeshFence
          width={zoneDimensions.width}
          depth={zoneDimensions.depth}
          position={zoneDimensions.center}
          height={config.fence.height}
          postSpacing={config.fence.postSpacing}
          meshHoleSize={config.fence.meshHoleSize}
          wireThickness={config.fence.wireThickness}
          color={config.fence.color}
          hasGate={true}
          gatePosition={config.gate.position}
          gateWidth={config.gate.width}
          isGateOpen={gateOpen}
        />
      )}
      
      {/* Signalétique de sécurité */}
      {config.signage.enabled && (
        <SecuritySignage
          zoneDimensions={zoneDimensions}
          config={config}
        />
      )}
      
      {/* Zones de sécurité visuelles (optionnel - pour debug) */}
      {/* <SafetyZoneIndicators
        transformerPosition={transformerPosition}
        containerPositions={containerPositions}
        config={config}
      /> */}
    </group>
  );
}

/**
 * Signalétique de sécurité autour de la zone
 */
function SecuritySignage({
  zoneDimensions,
  config,
}: {
  zoneDimensions: { width: number; depth: number; center: [number, number, number] };
  config: typeof Scene3DConfig.layout.vrd.secureZone;
}) {
  
  const signs = config.signage.signs;
  const { width, depth, center } = zoneDimensions;
  
  return (
    <group>
      {signs.map((sign, index) => {
        const positions: [number, number, number][] = [];
        
        if (sign.position === 'all_sides') {
          // Placer des panneaux sur les 4 côtés
          positions.push(
            [center[0], sign.height, center[2] + depth / 2 + 0.3], // Avant
            [center[0], sign.height, center[2] - depth / 2 - 0.3], // Arrière
            [center[0] - width / 2 - 0.3, sign.height, center[2]], // Gauche
            [center[0] + width / 2 + 0.3, sign.height, center[2]]  // Droite
          );
        } else if (sign.position === 'front_only') {
          // Seulement à l'avant (côté portail)
          positions.push([center[0], sign.height, center[2] + depth / 2 + 0.3]);
        }
        
        return positions.map((pos, posIndex) => (
          <SafetySign
            key={`${index}-${posIndex}`}
            position={pos}
            text={sign.text}
            type={sign.type}
          />
        ));
      })}
    </group>
  );
}

/**
 * Panneau de sécurité individuel
 */
function SafetySign({
  position,
  text,
  type,
}: {
  position: [number, number, number];
  text: string;
  type: 'danger_electrical' | 'restricted_access';
}) {
  
  const backgroundColor = type === 'danger_electrical' ? '#e74c3c' : '#f39c12';
  const textColor = '#ffffff';
  
  return (
    <group position={position}>
      {/* Poteau de support */}
      <mesh position={[0, -0.75, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 16]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Panneau */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial
          color={backgroundColor}
          roughness={0.3}
          metalness={0.5}
          emissive={backgroundColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Bordure réfléchissante */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.25, 0.43, 0.02]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.9}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Icône de danger (triangle ou cercle) */}
      {type === 'danger_electrical' && (
        <mesh position={[-0.4, 0, 0.04]}>
          <circleGeometry args={[0.12, 3]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.2}
            emissive="#ffff00"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Indicateurs visuels des zones de sécurité (pour debug/visualisation)
 */
function SafetyZoneIndicators({
  transformerPosition,
  containerPositions,
  config,
}: {
  transformerPosition: [number, number, number];
  containerPositions: [[number, number, number], [number, number, number]];
  config: typeof Scene3DConfig.layout.vrd.secureZone;
}) {
  
  return (
    <group>
      {/* Zone de sécurité du transformateur */}
      <mesh
        position={[transformerPosition[0], 0.02, transformerPosition[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[config.transformerClearance, config.transformerClearance + 0.1, 32]} />
        <meshBasicMaterial
          color="#e74c3c"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Zones de sécurité des containers */}
      {containerPositions.map((pos, index) => (
        <mesh
          key={index}
          position={[pos[0], 0.02, pos[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[config.containerClearance, config.containerClearance + 0.1, 32]} />
          <meshBasicMaterial
            color="#f39c12"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Variante simplifiée pour tests
 */
export function SimpleSecureZone({
  centerPosition = [0, 0, 0] as [number, number, number],
  width = 30,
  depth = 15,
}: {
  centerPosition?: [number, number, number];
  width?: number;
  depth?: number;
}) {
  const config = Scene3DConfig.layout.vrd.secureZone;
  
  return (
    <group position={centerPosition}>
      <GravelGround
        width={width}
        depth={depth}
        position={[0, 0, 0]}
        thickness={config.gravel.thickness}
        color={config.gravel.color}
        roughness={config.gravel.roughness}
      />
      <PerforatedMeshFence
        width={width}
        depth={depth}
        position={[0, 0, 0]}
        height={config.fence.height}
        color={config.fence.color}
        hasGate={true}
        gatePosition="front"
        gateWidth={4}
      />
    </group>
  );
}

/**
 * Hook pour calculer automatiquement les zones sécurisées
 * à partir d'une liste d'équipements
 */
export function useSecureZoneDetection(equipment: any[]) {
  return React.useMemo(() => {
    const zones: Array<{
      transformer: any;
      containers: [any, any];
    }> = [];
    
    // Grouper les équipements par Power Block
    const equipmentByPowerBlock = equipment.reduce((acc, eq) => {
      const powerBlockId = eq.metadata?.powerBlockId || 'other';
      if (!acc[powerBlockId]) {
        acc[powerBlockId] = [];
      }
      acc[powerBlockId].push(eq);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Pour chaque Power Block, trouver 1 transformateur + 2 containers
    (Object.values(equipmentByPowerBlock) as any[][]).forEach((pbEquipment) => {
      const transformer = pbEquipment.find(eq => eq.type === 'transformer');
      const containers = pbEquipment.filter(eq => eq.type === 'container' && !eq.metadata?.isFoundation);
      
      if (transformer && containers.length >= 2) {
        zones.push({
          transformer,
          containers: [containers[0], containers[1]] as [any, any],
        });
      }
    });
    
    return zones;
  }, [equipment]);
}




