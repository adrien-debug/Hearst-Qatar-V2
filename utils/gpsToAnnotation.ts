import { AnnotationPoint, PointType } from '../components/3d/AnnotationTool3D';

/**
 * Interface pour les points GPS depuis spline-positions.json
 */
export interface GpsPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  type: string;
}

/**
 * Mapping des types GPS vers les types d'annotation valides
 */
const TYPE_MAPPING: Record<string, PointType> = {
  'substation': 'substation',
  'powerblock': 'powerblock',
  'transformer': 'transformer',
  'container': 'container',
  'switchgear': 'switchgear',
};

/**
 * Couleurs par défaut selon le type de point
 */
const TYPE_COLORS: Record<PointType, string> = {
  'reference': '#6366f1',        // Indigo
  'landmark': '#ec4899',        // Rose
  'measurement': '#14b8a6',     // Teal
  'note': '#64748b',            // Slate
  'substation': '#ef4444',      // Rouge
  'powerblock': '#3b82f6',       // Bleu
  'transformer': '#10b981',      // Vert
  'container': '#6366f1',        // Indigo
  'switchgear': '#f59e0b',       // Orange
};

/**
 * Convertit un point GPS en point d'annotation
 */
function convertGpsPointToAnnotation(gpsPoint: GpsPoint, index: number): AnnotationPoint {
  // Valider et mapper le type
  const mappedType = TYPE_MAPPING[gpsPoint.type.toLowerCase()];
  
  if (!mappedType) {
    console.warn(`Type GPS inconnu: "${gpsPoint.type}" pour le point "${gpsPoint.name}". Type ignoré.`);
  }

  // Générer un ID unique basé sur le nom et l'index
  const id = `gps-${gpsPoint.name.replace(/\s+/g, '-').toLowerCase()}-${index}`;

  // Déterminer la couleur selon le type
  const color = mappedType ? TYPE_COLORS[mappedType] : '#6b7280'; // Gris par défaut

  return {
    id,
    position: [gpsPoint.x, gpsPoint.y, gpsPoint.z],
    label: gpsPoint.name,
    color,
    type: mappedType,
  };
}

/**
 * Convertit un tableau de points GPS en points d'annotation
 * 
 * @param gpsPoints - Tableau de points GPS depuis spline-positions.json
 * @returns Tableau de points d'annotation
 */
export function convertGpsPointsToAnnotations(gpsPoints: GpsPoint[]): AnnotationPoint[] {
  if (!Array.isArray(gpsPoints)) {
    console.error('convertGpsPointsToAnnotations: gpsPoints doit être un tableau');
    return [];
  }

  const annotations: AnnotationPoint[] = [];
  const typeStats: Record<string, number> = {};

  gpsPoints.forEach((gpsPoint, index) => {
    // Valider la structure du point GPS
    if (!gpsPoint || typeof gpsPoint.x !== 'number' || typeof gpsPoint.y !== 'number' || typeof gpsPoint.z !== 'number') {
      console.warn(`Point GPS invalide à l'index ${index}:`, gpsPoint);
      return;
    }

    const annotation = convertGpsPointToAnnotation(gpsPoint, index);
    annotations.push(annotation);

    // Statistiques des types
    const type = annotation.type || 'unknown';
    typeStats[type] = (typeStats[type] || 0) + 1;
  });

  // Log des statistiques en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Points GPS convertis:', {
      total: annotations.length,
      parType: typeStats,
    });
  }

  return annotations;
}

/**
 * Types attendus dans la scène 3D (selon splineSceneData.ts et AutoPlacedScene3D.tsx)
 */
const EXPECTED_SCENE_TYPES: PointType[] = ['substation', 'powerblock', 'transformer', 'container', 'switchgear'];

/**
 * Validation de la correspondance des noms avec les types
 * Vérifie que les noms des points GPS correspondent aux patterns attendus
 */
