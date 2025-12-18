import { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { generateCompleteSceneData, DIMENSIONS } from '../../data/splineSceneData';

export type SceneObject = {
  id: string;
  type: 'substation' | 'powerblock' | 'transformer' | 'container' | 'switchgear' | 'wall' | 'portal' | 'camera' | 'parking' | 'tree' | 'road';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  data?: any;
};

interface CompleteSceneEditorProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
  onDeleteObject: (id: string) => void;
  editMode: 'select' | 'move' | 'scale' | 'rotate' | 'place-wall' | 'place-portal' | 'place-camera' | 'place-parking' | 'place-tree' | 'place-road';
  onPlaceObject: (type: SceneObject['type'], position: [number, number, number]) => void;
}

// Composant pour un objet de scène
function SceneObject3D({ 
  obj, 
  isSelected, 
  onSelect, 
  onDelete,
  editMode,
  onUpdate
}: { 
  obj: SceneObject; 
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  editMode: 'select' | 'move' | 'scale' | 'rotate' | 'place-wall' | 'place-portal' | 'place-camera' | 'place-parking' | 'place-tree' | 'place-road';
  onUpdate?: (updates: Partial<SceneObject>) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const transformRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  // Définir userData pour la sélection
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.selectableId = obj.id;
      meshRef.current.name = obj.id;
      meshRef.current.userData.type = obj.type;
    }
    if (groupRef.current) {
      groupRef.current.userData.selectableId = obj.id;
      groupRef.current.name = obj.id;
      groupRef.current.userData.type = obj.type;
    }
  }, [obj.id, obj.type]);

  const getGeometry = () => {
    switch (obj.type) {
      case 'substation':
        return <boxGeometry args={[DIMENSIONS.substation.width, DIMENSIONS.substation.height, DIMENSIONS.substation.depth]} />;
      case 'powerblock':
        return <boxGeometry args={[DIMENSIONS.powerBlock.width, DIMENSIONS.powerBlock.height, DIMENSIONS.powerBlock.depth]} />;
      case 'transformer':
        return <boxGeometry args={[DIMENSIONS.transformer.width, DIMENSIONS.transformer.height, DIMENSIONS.transformer.depth]} />;
      case 'container':
        return <boxGeometry args={[DIMENSIONS.containerHD5.width, DIMENSIONS.containerHD5.height, DIMENSIONS.containerHD5.depth]} />;
      case 'switchgear':
        return <boxGeometry args={[DIMENSIONS.switchgear.width, DIMENSIONS.switchgear.height, DIMENSIONS.switchgear.depth]} />;
      case 'wall':
        return <boxGeometry args={[obj.data?.length || 10, obj.data?.height || 3, 0.2]} />;
      case 'portal':
        return <boxGeometry args={[obj.data?.width || 3, obj.data?.height || 4, 0.3]} />;
      case 'parking':
        return <boxGeometry args={[obj.data?.width || 20, 0.1, obj.data?.length || 30]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getMaterial = () => {
    const baseColor = getDefaultColor(obj.type);
    const color = isSelected ? 0xff6b6b : hovered ? 0xff9999 : baseColor;
    const emissive = isSelected ? 0xff6b6b : hovered ? 0xff9999 : 0x000000;
    const emissiveIntensity = isSelected ? 0.3 : hovered ? 0.1 : 0;
    
    return (
      <meshStandardMaterial 
        color={color} 
        metalness={0.4} 
        roughness={0.6}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    );
  };

  const getDefaultColor = (type: SceneObject['type']) => {
    switch (type) {
      case 'substation': return 0x4a90e2; // Bleu vif pour la substation
      case 'powerblock': return 0x7b68ee; // Violet pour les power blocks
      case 'transformer': return 0xffa500; // Orange pour les transformateurs
      case 'container': return 0x2ecc71; // Vert pour les containers
      case 'switchgear': return 0xe74c3c; // Rouge pour les switchgears
      case 'wall': return 0xcccccc; // Gris pour les murs
      case 'portal': return 0x8b7355; // Brun pour les portails
      case 'camera': return 0x3498db; // Bleu pour les caméras
      case 'parking': return 0x34495e; // Gris foncé pour les parkings
      case 'tree': return 0x27ae60; // Vert pour les arbres
      case 'road': return 0x555555; // Gris foncé pour les routes
      default: return 0x888888;
    }
  };

  // Pour les objets complexes (camera, tree), utiliser un group
  if (obj.type === 'camera' || obj.type === 'tree') {
    const transformRefGroup = useRef<any>(null);
    const { camera: cam, gl: glContext } = useThree();

    // Gérer les changements de TransformControls pour les groupes avec debounce
    useEffect(() => {
      if (!transformRefGroup.current || !isSelected || !onUpdate) return;

      const controls = transformRefGroup.current;
      let timeoutId: NodeJS.Timeout | null = null;
      let isDragging = false;
      
      const handleChange = () => {
        if (!controls.object) return;
        
        // Debounce les mises à jour pendant le drag pour améliorer les performances
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          const object = controls.object;
          const updates: Partial<SceneObject> = {};
          
          // Mettre à jour la position
          if (editMode === 'move' && object.position) {
            updates.position = [
              object.position.x,
              object.position.y,
              object.position.z,
            ];
          }
          
          // Mettre à jour l'échelle
          if (editMode === 'scale' && object.scale) {
            updates.scale = [
              object.scale.x,
              object.scale.y,
              object.scale.z,
            ];
          }
          
          // Mettre à jour la rotation
          if (editMode === 'rotate' && object.rotation) {
            updates.rotation = [
              object.rotation.x,
              object.rotation.y,
              object.rotation.z,
            ];
          }
          
          if (Object.keys(updates).length > 0) {
            onUpdate(updates);
          }
        }, isDragging ? 50 : 0); // Debounce de 50ms pendant le drag
      };

      const handleDraggingChanged = (event: any) => {
        isDragging = event.value;
      };

      controls.addEventListener('change', handleChange);
      controls.addEventListener('dragging-changed', handleDraggingChanged);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        controls.removeEventListener('change', handleChange);
        controls.removeEventListener('dragging-changed', handleDraggingChanged);
      };
    }, [isSelected, editMode, onUpdate]);

    const showTransformControls = isSelected && (editMode === 'move' || editMode === 'scale' || editMode === 'rotate');
    const mode = editMode === 'move' ? 'translate' : editMode === 'scale' ? 'scale' : editMode === 'rotate' ? 'rotate' : undefined;

    return (
      <>
        <group
          ref={groupRef}
          position={obj.position}
          rotation={obj.rotation || [0, 0, 0]}
          scale={obj.scale || [1, 1, 1]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          {obj.type === 'camera' ? (
            <>
              <mesh>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={isSelected ? 0xff6b6b : hovered ? 0xff9999 : 0x3498db} />
              </mesh>
              <mesh position={[0, 0.5, 0]}>
                <coneGeometry args={[0.3, 0.5, 8]} />
                <meshStandardMaterial color={isSelected ? 0xff6b6b : hovered ? 0xff9999 : 0x3498db} />
              </mesh>
            </>
          ) : (
            <>
              <mesh>
                <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
                <meshStandardMaterial color={isSelected ? 0xff6b6b : hovered ? 0xff9999 : 0x8b4513} />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <coneGeometry args={[1.5, 3, 8]} />
                <meshStandardMaterial color={isSelected ? 0xff6b6b : hovered ? 0xff9999 : 0x27ae60} />
              </mesh>
            </>
          )}
        </group>
        {showTransformControls && mode && groupRef.current && (
          <TransformControls
            ref={transformRefGroup}
            object={groupRef.current}
            mode={mode}
            enabled={true}
            showX={true}
            showY={true}
            showZ={true}
            size={0.8}
          />
        )}
      </>
    );
  }

  // Ajuster la position Y pour que les objets reposent sur le sol
  const adjustedPosition: [number, number, number] = [
    obj.position[0],
    obj.type === 'substation' 
      ? obj.position[1] + DIMENSIONS.substation.height / 2
      : obj.type === 'powerblock'
      ? obj.position[1] + DIMENSIONS.powerBlock.height / 2
      : obj.type === 'transformer'
      ? obj.position[1] + DIMENSIONS.transformer.height / 2
      : obj.type === 'container'
      ? obj.position[1] + DIMENSIONS.containerHD5.height / 2
      : obj.type === 'switchgear'
      ? obj.position[1] + DIMENSIONS.switchgear.height / 2
      : obj.position[1],
    obj.position[2],
  ];

  // Gérer les changements de TransformControls avec debounce pour la performance
  useEffect(() => {
    if (!transformRef.current || !isSelected || !onUpdate) return;

    const controls = transformRef.current;
    let timeoutId: NodeJS.Timeout | null = null;
    let isDragging = false;
    
    const handleChange = () => {
      if (!controls.object) return;
      
      // Debounce les mises à jour pendant le drag pour améliorer les performances
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        const object = controls.object;
        const updates: Partial<SceneObject> = {};
        
        // Mettre à jour la position
        if (editMode === 'move' && object.position) {
          // Ajuster la position Y selon le type d'objet
          let adjustedY = object.position.y;
          if (obj.type === 'substation') {
            adjustedY -= DIMENSIONS.substation.height / 2;
          } else if (obj.type === 'powerblock') {
            adjustedY -= DIMENSIONS.powerBlock.height / 2;
          } else if (obj.type === 'transformer') {
            adjustedY -= DIMENSIONS.transformer.height / 2;
          } else if (obj.type === 'container') {
            adjustedY -= DIMENSIONS.containerHD5.height / 2;
          } else if (obj.type === 'switchgear') {
            adjustedY -= DIMENSIONS.switchgear.height / 2;
          }
          
          updates.position = [
            object.position.x,
            adjustedY,
            object.position.z,
          ];
        }
        
        // Mettre à jour l'échelle
        if (editMode === 'scale' && object.scale) {
          updates.scale = [
            object.scale.x,
            object.scale.y,
            object.scale.z,
          ];
        }
        
        // Mettre à jour la rotation
        if (editMode === 'rotate' && object.rotation) {
          updates.rotation = [
            object.rotation.x,
            object.rotation.y,
            object.rotation.z,
          ];
        }
        
        if (Object.keys(updates).length > 0) {
          onUpdate(updates);
        }
      }, isDragging ? 50 : 0); // Debounce de 50ms pendant le drag
    };

    const handleDraggingChanged = (event: any) => {
      isDragging = event.value;
      // Désactiver OrbitControls pendant le drag
      // Note: OrbitControls sont gérés automatiquement par @react-three/drei
    };

    controls.addEventListener('change', handleChange);
    controls.addEventListener('dragging-changed', handleDraggingChanged);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      controls.removeEventListener('change', handleChange);
      controls.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [isSelected, editMode, onUpdate, obj.type, gl]);

  const showTransformControls = isSelected && (editMode === 'move' || editMode === 'scale' || editMode === 'rotate');
  const mode = editMode === 'move' ? 'translate' : editMode === 'scale' ? 'scale' : editMode === 'rotate' ? 'rotate' : undefined;

  return (
    <>
      <mesh
        ref={meshRef}
        position={adjustedPosition}
        rotation={obj.rotation || [0, 0, 0]}
        scale={obj.scale || [1, 1, 1]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          // Ne sélectionner que si on n'est pas en mode placement
          if (!e.detail) return; // Ignorer les événements synthétiques
          onSelect();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        {getMaterial()}
        {/* Outline pour les objets sélectionnés */}
        {isSelected && (
          <mesh>
            {getGeometry()}
            <meshBasicMaterial
              color={0xff6b6b}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </mesh>
      {showTransformControls && mode && meshRef.current && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current}
          mode={mode}
          enabled={true}
          showX={true}
          showY={true}
          showZ={true}
          size={0.8}
        />
      )}
    </>
  );
}

