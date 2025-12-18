# 📦 Exemples d'Utilisation - Container Hearst HD

## 🎯 Composant de Base

Le composant `ContainerHearstHD` est prêt à l'emploi dans votre configurateur.

### Import

```typescript
import { ContainerHearstHD } from '@/components/ContainerHearstHD'
```

---

## 📚 Exemples d'Utilisation

### 1. Container Simple

Le cas le plus basique : afficher un container.

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'

export default function SimpleContainer() {
  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <ContainerHearstHD position={[0, 0, 0]} />
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 2. Container avec Interaction

Ajouter un clic et une sélection visuelle.

```tsx
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContainerHearstHDInteractive } from '@/components/ContainerHearstHD'

export default function InteractiveContainer() {
  const [selected, setSelected] = useState(false)

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} castShadow />
      
      <ContainerHearstHDInteractive
        position={[0, 0, 0]}
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 3. Grille de Containers

Afficher plusieurs containers en grille.

```tsx
import { Canvas } from '@react-three/fiber'
import { ContainerGrid } from '@/components/ContainerHearstHD'

export default function ContainerGridExample() {
  const handleContainerClick = (id: string) => {
    console.log('Container cliqué:', id)
  }

  return (
    <Canvas camera={{ position: [20, 20, 20] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <ContainerGrid
        countX={5}
        countY={3}
        spacing={7}
        onContainerClick={handleContainerClick}
      />
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 4. Containers Dynamiques

Ajouter/supprimer des containers dynamiquement.

```tsx
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'

interface Container {
  id: string
  position: [number, number, number]
}

export default function DynamicContainers() {
  const [containers, setContainers] = useState<Container[]>([
    { id: '1', position: [0, 0, 0] },
    { id: '2', position: [7, 0, 0] },
  ])

  const addContainer = () => {
    const newId = String(containers.length + 1)
    const newPosition: [number, number, number] = [
      containers.length * 7,
      0,
      0,
    ]
    setContainers([...containers, { id: newId, position: newPosition }])
  }

  const removeContainer = (id: string) => {
    setContainers(containers.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
        <button onClick={addContainer}>➕ Ajouter Container</button>
      </div>

      <Canvas camera={{ position: [15, 15, 15] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        
        {containers.map((container) => (
          <ContainerHearstHD
            key={container.id}
            id={container.id}
            position={container.position}
            onClick={() => removeContainer(container.id)}
          />
        ))}
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}
```

### 5. Container avec Rotation

Faire tourner un container.

```tsx
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'
import type { Group } from 'three'

function RotatingContainer() {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <ContainerHearstHD position={[0, 0, 0]} />
    </group>
  )
}

export default function RotatingContainerExample() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <RotatingContainer />
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 6. Container avec Animation d'Apparition

Animation smooth lors de l'apparition.

```tsx
import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'
import type { Group } from 'three'
import { gsap } from 'gsap'

function AnimatedContainer({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    if (groupRef.current) {
      // Animation d'apparition
      gsap.from(groupRef.current.position, {
        y: -5,
        duration: 1,
        ease: 'bounce.out',
      })
      gsap.from(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: 'back.out',
      })
    }
  }, [])

  return (
    <group ref={groupRef}>
      <ContainerHearstHD position={position} />
    </group>
  )
}

export default function AnimatedContainerExample() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <AnimatedContainer position={[0, 0, 0]} />
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 7. Disposition Linéaire (25 MW)

Exemple de disposition pour une installation 25 MW.

```tsx
import { Canvas } from '@react-three/fiber'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'

export default function Layout25MW() {
  // 25 MW = environ 50 containers (500 kW chacun)
  const containerCount = 50
  const containersPerRow = 10
  const spacing = 7 // mètres

  const containers = Array.from({ length: containerCount }, (_, i) => {
    const row = Math.floor(i / containersPerRow)
    const col = i % containersPerRow
    return {
      id: `container-${i}`,
      position: [col * spacing, row * spacing, 0] as [number, number, number],
    }
  })

  return (
    <Canvas camera={{ position: [50, 50, 50], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[30, 30, 20]} intensity={1} />
      
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Containers */}
      {containers.map((container) => (
        <ContainerHearstHD
          key={container.id}
          id={container.id}
          position={container.position}
        />
      ))}
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 8. Container avec Informations

Afficher des informations au survol.

```tsx
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'

function ContainerWithInfo({ id, position }: any) {
  const [hovered, setHovered] = useState(false)

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <ContainerHearstHD position={position} />
      
      {hovered && (
        <Html position={[position[0], position[1], position[2] + 4]}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#00A651',
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #00A651',
            minWidth: '200px',
          }}>
            <h3 style={{ margin: 0, fontSize: '14px' }}>Container {id}</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
              Puissance: 500 kW<br />
              Status: Actif<br />
              Température: 25°C
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ContainerWithInfoExample() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <ContainerWithInfo id="1" position={[0, 0, 0]} />
      <ContainerWithInfo id="2" position={[7, 0, 0]} />
      <ContainerWithInfo id="3" position={[14, 0, 0]} />
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 9. Container avec Gestion d'État

Utiliser un store (Zustand) pour gérer les containers.

```tsx
// store/containerStore.ts
import create from 'zustand'

interface Container {
  id: string
  position: [number, number, number]
  selected: boolean
}

interface ContainerStore {
  containers: Container[]
  addContainer: (position: [number, number, number]) => void
  removeContainer: (id: string) => void
  selectContainer: (id: string) => void
}

export const useContainerStore = create<ContainerStore>((set) => ({
  containers: [
    { id: '1', position: [0, 0, 0], selected: false },
    { id: '2', position: [7, 0, 0], selected: false },
  ],
  addContainer: (position) =>
    set((state) => ({
      containers: [
        ...state.containers,
        {
          id: String(state.containers.length + 1),
          position,
          selected: false,
        },
      ],
    })),
  removeContainer: (id) =>
    set((state) => ({
      containers: state.containers.filter((c) => c.id !== id),
    })),
  selectContainer: (id) =>
    set((state) => ({
      containers: state.containers.map((c) =>
        c.id === id ? { ...c, selected: !c.selected } : c
      ),
    })),
}))

// Component
import { Canvas } from '@react-three/fiber'
import { ContainerHearstHDInteractive } from '@/components/ContainerHearstHD'
import { useContainerStore } from '@/store/containerStore'

export default function ContainerStoreExample() {
  const { containers, selectContainer } = useContainerStore()

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      {containers.map((container) => (
        <ContainerHearstHDInteractive
          key={container.id}
          id={container.id}
          position={container.position}
          selected={container.selected}
          onClick={() => selectContainer(container.id)}
        />
      ))}
      
      <OrbitControls />
    </Canvas>
  )
}
```

### 10. Scène Complète avec UI

Exemple complet avec interface utilisateur.

```tsx
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import { ContainerHearstHD } from '@/components/ContainerHearstHD'

export default function CompleteScene() {
  const [containers, setContainers] = useState([
    { id: '1', position: [0, 0, 0] as [number, number, number] },
  ])

  const addContainer = () => {
    const newId = String(containers.length + 1)
    const row = Math.floor(containers.length / 5)
    const col = containers.length % 5
    setContainers([
      ...containers,
      { id: newId, position: [col * 7, row * 7, 0] },
    ])
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* UI */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '12px',
          color: 'white',
        }}
      >
        <h2 style={{ margin: '0 0 15px 0', color: '#00A651' }}>
          Configurateur Hearst
        </h2>
        <p style={{ margin: '0 0 10px 0' }}>
          Containers: {containers.length}
        </p>
        <button
          onClick={addContainer}
          style={{
            background: '#00A651',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ➕ Ajouter Container
        </button>
      </div>

      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [20, 20, 20], fov: 50 }}
        shadows
      >
        {/* Environnement */}
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="sunset" />
        
        {/* Lumières */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Sol */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -0.1]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>

        {/* Containers */}
        {containers.map((container) => (
          <ContainerHearstHD
            key={container.id}
            id={container.id}
            position={container.position}
          />
        ))}

        {/* Contrôles */}
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={100}
        />
      </Canvas>
    </div>
  )
}
```

---

## 🎨 Personnalisation

### Modifier les Couleurs

```tsx
// Dans le modèle Blender, les couleurs sont définies par vertex colors
// Pour changer les couleurs, modifier le fichier .blend et ré-exporter
```

### Ajouter des Variantes

```tsx
// Créer des variantes dans Blender:
// - container_hearst_hd_v1.glb (standard)
// - container_hearst_hd_v2.glb (double cooling)
// - container_hearst_hd_v3.glb (sans logo)

export function ContainerVariant({ variant = 'v1' }: { variant: string }) {
  const { scene } = useGLTF(`/models/container_hearst_hd_${variant}.glb`)
  return <primitive object={scene.clone()} />
}
```

---

## 📊 Performance

### Optimisation pour Beaucoup de Containers

```tsx
import { Instances, Instance } from '@react-three/drei'

export function OptimizedContainerGrid({ count = 100 }) {
  const { scene } = useGLTF('/models/container_hearst_hd.glb')

  return (
    <Instances geometry={scene.children[0].geometry} material={scene.children[0].material}>
      {Array.from({ length: count }, (_, i) => (
        <Instance
          key={i}
          position={[
            (i % 10) * 7,
            Math.floor(i / 10) * 7,
            0,
          ]}
        />
      ))}
    </Instances>
  )
}
```

---

## 🚀 Prochaines Étapes

1. Tester ces exemples dans votre projet
2. Adapter selon vos besoins spécifiques
3. Créer des variantes de containers si nécessaire
4. Optimiser pour de grandes installations (100+ containers)

---

**Hearst Qatar Project**  
Exemples d'utilisation du Container HD







