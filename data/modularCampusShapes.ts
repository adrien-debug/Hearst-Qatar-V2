/**
 * Designs de Campus Modulaires - Bitmain HD5
 * Shapes d'implantation symétriques (5 MW → 100 MW+)
 */

export type CampusShape = '5MW' | '10MW' | '25MW' | '50MW' | '100MW' | '125MW' | '150MW' | '200MW' | '250MW';

export interface Container {
  id: string;
  type: 'Bitmain HD5';
  power: number; // MW
  position: {
    x: number;
    y: number;
    z: number;
  };
  orientation: number; // degrés
  longSideDirection: string;
  electricalInput: 'lateral';
  facingTransformer: string;
}

export interface Transformer {
  id: string;
  power: number; // MW
  position: {
    x: number;
    y: number;
    z: number;
  };
  containers: string[];
}

export interface ElectricalDistribution {
  lv: {
    type: 'radial';
    sessions?: Array<{
      transformer: string;
      to: string[];
    }>;
    from?: string;
    to?: string[];
  };
  mv: {
    type: 'ring';
    transformers: string[];
    topology: string;
  } | null;
}

export interface CivilInfrastructure {
  pedestrianRings: Array<{
    containerId: string;
    width: number;
    continuous: boolean;
  }>;
  maintenancePads: Array<{
    containerId?: string;
    transformerId?: string;
    width: number;
    position: string;
  }>;
  technicalRoads: Array<{
    id: string;
    width: number;
    path: string;
  }>;
  pedestrianPaths: Array<{
    id: string;
    width: number;
    path: string;
  }>;
  centralAxis?: {
    direction: string;
    width: number;
    type: string;
  };
  axes?: Array<{
    id: string;
    direction: string;
    width: number;
    type: string;
  }>;
}

export interface AerodynamicClearance {
  containerId: string;
  direction: string;
  minimum: number; // mètres
}

export interface Security {
  fence: {
    type: 'black';
    perimeter: boolean;
    dimensions: {
      length: number;
      width: number;
    };
  };
  gate: {
    position: string;
    type: 'security';
  };
}

export interface Hangar {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  withinEnclosure: boolean;
  side?: 'left' | 'right';
}

export interface CampusShapeConfig {
  shape: CampusShape;
  power: {
    total: number;
    it: number;
    sessions: number;
    blocks?: number;
  };
  transformers: Transformer[];
  containers: Container[];
  electrical: {
    distribution: ElectricalDistribution;
  };
  civil: CivilInfrastructure;
  aerodynamic: {
    clearances: AerodynamicClearance[];
  };
  security: Security;
  buildings: {
    hangars: Hangar[];
  };
  extension: {
    logic: string;
    nextShape?: CampusShape;
    blocks?: number;
  };
}

// ========== SHAPE 5 MW ==========

export const shape5MW: CampusShapeConfig = {
  shape: '5MW',
  power: {
    total: 5,
    it: 4.8,
    sessions: 1,
  },
  transformers: [
    {
      id: 'T1',
      power: 5,
      position: { x: 0, y: 0, z: 0 },
      containers: ['HD5-N', 'HD5-SW', 'HD5-SE'],
    },
  ],
  containers: [
    {
      id: 'HD5-N',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 0, y: 20, z: 0 },
      orientation: 0,
      longSideDirection: 'N',
      electricalInput: 'lateral',
      facingTransformer: 'T1',
    },
    {
      id: 'HD5-SW',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -17.32, y: -10, z: 0 },
      orientation: 240,
      longSideDirection: 'SW',
      electricalInput: 'lateral',
      facingTransformer: 'T1',
    },
    {
      id: 'HD5-SE',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 17.32, y: -10, z: 0 },
      orientation: 120,
      longSideDirection: 'SE',
      electricalInput: 'lateral',
      facingTransformer: 'T1',
    },
  ],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        from: 'T1',
        to: ['HD5-N', 'HD5-SW', 'HD5-SE'],
      },
      mv: null,
    },
  },
  civil: {
    pedestrianRings: [
      { containerId: 'HD5-N', width: 1.5, continuous: true },
      { containerId: 'HD5-SW', width: 1.5, continuous: true },
      { containerId: 'HD5-SE', width: 1.5, continuous: true },
    ],
    maintenancePads: [
      { containerId: 'HD5-N', width: 3, position: 'front' },
      { containerId: 'HD5-SW', width: 3, position: 'front' },
      { containerId: 'HD5-SE', width: 3, position: 'front' },
      { transformerId: 'T1', width: 3, position: 'around' },
    ],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'center_to_containers' },
    ],
    pedestrianPaths: [
      { id: 'P1', width: 1.5, path: 'transformer_to_HD5-N' },
      { id: 'P2', width: 1.5, path: 'transformer_to_HD5-SW' },
      { id: 'P3', width: 1.5, path: 'transformer_to_HD5-SE' },
    ],
  },
  aerodynamic: {
    clearances: [
      { containerId: 'HD5-N', direction: 'N', minimum: 4 },
      { containerId: 'HD5-SW', direction: 'SW', minimum: 4 },
      { containerId: 'HD5-SE', direction: 'SE', minimum: 4 },
    ],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 60, width: 60 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H1',
        position: { x: 25, y: 25, z: 0 },
        withinEnclosure: true,
      },
    ],
  },
  extension: {
    logic: 'duplicate_5MW_blocks',
    nextShape: '10MW',
  },
};

