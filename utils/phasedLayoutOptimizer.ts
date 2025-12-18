import { ProjectConfig } from '../components/NewProjectModal';
import { LayoutElement } from './layoutGenerator';
import { CONTAINER_LAYOUT_RULES } from './containerLayoutRules';
import { LAYOUT_RULES } from './layoutGenerator';

export interface PhaseZone {
  phase: number;
  power_mw: number;
  containers: LayoutElement[];
  transformers: LayoutElement[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export interface OptimizedLayout {
  zones: PhaseZone[];
  mainRoads: LayoutElement[];
  secondaryRoads: LayoutElement[];
  accessRoads: LayoutElement[];
}

/**
 * Organise les containers par phase
 */
export function organizeByPhase(
  containers: LayoutElement[],
  transformers: LayoutElement[],
  project: ProjectConfig
): Map<number, { containers: LayoutElement[]; transformers: LayoutElement[] }> {
  const phaseMap = new Map<number, { containers: LayoutElement[]; transformers: LayoutElement[] }>();

  // Grouper par phase
  for (const container of containers) {
    const phase = container.phase || 1;
    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, { containers: [], transformers: [] });
    }
    phaseMap.get(phase)!.containers.push(container);
  }

  for (const transformer of transformers) {
    const phase = transformer.phase || 1;
    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, { containers: [], transformers: [] });
    }
    phaseMap.get(phase)!.transformers.push(transformer);
  }

  return phaseMap;
}

/**
 * Calcule les zones optimales pour chaque phase
 */
export function calculatePhaseZones(
  phaseMap: Map<number, { containers: LayoutElement[]; transformers: LayoutElement[] }>,
  project: ProjectConfig
): PhaseZone[] {
  const zones: PhaseZone[] = [];
  const sortedPhases = Array.from(phaseMap.keys()).sort((a, b) => a - b);

  let currentY = CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width;
  let currentX = CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width;

  for (const phaseNum of sortedPhases) {
    const phaseData = phaseMap.get(phaseNum)!;
    const phaseConfig = project.phasing.find(p => p.phase === phaseNum);

    // Calculer les dimensions nécessaires pour cette phase
    const containersPerRow = LAYOUT_RULES.max_containers_per_transformer;
    const numRows = Math.ceil(phaseData.containers.length / containersPerRow);
    
    const rowWidth = containersPerRow * (
      LAYOUT_RULES.container_dimensions.length + 
      LAYOUT_RULES.container_spacing_m
    ) - LAYOUT_RULES.container_spacing_m;
    
    const zoneHeight = numRows * (
      LAYOUT_RULES.container_dimensions.width + 
      LAYOUT_RULES.row_spacing_m
    ) + (phaseData.transformers.length > 0 ? LAYOUT_RULES.transformer_dimensions.width : 0);

    // Calculer les limites de la zone
    const bounds = {
      minX: currentX - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      maxX: currentX + rowWidth + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      minY: currentY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      maxY: currentY + zoneHeight + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
    };

    zones.push({
      phase: phaseNum,
      power_mw: phaseConfig?.power_mw || 0,
      containers: phaseData.containers,
      transformers: phaseData.transformers,
      bounds,
    });

    // Mettre à jour la position pour la phase suivante
    currentY = bounds.maxY + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.phase_separation;
  }

  return zones;
}

/**
 * Optimise le réseau de routes entre phases
 */
