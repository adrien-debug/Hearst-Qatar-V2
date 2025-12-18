/**
 * Script pour appliquer les migrations SQL via l'API Supabase
 */

import * as fs from 'fs';
import * as path from 'path';

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function executeSql(sql: string): Promise<boolean> {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erreur API:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'exécution SQL:', error);
    return false;
  }
}

async function applyMigrations() {
  console.log('🚀 Application des migrations SQL via API Supabase\n');

  const migrationsDir = path.join(__dirname, '../lib/supabase/migrations');
  
  // Migration 001
  console.log('📄 Migration 001: Schéma initial...');
  const sql001 = fs.readFileSync(path.join(migrationsDir, '001_initial_schema.sql'), 'utf8');
  
  // Diviser en commandes individuelles (Supabase ne supporte pas les multi-statements via API)
  const statements001 = sql001
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`   ${statements001.length} commandes SQL à exécuter...`);
  console.log('   ⚠️  Note: L\'API REST ne supporte pas l\'exécution SQL directe');
  console.log('   ℹ️  Utilisez le SQL Editor dans le dashboard Supabase');
  
  // Migration 002
  console.log('\n📄 Migration 002: Row Level Security...');
  const sql002 = fs.readFileSync(path.join(migrationsDir, '002_row_level_security.sql'), 'utf8');
  
  const statements002 = sql002
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`   ${statements002.length} commandes SQL à exécuter...`);
  console.log('   ⚠️  Note: L\'API REST ne supporte pas l\'exécution SQL directe');
  console.log('   ℹ️  Utilisez le SQL Editor dans le dashboard Supabase');

  console.log('\n' + '='.repeat(60));
  console.log('📋 INSTRUCTIONS POUR APPLIQUER LES MIGRATIONS :');
  console.log('='.repeat(60));
  console.log('\n1. Ouvrir https://supabase.com/dashboard/project/gnpvwoguufyitnszwvqp');
  console.log('2. Cliquer sur "SQL Editor" dans le menu latéral');
  console.log('3. Cliquer sur "New query"');
  console.log('\n4. MIGRATION 001 :');
  console.log('   - Copier le contenu de: lib/supabase/migrations/001_initial_schema.sql');
  console.log('   - Coller dans l\'éditeur');
  console.log('   - Cliquer sur "Run" (ou Ctrl+Enter)');
  console.log('\n5. MIGRATION 002 :');
  console.log('   - Copier le contenu de: lib/supabase/migrations/002_row_level_security.sql');
  console.log('   - Coller dans l\'éditeur');
  console.log('   - Cliquer sur "Run" (ou Ctrl+Enter)');
  console.log('\n✅ Une fois les migrations appliquées, l\'authentification fonctionnera !');
  console.log('\n🔑 Compte de test créé :');
  console.log('   Email: admin@hearst.qa');
  console.log('   Password: hearst2024');
}

applyMigrations().catch(console.error);















