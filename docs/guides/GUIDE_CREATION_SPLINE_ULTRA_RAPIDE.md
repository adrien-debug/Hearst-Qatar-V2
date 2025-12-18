# ⚡ Guide Ultra-Rapide - Créer la Scène Spline en 2h

## 🎯 Vous avez l'abonnement Pro ? Parfait ! On y va !

---

## 📋 Fichiers Prêts pour Vous

✅ **`SPLINE_SCENE_CONFIGURATION_COMPLETE.md`** - Toutes les positions exactes  
✅ **`public/spline-positions.json`** - Fichier JSON avec toutes les positions  
✅ **`public/spline-positions.csv`** - Fichier CSV pour référence  
✅ **`data/splineSceneData.ts`** - Données TypeScript réutilisables  

---

## 🚀 Étape 1 : Ouvrir Spline (2 min)

1. Allez sur **https://spline.design**
2. Connectez-vous avec votre compte Pro
3. Cliquez sur **"New File"**
4. Nommez : `Hearst-Qatar-Substation`
5. Choisissez un template vide

---

## ⚙️ Étape 2 : Configurer la Scène (3 min)

1. **Ouvrez les paramètres de la scène** (icône ⚙️ en haut à droite)
2. **Dimensions** : 1000m × 1000m
3. **Unités** : Mètres
4. **Caméra initiale** :
   - Position : X=0, Y=150, Z=200
   - FOV : 50°

---

## 🏗️ Étape 3 : Créer le Sol (2 min)

1. **Add > Plane**
2. **Dimensions** : 1000m × 1000m
3. **Position** : X=0, Y=0, Z=0
4. **Matériau** :
   - Base Color : #D4A574 (beige sable)
   - Roughness : 0.8
5. **Renommez** : `Ground`

---

## 📦 Étape 4 : Importer vos Modèles (10 min)

### Depuis Blender (si vous avez les modèles) :

1. **Exportez chaque modèle en GLB** :
   - File > Export > glTF 2.0
   - Format: glTF Binary (.glb)
   - ✅ +Y Up
   - ✅ Apply Modifiers
   - ✅ Materials
   - ✅ Images

2. **Importez dans Spline** :
   - Add > Import 3D Model
   - Uploadez le fichier GLB
   - Attendez le chargement

3. **Renommez les modèles de base** :
   - `HD5_Container_Base`
   - `Transformer_Base`
   - `Switchgear_Base`
   - `PowerBlock_Base`
   - `Substation_200MW_Base`

### Si vous n'avez pas les modèles Blender :

Utilisez les formes de base de Spline pour créer des versions simplifiées :
- **Container HD5** : Box (12.196m × 2.438m × 2.896m)
- **Transformateur** : Box (4m × 3m × 5m)
- **Switchgear** : Box (2m × 2m × 3m)
- **Power Block** : Box (15m × 8m × 10m)
- **Substation** : Box (40m × 30m × 15m)

---

## 🎨 Étape 5 : Créer le Template (15 min)

**Objectif** : Créer un groupe avec 1 Transformateur + 2 Containers + 2 Switchgears

### 5.1 : Placer le Transformateur

1. **Dupliquez** `Transformer_Base` (Ctrl+D / Cmd+D)
2. **Position** : X=0, Y=0.3, Z=0
3. **Renommez** : `Transformer`

### 5.2 : Placer les 2 Containers

1. **Dupliquez** `HD5_Container_Base` 2 fois
2. **Container A** :
   - Position : X=-12, Y=0.3, Z=0
   - Renommez : `HD5_Container_A`
3. **Container B** :
   - Position : X=12, Y=0.3, Z=0
   - Renommez : `HD5_Container_B`

### 5.3 : Placer les 2 Switchgears

1. **Dupliquez** `Switchgear_Base` 2 fois
2. **Switchgear L** :
   - Position : X=-4.5, Y=0.3, Z=0
   - Renommez : `Switchgear_L`
3. **Switchgear R** :
   - Position : X=4.5, Y=0.3, Z=0
   - Renommez : `Switchgear_R`

### 5.4 : Grouper

1. **Sélectionnez tous** (Transformer + 2 Containers + 2 Switchgears)
2. **Ctrl+G / Cmd+G** pour grouper
3. **Renommez le groupe** : `Template_Transformer_Unit`

✅ **Vous avez maintenant votre template réutilisable !**

---

## 🔄 Étape 6 : Créer le Power Block 1 (20 min)

### 6.1 : Dupliquer le Template 6 fois

1. **Sélectionnez** `Template_Transformer_Unit`
2. **Dupliquez** 6 fois (Ctrl+D / Cmd+D, 6 fois)
3. **Placez-les** selon le tableau :

| Transformateur | Position Z |
|----------------|------------|
| TR01 | -55 |
| TR02 | -75 |
| TR03 | -95 |
| TR04 | -115 |
| TR05 | -135 |
| TR06 | -155 |

**Position X** : -75 (pour PB1)  
**Position Y** : 0.3

### 6.2 : Renommer tous les Objets

Pour chaque groupe dupliqué, renommez les objets :

**Pour TR01** :
- Groupe → `PB1_TR01_Unit`
- Transformer → `PB1_TR01_Transformer`
- HD5_Container_A → `PB1_TR01_HD5_A`
- HD5_Container_B → `PB1_TR01_HD5_B`
- Switchgear_L → `PB1_TR01_Switchgear_L`
- Switchgear_R → `PB1_TR01_Switchgear_R`

**Répétez pour TR02 à TR06** (changez juste le numéro)

### 6.3 : Ajouter le Power Block 3D

1. **Dupliquez** `PowerBlock_Base`
2. **Position** : X=-75, Y=0.5, Z=-35
3. **Renommez** : `PowerBlock_1_3D`

