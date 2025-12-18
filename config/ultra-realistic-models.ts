/**
 * Catalogue des Modèles Ultra-Réalistes Cinématiques 4K
 * Filtre uniquement les modèles de qualité 'ultra-realistic' et source 'photo-based'
 */

import { UnifiedModel, getUltraRealisticModels, getPhotoBasedModels } from '../components/3d/UnifiedModelCatalog';

/**
 * IDs des modèles cinématiques 4K par catégorie
 */
export const CINEMATIC_MODELS = {
  transformers: [
    'pt-substation-ultra',      // Transformateur PT-Substation Ultra - 10-50 MVA
    'pt-padmount-ultra',         // Transformateur PT-Padmount Ultra - 500-2500 kVA
    'dt-secondary-ultra',        // Transformateur DT-Secondary Ultra - 315-1000 kVA
    'dt-renewable-ultra',        // Transformateur DT-Renewable Ultra - 250-800 kVA
  ],
  containers: [
    'antspace-hd5',              // ANTSPACE Bitmain HD5 - 6 MW
    'hd5-container-detailed',    // HD5 Container Détaillé - 6 MW
  ],
  cooling: [
    'hydro-cooling-system',      // Système de Refroidissement Hydro - 2-5 MW
  ],
} as const;

/**
 * Configuration des modèles par défaut pour chaque type d'équipement
 */
export const DEFAULT_MODELS = {
  transformer: 'pt-substation-ultra',
  container: 'antspace-hd5',
  cooling: 'hydro-cooling-system',
  switchgear: 'switchgear-standard', // Modèle standard pour switchgear
  substation: 'substation-200mw',    // Modèle standard pour substation
} as const;

/**
 * Récupère tous les modèles ultra-réalistes du catalogue
 */
export function getCinematicModels(): UnifiedModel[] {
  const ultraRealistic = getUltraRealisticModels();
  const photoBased = getPhotoBasedModels();
  
  // Intersection des deux ensembles pour garantir qualité ultra-réaliste ET photo-based
  return ultraRealistic.filter(model => 
    photoBased.some(pb => pb.id === model.id)
  );
}

/**
 * Récupère les modèles cinématiques par catégorie
 */
export function getCinematicModelsByCategory(category: 'transformers' | 'containers' | 'cooling'): string[] {
  return [...CINEMATIC_MODELS[category]];
}

/**
 * Vérifie si un modèle est cinématique 4K
 */
export function isCinematicModel(modelId: string): boolean {
  return Object.values(CINEMATIC_MODELS)
    .flat()
    .includes(modelId as any);
}

/**
 * Récupère le modèle par défaut pour un type d'équipement
 */
export function getDefaultModelForType(type: keyof typeof DEFAULT_MODELS): string {
  return DEFAULT_MODELS[type];
}

/**
 * Spécifications techniques des modèles cinématiques
 */
