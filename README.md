# 🏗️ Hearst Qatar - Mining Farm Project

> Projet de configuration et visualisation 3D pour une ferme de minage de 100MW au Qatar

## 📁 Structure du Projet

```
Hearst Qatar/
├── 📚 docs/                    # Documentation complète
│   ├── guides/                 # Guides utilisateur et techniques
│   ├── architecture/           # Architecture et design system
│   ├── implementation/         # Détails d'implémentation
│   ├── audits/                 # Audits et vérifications
│   └── changelog/              # Historique des changements
│
├── 🎨 demos/                   # Fichiers HTML de démonstration
│   ├── 3d-viewers/             # Visualiseurs 3D interactifs
│   ├── plans/                  # Plans et layouts
│   └── tests/                  # Pages de test
│
├── 🎯 assets/                  # Assets 3D et scripts
│   ├── blender/                # Fichiers Blender (.blend)
│   ├── models/                 # Modèles 3D exportés
│   └── scripts/                # Scripts Python pour Blender
│
├── ⚙️ config/                  # Configuration
│   ├── next.config.js          # Config Next.js
│   ├── tailwind.config.js      # Config Tailwind
│   ├── postcss.config.js       # Config PostCSS
│   ├── vercel.json             # Config Vercel
│   ├── requirements.txt        # Dépendances Python
│   ├── server-3333.js          # Serveur dev port 3333
│   └── server-gallery.js       # Serveur galerie
│
├── 📦 components/              # Composants React
├── 🎣 hooks/                   # Hooks React personnalisés
├── 🌐 contexts/                # Contextes React
├── 📄 pages/                   # Pages Next.js (app principal)
├── 🖼️ pages-gallery/           # Pages galerie (port séparé)
├── 🎨 styles/                  # Styles globaux
├── 🔧 lib/                     # Librairies utilitaires
├── 📊 data/                    # Données statiques
├── 🔤 types/                   # Types TypeScript
├── 🛠️ utils/                   # Utilitaires
└── 🌍 public/                  # Assets publics

```

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
# → http://localhost:3000

# Démarrer le serveur configurateur (port 3333)
node config/server-3333.js
# → http://localhost:3333

