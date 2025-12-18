import { ProjectConfig } from '../components/NewProjectModal';
import { ModulePlacement } from './moduleDrawingHelpers';
import { Scene3DConfig } from '../config/3d.config';
import { 
  organizeByPhase, 
  calculatePhaseZones, 
  optimizeRoadNetwork, 
  minimizeRoadRedundancy,
  calculateOptimalSpacing 
} from './phasedLayoutOptimizer';
import { 
  validateContainerPlacement, 
  snapToGrid 
} from './containerLayoutValidator';
import { CONTAINER_LAYOUT_RULES } from './containerLayoutRules';

export interface LayoutElement {
  id: string;
  type: 'Container' | 'Transformateur' | 'Route' | 'Gazon' | 'PowerBlock' | 
        'VRD_Wall' | 'VRD_Road' | 'VRD_Parking' | 'VRD_Gate' | 'VRD_GuardHouse' | 'VRD_Light';
  x: number;
  y: number;
  z?: number;
  rotation: number;
  phase: number;
  length: number;
  width: number;
  height?: number;
  // Propriétés spécifiques VRD
  vrdConfig?: {
    center?: [number, number, number];
    depth?: number;
    thickness?: number;
    gatePosition?: 'front' | 'back' | 'left' | 'right';
    gateWidth?: number;
    rows?: number;
    spotsPerRow?: number;
    orientation?: 'horizontal' | 'vertical';
    material?: 'asphalt' | 'concrete';
    showCenterLine?: boolean;
    showEdgeLines?: boolean;
    text?: string;
    direction?: string;
  };
}

// Configuration basée sur le JSON mining_configurator_full_v2.json
export const LAYOUT_RULES = {
  // Espacements
  container_spacing_m: 3,           // Espacement entre containers
  row_spacing_m: 10,                // Espacement entre lignes
  road_width_m: 6,                  // Largeur des routes
  grass_strip_width_m: 6,           // Largeur des bandes de gazon
  
  // Dimensions des équipements (en mètres)
  container_dimensions: { 
    length: 12,                      // Longueur HD5
    width: 2.5                       // Largeur HD5
  },
  transformer_dimensions: { 
    length: 5,                       // Longueur TR_5MW
    width: 4                         // Largeur TR_5MW
  },
  powerblock_dimensions: { 
    length: 20,                      // Longueur PowerBlock (approximation)
    width: 10                        // Largeur PowerBlock (approximation)
  },
  
  // Règles d'organisation
  road_around_each_container: true,  // Route autour de chaque container
  road_around_each_row: true,        // Route autour de chaque ligne
  grass_between_rows: true,          // Gazon entre les lignes
  
  // Calculs de puissance
  container_power_mw: 1.6,           // Puissance par container HD5
  transformer_size_mw: 5,            // Puissance par transformateur
  powerblock_size_mw: 25,            // Puissance par PowerBlock
  no_powerblock_below_mw: 20,        // Pas de PowerBlock en dessous de 20 MW
  max_containers_per_transformer: 3, // Maximum 3 containers par transformateur
};

