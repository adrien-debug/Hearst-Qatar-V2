import { LayoutElement } from './layoutGenerator';
import { CONTAINER_LAYOUT_RULES } from './containerLayoutRules';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CollisionCheck {
  hasCollision: boolean;
  collidingElement?: LayoutElement;
  distance?: number;
}

/**
 * Valide le placement d'un container selon toutes les règles
 */
export function validateContainerPlacement(
  container: LayoutElement,
  existingLayout: LayoutElement[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Vérifier l'alignement sur grille
  if (!checkAlignment(container)) {
    errors.push('Container non aligné sur la grille (position doit être multiple de 1m)');
  }

  // 2. Vérifier les collisions
  const collision = checkCollisions(container, existingLayout);
  if (collision.hasCollision && collision.collidingElement) {
    errors.push(`Collision détectée avec ${collision.collidingElement.type} (${collision.collidingElement.id})`);
  }

  // 3. Vérifier les espacements
  const spacingIssues = checkSpacing(container, existingLayout);
  errors.push(...spacingIssues.errors);
  warnings.push(...spacingIssues.warnings);

  // 4. Vérifier les règles métier
  const businessIssues = checkBusinessRules(container, existingLayout);
  errors.push(...businessIssues.errors);
  warnings.push(...businessIssues.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Vérifie l'alignement sur grille
 */
export function checkAlignment(element: LayoutElement): boolean {
  if (!CONTAINER_LAYOUT_RULES.GRID.snap_enabled) return true;

  const gridSize = CONTAINER_LAYOUT_RULES.GRID.size;
  const alignedX = Math.abs(element.x % gridSize) < 0.01;
  const alignedY = Math.abs(element.y % gridSize) < 0.01;

  return alignedX && alignedY;
}

/**
 * Détecte les collisions avec d'autres éléments
 */
export function checkCollisions(
  element: LayoutElement,
  existingLayout: LayoutElement[]
): CollisionCheck {
  const elementBounds = getElementBounds(element);

  for (const existing of existingLayout) {
    // Ignorer les routes et gazon pour la détection de collision
    if (existing.type === 'Route' || existing.type === 'Gazon') {
      continue;
    }

    const existingBounds = getElementBounds(existing);

    // Vérifier le chevauchement
    if (boundsOverlap(elementBounds, existingBounds)) {
      return {
        hasCollision: true,
        collidingElement: existing,
        distance: 0,
      };
    }
  }

  return { hasCollision: false };
}

/**
 * Vérifie les espacements minimaux
 */
export function checkSpacing(
  element: LayoutElement,
  existingLayout: LayoutElement[]
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const elementBounds = getElementBounds(element);

  for (const existing of existingLayout) {
    if (existing.id === element.id) continue;

    const existingBounds = getElementBounds(existing);
    const distance = calculateDistance(elementBounds, existingBounds);

    // Déterminer le type d'espacement requis
    let minSpacing = 0;
    let spacingType = '';

    if (element.type === 'Container') {
      if (existing.type === 'Container') {
        minSpacing = CONTAINER_LAYOUT_RULES.MIN_SPACING.container_to_container;
        spacingType = 'container';
      } else if (existing.type === 'Transformateur') {
        minSpacing = CONTAINER_LAYOUT_RULES.MIN_SPACING.container_to_transformer;
        spacingType = 'transformateur';
      } else if (existing.type === 'PowerBlock') {
        minSpacing = CONTAINER_LAYOUT_RULES.MIN_SPACING.container_to_powerblock;
        spacingType = 'powerblock';
      }
    }

    if (minSpacing > 0 && distance < minSpacing) {
      errors.push(
        `Container trop proche d'un ${spacingType} (${distance.toFixed(1)}m, minimum ${minSpacing}m requis)`
      );
    }
  }

  return { errors, warnings };
}

/**
 * Vérifie les règles métier
 */
export function checkBusinessRules(
  element: LayoutElement,
  existingLayout: LayoutElement[]
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (element.type !== 'Container') {
    return { errors, warnings };
  }

  // Vérifier le nombre de containers par transformateur
  const transformers = existingLayout.filter(e => e.type === 'Transformateur');
  const containers = existingLayout.filter(e => e.type === 'Container');
  
  // Compter les containers par transformateur (simplifié : par proximité)
  for (const transformer of transformers) {
    const nearbyContainers = containers.filter(container => {
      const distance = calculateDistance(
        getElementBounds(container),
        getElementBounds(transformer)
      );
      return distance < 20; // Rayon de 20m pour associer container/transformateur
    });

    if (nearbyContainers.length >= CONTAINER_LAYOUT_RULES.BUSINESS_RULES.max_containers_per_transformer) {
      warnings.push(
        `Trop de containers pour le transformateur ${transformer.id} (${nearbyContainers.length}, max ${CONTAINER_LAYOUT_RULES.BUSINESS_RULES.max_containers_per_transformer})`
      );
    }
  }

  // Vérifier l'accès route
  if (CONTAINER_LAYOUT_RULES.BUSINESS_RULES.require_road_access) {
    const roads = existingLayout.filter(e => e.type === 'Route');
    const elementBounds = getElementBounds(element);
    
    let hasRoadAccess = false;
    for (const road of roads) {
      const distance = calculateDistance(elementBounds, getElementBounds(road));
      if (distance <= CONTAINER_LAYOUT_RULES.BUSINESS_RULES.max_road_distance) {
        hasRoadAccess = true;
        break;
      }
    }

    if (!hasRoadAccess) {
      warnings.push(
        `Container doit être accessible par une route (distance max ${CONTAINER_LAYOUT_RULES.BUSINESS_RULES.max_road_distance}m)`
      );
    }
  }

  return { errors, warnings };
}

/**
 * Calcule les limites d'un élément (bounding box)
 */
function getElementBounds(element: LayoutElement): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const halfLength = element.length / 2;
  const halfWidth = element.width / 2;

  return {
    minX: element.x - halfLength,
    maxX: element.x + halfLength,
    minY: element.y - halfWidth,
    maxY: element.y + halfWidth,
  };
}

/**
 * Vérifie si deux bounding boxes se chevauchent
 */
function boundsOverlap(
  bounds1: { minX: number; maxX: number; minY: number; maxY: number },
  bounds2: { minX: number; maxX: number; minY: number; maxY: number }
): boolean {
  return !(
    bounds1.maxX < bounds2.minX ||
    bounds1.minX > bounds2.maxX ||
    bounds1.maxY < bounds2.minY ||
    bounds1.minY > bounds2.maxY
  );
}

/**
 * Calcule la distance minimale entre deux bounding boxes
 */
function calculateDistance(
  bounds1: { minX: number; maxX: number; minY: number; maxY: number },
  bounds2: { minX: number; maxX: number; minY: number; maxY: number }
): number {
  // Si chevauchement, distance = 0
  if (boundsOverlap(bounds1, bounds2)) {
    return 0;
  }

  // Calculer la distance entre les rectangles
  const dx = Math.max(0, Math.max(bounds1.minX - bounds2.maxX, bounds2.minX - bounds1.maxX));
  const dy = Math.max(0, Math.max(bounds1.minY - bounds2.maxY, bounds2.minY - bounds1.maxY));

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Snap une position sur la grille
 */
export function snapToGrid(x: number, y: number): { x: number; y: number } {
  if (!CONTAINER_LAYOUT_RULES.GRID.snap_enabled) {
    return { x, y };
  }

  const gridSize = CONTAINER_LAYOUT_RULES.GRID.size;
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  };
}
















