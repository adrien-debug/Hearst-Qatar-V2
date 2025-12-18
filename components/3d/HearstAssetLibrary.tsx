'use client';

/**
 * IMPORTANT:
 * Ce composant utilise des hooks React + R3F Canvas, donc il doit être exécuté côté client.
 * (Sinon Next peut afficher une erreur pointant sur `useEffect`.)
 */

import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, PerspectiveCamera, Stage, OrbitControls } from '@react-three/drei';
import { UnifiedModel, UNIFIED_MODEL_CATALOG, getCategories, EquipmentCategory, renderModel } from './UnifiedModelCatalog';

// Composant interne pour chaque modèle dans la grille
const LibraryItem3D = ({ model }: { model: UnifiedModel }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      <Stage 
        intensity={0.5} 
        environment="city" 
        adjustCamera={1.2} 
        preset="rembrandt"
        shadows={false}
      >
        <group rotation={[0, Math.PI / 4, 0]}>
           {renderModel(model)}
        </group>
      </Stage>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} />
    </>
  );
};

interface HearstAssetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceElement: (model: UnifiedModel) => void;
}

export default function HearstAssetLibrary({
  isOpen,
  onClose,
  onPlaceElement,
}: HearstAssetLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventSourceEl, setEventSourceEl] = useState<HTMLElement | undefined>(undefined);
  
  // Référence pour le canvas partagé (source de l'événement)
  const containerRef = useRef<HTMLDivElement>(null);
  
  // React 19: `useRef<HTMLDivElement>(null)` produit un RefObject (current peut être null),
  // alors que R3F attend un HTMLElement (non-null) ou un MutableRefObject<HTMLElement>.
  // On capture donc l'élément une fois monté et on le passe au Canvas.
  useEffect(() => {
    if (!isOpen) return;
    // Attendre le commit du DOM (ref assigné) avant de capturer l'élément
    const raf = window.requestAnimationFrame(() => {
      if (containerRef.current) {
        setEventSourceEl(containerRef.current);
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = getCategories();
  const allCategories = [{ id: 'all', label: 'Tout', icon: 'apps', count: UNIFIED_MODEL_CATALOG.length }, ...categories];

  const filteredModels = UNIFIED_MODEL_CATALOG.filter((model) => {
    const matchesCategory = activeCategory === 'all' || model.category === activeCategory;
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* CANVAS PARTAGÉ GLOBAL (Invisible mais fait le rendu) */}
      <Canvas
        className="pointer-events-none fixed inset-0 z-[150]"
        eventSource={eventSourceEl} // Redirige les événements souris du DOM vers le Canvas
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <View.Port />
      </Canvas>

      <div className="w-[90vw] max-w-6xl h-[80vh] bg-[#0a0b0d] border border-[#2d3436] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 m-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2d3436] bg-[#1a1b1d]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-[var(--hearst-green)]">●</span> Bibliothèque d'Objets
            </h2>
            <p className="text-gray-400 text-sm mt-1">Sélectionnez un élément pour l'ajouter à la scène</p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2d3436] text-white hover:bg-red-500/20 hover:text-red-500 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Catégories */}
          <div className="w-64 bg-[#1a1b1d] border-r border-[#2d3436] p-4 flex flex-col gap-2 overflow-y-auto">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeCategory === cat.id 
                    ? 'bg-[var(--hearst-green)] text-black font-bold shadow-[0_0_15px_rgba(138,253,129,0.3)]' 
                    : 'text-gray-400 hover:bg-[#2d3436] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span>{activeCategory === cat.id ? '📂' : '📁'}</span>
                  {cat.label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === cat.id ? 'bg-black/20 text-black' : 'bg-[#0a0b0d] text-gray-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Zone Principale */}
          <div className="flex-1 flex flex-col bg-[#0a0b0d]">
            
            {/* Barre de Recherche */}
            <div className="p-6 border-b border-[#2d3436]">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input
                  type="text"
                  placeholder="Rechercher un modèle (ex: conteneur, transfo, route...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1b1d] border border-[#2d3436] text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-[var(--hearst-green)] focus:ring-1 focus:ring-[var(--hearst-green)] transition-all placeholder:text-gray-600"
                  autoFocus
                />
              </div>
            </div>

            {/* Grille de Résultats */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => onPlaceElement(model)}
                    className="group relative flex flex-col bg-[#1a1b1d] border border-[#2d3436] rounded-xl overflow-hidden hover:border-[var(--hearst-green)] hover:shadow-[0_0_20px_rgba(138,253,129,0.1)] transition-all duration-200 text-left h-[280px]"
                  >
                    {/* Thumbnail 3D Réelle via View */}
                    <div className="h-44 bg-gradient-to-br from-[#2d3436] to-[#1a1b1d] relative w-full">
                      <View className="absolute inset-0 w-full h-full">
                        <LibraryItem3D model={model} />
                      </View>
                      
                      {/* Badge Qualité */}
                      {model.quality === 'ultra-realistic' && (
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                          PREMIUM
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1 flex-1 bg-[#1a1b1d] z-20 relative">
                      <h3 className="text-white font-bold truncate pr-2 group-hover:text-[var(--hearst-green)] transition-colors">{model.name}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2">{model.description}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="text-[10px] bg-[#2d3436] text-gray-400 px-2 py-0.5 rounded border border-[#3d4446]">
                            {model.dimensions.length}m
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[var(--hearst-green)] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                          +
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredModels.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>Aucun objet trouvé pour "{searchQuery}"</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