// ========== SHAPE 10 MW ==========

export const shape10MW: CampusShapeConfig = {
  shape: '10MW',
  power: {
    total: 10,
    it: 9.6,
    sessions: 2,
  },
  transformers: [
    {
      id: 'T1',
      power: 5,
      position: { x: -20, y: 0, z: 0 },
      containers: ['HD5-N1', 'HD5-SW1', 'HD5-SE1'],
    },
    {
      id: 'T2',
      power: 5,
      position: { x: 20, y: 0, z: 0 },
      containers: ['HD5-N2', 'HD5-SW2', 'HD5-SE2'],
    },
  ],
  containers: [
    {
      id: 'HD5-N1',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -20, y: 20, z: 0 },
      orientation: 0,
      longSideDirection: 'N',
      electricalInput: 'lateral',
      facingTransformer: 'T1',
    },
    {
      id: 'HD5-SW1',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -37.32, y: -10, z: 0 },
      orientation: 240,
      longSideDirection: 'SW',
      electricalInput: 'lateral',
      facingTransformer: 'T1',
    },
    {
      id: 'HD5-SE1',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -2.68, y: -10, z: 0 },
      orientation: 120,
      longSideDirection: 'SE',
      electricalInput: 'lateral',
      facingTransformer: 'T1',
    },
    {
      id: 'HD5-N2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 20, y: 20, z: 0 },
      orientation: 0,
      longSideDirection: 'N',
      electricalInput: 'lateral',
      facingTransformer: 'T2',
    },
    {
      id: 'HD5-SW2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 2.68, y: -10, z: 0 },
      orientation: 240,
      longSideDirection: 'SW',
      electricalInput: 'lateral',
      facingTransformer: 'T2',
    },
    {
      id: 'HD5-SE2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 37.32, y: -10, z: 0 },
      orientation: 120,
      longSideDirection: 'SE',
      electricalInput: 'lateral',
      facingTransformer: 'T2',
    },
  ],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        sessions: [
          { transformer: 'T1', to: ['HD5-N1', 'HD5-SW1', 'HD5-SE1'] },
          { transformer: 'T2', to: ['HD5-N2', 'HD5-SW2', 'HD5-SE2'] },
        ],
      },
      mv: {
        type: 'ring',
        transformers: ['T1', 'T2'],
        topology: 'loop',
      },
    },
  },
  civil: {
    centralAxis: {
      direction: 'N-S',
      width: 6,
      type: 'technical_road',
    },
    pedestrianRings: [
      { containerId: 'HD5-N1', width: 1.5, continuous: true },
      { containerId: 'HD5-SW1', width: 1.5, continuous: true },
      { containerId: 'HD5-SE1', width: 1.5, continuous: true },
      { containerId: 'HD5-N2', width: 1.5, continuous: true },
      { containerId: 'HD5-SW2', width: 1.5, continuous: true },
      { containerId: 'HD5-SE2', width: 1.5, continuous: true },
    ],
    maintenancePads: [
      { containerId: 'HD5-N1', width: 3, position: 'front' },
      { containerId: 'HD5-SW1', width: 3, position: 'front' },
      { containerId: 'HD5-SE1', width: 3, position: 'front' },
      { containerId: 'HD5-N2', width: 3, position: 'front' },
      { containerId: 'HD5-SW2', width: 3, position: 'front' },
      { containerId: 'HD5-SE2', width: 3, position: 'front' },
      { transformerId: 'T1', width: 3, position: 'around' },
      { transformerId: 'T2', width: 3, position: 'around' },
    ],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'central_axis_N-S' },
    ],
    pedestrianPaths: [
      { id: 'P1', width: 1.5, path: 'T1_to_containers' },
      { id: 'P2', width: 1.5, path: 'T2_to_containers' },
    ],
  },
  aerodynamic: {
    clearances: [
      { containerId: 'HD5-N1', direction: 'N', minimum: 4 },
      { containerId: 'HD5-SW1', direction: 'SW', minimum: 4 },
      { containerId: 'HD5-SE1', direction: 'SE', minimum: 4 },
      { containerId: 'HD5-N2', direction: 'N', minimum: 4 },
      { containerId: 'HD5-SW2', direction: 'SW', minimum: 4 },
      { containerId: 'HD5-SE2', direction: 'SE', minimum: 4 },
    ],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 80, width: 60 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H1',
        position: { x: 0, y: 35, z: 0 },
        withinEnclosure: true,
      },
    ],
  },
  extension: {
    logic: 'duplicate_5MW_blocks',
    nextShape: '25MW',
  },
};