function validateNameTypeConsistency(point: GpsPoint): { valid: boolean; message?: string } {
  const name = point.name.toLowerCase();
  const type = point.type.toLowerCase();

  // Patterns de validation par type
  const patterns: Record<string, RegExp[]> = {
    // Accepte Substation_200MW et Substation_25MW
    'substation': [/substation/i, /(200mw|25mw)/i],
    // Accepte aussi la variante 25MW: "PowerBlock_25MW"
    'powerblock': [/powerblock/i, /pb\d+/i, /25mw/i],
    // Accepte les noms historiques (PB1_TR01_Transformer) et la variante layout (TT1, TT2...)
    'transformer': [
      /transformer/i,
      /tr\d+/i,
      /pb\d+_tr\d+/i,
      /^tt\d+$/i,
    ],
    // Accepte PBx_TRxx_HD5_A/B et TT1_A / TT1_B
    'container': [
      /container/i,
      /hd5/i,
      /pb\d+_tr\d+_hd5_[ab]/i,
      /^tt\d+_[ab]$/i,
    ],
    'switchgear': [/switchgear/i, /sg/i, /pb\d+_sg_\d+_[lr]/i],
  };

  const typePatterns = patterns[type];
  if (!typePatterns) {
    return { valid: false, message: `Type "${type}" n'a pas de pattern de validation défini` };
  }

  // Vérifier si au moins un pattern correspond
  const matches = typePatterns.some(pattern => pattern.test(name));
  if (!matches) {
    return {
      valid: false,
      message: `Le nom "${point.name}" ne correspond pas au type "${type}" (patterns attendus: ${typePatterns.map(p => p.toString()).join(', ')})`,
    };
  }

  return { valid: true };
}

/**
 * Valide la correspondance des types entre les points GPS et les types attendus dans la scène
 * 
 * @param gpsPoints - Tableau de points GPS
 * @returns Rapport de validation avec les incohérences détectées
 */
export function validateGpsTypes(gpsPoints: GpsPoint[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: Record<string, number>;
  typeConsistency: {
    valid: boolean;
    inconsistencies: string[];
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const stats: Record<string, number> = {};
  const inconsistencies: string[] = [];

  if (!Array.isArray(gpsPoints)) {
    return {
      valid: false,
      errors: ['gpsPoints doit être un tableau'],
      warnings: [],
      stats: {},
      typeConsistency: { valid: false, inconsistencies: [] },
    };
  }

  gpsPoints.forEach((point, index) => {
    if (!point) {
      errors.push(`Point invalide à l'index ${index}`);
      return;
    }

    // Compter les types
    const type = point.type?.toLowerCase() || 'unknown';
    stats[type] = (stats[type] || 0) + 1;

    // Vérifier si le type est valide (dans le mapping)
    if (!TYPE_MAPPING[type]) {
      warnings.push(`Type inconnu "${point.type}" pour le point "${point.name}" (index ${index})`);
    }

    // Vérifier si le type est attendu dans la scène 3D
    if (type !== 'unknown' && !EXPECTED_SCENE_TYPES.includes(type as PointType)) {
      warnings.push(`Type "${point.type}" n'est pas un type attendu dans la scène 3D pour le point "${point.name}"`);
    }

    // Vérifier la cohérence nom/type
    const nameValidation = validateNameTypeConsistency(point);
    if (!nameValidation.valid) {
      inconsistencies.push(`Point "${point.name}" (index ${index}): ${nameValidation.message}`);
    }

    // Vérifier la structure du point
    if (typeof point.x !== 'number' || typeof point.y !== 'number' || typeof point.z !== 'number') {
      errors.push(`Coordonnées invalides pour le point "${point.name}" (index ${index})`);
    }

    if (!point.name || typeof point.name !== 'string') {
      warnings.push(`Nom manquant ou invalide pour le point à l'index ${index}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats,
    typeConsistency: {
      valid: inconsistencies.length === 0,
      inconsistencies,
    },
  };
}

