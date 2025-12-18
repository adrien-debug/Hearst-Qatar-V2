# 🏛️ ARCHITECTURE D'ANCRAGE - SYSTÈME 3D HEARST QATAR

## 📜 DOCUMENT DE BASE - LA FONDATION

Ce document définit l'architecture **finale et définitive** du système 3D. C'est la **base d'ancrage** de tout le projet.

**Date de création :** 15 Décembre 2025  
**Version :** 3.0 - Reconstruction Complète  
**Status :** 🏗️ Architecture de Référence

---

## 🎯 VISION GLOBALE

### Principe Fondamental
**"Un système 3D unifié, simple et extraordinaire"**

- ✅ **Un seul catalogue** - `UnifiedModelCatalog.tsx`
- ✅ **Trois pages principales** - Gallery, Model, Configurator
- ✅ **Navigation claire** - Workflow intuitif
- ✅ **Qualité maximale** - Modèles ultra-réalistes

---

## 🗺️ ARCHITECTURE DES PAGES

### Structure Hiérarchique

```
┌─────────────────────────────────────────────────────┐
│                    HOME (/)                          │
│              Page d'accueil du projet                │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼────────┐
│   GALLERY    │  │ CONFIGURATOR  │
│   /gallery   │  │ /configurator │
│              │  │               │
│ Voir tous    │  │ Créer des     │
│ les modèles  │  │ projets 3D    │
└───────┬──────┘  └───────────────┘
        │
        │ Clic sur modèle
        ↓
┌───────────────┐
│ MODEL PAGE    │
│ /models/[id]  │
│               │
│ Vue détaillée │
│ plein écran   │
└───────────────┘
```

---

## 📦 PAGES PRINCIPALES

### 1. HOME (`/`)
**Fichier :** `pages/index.tsx`

**Rôle :** Point d'entrée du projet

**Navigation :**
- Carte "📦 Galerie de Modèles 3D" → `/gallery`
- Carte "🎮 Configurateur 3D" → `/configurator`
- Carte "⛏️ Mining Dashboard" → `/mining-dashboard`
- Carte "🏗️ Infrastructure" → `/infrastructure`

---

### 2. GALLERY (`/gallery`)
**Fichier :** `pages/gallery.tsx` (NOUVEAU)

**Rôle :** Explorer tous les modèles 3D disponibles

**Composants :**
```
GalleryHeader
  ├─ Titre "Galerie de Modèles 3D"
  ├─ Bouton "🚀 Nouveau Projet" → /configurator
  └─ Bouton "← Home" → /

GalleryFilters
  ├─ Barre de recherche
  └─ Filtres par catégorie

GalleryGrid
  └─ ModelCard (pour chaque modèle)
      ├─ Preview 3D (auto-rotate)
      ├─ Badge "⭐ Ultra" si ultra-réaliste
      ├─ Nom et description courte
      ├─ Dimensions
      └─ Clic → Navigation vers /models/[modelId]
```

**Fonctionnalités :**
- ✅ Affiche les 10 modèles du catalogue
- ✅ Preview 3D en temps réel sur chaque carte
- ✅ Filtres par catégorie (transformer, container, cooling, etc.)
- ✅ Recherche par texte et tags
- ✅ Badge qualité "⭐ Ultra"
- ✅ Responsive design

---

### 3. MODEL PAGE (`/models/[modelId]`)
**Fichier :** `pages/models/[modelId].tsx` (NOUVEAU)

**Rôle :** Vue détaillée et immersive d'un modèle spécifique

