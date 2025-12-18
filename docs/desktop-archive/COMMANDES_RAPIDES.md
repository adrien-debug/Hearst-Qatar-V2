# ⚡ COMMANDES RAPIDES - 2 SERVEURS

## 🚀 DÉMARRAGE RAPIDE

### Développement Local

```bash
# Terminal 1 - Serveur Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
npm install
npm run dev

# Terminal 2 - Serveur Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
npm install
npm run dev
```

**URLs:**
- Main: http://localhost:1111
- Infrastructure 3D: http://localhost:3333

---

## 📦 INSTALLATION

### Première Installation

```bash
# Serveur Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
npm install

# Serveur Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
npm install
```

### Réinstallation Complète

```bash
# Serveur Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
rm -rf node_modules .next
npm install

# Serveur Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
rm -rf node_modules .next
npm install
```

---

## 🏗️ BUILD

### Build pour Production

```bash
# Serveur Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
npm run build

# Serveur Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
npm run build
```

### Démarrer en Production

```bash
# Serveur Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
npm start

# Serveur Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
npm start
```

---

## 🔧 PM2 (Production)

### Démarrer avec PM2

```bash
# Serveur Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
pm2 start npm --name "hearst-main" -- start

# Serveur Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
pm2 start npm --name "hearst-infrastructure-3d" -- start

# Sauvegarder la configuration
pm2 save
pm2 startup
```

### Gérer PM2

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs hearst-main
pm2 logs hearst-infrastructure-3d

# Redémarrer
pm2 restart hearst-main
pm2 restart hearst-infrastructure-3d

# Arrêter
pm2 stop hearst-main
pm2 stop hearst-infrastructure-3d

# Supprimer
pm2 delete hearst-main
pm2 delete hearst-infrastructure-3d

# Monitoring
pm2 monit
```

---

## 🌐 DÉPLOIEMENT

### Transférer vers Serveur

```bash
# Serveur Main → Machine 1
scp -r "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main" user@192.168.1.10:/var/www/

# Infrastructure 3D → Machine 2
scp -r "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D" user@192.168.1.20:/var/www/
```

### Déploiement Complet

```bash
# Sur Serveur 1 (Main)
ssh user@192.168.1.10
cd /var/www/Hearst\ Qatar\ Main
npm install
npm run build
pm2 start npm --name "hearst-main" -- start
pm2 save

# Sur Serveur 2 (Infrastructure 3D)
ssh user@192.168.1.20
cd /var/www/Hearst\ Qatar\ Infrastructure\ 3D
npm install
npm run build
pm2 start npm --name "hearst-infrastructure-3d" -- start
pm2 save
```

---

## 🔍 VÉRIFICATIONS

### Vérifier les Ports

```bash
# Port 1111 (Main)
lsof -i :1111

# Port 3333 (Infrastructure 3D)
lsof -i :3333

# Tuer un processus
kill -9 [PID]
```

### Vérifier les URLs

```bash
# Main
curl http://localhost:1111

# Infrastructure 3D
curl http://localhost:3333
```

### Vérifier les Fichiers

```bash
# Vérifier que gallery.tsx n'existe PAS dans Main
test -f "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main/pages/gallery.tsx" && echo "❌ ERREUR" || echo "✅ OK"

# Vérifier que gallery.tsx existe dans Infrastructure 3D
test -f "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/pages/gallery.tsx" && echo "✅ OK" || echo "❌ ERREUR"

# Vérifier que index.tsx n'existe PAS dans Infrastructure 3D
test -f "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/pages/index.tsx" && echo "❌ ERREUR" || echo "✅ OK"
```

---

## 🐛 DÉPANNAGE

### Erreur de Port Déjà Utilisé

```bash
# Libérer le port 1111
lsof -i :1111 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Libérer le port 3333
lsof -i :3333 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Erreur de Build

```bash
# Nettoyer et rebuilder Main
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
rm -rf .next node_modules
npm install
npm run build

# Nettoyer et rebuilder Infrastructure 3D
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
rm -rf .next node_modules
npm install
npm run build
```

### Liens Cross-Serveur ne Fonctionnent Pas

```bash
# Vérifier les .env.local
cat "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main/.env.local"
cat "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/.env.local"

# Recréer les .env.local si nécessaire
# (voir GUIDE_DEMARRAGE_2_SERVEURS.md)
```

---

## 📊 MONITORING

### Logs en Temps Réel

```bash
# Main
tail -f "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main/.next/trace"

# Infrastructure 3D
tail -f "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/.next/trace"
```

### Utilisation Ressources

```bash
# CPU et RAM
top -pid $(lsof -ti :1111)
top -pid $(lsof -ti :3333)

# Espace disque
du -sh "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
du -sh "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
```

---

## 🔐 SÉCURITÉ

### Firewall (Production)

