# 🔑 IDENTIFIANTS DE TEST - HEARST QATAR

## 🎯 Compte de Test Pré-rempli

Les pages de connexion et d'inscription sont maintenant **pré-remplies** avec un compte de test !

---

## 📧 IDENTIFIANTS

**Email :**
```
admin@hearst.qa
```

**Mot de passe :**
```
hearst2024
```

---

## 🚀 COMMENT UTILISER

### Option 1 : Créer le Compte (Première fois)

1. **Aller sur la page d'inscription**
   ```
   http://localhost:3333/signup
   ```

2. **Les champs sont déjà remplis !**
   - Email : `admin@hearst.qa`
   - Mot de passe : `hearst2024`
   - Confirmation : `hearst2024`

3. **Cliquer sur "Créer mon compte"**
   - ✅ Le compte est créé dans Supabase
   - ✅ Vous êtes automatiquement connecté
   - ✅ Redirection vers http://localhost:3333/

### Option 2 : Se Connecter (Si compte existe déjà)

1. **Aller sur la page de connexion**
   ```
   http://localhost:3333/login
   ```

2. **Les champs sont déjà remplis !**
   - Email : `admin@hearst.qa`
   - Mot de passe : `hearst2024`

3. **Cliquer sur "Se connecter"**
   - ✅ Connexion instantanée
   - ✅ Redirection vers http://localhost:3333/

---

## 🎯 APRÈS CONNEXION

Une fois connecté, vous arrivez sur :
```
http://localhost:3333/
```

**Vous pouvez :**
- ✅ Créer un nouveau projet avec le wizard
- ✅ Aller sur `/my-projects` pour voir vos projets
- ✅ Aller sur `/gallery` pour voir les modèles 3D
- ✅ Tous les projets créés seront sauvegardés automatiquement dans Supabase

---

## 📋 FLUX COMPLET

### 1. Première Visite
```
http://localhost:3333/signup
→ Clic "Créer mon compte" (déjà rempli)
→ ✅ Compte créé
→ Redirection vers http://localhost:3333/
```

### 2. Créer un Projet
```
http://localhost:3333/
→ Wizard : Sélectionner 25MW (par exemple)
→ Configurer les options
→ Clic "Créer le projet"
→ ✅ Projet sauvegardé dans Supabase
→ Redirection vers /environment
```

### 3. Voir Mes Projets
```
http://localhost:3333/my-projects
→ Liste de tous vos projets
→ Ouvrir / Dupliquer / Supprimer
```

---

## ⚠️ RAPPEL IMPORTANT

**Avant de tester, appliquer les migrations SQL :**

1. Ouvrir https://supabase.com/dashboard
2. SQL Editor → New query
3. Copier-coller `lib/supabase/migrations/001_initial_schema.sql`
4. Run
5. Copier-coller `lib/supabase/migrations/002_row_level_security.sql`
6. Run

**Voir `SUPABASE_SETUP_INSTRUCTIONS.md` pour les détails**

---

## 🎉 C'EST PRÊT !

**Tout est configuré et prêt à tester !**

Les identifiants sont pré-remplis, il suffit de :
1. Aller sur http://localhost:3333/signup
2. Cliquer sur "Créer mon compte"
3. Profiter ! 🚀

---

**Email :** admin@hearst.qa  
**Password :** hearst2024  
**Port :** 3333  
**Status :** ✅ Prêt à tester







