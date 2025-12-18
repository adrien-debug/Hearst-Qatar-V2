/**
 * Options disponibles pour le wizard de création de projet
 */

import { PowerOption, EnergySource, TerrainType, ClimateType, PowerConfig, EnergyConfig, TerrainConfig } from '../types/project-wizard';

/**
 * PUISSANCE - Options disponibles
 */
export const POWER_OPTIONS: Record<PowerOption, PowerConfig> = {
  5: {
    powerMW: 5,
    containers: 2,
    transformers: 1,
    hashratePH: 51,
    dailyBTC: 0.12,
  },
  10: {
    powerMW: 10,
    containers: 4,
    transformers: 2,
    hashratePH: 102,
    dailyBTC: 0.24,
  },
  25: {
    powerMW: 25,
    containers: 12,
    transformers: 6,
    hashratePH: 255,
    dailyBTC: 0.61,
  },
  50: {
    powerMW: 50,
    containers: 24,
    transformers: 12,
    hashratePH: 510,
    dailyBTC: 1.22,
  },
  75: {
    powerMW: 75,
    containers: 36,
    transformers: 18,
    hashratePH: 765,
    dailyBTC: 1.84,
  },
  100: {
    powerMW: 100,
    containers: 48,
    transformers: 24,
    hashratePH: 1020,
    dailyBTC: 2.45,
  },
};

/**
 * SOURCES D'ÉNERGIE - Options disponibles
 */
export const ENERGY_SOURCES: Record<EnergySource, EnergyConfig> = {
  grid: {
    source: 'grid',
    costPerKWh: 0.05,
    availability: 99.9,
    renewable: false,
  },
  solar: {
    source: 'solar',
    costPerKWh: 0.03,
    availability: 85,
    renewable: true,
  },
  'off-grid': {
    source: 'off-grid',
    costPerKWh: 0.08,
    availability: 95,
    renewable: false,
  },
  hybrid: {
    source: 'hybrid',
    costPerKWh: 0.04,
    availability: 98,
    renewable: true,
  },
  biogas: {
    source: 'biogas',
    costPerKWh: 0.06,
    availability: 90,
    renewable: true,
  },
  wind: {
    source: 'wind',
    costPerKWh: 0.04,
    availability: 80,
    renewable: true,
  },
  'flare-gas': {
    source: 'flare-gas',
    costPerKWh: 0.02,
    availability: 95,
    renewable: false,
  },
};

/**
 * TYPES DE TERRAIN - Options disponibles
 */
export const TERRAIN_TYPES: Record<TerrainType, TerrainConfig> = {
  sandy: {
    type: 'sandy',
    foundationRequired: true,
    drainageRequired: false,
    preparationCost: 50000,
  },
  gravel: {
    type: 'gravel',
    foundationRequired: false,
    drainageRequired: true,
    preparationCost: 30000,
  },
  concrete: {
    type: 'concrete',
    foundationRequired: false,
    drainageRequired: false,
    preparationCost: 100000,
  },
  rocky: {
    type: 'rocky',
    foundationRequired: true,
    drainageRequired: true,
    preparationCost: 80000,
  },
  mixed: {
    type: 'mixed',
    foundationRequired: true,
    drainageRequired: true,
    preparationCost: 60000,
  },
};

/**
 * LABELS ET DESCRIPTIONS
 */
export const ENERGY_SOURCE_LABELS: Record<EnergySource, { label: string; description: string; icon: string }> = {
  grid: {
    label: 'Grid (Réseau)',
    description: 'Connexion au réseau électrique national',
    icon: 'plug',
  },
  solar: {
    label: 'Solar (Solaire)',
    description: 'Panneaux solaires photovoltaïques',
    icon: 'sun',
  },
  'off-grid': {
    label: 'Off-Grid (Autonome)',
    description: 'Système autonome avec générateurs',
    icon: 'battery',
  },
  hybrid: {
    label: 'Hybrid (Hybride)',
    description: 'Combinaison Solar + Grid',
    icon: 'hybrid',
  },
  biogas: {
    label: 'Biogas (Biogaz)',
    description: 'Énergie à partir de biogaz',
    icon: 'leaf',
  },
  wind: {
    label: 'Wind (Éolien)',
    description: 'Éoliennes pour production électrique',
    icon: 'wind',
  },
  'flare-gas': {
    label: 'Flare Gas (Gaz de torchère)',
    description: 'Valorisation du gaz de torchère',
    icon: 'flame',
  },
};

export const TERRAIN_TYPE_LABELS: Record<TerrainType, { label: string; description: string }> = {
  sandy: {
    label: 'Sandy (Sable)',
    description: 'Terrain sablonneux - Standard Qatar',
  },
  gravel: {
    label: 'Gravel (Gravier)',
    description: 'Terrain graveleux - Drainage naturel',
  },
  concrete: {
    label: 'Concrete (Béton)',
    description: 'Dalle béton - Prêt à l\'emploi',
  },
  rocky: {
    label: 'Rocky (Rocheux)',
    description: 'Terrain rocheux - Fondations complexes',
  },
  mixed: {
    label: 'Mixed (Mixte)',
    description: 'Terrain mixte - Préparation variable',
  },
};

export const CLIMATE_TYPE_LABELS: Record<ClimateType, { label: string; description: string }> = {
  desert: {
    label: 'Desert (Désert)',
    description: 'Climat désertique - Qatar standard',
  },
  temperate: {
    label: 'Temperate (Tempéré)',
    description: 'Climat tempéré - 4 saisons',
  },
  tropical: {
    label: 'Tropical (Tropical)',
    description: 'Climat tropical - Humide et chaud',
  },
  cold: {
    label: 'Cold (Froid)',
    description: 'Climat froid - Températures basses',
  },
};














