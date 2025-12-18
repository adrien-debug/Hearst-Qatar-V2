import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, OrbitControls, Text } from '@react-three/drei';
import { Raycaster, Vector2 } from 'three';
import SceneLighting from './Lighting';
import GravelGround from './GravelGround';
// Transformer3D supprimé - uniquement Container Plan 3D Viewer dans la galerie
import HD5Container3D from './HD5Container3D';
import SelectableEquipment from './SelectableEquipment';
import TransformControls3D from './TransformControls3D';

// Dimensions globales du terrain
const SITE_LENGTH = 65;
const SITE_WIDTH = 22;

// Composant pour gérer les clics sur le sol (désélection)
function GroundClickHandler({ onDeselect }: { onDeselect: () => void }) {
  const { camera, scene, gl } = useThree();
  const raycaster = new Raycaster();
  
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      // Si on clique sur le sol (GravelGround) ou rien, désélectionner
      const hitGround = intersects.find(
        (intersect) => 
          intersect.object.name === 'ground' || 
          intersect.object.parent?.name === 'ground' ||
          intersect.object.type === 'Mesh' && intersect.object.parent?.type === 'Group'
      );
      
      if (hitGround && intersects.length > 0) {
        // Vérifier qu'on n'a pas cliqué sur un objet sélectionnable
        const hitObject = intersects.find(
          (intersect) => 
            intersect.object.name === 'tr-center' ||
            intersect.object.name === 'ctr-A' ||
            intersect.object.name === 'ctr-B' ||
            intersect.object.parent?.name === 'tr-center' ||
            intersect.object.parent?.name === 'ctr-A' ||
            intersect.object.parent?.name === 'ctr-B'
        );
        
        if (!hitObject) {
          onDeselect();
        }
      }
    };
    
    gl.domElement.addEventListener('click', handleClick);
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, scene, gl, onDeselect]);
  
  return null;
}