export default function CompleteSceneEditor({
  objects,
  selectedObjectId,
  onSelectObject,
  onUpdateObject,
  onDeleteObject,
  editMode,
  onPlaceObject,
}: CompleteSceneEditorProps) {
  const { camera, raycaster, gl, scene } = useThree();
  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  // Gérer le placement d'objets - seulement si on ne clique pas sur un objet existant
  useEffect(() => {
    // Ne pas gérer le placement si on est en mode select, move, scale ou rotate
    if (!editMode.startsWith('place-')) return;

    const handleClick = (event: MouseEvent) => {
      // Vérifier si on a cliqué sur un élément UI (bouton, input, etc.)
      const target = event.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('input') ||
        target.closest('.delete-tool-ui') ||
        target.closest('[data-html]')
      ) {
        return;
      }

      // Vérifier si on a cliqué sur un objet existant
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersections = raycaster.intersectObjects(scene.children, true);

      // Si on a cliqué sur un objet existant, ne pas placer un nouvel objet
      if (intersections.length > 0) {
        const clickedObject = intersections[0].object;
        let currentObject: THREE.Object3D | null = clickedObject;
        
        // Vérifier si l'objet cliqué a un selectableId
        while (currentObject) {
          if (currentObject.userData?.selectableId || currentObject.name) {
            // Clic sur un objet existant, ne pas placer
            // La sélection sera gérée par les gestionnaires onClick des objets
            return;
          }
          currentObject = currentObject.parent;
        }
      }

      // Sinon, placer un nouvel objet
      event.stopPropagation();
      event.preventDefault();
      
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      const hasIntersection = raycaster.ray.intersectPlane(plane, intersection);

      if (hasIntersection) {
        const type = editMode.replace('place-', '') as SceneObject['type'];
        onPlaceObject(type, [intersection.x, intersection.y, intersection.z]);
      }
    };

    const canvas = gl.domElement;
    // Utiliser capture phase pour intercepter avant les autres handlers
    canvas.addEventListener('click', handleClick, true);
    return () => {
      canvas.removeEventListener('click', handleClick, true);
    };
  }, [editMode, camera, raycaster, gl, scene, onPlaceObject]);

  // Gérer le déplacement d'objets
  useFrame(() => {
    if (editMode === 'move' && selectedObject) {
      // Le déplacement sera géré par les contrôles UI
    }
  });

  return (
    <>
      {objects.map((obj) => {
        // Routes spéciales : rendu entre deux points
        if (obj.type === 'road' && obj.data?.points && obj.data.points.length === 2) {
          const [p1, p2] = obj.data.points;
          const dx = p2[0] - p1[0];
          const dz = p2[2] - p1[2];
          const length = Math.sqrt(dx * dx + dz * dz);
          const angle = Math.atan2(dz, dx);
          const centerX = (p1[0] + p2[0]) / 2;
          const centerZ = (p1[2] + p2[2]) / 2;
          
          return (
            <RoadMesh
              key={obj.id}
              obj={obj}
              position={[centerX, 0.05, centerZ]}
              rotation={[0, angle, 0]}
              length={length}
              isSelected={obj.id === selectedObjectId}
              onSelect={() => onSelectObject(obj.id)}
              onDelete={() => onDeleteObject(obj.id)}
              editMode={editMode}
              onUpdate={(updates) => onUpdateObject(obj.id, updates)}
            />
          );
        }
        
        return (
          <SceneObject3D
            key={obj.id}
            obj={obj}
            isSelected={obj.id === selectedObjectId}
            onSelect={() => onSelectObject(obj.id)}
            onDelete={() => onDeleteObject(obj.id)}
            editMode={editMode}
            onUpdate={(updates) => onUpdateObject(obj.id, updates)}
          />
        );
      })}
    </>
  );
}

