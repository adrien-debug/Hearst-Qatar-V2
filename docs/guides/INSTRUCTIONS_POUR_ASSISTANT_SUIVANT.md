# Instructions pour l'Assistant Suivant - Intégration 3D

## Contexte

L'utilisateur travaille sur une visualisation 3D d'un système modulaire composé de deux éléments superposés :
1. **Conteneur Pelin** (module inférieur)
2. **Structure avec système de radiateur en V** (module supérieur)

Le composant actuel se trouve dans : `components/3d/SubstationContainer3D.tsx`

## Ce que vous DEVEZ faire

### Étape 1 : Analyser les photos fournies

**IMPORTANT :** L'utilisateur va vous fournir des photos. Vous DEVEZ :

1. **Lire la description de l'image** fournie dans le contexte (image_description)
2. **Analyser chaque détail au millimètre** :
   - Dimensions exactes de chaque élément
   - Positions relatives des composants
   - Angles d'inclinaison précis
   - Couleurs exactes
   - Textures et matériaux
   - Marquages et logos (positions exactes)

3. **Créer une liste de vérification détaillée** avec :
   - Chaque élément visible sur l'image
   - Sa position exacte (coordonnées relatives)
   - Ses dimensions (hauteur, largeur, profondeur)
   - Son angle d'inclinaison si applicable
   - Sa couleur exacte (code hexadécimal)
   - Son matériau (métallique, plastique, etc.)

### Étape 2 : Comparer avec le code actuel

1. **Lire le fichier** `components/3d/SubstationContainer3D.tsx`
2. **Identifier les différences** entre :
   - Ce qui est dans le code actuel
   - Ce qui devrait être selon les photos

3. **Créer un tableau de comparaison** :
   | Élément | Code Actuel | Photo | Action Requise |
   |---------|-------------|-------|----------------|
   | ... | ... | ... | ... |

### Étape 3 : Modifier le code

**RÈGLE D'OR :** Ne pas tourner en rond. Faire UNE modification complète et précise.

1. **Modifier directement** `components/3d/SubstationContainer3D.tsx`
2. **Ajuster chaque élément** pour correspondre EXACTEMENT aux photos :
   - Dimensions précises
   - Positions exactes
   - Angles corrects
   - Couleurs fidèles
   - Détails visuels (grilles, tuyaux, marquages, etc.)

3. **Tester visuellement** :
   - Vérifier que les proportions sont correctes
   - Vérifier que les éléments sont bien alignés
   - Vérifier que les couleurs correspondent

### Étape 4 : Vérification finale

Avant de terminer, vérifiez que :

- [ ] Tous les éléments visibles sur les photos sont présents dans le code
- [ ] Les dimensions sont correctes
- [ ] Les positions sont exactes
- [ ] Les angles d'inclinaison sont corrects
- [ ] Les couleurs correspondent
- [ ] Les marquages (logos, textes) sont aux bonnes positions
- [ ] Les détails (grilles, tuyaux, verrous) sont présents
- [ ] Le code compile sans erreurs
- [ ] Le composant peut être visualisé sur `/substation-container-test`

## Structure attendue

### Module Inférieur - Conteneur Pelin

**Dimensions :** 12.196m (longueur) × 2.438m (largeur) × 2.896m (hauteur)

**Caractéristiques visuelles :**
- Tôle ondulée verticale (nervures)
- Couleur : Blanc cassé / Gris clair
- Coins renforcés (structurels, plus épais)
- Marquages :
  - Logo ANTSPACE (A stylisé avec antennes) - CENTRE face avant
  - Texte "BITMAIN" - Coin inférieur GAUCHE
  - Texte "HD5" - Coin inférieur DROIT
- Éléments fonctionnels :
  - Protubérance rectangulaire horizontale côté gauche (avec grille)
  - Grille d'aération rectangulaire verticale coin inférieur gauche
  - Verrous de conteneur aux 4 coins

### Module Supérieur - Structure avec Radiateur en V

**Dimensions :** 12.196m (longueur) × 2.438m (largeur) × ~1.448m (hauteur - environ la moitié)

**Caractéristiques visuelles :**
- Cadre extérieur lisse blanc
- **8 panneaux inclinés en forme de V inversé (chevrons)** - bleu-gris foncé
- Structures verticales blanches fines supportant les panneaux
- Extrémité gauche : Grand compartiment avec :
  - Ailettes de radiateur verticales (claires)
  - Tubes et tuyaux métalliques argentés
  - Connexions vers les radiateurs en V
- Extrémité droite : Petite poignée/élément d'accès rectangulaire foncé (coin supérieur)
- Tuyaux métalliques argentés au-dessus des radiateurs en V
- **Ventilateur sur le dessus** (vers l'extrémité gauche)

## Points critiques à vérifier

1. **Alignement parfait** : Les deux modules doivent être parfaitement alignés (même longueur, même largeur)
2. **Superposition** : Le module supérieur doit reposer directement sur le module inférieur
3. **Forme en V** : Les 8 panneaux doivent créer un motif en chevrons (V inversé) alternant
4. **Proportions** : Le module supérieur doit avoir environ la moitié de la hauteur du module inférieur
5. **Détails** : Tous les éléments visibles sur les photos doivent être présents

## Commandes utiles

```bash
# Démarrer le serveur de développement
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar"
npm run dev

# Accéder à la page de test
http://localhost:1111/substation-container-test
```

## Fichiers à modifier

- **Principal :** `components/3d/SubstationContainer3D.tsx`
- **Page de test :** `pages/substation-container-test.tsx` (déjà créée)
- **Documentation :** `components/3d/README.md` (mettre à jour si nécessaire)

## Méthodologie recommandée

1. **Ne pas deviner** - Utiliser EXACTEMENT ce qui est visible sur les photos
2. **Une modification à la fois** - Faire un changement, tester, puis continuer
3. **Documenter les changements** - Noter ce qui a été modifié et pourquoi
4. **Vérifier visuellement** - Utiliser la page de test pour voir le résultat
5. **Demander clarification** - Si un détail n'est pas clair sur les photos, demander à l'utilisateur

## Ce qu'il ne faut PAS faire

- ❌ Ne pas tourner en rond en faisant des modifications sans but
- ❌ Ne pas deviner les dimensions ou positions
- ❌ Ne pas ignorer les détails visibles sur les photos
- ❌ Ne pas créer plusieurs versions sans tester
- ❌ Ne pas modifier sans comprendre ce qui doit être changé

## Ce qu'il faut faire

- ✅ Analyser les photos en détail
- ✅ Comparer avec le code actuel
- ✅ Faire des modifications précises et ciblées
- ✅ Tester après chaque modification importante
- ✅ Documenter les changements
- ✅ Demander clarification si nécessaire

## Critères de réussite

Le composant est réussi quand :

1. **Visuellement identique** aux photos fournies
2. **Dimensions correctes** pour tous les éléments
3. **Positions exactes** de tous les composants
4. **Couleurs fidèles** aux photos
5. **Détails présents** (grilles, tuyaux, marquages, etc.)
6. **Alignement parfait** entre les deux modules
7. **Code propre** et sans erreurs

## Contact avec l'utilisateur

Si vous avez besoin de clarification :
- Demandez des précisions sur les dimensions si elles ne sont pas claires
- Demandez confirmation sur les couleurs si ambiguës
- Demandez précision sur les positions si incertaines

**IMPORTANT :** L'utilisateur veut un résultat PRÉCIS et FIDÈLE aux photos. Ne pas approximer, ne pas deviner. Utiliser exactement ce qui est visible.

---

**Bonne chance ! Faites-le bien du premier coup.**
