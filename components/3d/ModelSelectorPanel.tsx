/**
 * 🎨 PANNEAU DE SÉLECTION DE MODÈLES
 * 
 * Permet de choisir un modèle 3D spécifique avant de le placer dans la scène
 */

import React, { useState, useMemo } from 'react';
import { UNIFIED_MODEL_CATALOG, UnifiedModel, getCategories, EquipmentCategory } from './UnifiedModelCatalog';

interface ModelSelectorPanelProps {
  onSelectModel: (model: UnifiedModel) => void;
  onClose: () => void;
  selectedCategory?: EquipmentCategory;
  showOnlyUltraRealistic?: boolean;
}

export default function ModelSelectorPanel({
  onSelectModel,
  onClose,
  selectedCategory,
  showOnlyUltraRealistic = false,
}: ModelSelectorPanelProps) {
  const [filterCategory, setFilterCategory] = useState<EquipmentCategory | 'all'>(selectedCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<UnifiedModel | null>(null);
  const [showOnlyPhoto, setShowOnlyPhoto] = useState(showOnlyUltraRealistic);

  // Catégories avec compteurs
  const categories = useMemo(() => {
    const cats = getCategories();
    const allCount = UNIFIED_MODEL_CATALOG.length;
    return [
      { id: 'all' as const, label: 'Tous', icon: '🏭', count: allCount },
      ...cats,
    ];
  }, []);

  // Modèles filtrés
  const filteredModels = useMemo(() => {
    return UNIFIED_MODEL_CATALOG.filter((model) => {
      const matchesCategory = filterCategory === 'all' || model.category === filterCategory;
      const matchesSearch =
        searchQuery === '' ||
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesQuality = !showOnlyPhoto || model.source === 'photo-based';
      return matchesCategory && matchesSearch && matchesQuality;
    });
  }, [filterCategory, searchQuery, showOnlyPhoto]);

  const handleSelectModel = (model: UnifiedModel) => {
    setSelectedModel(model);
    onSelectModel(model);
  };

  return (
    <div className="absolute top-4 right-4 z-[120] max-w-md w-full">
      <div className="bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8AFD81]/20 to-[#8AFD81]/10 p-4 border-b border-[#8AFD81]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8AFD81] rounded-lg flex items-center justify-center">
                <span className="text-lg">📦</span>
              </div>
              <h3 className="text-lg font-bold text-white">Sélection de Modèle</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="🔍 Rechercher un modèle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#8AFD81] focus:ring-2 focus:ring-[#8AFD81]/20 outline-none text-sm"
          />
        </div>

        {/* Filtres */}
        <div className="p-3 border-b border-white/10">
          {/* Catégories */}
          <div className="flex gap-1 mb-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
                  filterCategory === cat.id
                    ? 'bg-[#8AFD81] text-[#0a0b0d]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {cat.icon} {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Toggle qualité */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyPhoto}
              onChange={(e) => setShowOnlyPhoto(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#8AFD81] focus:ring-[#8AFD81]"
            />
            <span className="text-xs text-white/80">
              ⭐ Seulement les modèles ultra-réalistes (basés sur photos)
            </span>
          </label>
        </div>

        {/* Liste des modèles */}
        <div className="max-h-[500px] overflow-y-auto p-3 space-y-2">
          {filteredModels.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-white/60 text-sm">Aucun modèle trouvé</p>
            </div>
          ) : (
            filteredModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedModel?.id === model.id
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {/* Header du modèle */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">{model.name}</div>
                    <div className={`text-xs ${selectedModel?.id === model.id ? 'text-[#0a0b0d]/70' : 'text-white/60'}`}>
                      {model.description}
                    </div>
                  </div>
                  {model.quality === 'ultra-realistic' && (
                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedModel?.id === model.id ? 'bg-[#0a0b0d]/20' : 'bg-[#8AFD81]/20 text-[#8AFD81]'
                    }`}>
                      ⭐ Ultra
                    </div>
                  )}
                </div>

                {/* Spécifications */}
                <div className="flex gap-3 text-xs mb-2">
                  <div className={selectedModel?.id === model.id ? 'text-[#0a0b0d]/70' : 'text-white/60'}>
                    📐 {model.dimensions.length}m × {model.dimensions.width}m × {model.dimensions.height}m
                  </div>
                  {model.power && (
                    <div className={selectedModel?.id === model.id ? 'text-[#0a0b0d]/70' : 'text-white/60'}>
                      ⚡ {model.power}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {model.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedModel?.id === model.id
                          ? 'bg-[#0a0b0d]/20 text-[#0a0b0d]'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {model.tags.length > 3 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedModel?.id === model.id
                          ? 'bg-[#0a0b0d]/20 text-[#0a0b0d]'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      +{model.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Indicateur de sélection */}
                {selectedModel?.id === model.id && (
                  <div className="mt-2 flex items-center gap-1 text-xs font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sélectionné
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer avec instructions */}
        {selectedModel && (
          <div className="p-3 border-t border-white/10 bg-[#8AFD81]/10">
            <div className="text-xs text-white/80 space-y-1">
              <p className="font-medium text-white">✨ Modèle sélectionné !</p>
              <p>• Cliquez sur la scène 3D pour placer ce modèle</p>
              <p>• Utilisez les contrôles pour ajuster la position</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}