export function generateLayout3D(project: ProjectConfig): LayoutElement[] {
  const layout: LayoutElement[] = [];
  const powerTarget = project.power_target_mw;
  
  // Calculer les besoins totaux
  const numContainers = Math.ceil(powerTarget / LAYOUT_RULES.container_power_mw);
  const numTransformers = Math.ceil(powerTarget / LAYOUT_RULES.transformer_size_mw);
  const numPowerBlocks = powerTarget < LAYOUT_RULES.no_powerblock_below_mw 
    ? 0 
    : Math.ceil(powerTarget / LAYOUT_RULES.powerblock_size_mw);
  
  // Si pas de phasage, utiliser l'ancienne méthode simplifiée
  if (!project.phasing || project.phasing.length === 0) {
    return generateLayoutWithoutPhasing(project, numContainers, numTransformers, numPowerBlocks);
  }
  
  // === OPTIMISATION PAR PHASAGE ===
  
  // 1. Calculer les besoins par phase
  const phaseNeeds = calculatePhaseNeeds(project, numContainers, numTransformers);
  
  // 2. Générer les containers et transformateurs par phase
  const allContainers: LayoutElement[] = [];
  const allTransformers: LayoutElement[] = [];
  
  let globalContainerIdx = 0;
  let globalTransformerIdx = 0;
  
  for (const phaseNeed of phaseNeeds) {
    const phase = phaseNeed.phase;
    const spacing = calculateOptimalSpacing(phase, phaseNeeds.length);
    
    // Générer les containers de cette phase
    for (let i = 0; i < phaseNeed.containers; i++) {
      const container: LayoutElement = {
        id: `HD5-P${phase}-${i + 1}`,
        type: 'Container',
        x: 0, // Sera positionné plus tard
        y: 0,
        z: 0,
        rotation: 0,
        phase,
        length: LAYOUT_RULES.container_dimensions.length,
        width: LAYOUT_RULES.container_dimensions.width,
        height: 2.896,
      };
      allContainers.push(container);
      globalContainerIdx++;
    }
    
    // Générer les transformateurs de cette phase
    for (let i = 0; i < phaseNeed.transformers; i++) {
      const transformer: LayoutElement = {
        id: `TR-P${phase}-${i + 1}`,
        type: 'Transformateur',
        x: 0, // Sera positionné plus tard
        y: 0,
        z: 0,
        rotation: 0,
        phase,
        length: LAYOUT_RULES.transformer_dimensions.length,
        width: LAYOUT_RULES.transformer_dimensions.width,
        height: 5,
      };
      allTransformers.push(transformer);
      globalTransformerIdx++;
    }
  }
  
  // 3. Organiser par phase
  const phaseMap = organizeByPhase(allContainers, allTransformers, project);
  
  // 4. Calculer les zones optimales
  const zones = calculatePhaseZones(phaseMap, project);
  
  // 5. Placer les containers et transformateurs dans leurs zones respectives
  let currentX = CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.main_road_width;
  
  for (const zone of zones) {
    const spacing = calculateOptimalSpacing(zone.phase, zones.length);
    let currentY = zone.bounds.minY + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width;
    let containerIdx = 0;
    let transformerIdx = 0;
    
    const containersPerRow = LAYOUT_RULES.max_containers_per_transformer;
    const numRows = Math.ceil(zone.containers.length / containersPerRow);
    
    // Placer les containers de cette zone
    for (let row = 0; row < numRows; row++) {
      const rowStartY = currentY;
      const containersInRow = Math.min(containersPerRow, zone.containers.length - containerIdx);
      
      // Containers de la ligne
      for (let col = 0; col < containersInRow; col++) {
        const container = zone.containers[containerIdx];
        const snapped = snapToGrid(
          currentX + col * (LAYOUT_RULES.container_dimensions.length + spacing.containerSpacing),
          rowStartY
        );
        
        container.x = snapped.x;
        container.y = snapped.y;
        
        // Valider le placement
        const validation = validateContainerPlacement(container, layout);
        if (validation.valid) {
          layout.push(container);
        } else {
          console.warn(`Placement invalide pour ${container.id}:`, validation.errors);
          // Placer quand même mais avec warning
          layout.push(container);
        }
        
        containerIdx++;
      }
      
      // Transformateur de la ligne
      if (transformerIdx < zone.transformers.length) {
        const transformer = zone.transformers[transformerIdx];
        const snapped = snapToGrid(
          currentX + containersInRow * (LAYOUT_RULES.container_dimensions.length + spacing.containerSpacing) + spacing.containerSpacing,
          rowStartY
        );
        
        transformer.x = snapped.x;
        transformer.y = snapped.y;
        layout.push(transformer);
        transformerIdx++;
      }
      
      // Mise à jour Y pour la ligne suivante
      currentY += LAYOUT_RULES.container_dimensions.width + spacing.rowSpacing;
    }
    
    // Mise à jour X pour la zone suivante (si nécessaire)
    const zoneWidth = Math.max(
      ...zone.containers.map(c => c.x + c.length / 2),
      ...zone.transformers.map(t => t.x + t.length / 2)
    ) - zone.bounds.minX;
    currentX = zone.bounds.maxX + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.phase_separation;
  }
  
  // 6. Optimiser le réseau de routes
  const roadNetwork = optimizeRoadNetwork(zones, layout);
  
  // 7. Ajouter les routes optimisées
  const allRoads = [
    ...roadNetwork.mainRoads,
    ...roadNetwork.secondaryRoads,
    ...roadNetwork.accessRoads,
  ];
  
  // Réduire les redondances
  const optimizedRoads = minimizeRoadRedundancy(allRoads);
  layout.push(...optimizedRoads);
  
  // 8. Ajouter les PowerBlocks si nécessaire
  if (numPowerBlocks > 0) {
    const lastZone = zones[zones.length - 1];
    const powerBlockY = lastZone.bounds.maxY + 20;
    
    for (let i = 0; i < numPowerBlocks; i++) {
      const phase = project.phasing.length > 0 ? determinePhase(i, project) : 1;
      layout.push({
        id: `PB-${i + 1}`,
        type: 'PowerBlock',
        x: currentX + i * (LAYOUT_RULES.powerblock_dimensions.length + 20),
        y: powerBlockY,
        z: 0,
        rotation: 0,
        phase,
        length: LAYOUT_RULES.powerblock_dimensions.length,
        width: LAYOUT_RULES.powerblock_dimensions.width,
        height: 10,
      });
    }
  }
  
  return layout;
}

