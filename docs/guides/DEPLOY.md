# 🚀 Guide de Déploiement - Hearst Qatar

## ✅ Build de Production

Le build de production est prêt ! Toutes les pages compilent correctement.

## 📦 Préparation du Déploiement

### 1. Variables d'Environnement

Créez un fichier `.env.production` ou configurez les variables dans votre plateforme de déploiement :

```env
# URL de la scène Spline (optionnel)
NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/votre-scene-id.splinecode
```

### 2. Build Local

Pour tester le build localement :

```bash
npm run build
npm run start
```

L'application sera accessible sur `http://localhost:1111`

### 3. Déploiement sur Vercel

Le projet est déjà configuré pour Vercel avec `vercel.json`.

**Option A : Via l'interface Vercel**
1. Connectez-vous à [vercel.com](https://vercel.com)
2. Importez votre projet GitHub
3. Vercel détectera automatiquement Next.js
4. Ajoutez les variables d'environnement si nécessaire
5. Déployez !

**Option B : Via CLI**
```bash
npm i -g vercel
vercel
```

### 4. Déploiement sur Autres Plateformes

#### Netlify
- Framework : Next.js
- Build command : `npm run build`
- Publish directory : `.next`

#### Railway / Render
- Build command : `npm install && npm run build`
- Start command : `npm run start`

## 📊 Statistiques du Build

- **Pages statiques** : 12 pages
- **Taille totale** : ~1.1 MB (First Load JS)
- **Page Spline** : 95.2 kB (optimisée)

## 🔧 Configuration Requise

- **Node.js** : >= 18.0.0
- **Next.js** : 14.2.35
- **Port** : 1111 (configurable)

## ✅ Checklist de Déploiement

- [x] Build de production réussi
- [x] Toutes les pages compilent sans erreur
- [x] Configuration Vercel présente
- [ ] Variables d'environnement configurées (si nécessaire)
- [ ] URL Spline configurée (si utilisée)
- [ ] Tests de production effectués

## 🎯 Pages Disponibles

- `/` - Overview
- `/dashboard` - Dashboard détaillé
- `/hardware` - Visualisation matériel
- `/electrical` - Schéma électrique
- `/substation-3d-spline` - Visualisation 3D Spline
- `/substation-3d-auto` - Visualisation 3D automatique
- Et plus...

## 🆘 Dépannage

Si vous rencontrez des problèmes lors du déploiement :

1. **Vérifiez les variables d'environnement**
2. **Assurez-vous que Node.js >= 18**
3. **Vérifiez les logs de build**
4. **Testez localement avec `npm run build && npm run start`**











