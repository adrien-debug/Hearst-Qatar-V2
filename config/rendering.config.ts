/**
 * Configuration centralisée pour tous les rendus 3D
 * Matériaux PBR, éclairage, caméra, performance
 */

export const RENDERING_CONFIG = {
  // Matériaux PBR standards
  materials: {
    metal: {
      metalness: 0.85,
      roughness: 0.35,
      envMapIntensity: 1.2
    },
    metalDark: {
      metalness: 0.95,
      roughness: 0.1,
      envMapIntensity: 1.0
    },
    concrete: {
      metalness: 0.1,
      roughness: 0.9,
      envMapIntensity: 0.5
    },
    porcelain: {
      metalness: 0.05,
      roughness: 0.15,
      envMapIntensity: 0.8
    },
    plastic: {
      metalness: 0.0,
      roughness: 0.4,
      envMapIntensity: 0.6
    },
    glass: {
      metalness: 0.0,
      roughness: 0.05,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0.3
    }
  },

  // Éclairage standard
  lighting: {
    ambient: {
      intensity: 0.6,
      color: '#ffffff'
    },
    directional: {
      intensity: 1.2,
      position: [20, 20, 10] as [number, number, number],
      castShadow: true,
      shadowMapSize: 2048
    },
    hemisphere: {
      skyColor: '#87ceeb',
      groundColor: '#d4a574',
      intensity: 0.4
    }
  },

  // Performance et ombres
  shadows: {
    enabled: true,
    mapSize: 2048,
    bias: -0.0001,
    radius: 2
  },

  // Configuration caméra
  camera: {
    position: [50, 30, 50] as [number, number, number],
    fov: 60,
    near: 0.1,
    far: 2000
  },

  // Environnement
  environment: {
    preset: 'city' as const,
    background: false
  },

  // Sol du Qatar
  ground: {
    color: '#d4a574',
    size: 1000,
    receiveShadow: true
  }
} as const;

export type RenderingConfig = typeof RENDERING_CONFIG;
