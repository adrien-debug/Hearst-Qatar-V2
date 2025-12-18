/**
 * Panel d'Ajout d'Éléments - Discret et Intuitif
 * ==============================================
 * 
 * Panel flottant pour ajouter des éléments depuis le catalogue
 */

import { useState } from 'react';
import { UNIFIED_MODEL_CATALOG, UnifiedModel, getModelsByCategory, EquipmentCategory } from './UnifiedModelCatalog';

interface ElementPlacementPanelProps {
  onPlaceElement: (model: UnifiedModel, position: [number, number, number]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ElementPlacementPanel({
  onPlaceElement,
  isOpen,
  onClose,
}: ElementPlacementPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filtrer les modèles
  const filteredModels = selectedCategory === 'all'
    ? UNIFIED_MODEL_CATALOG
    : getModelsByCategory(selectedCategory);

  const searchFiltered = searchQuery
    ? filteredModels.filter(
        (model) =>
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredModels;

  const categories: Array<{ id: EquipmentCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'Tous', icon: '📦' },
    { id: 'container', label: 'Containers', icon: '📦' },
    { id: 'transformer', label: 'Transformateurs', icon: '⚡' },
    { id: 'power', label: 'Énergie', icon: '🔋' },
    { id: 'distribution', label: 'Distribution', icon: '🔧' },
    { id: 'cooling', label: 'Refroidissement', icon: '❄️' },
    { id: 'generator', label: 'Générateurs', icon: '⚙️' },
  ];

  const handlePlaceElement = (model: UnifiedModel) => {
    // Position par défaut au centre de la scène
    const position: [number, number, number] = [0, 0, 0];
    onPlaceElement(model, position);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 p-4 max-w-md max-h-[70vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ajouter un Élément</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
      />

      {/* Catégories */}
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Liste des modèles */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {searchFiltered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Aucun modèle trouvé</div>
        ) : (
          searchFiltered.map((model) => (
            <button
              key={model.id}
              onClick={() => handlePlaceElement(model)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="font-semibold text-gray-900 text-sm">{model.name}</div>
              <div className="text-xs text-gray-600 mt-1">{model.description}</div>
              <div className="flex items-center gap-2 mt-2">
                {model.power && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {model.power}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {model.dimensions.length}m × {model.dimensions.width}m × {model.dimensions.height}m
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}


