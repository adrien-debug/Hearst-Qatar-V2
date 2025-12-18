/**
 * LAYOUT EXACT DU PLAN 2D - Reproduction Fidèle
 * =============================================
 * 
 * Reproduit EXACTEMENT la disposition du plan 2D visible sur le port 3333
 * 6 transformateurs (TT1-TT6) + 12 containers (2 par transformateur) + routes
 */

import { EquipmentPosition, SiteConditions } from './projectGenerator';
import projectTemplates from '../config/project-templates.json';
import { CampusShapeConfig } from '../data/modularCampusShapes';

/**
 * Génère le layout EXACT du plan 2D
 * Coordonnées du plan 2D → Coordonnées 3D (Three.js)
 * Plan 2D: x (horizontal), y (vertical) → 3D: X (horizontal), Z (vertical, inversé)
 */
export function generateLayoutDefinitif(
  shapeConfig: CampusShapeConfig,
  conditions: SiteConditions,
  groundSize: number
): EquipmentPosition[] {
  const positions: EquipmentPosition[] = [];
  const template = projectTemplates.module_25mw;

  console.log(`\n🎯 LAYOUT EXACT DU PLAN 2D - Reproduction Fidèle`);
  console.log(`═══════════════════════════════════════════════════`);
  console.log(`📐 Disposition exacte du plan 2D (port 3333)`);
  console.log(`   • 6 transformateurs (TT1 à TT6)`);
  console.log(`   • 12 containers (2 par transformateur)`);
  console.log(`   • Routes: centrale verticale + 2 horizontales`);
  
  // ============================================
  // CENTRAGE AU MILIEU DE LA MAP
  // Décalage pour centrer tous les éléments
  // ============================================
  // Positions actuelles : X de 10 à 70 (centre = 40), Z de -24 à 24 (centre = 0)
  const OFFSET_X = -40;  // Décalage pour centrer sur X: 0
  const OFFSET_Z = 0;    // Déjà centré sur Z
  
  // ============================================
  // POSITIONNEMENT DES CONTAINERS COLLÉS À LA ROUTE
  // Route centrale : largeur 6m, centrée à X: 0 (va de -3 à +3)
  // Routes horizontales : largeur 4m, à Z: -10 et Z: 10
  // Containers : largeur 2.438m, collés juste à côté de la route
  // ============================================
  const ROAD_WIDTH = 6;
  const ROAD_HORIZONTAL_WIDTH = 4;
  const CONTAINER_WIDTH = 2.438;
  const CONTAINER_LENGTH = 12.196;
  const CONTAINER_X_LEFT = -(ROAD_WIDTH / 2) - (CONTAINER_WIDTH / 2) - 0.5;  // -4.2m (arrondi à -4)
  const CONTAINER_X_RIGHT = (ROAD_WIDTH / 2) + (CONTAINER_WIDTH / 2) + 0.5;   // 4.2m (arrondi à 4)
  
  // Positions Z des containers pour laisser passage aux routes horizontales
  // Route horizontale 1 à Z: -10, Route horizontale 2 à Z: 10
  // Containers doivent être écartés pour laisser passer les routes (largeur 4m)
  const ROAD_H1_Z = -10;  // Route horizontale 1
  const ROAD_H2_Z = 10;   // Route horizontale 2
  const CLEARANCE = 1;    // Espace de sécurité (1m)
  
  // Containers ligne 1 : Z: -24 et Z: -16 (avant route H1 à Z: -10)
  const Z_LINE1_A = -24;  // Bien avant la route H1
  const Z_LINE1_B = ROAD_H1_Z - (ROAD_HORIZONTAL_WIDTH / 2) - (CONTAINER_LENGTH / 2) - CLEARANCE;  // -17.1m
  
  // Containers ligne 2 : Z: -4 et Z: 4 (entre les 2 routes)
  const Z_LINE2_A = ROAD_H1_Z + (ROAD_HORIZONTAL_WIDTH / 2) + (CONTAINER_LENGTH / 2) + CLEARANCE;  // -1.9m
  const Z_LINE2_B = ROAD_H2_Z - (ROAD_HORIZONTAL_WIDTH / 2) - (CONTAINER_LENGTH / 2) - CLEARANCE;  // 2.9m
  
  // Containers ligne 3 : Z: 16 et Z: 24 (après route H2 à Z: 10)
  const Z_LINE3_A = ROAD_H2_Z + (ROAD_HORIZONTAL_WIDTH / 2) + (CONTAINER_LENGTH / 2) + CLEARANCE;  // 19.1m
  const Z_LINE3_B = 24;   // Bien après la route H2
  
  // ============================================
  // DISPOSITION EXACTE DU PLAN 2D
  // Coordonnées du plan 2D converties en 3D + centrage
  // ============================================
  
  // Ligne 1 (y: 20 dans le plan 2D)
  // TT1: x: 10, y: 20 → 3D: X: 10 + OFFSET_X, Z: -20
  positions.push({
    id: 'TT1',
    type: 'transformer',
    modelId: template.equipment.transformers.modelId,
    position: [10 + OFFSET_X, 0.3, -20 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { powerBlockId: 'PB1', transformerId: 'TT1' },
  });
  // TT1_A: collé à la route (gauche), avant route H1 → 3D: X: CONTAINER_X_LEFT, Z: Z_LINE1_A
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT1_SLAB_A',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_LEFT, 0.2, Z_LINE1_A + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT1', pairId: 'A', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT1_A',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_LEFT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE1_A + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT1', pairId: 'A' },
  });
  // TT1_B: collé à la route (gauche), avant route H1 → 3D: X: CONTAINER_X_LEFT, Z: Z_LINE1_B
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT1_SLAB_B',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_LEFT, 0.2, Z_LINE1_B + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT1', pairId: 'B', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT1_B',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_LEFT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE1_B + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT1', pairId: 'B' },
  });

  // TT4: x: 70, y: 20 → 3D: X: 70 + OFFSET_X, Z: -20
  positions.push({
    id: 'TT4',
    type: 'transformer',
    modelId: template.equipment.transformers.modelId,
    position: [70 + OFFSET_X, 0.3, -20 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { powerBlockId: 'PB1', transformerId: 'TT4' },
  });
  // TT4_A: collé à la route (droite), avant route H1 → 3D: X: CONTAINER_X_RIGHT, Z: Z_LINE1_A
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT4_SLAB_A',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_RIGHT, 0.2, Z_LINE1_A + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT4', pairId: 'A', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT4_A',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_RIGHT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE1_A + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT4', pairId: 'A' },
  });
  // TT4_B: collé à la route (droite), avant route H1 → 3D: X: CONTAINER_X_RIGHT, Z: Z_LINE1_B
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT4_SLAB_B',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_RIGHT, 0.2, Z_LINE1_B + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT4', pairId: 'B', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT4_B',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_RIGHT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE1_B + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT4', pairId: 'B' },
  });

  // Ligne 2 (y: 0 dans le plan 2D)
  // TT2: x: 10, y: 0 → 3D: X: 10 + OFFSET_X, Z: 0
  positions.push({
    id: 'TT2',
    type: 'transformer',
    modelId: template.equipment.transformers.modelId,
    position: [10 + OFFSET_X, 0.3, 0 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { powerBlockId: 'PB1', transformerId: 'TT2' },
  });
  // TT2_A: collé à la route (gauche), entre les 2 routes → 3D: X: CONTAINER_X_LEFT, Z: Z_LINE2_A
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT2_SLAB_A',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_LEFT, 0.2, Z_LINE2_A + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT2', pairId: 'A', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT2_A',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_LEFT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE2_A + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT2', pairId: 'A' },
  });
  // TT2_B: collé à la route (gauche), entre les 2 routes → 3D: X: CONTAINER_X_LEFT, Z: Z_LINE2_B
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT2_SLAB_B',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_LEFT, 0.2, Z_LINE2_B + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT2', pairId: 'B', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT2_B',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_LEFT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE2_B + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT2', pairId: 'B' },
  });

  // TT5: x: 70, y: 0 → 3D: X: 70 + OFFSET_X, Z: 0
  positions.push({
    id: 'TT5',
    type: 'transformer',
    modelId: template.equipment.transformers.modelId,
    position: [70 + OFFSET_X, 0.3, 0 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { powerBlockId: 'PB1', transformerId: 'TT5' },
  });
  // TT5_A: collé à la route (droite), entre les 2 routes → 3D: X: CONTAINER_X_RIGHT, Z: Z_LINE2_A
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT5_SLAB_A',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_RIGHT, 0.2, Z_LINE2_A + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT5', pairId: 'A', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT5_A',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_RIGHT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE2_A + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT5', pairId: 'A' },
  });
  // TT5_B: collé à la route (droite), entre les 2 routes → 3D: X: CONTAINER_X_RIGHT, Z: Z_LINE2_B
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT5_SLAB_B',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_RIGHT, 0.2, Z_LINE2_B + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT5', pairId: 'B', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT5_B',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_RIGHT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE2_B + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT5', pairId: 'B' },
  });

  // Ligne 3 (y: -20 dans le plan 2D)
  // TT3: x: 10, y: -20 → 3D: X: 10 + OFFSET_X, Z: 20
  positions.push({
    id: 'TT3',
    type: 'transformer',
    modelId: template.equipment.transformers.modelId,
    position: [10 + OFFSET_X, 0.3, 20 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { powerBlockId: 'PB1', transformerId: 'TT3' },
  });
  // TT3_A: collé à la route (gauche), après route H2 → 3D: X: CONTAINER_X_LEFT, Z: Z_LINE3_A
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT3_SLAB_A',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_LEFT, 0.2, Z_LINE3_A + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT3', pairId: 'A', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT3_A',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_LEFT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE3_A + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT3', pairId: 'A' },
  });
  // TT3_B: collé à la route (gauche), après route H2 → 3D: X: CONTAINER_X_LEFT, Z: Z_LINE3_B
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT3_SLAB_B',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_LEFT, 0.2, Z_LINE3_B + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT3', pairId: 'B', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT3_B',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_LEFT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE3_B + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT3', pairId: 'B' },
  });

  // TT6: x: 70, y: -20 → 3D: X: 70 + OFFSET_X, Z: 20
  positions.push({
    id: 'TT6',
    type: 'transformer',
    modelId: template.equipment.transformers.modelId,
    position: [70 + OFFSET_X, 0.3, 20 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { powerBlockId: 'PB1', transformerId: 'TT6' },
  });
  // TT6_A: collé à la route (droite), après route H2 → 3D: X: CONTAINER_X_RIGHT, Z: Z_LINE3_A
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT6_SLAB_A',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_RIGHT, 0.2, Z_LINE3_A + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT6', pairId: 'A', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT6_A',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_RIGHT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE3_A + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT6', pairId: 'A' },
  });
  // TT6_B: collé à la route (droite), après route H2 → 3D: X: CONTAINER_X_RIGHT, Z: Z_LINE3_B
  if (conditions.hasConcreteSlabs) {
    positions.push({
      id: 'TT6_SLAB_B',
      type: 'container',
      modelId: 'concrete-slab-40cm',
      position: [CONTAINER_X_RIGHT, 0.2, Z_LINE3_B + OFFSET_Z],
      rotation: [0, 0, 0],
      metadata: { transformerId: 'TT6', pairId: 'B', isFoundation: true },
    });
  }
  positions.push({
    id: 'TT6_B',
    type: 'container',
    modelId: template.equipment.containers.modelId,
    position: [CONTAINER_X_RIGHT, conditions.hasConcreteSlabs ? 0.7 : 0.3, Z_LINE3_B + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { transformerId: 'TT6', pairId: 'B' },
  });

  // ============================================
  // ROUTES DU PLAN 2D
  // ============================================
  // Route centrale verticale : x: 40, largeur 6m, longueur 50m
  // → 3D: X: 40 + OFFSET_X, largeur 6m, profondeur 50m (sur Z)
  positions.push({
    id: 'ROAD_CENTRAL',
    type: 'road',
    modelId: 'concrete-road',
    position: [40 + OFFSET_X, 0.05, 0 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { 
      roadType: 'central',
      width: 6,
      length: 50,
      orientation: 'vertical'
    } as any,
  });

  // Route horizontale 1 : y: 10, largeur 70m, hauteur 4m
  // → 3D: Z: -10 + OFFSET_Z, length 70m (sur X), width 4m (sur Z)
  positions.push({
    id: 'ROAD_HORIZONTAL_1',
    type: 'road',
    modelId: 'concrete-road',
    position: [40 + OFFSET_X, 0.05, -10 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { 
      roadType: 'horizontal',
      length: 70,  // Longueur sur X
      width: 4,    // Largeur sur Z
      orientation: 'horizontal'
    } as any,
  });

  // Route horizontale 2 : y: -10, largeur 70m, hauteur 4m
  // → 3D: Z: 10 + OFFSET_Z, length 70m (sur X), width 4m (sur Z)
  positions.push({
    id: 'ROAD_HORIZONTAL_2',
    type: 'road',
    modelId: 'concrete-road',
    position: [40 + OFFSET_X, 0.05, 10 + OFFSET_Z],
    rotation: [0, 0, 0],
    metadata: { 
      roadType: 'horizontal',
      length: 70,  // Longueur sur X
      width: 4,    // Largeur sur Z
      orientation: 'horizontal'
    } as any,
  });
  
  console.log(`\n✅ ${positions.length} équipements générés (disposition exacte plan 2D)`);
  console.log(`   • 6 transformateurs: TT1, TT2, TT3, TT4, TT5, TT6`);
  console.log(`   • 12 containers: 2 par transformateur (A et B)`);
  console.log(`   • 3 routes: centrale verticale + 2 horizontales`);
  console.log(`\n💡 Disposition identique au plan 2D visible sur port 3333`);
  console.log(`═══════════════════════════════════════════════════\n`);

  return positions;
}
