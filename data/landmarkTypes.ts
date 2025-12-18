/**
 * Types de repères architecturaux
 */

export type LandmarkType = 'point' | 'line' | 'zone';

export interface LandmarkDefinition {
  id: string;
  type: LandmarkType;
  name?: string;
  position: [number, number, number];
  data?: {
    // Pour type 'line'
    endPosition?: [number, number, number];
    // Pour type 'zone'
    width?: number;
    length?: number;
    height?: number;
  };
  color?: string;
  category?: string;
}

export const LANDMARK_CATEGORIES = [
  'reference',
  'boundary',
  'feature',
  'measurement',
] as const;

export type LandmarkCategory = typeof LANDMARK_CATEGORIES[number];


















