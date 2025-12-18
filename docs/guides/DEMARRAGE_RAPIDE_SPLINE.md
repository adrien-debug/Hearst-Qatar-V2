# 🚀 Démarrage Rapide Spline - 5 Minutes

## ✅ Étape 1 : Package Installé

Le package `@splinetool/react-spline` est maintenant installé dans votre projet !

---

## 🎯 Étape 2 : Créer votre Scène dans Spline

### 2.1 : Créer un compte

1. Allez sur **https://spline.design**
2. Créez un compte (gratuit pour tester)
3. **Important** : Passez au plan **Pro** ($20/mois) pour pouvoir exporter en React

### 2.2 : Créer un nouveau projet

1. Cliquez sur **"New File"**
2. Nommez-le : `Hearst-Qatar-Substation`
3. Choisissez un template vide

---

## 📦 Étape 3 : Importer vos Modèles

### Option A : Vous avez déjà des modèles Blender

1. **Exportez depuis Blender** :
   - File > Export > glTF 2.0
   - Format: glTF Binary (.glb)
   - ✅ +Y Up
   - ✅ Apply Modifiers
   - ✅ Materials
   - ✅ Images

2. **Importez dans Spline** :
   - Cliquez sur **"Add"** (bouton +)
   - Sélectionnez **"Import 3D Model"**
   - Uploadez votre fichier GLB

### Option B : Créer directement dans Spline

1. Utilisez les formes de base de Spline
2. Créez vos modèles directement dans l'éditeur

---

## 🏗️ Étape 4 : Créer le Template (15-30 min)

**Objectif** : Créer un groupe réutilisable avec 1 Transformateur + 2 Containers HD5

1. **Placez le Transformateur** :
   - Position : X=0, Y=0.3, Z=0
   - Renommez : `Transformer`

2. **Placez les 2 Containers** :
   - Container A : X=-12, Y=0.3, Z=0
   - Container B : X=12, Y=0.3, Z=0
   - Renommez : `HD5_Container_A` et `HD5_Container_B`

3. **Placez les Switchgears** :
   - Switchgear L : X=-4.5, Y=0.3, Z=0
   - Switchgear R : X=4.5, Y=0.3, Z=0
   - Renommez : `Switchgear_L` et `Switchgear_R`

4. **Groupez le tout** :
   - Sélectionnez tous les objets
   - Clic droit > **"Group"** (ou Ctrl+G / Cmd+G)
   - Renommez : `Template_Transformer_Unit`

---

## 🔄 Étape 5 : Dupliquer (10 min)

1. **Sélectionnez votre template** (`Template_Transformer_Unit`)
2. **Dupliquez-le 6 fois** (Ctrl+D / Cmd+D)
3. **Placez-les en ligne** (écartement Z = -20 entre chaque)
4. **Groupez-les** : `PowerBlock_1_Transformers`
5. **Dupliquez ce groupe 4 fois** pour créer les 4 Power Blocks
6. **Placez-les horizontalement** (écartement X = 50 entre chaque)

---

## 📤 Étape 6 : Exporter (2 min)

1. **Dans Spline** :
   - Cliquez sur **"Export"** (en haut à droite)
   - Sélectionnez **"React"**
   - ✅ Include Spline Runtime
   - ✅ TypeScript
   - ✅ Optimize for production

2. **Copiez l'URL** de votre scène (format : `https://prod.spline.design/...`)

---

## 💻 Étape 7 : Intégrer dans Next.js (2 min)

1. **Ouvrez** `pages/substation-3d-spline.tsx`

2. **Remplacez** cette ligne :
   ```typescript
   const SPLINE_SCENE_URL = 'https://prod.spline.design/YOUR-SCENE-ID.splinecode';
   ```
   
   Par votre URL :
   ```typescript
   const SPLINE_SCENE_URL = 'https://prod.spline.design/votre-scene-id.splinecode';
   ```

3. **Lancez le serveur** :
   ```bash
   npm run dev
   ```

4. **Visitez** : `http://localhost:1111/substation-3d-spline`

---

## ✅ C'est Prêt !

Votre scène Spline devrait maintenant s'afficher dans votre navigateur !

---

## 🎨 Prochaines Étapes

1. **Configurer les interactions** :
   - Dans Spline, ajoutez des événements "Click" sur vos objets
   - Les clics seront automatiquement détectés dans React

2. **Connecter avec vos données** :
   - Utilisez `handleSplineLoad` dans `substation-3d-spline.tsx`
   - Mettez à jour les couleurs selon les statuts (OK/Warning/Off)

3. **Personnaliser** :
   - Ajoutez des matériaux dans Spline
   - Configurez l'éclairage
   - Ajoutez un environnement (désertique)

---

## 🐛 Problèmes Courants

### La scène ne s'affiche pas

- Vérifiez que l'URL est correcte
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous d'avoir le plan Pro pour l'export React

### Les objets ne sont pas cliquables

- Vérifiez que vous avez configuré les événements dans Spline
- Vérifiez les noms des objets (doivent correspondre exactement)

### Performance lente

- Réduisez le nombre de polygones dans Blender avant l'export
- Utilisez des textures compressées
- Activez l'optimisation dans l'export Spline

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **`GUIDE_MIGRATION_SPLINE.md`** : Guide complet étape par étape
- **`INSTALLATION_SPLINE.md`** : Détails d'installation
- **`scripts/export-blender-to-spline.md`** : Export depuis Blender

---

**Temps total** : ~30-60 minutes pour une scène complète

**Résultat** : Une visualisation 3D professionnelle, simple à maintenir ! 🎉
