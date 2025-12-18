/**
 * Étape 3 : Sélection du type de terrain
 */

import { TerrainType } from '../../types/project-wizard';
import { TERRAIN_TYPES, TERRAIN_TYPE_LABELS } from '../../data/project-options';

interface TerrainSelectionProps {
  selectedTerrain: TerrainType | null;
  onSelect: (terrain: TerrainType) => void;
}

export default function TerrainSelection({ selectedTerrain, onSelect }: TerrainSelectionProps) {
  const terrains: TerrainType[] = ['sandy', 'gravel', 'concrete', 'rocky', 'mixed'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Type de Terrain</h2>
        <p className="text-slate-400 text-sm">Sélectionnez le type de sol pour votre installation</p>
      </div>

      {/* Grille de sélection */}
      <div className="grid grid-cols-2 gap-4">
        {terrains.map((terrain) => {
          const config = TERRAIN_TYPES[terrain];
          const label = TERRAIN_TYPE_LABELS[terrain];
          const isSelected = selectedTerrain === terrain;

          return (
            <button
              key={terrain}
              onClick={() => onSelect(terrain)}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'bg-[#8AFD81] border-[#8AFD81] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-white/5 border-white/10 hover:border-[#8AFD81]/50 hover:bg-white/10'
              }`}
            >
              <div className={`text-xl font-bold mb-2 ${isSelected ? 'text-[#0a0b0d]' : 'text-white'}`}>
                {label.label}
              </div>
              <div className={`text-sm mb-4 ${isSelected ? 'text-[#0a0b0d]/70' : 'text-slate-400'}`}>
                {label.description}
              </div>

              <div className={`text-xs space-y-1.5 ${isSelected ? 'text-[#0a0b0d]/70' : 'text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  {config.foundationRequired ? '✓' : '✗'} Fondations
                </div>
                <div className="flex items-center gap-2">
                  {config.drainageRequired ? '✓' : '✗'} Drainage
                </div>
                <div className="flex items-center gap-2">
                  💰 ${(config.preparationCost / 1000).toFixed(0)}K préparation
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}