// Composant séparé pour les routes avec userData
function RoadMesh({
  obj,
  position,
  rotation,
  length,
  isSelected,
  onSelect,
  onDelete,
  editMode,
  onUpdate,
}: {
  obj: SceneObject;
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  editMode: 'select' | 'move' | 'scale' | 'rotate' | 'place-wall' | 'place-portal' | 'place-camera' | 'place-parking' | 'place-tree' | 'place-road';
  onUpdate?: (updates: Partial<SceneObject>) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<any>(null);
  const { gl } = useThree();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.selectableId = obj.id;
      meshRef.current.name = obj.id;
      meshRef.current.userData.type = obj.type;
    }
  }, [obj.id, obj.type]);

  // Gérer les changements de TransformControls pour les routes avec debounce
  useEffect(() => {
    if (!transformRef.current || !isSelected || !onUpdate) return;

    const controls = transformRef.current;
    let timeoutId: NodeJS.Timeout | null = null;
    let isDragging = false;
    
    const handleChange = () => {
      if (!controls.object) return;
      
      // Debounce les mises à jour pendant le drag pour améliorer les performances
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        const object = controls.object;
        const updates: Partial<SceneObject> = {};
        
        // Mettre à jour la position
        if (editMode === 'move' && object.position) {
          updates.position = [
            object.position.x,
            object.position.y,
            object.position.z,
          ];
        }
        
        // Mettre à jour l'échelle
        if (editMode === 'scale' && object.scale) {
          updates.scale = [
            object.scale.x,
            object.scale.y,
            object.scale.z,
          ];
        }
        
        // Mettre à jour la rotation
        if (editMode === 'rotate' && object.rotation) {
          updates.rotation = [
            object.rotation.x,
            object.rotation.y,
            object.rotation.z,
          ];
        }
        
        if (Object.keys(updates).length > 0) {
          onUpdate(updates);
        }
      }, isDragging ? 50 : 0); // Debounce de 50ms pendant le drag
    };

    const handleDraggingChanged = (event: any) => {
      isDragging = event.value;
    };

    controls.addEventListener('change', handleChange);
    controls.addEventListener('dragging-changed', handleDraggingChanged);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      controls.removeEventListener('change', handleChange);
      controls.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [isSelected, editMode, onUpdate, gl]);

  const showTransformControls = isSelected && (editMode === 'move' || editMode === 'scale' || editMode === 'rotate');
  const mode = editMode === 'move' ? 'translate' : editMode === 'scale' ? 'scale' : editMode === 'rotate' ? 'rotate' : undefined;

  return (
    <>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={(e) => {
          e.stopPropagation();
          // Ne sélectionner que si on n'est pas en mode placement
          if (!e.detail) return; // Ignorer les événements synthétiques
          onSelect();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[obj.data?.width || 5, 0.1, length]} />
        <meshStandardMaterial
          color={isSelected ? 0xff6b6b : 0x555555}
          metalness={0.2}
          roughness={0.8}
          emissive={isSelected ? 0xff6b6b : 0x000000}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
        {/* Outline pour les routes sélectionnées */}
        {isSelected && (
          <mesh>
            <boxGeometry args={[(obj.data?.width || 5) + 0.2, 0.15, length + 0.2]} />
            <meshBasicMaterial
              color={0xff6b6b}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </mesh>
      {showTransformControls && mode && meshRef.current && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current}
          mode={mode}
          enabled={true}
        />
      )}
    </>
  );
}