// ========== SHAPE 25 MW ==========

export const shape25MW: CampusShapeConfig = {
  shape: '25MW',
  power: {
    total: 25,
    it: 24,
    sessions: 5,
  },
  transformers: [
    {
      id: 'T-C',
      power: 5,
      position: { x: 0, y: 0, z: 0 },
      containers: ['HD5-W-C', 'HD5-E-C', 'HD5-S-C'],
    },
    {
      id: 'T-N',
      power: 5,
      position: { x: 0, y: 40, z: 0 },
      containers: ['HD5-N', 'HD5-NW', 'HD5-NE'],
    },
    {
      id: 'T-E',
      power: 5,
      position: { x: 40, y: 0, z: 0 },
      containers: ['HD5-E', 'HD5-NE2', 'HD5-SE'],
    },
    {
      id: 'T-S',
      power: 5,
      position: { x: 0, y: -40, z: 0 },
      containers: ['HD5-S', 'HD5-SW', 'HD5-SE2'],
    },
    {
      id: 'T-W',
      power: 5,
      position: { x: -40, y: 0, z: 0 },
      containers: ['HD5-W', 'HD5-NW2', 'HD5-SW2'],
    },
  ],
  containers: [
    {
      id: 'HD5-N',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 0, y: 60, z: 0 },
      orientation: 0,
      longSideDirection: 'N',
      electricalInput: 'lateral',
      facingTransformer: 'T-N',
    },
    {
      id: 'HD5-NW',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -17.32, y: 50, z: 0 },
      orientation: 300,
      longSideDirection: 'NW',
      electricalInput: 'lateral',
      facingTransformer: 'T-N',
    },
    {
      id: 'HD5-NE',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 17.32, y: 50, z: 0 },
      orientation: 60,
      longSideDirection: 'NE',
      electricalInput: 'lateral',
      facingTransformer: 'T-N',
    },
    {
      id: 'HD5-E',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 60, y: 0, z: 0 },
      orientation: 90,
      longSideDirection: 'E',
      electricalInput: 'lateral',
      facingTransformer: 'T-E',
    },
    {
      id: 'HD5-NE2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 50, y: 17.32, z: 0 },
      orientation: 30,
      longSideDirection: 'NE',
      electricalInput: 'lateral',
      facingTransformer: 'T-E',
    },
    {
      id: 'HD5-SE',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 50, y: -17.32, z: 0 },
      orientation: 150,
      longSideDirection: 'SE',
      electricalInput: 'lateral',
      facingTransformer: 'T-E',
    },
    {
      id: 'HD5-S',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 0, y: -60, z: 0 },
      orientation: 180,
      longSideDirection: 'S',
      electricalInput: 'lateral',
      facingTransformer: 'T-S',
    },
    {
      id: 'HD5-SW',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -17.32, y: -50, z: 0 },
      orientation: 240,
      longSideDirection: 'SW',
      electricalInput: 'lateral',
      facingTransformer: 'T-S',
    },
    {
      id: 'HD5-SE2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 17.32, y: -50, z: 0 },
      orientation: 120,
      longSideDirection: 'SE',
      electricalInput: 'lateral',
      facingTransformer: 'T-S',
    },
    {
      id: 'HD5-W',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -60, y: 0, z: 0 },
      orientation: 270,
      longSideDirection: 'W',
      electricalInput: 'lateral',
      facingTransformer: 'T-W',
    },
    {
      id: 'HD5-NW2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -50, y: 17.32, z: 0 },
      orientation: 330,
      longSideDirection: 'NW',
      electricalInput: 'lateral',
      facingTransformer: 'T-W',
    },
    {
      id: 'HD5-SW2',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -50, y: -17.32, z: 0 },
      orientation: 210,
      longSideDirection: 'SW',
      electricalInput: 'lateral',
      facingTransformer: 'T-W',
    },
    {
      id: 'HD5-W-C',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: -20, y: 0, z: 0 },
      orientation: 270,
      longSideDirection: 'W',
      electricalInput: 'lateral',
      facingTransformer: 'T-C',
    },
    {
      id: 'HD5-E-C',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 20, y: 0, z: 0 },
      orientation: 90,
      longSideDirection: 'E',
      electricalInput: 'lateral',
      facingTransformer: 'T-C',
    },
    {
      id: 'HD5-S-C',
      type: 'Bitmain HD5',
      power: 1.6,
      position: { x: 0, y: -20, z: 0 },
      orientation: 180,
      longSideDirection: 'S',
      electricalInput: 'lateral',
      facingTransformer: 'T-C',
    },
  ],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        sessions: [
          { transformer: 'T-C', to: ['HD5-W-C', 'HD5-E-C', 'HD5-S-C'] },
          { transformer: 'T-N', to: ['HD5-N', 'HD5-NW', 'HD5-NE'] },
          { transformer: 'T-E', to: ['HD5-E', 'HD5-NE2', 'HD5-SE'] },
          { transformer: 'T-S', to: ['HD5-S', 'HD5-SW', 'HD5-SE2'] },
          { transformer: 'T-W', to: ['HD5-W', 'HD5-NW2', 'HD5-SW2'] },
        ],
      },
      mv: {
        type: 'ring',
        transformers: ['T-C', 'T-N', 'T-E', 'T-S', 'T-W'],
        topology: 'T-C ↔ T-N ↔ T-E ↔ T-S ↔ T-W ↔ T-C',
      },
    },
  },
  civil: {
    axes: [
      { id: 'A1', direction: 'N-S', width: 6, type: 'technical_road' },
      { id: 'A2', direction: 'E-W', width: 6, type: 'technical_road' },
    ],
    pedestrianRings: [
      { containerId: 'HD5-N', width: 1.5, continuous: true },
      { containerId: 'HD5-NW', width: 1.5, continuous: true },
      { containerId: 'HD5-NE', width: 1.5, continuous: true },
      { containerId: 'HD5-E', width: 1.5, continuous: true },
      { containerId: 'HD5-NE2', width: 1.5, continuous: true },
      { containerId: 'HD5-SE', width: 1.5, continuous: true },
      { containerId: 'HD5-S', width: 1.5, continuous: true },
      { containerId: 'HD5-SW', width: 1.5, continuous: true },
      { containerId: 'HD5-SE2', width: 1.5, continuous: true },
      { containerId: 'HD5-W', width: 1.5, continuous: true },
      { containerId: 'HD5-NW2', width: 1.5, continuous: true },
      { containerId: 'HD5-SW2', width: 1.5, continuous: true },
      { containerId: 'HD5-W-C', width: 1.5, continuous: true },
      { containerId: 'HD5-E-C', width: 1.5, continuous: true },
      { containerId: 'HD5-S-C', width: 1.5, continuous: true },
    ],
    maintenancePads: [
      { containerId: 'HD5-N', width: 3, position: 'front' },
      { containerId: 'HD5-NW', width: 3, position: 'front' },
      { containerId: 'HD5-NE', width: 3, position: 'front' },
      { containerId: 'HD5-E', width: 3, position: 'front' },
      { containerId: 'HD5-NE2', width: 3, position: 'front' },
      { containerId: 'HD5-SE', width: 3, position: 'front' },
      { containerId: 'HD5-S', width: 3, position: 'front' },
      { containerId: 'HD5-SW', width: 3, position: 'front' },
      { containerId: 'HD5-SE2', width: 3, position: 'front' },
      { containerId: 'HD5-W', width: 3, position: 'front' },
      { containerId: 'HD5-NW2', width: 3, position: 'front' },
      { containerId: 'HD5-SW2', width: 3, position: 'front' },
      { containerId: 'HD5-W-C', width: 3, position: 'front' },
      { containerId: 'HD5-E-C', width: 3, position: 'front' },
      { containerId: 'HD5-S-C', width: 3, position: 'front' },
      { transformerId: 'T-C', width: 3, position: 'around' },
      { transformerId: 'T-N', width: 3, position: 'around' },
      { transformerId: 'T-E', width: 3, position: 'around' },
      { transformerId: 'T-S', width: 3, position: 'around' },
      { transformerId: 'T-W', width: 3, position: 'around' },
    ],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'axis_N-S' },
      { id: 'R3', width: 6, path: 'axis_E-W' },
    ],
    pedestrianPaths: [
      { id: 'P1', width: 1.5, path: 'T-C_to_containers' },
      { id: 'P2', width: 1.5, path: 'T-N_to_containers' },
      { id: 'P3', width: 1.5, path: 'T-E_to_containers' },
      { id: 'P4', width: 1.5, path: 'T-S_to_containers' },
      { id: 'P5', width: 1.5, path: 'T-W_to_containers' },
    ],
  },
  aerodynamic: {
    clearances: [
      { containerId: 'HD5-N', direction: 'N', minimum: 4 },
      { containerId: 'HD5-NW', direction: 'NW', minimum: 4 },
      { containerId: 'HD5-NE', direction: 'NE', minimum: 4 },
      { containerId: 'HD5-E', direction: 'E', minimum: 4 },
      { containerId: 'HD5-NE2', direction: 'NE', minimum: 4 },
      { containerId: 'HD5-SE', direction: 'SE', minimum: 4 },
      { containerId: 'HD5-S', direction: 'S', minimum: 4 },
      { containerId: 'HD5-SW', direction: 'SW', minimum: 4 },
      { containerId: 'HD5-SE2', direction: 'SE', minimum: 4 },
      { containerId: 'HD5-W', direction: 'W', minimum: 4 },
      { containerId: 'HD5-NW2', direction: 'NW', minimum: 4 },
      { containerId: 'HD5-SW2', direction: 'SW', minimum: 4 },
      { containerId: 'HD5-W-C', direction: 'W', minimum: 4 },
      { containerId: 'HD5-E-C', direction: 'E', minimum: 4 },
      { containerId: 'HD5-S-C', direction: 'S', minimum: 4 },
    ],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 120, width: 120 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H1',
        position: { x: 0, y: 70, z: 0 },
        withinEnclosure: true,
      },
    ],
  },
  extension: {
    logic: 'duplicate_25MW_blocks',
    nextShape: '100MW',
    blocks: 1,
  },
};