# Démarrer la galerie
node config/server-gallery.js
# → http://localhost:3001
```

### Scripts Disponibles

```bash
npm run dev          # Serveur dev Next.js (port 3000)
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # Linter ESLint
```

## 📚 Documentation Principale

### 🎯 Guides Essentiels

| Guide | Description |
|-------|-------------|
| [Quick Start](docs/guides/QUICK_START.md) | Démarrage ultra-rapide |
| [Guide Utilisateur](docs/guides/GUIDE_UTILISATEUR_FINAL.md) | Guide complet utilisateur |
| [Guide 3D](docs/guides/GUIDE_3D.md) | Visualisation 3D |
| [Guide Configurateur](docs/guides/GUIDE_RAPIDE_CONFIGURATEUR_3333.md) | Configurateur port 3333 |

### 🏗️ Architecture

| Document | Description |
|----------|-------------|
| [Design System](docs/architecture/DESIGN_SYSTEM.md) | Système de design Hearst |
| [Architecture Dashboard](docs/architecture/ARCHITECTURE_DASHBOARD_STRATEGIQUE.md) | Architecture du dashboard |
| [Charte Graphique](docs/architecture/CHARTE_GRAPHIQUE_HEARST.md) | Charte graphique Hearst |
| [Système Modulaire](docs/audits/AUDIT_SYSTEME_MODULAIRE_3333.md) | Système modulaire port 3333 |

### 🔧 Implémentation

| Document | Description |
|----------|-------------|
| [Supabase Setup](docs/implementation/SUPABASE_SETUP.md) | Configuration Supabase |
| [Auth & DB](docs/implementation/AUTH_ET_DB_IMPLEMENTATION_COMPLETE.md) | Authentification et base de données |
| [Optimisations](docs/implementation/OPTIMISATIONS_PERFORMANCE_APPLIQUEES.md) | Optimisations performance |
| [Module Refroidissement](docs/implementation/IMPLEMENTATION_MODULE_REFROIDISSEMENT.md) | Système de refroidissement |

### 📊 Audits & Tests

| Document | Description |
|----------|-------------|
| [Audit Port 3333](docs/audits/INDEX_AUDIT_PORT_3333.md) | Audit complet port 3333 |
| [Audit Doublons](docs/audits/AUDIT_DOUBLONS.md) | Audit des doublons |
| [Tests Intégration](docs/audits/TESTS_INTEGRATION_COMPLETS.md) | Tests d'intégration |

## 🎨 Démos Interactives

### Visualiseurs 3D

- **[Container Plan 3D Viewer](demos/3d-viewers/container-plan-3d-viewer.html)** - Viewer 3D premium pour conteneur Bitmain/Antspace avec interface interactive complète

### Plans & Layouts

- **[Circulation Optimisation](demos/circulation-optimisation-VOTRE-IMPLANTATION.html)** - Optimisation circulation
- **[Plan Parking](demos/plan-parking-interactif.html)** - Plan parking interactif

### Tests

- **[Test Microphone](demos/test-microphone.html)** - Test reconnaissance vocale
- **[Design Tokens](demos/design-tokens-preview.html)** - Aperçu des tokens
- **[Icon Selection](demos/icon-selection.html)** - Sélection d'icônes

## 🎯 Fonctionnalités Principales

### ✅ Configurateur 3D Interactif
- Configuration de ferme de minage jusqu'à 100MW
- Placement automatique et manuel des équipements
- Visualisation 3D temps réel avec Three.js
- Export des configurations

### ✅ Dashboard Stratégique
- Vue d'ensemble des métriques clés
- Gestion des projets et sites
- Analyse de performance
- Rapports et exports

### ✅ Système Modulaire
- Containers ANTSPACE HD5 (12.2m × 2.9m)
- Transformateurs PT-Substation Ultra
- Systèmes de refroidissement
- Infrastructure VRD complète

### ✅ Optimisations
- Réduction utilisation RAM
- Gestion WebGL context
- Responsive design complet
- Performance optimisée

## 🎨 Charte Graphique Hearst

### Couleurs Principales

```css
--hearst-green: #8AFD81      /* Vert Hearst principal */
--hearst-dark: #1a1a1a       /* Fond sombre */
--hearst-gray: #2a2a2a       /* Gris foncé */
--hearst-light: #f5f5f5      /* Gris clair */
```

### Typographie

- **Titres**: Inter, system-ui
- **Corps**: Arial, sans-serif
- **Code**: Fira Code, monospace

## 🔧 Technologies

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Three.js** - Visualisation 3D
- **React Three Fiber** - Three.js pour React

### Backend
- **Supabase** - Base de données et auth
- **PostgreSQL** - Base de données
- **Node.js** - Serveurs locaux

### 3D & Design
- **Blender 4.0+** - Modélisation 3D
- **Spline** - Design 3D interactif
- **Photogrammétrie** - Capture réaliste

## 📦 Équipements Configurables

### Mining Containers
- **ANTSPACE HD5** (12.196m × 2.896m × 2.896m)
  - 210 ASIC Bitmain S21 XP Hydro
  - Puissance: 1.26 MW
  - Refroidissement: Hydro + Air

### Transformateurs
- **PT-Substation Ultra** (2.5m × 2.5m × 3m)
  - Capacité: 2.5 MVA
  - Tension: 33kV/400V
  - Efficacité: 98.5%

### Infrastructure
- Dalles béton 40cm
- Allées de circulation 6m
- Périmètre sécurité
- Système VRD complet

## 🌍 Déploiement

### Vercel (Production)
```bash
npm run build
vercel deploy --prod
```

### Configuration Vercel
- Voir [vercel.json](config/vercel.json)
- Variables d'environnement dans Vercel Dashboard

## 📝 Changelog

Voir [docs/changelog/](docs/changelog/) pour l'historique complet des modifications.

## 🤝 Support

Pour toute question ou problème :
1. Consultez la [documentation](docs/)
2. Vérifiez les [audits](docs/audits/)
3. Consultez le [changelog](docs/changelog/)

## 📄 Licence

Projet propriétaire - Hearst Qatar © 2024

---

**Version**: 5.0.0  
**Dernière mise à jour**: Décembre 2024  
**Statut**: ✅ Production Ready
