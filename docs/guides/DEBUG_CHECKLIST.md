# 🔍 Checklist de Débogage - Rien ne s'affiche

## ✅ Étapes de Vérification

### 1. Vérifier que le serveur fonctionne

```bash
npm run dev
```

Vous devriez voir :
```
✓ Ready in Xs
○ Compiling /substation-3d-auto ...
✓ Compiled in Xs
```

### 2. Tester la page simple

Visitez : **`http://localhost:1111/substation-3d-test-simple`**

**Si cette page fonctionne** (cube rouge visible) :
- Le Canvas fonctionne
- Le problème vient de `substation-3d-auto.tsx` ou `AutoPlacedScene3D.tsx`

**Si cette page ne fonctionne pas** :
- Problème avec React Three Fiber ou WebGL
- Vérifiez la console du navigateur (F12)

### 3. Vérifier la console du navigateur

Ouvrez les DevTools (F12) et regardez :

**Onglet Console** :
- ❌ Erreurs en rouge ?
- ✅ Messages "✅ Canvas créé !" ?
- ✅ Messages "✅ Page montée" ?

**Onglet Network** :
- ❌ Fichiers qui échouent à charger ?
- ✅ Tous les fichiers chargés (200 OK) ?

### 4. Vérifier que la page se charge

Dans la console, tapez :
```javascript
console.log('Test');
```

Si ça fonctionne, JavaScript fonctionne.

### 5. Vérifier WebGL

Dans la console, tapez :
```javascript
const canvas = document.querySelector('canvas');
const gl = canvas?.getContext('webgl') || canvas?.getContext('webgl2');
console.log('WebGL:', gl ? '✅ Disponible' : '❌ Non disponible');
```

### 6. Vérifier les imports

Ouvrez `pages/substation-3d-auto.tsx` et vérifiez que tous les imports sont corrects :
- `AutoPlacedScene3D` existe ?
- `SceneLighting` existe ?
- `SandyGround` existe ?

---

## 🐛 Problèmes Courants

### Problème : Canvas blanc/vide

**Solutions** :
1. Vérifiez la console pour les erreurs
2. Testez la page simple : `/substation-3d-test-simple`
3. Vérifiez que WebGL est disponible

### Problème : Erreur "Cannot read property..."

**Solution** : Un composant n'est pas importé correctement
- Vérifiez tous les imports
- Vérifiez que les fichiers existent

### Problème : Erreur WebGL

**Solutions** :
1. Redémarrez le navigateur
2. Vérifiez que WebGL est activé
3. Essayez un autre navigateur

### Problème : Page ne se charge pas

**Solutions** :
1. Vérifiez que le serveur tourne (`npm run dev`)
2. Vérifiez l'URL : `http://localhost:1111/substation-3d-auto`
3. Vérifiez la console pour les erreurs de compilation

---

## 📋 Checklist Rapide

- [ ] Serveur lancé (`npm run dev`)
- [ ] Page `/substation-3d-test-simple` testée
- [ ] Console du navigateur ouverte (F12)
- [ ] Aucune erreur dans la console
- [ ] WebGL disponible (test dans console)
- [ ] Tous les imports corrects
- [ ] Canvas visible dans le DOM (inspecteur)

---

## 🎯 Prochaines Étapes

1. **Testez d'abord** : `/substation-3d-test-simple`
2. **Si ça fonctionne** : Le problème vient de `substation-3d-auto.tsx`
3. **Si ça ne fonctionne pas** : Problème avec React Three Fiber ou WebGL

**Dites-moi ce que vous voyez dans la console !**
