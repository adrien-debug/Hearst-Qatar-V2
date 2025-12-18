/**
 * Viewer 3D Container Plan - Viewer HTML autonome
 * Affiche le viewer HTML dans un iframe plein écran
 * 
 * 📋 ENVIRONNEMENT STANDARD :
 * - Utilise Gallery3DEnvironment (via ModelCard/ModelViewer3D)
 * - Sol : #2a2a2a
 * - Éclairage : SceneLighting (désertique)
 * - HDRI : preset="sunset"
 * 
 * Cette configuration est la référence pour tous les modèles de la galerie.
 */

import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ContainerPlan3DViewerProps {
  containerId?: string;
  position?: [number, number, number];
  isSelected?: boolean;
  /** Échelle (0.3 par défaut pour la galerie, 1 pour taille réelle) */
  scale?: number;
}

/**
 * Composant 3D pour la prévisualisation dans la galerie
 * Affiche un conteneur réaliste en 3D pour représenter le viewer
 * 
 * ⚠️ IMPORTANT : Ce composant est enveloppé dans Gallery3DEnvironment
 * par ModelCard et ModelViewer3D pour garantir l'environnement standard.
 */
export default function ContainerPlan3DViewer({ 
  containerId = 'default-container-plan',
  position = [0, 0, 0],
  isSelected = false,
  scale = 0.3,
}: ContainerPlan3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Dimensions du conteneur (12.196m × 2.438m × 2.896m)
  // Pour la prévisualisation dans la galerie, on utilise une échelle adaptée
  // Les dimensions réelles sont trop grandes, on les réduit proportionnellement
  const length = 12.196;
  const width = 2.438;
  const height = 2.896;
  
  // Matériaux réalistes
  const containerBodyMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: isSelected ? '#8AFD81' : '#E3E4E5',
    metalness: 0.8,
    roughness: 0.3,
    envMapIntensity: 1.0,
  }), [isSelected]);

  const coolingPanelMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e3a5f',
    metalness: 0.6,
    roughness: 0.4,
  }), []);

  const frameMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4d8dc',
    metalness: 0.85,
    roughness: 0.25,
  }), []);

  const logoMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a4a4a',
    emissive: '#4a4a4a',
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.5,
  }), []);

  // Calculer les dimensions scalées
  const scaledLength = length * scale;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <group ref={groupRef} position={position}>
      {/* Corps principal du conteneur - centré verticalement */}
      <mesh 
        position={[0, scaledHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[scaledLength, scaledHeight, scaledWidth]} />
        <primitive object={containerBodyMaterial} attach="material" />
      </mesh>

      {/* Cadre métallique - montants verticaux aux coins */}
      {[
        [-scaledLength / 2, scaledHeight / 2, -scaledWidth / 2],
        [-scaledLength / 2, scaledHeight / 2, scaledWidth / 2],
        [scaledLength / 2, scaledHeight / 2, -scaledWidth / 2],
        [scaledLength / 2, scaledHeight / 2, scaledWidth / 2],
      ].map((pos, i) => (
        <mesh key={`corner-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, scaledHeight, 0.15]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      ))}

      {/* Module de refroidissement sur le toit */}
      <group position={[0, scaledHeight + 0.3, 0]}>
        {/* Base du module */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[scaledLength * 0.95, 0.2, scaledWidth * 0.9]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>

        {/* Panneaux en V bleu foncé - 6 sections */}
        {Array.from({ length: 6 }).map((_, i) => {
          const xPos = -scaledLength / 2 + 0.5 + i * (scaledLength / 6);
          return (
            <group key={`cooling-section-${i}`} position={[xPos, 0.3, 0]}>
              {/* Panneau gauche incliné */}
              <mesh
                position={[0, 0.2, -scaledWidth * 0.3]}
                rotation={[Math.PI / 6, 0, 0]}
                castShadow
              >
                <boxGeometry args={[scaledLength / 7, 0.4, 0.05]} />
                <primitive object={coolingPanelMaterial} attach="material" />
              </mesh>

              {/* Panneau droit incliné */}
              <mesh
                position={[0, 0.2, scaledWidth * 0.3]}
                rotation={[-Math.PI / 6, 0, 0]}
                castShadow
              >
                <boxGeometry args={[scaledLength / 7, 0.4, 0.05]} />
                <primitive object={coolingPanelMaterial} attach="material" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Grilles de ventilation latérales */}
      {[...Array(3)].map((_, i) => (
        <mesh 
          key={`vent-${i}`}
          position={[
            -scaledLength * 0.3 + i * (scaledLength * 0.3), 
            scaledHeight * 0.7, 
            scaledWidth / 2 + 0.01
          ]} 
          castShadow
        >
          <boxGeometry args={[scaledLength * 0.15, scaledHeight * 0.4, 0.02]} />
          <meshStandardMaterial 
            color="#2c3e50" 
            metalness={0.9} 
            roughness={0.2} 
          />
        </mesh>
      ))}

      {/* Logo Hearst - Bande verte horizontale */}
      <mesh 
        position={[0, scaledHeight * 0.4, scaledWidth / 2 + 0.01]} 
        castShadow
      >
        <boxGeometry args={[scaledLength * 0.7, 0.12, 0.01]} />
        <primitive object={logoMaterial} attach="material" />
      </mesh>

      {/* Portes avant */}
      <mesh 
        position={[scaledLength / 2 + 0.01, scaledHeight * 0.5, 0]} 
        castShadow
      >
        <boxGeometry args={[0.02, scaledHeight * 0.85, scaledWidth * 0.95]} />
        <meshStandardMaterial 
          color="#0a2a35" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>

      {/* Base/Châssis */}
      <mesh 
        position={[0, 0.1, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[scaledLength * 1.02, 0.15, scaledWidth * 1.02]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
    </group>
  );
}

/**
 * Composant pour afficher le viewer HTML dans un iframe
 * Utilisé dans ModelViewer3D pour les modèles HTML
 */
export function ContainerPlan3DViewerIframe() {
  const htmlPath = '/demos/3d-viewers/container-plan-3d-viewer.html';
  
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/4a9cbd4e-dfe7-4ee6-b860-f040aa941e52',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/3d/ContainerPlan3DViewer.tsx:197',message:'ContainerPlan3DViewerIframe rendered',data:{htmlPath},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
  }
  // #endregion
  
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/4a9cbd4e-dfe7-4ee6-b860-f040aa941e52',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/3d/ContainerPlan3DViewer.tsx:204',message:'Checking if HTML file exists',data:{htmlPath,windowLocation:window.location.href},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
  }
  // #endregion
  
  return (
    <div className="w-full h-full relative bg-[#0a0a0a]">
      <iframe
        src={htmlPath}
        className="w-full h-full border-0"
        style={{ 
          width: '100%', 
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Container Plan 3D Viewer"
        allow="fullscreen"
        onLoad={() => {
          // #region agent log
          if (typeof window !== 'undefined') {
            fetch('http://127.0.0.1:7242/ingest/4a9cbd4e-dfe7-4ee6-b860-f040aa941e52',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/3d/ContainerPlan3DViewer.tsx:217',message:'Iframe loaded successfully',data:{htmlPath},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'G'})}).catch(()=>{});
          }
          // #endregion
        }}
        onError={(e) => {
          // #region agent log
          if (typeof window !== 'undefined') {
            fetch('http://127.0.0.1:7242/ingest/4a9cbd4e-dfe7-4ee6-b860-f040aa941e52',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/3d/ContainerPlan3DViewer.tsx:223',message:'Iframe load error',data:{htmlPath,error:String(e)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H'})}).catch(()=>{});
          }
          // #endregion
        }}
      />
    </div>
  );
}
