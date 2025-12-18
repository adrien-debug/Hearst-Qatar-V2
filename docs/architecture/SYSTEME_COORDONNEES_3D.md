# 📐 Système de Coordonnées 3D - Référence

## 🎯 Système Three.js (Utilisé dans le Code)

### Axes de Coordonnées

```
        Y (Hauteur)
        ↑
        |
        |
        |
        +--------→ X (Gauche/Droite - HORIZONTAL)
       /
      /
     ↙
    Z (Avant/Arrière - PROFONDEUR)
```

### Définition des Axes

| Axe | Direction | Usage |
|-----|-----------|-------|
| **X** | Gauche (-) / Droite (+) | **HORIZONTAL** - Alignement des barrières/transformateurs |
| **Y** | Bas (-) / Haut (+) | **VERTICAL** - Hauteur des objets (toujours > 0 pour objets au sol) |
| **Z** | Avant (-) / Arrière (+) | **PROFONDEUR** - Containers verticaux |

---

## 🔄 Conversion depuis modularCampusShapes.ts

### Format du Fichier Shape

Le fichier `modularCampusShapes.ts` utilise :
```typescript
position: { x: number, y: number, z: number }
```

Où :
- `x` = coordonnée horizontale (gauche/droite)
- `y` = coordonnée de profondeur (avant/arrière)
- `z` = hauteur (généralement 0 pour objets au sol)

### Conversion vers Three.js

```typescript
// Fichier shape: { x, y, z }
// Three.js: [x, y, z]

const threePosition: [number, number, number] = [
  shape.position.x,  // X reste X (horizontal)
  0.3,               // Y = hauteur fixe (au sol)
  shape.position.y   // Z = profondeur (y du shape devient z en 3D)
];
```

---

## 📏 Disposition Linéaire 25MW

### Vue de Dessus (Plan XZ)

```
    Z (Profondeur - CONTAINERS VERTICAUX)
    ↑
    |
    |  Container F (Z = -12m)
    |      ↑
    |      |
    +──────[T1]────[T2]────[T3]────[T4]────[T5]────[T6]────→ X (Horizontal - BARRIÈRES)
    |      |
    |      ↓
    |  Container B (Z = +12m)
    |
    
    X: -50   -30   -10   +10   +30   +50
```

### Positions Exactes

#### Transformateurs (sur l'axe X, Z=0)
```typescript
T1: [-50, 0.3,  0]
T2: [-30, 0.3,  0]
T3: [-10, 0.3,  0]
T4: [ 10, 0.3,  0]
T5: [ 30, 0.3,  0]
T6: [ 50, 0.3,  0]
```

#### Containers (décalés sur Z, rotation 90°)
```typescript
// Containers AVANT (Z négatif)
T1_F: [-50, 0.7, -12]  rotation: [0, π/2, 0]
T2_F: [-30, 0.7, -12]  rotation: [0, π/2, 0]
...

// Containers ARRIÈRE (Z positif)
T1_B: [-50, 0.7,  12]  rotation: [0, π/2, 0]
T2_B: [-30, 0.7,  12]  rotation: [0, π/2, 0]
...
```

---

## 🔄 Rotations

### Format Three.js

```typescript
rotation: [x, y, z]  // En radians
```

### Rotations Courantes

| Rotation | Valeur | Description |
|----------|--------|-------------|
| Aucune | `[0, 0, 0]` | Orientation par défaut |
| 90° sur Y | `[0, Math.PI/2, 0]` | Tourner de 90° (containers verticaux) |
| 180° sur Y | `[0, Math.PI, 0]` | Tourner de 180° |
| -90° sur Y | `[0, -Math.PI/2, 0]` | Tourner de -90° |

---

## 🏗️ Éléments Annexes

### Hangar
```typescript
position: [70, 0.5, 0]
// X=70 (à droite de la ligne)
// Y=0.5 (au sol)
// Z=0 (aligné avec transformateurs)
```

### Substation (HORS ZONE)
```typescript
position: [-100, 0.5, -50]
// X=-100 (très à gauche)
// Y=0.5 (au sol)
// Z=-50 (vers l'avant, hors zone)
```

---

## ✅ Règles de Positionnement

### 1. Hauteur (Y)
- **Sol** : Y = 0
- **Dalles béton** : Y = 0.2
- **Équipements sur dalles** : Y = 0.7
- **Équipements sans dalles** : Y = 0.3

### 2. Orientation
- **Barrières/Transformateurs** : Alignés sur **axe X** (horizontal)
- **Containers** : Orientés sur **axe Z** (vertical) avec rotation 90°

### 3. Espacements
- **Entre transformateurs** : 20m (sur X)
- **Transformateur ↔ Container** : 12m (sur Z)
- **Éléments hors zone** : > 70m de distance

---

## 🎨 Visualisation

### Caméra par Défaut
```typescript
camera.position = [0, 50, 100]
// Regardant vers le centre (0, 0, 0)
```

### Contrôles OrbitControls
- **Clic gauche + glisser** : Rotation autour du centre
- **Clic droit + glisser** : Translation (pan)
- **Molette** : Zoom

---

**Date de création** : 15 décembre 2025  
**Version** : 1.0 - Référence Système de Coordonnées







