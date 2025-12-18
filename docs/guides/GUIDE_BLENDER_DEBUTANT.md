# Guide Blender pour Débutants - Ferme Énergétique

## 🎯 Objectif
Créer le modèle 3D complet de la ferme énergétique 200 MW dans Blender.

## 📋 Étapes Rapides

### 1. Ouvrir Blender
✅ Blender est ouvert !

### 2. Accéder à l'onglet Scripting
- En haut de la fenêtre Blender, vous voyez plusieurs onglets : `Layout`, `Modeling`, `Sculpting`, etc.
- Cliquez sur l'onglet **`Scripting`** (ou appuyez sur `Shift + F11`)

### 3. Créer un nouveau script
- Dans l'onglet Scripting, vous verrez une zone de texte au centre
- Cliquez sur le bouton **`New`** en haut à gauche de la zone de texte
- Cela crée un nouveau script vide

### 4. Copier le script
- Ouvrez le fichier `blender_scripts/setup_scene.py` dans votre éditeur
- Copiez tout le contenu (Cmd+A puis Cmd+C sur Mac, Ctrl+A puis Ctrl+C sur Windows)
- Collez-le dans Blender (Cmd+V ou Ctrl+V)

### 5. Exécuter le script
- Cliquez sur le bouton **`Run Script`** en haut de la zone de texte
- Ou appuyez sur **`Alt + P`** (Option + P sur Mac)
- Vous devriez voir des messages dans la console en bas

### 6. Vérifier le résultat
- Retournez dans l'onglet **`Layout`** ou **`Modeling`**
- Vous devriez voir dans la scène :
  - Un objet "SubstationSystem" (Empty, axes)
  - Un objet "Substation_200MW" (Empty, axes)
- Dans la liste des objets à droite (Outliner), vous verrez ces deux objets

## 🎨 Interface Blender - Aide Rapide

### Vues 3D
- **Rotation** : Clic molette + glisser
- **Pan** : Shift + Clic molette + glisser
- **Zoom** : Molette
- **Vue de face** : `1` (clavier numérique)
- **Vue de côté** : `3`
- **Vue de dessus** : `7`
- **Vue perspective** : `5`

### Sélection
- **Sélectionner** : Clic gauche
- **Désélectionner tout** : `A` (deux fois)
- **Sélectionner tout** : `A` (une fois)

### Navigation
- **Centrer la vue** : `.` (point) sur l'objet sélectionné
- **Vue d'ensemble** : `Home` ou `View > Frame All`

## 📝 Ordre d'Exécution des Scripts

1. ✅ **setup_scene.py** - Configuration initiale (FAIT MAINTENANT)
2. Modéliser manuellement la **Substation 200 MW** (optionnel pour commencer)
3. **create_power_blocks.py** - Crée les 4 Power Blocks
4. **create_transformers.py** - Crée les 24 Transformateurs
5. **create_switchgears.py** - Crée les 24 Switchgears
6. **generate_hd5_containers.py** - Crée les 48 Containers HD5

## ⚠️ Conseils

- **Sauvegardez régulièrement** : `File > Save As` (Cmd+S / Ctrl+S)
- **Nommez votre fichier** : `substation_200MW.blend`
- **Si une erreur apparaît** : Vérifiez la console en bas pour les messages
- **Les objets Empty** (axes) sont invisibles mais nécessaires pour la hiérarchie

## 🆘 Problèmes Courants

### Le script ne s'exécute pas
- Vérifiez que vous êtes dans l'onglet Scripting
- Vérifiez qu'il n'y a pas d'erreurs de syntaxe (texte en rouge)
- Relisez le script pour vérifier qu'il est complet

### Rien n'apparaît après l'exécution
- Vérifiez l'Outliner (panneau de droite) - les objets Empty sont invisibles
- Appuyez sur `Home` pour voir toute la scène
- Les objets Empty apparaissent comme des axes (flèches X, Y, Z)

### Erreur "SubstationSystem already exists"
- C'est normal si vous exécutez le script plusieurs fois
- Le script nettoie d'abord la scène, donc c'est OK

## ➡️ Prochaine Étape

Une fois `setup_scene.py` exécuté avec succès :
1. Vous verrez "✅ Scène configurée avec succès!" dans la console
2. Passez à l'étape suivante : Exécuter `create_power_blocks.py`

---

**Besoin d'aide ?** Consultez `BLENDER_CHECKLIST.md` pour les détails complets.
