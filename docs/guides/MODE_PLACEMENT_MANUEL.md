# 🎯 MODE PLACEMENT MANUEL - Implémentation Complète

## Vue d'ensemble

Le système a été simplifié pour permettre le placement manuel des équipements. L'utilisateur peut maintenant positionner chaque transformateur et container exactement comme sur son schéma dessiné.

## Fonctionnalités implémentées

### 1. Layout simplifié
- **6 transformateurs** (T1 à T6) alignés en ligne
- **12 containers** (2 par transformateur) alignés en ligne
- Position initiale simple pour faciliter le placement
- Rotation à 0° (ajustable manuellement)

### 2. VRD désactivé
- Routes, barrières, murs : **désactivés**
- Hangar et Substation : **supprimés**
- Sol sablonneux : **conservé**
- Grille d'alignement : **ajoutée** (200m × 200m, 40 divisions)

### 3. Contrôles 3D actifs
- **Clic sur un équipement** : Sélection
- **Mode Translate** : Déplacer l'équipement (touches T ou bouton toolbar)
- **Mode Rotate** : Tourner l'équipement (touches R ou bouton toolbar)
- **Grille visible** : Lignes vertes (#8AFD81) pour l'alignement

### 4. Affichage des coordonnées
- **Panneau d'informations** (en haut à gauche)
- Affiche pour l'équipement sélectionné :
  - ID de l'équipement
  - Position X, Y, Z (en mètres)
  - Rotation Y (en degrés)
- Mise à jour en temps réel

### 5. Sauvegarde automatique
- **Auto-save** après chaque déplacement
- Message de confirmation : "✅ Position sauvegardée"
- Sauvegarde dans localStorage
- Persistance entre les sessions

### 6. Export des positions
- **Bouton "📥 Exporter Positions"** (en haut à droite)
- Télécharge un fichier JSON avec toutes les positions
- Format : `positions-[nom-projet].json`
- Contient : id, type, position [x,y,z], rotation [x,y,z]

## Utilisation

### Étape 1 : Créer un nouveau projet
1. Rechargez la page (la migration v7 va s'appliquer)
2. Créez un nouveau projet 25MW via le wizard
3. Les équipements apparaissent en ligne simple

### Étape 2 : Placer les équipements
1. **Cliquez** sur un équipement pour le sélectionner
2. **Appuyez sur T** ou cliquez sur le bouton "Translate"
3. **Déplacez** l'équipement avec les flèches 3D
4. **Appuyez sur R** pour passer en mode rotation
5. **Tournez** l'équipement si nécessaire
6. La position est **sauvegardée automatiquement**

### Étape 3 : Utiliser la grille
- La grille verte vous aide à aligner les équipements
- Chaque carré fait 5m × 5m
- La grille totale fait 200m × 200m

### Étape 4 : Exporter les positions
1. Une fois tous les équipements placés
2. Cliquez sur **"📥 Exporter Positions"**
3. Un fichier JSON est téléchargé
4. Ce fichier peut être réutilisé ou partagé

## Fichiers modifiés

1. **lib/projectGenerator_v2_DEFINITIVE.ts**
   - Génération simplifiée (équipements en ligne)
   - Suppression de Hangar et Substation

2. **lib/projectGenerator.ts**
   - VRD désactivé (retourne tableau vide)

3. **pages/environment.tsx**
   - Grille d'alignement ajoutée
   - VRD désactivé dans le rendu
   - InfoPanel avec coordonnées
   - Auto-save après transformation
   - Bouton export positions

4. **contexts/ProjectContext.tsx**
   - Migration v7 pour reset

## Exemple de fichier exporté

```json
[
  {
    "id": "T1",
    "type": "transformer",
    "position": [-40, 0.3, 0],
    "rotation": [0, 0, 0]
  },
  {
    "id": "T1_HD5_F",
    "type": "container",
    "position": [-40, 0.3, -8],
    "rotation": [0, 1.5708, 0]
  },
  ...
]
```

## Conseils

1. **Commencez par les transformateurs** - Placez-les d'abord
2. **Puis les containers** - Positionnez-les autour des transformateurs
3. **Utilisez la grille** - Pour un alignement parfait
4. **Sauvegardez régulièrement** - Exportez vos positions
5. **Testez différentes vues** - Utilisez la caméra pour vérifier

## Prochaines étapes

Une fois les positions définies manuellement, elles peuvent être :
- Réutilisées comme template
- Intégrées dans le générateur automatique
- Partagées avec l'équipe
- Utilisées pour la production