// ========== SHAPE 50 MW ==========

export const shape50MW: CampusShapeConfig = {
  shape: '50MW',
  power: {
    total: 50,
    it: 48,
    sessions: 10,
    blocks: 2,
  },
  transformers: [],
  containers: [],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        sessions: [],
      },
      mv: {
        type: 'ring',
        transformers: [],
        topology: 'hierarchical_ring',
      },
    },
  },
  civil: {
    axes: [
      { id: 'A1', direction: 'N-S', width: 6, type: 'technical_road' },
      { id: 'A2', direction: 'E-W', width: 6, type: 'technical_road' },
    ],
    pedestrianRings: [],
    maintenancePads: [],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'main_axis_N-S' },
      { id: 'R3', width: 6, path: 'main_axis_E-W' },
      { id: 'R4', width: 6, path: 'inter_block_connections' },
    ],
    pedestrianPaths: [],
  },
  aerodynamic: {
    clearances: [],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 280, width: 120 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H1',
        position: { x: 70, y: 0, z: 0 },
        withinEnclosure: true,
      },
    ],
  },
  extension: {
    logic: 'duplicate_25MW_blocks',
    nextShape: '100MW',
  },
};

// Initialiser shape50MW avec les blocs dupliqués
(function initialize50MW() {
  const block1 = duplicate25MWBlock(0, 0, 'B1');
  const block2 = duplicate25MWBlock(140, 0, 'B2');

  shape50MW.transformers = [...block1.transformers, ...block2.transformers];
  shape50MW.containers = [...block1.containers, ...block2.containers];
  shape50MW.electrical.distribution.lv.sessions = [...block1.lvSessions, ...block2.lvSessions];
  shape50MW.electrical.distribution.mv!.transformers = [...block1.transformerIds, ...block2.transformerIds];
  shape50MW.electrical.distribution.mv!.topology = 'B1_ring ↔ B2_ring';
  shape50MW.civil.pedestrianRings = [...block1.pedestrianRings, ...block2.pedestrianRings];
  shape50MW.civil.maintenancePads = [...block1.maintenancePads, ...block2.maintenancePads];
  shape50MW.civil.pedestrianPaths = [...block1.pedestrianPaths, ...block2.pedestrianPaths];
  shape50MW.aerodynamic.clearances = [...block1.clearances, ...block2.clearances];
})();

