/**
 * Page Configurateur 3D - Créer et configurer des projets
 * Route: /configurator
 */

import Head from 'next/head';
import { useState, Suspense, useEffect, useCallback } from 'react';
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
import { PlacedEquipment, TransformMode, EquipmentType, ProjectConfiguration as ConfiguratorProjectConfig } from '../types/configurator';
import { useAuth } from '../contexts/AuthContext';
import { saveProject as saveProjectToSupabase } from '../lib/supabase/services/projects';
import { ProjectConfiguration, EquipmentPosition } from '../lib/projectGenerator';

export default function ConfiguratorPage() {
  const router = useRouter();
  const { model: modelIdFromQuery } = router.query;
  const { user, isAuthenticated } = useAuth();

  // États principaux
  const [placedEquipment, setPlacedEquipment] = useState<PlacedEquipment[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('none');
  const [selectedModelForPlacement, setSelectedModelForPlacement] = useState<UnifiedModel | null>(null);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [equipmentPlacementMode, setEquipmentPlacementMode] = useState<EquipmentType>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

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

  // Sauvegarde automatique périodique (toutes les 2 minutes si authentifié)
  useEffect(() => {
    if (!isAuthenticated || !user || placedEquipment.length === 0) return;

    const autoSaveInterval = setInterval(() => {
      if (saveStatus === 'idle' && !isSaving) {
        handleSaveToDatabase();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(autoSaveInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id, placedEquipment.length, saveStatus, isSaving]);

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

  // Convertir PlacedEquipment en EquipmentPosition pour Supabase
  const convertToEquipmentPosition = (eq: PlacedEquipment): EquipmentPosition => {
    return {
      id: eq.id,
      // NB: on ne persiste en base que les équipements "matériels" gérés par EquipmentPosition
      type: eq.type as 'transformer' | 'container' | 'cooling' | 'switchgear',
      modelId: eq.modelId,
      position: eq.position,
      rotation: eq.rotation,
      metadata: eq.metadata,
    };
  };

  // Fonction de sauvegarde en base de données
  const handleSaveToDatabase = useCallback(async () => {
    if (!isAuthenticated || !user) {
      alert('Veuillez vous connecter pour sauvegarder votre projet');
      router.push('/login');
      return;
    }

    if (placedEquipment.length === 0) {
      alert('Aucun équipement à sauvegarder');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // Convertir les équipements
      const equipment: EquipmentPosition[] = placedEquipment
        .filter(eq => ['container', 'transformer', 'cooling', 'switchgear'].includes(eq.type))
        .map(convertToEquipmentPosition);

      // Créer la configuration du projet
      const projectConfig: ProjectConfiguration = {
        id: `configurator_${Date.now()}`,
        name: `Projet Configurateur ${new Date().toLocaleDateString('fr-FR')}`,
        powerMW: 0, // Peut être calculé plus tard
        moduleCount: 0,
        conditions: {
          soilType: 'sandy',
          climateType: 'desert',
          coolingType: 'air',
          hasConcreteSlabs: false,
          hasMicroPerforatedWall: false,
          hasCirculation: true,
        },
        equipment,
        vrd: [],
        groundSize: 200,
        cameraPosition: [0, 80, 150],
        metadata: {
          transformersCount: equipment.filter(eq => eq.type === 'transformer').length,
          containersCount: equipment.filter(eq => eq.type === 'container').length,
          coolingCount: equipment.filter(eq => eq.type === 'cooling').length,
          concreteSlabsCount: 0,
          circulationPathsLength: 0,
          createdAt: new Date().toISOString(),
        },
      };

      // Sauvegarder dans Supabase
      const { error } = await saveProjectToSupabase(projectConfig, user.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        setSaveStatus('error');
        alert(`Erreur lors de la sauvegarde: ${error.message}`);
      } else {
        setSaveStatus('success');
        console.log('✅ Projet sauvegardé avec succès');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      setSaveStatus('error');
      alert('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }, [placedEquipment, isAuthenticated, user, router]);

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

      <div className="fixed inset-0 bg-slate-900">
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
            className="px-4 py-2 rounded-lg bg-slate-900/95 border border-[#8AFD81]/30 text-[#8AFD81] hover:bg-[#8AFD81]/10 transition-colors backdrop-blur-sm text-sm font-semibold shadow-lg"
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
          onSaveToDatabase={handleSaveToDatabase}
          isSaving={isSaving}
          saveStatus={saveStatus}
          isAuthenticated={isAuthenticated}
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
          <div className="bg-slate-900/95 border border-white/10 rounded-lg px-4 py-3 backdrop-blur-sm shadow-lg">
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
















