/**
 * Grillage métallique perforé (mesh fence) pour zones sécurisées
 * Avec poteaux, tissu perforé et portail d'accès
 */

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface PerforatedMeshFenceProps {
  width: number;
  depth: number;
  position?: [number, number, number];
  height?: number;
  postSpacing?: number;
  meshHoleSize?: number;
  wireThickness?: number;
  color?: string;
  hasGate?: boolean;
  gatePosition?: 'front' | 'back' | 'left' | 'right';
  gateWidth?: number;
  isGateOpen?: boolean;
}

/**
 * Composant de grillage métallique perforé complet
 */
export default function PerforatedMeshFence({
  width,
  depth,
  position = [0, 0, 0],
  height = 2.5,
  postSpacing = 3.0,
  meshHoleSize = 0.05,
  wireThickness = 0.003,
  color = '#7f8c8d',
  hasGate = true,
  gatePosition = 'front',
  gateWidth = 4.0,
  isGateOpen = false,
}: PerforatedMeshFenceProps) {
  
  return (
    <group position={position}>
      {/* Mur avant */}
      <FenceSection
        length={width}
        height={height}
        position={[0, 0, depth / 2]}
        rotation={[0, 0, 0]}
        postSpacing={postSpacing}
        meshHoleSize={meshHoleSize}
        wireThickness={wireThickness}
        color={color}
        hasGate={hasGate && gatePosition === 'front'}
        gateWidth={gateWidth}
        gateOffset={0}
      />
      
      {/* Mur arrière */}
      <FenceSection
        length={width}
        height={height}
        position={[0, 0, -depth / 2]}
        rotation={[0, Math.PI, 0]}
        postSpacing={postSpacing}
        meshHoleSize={meshHoleSize}
        wireThickness={wireThickness}
        color={color}
        hasGate={hasGate && gatePosition === 'back'}
        gateWidth={gateWidth}
        gateOffset={0}
      />
      
      {/* Mur gauche */}
      <FenceSection
        length={depth}
        height={height}
        position={[-width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        postSpacing={postSpacing}
        meshHoleSize={meshHoleSize}
        wireThickness={wireThickness}
        color={color}
        hasGate={hasGate && gatePosition === 'left'}
        gateWidth={gateWidth}
        gateOffset={0}
      />
      
      {/* Mur droit */}
      <FenceSection
        length={depth}
        height={height}
        position={[width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        postSpacing={postSpacing}
        meshHoleSize={meshHoleSize}
        wireThickness={wireThickness}
        color={color}
        hasGate={hasGate && gatePosition === 'right'}
        gateWidth={gateWidth}
        gateOffset={0}
      />
      
      {/* Portail coulissant si demandé */}
      {hasGate && (
        <SlidingGate
          width={gateWidth}
          height={height}
          position={getGatePosition(gatePosition, width, depth, gateWidth)}
          rotation={getGateRotation(gatePosition)}
          isOpen={isGateOpen}
          meshHoleSize={meshHoleSize}
          wireThickness={wireThickness}
          color={color}
        />
      )}
    </group>
  );
}

/**
 * Section de clôture avec poteaux et grillage
 */
function FenceSection({
  length,
  height,
  position,
  rotation,
  postSpacing,
  meshHoleSize,
  wireThickness,
  color,
  hasGate,
  gateWidth,
  gateOffset,
}: {
  length: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  postSpacing: number;
  meshHoleSize: number;
  wireThickness: number;
  color: string;
  hasGate?: boolean;
  gateWidth?: number;
  gateOffset?: number;
}) {
  
  const numPosts = Math.ceil(length / postSpacing) + 1;
  
  return (
    <group position={position} rotation={rotation}>
      {/* Poteaux métalliques */}
      {Array.from({ length: numPosts }).map((_, i) => {
        const x = -length / 2 + i * postSpacing;
        
        // Ne pas placer de poteau dans la zone du portail
        if (hasGate && gateWidth && gateOffset !== undefined) {
          const gateStart = gateOffset - gateWidth / 2;
          const gateEnd = gateOffset + gateWidth / 2;
          if (x > gateStart && x < gateEnd) {
            return null;
          }
        }
        
        return (
          <FencePost
            key={i}
            position={[x, height / 2, 0]}
            height={height}
            color={color}
          />
        );
      })}
      
      {/* Grillage perforé entre les poteaux */}
      {Array.from({ length: numPosts - 1 }).map((_, i) => {
        const x = -length / 2 + i * postSpacing + postSpacing / 2;
        const sectionWidth = postSpacing;
        
        // Ne pas placer de grillage dans la zone du portail
        if (hasGate && gateWidth && gateOffset !== undefined) {
          const gateStart = gateOffset - gateWidth / 2;
          const gateEnd = gateOffset + gateWidth / 2;
          if (x > gateStart - postSpacing / 2 && x < gateEnd + postSpacing / 2) {
            return null;
          }
        }
        
        return (
          <MeshPanel
            key={i}
            width={sectionWidth}
            height={height}
            position={[x, height / 2, 0]}
            holeSize={meshHoleSize}
            wireThickness={wireThickness}
            color={color}
          />
        );
      })}
    </group>
  );
}

/**
 * Poteau métallique
 */
function FencePost({
  position,
  height,
  color,
}: {
  position: [number, number, number];
  height: number;
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.08, height, 0.08]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.7}
      />
    </mesh>
  );
}

/**
 * Panneau de grillage perforé optimisé
 */
function MeshPanel({
  width,
  height,
  position,
  holeSize,
  wireThickness,
  color,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  holeSize: number;
  wireThickness: number;
  color: string;
}) {
  
  // Créer une texture de grillage perforé
  const meshTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const resolution = 256;
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Fond transparent
    ctx.clearRect(0, 0, resolution, resolution);
    
    // Calculer le nombre de trous
    const holesX = Math.floor(width / holeSize);
    const holesY = Math.floor(height / holeSize);
    const cellSizeX = resolution / holesX;
    const cellSizeY = resolution / holesY;
    
    // Dessiner le grillage
    ctx.fillStyle = color;
    
    // Fils horizontaux
    for (let y = 0; y <= holesY; y++) {
      const posY = y * cellSizeY;
      ctx.fillRect(0, posY - cellSizeY * 0.05, resolution, cellSizeY * 0.1);
    }
    
    // Fils verticaux
    for (let x = 0; x <= holesX; x++) {
      const posX = x * cellSizeX;
      ctx.fillRect(posX - cellSizeX * 0.05, 0, cellSizeX * 0.1, resolution);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    
    return texture;
  }, [width, height, holeSize, color]);
  
  // Créer une alpha map pour la transparence
  const alphaMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    const resolution = 256;
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Fond noir (transparent)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, resolution, resolution);
    
    const holesX = Math.floor(width / holeSize);
    const holesY = Math.floor(height / holeSize);
    const cellSizeX = resolution / holesX;
    const cellSizeY = resolution / holesY;
    
    // Dessiner les fils en blanc (opaque)
    ctx.fillStyle = '#ffffff';
    
    // Fils horizontaux
    for (let y = 0; y <= holesY; y++) {
      const posY = y * cellSizeY;
      ctx.fillRect(0, posY - cellSizeY * 0.05, resolution, cellSizeY * 0.1);
    }
    
    // Fils verticaux
    for (let x = 0; x <= holesX; x++) {
      const posX = x * cellSizeX;
      ctx.fillRect(posX - cellSizeX * 0.05, 0, cellSizeX * 0.1, resolution);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    
    return texture;
  }, [width, height, holeSize]);
  
  return (
    <mesh position={position} castShadow receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={meshTexture}
        alphaMap={alphaMap}
        transparent
        side={THREE.DoubleSide}
        color={color}
        roughness={0.4}
        metalness={0.7}
        alphaTest={0.1}
      />
    </mesh>
  );
}

