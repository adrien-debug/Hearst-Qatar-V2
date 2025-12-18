/**
 * Grille de modèles pour la galerie
 */

import { UnifiedModel } from '../3d/UnifiedModelCatalog';
import ModelCard from './ModelCard';

interface GalleryGridProps {
  models: UnifiedModel[];
  emptyMessage?: string;
  onDeleteModel?: (modelId: string) => void;
}

export default function GalleryGrid({
  models,
  emptyMessage = 'Aucun modèle trouvé',
  onDeleteModel,
}: GalleryGridProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-white/60">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {models.map((model) => (
        <ModelCard 
          key={model.id} 
          model={model} 
          onDelete={onDeleteModel}
        />
      ))}
    </div>
  );
}


