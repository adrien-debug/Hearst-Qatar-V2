# Implémentation des Zones Sécurisées VRD

## Vue d'ensemble

Ce document décrit l'implémentation complète du système de zones sécurisées VRD (Voiries et Réseaux Divers) pour les installations électriques avec transformateurs et containers.

## Architecture

### Configuration : 1 Transformateur + 2 Containers

Chaque zone sécurisée comprend :
- **1 transformateur** au centre
- **2 containers HD5** (A et B) de part et d'autre
- **Grillage métallique perforé** tout autour
- **Sol en graviers** sur toute la surface
- **Portail d'accès coulissant**
- **Signalétique de sécurité**

```
┌─────────────────────────────────────┐
│  🚧 ZONE SÉCURISÉE HAUTE TENSION   │
│                                     │
│  [Container A]  🔌  [Container B]  │
│                 ⚡                   │
│            [Transformateur]         │
│                                     │
│  Graviers • • • • • • • • • • • •  │
│                                     │
│  🚪 Portail coulissant              │
└─────────────────────────────────────┘
```

## Composants créés

### 1. GravelGround.tsx

Sol en graviers avec texture procédurale réaliste.

**Caractéristiques :**
- Texture procédurale générée dynamiquement
- Graviers de 2cm (calibre 10/20)
- Épaisseur 15cm
- Normal map pour relief 3D
- Bordures de délimitation

**Utilisation :**
```typescript
import GravelGround from './GravelGround';

<GravelGround
  width={30}
  depth={15}
  position={[0, 0, 0]}
  thickness={0.15}
  color="#bdc3c7"
  roughness={0.95}
/>
```

### 2. PerforatedMeshFence.tsx

Grillage métallique perforé avec poteaux et portail.

**Caractéristiques :**
- Poteaux métalliques tous les 3m
- Tissu perforé avec trous de 5cm × 5cm
- Hauteur 2.5m
- Portail coulissant animé
- Optimisé avec textures canvas

**Utilisation :**
```typescript
import PerforatedMeshFence from './PerforatedMeshFence';

<PerforatedMeshFence
  width={30}
  depth={15}
  position={[0, 0, 0]}
  height={2.5}
  hasGate={true}
  gatePosition="front"
  gateWidth={4.0}
  isGateOpen={false}
/>
```

### 3. SecureElectricalZone.tsx

Orchestrateur principal qui assemble tous les éléments.

**Caractéristiques :**
- Calcul automatique des dimensions
- Gestion des distances de sécurité
- Signalétique intégrée
- Hook de détection automatique

**Utilisation :**
```typescript
import SecureElectricalZone from './SecureElectricalZone';

<SecureElectricalZone
  transformerPosition={[0, 0, 0]}
  containerPositions={[[-8, 0, 0], [8, 0, 0]]}
  showFence={true}
  showGravel={true}
  gateOpen={false}
/>
```

### 4. Intégration dans ModularLayout.tsx

Le système détecte automatiquement les groupes transformateur + containers et crée les zones sécurisées.

**Code ajouté :**
```typescript
// Détecter automatiquement les zones sécurisées
const secureZones = useSecureZoneDetection(equipment);

// Rendu des zones
{secureZones.map((zone, index) => (
  <SecureElectricalZone
    key={`secure-zone-${index}`}
    transformerPosition={zone.transformer.position}
    containerPositions={[
      zone.containers[0].position,
      zone.containers[1].position,
    ]}
    showFence={true}
    showGravel={true}
    gateOpen={false}
  />
))}
```

## Configuration (3d.config.ts)

### Distances de sécurité

Conformes aux normes IEC 61936-1 et NFC 13-100 :

```typescript
secureZone: {
  transformerClearance: 3.0,      // 3m autour du transformateur
  containerClearance: 1.5,         // 1.5m autour des containers
  fenceToEquipment: 2.0,           // 2m entre clôture et équipements
  equipmentSpacing: 3.5,           // 3.5m entre transformateur et containers
}
```

### Paramètres du grillage

```typescript
fence: {
  height: 2.5,                     // Hauteur standard
  postSpacing: 3.0,                // Poteaux tous les 3m
  meshHoleSize: 0.05,              // Trous de 5cm × 5cm
  wireThickness: 0.003,            // Fil de 3mm
  color: '#7f8c8d',                // Acier galvanisé
}
```

### Paramètres des graviers

```typescript
gravel: {
  thickness: 0.15,                 // 15cm d'épaisseur
  color: '#bdc3c7',                // Gris clair
  roughness: 0.95,                 // Surface mate
  particleSize: 0.02,              // Graviers de 2cm
}
```

