/**
 * Panel de Sélection de Layout - Interface Interactive
 * ====================================================
 * 
 * Affiche les propositions de layout avec schémas visuels pour validation
 */

import React, { useState } from 'react';
import LayoutPreview3D, { PowerBlockLayout, TransformerLayout, ContainerPositioning } from './LayoutPreview3D';

interface LayoutSelectionPanelProps {
  onPowerBlockLayoutSelect: (layout: PowerBlockLayout) => void;
  onTransformerLayoutSelect: (layout: TransformerLayout) => void;
  onContainerPositioningSelect: (positioning: ContainerPositioning) => void;
  currentStep: 'power-blocks' | 'transformers' | 'containers' | 'complete';
  config?: {
    powerBlockLayout?: PowerBlockLayout;
    transformerLayout?: TransformerLayout;
    containerPositioning?: ContainerPositioning;
  };
}

/**
 * Schéma ASCII pour visualisation
 */
const LayoutSchemas = {
  powerBlocks: {
    'grid-2x2': {
      name: 'Grille 2×2 (Carré)',
      schema: `┌─────────┬─────────┐
│  PB1    │  PB2    │
│  25MW   │  25MW   │
├─────────┼─────────┤
│  PB3    │  PB4    │
│  25MW   │  25MW   │
└─────────┴─────────┘`,
      advantages: ['Compact', 'Facile à sécuriser'],
      spacing: 120,
    },
    'horizontal-line': {
      name: 'Ligne Horizontale',
      schema: `PB1 ─── PB2 ─── PB3 ─── PB4
25MW   25MW   25MW   25MW`,
      advantages: ['Accès facile', 'Extension simple'],
      spacing: 150,
    },
    'vertical-line': {
      name: 'Ligne Verticale',
      schema: `PB1
25MW
  │
PB2
25MW
  │
PB3
25MW
  │
PB4
25MW`,
      advantages: ['Optimisé pour vent dominant'],
      spacing: 150,
    },
    'l-shape': {
      name: 'Forme L',
      schema: `PB1 ─── PB2
25MW   25MW
  │
PB3 ─── PB4
25MW   25MW`,
      advantages: ['Protection contre vents', 'Accès central'],
      spacing: 120,
    },
  },
  transformers: {
    'single-line': {
      name: 'Ligne Simple',
      schema: `TR1 ── TR2 ── TR3 ── TR4 ── TR5
5MW   5MW   5MW   5MW   5MW`,
      advantages: ['Simple', 'Efficace'],
      spacing: 25,
    },
    'double-line': {
      name: 'Double Ligne',
      schema: `TR1 ── TR2 ── TR3
5MW   5MW   5MW
TR4 ── TR5
5MW   5MW`,
      advantages: ['Compact', 'Organisé'],
      spacing: 20,
    },
    'star': {
      name: 'En Étoile',
      schema: `      TR1
      5MW
       │
TR2 ── TR3 ── TR4
5MW   5MW   5MW
       │
      TR5
      5MW`,
      advantages: ['Centralisé', 'Accès optimal'],
      spacing: 25,
    },
  },
  containers: {
    'side-by-side': {
      name: 'De Chaque Côté',
      schema: `[HD5-A] ── TR ── [HD5-B]`,
      advantages: ['Équilibre', 'Accès facile'],
      distance: 2,
    },
    'behind': {
      name: 'En Ligne Derrière',
      schema: `TR
 │
[HD5-A]
 │
[HD5-B]`,
      advantages: ['Compact', 'Organisé'],
      distance: 3,
    },
  },
};

