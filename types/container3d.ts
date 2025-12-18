/**
 * Types et interfaces pour l'éditeur 3D de conteneurs, béton et routes
 */

/**
 * Conteneur HD5 avec dalle de béton de 40 cm
 */
export interface Container3D {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  dimensions: {
    length: number; // 12.196m
    width: number;  // 2.438m
    height: number; // 2.896m
  };
  concreteSlab: {
    enabled: boolean;
    thickness: number; // 0.4m (40 cm)
    width: number;     // Légèrement plus large que le conteneur (ex: 13m)
    length: number;     // Légèrement plus long que le conteneur (ex: 3m)
  };
  createdAt: number;
}

/**
 * Transformateur 3D avec connexions électriques
 */
export interface Transformer3D {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  powerMVA: number;
  connectedContainers: string[]; // IDs des conteneurs connectés
  dimensions: {
    width: number;  // 2.5m (réduit de 4m)
    depth: number;  // 2m (réduit de 3m)
    height: number; // 2.5m (réduit de 5m)
  };
  createdAt: number;
}

/**
 * Route 3D avec points de contrôle (spline)
 */
export interface Road3D {
  id: string;
  points: Array<{ x: number; y: number; z: number }>;
  width: number; // Largeur en mètres (par défaut 4m)
  material: 'asphalt' | 'concrete';
  elevation: number; // Élévation au-dessus du sol (par défaut 0.05m)
  createdAt: number;
}

/**
 * Scène complète sauvegardée
 */
export interface ContainerScene {
  version: string;
  containers: Container3D[];
  transformers: Transformer3D[];
  roads: Road3D[];
  metadata: {
    createdAt: number;
    updatedAt: number;
    name?: string;
    description?: string;
  };
}

















