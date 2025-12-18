/**
 * 🎯 CATALOGUE UNIFIÉ - LA SOURCE DE VÉRITÉ UNIQUE
 * 
 * Ce fichier est le SEUL endroit où les modèles 3D sont définis.
 * Tous les autres systèmes (galerie, placement, etc.) utilisent ce catalogue.
 */

import React from 'react';
import ContainerPlan3DViewer from './ContainerPlan3DViewer';
import SecurityFenceSectionWrapper from './SecurityFenceSectionWrapper';
import Transformer5MWWrapper, { Transformer5MWWrapperVariant2 } from './Transformer5MWWrapper';
import BarriereStandardWrapper from './BarriereStandardWrapper';
import CameraSecuriteWrapper from './CameraSecuriteWrapper';
import GolfCarWrapper from './GolfCarWrapper';
import PowerBlock25MWWrapper from './PowerBlock25MWWrapper';
import GroundPatch from './GroundPatch';
import HD5CoolingModule from './HD5CoolingModule';
import MetalStairsTwoStepsWrapper from './MetalStairsTwoStepsWrapper';
import ContainerDoorLockBarsWrapper from './ContainerDoorLockBarsWrapper';
import BigCameraPoleWrapper from './BigCameraPoleWrapper';

/**
 * Type de catégorie d'équipement
 */
export type EquipmentCategory = 'transformer' | 'container' | 'cooling' | 'power' | 'distribution' | 'generator' | 'ground' | 'environment';

/**
 * Interface pour un modèle 3D unifié
 */
export interface UnifiedModel {
  // Identification
  id: string;
  name: string;
  type: string; // Type technique (pour le code)
  category: EquipmentCategory;
  
  // Composant React 3D
  component: React.ComponentType<any>;
  
  // Métadonnées
  description: string;
  dimensions: {
    length: number; // en mètres
    width: number;
    height: number;
  };
  power?: string;
  thumbnail?: string;
  tags: string[];
  
  // Qualité et source
  quality: 'ultra-realistic' | 'high' | 'standard' | 'basic';
  source: 'photo-based' | 'sketchfab' | 'procedural';
  
  // Props par défaut pour le composant
  defaultProps?: Record<string, any>;
}

/**
 * 🏆 CATALOGUE UNIFIÉ - Tous les modèles 3D disponibles
 * 
 * Tous les modèles utilisent Gallery3DEnvironment pour une cohérence visuelle parfaite.
 */
