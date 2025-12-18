/**
 * Générateur de Layout 100MW - Site Mining Qatar
 * ==============================================
 * 
 * CONFIGURATION:
 * - 4 Rangées
 * - Rangées 1-3: Pleine capacité (8 Transfos/rangée, 16 Conteneurs)
 * - Rangée 4: Repair Center (4 Transfos aux extrémités, Hangar central)
 * - Zone Vie (Base Life): Cantine, Dortoirs, située au SUD (Z positif)
 * - Entrée principale: Au SUD, à l'opposé de la Substation (Nord)
 * - Périmètre: Clôture élargie
 * 
 * UPDATE: Recentrage Global (Offset -150) pour centrer le site sur la scène.
 */

// Point d'origine GPS (Qatar - Zone Industrielle simulée)
const ORIGIN_GPS = {
  lat: 25.123456,
  lng: 51.567890
};

// Facteurs de conversion approximatifs pour le Qatar (Lat ~25°)
const METERS_TO_LAT = 1 / 110900;
const METERS_TO_LNG = 1 / 100900;

// GLOBAL OFFSET POUR RECENTRER LE SITE (Z)
const GLOBAL_OFFSET_Z = -150;

export interface EquipmentPosition {
  id: string;
  type: 'power-block' | 'transformer' | 'container' | 'foundation' | 'substation' | 'cable-path' 
        | 'road' | 'ground-patch' | 'fence' | 'building' | 'human' | 'barrier' | 'signage' | 'vegetation' | 'flag'
        | 'transformer-cage' | 'security-gate'
        // Extensions via catalogue unifié (assets placés depuis la bibliothèque)
        | 'metal-stairs-2-steps' | 'container-door-lock-bars'
        | 'camera-pole-fixed' | 'camera-pole-ptz'
        | 'security-cage'
        | 'parking-20'
        | 'industrial-hangar'
        | 'fire-station'
        | 'building-canteen'
        | 'building-dormitory'
        | 'logistics-zone';
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions?: { length: number; width: number; height: number };
  metadata?: {
    powerBlockId?: string;
    transformerId?: string;
    containerId?: string;
    power?: string;
    gps?: { lat: number; lng: number };
    from?: [number, number, number];
    to?: [number, number, number];
    /** Option: chemin multi-points pour un câble (rendu segmenté) */
    path?: Array<[number, number, number]>;
    buildingType?: 'dormitory' | 'canteen' | 'security' | 'repair-center' | 'warehouse';
    isWalkable?: boolean;
    color?: string; // Pour différencier visuellement (ex: routes vs trottoirs)
    type?: string; // Type de matériau/variant (ex: ground-patch: 'concrete' | 'asphalt' | ...)
    /**
     * Overrides matière (sliders) appliqués à l'objet rendu (si supporté par les matériaux Three.js).
     * Utilisé par la toolbar d'édition (Mining 100MW).
     */
    material?: {
      roughness?: number; // 0..1
      metalness?: number; // 0..1
      envMapIntensity?: number; // 0..5 (MeshStandard/Physical)
      emissiveIntensity?: number; // 0..5
      opacity?: number; // 0..1
    };
  };
}

/**
 * Dimensions des équipements (FIXES ET RÉALISTES)
 */
const DIMENSIONS = {
  substation: { length: 25.0, width: 15.0, height: 6.0 },
  powerBlock: { length: 12.192, width: 3.5, height: 3.2 }, // Standard 40ft High Cube élargi pour E-House
  transformerHV: { length: 4.5, width: 3.0, height: 3.2 },
  container: { length: 12.196, width: 2.438, height: 2.896 }, 
  foundationHeight: 0.4,
  // Nouveaux bâtiments
  repairCenter: { length: 20, width: 15, height: 8 },
  canteen: { length: 25, width: 15, height: 5 },
  dormitory: { length: 40, width: 12, height: 7 }, // R+1
  securityPost: { length: 4, width: 4, height: 3 },
  fenceSegment: { length: 4, width: 0.2, height: 2.5 }
};

/**
 * Calcule les coordonnées GPS
 */
function calculateGPS(x: number, z: number): { lat: number; lng: number } {
  return {
    lat: ORIGIN_GPS.lat - (z * METERS_TO_LAT),
    lng: ORIGIN_GPS.lng + (x * METERS_TO_LNG)
  };
}

/**
 * Génère la clôture périmétrique
 */
function generatePerimeter(minX: number, maxX: number, minZ: number, maxZ: number, entranceZ: number): EquipmentPosition[] {
  const items: EquipmentPosition[] = [];
  const step = DIMENSIONS.fenceSegment.length;
  
  // Fonction helper pour ajouter un segment (avec offset)
  const addFence = (x: number, z: number, rotY: number, idSuffix: string) => {
    // Si on est proche de l'entrée, on ne met pas de barrière mais un poste de garde
    if (Math.abs(z - entranceZ) < 10 && Math.abs(x) < 10 && z > maxZ - 20) return;

    // APPLIQUER GLOBAL OFFSET ICI
    const finalZ = z + GLOBAL_OFFSET_Z;

    items.push({
      id: `FENCE_${idSuffix}`,
      type: 'fence',
      position: [x, DIMENSIONS.fenceSegment.height/2, finalZ],
      rotation: [0, rotY, 0],
      dimensions: DIMENSIONS.fenceSegment,
      metadata: { gps: calculateGPS(x, finalZ) }
    });
  };

  // Nord & Sud (bords X)
  for (let x = minX; x <= maxX; x += step) {
    addFence(x, minZ, 0, `N_${x}`); // Nord
    addFence(x, maxZ, 0, `S_${x}`); // Sud
  }

  // Est & Ouest (bords Z)
  for (let z = minZ; z <= maxZ; z += step) {
    addFence(minX, z, Math.PI/2, `W_${z}`); // Ouest
    addFence(maxX, z, Math.PI/2, `E_${z}`); // Est
  }

  // Barrière véhicule à l'entrée (Au SUD) - TYPE CHANGE POUR SECURITY-GATE (Visible et stylé)
  items.push({
    id: 'ENTRANCE_BARRIER_MAIN',
    type: 'security-gate', // Nouveau type géré par le renderer
    position: [0, 0, entranceZ + GLOBAL_OFFSET_Z],
    rotation: [0, 0, 0], // Aligné sur X (ferme la route qui est sur Z)
    dimensions: { length: 8, width: 0.5, height: 1.2 }, // Longueur 8m pour couvrir la route
    metadata: { gps: calculateGPS(0, entranceZ + GLOBAL_OFFSET_Z) }
  });

  // Poste de sécurité (Au SUD)
  items.push({
    id: 'SECURITY_POST',
    type: 'building',
    position: [6, DIMENSIONS.securityPost.height/2, entranceZ + GLOBAL_OFFSET_Z],
    rotation: [0, -0.5, 0],
    dimensions: DIMENSIONS.securityPost,
    metadata: { 
      buildingType: 'security',
      gps: calculateGPS(6, entranceZ + GLOBAL_OFFSET_Z)
    }
  });

  return items;
}

