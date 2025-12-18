/**
 * Power Block Transform Tool - Outil pour déplacer, orienter et faire tourner les éléments
 * ========================================================================================
 * 
 * Outil simple et efficace utilisant TransformControls de drei
 */

import React, { useState, useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PowerBlockTransformToolProps {
  /** IDs des éléments sélectionnés (sélection multiple) */
  selectedElementIds?: string[];
  /** Mode de transformation */
  mode?: 'translate' | 'rotate' | 'scale';
  /** Espace de transformation */
  space?: 'world' | 'local';
  /** Callback lors de la transformation d'un élément */
  onTransform?: (elementId: string, position: [number, number, number], rotation: [number, number, number], scale: number) => void;
  /** Callback pour transformer tous les éléments sélectionnés */
  onTransformAll?: (position: [number, number, number], rotation: [number, number, number], scale: number) => void;
  /** Enfants à rendre */
  children: React.ReactNode;
}

/**
 * Outil de transformation pour Power Block
 */
export default function PowerBlockTransformTool({
  selectedElementIds = [],
  mode = 'translate',
  space = 'world',
  onTransform,
  onTransformAll,
  children,
}: PowerBlockTransformToolProps) {
  const transformRefs = useRef<Record<string, any>>({});
  const { scene } = useThree();
  const [targetObjects, setTargetObjects] = useState<Record<string, THREE.Object3D>>({});

  // 1. Trouver les objets sélectionnés dans la scène
  useEffect(() => {
    if (selectedElementIds.length === 0) {
      setTargetObjects({});
      return;
    }

    const found: Record<string, THREE.Object3D> = {};
    scene.traverse((child) => {
      const elementId = child.name || child.userData?.id;
      if (elementId && selectedElementIds.includes(elementId)) {
        found[elementId] = child;
      }
    });

    setTargetObjects(found);
  }, [selectedElementIds, scene]);

  const { controls } = useThree();

  // 2. Désactiver OrbitControls quand des objets sont sélectionnés
  useEffect(() => {
    if (!controls) return;

    if (selectedElementIds.length > 0 && Object.keys(targetObjects).length > 0) {
      // Désactiver OrbitControls
      if (controls && 'enabled' in controls) {
        (controls as any).enabled = false;
      }
    } else {
      // Réactiver OrbitControls
      if (controls && 'enabled' in controls) {
        (controls as any).enabled = true;
      }
    }

    return () => {
      // Réactiver OrbitControls au démontage
      if (controls && 'enabled' in controls) {
        (controls as any).enabled = true;
      }
    };
  }, [selectedElementIds, targetObjects, controls]);

  const handleDraggingChanged = (event: any) => {
    // Désactiver OrbitControls pendant le drag
    if (controls && 'enabled' in controls) {
      (controls as any).enabled = !event.value;
    }
  };

  // 3. Gérer les flags pour les objets sélectionnés
  const firstElementId = selectedElementIds.length > 0 ? selectedElementIds[0] : null;
  const firstTargetObject = firstElementId ? targetObjects[firstElementId] : null;
  
  // S'assurer que l'objet n'est pas contrôlé par React Three Fiber
  useEffect(() => {
    if (firstTargetObject) {
      // Marquer l'objet comme étant contrôlé manuellement
      firstTargetObject.userData.manualPosition = true;
    }
  }, [firstTargetObject]);
  
  // Gérer le flag isBeingTransformed pour éviter les conflits
  useEffect(() => {
    if (!firstTargetObject || !firstElementId) return;
    
    const handleDraggingStart = () => {
      if (firstTargetObject) {
        firstTargetObject.userData.isBeingTransformed = true;
      }
    };
    
    const handleDraggingEnd = () => {
      if (firstTargetObject) {
        firstTargetObject.userData.isBeingTransformed = false;
      }
    };
    
    const transformRef = transformRefs.current[firstElementId];
    if (transformRef) {
      const handleDraggingChangedInternal = (event: any) => {
        if (event.value) handleDraggingStart();
        else handleDraggingEnd();
        handleDraggingChanged(event);
      };
      transformRef.addEventListener('dragging-changed', handleDraggingChangedInternal);
      return () => {
        transformRef.removeEventListener('dragging-changed', handleDraggingChangedInternal);
      };
    }

    return;
  }, [firstTargetObject, firstElementId]);

  // 4. État pour la sélection multiple (HOISTED)
  const [initialStates, setInitialStates] = useState<Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  }>>({});
  
  // Stocker les états initiaux au moment de la sélection
  useEffect(() => {
    if (selectedElementIds.length > 1 && Object.keys(targetObjects).length === selectedElementIds.length) {
      const states: Record<string, any> = {};
      selectedElementIds.forEach(elementId => {
        const obj = targetObjects[elementId];
        if (obj) {
          const worldPos = new THREE.Vector3();
          obj.getWorldPosition(worldPos);
          states[elementId] = {
            position: [worldPos.x, worldPos.y, worldPos.z] as [number, number, number],
            rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z] as [number, number, number],
            scale: obj.scale.x,
          };
        }
      });
      if (Object.keys(states).length > 0) {
        setInitialStates(states);
      }
    } else {
      setInitialStates({});
    }
  }, [selectedElementIds, targetObjects]);

  // 5. Gestion de l'instance des contrôles (HOISTED - Remplace la logique conditionnelle précédente)
  const [controlsInstance, setControlsInstance] = useState<any>(null);

  // Attacher les contrôles (unifié pour single et multi)
  useEffect(() => {
    if (controlsInstance && firstTargetObject) {
      controlsInstance.attach(firstTargetObject);
    }
    return () => {
      if (controlsInstance) {
        controlsInstance.detach();
      }
    };
  }, [controlsInstance, firstTargetObject]);

  // --- Rendu ---

  if (selectedElementIds.length === 0 || Object.keys(targetObjects).length === 0 || !firstTargetObject || !firstElementId) {
    return <>{children}</>;
  }

  // Un seul bloc de rendu pour gérer tous les cas (Single & Multi)
  return (
    <>
      <TransformControls
        ref={(ref) => {
          if (ref) {
            transformRefs.current[firstElementId] = ref;
            setControlsInstance(ref);
          }
        }}
        key={firstElementId} // Force remount on element change
        mode={mode}
        space={space}
        showX={true}
        showY={true}
        showZ={true}
        translationSnap={0.1}
        rotationSnap={Math.PI / 12}
        scaleSnap={0.1}
        onObjectChange={() => {
          const transformRef = transformRefs.current[firstElementId];
          if (!transformRef?.object || !onTransform) return;
          
          const object = transformRef.object;
          const newPos: [number, number, number] = [object.position.x, object.position.y, object.position.z];
          const newRot: [number, number, number] = [object.rotation.x, object.rotation.y, object.rotation.z];
          const newScale = object.scale.x;
          
          // Mettre à jour le premier élément
          onTransform(firstElementId, newPos, newRot, newScale);
          
          // Si sélection multiple, calculer et appliquer le delta aux autres
          if (selectedElementIds.length > 1 && Object.keys(initialStates).length > 0) {
            const firstInitial = initialStates[firstElementId];
            if (firstInitial) {
              const deltaPos: [number, number, number] = [
                newPos[0] - firstInitial.position[0],
                newPos[1] - firstInitial.position[1],
                newPos[2] - firstInitial.position[2],
              ];
              const deltaRot: [number, number, number] = [
                newRot[0] - firstInitial.rotation[0],
                newRot[1] - firstInitial.rotation[1],
                newRot[2] - firstInitial.rotation[2],
              ];
              const deltaScale = newScale - firstInitial.scale;
              
              // Appliquer le delta à tous les autres éléments
              selectedElementIds.slice(1).forEach(elementId => {
                const initial = initialStates[elementId];
                if (initial && onTransform) {
                  onTransform(
                    elementId,
                    [
                      initial.position[0] + deltaPos[0],
                      initial.position[1] + deltaPos[1],
                      initial.position[2] + deltaPos[2],
                    ],
                    [
                      initial.rotation[0] + deltaRot[0],
                      initial.rotation[1] + deltaRot[1],
                      initial.rotation[2] + deltaRot[2],
                    ],
                    initial.scale + deltaScale
                  );
                }
              });
            }
          }
          
          // Appeler onTransformAll si fourni
          if (onTransformAll) {
            onTransformAll(newPos, newRot, newScale);
          }
        }}
      />
      {children}
    </>
  );
}

