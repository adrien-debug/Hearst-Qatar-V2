/**
 * Configuration des règles de placement pour les containers
 */

export const CONTAINER_LAYOUT_RULES = {
  // Espacements minimaux (en mètres)
  MIN_SPACING: {
    container_to_container: 3,      // Maintenance et accès
    container_to_transformer: 5,     // Sécurité électrique
    container_to_powerblock: 10,     // Sécurité haute tension
    container_to_road: 2,            // Accès
    container_to_boundary: 5,        // Limites du site
  },

  // Grille de placement
  GRID: {
    size: 1,                         // Taille de grille en mètres
    snap_enabled: true,               // Activer le snap to grid
  },

  // Règles métier
  BUSINESS_RULES: {
    max_containers_per_transformer: 3,
    max_containers_per_zone: 100,     // Limite par zone de phase
    min_distance_to_boundary: 5,      // Distance minimale aux limites
    require_road_access: true,         // Container doit être accessible par route
    max_road_distance: 2,             // Distance max à une route (m)
  },

  // Optimisation des routes
  ROAD_OPTIMIZATION: {
    main_road_width: 8,               // Routes principales entre phases
    secondary_road_width: 6,           // Routes dans chaque phase
    access_road_width: 4,              // Routes d'accès aux containers
    phase_separation: 10,              // Espace entre zones de phase (m)
    minimize_redundancy: true,         // Éviter routes multiples
    connect_phases: true,               // Connecter toutes les phases
  },
};

export type SpacingType = keyof typeof CONTAINER_LAYOUT_RULES.MIN_SPACING;
export type BusinessRuleType = keyof typeof CONTAINER_LAYOUT_RULES.BUSINESS_RULES;
