/**
 * Génère la Base Vie (Life Base)
 */
function generateLifeBase(centerX: number, centerZ: number): EquipmentPosition[] {
  const items: EquipmentPosition[] = [];
  const yBase = 0.2;
  const finalCenterZ = centerZ + GLOBAL_OFFSET_Z;

  // TOUT EST SUPPRIMÉ ICI SELON TES DERNIÈRES DEMANDES (PARKING, CANTINE, DORTOIR)
  // Je laisse la fonction vide pour l'instant si tu veux remettre des choses plus tard.

  return items;
}

/**
 * Génère une enceinte de sécurité autour d'un transformateur
 */
function generateTransformerFence(
  id: string,
  center: [number, number, number],
  dim: { length: number, width: number, height: number }
): EquipmentPosition[] {
  const items: EquipmentPosition[] = [];
  const margin = 1.0; // Marge de sécurité de 1m
  const fenceHeight = 2.0;
  const fenceWidth = 0.05; // Épaisseur grille

  const w = dim.width + margin * 2;
  const l = dim.length + margin * 2;
  
  // CORRECTION: La clôture est posée au sol, donc son centre vertical est à center[1] + fenceHeight/2
  const y = center[1] + fenceHeight/2;

  // Nord (Z-)
  items.push({
    id: `${id}_FENCE_N`,
    type: 'fence',
    position: [center[0], y, center[2] - l/2],
    dimensions: { length: w, width: fenceWidth, height: fenceHeight },
    rotation: [0, 0, 0],
    metadata: { color: '#c0392b' } // Rouge danger
  });

  // Sud (Z+)
  items.push({
    id: `${id}_FENCE_S`,
    type: 'fence',
    position: [center[0], y, center[2] + l/2],
    dimensions: { length: w, width: fenceWidth, height: fenceHeight },
    rotation: [0, 0, 0],
    metadata: { color: '#c0392b' }
  });

  // Est (X+)
  items.push({
    id: `${id}_FENCE_E`,
    type: 'fence',
    position: [center[0] + w/2, y, center[2]],
    dimensions: { length: l, width: fenceWidth, height: fenceHeight },
    rotation: [0, Math.PI/2, 0],
    metadata: { color: '#c0392b' }
  });

  // Ouest (X-)
  items.push({
    id: `${id}_FENCE_W`,
    type: 'fence',
    position: [center[0] - w/2, y, center[2]],
    dimensions: { length: l, width: fenceWidth, height: fenceHeight },
    rotation: [0, Math.PI/2, 0],
    metadata: { color: '#c0392b' }
  });

  return items;
}

/**
 * Génère une zone de sécurité (Gravier + Barrière) autour d'un ensemble PowerBlock + Transfos
 */
function generatePowerBlockSecurityZone(
  id: string,
  centerZ: number,
  side: 'left' | 'right',
  dimensions: { width: number, length: number }
): EquipmentPosition[] {
  const items: EquipmentPosition[] = [];
  
  // Calcul du centre de la zone
  // Side Right: De X=28 à X=98 (Largeur 70m). Centre X = 63.
  // Side Left: De X=-98 à X=-28. Centre X = -63.
  const centerX = side === 'right' ? 63 : -63;

  // 2. Barrière Périmétrique (Clôture de sécurité)
  const w = dimensions.width;
  const l = dimensions.length;
  const fenceH = 2.0;
  
  // Fonction helper fence
  const addFence = (fid: string, x: number, z: number, rY: number, len: number) => {
    items.push({
      id: fid,
      type: 'fence',
      position: [x, fenceH/2, z],
      rotation: [0, rY, 0],
      dimensions: { length: len, width: 0.1, height: fenceH },
      metadata: { color: '#bdc3c7' } // Gris clair (galvanisé)
    });
  };

  // Nord
  addFence(`${id}_SEC_FENCE_N`, centerX, centerZ - l/2, 0, w);
  // Sud
  addFence(`${id}_SEC_FENCE_S`, centerX, centerZ + l/2, 0, w);
  // Est
  addFence(`${id}_SEC_FENCE_E`, centerX + w/2, centerZ, Math.PI/2, l);
  // Ouest
  addFence(`${id}_SEC_FENCE_W`, centerX - w/2, centerZ, Math.PI/2, l);

  return items;
}

/**
 * Génère une plaque métallique de passage de câble de 1m de large
 */