```bash
# Sur Serveur 1 (Main)
sudo ufw allow 1111/tcp
sudo ufw enable
sudo ufw status

# Sur Serveur 2 (Infrastructure 3D)
sudo ufw allow 3333/tcp
sudo ufw enable
sudo ufw status
```

### SSL/HTTPS (avec Nginx)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir certificat
sudo certbot --nginx -d main.hearst-qatar.com
sudo certbot --nginx -d gallery.hearst-qatar.com
```

---

## 🔄 MISE À JOUR

### Mettre à Jour Main Uniquement

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"
# Faire vos modifications...
npm run build

# Déployer
scp -r . user@192.168.1.10:/var/www/Hearst\ Qatar\ Main/
ssh user@192.168.1.10 "cd /var/www/Hearst\ Qatar\ Main && npm install && npm run build && pm2 restart hearst-main"
```

### Mettre à Jour Infrastructure 3D Uniquement

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
# Faire vos modifications...
npm run build

# Déployer
scp -r . user@192.168.1.20:/var/www/Hearst\ Qatar\ Infrastructure\ 3D/
ssh user@192.168.1.20 "cd /var/www/Hearst\ Qatar\ Infrastructure\ 3D && npm install && npm run build && pm2 restart hearst-infrastructure-3d"
```

---

## 📝 BACKUP

### Backup Local

```bash
# Backup Main
tar -czf "hearst-main-backup-$(date +%Y%m%d).tar.gz" "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main"

# Backup Infrastructure 3D
tar -czf "hearst-infra3d-backup-$(date +%Y%m%d).tar.gz" "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D"
```

### Restaurer Backup

```bash
# Restaurer Main
tar -xzf hearst-main-backup-20251215.tar.gz -C "/Users/adrienbeyondcrypto/Desktop/"

# Restaurer Infrastructure 3D
tar -xzf hearst-infra3d-backup-20251215.tar.gz -C "/Users/adrienbeyondcrypto/Desktop/"
```

---

## 🧪 TESTS

### Tester Localement

```bash
# 1. Démarrer les deux serveurs
# (voir section DÉMARRAGE RAPIDE)

# 2. Tester Main
open http://localhost:1111

# 3. Tester Infrastructure 3D
open http://localhost:3333/gallery

# 4. Tester navigation cross-serveur
# Cliquer sur "3D Models Gallery" depuis Main
# Cliquer sur "← Accueil" depuis Infrastructure 3D
```

### Tester en Production

```bash
# Tester Main
curl -I http://192.168.1.10:1111

# Tester Infrastructure 3D
curl -I http://192.168.1.20:3333

# Tester navigation
curl -L http://192.168.1.10:1111 | grep "3333"
```

---

## 📚 DOCUMENTATION

### Ouvrir les Documentations

```bash
# Guide de démarrage
open "/Users/adrienbeyondcrypto/Desktop/GUIDE_DEMARRAGE_2_SERVEURS.md"

# Architecture
open "/Users/adrienbeyondcrypto/Desktop/ARCHITECTURE_2_SERVEURS.md"

# README Main
open "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main/README_LOCAL.md"

# README Infrastructure 3D
open "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/README_LOCAL.md"
```

---

## 🎯 COMMANDES ONE-LINER

### Démarrage Complet (2 terminaux)

```bash
# Terminal 1
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main" && npm install && npm run dev

# Terminal 2
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D" && npm install && npm run dev
```

### Build Complet

```bash
# Build les deux
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main" && npm run build && cd "../Hearst Qatar Infrastructure 3D" && npm run build
```

### Nettoyer Tout

```bash
# Nettoyer les deux
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main" && rm -rf .next node_modules && cd "../Hearst Qatar Infrastructure 3D" && rm -rf .next node_modules
```

### Réinstaller Tout

```bash
# Réinstaller les deux
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main" && npm install && cd "../Hearst Qatar Infrastructure 3D" && npm install
```

---

## ✅ CHECKLIST RAPIDE

### Avant de Démarrer
```bash
- [ ] Node.js installé (v18+)
- [ ] npm installé
- [ ] Ports 1111 et 3333 libres
- [ ] .env.local configurés
```

### Développement
```bash
- [ ] npm install dans les deux projets
- [ ] npm run dev dans les deux projets
- [ ] http://localhost:1111 accessible
- [ ] http://localhost:3333 accessible
- [ ] Navigation cross-serveur fonctionne
```

### Production
```bash
- [ ] npm run build dans les deux projets
- [ ] .env.local avec IPs production
- [ ] Fichiers transférés sur serveurs
- [ ] PM2 configuré
- [ ] Firewall configuré
- [ ] Backups en place
```

---

**Date:** 15 Décembre 2025  
**Version:** 1.0.0  
**Statut:** ✅ Ready to Use