export const CINEMATIC_SPECS = {
  'pt-substation-ultra': {
    name: 'Transformateur PT-Substation Ultra',
    power: '10-50 MVA',
    dimensions: { length: 4.5, width: 3.5, height: 5.5 },
    features: [
      '6 isolateurs en porcelaine',
      '12 radiateurs de refroidissement',
      'Basé sur photos réelles',
      'Qualité cinématique 4K',
    ],
    usage: 'Haute tension - Substation principale',
  },
  'pt-padmount-ultra': {
    name: 'Transformateur PT-Padmount Ultra',
    power: '500-2500 kVA',
    dimensions: { length: 3.2, width: 2.5, height: 2.5 },
    features: [
      'Boîtier fermé compact',
      'Portes d\'accès sécurisées',
      'Grilles de ventilation',
      'Qualité cinématique 4K',
    ],
    usage: 'Distribution urbaine - Compact',
  },
  'dt-secondary-ultra': {
    name: 'Transformateur DT-Secondary Ultra',
    power: '315-1000 kVA',
    dimensions: { length: 2.8, width: 2.2, height: 2.7 },
    features: [
      'Radiateurs latéraux',
      'Isolateurs céramiques',
      'Panneau de contrôle LED',
      'Qualité cinématique 4K',
    ],
    usage: 'Distribution secondaire',
  },
  'dt-renewable-ultra': {
    name: 'Transformateur DT-Renewable Ultra',
    power: '250-800 kVA',
    dimensions: { length: 2.5, width: 2.0, height: 2.0 },
    features: [
      'Design moderne',
      'Radiateurs à ailettes',
      'LED bleues',
      'Optimisé énergies renouvelables',
    ],
    usage: 'Solaire et éolien',
  },
  'antspace-hd5': {
    name: 'ANTSPACE Bitmain HD5',
    power: '6 MW',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    features: [
      'Conteneur 40ft mining Bitcoin',
      'Module de refroidissement intégré',
      'Panneaux en V bleu foncé',
      'Qualité cinématique 4K',
    ],
    usage: 'Mining Bitcoin - 120 S19 XP Hydro',
  },
  'hd5-container-detailed': {
    name: 'HD5 Container Détaillé',
    power: '6 MW',
    dimensions: { length: 12.196, width: 3.5, height: 2.896 },
    features: [
      'Module de refroidissement détaillé',
      'Radiateurs en V',
      'Évaporateur 7 sections',
      'Qualité cinématique 4K',
    ],
    usage: 'Mining Bitcoin - Version détaillée',
  },
  'hydro-cooling-system': {
    name: 'Système de Refroidissement Hydro',
    power: '2-5 MW thermique',
    dimensions: { length: 15, width: 3, height: 3 },
    features: [
      '12 ventilateurs circulaires',
      'Pompes vertes industrielles',
      'Réservoirs bleus',
      'Structure en H robuste',
    ],
    usage: 'Refroidissement industriel',
  },
} as const;

/**
 * Récupère les spécifications d'un modèle cinématique
 */
export function getCinematicSpecs(modelId: string) {
  return CINEMATIC_SPECS[modelId as keyof typeof CINEMATIC_SPECS] || null;
}

/**
 * Liste tous les modèles cinématiques disponibles
 */
export function listAllCinematicModels(): Array<{
  id: string;
  category: string;
  name: string;
  power: string;
}> {
  const models: Array<{
    id: string;
    category: string;
    name: string;
    power: string;
  }> = [];

  // Transformateurs
  CINEMATIC_MODELS.transformers.forEach(id => {
    const spec = CINEMATIC_SPECS[id as keyof typeof CINEMATIC_SPECS];
    if (spec) {
      models.push({
        id,
        category: 'transformer',
        name: spec.name,
        power: spec.power,
      });
    }
  });

  // Conteneurs
  CINEMATIC_MODELS.containers.forEach(id => {
    const spec = CINEMATIC_SPECS[id as keyof typeof CINEMATIC_SPECS];
    if (spec) {
      models.push({
        id,
        category: 'container',
        name: spec.name,
        power: spec.power,
      });
    }
  });

  // Refroidissement
  CINEMATIC_MODELS.cooling.forEach(id => {
    const spec = CINEMATIC_SPECS[id as keyof typeof CINEMATIC_SPECS];
    if (spec) {
      models.push({
        id,
        category: 'cooling',
        name: spec.name,
        power: spec.power,
      });
    }
  });

  return models;
}

/**
 * Filtre pour n'utiliser que les modèles cinématiques dans une liste
 */
export function filterCinematicOnly(modelIds: string[]): string[] {
  return modelIds.filter(id => isCinematicModel(id));
}

/**
 * Statistiques des modèles cinématiques
 */
export function getCinematicStats() {
  return {
    total: Object.values(CINEMATIC_MODELS).flat().length,
    byCategory: {
      transformers: CINEMATIC_MODELS.transformers.length,
      containers: CINEMATIC_MODELS.containers.length,
      cooling: CINEMATIC_MODELS.cooling.length,
    },
    quality: 'ultra-realistic',
    source: 'photo-based',
    resolution: '4K',
  };
}
