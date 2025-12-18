/**
 * Système de suggestions de dimensions intelligentes
 */

import { ArchitecturalObject, Point3D } from './architecturalHelpers';
import { analyzeContext, generateDimensionSuggestions } from './architecturalIntelligence';
import { detectPatterns } from './patternRecognition';

export interface DimensionSuggestion {
  length?: number;
  width?: number;
  height?: number;
  reason: string;
  confidence: number;
  source: 'context' | 'pattern' | 'standard' | 'golden-ratio';
}

/**
 * Génère des suggestions de dimensions pour un nouvel objet
 */
export function suggestDimensions(
  position: Point3D,
  allObjects: ArchitecturalObject[],
  type: 'wall' | 'line' | 'portal' | 'landmark'
): DimensionSuggestion[] {
  const suggestions: DimensionSuggestion[] = [];

  // Analyser le contexte
  const context = analyzeContext(position, allObjects);
  
  // Suggestions basées sur le contexte
  if (type !== 'landmark') {
    const contextSuggestions = generateDimensionSuggestions(context, type as 'line' | 'wall' | 'portal');
    suggestions.push(...contextSuggestions.map(s => ({
      ...s,
      source: 'context' as const,
    })));
  }

  // Suggestions basées sur les patterns détectés
  const patterns = detectPatterns(context.nearbyObjects);
  for (const pattern of patterns) {
    if (pattern.type === 'grid' && pattern.parameters) {
      const spacing = pattern.parameters.xSpacing || pattern.parameters.zSpacing;
      if (spacing) {
        suggestions.push({
          length: spacing,
          reason: `Basé sur le pattern de grille détecté (espacement: ${spacing.toFixed(1)}m)`,
          confidence: pattern.confidence * 0.8,
          source: 'pattern',
        });
      }
    }
  }

  // Suggestions basées sur le golden ratio
  if (context.suggestedLength) {
    const goldenRatio = 1.618;
    suggestions.push({
      length: context.suggestedLength * goldenRatio,
      reason: `Proportion dorée basée sur la longueur existante (${(context.suggestedLength * goldenRatio).toFixed(1)}m)`,
      confidence: 0.5,
      source: 'golden-ratio',
    });
    
    suggestions.push({
      length: context.suggestedLength / goldenRatio,
      reason: `Proportion dorée inverse (${(context.suggestedLength / goldenRatio).toFixed(1)}m)`,
      confidence: 0.5,
      source: 'golden-ratio',
    });
  }

  // Standards architecturaux
  if (type === 'wall') {
    suggestions.push({
      length: 10,
      height: 3,
      reason: 'Dimensions standard pour un mur (10m × 3m)',
      confidence: 0.6,
      source: 'standard',
    });
  } else if (type === 'portal') {
    suggestions.push({
      width: 3,
      height: 4,
      reason: 'Dimensions standard pour un portail (3m × 4m)',
      confidence: 0.7,
      source: 'standard',
    });
  } else if (type === 'line') {
    suggestions.push({
      length: 5,
      reason: 'Longueur standard pour une ligne de référence (5m)',
      confidence: 0.5,
      source: 'standard',
    });
  }

  // Trier par confiance et retourner les meilleures
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5); // Top 5 suggestions
}

/**
 * Applique des ratios architecturaux à une dimension
 */
export function applyArchitecturalRatio(
  baseDimension: number,
  ratio: 'golden' | 'double' | 'half' | 'square'
): number {
  switch (ratio) {
    case 'golden':
      return baseDimension * 1.618;
    case 'double':
      return baseDimension * 2;
    case 'half':
      return baseDimension / 2;
    case 'square':
      return baseDimension; // Pour un carré, longueur = largeur
    default:
      return baseDimension;
  }
}

/**
 * Génère des suggestions de dimensions harmonieuses
 */
export function suggestHarmoniousDimensions(
  existingDimensions: { length?: number; width?: number; height?: number }[],
  type: 'wall' | 'portal' | 'line'
): DimensionSuggestion[] {
  const suggestions: DimensionSuggestion[] = [];

  // Extraire toutes les dimensions
  const allLengths = existingDimensions
    .map(d => d.length)
    .filter((l): l is number => l !== undefined && l > 0);
  
  const allWidths = existingDimensions
    .map(d => d.width)
    .filter((w): w is number => w !== undefined && w > 0);

  // Calculer les moyennes
  const avgLength = allLengths.length > 0
    ? allLengths.reduce((a, b) => a + b, 0) / allLengths.length
    : undefined;

  const avgWidth = allWidths.length > 0
    ? allWidths.reduce((a, b) => a + b, 0) / allWidths.length
    : undefined;

  // Suggestions basées sur les moyennes
  if (avgLength) {
    suggestions.push({
      length: avgLength,
      reason: `Moyenne des longueurs existantes (${avgLength.toFixed(1)}m)`,
      confidence: 0.8,
      source: 'context',
    });
  }

  if (avgWidth) {
    suggestions.push({
      width: avgWidth,
      reason: `Moyenne des largeurs existantes (${avgWidth.toFixed(1)}m)`,
      confidence: 0.8,
      source: 'context',
    });
  }

  // Suggestions avec ratios harmonieux
  if (avgLength) {
    suggestions.push({
      length: avgLength * 1.5,
      reason: `Ratio 3:2 basé sur la longueur moyenne (${(avgLength * 1.5).toFixed(1)}m)`,
      confidence: 0.6,
      source: 'golden-ratio',
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
















