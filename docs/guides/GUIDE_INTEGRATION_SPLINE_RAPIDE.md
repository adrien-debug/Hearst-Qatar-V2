# 🚀 Guide Rapide - Intégrer votre Scène Spline

## Étape 1 : Obtenir l'URL de votre scène Spline

1. **Connectez-vous** à [Spline](https://app.spline.design/home)
2. **Ouvrez votre scène** (ou créez-en une nouvelle)
3. **Cliquez sur "Export"** (bouton en haut à droite)
4. **Sélectionnez "React"** ou "Code"
5. **Copiez l'URL** qui ressemble à :
   ```
   https://prod.spline.design/votre-scene-id.splinecode
   ```

## Étape 2 : Intégrer l'URL dans votre projet

### Option A : Via l'interface (Recommandé)
1. Lancez votre serveur : `npm run dev`
2. Allez sur : `http://localhost:1111/substation-3d-spline`
3. Une modal s'affichera automatiquement si l'URL n'est pas configurée
4. Collez votre URL Spline dans le champ
5. Cliquez sur "Charger la scène"

### Option B : Via le fichier .env.local
1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez :
   ```
   NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/votre-scene-id.splinecode
   ```
3. Redémarrez le serveur : `npm run dev`

### Option C : Directement dans le code
1. Ouvrez `pages/substation-3d-spline.tsx`
2. Remplacez la ligne 18 :
   ```typescript
   const SPLINE_SCENE_URL = 'https://prod.spline.design/votre-scene-id.splinecode';
   ```

## ✅ Vérification

Une fois l'URL configurée, votre scène 3D devrait s'afficher automatiquement sur :
`http://localhost:1111/substation-3d-spline`

## 📋 Checklist des noms d'objets dans Spline

Pour que les interactions fonctionnent correctement, assurez-vous que vos objets dans Spline portent les noms suivants :

- `Substation_200MW`
- `PowerBlock_1`, `PowerBlock_2`, `PowerBlock_3`, `PowerBlock_4`
- `PB1_TR01_Transformer`, `PB1_TR02_Transformer`, etc.
- `PB1_TR01_HD5_A`, `PB1_TR01_HD5_B`, etc.
- `PB1_SG_01_L`, `PB1_SG_01_R`, etc.

Consultez `data/splineSceneData.ts` pour la liste complète des noms attendus.

## 🎯 Positions des objets

Toutes les positions exactes sont définies dans `data/splineSceneData.ts`. 
Vous pouvez utiliser ces données pour placer vos objets dans Spline.

## 🆘 Aide

Si vous rencontrez des problèmes :
1. Vérifiez que l'URL est correcte (doit se terminer par `.splinecode`)
2. Vérifiez la console du navigateur pour les erreurs
3. Assurez-vous que votre scène Spline est bien publiée/exportée











