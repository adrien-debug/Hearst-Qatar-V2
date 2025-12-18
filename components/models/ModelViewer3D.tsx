/**
 * Viewer 3D plein écran pour les pages dédiées de modèles
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { UnifiedModel } from '../3d/UnifiedModelCatalog';
import Gallery3DEnvironment from '../gallery/Gallery3DEnvironment';
import * as THREE from 'three';
import { ContainerPlan3DViewerIframe } from '../3d/ContainerPlan3DViewer';

interface ModelViewer3DProps {
  model: UnifiedModel;
}

export default function ModelViewer3D({ model }: ModelViewer3DProps) {
  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/4a9cbd4e-dfe7-4ee6-b860-f040aa941e52',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/models/ModelViewer3D.tsx:17',message:'ModelViewer3D component rendered',data:{modelId:model.id,modelType:model.type,modelName:model.name},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
  }
  // #endregion
  
  // Si le modèle est un viewer HTML, afficher l'iframe
  if (model.type === 'container-plan-3d-viewer') {
    // #region agent log
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7242/ingest/4a9cbd4e-dfe7-4ee6-b860-f040aa941e52',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/models/ModelViewer3D.tsx:24',message:'Rendering ContainerPlan3DViewerIframe',data:{modelType:model.type},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    }
    // #endregion
    return <ContainerPlan3DViewerIframe />;
  }
  
  const Component = model.component;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Suspense fallback={null}>
          {/* Environnement 3D unifié de la galerie */}
          <Gallery3DEnvironment>
            {/* Modèle 3D */}
            <Component
              position={[0, 0, 0]}
              {...model.defaultProps}
              isSelected={false}
            />
          </Gallery3DEnvironment>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={1}
            zoomToCursor={true}
            minDistance={2}
            maxDistance={50}
          />
        </Suspense>
      </Canvas>

    </div>
  );
}