### 6.4 : Grouper le Tout

1. **Sélectionnez** :
   - `PowerBlock_1_3D`
   - Les 6 groupes TR01 à TR06
2. **Groupez** (Ctrl+G / Cmd+G)
3. **Renommez** : `PowerBlock_1`

✅ **Power Block 1 est terminé !**

---

## 🔁 Étape 7 : Dupliquer pour PB2, PB3, PB4 (15 min)

1. **Sélectionnez** `PowerBlock_1`
2. **Dupliquez** 3 fois
3. **Déplacez** :
   - PowerBlock_2 : X = -25
   - PowerBlock_3 : X = 25
   - PowerBlock_4 : X = 75

4. **Renommez tous les objets** dans chaque Power Block :
   - Utilisez "Find & Replace" si Spline le permet
   - Ou renommez manuellement en changeant PB1 → PB2, PB3, PB4

**Astuce** : Utilisez le fichier `spline-positions.json` pour vérifier les noms exacts.

---

## 🏢 Étape 8 : Placer la Substation (2 min)

1. **Dupliquez** `Substation_200MW_Base`
2. **Position** : X=0, Y=0.5, Z=0
3. **Renommez** : `Substation_200MW`

---

## 🎨 Étape 9 : Matériaux (10 min)

### Appliquez les matériaux à chaque type d'objet :

1. **Containers HD5** (Métal noir) :
   - Base Color : #1a1a1a
   - Metallic : 0.7
   - Roughness : 0.3

2. **Transformateurs** (Métal vert) :
   - Base Color : #059669
   - Metallic : 0.6
   - Roughness : 0.4

3. **Switchgears** (Métal gris) :
   - Base Color : #4b5563
   - Metallic : 0.5
   - Roughness : 0.5

4. **Power Blocks** (Métal gris) :
   - Base Color : #4b5563
   - Metallic : 0.5
   - Roughness : 0.5

5. **Substation** (Béton/Gris) :
   - Base Color : #9ca3af
   - Metallic : 0.1
   - Roughness : 0.8

**Astuce** : Créez des matériaux réutilisables dans la bibliothèque Spline.

---

## 💡 Étape 10 : Éclairage (5 min)

1. **Directional Light** (Soleil) :
   - Add > Light > Directional
   - Position : Y=100
   - Rotation : Pour simuler le soleil du Qatar
   - Intensité : 1.0

2. **Ambient Light** :
   - Add > Light > Ambient
   - Intensité : 0.3

3. **Environment** :
   - Add > Environment
   - Choisissez un environnement désertique

---

## ⚡ Étape 11 : Configurer les Interactions (15 min)

Pour chaque objet cliquable (Containers, Transformateurs, etc.) :

1. **Sélectionnez l'objet** (ex: `PB1_TR01_HD5_A`)
2. **Ouvrez le panneau "Events"** (icône ⚡ à droite)
3. **Ajoutez un événement "Click"** :
   - Event: `onClick`
   - Action: `Set Variable`
   - Variable name: `selectedObject`
   - Value: `PB1_TR01_HD5_A` (le nom exact de l'objet)

**Répétez pour tous les objets cliquables** (125 objets au total)

**Astuce** : Vous pouvez créer un script ou utiliser la liste dans `spline-positions.json` pour ne rien oublier.

---

## 📤 Étape 12 : Exporter (2 min)

1. **Cliquez sur "Export"** (en haut à droite)
2. **Sélectionnez "React"**
3. **Options** :
   - ✅ Include Spline Runtime
   - ✅ TypeScript
   - ✅ Optimize for production
4. **Copiez l'URL** de votre scène (format : `https://prod.spline.design/...`)

---

## 💻 Étape 13 : Intégrer dans Next.js (2 min)

1. **Ouvrez** `pages/substation-3d-spline.tsx`

2. **Remplacez** :
   ```typescript
   const SPLINE_SCENE_URL = 'https://prod.spline.design/YOUR-SCENE-ID.splinecode';
   ```
   
   Par votre URL :
   ```typescript
   const SPLINE_SCENE_URL = 'https://prod.spline.design/votre-url-ici.splinecode';
   ```

3. **Lancez** :
   ```bash
   npm run dev
   ```

4. **Visitez** : `http://localhost:1111/substation-3d-spline`

---

## ✅ Vérification

Vérifiez que tout est en place :

- [ ] 1 Substation à X=0, Y=0.5, Z=0
- [ ] 4 Power Blocks à X=-75, -25, 25, 75
- [ ] 24 Transformateurs (6 par Power Block)
- [ ] 48 Containers HD5 (2 par Transformateur)
- [ ] 48 Switchgears (2 par Transformateur)
- [ ] Tous les objets ont les bons noms
- [ ] Les interactions sont configurées
- [ ] Les matériaux sont appliqués
- [ ] L'éclairage est configuré

**Total** : 125 objets

---

## 🎉 C'est Terminé !

Votre scène Spline est maintenant prête et intégrée dans Next.js !

---

## 📚 Fichiers de Référence

- **`SPLINE_SCENE_CONFIGURATION_COMPLETE.md`** : Toutes les positions détaillées
- **`public/spline-positions.json`** : Toutes les positions au format JSON
- **`public/spline-positions.csv`** : Format CSV pour référence
- **`data/splineSceneData.ts`** : Données TypeScript réutilisables

---

## 🐛 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. **Vérifiez les positions** avec `spline-positions.json`
2. **Consultez** `SPLINE_SCENE_CONFIGURATION_COMPLETE.md` pour les détails
3. **Documentation Spline** : https://docs.spline.design
4. **Discord Spline** : https://discord.gg/spline

---

**Temps estimé total** : 2-3 heures

**Résultat** : Une scène 3D professionnelle, parfaitement alignée ! 🚀