function generateHeavyCableTray(
  id: string,
  start: [number, number, number], 
  end: [number, number, number]    
): EquipmentPosition[] {
  const items: EquipmentPosition[] = [];
  
  // Paramètres demandés
  const plateWidth = 1.0;  // 1 mètre de largeur
  const plateThickness = 0.05; // Épaisseur fine pour "plaque métal"
  
  // Coordonnées Y fixes pour les paliers
  const startY = start[1];
  const endY = end[1];

  // Calcul du vecteur horizontal (distance au sol)
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const totalDistHorizontal = Math.sqrt(dx*dx + dz*dz);
  
  // Longueur de chaque section horizontale (1/3 de la distance totale)
  const sectionLen = totalDistHorizontal / 3;

  // Angle d'orientation global (Rotation Y)
  const angleY = Math.atan2(dx, dz); 

  // --- SECTION 1 : HORIZONTALE HAUTE (0% à 33%) ---
  const ratio1 = 1/6;
  const x1 = start[0] + dx * ratio1;
  const z1 = start[2] + dz * ratio1;

  items.push({
    id: `${id}_HIGH`,
    type: 'road', // Utilise un mesh Box standard
    position: [x1, startY, z1],
    dimensions: { length: sectionLen, width: plateWidth, height: plateThickness }, 
    rotation: [0, angleY, 0],
    metadata: { color: '#bdc3c7' } // Gris métal clair
  });

  // --- SECTION 3 : HORIZONTALE BASSE (66% à 100%) ---
  const ratio3 = 5/6;
  const x3 = start[0] + dx * ratio3;
  const z3 = start[2] + dz * ratio3;

  items.push({
    id: `${id}_LOW`,
    type: 'road',
    position: [x3, endY, z3],
    dimensions: { length: sectionLen, width: plateWidth, height: plateThickness },
    rotation: [0, angleY, 0],
    metadata: { color: '#bdc3c7' }
  });

  // --- SECTION 2 : PENTE (33% à 66%) ---
  const ratio2 = 0.5;
  const x2 = start[0] + dx * ratio2;
  const z2 = start[2] + dz * ratio2;
  const y2 = (startY + endY) / 2; // Moyenne des hauteurs

  // Pythagore pour la longueur réelle de la plaque inclinée
  const heightDiff = startY - endY;
  const slopeHypotenuse = Math.sqrt(sectionLen * sectionLen + heightDiff * heightDiff);
  
  // Calcul de l'angle de tangage (Pitch / Rotation X)
  const pitchAngle = Math.atan2(heightDiff, sectionLen);

  items.push({
    id: `${id}_SLOPE`,
    type: 'road',
    position: [x2, y2, z2],
    dimensions: { length: slopeHypotenuse, width: plateWidth, height: plateThickness },
    rotation: [pitchAngle, angleY, 0], 
    metadata: { color: '#a0a0a0' } // Gris un peu plus sombre pour le relief
  });

  // --- 4. 3 CÂBLES QUI SE FIXENT SUR LES 3 TÊTES CÔTÉ TRANSFO ---
  if (totalDistHorizontal > 0.001) {
    const dirX = dx / totalDistHorizontal;
    const dirZ = dz / totalDistHorizontal;
    // Vecteur perpendiculaire horizontal (pour espacer les 3 têtes)
    const perpX = dirZ;
    const perpZ = -dirX;

    // Câble posé "sur" la plaque (éviter l'intersection / z-fighting)
    const cableRadius = 0.06;
    const liftY = plateThickness / 2 + cableRadius + 0.01;

    // Points de trajectoire (centre de la plaque) aux jonctions 0% / 33% / 66% / 100%
    const p0: [number, number, number] = [start[0], startY + liftY, start[2]];
    const p1: [number, number, number] = [
      start[0] + dx * (1 / 3),
      startY + liftY,
      start[2] + dz * (1 / 3),
    ];
    const p2: [number, number, number] = [
      start[0] + dx * (2 / 3),
      endY + liftY,
      start[2] + dz * (2 / 3),
    ];
    const p3: [number, number, number] = [end[0], endY + liftY, end[2]];

    // 3 câbles parallèles sur le chemin (espacement suffisant pour être visible)
    const headOffsets = [-0.4, 0, 0.4];
    headOffsets.forEach((off, i) => {
      const headEnd: [number, number, number] = [
        end[0] + perpX * off,
        endY, // fixation sur la tête (légèrement plus bas que le chemin)
        end[2] + perpZ * off,
      ];

      const color = '#111827'; // câble noir industriel

      // Décaler aussi le chemin complet pour éviter que les 3 câbles se superposent sur la plaque
      const q0: [number, number, number] = [p0[0] + perpX * off, p0[1], p0[2] + perpZ * off];
      const q1: [number, number, number] = [p1[0] + perpX * off, p1[1], p1[2] + perpZ * off];
      const q2: [number, number, number] = [p2[0] + perpX * off, p2[1], p2[2] + perpZ * off];
      const q3: [number, number, number] = [p3[0] + perpX * off, p3[1], p3[2] + perpZ * off];

      items.push({
        id: `${id}_WIRE_${i + 1}`,
        type: 'cable-path',
        position: q0,
        rotation: [0, 0, 0],
        metadata: {
          color,
          path: [q0, q1, q2, q3, headEnd],
        }
      });
    });
  }

  return items;
}

/**
 * Génère le Layout Unique Optimisé
 */
