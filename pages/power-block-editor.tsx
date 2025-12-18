/**
 * Page d'édition du Power Block 25 MW
 * ====================================
 * 
 * Page dédiée pour éditer et manipuler les éléments du Power Block
 */

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PowerBlock25MW from '../components/3d/PowerBlock25MW';
import PowerBlockTransformTool, { PowerBlockTransformPanel } from '../components/3d/PowerBlockTransformTool';
import Gallery3DEnvironment from '../components/gallery/Gallery3DEnvironment';
import * as THREE from 'three';

// État global pour les positions des éléments
const elementStates: Record<string, {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}> = {};

// Exposer elementStates globalement pour PowerBlockTransformTool
if (typeof window !== 'undefined') {
  (window as any).elementStates = elementStates;
}

// Hook pour forcer la mise à jour du composant
function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
}

export default function PowerBlockEditorPage() {
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [scale, setScale] = useState(1);
  const [updateKey, setUpdateKey] = useState(0);
  
  // Pour la sélection multiple, on utilise le premier élément pour les valeurs du panel
  const selectedElementId = selectedElementIds.length > 0 ? selectedElementIds[0] : null;
  
  // Force update pour rafraîchir les positions (via updateKey)
  
  // Initialiser les positions des éléments
  useEffect(() => {
    const baseId = 'power-block-25mw';
    const elementDistance = 3.0;
    const bodyWidth = 3.8;
    const bodyDepth = 2.3;
    const bodyY = 0.2 / 2 + 2.2 / 2;
    
    if (!elementStates[`${baseId}-bande-colorée`]) {
      elementStates[`${baseId}-bande-colorée`] = {
        position: [0, bodyY + 2.2 / 2 - 0.05, bodyDepth / 2 + elementDistance],
        rotation: [0, 0, 0],
        scale: 1,
      };
    }
    if (!elementStates[`${baseId}-panneau-avant`]) {
      elementStates[`${baseId}-panneau-avant`] = {
        position: [0, bodyY, bodyDepth / 2 + elementDistance],
        rotation: [0, 0, 0],
        scale: 1,
      };
    }
    if (!elementStates[`${baseId}-ventilateur-gauche`]) {
      elementStates[`${baseId}-ventilateur-gauche`] = {
        position: [-bodyWidth / 2 - elementDistance, bodyY, 0],
        rotation: [0, Math.PI / 2, 0],
        scale: 1,
      };
    }
    if (!elementStates[`${baseId}-ventilateur-droit`]) {
      elementStates[`${baseId}-ventilateur-droit`] = {
        position: [bodyWidth / 2 + elementDistance, bodyY, 0],
        rotation: [0, -Math.PI / 2, 0],
        scale: 1,
      };
    }
    if (!elementStates[`${baseId}-ventilateur-arriere`]) {
      elementStates[`${baseId}-ventilateur-arriere`] = {
        position: [0, bodyY, -bodyDepth / 2 - elementDistance],
        rotation: [Math.PI / 2, 0, 0],
        scale: 1,
      };
    }
    if (!elementStates[`${baseId}-detail-gauche`]) {
      elementStates[`${baseId}-detail-gauche`] = {
        position: [-bodyWidth / 2 - elementDistance, bodyY - 0.3, 0],
        rotation: [0, Math.PI / 2, 0],
        scale: 1,
      };
    }
    if (!elementStates[`${baseId}-detail-droit`]) {
      elementStates[`${baseId}-detail-droit`] = {
        position: [bodyWidth / 2 + elementDistance, bodyY - 0.3, 0],
        rotation: [0, -Math.PI / 2, 0],
        scale: 1,
      };
    }
  }, []);

  const handleElementClick = (elementId: string, event?: any) => {
    // Dans React Three Fiber, l'événement est un objet Three.js
    // Les propriétés du clavier sont dans event.nativeEvent ou directement dans event
    // Vérifier aussi window.event pour les touches du clavier
    const nativeEvent = event?.nativeEvent || (typeof window !== 'undefined' ? window.event : null);
    const isMultiSelect = (event?.ctrlKey || event?.metaKey || event?.shiftKey) ||
                         (nativeEvent && (nativeEvent.ctrlKey || nativeEvent.metaKey || nativeEvent.shiftKey));
    
    if (isMultiSelect) {
      // Sélection multiple
      setSelectedElementIds(prev => {
        if (prev.includes(elementId)) {
          // Désélectionner si déjà sélectionné
          return prev.filter(id => id !== elementId);
        } else {
          // Ajouter à la sélection
          return [...prev, elementId];
        }
      });
    } else {
      // Sélection simple
      setSelectedElementIds([elementId]);
    }
    
    // Mettre à jour le panel avec les valeurs du premier élément
    const state = elementStates[elementId];
    if (state) {
      setPosition(state.position);
      setRotation(state.rotation);
      setScale(state.scale);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedElementIds([]);
  };

  const handleTransform = (
    elementId: string,
    newPosition: [number, number, number],
    newRotation: [number, number, number],
    newScale: number
  ) => {
    // Mettre à jour l'élément transformé dans elementStates
    elementStates[elementId] = {
      position: newPosition,
      rotation: newRotation,
      scale: newScale,
    };
    
    // Forcer la mise à jour de l'affichage en mettant à jour la clé
    setUpdateKey(prev => prev + 1);
    
    // Si c'est le premier élément sélectionné, mettre à jour le panel
    if (selectedElementIds.length > 0 && selectedElementIds[0] === elementId) {
      setPosition(newPosition);
      setRotation(newRotation);
      setScale(newScale);
    }
  };
  
  // Appliquer la transformation à tous les éléments sélectionnés (pour synchronisation)
  const handleTransformAll = (
    newPosition: [number, number, number],
    newRotation: [number, number, number],
    newScale: number
  ) => {
    // Cette fonction est appelée pour synchroniser l'affichage du panel
    // Les transformations individuelles sont déjà gérées par handleTransform
    setPosition(newPosition);
    setRotation(newRotation);
    setScale(newScale);
  };

  const handleReset = () => {
    if (selectedElementIds.length > 0) {
      const baseId = 'power-block-25mw';
      const elementDistance = 3.0;
      const bodyWidth = 3.8;
      const bodyDepth = 2.3;
      const bodyY = 0.2 / 2 + 2.2 / 2;
      
      selectedElementIds.forEach(selectedElementId => {
        let defaultState = { position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1 };
        
        if (selectedElementId.includes('bande-colorée')) {
          defaultState = {
            position: [0, bodyY + 2.2 / 2 - 0.05, bodyDepth / 2 + elementDistance],
            rotation: [0, 0, 0],
            scale: 1,
          };
        } else if (selectedElementId.includes('panneau-avant')) {
          defaultState = {
            position: [0, bodyY, bodyDepth / 2 + elementDistance],
            rotation: [0, 0, 0],
            scale: 1,
          };
        } else if (selectedElementId.includes('ventilateur-gauche')) {
          defaultState = {
            position: [-bodyWidth / 2 - elementDistance, bodyY, 0],
            rotation: [0, Math.PI / 2, 0],
            scale: 1,
          };
        } else if (selectedElementId.includes('ventilateur-droit')) {
          defaultState = {
            position: [bodyWidth / 2 + elementDistance, bodyY, 0],
            rotation: [0, -Math.PI / 2, 0],
            scale: 1,
          };
        } else if (selectedElementId.includes('ventilateur-arriere')) {
          defaultState = {
            position: [0, bodyY, -bodyDepth / 2 - elementDistance],
            rotation: [Math.PI / 2, 0, 0],
            scale: 1,
          };
        } else if (selectedElementId.includes('detail-gauche')) {
          defaultState = {
            position: [-bodyWidth / 2 - elementDistance, bodyY - 0.3, 0],
            rotation: [0, Math.PI / 2, 0],
            scale: 1,
          };
        } else if (selectedElementId.includes('detail-droit')) {
          defaultState = {
            position: [bodyWidth / 2 + elementDistance, bodyY - 0.3, 0],
            rotation: [0, -Math.PI / 2, 0],
            scale: 1,
          };
        }
        
        elementStates[selectedElementId] = defaultState;
      });
      
      // Mettre à jour le panel avec le premier élément
      const firstId = selectedElementIds[0];
      const firstState = elementStates[firstId];
      if (firstState) {
        setPosition(firstState.position);
        setRotation(firstState.rotation);
        setScale(firstState.scale);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Power Block 25 MW Editor - Hearst Qatar</title>
      </Head>

      <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Canvas 3D */}
        <Canvas
          camera={{ position: [10, 8, 10], fov: 50 }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        >
          <PowerBlockTransformTool
            selectedElementIds={selectedElementIds}
            mode={mode}
            onTransform={handleTransform}
            onTransformAll={handleTransformAll}
          >
            <Gallery3DEnvironment>
              <PowerBlock25MW
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={1}
                onClick={handleElementClick}
                id="power-block-25mw"
                color="#1a1a1a"
                secondaryColor="#00A651"
                selectedElementId={selectedElementId}
                selectedElementIds={selectedElementIds}
                elementStates={elementStates}
                key={updateKey}
              />
            </Gallery3DEnvironment>

            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              autoRotate={false}
              zoomToCursor={true}
              minDistance={5}
              maxDistance={50}
              enabled={selectedElementIds.length === 0}
            />
          </PowerBlockTransformTool>
        </Canvas>

        {/* Panel de contrôle */}
        <PowerBlockTransformPanel
          selectedElementIds={selectedElementIds}
          mode={mode}
          onModeChange={setMode}
          position={position}
          rotation={rotation}
          scale={scale}
          onPositionChange={setPosition}
          onRotationChange={setRotation}
          onScaleChange={setScale}
          onReset={handleReset}
          onClearSelection={handleClearSelection}
        />

        {/* Instructions */}
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg z-50 max-w-md">
          <h4 className="font-bold mb-2 text-green-400">Instructions :</h4>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• <span className="text-green-400">Cliquez</span> pour sélectionner un élément</li>
            <li>• <span className="text-green-400">Ctrl/Cmd + Clic</span> pour sélection multiple</li>
            <li>• <span className="text-green-400">Shift + Clic</span> pour ajouter à la sélection</li>
            <li>• Éléments sélectionnables :</li>
            <li className="ml-4">- Bande colorée, Panneau, LED (x4)</li>
            <li className="ml-4">- Ventilateurs (gauche, droit, arrière)</li>
            <li className="ml-4">- Détails colorés (gauche, droit)</li>
            <li>• Utilisez les <span className="text-green-400">contrôles 3D</span> pour déplacer/tourner</li>
            <li>• Ou utilisez les <span className="text-green-400">champs numériques</span> dans le panel</li>
            <li>• Changez de mode : <span className="text-green-400">Déplacer / Tourner / Échelle</span></li>
            <li>• <span className="text-green-400">Rotation</span> : appliquée à tous les éléments sélectionnés</li>
          </ul>
        </div>
      </div>
    </>
  );
}


