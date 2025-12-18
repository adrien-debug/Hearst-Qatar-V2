# Système Modulaire 3D - Port 3333

## 🚀 Vue d'ensemble

Système de création de projets modulaires (5-200MW) avec infrastructure VRD complète et modèles ultra-réalistes 4K.

## 📦 Architecture

### Configuration Modulaire
- **Module de base** : 25MW
- **Puissances disponibles** : 5, 25, 50, 75, 100, 125, 150, 175, 200 MW
- **Duplication automatique** : Les modules de 25MW se dupliquent selon la puissance

### Modèles Ultra-Réalistes 4K

#### Transformateurs (4 modèles)
- `pt-substation-ultra` - 10-50 MVA
- `pt-padmount-ultra` - 500-2500 kVA
- `dt-secondary-ultra` - 315-1000 kVA
- `dt-renewable-ultra` - 250-800 kVA

#### Conteneurs (2 modèles)
- `antspace-hd5` - 6 MW (ANTSPACE Bitmain HD5)
- `hd5-container-detailed` - 6 MW (Version détaillée)

#### Refroidissement (1 modèle)
- `hydro-cooling-system` - 2-5 MW thermique

## 🏗️ Infrastructure VRD Standard

Tous les projets incluent :
- ✅ Mur d'enceinte en béton gris foncé (4m hauteur)
- ✅ Portail coulissant principal (8m)
- ✅ Poste de garde avec 2 gardiens (4m × 3m × 3m)
- ✅ Barrières de sécurité automatiques (×2)
- ✅ Logo Hearst 3D illuminé
- ✅ Routes asphaltées avec marquages (7m)
- ✅ Routes internes en béton (6m)
- ✅ Hangar de maintenance (30m × 20m × 8m)
- ✅ Parking 40 places
- ✅ Signalétique complète

## 🎯 Démarrage

### Lancer le serveur Port 3333

```bash
npm run dev:3333
```

Le serveur démarre sur `http://localhost:3333`

### Flux Utilisateur

1. **Page d'accueil** (`/`)
   - Wizard de création de projet
   - Sélection de la puissance (5-200MW)
   - Aperçu de la configuration

2. **Environnement 3D** (`/environment`)
   - Scène 3D complète
   - Équipements ultra-réalistes placés automatiquement
   - Infrastructure VRD
   - Contrôles caméra

## 📁 Structure des Fichiers

### Configuration
```
config/
├── project-templates.json       # Templates de configuration
├── ultra-realistic-models.ts    # Catalogue modèles 4K
└── 3d.config.ts                # Configuration scène 3D
```

### Générateur
```
lib/
└── projectGenerator.ts          # Génération automatique
```

### Composants 3D
```
components/3d/
├── VRDInfrastructure.tsx       # Infrastructure VRD
├── ModularLayout.tsx           # Layout modulaire
└── UnifiedModelCatalog.tsx     # Catalogue unifié
```

### Wizard
```
components/wizard/
└── ProjectWizard.tsx           # Wizard de création
```

### Context
```
contexts/
└── ProjectContext.tsx          # État global projet
```

### Pages
```
pages/
├── index.tsx                   # Wizard (page d'accueil)
└── environment.tsx             # Environnement 3D
```

## 🔧 Configuration JSON

### Exemple 100MW
```json
{
  "powerMW": 100,
  "moduleCount": 4,
  "equipment": {
    "transformers": 24,
    "containers": 48,
    "cooling": 12
  },
  "groundSize": 1000
}
```

### Calcul Automatique

Pour **100MW** (4 modules de 25MW) :
- **4 Power Blocks** : PB1, PB2, PB3, PB4
- **24 Transformers** : 6 par Power Block
- **48 Containers HD5** : 2 par transformer (A et B)
- **48 Switchgears** : 2 par transformer (L et R)
- **12 Systèmes de cooling** : 3 par Power Block

## 📐 Positions Automatiques

### Algorithme de Placement

```typescript
// Power Blocks espacés de 50m
const powerBlockSpacing = 50;
const blockX = -75 + (blockIndex * powerBlockSpacing);

// Transformers espacés de 20m
const transformerSpacing = 20;
const transformerZ = -55 - (t * transformerSpacing);

// Containers offset de 12m
const containerOffset = 12;
position_A = [blockX - containerOffset, 0.3, transformerZ];
position_B = [blockX + containerOffset, 0.3, transformerZ];
```

## 🎨 Standards Visuels

- **Modèles** : Uniquement `quality: 'ultra-realistic'`
- **Mur** : Gris foncé `#2d3436`
- **Routes** : Asphaltées avec marquages blancs
- **Logo Hearst** : 3D à l'entrée, échelle 2x
- **Éclairage** : Cinématique avec ombres
- **Caméra** : Position optimale selon taille du site

## 🔄 API du Context

### useProject()

```typescript
const {
  currentProject,        // Projet actif
  setCurrentProject,     // Définir projet
  equipment,             // Liste équipements
  addEquipment,          // Ajouter équipement
  removeEquipment,       // Supprimer équipement
  saveProject,           // Sauvegarder
  loadProject,           // Charger
} = useProject();
```

## 📊 Exemple d'Utilisation

### Créer un projet 100MW

```typescript
import { generateProjectConfig } from '../lib/projectGenerator';

const config = generateProjectConfig('Projet Qatar 100MW', 100);

// Résultat :
// - 4 modules de 25MW
// - 24 transformers PT-Substation Ultra
// - 48 containers ANTSPACE HD5
// - 12 systèmes Hydro Cooling
// - Infrastructure VRD complète
// - Positions calculées automatiquement
```

## 🎯 Configurations Disponibles

| Puissance | Modules | Transformers | Containers | Cooling | Terrain |
|-----------|---------|--------------|------------|---------|---------|
| 5 MW      | 0.2     | 2            | 4          | 1       | 400m²   |
| 25 MW     | 1       | 6            | 12         | 3       | 600m²   |
| 50 MW     | 2       | 12           | 24         | 6       | 800m²   |
| 75 MW     | 3       | 18           | 36         | 9       | 900m²   |
| 100 MW    | 4       | 24           | 48         | 12      | 1000m²  |
| 125 MW    | 5       | 30           | 60         | 15      | 1100m²  |
| 150 MW    | 6       | 36           | 72         | 18      | 1200m²  |
| 175 MW    | 7       | 42           | 84         | 21      | 1300m²  |
| 200 MW    | 8       | 48           | 96         | 24      | 1400m²  |

## 🚀 Prochaines Étapes

1. Tester le serveur : `npm run dev:3333`
2. Créer un projet 100MW
3. Explorer l'environnement 3D
4. Sauvegarder le projet
5. Exporter en JSON

## 📝 Notes Techniques

- **Port** : 3333 (autonome)
- **Build dir** : `.next-3333`
- **Storage** : localStorage
- **Modèles** : Photo-based 4K uniquement
- **Performance** : Instancing optimisé

## 🎬 Qualité Cinématique

Tous les modèles sont :
- ✅ Basés sur photos réelles
- ✅ Qualité ultra-réaliste
- ✅ Résolution 4K
- ✅ Textures PBR
- ✅ Ombres et reflets

---

**Système créé pour Hearst Qatar - 100% Modulaire - Infrastructure VRD Complète**