// ========== SHAPE 150 MW ==========

export const shape150MW: CampusShapeConfig = {
  shape: '150MW',
  power: {
    total: 150,
    it: 144,
    sessions: 30,
    blocks: 6,
  },
  transformers: [],
  containers: [],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        sessions: [],
      },
      mv: {
        type: 'ring',
        transformers: [],
        topology: 'hierarchical_ring',
      },
    },
  },
  civil: {
    axes: [
      { id: 'A1', direction: 'N-S', width: 6, type: 'technical_road' },
      { id: 'A2', direction: 'E-W', width: 6, type: 'technical_road' },
    ],
    pedestrianRings: [],
    maintenancePads: [],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'main_axis_N-S' },
      { id: 'R3', width: 6, path: 'main_axis_E-W' },
      { id: 'R4', width: 6, path: 'inter_block_connections' },
    ],
    pedestrianPaths: [],
  },
  aerodynamic: {
    clearances: [],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 420, width: 280 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H-G',
        position: { x: -210, y: 0, z: 0 },
        withinEnclosure: true,
        side: 'left',
      },
      {
        id: 'H-D',
        position: { x: 210, y: 0, z: 0 },
        withinEnclosure: true,
        side: 'right',
      },
    ],
  },
  extension: {
    logic: 'duplicate_25MW_blocks',
    nextShape: '200MW',
  },
};

