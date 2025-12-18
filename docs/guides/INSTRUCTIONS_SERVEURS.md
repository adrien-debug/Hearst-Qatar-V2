# 🚀 INSTRUCTIONS - 2 SERVEURS

## 🎯 CONFIGURATION FINALE

Le système utilise maintenant **2 serveurs séparés** :

---

## 🖥️ SERVEURS

### Serveur Principal (Port 1111)
```bash
npm run dev
```

**URL :** http://localhost:1111

**Pages :**
- `/` - Home (dashboard)
- `/mining-dashboard` - Dashboard mining
- `/infrastructure` - Infrastructure
- `/configurator` - Configurateur 3D

---

### Serveur Galerie (Port 3333)
```bash
npm run dev:gallery
```

**URL :** http://localhost:3333

**Pages :**
- `/` - Galerie (racine redirige vers /gallery)
- `/gallery` - Galerie de modèles
- `/models/[id]` - Pages dédiées par modèle

---

## 🔗 LIENS À METTRE À JOUR

### Dans le Serveur Principal (1111)

**Fichier : `pages/index.tsx`**

Remplacer :
```typescript
<Link href="/gallery">
```

Par :
```typescript
<Link href="http://localhost:3333/gallery">
```

---

### Dans la Galerie (3333)

**Fichier : `components/gallery/GalleryHeader.tsx`**

Remplacer :
```typescript
<Link href="/">
```

Par :
```typescript
<Link href="http://localhost:1111/">
```

**Fichier : `components/gallery/GalleryHeader.tsx`**

Remplacer :
```typescript
<Link href="/configurator">
```

Par :
```typescript
<Link href="http://localhost:1111/configurator">
```

**Fichier : `components/models/ModelInfoSidebar.tsx`**

Lien "Retour à la galerie" reste :
```typescript
<Link href="/gallery">  // OK car même serveur
```

---

## 🎯 URLS FINALES

### Serveur Principal
- http://localhost:1111/ - Home
- http://localhost:1111/configurator - Configurateur
- http://localhost:1111/mining-dashboard - Dashboard
- http://localhost:1111/infrastructure - Infrastructure

### Serveur Galerie
- http://localhost:3333/ - Galerie (racine)
- http://localhost:3333/gallery - Galerie
- http://localhost:3333/models/antspace-hd5 - Modèle
- http://localhost:3333/models/pt-substation-ultra - Modèle

---

## ✅ AVANTAGES

### Isolation
- ✅ Galerie séparée du reste
- ✅ Peut redémarrer indépendamment
- ✅ Erreurs isolées

### Performance
- ✅ Charge répartie sur 2 serveurs
- ✅ Preview 3D n'impactent pas le principal
- ✅ Meilleure scalabilité

### Développement
- ✅ Peut travailler sur la galerie sans toucher au reste
- ✅ Déploiement séparé possible
- ✅ Tests isolés

---

## 🚀 DÉMARRAGE RAPIDE

### Étape 1 : Démarrer les Serveurs

**Terminal 1 :**
```bash
npm run dev
```

**Terminal 2 :**
```bash
npm run dev:gallery
```

### Étape 2 : Tester

**Serveur Principal :**
- Ouvrir http://localhost:1111/

**Serveur Galerie :**
- Ouvrir http://localhost:3333/gallery

---

## 📝 TODO

Pour finaliser la séparation :

1. ✅ Serveur galerie créé (`server-gallery.js`)
2. ✅ Script NPM ajouté (`dev:gallery`)
3. ⏳ Mettre à jour les liens entre serveurs
4. ⏳ Tester la navigation cross-serveur

**Voulez-vous que je mette à jour les liens maintenant ?**

---

**Date :** 15 Décembre 2025  
**Port principal :** 1111  
**Port galerie :** 3333  
**Status :** ✅ CONFIGURÉ






