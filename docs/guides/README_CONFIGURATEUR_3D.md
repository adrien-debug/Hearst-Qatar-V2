# 🏗️ Hearst 3D Configurator

Système modulaire 3D pour la conception d'infrastructures de mining Bitcoin institutionnelles - 5MW à 200MW

---

## 🚀 Démarrage Rapide

```bash
# Lancer le serveur de développement
npm run dev

# Le serveur démarre sur
# http://localhost:3333
```

---

## 📊 Pages Disponibles

### 🎨 Pages Principales

#### Wizard & Galerie
- **`/`** - Page d'accueil avec wizard de création
- **`/gallery`** - Galerie de modèles 3D (17 modèles)

#### Environnement 3D
- **`/environment`** - Environnement 3D principal
- **`/configurator`** - Configurateur de projet

#### Création & Édition
- **`/new-project`** - Nouveau projet
- **`/from-scratch`** - Création depuis zéro

### 🏗️ Vues 3D Spécialisées

- **`/substation-3d`** - Vue 3D principale
- **`/substation-3d-complete-editor`** - Éditeur complet
- **`/substation-3d-auto`** - Placement automatique
- **`/substation-3d-ultra-quality`** - Vue ultra-qualité
- **`/substation-3d-editor-flat`** - Éditeur vue plate
- **`/substation-3d-config`** - Configuration 3D
- **`/substation-3d-deployment`** - Déploiement 3D

### 📦 Catalogues & Galeries

- **`/gallery-complete`** - Galerie complète (17 modèles)
- **`/equipment-catalog`** - Catalogue équipements (6 modèles ultra-réalistes)

### 🔧 Éditeurs Spécialisés

- **`/containers-3d-editor`** - Éditeur de conteneurs
- **`/modular-campus`** - Campus modulaire
- **`/shaping`** - Mise en forme du terrain
- **`/cooling-module`** - Module de refroidissement
- **`/electrical`** - Schémas électriques
- **`/hardware`** - Inventaire matériel

### 📄 Pages Modèles

- **`/model-3d/[modelId]`** - Vue détaillée d'un modèle
- **`/models/[modelId]`** - Page modèle alternative
- **`/containers/[id]`** - Détails conteneur

---

## ⚠️ IMPORTANT - Dashboards Qatar

Les dashboards institutionnels pour le Qatar ont été déplacés vers un **projet séparé** :

### Hearst Qatar Dashboard (Port 1111)

**Emplacement :**
```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/
```

**Pages :**
- Executive Overview
- Mining Dashboard
- Infrastructure Monitoring

**Pour y accéder :**
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard"
npm run dev
# → http://localhost:1111
```

---

## 🎯 Configurations Disponibles

Le système supporte 9 configurations de puissance :

- **5 MW** - Petit site
- **25 MW** - Site moyen
- **50 MW** - Site standard
- **75 MW** - Grand site
- **100 MW** - Site institutionnel
- **125 MW** - Très grand site
- **150 MW** - Site majeur
- **175 MW** - Site massif
- **200 MW** - Configuration maximale

---

## 🎨 Modèles 3D Disponibles

### Transformateurs (10)
- PT-Substation Ultra (10-50 MVA)
- PT-Padmount Ultra (500-2500 kVA)
- DT-Secondary Ultra (315-1000 kVA)
- DT-Renewable Ultra (250-800 kVA)
- + 6 autres modèles

### Conteneurs (2)
- ANTSPACE HD5 (6 MW)
- Container standard

### Refroidissement (1)
- Hydro Cooling System (2-5 MW)

### Infrastructure (3)
- Routes, parkings, bâtiments

### Équipements (2)
- Divers équipements techniques

**Total : 17 modèles 3D ultra-réalistes 4K**

---

## 🛠️ Technologies

### Frontend
- **Next.js 14** - Framework React
- **React 18** - UI Library
- **TypeScript 5** - Type safety

### 3D
- **Three.js** - Moteur 3D
- **React Three Fiber** - React renderer pour Three.js
- **React Three Drei** - Helpers 3D
- **Spline** - Éditeur 3D intégré

### Styling
- **Tailwind CSS 3** - Utility-first CSS
- **PostCSS** - CSS processing

### Data
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de données

---

## 📁 Structure du Projet

```
Hearst Qatar/
├── pages/                      # Pages Next.js (36+)
├── components/
│   ├── 3d/                    # Composants 3D
│   ├── wizard/                # Wizard de création
│   ├── gallery/               # Galerie de modèles
│   ├── charts/                # Graphiques (si utilisés)
│   └── ...
├── lib/
│   ├── projectGenerator.ts    # Générateur de projets
│   ├── supabase/             # Client Supabase
│   └── ...
├── utils/
│   ├── 3dHelpers.ts          # Helpers 3D
│   ├── layoutGenerator.ts    # Génération de layouts
│   └── ...
├── public/
│   └── models/               # Modèles 3D (.glb, .dae)
├── config/
│   └── 3d.config.ts          # Configuration 3D
└── ...
```

---

## 🚀 Scripts Disponibles

```bash
# Développement (port 3333)
npm run dev

