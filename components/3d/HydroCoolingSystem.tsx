import { useRef, useMemo } from 'react';
import { Mesh, Group } from 'three';
import * as THREE from 'three';

interface HydroCoolingSystemProps {
  position: [number, number, number];
  systemId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  rotation?: [number, number, number];
}

/**
 * Système de refroidissement Hydro ultra-réaliste
 * Basé sur la photo fournie avec ventilateurs circulaires
 * 
 * Caractéristiques principales :
 * - Structure métallique en H avec cadre gris
 * - 12 ventilateurs circulaires noirs disposés en 2 rangées de 6
 * - Panneaux latéraux en V noir/gris foncé
 * - Tuyauterie et pompes vertes en dessous
 * - Réservoirs bleus et équipements auxiliaires
 * - Dimensions : ~15m × 3m × 3m
 */
export default function HydroCoolingSystem({
  position,
  systemId,
  onSelect,
  isSelected = false,
  rotation = [0, 0, 0],
}: HydroCoolingSystemProps) {
  const groupRef = useRef<Group>(null);

  // Matériaux réalistes
  const frameMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#7f8c8d',
      metalness: 0.85,
      roughness: 0.3,
      envMapIntensity: 1.0,
    });
    if (isSelected) {
      mat.emissive = new THREE.Color('#10b981');
      mat.emissiveIntensity = 0.3;
    }
    return mat;
  }, [isSelected]);

  const fanHousingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.7,
    roughness: 0.4,
  }), []);

  const panelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2c3e50',
    metalness: 0.6,
    roughness: 0.45,
  }), []);

  const pipeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#27ae60',
    metalness: 0.8,
    roughness: 0.25,
  }), []);

  const tankMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3498db',
    metalness: 0.85,
    roughness: 0.2,
  }), []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(systemId);
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      name={systemId}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Structure de base - Cadre principal */}
      {/* Poutres longitudinales inférieures */}
      {[-1.3, 1.3].map((zPos, i) => (
        <mesh key={`beam-bottom-${i}`} position={[0, 0.2, zPos]} castShadow>
          <boxGeometry args={[15, 0.2, 0.2]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      ))}

      {/* Poutres longitudinales supérieures */}
      {[-1.3, 1.3].map((zPos, i) => (
        <mesh key={`beam-top-${i}`} position={[0, 2.8, zPos]} castShadow>
          <boxGeometry args={[15, 0.2, 0.2]} />
          <primitive object={frameMaterial} attach="material" />
        </mesh>
      ))}

      {/* Montants verticaux */}
      {Array.from({ length: 7 }).map((_, i) => {
        const xPos = -7 + i * 2.4;
        return (
          <group key={`vertical-${i}`}>
            <mesh position={[xPos, 1.5, -1.3]} castShadow>
              <boxGeometry args={[0.15, 2.6, 0.15]} />
              <primitive object={frameMaterial} attach="material" />
            </mesh>
            <mesh position={[xPos, 1.5, 1.3]} castShadow>
              <boxGeometry args={[0.15, 2.6, 0.15]} />
              <primitive object={frameMaterial} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Traverses horizontales */}
      {Array.from({ length: 6 }).map((_, i) => {
        const xPos = -6.8 + i * 2.4;
        return (
          <group key={`cross-${i}`}>
            <mesh position={[xPos + 1.2, 1.5, 0]} rotation={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 0.15, 2.6]} />
              <primitive object={frameMaterial} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Plateforme supérieure avec ventilateurs - 12 ventilateurs (2 rangées de 6) */}
      <group position={[0, 2.7, 0]}>
        {/* Plateforme de support */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14.5, 0.1, 2.5]} />
          <meshStandardMaterial
            color="#95a5a6"
            metalness={0.75}
            roughness={0.35}
          />
        </mesh>

        {/* Rangée de ventilateurs avant */}
        {Array.from({ length: 6 }).map((_, i) => {
          const xPos = -6.5 + i * 2.4;
          return (
            <group key={`fan-front-${i}`} position={[xPos, 0.3, -0.6]}>
              {/* Boîtier du ventilateur */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.55, 0.55, 0.4, 32]} />
                <primitive object={fanHousingMaterial} attach="material" />
              </mesh>

              {/* Grille de protection */}
              <mesh position={[0, 0.21, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
                <meshStandardMaterial
                  color="#2c3e50"
                  metalness={0.9}
                  roughness={0.2}
                  transparent={true}
                  opacity={0.7}
                />
              </mesh>

              {/* Pales du ventilateur */}
              {Array.from({ length: 8 }).map((_, j) => (
                <mesh
                  key={`blade-${j}`}
                  position={[0, 0.21, 0]}
                  rotation={[0, (j * Math.PI) / 4, 0]}
                  castShadow={false}
                >
                  <boxGeometry args={[0.06, 0.45, 0.02]} />
                  <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.85}
                    roughness={0.25}
                  />
                </mesh>
              ))}

              {/* Moyeu central */}
              <mesh position={[0, 0.21, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
                <meshStandardMaterial
                  color="#34495e"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          );
        })}

        {/* Rangée de ventilateurs arrière */}
        {Array.from({ length: 6 }).map((_, i) => {
          const xPos = -6.5 + i * 2.4;
          return (
            <group key={`fan-back-${i}`} position={[xPos, 0.3, 0.6]}>
              {/* Boîtier du ventilateur */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.55, 0.55, 0.4, 32]} />
                <primitive object={fanHousingMaterial} attach="material" />
              </mesh>

              {/* Grille de protection */}
              <mesh position={[0, 0.21, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
                <meshStandardMaterial
                  color="#2c3e50"
                  metalness={0.9}
                  roughness={0.2}
                  transparent={true}
                  opacity={0.7}
                />
              </mesh>

              {/* Pales du ventilateur */}
              {Array.from({ length: 8 }).map((_, j) => (
                <mesh
                  key={`blade-${j}`}
                  position={[0, 0.21, 0]}
                  rotation={[0, (j * Math.PI) / 4, 0]}
                  castShadow={false}
                >
                  <boxGeometry args={[0.06, 0.45, 0.02]} />
                  <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.85}
                    roughness={0.25}
                  />
                </mesh>
              ))}

              {/* Moyeu central */}
              <mesh position={[0, 0.21, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
                <meshStandardMaterial
                  color="#34495e"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Panneaux latéraux en V */}
      {Array.from({ length: 6 }).map((_, i) => {
        const xPos = -6.5 + i * 2.4;
        return (
          <group key={`panel-${i}`} position={[xPos, 1.5, 0]}>
            {/* Panneau gauche incliné */}
            <mesh
              position={[0, 0, -1.0]}
              rotation={[Math.PI / 8, 0, 0]}
              castShadow
            >
              <boxGeometry args={[2.2, 2.4, 0.05]} />
              <primitive object={panelMaterial} attach="material" />
            </mesh>

            {/* Panneau droit incliné */}
            <mesh
              position={[0, 0, 1.0]}
              rotation={[-Math.PI / 8, 0, 0]}
              castShadow
            >
              <boxGeometry args={[2.2, 2.4, 0.05]} />
              <primitive object={panelMaterial} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Système de tuyauterie et pompes en dessous */}
      <group position={[0, 0.8, 0]}>
        {/* Pompes vertes - 3 pompes */}
        {[-3, 0, 3].map((xPos, i) => (
          <group key={`pump-${i}`} position={[xPos, 0, 0]}>
            {/* Corps de la pompe */}
            <mesh castShadow>
              <boxGeometry args={[0.8, 0.6, 0.6]} />
              <primitive object={pipeMaterial} attach="material" />
            </mesh>

            {/* Moteur */}
            <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
              <primitive object={pipeMaterial} attach="material" />
            </mesh>

            {/* Tuyau d'aspiration */}
            <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
              <primitive object={pipeMaterial} attach="material" />
            </mesh>

            {/* Tuyau de refoulement */}
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
              <primitive object={pipeMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Tuyauterie principale horizontale */}
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 14, 16]} />
          <primitive object={pipeMaterial} attach="material" />
        </mesh>

        {/* Réservoirs bleus - 2 réservoirs */}
        {[-4, 4].map((xPos, i) => (
          <group key={`tank-${i}`} position={[xPos, 0, -0.8]}>
            {/* Réservoir cylindrique vertical */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 1.0, 24]} />
              <primitive object={tankMaterial} attach="material" />
            </mesh>

            {/* Bouchon supérieur */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.3, 0.1, 24]} />
              <meshStandardMaterial
                color="#2980b9"
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>

            {/* Vanne */}
            <mesh position={[0.35, -0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.15, 12]} />
              <meshStandardMaterial
                color="#e74c3c"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Connecteurs et vannes */}
        {[-6, -3, 0, 3, 6].map((xPos, i) => (
          <mesh key={`valve-${i}`} position={[xPos, 0.6, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshStandardMaterial
              color="#e74c3c"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Supports de base */}
      {[
        [-7, 0, -1.3],
        [-7, 0, 1.3],
        [7, 0, -1.3],
        [7, 0, 1.3],
      ].map((pos, i) => (
        <mesh key={`support-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color="#34495e"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Plaque d'identification */}
      <mesh position={[-7, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.0, 0.5, 0.03]} />
        <meshStandardMaterial
          color="#ecf0f1"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}
