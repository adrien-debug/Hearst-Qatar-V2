# Guide de Style - Système de Rendu 3D Hearst Qatar

## 🎨 Vue d'ensemble

Ce guide documente les standards de rendu 3D et d'interface utilisateur pour l'application Hearst Qatar 100MW.

---

## 🎯 Charte Graphique Hearst

### Couleurs Principales

```typescript
// Noir Hearst (principal)
black: '#000000'
blackLight: '#1a1a1a'
blackHover: '#2d2d2d'

// Vert Hearst (accent)
green: '#10b981'      // Vert émeraude
greenLight: '#34d399'
greenDark: '#059669'
```

### Utilisation des Couleurs

- **Noir** : Toolbars, headers, boutons primaires
- **Vert** : Accents, bordures, boutons secondaires, états actifs
- **Gris** : Textes secondaires, backgrounds neutres

---

## 🔧 Configuration du Rendu 3D

### Matériaux PBR Standards

```typescript
// Métal (transformateurs, conteneurs)
metal: {
  metalness: 0.85,
  roughness: 0.35,
  envMapIntensity: 1.2
}

// Métal foncé (composants électriques)
metalDark: {
  metalness: 0.95,
  roughness: 0.1
}

// Béton (sols, fondations)
concrete: {
  metalness: 0.1,
  roughness: 0.9
}

// Porcelaine (isolateurs)
porcelain: {
  metalness: 0.05,
  roughness: 0.15
}
```

### Éclairage Standard

```typescript
// Lumière ambiante
ambient: {
  intensity: 0.6,
  color: '#ffffff'
}

// Lumière directionnelle
directional: {
  intensity: 1.2,
  position: [20, 20, 10],
  castShadow: true
}

// Lumière hémisphérique
hemisphere: {
  skyColor: '#87ceeb',
  groundColor: '#d4a574',  // Couleur du sable du Qatar
  intensity: 0.4
}
```

---

## 📦 Composants UI Hearst

### HearstButton

```typescript
// Bouton primaire (noir → vert au hover)
<HearstButton variant="primary">
  Action
</HearstButton>

// Bouton secondaire (vert)
<HearstButton variant="secondary">
  Action
</HearstButton>

// Bouton outline (bordure noire)
<HearstButton variant="outline">
  Action
</HearstButton>
```

### HearstToolbar

```typescript
<HearstToolbar title="Éditeur 3D">
  <HearstButton>Action 1</HearstButton>
  <HearstButton>Action 2</HearstButton>
</HearstToolbar>
```

### HearstModal

```typescript
<HearstModal 
  isOpen={open} 
  onClose={handleClose}
  title="Titre de la Modal"
  size="xl"
>
  {/* Contenu */}
</HearstModal>
```

### HearstCard

```typescript
<HearstCard 
  isSelected={selected}
  onClick={handleClick}
  hoverable={true}
>
  {/* Contenu */}
</HearstCard>
```

---

## 🎬 Utilisation de StandardScene

```typescript
import StandardScene from '@/components/3d/StandardScene';

<Canvas>
  <StandardScene showGround={true} groundSize={1000}>
    {/* Vos modèles 3D ici */}
    <PTSubstationTransformer position={[0, 0, 0]} />
    <AntspaceHD5Container position={[20, 0, 0]} />
  </StandardScene>
</Canvas>
```

**Avantages** :
- Éclairage cohérent automatique
- Sol sablonneux du Qatar inclus
- Environnement HDRI configuré
- Ombres optimisées

---

## 🔄 Contrôles de Rotation

### Rendre un Composant Rotatable

```typescript
import { makeRotatable } from '@/components/3d/Rotatable3DObject';

const RotatablePTTransformer = makeRotatable(PTSubstationTransformer);

<RotatablePTTransformer
  position={[0, 0, 0]}
  enableRotation={true}
  onRotationChange={(rot) => console.log(rot)}
/>
```

### Panneau de Contrôle de Rotation

```typescript
import RotationControlPanel from '@/components/ui/RotationControlPanel';

<RotationControlPanel
  rotation={rotation}
  onRotationChange={setRotation}
  onReset={() => setRotation([0, 0, 0])}
  onApply={handleApply}
/>
```

---

## ⚡ Optimisations de Performance

### LOD (Level of Detail)

```typescript
import LODWrapper, { SimplifiedObject } from '@/components/3d/LODWrapper';

<LODWrapper 
  distance={100}
  simplifiedChildren={<SimplifiedObject color="#8b9199" size={[4, 5, 3]} />}
>
  <PTSubstationTransformer {...props} />
</LODWrapper>
```

### Ombres Intelligentes

