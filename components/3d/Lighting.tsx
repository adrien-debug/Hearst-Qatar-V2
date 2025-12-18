import { useMemo, useRef, useEffect } from 'react';
import { DirectionalLight, AmbientLight, PointLight, HemisphereLight } from 'three';
import { useHelper } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { qualityManager } from '../../utils/qualityManager';
import Scene3DConfig from '../../config/3d.config';

/**
 * Configuration d'éclairage CINÉMATIQUE pour le site Qatar
 * - Ombres douces (Soft Shadows)
 * - Brouillard volumétrique (Fog)
 * - Soleil orienté pour le relief (Golden Hour / Matinée)
 */
export default function SceneLighting() {
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  
  const quality = qualityManager.getQuality();
  const isHighQuality = quality === 'high' || quality === 'ultra';
  
  const qualitySettings = qualityManager.getSettings();
  const shadowMapSize = qualitySettings.shadowMapSize || 4096;

  const config = Scene3DConfig.lighting;
  
  useEffect(() => {
    if (mainLightRef.current) {
      mainLightRef.current.shadow.mapSize.width = shadowMapSize;
      mainLightRef.current.shadow.mapSize.height = shadowMapSize;
      // Bias ajusté pour les ombres douces
      mainLightRef.current.shadow.bias = -0.0001; 
      mainLightRef.current.shadow.normalBias = 0.05;
      
      // Agrandir la zone d'ombre pour couvrir tout le site
      const d = 250;
      mainLightRef.current.shadow.camera.left = -d;
      mainLightRef.current.shadow.camera.right = d;
      mainLightRef.current.shadow.camera.top = d;
      mainLightRef.current.shadow.camera.bottom = -d;
      
      mainLightRef.current.shadow.map?.dispose();
      mainLightRef.current.shadow.needsUpdate = true;
    }
  }, [shadowMapSize]);

  return (
    <>
      {/* 0. Atmosphère (Suppression du brouillard pour netteté maximale) */}
      {/* <fogExp2 attach="fog" args={['#dbeafe', 0.0008]} /> */}

      {/* 1. Lumière Ambiante (Shadows lift) */}
      <ambientLight 
        intensity={1.5} // Très lumineux
        color="#ffffff" // Blanc pur
      />
      
      {/* 2. Hemisphere Light (Sol chaud / Ciel bleu) */}
      <hemisphereLight
        args={["#87CEEB", "#e0f2fe", 1.5]} // Ciel bleu intense / Sol clair
        position={[0, 50, 0]}
      />
      
      {/* 3. Soleil Principal (Key Light) - Plein Soleil Zénithal */}
      <directionalLight
        ref={mainLightRef}
        position={[50, 100, 50]} // Soleil haut dans le ciel
        intensity={6.0} // Éblouissant
        color="#ffffff" // Blanc pur
        castShadow={true}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.1}
        shadow-camera-far={1000}
      />
      
      {/* 4. Soft Shadows (DÉSACTIVÉ: incompatibilité shader avec certaines cartes graphiques) */}
      {/* {isHighQuality && (
        <SoftShadows 
          size={35} // Taille de la source lumineuse (flou)
          samples={12} // Qualité du bruit
          focus={0.5} // Netteté près de l'objet
        />
      )} */}

      {/* 5. Fill Light (Rebond atmosphérique) */}
      <directionalLight
        ref={fillLightRef}
        position={[-50, 40, -50]}
        intensity={2.0}
        color="#aaccff"
        castShadow={false} 
      />
      
      {/* 6. Rim Light (Découpage silhouette contre-jour) */}
      <directionalLight
        position={[-80, 30, -20]}
        intensity={1.2}
        color="#ffaa66" // Orangé
        castShadow={false}
      />
    </>
  );
}
