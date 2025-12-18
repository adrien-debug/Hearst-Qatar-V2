# 🌐 Services Locaux - Liste Complète

Documentation complète de tous les services hébergés localement et leurs ports.

---

## 📋 Vue d'ensemble

L'application Hearst Qatar est composée de **2 services principaux** qui doivent être démarrés pour un fonctionnement complet :

1. **Application Next.js** (Port 1111) - Application principale React/Next.js
2. **Serveur HTML Statique** (Port 3000) - Serveur pour les fichiers HTML statiques

---

## 🚀 Service 1 : Application Next.js

### Port : **1111**

### Commande de démarrage :
```bash
npm run dev
```

### URL d'accès :
- **Application principale** : http://localhost:1111

### Description :
Application Next.js complète avec toutes les fonctionnalités de la plateforme de gestion énergétique.

### Routes disponibles :

#### 📊 Tableaux de bord
- **`/`** - Vue d'ensemble (Overview) avec KPIs
- **`/dashboard`** - Tableau de bord détaillé avec graphiques
- **`/hardware`** - Visualisation du matériel
- **`/electrical`** - Schéma électrique

#### 🎮 Visualisation 3D
- **`/substation-3d`** - Visualisation 3D interactive complète
- **`/substation-3d-auto`** - Version automatique de la visualisation 3D
- **`/substation-3d-spline`** - Visualisation 3D avec Spline
- **`/substation-3d-ultra-quality`** - Visualisation 3D qualité maximale
- **`/substation-3d-test-simple`** - Test simple 3D
- **`/substation-3d-deployment`** - Déploiement 3D

#### ✏️ Éditeurs 3D
- **`/substation-3d-editor`** - Éditeur 3D (Murs/Portails)
- **`/substation-3d-editor-flat`** - Éditeur Vue Plan (2D/3D)
- **`/substation-3d-complete-editor`** - Éditeur Complet (Tous objets) ⭐

#### 🔧 Autres pages
- **`/cooling-module`** - Module de refroidissement
- **`/containers/[id]`** - Détails d'un container spécifique
- **`/new-project`** - Nouveau projet
- **`/substation-container-test`** - Test de container de sous-station

### Technologies utilisées :
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Three Fiber
- Three.js
- Recharts

### Configuration :
- **Host** : localhost
- **Port** : 1111
- **Mode** : Développement (hot reload activé)

---

## 🌐 Service 2 : Serveur HTML Statique

### Port : **3000**

### Commande de démarrage :
```bash
npm run serve-plan
```

### URL d'accès :
- **Serveur principal** : http://localhost:3000
- **Plan interactif** : http://localhost:3000/plan-parking-advanced.html

### Description :
Serveur HTTP simple pour servir les fichiers HTML statiques du projet. Permet l'accès rapide aux démos et fichiers HTML standalone.

### Fichiers HTML disponibles :

#### 📐 Plans et visualisations
- **`/plan-parking-advanced.html`** - Plan de parking avancé (interactif)
- **`/plan-parking-interactif.html`** - Plan de parking interactif
- **`/plan-parking-visual.html`** - Plan de parking visuel

#### 🎨 Démonstrations
- **`/demo-subtile.html`** - Démo subtile
- **`/demo-ultra-realiste.html`** - Démo ultra-réaliste
- **`/demo-visuelle.html`** - Démo visuelle

#### 🎯 Sélections et interfaces
- **`/substation-selection.html`** - Sélection de sous-station
- **`/powerblock-selection.html`** - Sélection de power block
- **`/icon-selection.html`** - Sélection d'icônes
- **`/icon-selection-preview.html`** - Aperçu de sélection d'icônes

#### 📊 Présentations et guides
- **`/PRESENTATION_COMPLETE.html`** - Présentation complète
- **`/guide-visuel-styles.html`** - Guide visuel des styles
- **`/design-tokens-preview.html`** - Aperçu des design tokens

### Technologies utilisées :
- Node.js HTTP Server
- Fichiers HTML statiques
- CSS/JavaScript inline ou externe

