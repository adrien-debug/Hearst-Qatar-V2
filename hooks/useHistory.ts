import { useState, useCallback } from 'react';

// Helper pour cloner profondément (simple et efficace pour des objets JSON-like)
function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error('Erreur clone deep', e);
    return obj;
  }
}

export function useHistory<T>(initialState: T) {
  // On clone l'état initial pour éviter les références partagées
  const [state, setState] = useState<T>(deepClone(initialState));
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  // Pour naviguer dans le temps sans écraser l'historique
  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;

      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);

      setFuture((prevFuture) => [deepClone(state), ...prevFuture]);
      
      // IMPORTANT: On clone pour forcer le re-render
      const newState = deepClone(previous);
      setState(newState);
      
      return newPast;
    });
  }, [state]);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;

      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setPast((prevPast) => [...prevPast, deepClone(state)]);
      
      const newState = deepClone(next);
      setState(newState);

      return newFuture;
    });
  }, [state]);

  // Enregistrer un nouvel état (écrase le futur)
  const pushState = useCallback((newState: T) => {
    // Si le nouvel état est identique à l'actuel, on ignore (évite les doublons)
    if (JSON.stringify(newState) === JSON.stringify(state)) return;

    setPast((prev) => [...prev, deepClone(state)]);
    setState(deepClone(newState));
    setFuture([]); // Toute nouvelle action efface le futur possible
  }, [state]);

  // Fonction spéciale pour sauvegarder l'état actuel dans l'historique SANS changer l'état
  // Utile avant de commencer une transformation continue (drag & drop)
  const snapshot = useCallback(() => {
    setPast((prev) => [...prev, deepClone(state)]);
    setFuture([]);
  }, [state]);

  // Permet de mettre à jour l'état actuel SANS toucher à l'historique
  // Utile PENDANT le drag & drop
  const updateStateOnly = useCallback((newState: T) => {
    setState(newState);
  }, []);

  return {
    state,
    set: pushState,          // Utiliser pour : Ajout, Suppression, Duplication
    update: updateStateOnly, // Utiliser pour : Mouvement fluide
    snapshot,                // Utiliser pour : Début de mouvement (MouseDown)
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    historyPast: past,       // Exposé pour debug ou save auto
  };
}


