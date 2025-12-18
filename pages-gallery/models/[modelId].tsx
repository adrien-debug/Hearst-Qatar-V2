/**
 * Page dédiée pour un modèle 3D spécifique
 * Route: /models/[modelId]
 */

import Head from 'next/head';
import { useRouter } from 'next/router';
import { getModelById } from '../../components/3d/UnifiedModelCatalog';
import ModelViewer3D from '../../components/models/ModelViewer3D';
import ModelInfoSidebar from '../../components/models/ModelInfoSidebar';

export default function ModelPage() {
  const router = useRouter();
  const { modelId } = router.query;

  // Récupérer le modèle depuis le catalogue
  const model = typeof modelId === 'string' ? getModelById(modelId) : null;

  // Si le modèle n'existe pas
  if (router.isReady && !model) {
    return (
      <>
        <Head>
          <title>Modèle introuvable - Hearst Qatar</title>
        </Head>
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">Modèle introuvable</h1>
            <p className="text-gray-400 mb-6">
              Le modèle "{modelId}" n'existe pas dans le catalogue.
            </p>
            <button
              onClick={() => router.push('/gallery')}
              className="px-6 py-3 bg-[#8AFD81] text-[#0a0b0d] rounded-lg font-bold hover:bg-[#6FD96A] transition-colors"
            >
              ← Retour à la galerie
            </button>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (!model) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8AFD81] mx-auto mb-4"></div>
          <p className="text-white">Chargement du modèle...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{model.name} - Hearst Qatar</title>
        <meta name="description" content={model.description} />
      </Head>

      {/* Layout Plein Écran - Pas de Header/Sidebar/Footer */}
      <div className="fixed inset-0 flex">
        {/* Viewer 3D (70% de largeur) */}
        <div className="flex-1 h-full">
          <ModelViewer3D model={model} />
        </div>

        {/* Sidebar d'informations - Largeur réduite */}
        <div className="w-[280px] h-full overflow-y-auto bg-[#0a0b0d] border-l border-white/10">
          <ModelInfoSidebar model={model} />
        </div>
      </div>
    </>
  );
}

