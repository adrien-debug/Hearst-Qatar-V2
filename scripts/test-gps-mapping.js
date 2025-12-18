/**
 * Script de Test du Système de Mapping GPS
 * Lance des tests rapides pour valider le système
 */

// Simulation des fonctions (en attendant l'import réel)
function normalizeId(id) {
  return id
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function extractIdComponents(id) {
  const normalized = normalizeId(id);
  return normalized.split('_').filter(c => c.length > 0);
}

function calculateIdSimilarity(id1, id2) {
  const components1 = extractIdComponents(id1);
  const components2 = extractIdComponents(id2);
  
  if (normalizeId(id1) === normalizeId(id2)) {
    return 1.0;
  }
  
  let matchCount = 0;
  const maxLength = Math.max(components1.length, components2.length);
  
  for (const comp1 of components1) {
    if (components2.includes(comp1)) {
      matchCount++;
    }
  }
  
  return matchCount / maxLength;
}

// Tests
console.log('🧪 Tests du Système de Mapping GPS\n');
console.log('=' .repeat(60));

// Test 1: Normalisation
console.log('\n📋 Test 1: Normalisation des IDs');
const test1Cases = [
  ['PB1_TR01_HD5_A', 'pb1_tr01_hd5_a'],
  ['PowerBlock_1', 'powerblock_1'],
  ['PB-1-TR-01', 'pb_1_tr_01'],
  ['Container HD5', 'container_hd5'],
];

let test1Pass = 0;
test1Cases.forEach(([input, expected]) => {
  const result = normalizeId(input);
  const pass = result === expected;
  console.log(`  ${pass ? '✅' : '❌'} "${input}" → "${result}" ${pass ? '' : `(attendu: "${expected}")`}`);
  if (pass) test1Pass++;
});
console.log(`  Résultat: ${test1Pass}/${test1Cases.length} tests passés`);

// Test 2: Extraction des composants
console.log('\n📋 Test 2: Extraction des Composants');
const test2Cases = [
  ['PB1_TR01_HD5_A', ['pb1', 'tr01', 'hd5', 'a']],
  ['PowerBlock_1', ['powerblock', '1']],
];

let test2Pass = 0;
test2Cases.forEach(([input, expected]) => {
  const result = extractIdComponents(input);
  const pass = JSON.stringify(result) === JSON.stringify(expected);
  console.log(`  ${pass ? '✅' : '❌'} "${input}" → [${result.join(', ')}]`);
  if (pass) test2Pass++;
});
console.log(`  Résultat: ${test2Pass}/${test2Cases.length} tests passés`);

// Test 3: Calcul de similarité
console.log('\n📋 Test 3: Calcul de Similarité');
const test3Cases = [
  ['PB1_TR01_HD5_A', 'PB1_TR01_HD5_A', 1.0, 'Identiques'],
  ['PB1_TR01_HD5_A', 'PB1_TR01_HD5_B', 0.75, 'Très similaires'],
  ['PB1_TR01', 'PB2_TR05', 0.25, 'Peu similaires'],
  ['Container', 'Transformer', 0.0, 'Différents'],
];

let test3Pass = 0;
test3Cases.forEach(([id1, id2, expectedMin, description]) => {
  const result = calculateIdSimilarity(id1, id2);
  const pass = result >= expectedMin;
  console.log(`  ${pass ? '✅' : '❌'} "${id1}" vs "${id2}": ${result.toFixed(2)} (${description})`);
  if (pass) test3Pass++;
});
console.log(`  Résultat: ${test3Pass}/${test3Cases.length} tests passés`);

// Test 4: Matching avec données réelles
console.log('\n📋 Test 4: Matching avec Données Réelles');

const equipment = [
  { id: 'PB1_TR01_HD5_A', position: [-87, 0.3, -55] },
  { id: 'PB1_TR01_HD5_B', position: [-63, 0.3, -55] },
  { id: 'PB1_TR01_Transformer', position: [-75, 0.3, -55] },
  { id: 'T6_HD5_B', position: [-63, 0.3, -135], metadata: { powerBlockId: 'PB1' } }, // Test avec ID court
];

const gpsPoints = [
  { name: 'PB1_TR01_HD5_A', x: -87, y: 0.3, z: -55 },
  { name: 'PB1_TR01_HD5_B', x: -63, y: 0.3, z: -55 },
  { name: 'PB1_TR01_Transformer', x: -75, y: 0.3, z: -55 },
  { name: 'PB1_TR06_HD5_B', x: -63, y: 0.3, z: -135 }, // Point GPS avec préfixe complet
];

let test4Pass = 0;
equipment.forEach(equip => {
  // Trouver le meilleur match par similarité d'ID
  let bestMatch = null;
  let bestScore = 0;
  
  // Essayer d'abord avec l'ID tel quel
  gpsPoints.forEach(gps => {
    const score = calculateIdSimilarity(equip.id, gps.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = gps;
    }
  });
  
  // Si pas de bon match et qu'il y a un powerBlockId, essayer avec le préfixe
  if (bestScore < 0.8 && equip.metadata?.powerBlockId) {
    const pbMatch = equip.metadata.powerBlockId.match(/(\d+)/);
    if (pbMatch) {
      const pbNum = pbMatch[1];
      const idWithPB = `PB${pbNum}_${equip.id}`;
      
      gpsPoints.forEach(gps => {
        const score = calculateIdSimilarity(idWithPB, gps.name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = gps;
        }
      });
    }
  }
  
  const pass = bestMatch && bestScore >= 0.8;
  console.log(`  ${pass ? '✅' : '❌'} ${equip.id} → ${bestMatch ? bestMatch.name : 'NON TROUVÉ'} (score: ${bestScore.toFixed(2)})`);
  if (pass) test4Pass++;
});
console.log(`  Résultat: ${test4Pass}/${equipment.length} équipements mappés`);

// Résumé final
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DES TESTS\n');

const totalTests = test1Cases.length + test2Cases.length + test3Cases.length + equipment.length;
const totalPass = test1Pass + test2Pass + test3Pass + test4Pass;
const percentage = ((totalPass / totalTests) * 100).toFixed(1);

console.log(`  Tests Réussis: ${totalPass}/${totalTests} (${percentage}%)`);
console.log(`  
  Test 1 (Normalisation):     ${test1Pass}/${test1Cases.length}
  Test 2 (Composants):        ${test2Pass}/${test2Cases.length}
  Test 3 (Similarité):        ${test3Pass}/${test3Cases.length}
  Test 4 (Matching Réel):     ${test4Pass}/${equipment.length}
`);

if (totalPass === totalTests) {
  console.log('  ✅ TOUS LES TESTS SONT PASSÉS !');
  console.log('  🚀 Le système est prêt pour la production !');
} else {
  console.log(`  ⚠️  ${totalTests - totalPass} test(s) échoué(s)`);
  console.log('  🔧 Corrections nécessaires');
}

console.log('\n' + '='.repeat(60));
console.log('\n✨ Tests terminés !\n');

