/**
 * Système de Mapping GPS - Objets 3D
 * Synchronise les sélections entre les objets 3D et les annotations GPS
 */

import { GpsPoint } from './gpsToAnnotation';
import { EquipmentPosition } from '../lib/projectGenerator';

/**
 * Interface pour le résultat du mapping
 */
export interface GpsMapping {
  equipmentId: string;
  gpsPointName: string;
  position3D: [number, number, number];
  positionGPS: [number, number, number];
  distance: number;
}

/**
 * Normalise un ID pour la comparaison
 * Exemples:
 * - "PB1_TR01_HD5_A" -> "pb1_tr01_hd5_a"
 * - "PowerBlock_1" -> "powerblock_1"
 */
export function normalizeId(id: string): string {
  return id
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Extrait les composants d'un ID pour la comparaison
 * Exemples:
 * - "PB1_TR01_HD5_A" -> ["pb1", "tr01", "hd5", "a"]
 * - "PowerBlock_1" -> ["powerblock", "1"]
 */
export function extractIdComponents(id: string): string[] {
  const normalized = normalizeId(id);
  return normalized.split('_').filter(c => c.length > 0);
}

/**
 * Normalise un composant d'ID pour la comparaison
 * Gère les variations courantes (T01 = TR01, etc.)
 */
function normalizeComponent(component: string): string {
  // Convertir "t6" en "tr06"
  const matchT = component.match(/^t(\d+)$/);
  if (matchT) {
    const num = matchT[1].padStart(2, '0');
    return `tr${num}`;
  }
  
  // Convertir "tr6" en "tr06"
  const matchTR = component.match(/^tr(\d)$/);
  if (matchTR) {
    return `tr0${matchTR[1]}`;
  }
  
  // Normaliser les numéros à 2 chiffres (01, 02, etc.)
  const matchNum = component.match(/^(\d)$/);
  if (matchNum) {
    return `0${matchNum[1]}`;
  }
  
  // Mapper F (Front) vers A et B (Back) vers B pour compatibilité GPS
  if (component === 'f') return 'a';
  if (component === 'b') return 'b';
  
  return component;
}

/**
 * Calcule un score de similarité entre deux IDs
 * Retourne un score entre 0 (aucune correspondance) et 1 (correspondance parfaite)
 */
export function calculateIdSimilarity(id1: string, id2: string): number {
  const components1 = extractIdComponents(id1).map(normalizeComponent);
  const components2 = extractIdComponents(id2).map(normalizeComponent);
  
  // Si les IDs normalisés sont identiques, score parfait
  if (normalizeId(id1) === normalizeId(id2)) {
    return 1.0;
  }
  
  // Vérifier si tous les composants de l'ID le plus court sont dans l'ID le plus long
  const shorter = components1.length <= components2.length ? components1 : components2;
  const longer = components1.length > components2.length ? components1 : components2;
  
  let matchCount = 0;
  for (const comp of shorter) {
    if (longer.includes(comp)) {
      matchCount++;
    }
  }
  
  // Si tous les composants du plus court sont dans le plus long, c'est un bon match
  if (matchCount === shorter.length && shorter.length >= 2) {
    return 0.9; // Score élevé mais pas parfait
  }
  
  // Sinon, score basé sur le ratio de composants correspondants
  const maxLength = Math.max(components1.length, components2.length);
  return matchCount / maxLength;
}

/**
 * Trouve le point GPS correspondant à un équipement 3D
 * Utilise d'abord la correspondance par ID, puis par position si nécessaire
 */
/**
 * Construit un ID GPS à partir d'un ID d'équipement simple
 * Exemple: T3_HD5_F -> PB1_TR03_HD5_A
 */
function buildGpsIdFromEquipmentId(equipmentId: string): string[] {
  const normalized = normalizeId(equipmentId);
  
  // Extraire le numéro du transformer (T3 -> 3)
  const transformerMatch = equipmentId.match(/^T(\d+)/i);
  if (!transformerMatch) {
    return [];
  }
  
  const transformerNum = parseInt(transformerMatch[1], 10);
  
  // Déterminer le PowerBlock (T1-T6 -> PB1, mais pour ce projet c'est 25MW donc probablement tous PB1)
  // Pour être sûr, générer plusieurs possibilités
  const powerBlocks = [1, 2, 3, 4];
  const possibleIds: string[] = [];
  
  // Vérifier si c'est un HD5 container
  if (equipmentId.includes('HD5')) {
    const hasFront = equipmentId.includes('_F');
    const hasBack = equipmentId.includes('_B');
    
    for (const pb of powerBlocks) {
      const trNum = transformerNum.toString().padStart(2, '0');
      
      if (hasFront) {
        possibleIds.push(`PB${pb}_TR${trNum}_HD5_A`);
      } else if (hasBack) {
        possibleIds.push(`PB${pb}_TR${trNum}_HD5_B`);
      } else {
        // Si pas de suffixe, essayer les deux
        possibleIds.push(`PB${pb}_TR${trNum}_HD5_A`);
        possibleIds.push(`PB${pb}_TR${trNum}_HD5_B`);
      }
    }
  } else if (equipmentId.match(/^T\d+$/i)) {
    // C'est juste un transformer
    for (const pb of powerBlocks) {
      const trNum = transformerNum.toString().padStart(2, '0');
      possibleIds.push(`PB${pb}_TR${trNum}_Transformer`);
    }
  }
  
  return possibleIds;
}

export function findMatchingGpsPoint(
  equipment: EquipmentPosition,
  gpsPoints: GpsPoint[],
  similarityThreshold: number = 0.6
): GpsPoint | null {
  if (!equipment || !gpsPoints || gpsPoints.length === 0) {
    return null;
  }
  
  // Essayer d'abord une correspondance directe avec les IDs GPS construits
  const possibleGpsIds = buildGpsIdFromEquipmentId(equipment.id);
  
  for (const gpsId of possibleGpsIds) {
    const exactMatch = gpsPoints.find(p => normalizeId(p.name) === normalizeId(gpsId));
    if (exactMatch) {
      return exactMatch;
    }
  }
  
  let bestMatch: { point: GpsPoint; score: number } | null = null;
  
  // Essayer d'abord avec l'ID tel quel
  for (const gpsPoint of gpsPoints) {
    const similarity = calculateIdSimilarity(equipment.id, gpsPoint.name);
    
    if (similarity >= similarityThreshold) {
      if (!bestMatch || similarity > bestMatch.score) {
        bestMatch = { point: gpsPoint, score: similarity };
      }
    }
  }
  
  // Si pas de bon match, essayer en ajoutant le préfixe du Power Block
  if (!bestMatch || bestMatch.score < 0.8) {
    const powerBlockId = equipment.metadata?.powerBlockId;
    if (powerBlockId && typeof powerBlockId === 'string') {
      // Extraire le numéro du Power Block (ex: "PB1" -> "1")
      const pbMatch = powerBlockId.match(/(\d+)/);
      if (pbMatch) {
        const pbNum = pbMatch[1];
        // Essayer avec le préfixe PB
        const idWithPB = `PB${pbNum}_${equipment.id}`;
        
        for (const gpsPoint of gpsPoints) {
          const similarity = calculateIdSimilarity(idWithPB, gpsPoint.name);
          
          if (similarity >= similarityThreshold) {
            if (!bestMatch || similarity > bestMatch.score) {
              bestMatch = { point: gpsPoint, score: similarity };
            }
          }
        }
      }
    }
  }
  
  // Si on a trouvé une correspondance par ID, la retourner
  if (bestMatch && bestMatch.score >= 0.8) {
    return bestMatch.point;
  }
  
  // Sinon, chercher par proximité de position (fallback)
  
  const equipmentPos = equipment.position;
  let closestPoint: GpsPoint | null = null;
  let minDistance = Infinity;
  
  for (const gpsPoint of gpsPoints) {
    const distance = Math.sqrt(
      Math.pow(equipmentPos[0] - gpsPoint.x, 2) +
      Math.pow(equipmentPos[1] - gpsPoint.y, 2) +
      Math.pow(equipmentPos[2] - gpsPoint.z, 2)
    );
    
    if (distance < minDistance && distance < 5) { // Seuil de 5 mètres
      minDistance = distance;
      closestPoint = gpsPoint;
    }
  }
  
  return closestPoint;
}

/**
 * Trouve l'équipement 3D correspondant à un point GPS
 */
export function findMatchingEquipment(
  gpsPoint: GpsPoint,
  equipment: EquipmentPosition[],
  similarityThreshold: number = 0.6
): EquipmentPosition | null {
  if (!gpsPoint || !equipment || equipment.length === 0) {
    return null;
  }
  
  let bestMatch: { equipment: EquipmentPosition; score: number } | null = null;
  
  // Recherche par similarité d'ID
  for (const equip of equipment) {
    const similarity = calculateIdSimilarity(gpsPoint.name, equip.id);
    
    if (similarity >= similarityThreshold) {
      if (!bestMatch || similarity > bestMatch.score) {
        bestMatch = { equipment: equip, score: similarity };
      }
    }
  }
  
  // Si on a trouvé une correspondance par ID, la retourner
  if (bestMatch && bestMatch.score >= 0.8) {
    return bestMatch.equipment;
  }
  
  // Sinon, chercher par proximité de position (fallback)
  let closestEquipment: EquipmentPosition | null = null;
  let minDistance = Infinity;
  
  for (const equip of equipment) {
    const distance = Math.sqrt(
      Math.pow(equip.position[0] - gpsPoint.x, 2) +
      Math.pow(equip.position[1] - gpsPoint.y, 2) +
      Math.pow(equip.position[2] - gpsPoint.z, 2)
    );
    
    if (distance < minDistance && distance < 5) { // Seuil de 5 mètres
      minDistance = distance;
      closestEquipment = equip;
    }
  }
  
  return closestEquipment;
}

/**
 * Crée une table de mapping complète entre équipements et points GPS
 */
export function createGpsMappingTable(
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): Map<string, GpsMapping> {
  const mappingTable = new Map<string, GpsMapping>();
  
  for (const equip of equipment) {
    const matchingGps = findMatchingGpsPoint(equip, gpsPoints);
    
    if (matchingGps) {
      const distance = Math.sqrt(
        Math.pow(equip.position[0] - matchingGps.x, 2) +
        Math.pow(equip.position[1] - matchingGps.y, 2) +
        Math.pow(equip.position[2] - matchingGps.z, 2)
      );
      
      mappingTable.set(equip.id, {
        equipmentId: equip.id,
        gpsPointName: matchingGps.name,
        position3D: equip.position,
        positionGPS: [matchingGps.x, matchingGps.y, matchingGps.z],
        distance,
      });
    }
  }
  
  return mappingTable;
}

/**
 * Synchronise la sélection d'un objet 3D avec son annotation GPS
 * Retourne le nom du point GPS correspondant, ou null si non trouvé
 */
export function syncSelectionToGps(
  selectedEquipmentId: string,
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): string | null {
  const selectedEquipment = equipment.find(e => e.id === selectedEquipmentId);
  
  if (!selectedEquipment) {
    return null;
  }
  
  const matchingGps = findMatchingGpsPoint(selectedEquipment, gpsPoints);
  
  return matchingGps ? matchingGps.name : null;
}

/**
 * Synchronise la sélection d'une annotation GPS avec son objet 3D
 * Retourne l'ID de l'équipement correspondant, ou null si non trouvé
 */
export function syncSelectionToEquipment(
  selectedGpsName: string,
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): string | null {
  const selectedGps = gpsPoints.find(g => g.name === selectedGpsName);
  
  if (!selectedGps) {
    return null;
  }
  
  const matchingEquipment = findMatchingEquipment(selectedGps, equipment);
  
  return matchingEquipment ? matchingEquipment.id : null;
}

/**
 * Valide et affiche les statistiques de mapping
 */
export function validateGpsMapping(
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): {
  totalEquipment: number;
  totalGpsPoints: number;
  matched: number;
  unmatched: number;
  averageDistance: number;
  mappings: GpsMapping[];
} {
  const mappingTable = createGpsMappingTable(equipment, gpsPoints);
  const mappings = Array.from(mappingTable.values());
  
  const totalDistance = mappings.reduce((sum, m) => sum + m.distance, 0);
  const averageDistance = mappings.length > 0 ? totalDistance / mappings.length : 0;
  
  return {
    totalEquipment: equipment.length,
    totalGpsPoints: gpsPoints.length,
    matched: mappings.length,
    unmatched: equipment.length - mappings.length,
    averageDistance,
    mappings,
  };
}

