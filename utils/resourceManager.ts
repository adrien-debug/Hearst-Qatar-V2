/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESOURCE MANAGER - GESTION CENTRALISÉE DES RESSOURCES WEBGL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * OBJECTIF : Éviter les fuites mémoire en gérant toutes les ressources Three.js
 * 
 * FEATURES :
 * - Cache des géométries (pas de duplication)
 * - Cache des matériaux (pas de duplication)
 * - Cache des textures (pas de duplication)
 * - Reference counting (compteur d'utilisation)
 * - Dispose automatique quand refCount = 0
 * - Monitoring en temps réel
 * 
 * UTILISATION :
 * ```ts
 * // Créer une géométrie (cachée automatiquement)
 * const geometry = resourceManager.createGeometry('my-box', () => 
 *   new THREE.BoxGeometry(1, 1, 1)
 * );
 * 
 * // Libérer la géométrie (refCount--)
 * resourceManager.disposeGeometry('my-box');
 * ```
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ResourceCache<T> {
  [key: string]: {
    resource: T;
    refCount: number;
    createdAt: number;
  };
}

type LogLevel = 'none' | 'errors' | 'warnings' | 'info' | 'verbose';

// ═══════════════════════════════════════════════════════════════════════════
// RESOURCE MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class ResourceManager {
  private geometries: ResourceCache<THREE.BufferGeometry> = {};
  private materials: ResourceCache<THREE.Material> = {};
  private textures: ResourceCache<THREE.Texture> = {};
  private logLevel: LogLevel = 'info';

  constructor() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('🎯 ResourceManager initialisé');
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // GÉOMÉTRIES
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Crée ou récupère une géométrie du cache
   */
  createGeometry<T extends THREE.BufferGeometry>(
    key: string,
    factory: () => T
  ): T {
    // Si déjà en cache, incrémenter refCount et retourner
    if (this.geometries[key]) {
      this.geometries[key].refCount++;
      this.log('verbose', `♻️ Géométrie réutilisée: ${key} (refCount: ${this.geometries[key].refCount})`);
      return this.geometries[key].resource as T;
    }

    // Sinon, créer et mettre en cache
    const geometry = factory();
    this.geometries[key] = {
      resource: geometry,
      refCount: 1,
      createdAt: Date.now(),
    };

    this.log('info', `✅ Géométrie créée: ${key}`);
    return geometry;
  }

  /**
   * Libère une géométrie (refCount--)
   */
  disposeGeometry(key: string): void {
    const cached = this.geometries[key];
    if (!cached) {
      this.log('warnings', `⚠️ Tentative de dispose d'une géométrie inexistante: ${key}`);
      return;
    }

    cached.refCount--;
    this.log('verbose', `🔽 Géométrie refCount--: ${key} (refCount: ${cached.refCount})`);

    // Si refCount = 0, dispose réellement
    if (cached.refCount <= 0) {
      cached.resource.dispose();
      delete this.geometries[key];
      this.log('info', `🗑️ Géométrie disposée: ${key}`);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MATÉRIAUX
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Crée ou récupère un matériau du cache
   */
  createMaterial<T extends THREE.Material>(
    key: string,
    factory: () => T
  ): T {
    if (this.materials[key]) {
      this.materials[key].refCount++;
      this.log('verbose', `♻️ Matériau réutilisé: ${key} (refCount: ${this.materials[key].refCount})`);
      return this.materials[key].resource as T;
    }

    const material = factory();
    this.materials[key] = {
      resource: material,
      refCount: 1,
      createdAt: Date.now(),
    };

    this.log('info', `✅ Matériau créé: ${key}`);
    return material;
  }

  /**
   * Libère un matériau (refCount--)
   */
  disposeMaterial(key: string): void {
    const cached = this.materials[key];
    if (!cached) {
      this.log('warnings', `⚠️ Tentative de dispose d'un matériau inexistant: ${key}`);
      return;
    }

    cached.refCount--;
    this.log('verbose', `🔽 Matériau refCount--: ${key} (refCount: ${cached.refCount})`);

    if (cached.refCount <= 0) {
      cached.resource.dispose();
      delete this.materials[key];
      this.log('info', `🗑️ Matériau disposé: ${key}`);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TEXTURES
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Charge ou récupère une texture du cache
   */
  async loadTexture(
    url: string,
    options: {
      wrapS?: THREE.Wrapping;
      wrapT?: THREE.Wrapping;
      repeat?: { x: number; y: number };
      anisotropy?: number;
      encoding?: string;
    } = {}
  ): Promise<THREE.Texture> {
    const cacheKey = url;

    // Si déjà en cache, incrémenter refCount et retourner
    if (this.textures[cacheKey]) {
      this.textures[cacheKey].refCount++;
      this.log('verbose', `♻️ Texture réutilisée: ${url} (refCount: ${this.textures[cacheKey].refCount})`);
      return this.textures[cacheKey].resource;
    }

    // Sinon, charger
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      
      loader.load(
        url,
        (texture) => {
          // Appliquer les options
          if (options.wrapS) texture.wrapS = options.wrapS;
          if (options.wrapT) texture.wrapT = options.wrapT;
          if (options.repeat) texture.repeat.set(options.repeat.x, options.repeat.y);
          if (options.anisotropy) texture.anisotropy = options.anisotropy;
          // encoding property removed in newer Three.js versions
          // if (options.encoding) texture.encoding = options.encoding;

          // Mettre en cache
          this.textures[cacheKey] = {
            resource: texture,
            refCount: 1,
            createdAt: Date.now(),
          };

          this.log('info', `✅ Texture chargée: ${url}`);
          resolve(texture);
        },
        undefined,
        (error) => {
          this.log('errors', `❌ Erreur chargement texture: ${url}`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Libère une texture (refCount--)
   */
  disposeTexture(url: string): void {
    const cached = this.textures[url];
    if (!cached) {
      this.log('warnings', `⚠️ Tentative de dispose d'une texture inexistante: ${url}`);
      return;
    }

    cached.refCount--;
    this.log('verbose', `🔽 Texture refCount--: ${url} (refCount: ${cached.refCount})`);

    if (cached.refCount <= 0) {
      cached.resource.dispose();
      delete this.textures[url];
      this.log('info', `🗑️ Texture disposée: ${url}`);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // NETTOYAGE GLOBAL
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Dispose TOUTES les ressources (à utiliser au démontage de l'app)
   */
  disposeAll(): void {
    this.log('info', '🧹 Nettoyage de toutes les ressources...');

    // Géométries
    Object.keys(this.geometries).forEach((key) => {
      this.geometries[key].resource.dispose();
    });
    this.geometries = {};

    // Matériaux
    Object.keys(this.materials).forEach((key) => {
      this.materials[key].resource.dispose();
    });
    this.materials = {};

    // Textures
    Object.keys(this.textures).forEach((key) => {
      this.textures[key].resource.dispose();
    });
    this.textures = {};

    this.log('info', '✅ Toutes les ressources ont été nettoyées');
  }

  /**
   * Nettoie les ressources inutilisées (refCount = 0)
   */
  cleanupUnused(): void {
    let cleaned = 0;

    // Géométries
    Object.keys(this.geometries).forEach((key) => {
      if (this.geometries[key].refCount <= 0) {
        this.geometries[key].resource.dispose();
        delete this.geometries[key];
        cleaned++;
      }
    });

    // Matériaux
    Object.keys(this.materials).forEach((key) => {
      if (this.materials[key].refCount <= 0) {
        this.materials[key].resource.dispose();
        delete this.materials[key];
        cleaned++;
      }
    });

    // Textures
    Object.keys(this.textures).forEach((key) => {
      if (this.textures[key].refCount <= 0) {
        this.textures[key].resource.dispose();
        delete this.textures[key];
        cleaned++;
      }
    });

    if (cleaned > 0) {
      this.log('info', `🧹 ${cleaned} ressources inutilisées nettoyées`);
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MONITORING
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Retourne les statistiques d'utilisation
   */
  getStats() {
    return {
      geometries: {
        count: Object.keys(this.geometries).length,
        totalRefCount: Object.values(this.geometries).reduce((sum, g) => sum + g.refCount, 0),
      },
      materials: {
        count: Object.keys(this.materials).length,
        totalRefCount: Object.values(this.materials).reduce((sum, m) => sum + m.refCount, 0),
      },
      textures: {
        count: Object.keys(this.textures).length,
        totalRefCount: Object.values(this.textures).reduce((sum, t) => sum + t.refCount, 0),
      },
    };
  }

  /**
   * Affiche un rapport détaillé dans la console
   */
  printReport(): void {
    const stats = this.getStats();
    console.log('📊 ResourceManager Report:');
    console.log(`  Géométries: ${stats.geometries.count} (refs: ${stats.geometries.totalRefCount})`);
    console.log(`  Matériaux: ${stats.materials.count} (refs: ${stats.materials.totalRefCount})`);
    console.log(`  Textures: ${stats.textures.count} (refs: ${stats.textures.totalRefCount})`);
  }

  /**
   * Configure le niveau de log
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Log interne
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'development') return;

    const levels: LogLevel[] = ['none', 'errors', 'warnings', 'info', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex <= currentLevelIndex) {
      if (level === 'errors') {
        console.error(message, ...args);
      } else if (level === 'warnings') {
        console.warn(message, ...args);
      } else {
        console.log(message, ...args);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

export const resourceManager = new ResourceManager();

// Exposer en dev pour debug
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__resourceManager = resourceManager;
  console.log('💡 ResourceManager disponible via window.__resourceManager');
}

export default resourceManager;















