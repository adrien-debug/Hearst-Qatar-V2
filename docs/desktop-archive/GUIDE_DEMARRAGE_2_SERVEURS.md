# 🚀 GUIDE DE DÉMARRAGE - 2 SERVEURS INDÉPENDANTS

## 📋 Vue d'Ensemble

Le projet Hearst Qatar est maintenant divisé en **2 serveurs totalement indépendants** :

| Serveur | Port | Fonction | Dossier |
|---------|------|----------|---------|
| **Main** | 1111 | Dashboard & Monitoring | `Hearst Qatar Main/` |
| **Infrastructure 3D** | 3333 | Galerie 3D & Modèles | `Hearst Qatar Infrastructure 3D/` |

---

## 🎯 DÉMARRAGE RAPIDE

### Option 1 : Développement Local (2 terminaux)

**Terminal 1 - Serveur Main**
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
npm install
npm run dev
```
✅ Serveur Main disponible sur **http://localhost:1111**

**Terminal 2 - Serveur Infrastructure 3D**
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
npm install
npm run dev
```
✅ Serveur Infrastructure 3D disponible sur **http://localhost:3333**

---

## 🌐 URLS DISPONIBLES

### Serveur Main (1111)
- **http://localhost:1111/** - Dashboard Exécutif
- **http://localhost:1111/mining-dashboard** - Mining Dashboard
- **http://localhost:1111/infrastructure** - Infrastructure Monitoring
- **http://localhost:1111/configurator** - Configurateur 3D

### Serveur Infrastructure 3D (3333)
- **http://localhost:3333/** - Galerie (racine)
- **http://localhost:3333/gallery** - Galerie de Modèles 3D
- **http://localhost:3333/models/antspace-hd5** - Modèle Antspace HD5
- **http://localhost:3333/models/pt-substation-ultra** - Transformateur
- **http://localhost:3333/models/dt-renewable-ultra** - Distribution
- **http://localhost:3333/models/hydro-cooling-system** - Refroidissement

---

## 🔗 NAVIGATION CROSS-SERVEUR

Les deux serveurs communiquent entre eux :

### Du Main vers Infrastructure 3D
- Cliquer sur "3D Models Gallery" sur la page d'accueil
- Cliquer sur "📦 Galerie" dans le configurateur

### De Infrastructure 3D vers Main
- Cliquer sur "← Accueil" dans la galerie
- Cliquer sur "Nouveau Projet" pour ouvrir le configurateur

---

## ⚙️ CONFIGURATION

### Variables d'Environnement

Les deux serveurs ont un fichier `.env.local` :

**Hearst Qatar Main/.env.local**
```env
NEXT_PUBLIC_MAIN_URL=http://localhost:1111
NEXT_PUBLIC_GALLERY_URL=http://localhost:3333
```

**Hearst Qatar Infrastructure 3D/.env.local**
```env
NEXT_PUBLIC_MAIN_URL=http://localhost:1111
NEXT_PUBLIC_GALLERY_URL=http://localhost:3333
```

### Pour Production

Remplacer les URLs par les IPs réelles :
```env
NEXT_PUBLIC_MAIN_URL=http://192.168.1.10:1111
NEXT_PUBLIC_GALLERY_URL=http://192.168.1.20:3333
```

---

## 🚀 DÉPLOIEMENT PRODUCTION

### Serveur 1 - Main (192.168.1.10)

```bash
# 1. Transférer les fichiers
scp -r "Hearst Qatar Main" user@192.168.1.10:/var/www/

# 2. Se connecter au serveur
ssh user@192.168.1.10

# 3. Installer et démarrer
cd /var/www/Hearst\ Qatar\ Main
npm install
npm run build

# 4. Démarrer avec PM2
pm2 start npm --name "hearst-main" -- start
pm2 save
pm2 startup
```

### Serveur 2 - Infrastructure 3D (192.168.1.20)

```bash
# 1. Transférer les fichiers
scp -r "Hearst Qatar Infrastructure 3D" user@192.168.1.20:/var/www/

# 2. Se connecter au serveur
ssh user@192.168.1.20

# 3. Installer et démarrer
cd /var/www/Hearst\ Qatar\ Infrastructure\ 3D
npm install
npm run build

# 4. Démarrer avec PM2
pm2 start npm --name "hearst-infrastructure-3d" -- start
pm2 save
pm2 startup
```

---

## 🔧 MAINTENANCE

### Mettre à jour le Serveur Main (sans toucher Infrastructure 3D)

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
# Faire vos modifications...
git add .
git commit -m "Update main server"
npm run build

