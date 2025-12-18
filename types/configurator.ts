/**
 * Types TypeScript pour le système de configurateur 3D
 * Base d'ancrage pour toute l'application
 */

import { UnifiedModel } from '../components/3d/UnifiedModelCatalog';

/**
 * Type d'équipement pour le placement
 */
export type EquipmentType = 
  | 'container' 
  | 'transformer' 
  | 'generator' 
  | 'switchgear' 
  | 'cooling'
  | 'hangar'
  | 'gravel' 
  | 'synthetic-grass' 
  | 'road' 
  | 'concrete-path' 
  | 'pattern' 
  | 'delete-grass-roads'
  | 'none';

/**
 * Équipement placé dans la scène 3D
 */
export interface PlacedEquipment {
  id: string;                           // Identifiant unique
  type: EquipmentType;                  // Type d'équipement
  modelId: string;                      // Référence au UnifiedModel.id
  position: [number, number, number];   // Position (x, y, z) en mètres
  rotation: [number, number, number];   // Rotation (x, y, z) en radians
  scale?: [number, number, number];     // Scale optionnel (défaut: [1, 1, 1])
  metadata?: Record<string, any>;       // Métadonnées additionnelles
}

/**
 * Configuration d'un projet 3D
 */
export interface ProjectConfiguration {
  id: string;                           // Identifiant du projet
  name: string;                         // Nom du projet
  description?: string;                 // Description
  equipment: PlacedEquipment[];         // Équipements placés
  createdAt: Date;                      // Date de création
  updatedAt: Date;                      // Dernière modification
  metadata?: {
    totalPowerMW?: number;              // Puissance totale
    totalObjects?: number;              // Nombre d'objets
    tags?: string[];                    // Tags du projet
  };
}

/**
 * Mode de transformation dans le configurateur
 */
export type TransformMode = 'translate' | 'rotate' | 'scale' | 'none';

/**
 * État du configurateur
 */
export interface ConfiguratorState {
  placedEquipment: PlacedEquipment[];
  selectedObjectId: string | null;
  transformMode: TransformMode;
  selectedModelForPlacement: UnifiedModel | null;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
}

/**
 * Props pour le viewer 3D
 */
export interface Viewer3DProps {
  model: UnifiedModel;
  autoRotate?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
  onLoad?: () => void;
}

/**
 * Paramètres de qualité du rendu 3D
 */
export interface RenderQuality {
  shadowMapSize: number;
  textureSize: number;
  antialias: boolean;
  dpr: number; // Device Pixel Ratio
  toneMapping: 'ACES' | 'Reinhard' | 'Cinematic' | 'None';
}
















