import React, { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Html } from '@react-three/drei';

export const BlenderExporterButton = () => {
  const { scene } = useThree();
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    // Petit délai pour laisser l'UI se mettre à jour
    setTimeout(() => {
      const exporter = new GLTFExporter();
      
      // Options d'export
      const options = {
        binary: true, // .glb (plus compact, tout en un fichier)
        onlyVisible: true, // Exporte seulement ce qu'on voit
        maxTextureSize: 4096 // Garde la haute qualité des textures
      };

      // On exporte toute la scène
      exporter.parse(
        scene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, `hearst-qatar-scene-${Date.now()}.glb`);
          } else {
            const output = JSON.stringify(result, null, 2);
            saveString(output, `hearst-qatar-scene-${Date.now()}.gltf`);
          }
          setExporting(false);
        },
        (error) => {
          console.error('Erreur export GLTF:', error);
          alert("Erreur lors de l'export vers Blender.");
          setExporting(false);
        },
        options
      );
    }, 100);
  };

  const saveArrayBuffer = (buffer: ArrayBuffer, filename: string) => {
    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  };

  const saveString = (text: string, filename: string) => {
    save(new Blob([text], { type: 'text/plain' }), filename);
  };

  const save = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
      <div style={{ position: 'fixed', top: '70px', right: '20px', pointerEvents: 'auto' }}>
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            background: exporting ? '#e67e22' : '#ffffff',
            color: '#000',
            border: '2px solid #e67e22', // Orange Blender
            padding: '10px 20px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: exporting ? 'wait' : 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {exporting ? (
            <span>EXPORTING .GLB...</span>
          ) : (
            <>
              {/* Icône Blender simplifiée */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" color="#e67e22">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              EXPORT BLENDER
            </>
          )}
        </button>
      </div>
    </Html>
  );
};