/**
 * Portail coulissant
 */
function SlidingGate({
  width,
  height,
  position,
  rotation,
  isOpen,
  meshHoleSize,
  wireThickness,
  color,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  rotation: [number, number, number];
  isOpen: boolean;
  meshHoleSize: number;
  wireThickness: number;
  color: string;
}) {
  
  const gateRef = useRef<THREE.Group>(null);
  
  // Animation du portail
  useFrame(() => {
    if (gateRef.current) {
      const targetX = isOpen ? width : 0;
      gateRef.current.position.x = THREE.MathUtils.lerp(
        gateRef.current.position.x,
        targetX,
        0.05
      );
    }
  });
  
  return (
    <group position={position} rotation={rotation}>
      {/* Rail au sol */}
      <mesh position={[width / 2, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width * 2, 0.1, 0.15]} />
        <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Portail coulissant */}
      <group ref={gateRef}>
        {/* Cadre du portail */}
        <group>
          {/* Montant gauche */}
          <mesh position={[-width / 2, height / 2, 0]} castShadow>
            <boxGeometry args={[0.1, height, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
          </mesh>
          
          {/* Montant droit */}
          <mesh position={[width / 2, height / 2, 0]} castShadow>
            <boxGeometry args={[0.1, height, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
          </mesh>
          
          {/* Traverse haute */}
          <mesh position={[0, height - 0.05, 0]} castShadow>
            <boxGeometry args={[width, 0.1, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
          </mesh>
          
          {/* Traverse basse */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[width, 0.1, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
        
        {/* Grillage du portail */}
        <MeshPanel
          width={width - 0.2}
          height={height - 0.3}
          position={[0, height / 2, 0]}
          holeSize={meshHoleSize}
          wireThickness={wireThickness}
          color={color}
        />
        
        {/* Roues de guidage */}
        <mesh position={[-width / 4, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[width / 4, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
      
      {/* Poteaux de support du portail */}
      <FencePost
        position={[-width / 2 - 0.1, height / 2, 0]}
        height={height}
        color={color}
      />
      <FencePost
        position={[width / 2 + 0.1, height / 2, 0]}
        height={height}
        color={color}
      />
    </group>
  );
}

/**
 * Calculer la position du portail selon son emplacement
 */
function getGatePosition(
  gatePosition: 'front' | 'back' | 'left' | 'right',
  width: number,
  depth: number,
  gateWidth: number
): [number, number, number] {
  switch (gatePosition) {
    case 'front':
      return [0, 0, depth / 2];
    case 'back':
      return [0, 0, -depth / 2];
    case 'left':
      return [-width / 2, 0, 0];
    case 'right':
      return [width / 2, 0, 0];
  }
}

/**
 * Calculer la rotation du portail selon son emplacement
 */
function getGateRotation(
  gatePosition: 'front' | 'back' | 'left' | 'right'
): [number, number, number] {
  switch (gatePosition) {
    case 'front':
      return [0, 0, 0];
    case 'back':
      return [0, Math.PI, 0];
    case 'left':
      return [0, Math.PI / 2, 0];
    case 'right':
      return [0, -Math.PI / 2, 0];
  }
}

/**
 * Variante simplifiée sans portail
 */
export function SimpleMeshFence({
  width,
  depth,
  position = [0, 0, 0],
  height = 2.5,
  color = '#7f8c8d',
}: {
  width: number;
  depth: number;
  position?: [number, number, number];
  height?: number;
  color?: string;
}) {
  return (
    <PerforatedMeshFence
      width={width}
      depth={depth}
      position={position}
      height={height}
      color={color}
      hasGate={false}
    />
  );
}