# Déployer uniquement sur Serveur 1
scp -r . user@192.168.1.10:/var/www/Hearst\ Qatar\ Main/
ssh user@192.168.1.10 "cd /var/www/Hearst\ Qatar\ Main && npm install && npm run build && pm2 restart hearst-main"
```

### Mettre à jour Infrastructure 3D (sans toucher Main)

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
# Faire vos modifications...
git add .
git commit -m "Update infrastructure 3D"
npm run build

# Déployer uniquement sur Serveur 2
scp -r . user@192.168.1.20:/var/www/Hearst\ Qatar\ Infrastructure\ 3D/
ssh user@192.168.1.20 "cd /var/www/Hearst\ Qatar\ Infrastructure\ 3D && npm install && npm run build && pm2 restart hearst-infrastructure-3d"
```

---

## 📊 DIFFÉRENCES ENTRE LES SERVEURS

### Serveur Main
- ✅ Pages dashboard
- ✅ Monitoring
- ✅ Configurateur
- ❌ Pas de galerie
- ❌ Pas de modèles 3D lourds
- **Taille:** ~50-100 MB

### Serveur Infrastructure 3D
- ✅ Galerie 3D
- ✅ Pages modèles
- ✅ Modèles 3D (.glb)
- ❌ Pas de dashboard
- ❌ Pas de monitoring
- **Taille:** ~500 MB - 2 GB

---

## 🔐 SÉCURITÉ

### Firewall

**Serveur 1 (Main)**
```bash
sudo ufw allow 1111/tcp
sudo ufw enable
```

**Serveur 2 (Infrastructure 3D)**
```bash
sudo ufw allow 3333/tcp
sudo ufw enable
```

### CORS (si nécessaire)

Ajouter dans `next.config.js` des deux serveurs :

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        ],
      },
    ];
  },
};
```

---

## 🐛 DÉPANNAGE

### Serveur Main ne démarre pas
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
rm -rf .next node_modules
npm install
npm run dev
```

### Serveur Infrastructure 3D ne démarre pas
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
rm -rf .next node_modules
npm install
npm run dev
```

### Les liens cross-serveur ne fonctionnent pas
Vérifier les `.env.local` dans les deux projets :
```bash
# Serveur Main
cat "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main/.env.local"

# Serveur Infrastructure 3D
cat "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/.env.local"
```

### Port déjà utilisé
```bash
# Trouver le processus sur le port 1111
lsof -i :1111
kill -9 [PID]

# Trouver le processus sur le port 3333
lsof -i :3333
kill -9 [PID]
```

---

## 📝 CHECKLIST DE DÉPLOIEMENT

### Avant le déploiement
- [ ] Les deux serveurs démarrent localement
- [ ] La navigation cross-serveur fonctionne
- [ ] Les `.env.local` sont configurés
- [ ] Les builds passent sans erreur
- [ ] Les tests sont OK

### Déploiement
- [ ] Serveur 1 déployé et accessible
- [ ] Serveur 2 déployé et accessible
- [ ] URLs de production configurées dans `.env.local`
- [ ] Navigation cross-serveur fonctionne en production
- [ ] PM2 configuré sur les deux serveurs
- [ ] Firewall configuré
- [ ] Backups en place

---

## 🎯 COMMANDES UTILES

### Logs PM2
```bash
# Serveur Main
pm2 logs hearst-main

# Serveur Infrastructure 3D
pm2 logs hearst-infrastructure-3d
```

### Redémarrer
```bash
# Serveur Main
pm2 restart hearst-main

# Serveur Infrastructure 3D
pm2 restart hearst-infrastructure-3d
```

### Status
```bash
pm2 status
```

### Monitoring
```bash
pm2 monit
```

---

## ✅ AVANTAGES DE CETTE ARCHITECTURE

1. **Indépendance Totale**
   - Chaque serveur fonctionne seul
   - Panne d'un serveur n'affecte pas l'autre

2. **Mises à Jour Séparées**
   - Mettre à jour Main sans toucher Infrastructure 3D
   - Tester en isolation

3. **Performance**
   - Serveur Main ultra-rapide (pas de 3D)
   - Serveur Infrastructure 3D optimisé pour 3D

4. **Scalabilité**
   - Peut ajouter plus de serveurs Infrastructure 3D
   - Load balancing possible

5. **Sécurité**
   - Isolation des serveurs
   - Permissions différentes

---

## 📞 SUPPORT

Pour toute question ou problème :
1. Consulter les README locaux dans chaque dossier
2. Vérifier les logs PM2
3. Vérifier la configuration `.env.local`

---

**Date de création:** 15 Décembre 2025  
**Version:** 1.0.0  
**Statut:** ✅ Production Ready  
**Architecture:** 2 Serveurs Indépendants






