import React, { useState } from 'react';
import { useThree } from '@react-three/fiber';

interface PhotoCaptureToolProps {
  fileName?: string;
}

/**
 * Outil de capture d'écran Haute Résolution (4K)
 * À placer DANS le Canvas <Canvas> ... <PhotoCaptureTool /> ... </Canvas>
 */
export const PhotoCaptureTool: React.FC<PhotoCaptureToolProps> = ({ fileName = 'hearst-qatar-render' }) => {
  const { gl, scene, camera } = useThree();
  const [isCapturing, setIsCapturing] = useState(false);

  const takePhoto = () => {
    setIsCapturing(true);

    // 1. Sauvegarder la taille actuelle
    const originalSize = new THREE.Vector2();
    gl.getSize(originalSize);
    const originalPixelRatio = gl.getPixelRatio();

    try {
      // 2. Configurer pour la 4K (3840 x 2160)
      // On augmente aussi le pixel ratio pour une netteté maximale
      const width = 3840;
      const height = 2160;
      
      gl.setSize(width, height);
      gl.setPixelRatio(2); // Super-sampling (équivalent 8K downscalé si le GPU suit, sinon 1)
      
      // 3. Rendu forcé
      gl.render(scene, camera);

      // 4. Récupérer l'image
      const dataUrl = gl.domElement.toDataURL('image/png', 1.0); // Qualité max

      // 5. Télécharger
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute('download', `${fileName}-${timestamp}.png`);
      link.setAttribute('href', dataUrl);
      link.click();

    } catch (e) {
      console.error("Erreur lors de la capture 4K:", e);
      alert("Erreur capture (GPU peut-être saturé). Réessayez.");
    } finally {
      // 6. Restaurer l'état original
      gl.setSize(originalSize.x, originalSize.y);
      gl.setPixelRatio(originalPixelRatio);
      setIsCapturing(false);
    }
  };

  return (
    <group>
      {/* Ce composant n'a pas de rendu 3D, c'est un contrôleur logique */}
      {/* On injecte le bouton via un Portal HTML ou on utilise un bouton externe qui appelle cette logique via un ref, 
          mais pour faire simple ici, on va ajouter un bouton HTML flottant via Html de drei */}
    </group>
  );
};

// Hook pour utiliser la capture depuis l'extérieur du Canvas si besoin
// Mais le plus simple est un bouton HTML overlay qui communique avec le Canvas.
// Voici une version "Bouton UI" qui doit être dans le Canvas pour accéder au contexte Three
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export const PhotoCaptureButton = () => {
  const { gl, scene, camera } = useThree();
  const [loading, setLoading] = useState(false);

  const capture = () => {
    requestAnimationFrame(() => {
      setLoading(true);
      // Petit délai pour laisser le temps au state "loading" de s'afficher
      setTimeout(() => {
        const originalSize = new THREE.Vector2();
        gl.getSize(originalSize);
        const originalPixelRatio = gl.getPixelRatio();

        // CONFIGURATION 4K
        const targetWidth = 3840;
        const targetHeight = 2160;

        try {
          gl.setSize(targetWidth, targetHeight);
          gl.setPixelRatio(2); // Qualité ultra
          gl.render(scene, camera);
          
          const data = gl.domElement.toDataURL('image/png');
          
          const a = document.createElement('a');
          a.href = data;
          a.download = `hearst-qatar-4k-${Date.now()}.png`;
          a.click();
        } catch(err) {
          console.error(err);
        } finally {
          gl.setSize(originalSize.x, originalSize.y);
          gl.setPixelRatio(originalPixelRatio);
          setLoading(false);
        }
      }, 100);
    });
  };

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
      <div style={{ position: 'fixed', top: '20px', right: '20px', pointerEvents: 'auto' }}>
        <button
          onClick={capture}
          disabled={loading}
          style={{
            background: loading ? '#95a5a6' : '#ffffff',
            color: '#000',
            border: '2px solid #000',
            padding: '10px 20px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? (
            <span>RENDERING...</span>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              PHOTO 4K
            </>
          )}
        </button>
      </div>
    </Html>
  );
};
