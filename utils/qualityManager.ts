import { QualityLevel } from './performanceMonitor';
import * as THREE from 'three';

/**
 * Gestionnaire de qualité adaptative
 * Ajuste automatiquement les paramètres de rendu selon les performances
 */

export interface QualitySettings {
  shadowMapSize: number;
  shadowMapType: THREE.ShadowMapType;
  antialias: boolean;
  pixelRatio: number;
  postProcessingEnabled: boolean;
  textureSize: number;
  lodEnabled: boolean;
  instancingEnabled: boolean;
}

class QualityManager {
  private currentQuality: QualityLevel = 'high'; // DÉFAUT : "high" pour un rendu correct (auto-ajustable via PerformanceMonitor3D)
  private settings: Map<QualityLevel, QualitySettings> = new Map();

  constructor() {
    // Configuration pour chaque niveau de qualité
    // MODE "LOW" ULTRA-OPTIMISÉ pour performances maximales
    this.settings.set('low', {
      shadowMapSize: 256,              // Très bas pour performance
      shadowMapType: THREE.BasicShadowMap,
      antialias: false,
      pixelRatio: 1.0,                // Pas de sur-échantillonnage
      postProcessingEnabled: false,
      textureSize: 128,                // Très bas
      lodEnabled: true,
      instancingEnabled: true,         // CRUCIAL
    });

    this.settings.set('medium', {
      shadowMapSize: 1024,
      shadowMapType: THREE.BasicShadowMap,
      antialias: false,
      pixelRatio: 1.0,
      postProcessingEnabled: false,
      textureSize: 512,
      lodEnabled: true,
      instancingEnabled: true,
    });

    this.settings.set('high', {
      shadowMapSize: 1024,             // 1024 est un bon compromis
      shadowMapType: THREE.PCFSoftShadowMap,
      antialias: true,
      pixelRatio: 1.0,                 // Ratio natif (crucial pour écrans 4K)
      postProcessingEnabled: false,    // DÉSACTIVÉ pour fluidité maximale
      textureSize: 512,
      lodEnabled: true,
      instancingEnabled: true,
    });

    this.settings.set('ultra', {
      shadowMapSize: 2048,             // Réduit de 4096 à 2048
      shadowMapType: THREE.PCFSoftShadowMap,
      antialias: true,
      pixelRatio: 1.5,                 // Réduit de 2.0 à 1.5
      postProcessingEnabled: true,
      textureSize: 1024,
      lodEnabled: false,
      instancingEnabled: true,
    });
  }

  /**
   * Met à jour le niveau de qualité
   */
  setQuality(quality: QualityLevel) {
    if (this.currentQuality !== quality) {
      this.currentQuality = quality;
      console.log(`🎨 Qualité changée: ${quality}`);
    }
  }

  /**
   * Obtient les paramètres pour le niveau de qualité actuel
   */
  getSettings(): QualitySettings {
    return this.settings.get(this.currentQuality) || this.settings.get('high')!;
  }

  /**
   * Obtient les paramètres pour un niveau de qualité spécifique
   */
  getSettingsFor(quality: QualityLevel): QualitySettings {
    return this.settings.get(quality) || this.settings.get('high')!;
  }

  /**
   * Applique les paramètres à un renderer Three.js
   */
  applyToRenderer(renderer: THREE.WebGLRenderer) {
    const settings = this.getSettings();
    
    // Appliquer les paramètres d'ombres
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = settings.shadowMapType;
    
    // Ajuster la résolution des shadow maps pour toutes les lumières
    // (sera fait dans le composant Lighting)
    
    // Ajuster le pixel ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));
    
    console.log(`✅ Paramètres appliqués: ${this.currentQuality}`, {
      shadowMapSize: settings.shadowMapSize,
      shadowMapType: settings.shadowMapType,
      antialias: settings.antialias,
      pixelRatio: settings.pixelRatio,
    });
  }

  /**
   * Obtient le niveau de qualité actuel
   */
  getQuality(): QualityLevel {
    return this.currentQuality;
  }
}

// Instance singleton
export const qualityManager = new QualityManager();