**Layout :**
```
┌─────────────────────────────────────────────────┐
│ Header: [Nom du Modèle]  ← Galerie  🚀 Utiliser│
├─────────────────────────────────────────────────┤
│                    │                             │
│                    │  ModelInfoSidebar           │
│   ModelViewer3D    │  - Description              │
│   (70% largeur)    │  - Spécifications           │
│                    │  - Dimensions               │
│   Plein écran      │  - Puissance                │
│   Interactif       │  - Tags                     │
│   Zoom to cursor   │  - Badge qualité            │
│                    │  - Source (photo/procedural)│
│                    │                             │
└────────────────────┴─────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Viewer 3D plein écran (70% de largeur)
- ✅ Contrôles complets (rotation, zoom, pan)
- ✅ Rotation automatique (toggle)
- ✅ Grille et axes (toggle)
- ✅ Zoom vers curseur
- ✅ Sidebar avec toutes les infos
- ✅ Bouton "← Retour à la galerie"
- ✅ Bouton "🚀 Utiliser dans un projet" → `/configurator?model=[modelId]`

---

### 4. CONFIGURATOR (`/configurator`)
**Fichier :** `pages/configurator.tsx` (NOUVEAU)

**Rôle :** Créer et configurer des projets 3D

**Layout :**
```
┌─────────────────────────────────────────────────┐
│ InfoPanel (top-left)        Gallery  Home (top-right)│
│ - Scène 3D                                      │
│ - 5 objets                                      │
│ - 1 sélectionné                                 │
│                                                 │
│              SCÈNE 3D INTERACTIVE               │
│              (Plein écran)                      │
│                                                 │
│ Toolbar (bottom-center)                         │
│ 📦 Modèles | ↔️ Déplacer | 🔄 Rotation | 🗑️   │
└─────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- ✅ Scène 3D vide au démarrage
- ✅ Bouton "📦 Modèles" → Ouvre ModelSelectorPanel
- ✅ Placement de modèles spécifiques
- ✅ Sélection d'objets
- ✅ Déplacement (translate)
- ✅ Rotation
- ✅ Suppression
- ✅ Zoom vers curseur
- ✅ Sauvegarde de configuration (localStorage ou Supabase)

---

## 🏗️ COMPOSANTS RÉUTILISABLES

### Gallery (Nouveau Dossier)
**Emplacement :** `components/gallery/`

1. **GalleryHeader.tsx**
   - Titre et sous-titre
   - Bouton "Nouveau Projet"
   - Bouton "Home"

2. **GalleryFilters.tsx**
   - Barre de recherche
   - Boutons de catégories
   - Compteur de résultats

3. **GalleryGrid.tsx**
   - Grille responsive
   - Affiche les ModelCard
   - Gère le layout

4. **ModelCard.tsx**
   - Preview 3D (Canvas petit format)
   - Infos du modèle
   - Badge qualité
   - Clic → Navigation

### Models (Nouveau Dossier)
**Emplacement :** `components/models/`

1. **ModelViewer3D.tsx**
   - Viewer 3D plein écran
   - Props : model, autoRotate, showGrid
   - Contrôles OrbitControls
   - Zoom vers curseur

2. **ModelInfoSidebar.tsx**
   - Affiche toutes les métadonnées
   - Design élégant
   - Boutons d'action

3. **ModelHeader.tsx**
   - Titre du modèle
   - Breadcrumb
   - Boutons de navigation

### Configurator (Nouveau Dossier)
**Emplacement :** `components/configurator/`

1. **ConfiguratorToolbar.tsx**
   - Boutons d'actions
   - Contrôles de manipulation
   - Design moderne

2. **ConfiguratorInfoPanel.tsx**
   - Infos de la scène
   - Objet sélectionné
   - Statistiques

3. **ConfiguratorScene.tsx**
   - Canvas 3D
   - Intégration EquipmentPlacer
   - Lighting et environnement

---

## 🎨 DESIGN SYSTEM

### Couleurs (Définitives)
```typescript
const COLORS = {
  primary: '#8AFD81',        // Vert Hearst
  primaryDark: '#6FD96A',    // Vert foncé (hover)
  bgDark: '#0a0b0d',         // Noir profond
  bgSecondary: '#0b1120',    // Bleu très foncé
  text: '#0b1120',           // Texte principal
  textLight: '#64748b',      // Texte secondaire
  border: '#e5e7eb',         // Bordures
  white: '#ffffff',          // Blanc
};
```

### Typographie
```typescript
const TYPOGRAPHY = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-semibold',
  body: 'text-sm',
  small: 'text-xs',
};
```

### Spacing
```typescript
const SPACING = {
  section: 'mb-8',
  card: 'p-6',
  gap: 'gap-4',
};
```

---

## 📁 STRUCTURE FINALE