// Composant repère GPS (grille + axes + labels)
function GpsReference({ size = 100, divisions = 20 }) {
  return (
    <group>
      {/* Grille de référence */}
      <Grid
        args={[size, divisions]}
        cellColor="#6b7280"
        sectionColor="#9ca3af"
        cellThickness={0.5}
        sectionThickness={1}
        fadeDistance={50}
        fadeStrength={1}
        position={[0, 0.01, 0]}
      />
      
      {/* Axes X, Y, Z avec labels */}
      {/* Axe X (rouge) - Longueur */}
      <mesh position={[size / 2, 0.1, 0]}>
        <boxGeometry args={[size, 0.1, 0.1]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <Text
        position={[size / 2 + 2, 1, 0]}
        fontSize={2}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        X+ (Longueur)
      </Text>
      
      {/* Axe Z (bleu) - Largeur */}
      <mesh position={[0, 0.1, size / 2]}>
        <boxGeometry args={[0.1, 0.1, size]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <Text
        position={[0, 1, size / 2 + 2]}
        fontSize={2}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        Z+ (Largeur)
      </Text>
      
      {/* Axe Y (vert) - Hauteur */}
      <mesh position={[0, size / 4, 0]}>
        <boxGeometry args={[0.1, size / 2, 0.1]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <Text
        position={[2, size / 4, 0]}
        fontSize={2}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        Y+ (Hauteur)
      </Text>
      
      {/* Origine [0,0,0] */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={1.5}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
      >
        [0,0,0]
      </Text>
      
      {/* Labels de distance tous les 10m */}
      {Array.from({ length: Math.floor(size / 10) + 1 }).map((_, i) => {
        const pos = (i - Math.floor(size / 20)) * 10;
        return (
          <group key={`label-x-${i}`}>
            <Text
              position={[pos, 0.3, -2]}
              fontSize={1}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
            >
              {pos}m
            </Text>
            <Text
              position={[-2, 0.3, pos]}
              fontSize={1}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
            >
              {pos}m
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function Mining25MW3DScene() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | null>('translate');
  const [positions, setPositions] = useState({
    transformer: [0, 0, 2] as [number, number, number],
    containerA: [-6, 0, -12] as [number, number, number],
    containerB: [6, 0, -12] as [number, number, number],
  });

  const handleSelect = (id: string) => {
    // Si on clique sur un objet déjà sélectionné, le désélectionner
    if (selectedObjectId === id) {
      console.log('🔓 Désélection:', id);
      setSelectedObjectId(null);
    } else {
      console.log('🎯 Sélection:', id);
      setSelectedObjectId(id);
    }
  };

  const handleDeselect = () => {
    console.log('🔓 Désélection');
    setSelectedObjectId(null);
  };

  // Désélectionner avec la touche ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedObjectId) {
        handleDeselect();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedObjectId]);

  const handleTransform = (objectId: string, newPosition: [number, number, number], rotation: [number, number, number]) => {
    // Mettre à jour le state immédiatement pour synchroniser
    if (objectId === 'tr-center') {
      setPositions(prev => ({ ...prev, transformer: newPosition }));
    } else if (objectId === 'ctr-A') {
      setPositions(prev => ({ ...prev, containerA: newPosition }));
    } else if (objectId === 'ctr-B') {
      setPositions(prev => ({ ...prev, containerB: newPosition }));
    }
    // Pas de console.log pour éviter le spam (mise à jour en temps réel)
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 50, 80], fov: 45 }} shadows>
        <SceneLighting />
        
        {/* Contrôles de caméra - Désactivés quand un objet est sélectionné */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={20}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2.1}
          enabled={!selectedObjectId}
          mouseButtons={{
            LEFT: 0,   // Rotate (clic gauche)
            MIDDLE: 1, // Zoom
            RIGHT: 2,  // Pan (clic droit)
          }}
        />
        
        {/* Sol plat - avec nom pour détection de clic */}
        <group name="ground">
          <GravelGround width={SITE_LENGTH} depth={SITE_WIDTH} position={[0, 0, 0]} />
        </group>
        
        {/* Gestionnaire de clic sur le sol pour désélectionner */}
        <GroundClickHandler onDeselect={handleDeselect} />
        
        {/* Repère GPS (grille + axes + coordonnées) */}
        <GpsReference size={100} divisions={20} />
        
        {/* Transformateur devant - Sélectionnable */}
        <group 
          name="tr-center"
          position={positions.transformer}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('tr-center');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          {/* Transformer3D supprimé - uniquement Container Plan 3D Viewer dans la galerie */}
          {/* <Transformer3D 
            position={[0, 0, 0]} 
            transformerId="tr-center"
            onSelect={handleSelect}
            isSelected={selectedObjectId === 'tr-center'}
          /> */}
          {/* Indicateur de sélection */}
          {selectedObjectId === 'tr-center' && (
            <mesh position={[0, 3, 0]}>
              <ringGeometry args={[2, 2.5, 32]} />
              <meshBasicMaterial color="#8AFD81" side={2} />
            </mesh>
          )}
        </group>
        
        {/* Container A - Sélectionnable */}
        <group 
          name="ctr-A"
          position={positions.containerA}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('ctr-A');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <HD5Container3D 
            position={[0, 0, 0]} 
            containerId="ctr-A"
            onSelect={handleSelect}
            isSelected={selectedObjectId === 'ctr-A'}
          />
          {/* Indicateur de sélection */}
          {selectedObjectId === 'ctr-A' && (
            <mesh position={[0, 4, 0]}>
              <ringGeometry args={[7, 7.5, 32]} />
              <meshBasicMaterial color="#8AFD81" side={2} />
            </mesh>
          )}
        </group>
        
        {/* Container B - Sélectionnable */}
        <group 
          name="ctr-B"
          position={positions.containerB}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('ctr-B');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <HD5Container3D 
            position={[0, 0, 0]} 
            containerId="ctr-B"
            onSelect={handleSelect}
            isSelected={selectedObjectId === 'ctr-B'}
          />
          {/* Indicateur de sélection */}
          {selectedObjectId === 'ctr-B' && (
            <mesh position={[0, 4, 0]}>
              <ringGeometry args={[7, 7.5, 32]} />
              <meshBasicMaterial color="#8AFD81" side={2} />
            </mesh>
          )}
        </group>
        
        {/* Contrôles de transformation */}
        <TransformControls3D
          selectedObjectId={selectedObjectId}
          mode={transformMode}
          onTransform={handleTransform}
        />
      </Canvas>
      
      {/* Panneau de contrôle en haut à gauche */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 1000,
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>🎮 Contrôles</div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Clic gauche</strong> sur un objet pour le sélectionner
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Double-clic</strong> sur un objet sélectionné pour le désélectionner
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Clic sur le sol</strong> pour désélectionner
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>ESC</strong> pour désélectionner
        </div>
        <div style={{ marginBottom: '5px' }}>
          <strong>Déplacer objet</strong> : Flèches X/Z quand sélectionné
        </div>
        <div style={{ marginBottom: '10px', fontSize: '12px', color: selectedObjectId ? '#8AFD81' : '#94a3b8' }}>
          {selectedObjectId ? '🔒 Caméra désactivée' : '🔓 Caméra active'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Mode</strong> : {transformMode || 'Aucun'}
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
          {selectedObjectId ? (
            <>✅ Sélectionné: <strong>{selectedObjectId}</strong></>
          ) : (
            <>👆 Cliquez sur un objet</>
          )}
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.6 }}>
          Positions:
          <div>Transfo: [{positions.transformer.join(', ')}]</div>
          <div>Container A: [{positions.containerA.join(', ')}]</div>
          <div>Container B: [{positions.containerB.join(', ')}]</div>
        </div>
      </div>
    </div>
  );
}


