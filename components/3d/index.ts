/**
 * Index centralisé des composants 3D
 * Système unifié avec UnifiedModelCatalog
 */

// ========== SYSTÈME UNIFIÉ ==========
export { UNIFIED_MODEL_CATALOG, getModelById, getModelByType, getModelsByCategory, getUltraRealisticModels, getPhotoBasedModels, searchModels, getCategories } from './UnifiedModelCatalog';
export type { UnifiedModel, EquipmentCategory } from './UnifiedModelCatalog';
export { default as ModelSelectorPanel } from './ModelSelectorPanel';

// ========== CONTENEURS ET MINING ==========
export { default as AntspaceHD5Container } from './AntspaceHD5Container';
// export { default as HD5Container } from './HD5Container'; // Fichier supprimé
export { default as HD5Container3D } from './HD5Container3D';

// ========== SYSTÈMES DE REFROIDISSEMENT ==========
export { default as HydroCoolingSystem } from './HydroCoolingSystem';
export { default as CoolingModule3D } from './CoolingModule3D';
// export { default as CoolingModuleMinimal } from './CoolingModuleMinimal'; // Fichier supprimé

// ========== INFRASTRUCTURE STANDARD ==========
export { default as Substation3D } from './Substation3D';
// export { default as SubstationSystem3D } from './SubstationSystem3D'; // Fichier supprimé
// export { default as PowerBlock3D } from './PowerBlock3D'; // Fichier supprimé
export { default as Switchgear3D } from './Switchgear3D';
export { default as Generator3D } from './Generator3D';

// ========== VRD (VOIRIE ET RÉSEAUX DIVERS) ==========
export { 
  default as VRDInfrastructure,
  PerimeterWall,
  EntranceGate,
  GuardHouse,
  SecurityBarrier,
  HearstLogo3D,
  AsphaltRoad,
  ConcreteRoad,
  MaintenanceHangar,
  ParkingArea,
  Signage
} from './VRDInfrastructure';
export { LogisticsHangar } from './LogisticsHangar';

// ========== ENVIRONNEMENT ==========
export { default as SandyGround } from './SandyGround';
export { default as EnvironmentHDRI } from './EnvironmentHDRI';
export { default as SceneLighting } from './Lighting';

// ========== CONTRÔLES ET PLACEMENT ==========
export { default as EquipmentPlacer } from './EquipmentPlacer';
// export { default as SceneControls } from './SceneControls'; // Fichier supprimé
export { default as SelectableObjectWrapper } from './SelectableObjectWrapper';
export { MeasurementTool } from './MeasurementTool';

// ========== CREATURES ET DÉCORATIONS ==========
export { Phoenix3D } from './Phoenix3D';
