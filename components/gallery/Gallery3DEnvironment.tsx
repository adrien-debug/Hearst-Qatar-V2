/**
 * 🌐 ENVIRONNEMENT 3D UNIFIÉ - MODE INDUSTRIEL HAUT DE GAMME
 * 
 * Composant central pour l'ambiance visuelle "Ingénierie".
 * Intègre maintenant les effets cinématiques (Post-Processing).
 */

import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import SceneLighting from '../3d/Lighting';
import CinematicEffects from '../3d/CinematicEffects';
import * as THREE from 'three';
import Scene3DConfig from '../../config/3d.config';

interface Gallery3DEnvironmentProps {
  children: React.ReactNode;
}

export default function Gallery3DEnvironment({ children }: Gallery3DEnvironmentProps) {
  // Récupération du preset depuis la config
  const envPreset = Scene3DConfig.environment.preset;

  return (
    <>
      {/* 1. Éclairage Scène (Soleil + Fill) */}
      <SceneLighting />
      
      {/* 2. Environnement HDRI (Reflets) */}
      <Environment preset={envPreset} background={false} blur={0.0} />

      {/* 3. Effets Cinématiques (Post-Processing) */}
      <CinematicEffects />
      
      {/* 4. Contenu de la scène */}
      {children}
    </>
  );
}


