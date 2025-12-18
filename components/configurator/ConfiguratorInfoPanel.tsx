/**
 * Info panel du configurateur
 * Affiche les informations de la scène et du modèle sélectionné
 */

import { UnifiedModel } from '../3d/UnifiedModelCatalog';

interface ConfiguratorInfoPanelProps {
  objectCount: number;
  selectedObjectId: string | null;
  selectedModelForPlacement: UnifiedModel | null;
}

export default function ConfiguratorInfoPanel({
  objectCount,
  selectedObjectId,
  selectedModelForPlacement,
}: ConfiguratorInfoPanelProps) {
  return (
    <div className="absolute top-6 left-6 z-10 space-y-3">
      {/* Info de la scène */}
      <div className="bg-[#0a0b0d]/95 border border-[#8AFD81]/30 rounded-lg px-5 py-3 backdrop-blur-sm shadow-lg">
        <div className="text-[#8AFD81] font-bold text-sm mb-1">
          Scène 3D
        </div>
        <div className="text-gray-400 text-xs">
          {objectCount} objet{objectCount !== 1 ? 's' : ''}
          {selectedObjectId && ' • 1 sélectionné'}
        </div>
      </div>

      {/* Modèle sélectionné pour placement */}
      {selectedModelForPlacement && (
        <div className="bg-blue-500/95 border border-blue-400 rounded-lg px-5 py-3 backdrop-blur-sm shadow-lg max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📦</span>
            <span className="text-white font-bold text-sm">Modèle sélectionné</span>
          </div>
          <div className="text-white/95 text-sm font-medium mb-1">
            {selectedModelForPlacement.name}
          </div>
          <div className="text-white/70 text-xs">
            Cliquez sur la scène pour placer
          </div>
          {selectedModelForPlacement.quality === 'ultra-realistic' && (
            <div className="mt-2 inline-block px-2 py-0.5 bg-white/20 text-white rounded-full text-xs font-semibold">
              ⭐ Ultra-Réaliste
            </div>
          )}
        </div>
      )}
    </div>
  );
}















