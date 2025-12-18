# 🏗️ Nouveau Layout Intelligent - 25MW

## 📐 Vue d'ensemble

Le nouveau layout a été complètement repensé pour optimiser l'espace, la circulation et la maintenance.

## 🎯 Disposition

### Layout en 2 rangées de 3 transformateurs

```
                    RANGÉE 1 (Z = -30m)
    ┌─────────────────────────────────────────────┐
    │  T1         T2         T3                   │
    │ [C][T][C]  [C][T][C]  [C][T][C]            │
    └─────────────────────────────────────────────┘
                  ↕ 25m (circulation)
    ┌─────────────────────────────────────────────┐
    │  T4         T5         T6                   │
    │ [C][T][C]  [C][T][C]  [C][T][C]            │
    └─────────────────────────────────────────────┘
                    RANGÉE 2 (Z = -5m)

    [C] = Container HD5
    [T] = Transformateur
```

## 📊 Coordonnées détaillées

### Rangée 1 (T1, T2, T3)
- **Z position** : -30m
- **Espacement entre transformateurs** : 15m
- **Positions X** :
  - T1 : -35m
  - T2 : -20m
  - T3 : -5m

### Rangée 2 (T4, T5, T6)
- **Z position** : -5m (25m après rangée 1)
- **Espacement entre transformateurs** : 15m
- **Positions X** :
  - T4 : -35m
  - T5 : -20m
  - T6 : -5m

### Containers
- **Position** : De chaque côté du transformateur (gauche et droite sur axe X)
- **Espacement** : 4m entre transformer et container + longueur container/2
- **Rotation** : 90° sur axe Y (Math.PI/2)

### Équipements auxiliaires
- **Hangar** : Positionné à droite de la zone principale
- **Substation** : Positionnée en amont (entrée électrique)
- **Rotation** : 90° sur axe Y pour tous les équipements

## 🔧 Paramètres techniques

### Dimensions
- **Container HD5** : 12m (longueur) × 2.5m (largeur)
- **Transformateur** : ~3m (taille approximative)

### Espacements
- **Entre rangées** : 25m (pour circulation véhicules)
- **Entre équipements** : 15m (dans une rangée)
- **Transformer-Container** : 4m (gap de sécurité)

### Rotations
- **Tous les équipements** : 90° sur axe Y (Math.PI/2)
- **Alignement** : Perpendiculaire à l'axe Z (rangées)

## ✅ Avantages du nouveau layout

1. **Circulation optimisée** : 25m entre les rangées pour les véhicules de maintenance
2. **Accès facilité** : Chaque équipement est accessible de tous les côtés
3. **Symétrie** : Layout symétrique pour faciliter l'extension
4. **Compacité** : Utilisation optimale de l'espace
5. **Maintenance** : Espacement suffisant pour les opérations de maintenance
6. **Évolutivité** : Facile d'ajouter des rangées supplémentaires

## 🔄 Migration

La migration v3 supprime automatiquement les anciens projets pour forcer la recréation avec le nouveau layout.

**Note** : Les utilisateurs devront recréer leurs projets pour bénéficier du nouveau layout.