```typescript
// Activer les ombres uniquement sur les objets principaux
<mesh castShadow={isMainObject} receiveShadow={true}>
  {/* Géométrie */}
</mesh>
```

### Instancing pour Éléments Répétitifs

Pour 16+ conteneurs identiques, utiliser `InstancedMesh` :

```typescript
const containerPositions = [...]; // 16 positions

<instancedMesh args={[geometry, material, 16]}>
  {/* Configuration des instances */}
</instancedMesh>
```

---

## 🚀 Système de Déploiement

### Wizard en 4 Étapes

```typescript
import DeploymentWizard from '@/components/deployment/DeploymentWizard';

<DeploymentWizard
  isOpen={isOpen}
  onClose={handleClose}
  onComplete={(config) => {
    // Créer le projet avec la configuration
  }}
/>
```

**Étapes** :
1. **Informations** : Nom, pays, type d'énergie
2. **Puissance** : Configuration MW avec calculs automatiques
3. **Phasage** : Timeline visuelle des phases (optionnel)
4. **Validation** : Résumé et validation

---

## 📐 Mapping des Composants

### Anciens → Nouveaux

```typescript
import { getUltraRealisticComponent } from '@/components/3d/ComponentMapping';

const Component = getUltraRealisticComponent('transformer');
// Retourne PTSubstationTransformer
```

**Mappings disponibles** :
- `transformer` → `PTSubstationTransformer`
- `container` → `AntspaceHD5Container`
- `cooling` → `HydroCoolingSystem`
- `dt-secondary` → `DTSecondaryTransformer`
- `dt-renewable` → `DTRenewableTransformer`

---

## 🎯 Bonnes Pratiques

### Rendu 3D

1. **Toujours utiliser `StandardScene`** pour la cohérence
2. **Appliquer les matériaux PBR** depuis `RENDERING_CONFIG`
3. **Optimiser les ombres** : uniquement sur objets principaux
4. **Utiliser LOD** pour les scènes avec 20+ objets
5. **Mémoriser les matériaux** avec `useMemo`

### Interface Utilisateur

1. **Utiliser les composants Hearst** : `HearstButton`, `HearstCard`, etc.
2. **Respecter la charte** : Noir + Vert uniquement
3. **Transitions fluides** : `transition-all duration-300`
4. **Hover states** : Toujours inclure un état hover
5. **Accessibilité** : Labels clairs, contrastes suffisants

### Performance

1. **Limiter les draw calls** : Instancing pour objets répétitifs
2. **Frustum culling** : Automatique avec Three.js
3. **Texture compression** : Utiliser des textures optimisées
4. **Simplifier les géométries** : LOD pour objets distants
5. **Désactiver les ombres** sur petits détails

---

## 📊 Exemples Complets

### Scène 3D Complète

```typescript
import { Canvas } from '@react-three/fiber';
import StandardScene from '@/components/3d/StandardScene';
import { makeRotatable } from '@/components/3d/Rotatable3DObject';
import PTSubstationTransformer from '@/components/3d/PTSubstationTransformer';

const RotatableTransformer = makeRotatable(PTSubstationTransformer);

export default function MyScene() {
  return (
    <Canvas shadows camera={{ position: [50, 30, 50], fov: 60 }}>
      <StandardScene>
        <RotatableTransformer
          position={[0, 0, 0]}
          transformerId="t1"
          enableRotation={true}
          onRotationChange={(rot) => console.log(rot)}
        />
      </StandardScene>
    </Canvas>
  );
}
```

### Page avec Toolbar Hearst

```typescript
import HearstToolbar from '@/components/ui/HearstToolbar';
import HearstButton from '@/components/ui/HearstButton';

export default function MyPage() {
  return (
    <div className="h-screen flex flex-col">
      <HearstToolbar title="Mon Éditeur 3D">
        <HearstButton variant="primary" onClick={handleSave}>
          Sauvegarder
        </HearstButton>
        <HearstButton variant="secondary" onClick={handleExport}>
          Exporter
        </HearstButton>
      </HearstToolbar>
      
      <div className="flex-1">
        {/* Contenu */}
      </div>
    </div>
  );
}
```

---

## 🔗 Ressources

- **Configuration** : `config/rendering.config.ts`, `config/colors.config.ts`
- **Composants 3D** : `components/3d/`
- **Composants UI** : `components/ui/`
- **Styles** : `styles/hearst-theme.css`
- **Documentation** : `README_FINAL.md`, `TOUTES_LES_PAGES_LOCALES.md`

---

**Version** : 1.0.0  
**Date** : 14 décembre 2025  
**Projet** : Hearst Qatar 100MW  
**Status** : ✅ Production Ready
