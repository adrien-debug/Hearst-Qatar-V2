/**
 * Types pour la galerie 3D
 */

export type ElementType = 
  | 'container' 
  | 'transformer' 
  | 'switchgear' 
  | 'substation' 
  | 'powerblock'
  | 'dt-padmount' 
  | 'dt-secondary' 
  | 'pt-padmount' 
  | 'dt-renewable' 
  | 'pt-substation'
  | 'high-voltage-power-transformer' 
  | 'substation-bimfra';

export interface GalleryModel {
  id: string;
  type: ElementType;
  title: string;
  description: string;
  thumbnail?: string; // Base64 ou URL
  thumbnailGeneratedAt?: number; // Timestamp
  category?: string;
  tags?: string[];
  icon?: string;
  metadata?: {
    capacityMW?: number;
    capacityMVA?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    [key: string]: any;
  };
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
}
















