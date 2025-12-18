# 🚀 Serveur Local - Plan Interactif

## 📋 Vue d'ensemble

Un serveur local a été configuré pour héberger le plan interactif `plan-parking-advanced.html` avec accès rapide et modifications en temps réel.

## 🎯 Démarrage Rapide

### Lancer le serveur

```bash
npm run serve-plan
```

Le serveur démarre sur **http://localhost:3000**

### Accès direct

- **Plan interactif** : http://localhost:3000
- **Fichier direct** : http://localhost:3000/plan-parking-advanced.html

## ✨ Fonctionnalités

- ✅ **Serveur HTTP simple** - Pas de dépendances lourdes
- ✅ **Hot reload manuel** - Rechargez la page (F5) après modifications
- ✅ **Accès rapide** - URL simple et mémorisable
- ✅ **Sécurisé** - Empêche l'accès en dehors du répertoire projet

## 🔧 Utilisation

### 1. Démarrer le serveur

```bash
npm run serve-plan
```

Vous verrez :
```
🚀 Serveur local démarré !
📄 Plan interactif: http://localhost:3000
💡 Modifiez le fichier HTML et rechargez la page (F5) pour voir les changements
```

### 2. Ouvrir dans le navigateur

Le navigateur s'ouvre automatiquement, ou accédez manuellement à :
**http://localhost:3000**

### 3. Modifier et tester

1. Modifiez `plan-parking-advanced.html` dans votre éditeur
2. Sauvegardez (Cmd+S / Ctrl+S)
3. Rechargez la page dans le navigateur (F5 / Cmd+R)
4. Vos modifications sont visibles immédiatement !

### 4. Arrêter le serveur

Appuyez sur **Ctrl+C** dans le terminal

## 📁 Structure

```
scripts/
  └── serve-plan.js    # Serveur HTTP simple
plan-parking-advanced.html  # Plan interactif
```

## 🎨 Workflow Recommandé

1. **Démarrer le serveur** : `npm run serve-plan`
2. **Ouvrir le plan** : http://localhost:3000 (s'ouvre automatiquement)
3. **Modifier le code** dans votre éditeur
4. **Sauvegarder** le fichier
5. **Recharger** la page (F5) pour voir les changements
6. **Tester** les nouvelles fonctionnalités
7. **Répéter** les étapes 3-6

## 🔍 Dépannage

### Le serveur ne démarre pas

- Vérifiez que le port 3000 n'est pas utilisé :
  ```bash
  lsof -i :3000
  ```
- Si occupé, modifiez `PORT` dans `scripts/serve-plan.js`

### Les modifications ne s'affichent pas

- Assurez-vous d'avoir **sauvegardé** le fichier
- **Rechargez** la page (F5 ou Cmd+R)
- Videz le cache du navigateur si nécessaire (Cmd+Shift+R)

### Erreur "Cannot find module"

- Installez les dépendances :
  ```bash
  npm install
  ```

## 📝 Notes

- Le serveur sert tous les fichiers du répertoire projet
- Les modifications sont reflétées après rechargement de la page
- Pour un hot reload automatique, considérez utiliser `live-server` ou `browser-sync`

## 🚀 Améliorations Futures (Optionnelles)

- [ ] Hot reload automatique avec WebSocket
- [ ] Support des fichiers CSS/JS externes
- [ ] Interface de contrôle du serveur
- [ ] Logs des requêtes HTTP

---

**Le serveur est maintenant prêt ! Modifiez, testez, itérez rapidement ! 🎯**











