import { useRef, useMemo } from 'react';
import { Mesh, Group } from 'three';
import * as THREE from 'three';

interface HD5Container3DProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  rotation?: [number, number, number];
}

/**
 * Conteneur ANTSPACE Bitmain HD5 ultra-réaliste
 * Basé sur les photos fournies
 * 
 * Caractéristiques principales :
 * - Conteneur maritime standard 40ft (12.196m × 2.438m × 2.896m)
 * - Module de refroidissement sur le toit avec panneaux en V bleu foncé
 * - Partie inférieure blanche avec ondulations métalliques
 * - Logos ANTSPACE et BITMAIN
 * - Unité de ventilation latérale avec ventilateurs
 * - Portes d'accès et échelle
 */
export default function HD5Container3D({
  position,
  containerId,
  onSelect,
  isSelected = false,
  rotation = [0, 0, 0],
}: HD5Container3DProps) {
  const groupRef = useRef<Group>(null);

  // Dimensions réelles
  const length = 12.196;
  const width = 2.438;
  const height = 2.896;

  // Matériaux réalistes
  const containerBodyMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#f0f0f0',
      metalness: 0.8,
      roughness: 0.3,
      envMapIntensity: 1.0,
    });
    mat.name = 'HD5_Body_White_Metal'; // NOMMAGE PRO
    if (isSelected) {
      mat.emissive = new THREE.Color('#3b82f6');
      mat.emissiveIntensity = 0.3;
    }
    return mat;
  }, [isSelected]);

  const coolingPanelMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#1e3a5f',
      metalness: 0.6,
      roughness: 0.4,
    });
    mat.name = 'HD5_Cooling_Panel_Blue'; // NOMMAGE PRO
    return mat;
  }, []);

  const ventGrilleMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      metalness: 0.9,
      roughness: 0.2,
    });
    mat.name = 'HD5_Vent_Grille_Dark'; // NOMMAGE PRO
    return mat;
  }, []);

  const frameMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#d4d8dc',
      metalness: 0.85,
      roughness: 0.25,
    });
    mat.name = 'HD5_Frame_Steel'; // NOMMAGE PRO
    return mat;
  }, []);

  // Barres de verrouillage arrière (inox / argent)
  const rearLockBarMaterial = useMemo(
    () => {
      const mat = new THREE.MeshStandardMaterial({
        color: '#E5E7EB',
        metalness: 0.98,
        roughness: 0.12,
        envMapIntensity: 1.2,
      });
      mat.name = 'HD5_Chrome_Details'; // NOMMAGE PRO
      return mat;
    },
    []
  );

  const cageMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#95a5a6',
      metalness: 0.7,
      roughness: 0.5,
    });
    mat.name = 'HD5_Security_Cage_Metal'; // NOMMAGE PRO
    return mat;
  }, []);

  const padlockMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f1c40f',
    metalness: 0.9,
    roughness: 0.2,
  }), []);

  const entryBarMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E5E7EB', // Inox
    metalness: 0.98,
    roughness: 0.12,
    envMapIntensity: 1.2,
  }), []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(containerId);
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      name={containerId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Corps principal du conteneur - Partie inférieure blanche */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height, width]} />
        <primitive object={containerBodyMaterial} attach="material" />
      </mesh>

      {/* Ondulations métalliques du conteneur */}
      {Array.from({ length: 24 }).map((_, i) => {
        const xPos = -length / 2 + 0.25 + i * 0.51;
        return (
          <mesh
            key={`corrugate-${i}`}
            position={[xPos, height / 2, width / 2 + 0.01]}
            castShadow={false}
          >
            <boxGeometry args={[0.02, height - 0.2, 0.02]} />
            <meshStandardMaterial
              color="#e0e0e0"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        );
      })}

      {/* Cadre du conteneur */}
      {/* Montants verticaux */}
      {[
        [-length / 2, height / 2, -width / 2],
        [-length / 2, height / 2, width / 2],
        [length / 2, height / 2, -width / 2],
        [length / 2, height / 2, width / 2],
      ].map((pos, i) => (
        <mesh key={`corner-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.15, height, 0.15]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      ))}

      {/* Module de refroidissement sur le toit */}
      <group position={[0, height + 0.5, 0]}>
        {/* Base du module */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length - 0.5, 0.2, width - 0.2]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>

        {/* Panneaux en V bleu foncé - 10 sections */}
        {Array.from({ length: 10 }).map((_, i) => {
          const xPos = -length / 2 + 1 + i * 1.1;
          return (
            <group key={`cooling-section-${i}`} position={[xPos, 0.5, 0]}>
              {/* Panneau gauche incliné */}
              <mesh
                position={[0, 0.4, -0.35]}
                rotation={[Math.PI / 6, 0, 0]}
                castShadow
              >
                <boxGeometry args={[0.9, 0.8, 0.05]} />
                <primitive object={coolingPanelMaterial} attach="material" />
              </mesh>

              {/* Panneau droit incliné */}
              <mesh
                position={[0, 0.4, 0.35]}
                rotation={[-Math.PI / 6, 0, 0]}
                castShadow
              >
                <boxGeometry args={[0.9, 0.8, 0.05]} />
                <primitive object={coolingPanelMaterial} attach="material" />
              </mesh>

              {/* Cadre blanc entre les panneaux */}
              <mesh position={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.95, 0.15, 0.08]} />
                <meshStandardMaterial
                  color="#ffffff"
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            </group>
          );
        })}

        {/* Cadre supérieur du module */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[length - 0.4, 0.1, width]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      </group>

      {/* Unité de ventilation latérale gauche */}
      <group position={[-length / 2 + 1, height / 2, 0]}>
        {/* Boîtier de ventilation */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, height - 0.4, width + 0.4]} />
          <meshStandardMaterial
            color="#c0c4c8"
            metalness={0.75}
            roughness={0.35}
          />
        </mesh>

        {/* Grilles de ventilation avec ventilateurs visibles */}
        {Array.from({ length: 3 }).map((_, i) => {
          const yPos = -height / 2 + 0.5 + i * (height - 1) / 2;
          return (
            <group key={`fan-${i}`} position={[-0.76, yPos, 0]}>
              {/* Grille */}
              <mesh castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
                <primitive object={ventGrilleMaterial} attach="material" />
              </mesh>

              {/* Pales du ventilateur */}
              {Array.from({ length: 6 }).map((_, j) => (
                <mesh
                  key={`blade-${j}`}
                  position={[0, 0, 0]}
                  rotation={[0, (j * Math.PI) / 3, 0]}
                  castShadow={false}
                >
                  <boxGeometry args={[0.05, 0.3, 0.02]} />
                  <meshStandardMaterial
                    color="#34495e"
                    metalness={0.85}
                    roughness={0.25}
                  />
                </mesh>
              ))}

              {/* Moyeu central */}
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
                <meshStandardMaterial
                  color="#2c3e50"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Logo ANTSPACE sur le côté */}
      <group position={[0, height / 2, width / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.5, 0.02]} />
          <meshStandardMaterial
            color="#000000"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Logo BITMAIN en bas */}
      <group position={[-length / 2 + 2, height / 4, width / 2 + 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.3, 0.02]} />
          <meshStandardMaterial
            color="#000000"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Portes d'accès arrière */}
      <group position={[length / 2 - 0.05, height / 2, 0]}>
        {/** Constantes portes */}
        {(() => {
          // On utilise un IIFE pour conserver le JSX proche sans créer de hooks.
          const doorHeight = height - 0.3;
          const doorHalfH = doorHeight / 2;
          const rodRadius = 0.028;
          const rodLen = doorHeight - 0.18;
          const rodX = 0.11; // léger dépassement sur l'extérieur des portes
          const keeperX = 0.07;
          const keeperW = 0.08;
          const keeperH = 0.06;
          const keeperD = 0.09;
          const handleLen = 0.42;
          const handleRadius = 0.018;
          const handleX = 0.15;
          const handleY = -0.15; // ~1.3m du sol

          const leftRodZ = -width / 2 + 0.18;
          const rightRodZ = width / 2 - 0.18;

          return (
            <group>
              {/* Barre de verrouillage - porte gauche */}
              <group>
                <mesh position={[rodX, 0, leftRodZ]} castShadow receiveShadow>
                  <cylinderGeometry args={[rodRadius, rodRadius, rodLen, 18]} />
                  <primitive object={rearLockBarMaterial} attach="material" />
                </mesh>

                {/* Gâches (haut/bas) */}
                <mesh position={[keeperX, doorHalfH - 0.12, leftRodZ]} castShadow receiveShadow>
                  <boxGeometry args={[keeperW, keeperH, keeperD]} />
                  <primitive object={frameMaterial} attach="material" />
                </mesh>
                <mesh position={[keeperX, -doorHalfH + 0.12, leftRodZ]} castShadow receiveShadow>
                  <boxGeometry args={[keeperW, keeperH, keeperD]} />
                  <primitive object={frameMaterial} attach="material" />
                </mesh>

                {/* Poignée de manœuvre */}
                <mesh
                  position={[handleX, handleY, leftRodZ]}
                  rotation={[0, 0, Math.PI / 2]} // cylindre sur l'axe X
                  castShadow
                  receiveShadow
                >
                  <cylinderGeometry args={[handleRadius, handleRadius, handleLen, 16]} />
                  <primitive object={rearLockBarMaterial} attach="material" />
                </mesh>
              </group>

              {/* Barre de verrouillage - porte droite */}
              <group>
                <mesh position={[rodX, 0, rightRodZ]} castShadow receiveShadow>
                  <cylinderGeometry args={[rodRadius, rodRadius, rodLen, 18]} />
                  <primitive object={rearLockBarMaterial} attach="material" />
                </mesh>

                {/* Gâches (haut/bas) */}
                <mesh position={[keeperX, doorHalfH - 0.12, rightRodZ]} castShadow receiveShadow>
                  <boxGeometry args={[keeperW, keeperH, keeperD]} />
                  <primitive object={frameMaterial} attach="material" />
                </mesh>
                <mesh position={[keeperX, -doorHalfH + 0.12, rightRodZ]} castShadow receiveShadow>
                  <boxGeometry args={[keeperW, keeperH, keeperD]} />
                  <primitive object={frameMaterial} attach="material" />
                </mesh>

                {/* Poignée de manœuvre */}
                <mesh
                  position={[handleX, handleY, rightRodZ]}
                  rotation={[0, 0, Math.PI / 2]} // cylindre sur l'axe X
                  castShadow
                  receiveShadow
                >
                  <cylinderGeometry args={[handleRadius, handleRadius, handleLen, 16]} />
                  <primitive object={rearLockBarMaterial} attach="material" />
                </mesh>
              </group>
            </group>
          );
        })()}

        {/* Porte gauche */}
        <mesh position={[0, 0, -width / 4]} castShadow>
          <boxGeometry args={[0.1, height - 0.3, width / 2 - 0.2]} />
          <primitive object={containerBodyMaterial} attach="material" />
        </mesh>

        {/* Porte droite */}
        <mesh position={[0, 0, width / 4]} castShadow>
          <boxGeometry args={[0.1, height - 0.3, width / 2 - 0.2]} />
          <primitive object={containerBodyMaterial} attach="material" />
        </mesh>

        {/* Poignées anciennes retirées (remplacées par les barres inox) */}
      </group>

      {/* Échelle d'accès au toit */}
      <group position={[length / 2 - 0.3, height / 2, -width / 2]}>
        {/* Cage de sécurité (Anti-accès) */}
        <group position={[0, -height / 2 + 1.2, -0.4]}>
            {/* Poteaux verticaux */}
            {[-0.35, 0.35].map((x, i) => (
              <group key={`cage-post-${i}`}>
                {/* Poteau arrière (mur) */}
                <mesh position={[x, 0, 0.4]} castShadow>
                   <boxGeometry args={[0.04, 2.4, 0.04]} />
                   <primitive object={cageMaterial} attach="material" />
                </mesh>
                {/* Poteau avant */}
                <mesh position={[x, 0, -0.4]} castShadow>
                   <boxGeometry args={[0.04, 2.4, 0.04]} />
                   <primitive object={cageMaterial} attach="material" />
                </mesh>
                {/* Traverse latérale haut/bas/milieu */}
                {[1.1, 0, -1.1].map((y, j) => (
                  <mesh key={`cage-side-${j}`} position={[x, y, 0]} castShadow>
                    <boxGeometry args={[0.03, 0.03, 0.8]} />
                    <primitive object={cageMaterial} attach="material" />
                  </mesh>
                ))}
                {/* Grillage latéral (barres verticales fines) */}
                {Array.from({length: 3}).map((_, k) => (
                   <mesh key={`cage-grid-${k}`} position={[x, 0, -0.2 + k*0.2]} castShadow>
                      <boxGeometry args={[0.01, 2.3, 0.01]} />
                      <primitive object={cageMaterial} attach="material" />
                   </mesh>
                ))}
              </group>
            ))}

            {/* Porte frontale */}
            <group position={[0, 0, -0.4]}>
               {/* Cadre porte */}
               <mesh position={[-0.33, 0, 0]} castShadow>
                  <boxGeometry args={[0.04, 2.3, 0.02]} />
                  <primitive object={cageMaterial} attach="material" />
               </mesh>
               <mesh position={[0.33, 0, 0]} castShadow>
                  <boxGeometry args={[0.04, 2.3, 0.02]} />
                  <primitive object={cageMaterial} attach="material" />
               </mesh>
               {/* Grillage porte */}
               {Array.from({length: 4}).map((_, k) => (
                   <mesh key={`door-grid-${k}`} position={[-0.2 + k*0.13, 0, 0]} castShadow>
                      <boxGeometry args={[0.01, 2.3, 0.01]} />
                      <primitive object={cageMaterial} attach="material" />
                   </mesh>
                ))}
               {/* Traverse porte */}
               {[1, 0, -1].map((y, j) => (
                  <mesh key={`door-cross-${j}`} position={[0, y, 0]} castShadow>
                    <boxGeometry args={[0.66, 0.03, 0.02]} />
                    <primitive object={cageMaterial} attach="material" />
                  </mesh>
                ))}
               
               {/* Serrure / Cadenas */}
               <group position={[0.33, 0.1, -0.05]} rotation={[0,0,0.1]}>
                  {/* Corps du cadenas */}
                  <mesh position={[0, -0.03, 0]} castShadow>
                    <boxGeometry args={[0.06, 0.05, 0.02]} />
                    <primitive object={padlockMaterial} attach="material" />
                  </mesh>
                  {/* Anse */}
                  <mesh position={[0, 0.01, 0]}>
                    <torusGeometry args={[0.02, 0.005, 8, 16, Math.PI]} />
                    <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
                  </mesh>
               </group>
            </group>
        </group>

        {/* Montants */}
        {[-0.15, 0.15].map((xOffset, i) => (
          <mesh key={`ladder-rail-${i}`} position={[xOffset, 0, -0.1]} castShadow>
            <boxGeometry args={[0.05, height, 0.05]} />
            <meshStandardMaterial
              color="#7f8c8d"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Barreaux */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={`ladder-rung-${i}`}
            position={[0, -height / 2 + 0.3 + i * 0.35, -0.1]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.3, 12]} />
            <meshStandardMaterial
              color="#7f8c8d"
              metalness={0.85}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Indicateur HD5 */}
      <mesh position={[length / 2 - 0.5, height - 0.3, width / 2 + 0.02]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* Pieds de support */}
      {[
        [-length / 2 + 0.5, 0, -width / 2 + 0.2],
        [-length / 2 + 0.5, 0, width / 2 - 0.2],
        [length / 2 - 0.5, 0, -width / 2 + 0.2],
        [length / 2 - 0.5, 0, width / 2 - 0.2],
      ].map((pos, i) => (
        <mesh key={`foot-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshStandardMaterial
            color="#2c3e50"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
