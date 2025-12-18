/**
 * Page Configurateur 3D - Créer et configurer des projets
 * Route: /configurator
 */

import Head from 'next/head';
import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SceneLighting from '../components/3d/Lighting';
import GroundPatch from '../components/3d/GroundPatch';
import EnvironmentHDRI from '../components/3d/EnvironmentHDRI';
import EquipmentPlacer from '../components/3d/EquipmentPlacer';
import ModelSelectorPanel from '../components/3d/ModelSelectorPanel';
import ConfiguratorToolbar from '../components/configurator/ConfiguratorToolbar';
import ConfiguratorInfoPanel from '../components/configurator/ConfiguratorInfoPanel';
import { getModelById, UnifiedModel } from '../components/3d/UnifiedModelCatalog';
import { PlacedEquipment, TransformMode, EquipmentType } from '../types/configurator';

export default function ConfiguratorPage() {
  const router = useRouter();
  const { model: modelIdFromQuery } = router.query;

  // États principaux
  const [placedEquipment, setPlacedEquipment] = useState<PlacedEquipment[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('none');
  const [selectedModelForPlacement, setSelectedModelForPlacement] = useState<UnifiedModel | null>(null);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [equipmentPlacementMode, setEquipmentPlacementMode] = useState<EquipmentType>('none');

  // Pré-sélectionner un modèle si passé en query param
  useEffect(() => {
    if (modelIdFromQuery && typeof modelIdFromQuery === 'string') {
      const model = getModelById(modelIdFromQuery);
      if (model) {
        setSelectedModelForPlacement(model);
        // Déterminer le type d'équipement
        const equipmentType: EquipmentType =
          model.category === 'container' ? 'container' :
          model.category === 'transformer' ? 'transformer' :
          model.category === 'cooling' ? 'cooling' :
          model.category === 'generator' ? 'generator' :
          model.category === 'distribution' ? 'switchgear' :
          'transformer';
        setEquipmentPlacementMode(equipmentType);
      }
    }
  }, [modelIdFromQuery]);

  // Handler pour placer un équipement
  const handlePlaceEquipment = (
    type: EquipmentType,
    position: [number, number, number],
    startPosition?: [number, number, number],
    endPosition?: [number, number, number],
    orientation?: 'horizontal' | 'vertical',
    modelId?: string
  ) => {
    const newEquipment: PlacedEquipment = {
      id: `equipment-${Date.now()}`,
      type,
      modelId: modelId || selectedModelForPlacement?.id || 'default',
      position,
      rotation: [0, 0, 0],
    };
    setPlacedEquipment([...placedEquipment, newEquipment]);
  };

  // Handler pour supprimer l'objet sélectionné
  const handleDeleteSelected = () => {
    if (!selectedObjectId) return;
    setPlacedEquipment(placedEquipment.filter((eq) => eq.id !== selectedObjectId));
    setSelectedObjectId(null);
  };

  // Handler pour tout effacer
  const handleClearAll = () => {
    setPlacedEquipment([]);
    setSelectedObjectId(null);
    setTransformMode('none');
  };

  // Handler pour sélectionner un modèle depuis le panneau
  const handleSelectModel = (model: UnifiedModel) => {
    setSelectedModelForPlacement(model);
    // Déterminer le type d'équipement
    const equipmentType: EquipmentType =
      model.category === 'container' ? 'container' :
      model.category === 'transformer' ? 'transformer' :
      model.category === 'cooling' ? 'cooling' :
      model.category === 'generator' ? 'generator' :
      model.category === 'distribution' ? 'switchgear' :
      'transformer';
    setEquipmentPlacementMode(equipmentType);
  };

  return (
    <>
      <Head>
        <title>Configurateur 3D - Hearst Qatar</title>
        <meta
          name="description"
          content="Créez et configurez votre projet 3D avec notre configurateur interactif"
        />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta name="pragma" content="no-cache" />
        <meta name="expires" content="0" />
      </Head>

      <div className="fixed inset-0 bg-[#0a0b0d]">
        {/* Scène 3D */}
        <Canvas
          camera={{ position: [0, 80, 150], fov: 50 }}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            <SceneLighting />
            <EnvironmentHDRI />
            <GroundPatch type="concrete" width={1000} length={1000} color="#9b9b9b" />

            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={20}
              maxDistance={500}
              maxPolarAngle={Math.PI / 2.1}
              zoomToCursor={true}
              mouseButtons={{
                LEFT: 2,   // Pan (clic gauche)
                MIDDLE: 1, // Zoom
                RIGHT: 0,  // Rotate (clic droit)
              }}
            />

            <EquipmentPlacer
              placementMode={equipmentPlacementMode}
              placedEquipment={placedEquipment}
              onPlaceEquipment={handlePlaceEquipment}
              alwaysRender={true}
            />
          </Suspense>
        </Canvas>

        {/* Info Panel (Top Left) */}
        <ConfiguratorInfoPanel
          objectCount={placedEquipment.length}
          selectedObjectId={selectedObjectId}
          selectedModelForPlacement={selectedModelForPlacement}
        />

        {/* Navigation (Top Right) */}
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-[#0a0b0d]/95 border border-[#8AFD81]/30 text-[#8AFD81] hover:bg-[#8AFD81]/10 transition-colors backdrop-blur-sm text-sm font-semibold shadow-lg"
          >
            📦 Galerie
          </Link>
        </div>

        {/* Toolbar (Bottom Center) */}
        <ConfiguratorToolbar
          onOpenModelSelector={() => setModelSelectorOpen(!modelSelectorOpen)}
          modelSelectorOpen={modelSelectorOpen}
          selectedObjectId={selectedObjectId}
          transformMode={transformMode}
          onTransformModeChange={setTransformMode}
          onDeleteSelected={handleDeleteSelected}
          onClearAll={handleClearAll}
          objectCount={placedEquipment.length}
        />

        {/* Panneau de sélection de modèles */}
        {modelSelectorOpen && (
          <ModelSelectorPanel
            onSelectModel={handleSelectModel}
            onClose={() => setModelSelectorOpen(false)}
          />
        )}

        {/* Instructions (Bottom Left) - UPDATED v2 */}
        <div className="hidden lg:block absolute bottom-6 left-6 z-10">
          <div className="bg-[#0a0b0d]/95 border border-white/10 rounded-lg px-4 py-3 backdrop-blur-sm shadow-lg">
            <div className="text-white text-xs font-semibold mb-2 uppercase tracking-wide">
              🖱️ Contrôles 3D
            </div>
            <div className="text-gray-400 text-xs space-y-1">
              <div>• <span className="text-[#8AFD81] font-bold">Clic droit</span> - Rotation de la caméra</div>
              <div>• <span className="text-white font-bold">Clic gauche</span> - Déplacer la vue (Pan)</div>
              <div>• <span className="text-white font-bold">Molette</span> - Zoom avant/arrière</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

