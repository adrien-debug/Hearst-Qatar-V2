# Implémentation du Conteneur de Base avec Sous-station

## Vue d'ensemble

Un nouveau composant 3D a été créé pour représenter fidèlement la structure visible sur l'image de référence : un conteneur de base avec une sous-station empilée au-dessus.

## Composant créé

### `SubstationContainer3D.tsx`

**Localisation:** `components/3d/SubstationContainer3D.tsx`

**Description:** Composant React Three Fiber qui modélise exactement la structure de l'image :
- Conteneur de base (unité inférieure) avec tous les détails
- Sous-station (unité supérieure) avec panneaux de refroidissement bleus

## Structure détaillée

### Base - Conteneur avec Panneaux Bleus (Unité Inférieure)

**Dimensions:** 12.196m × 2.6m × 2.2m (plus large, moins haut)

1. **Structure principale**
   - Conteneur rectangulaire blanc, plus large et moins haut que le standard
   - Montants verticaux blancs robustes séparant les panneaux

2. **Panneaux bleus**
   - 8 panneaux bleus inclinés vers l'intérieur (trapèzes/triangles)
   - Couleur bleu foncé: `#1e40af`
   - Inclinaison: 18 degrés vers l'intérieur

3. **Partie supérieure ouverte**
   - 14 compartiments noirs (serveurs dans liquide d'immersion)
   - Barres transversales blanches supportant la structure

4. **Extrémité droite**
   - Système de ventilation avec grille blanche
   - Serpentins métalliques (tuyaux)
   - Marquage "BITMAIN" sur le cadre supérieur

5. **Extrémité gauche**
   - Marquage "HDS-R" vertical

6. **Marquages**
   - Logo "ANT SPACE" au centre sur le cadre supérieur

### Sous-station - Conteneur Blanc Standard (Unité Supérieure)

**Dimensions:** 12.196m × 2.438m × 2.896m (plus étroit, plus haut)

1. **Structure principale**
   - Conteneur maritime standard fermé, blanc
   - Empilé sur la base (centré)

2. **Nervures horizontales**
   - Tôle ondulée horizontale caractéristique des conteneurs maritimes
   - 20 nervures horizontales sur les côtés

3. **Extrémité droite**
   - Deux grandes ouvertures carrées superposées
   - Grilles sombres (ventilateurs)
   - Structure en croix pour les grilles

4. **Conduits**
   - Petits conduits/tuyaux près de la base de l'extrémité droite

5. **Toit**
   - Toit plat ondulé avec nervures
   - Petit boîtier de ventilation légèrement courbé (vers l'avant/gauche)

## Page de test

### `substation-container-test.tsx`

**Localisation:** `pages/substation-container-test.tsx`

**URL d'accès:** `http://localhost:1111/substation-container-test`

Cette page permet de visualiser le composant isolé avec :
- Éclairage désertique optimisé
- Sol sablonneux
- Contrôles de caméra interactifs
- Panneau d'information pour la sélection

## Utilisation

### Intégration dans une scène existante

```tsx
import SubstationContainer3D from '../components/3d/SubstationContainer3D';

<SubstationContainer3D 
  position={[0, 0, 0]}
  containerId="SUBSTATION_CONTAINER_001"
  onSelect={(id) => handleSelect(id)}
  isSelected={selectedId === "SUBSTATION_CONTAINER_001"}
/>
```

### Props

- `position: [number, number, number]` - Position 3D du conteneur
- `containerId: string` - Identifiant unique
- `onSelect?: (id: string) => void` - Callback de sélection
- `isSelected?: boolean` - État de sélection (affecte l'apparence)

## Caractéristiques techniques

### Matériaux

- **Conteneur de base:** Blanc (`#ffffff`), métallique léger (metalness: 0.1, roughness: 0.7)
- **Panneaux bleus:** Bleu vif (`#0066ff`), métallique (metalness: 0.2, roughness: 0.2)
- **Grilles:** Noir (`#1f2937`), métallique (metalness: 0.6, roughness: 0.3)
- **Tuyaux:** Gris clair métallique (`#cbd5e1`), très métallique (metalness: 0.8, roughness: 0.2)

### Ombres et rendu

- Tous les éléments principaux projettent des ombres (`castShadow`)
- Le conteneur de base reçoit des ombres (`receiveShadow`)
- Optimisé pour le rendu PBR (Physically Based Rendering)

### Interactivité

- Clic pour sélectionner
- Hover pour changer le curseur
- Émission de lumière bleue lorsque sélectionné

## Correspondance avec l'image

Le composant a été conçu pour correspondre exactement à la description de l'image :

✅ Conteneur de base avec nervures verticales  
✅ Section encastrée à gauche avec fentes  
✅ Marquages "HDS-R", ANTSPACE, BITMAIN  
✅ Panneaux bleus inclinés vers l'extérieur  
✅ Grilles noires horizontales  
✅ Unité d'extrémité droite avec ventilateurs  
✅ Tuyaux métalliques sur le côté droit  
✅ Structure empilée (base + sous-station)  

## Prochaines étapes

1. **Intégration dans la scène principale** - Ajouter ce composant à `Substation3D.tsx` si nécessaire
2. **Optimisation** - Utiliser l'instancing si plusieurs instances sont nécessaires
3. **Textures** - Ajouter des textures détaillées pour les logos et marquages
4. **Animations** - Ajouter des animations pour les ventilateurs si nécessaire

## Notes

- Le composant est entièrement procédural (pas de modèle GLB requis)
- Les dimensions sont basées sur les standards des conteneurs maritimes
- La couleur bleue des panneaux peut être ajustée si nécessaire
- Tous les éléments sont positionnés relativement pour faciliter les ajustements