// Initialiser shape150MW avec les blocs dupliqués (grille 3×2)
(function initialize150MW() {
  const positions = [
    { x: -140, y: 70 },   // B1 - haut gauche
    { x: 0, y: 70 },      // B2 - haut centre
    { x: 140, y: 70 },    // B3 - haut droite
    { x: -140, y: -70 },  // B4 - bas gauche
    { x: 0, y: -70 },     // B5 - bas centre
    { x: 140, y: -70 },   // B6 - bas droite
  ];

  const blocks = positions.map((pos, index) => 
    duplicate25MWBlock(pos.x, pos.y, `B${index + 1}`)
  );

  shape150MW.transformers = blocks.flatMap((b) => b.transformers);
  shape150MW.containers = blocks.flatMap((b) => b.containers);
  shape150MW.electrical.distribution.lv.sessions = blocks.flatMap((b) => b.lvSessions);
  shape150MW.electrical.distribution.mv!.transformers = blocks.flatMap((b) => b.transformerIds);
  shape150MW.electrical.distribution.mv!.topology = 'grid_3x2_ring';
  shape150MW.civil.pedestrianRings = blocks.flatMap((b) => b.pedestrianRings);
  shape150MW.civil.maintenancePads = blocks.flatMap((b) => b.maintenancePads);
  shape150MW.civil.pedestrianPaths = blocks.flatMap((b) => b.pedestrianPaths);
  shape150MW.aerodynamic.clearances = blocks.flatMap((b) => b.clearances);
})();

// ========== SHAPE 100 MW ==========

export const shape100MW: CampusShapeConfig = {
  shape: '100MW',
  power: {
    total: 100,
    it: 96,
    sessions: 20,
    blocks: 4,
  },
  transformers: [],
  containers: [],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        sessions: [],
      },
      mv: {
        type: 'ring',
        transformers: [],
        topology: 'hierarchical_ring',
      },
    },
  },
  civil: {
    axes: [
      { id: 'A1', direction: 'N-S', width: 6, type: 'technical_road' },
      { id: 'A2', direction: 'E-W', width: 6, type: 'technical_road' },
    ],
    pedestrianRings: [],
    maintenancePads: [],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'main_axis_N-S' },
      { id: 'R3', width: 6, path: 'main_axis_E-W' },
      { id: 'R4', width: 6, path: 'inter_block_connections' },
    ],
    pedestrianPaths: [],
  },
  aerodynamic: {
    clearances: [],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 250, width: 250 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H-G',
        position: { x: -130, y: 0, z: 0 },
        withinEnclosure: true,
        side: 'left',
      },
      {
        id: 'H-D',
        position: { x: 130, y: 0, z: 0 },
        withinEnclosure: true,
        side: 'right',
      },
    ],
  },
  extension: {
    logic: 'duplicate_25MW_blocks',
    nextShape: '125MW',
  },
};

