/**
 * Hook pour gérer les modèles supprimés de la galerie
 * Utilise localStorage pour persister les suppressions
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gallery-deleted-models';

export function useDeletedModels() {
  const [deletedModelIds, setDeletedModelIds] = useState<Set<string>>(new Set());

  // Charger les modèles supprimés depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const ids = JSON.parse(saved) as string[];
          setDeletedModelIds(new Set(ids));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des modèles supprimés:', error);
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(deletedModelIds)));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des modèles supprimés:', error);
      }
    }
  }, [deletedModelIds]);

  const deleteModel = (modelId: string) => {
    setDeletedModelIds((prev) => {
      const next = new Set(prev);
      next.add(modelId);
      return next;
    });
  };

  const restoreModel = (modelId: string) => {
    setDeletedModelIds((prev) => {
      const next = new Set(prev);
      next.delete(modelId);
      return next;
    });
  };

  const restoreAll = () => {
    setDeletedModelIds(new Set());
  };

  const isDeleted = (modelId: string) => {
    return deletedModelIds.has(modelId);
  };

  return {
    deletedModelIds: Array.from(deletedModelIds),
    deleteModel,
    restoreModel,
    restoreAll,
    isDeleted,
  };
}