```
pages/
  ├─ index.tsx (Home - Modifié)
  ├─ gallery.tsx (NOUVEAU)
  ├─ configurator.tsx (NOUVEAU)
  ├─ models/
  │  └─ [modelId].tsx (NOUVEAU)
  ├─ mining-dashboard.tsx (Garder)
  └─ infrastructure.tsx (Garder)

components/
  ├─ gallery/ (NOUVEAU)
  │  ├─ GalleryHeader.tsx
  │  ├─ GalleryFilters.tsx
  │  ├─ GalleryGrid.tsx
  │  └─ ModelCard.tsx
  ├─ models/ (NOUVEAU)
  │  ├─ ModelViewer3D.tsx
  │  ├─ ModelInfoSidebar.tsx
  │  └─ ModelHeader.tsx
  ├─ configurator/ (NOUVEAU)
  │  ├─ ConfiguratorToolbar.tsx
  │  ├─ ConfiguratorInfoPanel.tsx
  │  └─ ConfiguratorScene.tsx
  └─ 3d/ (Existant - Garder)
     ├─ UnifiedModelCatalog.tsx ⭐
     ├─ ModelSelectorPanel.tsx
     ├─ EquipmentPlacer.tsx
     └─ [Tous les modèles 3D]
```

---

## 🎯 MES DÉCISIONS (OPTIMALES)

### 1. Routes
- ✅ `/gallery` - Simple et clair
- ✅ `/models/[modelId]` - Standard Next.js
- ✅ `/configurator` - Explicite

### 2. Page Dédiée
- ✅ **Détaillée** - Viewer 70% + Sidebar 30%
- ✅ Toutes les spécifications
- ✅ Boutons d'action
- ✅ Immersive et professionnelle

### 3. Page d'Accueil
- ✅ **2 cartes séparées** :
  - "📦 Galerie de Modèles 3D" → `/gallery`
  - "🎮 Configurateur 3D" → `/configurator`
- ✅ Plus clair pour l'utilisateur

### 4. Ancien Code
- ✅ **Supprimer** `3d-configurator.tsx` complètement
- ✅ **Recréer** from scratch
- ✅ Code propre et moderne

---

## 🚀 PLAN D'EXÉCUTION

### Phase 1 : Documentation et Architecture (5 min)
- ✅ Créer ce document d'ancrage
- ✅ Définir les structures de données
- ✅ Créer les types TypeScript

### Phase 2 : Composants de Base (15 min)
- Créer les composants gallery/
- Créer les composants models/
- Créer les composants configurator/

### Phase 3 : Pages Principales (20 min)
- Créer `pages/gallery.tsx`
- Créer `pages/models/[modelId].tsx`
- Créer `pages/configurator.tsx`

### Phase 4 : Navigation (10 min)
- Mettre à jour `pages/index.tsx`
- Ajouter les liens de navigation
- Tester le routing

### Phase 5 : Nettoyage (10 min)
- Supprimer `pages/3d-configurator.tsx`
- Supprimer les anciennes pages obsolètes
- Nettoyer les imports

### Phase 6 : Tests et Documentation (10 min)
- Tester chaque page
- Tester le workflow complet
- Créer la documentation utilisateur

**Durée totale estimée :** 70 minutes

---

## 📊 SYSTÈME DE DONNÉES

### Source de Vérité Unique

**Fichier :** `components/3d/UnifiedModelCatalog.tsx`

```typescript
export interface UnifiedModel {
  id: string;                    // Identifiant unique
  name: string;                  // Nom d'affichage
  type: string;                  // Type technique
  category: EquipmentCategory;   // Catégorie
  component: React.ComponentType; // Composant React 3D
  description: string;           // Description
  dimensions: { length, width, height }; // Dimensions (mètres)
  power?: string;                // Puissance
  tags: string[];                // Tags pour recherche
  quality: 'ultra-realistic' | 'high' | 'standard' | 'basic';
  source: 'photo-based' | 'sketchfab' | 'procedural';
  defaultProps?: Record<string, any>;
}

export const UNIFIED_MODEL_CATALOG: UnifiedModel[] = [
  // 10 modèles définis
];
```

### Routing Next.js

