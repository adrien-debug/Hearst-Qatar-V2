# Installation Spline - Guide Rapide

## 📦 Installation du Package

### Étape 1 : Installer le package Spline

```bash
npm install @splinetool/react-spline
```

Ou avec yarn :

```bash
yarn add @splinetool/react-spline
```

### Étape 2 : Vérifier l'installation

Le package devrait apparaître dans votre `package.json` :

```json
{
  "dependencies": {
    "@splinetool/react-spline": "^2.x.x"
  }
}
```

---

## 🚀 Utilisation Rapide

### Option 1 : Utiliser le composant SplineScene (Recommandé)

Le composant `SplineScene.tsx` est déjà créé et prêt à l'emploi :

```typescript
import SplineScene from '../components/3d/SplineScene';

<SplineScene 
  sceneUrl="https://prod.spline.design/your-scene-id.splinecode"
  onObjectClick={handleObjectClick}
  selectedObject={selectedObject}
/>
```

### Option 2 : Utiliser directement @splinetool/react-spline

```typescript
import Spline from '@splinetool/react-spline';

<Spline 
  scene="https://prod.spline.design/your-scene-id.splinecode"
  onLoad={handleLoad}
/>
```

---

## 📝 Mise à jour de package.json

Après installation, votre `package.json` devrait ressembler à :

```json
{
  "dependencies": {
    "@react-three/drei": "^9.88.0",
    "@react-three/fiber": "^8.15.0",
    "@splinetool/react-spline": "^2.x.x",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "three": "^0.182.0"
  }
}
```

**Note** : Vous pouvez garder `@react-three/fiber` et `three` si vous avez d'autres composants 3D, ou les supprimer si vous migrez complètement vers Spline.

---

## 🔧 Configuration TypeScript

Si vous utilisez TypeScript, les types sont inclus dans le package. Aucune configuration supplémentaire nécessaire.

---

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. **Installez le package** :
   ```bash
   npm install @splinetool/react-spline
   ```

2. **Testez avec la page d'exemple** :
   - Ouvrez `pages/substation-3d-spline.tsx`
   - Remplacez `SPLINE_SCENE_URL` par l'URL de votre scène Spline
   - Lancez `npm run dev`
   - Visitez `http://localhost:1111/substation-3d-spline`

3. **Vérifiez la console** :
   - Vous devriez voir "✅ Scène Spline chargée" dans la console
   - La scène 3D devrait s'afficher

---

## 🐛 Dépannage

### Erreur : "Cannot find module '@splinetool/react-spline'"

**Solution** :
```bash
npm install @splinetool/react-spline
# ou
yarn add @splinetool/react-spline
```

### Erreur : "Module not found" après installation

**Solution** :
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur SSR (Server-Side Rendering)

**Solution** : Le composant `SplineScene.tsx` utilise déjà `dynamic` pour éviter les problèmes SSR. Si vous utilisez directement `@splinetool/react-spline`, utilisez :

```typescript
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});
```

---

## 📚 Documentation

- **Package npm** : https://www.npmjs.com/package/@splinetool/react-spline
- **Documentation Spline** : https://docs.spline.design
- **Exemples** : https://spline.design/examples

---

## 🎯 Prochaines Étapes

1. ✅ Installer le package (voir ci-dessus)
2. ✅ Créer votre scène dans Spline (voir `GUIDE_MIGRATION_SPLINE.md`)
3. ✅ Exporter votre scène et obtenir l'URL
4. ✅ Utiliser `SplineScene` dans votre page
5. ✅ Tester et ajuster

---

**Temps d'installation** : 2-3 minutes

**Résultat** : Prêt à utiliser Spline dans votre projet Next.js !
