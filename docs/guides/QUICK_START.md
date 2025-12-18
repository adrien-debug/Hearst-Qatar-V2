# Guide de Démarrage Rapide - Visualisation 3D

## 🚀 Démarrage en 3 étapes

### 1. Installation
```bash
npm install
```

### 2. Lancement
```bash
npm run dev
```

### 3. Accès
Ouvrir votre navigateur sur : **http://localhost:1111/substation-3d**

## 🎮 Contrôles

| Action | Contrôle |
|--------|----------|
| **Rotation** | Clic gauche + glisser |
| **Translation** | Clic droit + glisser |
| **Zoom** | Molette de la souris |
| **Sélection** | Clic sur un objet 3D |
| **Fermer info** | Clic sur le bouton "Fermer" |

## 📊 Structure affichée

La visualisation montre :
- ✅ **1 Substation 200 MW** (en haut)
- ✅ **4 Power Blocks** (alignés horizontalement)
- ✅ **24 Transformateurs** (6 par Power Block)
- ✅ **24 Switchgears** (1 par transformateur)
- ✅ **48 Containers HD5** (2 par transformateur)

**Total : 97 éléments modélisés**

## 🎨 Fonctionnalités

### Version actuelle (Procédurale)
- ✅ Génération en temps réel des éléments 3D
- ✅ Interactions complètes (clic, hover, sélection)
- ✅ Contrôles de caméra fluides
- ✅ Panneaux d'information
- ✅ Éclairage optimisé
- ✅ Grille de référence

### Version future (Modèle Blender)
Une fois le modèle exporté depuis Blender :
- Placez le fichier dans : `public/models/substation_200MW_schema.glb`
- Le modèle GLB remplacera automatiquement la version procédurale

## 🔧 Personnalisation

### Activer la rotation automatique
Dans `pages/substation-3d.tsx`, modifier :
```tsx
<SceneControls
  autoRotate={true}  // ← Changer à true
  autoRotateSpeed={0.5}
/>
```

### Changer l'environnement
Dans `pages/substation-3d.tsx`, modifier :
```tsx
<Environment preset="sunset" />  // Options: sunset, city, park, etc.
```

### Masquer la grille
Dans `pages/substation-3d.tsx`, commenter :
```tsx
{/* <SceneGridHelper /> */}
```

## 📁 Structure des fichiers

```
components/3d/
├── Substation3D.tsx      # Composant principal
├── PowerBlock3D.tsx     # Power Block
├── Transformer3D.tsx     # Transformateur
├── HD5Container3D.tsx    # Container HD5
├── SceneControls.tsx     # Contrôles caméra
├── Lighting.tsx          # Éclairage
└── GridHelper.tsx        # Grille et axes

pages/
└── substation-3d.tsx     # Page principale

utils/
└── 3dHelpers.ts          # Utilitaires 3D
```

## 🐛 Dépannage

### Le modèle ne s'affiche pas
1. Vérifier la console du navigateur (F12)
2. Vérifier que les dépendances sont installées : `npm install`
3. Vérifier que le serveur tourne : `npm run dev`

### Performances médiocres
1. Réduire le nombre d'objets affichés
2. Utiliser l'instancing pour les éléments répétitifs
3. Activer le frustum culling

### Erreurs TypeScript
Les erreurs JSX sont normales lors de la vérification TypeScript directe.
Next.js gère automatiquement la compilation JSX.

## 📚 Documentation complète

- **Guide détaillé** : `GUIDE_3D.md`
- **Checklist Blender** : `BLENDER_CHECKLIST.md`
- **Résumé implémentation** : `IMPLEMENTATION_SUMMARY.md`
- **Documentation composants** : `components/3d/README.md`

## 🎯 Prochaines étapes

1. ✅ **Tester la visualisation** - C'est fait !
2. ⏳ **Modéliser dans Blender** - Suivre `BLENDER_CHECKLIST.md`
3. ⏳ **Exporter le modèle GLB** - Vers `public/models/`
4. ⏳ **Optimiser les performances** - LOD, instancing, etc.

## 💡 Astuces

- Utilisez la molette pour zoomer rapidement
- Cliquez sur différents éléments pour voir leurs informations
- La grille aide à comprendre l'échelle (chaque carré = 10m)
- Les axes montrent l'orientation (Rouge=X, Vert=Y, Bleu=Z)

---

**Prêt à explorer ! 🚀**
