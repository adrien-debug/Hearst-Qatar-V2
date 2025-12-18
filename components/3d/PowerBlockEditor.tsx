/**
 * Power Block Editor - Outil interactif pour déplacer, orienter et faire tourner les éléments
 * ==========================================================================================
 * 
 * Outil complet pour manipuler les éléments du Power Block 25 MW avec :
 * - Déplacement (translation)
 * - Rotation
 * - Orientation
 * - Contrôles visuels interactifs
 */

import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import PowerBlock25MW from './PowerBlock25MW';

interface PowerBlockEditorProps {
  /** Position initiale [x, y, z] */
  initialPosition?: [number, number, number];
  /** Rotation initiale [x, y, z] en radians */
  initialRotation?: [number, number, number];
  /** Échelle initiale */
  initialScale?: number;
  /** Mode d'affichage des contrôles */
  showControls?: boolean;
  /** Mode de transformation (translate, rotate, scale) */
  mode?: 'translate' | 'rotate' | 'scale';
  /** Espace de transformation (world, local) */
  space?: 'world' | 'local';
}

/**
 * Composant pour éditer un élément individuel
 */
function EditableElement({
  name,
  position,
  rotation,
  scale = 1,
  onUpdate,
  children,
}: {
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onUpdate?: (pos: [number, number, number], rot?: [number, number, number], scl?: number) => void;
  children: React.ReactNode;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  const handleChange = () => {
    if (controlsRef.current && groupRef.current) {
      const pos = groupRef.current.position;
      const rot = groupRef.current.rotation;
      const scl = groupRef.current.scale;
      
      onUpdate?.(
        [pos.x, pos.y, pos.z],
        [rot.x, rot.y, rot.z],
        scl.x
      );
    }
  };

  return (
    <group>
      <TransformControls
        ref={controlsRef}
        object={groupRef.current || undefined}
        mode="translate"
        space="world"
        showX={true}
        showY={true}
        showZ={true}
        enabled={isSelected}
        onChange={handleChange}
      />
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={() => setIsSelected(!isSelected)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {children}
        {/* Indicateur de sélection */}
        {isSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial
              color="#00ff00"
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

/**
 * Power Block Editor - Outil principal
 */
export default function PowerBlockEditor({
  initialPosition = [0, 0, 0],
  initialRotation = [0, 0, 0],
  initialScale = 1,
  showControls = true,
  mode = 'translate',
  space = 'world',
}: PowerBlockEditorProps) {
  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [rotation, setRotation] = useState<[number, number, number]>(initialRotation);
  const [scale, setScale] = useState(initialScale);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [elementPositions, setElementPositions] = useState<Record<string, [number, number, number]>>({});
  const [elementRotations, setElementRotations] = useState<Record<string, [number, number, number]>>({});
  
  const mainGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  // Mise à jour des positions/rotations des éléments
  const updateElement = (name: string, pos: [number, number, number], rot?: [number, number, number]) => {
    setElementPositions(prev => ({ ...prev, [name]: pos }));
    if (rot) {
      setElementRotations(prev => ({ ...prev, [name]: rot }));
    }
  };

  // Dimensions du Power Block
  const bodyWidth = 3.8;
  const bodyDepth = 2.3;
  const bodyHeight = 2.2;
  const bodyY = 0.2 / 2 + bodyHeight / 2;
  const elementDistance = 3.0;

  return (
    <group>
      {/* Contrôles pour le Power Block principal */}
      {showControls && (
        <TransformControls
          ref={controlsRef}
          object={mainGroupRef.current || undefined}
          mode={mode}
          space={space}
          showX={true}
          showY={true}
          showZ={true}
          enabled={selectedElement === 'main'}
          onChange={() => {
            if (mainGroupRef.current) {
              const pos = mainGroupRef.current.position;
              const rot = mainGroupRef.current.rotation;
              const scl = mainGroupRef.current.scale;
              setPosition([pos.x, pos.y, pos.z]);
              setRotation([rot.x, rot.y, rot.z]);
              setScale(scl.x);
            }
          }}
        />
      )}

      {/* Power Block principal */}
      <group
        ref={mainGroupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={() => setSelectedElement('main')}
      >
        <PowerBlock25MW
          position={[0, 0, 0]}
          color="#1a1a1a"
          secondaryColor="#00A651"
        />

        {/* Éléments éditables individuels */}
        
        {/* Panneau de contrôle avant */}
        <EditableElement
          name="panneau-avant"
          position={elementPositions['panneau-avant'] || [0, bodyY, bodyDepth / 2 + elementDistance]}
          rotation={elementRotations['panneau-avant']}
          onUpdate={(pos, rot) => updateElement('panneau-avant', pos, rot)}
        >
          <mesh castShadow>
            <boxGeometry args={[2.0, 0.8, 0.1]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
        </EditableElement>

        {/* Ventilateur gauche */}
        <EditableElement
          name="ventilateur-gauche"
          position={elementPositions['ventilateur-gauche'] || [-bodyWidth / 2 - elementDistance, bodyY, 0]}
          rotation={elementRotations['ventilateur-gauche'] || [0, Math.PI / 2, 0]}
          onUpdate={(pos, rot) => updateElement('ventilateur-gauche', pos, rot)}
        >
          <group>
            <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.02, 16]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </group>
        </EditableElement>

        {/* Ventilateur droit */}
        <EditableElement
          name="ventilateur-droit"
          position={elementPositions['ventilateur-droit'] || [bodyWidth / 2 + elementDistance, bodyY, 0]}
          rotation={elementRotations['ventilateur-droit'] || [0, -Math.PI / 2, 0]}
          onUpdate={(pos, rot) => updateElement('ventilateur-droit', pos, rot)}
        >
          <group>
            <mesh rotation={[0, -Math.PI / 2, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.02, 16]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[-0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </group>
        </EditableElement>

        {/* Ventilateur arrière */}
        <EditableElement
          name="ventilateur-arriere"
          position={elementPositions['ventilateur-arriere'] || [0, bodyY, -bodyDepth / 2 - elementDistance]}
          rotation={elementRotations['ventilateur-arriere'] || [Math.PI / 2, 0, 0]}
          onUpdate={(pos, rot) => updateElement('ventilateur-arriere', pos, rot)}
        >
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.02, 16]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.15, 16]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </group>
        </EditableElement>

        {/* Bande colorée */}
        <EditableElement
          name="bande-colorée"
          position={elementPositions['bande-colorée'] || [0, bodyY + bodyHeight / 2 - 0.05, bodyDepth / 2 + elementDistance]}
          onUpdate={(pos) => updateElement('bande-colorée', pos)}
        >
          <mesh castShadow>
            <boxGeometry args={[bodyWidth, 0.1, 0.1]} />
            <meshStandardMaterial color="#00A651" />
          </mesh>
        </EditableElement>
      </group>

      {/* Affichage des informations de position */}
      {selectedElement && (
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      )}
    </group>
  );
}

/**
 * Panel de contrôle UI pour l'éditeur
 */
export function PowerBlockEditorPanel({
  position,
  rotation,
  scale,
  onPositionChange,
  onRotationChange,
  onScaleChange,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: [number, number, number]) => void;
  onScaleChange: (scl: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 min-w-[300px]">
      <h3 className="text-lg font-bold mb-4">Power Block Editor</h3>
      
      {/* Position */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Position (mètres)</label>
        <div className="space-y-2">
          <div>
            <label className="text-xs">X:</label>
            <input
              type="number"
              value={position[0].toFixed(2)}
              onChange={(e) => onPositionChange([parseFloat(e.target.value) || 0, position[1], position[2]])}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Y:</label>
            <input
              type="number"
              value={position[1].toFixed(2)}
              onChange={(e) => onPositionChange([position[0], parseFloat(e.target.value) || 0, position[2]])}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Z:</label>
            <input
              type="number"
              value={position[2].toFixed(2)}
              onChange={(e) => onPositionChange([position[0], position[1], parseFloat(e.target.value) || 0])}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <label className="block text-sm mb-2">Rotation (degrés)</label>
        <div className="space-y-2">
          <div>
            <label className="text-xs">X:</label>
            <input
              type="number"
              value={(rotation[0] * 180 / Math.PI).toFixed(2)}
              onChange={(e) => onRotationChange([(parseFloat(e.target.value) || 0) * Math.PI / 180, rotation[1], rotation[2]])}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Y:</label>
            <input
              type="number"
              value={(rotation[1] * 180 / Math.PI).toFixed(2)}
              onChange={(e) => onRotationChange([rotation[0], (parseFloat(e.target.value) || 0) * Math.PI / 180, rotation[2]])}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-xs">Z:</label>
            <input
              type="number"
              value={(rotation[2] * 180 / Math.PI).toFixed(2)}
              onChange={(e) => onRotationChange([rotation[0], rotation[1], (parseFloat(e.target.value) || 0) * Math.PI / 180])}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      {/* Scale */}
      <div>
        <label className="block text-sm mb-2">Échelle</label>
        <input
          type="number"
          step="0.1"
          value={scale.toFixed(2)}
          onChange={(e) => onScaleChange(parseFloat(e.target.value) || 1)}
          className="w-full bg-gray-700 text-white px-2 py-1 rounded"
        />
      </div>
    </div>
  );
}