# Développement (port 1111) - backup
npm run dev:1111

# Serveur galerie dédié
npm run dev:gallery

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Supabase
npm run supabase:setup
npm run supabase:migrate
npm run supabase:test
npm run supabase:import-models
```

---

## 🎨 Fonctionnalités Principales

### Wizard de Création
- ✅ Sélection de puissance (5-200 MW)
- ✅ Configuration automatique
- ✅ Calcul des équipements
- ✅ Infrastructure VRD complète

### Environnement 3D
- ✅ Navigation libre (rotation, zoom, pan)
- ✅ Placement d'objets
- ✅ Éclairage réaliste
- ✅ Ombres et post-processing
- ✅ Sol sablonneux du Qatar
- ✅ Environnement HDRI

### Éditeur Complet
- ✅ Modes d'édition (Sélection, Déplacer, Rotation, Échelle)
- ✅ Placement d'objets (Murs, Portails, Caméras, Routes)
- ✅ Grille de référence
- ✅ Contrôles numériques
- ✅ Sauvegarde automatique

### Galerie de Modèles
- ✅ 17 modèles 3D disponibles
- ✅ Recherche intelligente
- ✅ Filtres par catégorie
- ✅ Prévisualisation 3D en temps réel
- ✅ Détails techniques

---

## 📱 Responsive Design

Le système est optimisé pour :
- ✅ Desktop (recommandé pour l'édition 3D)
- ✅ Tablet (visualisation)
- ⚠️ Mobile (visualisation limitée)

---

## 🎯 Workflow Typique

1. **Créer un projet**
   - Ouvrir `/` (wizard)
   - Sélectionner la puissance
   - Configurer les options

2. **Visualiser en 3D**
   - Redirection automatique vers `/environment`
   - Explorer la scène 3D

3. **Éditer si nécessaire**
   - Aller dans `/substation-3d-complete-editor`
   - Placer/déplacer les équipements
   - Ajuster le layout

4. **Exporter**
   - Sauvegarder le projet
   - Générer les rapports

---

## 🔧 Configuration

### Environnement 3D

Les paramètres 3D sont dans `config/3d.config.ts` :
- Qualité de rendu
- Ombres
- Anti-aliasing
- Post-processing

### Modèles 3D

Les modèles sont dans `public/models/` :
- Format : `.glb` ou `.dae`
- Optimisés pour le web
- Textures 4K

---

## 📊 Performance

### Optimisations
- ✅ Lazy loading des modèles 3D
- ✅ LOD (Level of Detail)
- ✅ Instancing pour objets répétés
- ✅ Texture caching
- ✅ GPU-accelerated rendering

### Prérequis
- WebGL 2.0
- Minimum 4 GB RAM
- GPU dédié recommandé

---

## 🆘 Support

### Documentation
- `README.md` - Ce fichier
- `TOUTES_LES_PAGES_LOCALES.md` - Liste complète des pages
- `GUIDE_3D.md` - Guide d'utilisation 3D
- `GUIDE_CREATION_SPLINE_ULTRA_RAPIDE.md` - Guide Spline

### Problèmes Courants

**Port déjà utilisé :**
```bash
npm run dev:1111  # Utiliser le port 1111 temporairement
```

**Erreurs WebGL :**
- Vérifier que WebGL 2.0 est supporté
- Mettre à jour les drivers GPU
- Essayer un autre navigateur

**Modèles 3D ne se chargent pas :**
- Vérifier que les fichiers existent dans `public/models/`
- Vérifier la console pour les erreurs
- Vérifier les chemins dans le code

---

## 🎉 Résumé

Ce projet contient le **configurateur 3D complet** avec :

✅ 36+ pages de configuration et visualisation  
✅ Wizard de création intelligent  
✅ Environnement 3D interactif  
✅ 17 modèles 3D ultra-réalistes  
✅ Éditeurs spécialisés  
✅ Infrastructure VRD complète  
✅ Export et sauvegarde  

**Port :** 3333  
**Focus :** Système modulaire 3D

---

**Hearst Corporation** • Mining Infrastructure Platform • Qatar 2024