export function optimizeRoadNetwork(
  zones: PhaseZone[],
  layout: LayoutElement[]
): {
  mainRoads: LayoutElement[];
  secondaryRoads: LayoutElement[];
  accessRoads: LayoutElement[];
} {
  const mainRoads: LayoutElement[] = [];
  const secondaryRoads: LayoutElement[] = [];
  const accessRoads: LayoutElement[] = [];

  if (zones.length === 0) return { mainRoads, secondaryRoads, accessRoads };

  // Route principale d'entrée (en haut)
  const firstZone = zones[0];
  const lastZone = zones[zones.length - 1];
  const totalWidth = Math.max(
    ...zones.map(z => z.bounds.maxX - z.bounds.minX)
  ) + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width * 2;

  // Route principale horizontale en haut
  mainRoads.push({
    id: 'MAIN-ROAD-ENTRY',
    type: 'Route',
    x: firstZone.bounds.minX,
    y: firstZone.bounds.minY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width,
    z: 0,
    rotation: 0,
    phase: 1,
    length: totalWidth,
    width: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width,
    height: 0.2,
  });

  // Routes principales entre phases
  for (let i = 0; i < zones.length - 1; i++) {
    const currentZone = zones[i];
    const nextZone = zones[i + 1];
    
    const roadY = currentZone.bounds.maxY + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.phase_separation / 2;
    const roadWidth = Math.max(
      currentZone.bounds.maxX - currentZone.bounds.minX,
      nextZone.bounds.maxX - nextZone.bounds.minX
    );

    mainRoads.push({
      id: `MAIN-ROAD-PHASE-${currentZone.phase}-${nextZone.phase}`,
      type: 'Route',
      x: Math.min(currentZone.bounds.minX, nextZone.bounds.minX),
      y: roadY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width / 2,
      z: 0,
      rotation: 0,
      phase: nextZone.phase,
      length: roadWidth,
      width: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width,
      height: 0.2,
    });
  }

  // Routes secondaires dans chaque zone
  for (const zone of zones) {
    // Route secondaire en haut de la zone
    secondaryRoads.push({
      id: `SECONDARY-ROAD-TOP-PHASE-${zone.phase}`,
      type: 'Route',
      x: zone.bounds.minX,
      y: zone.bounds.minY,
      z: 0,
      rotation: 0,
      phase: zone.phase,
      length: zone.bounds.maxX - zone.bounds.minX,
      width: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      height: 0.2,
    });

    // Route secondaire en bas de la zone
    secondaryRoads.push({
      id: `SECONDARY-ROAD-BOTTOM-PHASE-${zone.phase}`,
      type: 'Route',
      x: zone.bounds.minX,
      y: zone.bounds.maxY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      z: 0,
      rotation: 0,
      phase: zone.phase,
      length: zone.bounds.maxX - zone.bounds.minX,
      width: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      height: 0.2,
    });

    // Route secondaire à gauche
    secondaryRoads.push({
      id: `SECONDARY-ROAD-LEFT-PHASE-${zone.phase}`,
      type: 'Route',
      x: zone.bounds.minX,
      y: zone.bounds.minY + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      z: 0,
      rotation: 0,
      phase: zone.phase,
      length: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      width: zone.bounds.maxY - zone.bounds.minY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width * 2,
      height: 0.2,
    });

    // Route secondaire à droite
    secondaryRoads.push({
      id: `SECONDARY-ROAD-RIGHT-PHASE-${zone.phase}`,
      type: 'Route',
      x: zone.bounds.maxX - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      y: zone.bounds.minY + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      z: 0,
      rotation: 0,
      phase: zone.phase,
      length: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      width: zone.bounds.maxY - zone.bounds.minY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width * 2,
      height: 0.2,
    });
  }

  return { mainRoads, secondaryRoads, accessRoads };
}

/**
 * Réduit les routes redondantes
 */
