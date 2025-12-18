# 📐 Diagramme de Layout - Containers et Sections

## Vue de Dessus (Top View)

```
                        SUBSTATION 200MW
                         [x:0, z:60]
                              │
              ┌───────────────┴────────────────┐
              │                                │
    ┌─────────┴────────┐            ┌─────────┴────────┐
    │   POWER BLOCK 1  │            │   POWER BLOCK 2  │
    │    [x:-75]       │            │    [x:-25]       │
    └──────────────────┘            └──────────────────┘
    ┌─────────────────┐              ┌─────────────────┐
    │  POWER BLOCK 3  │              │  POWER BLOCK 4  │
    │    [x:25]       │              │    [x:75]       │
    └─────────────────┘              └─────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SECTION 1 (Power Block 1) - Position X: -75

Container A1  [x:-87, z:-15]  ◄─── TR1 [x:-75, z:-15] ───► Container B1  [x:-63, z:-15]
Container A2  [x:-87, z:-35]  ◄─── TR2 [x:-75, z:-35] ───► Container B2  [x:-63, z:-35]
Container A3  [x:-87, z:-55]  ◄─── TR3 [x:-75, z:-55] ───► Container B3  [x:-63, z:-55]
Container A4  [x:-87, z:-75]  ◄─── TR4 [x:-75, z:-75] ───► Container B4  [x:-63, z:-75]


## SECTION 2 (Power Block 2) - Position X: -25

Container A5  [x:-37, z:-15]  ◄─── TR1 [x:-25, z:-15] ───► Container B5  [x:-13, z:-15]
Container A6  [x:-37, z:-35]  ◄─── TR2 [x:-25, z:-35] ───► Container B6  [x:-13, z:-35]
Container A7  [x:-37, z:-55]  ◄─── TR3 [x:-25, z:-55] ───► Container B7  [x:-13, z:-55]
Container A8  [x:-37, z:-75]  ◄─── TR4 [x:-25, z:-75] ───► Container B8  [x:-13, z:-75]


## SECTION 3 (Power Block 3) - Position X: 25

Container A9  [x:13, z:-15]   ◄─── TR1 [x:25, z:-15] ───► Container B9  [x:37, z:-15]
Container A10 [x:13, z:-35]   ◄─── TR2 [x:25, z:-35] ───► Container B10 [x:37, z:-35]
Container A11 [x:13, z:-55]   ◄─── TR3 [x:25, z:-55] ───► Container B11 [x:37, z:-55]
Container A12 [x:13, z:-75]   ◄─── TR4 [x:25, z:-75] ───► Container B12 [x:37, z:-75]


## SECTION 4 (Power Block 4) - Position X: 75

Container A13 [x:63, z:-15]   ◄─── TR1 [x:75, z:-15] ───► Container B13 [x:87, z:-15]
Container A14 [x:63, z:-35]   ◄─── TR2 [x:75, z:-35] ───► Container B14 [x:87, z:-35]
Container A15 [x:63, z:-55]   ◄─── TR3 [x:75, z:-55] ───► Container B15 [x:87, z:-55]
Container A16 [x:63, z:-75]   ◄─── TR4 [x:75, z:-75] ───► Container B16 [x:87, z:-75]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Vue Simplifiée (Top View)

```
Z-Axis (profondeur)
↑
│                         [SUBSTATION z:60]
│
│        Section 1    Section 2    Section 3    Section 4
│         x:-75         x:-25        x:25         x:75
│
0 ─────────────────────────────────────────────────────────► X-Axis
│
│   -15   ║ A1  B1 ║   ║ A5  B5 ║   ║ A9  B9 ║   ║ A13 B13 ║
│         ║   TR1  ║   ║   TR1  ║   ║   TR1  ║   ║   TR1   ║
│
│   -35   ║ A2  B2 ║   ║ A6  B6 ║   ║ A10 B10║   ║ A14 B14 ║
│         ║   TR2  ║   ║   TR2  ║   ║   TR2  ║   ║   TR2   ║
│
│   -55   ║ A3  B3 ║   ║ A7  B7 ║   ║ A11 B11║   ║ A15 B15 ║
│         ║   TR3  ║   ║   TR3  ║   ║   TR3  ║   ║   TR3   ║
│
│   -75   ║ A4  B4 ║   ║ A8  B8 ║   ║ A12 B12║   ║ A16 B16 ║
│         ║   TR4  ║   ║   TR4  ║   ║   TR4  ║   ║   TR4   ║
│
↓
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Positions Actuelles des Bâtiments (À AJUSTER)

🏢 **Bâtiment PERSONNEL** (gauche) : `[x:-100, z:0]`
🏢 **Bâtiment MAINTENANCE** (droite) : `[x:100, z:0]`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Dimensions Importantes

- **Longueur Container** : 12.196m
- **Espacement Power Blocks** : 50m (entre chaque section)
- **Espacement Transformateurs** : 20m (vertical, axe Z)
- **Largeur Section** : ~24m (A + TR + B)
- **Profondeur Totale Containers** : ~60m (4 lignes × 20m)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ❓ OÙ PLACER LES BÂTIMENTS ?

### Options Possibles :

**Option A - Parallèle à l'axe Z (sur les côtés gauche/droite)** :
```
Bâtiment PERSONNEL    Section 1-2-3-4    Bâtiment MAINTENANCE
     (gauche)         (centre)              (droite)
     x:-120                                  x:120
```

**Option B - Parallèle à l'axe X (devant/derrière)** :
```
                    Bâtiment PERSONNEL
                         (devant)
                         z:-100
                           │
            Section 1 | Section 2 | Section 3 | Section 4
                           │
                    Bâtiment MAINTENANCE
                        (derrière)
                         z:100
```

**Option C - En angle ou position spécifique** :
À définir selon vos besoins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📝 INSTRUCTIONS

**Dites-moi :**
1. Quelle option vous préférez (A, B, ou C avec coordonnées spécifiques)
2. L'orientation des bâtiments (rotation en degrés : 0°, 90°, 180°, 270°)
3. Les positions exactes X, Z pour chaque bâtiment

**Exemple de réponse :**
"Option A, Bâtiment Personnel à x:-120, z:-40, rotation 90°"
"Bâtiment Maintenance à x:120, z:-40, rotation 270°"