## Normes appliquées

### IEC 61936-1 (International)
- Distance minimale de sécurité : 3m autour des transformateurs MT/BT
- Hauteur de clôture : minimum 2.5m
- Signalétique obligatoire sur tous les côtés

### NFC 13-100 (France)
- Zone de voisinage : 3m pour installations > 1000V
- Sol isolant obligatoire (graviers)
- Accès contrôlé avec portail verrouillable

### Kahramaa (Qatar)
- Conformité aux standards internationaux IEC
- Signalétique bilingue (anglais/arabe)
- Inspection annuelle obligatoire

## Dimensions calculées

Pour une configuration standard :

| Élément | Dimensions |
|---------|-----------|
| Transformateur | 2.5m × 2.0m × 2.5m (L×H×P) |
| Container HD5 | 12.196m × 2.896m × 2.438m |
| Espacement T-C | 3.5m minimum |
| Zone totale | ~30m × 15m |
| Surface graviers | ~450 m² |

## Optimisations performances

### Textures procédurales
- Génération côté client (canvas)
- Pas de fichiers images lourds
- Répétition seamless

### Instancing
- Poteaux de clôture instanciés
- Grillage optimisé avec alpha maps
- LOD (Level of Detail) possible

### Rendu conditionnel
```typescript
showFence={true}      // Peut être désactivé
showGravel={true}     // Peut être désactivé
```

## Validation visuelle

### Checklist de validation

- ✅ Sol en graviers visible et réaliste
- ✅ Grillage perforé avec trous visibles
- ✅ Poteaux tous les 3m
- ✅ Portail coulissant fonctionnel
- ✅ Signalétique présente
- ✅ Distances de sécurité respectées
- ✅ FPS > 30 avec plusieurs zones

## Utilisation avancée

### Personnaliser une zone

```typescript
<SecureElectricalZone
  transformerPosition={[0, 0, 0]}
  containerPositions={[[-8, 0, 0], [8, 0, 0]]}
  customConfig={{
    fence: {
      height: 3.0,           // Clôture plus haute
      color: '#555555',      // Couleur personnalisée
    },
    gravel: {
      color: '#d4d4d4',      // Graviers plus clairs
    },
  }}
/>
```

### Désactiver certains éléments

```typescript
<SecureElectricalZone
  transformerPosition={[0, 0, 0]}
  containerPositions={[[-8, 0, 0], [8, 0, 0]]}
  showFence={false}          // Pas de clôture
  showGravel={true}          // Seulement les graviers
/>
```

### Ouvrir le portail

```typescript
<SecureElectricalZone
  transformerPosition={[0, 0, 0]}
  containerPositions={[[-8, 0, 0], [8, 0, 0]]}
  gateOpen={true}            // Portail ouvert (animation)
/>
```

## Dépannage

### Le grillage n'apparaît pas
- Vérifier que `showFence={true}`
- Vérifier les dimensions (width/depth > 0)
- Vérifier la position de la caméra

### Les graviers sont trop sombres/clairs
- Ajuster `color` dans la config
- Ajuster `roughness` (0.9-1.0)

### Performances faibles
- Réduire `meshHoleSize` (moins de détails)
- Désactiver les zones non visibles
- Utiliser `SimpleMeshFence` au lieu de `PerforatedMeshFence`

## Évolutions futures

### Phase 2
- [ ] Éclairage de sécurité nocturne
- [ ] Caméras de surveillance 3D
- [ ] Système d'alarme visuel
- [ ] Panneau de contrôle d'accès

### Phase 3
- [ ] Simulation d'intrusion
- [ ] Mode inspection (zones de danger colorées)
- [ ] Export des plans de sécurité
- [ ] Rapport de conformité automatique

## Fichiers modifiés

```
components/3d/
├── GravelGround.tsx              ✅ Nouveau
├── PerforatedMeshFence.tsx       ✅ Nouveau
├── SecureElectricalZone.tsx      ✅ Nouveau
└── ModularLayout.tsx             ✏️ Modifié

config/
└── 3d.config.ts                  ✏️ Modifié

docs/implementation/
└── IMPLEMENTATION_ZONES_SECURISEES_VRD.md  ✅ Nouveau
```

## Support

Pour toute question ou problème :
1. Vérifier ce document
2. Consulter les commentaires dans le code
3. Tester avec `SimpleSecureZone` pour isoler le problème

---

**Date de création** : 16 décembre 2025  
**Version** : 1.0.0  
**Auteur** : Équipe VRD Hearst Qatar