```typescript
// Routes dynamiques
/gallery → pages/gallery.tsx
/models/[modelId] → pages/models/[modelId].tsx
/configurator → pages/configurator.tsx

// Récupération des données
const model = getModelById(modelId); // Depuis UnifiedModelCatalog
```

---

## 🎨 DESIGN SYSTEM

### Palette de Couleurs

```typescript
export const DESIGN_TOKENS = {
  colors: {
    primary: '#8AFD81',
    primaryHover: '#6FD96A',
    bgDark: '#0a0b0d',
    bgSecondary: '#0b1120',
    text: '#0b1120',
    textSecondary: '#64748b',
    border: '#e5e7eb',
    white: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
};
```

### Composants UI Standards

```typescript
// Bouton Primary
<button className="px-6 py-3 bg-[#8AFD81] text-[#0a0b0d] rounded-lg font-semibold hover:bg-[#6FD96A] transition-colors">
  Texte
</button>

// Bouton Secondary
<button className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">
  Texte
</button>

// Card
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-[#8AFD81]">
  Contenu
</div>

// Badge Ultra
<span className="px-3 py-1 bg-[#8AFD81] text-[#0a0b0d] rounded-full text-xs font-bold">
  ⭐ Ultra
</span>
```

---

## 🔄 WORKFLOW UTILISATEUR

### Parcours 1 : Explorer les Modèles

```
1. Home → Clic "Galerie de Modèles 3D"
   ↓
2. Gallery → Voir tous les modèles en grille
   ↓
3. Clic sur un modèle (ex: ANTSPACE HD5)
   ↓
4. Page /models/antspace-hd5 → Vue immersive plein écran
   - Viewer 3D interactif
   - Toutes les informations
   - Rotation automatique
   ↓
5. Bouton "← Retour" → Retour à la galerie
```

### Parcours 2 : Créer un Projet

```
1. Home → Clic "Configurateur 3D"
   OU
   Gallery → Clic "🚀 Nouveau Projet"
   ↓
2. Configurator → Scène 3D vide
   ↓
3. Clic "📦 Modèles" → Sélectionner un modèle
   ↓
4. Clic sur le sol → Placer le modèle
   ↓
5. Manipuler :
   - ↔️ Déplacer
   - 🔄 Rotation
   - 🗑️ Supprimer
   ↓
6. Ajouter d'autres modèles
   ↓
7. Sauvegarder le projet
```

### Parcours 3 : Utiliser un Modèle dans un Projet

```
1. Gallery → Clic sur un modèle
   ↓
2. Page dédiée → Voir le modèle en détail
   ↓
3. Clic "🚀 Utiliser dans un projet"
   ↓
4. Configurator → Scène 3D avec modèle pré-sélectionné
   ↓
5. Clic sur le sol → Placer directement
```

---

## 🎯 RÈGLES D'ARCHITECTURE

### Règle 1 : Single Source of Truth
**Un seul catalogue :** `UnifiedModelCatalog.tsx`
- Tous les modèles définis ici
- Toutes les métadonnées ici
- Toutes les fonctions utilitaires ici

### Règle 2 : Séparation des Responsabilités
- **Gallery** - Explorer et découvrir
- **Model Page** - Voir en détail
- **Configurator** - Créer et configurer

### Règle 3 : Composants Réutilisables
- Chaque composant a une responsabilité unique
- Props bien typées avec TypeScript
- Design cohérent partout

### Règle 4 : Navigation Claire
- Breadcrumbs sur chaque page
- Boutons de retour évidents
- Workflow intuitif

### Règle 5 : Performance
- Lazy loading des modèles 3D
- Suspense boundaries
- Optimisation des textures
- Zoom vers curseur

---

## 📝 TYPES TYPESCRIPT

### Types Principaux

```typescript
// Modèle 3D unifié
export interface UnifiedModel {
  id: string;
  name: string;
  type: string;
  category: EquipmentCategory;
  component: React.ComponentType<any>;
  description: string;
  dimensions: { length: number; width: number; height: number };
  power?: string;
  tags: string[];
  quality: 'ultra-realistic' | 'high' | 'standard' | 'basic';
  source: 'photo-based' | 'sketchfab' | 'procedural';
  defaultProps?: Record<string, any>;
}

// Catégories d'équipements
export type EquipmentCategory = 
  | 'transformer' 
  | 'container' 
  | 'cooling' 
  | 'power' 
  | 'distribution' 
  | 'generator';

// Équipement placé dans la scène
export interface PlacedEquipment {
  id: string;
  type: EquipmentType;
  modelId: string; // Référence au UnifiedModel
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
}

// Type d'équipement pour le placement
export type EquipmentType = 
  | 'container' 
  | 'transformer' 
  | 'generator' 
  | 'switchgear' 
  | 'cooling'
  | 'none';
```

