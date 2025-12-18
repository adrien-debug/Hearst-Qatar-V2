# Guide de Rollback - Vercel

Ce document explique comment effectuer un rollback (retour en arrière) vers une version précédente du déploiement.

## Méthode 1 : Via l'interface Vercel (Recommandé)

1. Connectez-vous à [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans l'onglet **"Deployments"**
4. Trouvez le déploiement vers lequel vous voulez revenir
5. Cliquez sur les **"..."** à droite du déploiement
6. Sélectionnez **"Promote to Production"**

## Méthode 2 : Via la CLI Vercel

```bash
# Lister les déploiements récents
vercel ls

# Promouvoir un déploiement spécifique
vercel rollback <deployment-url>
```

## Méthode 3 : Via le script de rollback

Un script Node.js est disponible pour automatiser le rollback :

```bash
# Lister les déploiements disponibles
node scripts/rollback.js

# Faire un rollback vers un déploiement spécifique
node scripts/rollback.js https://hearst-qatar-abc123.vercel.app
```

### Prérequis pour le script

1. **Token Vercel** : Vous devez avoir un token Vercel
   - Option 1 : Variable d'environnement `VERCEL_TOKEN`
   - Option 2 : Connecté via `vercel login`

2. **Nom du projet** : Modifiez `PROJECT_NAME` dans `scripts/rollback.js` si nécessaire

## Vérification après rollback

Après un rollback, vérifiez que :

1. ✅ Le site fonctionne correctement
2. ✅ Les fonctionnalités critiques sont opérationnelles
3. ✅ Les données sont cohérentes
4. ✅ Les performances sont acceptables

## Notes importantes

- ⚠️ Le rollback ne restaure **PAS** les variables d'environnement
- ⚠️ Le rollback ne restaure **PAS** les bases de données
- ⚠️ Seul le code déployé est restauré
- ✅ Les déploiements sont conservés pendant 30 jours (plan Hobby) ou indéfiniment (plan Pro)

## Prévention des problèmes

Pour éviter d'avoir besoin d'un rollback :

1. **Tests** : Testez toujours en local avant de déployer
2. **Staging** : Utilisez un environnement de staging
3. **Review** : Faites des code reviews avant de merger
4. **Monitoring** : Surveillez les métriques après chaque déploiement

## Support

En cas de problème avec le rollback, consultez :
- [Documentation Vercel - Rollback](https://vercel.com/docs/deployments/rollback)
- [Support Vercel](https://vercel.com/support)











