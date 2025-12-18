/**
 * Panel de Placement VRD - Infrastructure
 * ========================================
 * 
 * Interface pour placer les infrastructures VRD (entrée, parkings, hangars, clôture)
 */

import { useState } from 'react';

export type VRDElementType = 'entrance' | 'parking' | 'maintenance-hangar' | 'staff-hangar' | 'fence';

interface VRDPlacementPanelProps {
  onPlaceVRD: (type: VRDElementType, position: [number, number, number]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const VRDElements: Array<{
  type: VRDElementType;
  name: string;
  description: string;
  icon: string;
  defaultDimensions: string;
}> = [
  {
    type: 'entrance',
    name: 'Entrée Protégée',
    description: 'Portail avec barrière et poste de garde',
    icon: '🚪',
    defaultDimensions: '8m × 4m',
  },
  {
    type: 'parking',
    name: 'Parking',
    description: 'Zone de stationnement pour véhicules',
    icon: '🅿️',
    defaultDimensions: '30m × 20m',
  },
  {
    type: 'maintenance-hangar',
    name: 'Hangar de Maintenance',
    description: 'Hangar pour maintenance des équipements',
    icon: '🔧',
    defaultDimensions: '30m × 20m × 8m',
  },
  {
    type: 'staff-hangar',
    name: 'Hangar Staff',
    description: 'Hangar avec cuisine et logements pour le staff',
    icon: '🏠',
    defaultDimensions: '40m × 25m × 6m',
  },
  {
    type: 'fence',
    name: 'Clôture de Sécurité',
    description: 'Barrière sécurisée autour du périmètre',
    icon: '🔒',
    defaultDimensions: 'Section de 5m',
  },
];

export default function VRDPlacementPanel({
  onPlaceVRD,
  isOpen,
  onClose,
}: VRDPlacementPanelProps) {
  const [selectedType, setSelectedType] = useState<VRDElementType | null>(null);

  if (!isOpen) return null;

  const handlePlace = (type: VRDElementType) => {
    // Position par défaut (sera ajustée par l'utilisateur)
    const position: [number, number, number] = [0, 0, 0];
    onPlaceVRD(type, position);
    setSelectedType(null);
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Infrastructure VRD</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez un élément à placer sur le site
      </p>

      <div className="space-y-3">
        {VRDElements.map((element) => (
          <button
            key={element.type}
            onClick={() => handlePlace(element.type)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedType === element.type
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{element.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{element.name}</div>
                <div className="text-sm text-gray-600 mt-1">{element.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Dimensions: {element.defaultDimensions}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Astuce: Cliquez sur un élément pour le placer au centre de la scène, puis utilisez les outils de transformation pour le positionner précisément.
        </p>
      </div>
    </div>
  );
}


