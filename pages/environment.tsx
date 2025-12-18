/**
 * Page Environnement 3D
 * Affiche la scène 3D complète avec équipements ultra-réalistes et infrastructure VRD
 */

import React, { Suspense, useEffect, useState } from 'react';
import Head from 'next/head';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { useRouter } from 'next/router';
import { useProject } from '../contexts/ProjectContext';
import ModularLayout from '../components/3d/ModularLayout';
import VRDInfrastructure from '../components/3d/VRDInfrastructure';
import GroundPatch from '../components/3d/GroundPatch';
import SceneLighting from '../components/3d/Lighting';
import TransformControls3D from '../components/3d/TransformControls3D';
import ToolbarControls from '../components/environment/ToolbarControls';
import EquipmentList from '../components/environment/EquipmentList';
import EnhancedToolbar from '../components/environment/EnhancedToolbar';
import CompactToolbar from '../components/environment/CompactToolbar';
import projectTemplates from '../config/project-templates.json';
import { useGpsSync } from '../hooks/useGpsSync';
import { GpsPoint } from '../utils/gpsToAnnotation';

/**
 * Composant de la scène 3D
 */
function Scene3D({ 
  currentProject,
  equipment,
  selectedObjectId, 
  onSelectEquipment,
  transformMode,
  onTransform,
}: { 
  currentProject: any;
  equipment: any[];
  selectedObjectId: string | null;
  onSelectEquipment: (id: string) => void;
  transformMode: 'translate' | 'rotate' | 'scale' | null;
  onTransform: (id: string, position: [number, number, number], rotation: [number, number, number]) => void;
}) {
  if (!currentProject) {
    return (
      <group>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8AFD81" />
        </mesh>
      </group>
    );
  }

  return (
    <group onClick={() => onSelectEquipment('')}>
      {/* Sol : dalle béton (recouvre le sable) */}
      <GroundPatch type="concrete" width={currentProject.groundSize} length={currentProject.groundSize} color="#9b9b9b" />
      
      {/* Grille d'alignement pour placement manuel */}
      <gridHelper args={[200, 40, '#8AFD81', '#ffffff']} position={[0, 0.05, 0]} />
      
      {/* Infrastructure VRD - Désactivée pour placement manuel */}
      {/* <VRDInfrastructure config={projectTemplates.vrd_infrastructure} /> */}
      
      {/* Équipements modulaires avec sélection */}
      <TransformControls3D
        selectedObjectId={selectedObjectId}
        mode={transformMode}
        onTransform={onTransform}
      >
        <ModularLayout 
          equipment={equipment}
          selectedObjectId={selectedObjectId}
          onSelectEquipment={onSelectEquipment}
        />
      </TransformControls3D>
    </group>
  );
}

/**
 * Panneau d'informations avec coordonnées de l'équipement sélectionné
 */