export default function LayoutSelectionPanel({
  onPowerBlockLayoutSelect,
  onTransformerLayoutSelect,
  onContainerPositioningSelect,
  currentStep,
  config = {},
}: LayoutSelectionPanelProps) {
  const [selectedPowerBlock, setSelectedPowerBlock] = useState<PowerBlockLayout['type'] | null>(null);
  const [selectedTransformer, setSelectedTransformer] = useState<TransformerLayout['type'] | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<ContainerPositioning['type'] | null>(null);

  const handlePowerBlockSelect = (type: PowerBlockLayout['type']) => {
    setSelectedPowerBlock(type);
    const schema = LayoutSchemas.powerBlocks[type];
    onPowerBlockLayoutSelect({
      type,
      spacing: schema.spacing,
    });
  };

  const handleTransformerSelect = (type: TransformerLayout['type']) => {
    setSelectedTransformer(type);
    const schema = LayoutSchemas.transformers[type];
    onTransformerLayoutSelect({
      type,
      spacing: schema.spacing,
    });
  };

  const handleContainerSelect = (type: ContainerPositioning['type']) => {
    setSelectedContainer(type);
    const schema = LayoutSchemas.containers[type];
    onContainerPositioningSelect({
      type,
      distance: schema.distance,
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration du Site 100MW</h2>

      {/* Étape 1: Power Blocks */}
      {currentStep === 'power-blocks' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Étape 1: Disposition des Power Blocks</h3>
          <p className="text-sm text-gray-600 mb-4">Choisissez la disposition des 4 blocs de 25MW</p>
          
          <div className="space-y-4">
            {Object.entries(LayoutSchemas.powerBlocks).map(([key, schema]) => (
              <button
                key={key}
                onClick={() => handlePowerBlockSelect(key as PowerBlockLayout['type'])}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedPowerBlock === key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-2">{schema.name}</div>
                
                {/* Prévisualisation 3D */}
                <div className="mb-3">
                  <LayoutPreview3D
                    powerBlockLayout={{
                      type: key as PowerBlockLayout['type'],
                      spacing: schema.spacing,
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Espacement:</strong> {schema.spacing}m
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Avantages:</strong> {schema.advantages.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape 2: Transformateurs */}
      {currentStep === 'transformers' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Étape 2: Disposition des Transformateurs</h3>
          <p className="text-sm text-gray-600 mb-4">Choisissez la disposition des 5 transformateurs par bloc</p>
          
          <div className="space-y-4">
            {Object.entries(LayoutSchemas.transformers).map(([key, schema]) => (
              <button
                key={key}
                onClick={() => handleTransformerSelect(key as TransformerLayout['type'])}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTransformer === key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-2">{schema.name}</div>
                
                {/* Prévisualisation 3D */}
                {config?.powerBlockLayout && (
                  <div className="mb-3">
                    <LayoutPreview3D
                      powerBlockLayout={config.powerBlockLayout}
                      transformerLayout={{
                        type: key as TransformerLayout['type'],
                        spacing: schema.spacing,
                      }}
                    />
                  </div>
                )}
                
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Espacement:</strong> {schema.spacing}m
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Avantages:</strong> {schema.advantages.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape 3: Containers */}
      {currentStep === 'containers' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Étape 3: Positionnement des Containers</h3>
          <p className="text-sm text-gray-600 mb-4">Choisissez comment positionner les containers HD5</p>
          
          <div className="space-y-4">
            {Object.entries(LayoutSchemas.containers).map(([key, schema]) => (
              <button
                key={key}
                onClick={() => handleContainerSelect(key as ContainerPositioning['type'])}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedContainer === key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-2">{schema.name}</div>
                
                {/* Prévisualisation 3D */}
                {config?.powerBlockLayout && config?.transformerLayout && (
                  <div className="mb-3">
                    <LayoutPreview3D
                      powerBlockLayout={config.powerBlockLayout}
                      transformerLayout={config.transformerLayout}
                      containerPositioning={{
                        type: key as ContainerPositioning['type'],
                        distance: schema.distance,
                      }}
                    />
                  </div>
                )}
                
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Distance:</strong> {schema.distance}m
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Avantages:</strong> {schema.advantages.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Étape complète */}
      {currentStep === 'complete' && (
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Configuration Complète</h3>
          <p className="text-sm text-gray-600">Tous les paramètres ont été sélectionnés</p>
        </div>
      )}
    </div>
  );
}