### Configuration :
- **Port** : 3000
- **Répertoire** : Racine du projet
- **Hot reload** : Manuel (recharger la page F5)

---

## 📝 Instructions de démarrage

### Démarrage complet (2 services)

#### Terminal 1 - Application Next.js
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar"
npm run dev
```
✅ Service démarré sur **http://localhost:1111**

#### Terminal 2 - Serveur HTML Statique
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar"
npm run serve-plan
```
✅ Service démarré sur **http://localhost:3000**

### Vérification des services

#### Vérifier que les ports sont libres
```bash
# Vérifier le port 1111
lsof -i :1111

# Vérifier le port 3000
lsof -i :3000
```

#### Tester les services
```bash
# Tester l'application Next.js
curl http://localhost:1111

# Tester le serveur HTML
curl http://localhost:3000
```

---

## 📊 Résumé des Ports

| Service | Port | URL | Commande |
|---------|------|-----|----------|
| **Application Next.js** | 1111 | http://localhost:1111 | `npm run dev` |
| **Serveur HTML Statique** | 3000 | http://localhost:3000 | `npm run serve-plan` |

---

## 🔧 Scripts NPM Disponibles

Tous les scripts disponibles dans `package.json` :

```json
{
  "dev": "next dev -p 1111 -H localhost",      // Application Next.js
  "build": "next build",                        // Build production
  "start": "next start",                        // Démarrage production
  "lint": "next lint",                          // Vérification code
  "serve-plan": "node scripts/serve-plan.js"   // Serveur HTML statique
}
```

---

## 🎯 Accès Rapide

### Application principale
- **Homepage** : http://localhost:1111
- **Dashboard** : http://localhost:1111/dashboard
- **3D View** : http://localhost:1111/substation-3d
- **Éditeur 3D** : http://localhost:1111/substation-3d-complete-editor

### Fichiers HTML statiques
- **Plan interactif** : http://localhost:3000/plan-parking-advanced.html
- **Démo visuelle** : http://localhost:3000/demo-visuelle.html
- **Présentation** : http://localhost:3000/PRESENTATION_COMPLETE.html

---

## ⚠️ Notes importantes

1. **Les deux services sont indépendants** - Vous pouvez démarrer l'un sans l'autre
2. **Le serveur HTML (port 3000)** est optionnel - Principalement pour les fichiers HTML standalone
3. **L'application Next.js (port 1111)** est le service principal - Contient toute l'application
4. **Hot reload** : 
   - Next.js : Automatique (port 1111)
   - Serveur HTML : Manuel (F5 dans le navigateur)

---

## 🐛 Dépannage

### Port déjà utilisé

Si un port est déjà utilisé, vous verrez une erreur. Solutions :

#### Pour le port 1111 (Next.js)
```bash
# Trouver le processus utilisant le port
lsof -i :1111

# Tuer le processus (remplacer PID par le numéro du processus)
kill -9 PID

# Ou modifier le port dans package.json
# "dev": "next dev -p 1112 -H localhost"
```

#### Pour le port 3000 (Serveur HTML)
```bash
# Trouver le processus utilisant le port
lsof -i :3000

# Tuer le processus
kill -9 PID

# Ou modifier PORT dans scripts/serve-plan.js
# const PORT = 3001;
```

### Services ne démarrent pas

1. Vérifier que Node.js est installé : `node --version`
2. Installer les dépendances : `npm install`
3. Vérifier les permissions du répertoire
4. Consulter les logs d'erreur dans le terminal

---

## 📚 Documentation complémentaire

- **README.md** - Documentation principale du projet
- **SERVEUR_LOCAL_README.md** - Documentation du serveur HTML
- **QUICK_START.md** - Guide de démarrage rapide
- **GUIDE_3D.md** - Guide d'intégration 3D

---

**Dernière mise à jour** : Généré automatiquement
**Projet** : Hearst Qatar - Plateforme de Gestion Énergétique









