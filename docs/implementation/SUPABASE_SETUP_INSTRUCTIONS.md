# Instructions de Configuration Supabase

## Étape 1: Appliquer les Migrations SQL ✅ REQUIS

### 1.1 Accéder au Dashboard Supabase
1. Ouvrir https://supabase.com/dashboard
2. Se connecter à votre compte
3. Sélectionner le projet: `gnpvwoguufyitnszwvqp`

### 1.2 Ouvrir le SQL Editor
1. Dans le menu latéral, cliquer sur **SQL Editor**
2. Cliquer sur **New query**

### 1.3 Appliquer la Migration 001 - Schéma Initial

Copier-coller le contenu de `lib/supabase/migrations/001_initial_schema.sql` dans l'éditeur SQL et exécuter.

Cette migration crée les tables :
- `deployments` - Pour sauvegarder les projets 3D
- `models_3d` - Métadonnées des modèles 3D
- `equipment_instances` - Instances d'équipements
- `mining_containers` - Données des conteneurs
- `cooling_modules` - Modules de refroidissement
- Et autres tables...

**Commande rapide :**
```bash
# Copier le fichier
cat lib/supabase/migrations/001_initial_schema.sql
```

### 1.4 Appliquer la Migration 002 - Row Level Security

Copier-coller le contenu de `lib/supabase/migrations/002_row_level_security.sql` dans l'éditeur SQL et exécuter.

Cette migration configure :
- RLS (Row Level Security) sur toutes les tables
- Politiques pour que chaque utilisateur ne voie que ses propres données
- Permissions pour les opérations CRUD

**Commande rapide :**
```bash
# Copier le fichier
cat lib/supabase/migrations/002_row_level_security.sql
```

### 1.5 Vérifier l'Application

Après avoir exécuté les migrations, vérifier dans Supabase :
1. Aller dans **Table Editor**
2. Vérifier que la table `deployments` existe
3. Vérifier que la table `models_3d` existe
4. Aller dans **Authentication** > **Policies**
5. Vérifier que les politiques RLS sont actives

---

## Étape 2: Activer l'Authentification Email/Password

### 2.1 Configuration Auth
1. Dans le dashboard Supabase, aller dans **Authentication** > **Providers**
2. Vérifier que **Email** est activé
3. Configuration recommandée :
   - ✅ Enable email confirmations (optionnel)
   - ✅ Enable email change confirmations
   - ✅ Secure email change

### 2.2 Email Templates (Optionnel)
1. Aller dans **Authentication** > **Email Templates**
2. Personnaliser les templates :
   - Confirmation signup
   - Magic Link
   - Change Email Address
   - Reset Password

---

## Étape 3: Configuration Storage (Optionnel - Pour modèles 3D)

### 3.1 Créer un Bucket
1. Aller dans **Storage**
2. Cliquer sur **New bucket**
3. Nom: `3d-models`
4. Public: ✅ Oui (pour permettre l'accès aux modèles)

### 3.2 Politiques Storage
Créer les politiques suivantes :

**Lecture publique :**
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = '3d-models');
```

**Écriture authentifiée :**
```sql
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = '3d-models');
```

---

## Étape 4: Tester la Configuration

### 4.1 Tester la Connexion
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar"
npm run supabase:test
```

### 4.2 Vérifications
- ✅ Les variables d'environnement sont chargées
- ✅ La connexion à Supabase fonctionne
- ✅ Les tables existent
- ✅ L'authentification est activée

---

## Étape 5: Utilisation dans l'Application

Une fois la configuration terminée, l'application pourra :

1. **Créer des comptes utilisateurs**
   - Page `/signup`
   - Email + mot de passe

2. **Se connecter**
   - Page `/login`
   - Session persistante

3. **Sauvegarder des projets**
   - Automatiquement dans Supabase
   - Associés à l'utilisateur connecté

4. **Charger des projets**
   - Liste dans `/my-projects`
   - Chaque utilisateur voit ses propres projets

---

## Troubleshooting

### Erreur: "relation deployments does not exist"
→ Les migrations n'ont pas été appliquées. Retourner à l'Étape 1.

### Erreur: "JWT expired" ou "Invalid JWT"
→ Vérifier que `SUPABASE_JWT_SECRET` est correct dans `.env.local`

### Erreur: "Row Level Security policy violation"
→ Les politiques RLS ne sont pas configurées. Appliquer la migration 002.

### L'authentification ne fonctionne pas
→ Vérifier dans Supabase Dashboard > Authentication > Providers que Email est activé

---

## Commandes Utiles

```bash
# Tester la connexion Supabase
npm run supabase:test

# Voir les logs en temps réel
# Dans Supabase Dashboard > Logs

# Vérifier les tables
# Dans Supabase Dashboard > Table Editor

# Vérifier les utilisateurs
# Dans Supabase Dashboard > Authentication > Users
```

---

## Résumé des Actions Manuelles Requises

- [ ] Appliquer migration 001_initial_schema.sql dans SQL Editor
- [ ] Appliquer migration 002_row_level_security.sql dans SQL Editor
- [ ] Vérifier que Email Auth est activé
- [ ] (Optionnel) Créer le bucket `3d-models` pour les fichiers 3D
- [ ] Tester avec `npm run supabase:test`

---

**Une fois ces étapes complétées, l'application sera prête à utiliser Supabase ! ✅**







