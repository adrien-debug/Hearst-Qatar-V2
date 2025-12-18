/**
 * Container Hearst HD - Composant 3D
 * ===================================
 * 
 * Composant React Three Fiber pour afficher le container unique Hearst HD
 * avec dalle béton, système de refroidissement et logo.
 * 
 * Utilisation:
 * ```tsx
 * <ContainerHearstHD position={[0, 0, 0]} />
 * ```
 */

import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'

interface ContainerHearstHDProps {
  /** Position [x, y, z] en mètres */
  position?: [number, number, number]
  /** Rotation [x, y, z] en radians */
  rotation?: [number, number, number]
  /** Échelle (1 = taille réelle) */
  scale?: number
  /** Callback au clic */
  onClick?: () => void
  /** ID unique pour identification */
  id?: string
}

/**
 * Composant Container Hearst HD
 * 
 * Charge et affiche le modèle 3D du container unique avec:
 * - Dalle béton 40cm
 * - Container noir HD
 * - Système de refroidissement
 * - Logo Hearst
 */
export function ContainerHearstHD({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
}: ContainerHearstHDProps) {
  const groupRef = useRef<Group>(null)
  
  // Charger le modèle GLB
  const { scene } = useGLTF('/models/container_hearst_hd.glb')

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'container', id }}
    >
      <primitive object={scene.clone()} />
    </group>
  )
}

// Preload pour améliorer les performances
useGLTF.preload('/models/container_hearst_hd.glb')

/**
 * Variante avec ombre et interaction
 */
export function ContainerHearstHDInteractive({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  selected = false,
}: ContainerHearstHDProps & { selected?: boolean }) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF('/models/container_hearst_hd.glb')

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      userData={{ type: 'container', id }}
    >
      <primitive object={scene.clone()} />
      
      {/* Ombre au sol */}
      <mesh
        position={[0, 0, 0.01]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[6.5, 3.0]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {/* Indicateur de sélection */}
      {selected && (
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[6.6, 3.1, 0.1]} />
          <meshBasicMaterial
            color="#00A651"
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}

/**
 * Grille de containers
 * 
 * Exemple d'utilisation pour créer une disposition en grille
 */
interface ContainerGridProps {
  /** Nombre de containers en X */
  countX?: number
  /** Nombre de containers en Y */
  countY?: number
  /** Espacement entre containers (mètres) */
  spacing?: number
  /** Callback au clic sur un container */
  onContainerClick?: (id: string) => void
}

export function ContainerGrid({
  countX = 5,
  countY = 2,
  spacing = 7,
  onContainerClick,
}: ContainerGridProps) {
  const containers = []

  for (let x = 0; x < countX; x++) {
    for (let y = 0; y < countY; y++) {
      const id = `container-${x}-${y}`
      containers.push({
        id,
        position: [x * spacing, y * spacing, 0] as [number, number, number],
      })
    }
  }

  return (
    <group>
      {containers.map((container) => (
        <ContainerHearstHD
          key={container.id}
          id={container.id}
          position={container.position}
          onClick={() => onContainerClick?.(container.id)}
        />
      ))}
    </group>
  )
}

/**
 * Exemple de scène complète avec containers
 */
export function ContainerScene() {
  return (
    <>
      {/* Lumières */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Sol */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -0.01]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Containers */}
      <ContainerGrid
        countX={3}
        countY={2}
        spacing={7}
        onContainerClick={(id) => console.log('Container cliqué:', id)}
      />
    </>
  )
}

/**
 * Hook personnalisé pour gérer les containers
 */
export function useContainers() {
  const addContainer = (position: [number, number, number]) => {
    // Logique pour ajouter un container
    console.log('Ajout container à:', position)
  }

  const removeContainer = (id: string) => {
    // Logique pour supprimer un container
    console.log('Suppression container:', id)
  }

  const moveContainer = (id: string, newPosition: [number, number, number]) => {
    // Logique pour déplacer un container
    console.log('Déplacement container:', id, 'vers', newPosition)
  }

  return {
    addContainer,
    removeContainer,
    moveContainer,
  }
}

/**
 * Types pour TypeScript
 */
export interface Container {
  id: string
  position: [number, number, number]
  rotation?: [number, number, number]
  type: 'standard' | 'cooling' | 'custom'
  metadata?: {
    power?: number
    cooling?: boolean
    brand?: string
  }
}

/**
 * Constantes utiles
 */
export const CONTAINER_DIMENSIONS = {
  length: 6.058,
  width: 2.438,
  height: 2.591,
  totalHeight: 3.0, // Avec dalle
} as const

export const CONTAINER_COLORS = {
  beton: '#C0C0C0',
  container: '#000000',
  cooling: '#404040',
  logo: '#00A651',
} as const

export const CONTAINER_SPACING = {
  standard: 7, // Espacement standard entre containers
  tight: 6.5, // Espacement serré
  wide: 10, // Espacement large
} as const















