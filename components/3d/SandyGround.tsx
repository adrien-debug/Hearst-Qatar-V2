import { useRef, useMemo, useEffect } from 'react';
import { Mesh, PlaneGeometry } from 'three';
import * as THREE from 'three';
import { createCompactSandTexture, createSandNormalMap, createSandRoughnessMap } from '../../utils/textureHelpers';
import { getOptimalTextureSize } from '../../utils/textureCache';
import { progressiveTextureLoader } from '../../utils/progressiveTextureLoader';
import { safeAssignTexture } from '../../utils/materialHelpers';
import { qualityManager } from '../../utils/qualityManager';

interface SandyGroundProps {
  size?: number;
  position?: [number, number, number];
}

/**
 * Composant sol sablonneux ULTRA-RÉALISTE (PBR)
 * - Texture Diffuse (Couleur)
 * - Texture Normal (Relief des grains et dunes)
 * - Texture Roughness (Matité variable, éclats de quartz)
 * - Displacement (Optionnel, désactivé pour perf)
 */
export default function SandyGround({ 
  size = 500, 
  position = [0, 0, 0] 
}: SandyGroundProps) {
  const meshRef = useRef<Mesh>(null);
  const quality = qualityManager.getQuality();
  const isHighQuality = quality === 'high' || quality === 'ultra';
  const qualitySettings = qualityManager.getSettings();

  // Géométrie - Plus de segments en haute qualité pour que le vertex displacement fonctionne si on l'ajoutait
  const geometry = useMemo(() => {
    const segments = isHighQuality ? 100 : 20; 
    const geo = new PlaneGeometry(size, size, segments, segments);
    geo.computeVertexNormals();
    return geo;
  }, [size, isHighQuality]);

  // Matériau PBR Complet
  const material = useMemo(() => {
    let textureSize = qualitySettings.textureSize || 512;
    try {
      if (typeof window !== 'undefined') {
        // Clamp par capacité GPU (desktop peut monter à 1024 désormais)
        textureSize = Math.min(textureSize, getOptimalTextureSize());
      }
    } catch (e) {
      // Fallback
    }
    
    // Matériau de base avant chargement des textures
    const mat = new THREE.MeshStandardMaterial({
      color: "#d4a574", // Couleur sable de base
      roughness: isHighQuality ? 0.88 : 0.96,
      metalness: 0.0,
      envMapIntensity: isHighQuality ? 0.4 : 0.25,
      flatShading: false,
      side: THREE.DoubleSide,
      // Optimisation:
      dithering: true,
    });

    if (typeof window !== 'undefined') {
      // Répétition: plus fin en ultra (évite aspect “étiré”)
      const repeat =
        quality === 'ultra'
          ? Math.max(1, size / 10)
          : quality === 'high'
            ? Math.max(1, size / 14)
            : quality === 'medium'
              ? Math.max(1, size / 30)
              : Math.max(1, size / 45);

      // 1. Texture de Couleur (Albedo)
      progressiveTextureLoader.loadProgressive(
        () => createCompactSandTexture(256) || new THREE.Texture(),
        () => createCompactSandTexture(textureSize) || new THREE.Texture(),
        `sand_albedo_${textureSize}_v3`,
        { priority: 'high', lowResSize: 256, highResSize: textureSize }
      ).then((texture) => {
        if (texture) {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(repeat, repeat);
          texture.anisotropy = 16;
          safeAssignTexture(mat, 'map', texture);
          mat.needsUpdate = true;
        }
      });

      // 2. Normal Map (Relief) - Seulement en Medium+
      if (quality !== 'low') {
        progressiveTextureLoader.loadProgressive(
          () => createSandNormalMap(256) || new THREE.Texture(),
          () => createSandNormalMap(textureSize) || new THREE.Texture(),
          `sand_normal_${textureSize}_v3`,
          { priority: 'medium', lowResSize: 256, highResSize: textureSize }
        ).then((texture) => {
           if (texture) {
             texture.wrapS = THREE.RepeatWrapping;
             texture.wrapT = THREE.RepeatWrapping;
             texture.repeat.set(repeat, repeat);
             texture.anisotropy = 16;
             safeAssignTexture(mat, 'normalMap', texture);
             const n =
               quality === 'ultra' ? 1.5 :
               quality === 'high' ? 1.15 :
               0.55;
             mat.normalScale = new THREE.Vector2(n, n);
             mat.needsUpdate = true;
           }
        });
      }

      // 3. Roughness Map (Réalisme lumière) - Seulement en High+
      if (isHighQuality) {
        progressiveTextureLoader.loadProgressive(
          () => createSandRoughnessMap(256) || new THREE.Texture(),
          () => createSandRoughnessMap(textureSize) || new THREE.Texture(),
          `sand_roughness_${textureSize}_v3`,
          { priority: 'low', lowResSize: 256, highResSize: textureSize }
        ).then((texture) => {
           if (texture) {
             texture.wrapS = THREE.RepeatWrapping;
             texture.wrapT = THREE.RepeatWrapping;
             texture.repeat.set(repeat, repeat);
             texture.anisotropy = 16;
             safeAssignTexture(mat, 'roughnessMap', texture);
             // Roughness de base un peu moins "plate" quand on a une roughnessMap
             mat.roughness = 0.95;
             mat.needsUpdate = true;
           }
        });
      }
    }

    return mat;
  }, [isHighQuality, quality, qualitySettings.textureSize, size]);
  
  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position[0], 0, position[2]]}
        receiveShadow
        castShadow={false}
        visible={true}
        frustumCulled={true} // Activation du frustum culling pour perf
      >
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* Sol de secours plus bas pour éviter le "z-fighting" si jamais */}
      <mesh
        position={[position[0], -0.2, position[2]]}
        rotation={[0, 0, 0]}
        receiveShadow
        visible={false}
      >
        <boxGeometry args={[size, 0.2, size]} />
        <meshBasicMaterial color="#a08060" />
      </mesh>
    </>
  );
}