export function generateMining100MWLayout(): EquipmentPosition[] {
  const equipment: EquipmentPosition[] = [];
  const yBase = DIMENSIONS.foundationHeight;
  const yEquip = yBase;

  // --- PARAMÈTRES ÉLARGIS ---
  // Espacement rangées: 70m
  // Dalle Z (Longueur): 55m 
  // Dalle X (Largeur): 160m (Augmenté de 120m à 160m pour accomoder le double PB + écartement)
  const pbSpacingZ = 70; 
  const slabLengthZ = 55;
  const slabWidthX = 160;
  const spineRoadWidth = 12; // Largeur de la voie centrale unifiée
  
  // --- ZONES GEOGRAPHIQUES (RELATIVES, OFFSET APPLIQUÉ UNE SEULE FOIS) ---
  const toWorldZ = (z: number) => z + GLOBAL_OFFSET_Z;
  const zSubstation = -60;
  const zMiningStart = 0;
  const zMiningEnd = zMiningStart + (3 * pbSpacingZ) + (slabLengthZ / 2);
  
  // Fin "réelle" (relatif) en incluant l'extension des containers de la dernière rangée
  const distZ = 18.0; // Distance entre transfo et container (sur Z)
  const lastRowZ_Rel = zMiningStart + (3 * pbSpacingZ); // 210 (relatif)
  const containerBMaxZ_Rel = lastRowZ_Rel + distZ + (DIMENSIONS.container.length / 2); // 234.096 (relatif)
  const zMiningEndWithContainersRel = containerBMaxZ_Rel + 10; // marge (relatif)
  
  // Nouvelle zone entrée au SUD (relatif)
  const zLifeBase = zMiningEndWithContainersRel + 80;
  const zEntrance = zLifeBase + 40;
  
  // Limites du site pour la clôture (Élargies)
  const siteBounds = {
    minX: -100, maxX: 100, // Élargi de 80 à 100
    minZ: -100, maxZ: zEntrance + 20
  };

  // 1. CLÔTURE & ENTRÉE (Au SUD désormais) - OFFSET APPLIQUÉ DANS LA FONCTION
  equipment.push(...generatePerimeter(siteBounds.minX, siteBounds.maxX, siteBounds.minZ, siteBounds.maxZ, zEntrance));

  // 2. BASE VIE (Déplacée au SUD) - OFFSET APPLIQUÉ DANS LA FONCTION
  equipment.push(...generateLifeBase(0, zLifeBase));

  // --- REGENERATION BASE VIE (Réaliste) ---
  // On remplace le vide par les nouveaux bâtiments
  
  const lifeBaseZ = zLifeBase + GLOBAL_OFFSET_Z;
  
  // 1. CANTINE (Ouest de la route centrale) - X négatif
  equipment.push({
    id: 'LIFE_BASE_CANTEEN',
    type: 'building-canteen',
    position: [-25, 0, lifeBaseZ], // X=-25
    rotation: [0, 0, 0], // Face au Nord ou Sud
    dimensions: { length: 15, width: 25, height: 5 },
    metadata: { power: 'Canteen', gps: calculateGPS(-25, lifeBaseZ) }
  });

  // 2. DORTOIRS (Est de la route centrale) - X positif
  // Dortoir 1
  equipment.push({
    id: 'LIFE_BASE_DORM_1',
    type: 'building-dormitory',
    position: [25, 0, lifeBaseZ], // X=25
    rotation: [0, 0, 0],
    dimensions: { length: 12, width: 40, height: 7 }, // 40m de long (10 chambres par étage)
    metadata: { power: 'Dormitory A', gps: calculateGPS(25, lifeBaseZ) }
  });

  // Dortoir 2 (Juste derrière ou à côté)
  equipment.push({
    id: 'LIFE_BASE_DORM_2',
    type: 'building-dormitory',
    position: [25, 0, lifeBaseZ + 20], // 20m derrière
    rotation: [0, 0, 0],
    dimensions: { length: 12, width: 40, height: 7 },
    metadata: { power: 'Dormitory B', gps: calculateGPS(25, lifeBaseZ + 20) }
  });

  // Route centrale Piétonne Base Vie (Goudronnée)
  // Entre Cantine (-25) et Dortoir (25) -> Centre 0
  // On relie à la route principale
  /*
  equipment.push({
    id: 'LIFE_BASE_MAIN_WALKWAY',
    type: 'road',
    position: [0, yBase + 0.05, lifeBaseZ + 10], // Au milieu de la zone
    dimensions: { length: 60, width: 10, height: 0.1 }, // width=10 (X), length=60 (Z)
    rotation: [0, 0, 0],
    metadata: { color: '#1a1a1a' }
  });
  */

    // 3. ROUTE PRINCIPALE (AU SOL)
    const roadHeight = 0.05;
  const roadY = (roadHeight / 2) + 0.005; // léger offset au-dessus du sol (H1: z-fighting sable)
  const roadZStartWorld = toWorldZ(zEntrance);
  const roadZMiningEndWorld = toWorldZ(zMiningEndWithContainersRel);
  const lifeBaseCenterZWorld = toWorldZ(zLifeBase);
  const lifeBaseHalfLenZ = 60 / 2;
  const lifeBaseGapZ = 5;
  const lifeBaseZMin = lifeBaseCenterZWorld - lifeBaseHalfLenZ - lifeBaseGapZ;
  const lifeBaseZMax = lifeBaseCenterZWorld + lifeBaseHalfLenZ + lifeBaseGapZ;
  const northSegStart = roadZMiningEndWorld;
  const northSegEnd = lifeBaseZMin;
  const southSegStart = lifeBaseZMax;
  const southSegEnd = roadZStartWorld;
  
  const pushRoadSegment = (id: string, zA: number, zB: number) => {
    const length = Math.abs(zA - zB);
    if (length < 0.5) return; 
    const centerZ = (zA + zB) / 2;
    
    // 1. GOUDRON NOIR PROFOND MONOBLOC
    equipment.push({
      id: `${id}_ASPHALT`,
      type: 'road',
      position: [0, roadY, centerZ],
      dimensions: { length, width: spineRoadWidth, height: roadHeight },
      rotation: [0, 0, 0],
      metadata: { 
        color: '#1a1a1a',
        material: { roughness: 0.9, metalness: 0.1 },
        gps: calculateGPS(0, centerZ) 
      }
    });

    // 2. MARQUAGES AU SOL (CONTINUITÉ AVEC LES LATÉRALES)
    const stripWidth = 0.25;
    const markY = roadY + 0.01;
    const laneOffset = (spineRoadWidth / 2) - 1.4;

    // Ligne Gauche
    equipment.push({
      id: `${id}_LINE_L`,
      type: 'road',
      position: [-laneOffset, markY, centerZ],
      dimensions: { length, width: stripWidth, height: 0.005 }, // length est Z pour la route principale
      rotation: [0, 0, 0],
      metadata: { color: '#ffffff', material: { emissiveIntensity: 0.5 } }
    });

    // Ligne Droite
    equipment.push({
      id: `${id}_LINE_R`,
      type: 'road',
      position: [laneOffset, markY, centerZ],
      dimensions: { length, width: stripWidth, height: 0.005 },
      rotation: [0, 0, 0],
      metadata: { color: '#ffffff', material: { emissiveIntensity: 0.5 } }
    });
  };
  
  // Segment Nord: mining -> avant Base Vie
  pushRoadSegment('MAIN_ROAD_NORTH', northSegStart, northSegEnd);
  // Segment Sud: après Base Vie -> entrée
  pushRoadSegment('MAIN_ROAD_SOUTH', southSegStart, southSegEnd);
  
  // Route vers la Substation (Nord) - Corridor central (au sol)
  const roadToSubstationZStart = roadZMiningEndWorld;
  const roadToSubstationZEnd = toWorldZ(zSubstation);
  pushRoadSegment('ROAD_TO_SUBSTATION', roadToSubstationZStart, roadToSubstationZEnd);

  // Parvis technique devant la Substation (Zone de manœuvre élargie en goudron noir)
  const subForecourtZ = toWorldZ(zSubstation) + (DIMENSIONS.substation.length / 2) + 8; // Centré à 8m devant
  equipment.push({
      id: 'SUBSTATION_FORECOURT',
      type: 'road',
      position: [0, roadY, subForecourtZ],
      dimensions: { length: 16, width: 26, height: roadHeight }, // 16m prof x 26m large
      rotation: [0, 0, 0],
      metadata: { 
        color: '#1a1a1a', 
        material: { roughness: 0.9, metalness: 0.1 }
      }
  });

  // --- 4. SUBSTATION (Tête de site, reste au Nord) ---
  const subPos: [number, number, number] = [0, yEquip + DIMENSIONS.substation.height/2, zSubstation + GLOBAL_OFFSET_Z];
  equipment.push({
    id: 'SUBSTATION_MAIN',
    type: 'substation',
    position: subPos,
    rotation: [0, 0, 0],
    dimensions: DIMENSIONS.substation,
    metadata: { power: '100MW HV Station', gps: calculateGPS(subPos[0], subPos[2]) }
  });

  // --- 5. MINING ROWS (PEIGNE INDUSTRIEL ÉLARGI) ---
  const spineLength = (4 * pbSpacingZ);

  // Offsets pour 8 Transfos sur 160m de large
  const trOffsetsFull = [
    { x: -66, side: 'left' }, { x: -54, side: 'left' }, { x: -42, side: 'left' }, { x: -30, side: 'left' },
    { x: 30, side: 'right' }, { x: 42, side: 'right' }, { x: 54, side: 'right' }, { x: 66, side: 'right' }
  ];

  // Offsets pour Repair Center (Rangée 4) - Droite Complète (4 Transfos), Gauche Vide
  const trOffsetsRepair = [
    // Gauche (Sera filtré par la logique, mais on peut les omettre ici directement)
    { x: -66, side: 'left' }, { x: -54, side: 'left' }, // On garde pour la structure si besoin
    // Droite COMPLÈTE (4 Transfos)
    { x: 30, side: 'right' }, { x: 42, side: 'right' }, { x: 54, side: 'right' }, { x: 66, side: 'right' }
  ];

  for (let i = 0; i < 4; i++) {
    const pbZ_Relative = zMiningStart + (i * pbSpacingZ);
    const pbZ = pbZ_Relative + GLOBAL_OFFSET_Z; // Z FINAL

    const pbId = `PB${i+1}`;
    const isRepairRow = (i === 3); // REACTIVATION DU REPAIR CENTER (Rangée 4)

    // AJOUT: ZONE DE SÉCURITÉ (Gravier + Clôture)
    const secZoneDim = { width: 74, length: 60 };
    
    /* SUPPRIME: On n'affiche plus les barrières intérieures autour des sections
    // Zone Gauche (sauf Repair Row)
    if (!isRepairRow) {
       equipment.push(...generatePowerBlockSecurityZone(`${pbId}_SEC_L`, pbZ, 'left', secZoneDim));
    }
    
    // Zone Droite (Toujours)
    equipment.push(...generatePowerBlockSecurityZone(`${pbId}_SEC_R`, pbZ, 'right', secZoneDim));
    */
    
      // POWER BLOCKS (DOUBLE: GAUCHE et DROITE)
    const pbOffset = 90; 

    // PB GAUCHE (West) - Sauf sur Repair Row où il y a le Hangar
    if (!isRepairRow) {
      const pbPosL: [number, number, number] = [-pbOffset, yEquip, pbZ];
      
      // 1. Fondation individuelle pour PB Gauche (REACTIVÉE - Béton sous PB)
      equipment.push({
        id: `${pbId}_FOUNDATION_L`,
        type: 'foundation',
        position: [-pbOffset, yBase/2, pbZ],
        rotation: [0, 0, 0],
        dimensions: { length: 14, width: 6, height: 0.4 } // Épaisseur 40cm
      });

      equipment.push({
        id: `${pbId}_L`,
        type: 'power-block',
        position: pbPosL,
        rotation: [0, Math.PI/2, 0], // Tourné de 90° pour s'aligner sur Z
        dimensions: DIMENSIONS.powerBlock,
        metadata: { power: '20MW E-House L', gps: calculateGPS(pbPosL[0], pbPosL[2]) }
      });
    }

    // PB DROITE (East) - Présent même sur Repair Row (alimente les transfos de droite)
    const pbPosR: [number, number, number] = [pbOffset, yEquip, pbZ];
    
    // Fondation individuelle pour PB Droite (REACTIVÉE - Béton sous PB)
    equipment.push({
      id: `${pbId}_FOUNDATION_R`,
      type: 'foundation',
      position: [pbOffset, yBase/2, pbZ],
      rotation: [0, 0, 0],
      dimensions: { length: 14, width: 6, height: 0.4 } // Épaisseur 40cm
    });

    equipment.push({
      id: `${pbId}_R`,
      type: 'power-block',
      position: pbPosR,
      rotation: [0, Math.PI/2, 0], // Tourné de 90° pour s'aligner sur Z
      dimensions: DIMENSIONS.powerBlock,
      metadata: { power: '20MW E-House R', gps: calculateGPS(pbPosR[0], pbPosR[2]) }
    });

    // CONSTANTE DE DISTANCE (Définie ici pour être utilisée par les clôtures et trottoirs)
    const distZ = (slabLengthZ / 2) - (DIMENSIONS.container.length / 2);

    // ZONE INTER-RANGÉES (Gap de sable entre les dalles) - Comblé par une route de liaison
    if (i < 3) {
      equipment.push({
        id: `INTER_ROW_ROAD_${i}`,
        type: 'road',
        position: [0, yBase + 0.05, pbZ + 35], // Surélevé (0.45)
        dimensions: { length: 15, width: slabWidthX, height: 0.1 }, // width=160 (X), length=15 (Z)
        rotation: [0, 0, 0], // S'étend sur X
        metadata: { color: '#7f8c8d' }
      });
    }

    // ZONE DE CIRCULATION EXTÉRIEURE (DEVANT LES PORTES AVEC BARRES INOX)
    const walkwayWidth = 6.0; // Élargi à 6m pour avoir la place (Piéton + Chantier + Piéton)
    const marginFromSlab = 1.5; 
    
    const walkwayZ_North = pbZ - (slabLengthZ / 2) - marginFromSlab - (walkwayWidth / 2);
    const walkwayZ_South = pbZ + (slabLengthZ / 2) + marginFromSlab + (walkwayWidth / 2);

    // Définition des segments Gauche et Droite pour ne pas chevaucher la route centrale (Spine)
    const spineHalfWidth = spineRoadWidth / 2;
    
    const segments = [];
    
    // Segment Gauche (sauf Repair Row)
    if (!isRepairRow) {
      segments.push({
        start: -90,
        end: -spineHalfWidth,
        idSuffix: 'L'
      });
    }
    
    // Segment Droite
    segments.push({
      start: spineHalfWidth,
      end: 90,
      idSuffix: 'R'
    });

    segments.forEach(seg => {
      const segLen = Math.abs(seg.end - seg.start);
      const segCenter = (seg.start + seg.end) / 2;

      // Fonction helper pour créer une route et ses marquages
      const createWalkwayWithMarkings = (zPos: number, side: 'NORTH' | 'SOUTH') => {
         const baseId = `${pbId}_WALKWAY_${side}_${seg.idSuffix}`;
         
         // 1. Le Goudron - BEAU NOIR PROFOND
         equipment.push({
           id: `${baseId}_ASPHALT`,
           type: 'road',
           position: [segCenter, roadY, zPos], 
           dimensions: { length: walkwayWidth, width: segLen, height: roadHeight }, // width est sur X
           rotation: [0, 0, 0],
           metadata: { 
             color: '#1a1a1a',
             material: { roughness: 0.9, metalness: 0.1 } 
           } 
         });

         // 2. Marquages au sol (Lignes Blanches)
         const stripWidth = 0.25; // Épaissi de 0.15 à 0.25
         const pedestrianLaneWidth = 1.4;
         const markY = roadY + 0.01; // Bien surélevé (+1cm) pour éviter le z-fighting avec le noir

         // Ligne de séparation Piéton/Chantier (Côté Nord de la route)
         equipment.push({
           id: `${baseId}_LINE_N`,
           type: 'road',
           position: [segCenter, markY, zPos - (walkwayWidth/2) + pedestrianLaneWidth],
           dimensions: { length: stripWidth, width: segLen, height: 0.005 }, // Hauteur 5mm
           rotation: [0, 0, 0],
           metadata: { color: '#ffffff', material: { emissiveIntensity: 0.5 } } // Légèrement émissif pour ressortir
         });

         // Ligne de séparation Piéton/Chantier (Côté Sud de la route)
         equipment.push({
           id: `${baseId}_LINE_S`,
           type: 'road',
           position: [segCenter, markY, zPos + (walkwayWidth/2) - pedestrianLaneWidth],
           dimensions: { length: stripWidth, width: segLen, height: 0.005 },
           rotation: [0, 0, 0],
           metadata: { color: '#ffffff', material: { emissiveIntensity: 0.5 } }
         });
      };

      createWalkwayWithMarkings(walkwayZ_North, 'NORTH');
      createWalkwayWithMarkings(walkwayZ_South, 'SOUTH');
    });

    // REPAIR CENTER SPECIFIQUE (Rangée 4, Côté Gauche / Ouest)
    if (isRepairRow) {
       // On ne génère PAS les conteneurs à GAUCHE (offsets négatifs)
       // On génère ici le Repair Center (3 Hangars)
       // Décalage vers la gauche pour laisser la place au parking (comme avant)
       
       const hangarCentersX = [-80, -60, -40]; 
       
       hangarCentersX.forEach((hx, i) => {
         equipment.push({
           id: `REPAIR_CENTER_HANGAR_${i+1}`,
           type: 'industrial-hangar',
           position: [hx, yEquip, pbZ],
           rotation: [0, 0, 0], 
           dimensions: { length: 15, width: 20, height: 6 },
           metadata: { 
             power: `Workshop ${i+1}`,
             color: '#2c3e50'
           }
         });

         // Connexion avec la porte du Hangar
         equipment.push({
           id: `REPAIR_ACCESS_DOOR_${i+1}`,
           type: 'road',
           position: [hx, yBase + 0.05, pbZ + 7.5 + 2.5], 
           dimensions: { length: 5, width: 6, height: 0.1 },
           rotation: [0, 0, 0],
           metadata: { color: '#1a1a1a' }
         });
       });

       // Parking Employés (Restauré vers sa position d'origine relative aux hangars)
       // Positionné à l'Est des hangars (vers le centre)
       equipment.push({
         id: 'REPAIR_PARKING',
         type: 'parking-20',
         position: [-20, 0, pbZ + 5], // X=-20 (à droite des hangars)
         rotation: [0, 0, 0],
         dimensions: { width: 25, length: 16, height: 0 }, 
         metadata: { gps: calculateGPS(-20, pbZ + 5) }
       });

       // Route d'accès : Connecte le parking et les hangars à la route centrale
       equipment.push({
         id: 'REPAIR_ACCESS_ROAD_MAIN',
         type: 'road',
         position: [-25, yBase + 0.05, pbZ + 15], // Route devant les hangars et parking
         dimensions: { length: 6, width: 80, height: 0.1 }, // Longue route desservant tout le monde
         rotation: [0, 0, 0],
         metadata: { color: '#1a1a1a' }
       });
       
       // Décoration : Fenwick
       equipment.push({
         id: 'DECO_FORKLIFT',
         type: 'road', 
         position: [-40, 1, pbZ + 9], 
         dimensions: { length: 2.5, width: 1.2, height: 1.8 },
         rotation: [0, 0.5, 0],
         metadata: { color: '#f1c40f' } 
       });

       // --- ZONE LOGISTIQUE SPÉCIALE (Reduite: 25m de long pour Trucks + Extincteur) ---
       equipment.push({
         id: 'LOGISTICS_ZONE_SPECIAL',
         type: 'logistics-zone',
         position: [-25, 0, pbZ + 30],
         rotation: [0, 0, 0],
         dimensions: { length: 25, width: 15, height: 0 }, 
         metadata: { gps: calculateGPS(-25, pbZ + 30) }
       });
       
       // --- POSTE DE SECOURS (Bâtiment à part - Taille ajustée nécessaire) ---
       // Placé à côté de la zone logistique
       // Dimensions optimisées pour 3 véhicules d'intervention : 18m façade x 14m profondeur
       equipment.push({
         id: 'FIRE_STATION_MAIN',
         type: 'fire-station', 
         position: [5, 0, pbZ + 30], 
         rotation: [0, 0, 0],
         dimensions: { length: 18, width: 14, height: 6 },
         metadata: { gps: calculateGPS(5, pbZ + 30) }
       });
    }

    // ZONE PIÉTONNE (Arrière des conteneurs) - Remplacé par route bétonnée
    // const pedPathZ_A = pbZ - distZ - (DIMENSIONS.container.width/2) - 1.5; // 1.5m derrière
    // const pedPathZ_B = pbZ + distZ + (DIMENSIONS.container.width/2) + 1.5;

    // Route Bétonnée le long des rangées (Nord) - SUPPRIMÉE
    /*
    equipment.push({
      id: `${pbId}_ROAD_NORTH`,
      type: 'road',
      position: [0, yBase + 0.05, pedPathZ_A], // Surélevé (0.45)
      dimensions: { length: 3, width: slabWidthX, height: 0.1 }, // width=160 (X), length=3 (Z)
      rotation: [0, 0, 0],
      metadata: { color: '#333333' } // MÊME COULEUR QUE LA ROUTE PRINCIPALE
    });
    */

    // Route Bétonnée le long des rangées (Sud) - SUPPRIMÉE
    /*
    equipment.push({
      id: `${pbId}_ROAD_SOUTH`,
      type: 'road',
      position: [0, yBase + 0.05, pedPathZ_B], // Surélevé (0.45)
      dimensions: { length: 3, width: slabWidthX, height: 0.1 }, // width=160 (X), length=3 (Z)
      rotation: [0, 0, 0],
      metadata: { color: '#333333' } // MÊME COULEUR QUE LA ROUTE PRINCIPALE
    });
    */

    const currentOffsets = isRepairRow ? trOffsetsRepair : trOffsetsFull;

    currentOffsets.forEach((offset, idx) => {
      // SKIP GAUCHE sur la rangée Repair (remplacé par Hangar)
      if (isRepairRow && offset.x < 0) return; 

      const trId = `${pbId}_TR${idx+1}`;

    // --- 1. PASSERELLES D'ACCÈS SÉCURISÉES ---
    // Remplace l'ancien "Petit chemin transversal"
    const accessX = offset.x; 

    // Route transversale (perpendiculaire à la route principale) pour chaque transfo
    equipment.push({
      id: `${trId}_ACCESS_ROAD`,
      type: 'road',
      position: [accessX, yBase + 0.05, pbZ], // Surélevé (0.45)
      dimensions: { length: 45, width: 3, height: 0.1 }, // width=3 (X), length=45 (Z)
      rotation: [0, 0, 0], // Perpendiculaire (aligné sur Z)
      metadata: { color: '#333333' }
    });
      
      const trX = offset.x;
      const trZ = pbZ;
      // CORRECTION: Le transformateur a son pivot au sol (comme dans projectGenerator.ts qui utilise y=0.3)
      // On pose le transformateur sur la fondation avec un petit offset pour éviter les z-fighting
      const trPos: [number, number, number] = [trX, yEquip + 0.3, trZ];
      
      // Fondation Transfo (Ajoutée pour "bloc beton sous tous les modules")
      equipment.push({
        id: `${trId}_FOUNDATION`,
        type: 'foundation',
        position: [trX, yBase/2, trZ],
        rotation: [0, 0, 0],
        dimensions: { length: DIMENSIONS.transformerHV.length + 2.0, width: DIMENSIONS.transformerHV.width + 2.0, height: 0.4 } // Marge 1m
      });

      equipment.push({
        id: trId,
        type: 'transformer',
        position: trPos,
        rotation: [0, 0, 0],
        dimensions: DIMENSIONS.transformerHV,
        metadata: { powerBlockId: pbId, power: '5MW', gps: calculateGPS(trPos[0], trPos[2]) }
      });

      // Cage de protection Métal (Ouverte devant)
      const cageDims = { 
        length: DIMENSIONS.transformerHV.length + 1.8, 
        width: DIMENSIONS.transformerHV.width + 1.8, 
        height: 5.0 // Augmenté de 4.0 à 5.0m
      };
      
      equipment.push({
        id: `${trId}_CAGE`,
        type: 'transformer-cage',
        position: [trX, 0.4, trZ], 
        rotation: [0, 0, 0], // Ouverture vers +Z (Sud) par défaut
        dimensions: cageDims,
        metadata: { powerBlockId: pbId }
      });

      // CONTAINERS A & B (Position Fixe + Dalle Élargie)
      
      // Container A (Nord)
      const cA_Z = trZ - distZ;
      const posCA: [number, number, number] = [trX, yEquip, cA_Z];
      
      equipment.push({
        id: `${trId}_CA`,
        type: 'container',
        position: posCA,
        rotation: [0, -Math.PI/2, 0],
        dimensions: DIMENSIONS.container,
        metadata: { powerBlockId: pbId, power: 'Cont A', gps: calculateGPS(posCA[0], posCA[2]) }
      });

      // ESCALIER A (Nord) - Collé à la face arrière (Nord)
      equipment.push({
        id: `${trId}_STAIRS_A`,
        type: 'metal-stairs-2-steps',
        // Position Z : Centre Conteneur - Demi-largeur Conteneur - Demi-prof. Escalier (0.45)
        position: [trX, 0, cA_Z - (DIMENSIONS.container.length / 2) - 0.45],
        rotation: [0, 0, 0], // Orienté vers le Sud (Marche haute contre le conteneur)
        dimensions: { length: 0.9, width: 1.6, height: 0.52 }, // Dimensions approx pour ref
        metadata: { powerBlockId: pbId }
      });

      // Container B (Sud)
      const cB_Z = trZ + distZ;
      const posCB: [number, number, number] = [trX, yEquip, cB_Z];
      
      equipment.push({
        id: `${trId}_CB`,
        type: 'container',
        position: posCB,
        rotation: [0, -Math.PI/2, 0], // Regarde vers le SUD (extérieur)
        dimensions: DIMENSIONS.container,
        metadata: { powerBlockId: pbId, power: 'Cont B', gps: calculateGPS(posCB[0], posCB[2]) }
      });

      // ESCALIER B (Sud) - Collé à la face arrière (Sud)
      equipment.push({
        id: `${trId}_STAIRS_B`,
        type: 'metal-stairs-2-steps',
        // Position Z : Centre Conteneur + Demi-largeur Conteneur + Demi-prof. Escalier (0.45)
        position: [trX, 0, cB_Z + (DIMENSIONS.container.length / 2) + 0.45],
        rotation: [0, Math.PI, 0], // Orienté vers le Nord (Marche haute contre le conteneur)
        dimensions: { length: 0.9, width: 1.6, height: 0.52 },
        metadata: { powerBlockId: pbId }
      });

      // --- 3. CHEMINS DE CÂBLES AÉRIENS (Liaison Transfo <-> Container) ---
      
      // Vers Container A (Nord)
      equipment.push(...generateHeavyCableTray(
        `${trId}_CABLE_A`,
        [posCA[0], 5.4, posCA[2]], // Haut Cooling (~5.4m)
        [trPos[0], 3.2, trPos[2] - 1.5] // Haut Transfo (~3.2m)
      ));

      // Vers Container B (Sud)
      equipment.push(...generateHeavyCableTray(
        `${trId}_CABLE_B`,
        [posCB[0], 5.4, posCB[2]], // Haut Cooling (~5.4m)
        [trPos[0], 3.2, trPos[2] + 1.5] // Haut Transfo (~3.2m)
      ));

    });
  }

  // --- 6. DRAPEAUX & DÉCORATION (Au lieu de la végétation) ---
  function generateDecorations(): EquipmentPosition[] {
    const items: EquipmentPosition[] = [];
    
    // Position de l'entrée (Palmiers supprimés -> Drapeaux ajoutés)
    const zEntranceFlag = zEntrance + GLOBAL_OFFSET_Z - 10; // Un peu après la barrière

    // Drapeau Gauche
    items.push({
      id: 'FLAG_QATAR_L',
      type: 'flag', // Nouveau type !
      position: [-10, 0, zEntranceFlag],
      rotation: [0, 0, 0],
      dimensions: { length: 1, width: 1, height: 8 },
      metadata: { color: '#8a1538' }
    });

    // Drapeau Droite
    items.push({
      id: 'FLAG_QATAR_R',
      type: 'flag',
      position: [10, 0, zEntranceFlag],
      rotation: [0, 0, 0],
      dimensions: { length: 1, width: 1, height: 8 },
      metadata: { color: '#8a1538' }
    });

    return items;
  }
  equipment.push(...generateDecorations());

  // --- 7. SYSTÈME DE SURVEILLANCE (CAMÉRAS SÉCURITÉ) ---
  equipment.push(...generateSecurityCameras());

  // --- 8. ACCÈS CENTRAL SÉCURISÉ (CAGE) ---
  const cageZ = toWorldZ(zMiningStart - 10); 
  equipment.push({
    id: 'CENTRAL_ACCESS_CAGE',
    type: 'security-cage',
    position: [0, DIMENSIONS.foundationHeight, cageZ],
    rotation: [0, 0, 0], 
    dimensions: { length: 2, width: 2, height: 2.5 },
    metadata: { power: 'Secure Access' }
  });

  // --- 9. ROUTE SOUS LES POWER BLOCKS (North-South sous les colonnes de PB) ---
  const underPbRoadLength = zMiningEnd - zMiningStart + 40; 
  const underPbRoadZ = (zMiningStart + zMiningEnd) / 2 + GLOBAL_OFFSET_Z;
  
  // Route Sous Colonne Gauche
  equipment.push({
    id: 'UNDER_PB_ROAD_L',
    type: 'road',
    position: [-90, DIMENSIONS.foundationHeight + 0.06, underPbRoadZ], // Au niveau des routes (+1cm vs autres)
    dimensions: { length: underPbRoadLength, width: 6, height: 0.1 }, 
    rotation: [0, 0, 0],
    metadata: { color: '#333333' }
  });

   // Route Sous Colonne Droite
  equipment.push({
    id: 'UNDER_PB_ROAD_R',
    type: 'road',
    position: [90, DIMENSIONS.foundationHeight + 0.06, underPbRoadZ],
    dimensions: { length: underPbRoadLength, width: 6, height: 0.1 },
    rotation: [0, 0, 0],
    metadata: { color: '#333333' }
  });

  return equipment;
}

