/**
 * Outil de validation GPS unique avec système de cache
 * Évite les re-validations inutiles en mettant en cache les résultats
 */

import { EquipmentPosition } from '../lib/projectGenerator';
import { GpsPoint } from './gpsToAnnotation';
import { validateGpsMapping, GpsMapping } from './gpsMapping';

/**
 * Interface pour le résultat de validation complet
 */
export interface ValidationResult {
  mapping: {
    totalEquipment: number;
    totalGpsPoints: number;
    matched: number;
    unmatched: number;
    averageDistance: number;
    mappings: GpsMapping[];
  };
  isValid: boolean;
  timestamp: number;
}

/**
 * Cache pour éviter les re-validations
 * Clé: hash des équipements et points GPS
 * Valeur: résultat de validation
 */
const validationCache = new Map<string, ValidationResult>();

/**
 * Génère une clé de cache basée sur les équipements et points GPS
 */
function generateCacheKey(
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): string {
  const equipmentIds = equipment.map(e => e.id).sort().join(',');
  const gpsNames = gpsPoints.map(p => p.name).sort().join(',');
  return `${equipment.length}-${gpsPoints.length}-${equipmentIds}-${gpsNames}`;
}

/**
 * Valide les points GPS une seule fois et met en cache le résultat
 * 
 * @param equipment - Liste des équipements
 * @param gpsPoints - Liste des points GPS
 * @param forceRefresh - Force la re-validation même si en cache (défaut: false)
 * @returns Résultat de validation avec mapping
 */
export function validateGpsOnce(
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[],
  forceRefresh: boolean = false
): ValidationResult {
  // Générer la clé de cache
  const cacheKey = generateCacheKey(equipment, gpsPoints);
  
  // Vérifier le cache si pas de force refresh
  if (!forceRefresh && validationCache.has(cacheKey)) {
    const cached = validationCache.get(cacheKey)!;
    // Vérifier que le cache n'est pas trop vieux (5 minutes)
    const cacheAge = Date.now() - cached.timestamp;
    if (cacheAge < 5 * 60 * 1000) {
      return cached;
    }
  }
  
  // Effectuer la validation
  const mapping = validateGpsMapping(equipment, gpsPoints);
  
  // Déterminer si la validation est valide
  // On considère valide si au moins 80% des équipements sont mappés
  const isValid = mapping.matched / mapping.totalEquipment >= 0.8;
  
  // Créer le résultat
  const result: ValidationResult = {
    mapping,
    isValid,
    timestamp: Date.now(),
  };
  
  // Mettre en cache
  validationCache.set(cacheKey, result);
  
  // Nettoyer le cache si trop volumineux (garder max 10 entrées)
  if (validationCache.size > 10) {
    const oldestKey = Array.from(validationCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
    validationCache.delete(oldestKey);
  }
  
  return result;
}

/**
 * Vide le cache de validation
 */
export function clearValidationCache(): void {
  validationCache.clear();
}

/**
 * Obtient les statistiques du cache
 */
export function getCacheStats(): {
  size: number;
  keys: string[];
} {
  return {
    size: validationCache.size,
    keys: Array.from(validationCache.keys()),
  };
}

