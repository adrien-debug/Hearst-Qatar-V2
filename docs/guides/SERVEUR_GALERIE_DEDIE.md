# 🔀 SERVEUR GALERIE DÉDIÉ - PORT 3333

## ✅ Configuration Créée

La galerie 3D tourne maintenant sur un **serveur dédié** sur le port **3333** !

---

## 🎯 ARCHITECTURE

### 2 Serveurs Séparés

```
┌─────────────────────────────────────────┐
│ SERVEUR PRINCIPAL (Port 1111)           │
│                                         │
│ - Home (/)                              │
│ - Mining Dashboard                      │
│ - Infrastructure                        │
│ - Configurateur (/configurator)        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SERVEUR GALERIE (Port 3333)             │
│                                         │
│ - Galerie (/gallery)                    │
│ - Pages Modèles (/models/[id])         │
└─────────────────────────────────────────┘
```

---

## 🔧 FICHIERS CRÉÉS

### 1. `server-gallery.js`

Serveur Node.js dédié pour la galerie :
- Port : **3333**
- Routes : `/gallery` et `/models/[id]`
- Racine `/` → Redirige vers `/gallery`

### 2. Scripts NPM Mis à Jour

**Nouveau dans `package.json` :**
```json
"scripts": {
  "dev": "next dev -p 1111",           // Serveur principal
  "dev:gallery": "node server-gallery.js",  // Serveur galerie
  "dev:all": "concurrently \"npm run dev\" \"npm run dev:gallery\"",  // Les 2
  ...
}
```

---

## 🚀 COMMANDES

### Démarrer Seulement le Serveur Principal
```bash
npm run dev
```
**URL :** http://localhost:1111

**Pages disponibles :**
- Home
- Mining Dashboard
- Infrastructure
- Configurateur

### Démarrer Seulement la Galerie
```bash
npm run dev:gallery
```
**URL :** http://localhost:3333

**Pages disponibles :**
- Galerie (http://localhost:3333/gallery)
- Pages modèles (http://localhost:3333/models/antspace-hd5)

### Démarrer les 2 Serveurs
```bash
npm run dev:all
```

**URLs :**
- **Principal :** http://localhost:1111
- **Galerie :** http://localhost:3333

---

## 🔗 NAVIGATION ENTRE SERVEURS

### Option 1 : Liens Absolus

Mettre à jour les liens pour pointer vers le bon serveur :

```typescript
// Dans le serveur principal (1111)
<Link href="http://localhost:3333/gallery">
  Galerie 3D
</Link>

// Dans la galerie (3333)
<Link href="http://localhost:1111/">
  Retour Accueil
</Link>
```

### Option 2 : Variables d'Environnement

Créer `.env.local` :
```env
NEXT_PUBLIC_MAIN_URL=http://localhost:1111
NEXT_PUBLIC_GALLERY_URL=http://localhost:3333
```

Utiliser dans le code :
```typescript
const galleryUrl = process.env.NEXT_PUBLIC_GALLERY_URL;
<Link href={`${galleryUrl}/gallery`}>Galerie</Link>
```

---

## 📊 AVANTAGES

### Séparation
- ✅ **Galerie isolée** - Port dédié
- ✅ **Serveur principal** - Reste sur 1111
- ✅ **Indépendants** - Peuvent tourner séparément

### Performance
- ✅ **Charge répartie** - 2 serveurs
- ✅ **Isolation** - Erreurs isolées
- ✅ **Scalabilité** - Peut déployer séparément

### Développement
- ✅ **Flexibilité** - Démarrer ce qu'on veut
- ✅ **Debug** - Plus facile à isoler
- ✅ **Tests** - Tester indépendamment

---

## 🎯 URLS FINALES

### Serveur Principal (1111)
```
http://localhost:1111/                    → Home
http://localhost:1111/mining-dashboard    → Dashboard
http://localhost:1111/infrastructure      → Infrastructure
http://localhost:1111/configurator        → Configurateur
```

### Serveur Galerie (3333)
```
http://localhost:3333/                    → Galerie (racine)
http://localhost:3333/gallery             → Galerie
http://localhost:3333/models/antspace-hd5 → Page modèle
```

---

## 🔧 MODIFICATIONS À FAIRE

### 1. Mettre à Jour les Liens

**Dans `pages/index.tsx` :**
```typescript
<Link href="http://localhost:3333/gallery">
  Galerie de Modèles 3D
</Link>
```

**Dans `components/gallery/GalleryHeader.tsx` :**
```typescript
<Link href="http://localhost:1111/">
  ← Accueil
</Link>
```

**Dans `components/models/ModelInfoSidebar.tsx` :**
```typescript
<Link href="http://localhost:3333/gallery">
  ← Retour à la galerie
</Link>
```

### 2. Installer Concurrently (pour dev:all)

```bash
npm install --save-dev concurrently
```

---

## ✅ PROCHAINES ÉTAPES

### Immédiat
1. Installer concurrently
2. Mettre à jour les liens
3. Tester les 2 serveurs

### Voulez-vous que je :
- **Option A :** Mettre à jour tous les liens maintenant
- **Option B :** Créer un système avec variables d'environnement
- **Option C :** Garder tout sur 1111 finalement

**Quelle option préférez-vous ?** 🤔

---

**Date :** 15 Décembre 2025  
**Fichier créé :** `server-gallery.js`  
**Port galerie :** 3333  
**Status :** ✅ CONFIGURÉ (liens à mettre à jour)






