import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  Deployment,
  getDeployments,
  addDeployment,
  updateDeployment,
  deleteDeployment,
  duplicateDeployment,
  initializeDefaultDeployment,
  createDefaultDeployment,
} from '../data/deployments';
import { DeploymentCondition } from '../utils/deploymentConditions';

interface DeploymentContextType {
  deployments: Deployment[];
  activeDeployment: Deployment | null;
  setActiveDeployment: (deployment: Deployment | null) => void;
  createDeployment: (name: string) => Deployment;
  updateDeploymentById: (id: string, updates: Partial<Deployment>) => boolean;
  removeDeployment: (id: string) => boolean;
  duplicateDeploymentById: (id: string, newName: string) => Deployment | null;
  refreshDeployments: () => void;
  // Gestion des conditions
  addCondition: (condition: DeploymentCondition) => boolean;
  removeCondition: (conditionIndex: number) => boolean;
  updateCondition: (conditionIndex: number, condition: DeploymentCondition) => boolean;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

export function DeploymentProvider({ children }: { children: ReactNode }) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [activeDeployment, setActiveDeploymentState] = useState<Deployment | null>(null);

  // Charger les déploiements au montage
  useEffect(() => {
    // Initialiser le déploiement par défaut s'il n'existe pas
    const defaultDeployment = initializeDefaultDeployment();
    
    // Charger tous les déploiements
    const allDeployments = getDeployments();
    setDeployments(allDeployments);
    
    // Définir le déploiement actif (par défaut ou premier disponible)
    const defaultOrFirst = allDeployments.find(d => d.isDefault) || 
                           allDeployments.find(d => d.id === defaultDeployment.id) ||
                           allDeployments[0] ||
                           defaultDeployment;
    setActiveDeploymentState(defaultOrFirst);
  }, []);

  // Utiliser useRef pour stocker l'ID et la version sérialisée du déploiement actif
  // pour éviter les boucles infinies lors de la synchronisation
  const activeDeploymentIdRef = useRef<string | null>(null);
  const activeDeploymentSnapshotRef = useRef<string>('');
  
  // Mettre à jour les refs quand activeDeployment change
  useEffect(() => {
    if (activeDeployment) {
      activeDeploymentIdRef.current = activeDeployment.id;
      activeDeploymentSnapshotRef.current = JSON.stringify({
        name: activeDeployment.name,
        config: activeDeployment.config,
        isDefault: activeDeployment.isDefault,
      });
    } else {
      activeDeploymentIdRef.current = null;
      activeDeploymentSnapshotRef.current = '';
    }
  }, [activeDeployment?.id, activeDeployment?.name, activeDeployment?.config, activeDeployment?.isDefault]);
  
  // Synchroniser l'état actif avec localStorage quand les déploiements changent
  useEffect(() => {
    const currentActiveId = activeDeploymentIdRef.current;
    if (!currentActiveId) return;
    
    const allDeployments = getDeployments();
    const updated = allDeployments.find(d => d.id === currentActiveId);
    
    if (updated) {
      // Comparer avec la version sérialisée stockée dans le ref
      const updatedSnapshot = JSON.stringify({
        name: updated.name,
        config: updated.config,
        isDefault: updated.isDefault,
      });
      
      // Ne mettre à jour que si quelque chose a vraiment changé
      if (updatedSnapshot !== activeDeploymentSnapshotRef.current) {
        activeDeploymentSnapshotRef.current = updatedSnapshot;
        setActiveDeploymentState(updated);
      }
    } else {
      // Si le déploiement actif n'existe plus, prendre le premier disponible
      if (allDeployments.length > 0) {
        const firstDeployment = allDeployments[0];
        activeDeploymentIdRef.current = firstDeployment.id;
        activeDeploymentSnapshotRef.current = JSON.stringify({
          name: firstDeployment.name,
          config: firstDeployment.config,
          isDefault: firstDeployment.isDefault,
        });
        setActiveDeploymentState(firstDeployment);
      } else {
        activeDeploymentIdRef.current = null;
        activeDeploymentSnapshotRef.current = '';
        setActiveDeploymentState(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments]); // Ne dépendre que de deployments pour éviter la boucle infinie

  const refreshDeployments = () => {
    const allDeployments = getDeployments();
    setDeployments(allDeployments);
    
    // Mettre à jour le déploiement actif si nécessaire
    if (activeDeployment) {
      const updated = allDeployments.find(d => d.id === activeDeployment.id);
      if (updated) {
        setActiveDeploymentState(updated);
      } else if (allDeployments.length > 0) {
        // Si le déploiement actif a été supprimé, prendre le premier disponible
        setActiveDeploymentState(allDeployments[0]);
      }
    }
  };

  const setActiveDeployment = (deployment: Deployment | null) => {
    setActiveDeploymentState(deployment);
  };

  const createDeployment = (name: string): Deployment => {
    const newDeployment = createDefaultDeployment(name);
    addDeployment(newDeployment);
    refreshDeployments();
    return newDeployment;
  };

  const updateDeploymentById = (id: string, updates: Partial<Deployment>): boolean => {
    const success = updateDeployment(id, updates);
    if (success) {
      refreshDeployments();
      // Mettre à jour le déploiement actif si c'est celui qui a été modifié
      if (activeDeployment?.id === id) {
        const updated = getDeployments().find(d => d.id === id);
        if (updated) {
          setActiveDeploymentState(updated);
        }
      }
    }
    return success;
  };

  const removeDeployment = (id: string): boolean => {
    // Ne pas supprimer le dernier déploiement
    const allDeployments = getDeployments();
    if (allDeployments.length <= 1) {
      return false;
    }
    
    const success = deleteDeployment(id);
    if (success) {
      refreshDeployments();
      // Si le déploiement supprimé était actif, activer un autre
      if (activeDeployment?.id === id) {
        const remaining = getDeployments();
        if (remaining.length > 0) {
          setActiveDeploymentState(remaining[0]);
        }
      }
    }
    return success;
  };

  const duplicateDeploymentById = (id: string, newName: string): Deployment | null => {
    const duplicated = duplicateDeployment(id, newName);
    if (duplicated) {
      refreshDeployments();
    }
    return duplicated;
  };

  // Gestion des conditions
  const addCondition = (condition: DeploymentCondition): boolean => {
    if (!activeDeployment) return false;
    
    const updatedConditions = [...(activeDeployment.conditions || []), condition];
    return updateDeploymentById(activeDeployment.id, {
      conditions: updatedConditions,
    });
  };

  const removeCondition = (conditionIndex: number): boolean => {
    if (!activeDeployment) return false;
    
    const updatedConditions = [...(activeDeployment.conditions || [])];
    updatedConditions.splice(conditionIndex, 1);
    return updateDeploymentById(activeDeployment.id, {
      conditions: updatedConditions,
    });
  };

  const updateCondition = (conditionIndex: number, condition: DeploymentCondition): boolean => {
    if (!activeDeployment) return false;
    
    const updatedConditions = [...(activeDeployment.conditions || [])];
    updatedConditions[conditionIndex] = condition;
    return updateDeploymentById(activeDeployment.id, {
      conditions: updatedConditions,
    });
  };

  return (
    <DeploymentContext.Provider
      value={{
        deployments,
        activeDeployment,
        setActiveDeployment,
        createDeployment,
        updateDeploymentById,
        removeDeployment,
        duplicateDeploymentById,
        refreshDeployments,
        addCondition,
        removeCondition,
        updateCondition,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
}

export function useDeployment() {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error('useDeployment must be used within a DeploymentProvider');
  }
  return context;
}

