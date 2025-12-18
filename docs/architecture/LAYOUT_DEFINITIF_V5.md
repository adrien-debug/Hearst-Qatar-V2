# 🎯 LAYOUT DÉFINITIF V5 - Version Finale

## 📐 Principe de conception

**TOUT est calculé à partir d'un point central (0, 0, 0)**

Chaque élément est positionné de manière absolue et précise pour garantir un alignement parfait.

## 🏗️ Disposition finale

### Configuration
- **1 rangée de 6 transformateurs** alignés sur l'axe X
- **12 containers HD5** (2 par transformateur, avant/arrière sur axe Z)
- **Espacement uniforme** : 40m entre chaque transformateur
- **Distance transformer-container** : 15m (devant et derrière)
- **Rotation** : 0° pour TOUS les équipements (face caméra)

### Schéma ASCII

```
                    VUE DE DESSUS
                    
    Z
    ↑
    |
    |   [C]     [C]     [C]     [C]     [C]     [C]
    |    ↑       ↑       ↑       ↑       ↑       ↑
    |   15m     15m     15m     15m     15m     15m
    |    ↓       ↓       ↓       ↓       ↓       ↓
    0   [T1]    [T2]    [T3]    [T4]    [T5]    [T6]  → X
    |    ↓       ↓       ↓       ↓       ↓       ↓
    |   15m     15m     15m     15m     15m     15m
    |    ↓       ↓       ↓       ↓       ↓       ↓
    |   [C]     [C]     [C]     [C]     [C]     [C]
    |
    |   ←─40m─→ ←─40m─→ ←─40m─→ ←─40m─→ ←─40m─→
    |
    
[S] = Substation (X=-130)
[T] = Transformateur
[C] = Container HD5
[H] = Hangar (X=+170)
```

## 📊 Coordonnées exactes

### Transformateurs (ligne horizontale sur X, Z=0)
- **T1** : X=-100m, Z=0m
- **T2** : X=-60m, Z=0m
- **T3** : X=-20m, Z=0m
- **T4** : X=+20m, Z=0m
- **T5** : X=+60m, Z=0m
- **T6** : X=+100m, Z=0m

### Containers (devant et derrière chaque transformateur)
- **Containers FRONT** : Z=-15m (devant)
- **Containers BACK** : Z=+15m (derrière)
- **Position X** : Même X que leur transformateur

Exemple pour T1 :
- T1_HD5_F : X=-100m, Z=-15m
- T1_HD5_B : X=-100m, Z=+15m

### Équipements auxiliaires
- **Substation** : X=-130m, Z=0m (à gauche de T1)
- **Hangar** : X=+170m, Z=0m (à droite de T6)

## 📏 Dimensions de la zone

### Occupation au sol
- **Largeur totale (X)** : 300m (de X=-130 à X=+170)
- **Profondeur totale (Z)** : 30m (de Z=-15 à Z=+15)
- **Zone centrale équipements** : 240m × 30m

### Espacements
- **Entre transformateurs** : 40m (généreux pour circulation)
- **Transformer → Container** : 15m (accès maintenance)
- **Substation → T1** : 30m (câblage électrique)
- **T6 → Hangar** : 70m (zone de service)

## ✅ Avantages du layout définitif

1. **Alignement parfait** : Tous les équipements sur des axes clairs
2. **Pas de chevauchement** : Espacement généreux (40m)
3. **Circulation optimale** : Larges allées entre équipements
4. **Maintenance facilitée** : Accès facile à tous les côtés
5. **Symétrie** : Layout symétrique et équilibré
6. **Évolutivité** : Facile d'étendre en ajoutant des transformateurs
7. **Visibilité** : Vue d'ensemble claire depuis n'importe quel angle

## 🔧 Caractéristiques techniques

### Rotations
- **Tous les équipements** : rotation [0, 0, 0] (0°)
- **Face à la caméra** : Orientation naturelle
- **Pas de rotation complexe** : Simplifie la maintenance du code

### Hauteurs (Y)
- **Sol** : Y=0m
- **Dalles béton** : Y=0.2m
- **Transformateurs** : Y=0.3m
- **Containers** : Y=0.3m (ou 0.7m si sur dalle)
- **Substation/Hangar** : Y=0.5m

## 🎯 Intégration VRD

Les routes, barrières et murs sont calculés pour s'aligner avec ce layout :
- **Routes** : Parallèles à l'axe X (circulation entre rangées)
- **Barrières** : Positionnées à l'entrée (alignées avec substation)
- **Mur d'enceinte** : Englobe toute la zone avec marge de sécurité
- **Sol** : Dimensionné pour couvrir toute la zone + marges

## 📝 Notes de migration

**Migration v5** : Supprime automatiquement les anciens projets pour forcer la recréation avec le layout définitif.

Les utilisateurs doivent recréer leur projet pour bénéficier du nouveau layout parfaitement aligné.







