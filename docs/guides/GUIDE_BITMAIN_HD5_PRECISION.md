# Guide Bitmain HD5 - Modèle Haute Précision Métal Noir

## Vue d'Ensemble

Modèle 3D ultra-précis du système Bitmain ANTSPACE HD5 empilé, basé sur l'analyse pixel par pixel de l'image de référence.

## Structure Empilée

### Container HDS-R (Bas)
- **Dimensions** : 12.196m × 2.438m × 2.896m
- **Matériau** : Métal noir #1a1a1a
- **Finition** : Roughness 0.35, Metalness 0.75
- **Texture** : Ondulations (corrugated) sur les côtés

### Dry Cooler (Haut)
- **Dimensions** : 12.196m × 2.438m × 2.896m (identique)
- **Position** : Empilé directement au-dessus
- **Matériau** : Métal noir #1a1a1a
- **Structure** : Cadre métallique visible

## Détails Modélisés

### Container HDS-R

#### 1. Structure Principale
- Container principal avec dimensions exactes
- Ondulations (ribs) sur les côtés : 20 ribs espacés régulièrement
- Épaisseur des ribs : 0.05m
- Matériau métal noir avec brillance métallique

#### 2. Panneaux de Ventilation Gauche
- **Nombre** : 7 panneaux verticaux
- **Position** : Extrémité gauche du container
- **Dimensions** : 0.3m × 2.5m × 0.05m
- **Espacement** : 0.35m entre panneaux
- **Grilles** : 15 grilles horizontales par panneau
- **Matériau** : Métal noir avec grilles noires

#### 3. Système de Tuyauterie Droite
- **Colonnes verticales** : 4 colonnes
- **Diamètre** : 0.15m (rayon 0.075m)
- **Hauteur** : 2.5m
- **Espacement** : 2.5m entre colonnes
- **Connexions horizontales** : Entre chaque colonne
- **Valves** : 0.2m × 0.2m × 0.2m sur chaque connexion
- **Matériau** : Argenté #C0C0C0 (Roughness 0.2, Metalness 0.9)

#### 4. Ventilateurs Circulaires
- **Nombre** : 2 ventilateurs
- **Position** : Bas droite, intégrés dans la paroi
- **Diamètre** : 0.8m (rayon 0.4m)
- **Hauteur** : 0.15m
- **Disposition** : Empilés verticalement
- **Positions Y** : 0.4 + 0.8m et 0.4 + 1.6m
- **Pales** : 6 pales par ventilateur
- **Grilles** : Noires avec détails

#### 5. Logo Hearst
- **Position** : Centre de la face avant
- **Dimensions** : 1.5m × 0.8m
- **Couleur** : Vert Hearst #00A651
- **Émission** : 0.25 intensity
- **Matériau** : Roughness 0.3, Metalness 0.7
- **Texte** : "HEARST" en dessous (1.2m × 0.2m)

### Dry Cooler

#### 1. Structure Principale
- Container identique au container bas
- Cadre structurel visible :
  - 4 montants verticaux aux coins (0.15m × 2.896m × 0.15m)
  - 4 traverses horizontales (12.196m × 0.15m × 0.15m)
- Matériau métal noir

#### 2. Panneaux Bleus Inclinés
- **Nombre** : 10 panneaux
- **Dimensions** : 1.0m × 2.4m × 0.05m
- **Inclinaison** : 18° vers l'intérieur
- **Espacement** : Régulier sur toute la longueur
- **Couleur** : Bleu foncé #1E3A8A
- **Matériau** : Roughness 0.5, Metalness 0.5
- **Supports** : Structure noire verticale (0.1m × 2.4m × 0.1m)

#### 3. Grilles Noires sur le Dessus
- **Nombre** : 25 grilles (5 × 5)
- **Dimensions** : 2.2m × 0.05m × 0.4m
- **Espacement** : Régulier
- **Détails** : 8 lignes par grille
- **Matériau** : Noir #000000 (Roughness 0.6, Metalness 0.3)
- **Position** : Sur le dessus du dry cooler

#### 4. Logo Hearst
- Même configuration que sur le container bas
- Position : Centre de la face avant

### Connexions entre Containers

