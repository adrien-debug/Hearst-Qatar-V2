# Guide de Migration vers Spline - Hearst Qatar

## 🎯 Objectif

Migrer votre visualisation 3D complexe (React Three Fiber) vers **Spline** pour simplifier le placement des objets et gagner du temps.

**Avant** : Calculs manuels de positions, textures procédurales, code complexe  
**Après** : Placement visuel, configuration simple, export React automatique

---

## 📋 Prérequis

1. **Compte Spline** : Créez un compte sur https://spline.design
   - Commencez par le plan **Starter** (gratuit) pour tester
   - Passez au plan **Pro** ($20/mois) pour l'export React

2. **Modèles 3D** : Vos modèles Blender en format GLB/GLTF
   - Container HD5
   - Transformateur
   - Switchgear
   - Power Block
   - Substation

---

## 🚀 Phase 1 : Setup Initial (30 minutes)

### Étape 1.1 : Créer un nouveau projet Spline

1. Connectez-vous à https://spline.design
2. Cliquez sur **"New File"**
3. Nommez-le : `Hearst-Qatar-Substation`
4. Choisissez un template vide ou "3D Scene"

### Étape 1.2 : Configurer la scène

1. **Dimensions de la scène** :
   - Ouvrez les paramètres de la scène (icône ⚙️ en haut à droite)
   - Définissez les dimensions : 1000m × 1000m (pour correspondre à votre site)
   - Unités : Mètres

