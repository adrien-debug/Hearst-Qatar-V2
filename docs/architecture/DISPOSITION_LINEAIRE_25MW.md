# 📐 Disposition Linéaire 25MW - Configuration Standard

## 🎯 Objectif

Créer une disposition **très linéaire et symétrique** pour le module 25MW qui peut être **facilement dupliquée** pour créer les configurations 50MW, 75MW, 100MW, etc.

---

## 📊 Configuration 25MW - Module de Base

### Équipements

| Type | Quantité | Disposition |
|------|----------|-------------|
| **Transformateurs** | 6 | Alignés sur l'axe Z (ligne droite) |
| **Containers HD5** | 12 | 2 par transformateur (gauche + droite) |
| **Dalles béton** | 12 | 1 sous chaque container |
| **Hangar** | 1 | À droite de la ligne principale |
| **Substation** | 1 | En dehors de la zone (arrière gauche) |

---

## 📏 Espacements Standards

### Distances Cohérentes (identiques aux barrières Lupo)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Container L  ←─ 12m ─→  [T]  ←─ 12m ─→  Container R │
│                                                     │
│                      ↕ 25m                          │
│                                                     │
│  Container L  ←─ 12m ─→  [T]  ←─ 12m ─→  Container R │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Valeurs Exactes

- **`containerOffset`** : **12 mètres** (distance transformateur ↔ container)
  - ✅ Identique au `pairingOffset` du template
  - ✅ Même distance que les barrières Lupo
  
- **`transformerSpacing`** : **25 mètres** (distance entre transformateurs)
  - ✅ Espacement régulier pour circulation
  - ✅ Permet accès maintenance

---

## 🏗️ Disposition Linéaire

### Vue de Dessus (Plan XZ)

```
                    Substation
                    (hors zone)
                        ↓
                    [-80, -100]


    ← X (Gauche/Droite)          Z (Avant/Arrière) ↓

    Container L    [T1]    Container R     Z = -62.5
         ↓          ↓          ↓
    [-12, -62.5]  [0, -62.5]  [12, -62.5]

                    ↕ 25m

    Container L    [T2]    Container R     Z = -37.5
    [-12, -37.5]  [0, -37.5]  [12, -37.5]

                    ↕ 25m

    Container L    [T3]    Container R     Z = -12.5
    [-12, -12.5]  [0, -12.5]  [12, -12.5]

                    ↕ 25m

    Container L    [T4]    Container R     Z = 12.5
    [-12, 12.5]   [0, 12.5]   [12, 12.5]

                    ↕ 25m

    Container L    [T5]    Container R     Z = 37.5
    [-12, 37.5]   [0, 37.5]   [12, 37.5]

                    ↕ 25m

    Container L    [T6]    Container R     Z = 62.5
    [-12, 62.5]   [0, 62.5]   [12, 62.5]


                                        Hangar →
                                    [50, 0] (à droite)
```

---

## 🔄 Duplication pour Puissances Supérieures

### Principe de Duplication

La disposition linéaire permet de **dupliquer facilement** le module 25MW :

#### 50MW = 2 × 25MW
```
Module 1 (X = -30)    Module 2 (X = +30)
      ↓                      ↓
   [6 Transfo]           [6 Transfo]
   [12 Containers]       [12 Containers]
```

#### 75MW = 3 × 25MW
```
Module 1     Module 2     Module 3
(X = -60)    (X = 0)      (X = +60)
```

#### 100MW = 4 × 25MW
```
Module 1     Module 2     Module 3     Module 4
(X = -90)    (X = -30)    (X = +30)    (X = +90)
```

### Espacement Entre Modules

- **Distance inter-modules** : 60 mètres (centre à centre)
- Permet circulation et maintenance entre les modules
- Symétrie parfaite autour de l'axe central (X = 0)

---

## ✅ Avantages de la Disposition Linéaire

### 1. **Simplicité**
- ✅ Alignement parfait sur un seul axe (Z)
- ✅ Symétrie gauche/droite (containers)
- ✅ Facile à comprendre et à visualiser

### 2. **Cohérence**
- ✅ Espacements identiques aux barrières Lupo (12m)
- ✅ Distances standardisées partout
- ✅ Template réutilisable

### 3. **Scalabilité**
- ✅ Duplication simple par translation sur X
- ✅ Fonctionne pour 25MW, 50MW, 75MW, 100MW, 125MW, 150MW, 200MW
- ✅ Pas de recalcul complexe

### 4. **Maintenance**
- ✅ Accès facile à tous les équipements
- ✅ Voies de circulation claires
- ✅ Espacement suffisant pour véhicules

---

## 🎨 Positionnement des Éléments Annexes

### Hangar de Maintenance
- **Position** : `[50, 0.5, 0]`
- **Logique** : À droite de la ligne principale
- **Accès** : Facile depuis tous les transformateurs

### Substation 200MW
- **Position** : `[-80, 0.5, -100]`
- **Logique** : **EN DEHORS** de la zone de déploiement
- **Séparation** : Claire et distincte des transformateurs/containers

---

## 📝 Implémentation Code

### Fonction de Génération

```typescript
function generateFromShapeConfig(
  shapeConfig: CampusShapeConfig,
  conditions: SiteConditions,
  groundSize: number
): EquipmentPosition[] {
  const transformerSpacing = 25; // Espacement entre transformateurs
  const containerOffset = 12;    // Distance container-transformateur (= barrières Lupo)
  const startZ = -62.5;          // Position de départ (centré)
  
  // Générer 6 transformateurs en ligne
  for (let i = 0; i < 6; i++) {
    const transformerZ = startZ + (i * transformerSpacing);
    
    // Transformateur au centre (X = 0)
    // Container gauche (X = -12)
    // Container droite (X = +12)
  }
}
```

---

## 🚀 Résultat

Une disposition **parfaitement linéaire**, **symétrique** et **facilement duplicable** qui :

1. ✅ Utilise les mêmes espacements que les barrières Lupo (12m)
2. ✅ Permet une duplication simple pour 50MW, 75MW, 100MW+
3. ✅ Maintient la substation en dehors de la zone de déploiement
4. ✅ Offre une excellente accessibilité pour la maintenance

---

**Date de création** : 15 décembre 2025  
**Version** : 1.0 - Disposition Linéaire Standard







