# 🎓 Guide d'Utilisation du Catalogue 3D

## 🚀 Démarrage Rapide

### 1. Accéder au Catalogue

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir dans le navigateur
http://localhost:1111/equipment-catalog
```

### 2. Navigation

Le catalogue est organisé en **4 sections principales** :

#### 📊 En-tête
- **Barre de recherche** : Recherchez par nom, description ou tags
- **Filtres de catégorie** :
  - 🏭 Tous
  - ⚡ Transformateurs
  - 📦 Conteneurs
  - ❄️ Refroidissement
  - 🔋 Énergie

#### 🎨 Grille de Modèles
- Cartes interactives avec prévisualisation 3D en temps réel
- Rotation automatique des modèles
- Hover pour agrandir
- Clic pour sélectionner

#### 📋 Panneau de Détails
- Apparaît en bas quand un modèle est sélectionné
- Affiche les spécifications complètes
- Boutons d'action : Fermer / Ajouter à la scène

---

## 🎯 Fonctionnalités Détaillées

### Recherche Intelligente

La recherche fonctionne sur :
- **Nom du modèle** : "PT-Substation"
- **Description** : "haute tension", "compact"
- **Tags** : "isolateurs", "radiateurs", "mining"

**Exemple** :
```
Recherche: "haute tension"
→ Trouve: PT-Substation Transformer
```

### Filtres par Catégorie

| Catégorie | Icône | Modèles Inclus |
|-----------|-------|----------------|
| Tous | 🏭 | 6 modèles |
| Transformateurs | ⚡ | PT-Substation, PT-Padmount, DT-Secondary |
| Conteneurs | 📦 | ANTSPACE HD5 |
| Refroidissement | ❄️ | Hydro Cooling System |
| Énergie | 🔋 | DT-Renewable |

### Prévisualisation 3D Interactive

Chaque carte affiche :
- **Modèle 3D en temps réel** avec rotation automatique
- **Éclairage réaliste** : Lumière directionnelle + ambiante + hémisphérique
- **Ombres portées** sur le sol
- **Environnement HDRI** : Preset "city"

**Contrôles** :
- Rotation automatique à 2 tours/minute
- Pas de zoom ni de pan (prévisualisation fixe)
- Angle de vue optimisé pour chaque modèle

---

## 📦 Utilisation dans Votre Code

### Import d'un Modèle Spécifique

```typescript
import { PTSubstationTransformer } from '@/components/3d';

function MyScene() {
  return (
    <Canvas>
      <PTSubstationTransformer
        position={[0, 0, 0]}
        transformerId="my-transformer"
        onSelect={(id) => console.log('Selected:', id)}
        isSelected={false}
        rotation={[0, Math.PI / 4, 0]}
      />
    </Canvas>
  );
}
```

### Props Communes à Tous les Modèles

| Prop | Type | Description | Défaut |
|------|------|-------------|--------|
| `position` | `[number, number, number]` | Position XYZ dans la scène | `[0, 0, 0]` |
| `transformerId` / `containerId` / `systemId` | `string` | Identifiant unique | Requis |
| `onSelect` | `(id: string) => void` | Callback de sélection | `undefined` |
| `isSelected` | `boolean` | État de sélection | `false` |
| `rotation` | `[number, number, number]` | Rotation XYZ en radians | `[0, 0, 0]` |

### Utilisation du Catalogue Complet

```typescript
import Equipment3DCatalog, { EquipmentModel } from '@/components/3d/Equipment3DCatalog';

function MyApp() {
  const handleSelectModel = (model: EquipmentModel) => {
    console.log('Modèle sélectionné:', model.name);
    console.log('Dimensions:', model.dimensions);
    console.log('Puissance:', model.power);
  };

  return (
    <Equipment3DCatalog
      onSelectModel={handleSelectModel}
      selectedCategory="transformer"
    />
  );
}
```

### Accès au Catalogue de Données

```typescript
import { EQUIPMENT_CATALOG } from '@/components/3d';

// Récupérer tous les transformateurs
const transformers = EQUIPMENT_CATALOG.filter(
  (model) => model.category === 'transformer'
);

// Rechercher un modèle spécifique
const hd5 = EQUIPMENT_CATALOG.find(
  (model) => model.id === 'antspace-hd5'
);

// Obtenir tous les tags
const allTags = EQUIPMENT_CATALOG.flatMap((model) => model.tags);
const uniqueTags = [...new Set(allTags)];
```

---

## 🎨 Personnalisation

### Modifier les Couleurs

Les matériaux sont définis avec `useMemo` pour les performances :

```typescript
const bodyMaterial = useMemo(() => {
  const mat = new THREE.MeshStandardMaterial({
    color: '#8b9199',      // Changez cette couleur
    metalness: 0.85,       // 0 = diélectrique, 1 = métal
    roughness: 0.35,       // 0 = lisse, 1 = rugueux
    envMapIntensity: 1.2,  // Intensité des reflets
  });
  
  if (isSelected) {
    mat.emissive = new THREE.Color('#4ade80');
    mat.emissiveIntensity = 0.3;
  }
  
  return mat;
}, [isSelected]);
```

### Ajouter des Animations

```typescript
import { useFrame } from '@react-three/fiber';

