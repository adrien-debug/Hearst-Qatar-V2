# 🎨 Guide Blender - Container Hearst HD

## 🎯 Objectif

Créer un container unique dans Blender avec dalle béton, système de refroidissement et logo Hearst.

---

## 📥 Installation de Blender

### Télécharger Blender

1. Aller sur [blender.org](https://www.blender.org/download/)
2. Télécharger la dernière version (3.x ou supérieure)
3. Installer normalement

**Gratuit et open-source !**

---

## 🚀 Méthode Automatique (Recommandée)

### Étape 1 : Ouvrir Blender

Lancer Blender. Vous verrez l'écran de démarrage avec un cube par défaut.

### Étape 2 : Aller dans Scripting

En haut de l'écran, cliquer sur **"Scripting"** (à côté de Modeling, Shading, etc.)

### Étape 3 : Ouvrir le Script

1. Dans l'éditeur de texte (partie centrale), cliquer sur **"Open"** (icône 📁)
2. Naviguer vers votre dossier :
   ```
   /Users/adrienbeyondcrypto/Desktop/Hearst Qatar/blender_scripts/
   ```
3. Sélectionner **`create_container_hearst_hd.py`**

### Étape 4 : Exécuter

1. Cliquer sur le bouton **▶️ "Run Script"** en haut de l'éditeur
2. Ou appuyer sur **Alt + P**

### Étape 5 : Attendre

Le script va :
- ✅ Nettoyer la scène
- ✅ Créer la dalle béton
- ✅ Créer le container
- ✅ Ajouter l'unité AC
- ✅ Ajouter les grilles
- ✅ Ajouter le logo
- ✅ Fusionner en 1 objet
- ✅ Appliquer les matériaux
- ✅ Optimiser
- ✅ Exporter en GLB

**Durée : 5-10 secondes**

### Étape 6 : Vérifier

Dans la console (en bas), vous devriez voir :

```
✅ CONTAINER HEARST HD CRÉÉ AVEC SUCCÈS!
📊 Vertices: ~3500
📊 Faces: ~3200
💾 Export GLB: /public/models/container_hearst_hd.glb
```

### Étape 7 : Visualiser

1. Revenir à l'onglet **"Layout"** (en haut)
2. Utiliser la molette pour zoomer/dézoomer
3. Maintenir le clic molette pour tourner autour
4. Shift + clic molette pour déplacer la vue

**C'est terminé !** Le fichier GLB est prêt à être utilisé.

---

## 🔧 Méthode Manuelle

Si vous voulez créer le container manuellement pour apprendre Blender.

### 1. Nettoyer la Scène

1. Sélectionner tous les objets : **A**
2. Supprimer : **X** → Delete

### 2. Configurer les Unités

1. Aller dans **Scene Properties** (icône 🎬 à droite)
2. Ouvrir **Unit Scale**
3. Sélectionner **Metric**
4. Length : **Meters**

### 3. Créer la Dalle Béton

1. **Shift + A** → Mesh → Cube
2. Avec le cube sélectionné :
   - Appuyer sur **S** (Scale), puis **X**, puis taper **3.25**, Enter
   - Appuyer sur **S**, puis **Y**, puis taper **1.5**, Enter
   - Appuyer sur **S**, puis **Z**, puis taper **0.2**, Enter
3. Appuyer sur **G** (Grab), puis **Z**, puis taper **0.2**, Enter
4. Renommer l'objet "Container_Hearst_HD" dans l'outliner (à droite)

### 4. Créer le Container Principal

1. **Shift + A** → Mesh → Cube
2. Scale :
   - **S** → **X** → **3.029** → Enter
   - **S** → **Y** → **1.219** → Enter
   - **S** → **Z** → **1.296** → Enter
3. Position :
   - **G** → **Z** → **1.696** → Enter

### 5. Créer l'Unité AC

1. **Shift + A** → Mesh → Cube
2. Scale :
   - **S** → **X** → **0.8** → Enter
   - **S** → **Y** → **0.6** → Enter
   - **S** → **Z** → **0.3** → Enter
3. Position :
   - **G** → **X** → **2.0** → Enter
   - **G** → **Z** → **3.2** → Enter

### 6. Créer les Grilles de Ventilation

**Grille Gauche :**
1. **Shift + A** → Mesh → Cube
2. Scale : **S** → **X** → **1.0**, **Y** → **0.05**, **Z** → **0.4**
3. Position : **G** → **Y** → **-1.22**, **Z** → **1.5**

**Grille Droite :**
1. **Shift + A** → Mesh → Cube
2. Scale : **S** → **X** → **1.0**, **Y** → **0.05**, **Z** → **0.4**
3. Position : **G** → **Y** → **1.22**, **Z** → **1.5**

### 7. Créer le Logo

1. **Shift + A** → Mesh → Plane
2. Scale : **S** → **X** → **0.6**, **Y** → **0.3**
3. Rotation : **R** → **Y** → **90** → Enter
4. Position : **G** → **X** → **-2.8**, **Z** → **2.0**

### 8. Fusionner Tout en 1 Objet

1. Sélectionner tous les objets : **A**
2. Fusionner : **Ctrl + J**
3. Renommer "Container_Hearst_HD"

### 9. Appliquer les Transformations

1. Avec l'objet sélectionné : **Ctrl + A**
2. Sélectionner **All Transforms**

### 10. Créer le Matériau

1. Aller dans **Shading** (en haut)
2. Cliquer sur **+ New** dans les propriétés Material
3. Renommer "Container_Material"
4. Dans le Shader Editor :
   - Le nœud **Principled BSDF** est déjà là
   - Changer **Base Color** → Noir (0, 0, 0)
   - **Metallic** → 0.3
   - **Roughness** → 0.7

### 11. Optimiser la Géométrie

1. Passer en **Edit Mode** : **Tab**
2. Sélectionner tout : **A**
3. Menu **Mesh** → **Clean Up** → **Merge by Distance**
4. Menu **Mesh** → **Normals** → **Recalculate Outside**
5. Retour en **Object Mode** : **Tab**

### 12. UV Mapping

1. **Edit Mode** : **Tab**
2. Sélectionner tout : **A**
3. **U** → **Smart UV Project**
4. Garder les paramètres par défaut → OK
5. **Object Mode** : **Tab**

### 13. Centrer l'Origine

1. **Object** → **Set Origin** → **Origin to Geometry**

### 14. Exporter en GLB

1. **File** → **Export** → **glTF 2.0 (.glb/.gltf)**
2. Dans les options à droite :
   - Format : **GLB**
   - Include : cocher **Selected Objects** (si besoin)
   - Transform : cocher **+Y Up**
   - Geometry : cocher **Apply Modifiers**
   - Compression : cocher **Draco mesh compression**
   - Compression level : **6**
3. Naviguer vers :
   ```
   /Users/adrienbeyondcrypto/Desktop/Hearst Qatar/public/models/
   ```
4. Nom du fichier : **container_hearst_hd.glb**
5. Cliquer sur **Export glTF 2.0**

**C'est terminé !**

---

## 🎨 Raccourcis Clavier Essentiels

### Navigation
- **Molette** : Zoom
- **Clic molette + glisser** : Rotation de la vue
- **Shift + Clic molette + glisser** : Déplacer la vue
- **Pavé numérique 7** : Vue de dessus
- **Pavé numérique 1** : Vue de face
- **Pavé numérique 3** : Vue de côté

### Sélection
- **A** : Sélectionner tout / Désélectionner tout
- **Alt + A** : Désélectionner tout
- **Clic gauche** : Sélectionner un objet
- **Shift + Clic gauche** : Ajouter à la sélection

### Transformation
- **G** : Grab (déplacer)
- **R** : Rotate (rotation)
- **S** : Scale (échelle)
- **X/Y/Z** (après G/R/S) : Contraindre à un axe
- **Shift + X/Y/Z** : Contraindre au plan (exclure un axe)

### Création
- **Shift + A** : Ajouter un objet
- **Shift + D** : Dupliquer

### Édition
- **Tab** : Basculer Edit Mode / Object Mode
- **X** : Supprimer
- **Ctrl + J** : Fusionner les objets sélectionnés
- **Ctrl + A** : Appliquer les transformations

### Autres
- **Z** : Menu d'affichage (Wireframe, Solid, Material Preview, Rendered)
- **T** : Afficher/masquer la barre d'outils
- **N** : Afficher/masquer les propriétés
- **Ctrl + S** : Sauvegarder
- **Ctrl + Z** : Annuler
- **Ctrl + Shift + Z** : Refaire

---

## 💡 Astuces Blender

### Astuce 1 : Sauvegarder Régulièrement

**Ctrl + S** pour sauvegarder votre travail !

Blender sauvegarde aussi automatiquement dans :
```
/tmp/blender_auto_save/
```

### Astuce 2 : Utiliser le Pavé Numérique

Le pavé numérique permet de changer rapidement de vue :
- **7** : Dessus
- **1** : Face
- **3** : Côté droit
- **9** : Opposé de la vue actuelle

### Astuce 3 : Cadrer un Objet

Sélectionner un objet et appuyer sur **. (point)** du pavé numérique pour le cadrer dans la vue.

### Astuce 4 : Mode Wireframe

Appuyer sur **Z** puis **4** pour voir en mode fil de fer (wireframe).

### Astuce 5 : Annuler Plusieurs Fois

**Ctrl + Z** plusieurs fois pour annuler plusieurs actions.

---

## 🆘 Problèmes Courants

### Problème : Je ne vois rien

**Solution :**
- Appuyer sur **Home** pour cadrer tous les objets
- Ou **. (point)** du pavé numérique pour cadrer la sélection

### Problème : Les raccourcis ne marchent pas

**Solution :**
- Vérifier que la souris est dans la bonne fenêtre
- Vérifier que vous n'êtes pas en mode texte

### Problème : L'objet est trop petit/grand

**Solution :**
- Sélectionner l'objet
- Appuyer sur **S** puis taper un nombre (ex: **2** pour doubler la taille)

### Problème : Je ne trouve pas le menu Export

**Solution :**
- **File** (en haut à gauche) → **Export** → **glTF 2.0 (.glb/.gltf)**

### Problème : L'export GLB ne fonctionne pas

**Solution :**
- Vérifier que le dossier de destination existe
- Créer le dossier `/public/models/` si nécessaire

---

## 📚 Ressources pour Apprendre

### Tutoriels Officiels

- [Blender Fundamentals](https://www.blender.org/support/tutorials/) - Tutoriels officiels
- [Blender Manual](https://docs.blender.org/manual/en/latest/) - Documentation complète

### Tutoriels Vidéo (YouTube)

- **Blender Guru** - Excellent pour débuter
- **Grant Abbitt** - Tutoriels pour débutants
- **CG Geek** - Projets pratiques

### En Français

- **Blender Facile** - Tutoriels en français
- **Grafikart** - Quelques tutoriels Blender

---

## 🎓 Prochaines Étapes

### Après avoir créé le container :

1. ✅ Expérimenter avec les transformations (G, R, S)
2. ✅ Essayer de modifier les dimensions
3. ✅ Créer des variantes (double cooling, etc.)
4. ✅ Apprendre à texturer avec des images
5. ✅ Explorer l'éclairage et le rendu

### Pour aller plus loin :

- Apprendre le **Modifier Stack** (Array, Mirror, etc.)
- Découvrir le **Sculpting** pour des formes organiques
- Explorer les **Nodes** pour des matériaux avancés
- Essayer l'**Animation** pour des containers animés

---

## ✅ Checklist Finale

Avant d'exporter, vérifier :

- [ ] Tous les objets fusionnés en 1 seul
- [ ] Nom correct : "Container_Hearst_HD"
- [ ] Transformations appliquées (Ctrl + A)
- [ ] Matériau appliqué
- [ ] Géométrie nettoyée (doublons supprimés)
- [ ] UV mapping créé
- [ ] Origine centrée
- [ ] Export GLB avec Draco compression

---

## 🎉 Félicitations !

Vous savez maintenant créer un container 3D dans Blender !

**Prochaine étape :** Intégrer le modèle dans le configurateur Three.js

→ Voir **EXEMPLES_UTILISATION_CONTAINER.md**

---

**Hearst Qatar Project**  
Guide Blender pour Container HD  
Version Débutant-Friendly







