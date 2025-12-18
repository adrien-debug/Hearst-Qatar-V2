import React, { useMemo } from 'react';
import BarriereDesign from './BarriereDesign';
import EntranceGate3D from './EntranceGate3D';
import FireExtinguisher from './FireExtinguisher';

interface SmartPerimeterProps {
  width?: number; // Largeur totale (axe X)
  depth?: number; // Profondeur totale (axe Z)
  height?: number; // Hauteur de la clôture
  gateWidth?: number; // Largeur du portail
}

export default function SmartPerimeter({
  width = 60,
  depth = 40,
  height = 2.4,
  gateWidth = 8,
}: SmartPerimeterProps) {
  
  // Configuration
  const segmentLength = 2.5; // Longueur standard d'une section de barrière
  const extinguisherInterval = 6; // Un extincteur toutes les X sections

  // Fonction utilitaire pour générer une ligne de barrières
  const generateLine = (
    totalLength: number, 
    positionOffset: [number, number, number], 
    rotationY: number, 
    hasGate: boolean = false
  ) => {
    const items = [];
    
    // Si il y a un portail, on sépare en deux parties (gauche et droite du portail)
    if (hasGate) {
      const halfL = (totalLength - gateWidth) / 2;
      
      // Partie Gauche
      const numSegLeft = Math.ceil(halfL / segmentLength);
      const actualSegLenLeft = halfL / numSegLeft; // Ajustement fin pour remplir exactement
      
      for (let i = 0; i < numSegLeft; i++) {
        // Position relative le long de la ligne, partant de l'extrémité gauche vers le centre
        // Start: -totalLength/2
        // End: -gateWidth/2
        const x = -totalLength/2 + (i * actualSegLenLeft) + actualSegLenLeft/2;
        
        const isExtinguisherSpot = (i % extinguisherInterval === 0);

        items.push(
          <group key={`gate-left-${i}`} position={[x, 0, 0]}>
             <BarriereDesign length={actualSegLenLeft} height={height} />
             {isExtinguisherSpot && (
               <FireExtinguisher position={[0, 0.5, 0.2]} scale={1.2} />
             )}
          </group>
        );
      }

      // Partie Droite
      const numSegRight = Math.ceil(halfL / segmentLength);
      const actualSegLenRight = halfL / numSegRight;

      for (let i = 0; i < numSegRight; i++) {
        // Start: +gateWidth/2
        const x = gateWidth/2 + (i * actualSegLenRight) + actualSegLenRight/2;
        
        const isExtinguisherSpot = (i % extinguisherInterval === 0);

        items.push(
          <group key={`gate-right-${i}`} position={[x, 0, 0]}>
             <BarriereDesign length={actualSegLenRight} height={height} />
             {isExtinguisherSpot && (
               <FireExtinguisher position={[0, 0.5, 0.2]} scale={1.2} />
             )}
          </group>
        );
      }

    } else {
      // Ligne pleine standard
      const numSeg = Math.ceil(totalLength / segmentLength);
      const actualSegLen = totalLength / numSeg; // Ajustement fin

      for (let i = 0; i < numSeg; i++) {
        const x = -totalLength/2 + (i * actualSegLen) + actualSegLen/2;
        
        const isExtinguisherSpot = (i % extinguisherInterval === 0);

        items.push(
          <group key={`line-${i}`} position={[x, 0, 0]}>
             <BarriereDesign length={actualSegLen} height={height} />
             {isExtinguisherSpot && (
               <FireExtinguisher position={[0, 0.5, 0.2]} scale={1.2} />
             )}
          </group>
        );
      }
    }

    return (
      <group position={positionOffset} rotation={[0, rotationY, 0]}>
        {items}
      </group>
    );
  };

  return (
    <group>
      {/* 1. Face Avant (Z+) avec Portail */}
      {generateLine(width, [0, 0, depth/2], 0, true)}
      
      {/* Le Portail Lui-même */}
      <EntranceGate3D 
        position={[0, 0, depth/2]} 
        width={gateWidth} 
        height={height * 1.2} // Un peu plus haut que la clôture pour l'effet "Entrée"
        isOpen={false} 
      />

      {/* 2. Face Arrière (Z-) */}
      {generateLine(width, [0, 0, -depth/2], Math.PI)}

      {/* 3. Face Gauche (X-) */}
      {generateLine(depth, [-width/2, 0, 0], -Math.PI/2)}

      {/* 4. Face Droite (X+) */}
      {generateLine(depth, [width/2, 0, 0], Math.PI/2)}

    </group>
  );
}


