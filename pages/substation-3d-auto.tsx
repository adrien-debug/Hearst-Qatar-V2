import Head from 'next/head';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import WebGLErrorBoundary from '../components/3d/ErrorBoundary';
import SceneLighting from '../components/3d/Lighting';
import EnvironmentHDRI from '../components/3d/EnvironmentHDRI';
import GroundPatch from '../components/3d/GroundPatch';
import AutoPlacedScene3D from '../components/3d/AutoPlacedScene3D';

/**
 * Page Substation 3D Auto
 *
 * NOTE: La version précédente de cette page importait des outils/éditeurs non présents
 * dans le codebase (et empêchait `next build`). Cette version minimale conserve la route
 * et affiche une scène auto-placée sans dépendances manquantes.
 */
export default function Substation3DAutoPage() {
  return (
    <>
      <Head>
        <title>Substation 3D Auto</title>
      </Head>

      <div className="fixed inset-0 bg-gray-900">
        <WebGLErrorBoundary>
          <Canvas
            camera={{ position: [0, 80, 150], fov: 50 }}
            shadows
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <SceneLighting />
              <EnvironmentHDRI />
              <GroundPatch type="concrete" width={1000} length={1000} color="#9b9b9b" />
              <AutoPlacedScene3D />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>

        <div className="absolute top-4 left-4 z-10 rounded bg-white/90 px-3 py-2 text-sm text-gray-900 shadow">
          Page en mode minimal (WIP)
        </div>
      </div>
    </>
  );
}
