# 📐 Règle d'Environnement 3D Unifié - Galerie

## 🎯 Règle Obligatoire

**TOUS les éléments 3D importés dans la galerie (`/gallery`) DOIVENT utiliser `Gallery3DEnvironment`.**

Cette règle garantit une cohérence visuelle parfaite entre tous les modèles 3D affichés dans la galerie.

## ✅ Implémentation

### Pour les prévisualisations (ModelCard)

```tsx
import Gallery3DEnvironment from './Gallery3DEnvironment';

<Canvas>
  <Suspense fallback={null}>
    <Gallery3DEnvironment>
      <Component {...model.defaultProps} />
    </Gallery3DEnvironment>
  </Suspense>
</Canvas>
```

### Pour les vues détaillées (ModelViewer3D)

```tsx
import Gallery3DEnvironment from '../gallery/Gallery3DEnvironment';

<Canvas>
  <Suspense fallback={null}>
    <Gallery3DEnvironment>
      <Component {...model.defaultProps} />
    </Gallery3DEnvironment>
  </Suspense>
</Canvas>
```

## 🚫 À NE PAS FAIRE

❌ **NE PAS** utiliser directement `SceneLighting` ou `Environment` dans les composants de la galerie
❌ **NE PAS** créer un environnement 3D personnalisé pour la galerie
❌ **NE PAS** utiliser des paramètres d'éclairage différents

## ✅ Ce que Gallery3DEnvironment fournit

- ✅ Éclairage unifié (`SceneLighting`)
- ✅ Environnement HDRI cohérent (`preset="sunset"`)
- ✅ Sol discret pour le contexte
- ✅ Grille subtile pour la profondeur

## 📋 Spécifications d'Environnement - Container Plan 3D Viewer

**RÈGLE STANDARD** : Tous les modèles de la galerie, y compris Container Plan 3D Viewer, utilisent ces spécifications exactes :

### Environnement
- **Composant** : `Gallery3DEnvironment` (obligatoire)
- **Sol** : `#2a2a2a` (couleur unifiée)
- **Éclairage** : `SceneLighting` (désertique)
- **HDRI** : `preset="sunset"`

### Détails techniques

```tsx
// Sol
<meshStandardMaterial 
  color="#2a2a2a" 
  roughness={0.8} 
  metalness={0.2}
/>

// Éclairage
<SceneLighting />
// - Lumière ambiante : intensity={0.4} color="#ffebcd"
// - Lumière hémisphérique : ["#fff5e6", "#d4a574", 0.6]
// - Lumière directionnelle principale : position={[50, 100, 30]} intensity={2.5} color="#fff8dc"
// - Lumière de remplissage : position={[-30, 40, -20]} intensity={0.8} color="#ffe4b5"

// HDRI
<Environment preset="sunset" />
```

### Application

Container Plan 3D Viewer utilise automatiquement cet environnement via :
- `ModelCard` → enveloppe le modèle dans `<Gallery3DEnvironment>`
- `ModelViewer3D` → enveloppe le modèle dans `<Gallery3DEnvironment>`

**Cette configuration est la référence standard pour tous les modèles de la galerie.**

## 📍 Fichiers concernés

- `components/gallery/ModelCard.tsx` ✅ Utilise Gallery3DEnvironment
- `components/models/ModelViewer3D.tsx` ✅ Utilise Gallery3DEnvironment
- `pages/gallery.tsx` - Page principale de la galerie
- `pages/models/[modelId].tsx` - Pages de détail des modèles

## 🔄 Vérification

Avant d'ajouter un nouveau composant 3D dans la galerie, vérifier :

1. Le composant utilise-t-il `Gallery3DEnvironment` ?
2. Aucun autre environnement 3D n'est-il défini ?
3. Les paramètres d'éclairage sont-ils cohérents ?

---

**Cette règle est obligatoire pour maintenir la cohérence visuelle de la galerie.**