// ========== SHAPE 200 MW ==========

export const shape200MW: CampusShapeConfig = {
  shape: '200MW',
  power: {
    total: 200,
    it: 192,
    sessions: 40,
    blocks: 8,
  },
  transformers: [],
  containers: [],
  electrical: {
    distribution: {
      lv: {
        type: 'radial',
        sessions: [],
      },
      mv: {
        type: 'ring',
        transformers: [],
        topology: 'hierarchical_ring',
      },
    },
  },
  civil: {
    axes: [
      { id: 'A1', direction: 'N-S', width: 6, type: 'technical_road' },
      { id: 'A2', direction: 'E-W', width: 6, type: 'technical_road' },
    ],
    pedestrianRings: [],
    maintenancePads: [],
    technicalRoads: [
      { id: 'R1', width: 6, path: 'perimeter' },
      { id: 'R2', width: 6, path: 'main_axis_N-S' },
      { id: 'R3', width: 6, path: 'main_axis_E-W' },
      { id: 'R4', width: 6, path: 'inter_block_connections' },
    ],
    pedestrianPaths: [],
  },
  aerodynamic: {
    clearances: [],
  },
  security: {
    fence: {
      type: 'black',
      perimeter: true,
      dimensions: { length: 560, width: 280 },
    },
    gate: {
      position: 'S',
      type: 'security',
    },
  },
  buildings: {
    hangars: [
      {
        id: 'H-G',
        position: { x: -280, y: 0, z: 0 },
        withinEnclosure: true,
        side: 'left',
      },
      {
        id: 'H-D',
        position: { x: 280, y: 0, z: 0 },
        withinEnclosure: true,
        side: 'right',
      },
    ],
  },
  extension: {
    logic: 'duplicate_25MW_blocks',
    nextShape: '250MW',
  },
};

// Initialiser shape200MW avec les blocs dupliqués (grille 4×2)
(function initialize200MW() {
  const positions = [
    { x: -210, y: 70 },   // B1 - haut gauche
    { x: -70, y: 70 },    // B2 - haut centre-gauche
    { x: 70, y: 70 },     // B3 - haut centre-droite
    { x: 210, y: 70 },    // B4 - haut droite
    { x: -210, y: -70 },  // B5 - bas gauche
    { x: -70, y: -70 },   // B6 - bas centre-gauche
    { x: 70, y: -70 },    // B7 - bas centre-droite
    { x: 210, y: -70 },   // B8 - bas droite
  ];

  const blocks = positions.map((pos, index) => 
    duplicate25MWBlock(pos.x, pos.y, `B${index + 1}`)
  );

  shape200MW.transformers = blocks.flatMap((b) => b.transformers);
  shape200MW.containers = blocks.flatMap((b) => b.containers);
  shape200MW.electrical.distribution.lv.sessions = blocks.flatMap((b) => b.lvSessions);
  shape200MW.electrical.distribution.mv!.transformers = blocks.flatMap((b) => b.transformerIds);
  shape200MW.electrical.distribution.mv!.topology = 'grid_4x2_ring';
  shape200MW.civil.pedestrianRings = blocks.flatMap((b) => b.pedestrianRings);
  shape200MW.civil.maintenancePads = blocks.flatMap((b) => b.maintenancePads);
  shape200MW.civil.pedestrianPaths = blocks.flatMap((b) => b.pedestrianPaths);
  shape200MW.aerodynamic.clearances = blocks.flatMap((b) => b.clearances);
})();

// ========== FONCTIONS UTILITAIRES ==========

/**
 * Duplique un bloc de 25MW avec un offset et un préfixe pour les IDs
 */
