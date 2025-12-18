# 📖 GUIDE UTILISATEUR - SYSTÈME 3D HEARST QATAR

## 🎯 Bienvenue !

Ce guide vous explique comment utiliser le nouveau système 3D **complètement reconstruit from scratch**.

---

## 🚀 DÉMARRAGE

```bash
npm run dev
```

Ouvrez votre navigateur sur : **http://localhost:3000**

---

## 🗺️ NAVIGATION

### Page d'Accueil (`/`)

Vous verrez 4 cartes principales :

1. **⛏️ Mining & Reserve Dashboard** - Tableau de bord mining
2. **🏗️ Infrastructure Monitoring** - Monitoring infrastructure
3. **📦 Galerie de Modèles 3D** - Explorer les modèles ⭐
4. **🎮 Configurateur 3D** - Créer des projets ⭐

---

## 📦 GALERIE DE MODÈLES (`/gallery`)

### Vue d'Ensemble

La galerie affiche **10 modèles 3D** :
- **7 modèles ultra-réalistes** (basés sur photos réelles) avec badge ⭐
- **3 modèles standards** (procéduraux)

### Fonctionnalités

#### 1. Recherche
- Tapez dans la barre de recherche
- Recherche dans : nom, description, tags
- Résultats instantanés

#### 2. Filtres par Catégorie
- **🏭 Tous** - Tous les modèles (10)
- **⚡ Transformateurs** - Transformateurs électriques (4)
- **📦 Conteneurs** - Conteneurs mining (2)
- **❄️ Refroidissement** - Systèmes de cooling (1)
- **🔋 Énergie** - Générateurs (1)
- **🔧 Distribution** - Switchgears (1)
- **⚙️ Générateurs** - Générateurs (1)

#### 3. Filtre Qualité
- ☑️ **Seulement les modèles ultra-réalistes**
- Affiche uniquement les 7 modèles basés sur photos

#### 4. Preview 3D
- Chaque carte affiche un preview 3D en temps réel
- Rotation automatique
- Hover pour voir "Voir les détails →"

### Actions

#### Voir un Modèle en Détail
1. **Cliquez sur n'importe quelle carte**
2. → Vous êtes redirigé vers `/models/[modelId]`
3. → Vue immersive plein écran

#### Créer un Nouveau Projet
1. **Cliquez sur "🚀 Nouveau Projet"** (en haut à droite)
2. → Vous êtes redirigé vers `/configurator`
3. → Scène 3D vide prête pour configuration

---

## 🎨 PAGE MODÈLE (`/models/[modelId]`)

### Layout

```
┌─────────────────────────────────────────┐
│ [Nom du Modèle]    ← Galerie  🚀 Projet│
├─────────────────────────────────────────┤
│              │                           │
│   Viewer 3D  │  Sidebar Informations    │
│   (70%)      │  (30%)                   │
│              │                           │
│   Interactif │  - Description           │
│   Plein écran│  - Spécifications        │
│              │  - Dimensions            │
│              │  - Puissance             │
│              │  - Tags                  │
│              │  - Actions               │
└──────────────┴───────────────────────────┘
```

### Viewer 3D (Gauche - 70%)

**Contrôles :**
- **Clic gauche + glisser** - Rotation
- **Clic droit + glisser** - Pan (déplacement)
- **Molette** - Zoom vers curseur ⭐

**Options :**
- ☑️ Rotation automatique
- ☑️ Afficher la grille

### Sidebar (Droite - 30%)

**Informations affichées :**
- Nom du modèle + Badge ⭐ si ultra-réaliste
- Description complète
- Spécifications techniques (type, catégorie, qualité, source)
- Dimensions (longueur, largeur, hauteur)
- Puissance (si applicable)
- Tags

**Actions :**
- **🚀 Utiliser dans un projet** - Ouvre le configurateur avec ce modèle pré-sélectionné
- **← Retour à la galerie** - Retour à `/gallery`

---

## 🎮 CONFIGURATEUR 3D (`/configurator`)

### Vue d'Ensemble

Scène 3D interactive plein écran pour créer et configurer des projets.

### Interface

```
┌─────────────────────────────────────────┐
│ 📦 Scène 3D        📦 Galerie  ← Accueil│
│ 5 objets                                │
│                                         │
│ 📦 Modèle sélectionné                  │
│ ANTSPACE HD5                            │
│                                         │
│         [SCÈNE 3D INTERACTIVE]          │
│                                         │
│ Contrôles                               │
│ • Clic gauche - Rotation                │
│                                         │
│ 📦 Modèles | ↔️ Déplacer | 🔄 | 🗑️    │
└─────────────────────────────────────────┘
```

### Workflow

