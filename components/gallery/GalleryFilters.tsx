/**
 * Filtres et recherche pour la galerie
 */

import { EquipmentCategory } from '../3d/UnifiedModelCatalog';
import CategoryIcon from './CategoryIcon';

interface CategoryFilter {
  id: EquipmentCategory | 'all';
  label: string;
  icon: string;
  count: number;
}

interface GalleryFiltersProps {
  categories: CategoryFilter[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showOnlyUltraRealistic?: boolean;
  onToggleUltraRealistic?: (value: boolean) => void;
}

export default function GalleryFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showOnlyUltraRealistic = false,
  onToggleUltraRealistic,
}: GalleryFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un modèle..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-slate-300 focus:border-[#8AFD81] focus:ring-2 focus:ring-[#8AFD81]/20 outline-none text-sm"
        />
        {/* Icône Recherche Vectorielle */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-[#8AFD81]/30'
            }`}
          >
            <CategoryIcon icon={cat.icon} size={14} />
            <span>{cat.label}</span>
            <span className="text-xs opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Toggle Ultra-Réaliste */}
      {onToggleUltraRealistic && (
        <div className="flex items-center justify-between bg-gradient-to-r from-[#8AFD81]/10 to-transparent rounded-lg p-3 border border-[#8AFD81]/20">
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={showOnlyUltraRealistic}
              onChange={(e) => onToggleUltraRealistic(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-[#8AFD81] focus:ring-[#8AFD81]"
            />
            <div>
              <span className="text-sm font-semibold text-[#0b1120]">
                ⭐ Seulement les modèles ultra-réalistes
              </span>
              <p className="text-xs text-gray-600">
                Modèles basés sur des photos réelles
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}