/**
 * Génère le système de surveillance avec caméras positionnées en diagonal
 */
function generateSecurityCameras(): EquipmentPosition[] {
  const cameras: EquipmentPosition[] = [];
  
  const calculateLookAtAngle = (fromX: number, fromZ: number, toX: number, toZ: number): number => {
    const dx = toX - fromX;
    const dz = toZ - fromZ;
    return Math.atan2(dx, dz);
  };

  const sections = [
    {
      id: 'NW',
      name: 'Nord-Ouest',
      xMin: -100,
      xMax: 0,
      zMin: -210 + GLOBAL_OFFSET_Z, // Substation
      zMax: -80 + GLOBAL_OFFSET_Z,  // Fin Rows 1-2
      usePTZ: true, // Zone critique (Substation)
    },
    {
      id: 'SW',
      name: 'Sud-Ouest',
      xMin: -100,
      xMax: 0,
      zMin: -80 + GLOBAL_OFFSET_Z,  // Début Rows 3-4
      zMax: 60 + GLOBAL_OFFSET_Z,   // Fin zone mining
      usePTZ: false, // Zone standard
    },
    {
      id: 'NE',
      name: 'Nord-Est',
      xMin: 0,
      xMax: 100,
      zMin: -210 + GLOBAL_OFFSET_Z, // Substation
      zMax: -80 + GLOBAL_OFFSET_Z,  // Fin Rows 1-2
      usePTZ: true, // Zone critique (Substation)
    },
    {
      id: 'SE',
      name: 'Sud-Est',
      xMin: 0,
      xMax: 100,
      zMin: -80 + GLOBAL_OFFSET_Z,  // Début Rows 3-4
      zMax: 60 + GLOBAL_OFFSET_Z,   // Fin zone mining
      usePTZ: false, // Zone standard
    },
  ];

  sections.forEach((section) => {
    const margin = 15; // Marge depuis les bords (15m)
    const cameraType: EquipmentPosition['type'] = section.usePTZ ? 'camera-pole-ptz' : 'camera-pole-fixed';
    
    // Définir les 4 coins de la demi-section
    const c1X = section.xMin + margin;
    const c1Z = section.zMin + margin;
    const c1TargetX = section.xMax - margin;
    const c1TargetZ = section.zMax - margin;
    
    cameras.push({
      id: `CAMERA_${section.id}_NW`,
      type: cameraType,
      position: [c1X, 0, c1Z],
      rotation: [0, calculateLookAtAngle(c1X, c1Z, c1TargetX, c1TargetZ), 0],
      dimensions: { length: 0.8, width: 0.8, height: 6.7 },
      metadata: {
        power: section.usePTZ ? 'Surveillance PTZ' : 'Surveillance',
        gps: calculateGPS(c1X, c1Z),
      },
    });
    
    const c2X = section.xMax - margin;
    const c2Z = section.zMin + margin;
    const c2TargetX = section.xMin + margin;
    const c2TargetZ = section.zMax - margin;
    
    cameras.push({
      id: `CAMERA_${section.id}_NE`,
      type: cameraType,
      position: [c2X, 0, c2Z],
      rotation: [0, calculateLookAtAngle(c2X, c2Z, c2TargetX, c2TargetZ), 0],
      dimensions: { length: 0.8, width: 0.8, height: 6.7 },
      metadata: {
        power: section.usePTZ ? 'Surveillance PTZ' : 'Surveillance',
        gps: calculateGPS(c2X, c2Z),
      },
    });
    
    const c3X = section.xMin + margin;
    const c3Z = section.zMax - margin;
    const c3TargetX = section.xMax - margin;
    const c3TargetZ = section.zMin + margin;
    
    cameras.push({
      id: `CAMERA_${section.id}_SW`,
      type: cameraType,
      position: [c3X, 0, c3Z],
      rotation: [0, calculateLookAtAngle(c3X, c3Z, c3TargetX, c3TargetZ), 0],
      dimensions: { length: 0.8, width: 0.8, height: 6.7 },
      metadata: {
        power: section.usePTZ ? 'Surveillance PTZ' : 'Surveillance',
        gps: calculateGPS(c3X, c3Z),
      },
    });
    
    const c4X = section.xMax - margin;
    const c4Z = section.zMax - margin;
    const c4TargetX = section.xMin + margin;
    const c4TargetZ = section.zMin + margin;
    
    cameras.push({
      id: `CAMERA_${section.id}_SE`,
      type: cameraType,
      position: [c4X, 0, c4Z],
      rotation: [0, calculateLookAtAngle(c4X, c4Z, c4TargetX, c4TargetZ), 0],
      dimensions: { length: 0.8, width: 0.8, height: 6.7 },
      metadata: {
        power: section.usePTZ ? 'Surveillance PTZ' : 'Surveillance',
        gps: calculateGPS(c4X, c4Z),
      },
    });
  });

  return cameras;
}
