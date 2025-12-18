# 🎯 LAYOUT GRILLE PARALLÈLE 3×2 - Version Finale

## Disposition

Les 6 groupes sont maintenant disposés en **GRILLE PARALLÈLE** (3 rangées × 2 colonnes) :

```
        Colonne 1    Colonne 2
        
Rangée 1:  T1          T2        (Z = -30m)
           [C]         [C]
           [T]         [T]
           [C]         [C]

Rangée 2:  T3          T4        (Z = 0m)
           [C]         [C]
           [T]         [T]
           [C]         [C]

Rangée 3:  T5          T6        (Z = +30m)
           [C]         [C]
           [T]         [T]
           [C]         [C]
```

## Coordonnées initiales

### Rangée 1 (Z = -30m)
- **T1** : X = -20m, Z = -30m
- **T2** : X = +20m, Z = -30m

### Rangée 2 (Z = 0m)
- **T3** : X = -20m, Z = 0m
- **T4** : X = +20m, Z = 0m

### Rangée 3 (Z = +30m)
- **T5** : X = -20m, Z = +30m
- **T6** : X = +20m, Z = +30m

## Espacements

- **Entre colonnes (X)** : 40m
- **Entre rangées (Z)** : 30m
- **Transformer → Container** : 8m (devant et derrière)

## Fonctionnalités

### 1. Groupes déplaçables
- Chaque groupe (T + 2C) se déplace comme un bloc
- Cliquez sur n'importe quelle partie du groupe
- Les flèches apparaissent automatiquement

### 2. Grille d'alignement
- Grille verte 200m × 200m
- 40 divisions (5m par carré)
- Facilite l'alignement précis

### 3. Coordonnées en temps réel
- Panneau en haut à gauche
- Affiche X, Y, Z et rotation
- Mise à jour instantanée

### 4. Sauvegarde automatique
- Position sauvegardée après chaque déplacement
- Message de confirmation
- Persistance dans localStorage

### 5. Export
- Bouton "📥 Exporter Positions"
- Télécharge un fichier JSON
- Réutilisable comme template

## Utilisation

1. **Rechargez** la page (Ctrl+Shift+R)
2. **Créez** un projet 25MW
3. **Vous voyez** : 6 groupes en grille 3×2
4. **Cliquez** sur un groupe (T1, T2, etc.)
5. **Déplacez** le groupe entier avec les flèches
6. **Affinez** la position selon votre schéma
7. **Répétez** pour les 6 groupes
8. **Exportez** les positions finales

## Prochaines étapes

Une fois tous les groupes placés selon votre schéma :
1. Exportez les positions
2. Je pourrai intégrer ces positions comme template
3. Les futurs projets utiliseront automatiquement votre layout







