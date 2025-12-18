/**
 * Scène 3D Principale - Site Mining 100MW Qatar
 * =============================================
 * 
 * Scène 3D complète avec environnement identique à l'existant
 */

import { Suspense, memo, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Gallery3DEnvironment from '../gallery/Gallery3DEnvironment';
// import GravelGround from './GravelGround';
import SecurityFenceSection from './SecurityFenceSection';
import GuardHouse3D from './GuardHouse3D';
// import GroundPatch from './GroundPatch';
import { EquipmentPosition } from '../../lib/mining100MWGenerator';
import { getModelById, renderModel, getModelByType, UnifiedModel } from './UnifiedModelCatalog';
import HD5Container3D from './HD5Container3D';
import ContainerPlan3DViewer from './ContainerPlan3DViewer';
import ContainerPlan3DViewerExact from './ContainerPlan3DViewerExact';
import Parking20Places from './Parking20Places';
import IndustrialHangar from './IndustrialHangar';
import CanteenBuilding from './CanteenBuilding';
import DormitoryBuilding from './DormitoryBuilding';
import LogisticsZone from './LogisticsZone';
import Transformer5MW from './Transformer5MW';
import PowerBlock25MW from './PowerBlock25MW';
import InteractiveGPSCompass from './InteractiveGPSCompass';
import TransformTools from './TransformTools';
import QatarFlag from './QatarFlag';
import ModernBuilding from './ModernBuilding';
import MetalStairsTwoSteps from './MetalStairsTwoSteps';
import BigCameraPole from './BigCameraPole';
import CameraVisionCone, { CameraVisionConePTZ } from './CameraVisionCone';
import SecurityCage from './SecurityCage';
import { qualityManager } from '../../utils/qualityManager';
import { PhotoCaptureButton } from './PhotoCaptureTool';
import { BlenderExporterButton } from './BlenderExporter.tsx';

import { MeasurementTool } from './MeasurementTool';

interface Mining100MWSceneProps {
  equipment: EquipmentPosition[];
  selectedObjectIds: string[]; // MODIFIÉ: Liste d'IDs
  onSelectEquipment?: (id: string, multiSelect?: boolean) => void; // MODIFIÉ: Support multi
  onDoubleClickEquipment?: (id: string) => void;
  onClearSelection?: () => void;
  onTransform?: (id: string, position: [number, number, number], rotation: [number, number, number], scale?: [number, number, number]) => void;
  onTransformStart?: () => void;
  onTransformEnd?: () => void;
  transformMode?: 'translate' | 'rotate' | 'scale' | null;
  transformSpace?: 'world' | 'local';
  transformSnap?: boolean;
  groundSize?: number;
  enableNavigation?: boolean;
  
  // Placement Mode
  placementMode?: boolean;
  placementModel?: UnifiedModel | null;
  onPlaceConfirm?: (position: [number, number, number]) => void;
  onPlaceCancel?: () => void;
  
  // Camera Control
  cameraTarget?: {
    position: THREE.Vector3;
    lookAt: THREE.Vector3;
    duration?: number;
  } | null;
  
  // Retro-compatibilité temporaire (si besoin)
  selectedObjectId?: string | null;
}

/**
 * Composant Fantôme pour le placement
 */
const GhostObject = ({ model, position }: { model: UnifiedModel, position: [number, number, number] }) => {
  // On utilise un rendu simplifié ou le modèle lui-même avec une opacité
  // Pour faire simple et robuste : on rend le modèle dans un groupe transparent
  return (
    <group position={position}>
      {/* On peut ajouter une boîte englobante visuelle pour aider */}
      <mesh position={[0, (model.dimensions.height || 2) / 2, 0]}>
        <boxGeometry args={[model.dimensions.length || 1, model.dimensions.height || 1, model.dimensions.width || 1]} />
        <meshBasicMaterial color="#8AFD81" wireframe />
      </mesh>
      {/* Rendu du modèle réel en semi-transparent (si supporté par les shaders internes, sinon juste le wireframe suffira pour le placement précis) */}
      <group>
        {renderModel(model, { ...model.defaultProps, opacity: 0.5, transparent: true })}
      </group>
    </group>
  );
};

/**
 * Gestionnaire de placement (Raycaster sur le sol)
 */
const PlacementManager = ({ 
  model, 
  onConfirm, 
  onCancel 
}: { 
  model: UnifiedModel, 
  onConfirm: (pos: [number, number, number]) => void,
  onCancel: () => void 
}) => {
  const { camera, raycaster } = useThree();
  const [ghostPos, setGhostPos] = useState<[number, number, number] | null>(null);
  const [height, setHeight] = useState<number>(0);
  const placementArmedRef = useRef(false);

  // Si on change uniquement la hauteur (molette/clavier), mettre à jour le fantôme même sans mouvement souris
  useEffect(() => {
    setGhostPos((prev) => (prev ? [prev[0], height, prev[2]] : prev));
  }, [height]);

  // Gestionnaire d'événements global pour la souris
  useEffect(() => {
    // Anti-bug: le clic qui sélectionne un modèle dans la bibliothèque peut aussi déclencher le "click" global.
    // On arme le placement avec un petit délai pour éviter un placement immédiat involontaire.
    placementArmedRef.current = false;
    const armTimeout = window.setTimeout(() => {
      placementArmedRef.current = true;
    }, 250);

    const handleMouseMove = (e: MouseEvent) => {
      // Normaliser les coordonnées souris (-1 à +1)
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      
      // On cherche l'intersection avec le sol (on suppose que le sol est un mesh avec name="ground" ou le premier mesh large)
      // Pour faire simple : on intersecte un plan mathématique Y=0
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);

      if (target) {
        // SNAPPING INTELLIGENT (Grille 1m)
        const snap = 1.0;
        const x = Math.round(target.x / snap) * snap;
        const z = Math.round(target.z / snap) * snap;
        setGhostPos([x, height, z]);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Sécurité: éviter le placement instantané au moment d'entrer en mode placement
      if (!placementArmedRef.current) return;
      // Uniquement clic gauche
      if (typeof e.button === 'number' && e.button !== 0) return;
      if (ghostPos) {
        // Empêcher le click de traverser (si possible, mais ici on est sur window)
        onConfirm(ghostPos);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      // Monter / descendre pendant le placement
      if (e.key === 'r' || e.key === 'R' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        const step = e.shiftKey ? 1.0 : 0.1;
        setHeight((h) => parseFloat((h + step).toFixed(2)));
      }
      if (e.key === 'f' || e.key === 'F' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        const step = e.shiftKey ? 1.0 : 0.1;
        setHeight((h) => Math.max(0, parseFloat((h - step).toFixed(2))));
      }
      if (e.key === 'g' || e.key === 'G') {
        setHeight(0);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Contrôle hauteur via molette (Shift = rapide)
      // On bloque le scroll pour éviter de déplacer la page pendant le placement
      // MAIS on ne doit bloquer le scroll que si la souris est au-dessus du canvas, ce qui est géré ici via le listener sur window.
      // Problème: cela désactive le zoom des OrbitControls.
      
      // SOLUTION: En mode placement, on veut utiliser la molette pour la HAUTEUR de l'objet, pas le zoom.
      // Donc preventDefault() est correct ICI.
      // Mais OrbitControls est aussi actif ?
      // Il faut désactiver les OrbitControls (enableZoom={false}) pendant le placement.
      // C'est géré via la prop `enableNavigation` passée à OrbitControls dans le parent.
      
      e.preventDefault();
      const step = e.shiftKey ? 1.0 : 0.1;
      const dir = e.deltaY < 0 ? 1 : -1;
      setHeight((h) => Math.max(0, parseFloat((h + dir * step).toFixed(2))));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick); // Attention au conflit avec le clic UI
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.clearTimeout(armTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel as any);
    };
  }, [camera, raycaster, ghostPos, height, onConfirm, onCancel]);

  if (!ghostPos) return null;

  return <GhostObject model={model} position={ghostPos} />;
};


// Composant Barrière de Sécurité Industrielle (Boom Barrier)
const SecurityBoomBarrier = ({ length = 6 }: { length: number }) => {
  // Housing (Moteur)
  const housingHeight = 1.1;
  const housingWidth = 0.5;
  
  return (
    <group>
      {/* Boitier Moteur */}
      <mesh position={[0, housingHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[housingWidth, housingHeight, housingWidth]} />
        <meshStandardMaterial color="#2d3436" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Bande LED ou Détail Orange sur le boitier */}
      <mesh position={[0, housingHeight - 0.15, 0]} castShadow>
        <boxGeometry args={[housingWidth + 0.02, 0.1, housingWidth + 0.02]} />
        <meshStandardMaterial color="#ff6b00" emissive="#ff6b00" emissiveIntensity={0.5} />
      </mesh>

      {/* Bras de la barrière (Lisse) */}
      <group position={[0, housingHeight - 0.2, 0]}>
        {/* Axe Pivot */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0.1, 0.1, 0.6]} />
           <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* La Barre elle-même (Décalée pour partir du pivot) */}
        <mesh position={[length / 2, 0, 0.15]} castShadow>
          <boxGeometry args={[length, 0.15, 0.08]} />
          <meshStandardMaterial color="#f1c40f" /> {/* Jaune Sécurité */}
        </mesh>
        
        {/* Bandes noires (simulées par des petits meshs espacés) */}
        {Array.from({ length: Math.floor(length) }).map((_, i) => (
           <mesh key={i} position={[i * 1.0 + 0.5, 0, 0.151]}>
             <planeGeometry args={[0.4, 0.14]} />
             <meshBasicMaterial color="black" />
           </mesh>
        ))}
      </group>

      {/* Poteau de repos (à l'extrémité) */}
      <mesh position={[length, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.0]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      {/* Tête poteau repos (U shape simulé) */}
      <mesh position={[length, 1.0, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
    </group>
  );
};

// Composant Cage de Protection pour Transformateur
const TransformerProtectionCage = ({ width, length, height }: { width: number, length: number, height: number }) => {
  // Matériau style "grille galvanisée" (wireframe simple et efficace)
  const cageMaterial = new THREE.MeshStandardMaterial({
    color: '#a0a0a0',
    wireframe: true,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Géométrie Plane avec segments pour l'effet grille
  const segW = Math.floor(width * 4); // 4 segments par mètre
  const segL = Math.floor(length * 4);
  const segH = Math.floor(height * 4);

  return (
    <group position={[0, height / 2, 0]}>
      {/* Toit */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} castShadow>
        <planeGeometry args={[width, length, segW, segL]} />
        <primitive object={cageMaterial} attach="material" />
      </mesh>
      {/* Arrière (Z-) */}
      <mesh position={[0, 0, -length / 2]} rotation={[0, 0, 0]} castShadow>
        <planeGeometry args={[width, height, segW, segH]} />
        <primitive object={cageMaterial} attach="material" />
      </mesh>
      {/* Avant (Z+) - AJOUTÉ pour fermer la cage */}
      <mesh position={[0, 0, length / 2]} rotation={[0, 0, 0]} castShadow>
        <planeGeometry args={[width, height, segW, segH]} />
        <primitive object={cageMaterial} attach="material" />
      </mesh>
      {/* Gauche (X-) */}
      <mesh position={[-width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[length, height, segL, segH]} />
        <primitive object={cageMaterial} attach="material" />
      </mesh>
      {/* Droite (X+) */}
      <mesh position={[width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[length, height, segL, segH]} />
        <primitive object={cageMaterial} attach="material" />
      </mesh>
      {/* Cadre (Poteaux aux coins pour le réalisme) */}
      {[
        [-width/2, -length/2], [width/2, -length/2], // Arrière
        [-width/2, length/2], [width/2, length/2]    // Avant
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0, pos[1]]} castShadow>
          <boxGeometry args={[0.1, height, 0.1]} />
          <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Composant pour rendre un équipement individuel
 */
const EquipmentRenderer = memo(function EquipmentRenderer({
  equipment,
  isSelected,
  onSelect,
  onDoubleClick,
}: {
  equipment: EquipmentPosition;
  isSelected: boolean;
  onSelect?: (id: string, multiSelect?: boolean) => void;
  onDoubleClick?: (id: string) => void;
}) {
  const rootRef = useRef<THREE.Group>(null);

  const handleClick = (e: any) => {
    // Sécurité: en cas d'événement manquant / non standard
    e?.stopPropagation?.();
    // Détection de la touche Shift via l'événement natif
    const isShift = !!(e?.shiftKey || e?.nativeEvent?.shiftKey);
    if (onSelect) {
      onSelect(equipment.id, isShift);
    }
  };

  const handleDoubleClick = (e: any) => {
    e?.stopPropagation?.();
    if (onDoubleClick) {
      onDoubleClick(equipment.id);
    } else if (onSelect) {
      onSelect(equipment.id, false);
    }
  };

  const interactiveProps = {
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onPointerOver: (e: any) => {
      e?.stopPropagation?.();
      if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      if (typeof document !== 'undefined') document.body.style.cursor = 'default';
    },
  };

  const markerY = (equipment.dimensions?.height ?? 0) + 0.8;
  const SelectionMarker = () =>
    isSelected ? (
      <mesh position={[0, markerY, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#8AFD81" wireframe />
      </mesh>
    ) : null;

  // ---------------------------------------------------------
  // OVERRIDES APPARENCE (couleur + matière via metadata)
  // ---------------------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const color = equipment.metadata?.color;
    const mat = equipment.metadata?.material;
    if (!color && !mat) return;

    root.traverse((obj: any) => {
      if (!obj || !obj.isMesh) return;
      const mesh = obj as THREE.Mesh;
      const raw = (mesh as any).material;
      if (!raw) return;

      const materials: any[] = Array.isArray(raw) ? raw : [raw];
      materials.forEach((m) => {
        if (!m || !m.isMaterial) return;
        // Ne pas recolorer les helpers / marqueurs (souvent en MeshBasicMaterial)
        if (m.isMeshBasicMaterial) return;

        let changed = false;

        if (color && m.color && typeof m.color.set === 'function') {
          try {
            m.color.set(color);
            changed = true;
          } catch {
            // ignore
          }
        }

        if (mat) {
          if (typeof mat.roughness === 'number' && 'roughness' in m) {
            m.roughness = mat.roughness;
            changed = true;
          }
          if (typeof mat.metalness === 'number' && 'metalness' in m) {
            m.metalness = mat.metalness;
            changed = true;
          }
          if (typeof mat.envMapIntensity === 'number' && 'envMapIntensity' in m) {
            m.envMapIntensity = mat.envMapIntensity;
            changed = true;
          }
          if (typeof mat.emissiveIntensity === 'number' && 'emissiveIntensity' in m) {
            m.emissiveIntensity = mat.emissiveIntensity;
            changed = true;
          }
          if (typeof mat.opacity === 'number' && 'opacity' in m) {
            m.opacity = mat.opacity;
            m.transparent = mat.opacity < 0.999;
            changed = true;
          }
        }

        if (changed) {
          m.needsUpdate = true;
        }
      });
    });
  }, [equipment.metadata?.color, equipment.metadata?.material]);

  // ---------------------------------------------------------
  // RENDU DYNAMIQUE INTELLIGENT (FALLBACK CATALOGUE)
  // ---------------------------------------------------------
  
  // Si le type n'est pas géré spécifiquement ci-dessous, on essaie de trouver le modèle dans le catalogue
  // Cette partie rend le système extensible à l'infini sans modifier ce fichier.
  // Note: On exclut les types "hardcodés" historiques pour ne pas casser la logique existante.
  const hardcodedTypes = ['power-block', 'transformer', 'container', 'foundation', 'substation', 'cable-path', 'road', 'fence', 'building', 'flag', 'vegetation', 'barrier', 'ground-patch'];
  
  if (!hardcodedTypes.includes(equipment.type)) {
    // Essai 1: Par Type exact
    let model = getModelByType(equipment.type);
    
    // Essai 2: Par ID (si l'ID de l'équipement contient le type original)
    if (!model && equipment.id.includes('-')) {
       const potentialType = equipment.id.split('-')[0]; // ex: "road-standard-123" -> "road"
       model = getModelByType(potentialType);
    }

    if (model) {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          // On applique l'échelle si stockée (non standard dans EquipmentPosition mais utile)
          scale={(equipment as any).scale || [1, 1, 1]} 
          {...interactiveProps}
        >
          {renderModel(model, { 
             // On passe les dimensions personnalisées si elles existent
             dimensions: equipment.dimensions,
             ...equipment.metadata 
          })}
          <SelectionMarker />
        </group>
      );
    }
  }

  // Rendre selon le type d'équipement (Logique Historique)
  switch (equipment.type) {
    case 'power-block': {
      const model = getModelById('power-block-20mw'); // Utilise le nouveau modèle 20MW
      if (model) {
        return (
          <group ref={rootRef} position={equipment.position} rotation={equipment.rotation} {...interactiveProps}>
            {renderModel(model, { isSelected })}
            {isSelected && (
              <mesh position={[0, 3, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="#8AFD81" wireframe />
              </mesh>
            )}
          </group>
        );
      }
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <PowerBlock25MW
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            onClick={handleClick}
            id={equipment.id}
            isSelected={isSelected}
          />
        </group>
      );
    }

    case 'transformer': {
      const model = getModelById('transformer-5mw-variant-1');
      if (model) {
        return (
          <group ref={rootRef} position={equipment.position} rotation={equipment.rotation} {...interactiveProps}>
            {renderModel(model, { isSelected })}
            {isSelected && (
              <mesh position={[0, 2, 0]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial color="#8AFD81" wireframe />
              </mesh>
            )}
          </group>
        );
      }
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <Transformer5MW
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            onClick={handleClick}
            id={equipment.id}
            isSelected={isSelected}
          />
        </group>
      );
    }

    case 'container': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <ContainerPlan3DViewerExact
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            isSelected={isSelected}
            includeConcreteBase={true} // REACTIVÉ : Dalle de 40cm incluse dans le composant
          />
        </group>
      );
    }

    case 'ground-patch': {
      // DÉSACTIVÉ FORCE
      return null;
    }

    case 'foundation': {
      // REACTIVATION POUR LES BLOCS DE BÉTON SOUS MODULES
      if (!equipment.dimensions) return null;
      
      // CORRECTION Z-FIGHTING : Léger offset pour les fondations
      const foundationPosition: [number, number, number] = [
        equipment.position[0],
        equipment.position[1] + 0.01, // +1cm pour éviter z-fighting
        equipment.position[2]
      ];
      
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={foundationPosition}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <mesh receiveShadow castShadow>
            <boxGeometry args={[equipment.dimensions.width, equipment.dimensions.height, equipment.dimensions.length]} />
            <meshStandardMaterial 
              color="#4a4a4a" 
              roughness={0.9}
              polygonOffset={true}
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </mesh>
          <SelectionMarker />
        </group>
      );
    }

    case 'substation': {
      if (!equipment.dimensions) return null;
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          {/* Bâtiment principal */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[equipment.dimensions.width, equipment.dimensions.height, equipment.dimensions.length]} />
            <meshStandardMaterial color="#445566" metalness={0.5} roughness={0.2} />
          </mesh>
          <Text
            position={[0, equipment.dimensions.height/2 + 1, 0]}
            fontSize={2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            HV SUBSTATION
          </Text>
          {/* Isolateurs HV (visuel simple) */}
          <mesh position={[0, equipment.dimensions.height/2 + 1.5, -equipment.dimensions.length/2 + 2]}>
            <cylinderGeometry args={[0.2, 0.2, 3]} />
            <meshStandardMaterial color="#ccaa88" />
          </mesh>
          <SelectionMarker />
        </group>
      );
    }

    case 'cable-path': {
      const radius = 0.06; // ~6 cm (câble industriel)
      const color = equipment.metadata?.color || '#111827';

      // Support multi-segments: `metadata.path` = [[x,y,z], ...]
      if (equipment.metadata?.path && equipment.metadata.path.length >= 2) {
        const pts = equipment.metadata.path;
        const base = pts[0];
        const local = pts.map((p) => [p[0] - base[0], p[1] - base[1], p[2] - base[2]] as [number, number, number]);
        return (
          <group
            ref={rootRef}
            name={equipment.id}
            userData={{ id: equipment.id }}
            position={base}
            {...interactiveProps}
          >
            {local.slice(0, -1).map((a, idx) => {
              const b = local[idx + 1];
              const start = new THREE.Vector3(...a);
              const end = new THREE.Vector3(...b);
              const dir = new THREE.Vector3().subVectors(end, start);
              const length = dir.length();
              if (length < 0.001) return null;
              const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
              const quat = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                dir.clone().normalize()
              );
              return (
                <mesh key={`${equipment.id}_seg_${idx}`} position={[mid.x, mid.y, mid.z]} quaternion={quat} castShadow>
                  <cylinderGeometry args={[radius, radius, length, 12]} />
                  <meshStandardMaterial color={color} metalness={0.05} roughness={0.85} />
                </mesh>
              );
            })}
            <SelectionMarker />
          </group>
        );
      }

      // Fallback: un seul segment `from` -> `to`
      if (!equipment.metadata?.from || !equipment.metadata?.to) return null;
      const from = equipment.metadata.from;
      const to = equipment.metadata.to;
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
      const dir = new THREE.Vector3().subVectors(end, start);
      const length = dir.length();
      if (length < 0.001) return null;
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), // cylindre orienté Y
        dir.clone().normalize()
      );

      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={from}
          {...interactiveProps}
        >
          <mesh position={[mid.x, mid.y, mid.z]} quaternion={quat} castShadow>
            <cylinderGeometry args={[radius, radius, length, 12]} />
            <meshStandardMaterial color={color} metalness={0.05} roughness={0.85} />
          </mesh>
          <SelectionMarker />
        </group>
      );
    }

    // --- NOUVEAUX TYPES AJOUTÉS ---

    case 'road': {
      if (!equipment.dimensions) return null;
      
      // FILTRE AGRESSIF SUR LES ROUTES "DECORATIVES" (Sols ajoutés)
      // On supprime les routes d'accès transversales et les liaisons si l'utilisateur veut "enlever les sols"
      if (
        equipment.id.includes('ACCESS_ROAD') || 
        equipment.id.includes('ROAD_LINK') ||
        equipment.id.includes('INTER_ROW_ROAD') ||
        equipment.id.includes('PATH_LIFE_BASE') ||
        equipment.id.includes('_FLOOR') // Sol des passerelles
      ) return null;

      // Cas spécial pour les CÂBLES (pour qu'ils soient ronds ou cylindriques)
      // EXCEPTION: Les nouveaux chemins de câbles "Heavy" (HIGH, LOW, SLOPE) doivent être PLATS (Boîtes)
      const isFlatTray = equipment.id.includes('_HIGH') || equipment.id.includes('_LOW') || equipment.id.includes('_SLOPE');

      if (equipment.id.includes('_CABLE_') && !isFlatTray) {
        const radius = equipment.dimensions.width / 2;
        const length = equipment.dimensions.length;
        
        // CORRECTION Z-FIGHTING : Offset vertical pour câbles cylindriques
        const adjustedCablePosition: [number, number, number] = [
          equipment.position[0],
          equipment.position[1] + 0.03, // +3cm au-dessus du sol (plus haut que les routes plates)
          equipment.position[2]
        ];
        
        return (
          <group 
            ref={rootRef}
            name={equipment.id}
            userData={{ id: equipment.id }}
            position={adjustedCablePosition}
            rotation={equipment.rotation}
            {...interactiveProps}
          >
            {/* On utilise un cylindre au lieu d'une boîte pour les câbles */}
            {/* CylinderGeometry: radiusTop, radiusBottom, height, radialSegments */}
            {/* Attention: Cylinder est orienté Y par défaut. Si road est Z-aligned, il faut pivoter. */}
            <mesh rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius, length, 8]} />
              <meshStandardMaterial 
                color={equipment.metadata?.color || '#333333'} 
                roughness={0.6}
                metalness={0.1}
                polygonOffset={true}
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
              />
            </mesh>
            <SelectionMarker />
          </group>
        );
      }

      // Route normale (Boîte)
      // Cas spécial pour les plaques de câbles inclinées : forcer l'ordre de rotation YXZ
      const rotation = equipment.id.includes('_SLOPE')
        ? new THREE.Euler(equipment.rotation[0], equipment.rotation[1], equipment.rotation[2], 'YXZ')
        : equipment.rotation;

      const isCableTray = equipment.id.includes('_CABLE_');
      
      // CORRECTION Z-FIGHTING : Offset vertical pour éviter le scintillement avec le sol
      const adjustedPosition: [number, number, number] = [
        equipment.position[0],
        equipment.position[1] + 0.02, // +2cm au-dessus du sol
        equipment.position[2]
      ];
      
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={adjustedPosition}
          rotation={rotation as any}
          scale={(equipment as any).scale || [1, 1, 1]}
          {...interactiveProps}
        >
          <mesh receiveShadow castShadow>
            <boxGeometry args={[equipment.dimensions.width, equipment.dimensions.height, equipment.dimensions.length]} />
            <meshStandardMaterial 
              // Rendu "métal industriel" pour les chemins/plaques de câbles
              color={equipment.metadata?.color || (isCableTray ? '#8a8f98' : '#333333')}
              metalness={isCableTray ? 0.85 : 0.1}
              roughness={isCableTray ? 0.35 : 0.8}
              envMapIntensity={isCableTray ? 1.2 : 1.0}
              // Activation du polygonOffset pour éviter le z-fighting
              polygonOffset={true}
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
              depthWrite={true}
            />
          </mesh>
          <SelectionMarker />
        </group>
      );
    }

    case 'fence': {
      if (!equipment.dimensions) return null;
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <SecurityFenceSection
            length={equipment.dimensions.length}
            height={equipment.dimensions.height}
            isSelected={isSelected}
            fenceId={equipment.id}
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'building': {
      if (!equipment.dimensions) return null;
      // On caste le buildingType pour être sûr qu'il correspond aux types attendus par ModernBuilding
      const type = (equipment.metadata?.buildingType as any) || 'security';
      
      // Si c'est le poste de sécurité, on utilise GuardHouse3D
      if (type === 'security') {
        return (
          <group
            ref={rootRef}
            name={equipment.id}
            userData={{ id: equipment.id }}
            position={equipment.position}
            rotation={equipment.rotation}
            scale={(equipment as any).scale || [1, 1, 1]}
            {...interactiveProps}
          >
            <GuardHouse3D 
              position={[0, 0, 0]} 
              rotation={0} 
            />
            <SelectionMarker />
          </group>
        );
      }

      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          scale={(equipment as any).scale || [1, 1, 1]}
          {...interactiveProps}
        >
          <ModernBuilding type={type} dimensions={equipment.dimensions} />
          <SelectionMarker />
        </group>
      );
    }

    case 'flag': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <QatarFlag scale={2} />
          <SelectionMarker />
        </group>
      );
    }

    case 'vegetation': {
      // Représentation simplifiée d'un arbre/palmier
      if (!equipment.dimensions) return null;
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          {/* Tronc */}
          <mesh position={[0, equipment.dimensions.height/2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, equipment.dimensions.height]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Feuillage */}
          <mesh position={[0, equipment.dimensions.height, 0]} castShadow>
            <dodecahedronGeometry args={[1.5]} />
            <meshStandardMaterial color={equipment.metadata?.color || 'green'} />
          </mesh>
          <SelectionMarker />
        </group>
      );
    }

    case 'barrier': {
      // DÉSACTIVÉ FORCE (Barrières blanches)
      return null;
    }

    case 'metal-stairs-2-steps': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <MetalStairsTwoSteps
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            isSelected={isSelected}
            id={equipment.id}
            onClick={(e: any) => {
               if (onSelect) {
                 e?.stopPropagation?.();
                 onSelect(equipment.id, !!e?.shiftKey);
               }
            }}
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'camera-pole-fixed':
    case 'camera-pole-ptz': {
      const variant = equipment.type === 'camera-pole-ptz' ? 'ptz' : 'fixed';
      const showVisionCone = isSelected; // Afficher le cône uniquement quand sélectionné
      
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <BigCameraPole
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            variant={variant}
            isSelected={isSelected}
            id={equipment.id}
          />
          
          {/* Cône de vision (visible uniquement quand sélectionné) */}
          {showVisionCone && variant === 'ptz' && (
            <CameraVisionConePTZ
              position={[0, 6.5, 0]} // Hauteur de la caméra
              range={30}
              color="#00A651"
              opacity={0.12}
              visible={true}
            />
          )}
          
          {showVisionCone && variant === 'fixed' && (
            <CameraVisionCone
              position={[0, 6.5, 0]} // Hauteur de la caméra
              rotation={[0, 0, 0]} // Utilise la rotation du groupe parent
              fov={90}
              range={25}
              color="#00A651"
              opacity={0.12}
              visible={true}
            />
          )}
          
          <SelectionMarker />
        </group>
      );
    }

    case 'security-cage': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <SecurityCage
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            isSelected={isSelected}
            id={equipment.id}
            onClick={(e: any) => {
              if (onSelect) {
                e?.stopPropagation();
                onSelect(equipment.id, !!e?.shiftKey);
              }
            }}
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'transformer-cage': {
      if (!equipment.dimensions) return null;
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <TransformerProtectionCage 
            width={equipment.dimensions.width} 
            length={equipment.dimensions.length} 
            height={equipment.dimensions.height} 
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'security-gate': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <SecurityBoomBarrier length={equipment.dimensions?.length || 6} />
          <SelectionMarker />
        </group>
      );
    }

    case 'parking-20': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          scale={(equipment as any).scale || [1, 1, 1]}
          {...interactiveProps}
        >
          <Parking20Places showNumbers={true} />
          <SelectionMarker />
        </group>
      );
    }

    case 'industrial-hangar': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          scale={(equipment as any).scale || [1, 1, 1]}
          {...interactiveProps}
        >
          <IndustrialHangar 
            width={equipment.dimensions?.width} 
            length={equipment.dimensions?.length} 
            height={equipment.dimensions?.height} 
            color={equipment.metadata?.color} // Passe la couleur du mur
            roofColor="#1a1a1a" // Toit noir par défaut pour aller avec
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'building-canteen': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <CanteenBuilding 
            width={equipment.dimensions?.width} 
            length={equipment.dimensions?.length} 
            height={equipment.dimensions?.height} 
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'building-dormitory': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <DormitoryBuilding 
            width={equipment.dimensions?.width} 
            length={equipment.dimensions?.length} 
            height={equipment.dimensions?.height} 
          />
          <SelectionMarker />
        </group>
      );
    }

    case 'logistics-zone': {
      return (
        <group
          ref={rootRef}
          name={equipment.id}
          userData={{ id: equipment.id }}
          position={equipment.position}
          rotation={equipment.rotation}
          {...interactiveProps}
        >
          <LogisticsZone 
            length={equipment.dimensions?.length} 
            width={equipment.dimensions?.width} 
          />
          <SelectionMarker />
        </group>
      );
    }

    default:
      return null;
  }
});

