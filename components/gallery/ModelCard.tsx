/**
 * Carte de modèle 3D pour la galerie
 * Affiche un preview 3D avec détails au survol (on the fly)
 */

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRouter } from 'next/router';
import { UnifiedModel } from '../3d/UnifiedModelCatalog';
import Gallery3DEnvironment from './Gallery3DEnvironment';
import * as THREE from 'three';

interface ModelCardProps {
  model: UnifiedModel;
  onDelete?: (modelId: string) => void;
}

/**
 * Composant wrapper pour ajouter rotation au modèle
 */
function AnimatedModel({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotation continue sur l'axe Y
      groupRef.current.rotation.y += delta * 0.5;
      // Position fixe (levitation désactivée)
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group ref={groupRef} scale={1.3}>
      {children}
    </group>
  );
}

export default function ModelCard({ model, onDelete }: ModelCardProps) {
  const router = useRouter();
  const Component = model.component;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Clic principal → Page dédiée
  const handleClick = (e: React.MouseEvent) => {
    // Ne pas naviguer si on clique sur le bouton de suppression
    if ((e.target as HTMLElement).closest('.delete-button')) {
      return;
    }
    router.push(`/models/${model.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(model.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  // Styles CSS pour le preview (levitation désactivée)
  useEffect(() => {
    const styleId = 'preview-levitate-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Animation de levitation désactivée - position fixe */
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-white/20 hover:border-[#8AFD81] hover:shadow-[#8AFD81]/30 relative"
      >
      {/* Bouton de suppression - Visible au survol */}
      {onDelete && (
        <div className="absolute top-3 right-3 z-20">
          {showDeleteConfirm ? (
            <div className="flex gap-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 border border-red-500/50">
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors delete-button"
                title="Confirmer la suppression"
              >
                ✓
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded transition-colors delete-button"
                title="Annuler"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className={`delete-button px-3 py-2 bg-black/80 hover:bg-red-600/90 backdrop-blur-sm text-white rounded-lg transition-all duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              title="Supprimer de la galerie"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Preview 3D - Viewer HTML complet pour container-plan-3d-viewer, Canvas pour les autres */}
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        {model.type === 'container-plan-3d-viewer' ? (
          // Afficher le vrai viewer HTML complet avec animations
          <div className="relative w-full h-full overflow-hidden">
            <iframe
              src="/demos/3d-viewers/container-plan-3d-viewer.html"
              className="w-full h-full border-0 pointer-events-none preview-3d-iframe"
              style={{
                width: '130%',
                height: '130%',
                border: 'none',
                display: 'block',
                transform: 'scale(1.3) translate(-11.5%, -11.5%)',
                transformOrigin: 'center center',
              }}
              title="Container Plan 3D Viewer Preview"
              scrolling="no"
            />
          </div>
        ) : (
          // Canvas 3D pour les autres modèles (si ajoutés plus tard)
          <Canvas 
            camera={{ 
              position: [8, 6, 8], 
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              {/* Environnement 3D unifié pour tous les modèles */}
              <Gallery3DEnvironment>
                {/* Modèle 3D avec rotation (levitation désactivée) */}
                <AnimatedModel>
                  <Component
                    position={[0, 0, 0]}
                    {...model.defaultProps}
                    isSelected={false}
                  />
                </AnimatedModel>
              </Gallery3DEnvironment>
              
              {/* Contrôles de caméra - Rotation désactivée car gérée par AnimatedModel */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                zoomToCursor={true}
                target={[0, 0, 0]}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
                enableDamping={false}
              />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Informations - Toujours visibles */}
      <div className="p-5">
        <h3 className="font-bold text-white text-base mb-2 leading-tight">
          {model.name}
        </h3>
        
        <p className="text-sm text-white/60 mb-3 line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        {/* Spécifications */}
        <div className="space-y-1.5 mb-3 text-xs text-white/50">
          <div className="flex items-center gap-2">
            {/* Icône Dimensions Vectorielle */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{model.dimensions.length}m × {model.dimensions.width}m × {model.dimensions.height}m</span>
          </div>
          {model.power && (
            <div className="flex items-center gap-2">
              {/* Icône Puissance Vectorielle */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{model.power}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {model.tags.length > 3 && (
            <span className="px-2 py-1 bg-[#8AFD81]/20 text-[#8AFD81] border border-[#8AFD81]/30 rounded-full text-xs font-medium">
              +{model.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