/**
 * Génère un layout sans phasage (méthode simplifiée pour compatibilité)
 */
function generateLayoutWithoutPhasing(
  project: ProjectConfig,
  numContainers: number,
  numTransformers: number,
  numPowerBlocks: number
): LayoutElement[] {
  const layout: LayoutElement[] = [];
  const containersPerRow = LAYOUT_RULES.max_containers_per_transformer;
  const numRows = Math.ceil(numContainers / containersPerRow);
  
  let currentX = LAYOUT_RULES.road_width_m;
  let currentY = LAYOUT_RULES.road_width_m;
  let containerIdx = 0;
  let transformerIdx = 0;
  
  for (let row = 0; row < numRows; row++) {
    const rowStartY = currentY;
    const containersInRow = Math.min(containersPerRow, numContainers - containerIdx);
    
    // Containers
    for (let col = 0; col < containersInRow; col++) {
      const snapped = snapToGrid(
        currentX + col * (LAYOUT_RULES.container_dimensions.length + LAYOUT_RULES.container_spacing_m),
        rowStartY
      );
      
      const container: LayoutElement = {
        id: `HD5-${containerIdx + 1}`,
        type: 'Container',
        x: snapped.x,
        y: snapped.y,
        z: 0,
        rotation: 0,
        phase: 1,
        length: LAYOUT_RULES.container_dimensions.length,
        width: LAYOUT_RULES.container_dimensions.width,
        height: 2.896,
      };
      
      const validation = validateContainerPlacement(container, layout);
      if (validation.valid) {
        layout.push(container);
      } else {
        console.warn(`Placement invalide:`, validation.errors);
        layout.push(container);
      }
      
      containerIdx++;
    }
    
    // Transformateur
    if (transformerIdx < numTransformers) {
      const snapped = snapToGrid(
        currentX + containersInRow * (LAYOUT_RULES.container_dimensions.length + LAYOUT_RULES.container_spacing_m) + LAYOUT_RULES.container_spacing_m,
        rowStartY
      );
      
      layout.push({
        id: `TR-${transformerIdx + 1}`,
        type: 'Transformateur',
        x: snapped.x,
        y: snapped.y,
        z: 0,
        rotation: 0,
        phase: 1,
        length: LAYOUT_RULES.transformer_dimensions.length,
        width: LAYOUT_RULES.transformer_dimensions.width,
        height: 5,
      });
      transformerIdx++;
    }
    
    // Routes secondaires autour de la ligne
    const rowWidth = containersInRow * (
      LAYOUT_RULES.container_dimensions.length + 
      LAYOUT_RULES.container_spacing_m
    ) - LAYOUT_RULES.container_spacing_m;
    
    const maxWidthInRow = Math.max(
      LAYOUT_RULES.container_dimensions.width,
      LAYOUT_RULES.transformer_dimensions.width
    );
    
    // Route supérieure
    layout.push({
      id: `ROAD-ROW-TOP-${row}`,
      type: 'Route',
      x: currentX - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      y: rowStartY - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      z: 0,
      rotation: 0,
      phase: 1,
      length: rowWidth + (transformerIdx > 0 ? LAYOUT_RULES.transformer_dimensions.length + LAYOUT_RULES.container_spacing_m : 0) + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width * 2,
      width: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      height: 0.2,
    });
    
    // Route inférieure
    layout.push({
      id: `ROAD-ROW-BOTTOM-${row}`,
      type: 'Route',
      x: currentX - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      y: rowStartY + maxWidthInRow,
      z: 0,
      rotation: 0,
      phase: 1,
      length: rowWidth + (transformerIdx > 0 ? LAYOUT_RULES.transformer_dimensions.length + LAYOUT_RULES.container_spacing_m : 0) + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width * 2,
      width: CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
      height: 0.2,
    });
    
    // Gazon entre lignes
    if (row < numRows - 1) {
      const grassY = rowStartY + maxWidthInRow + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width;
      layout.push({
        id: `GRASS-${row}`,
        type: 'Gazon',
        x: currentX - CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width,
        y: grassY,
        z: 0,
        rotation: 0,
        phase: 1,
        length: rowWidth + (transformerIdx > 0 ? LAYOUT_RULES.transformer_dimensions.length + LAYOUT_RULES.container_spacing_m : 0) + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width * 2,
        width: LAYOUT_RULES.grass_strip_width_m,
        height: 0,
      });
      currentY = grassY + LAYOUT_RULES.grass_strip_width_m + LAYOUT_RULES.row_spacing_m;
    } else {
      currentY += maxWidthInRow + LAYOUT_RULES.row_spacing_m + CONTAINER_LAYOUT_RULES.ROAD_OPTIMIZATION.secondary_road_width;
    }
  }
  
  // PowerBlocks
  if (numPowerBlocks > 0) {
    const powerBlockY = currentY + 20;
    for (let i = 0; i < numPowerBlocks; i++) {
      layout.push({
        id: `PB-${i + 1}`,
        type: 'PowerBlock',
        x: currentX + i * (LAYOUT_RULES.powerblock_dimensions.length + 20),
        y: powerBlockY,
        z: 0,
        rotation: 0,
        phase: 1,
        length: LAYOUT_RULES.powerblock_dimensions.length,
        width: LAYOUT_RULES.powerblock_dimensions.width,
        height: 10,
      });
    }
  }
  
  return layout;
}

