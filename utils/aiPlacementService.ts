import { ModulePlacement } from './moduleDrawingHelpers';
import { HD5_DIMENSIONS } from '../components/3d/HD5Container';

export interface PlacementSuggestion {
  position: [number, number, number];
  confidence: number;
  reason: string;
}

export interface LayoutSuggestion {
  modules: ModulePlacement[];
  description: string;
  efficiency: number;
}

/**
 * Service IA pour suggestions de placement automatique
 */
export class AIPlacementService {
  /**
   * Génère des suggestions de placement basées sur les contraintes
   */
  static suggestPlacements(
    existingModules: ModulePlacement[],
    bounds?: { min: [number, number, number]; max: [number, number, number] },
    count: number = 5
  ): PlacementSuggestion[] {
    const suggestions: PlacementSuggestion[] = [];
    const spacing = HD5_DIMENSIONS.width + 2; // Espacement minimum

    // Analyser l'espace disponible
    const availableArea = bounds
      ? {
          width: bounds.max[0] - bounds.min[0],
          depth: bounds.max[2] - bounds.min[2],
        }
      : { width: 200, depth: 200 };

    // Stratégie 1: Placement en grille optimisée
    const gridCols = Math.floor(availableArea.width / spacing);
    const gridRows = Math.floor(availableArea.depth / spacing);
    const gridCapacity = gridCols * gridRows;

    if (gridCapacity > existingModules.length) {
      const startX = bounds ? bounds.min[0] + spacing : -availableArea.width / 2;
      const startZ = bounds ? bounds.min[2] + spacing : -availableArea.depth / 2;

      for (let row = 0; row < gridRows && suggestions.length < count; row++) {
        for (let col = 0; col < gridCols && suggestions.length < count; col++) {
          const pos: [number, number, number] = [
            startX + col * spacing,
            0,
            startZ + row * spacing,
          ];

          // Vérifier si la position est libre
          const isOccupied = existingModules.some((m) => {
            const dist = Math.sqrt(
              Math.pow(m.position[0] - pos[0], 2) + Math.pow(m.position[2] - pos[2], 2)
            );
            return dist < spacing * 0.8;
          });

          if (!isOccupied) {
            suggestions.push({
              position: pos,
              confidence: 0.9,
              reason: 'Placement optimal en grille',
            });
          }
        }
      }
    }

    // Stratégie 2: Placement autour des modules existants
    if (suggestions.length < count && existingModules.length > 0) {
      existingModules.forEach((module) => {
        if (suggestions.length >= count) return;

        // Positions autour du module (nord, sud, est, ouest)
        const offsets: [number, number, number][] = [
          [0, 0, spacing], // Nord
          [0, 0, -spacing], // Sud
          [spacing, 0, 0], // Est
          [-spacing, 0, 0], // Ouest
        ];

        offsets.forEach((offset) => {
          if (suggestions.length >= count) return;

          const pos: [number, number, number] = [
            module.position[0] + offset[0],
            module.position[1] + offset[1],
            module.position[2] + offset[2],
          ];

          // Vérifier les limites
          if (bounds) {
            if (
              pos[0] < bounds.min[0] || pos[0] > bounds.max[0] ||
              pos[2] < bounds.min[2] || pos[2] > bounds.max[2]
            ) {
              return;
            }
          }

          // Vérifier les collisions
          const hasCollision = existingModules.some((m) => {
            const dist = Math.sqrt(
              Math.pow(m.position[0] - pos[0], 2) + Math.pow(m.position[2] - pos[2], 2)
            );
            return dist < spacing * 0.8;
          });

          if (!hasCollision) {
            suggestions.push({
              position: pos,
              confidence: 0.7,
              reason: 'Placement adjacent optimal',
            });
          }
        });
      });
    }

    // Trier par confiance
    suggestions.sort((a, b) => b.confidence - a.confidence);

    return suggestions.slice(0, count);
  }

  /**
   * Optimise l'espace disponible
   */
  static optimizeSpace(
    existingModules: ModulePlacement[],
    bounds?: { min: [number, number, number]; max: [number, number, number] }
  ): { efficiency: number; suggestions: PlacementSuggestion[] } {
    const availableArea = bounds
      ? (bounds.max[0] - bounds.min[0]) * (bounds.max[2] - bounds.min[2])
      : 40000; // 200x200 par défaut

    const moduleArea = HD5_DIMENSIONS.width * HD5_DIMENSIONS.depth;
    const usedArea = existingModules.length * moduleArea;
    const efficiency = (usedArea / availableArea) * 100;

    const suggestions = this.suggestPlacements(existingModules, bounds, 10);

    return { efficiency, suggestions };
  }

  /**
   * Vérifie les règles de sécurité
   */
  static checkSafetyRules(modules: ModulePlacement[]): {
    valid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    const minSpacing = HD5_DIMENSIONS.width + 1;

    // Vérifier l'espacement minimum
    for (let i = 0; i < modules.length; i++) {
      for (let j = i + 1; j < modules.length; j++) {
        const dist = Math.sqrt(
          Math.pow(modules[i].position[0] - modules[j].position[0], 2) +
          Math.pow(modules[i].position[2] - modules[j].position[2], 2)
        );

        if (dist < minSpacing) {
          violations.push(
            `Modules ${modules[i].id} et ${modules[j].id} trop proches (${dist.toFixed(2)}m < ${minSpacing}m)`
          );
        }
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}