export const UNIFIED_MODEL_CATALOG: UnifiedModel[] = [
  // ==================== SOLS & ENVIRONNEMENT (NOUVEAU) ====================
  {
    id: 'ground-asphalt-dark',
    name: 'Asphalte Foncé',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Revêtement routier bitumineux sombre, idéal pour les routes principales et zones de circulation lourde.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['route', 'bitume', 'asphalte', 'noir', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'asphalt', color: '#1F2937' },
  },
  {
    id: 'ground-asphalt-grey',
    name: 'Asphalte Usé',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Bitume gris clair, aspect vieilli pour les zones de manœuvre secondaires.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['route', 'bitume', 'gris', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'asphalt', color: '#4B5563' },
  },
  {
    id: 'ground-concrete-slab',
    name: 'Dalle Béton',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Dalle de béton industrielle lisse pour fondations et zones techniques.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['béton', 'dalle', 'fondation', 'gris', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'concrete', color: '#9CA3AF' },
  },
  {
    id: 'ground-concrete-dark',
    name: 'Béton Armé Foncé',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Béton haute densité sombre pour les zones de charge lourde.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['béton', 'foncé', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'concrete', color: '#6B7280' },
  },
  {
    id: 'ground-grass-fresh',
    name: 'Gazon Frais',
    type: 'ground-patch',
    category: 'environment',
    component: GroundPatch,
    description: 'Pelouse verte entretenue pour les zones paysagères et bases vie.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['herbe', 'gazon', 'vert', 'nature', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'grass', color: '#22c55e' },
  },
  {
    id: 'ground-grass-dry',
    name: 'Herbe Sèche',
    type: 'ground-patch',
    category: 'environment',
    component: GroundPatch,
    description: 'Végétation clairsemée et sèche, adaptée aux environnements arides.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['herbe', 'jaune', 'nature', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'grass', color: '#a3e635' },
  },
  {
    id: 'ground-gravel-grey',
    name: 'Gravier Concassé',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Lit de gravier gris pour drainage et zones de transformateurs.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['gravier', 'pierre', 'gris', 'drainage', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'gravel', color: '#52525b' },
  },
  {
    id: 'ground-gravel-white',
    name: 'Gravier Blanc',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Gravier décoratif blanc pour les allées piétonnes.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['gravier', 'blanc', 'déco', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'gravel', color: '#e4e4e7' },
  },
  {
    id: 'ground-stones-river',
    name: 'Galets de Rivière',
    type: 'ground-patch',
    category: 'environment',
    component: GroundPatch,
    description: 'Gros cailloux ronds pour l\'ornementation.',
    dimensions: { length: 10, width: 10, height: 0.2 },
    tags: ['cailloux', 'galets', 'pierre', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'gravel', color: '#78716c' },
  },
  {
    id: 'ground-sand-desert',
    name: 'Sable du Désert',
    type: 'ground-patch',
    category: 'environment',
    component: GroundPatch,
    description: 'Sable fin doré typique du Qatar.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['sable', 'désert', 'jaune', 'plage', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'sand', color: '#fbbf24' },
  },
  {
    id: 'ground-dirt-red',
    name: 'Terre Battue Rouge',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Sol en terre compactée rougeâtre.',
    dimensions: { length: 10, width: 10, height: 0.1 },
    tags: ['terre', 'rouge', 'sol', 'chantier'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'dirt', color: '#9f1239' },
  },
  {
    id: 'ground-water-pool',
    name: 'Eau (Piscine/Bassin)',
    type: 'ground-patch',
    category: 'environment',
    component: GroundPatch,
    description: 'Surface d\'eau bleue calme avec transparence.',
    dimensions: { length: 10, width: 5, height: 0.1 },
    tags: ['eau', 'bleu', 'piscine', 'liquide'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'water', color: '#3b82f6' },
  },
  {
    id: 'ground-paving-tiles',
    name: 'Pavés Autobloquants',
    type: 'ground-patch',
    category: 'ground',
    component: GroundPatch,
    description: 'Pavage pour trottoirs et zones piétonnes.',
    dimensions: { length: 10, width: 2, height: 0.1 },
    tags: ['pavé', 'trottoir', 'sol'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { type: 'paving', color: '#d1d5db' },
  },
  
  // ==================== FIN MATÉRIAUX ====================

  // ==================== CONTAINER PLAN 3D VIEWER ====================
  {
    id: 'container-plan-3d-viewer',
    name: 'Container Plan 3D Viewer',
    type: 'container-plan-3d-viewer',
    category: 'container',
    component: ContainerPlan3DViewer,
    description: 'Viewer 3D premium pour conteneur Bitmain/Antspace avec interface interactive complète.',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    power: '6 MW',
    thumbnail: '/download.jpg',
    tags: ['container', 'viewer', '3d', 'interactif', 'bitmain', 'antspace', 'premium', 'ultra-réaliste'],
    quality: 'ultra-realistic',
    source: 'photo-based',
    defaultProps: { containerId: 'default-container-plan' },
  },
  
  // ==================== ACCÈS CONTAINER (ESCALIER) ====================
  {
    id: 'metal-stairs-2-steps',
    name: 'Escalier Métal - 2 Marches',
    type: 'metal-stairs-2-steps',
    category: 'distribution',
    component: MetalStairsTwoStepsWrapper,
    description: 'Marchepied industriel 2 niveaux en caillebotis avec flasques latérales jaunes (autoporté).',
    dimensions: { length: 0.9, width: 1.6, height: 0.55 },
    thumbnail: '/download.jpg',
    tags: ['escalier', 'marches', 'métal', 'container', 'accès', '2', 'stairs', 'steel'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: {
      width: 1.6,
      stepDepth: 0.45,
      stepHeight: 0.26,
      frameThickness: 0.035,
      sideColor: '#F59E0B',
      treadColor: '#9CA3AF',
    },
  },
  
  // ==================== ACCESSOIRES CONTAINER (BARRES INOX) ====================
  {
    id: 'container-door-lock-bars',
    name: 'Barres Inox (Portes Container)',
    type: 'container-door-lock-bars',
    category: 'distribution',
    component: ContainerDoorLockBarsWrapper,
    description: '2 barres de verrouillage inox/argent (portes arrière de container) – asset séparé à placer manuellement.',
    dimensions: { length: 0.25, width: 2.438, height: 2.6 },
    thumbnail: '/download.jpg',
    tags: ['container', 'porte', 'barre', 'verrouillage', 'inox', 'argent', 'lock', 'bars'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: {
      containerWidth: 2.438,
      doorHeight: 2.6,
      edgeInset: 0.18,
      outwardOffset: 0.06,
      steelColor: '#E5E7EB',
      keeperColor: '#CBD5E1',
    },
  },

  // ==================== MODULE DE REFROIDISSEMENT HD5 ====================
  {
    id: 'hd5-cooling-module',
    name: 'Module de Refroidissement HD5',
    type: 'cooling-module',
    category: 'cooling',
    component: HD5CoolingModule,
    description: 'Module de refroidissement externe avec 12 ventilateurs et radiateurs en V.',
    dimensions: { length: 12.196, width: 2.438, height: 2.896 },
    power: 'Cooling',
    thumbnail: '/download.jpg',
    tags: ['refroidissement', 'ventilateur', 'cooling', 'hd5', 'bitmain', '12-fans'],
    quality: 'high',
    source: 'procedural',
    defaultProps: { 
      width: 12.196, 
      depth: 2.438, 
      height: 2.896 
    },
  },
  
  // ==================== SECURITY FENCE SECTION ====================
  {
    id: 'security-fence-section',
    name: 'Section de Barrière Sécurisée',
    type: 'security-fence-section',
    category: 'distribution',
    component: SecurityFenceSectionWrapper,
    description: 'Section de barrière sécurisée avec grillage noir métallique et barbelé au-dessus.',
    dimensions: { length: 5.0, width: 0.1, height: 2.5 },
    thumbnail: '/download.jpg',
    tags: ['barrière', 'sécurité', 'grillage', 'barbelé', 'ultra-réaliste', '3d'],
    quality: 'ultra-realistic',
    source: 'procedural',
    defaultProps: { fenceId: 'security-fence-default' },
  },
  
  // ==================== TRANSFORMATEUR 5 MW - VARIANTE 1 ====================
  {
    id: 'transformer-5mw-variant-1',
    name: 'Transformateur 5 MW - Standard',
    type: 'transformer-5mw',
    category: 'transformer',
    component: Transformer5MWWrapper,
    description: 'Transformateur haute tension de 5 MW - Modèle standard optimisé pour la performance.',
    dimensions: { length: 3.5, width: 2.5, height: 3.0 },
    power: '5 MW',
    thumbnail: '/download.jpg',
    tags: ['transformateur', '5mw', 'haute-tension', 'électrique', 'standard', 'coloré', '3d', 'glb'],
    quality: 'high',
    source: 'sketchfab',
    defaultProps: { 
      variant: 'variant-1', 
      transformerId: 'transformer-5mw-1',
      color: '#1a1a1a',
      secondaryColor: '#00A651',
    },
  },
  
  // ==================== TRANSFORMATEUR 5 MW - VARIANTE 2 ====================
  {
    id: 'transformer-5mw-variant-2',
    name: 'Transformateur 5 MW - Haute Qualité',
    type: 'transformer-5mw-hq',
    category: 'transformer',
    component: Transformer5MWWrapperVariant2,
    description: 'Transformateur haute tension de 5 MW - Modèle haute qualité avec détails ultra-réalistes.',
    dimensions: { length: 3.5, width: 2.5, height: 3.0 },
    power: '5 MW',
    thumbnail: '/download.jpg',
    tags: ['transformateur', '5mw', 'haute-tension', 'électrique', 'haute-qualité', 'ultra-réaliste', 'coloré', '3d', 'glb'],
    quality: 'ultra-realistic',
    source: 'sketchfab',
    defaultProps: { 
      transformerId: 'transformer-5mw-2',
      color: '#1a1a1a',
      secondaryColor: '#00A651',
    },
  },
  
  // ==================== BARRIÈRE STANDARD ====================
  {
    id: 'barriere-standard',
    name: 'Barrière Standard',
    type: 'barriere-standard',
    category: 'distribution',
    component: BarriereStandardWrapper,
    description: 'Barrière standard simple avec poteaux métalliques et barres horizontales.',
    dimensions: { length: 5.0, width: 0.1, height: 1.2 },
    thumbnail: '/download.jpg',
    tags: ['barrière', 'standard', 'poteaux', 'barres', 'métallique', 'simple', '3d'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { 
      barriereId: 'barriere-standard-default',
      length: 5.0,
      height: 1.2,
      numBars: 2,
      color: '#2c2c2c',
    },
  },
  
  // ==================== CAMÉRA DE SÉCURITÉ ====================
  {
    id: 'camera-securite',
    name: 'Caméra de Sécurité',
    type: 'camera-securite',
    category: 'distribution',
    component: CameraSecuriteWrapper,
    description: 'Caméra de surveillance avec support métallique et LED de statut.',
    dimensions: { length: 0.2, width: 0.15, height: 2.5 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'sécurité', 'surveillance', 'support', 'LED', '3d'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { 
      cameraId: 'camera-securite-default',
      color: '#1a1a1a',
      supportHeight: 2.5,
    },
  },
  
  // ==================== GRAND POTEAU + CAMÉRA FIXE ====================
  {
    id: 'big-camera-pole-fixed',
    name: 'Grand Poteau - Caméra Fixe',
    type: 'camera-pole-fixed',
    category: 'distribution',
    component: BigCameraPoleWrapper,
    description: 'Grand mât de surveillance avec grosse caméra fixe (type bullet).',
    dimensions: { length: 0.8, width: 0.8, height: 6.7 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'surveillance', 'poteau', 'mât', 'fixe', 'security', 'cctv'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: {
      poleId: 'big-camera-pole-fixed-default',
      variant: 'fixed',
      poleHeight: 6.5,
      poleRadius: 0.11,
      baseRadius: 0.28,
      baseHeight: 0.08,
    },
  },
  
  // ==================== GRAND POTEAU + CAMÉRA ROTATIVE (PTZ) ====================
  {
    id: 'big-camera-pole-ptz',
    name: 'Grand Poteau - Caméra Rotative (PTZ)',
    type: 'camera-pole-ptz',
    category: 'distribution',
    component: BigCameraPoleWrapper,
    description: 'Grand mât de surveillance avec grosse caméra rotative (PTZ) – rotation automatique.',
    dimensions: { length: 0.8, width: 0.8, height: 6.7 },
    thumbnail: '/download.jpg',
    tags: ['caméra', 'surveillance', 'poteau', 'mât', 'ptz', 'rotative', 'pan', 'tilt'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: {
      poleId: 'big-camera-pole-ptz-default',
      variant: 'ptz',
      poleHeight: 6.5,
      poleRadius: 0.11,
      baseRadius: 0.28,
      baseHeight: 0.08,
      panSpeed: 0.45,
      pitchAmplitude: 0.22,
      pitchSpeed: 0.7,
    },
  },
  
  // ==================== GOLF CAR ====================
  {
    id: 'golf-car',
    name: 'Golf Car',
    type: 'golf-car',
    category: 'distribution',
    component: GolfCarWrapper,
    description: 'Voiturette de golf colorée avec 4 roues, pare-brise et sièges.',
    dimensions: { length: 1.8, width: 1.0, height: 0.9 },
    thumbnail: '/download.jpg',
    tags: ['golf', 'car', 'voiturette', 'transport', 'roues', 'coloré', '3d'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { 
      golfCarId: 'golf-car-default',
      color: '#00A651',
    },
  },
  
  // ==================== POWER BLOCK 25 MW ====================
  {
    id: 'power-block-25mw',
    name: 'Power Block 25 MW',
    type: 'power-block-25mw',
    category: 'power',
    component: PowerBlock25MWWrapper,
    description: 'Bloc d\'alimentation de 25 MW avec ventilateurs de refroidissement, panneaux de contrôle et indicateurs LED.',
    dimensions: { length: 4.0, width: 2.5, height: 2.4 },
    power: '25 MW',
    thumbnail: '/download.jpg',
    tags: ['power', 'block', '25mw', 'alimentation', 'ventilateurs', 'LED', 'industriel', '3d'],
    quality: 'standard',
    source: 'procedural',
    defaultProps: { 
      powerBlockId: 'power-block-25mw-default',
      color: '#1a1a1a',
      secondaryColor: '#00A651',
    },
  },

  // ==================== ROUTE STANDARD ====================
  {
    id: 'road-standard',
    name: 'Route Standard (10m)',
    type: 'road',
    category: 'distribution',
    component: (props: any) => (
      <mesh {...props} receiveShadow>
        <boxGeometry args={[props.length || 10, 0.1, 4]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
    ),
    description: 'Segment de route asphaltée standard. Idéal pour créer des voies de circulation.',
    dimensions: { length: 10.0, width: 4.0, height: 0.1 },
    thumbnail: '/download.jpg',
    tags: ['route', 'asphalte', 'circulation', 'infra'],
    quality: 'basic',
    source: 'procedural',
    defaultProps: { length: 10, width: 4 },
  },

  // ==================== BÂTIMENT GÉNÉRIQUE ====================
  {
    id: 'building-generic',
    name: 'Bâtiment Modulaire',
    type: 'building',
    category: 'distribution',
    component: (props: any) => (
      <group {...props}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 4, 6]} />
          <meshStandardMaterial color="#bdc3c7" roughness={0.5} />
        </mesh>
      </group>
    ),
    description: 'Bâtiment modulaire polyvalent (Bureau, Stockage, Salle de contrôle).',
    dimensions: { length: 10.0, width: 6.0, height: 4.0 },
    thumbnail: '/download.jpg',
    tags: ['bâtiment', 'bureau', 'stockage', 'modulaire'],
    quality: 'basic',
    source: 'procedural',
    defaultProps: {},
  },

  // ==================== DRAPEAU QATAR ====================
  {
    id: 'flag-qatar',
    name: 'Drapeau Qatar',
    type: 'flag',
    category: 'distribution',
    component: (props: any) => (
      <group {...props}>
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 8]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
        <mesh position={[1.5, 7, 0]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#8a1538" />
        </mesh>
      </group>
    ),
    description: 'Drapeau du Qatar sur mât de 8m.',
    dimensions: { length: 1.0, width: 1.0, height: 8.0 },
    thumbnail: '/download.jpg',
    tags: ['drapeau', 'qatar', 'décoration'],
    quality: 'basic',
    source: 'procedural',
    defaultProps: {},
  }
];

/**
 * 🔍 Récupérer un modèle par son ID
 */
export function getModelById(id: string): UnifiedModel | undefined {
  const model = UNIFIED_MODEL_CATALOG.find(model => model.id === id);
  return model;
}

/**
 * 🔍 Récupérer un modèle par son type
 */
export function getModelByType(type: string): UnifiedModel | undefined {
  return UNIFIED_MODEL_CATALOG.find(model => model.type === type);
}

/**
 * 🔍 Récupérer tous les modèles d'une catégorie
 */
export function getModelsByCategory(category: EquipmentCategory): UnifiedModel[] {
  return UNIFIED_MODEL_CATALOG.filter(model => model.category === category);
}

/**
 * 🔍 Récupérer tous les modèles ultra-réalistes
 */
export function getUltraRealisticModels(): UnifiedModel[] {
  return UNIFIED_MODEL_CATALOG.filter(model => model.quality === 'ultra-realistic');
}

/**
 * 🔍 Récupérer tous les modèles basés sur photos
 */
export function getPhotoBasedModels(): UnifiedModel[] {
  return UNIFIED_MODEL_CATALOG.filter(model => model.source === 'photo-based');
}

/**
 * 🔍 Rechercher des modèles par tags
 */
export function searchModelsByTags(tags: string[]): UnifiedModel[] {
  return UNIFIED_MODEL_CATALOG.filter(model =>
    tags.some(tag => model.tags.includes(tag.toLowerCase()))
  );
}

/**
 * 🔍 Rechercher des modèles par texte
 */
export function searchModels(query: string): UnifiedModel[] {
  const lowerQuery = query.toLowerCase();
  return UNIFIED_MODEL_CATALOG.filter(model =>
    model.name.toLowerCase().includes(lowerQuery) ||
    model.description.toLowerCase().includes(lowerQuery) ||
    model.tags.some(tag => tag.includes(lowerQuery))
  );
}

/**
 * 📊 Obtenir les catégories disponibles avec compteurs
 */
export function getCategories(): Array<{ id: EquipmentCategory; label: string; icon: string; count: number }> {
  const categories = [
    { id: 'ground' as EquipmentCategory, label: 'Sols & Routes', icon: 'earth' },
    { id: 'environment' as EquipmentCategory, label: 'Environnement', icon: 'tree' },
    { id: 'transformer' as EquipmentCategory, label: 'Transformateurs', icon: 'lightning' },
    { id: 'container' as EquipmentCategory, label: 'Conteneurs', icon: 'cube' },
    { id: 'cooling' as EquipmentCategory, label: 'Refroidissement', icon: 'snowflake' },
    { id: 'power' as EquipmentCategory, label: 'Énergie', icon: 'battery' },
    { id: 'distribution' as EquipmentCategory, label: 'Distribution', icon: 'tool' },
    { id: 'generator' as EquipmentCategory, label: 'Générateurs', icon: 'cog' },
  ];
  
  return categories.map(cat => ({
    ...cat,
    count: UNIFIED_MODEL_CATALOG.filter(model => model.category === cat.id).length,
  }));
}

/**
 * 🎨 Rendu d'un modèle 3D avec ses props par défaut
 */
export function renderModel(model: UnifiedModel, additionalProps: Record<string, any> = {}) {
  const Component = model.component;
  const props = { ...model.defaultProps, ...additionalProps };
  return <Component {...props} />;
}
