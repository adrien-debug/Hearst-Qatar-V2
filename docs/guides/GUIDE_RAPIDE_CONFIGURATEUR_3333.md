# ⚡ GUIDE RAPIDE - Configurateur sur Port 3333

**URL**: http://localhost:3333/  
**Statut**: ✅ Configurateur accessible directement

---

## 🚀 DÉMARRAGE EN 3 ÉTAPES

### 1️⃣ Démarrer le serveur

```bash
npm run dev:gallery
```

### 2️⃣ Ouvrir la galerie

```
http://localhost:3333/
```

### 3️⃣ Accéder au configurateur

**Option A - Accès Direct** (recommandé):
- Cliquer sur le bouton **"Configurateur 3D"** (vert)

**Option B - Accès Guidé**:
- Cliquer sur le bouton **"Wizard Projet"** (gris)
- Suivre les 3 étapes

---

## 🎨 INTERFACE DE LA GALERIE

```
┌─────────────────────────────────────────────────────────┐
│  Galerie de Modèles 3D                                  │
│  Explorez notre collection de modèles 3D               │
│                                                         │
│  [🎨 Configurateur 3D]  [+ Wizard Projet]              │
│   (Clic pour accès      (Clic pour mode                │
│    direct)               guidé)                         │
│                                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│  │ 3D  │ │ 3D  │ │ 3D  │ │ 3D  │                      │
│  │Model│ │Model│ │Model│ │Model│                      │
│  └─────┘ └─────┘ └─────┘ └─────┘                      │
│                                                         │
│  (11 modèles 3D au total)                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 DEUX MODES D'ACCÈS

### Mode 1: Accès Direct (Rapide)

```
Galerie → [Configurateur 3D] → Configurateur
         (1 clic)
```

**Avantages**:
- ✅ Accès immédiat
- ✅ Pas d'étapes intermédiaires
- ✅ Pour utilisateurs expérimentés

### Mode 2: Accès Guidé (Assisté)

```
Galerie → [Wizard Projet] → Étape 1 → Étape 2 → Étape 3 → Configurateur
         (1 clic)          (Puissance) (Énergie) (Terrain) (Pré-configuré)
```

**Avantages**:
- ✅ Configuration guidée
- ✅ Aide à la décision
- ✅ Pour nouveaux utilisateurs

---

## 🎨 UTILISATION DU CONFIGURATEUR

### Interface

```
┌─────────────────────────────────────────────────────────┐
│  Info Panel                          [📦 Galerie]       │
│  • Objets: 0                                            │
│  • Modèle: Aucun                                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │         SCÈNE 3D INTERACTIVE                      │ │
│  │                                                   │ │
│  │  (Cliquez pour placer des modèles)               │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Contrôles]        [+ Ajouter] [✏️ Éditer] [🗑️ Suppr]│
│  • Clic gauche      (Toolbar de placement)             │
│  • Clic droit                                          │
│  • Molette                                             │
└─────────────────────────────────────────────────────────┘
```

### Actions Principales

1. **Ajouter un modèle**:
   - Cliquer sur "+ Ajouter"
   - Sélectionner un modèle dans le panneau
   - Cliquer dans la scène pour placer

2. **Déplacer un modèle**:
   - Sélectionner le modèle
   - Cliquer sur "✏️ Éditer"
   - Déplacer avec la souris

3. **Supprimer un modèle**:
   - Sélectionner le modèle
   - Cliquer sur "🗑️ Supprimer"

4. **Retour à la galerie**:
   - Cliquer sur "📦 Galerie" en haut à droite

---

## 🎯 NAVIGATION

### Depuis la Galerie

```
http://localhost:3333/
    ↓
[Configurateur 3D] → http://localhost:3333/configurator
    ↓
[Galerie] → http://localhost:3333/
```

**Tout reste sur le port 3333** ✅

---

## 📋 CHECKLIST RAPIDE

### Avant de commencer
- [ ] Serveur démarré (`npm run dev:gallery`)
- [ ] Navigateur ouvert sur `http://localhost:3333/`
- [ ] Page de galerie chargée

### Test d'accès direct
- [ ] Bouton "Configurateur 3D" visible
- [ ] Clic sur le bouton
- [ ] Configurateur s'ouvre
- [ ] Scène 3D visible
- [ ] Toolbar visible

### Test de navigation
- [ ] Clic sur "Galerie" dans le configurateur
- [ ] Retour à la galerie
- [ ] URL reste sur port 3333

---

## 🎉 RÉSUMÉ

### ✅ Ce qui fonctionne

1. **Accès direct au configurateur** depuis la galerie
2. **Navigation autonome** sur le port 3333
3. **Deux modes d'accès** (direct et guidé)
4. **Interface intuitive** et claire

### 🚀 Commandes Essentielles

```bash
# Démarrer
npm run dev:gallery

# Accéder
http://localhost:3333/

# Configurateur direct
http://localhost:3333/configurator
```

---

**Guide créé le**: 15 Décembre 2025  
**Statut**: ✅ Opérationnel

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ⚡ CONFIGURATEUR ACCESSIBLE EN 1 CLIC ⚡               ║
║                                                           ║
║   1. npm run dev:gallery                                  ║
║   2. http://localhost:3333/                               ║
║   3. Clic sur "Configurateur 3D"                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```






