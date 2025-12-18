/**
 * Types pour le wizard de création de projet
 */

export type PowerOption = 5 | 10 | 25 | 50 | 75 | 100;

export type EnergySource = 
  | 'grid'        // Réseau électrique
  | 'solar'       // Solaire
  | 'off-grid'    // Autonome
  | 'hybrid'      // Hybride (Solar + Grid)
  | 'biogas'      // Biogaz
  | 'wind'        // Éolien
  | 'flare-gas';  // Flare Gas (gaz de torchère)

export type TerrainType = 
  | 'sandy'       // Sable (Qatar standard)
  | 'gravel'      // Gravier
  | 'concrete'    // Béton
  | 'rocky'       // Rocheux
  | 'mixed';      // Mixte

export type ClimateType = 
  | 'desert'      // Désert (Qatar)
  | 'temperate'   // Tempéré
  | 'tropical'    // Tropical
  | 'cold';       // Froid

export interface PowerConfig {
  powerMW: PowerOption;
  containers: number;
  transformers: number;
  hashratePH: number;
  dailyBTC: number;
}

export interface EnergyConfig {
  source: EnergySource;
  costPerKWh: number;
  availability: number; // %
  renewable: boolean;
}

export interface TerrainConfig {
  type: TerrainType;
  foundationRequired: boolean;
  drainageRequired: boolean;
  preparationCost: number;
}

export interface ProjectWizardState {
  step: number;
  powerConfig?: PowerConfig;
  energyConfig?: EnergyConfig;
  terrainConfig?: TerrainConfig;
  climateType?: ClimateType;
}

export interface ProjectConfiguration {
  id: string;
  name: string;
  power: PowerConfig;
  energy: EnergyConfig;
  terrain: TerrainConfig;
  climate: ClimateType;
  createdAt: Date;
}