function InfoPanel({ selectedEquipmentId }: { selectedEquipmentId: string | null }) {
  const { currentProject, equipment } = useProject();
  
  const selectedEquipment = equipment.find(eq => eq.id === selectedEquipmentId);

  if (!currentProject) return null;

  return (
    <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 shadow-2xl max-w-md">
      {/* Header - Style Hearst */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
        <div className="w-14 h-14 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/30">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wider mb-1">Hearst Project</div>
          <h2 className="text-white font-bold text-xl">{currentProject.name}</h2>
          <p className="text-white/50 text-sm">{currentProject.powerMW}MW Mining Facility</p>
        </div>
      </div>
      
      {/* Coordonnées de l'équipement sélectionné */}
      {selectedEquipment && (
        <div className="mb-6 pb-6 border-b border-white/10">
          <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wider mb-3">Équipement sélectionné</div>
          <div className="text-white font-bold text-lg mb-3">{selectedEquipment.id}</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Position X</span>
              <span className="text-white font-mono text-sm">{selectedEquipment.position[0].toFixed(2)}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Position Y</span>
              <span className="text-white font-mono text-sm">{selectedEquipment.position[1].toFixed(2)}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Position Z</span>
              <span className="text-white font-mono text-sm">{selectedEquipment.position[2].toFixed(2)}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Rotation Y</span>
              <span className="text-white font-mono text-sm">{(selectedEquipment.rotation[1] * 180 / Math.PI).toFixed(0)}°</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats - Style Hearst */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm uppercase tracking-wide">Modules</span>
          <span className="text-[#8AFD81] font-bold text-lg">{currentProject.moduleCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm uppercase tracking-wide">Transformers</span>
          <span className="text-white font-semibold text-lg">{currentProject.metadata.transformersCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm uppercase tracking-wide">Containers</span>
          <span className="text-white font-semibold text-lg">{currentProject.metadata.containersCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm uppercase tracking-wide">Cooling Systems</span>
          <span className="text-white font-semibold text-lg">{currentProject.metadata.coolingCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/60 text-sm uppercase tracking-wide">Ground Size</span>
          <span className="text-white font-semibold text-lg">{currentProject.groundSize}m²</span>
        </div>
      </div>

      {/* Equipment Count - Style Hearst */}
      <div className="bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-xl p-4">
        <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wider mb-2">Equipment Placed</div>
        <div className="text-white text-3xl font-bold">{equipment.length}</div>
        <div className="text-white/40 text-xs mt-1">Ultra-realistic 4K models</div>
      </div>
    </div>
  );
}

/**
 * Contrôles de la scène
 */
function SceneControls() {
  const router = useRouter();
  const { currentProject, saveProject } = useProject();

  const handleSave = () => {
    saveProject();
    alert('Projet sauvegardé !');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="absolute top-6 right-6 z-10 flex gap-4">
      {/* Bouton Save - Style Hearst */}
      <button
        onClick={handleSave}
        className="px-8 py-4 bg-[#8AFD81] text-[#0a0b0d] rounded-2xl hover:bg-[#8AFD81]/90 hover:shadow-lg hover:shadow-[#8AFD81]/30 transition-all font-bold shadow-xl flex items-center gap-3 border-2 border-[#8AFD81]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Save Project
      </button>
      
      {/* Bouton Back - Style Hearst */}
      <button
        onClick={handleBack}
        className="px-8 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm shadow-xl border-2 border-white/20 hover:border-[#8AFD81]/50 font-medium"
      >
        ← Back
      </button>
    </div>
  );
}

/**
 * Instructions de contrôle
 */
function ControlInstructions() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="absolute bottom-6 left-6 z-10 w-12 h-12 bg-slate-900/90 backdrop-blur-xl border-2 border-[#8AFD81]/40 rounded-xl flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-xl"
        title="Afficher les contrôles"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 left-6 z-10 bg-slate-900/90 backdrop-blur-xl border-2 border-[#8AFD81]/40 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[#8AFD81] text-xs font-bold uppercase tracking-wider">
          Contrôles
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/40 hover:text-white transition-colors"
          title="Masquer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="text-white/90 text-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#8AFD81]"></div>
          <span className="text-white font-medium">Clic Gauche</span>
          <span className="text-white/60">- Rotation</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#8AFD81]"></div>
          <span className="text-white font-medium">Clic Droit</span>
          <span className="text-white/60">- Déplacer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#8AFD81]"></div>
          <span className="text-white font-medium">Molette</span>
          <span className="text-white/60">- Zoom</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Loader pendant le chargement
 */
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8AFD81] mx-auto mb-6"></div>
        <p className="text-white text-xl font-medium">Chargement de l'environnement 3D...</p>
        <p className="text-white/60 text-sm mt-2">Modèles ultra-réalistes 4K</p>
      </div>
    </div>
  );
}

/**
 * Contenu de la page
 */
function EnvironmentContent() {
  const router = useRouter();
  const { currentProject, equipment, isLoading, selectedEquipmentId, setSelectedEquipmentId, removeEquipment, updateEquipment, saveProject } = useProject();
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale' | null>(null);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [gpsPoints, setGpsPoints] = useState<GpsPoint[]>([]);

  // Charger les points GPS
  useEffect(() => {
    fetch('/spline-positions.json')
      .then(res => res.json())
      .then(data => {
        setGpsPoints(data);
        console.log('📍 Points GPS chargés:', data.length);
      })
      .catch(err => {
        console.error('❌ Erreur chargement GPS:', err);
      });
  }, []);

  // Utiliser le hook de synchronisation GPS
  const {
    selectEquipment: selectEquipmentWithGps,
    selectedGpsName,
    mappingStats,
    isSynced,
  } = useGpsSync({
    equipment,
    gpsPoints,
    onEquipmentSelect: (id) => {
      setSelectedEquipmentId(id);
      if (!id) {
        setTransformMode(null);
      }
    },
    debug: process.env.NODE_ENV === 'development',
  });

  const handleSelectEquipment = (id: string) => {
    selectEquipmentWithGps(id || null);
    
    // TOUJOURS activer le mode translate quand un équipement est sélectionné
    // Le contrôle reste visible sous l'équipement
    if (id) {
      setTransformMode('translate');
    } else {
      setTransformMode(null);
    }
  };

  const handleTransform = (id: string, position: [number, number, number], rotation: [number, number, number]) => {
    updateEquipment(id, { position, rotation });
    
    // Auto-save après chaque transformation
    setTimeout(() => {
      saveProject();
      setSaveMessage('✅ Position sauvegardée');
      setTimeout(() => setSaveMessage(''), 2000);
    }, 500);
  };

  const handleDelete = () => {
    if (selectedEquipmentId) {
      removeEquipment(selectedEquipmentId);
      setSelectedEquipmentId(null);
      setTransformMode(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedEquipmentId(null);
    setTransformMode(null);
  };
  
  // Raccourcis clavier pour les modes de transformation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedEquipmentId) return;
      
      if (e.key === 'r' || e.key === 'R') {
        // Basculer entre translate et rotate
        setTransformMode(prev => prev === 'rotate' ? 'translate' : 'rotate');
        console.log('🔧 Mode:', transformMode === 'rotate' ? 'Translation' : 'Rotation');
      } else if (e.key === 'Escape') {
        setTransformMode(null);
        setSelectedEquipmentId(null);
        console.log('🔧 Sélection annulée');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedEquipmentId, transformMode]);
  
  const handleExportPositions = () => {
    const positions = equipment.map(eq => ({
      id: eq.id,
      type: eq.type,
      position: eq.position,
      rotation: eq.rotation,
    }));
    
    const json = JSON.stringify(positions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `positions-${currentProject?.name || 'projet'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSaveMessage('📥 Positions exportées');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pages/environment.tsx:useEffect',message:'useEffect check project',data:{hasProject:!!currentProject,isLoading,willRedirect:!isLoading && !currentProject},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // Attendre que le chargement soit terminé avant de rediriger
    if (isLoading) return;
    
    // Si pas de projet actif après le chargement, rediriger vers l'accueil
    if (!currentProject) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pages/environment.tsx:redirectToHome',message:'Redirecting to home - no project after loading',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      // Petit délai pour laisser le temps au context de se synchroniser
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentProject, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentProject) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{currentProject.name} - Environnement 3D</title>
        <meta name="description" content={`Projet ${currentProject.powerMW}MW - Visualisation 3D`} />
      </Head>

      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Scène 3D */}
        <Canvas
          camera={{ 
            position: currentProject.cameraPosition, 
            fov: 50 
          }}
          shadows={performanceMode ? false : "soft"}
          dpr={performanceMode ? [1, 1] : [1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{
            antialias: !performanceMode,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          frameloop="demand"
        >
          <Suspense fallback={null}>
            {/* Éclairage optimisé */}
            <SceneLighting />
            
            {/* Ciel simplifié pour performance */}
            <Sky 
              distance={450000} 
              sunPosition={[100, 20, 100]} 
              inclination={0.6} 
              azimuth={0.25}
              turbidity={8}
              rayleigh={0.5}
            />
            
            {/* Scène 3D avec contrôles */}
            <Scene3D 
              currentProject={currentProject}
              equipment={equipment}
              selectedObjectId={selectedEquipmentId}
              onSelectEquipment={handleSelectEquipment}
              transformMode={transformMode}
              onTransform={handleTransform}
            />
            
            {/* Contrôles de la caméra - Optimisés */}
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={20}
              maxDistance={currentProject.groundSize * 2}
              maxPolarAngle={Math.PI / 2.1}
              zoomToCursor={true}
              makeDefault
              enablePan={true}
              panSpeed={0.5}
              rotateSpeed={0.5}
              zoomSpeed={0.5}
            />
          </Suspense>
        </Canvas>

        {/* UI Overlay */}
        <InfoPanel selectedEquipmentId={selectedEquipmentId} />
        <EquipmentList
          equipment={equipment}
          selectedId={selectedEquipmentId}
          onSelect={handleSelectEquipment}
          onDelete={(id) => removeEquipment(id)}
        />
        <ControlInstructions />
        
        {/* Bouton Mode Performance et Indicateurs (Top Right) */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-3 items-end">
          <button
            onClick={() => setPerformanceMode(!performanceMode)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              performanceMode 
                ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/30' 
                : 'bg-slate-900/90 backdrop-blur-xl text-white border-2 border-[#8AFD81]/40 hover:bg-slate-800/90'
            }`}
            title={performanceMode ? 'Mode Normal' : 'Mode Performance'}
          >
            {performanceMode ? '⚡ Performance' : '🎨 Qualité'}
          </button>
          
          <button
            onClick={handleExportPositions}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all bg-slate-900/90 backdrop-blur-xl text-white border-2 border-[#8AFD81]/40 hover:bg-slate-800/90"
            title="Exporter les positions"
          >
            📥 Exporter Positions
          </button>
          
          {/* Message de sauvegarde */}
          {saveMessage && (
            <div className="px-4 py-2 rounded-lg text-sm backdrop-blur-xl border-2 bg-[#8AFD81]/20 border-[#8AFD81]/60 text-[#8AFD81] animate-fade-in">
              {saveMessage}
            </div>
          )}
          
          {/* Indicateur de synchronisation GPS */}
          {selectedEquipmentId && (
            <div className={`px-4 py-2 rounded-lg text-sm backdrop-blur-xl border-2 transition-all ${
              isSynced 
                ? 'bg-[#8AFD81]/20 border-[#8AFD81]/60 text-[#8AFD81]' 
                : 'bg-amber-500/20 border-amber-500/60 text-amber-300'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSynced ? 'bg-[#8AFD81]' : 'bg-amber-400'}`}></div>
                <span className="font-medium">
                  {isSynced ? '📍 GPS Synchronisé' : '⚠️ GPS Non trouvé'}
                </span>
              </div>
              {selectedGpsName && (
                <div className="text-xs mt-1 opacity-80">
                  {selectedGpsName}
                </div>
              )}
            </div>
          )}
          
          {/* Statistiques de mapping (en développement) */}
          {process.env.NODE_ENV === 'development' && mappingStats && (
            <div className="px-3 py-2 rounded-lg text-xs bg-slate-900/90 backdrop-blur-xl border border-white/20 text-white/80">
              <div>Mappés: {mappingStats.matched}/{mappingStats.totalEquipment}</div>
              <div>Précision: {mappingStats.averageDistance.toFixed(1)}m</div>
            </div>
          )}
        </div>
        
        {/* Toolbar compacte - Outils uniquement */}
        <CompactToolbar
          selectedObjectId={selectedEquipmentId}
          transformMode={transformMode}
          onTransformModeChange={setTransformMode}
          onDelete={handleDelete}
          onSave={async () => {
            await saveProject();
            setSaveMessage('✅ Sauvegardé !');
            setTimeout(() => setSaveMessage(''), 2000);
          }}
          equipmentCount={equipment.length}
        />
      </div>
    </>
  );
}

/**
 * Page principale
 */
export default function EnvironmentPage() {
  return <EnvironmentContent />;
}

