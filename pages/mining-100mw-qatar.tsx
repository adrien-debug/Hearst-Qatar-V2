/**
 * Page Principale - Site Mining 100MW Qatar
 * =========================================
 * 
 * Interface interactive pour visualiser le site de mining 100MW optimisé
 */

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import Mining100MWScene from '../components/3d/Mining100MWScene';
import ElementPlacementPanel from '../components/3d/ElementPlacementPanel';
import HearstAssetLibrary from '../components/3d/HearstAssetLibrary';
import HearstEditorToolbar from '../components/3d/HearstEditorToolbar';
import PresetViewControls from '../components/3d/PresetViewControls';
import EquipmentDetailsPanel from '../components/3d/EquipmentDetailsPanel';
import { GPSLabelsOverlay } from '../components/3d/InteractiveGPSCompass';
import {
  generateMining100MWLayout,
  EquipmentPosition,
} from '../lib/mining100MWGenerator';
import { validateLayout } from '../utils/miningLayoutCalculator';
import { UnifiedModel } from '../components/3d/UnifiedModelCatalog';
import { useAutoSave } from '../hooks/useAutoSave';
import { useHistory } from '../hooks/useHistory';

export default function Mining100MWQatarPage() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([]);
  const selectedObjectIdsRef = useRef<string[]>([]);
  const [isToolbarActive, setIsToolbarActive] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showPlacementPanel, setShowPlacementPanel] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  
  // États de transformation
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale' | null>(null);
  const [transformSpace, setTransformSpace] = useState<'world' | 'local'>('world');
  const [transformSnap, setTransformSnap] = useState<boolean>(true);
  
  // États de placement (Fantôme)
  const [placementMode, setPlacementMode] = useState(false);
  const [placementModel, setPlacementModel] = useState<UnifiedModel | null>(null);
  
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // GESTION DE L'HISTORIQUE
  const {
    state: equipmentList,
    set: setEquipmentListWithHistory,
    update: setEquipmentListOnly,
    snapshot: snapshotHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<EquipmentPosition[]>([]);
  
  // Hook de sauvegarde automatique - AVEC CLEARSAVE RESTAURÉ
  const { status: saveStatus, loadSavedData, forceSave, clearSave } = useAutoSave(equipmentList);

  // Référence toujours à jour du layout (évite les saves “en retard”)
  const equipmentListRef = useRef<EquipmentPosition[]>(equipmentList);
  useEffect(() => {
    equipmentListRef.current = equipmentList;
  }, [equipmentList]);

  // Référence toujours à jour de la sélection
  useEffect(() => {
    selectedObjectIdsRef.current = selectedObjectIds;
  }, [selectedObjectIds]);

  // --- CAMERA CONTROLS ---
  const [cameraTarget, setCameraTarget] = useState<{
    position: THREE.Vector3;
    lookAt: THREE.Vector3;
    duration?: number;
  } | null>(null);

  // Focus Camera on Object
  const focusOnObject = useCallback((id: string) => {
    const object = equipmentListRef.current.find(e => e.id === id);
    if (!object) return;

    // Calculer une position de caméra idéale selon le type et la taille
    // On utilise les dimensions ou des valeurs par défaut
    const l = object.dimensions?.length || 5;
    const w = object.dimensions?.width || 5;
    const h = object.dimensions?.height || 5;
    const size = Math.max(l, w, h);
    
    const distance = size * 3; // Recul proportionnel
    const height = Math.max(size * 1.5, 5);   // Hauteur proportionnelle

    // Vecteur de direction par défaut (Sud-Est pour une vue iso)
    // On ajoute un offset relatif à la position de l'objet
    const offset = new THREE.Vector3(distance, height, distance);
    
    // Position cible
    const targetPos = new THREE.Vector3(object.position[0], object.position[1], object.position[2]);
    const camPos = targetPos.clone().add(offset);

    setCameraTarget({
      position: camPos,
      lookAt: targetPos,
      duration: 1000
    });
  }, []);

  // Preset Views
  const setPresetView = useCallback((view: 'overview' | 'top' | 'front' | 'side' | 'entry') => {
      let pos = new THREE.Vector3();
      let look = new THREE.Vector3(0, 0, 0);

      switch(view) {
          case 'overview':
              pos.set(100, 80, 100); // Iso éloignée
              look.set(0, 0, 0);
              break;
          case 'top':
              pos.set(0, 250, 0);
              look.set(0, 0, 0);
              break;
          case 'front': // Vue du Sud (Entrée) - Global Offset pris en compte (~ +150 pour l'entrée)
              pos.set(0, 30, 200);
              look.set(0, 0, 50);
              break;
          case 'side': // Vue de l'Est
              pos.set(200, 30, 0);
              look.set(0, 0, 0);
              break;
          case 'entry': // Vue Entrée rapprochée
              pos.set(30, 10, 200);
              look.set(0, 5, 160);
              break;
      }
      
      setCameraTarget({
          position: pos,
          lookAt: look,
          duration: 1200
      });
  }, []);

  // Gestion “drag” pour Apparence (évite snapshot multiple)
  const appearanceDragRef = useRef(false);

  // Chargement initial
  useEffect(() => {
    const saved = loadSavedData();
    if (saved && saved.length > 0) {
      console.log('📦 Layout chargé depuis la sauvegarde automatique', saved.length, 'éléments');
      setEquipmentListWithHistory(saved);
      equipmentListRef.current = saved;
    } else {
      console.log('⚙️ Pas de sauvegarde trouvée, génération du layout par défaut');
      const generated = generateMining100MWLayout();
      setEquipmentListWithHistory(generated);
      equipmentListRef.current = generated;
    }
  }, []); // Chargement initial uniquement
  
  // Validation
  const validation = useMemo(() => {
    return validateLayout(equipmentList);
  }, [equipmentList]);

  // --- GESTION SELECTION ---

  const handleSelectEquipment = useCallback((id: string, multiSelect: boolean = false) => {
    // Si on est en mode placement, on ignore la sélection
    if (placementMode) return;

    setSelectedObjectIds((prev) => {
      // Logique existante
      let newSelection: string[] = [];
      if (multiSelect) {
        if (prev.includes(id)) newSelection = prev.filter(pid => pid !== id);
        else newSelection = [...prev, id];
      } else {
        if (prev.length === 1 && prev[0] === id) newSelection = [];
        else newSelection = [id];
      }

      // AUTO-FOCUS si sélection unique activée
      // On le fait dans le callback pour avoir l'état le plus frais, mais attention aux effets de bord.
      // Mieux vaut déclencher le focus directement ici si c'est une nouvelle sélection unique.
      if (!multiSelect && newSelection.length === 1 && newSelection[0] === id) {
         // Petit délai pour laisser le temps au state de se propager ou juste effet visuel
         // Mais ici on est dans le setState callback, on ne peut pas appeler focusOnObject directement sans risk.
         // On le fait après le set.
      }
      return newSelection;
    });
    
    // IMPORTANT: on NE focus/zoom plus automatiquement au clic.
    // Le focus doit être déclenché explicitement via le bouton "Focus" de la toolbar.
    
    setIsToolbarActive(false); 
    setShowDetailsPanel(false);
    setTransformMode(null);
  }, [placementMode]);

  const handleDoubleClickEquipment = useCallback((id: string) => {
    if (placementMode) return;
    setSelectedObjectIds([id]);
    setIsToolbarActive(true);
    setTransformMode('translate');
  }, [placementMode]);

  const handleClearSelection = useCallback(() => {
    // Si on est en mode placement, Echap annule le placement
    if (placementMode) {
      handleCancelPlacement();
      return;
    }
    setSelectedObjectIds([]);
    setIsToolbarActive(false);
    setShowDetailsPanel(false);
    setShowLibrary(false);
  }, [placementMode]);

  // --- GESTION PLACEMENT ---

  const handlePlaceElement = useCallback((model: UnifiedModel) => {
    // 1. Activer le mode placement fantôme
    setPlacementModel(model);
    setPlacementMode(true);
    
    // 2. Fermer les UI
    setShowLibrary(false);
    setShowPlacementPanel(false);
    handleClearSelection();
  }, [handleClearSelection]);

  const handleConfirmPlacement = useCallback((position: [number, number, number]) => {
    if (!placementModel) return;

    const newEquipment: EquipmentPosition = {
      id: `${placementModel.type}-${Date.now()}`,
      type: placementModel.type === 'ground-patch' ? 'ground-patch' : (placementModel.type as any),
      position: position,
      rotation: [0, 0, 0],
      dimensions: placementModel.dimensions,
      metadata: {
        power: placementModel.power,
        color: placementModel.defaultProps?.color,
        type: placementModel.defaultProps?.type
      },
    };
    
    const baseList = equipmentListRef.current;
    const newList = [...baseList, newEquipment];
    setEquipmentListWithHistory(newList);
    equipmentListRef.current = newList;
    forceSave(newList);
    
    // Rester en mode placement ? Non, on termine pour l'instant.
    // Pour placer en série, on pourrait ne pas reset.
    setPlacementMode(false);
    setPlacementModel(null);
    
    // Sélectionner le nouvel objet pour édition immédiate
    setSelectedObjectIds([newEquipment.id]);
    setIsToolbarActive(true);
    setTransformMode('translate');
  }, [placementModel, setEquipmentListWithHistory, forceSave]);

  const handleCancelPlacement = useCallback(() => {
    setPlacementMode(false);
    setPlacementModel(null);
  }, []);

  // --- TRANSFORMATION ---
  const transformBaselineRef = useRef<{
    id: string;
    type: EquipmentPosition['type'];
    startPos: THREE.Vector3;
    startYaw: number;
  } | null>(null);

  const lastMoveRef = useRef<{
    sourceId: string;
    type: EquipmentPosition['type'];
    localDelta: THREE.Vector3; // delta exprimé dans le repère local de l'objet source
  } | null>(null);

  // Token pour forcer le re-render et afficher le bouton "appliquer"
  const [lastMoveToken, setLastMoveToken] = useState(0);

  const handleTransformStart = useCallback(() => {
    snapshotHistory();
    // Capture le point de départ de l'objet sélectionné (pour calculer un delta)
    const id = selectedObjectIdsRef.current.length > 0 ? selectedObjectIdsRef.current[selectedObjectIdsRef.current.length - 1] : null;
    if (!id) return;
    const eq = equipmentListRef.current.find((e) => e.id === id);
    if (!eq) return;
    transformBaselineRef.current = {
      id,
      type: eq.type,
      startPos: new THREE.Vector3(eq.position[0], eq.position[1], eq.position[2]),
      startYaw: eq.rotation?.[1] ?? 0,
    };
    lastMoveRef.current = null;
  }, [snapshotHistory]);

  const handleTransform = useCallback((id: string, position: [number, number, number], rotation: [number, number, number], scale?: [number, number, number]) => {
    // Protection contre scale undefined
    const safeScale = scale || [1, 1, 1];

    const next = equipmentListRef.current.map((eq) => {
      if (eq.id === id) {
        let newDimensions = eq.dimensions;
        if (
          eq.dimensions &&
          (Math.abs(safeScale[0] - 1) > 0.001 ||
            Math.abs(safeScale[1] - 1) > 0.001 ||
            Math.abs(safeScale[2] - 1) > 0.001)
        ) {
          newDimensions = {
            width: eq.dimensions.width * safeScale[0],
            height: eq.dimensions.height * safeScale[1],
            length: eq.dimensions.length * safeScale[2],
          };
        }
        return { ...eq, position, rotation, dimensions: newDimensions };
      }
      return eq;
    });
    setEquipmentListOnly(next);
    equipmentListRef.current = next;

    // Capturer le delta de déplacement en repère local (pour application globale)
    if (transformMode === 'translate' && transformBaselineRef.current?.id === id) {
      const base = transformBaselineRef.current;
      const worldDelta = new THREE.Vector3(position[0], position[1], position[2]).sub(base.startPos);
      // Convertir en local (inverse yaw source)
      const localDelta = worldDelta.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -base.startYaw);
      if (localDelta.length() > 0.0005) {
        lastMoveRef.current = {
          sourceId: id,
          type: base.type,
          localDelta,
        };
      }
    }
  }, [setEquipmentListOnly, transformMode]);

  const handleTransformEnd = useCallback(() => {
    // IMPORTANT: sauver la version la plus récente (évite les retours en arrière)
    forceSave(equipmentListRef.current);
    // Déclencher l'affichage du bouton "appliquer le même déplacement"
    if (lastMoveRef.current && lastMoveRef.current.localDelta.length() > 0.01) {
      setLastMoveToken((t) => t + 1);
    }
  }, [forceSave]);

  const handleApplyLastMoveToSameType = useCallback(() => {
    const move = lastMoveRef.current;
    if (!move) return;

    // Snapshot pour undo en une seule étape
    snapshotHistory();

    const axisY = new THREE.Vector3(0, 1, 0);
    const current = equipmentListRef.current;

    const newList = current.map((eq) => {
      if (eq.type !== move.type) return eq;
      if (eq.id === move.sourceId) return eq; // déjà déplacé

      const yaw = eq.rotation?.[1] ?? 0;
      // Appliquer le même delta local, mais dans le repère de CHAQUE objet (rotation yaw)
      const deltaWorld = move.localDelta.clone().applyAxisAngle(axisY, yaw);
      return {
        ...eq,
        position: [
          eq.position[0] + deltaWorld.x,
          eq.position[1] + deltaWorld.y,
          eq.position[2] + deltaWorld.z,
        ],
      };
    });

    equipmentListRef.current = newList;
    setEquipmentListWithHistory(newList);
    forceSave(newList);
  }, [snapshotHistory, setEquipmentListWithHistory, forceSave]);

  // --- ACTIONS ---

  const handleDeleteEquipment = useCallback(() => {
    if (selectedObjectIds.length > 0) {
      const current = equipmentListRef.current;
      const newList = current.filter((eq) => !selectedObjectIds.includes(eq.id));
      setEquipmentListWithHistory(newList);
      equipmentListRef.current = newList;
      forceSave(newList);
      handleClearSelection(); // Important: vide selectedObjectIds pour ne pas garder des références mortes
    }
  }, [selectedObjectIds, setEquipmentListWithHistory, forceSave, handleClearSelection]);

  const handleDuplicateEquipment = useCallback(() => {
    if (selectedObjectIds.length > 0) {
      const newItems: EquipmentPosition[] = [];
      const current = equipmentListRef.current;
      selectedObjectIds.forEach(id => {
        const source = current.find(eq => eq.id === id);
        if (source) {
          const duplicated: EquipmentPosition = {
            ...source,
            id: `${source.id}-copy-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            position: [
              source.position[0] + 5,
              source.position[1],
              source.position[2] + 5,
            ],
          };
          newItems.push(duplicated);
        }
      });
      const newList = [...current, ...newItems];
      setEquipmentListWithHistory(newList);
      equipmentListRef.current = newList;
      forceSave(newList);
      setSelectedObjectIds(newItems.map(i => i.id));
    }
  }, [selectedObjectIds, setEquipmentListWithHistory, forceSave]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) { if (canRedo) redo(); } else { if (canUndo) undo(); }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (canRedo) redo();
        return;
      }

      // Escape (Placement ou Sélection)
      if (e.key === 'Escape') {
        if (placementMode) handleCancelPlacement();
        else handleClearSelection();
        return;
      }

      // Si mode placement actif, ignorer les autres raccourcis
      if (placementMode) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedObjectIds.length > 0) handleDeleteEquipment();
      } 
      else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedObjectIds.length > 0) handleDuplicateEquipment();
      } 
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectIds, placementMode, handleDeleteEquipment, handleDuplicateEquipment, undo, redo, canUndo, canRedo, handleClearSelection, handleCancelPlacement]);

  const primarySelectedId = selectedObjectIds.length > 0 ? selectedObjectIds[selectedObjectIds.length - 1] : null;
  const primarySelectedEquipment = useMemo(() => {
    if (!primarySelectedId) return null;
    return equipmentList.find((eq) => eq.id === primarySelectedId) || null;
  }, [equipmentList, primarySelectedId]);

  const canApplyTransformToSameType = useMemo(() => {
    // dépend de lastMoveToken pour se recalculer après un drag
    const move = lastMoveRef.current;
    if (!move) return false;
    if (!primarySelectedEquipment) return false;
    if (primarySelectedEquipment.type !== move.type) return false;
    return move.localDelta.length() > 0.01;
  }, [primarySelectedEquipment, lastMoveToken]);

  // --- APPARENCE (Couleur + Matière) ---
  const toolbarAppearance = useMemo(() => {
    const color = primarySelectedEquipment?.metadata?.color || '#1a1a1a';
    const material = primarySelectedEquipment?.metadata?.material || {};
    return { color, material };
  }, [primarySelectedEquipment]);

  const handleAppearanceStart = useCallback(() => {
    if (appearanceDragRef.current) return;
    appearanceDragRef.current = true;
    snapshotHistory();
  }, [snapshotHistory]);

  const handleAppearanceChange = useCallback((patch: { color?: string; material?: any }) => {
    if (!primarySelectedId) return;
    const next = equipmentListRef.current.map((eq) => {
      if (eq.id !== primarySelectedId) return eq;
      const prevMeta = eq.metadata || {};
      const nextMaterial = patch.material
        ? { ...(prevMeta.material || {}), ...patch.material }
        : prevMeta.material;
      return {
        ...eq,
        metadata: {
          ...prevMeta,
          ...(patch.color ? { color: patch.color } : {}),
          ...(patch.material ? { material: nextMaterial } : {}),
        },
      };
    });
    setEquipmentListOnly(next);
    equipmentListRef.current = next;
  }, [primarySelectedId, setEquipmentListOnly]);

  const handleAppearanceEnd = useCallback(() => {
    appearanceDragRef.current = false;
    forceSave(equipmentListRef.current);
  }, [forceSave]);

  const handleApplyAppearanceToSameType = useCallback(() => {
    if (!primarySelectedId) return;
    const current = equipmentListRef.current;
    const primary = current.find((eq) => eq.id === primarySelectedId);
    if (!primary) return;
    const primaryType = primary.type;
    const primaryMeta = primary.metadata || {};
    const color = primaryMeta.color;
    const material = primaryMeta.material;

    const newList = current.map((eq) => {
      if (eq.type !== primaryType) return eq;
      return {
        ...eq,
        metadata: {
          ...(eq.metadata || {}),
          ...(color ? { color } : {}),
          ...(material ? { material } : {}),
        },
      };
    });
    equipmentListRef.current = newList;
    setEquipmentListWithHistory(newList);
    forceSave(newList);
  }, [primarySelectedId, setEquipmentListWithHistory, forceSave]);

  // ---------------------------------------------------------
  // MARCHEPIEDS: inverser côté pour tous les containers "A" (_CA)
  // ---------------------------------------------------------
  const handleFlipStairsForContainerLineA = useCallback(() => {
    snapshotHistory();

    const axisY = new THREE.Vector3(0, 1, 0);
    const current = equipmentListRef.current;

    const containersA = current.filter((eq) => eq.type === 'container' && eq.id.endsWith('_CA'));
    if (containersA.length === 0) return;

    const stairs = current.filter((eq) => eq.type === 'metal-stairs-2-steps');
    if (stairs.length === 0) return;

    // Copie mutable
    const next = [...current];
    const usedStairs = new Set<string>();

    const findNearestStairsIndex = (container: EquipmentPosition) => {
      const cPos = new THREE.Vector3(container.position[0], container.position[1], container.position[2]);
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < next.length; i++) {
        const eq = next[i];
        if (eq.type !== 'metal-stairs-2-steps') continue;
        if (usedStairs.has(eq.id)) continue;

        const sPos = new THREE.Vector3(eq.position[0], eq.position[1], eq.position[2]);
        const d = cPos.distanceTo(sPos);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      // Seuil: si c'est trop loin, on considère qu'il n'y a pas de marchepied associé
      return bestDist <= 8 ? bestIdx : -1;
    };

    containersA.forEach((c) => {
      const idx = findNearestStairsIndex(c);
      if (idx < 0) return;

      const stair = next[idx];
      usedStairs.add(stair.id);

      const yaw = c.rotation?.[1] ?? 0;
      const cPos = new THREE.Vector3(c.position[0], c.position[1], c.position[2]);
      const sPos = new THREE.Vector3(stair.position[0], stair.position[1], stair.position[2]);

      // Delta en repère local container
      const local = sPos.clone().sub(cPos).applyAxisAngle(axisY, -yaw);
      // "Autre côté" => miroir gauche/droite (inversion sur l'axe Z local)
      local.z *= -1;
      const newWorld = local.applyAxisAngle(axisY, yaw).add(cPos);

      next[idx] = {
        ...stair,
        position: [newWorld.x, stair.position[1], newWorld.z],
      };
    });

    equipmentListRef.current = next;
    setEquipmentListWithHistory(next);
    forceSave(next);
  }, [snapshotHistory, setEquipmentListWithHistory, forceSave]);

  // ---------------------------------------------------------
  // MARCHEPIEDS: copier EXACTEMENT la pose (offset + yaw) du
  // container de référence vers tous les containers "_CA" (ligne A)
  // Référence préférée: PB2_TR5_CA (sinon container sélectionné si _CA)
  // ---------------------------------------------------------
  const handleApplyStairsPoseToAllLineA = useCallback(() => {
    snapshotHistory();

    const axisY = new THREE.Vector3(0, 1, 0);
    const current = equipmentListRef.current;

    const allContainersA = current.filter((eq) => eq.type === 'container' && eq.id.endsWith('_CA'));
    if (allContainersA.length === 0) return;

    // Choisir le container de référence
    const byId = current.find((eq) => eq.id === 'PB2_TR5_CA' && eq.type === 'container') || null;
    const selectedIsCA =
      primarySelectedEquipment?.type === 'container' && primarySelectedEquipment.id.endsWith('_CA')
        ? primarySelectedEquipment
        : null;
    const refContainer = byId || selectedIsCA;
    if (!refContainer) return;

    // Trouver le marchepied de référence le plus proche du container ref
    const refPos = new THREE.Vector3(refContainer.position[0], refContainer.position[1], refContainer.position[2]);
    let refStairs: EquipmentPosition | null = null;
    let refStairsIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < current.length; i++) {
      const eq = current[i];
      if (eq.type !== 'metal-stairs-2-steps') continue;
      const sPos = new THREE.Vector3(eq.position[0], eq.position[1], eq.position[2]);
      const d = refPos.distanceTo(sPos);
      if (d < bestDist) {
        bestDist = d;
        refStairs = eq;
        refStairsIdx = i;
      }
    }
    // seuil: si pas de marchepied proche, rien à appliquer
    if (!refStairs || bestDist > 10) return;

    const refYaw = refContainer.rotation?.[1] ?? 0;
    const stairsYaw = refStairs.rotation?.[1] ?? 0;
    const yawDelta = stairsYaw - refYaw;

    // Offset local du marchepied par rapport au container (repère container)
    const refStairsPos = new THREE.Vector3(refStairs.position[0], refStairs.position[1], refStairs.position[2]);
    const localOffset = refStairsPos.clone().sub(refPos).applyAxisAngle(axisY, -refYaw);

    // On va appliquer à tous les _CA
    const next = [...current];
    const used = new Set<string>();

    // Helper: trouver un marchepied déjà associé à ce container
    const findAssociatedStairsIndex = (container: EquipmentPosition) => {
      // 1) match par id "CONTAINERID_STAIRS" si on l'a déjà créé
      const directId = `${container.id}_STAIRS`;
      const directIdx = next.findIndex((e) => e.type === 'metal-stairs-2-steps' && e.id === directId);
      if (directIdx >= 0) return directIdx;

      // 2) sinon, marchepied le plus proche non utilisé
      const cPos = new THREE.Vector3(container.position[0], container.position[1], container.position[2]);
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < next.length; i++) {
        const eq = next[i];
        if (eq.type !== 'metal-stairs-2-steps') continue;
        if (used.has(eq.id)) continue;
        // éviter d'assigner le marchepied de référence ailleurs
        if (refStairs && eq.id === refStairs.id) continue;

        const sPos = new THREE.Vector3(eq.position[0], eq.position[1], eq.position[2]);
        const d = cPos.distanceTo(sPos);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return bestD <= 10 ? best : -1;
    };

    for (const c of allContainersA) {
      const cYaw = c.rotation?.[1] ?? 0;
      const cPos = new THREE.Vector3(c.position[0], c.position[1], c.position[2]);
      const targetPos = localOffset.clone().applyAxisAngle(axisY, cYaw).add(cPos);
      const targetYaw = cYaw + yawDelta;

      const idx = findAssociatedStairsIndex(c);
      if (idx >= 0) {
        const stair = next[idx];
        used.add(stair.id);
        next[idx] = {
          ...stair,
          position: [targetPos.x, stair.position[1], targetPos.z],
          rotation: [0, targetYaw, 0],
        };
      } else {
        // créer un nouveau marchepied
        const newId = `${c.id}_STAIRS`;
        next.push({
          id: newId,
          type: 'metal-stairs-2-steps',
          position: [targetPos.x, c.position[1], targetPos.z],
          rotation: [0, targetYaw, 0],
          dimensions: { length: 0.9, width: 1.6, height: 0.55 },
          metadata: { powerBlockId: c.metadata?.powerBlockId },
        });
        used.add(newId);
      }
    }

    // Conserver le marchepied de référence inchangé (s'il existe)
    if (refStairsIdx >= 0) {
      next[refStairsIdx] = refStairs;
    }

    equipmentListRef.current = next;
    setEquipmentListWithHistory(next);
    forceSave(next);
  }, [snapshotHistory, setEquipmentListWithHistory, forceSave, primarySelectedEquipment]);

  const handleSetSelectedPosition = useCallback(
    (pos: { x: number; y: number; z: number }) => {
      if (!primarySelectedId) return;
      snapshotHistory();
      const next = equipmentListRef.current.map((eq) => {
        if (eq.id !== primarySelectedId) return eq;
        return { ...eq, position: [pos.x, pos.y, pos.z] as [number, number, number] };
      });
      equipmentListRef.current = next;
      setEquipmentListWithHistory(next);
      forceSave(next);
    },
    [primarySelectedId, snapshotHistory, setEquipmentListWithHistory, forceSave]
  );

  const handleForceSaveNow = useCallback(() => {
    forceSave(equipmentListRef.current);
  }, [forceSave]);

  return (
    <>
      <Head>
        <title>Site Mining 100MW - Qatar | Hearst</title>
      </Head>

      <div className="relative w-full h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 overflow-hidden">
        {/* Labels GPS Overlay */}
        <GPSLabelsOverlay size={500} />

        {/* Scène 3D */}
        <div className="absolute inset-0">
          <Mining100MWScene
            equipment={equipmentList}
            selectedObjectIds={selectedObjectIds}
            onSelectEquipment={(id, multi) => handleSelectEquipment(id, multi)}
            onDoubleClickEquipment={handleDoubleClickEquipment}
            onClearSelection={handleClearSelection}
            onTransform={handleTransform}
            onTransformStart={handleTransformStart}
            onTransformEnd={handleTransformEnd}
            
            transformMode={isToolbarActive ? transformMode : null}
            transformSpace={transformSpace}
            transformSnap={transformSnap}
            groundSize={500}
            enableNavigation={!isToolbarActive} // Nav bloquée en mode édition mais active en placement
            
            // Camera Control
            cameraTarget={cameraTarget} // Injection de la cible caméra
            
            // Placement Props
            placementMode={placementMode}
            placementModel={placementModel}
            onPlaceConfirm={handleConfirmPlacement}
            onPlaceCancel={handleCancelPlacement}
          />
        </div>
        
        {/* Contrôles de Vue Prédéfinis */}
        <PresetViewControls onSetView={setPresetView} />

        {/* Panel de détails */}
        {showDetailsPanel && primarySelectedId && !placementMode && (
          <EquipmentDetailsPanel
            equipment={equipmentList.find((eq) => eq.id === primarySelectedId) || null}
            onClose={() => setShowDetailsPanel(false)}
            onDelete={handleDeleteEquipment}
            onDuplicate={handleDuplicateEquipment}
          />
        )}

        {/* Toolbar */}
        {!placementMode && (
          <HearstEditorToolbar
            selectedObjectId={primarySelectedId}
            selectedObjectType={primarySelectedEquipment?.type || null}
            mode={transformMode}
            space={transformSpace}
            snap={transformSnap}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onOpenLibrary={() => setShowLibrary(true)}
            onReset={() => { 
              // FORCE RESET RADICAL
              if (confirm('Êtes-vous sûr de vouloir réinitialiser tout le site ?')) {
                localStorage.clear(); 
                clearSave(); 
                window.location.reload(); 
              }
            }} 
            
            onModeChange={setTransformMode}
            onSpaceChange={setTransformSpace}
            onSnapChange={setTransformSnap}
            onDelete={handleDeleteEquipment}
            onDuplicate={handleDuplicateEquipment}
            onShowDetails={() => setShowDetailsPanel(true)}

            appearance={toolbarAppearance}
            onAppearanceStart={handleAppearanceStart}
            onAppearanceChange={handleAppearanceChange}
            onAppearanceEnd={handleAppearanceEnd}
            onApplyAppearanceToSameType={handleApplyAppearanceToSameType}
            onApplyTransformToSameType={canApplyTransformToSameType ? handleApplyLastMoveToSameType : undefined}
            onFlipStairsForContainerLineA={handleFlipStairsForContainerLineA}
            onApplyStairsPoseToLineA={handleApplyStairsPoseToAllLineA}
            onSetSelectedPosition={handleSetSelectedPosition}
            onForceSave={handleForceSaveNow}
            onFocusObject={() => primarySelectedId && focusOnObject(primarySelectedId)}
          />
        )}

        <HearstAssetLibrary 
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
          onPlaceElement={handlePlaceElement}
        />

        {/* Instructions Mode Placement */}
        {placementMode && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-black/80 backdrop-blur text-white px-6 py-3 rounded-full border border-[var(--hearst-green)] shadow-2xl flex flex-col items-center">
              <span className="font-bold text-[var(--hearst-green)] mb-1">MODE PLACEMENT</span>
              <span className="text-xs">
                Cliquez pour placer • Echap pour annuler • Molette = hauteur (Shift = 1m) • R/F = monter/descendre • G = sol
              </span>
            </div>
          </div>
        )}

        {/* Indicateurs sauvegarde... (inchangé) */}
        <div className="fixed top-4 left-4 z-50 pointer-events-none">
          {saveStatus.state === 'saving' && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur text-white rounded-full text-xs font-medium border border-gray-700 animate-pulse">
               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
               Sauvegarde en cours...
             </div>
          )}
          {saveStatus.state === 'saved' && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur text-[var(--hearst-green)] rounded-full text-xs font-medium border border-[var(--hearst-green)] animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="w-2 h-2 rounded-full bg-[var(--hearst-green)]"></div>
               Sauvegardé {saveStatus.lastSaved?.toLocaleTimeString()}
             </div>
          )}
          {saveStatus.state === 'error' && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/90 backdrop-blur text-white rounded-full text-xs font-medium border border-red-500">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               Erreur de sauvegarde
             </div>
          )}
        </div>
      </div>
    </>
  );
}


