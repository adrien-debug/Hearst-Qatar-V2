# 🎯 Configuration Complète de la Scène Spline - Hearst Qatar

## 📐 Positions Exactes (Basées sur votre code R3F)

Toutes les positions sont en **mètres** et correspondent exactement à votre configuration actuelle.

---

## 🏗️ Structure de la Scène

### Dimensions Globales
- **Largeur totale** : ~300m (4 Power Blocks × 50m d'espacement)
- **Profondeur totale** : ~200m (Substation + Power Blocks + Transformateurs)
- **Hauteur** : 15m (Substation la plus haute)

---

## 📍 Positions Détaillées

### 1. SUBSTATION 200 MW

**Position** : `X: 0, Y: 0.5, Z: 0`

**Dimensions** : 40m × 30m × 15m

**Nom dans Spline** : `Substation_200MW`

---

### 2. POWER BLOCKS (4 au total)

**Espacement horizontal** : 50m entre chaque Power Block

**Position de départ** : X = -75m

| Power Block | Position X | Position Y | Position Z | Nom dans Spline |
|-------------|------------|------------|------------|-----------------|
| PB1 | -75 | 0.5 | -35 | `PowerBlock_1` |
| PB2 | -25 | 0.5 | -35 | `PowerBlock_2` |
| PB3 | 25 | 0.5 | -35 | `PowerBlock_3` |
| PB4 | 75 | 0.5 | -35 | `PowerBlock_4` |

**Dimensions Power Block** : 15m × 8m × 10m

---

### 3. TRANSFORMATEURS (6 par Power Block = 24 au total)

**Espacement vertical (Z)** : 20m entre chaque transformateur

**Position de départ** : Z = -55m (20m derrière le Power Block)

**Position Y** : 0.3m (au-dessus du sol)

| Power Block | Transformateur | Position X | Position Y | Position Z | Nom dans Spline |
|-------------|----------------|------------|------------|------------|-----------------|
| PB1 | TR01 | -75 | 0.3 | -55 | `PB1_TR01_Transformer` |
| PB1 | TR02 | -75 | 0.3 | -75 | `PB1_TR02_Transformer` |
| PB1 | TR03 | -75 | 0.3 | -95 | `PB1_TR03_Transformer` |
| PB1 | TR04 | -75 | 0.3 | -115 | `PB1_TR04_Transformer` |
| PB1 | TR05 | -75 | 0.3 | -135 | `PB1_TR05_Transformer` |
| PB1 | TR06 | -75 | 0.3 | -155 | `PB1_TR06_Transformer` |
| PB2 | TR01 | -25 | 0.3 | -55 | `PB2_TR01_Transformer` |
| PB2 | TR02 | -25 | 0.3 | -75 | `PB2_TR02_Transformer` |
| PB2 | TR03 | -25 | 0.3 | -95 | `PB2_TR03_Transformer` |
| PB2 | TR04 | -25 | 0.3 | -115 | `PB2_TR04_Transformer` |
| PB2 | TR05 | -25 | 0.3 | -135 | `PB2_TR05_Transformer` |
| PB2 | TR06 | -25 | 0.3 | -155 | `PB2_TR06_Transformer` |
| PB3 | TR01 | 25 | 0.3 | -55 | `PB3_TR01_Transformer` |
| PB3 | TR02 | 25 | 0.3 | -75 | `PB3_TR02_Transformer` |
| PB3 | TR03 | 25 | 0.3 | -95 | `PB3_TR03_Transformer` |
| PB3 | TR04 | 25 | 0.3 | -115 | `PB3_TR04_Transformer` |
| PB3 | TR05 | 25 | 0.3 | -135 | `PB3_TR05_Transformer` |
| PB3 | TR06 | 25 | 0.3 | -155 | `PB3_TR06_Transformer` |
| PB4 | TR01 | 75 | 0.3 | -55 | `PB4_TR01_Transformer` |
| PB4 | TR02 | 75 | 0.3 | -75 | `PB4_TR02_Transformer` |
| PB4 | TR03 | 75 | 0.3 | -95 | `PB4_TR03_Transformer` |
| PB4 | TR04 | 75 | 0.3 | -115 | `PB4_TR04_Transformer` |
| PB4 | TR05 | 75 | 0.3 | -135 | `PB4_TR05_Transformer` |
| PB4 | TR06 | 75 | 0.3 | -155 | `PB4_TR06_Transformer` |

**Dimensions Transformateur** : 4m × 3m × 5m

---

### 4. SWITCHGEARS (2 par Transformateur = 48 au total)

**Offset latéral** : ±4.5m depuis le transformateur

**Position Y** : 0.3m (même hauteur que le transformateur)

| Power Block | Transformateur | Côté | Position X | Position Y | Position Z | Nom dans Spline |
|-------------|----------------|------|------------|------------|------------|-----------------|
| PB1 | TR01 | L | -79.5 | 0.3 | -55 | `PB1_TR01_Switchgear_L` |
| PB1 | TR01 | R | -70.5 | 0.3 | -55 | `PB1_TR01_Switchgear_R` |
| PB1 | TR02 | L | -79.5 | 0.3 | -75 | `PB1_TR02_Switchgear_L` |
| PB1 | TR02 | R | -70.5 | 0.3 | -75 | `PB1_TR02_Switchgear_R` |
| ... | ... | ... | ... | ... | ... | ... |

**Formule pour calculer** :
- Switchgear L : X = Position_X_Transformateur - 4.5
- Switchgear R : X = Position_X_Transformateur + 4.5
- Y et Z identiques au transformateur

**Dimensions Switchgear** : 2m × 2m × 3m

---

### 5. CONTAINERS HD5 (2 par Transformateur = 48 au total)

**Offset latéral** : ±12m depuis le transformateur

**Position Y** : 0.3m (même hauteur que le transformateur)

| Power Block | Transformateur | Côté | Position X | Position Y | Position Z | Nom dans Spline |
|-------------|----------------|------|------------|------------|------------|-----------------|
| PB1 | TR01 | A | -87 | 0.3 | -55 | `PB1_TR01_HD5_A` |
| PB1 | TR01 | B | -63 | 0.3 | -55 | `PB1_TR01_HD5_B` |
| PB1 | TR02 | A | -87 | 0.3 | -75 | `PB1_TR02_HD5_A` |
| PB1 | TR02 | B | -63 | 0.3 | -75 | `PB1_TR02_HD5_B` |
| ... | ... | ... | ... | ... | ... | ... |

**Formule pour calculer** :
- Container A : X = Position_X_Transformateur - 12
- Container B : X = Position_X_Transformateur + 12
- Y et Z identiques au transformateur

**Dimensions Container HD5** : 12.196m × 2.438m × 2.896m

---

## 🎨 Workflow de Création dans Spline

### Étape 1 : Configurer la Scène (5 min)

1. **Ouvrez Spline** et créez un nouveau projet
2. **Paramètres de la scène** :
   - Dimensions : 1000m × 1000m
   - Unités : Mètres
   - Caméra initiale : X=0, Y=150, Z=200

### Étape 2 : Créer le Sol (2 min)

1. **Ajoutez un Plan** :
   - Dimensions : 1000m × 1000m
   - Position : X=0, Y=0, Z=0
   - Matériau : Texture de sable/beige
   - Nom : `Ground`

### Étape 3 : Importer les Modèles de Base (10 min)

Importez vos modèles GLB depuis Blender :

1. **Container HD5** → Renommez : `HD5_Container_Base`
2. **Transformateur** → Renommez : `Transformer_Base`
3. **Switchgear** → Renommez : `Switchgear_Base`
4. **Power Block** → Renommez : `PowerBlock_Base`
5. **Substation** → Renommez : `Substation_200MW_Base`

### Étape 4 : Créer le Template (15 min)

**Créez un groupe "Template_Transformer_Unit"** avec :

1. **Transformateur** :
   - Dupliquez `Transformer_Base`
   - Position : X=0, Y=0.3, Z=0
   - Renommez : `Transformer`

2. **Container HD5 A** :
   - Dupliquez `HD5_Container_Base`
   - Position : X=-12, Y=0.3, Z=0
   - Renommez : `HD5_Container_A`

3. **Container HD5 B** :
   - Dupliquez `HD5_Container_Base`
   - Position : X=12, Y=0.3, Z=0
   - Renommez : `HD5_Container_B`

4. **Switchgear L** :
   - Dupliquez `Switchgear_Base`
   - Position : X=-4.5, Y=0.3, Z=0
   - Renommez : `Switchgear_L`

5. **Switchgear R** :
   - Dupliquez `Switchgear_Base`
   - Position : X=4.5, Y=0.3, Z=0
   - Renommez : `Switchgear_R`

6. **Groupez tout** :
   - Sélectionnez tous les objets
   - Ctrl+G / Cmd+G
   - Renommez : `Template_Transformer_Unit`

### Étape 5 : Créer les 6 Transformateurs du Power Block 1 (10 min)

1. **Dupliquez le template** 6 fois
2. **Placez-les** selon le tableau ci-dessus :
   - TR01 : Z = -55
   - TR02 : Z = -75
   - TR03 : Z = -95
   - TR04 : Z = -115
   - TR05 : Z = -135
   - TR06 : Z = -155

3. **Renommez chaque groupe** :
   - `PB1_TR01_Unit`
   - `PB1_TR02_Unit`
   - etc.

4. **Dans chaque groupe, renommez les objets** :
   - Transformer → `PB1_TR01_Transformer`
   - HD5_Container_A → `PB1_TR01_HD5_A`
   - HD5_Container_B → `PB1_TR01_HD5_B`
   - Switchgear_L → `PB1_TR01_Switchgear_L`
   - Switchgear_R → `PB1_TR01_Switchgear_R`

5. **Groupez les 6 unités** : `PowerBlock_1_Transformers`

### Étape 6 : Ajouter le Power Block 3D (2 min)

1. **Dupliquez** `PowerBlock_Base`
2. **Position** : X=-75, Y=0.5, Z=-35
3. **Renommez** : `PowerBlock_1_3D`
4. **Groupez avec** `PowerBlock_1_Transformers` → `PowerBlock_1`

### Étape 7 : Dupliquer pour les 3 Autres Power Blocks (15 min)

1. **Sélectionnez** `PowerBlock_1`
2. **Dupliquez** 3 fois
3. **Déplacez** :
   - PowerBlock_2 : X = -25
   - PowerBlock_3 : X = 25
   - PowerBlock_4 : X = 75

4. **Renommez** tous les objets dans chaque Power Block :
   - Utilisez "Find & Replace" dans Spline si disponible
   - Ou renommez manuellement en suivant le pattern

### Étape 8 : Placer la Substation (2 min)

1. **Dupliquez** `Substation_200MW_Base`
2. **Position** : X=0, Y=0.5, Z=0
3. **Renommez** : `Substation_200MW`

### Étape 9 : Configurer les Interactions (10 min)

Pour chaque objet cliquable :

1. **Sélectionnez l'objet** (ex: `PB1_TR01_HD5_A`)
2. **Ouvrez le panneau "Events"** (icône ⚡)
3. **Ajoutez un événement "Click"** :
   - Event: `onClick`
   - Action: `Set Variable` ou `Trigger Function`
   - Variable name: `selectedObject`
   - Value: `PB1_TR01_HD5_A`

**Astuce** : Vous pouvez créer un script pour automatiser cela si Spline le permet.

### Étape 10 : Éclairage et Environnement (5 min)

1. **Ajoutez une Directional Light** :
   - Position : Y=100
   - Rotation : Pour simuler le soleil du Qatar
   - Intensité : 1.0

2. **Ajoutez un Ambient Light** :
   - Intensité : 0.3 (pour éclairer les ombres)

3. **Ajoutez un Environment** :
   - Choisissez un environnement désertique/sableux
   - Ou créez un ciel personnalisé

### Étape 11 : Matériaux (10 min)

Configurez les matériaux pour chaque type d'objet :

1. **Métal noir** (Containers) :
   - Base Color : #1a1a1a
   - Metallic : 0.7
   - Roughness : 0.3

2. **Métal vert industriel** (Transformateurs) :
   - Base Color : #059669
   - Metallic : 0.6
   - Roughness : 0.4

3. **Métal gris** (Switchgears, Power Blocks) :
   - Base Color : #4b5563
   - Metallic : 0.5
   - Roughness : 0.5

4. **Béton/Gris** (Substation) :
   - Base Color : #9ca3af
   - Metallic : 0.1
   - Roughness : 0.8

---

## 📋 Checklist de Création

- [ ] Scène configurée (dimensions, unités)
- [ ] Sol créé (Ground)
- [ ] 5 modèles de base importés
- [ ] Template créé (1 Transformateur + 2 Containers + 2 Switchgears)
- [ ] Template dupliqué 6 fois pour PB1
- [ ] Tous les objets renommés pour PB1
- [ ] Power Block 3D ajouté pour PB1
- [ ] PB1 groupé et complet
- [ ] PB1 dupliqué 3 fois pour créer PB2, PB3, PB4
- [ ] Tous les objets renommés pour PB2, PB3, PB4
- [ ] Substation placée
- [ ] Éclairage configuré
- [ ] Environnement ajouté
- [ ] Matériaux appliqués
- [ ] Interactions configurées (clics)
- [ ] Positions vérifiées (comparer avec ce document)

---

## 🎯 Export et Intégration

### Export depuis Spline

1. **Cliquez sur "Export"** (en haut à droite)
2. **Sélectionnez "React"**
3. **Options** :
   - ✅ Include Spline Runtime
   - ✅ TypeScript
   - ✅ Optimize for production
4. **Copiez l'URL** de votre scène

### Intégration dans Next.js

1. **Ouvrez** `pages/substation-3d-spline.tsx`
2. **Remplacez** :
   ```typescript
   const SPLINE_SCENE_URL = 'https://prod.spline.design/YOUR-SCENE-ID.splinecode';
   ```
   Par votre URL Spline

3. **Lancez** : `npm run dev`
4. **Visitez** : `http://localhost:1111/substation-3d-spline`

---

## 🔍 Vérification des Positions

Utilisez ce tableau pour vérifier que tous les objets sont bien placés :

| Type | Nombre | Position X Range | Position Y | Position Z Range |
|------|--------|------------------|------------|------------------|
| Substation | 1 | 0 | 0.5 | 0 |
| Power Blocks | 4 | -75 à 75 | 0.5 | -35 |
| Transformateurs | 24 | -75, -25, 25, 75 | 0.3 | -55 à -155 |
| Switchgears | 48 | -79.5 à 75.5 | 0.3 | -55 à -155 |
| Containers HD5 | 48 | -87 à 87 | 0.3 | -55 à -155 |

---

## 💡 Astuces Pro

1. **Utilisez les guides** : Activez les grilles et guides dans Spline pour un placement précis
2. **Snap to grid** : Activez le snap pour un alignement parfait
3. **Copier/Coller** : Utilisez Ctrl+C / Ctrl+V pour dupliquer rapidement
4. **Alignement** : Utilisez les outils d'alignement de Spline
5. **Groupes** : Gardez une hiérarchie claire avec des groupes logiques

---

## 🐛 Problèmes Courants

### Les objets ne s'alignent pas

**Solution** : Activez le snap et utilisez les valeurs exactes du tableau

### Les noms sont incorrects

**Solution** : Utilisez "Find & Replace" ou renommez systématiquement en suivant le pattern

### La scène est trop lourde

**Solution** : 
- Réduisez la résolution des textures
- Simplifiez la géométrie dans Blender avant l'export
- Utilisez l'instancing si Spline le supporte

---

**Temps estimé total** : 2-3 heures pour créer la scène complète

**Résultat** : Une scène 3D professionnelle, parfaitement alignée avec votre configuration actuelle ! 🎉
