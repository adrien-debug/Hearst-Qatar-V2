/**
 * Générateur de Configuration de Projet
 * Génère automatiquement les configurations complètes basées sur la puissance sélectionnée
 */

import projectTemplates from '../config/project-templates.json';

export interface EquipmentPosition {
  id: string;
  type: 'transformer' | 'container' | 'cooling' | 'switchgear' | 'substation' | 'road';
  modelId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  metadata?: {
    powerBlockId?: string;
    transformerId?: string;
    pairId?: string;
    isFoundation?: boolean;
    roadType?: string;
    width?: number;
    length?: number;
    orientation?: 'horizontal' | 'vertical';
  };
}

export interface VRDElement {
  id: string;
  type: 'wall' | 'gate' | 'guard_house' | 'barrier' | 'logo' | 'road' | 'hangar' | 'parking' | 'signage';
  position: [number, number, number];
  dimensions?: [number, number, number];
  rotation?: [number, number, number];
  config: any;
}

export interface SiteConditions {
  soilType: 'sandy' | 'concrete' | 'gravel' | 'rocky';
  climateType: 'desert' | 'temperate' | 'tropical' | 'cold';
  coolingType: 'air' | 'hydro' | 'immersion';
  hasConcreteSlabs: boolean;
  hasCirculation: boolean;
  hasMicroPerforatedWall: boolean;
}

export interface ProjectConfiguration {
  id: string;
  name: string;
  powerMW: number;
  moduleCount: number;
  conditions: SiteConditions;
  equipment: EquipmentPosition[];
  vrd: VRDElement[];
  groundSize: number;
  cameraPosition: [number, number, number];
  metadata: {
    transformersCount: number;
    containersCount: number;
    coolingCount: number;
    concreteSlabsCount: number;
    circulationPathsLength: number;
    createdAt: string;
    lastModified?: string;
  };
}

/**
 * Calcule le nombre de modules 25MW nécessaires
 */
export function calculateModules(powerMW: number): number {
  if (powerMW <= 5) return 0.2;
  return Math.ceil(powerMW / 25);
}

/**
 * Génère la configuration complète d'un projet
 */
export function generateProjectConfig(
  name: string,
  powerMW: number,
  conditions: SiteConditions
): ProjectConfiguration {
  const moduleCount = calculateModules(powerMW);
  const powerConfig = projectTemplates.power_configurations[powerMW.toString() as keyof typeof projectTemplates.power_configurations];
  
  if (!powerConfig) {
    throw new Error(`Configuration non disponible pour ${powerMW}MW`);
  }

  const equipment = generateEquipmentLayout(powerMW, moduleCount, conditions);
  const vrd = generateVRDLayout(powerConfig.groundSize, conditions);
  const cameraPosition = calculateCameraPosition(powerConfig.groundSize);
  
  // Calculer les dalles béton si activées
  const concreteSlabsCount = conditions.hasConcreteSlabs ? powerConfig.containers : 0;
  
  // Calculer la longueur des voies de circulation
  const circulationPathsLength = conditions.hasCirculation 
    ? calculateCirculationLength(powerConfig.containers, powerConfig.transformers)
    : 0;

  return {
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    powerMW,
    moduleCount,
    conditions,
    equipment,
    vrd,
    groundSize: powerConfig.groundSize,
    cameraPosition,
    metadata: {
      transformersCount: powerConfig.transformers,
      containersCount: powerConfig.containers,
      coolingCount: powerConfig.cooling,
      concreteSlabsCount,
      circulationPathsLength,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    },
  };
}

/**
 * Calcule la longueur totale des voies de circulation
 */
function calculateCirculationLength(containers: number, transformers: number): number {
  // 3m de circulation autour de chaque container + transformer
  const perimeter = (containers + transformers) * 4 * 3; // 4 côtés × 3m
  return Math.round(perimeter);
}

/**
 * Génère le layout complet des équipements
 */
