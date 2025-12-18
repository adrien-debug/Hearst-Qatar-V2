/**
 * Power Block 25 MW Dynamic - Version avec positions dynamiques depuis elementStates
 * ================================================================================
 */

import React, { useEffect, useState } from 'react';
import PowerBlock25MW from './PowerBlock25MW';

interface PowerBlock25MWDynamicProps {
  id: string;
  onClick?: (elementId: string, event?: React.MouseEvent) => void;
  selectedElementIds?: string[];
  color?: string;
  secondaryColor?: string;
  elementStates?: Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  }>;
}

/**
 * Wrapper qui met à jour dynamiquement les positions depuis elementStates
 */
export default function PowerBlock25MWDynamic({
  id,
  onClick,
  selectedElementIds = [],
  color = '#1a1a1a',
  secondaryColor = '#00A651',
  elementStates = {},
}: PowerBlock25MWDynamicProps) {
  const [forceUpdate, setForceUpdate] = useState(0);

  // Forcer la mise à jour quand elementStates change
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 100); // Mise à jour toutes les 100ms pendant les transformations
    
    return () => clearInterval(interval);
  }, []);

  // Calculer les positions dynamiques pour chaque élément
  const getElementPosition = (elementId: string, defaultPos: [number, number, number]): [number, number, number] => {
    const state = elementStates[elementId];
    return state ? state.position : defaultPos;
  };

  const getElementRotation = (elementId: string, defaultRot: [number, number, number]): [number, number, number] => {
    const state = elementStates[elementId];
    return state ? state.rotation : defaultRot;
  };

  const getElementScale = (elementId: string, defaultScale: number): number => {
    const state = elementStates[elementId];
    return state ? state.scale : defaultScale;
  };

  // Dimensions
  const bodyWidth = 3.8;
  const bodyDepth = 2.3;
  const bodyHeight = 2.2;
  const bodyY = 0.2 / 2 + bodyHeight / 2;
  const elementDistance = 3.0;

  // Positions par défaut
  const defaultPositions: Record<string, [number, number, number]> = {
    [`${id}-bande-colorée`]: [0, bodyY + bodyHeight / 2 - 0.05, bodyDepth / 2 + elementDistance],
    [`${id}-panneau-avant`]: [0, bodyY, bodyDepth / 2 + elementDistance],
    [`${id}-ventilateur-gauche`]: [-bodyWidth / 2 - elementDistance, bodyY, 0],
    [`${id}-ventilateur-droit`]: [bodyWidth / 2 + elementDistance, bodyY, 0],
    [`${id}-ventilateur-arriere`]: [0, bodyY, -bodyDepth / 2 - elementDistance],
    [`${id}-detail-gauche`]: [-bodyWidth / 2 - elementDistance, bodyY - 0.3, 0],
    [`${id}-detail-droit`]: [bodyWidth / 2 + elementDistance, bodyY - 0.3, 0],
  };

  const defaultRotations: Record<string, [number, number, number]> = {
    [`${id}-ventilateur-gauche`]: [0, Math.PI / 2, 0],
    [`${id}-ventilateur-droit`]: [0, -Math.PI / 2, 0],
    [`${id}-ventilateur-arriere`]: [Math.PI / 2, 0, 0],
    [`${id}-detail-gauche`]: [0, Math.PI / 2, 0],
    [`${id}-detail-droit`]: [0, -Math.PI / 2, 0],
  };

  // Utiliser PowerBlock25MW avec les positions dynamiques
  // Note: Pour l'instant, PowerBlock25MW utilise des positions fixes
  // On devra modifier PowerBlock25MW pour accepter des props de positions dynamiques
  return (
    <PowerBlock25MW
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={1}
      onClick={onClick}
      id={id}
      color={color}
      secondaryColor={secondaryColor}
      selectedElementIds={selectedElementIds}
    />
  );
}


