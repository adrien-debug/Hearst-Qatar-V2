import { EffectComposer, SSAO, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useMemo } from 'react';
import { qualityManager } from '../../utils/qualityManager';
import * as THREE from 'three';

/**
 * Effets Cinématiques Post-Processing
 * Transforme le rendu brut en image "Film" photoréaliste.
 */
export default function CinematicEffects() {
  const quality = qualityManager.getQuality();
  const qualitySettings = qualityManager.getSettings();

  // Configuration selon la qualité (Performance vs Qualité)
  const config = useMemo(() => {
    const isUltra = quality === 'ultra';
    const isLow = quality === 'low';

    return {
      enableSSAO: !isLow,
      ssaoSamples: isUltra ? 21 : 14, // Réduit de 31/21 à 21/14
      ssaoRing: isUltra ? 5 : 3,      // Réduit de 7/4 à 5/3
      // On désactive SMAA temporairement pour éviter le conflit "length of undefined"
      // Le navigateur utilisera l'anti-aliasing par défaut du Canvas s'il est activé
      enableSMAA: false, 
    };
  }, [quality]);

  // Si la qualité courante désactive le post-processing, ne rien rendre.
  if (!qualitySettings.postProcessingEnabled) return null;

  const multisampling = quality === 'ultra' ? 8 : 4;
  const enableNormalPass = config.enableSSAO; // SSAO a besoin du normal pass pour un rendu propre

  return (
    <EffectComposer 
      multisampling={multisampling}
      enableNormalPass={enableNormalPass}
    >
      {/* 1. Anti-Aliasing (SMAA désactivé pour stabilité) */}
      {/* {config.enableSMAA ? <SMAA /> : null} */}

      {/* 2. Ambient Occlusion */}
      {config.enableSSAO ? (
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={config.ssaoSamples}
          rings={config.ssaoRing}
          worldDistanceThreshold={1.0}
          worldDistanceFalloff={0.4}
          worldProximityThreshold={0.5}
          worldProximityFalloff={0.1}
          luminanceInfluence={0.5}
          radius={20}
          bias={0.01}
          intensity={15}
          color={new THREE.Color('black')}
        />
      ) : (
        <></>
      )}

      {/* 3. Bloom (Ajusté pour netteté) */}
      <Bloom 
        luminanceThreshold={1.5} // Augmenté pour ne prendre que les sources très lumineuses
        mipmapBlur 
        intensity={0.2} // Réduit pour éviter l'effet "halo"
        radius={0.4}
      />

      {/* 4. Effets Caméra */}
      <Noise opacity={0.015} />
      <Vignette eskil={false} offset={0.1} darkness={0.3} />
    </EffectComposer>
  );
}


