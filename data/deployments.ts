/**
 * Structure de données et gestion des déploiements
 * Permet de gérer plusieurs configurations de sites/projets dans la vue 3D
 */

export type SoilType = 'neutral-sand' | 'sandy' | 'concrete' | 'gravel' | 'custom';
export type PowerType = '50MW' | '100MW' | '200MW' | '500MW' | 'custom';
export type EnergyType = 'solar' | 'wind' | 'mixed' | 'custom';

export interface DeploymentConfig {
  // Configuration du terrain
  ground: {
    type: SoilType;
    size: number;
    position: [number, number, number];
  };
  
  // Configuration de la caméra
  camera: {
    position: [number, number, number];
    fov: number;
  };
  
  // Nouvelles propriétés de projet
  powerType: PowerType;
  energyType: EnergyType;
  customPowerValue?: number; // Pour powerType 'custom'
  customEnergyDescription?: string; // Pour energyType 'custom'
  
  // Layout personnalisé (optionnel)
  layout?: {
    substation?: {
      position: [number, number, number];
      visible: boolean;
    };
    powerBlocks?: Array<{
      position: [number, number, number];
      visible: boolean;
    }>;
    // Autres éléments configurables
  };
  
  // Modules placés
  modules?: Array<{
    id: string;
    type: string;
    position: [number, number, number];
    rotation?: [number, number, number];
  }>;
  
  // Configuration de symétrie
  symmetry?: {
    enabled: boolean;
    type: 'axial' | 'central' | 'radial' | 'mirror';
    axis?: 'x' | 'y' | 'z' | 'custom';
    center?: [number, number, number];
  };
  
  // Métadonnées
  metadata?: {
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
}

import { DeploymentCondition } from '../utils/deploymentConditions';

export interface Deployment {
  id: string;
  name: string;
  config: DeploymentConfig;
  isDefault?: boolean;
  conditions?: DeploymentCondition[]; // Conditions de déploiement
}

const STORAGE_KEY = 'hearst_qatar_deployments';
const DEFAULT_DEPLOYMENT_ID = 'default';

/**
 * Récupère tous les déploiements depuis localStorage
 */
export function getDeployments(): Deployment[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erreur lors de la lecture des déploiements:', e);
  }
  
  return [];
}

/**
 * Sauvegarde les déploiements dans localStorage
 */
export function saveDeployments(deployments: Deployment[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deployments));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des déploiements:', e);
  }
}

/**
 * Crée un nouveau déploiement avec configuration par défaut
 */
export function createDefaultDeployment(name: string): Deployment {
  const now = new Date().toISOString();
  
  return {
    id: `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    isDefault: false,
    config: {
      ground: {
        type: 'neutral-sand',
        size: 1000,
        position: [0, 0, 0],
      },
      camera: {
        position: [0, 150, 200],
        fov: 50,
      },
      powerType: '200MW',
      energyType: 'mixed',
      metadata: {
        createdAt: now,
        updatedAt: now,
      },
    },
  };
}

/**
 * Crée un déploiement avec configuration personnalisée
 */
export function createCustomDeployment(
  name: string,
  soilType: SoilType,
  powerType: PowerType,
  energyType: EnergyType,
  customPowerValue?: number,
  customEnergyDescription?: string
): Deployment {
  const now = new Date().toISOString();
  
  // Calculer la taille du terrain selon la puissance
  const getGroundSize = (power: PowerType): number => {
    switch (power) {
      case '50MW': return 500;
      case '100MW': return 750;
      case '200MW': return 1000;
      case '500MW': return 1500;
      case 'custom': return customPowerValue ? Math.max(500, customPowerValue / 0.2) : 1000;
      default: return 1000;
    }
  };
  
  // Calculer la position de la caméra selon la taille
  const groundSize = getGroundSize(powerType);
  const cameraDistance = groundSize * 0.3;
  
  return {
    id: `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    isDefault: false,
    config: {
      ground: {
        type: soilType,
        size: groundSize,
        position: [0, 0, 0],
      },
      camera: {
        position: [0, groundSize * 0.15, cameraDistance],
        fov: 50,
      },
      powerType,
      energyType,
      customPowerValue,
      customEnergyDescription,
      modules: [],
      symmetry: {
        enabled: false,
        type: 'axial',
        axis: 'x',
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
      },
    },
  };
}

/**
 * Récupère un déploiement par son ID
 */
export function getDeploymentById(id: string): Deployment | null {
  const deployments = getDeployments();
  return deployments.find(d => d.id === id) || null;
}

/**
 * Ajoute un nouveau déploiement
 */
export function addDeployment(deployment: Deployment): void {
  const deployments = getDeployments();
  deployments.push(deployment);
  saveDeployments(deployments);
}

/**
 * Met à jour un déploiement existant
 */
export function updateDeployment(id: string, updates: Partial<Deployment>): boolean {
  const deployments = getDeployments();
  const index = deployments.findIndex(d => d.id === id);
  
  if (index === -1) {
    return false;
  }
  
  const existingMetadata = deployments[index].config.metadata || {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  deployments[index] = {
    ...deployments[index],
    ...updates,
    config: {
      ...deployments[index].config,
      ...(updates.config || {}),
      metadata: {
        ...existingMetadata,
        createdAt: existingMetadata.createdAt || new Date().toISOString(),
        ...(updates.config?.metadata || {}),
        updatedAt: new Date().toISOString(),
      },
    },
  };
  
  saveDeployments(deployments);
  return true;
}

/**
 * Supprime un déploiement
 */
export function deleteDeployment(id: string): boolean {
  const deployments = getDeployments();
  const filtered = deployments.filter(d => d.id !== id);
  
  if (filtered.length === deployments.length) {
    return false; // Déploiement non trouvé
  }
  
  saveDeployments(filtered);
  return true;
}

/**
 * Duplique un déploiement
 */
export function duplicateDeployment(id: string, newName: string): Deployment | null {
  const deployment = getDeploymentById(id);
  if (!deployment) {
    return null;
  }
  
  const duplicated: Deployment = {
    ...deployment,
    id: `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: newName,
    isDefault: false,
    config: {
      ...deployment.config,
      metadata: {
        ...deployment.config.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  };
  
  addDeployment(duplicated);
  return duplicated;
}

/**
 * Initialise le déploiement par défaut s'il n'existe pas
 */
export function initializeDefaultDeployment(): Deployment {
  const deployments = getDeployments();
  
  // Chercher un déploiement par défaut existant
  let defaultDeployment = deployments.find(d => d.isDefault || d.id === DEFAULT_DEPLOYMENT_ID);
  
  if (!defaultDeployment) {
    // Créer le déploiement par défaut
    defaultDeployment = {
      id: DEFAULT_DEPLOYMENT_ID,
      name: 'Déploiement Principal',
      isDefault: true,
      config: {
        ground: {
          type: 'neutral-sand',
          size: 1000,
          position: [0, 0, 0],
        },
        camera: {
          position: [0, 150, 200],
          fov: 50,
        },
        powerType: '200MW',
        energyType: 'mixed',
        modules: [],
        symmetry: {
          enabled: false,
          type: 'axial',
          axis: 'x',
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
    
    addDeployment(defaultDeployment);
  }
  
  return defaultDeployment;
}