function duplicate25MWBlock(
  offsetX: number,
  offsetY: number,
  prefix: string
): {
  transformers: Transformer[];
  containers: Container[];
  lvSessions: Array<{ transformer: string; to: string[] }>;
  pedestrianRings: Array<{ containerId: string; width: number; continuous: boolean }>;
  maintenancePads: Array<{ containerId?: string; transformerId?: string; width: number; position: string }>;
  pedestrianPaths: Array<{ id: string; width: number; path: string }>;
  clearances: Array<{ containerId: string; direction: string; minimum: number }>;
  transformerIds: string[];
} {
  const transformers: Transformer[] = [];
  const containers: Container[] = [];
  const lvSessions: Array<{ transformer: string; to: string[] }> = [];
  const pedestrianRings: Array<{ containerId: string; width: number; continuous: boolean }> = [];
  const maintenancePads: Array<{ containerId?: string; transformerId?: string; width: number; position: string }> = [];
  const pedestrianPaths: Array<{ id: string; width: number; path: string }> = [];
  const clearances: Array<{ containerId: string; direction: string; minimum: number }> = [];
  const transformerIds: string[] = [];

  // Dupliquer les transformateurs
  shape25MW.transformers.forEach((transformer) => {
    const newId = `${prefix}_${transformer.id}`;
    const newContainers = transformer.containers.map((c) => `${prefix}_${c}`);
    transformerIds.push(newId);
    
    transformers.push({
      id: newId,
      power: transformer.power,
      position: {
        x: transformer.position.x + offsetX,
        y: transformer.position.y + offsetY,
        z: transformer.position.z,
      },
      containers: newContainers,
    });

    lvSessions.push({
      transformer: newId,
      to: newContainers,
    });
  });

  // Dupliquer les containers
  shape25MW.containers.forEach((container) => {
    const newId = `${prefix}_${container.id}`;
    const newFacingTransformer = `${prefix}_${container.facingTransformer}`;
    
    containers.push({
      id: newId,
      type: container.type,
      power: container.power,
      position: {
        x: container.position.x + offsetX,
        y: container.position.y + offsetY,
        z: container.position.z,
      },
      orientation: container.orientation,
      longSideDirection: container.longSideDirection,
      electricalInput: container.electricalInput,
      facingTransformer: newFacingTransformer,
    });

    pedestrianRings.push({
      containerId: newId,
      width: 1.5,
      continuous: true,
    });

    maintenancePads.push({
      containerId: newId,
      width: 3,
      position: 'front',
    });
  });

  // Dupliquer les maintenance pads pour transformateurs
  shape25MW.civil.maintenancePads
    .filter((pad) => pad.transformerId)
    .forEach((pad) => {
      maintenancePads.push({
        transformerId: `${prefix}_${pad.transformerId}`,
        width: pad.width,
        position: pad.position,
      });
    });

  // Dupliquer les pedestrian paths
  shape25MW.civil.pedestrianPaths.forEach((path, index) => {
    pedestrianPaths.push({
      id: `${prefix}_P${index + 1}`,
      width: path.width,
      path: path.path.replace(/T-[CNESW]/g, (match) => `${prefix}_${match}`),
    });
  });

  // Dupliquer les clearances
  shape25MW.aerodynamic.clearances.forEach((clearance) => {
    clearances.push({
      containerId: `${prefix}_${clearance.containerId}`,
      direction: clearance.direction,
      minimum: clearance.minimum,
    });
  });

  return {
    transformers,
    containers,
    lvSessions,
    pedestrianRings,
    maintenancePads,
    pedestrianPaths,
    clearances,
    transformerIds,
  };
}

export function getCampusShape(shape: CampusShape): CampusShapeConfig {
  switch (shape) {
    case '5MW':
      return shape5MW;
    case '10MW':
      return shape10MW;
    case '25MW':
      return shape25MW;
    case '50MW':
      return shape50MW;
    case '100MW':
      return shape100MW;
    case '150MW':
      return shape150MW;
    case '200MW':
      return shape200MW;
    default:
      return shape5MW;
  }
}

export function getAllShapes(): CampusShapeConfig[] {
  return [shape5MW, shape10MW, shape25MW, shape50MW, shape100MW, shape150MW, shape200MW];
}

export function getShapeByPower(power: number): CampusShapeConfig | null {
  if (power <= 5) return shape5MW;
  if (power <= 10) return shape10MW;
  if (power <= 25) return shape25MW;
  if (power <= 50) return shape50MW;
  if (power <= 100) return shape100MW;
  if (power <= 150) return shape150MW;
  if (power <= 200) return shape200MW;
  return shape200MW; // Pour >200MW, utiliser la logique d'extension
}