2. **Caméra initiale** :
   - Position : X=0, Y=150, Z=200 (vue d'ensemble)
   - FOV : 50° (pour correspondre à votre config actuelle)

---

## 🎨 Phase 2 : Import des Modèles (1-2 heures)

### Étape 2.1 : Préparer les modèles Blender

Pour chaque modèle (Container HD5, Transformateur, etc.) :

1. **Dans Blender** :
   ```
   - Ouvrez votre modèle
   - Assurez-vous qu'il est centré à l'origine (0,0,0)
   - Vérifiez l'échelle (doit être en mètres)
   - Exportez en GLB :
     File > Export > glTF 2.0
     Format: glTF Binary (.glb)
     Include: Selected Objects
     Transform: +Y Up
     Geometry: Apply Modifiers
   ```

2. **Nommage des fichiers** :
   - `hd5_container.glb`
   - `transformer.glb`
   - `switchgear.glb`
   - `power_block.glb`
   - `substation_200mw.glb`

### Étape 2.2 : Importer dans Spline

1. **Dans Spline** :
   - Cliquez sur **"Add"** (bouton + en haut)
   - Sélectionnez **"Import 3D Model"**
   - Uploadez votre fichier GLB
   - Attendez le chargement

2. **Vérifier l'import** :
   - Le modèle doit apparaître dans la scène
   - Vérifiez l'échelle (doit correspondre aux dimensions réelles)
   - Si trop petit/grand, utilisez l'outil de scale (S dans Spline)

3. **Organiser dans la hiérarchie** :
   - Renommez l'objet importé (clic droit > Rename)
   - Exemple : `HD5_Container_Base` (ce sera votre template)

---

## 🏗️ Phase 3 : Créer le Template (2-3 heures)

### Étape 3.1 : Créer un template "Transformateur + Containers"

**Objectif** : Créer un groupe réutilisable avec 1 Transformateur + 2 Containers HD5 + 1 Switchgear

1. **Placer le Transformateur** :
   - Importez `transformer.glb`
   - Position : X=0, Y=0.3, Z=0
   - Renommez : `Transformer`

2. **Placer les 2 Containers HD5** :
   - Importez `hd5_container.glb` (première fois)
   - Dupliquez-le (Ctrl+D ou Cmd+D)
   - Position Container A : X=-12, Y=0.3, Z=0
   - Position Container B : X=12, Y=0.3, Z=0
   - Renommez : `HD5_Container_A` et `HD5_Container_B`

3. **Placer le Switchgear** :
   - Importez `switchgear.glb`
   - Position : X=-4.5, Y=0.3, Z=0 (à gauche du transformateur)
   - Dupliquez et placez le second à X=4.5 (à droite)
   - Renommez : `Switchgear_L` et `Switchgear_R`

4. **Grouper le template** :
   - Sélectionnez tous les objets (Transformateur + 2 Containers + 2 Switchgears)
   - Clic droit > **"Group"** (ou Ctrl+G / Cmd+G)
   - Renommez le groupe : `Template_Transformer_Unit`

**Résultat** : Vous avez maintenant un template réutilisable !

### Étape 3.2 : Configurer les interactions

Pour chaque objet du template :

1. **Sélectionnez l'objet** (ex: `HD5_Container_A`)
2. **Ouvrez le panneau "Events"** (icône ⚡ à droite)
3. **Ajoutez un événement "Click"** :
   - Event: `onClick`
   - Action: `Set Variable` ou `Trigger Function`
   - Variable name: `selectedObject`
   - Value: `PB1_TR01_HD5_A` (vous pouvez utiliser des variables dynamiques)

**Note** : Spline permet d'exposer des variables que vous pouvez contrôler depuis React.

---

## 🔄 Phase 4 : Dupliquer le Template (1-2 heures)

### Étape 4.1 : Créer les 6 Transformateurs par Power Block

1. **Sélectionnez votre template** (`Template_Transformer_Unit`)
2. **Dupliquez-le 6 fois** (Ctrl+D / Cmd+D, 6 fois)
3. **Placez-les en ligne** :
   - Transformer 1 : Z = 0
   - Transformer 2 : Z = -20
   - Transformer 3 : Z = -40
   - Transformer 4 : Z = -60
   - Transformer 5 : Z = -80
   - Transformer 6 : Z = -100

4. **Groupez-les** : Sélectionnez les 6 templates > Group > Renommez : `PowerBlock_1_Transformers`

### Étape 4.2 : Créer les 4 Power Blocks

1. **Sélectionnez le groupe** `PowerBlock_1_Transformers`
2. **Dupliquez-le 4 fois**
3. **Placez-les horizontalement** :
   - Power Block 1 : X = -75
   - Power Block 2 : X = -25
   - Power Block 3 : X = 25
   - Power Block 4 : X = 75

4. **Groupez chaque Power Block** avec son Power Block 3D :
   - Importez `power_block.glb`
   - Placez-le au centre de chaque groupe de transformateurs
   - Groupez le tout : `PowerBlock_1`, `PowerBlock_2`, etc.

### Étape 4.3 : Placer la Substation

1. **Importez** `substation_200mw.glb`
2. **Position** : X=0, Y=0.5, Z=20 (devant les Power Blocks)
3. **Renommez** : `Substation_200MW`

---

## 🎨 Phase 5 : Configuration Visuelle (1 heure)

### Étape 5.1 : Matériaux et textures

Spline permet d'appliquer des matériaux directement :

1. **Sélectionnez un objet**
2. **Ouvrez le panneau "Material"** (icône 🎨 à droite)
3. **Configurez** :
   - Base Color : Couleur de base
   - Metallic : 0.7 (pour métal)
   - Roughness : 0.3 (pour métal brillant)
   - Ou importez vos textures existantes

**Astuce** : Créez des matériaux réutilisables dans la bibliothèque Spline.

### Étape 5.2 : Éclairage

1. **Ajoutez des lumières** :
   - Directional Light (soleil) : Y=100, rotation pour simuler le soleil du Qatar
   - Ambient Light : Pour éclairer les ombres

2. **Environnement** :
   - Ajoutez un "Environment" depuis la bibliothèque Spline
   - Choisissez un environnement désertique/sableux

### Étape 5.3 : Sol

1. **Ajoutez un plan** (Add > Plane)
2. **Dimensions** : 1000m × 1000m
3. **Position** : Y=0
4. **Matériau** : Texture de sable (ou couleur beige)
5. **Renommez** : `Ground`

---

## 📦 Phase 6 : Export React (30 minutes)

### Étape 6.1 : Préparer l'export

1. **Dans Spline** :
   - Cliquez sur **"Export"** (en haut à droite)
   - Sélectionnez **"React"**
   - Choisissez les options :
     - ✅ Include Spline Runtime
     - ✅ TypeScript (si vous utilisez TS)
     - ✅ Optimize for production

2. **Téléchargez le package** :
   - Spline génère un fichier `.splinecode` ou un package React
   - Sauvegardez-le dans votre projet

### Étape 6.2 : Installer le package Spline

```bash
npm install @splinetool/runtime
# ou
npm install @splinetool/react-spline
```

### Étape 6.3 : Intégrer dans Next.js

Voir le fichier `components/3d/SplineScene.tsx` (créé ci-dessous)

---

## 🔧 Phase 7 : Intégration avec vos Données (1-2 heures)

### Étape 7.1 : Connecter les événements

Spline expose des événements que vous pouvez écouter dans React :

```typescript
// Dans votre composant React
const handleSplineLoad = (spline: any) => {
  // Accéder aux objets de la scène
  const container = spline.findObjectByName('HD5_Container_A');
  
  // Écouter les clics
  container.addEventListener('click', () => {
    console.log('Container clicked!');
    // Mettre à jour votre état React
    setSelectedObject('PB1_TR01_HD5_A');
  });
};
```

### Étape 7.2 : Synchroniser avec vos KPIs

Vous pouvez mettre à jour la scène Spline depuis React :

```typescript
// Changer la couleur d'un container selon son statut
const updateContainerStatus = (containerId: string, status: string) => {
  const container = spline.findObjectByName(containerId);
  if (status === 'OK') {
    container.material.color = '#00ff00';
  } else if (status === 'Warning') {
    container.material.color = '#ffaa00';
  }
};
```

---

## 📊 Comparaison Avant/Après

### Avant (React Three Fiber)

```typescript
// 306 lignes de code juste pour calculer les positions
const getHD5Position = (pbIndex: number, trIndex: number, side: 'A' | 'B'): [number, number, number] => {
  const trPos = getTransformerPosition(pbIndex, trIndex);
  const offsetX = side === 'A' ? -CONTAINER_OFFSET_FROM_TRANSFORMER : CONTAINER_OFFSET_FROM_TRANSFORMER;
  return [trPos[0] + offsetX, trPos[1], trPos[2]];
};

// 781 lignes pour générer des textures procédurales
export function createBlackMetalTexture(size: number = 1024): THREE.Texture | undefined {
  // ... 100+ lignes de code complexe
}
```

### Après (Spline)

```typescript
// Juste importer et utiliser
import Spline from '@splinetool/react-spline';

<Spline 
  scene="https://prod.spline.design/your-scene.splinecode"
  onLoad={handleSplineLoad}
/>
```

**Gain de temps** : De plusieurs semaines à quelques jours !

---

## ✅ Checklist de Migration

- [ ] Compte Spline créé (Pro pour export React)
- [ ] Modèles Blender exportés en GLB
- [ ] Modèles importés dans Spline
- [ ] Template créé (1 Transformateur + 2 Containers + 2 Switchgears)
- [ ] Template dupliqué 24 fois
- [ ] 4 Power Blocks créés et positionnés
- [ ] Substation placée
- [ ] Éclairage et environnement configurés
- [ ] Interactions configurées (clics)
- [ ] Export React généré
- [ ] Package Spline installé dans Next.js
- [ ] Composant Spline intégré dans `pages/substation-3d.tsx`
- [ ] Événements connectés avec vos données
- [ ] Tests de performance effectués

---

## 🎯 Prochaines Étapes

1. **Testez d'abord avec 1 Power Block** avant de tout migrer
2. **Créez le template** une fois, puis dupliquez
3. **Documentez les noms d'objets** pour les utiliser dans React
4. **Testez les interactions** avant de connecter avec vos données

---

## 📚 Ressources

- **Documentation Spline** : https://docs.spline.design
- **Exemples React** : https://spline.design/examples
- **Communauté** : https://discord.gg/spline

---

## 💡 Astuces Pro

1. **Utilisez des variables Spline** pour rendre les positions dynamiques
2. **Créez des composants réutilisables** dans Spline (comme votre template)
3. **Optimisez les textures** : Utilisez des textures compressées pour de meilleures performances
4. **Testez sur mobile** : Spline est optimisé, mais vérifiez les performances

---

**Temps estimé total** : 8-12 heures (vs plusieurs semaines avec R3F manuel)

**Résultat** : Une scène 3D professionnelle, facilement modifiable, sans code complexe !
