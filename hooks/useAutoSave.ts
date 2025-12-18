import { useEffect, useState, useCallback, useRef } from 'react';
import { EquipmentPosition } from '../lib/mining100MWGenerator';

// CHANGEMENT DE CLÉ POUR DÉBLOQUER (V3)
const STORAGE_KEY = 'mining_100mw_autosave_v3';

interface AutoSaveStatus {
  state: 'saved' | 'saving' | 'error' | 'idle';
  lastSaved: Date | null;
}

export function useAutoSave(equipmentList: EquipmentPosition[]) {
  const [status, setStatus] = useState<AutoSaveStatus>({ state: 'idle', lastSaved: null });
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(false);

  // Charger la sauvegarde au démarrage
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    setIsLoaded(true);
  }, []);

  // Sauvegarde automatique avec debounce
  useEffect(() => {
    // Ne pas sauvegarder si pas encore chargé ou liste vide (sauf si suppression totale intentionnelle, à gérer plus tard)
    if (!isLoaded || equipmentList.length === 0) return;

    // console.log('🔄 AutoSave: Modification détectée, attente debounce...', equipmentList.length, 'éléments');
    setStatus(prev => ({ ...prev, state: 'saving' }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        // console.log('💾 AutoSave: Sauvegarde en cours...');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(equipmentList));
        setStatus({
          state: 'saved',
          lastSaved: new Date()
        });
        
        // Revenir à idle après 2 secondes pour l'UI
        setTimeout(() => {
           setStatus(prev => ({ ...prev, state: 'idle' }));
        }, 2000);

      } catch (e) {
        console.error("Erreur sauvegarde auto:", e);
        setStatus(prev => ({ ...prev, state: 'error' }));
      }
    }, 1000); // 1 seconde de délai

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [equipmentList, isLoaded]);

  // Fonction pour charger manuellement
  const loadSavedData = useCallback((): EquipmentPosition[] | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Erreur lecture sauvegarde:", e);
    }
    return null;
  }, []);

  // Forcer la sauvegarde immédiate (pour delete/duplicate)
  const forceSave = useCallback((currentList: EquipmentPosition[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
      setStatus({
        state: 'saved',
        lastSaved: new Date()
      });
    } catch (e) {
      console.error("Erreur sauvegarde forcée:", e);
    }
  }, []);

  // Nettoyer la sauvegarde (Reset)
  const clearSave = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setStatus({ state: 'idle', lastSaved: null });
      console.log('🗑️ Sauvegarde effacée.');
    } catch (e) {
      console.error("Erreur lors de la suppression de la sauvegarde:", e);
    }
  }, []);

  return { status, loadSavedData, forceSave, clearSave };
}


