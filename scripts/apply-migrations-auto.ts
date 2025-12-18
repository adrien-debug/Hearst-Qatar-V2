/**
 * Script pour appliquer automatiquement les migrations SQL
 * Utilise le service role key pour exécuter les migrations
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Vérifiez que .env.local contient :');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Créer le client admin avec service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration(filePath: string, migrationName: string) {
  console.log(`\n📄 Application de ${migrationName}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Supabase ne supporte pas l'exécution directe de SQL via l'API
    // Nous devons utiliser l'API REST de Supabase
    console.log('⚠️  Les migrations doivent être appliquées manuellement dans le dashboard Supabase');
    console.log('📋 Contenu de la migration :');
    console.log('---');
    console.log(sql);
    console.log('---');
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${migrationName}:`, error);
    return false;
  }
}

async function createTestUser() {
  console.log('\n👤 Création du compte de test...');
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@hearst.qa',
      password: 'hearst2024',
      email_confirm: true, // Confirmer l'email automatiquement
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️  Le compte admin@hearst.qa existe déjà');
        return true;
      }
      console.error('❌ Erreur lors de la création du compte:', error.message);
      return false;
    }

    console.log('✅ Compte de test créé avec succès !');
    console.log('   Email: admin@hearst.qa');
    console.log('   Password: hearst2024');
    return true;
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Application des migrations Supabase\n');
  console.log('URL:', supabaseUrl);
  console.log('Service Key:', supabaseServiceKey.substring(0, 20) + '...');

  // Chemins des migrations
  const migrationsDir = path.join(__dirname, '../lib/supabase/migrations');
  const migration001 = path.join(migrationsDir, '001_initial_schema.sql');
  const migration002 = path.join(migrationsDir, '002_row_level_security.sql');

  console.log('\n📋 INSTRUCTIONS MANUELLES REQUISES :');
  console.log('Les migrations SQL doivent être appliquées manuellement dans le dashboard Supabase.');
  console.log('\n1. Ouvrir https://supabase.com/dashboard');
  console.log('2. Aller dans SQL Editor');
  console.log('3. Copier-coller le contenu de chaque migration');
  console.log('4. Cliquer sur "Run"');
  
  // Afficher les migrations
  await applyMigration(migration001, '001_initial_schema.sql');
  await applyMigration(migration002, '002_row_level_security.sql');

  // Créer le compte de test
  console.log('\n' + '='.repeat(60));
  await createTestUser();
  
  console.log('\n✅ Script terminé !');
  console.log('\n📝 Prochaines étapes :');
  console.log('1. Appliquer les migrations SQL dans le dashboard Supabase');
  console.log('2. Aller sur http://localhost:3333/login');
  console.log('3. Se connecter avec admin@hearst.qa / hearst2024');
}

main().catch(console.error);