export function minimizeRoadRedundancy(
  roads: LayoutElement[]
): LayoutElement[] {
  if (!CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.minimize_redundancy) {
    return roads;
  }

  const optimized: LayoutElement[] = [];
  const processed = new Set<string>();

  for (const road of roads) {
    const key = `${road.x.toFixed(1)}-${road.y.toFixed(1)}-${road.length.toFixed(1)}-${road.width.toFixed(1)}`;
    
    if (!processed.has(key)) {
      // Vérifier si cette route chevauche avec une route existante
      let isRedundant = false;
      for (const existing of optimized) {
        if (roadsOverlap(road, existing)) {
          // Fusionner les routes si possible
          const merged = mergeRoads(road, existing);
          if (merged) {
            const existingIndex = optimized.findIndex(r => r.id === existing.id);
            if (existingIndex >= 0) {
              optimized[existingIndex] = merged;
            }
            isRedundant = true;
            break;
          }
        }
      }

      if (!isRedundant) {
        optimized.push(road);
        processed.add(key);
      }
    }
  }

  return optimized;
}

/**
 * Vérifie si deux routes se chevauchent
 */
function roadsOverlap(road1: LayoutElement, road2: LayoutElement): boolean {
  const bounds1 = {
    minX: road1.x - road1.length / 2,
    maxX: road1.x + road1.length / 2,
    minY: road1.y - road1.width / 2,
    maxY: road1.y + road1.width / 2,
  };

  const bounds2 = {
    minX: road2.x - road2.length / 2,
    maxX: road2.x + road2.length / 2,
    minY: road2.y - road2.width / 2,
    maxY: road2.y + road2.width / 2,
  };

  return !(
    bounds1.maxX < bounds2.minX ||
    bounds1.minX > bounds2.maxX ||
    bounds1.maxY < bounds2.minY ||
    bounds1.minY > bounds2.maxY
  );
}

/**
 * Fusionne deux routes si possible
 */
function mergeRoads(road1: LayoutElement, road2: LayoutElement): LayoutElement | null {
  // Fusionner seulement si même orientation et largeur
  const sameWidth = Math.abs(road1.width - road2.width) < 0.1;
  if (!sameWidth) return null;

  // Déterminer l'orientation (horizontal ou vertical)
  const road1Horizontal = road1.length > road1.width;
  const road2Horizontal = road2.length > road2.width;

  if (road1Horizontal !== road2Horizontal) return null;

  if (road1Horizontal) {
    // Routes horizontales : fusionner en étendant la longueur
    const minX = Math.min(road1.x - road1.length / 2, road2.x - road2.length / 2);
    const maxX = Math.max(road1.x + road1.length / 2, road2.x + road2.length / 2);
    const newLength = maxX - minX;
    const newX = (minX + maxX) / 2;
    const newY = Math.abs(road1.y - road2.y) < 0.1 ? road1.y : (road1.y + road2.y) / 2;

    return {
      ...road1,
      id: `MERGED-${road1.id}-${road2.id}`,
      x: newX,
      y: newY,
      length: newLength,
    };
  } else {
    // Routes verticales : fusionner en étendant la largeur
    const minY = Math.min(road1.y - road1.width / 2, road2.y - road2.width / 2);
    const maxY = Math.max(road1.y + road1.width / 2, road2.y + road2.width / 2);
    const newWidth = maxY - minY;
    const newY = (minY + maxY) / 2;
    const newX = Math.abs(road1.x - road2.x) < 0.1 ? road1.x : (road1.x + road2.x) / 2;

    return {
      ...road1,
      id: `MERGED-${road1.id}-${road2.id}`,
      x: newX,
      y: newY,
      width: newWidth,
    };
  }
}

/**
 * Calcule les espacements optimaux par phase
 */
export function calculateOptimalSpacing(
  phase: number,
  totalPhases: number
): {
  containerSpacing: number;
  rowSpacing: number;
  phaseSeparation: number;
} {
  // Plus d'espace pour les phases futures
  const futurePhaseMultiplier = 1 + (totalPhases - phase) * 0.1;

  return {
    containerSpacing: LAYOUT_RULES.container_spacing_m * futurePhaseMultiplier,
    rowSpacing: LAYOUT_RULES.row_spacing_m * futurePhaseMultiplier,
    phaseSeparation: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.phase_separation * futurePhaseMultiplier,
  };
}
















