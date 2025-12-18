/**
 * Page Galerie - Explorer tous les modèles 3D
 * Route: /gallery
 */

import Head from 'next/head';
import { UNIFIED_MODEL_CATALOG } from '../components/3d/UnifiedModelCatalog';
import GalleryHeader from '../components/gallery/GalleryHeader';
import GalleryGrid from '../components/gallery/GalleryGrid';

export default function GalleryPage() {
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
          <GalleryGrid models={UNIFIED_MODEL_CATALOG} />
        </div>
      </div>
    </>
  );
}
