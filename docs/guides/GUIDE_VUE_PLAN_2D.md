# 📐 Guide Vue Plan 2D - Éditeur d'Implantation

## ✅ Nouvelle Fonctionnalité : Vue Plan 2D

Une vue plan (vue de dessus) interactive pour créer et visualiser votre implantation en 2D, avec possibilité de basculer vers la vue 3D.

## 🚀 Accès

**URL**: `http://localhost:1111/substation-3d-editor-flat`

## 🎯 Fonctionnalités

### Vue Plan 2D (Par Défaut)

- **Représentation en plan** : Vue de dessus de votre implantation
- **Grille de référence** : Pour un placement précis
- **Axes colorés** : 
  - Rouge = Axe X
  - Cyan = Axe Z
- **Zoom et Pan** : Navigation fluide

### Vue 3D

- Basculez vers la vue 3D pour voir le résultat en perspective
- Tous les objets placés en 2D apparaissent en 3D

## 🎮 Utilisation

### 1. Vue Plan 2D

#### Placer un Mur
1. Cliquez sur **"🧱 Mur"** dans le panneau d'édition
2. Cliquez dans la vue plan à l'endroit souhaité
3. Le mur apparaît immédiatement (rectangle gris)

#### Placer un Portail
1. Cliquez sur **"🚪 Portail"** dans le panneau
2. Cliquez dans la vue plan
3. Le portail apparaît (cadre brun avec ouverture)

#### Navigation
- **Clic simple** : Placer un objet (si mode actif)
- **Double-clic** : Supprimer un objet
- **Ctrl + Clic + Glisser** : Déplacer la vue (pan)
- **Molette** : Zoom in/out

### 2. Vue 3D

- Basculez avec le bouton **"🎮 Vue 3D"** en haut
- Voir le résultat en perspective
- Navigation standard 3D (rotation, pan, zoom)

### 3. Gestion des Objets

- **Sélection** : Cliquez sur un objet pour le sélectionner (devient rouge)
- **Suppression** : Double-clic sur un objet OU bouton ✕ dans la liste
- **Liste** : Tous les objets sont listés dans le panneau avec leurs positions

## 🎨 Représentation Visuelle

### Murs (Vue Plan)
- **Rectangle gris** : Vue de dessus
- **Flèche** : Indique la direction/rotation
- **Rouge au survol** : Objet sélectionné/hover

### Portails (Vue Plan)
- **Cadre brun** : Piliers et linteaux
- **Ouverture centrale** : Zone de passage
- **Plus foncé au survol** : Objet sélectionné

### Grille
- **Lignes grises** : Référence pour le placement
- **Axes colorés** : Origine (0,0) au centre

## 💡 Avantages de la Vue Plan

✅ **Vue d'ensemble** : Voir toute l'implantation d'un coup d'œil  
✅ **Précision** : Placement exact avec la grille  
✅ **Planification** : Créer autour d'éléments existants  
✅ **Rapide** : Placement plus rapide qu'en 3D  
✅ **Compréhension** : Meilleure compréhension spatiale  

## 🔄 Synchronisation 2D/3D

- Les objets placés en **2D** apparaissent automatiquement en **3D**
- Les objets placés en **3D** apparaissent automatiquement en **2D**
- **Sauvegarde unique** : Une seule sauvegarde pour les deux vues

## 📊 Exemple d'Utilisation

1. **Ouvrir la vue plan** (par défaut)
2. **Placer des murs** pour délimiter des zones
3. **Ajouter des portails** pour les accès
4. **Basculer en 3D** pour vérifier le résultat
5. **Retourner en 2D** pour ajuster si nécessaire

## 🎯 Cas d'Usage

- **Planification de site** : Visualiser l'organisation spatiale
- **Aménagement** : Créer des zones délimitées
- **Sécurité** : Placer des murs de protection
- **Accès** : Positionner des portails stratégiques
- **Documentation** : Générer un plan d'implantation

## 🐛 Dépannage

### La vue plan ne s'affiche pas
- Vérifiez que vous êtes bien sur la page `substation-3d-editor-flat`
- Rafraîchissez la page (F5)

### Les objets ne s'affichent pas
- Vérifiez que le mode édition est actif (bouton bleu)
- Cliquez directement dans la zone de la vue plan

### Zoom/Pan ne fonctionne pas
- Utilisez Ctrl+Clic pour le pan
- Molette pour le zoom
- Vérifiez que le curseur est sur la zone de dessin

## 📝 Notes Techniques

- **Échelle** : 1 unité = 1 mètre
- **Origine** : Centre de la vue (0, 0)
- **Coordonnées** : X (rouge) horizontal, Z (cyan) vertical
- **Sauvegarde** : Automatique dans localStorage