export function generateEquipmentLayout(
  powerMW: number,
  moduleCount: number,
  conditions: SiteConditions
): EquipmentPosition[] {
  const positions: EquipmentPosition[] = [];
  const template = projectTemplates.module_25mw;
  const powerConfig = projectTemplates.power_configurations[powerMW.toString() as keyof typeof projectTemplates.power_configurations];

  if (!powerConfig) {
    throw new Error(`Configuration non disponible pour ${powerMW}MW`);
  }

  // Calcul du nombre de Power Blocks (max 4 pour 100MW, puis on étend)
  const powerBlockCount = Math.min(Math.ceil(moduleCount), 8);
  const modulesPerBlock = moduleCount / powerBlockCount;
  const transformersPerBlock = Math.ceil(powerConfig.transformers / powerBlockCount);

  console.log(`🔧 Génération ${powerMW}MW:`, {
    powerBlockCount,
    transformersPerBlock,
    totalTransformers: powerConfig.transformers,
    totalContainers: powerConfig.containers,
  });

  // Génération des Power Blocks
  for (let blockIndex = 0; blockIndex < powerBlockCount; blockIndex++) {
    const blockX = calculatePowerBlockX(blockIndex, powerBlockCount);
    const powerBlockId = `PB${blockIndex + 1}`;

    // Transformers pour ce Power Block
    for (let t = 0; t < transformersPerBlock; t++) {
      const transformerZ = template.layout.transformerStartZ - (t * template.equipment.transformers.spacing);
      const transformerId = `${powerBlockId}_TR${String(t + 1).padStart(2, '0')}`;

      // Transformer
      positions.push({
        id: transformerId,
        type: 'transformer',
        modelId: template.equipment.transformers.modelId,
        position: [blockX, 0.3, transformerZ],
        rotation: [0, 0, 0],
        metadata: {
          powerBlockId,
          transformerId,
        },
      });

      // 2 Containers (A et B) par transformer
      const containerOffset = template.equipment.containers.pairingOffset;
      
      // Dalles béton sous containers (40cm) si activées
      if (conditions.hasConcreteSlabs) {
        positions.push({
          id: `${transformerId}_SLAB_A`,
          type: 'container' as any,
          modelId: 'concrete-slab-40cm',
          position: [blockX - containerOffset, 0.2, transformerZ],
          rotation: [0, 0, 0],
          metadata: {
            powerBlockId,
            transformerId,
            pairId: 'A',
            isFoundation: true,
          },
        });

        positions.push({
          id: `${transformerId}_SLAB_B`,
          type: 'container' as any,
          modelId: 'concrete-slab-40cm',
          position: [blockX + containerOffset, 0.2, transformerZ],
          rotation: [0, 0, 0],
          metadata: {
            powerBlockId,
            transformerId,
            pairId: 'B',
            isFoundation: true,
          },
        });
      }

      // Containers (sur les dalles si activées)
      const containerHeight = conditions.hasConcreteSlabs ? 0.7 : 0.3;
      
      positions.push({
        id: `${transformerId}_HD5_A`,
        type: 'container',
        modelId: template.equipment.containers.modelId,
        position: [blockX - containerOffset, containerHeight, transformerZ],
        rotation: [0, 0, 0],
        metadata: {
          powerBlockId,
          transformerId,
          pairId: 'A',
        },
      });

      positions.push({
        id: `${transformerId}_HD5_B`,
        type: 'container',
        modelId: template.equipment.containers.modelId,
        position: [blockX + containerOffset, containerHeight, transformerZ],
        rotation: [0, 0, 0],
        metadata: {
          powerBlockId,
          transformerId,
          pairId: 'B',
        },
      });

      // 2 Switchgears (L et R) par transformer
      const switchgearOffset = template.equipment.switchgear.offset;
      
      positions.push({
        id: `${powerBlockId}_SG_${String(t + 1).padStart(2, '0')}_L`,
        type: 'switchgear',
        modelId: template.equipment.switchgear.modelId,
        position: [blockX - switchgearOffset, 0.3, transformerZ],
        rotation: [0, 0, 0],
        metadata: {
          powerBlockId,
          transformerId,
        },
      });

      positions.push({
        id: `${powerBlockId}_SG_${String(t + 1).padStart(2, '0')}_R`,
        type: 'switchgear',
        modelId: template.equipment.switchgear.modelId,
        position: [blockX + switchgearOffset, 0.3, transformerZ],
        rotation: [0, 0, 0],
        metadata: {
          powerBlockId,
          transformerId,
        },
      });
    }
  }

  // Substation centrale (200MW pour tous les projets)
  positions.push({
    id: 'Substation_Main',
    type: 'substation',
    modelId: 'substation-200mw',
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
  });

  console.log(`✅ Équipements générés: ${positions.length} total`);

  return positions;
}

/**
 * Calcule la position X d'un Power Block
 */
function calculatePowerBlockX(blockIndex: number, totalBlocks: number): number {
  const spacing = 50;
  const startX = -((totalBlocks - 1) * spacing) / 2;
  return startX + (blockIndex * spacing);
}

/**
 * Génère l'infrastructure VRD complète
 */