/**
 * Panel de contrôle UI pour l'outil de transformation
 */
export function PowerBlockTransformPanel({
  selectedElementIds,
  mode,
  onModeChange,
  position,
  rotation,
  scale,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onReset,
  onClearSelection,
}: {
  selectedElementIds: string[];
  mode: 'translate' | 'rotate' | 'scale';
  onModeChange: (mode: 'translate' | 'rotate' | 'scale') => void;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  onPositionChange: (pos: [number, number, number]) => void;
  onRotationChange: (rot: [number, number, number]) => void;
  onScaleChange: (scl: number) => void;
  onReset: () => void;
  onClearSelection: () => void;
}) {
  const selectedElementId = selectedElementIds.length > 0 ? selectedElementIds[0] : null;
  
  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-6 rounded-lg z-50 min-w-[350px] shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-green-400">Power Block Transform Tool</h3>
        {selectedElementIds.length > 0 && (
          <button
            onClick={onClearSelection}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            Désélectionner
          </button>
        )}
      </div>
      
      {selectedElementIds.length === 0 ? (
        <p className="text-gray-400 text-sm">Cliquez sur un élément pour le sélectionner</p>
      ) : (
        <>
          {/* Mode de transformation */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => onModeChange('translate')}
                className={`px-4 py-2 rounded ${
                  mode === 'translate' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Déplacer
              </button>
              <button
                onClick={() => onModeChange('rotate')}
                className={`px-4 py-2 rounded ${
                  mode === 'rotate' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Tourner
              </button>
              <button
                onClick={() => onModeChange('scale')}
                className={`px-4 py-2 rounded ${
                  mode === 'scale' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Échelle
              </button>
            </div>
          </div>

          {/* Position */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Position (mètres)</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">X</label>
                <input
                  type="number"
                  step="0.1"
                  value={position[0].toFixed(2)}
                  onChange={(e) => onPositionChange([parseFloat(e.target.value) || 0, position[1], position[2]])}
                  className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={position[1].toFixed(2)}
                  onChange={(e) => onPositionChange([position[0], parseFloat(e.target.value) || 0, position[2]])}
                  className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Z</label>
                <input
                  type="number"
                  step="0.1"
                  value={position[2].toFixed(2)}
                  onChange={(e) => onPositionChange([position[0], position[1], parseFloat(e.target.value) || 0])}
                  className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Rotation (degrés)</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">X</label>
                <input
                  type="number"
                  step="1"
                  value={(rotation[0] * 180 / Math.PI).toFixed(0)}
                  onChange={(e) => onRotationChange([(parseFloat(e.target.value) || 0) * Math.PI / 180, rotation[1], rotation[2]])}
                  className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Y</label>
                <input
                  type="number"
                  step="1"
                  value={(rotation[1] * 180 / Math.PI).toFixed(0)}
                  onChange={(e) => onRotationChange([rotation[0], (parseFloat(e.target.value) || 0) * Math.PI / 180, rotation[2]])}
                  className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Z</label>
                <input
                  type="number"
                  step="1"
                  value={(rotation[2] * 180 / Math.PI).toFixed(0)}
                  onChange={(e) => onRotationChange([rotation[0], rotation[1], (parseFloat(e.target.value) || 0) * Math.PI / 180])}
                  className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Scale */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Échelle</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="5"
              value={scale.toFixed(2)}
              onChange={(e) => onScaleChange(parseFloat(e.target.value) || 1)}
              className="w-full bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-green-500"
            />
          </div>

          {/* Bouton Reset */}
          <button
            onClick={onReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          >
            Réinitialiser
          </button>

          {/* Info éléments sélectionnés */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">
              {selectedElementIds.length === 1 ? 'Élément sélectionné:' : `${selectedElementIds.length} éléments sélectionnés:`}
            </p>
            <div className="max-h-32 overflow-y-auto">
              {selectedElementIds.map((id, index) => (
                <p key={id} className="text-xs text-green-400">
                  {index + 1}. {id}
                </p>
              ))}
            </div>
            {selectedElementIds.length > 1 && (
              <p className="text-xs text-yellow-400 mt-2">
                ⚠️ Les transformations s'appliquent à tous les éléments sélectionnés
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