#### Tuyaux de Connexion
- **Nombre** : 12 tuyaux (6 de chaque côté)
- **Diamètre** : 0.16m (rayon 0.08m)
- **Hauteur** : 2.896m (hauteur d'un container)
- **Espacement** : Régulier sur la longueur
- **Position** : Côtés gauche et droit
- **Matériau** : Argenté #C0C0C0

## Matériaux Détaillés

### Métal Noir Principal
```javascript
{
    color: 0x1a1a1a,
    roughness: 0.35,
    metalness: 0.75,
    envMapIntensity: 1.0
}
```

### Tuyauterie Argentée
```javascript
{
    color: 0xC0C0C0,
    roughness: 0.2,
    metalness: 0.9
}
```

### Panneaux Bleus
```javascript
{
    color: 0x1E3A8A,
    roughness: 0.5,
    metalness: 0.5
}
```

### Logo Hearst
```javascript
{
    color: 0x00A651,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x00A651,
    emissiveIntensity: 0.25
}
```

### Grilles Noires
```javascript
{
    color: 0x000000,
    roughness: 0.6,
    metalness: 0.3
}
```

## Éclairage

### Configuration
- **Lumière ambiante** : 0.5 intensity
- **Lumière directionnelle principale** : 1.0 intensity, position (20, 30, 20)
- **Lumière d'appoint** : 0.3 intensity, position (-15, 20, -15)
- **Lumière hémisphérique** : 0.4 intensity

### Ombres
- **Résolution** : 2048 × 2048
- **Type** : PCF Soft Shadow
- **Portée** : -40 à +40 mètres

## Dimensions Exactes

### Container HDS-R
- Longueur : 12.196 m
- Largeur : 2.438 m
- Hauteur : 2.896 m
- Volume : ~86.5 m³

### Dry Cooler
- Longueur : 12.196 m
- Largeur : 2.438 m
- Hauteur : 2.896 m
- Volume : ~86.5 m³

### Système Complet
- Hauteur totale : ~6.0 m (sans dalle)
- Dalle béton : 13.0m × 3.0m × 0.4m

## Précision du Modèle

### Détails Modélisés
- ✅ Ondulations du container (20 ribs)
- ✅ 7 panneaux de ventilation avec grilles
- ✅ Système de tuyauterie complet (4 colonnes + valves)
- ✅ 2 ventilateurs circulaires avec pales
- ✅ Cadre structurel du dry cooler
- ✅ 10 panneaux bleus inclinés avec supports
- ✅ 25 grilles noires sur le dessus
- ✅ Logo Hearst sur chaque container
- ✅ Tuyaux de connexion (12 tuyaux)
- ✅ Tous les détails visibles sur l'image

### Optimisations
- Utilisation de BufferGeometry pour précision
- Instancing pour les grilles répétitives
- Shadow maps haute résolution
- Antialiasing activé

## Utilisation

### Ouvrir le Viewer
```bash
open bitmain-hd5-precision-noir.html
```

### Contrôles
- **Clic gauche + glisser** : Rotation
- **Molette** : Zoom
- **Boutons UI** : Réinitialiser, Grille, Wireframe

## Validation

### Checklist
- [x] Dimensions exactes (12.196m × 2.438m × 2.896m)
- [x] Matériau métal noir avec brillance
- [x] Logo Hearst centré sur chaque container
- [x] Tous les détails visibles sur l'image
- [x] Tuyauterie complète avec valves
- [x] Ventilateurs avec détails
- [x] Panneaux inclinés correctement
- [x] Grilles sur dessus du dry cooler
- [x] Structure empilée parfaite
- [x] Ombres et éclairage réalistes

## Références

- Image de référence : Bitmain ANTSPACE HD5 (vue isométrique)
- Dimensions : Spécifications officielles Bitmain
- Matériaux : Basés sur l'analyse visuelle de l'image
- Logo : Hearst Qatar (remplace Bitmain/ANTSPACE)

---

**Créé pour :** Hearst Qatar Project  
**Précision :** Pixel-perfect basé sur analyse d'image  
**Matériau :** Métal noir avec finition métallique  
**Status :** ✅ Complet et validé