/**
 * Contrôleur de caméra intégré (interne à la scène)
 */
function SceneCameraController({ target }: { target: { position: THREE.Vector3; lookAt: THREE.Vector3; duration?: number } | null }) {
  const { camera, controls } = useThree();
  const orbitRef = useRef<any>(null);

  // Synchronisation avec OrbitControls
  useEffect(() => {
     // Si controls est défini dans useThree, c'est l'instance globale
     // Sinon on attendra que OrbitControls le définisse
  }, [controls]);

  useEffect(() => {
    if (!target) return;

    const startPos = camera.position.clone();
    // On doit récupérer la cible actuelle des controls s'ils existent, sinon (0,0,0)
    // Hack: OrbitControls stocke sa cible dans .target
    const currentOrbitTarget = (controls as any)?.target || new THREE.Vector3(0,0,0);
    const startLookAt = currentOrbitTarget.clone();

    const duration = target.duration || 1000;
    const startTime = performance.now();

    let frameId: number;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing cubic
      const t = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolation position
      camera.position.lerpVectors(startPos, target!.position, t);
      
      // Interpolation target (regard)
      // Pour OrbitControls, il faut mettre à jour .target ET update()
      if (controls) {
         (controls as any).target.lerpVectors(startLookAt, target!.lookAt, t);
         (controls as any).update();
      } else {
         camera.lookAt(new THREE.Vector3().lerpVectors(startLookAt, target!.lookAt, t));
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    }
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, camera, controls]);

  return null;
}

