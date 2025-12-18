import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stage } from '@react-three/drei';
import { UnifiedModel, renderModel } from './UnifiedModelCatalog';

// Composant interne qui fait tourner le modèle
const RotatingModel = ({ model }: { model: UnifiedModel }) => {
  const ref = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5; // Rotation douce
    }
  });

  return (
    <group ref={ref}>
      {renderModel(model)}
    </group>
  );
};

interface ModelPreviewProps {
  model: UnifiedModel;
}

export default function ModelPreview({ model }: ModelPreviewProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black">
      <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          
          {/* Stage gère l'éclairage studio et le centrage automatique */}
          <Stage 
            environment="city" 
            intensity={0.5} 
            adjustCamera={1.2} // Zoom automatique pour bien cadrer
            preset="rembrandt"
            shadows={false} // Désactivé pour la perf dans les miniatures
          >
            <RotatingModel model={model} />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}


