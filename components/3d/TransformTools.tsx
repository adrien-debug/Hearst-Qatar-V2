/**
 * Outils de Transformation Discrets - Déplacement, Rotation, Suppression
 * ======================================================================
 * 
 * Outils discrets pour manipuler les objets 3D
 */

import { useState, useEffect, useRef } from 'react';
import { TransformControls, Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TransformToolsProps {
  selectedObjectId: string | null;
  mode: 'translate' | 'rotate' | 'scale' | null;
  space?: 'world' | 'local';
  useSnap?: boolean;
  onTransform: (
    id: string,
    position: [number, number, number],
    rotation: [number, number, number],
    scale?: [number, number, number]
  ) => void;
  onTransformStart?: () => void;
  onTransformEnd?: () => void;
  children: React.ReactNode;
}

export default function TransformTools({
  selectedObjectId,
  mode,
  space = 'world',
  useSnap = true,
  onTransform,
  onTransformStart,
  onTransformEnd,
  children,
}: TransformToolsProps) {
  const { scene } = useThree();
  const [targetObject, setTargetObject] = useState<THREE.Object3D | null>(null);
  const [dimensions, setDimensions] = useState<{ x: number, y: number, z: number } | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const transformRef = useRef<any>(null);

  // Fonction de recherche rapide
  const findObject = (id: string | null) => {
    if (!id) return null;
    // Recherche rapide par nom (le plus efficace si les noms sont uniques)
    let found = scene.getObjectByName(id);
    
    // Fallback: recherche par userData (plus lent mais robuste)
    if (!found) {
        scene.traverse((child) => {
            if (child.userData?.id === id) {
                found = child;
            }
        });
    }
    return found || null;
  };

  // Trouver l'objet sélectionné initialement
  useEffect(() => {
    const found = findObject(selectedObjectId);
    setTargetObject(found);
  }, [selectedObjectId, scene]); // 'mode' removed as dep to prevent re-attach spam

  // VÉRIFICATION CONTINUE (Frame Loop)
  // Permet de détecter si l'objet a été remplacé (remount) par React
  useFrame(() => {
    if (selectedObjectId) {
        const currentInScene = findObject(selectedObjectId);
        
        // Si l'objet en mémoire n'est plus celui de la scène, ou s'il a disparu
        if (currentInScene?.uuid !== targetObject?.uuid) {
            setTargetObject(currentInScene);
        }
        
        // Vérification anti-crash pour TransformControls
        if (targetObject && !targetObject.parent) {
            // L'objet est orphelin, on le détache préventivement
            setTargetObject(null);
        }
    }
  });

  const updateDimensions = () => {
    if (!transformRef.current?.object) return;
    const obj = transformRef.current.object;
    
    // Calculer la bounding box en coordonnées locales/monde pour avoir la taille réelle
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    setDimensions({
      x: parseFloat(size.x.toFixed(2)),
      y: parseFloat(size.y.toFixed(2)),
      z: parseFloat(size.z.toFixed(2))
    });
  };

  const handleObjectChange = () => {
    if (!transformRef.current?.object || !targetObject || !selectedObjectId) return;

    const object = transformRef.current.object;
    
    // Mettre à jour les dimensions pour l'affichage
    if (mode === 'scale') {
      updateDimensions();
    }

    if (object) {
      onTransform(
        selectedObjectId,
        [object.position.x, object.position.y, object.position.z],
        [object.rotation.x, object.rotation.y, object.rotation.z],
        [object.scale.x, object.scale.y, object.scale.z]
      );
    }
  };

  const handleTransformStartLocal = () => {
    setIsTransforming(true);
    updateDimensions(); // Initialiser les dimensions au début
    if (onTransformStart) onTransformStart();
  };

  const handleTransformEndLocal = () => {
    setIsTransforming(false);
    setDimensions(null);
    if (onTransformEnd) onTransformEnd();
  };

  // Helper pour savoir si une dimension est "standard" (proche d'un entier ou .5)
  const isStandard = (val: number) => {
    const decimal = val % 1;
    return decimal < 0.05 || decimal > 0.95 || (decimal > 0.45 && decimal < 0.55);
  };

  // Condition de rendu stricte: l'objet doit exister ET avoir un parent (être dans la scène)
  const shouldRenderControls = selectedObjectId && mode && targetObject && targetObject.parent;

  return (
    <>
      {shouldRenderControls && (
        <TransformControls
          ref={transformRef}
          object={targetObject}
          mode={mode}
          space={space}
          translationSnap={useSnap ? 0.1 : null}
          rotationSnap={useSnap ? Math.PI / 12 : null}
          scaleSnap={useSnap ? 0.01 : null}
          showX={true}
          // Autoriser la montée/descente en translation (axe Y)
          showY={true}
          showZ={true}
          onObjectChange={handleObjectChange}
          onMouseDown={handleTransformStartLocal}
          onMouseUp={handleTransformEndLocal}
        />
      )}
      
      {/* HUD de Dimensions Intelligent */}
      {isTransforming && mode === 'scale' && dimensions && (
        <Html position={[0, 2, 0]} center>
          <div className="flex flex-col gap-1 bg-black/90 backdrop-blur-md p-3 rounded-xl border border-[var(--hearst-green)] shadow-2xl text-[10px] font-mono select-none pointer-events-none min-w-[120px]">
            <div className="text-[var(--hearst-green)] uppercase font-bold border-b border-white/10 pb-1 mb-1 text-center">
              Dimensions
            </div>
            
            <div className={`flex justify-between items-center ${isStandard(dimensions.x) ? 'text-white font-bold' : 'text-gray-400'}`}>
              <span>Largeur (X):</span>
              <span>{dimensions.x}m {isStandard(dimensions.x) && '✓'}</span>
            </div>
            
            <div className={`flex justify-between items-center ${isStandard(dimensions.z) ? 'text-white font-bold' : 'text-gray-400'}`}>
              <span>Longueur (Z):</span>
              <span>{dimensions.z}m {isStandard(dimensions.z) && '✓'}</span>
            </div>

            <div className={`flex justify-between items-center ${isStandard(dimensions.y) ? 'text-white font-bold' : 'text-gray-400'}`}>
              <span>Hauteur (Y):</span>
              <span>{dimensions.y}m {isStandard(dimensions.y) && '✓'}</span>
            </div>
          </div>
        </Html>
      )}

      {children}
    </>
  );
}


