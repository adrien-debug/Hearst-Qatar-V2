import * as THREE from 'three';
import { getOptimalTextureSize } from './textureCache';
import { progressiveTextureLoader } from './progressiveTextureLoader';
import {
  createBlackMetalTexture,
  createConcreteTexture,
  createMetalNormalMap,
  createMetalRoughnessMap,
} from './textureHelpers';

/**
 * Utilitaires pour créer des matériaux PBR réalistes avec textures procédurales
 */

/**
 * Fonction helper pour assigner une texture de manière sécurisée
 * Ne assigne jamais null, seulement undefined ou une texture valide
 */
export function safeAssignTexture(
  material: THREE.MeshStandardMaterial,
  property: 'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'emissiveMap',
  texture: THREE.Texture | null | undefined
): void {
  if (texture === null) {
    // Ne jamais assigner null, utiliser undefined à la place
    (material as any)[property] = undefined;
  } else if (texture !== undefined) {
    (material as any)[property] = texture;
  }
  // Si texture est undefined, ne rien faire (laisser la valeur par défaut)
}

/**
 * Nettoie un matériau pour s'assurer qu'il n'a pas de textures null
 * Cette fonction doit être appelée après la création du matériau
 */
export function sanitizeMaterial(material: THREE.MeshStandardMaterial): void {
  const textureProperties: Array<'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'emissiveMap'> = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
  ];

  textureProperties.forEach(prop => {
    const texture = (material as any)[prop];
    if (texture === null) {
      (material as any)[prop] = undefined;
    }
  });

  // S'assurer que needsUpdate est à true si des textures ont été modifiées
  material.needsUpdate = true;
}

/**
 * Crée un matériau métallique PBR avancé - ULTRA-RÉALISTE avec textures haute résolution
 * Utilise le chargement progressif pour éviter les blocages
 */
export function createAdvancedMetalMaterial(
  color: string = '#4b5563',
  metalness: number = 0.8,
  roughness: number = 0.3,
  withRust: boolean = false
): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: metalness,
    roughness: roughness,
    envMapIntensity: 1.4, // Reflets plus prononcés pour réalisme
    side: THREE.DoubleSide,
  });

  // Charger les textures de manière progressive (basse résolution d'abord, puis haute)
  if (typeof window !== 'undefined') {
    const textureSize = getOptimalTextureSize();
    
    // Charger texture de base (basse résolution immédiatement)
    progressiveTextureLoader.loadProgressive(
      () => createBlackMetalTexture(256) || new THREE.Texture(),
      () => createBlackMetalTexture(textureSize) || new THREE.Texture(),
      `metal_${color}_${textureSize}`,
      { priority: 'medium', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'map', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs de chargement
    });

    // Charger normal map
    progressiveTextureLoader.loadProgressive(
      () => createMetalNormalMap(256) || new THREE.Texture(),
      () => createMetalNormalMap(textureSize) || new THREE.Texture(),
      `metal_normal_${textureSize}`,
      { priority: 'low', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'normalMap', texture);
        material.normalScale.set(1, 1);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs
    });

    // Charger roughness map
    progressiveTextureLoader.loadProgressive(
      () => createMetalRoughnessMap(256) || new THREE.Texture(),
      () => createMetalRoughnessMap(textureSize) || new THREE.Texture(),
      `metal_roughness_${textureSize}`,
      { priority: 'low', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'roughnessMap', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs
    });
  }

  return material;
}

/**
 * Crée un matériau béton PBR ULTRA-RÉALISTE avec textures haute résolution
 * Utilise le chargement progressif
 */
export function createConcreteMaterial(): THREE.MeshStandardMaterial {
  let textureSize = 512;
  try {
    if (typeof window !== 'undefined') {
      textureSize = getOptimalTextureSize();
    }
  } catch (e) {
    // Utiliser valeur par défaut
  }
  
  const material = new THREE.MeshStandardMaterial({
    metalness: 0.0,
    roughness: 0.9,
    color: '#9ca3af',
  });

  // Charger texture de béton de manière progressive
  if (typeof window !== 'undefined') {
    progressiveTextureLoader.loadProgressive(
      () => createConcreteTexture(256) || new THREE.Texture(),
      () => createConcreteTexture(textureSize) || new THREE.Texture(),
      `concrete_${textureSize}`,
      { priority: 'medium', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'map', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {
      // Ignorer les erreurs
    });
  }

  return material;
}

/**
 * Crée un matériau de container industriel avec usure - ULTRA-RÉALISTE
 * Utilise le chargement progressif
 */
export function createContainerMaterial(
  baseColor: string = '#1a1a1a',
  wearLevel: number = 0.3 // 0 = neuf, 1 = très usé
): THREE.MeshStandardMaterial {
  let textureSize = 512;
  try {
    if (typeof window !== 'undefined') {
      textureSize = getOptimalTextureSize();
    }
  } catch (e) {
    // Utiliser valeur par défaut
  }
  
  const material = new THREE.MeshStandardMaterial({
    color: baseColor,
    metalness: 0.3 + wearLevel * 0.15,
    roughness: 0.85 - wearLevel * 0.15, // Peinture industrielle matte
    envMapIntensity: 0.5,
    side: THREE.DoubleSide,
  });

  // Charger texture de container de manière progressive
  if (typeof window !== 'undefined') {
    // Texture de base
    progressiveTextureLoader.loadProgressive(
      () => createBlackMetalTexture(256) || new THREE.Texture(),
      () => createBlackMetalTexture(textureSize) || new THREE.Texture(),
      `container_${baseColor}_${textureSize}`,
      { priority: 'medium', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'map', texture);
        material.needsUpdate = true;
      }
    }).catch(() => {});

    // Normal map (chargée en arrière-plan)
    progressiveTextureLoader.loadProgressive(
      () => createMetalNormalMap(256) || new THREE.Texture(),
      () => createMetalNormalMap(textureSize) || new THREE.Texture(),
      `container_normal_${textureSize}`,
      { priority: 'low', lowResSize: 256, highResSize: textureSize }
    ).then((texture) => {
      if (texture && texture.image) {
        safeAssignTexture(material, 'normalMap', texture);
        material.normalScale.set(1, 1);
        material.needsUpdate = true;
      }
    }).catch(() => {});
  }

  if (wearLevel > 0.2) {
    material.roughness = 0.6 + wearLevel * 0.25;
  }

  return material;
}

/**
 * Crée un matériau ultra-réaliste pour les radiateurs en V - ALUMINIUM ANODISÉ BRILLANT
 */
export function createRadiatorMaterial(): THREE.MeshStandardMaterial {
  let textureSize = 512;
  try {
    if (typeof window !== 'undefined') {
      textureSize = getOptimalTextureSize();
    }
  } catch (e) {
    // Utiliser valeur par défaut
  }
  
  const material = new THREE.MeshStandardMaterial({
    color: '#e8e8e8', // Aluminium clair anodisé
    metalness: 0.95, // Métallique très brillant
    roughness: 0.15, // Surface très lisse et réfléchissante
    envMapIntensity: 1.8, // Reflets environnement très prononcés
    side: THREE.DoubleSide,
  });

  // Textures désactivées temporairement pour éviter les blocages
  // TODO: Réactiver de manière asynchrone après le premier rendu

  return material;
}