#### 1. Sélectionner un Modèle
- **Cliquez sur "📦 Modèles"**
- Panneau s'ouvre avec liste de tous les modèles
- Filtres par catégorie
- Recherche
- Filtre "⭐ Seulement ultra-réalistes"
- **Cliquez sur un modèle** pour le sélectionner

#### 2. Placer le Modèle
- Indicateur bleu apparaît : "📦 Modèle sélectionné"
- **Cliquez sur le sol** (sable) pour placer
- Le modèle ultra-réaliste apparaît à la position cliquée

#### 3. Manipuler les Objets

**Sélectionner un objet :**
- Cliquez sur un objet placé
- Contrôles apparaissent dans la toolbar

**Déplacer :**
1. Cliquez sur "↔️ Déplacer"
2. Déplacez l'objet (méthode dépend de l'implémentation)

**Rotation :**
1. Cliquez sur "🔄 Rotation"
2. Faites tourner l'objet

**Supprimer :**
1. Cliquez sur "🗑️ Supprimer"
2. L'objet est supprimé

**Tout Effacer :**
1. Cliquez sur "🗑️ Tout Effacer"
2. Confirmation
3. Tous les objets sont supprimés

#### 4. Ajouter d'Autres Modèles
- Cliquez sur "📦 Modèles"
- Sélectionnez un autre modèle
- Placez-le dans la scène
- Répétez autant de fois que nécessaire

---

## 🎯 CAS D'USAGE

### Cas 1 : Explorer les Modèles

```
1. Home → Clic "📦 Galerie de Modèles 3D"
2. Gallery → Parcourir les 10 modèles
3. Filtrer par "⚡ Transformateurs"
4. Clic sur "PT-Substation Ultra"
5. Page dédiée → Voir le modèle en 3D interactif
6. Lire toutes les spécifications
7. Bouton "← Retour" → Retour à la galerie
```

### Cas 2 : Créer un Projet Simple

```
1. Home → Clic "🎮 Configurateur 3D"
2. Configurator → Scène vide
3. Clic "📦 Modèles"
4. Sélectionner "ANTSPACE HD5"
5. Clic sur le sol → Placer le conteneur
6. Clic "📦 Modèles"
7. Sélectionner "PT-Substation Ultra"
8. Clic sur le sol → Placer le transformateur
9. Projet terminé !
```

### Cas 3 : Utiliser un Modèle Spécifique

```
1. Gallery → Parcourir les modèles
2. Clic sur "DT-Renewable Ultra"
3. Page dédiée → Voir le modèle
4. Clic "🚀 Utiliser dans un projet"
5. Configurator → Scène avec modèle pré-sélectionné
6. Clic sur le sol → Placer directement
```

---

## 💡 ASTUCES

### Navigation Rapide
- Utilisez les boutons "← Accueil" et "📦 Galerie" pour naviguer
- Les pages se chargent instantanément (Next.js)

### Recherche Efficace
- Tapez des mots-clés : "ultra", "bitmain", "cooling"
- Utilisez les filtres de catégorie
- Activez "Seulement ultra-réalistes" pour voir le meilleur

### Viewer 3D
- **Zoom vers curseur** - Positionnez le curseur sur un détail avant de zoomer
- **Rotation automatique** - Désactivez pour contrôler manuellement
- **Grille** - Désactivez pour une vue plus immersive

### Configurateur
- Placez plusieurs objets avant de les manipuler
- Utilisez "🗑️ Tout Effacer" pour recommencer
- Les objets peuvent être sélectionnés en cliquant dessus

---

## ❓ FAQ

### Q: Combien de modèles sont disponibles ?
**R:** 10 modèles au total (7 ultra-réalistes + 3 standards)

### Q: Qu'est-ce qu'un modèle "ultra-réaliste" ?
**R:** Un modèle créé à partir de photos réelles avec tous les détails (radiateurs, ventilateurs, logos, etc.)

### Q: Puis-je sauvegarder mes projets ?
**R:** Pas encore implémenté. Fonctionnalité prévue pour la prochaine version.

### Q: Comment zoomer sur un détail ?
**R:** Positionnez le curseur sur le détail, puis scrollez. Le zoom se fait vers le curseur !

### Q: Les modèles sont-ils à l'échelle réelle ?
**R:** Oui ! Toutes les dimensions sont en mètres réels.

---

## 🎉 PROFITEZ !

Vous avez maintenant accès à un système 3D :
- ✅ Moderne et intuitif
- ✅ Modèles ultra-réalistes
- ✅ Navigation fluide
- ✅ Performance optimale
- ✅ Zoom professionnel

**Amusez-vous bien ! 🏆**

---

**Version :** 3.0 - Système Reconstruit  
**Date :** 15 Décembre 2025  
**Status :** ✅ Production Ready