function AnimatedFan() {
  const fanRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.y += delta * 2; // 2 rad/s
    }
  });
  
  return (
    <group ref={fanRef}>
      {/* Pales du ventilateur */}
    </group>
  );
}
```

### Ajouter des Textures

```typescript
import { useTexture } from '@react-three/drei';

function TexturedModel() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/textures/color.jpg',
    '/textures/normal.jpg',
    '/textures/roughness.jpg',
  ]);
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
}
```

---

## 🔧 Dépannage

### Le modèle n'apparaît pas

**Vérifiez** :
1. La position est-elle dans le champ de vision de la caméra ?
2. L'échelle est-elle appropriée ?
3. Y a-t-il de la lumière dans la scène ?

```typescript
// Position de test visible
<PTSubstationTransformer position={[0, 0, 0]} />

// Ajouter de la lumière
<ambientLight intensity={0.6} />
<directionalLight position={[10, 10, 5]} intensity={1.2} />
```

### Les ombres ne s'affichent pas

```typescript
<Canvas shadows>  {/* Activer les ombres sur le Canvas */}
  <directionalLight castShadow />  {/* Lumière projette des ombres */}
  <mesh castShadow receiveShadow>  {/* Mesh projette et reçoit */}
    {/* ... */}
  </mesh>
</Canvas>
```

### Performance lente

**Optimisations** :
1. Désactiver les ombres sur les petits détails
2. Utiliser `castShadow={false}` pour les ailettes et boulons
3. Réduire la résolution des shadow maps
4. Utiliser l'instancing pour les éléments répétitifs

```typescript
// Ombres optimisées
<directionalLight
  castShadow
  shadow-mapSize-width={1024}   // Au lieu de 4096
  shadow-mapSize-height={1024}
/>

// Désactiver pour les détails
<mesh castShadow={false}>
  <boxGeometry args={[0.02, 0.02, 0.02]} />
</mesh>
```

---

## 📚 Exemples Complets

### Scène avec Plusieurs Modèles

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import {
  PTSubstationTransformer,
  AntspaceHD5Container,
  HydroCoolingSystem,
} from '@/components/3d';

export default function MyIndustrialSite() {
  return (
    <Canvas shadows camera={{ position: [50, 30, 50], fov: 60 }}>
      {/* Éclairage */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 20, 10]} intensity={1.2} castShadow />
      
      {/* Environnement */}
      <Environment preset="city" />
      
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Équipements */}
      <PTSubstationTransformer
        position={[0, 0, 0]}
        transformerId="transformer-1"
      />
      
      <AntspaceHD5Container
        position={[-20, 0, 0]}
        containerId="container-1"
      />
      
      <HydroCoolingSystem
        position={[20, 0, 0]}
        systemId="cooling-1"
      />
      
      {/* Contrôles */}
      <OrbitControls />
    </Canvas>
  );
}
```

### Intégration avec État React

```typescript
import { useState } from 'react';
import { PTSubstationTransformer } from '@/components/3d';

export default function InteractiveScene() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transformers, setTransformers] = useState([
    { id: 't1', position: [0, 0, 0] },
    { id: 't2', position: [10, 0, 0] },
    { id: 't3', position: [20, 0, 0] },
  ]);

  return (
    <div>
      {/* UI de contrôle */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow">
        <h3>Transformateurs</h3>
        <ul>
          {transformers.map((t) => (
            <li
              key={t.id}
              className={selectedId === t.id ? 'font-bold' : ''}
              onClick={() => setSelectedId(t.id)}
            >
              {t.id}
            </li>
          ))}
        </ul>
      </div>

      {/* Scène 3D */}
      <Canvas>
        {transformers.map((t) => (
          <PTSubstationTransformer
            key={t.id}
            position={t.position as [number, number, number]}
            transformerId={t.id}
            onSelect={setSelectedId}
            isSelected={selectedId === t.id}
          />
        ))}
      </Canvas>
    </div>
  );
}
```

---

## 🎓 Ressources Supplémentaires

### Documentation Three.js
- [Three.js Docs](https://threejs.org/docs/)
- [Materials](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
- [Geometries](https://threejs.org/docs/#api/en/geometries/BoxGeometry)

### React Three Fiber
- [R3F Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)

### PBR Materials
- [PBR Guide](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)
- [Material Values](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/Materials/PhysicallyBased/)

---

**Bon développement ! 🚀**