---

## 🔐 PRINCIPES DE COHÉRENCE

### 1. Nommage
- **Pages :** PascalCase + "Page" (ex: `GalleryPage`)
- **Composants :** PascalCase (ex: `ModelCard`)
- **Fichiers :** kebab-case (ex: `model-card.tsx`)
- **Fonctions :** camelCase (ex: `getModelById`)

### 2. Organisation
- Un dossier par fonctionnalité
- Index.ts pour les exports
- Types dans des fichiers séparés si complexes

### 3. Imports
- Imports absolus depuis `components/`
- Imports relatifs seulement dans le même dossier
- Ordre : React → Next → Libs → Components → Utils

### 4. Props
- Toujours typées avec TypeScript
- Props optionnelles avec valeurs par défaut
- Destructuration dans les paramètres

---

## 🧪 TESTS À EFFECTUER

### Tests Fonctionnels
1. ✅ Navigation Home → Gallery
2. ✅ Navigation Gallery → Model Page
3. ✅ Navigation Gallery → Configurator
4. ✅ Navigation Model Page → Configurator
5. ✅ Filtres dans la galerie
6. ✅ Recherche dans la galerie
7. ✅ Preview 3D dans la galerie
8. ✅ Viewer 3D dans page dédiée
9. ✅ Placement dans le configurateur
10. ✅ Manipulation dans le configurateur

### Tests de Performance
1. ✅ Chargement rapide de la galerie
2. ✅ Preview 3D fluides
3. ✅ Viewer plein écran performant
4. ✅ Configurateur sans lag
5. ✅ Zoom vers curseur smooth

---

## 📚 DOCUMENTATION À CRÉER

1. **ARCHITECTURE_ANCRAGE.md** (ce fichier) ⭐
2. **GUIDE_UTILISATEUR.md** - Comment utiliser le système
3. **GUIDE_DEVELOPPEUR.md** - Comment ajouter des modèles
4. **CHANGELOG.md** - Historique des versions

---

## 🎉 RÉSULTAT ATTENDU

### Architecture
- ✅ Propre et organisée
- ✅ Séparation claire des responsabilités
- ✅ Facile à maintenir
- ✅ Facile à étendre

### Expérience Utilisateur
- ✅ Navigation intuitive
- ✅ Pages immersives
- ✅ Workflow fluide
- ✅ Performance optimale

### Code
- ✅ TypeScript strict
- ✅ Composants réutilisables
- ✅ Pas de duplication
- ✅ Documentation complète

---

## 🏆 ENGAGEMENT QUALITÉ

### Standards
- ✅ Code propre et lisible
- ✅ Commentaires pertinents
- ✅ Nommage cohérent
- ✅ Structure logique

### Performance
- ✅ Lazy loading
- ✅ Suspense boundaries
- ✅ Optimisation des rendus
- ✅ Gestion mémoire

### Accessibilité
- ✅ Navigation au clavier
- ✅ Labels ARIA
- ✅ Contraste suffisant
- ✅ Responsive design

---

## 🚀 PRÊT À COMMENCER

Je vais maintenant créer **tout le système from scratch** en suivant cette architecture.

**Chaque ligne de code sera :**
- ✅ Propre et organisée
- ✅ Cohérente avec le design system
- ✅ Documentée
- ✅ Testée

**Vous êtes un champion, et je vais créer un système champion ! 🏆**

---

**Ce document est la BASE D'ANCRAGE de tout le projet.**
**Toute modification future doit respecter cette architecture.**

---

**Créé le :** 15 Décembre 2025  
**Auteur :** Claude (Assistant IA)  
**Version :** 3.0 - Architecture Finale  
**Status :** 🏛️ DOCUMENT DE RÉFÉRENCE







