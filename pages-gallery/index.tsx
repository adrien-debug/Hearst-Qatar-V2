/**
 * Page Galerie - Explorer tous les modèles 3D
 * Route: / (page d'accueil)
 */

import { useMemo } from 'react';
import Head from 'next/head';
import { UNIFIED_MODEL_CATALOG } from '../components/3d/UnifiedModelCatalog';
import GalleryHeader from '../components/gallery/GalleryHeader';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { useDeletedModels } from '../hooks/useDeletedModels';

export default function GalleryPage() {
  // #region agent log
  if (typeof window !== 'undefined') {
    try {
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'pages-gallery/index.tsx:12',
          message: 'GalleryPage component rendered',
          data: { catalogLength: UNIFIED_MODEL_CATALOG.length },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          hypothesisId: 'E'
        })
      }).catch(() => {});
    } catch (e) {
      // Ignore errors
    }
  }
  // #endregion
  
  const { deleteModel, isDeleted } = useDeletedModels();

  // Filtrer les modèles supprimés
  const visibleModels = useMemo(() => {
    return UNIFIED_MODEL_CATALOG.filter((model) => !isDeleted(model.id));
  }, [isDeleted]);

  const handleDeleteModel = (modelId: string) => {
    deleteModel(modelId);
  };
  
  return (
    <>
      <Head>
        <title>Galerie de Modèles 3D - Hearst Qatar</title>
        <meta
          name="description"
          content="Explorez notre collection de modèles 3D ultra-réalistes pour le projet Hearst Qatar"
        />
      </Head>

      {/* Layout sans Sidebar - Plein écran */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <GalleryHeader />

        {/* Contenu principal - Pleine largeur */}
        <div className="max-w-7xl mx-auto px-8 py-10 pb-20">
          {/* Grille de modèles - Simple et directe */}
          <GalleryGrid 
            models={visibleModels} 
            onDeleteModel={handleDeleteModel}
          />
        </div>
      </div>
    </>
  );
}
