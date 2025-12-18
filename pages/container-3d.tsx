/**
 * Page Conteneur 3D - Container Hearst HD
 * Affiche le conteneur 3D avec contrôles interactifs
 */

import React, { Suspense, useState } from 'react';
import Head from 'next/head';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import HD5Container3D from '../components/3d/HD5Container3D';
import Plan2DOverlay from '../components/3d/Plan2DOverlay';

/**
 * Composant de la scène 3D avec le conteneur
 */
function ContainerScene({ selected, onSelect }: { selected: boolean; onSelect: (id: string) => void }) {
  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -5]} intensity={0.3} />

      {/* Sol */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#050505" roughness={1} metalness={0} />
      </mesh>

      {/* Grille de référence */}
      <gridHelper args={[50, 50, '#8AFD81', '#ffffff']} position={[0, 0.01, 0]} />

      {/* Conteneur HD5 */}
      <HD5Container3D
        position={[0, 0, 0]}
        containerId="container-hd5-1"
        onSelect={onSelect}
        isSelected={selected}
      />

      {/* Environnement HDRI pour un rendu réaliste */}
      <Environment preset="sunset" />
    </>
  );
}

/**
 * Composant de chargement
 */
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0b0d]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Chargement du conteneur 3D...</p>
      </div>
    </div>
  );
}

/**
 * Page principale
 */
export default function Container3DPage() {
  const [selected, setSelected] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([15, 10, 15]);
  const [showPlan2D, setShowPlan2D] = useState(false);

  const handleSelect = (id: string) => {
    setSelected(!selected);
    console.log('Container sélectionné:', id);
  };

  return (
    <>
      <Head>
        <title>Conteneur 3D - HD5 | 100MW QATAR</title>
        <meta name="description" content="Visualisation 3D interactive du conteneur ANTSPACE HD5" />
      </Head>

      <div className="fixed inset-0 bg-[#0a0b0d]">
        {/* Canvas 3D */}
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false }}
          camera={{ position: cameraPosition, fov: 50 }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
            <ContainerScene selected={selected} onSelect={handleSelect} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>

        {/* Panneau d'informations */}
        <div className="absolute top-6 left-6 z-10 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-6 shadow-2xl max-w-sm">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Container HD5</h2>
              <p className="text-white/60 text-sm">ANTSPACE Bitmain HD5</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Statut</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selected ? 'bg-[#8AFD81]' : 'bg-white/40'}`}></div>
                <span className="text-white text-sm font-medium">
                  {selected ? 'Sélectionné' : 'Non sélectionné'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <h3 className="text-white font-semibold text-sm mb-2">Contrôles</h3>
              <ul className="text-white/60 text-xs space-y-1">
                <li>• Clic gauche + glisser : Rotation</li>
                <li>• Molette : Zoom</li>
                <li>• Clic droit + glisser : Pan</li>
                <li>• Clic sur le conteneur : Sélection</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-white/10">
              <h3 className="text-white font-semibold text-sm mb-2">Spécifications</h3>
              <ul className="text-white/60 text-xs space-y-1">
                <li>• Longueur: 12.196 m</li>
                <li>• Largeur: 3.5 m</li>
                <li>• Hauteur: 2.896 m</li>
                <li>• Module refroidissement intégré</li>
                <li>• Radiateur en V + Évaporateur</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Boutons en haut à droite */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
          {/* Bouton Plan 2D */}
          <button
            onClick={() => setShowPlan2D(true)}
            className="bg-white/10 backdrop-blur-md border-2 border-[#8AFD81]/50 rounded-xl px-4 py-2 text-white hover:bg-[#8AFD81]/20 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-medium">Plan 2D</span>
          </button>

          {/* Bouton retour */}
          <a
            href="/"
            className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Retour</span>
          </a>
        </div>

        {/* Overlay Plan 2D */}
        <Plan2DOverlay visible={showPlan2D} onClose={() => setShowPlan2D(false)} />
      </div>
    </>
  );
}