export function generateVRDLayout(groundSize: number, conditions: SiteConditions): VRDElement[] {
  const vrd: VRDElement[] = [];
  const vrdConfig = projectTemplates.vrd_infrastructure;

  // Mur d'enceinte (micro-perforé si activé)
  const wallWidth = groundSize * 0.9;
  const wallDepth = groundSize * 0.8;
  
  vrd.push({
    id: 'perimeter_wall',
    type: 'wall',
    position: [0, 0, -groundSize * 0.2],
    dimensions: [wallWidth, vrdConfig.perimeter_wall.height, wallDepth],
    config: {
      ...vrdConfig.perimeter_wall,
      microPerforated: conditions.hasMicroPerforatedWall,
      hasGrid: conditions.hasMicroPerforatedWall,
    },
  });

  // Portail d'entrée
  vrd.push({
    id: 'entrance_gate',
    type: 'gate',
    position: vrdConfig.entrance.gate.position as [number, number, number],
    dimensions: [vrdConfig.entrance.gate.width, vrdConfig.entrance.gate.height, 0.2],
    config: vrdConfig.entrance.gate,
  });

  // Poste de garde
  vrd.push({
    id: 'guard_house',
    type: 'guard_house',
    position: vrdConfig.entrance.guard_house.position as [number, number, number],
    dimensions: vrdConfig.entrance.guard_house.dimensions as [number, number, number],
    config: vrdConfig.entrance.guard_house,
  });

  // Barrières de sécurité
  vrdConfig.entrance.barriers.positions.forEach((pos, index) => {
    vrd.push({
      id: `security_barrier_${index + 1}`,
      type: 'barrier',
      position: pos as [number, number, number],
      dimensions: [0.5, 0.1, 3],
      config: vrdConfig.entrance.barriers,
    });
  });

  // Logo Hearst 3D
  vrd.push({
    id: 'hearst_logo',
    type: 'logo',
    position: vrdConfig.hearst_logo.position as [number, number, number],
    config: vrdConfig.hearst_logo,
  });

  // Routes
  const roadLayout = vrdConfig.roads.layout;
  
  // Route externe
  vrd.push({
    id: 'road_external',
    type: 'road',
    position: roadLayout.external.position as [number, number, number],
    dimensions: [vrdConfig.roads.main_road.width, 0.1, roadLayout.external.length],
    config: {
      ...vrdConfig.roads.main_road,
      orientation: roadLayout.external.orientation,
    },
  });

  // Route interne
  vrd.push({
    id: 'road_internal',
    type: 'road',
    position: roadLayout.internal.position as [number, number, number],
    dimensions: [vrdConfig.roads.internal_roads.width, 0.1, roadLayout.internal.length],
    config: {
      ...vrdConfig.roads.internal_roads,
      orientation: roadLayout.internal.orientation,
    },
  });

  // Route d'accès parking
  vrd.push({
    id: 'road_parking_access',
    type: 'road',
    position: roadLayout.parking_access.position as [number, number, number],
    dimensions: [roadLayout.parking_access.length, 0.1, vrdConfig.roads.internal_roads.width],
    config: {
      ...vrdConfig.roads.internal_roads,
      orientation: roadLayout.parking_access.orientation,
    },
  });

  // Hangar de maintenance
  vrd.push({
    id: 'maintenance_hangar',
    type: 'hangar',
    position: vrdConfig.maintenance_hangar.position as [number, number, number],
    dimensions: vrdConfig.maintenance_hangar.dimensions as [number, number, number],
    config: vrdConfig.maintenance_hangar,
  });

  // Parking
  vrd.push({
    id: 'parking_area',
    type: 'parking',
    position: vrdConfig.parking.position as [number, number, number],
    dimensions: [vrdConfig.parking.dimensions[0], 0.1, vrdConfig.parking.dimensions[1]],
    config: vrdConfig.parking,
  });

  // Signalétique
  vrdConfig.signage.forEach((sign, index) => {
    vrd.push({
      id: `signage_${index + 1}`,
      type: 'signage',
      position: sign.position as [number, number, number],
      config: sign,
    });
  });

  return vrd;
}

/**
 * Calcule la position optimale de la caméra
 */
export function calculateCameraPosition(groundSize: number): [number, number, number] {
  const distance = groundSize * 0.3;
  const height = groundSize * 0.15;
  return [0, height, distance];
}

/**
 * Calcule les positions pour un équipement spécifique
 */
export function calculatePositions(
  equipment: string,
  moduleCount: number
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const template = projectTemplates.module_25mw;

  // Logique de calcul selon le type d'équipement
  // Cette fonction peut être étendue pour des calculs plus complexes

  return positions;
}

/**
 * Valide une configuration de projet
 */
export function validateProjectConfig(config: ProjectConfiguration): boolean {
  if (!config.name || config.name.trim().length === 0) {
    throw new Error('Le nom du projet est requis');
  }

  if (config.powerMW < 5 || config.powerMW > 200) {
    throw new Error('La puissance doit être entre 5MW et 200MW');
  }

  if (config.equipment.length === 0) {
    throw new Error('Aucun équipement généré');
  }

  return true;
}

/**
 * Exporte la configuration en JSON
 */
export function exportProjectConfig(config: ProjectConfiguration): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Importe une configuration depuis JSON
 */
export function importProjectConfig(json: string): ProjectConfiguration {
  try {
    const config = JSON.parse(json);
    validateProjectConfig(config);
    return config;
  } catch (error) {
    throw new Error(`Erreur lors de l'import: ${error}`);
  }
}