/**
 * Calcule les besoins par phase
 */
function calculatePhaseNeeds(
  project: ProjectConfig,
  totalContainers: number,
  totalTransformers: number
): Array<{ phase: number; containers: number; transformers: number; power_mw: number }> {
  const needs: Array<{ phase: number; containers: number; transformers: number; power_mw: number }> = [];
  
  let cumulativePower = 0;
  
  for (const phaseConfig of project.phasing) {
    cumulativePower += phaseConfig.power_mw;
    const phaseRatio = phaseConfig.power_mw / project.power_target_mw;
    
    needs.push({
      phase: phaseConfig.phase,
      containers: Math.ceil(totalContainers * phaseRatio),
      transformers: Math.ceil(totalTransformers * phaseRatio),
      power_mw: phaseConfig.power_mw,
    });
  }
  
  return needs;
}

function determinePhase(index: number, project: ProjectConfig): number {
  if (project.phasing.length === 0) return 1;
  
  // Répartir les équipements selon les phases basées sur la puissance
  let cumulativePower = 0;
  let cumulativeCount = 0;
  const totalItems = project.power_target_mw / LAYOUT_RULES.container_power_mw; // Approximation
  
  for (let i = 0; i < project.phasing.length; i++) {
    cumulativePower += project.phasing[i].power_mw;
    const phaseThreshold = (cumulativePower / project.power_target_mw) * totalItems;
    
    if (index < phaseThreshold) {
      return project.phasing[i].phase;
    }
  }
  
  return project.phasing[project.phasing.length - 1].phase;
}
