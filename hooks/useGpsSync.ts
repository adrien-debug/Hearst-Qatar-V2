/**
 * Hook personnalisé pour synchroniser les sélections entre objets 3D et GPS
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EquipmentPosition } from '../lib/projectGenerator';
import { GpsPoint } from '../utils/gpsToAnnotation';
import {
  syncSelectionToGps,
  syncSelectionToEquipment,
  createGpsMappingTable,
  validateGpsMapping,
} from '../utils/gpsMapping';

interface UseGpsSyncOptions {
  equipment: EquipmentPosition[];
  gpsPoints: GpsPoint[];
  onEquipmentSelect?: (id: string | null) => void;
  onGpsSelect?: (name: string | null) => void;
  debug?: boolean;
}

interface UseGpsSyncReturn {
  selectedEquipmentId: string | null;
  selectedGpsName: string | null;
  selectEquipment: (id: string | null) => void;
  selectGps: (name: string | null) => void;
  mappingStats: ReturnType<typeof validateGpsMapping> | null;
  isSynced: boolean;
}

/**
 * Hook pour synchroniser les sélections entre objets 3D et annotations GPS
 */
export function useGpsSync({
  equipment,
  gpsPoints,
  onEquipmentSelect,
  onGpsSelect,
  debug = false,
}: UseGpsSyncOptions): UseGpsSyncReturn {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [selectedGpsName, setSelectedGpsName] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  // Calculer les statistiques de mapping avec useMemo pour éviter les recalculs inutiles
  // Utiliser une clé basée sur la longueur et un hash simple pour détecter les changements réels
  const equipmentKey = useMemo(() => 
    `${equipment.length}-${equipment.map(e => e.id).join(',')}`, 
    [equipment]
  );
  const gpsPointsKey = useMemo(() => 
    `${gpsPoints.length}-${gpsPoints.map(p => p.name).join(',')}`, 
    [gpsPoints]
  );

  const mappingStats = useMemo(() => {
    if (equipment.length > 0 && gpsPoints.length > 0) {
      const stats = validateGpsMapping(equipment, gpsPoints);
      
      if (debug) {
        console.log('📊 Statistiques de mapping GPS:', {
          totalEquipment: stats.totalEquipment,
          totalGpsPoints: stats.totalGpsPoints,
          matched: stats.matched,
          unmatched: stats.unmatched,
          matchRate: `${((stats.matched / stats.totalEquipment) * 100).toFixed(1)}%`,
          averageDistance: `${stats.averageDistance.toFixed(2)}m`,
        });
        
        if (stats.unmatched > 0) {
          console.warn('⚠️ Équipements non mappés:', stats.unmatched);
        }
      }
      
      return stats;
    }
    return null;
  }, [equipmentKey, gpsPointsKey, debug]);

  /**
   * Sélectionne un équipement et synchronise avec GPS
   */
  const selectEquipment = useCallback((id: string | null) => {
    setSelectedEquipmentId(id);
    
    if (id) {
      // Trouver le point GPS correspondant
      const gpsName = syncSelectionToGps(id, equipment, gpsPoints);
      
      if (gpsName) {
        setSelectedGpsName(gpsName);
        setIsSynced(true);
        
        if (debug) {
          console.log('🎯 Sélection synchronisée:', {
            equipmentId: id,
            gpsName,
          });
        }
        
        // Notifier le parent
        if (onGpsSelect) {
          onGpsSelect(gpsName);
        }
      } else {
        setSelectedGpsName(null);
        setIsSynced(false);
        
        if (debug) {
          console.warn('⚠️ Aucun point GPS trouvé pour:', id);
        }
      }
    } else {
      setSelectedGpsName(null);
      setIsSynced(false);
      
      if (onGpsSelect) {
        onGpsSelect(null);
      }
    }
    
    // Notifier le parent
    if (onEquipmentSelect) {
      onEquipmentSelect(id);
    }
  }, [equipment, gpsPoints, onEquipmentSelect, onGpsSelect, debug]);

  /**
   * Sélectionne un point GPS et synchronise avec l'équipement
   */
  const selectGps = useCallback((name: string | null) => {
    setSelectedGpsName(name);
    
    if (name) {
      // Trouver l'équipement correspondant
      const equipmentId = syncSelectionToEquipment(name, equipment, gpsPoints);
      
      if (equipmentId) {
        setSelectedEquipmentId(equipmentId);
        setIsSynced(true);
        
        if (debug) {
          console.log('🎯 Sélection GPS synchronisée:', {
            gpsName: name,
            equipmentId,
          });
        }
        
        // Notifier le parent
        if (onEquipmentSelect) {
          onEquipmentSelect(equipmentId);
        }
      } else {
        setSelectedEquipmentId(null);
        setIsSynced(false);
        
        if (debug) {
          console.warn('⚠️ Aucun équipement trouvé pour:', name);
        }
      }
    } else {
      setSelectedEquipmentId(null);
      setIsSynced(false);
      
      if (onEquipmentSelect) {
        onEquipmentSelect(null);
      }
    }
    
    // Notifier le parent
    if (onGpsSelect) {
      onGpsSelect(name);
    }
  }, [equipment, gpsPoints, onEquipmentSelect, onGpsSelect, debug]);

  return {
    selectedEquipmentId,
    selectedGpsName,
    selectEquipment,
    selectGps,
    mappingStats,
    isSynced,
  };
}

/**
 * Hook simplifié pour la synchronisation unidirectionnelle (équipement -> GPS)
 */
export function useEquipmentToGpsSync(
  selectedEquipmentId: string | null,
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): string | null {
  const [selectedGpsName, setSelectedGpsName] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEquipmentId) {
      const gpsName = syncSelectionToGps(selectedEquipmentId, equipment, gpsPoints);
      setSelectedGpsName(gpsName);
    } else {
      setSelectedGpsName(null);
    }
  }, [selectedEquipmentId, equipment, gpsPoints]);

  return selectedGpsName;
}

/**
 * Hook simplifié pour la synchronisation unidirectionnelle (GPS -> équipement)
 */
export function useGpsToEquipmentSync(
  selectedGpsName: string | null,
  equipment: EquipmentPosition[],
  gpsPoints: GpsPoint[]
): string | null {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGpsName) {
      const equipmentId = syncSelectionToEquipment(selectedGpsName, equipment, gpsPoints);
      setSelectedEquipmentId(equipmentId);
    } else {
      setSelectedEquipmentId(null);
    }
  }, [selectedGpsName, equipment, gpsPoints]);

  return selectedEquipmentId;
}

