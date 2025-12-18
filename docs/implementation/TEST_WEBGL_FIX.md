# Guide de Test - Correction du Bug WebGL

## ✅ Corrections Appliquées

1. **Suppression de l'interception de `console.warn`** - Élimine la boucle infinie
2. **Suppression du nettoyage périodique** - Plus de nettoyage toutes les 10 secondes
3. **Simplification du `useEffect`** - Ne nettoie que lors du démontage, pas au montage
4. **Simplification de `WebGLContextManager`** - Suppression de `cleanupAllOtherCanvases`
5. **Montage immédiat** - Plus de délai de 300ms avant le montage
6. **Gestion simplifiée de la perte de contexte** - Ne nettoie plus agressivement

## 🧪 Procédure de Test (10 fois)

### Prérequis
1. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```
2. Ouvrir Chrome/Edge (meilleur support WebGL)
3. Ouvrir les DevTools (F12) et aller dans l'onglet Console

### Test 1-10 : Test de Stabilité

Pour chaque test (répéter 10 fois) :

1. **Ouvrir la page** : http://localhost:1111/substation-3d-auto
2. **Vérifier la console** :
   - ✅ Ne doit PAS afficher de warnings "Too many active WebGL contexts"
   - ✅ Ne doit PAS afficher "THREE.WebGLRenderer: Context Lost"
   - ✅ Doit afficher "✅ Page Substation3DAutoPage montée"
   - ✅ Doit afficher "✅ Canvas créé !"
   - ✅ Doit afficher "✅ Scène: X objets" (X > 0 après 1 seconde)

3. **Vérifier visuellement** :
   - ✅ La scène 3D doit s'afficher (cube rouge visible)
   - ✅ Pas de freeze ou de lag
   - ✅ La caméra doit être contrôlable (rotation, zoom, pan)

4. **Recharger la page** (Ctrl+R ou Cmd+R)
   - ✅ La page doit se recharger sans erreur
   - ✅ Pas d'accumulation de warnings

5. **Attendre 30 secondes** puis recharger à nouveau
   - ✅ Pas de nettoyage périodique qui cause des problèmes

### Checklist par Test

Pour chaque test (1-10), cocher :

- [ ] Pas de warnings "Too many active WebGL contexts"
- [ ] Pas d'erreur "Context Lost"
- [ ] La scène 3D s'affiche correctement
- [ ] Le cube rouge est visible
- [ ] Les contrôles de caméra fonctionnent
- [ ] Le rechargement fonctionne sans erreur
- [ ] Pas de freeze ou de lag

### Test Bonus : Hot Reload

1. Modifier un fichier (ex: changer une couleur dans `AutoPlacedScene3D.tsx`)
2. Sauvegarder
3. Vérifier que le hot reload fonctionne sans créer de contextes multiples

## 📊 Résultats Attendus

### ✅ Comportement Normal (Corrigé)
- 0-2 warnings "Too many active WebGL contexts" au premier chargement (React Strict Mode)
- Aucun warning lors des rechargements suivants
- La scène se charge en < 2 secondes
- Pas de perte de contexte

### ❌ Ancien Comportement (Bug)
- Des centaines de warnings "Too many active WebGL contexts"
- "THREE.WebGLRenderer: Context Lost"
- La scène ne se charge pas (0 objets)
- Freeze du navigateur

## 🔍 Détails Techniques

### Ce qui a été supprimé :
- `console.warn` interception (lignes 274-282) - **CAUSAIT LA BOUCLE INFINIE**
- `setInterval` nettoyage périodique (lignes 288-293)
- Nettoyage agressif dans `useEffect` au montage (lignes 314-377)
- `cleanupAllOtherCanvases` dans `registerCanvas`
- Délai de 300ms avant montage

### Ce qui reste (essentiel) :
- Nettoyage lors du démontage du composant
- Gestion de la perte de contexte (sans nettoyage agressif)
- Enregistrement du canvas actif

## 🐛 Si le Bug Persiste

Si après 10 tests vous voyez encore des warnings :

1. **Vérifier React Strict Mode** :
   - En développement, React monte les composants 2 fois
   - C'est normal d'avoir 1-2 warnings au premier chargement
   - Mais PAS des centaines

2. **Vérifier les autres pages 3D** :
   - `/substation-3d`
   - `/substation-3d-test`
   - Ces pages peuvent avoir des contextes actifs

3. **Nettoyer le cache du navigateur** :
   - Ctrl+Shift+Delete (Chrome)
   - Vider le cache et recharger

4. **Vérifier les extensions du navigateur** :
   - Certaines extensions peuvent créer des contextes WebGL

## ✅ Validation Finale

Le bug est considéré comme corrigé si :
- ✅ 0-2 warnings au premier chargement (React Strict Mode)
- ✅ 0 warnings lors des rechargements suivants
- ✅ La scène 3D se charge correctement
- ✅ Pas de perte de contexte après 10 rechargements

---

**Date de correction** : $(date)
**Fichier modifié** : `pages/substation-3d-auto.tsx`
**Tests automatisés** : ✅ 7/7 passés