/**
 * Scène 3D principale
 */
export default function Mining100MWScene({
  equipment,
  selectedObjectIds, // Liste d'IDs
  selectedObjectId, // Backward compatibility
  onSelectEquipment,
  onDoubleClickEquipment,
  onClearSelection,
  onTransform,
  onTransformStart,
  onTransformEnd,
  transformMode,
  transformSpace = 'world',
  transformSnap = true,
  groundSize = 500,
  enableNavigation = true,
  placementMode,
  placementModel,
  onPlaceConfirm,
  onPlaceCancel,
  cameraTarget
}: Mining100MWSceneProps) {
  
  // Normalisation: on utilise le tableau s'il existe, sinon le simple
  const effectiveSelectedIds = selectedObjectIds || (selectedObjectId ? [selectedObjectId] : []);
  const primarySelectedId = effectiveSelectedIds.length > 0 ? effectiveSelectedIds[effectiveSelectedIds.length - 1] : null;
  const quality = qualityManager.getQuality();
  const qualitySettings = qualityManager.getSettings();

  // Lors du placement, on désactive la navigation pour éviter les conflits (zoom vs hauteur)
  // Sauf si l'utilisateur appuie sur une touche spéciale (ex: Alt) pour bouger la caméra temporairement ?
  // Pour l'instant, on respecte `enableNavigation` mais on le force à false si placementMode est actif
  const isNavEnabled = enableNavigation && !placementMode;

  return (
    <Canvas
      camera={{ position: [80, 60, 80], fov: 50 }}
      // Perf: en "low" on coupe les ombres (énorme gain CPU/GPU)
      shadows={true}
      onPointerMissed={(e) => {
        // Click dans le vide => désélection
        if (e.type === 'click') onClearSelection?.();
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        preserveDrawingBuffer: true,
        pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 3) : 1
      }}
      dpr={[1, 3]} // Force haute résolution (1 à 3)
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <SceneCameraController target={cameraTarget || null} />
        <Gallery3DEnvironment>
          {/* Sol du site : Sans texture */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow name="Ground_Mesh">
            <planeGeometry args={[groundSize, groundSize]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} name="Site_Ground_Dark_Sand" />
          </mesh>

          {/* Outil de Mesure */}
          <MeasurementTool />

          {/* Placement Fantôme (si mode placement actif) */}
          {placementMode && placementModel && onPlaceConfirm && onPlaceCancel && (
            <PlacementManager 
              model={placementModel} 
              onConfirm={onPlaceConfirm} 
              onCancel={onPlaceCancel} 
            />
          )}

          {/* Rendre tous les équipements */}
          {equipment.map((eq) => (
            <EquipmentRenderer
              key={eq.id}
              equipment={eq}
              isSelected={effectiveSelectedIds.includes(eq.id)}
              onSelect={onSelectEquipment}
              onDoubleClick={onDoubleClickEquipment}
            />
          ))}

          {/* Outils de transformation (Uniquement sur le dernier objet sélectionné pour l'instant) */}
          {primarySelectedId && transformMode && onTransform && !placementMode && (
            <TransformTools
              selectedObjectId={primarySelectedId}
              mode={transformMode}
              // Force LOCAL space pour SCALE afin d'éviter le cisaillement (shearing)
              space={transformMode === 'scale' ? 'local' : transformSpace}
              useSnap={transformSnap}
              onTransform={onTransform}
              onTransformStart={onTransformStart}
              onTransformEnd={onTransformEnd}
            >
              <></>
            </TransformTools>
          )}
        </Gallery3DEnvironment>

          <OrbitControls
            makeDefault
            enabled={isNavEnabled}
            enableDamping
            dampingFactor={0.05}
            autoRotate={false}
            zoomToCursor={true}
            minDistance={0.1}
            maxDistance={5000}
            maxPolarAngle={Math.PI}
            screenSpacePanning={true}
          />

          {/* Post-Processing pour Rendu Photoréaliste */}
          <EffectComposer disableNormalPass={false} multisampling={4}>
            <SSAO 
              radius={0.4}
              intensity={25}
              luminanceInfluence={0.4}
              color="black"
            />
            <Bloom 
              luminanceThreshold={1.5} // Seuls les trucs TRES brillants brillent
              mipmapBlur 
              intensity={0.4} 
              radius={0.6}
            />
          </EffectComposer>

          {/* Outil de Capture Photo 4K */}
          <PhotoCaptureButton />
          
          {/* Outil Export Blender */}
          <BlenderExporterButton />

        </Suspense>
    </Canvas>
  );
}
