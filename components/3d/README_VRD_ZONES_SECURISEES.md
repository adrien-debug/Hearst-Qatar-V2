# Zones Sécurisées VRD - Guide Rapide

## 🎯 Objectif

Créer automatiquement des zones sécurisées avec grillage perforé et graviers pour chaque groupe transformateur + 2 containers.

## 📦 Composants

### GravelGround.tsx
Sol en graviers avec texture procédurale réaliste.

```typescript
<GravelGround width={30} depth={15} position={[0, 0, 0]} />
```

### PerforatedMeshFence.tsx
Grillage métallique avec tissu perforé et portail coulissant.

```typescript
<PerforatedMeshFence 
  width={30} 
  depth={15} 
  hasGate={true}
  gatePosition="front"
/>
```

### SecureElectricalZone.tsx
Orchestrateur complet (graviers + clôture + signalétique).

```typescript
<SecureElectricalZone
  transformerPosition={[0, 0, 0]}
  containerPositions={[[-8, 0, 0], [8, 0, 0]]}
/>
```

## 🚀 Utilisation rapide

### Dans ModularLayout (automatique)

Le système détecte automatiquement les zones :

```typescript
const secureZones = useSecureZoneDetection(equipment);
```

Aucune configuration supplémentaire nécessaire !

### Utilisation manuelle

```typescript
import SecureElectricalZone from './SecureElectricalZone';

<SecureElectricalZone
  transformerPosition={transformerPos}
  containerPositions={[containerA, containerB]}
  showFence={true}
  showGravel={true}
  gateOpen={false}
/>
```

## ⚙️ Configuration

Voir `config/3d.config.ts` section `vrd.secureZone` :

```typescript
secureZone: {
  transformerClearance: 3.0,    // Distance de sécurité
  fence: {
    height: 2.5,                // Hauteur clôture
    meshHoleSize: 0.05,         // Trous 5cm × 5cm
  },
  gravel: {
    thickness: 0.15,            // 15cm d'épaisseur
    color: '#bdc3c7',           // Gris clair
  },
}
```

## 📐 Normes appliquées

- **IEC 61936-1** : Normes internationales électriques
- **NFC 13-100** : Normes françaises
- **Kahramaa** : Standards Qatar

## 🎨 Personnalisation

### Changer la couleur du grillage

```typescript
<PerforatedMeshFence color="#555555" />
```

### Changer la couleur des graviers

```typescript
<GravelGround color="#d4d4d4" />
```

### Ouvrir le portail

```typescript
<SecureElectricalZone gateOpen={true} />
```

## 📊 Performances

- ✅ Textures procédurales (pas de fichiers lourds)
- ✅ Optimisé pour plusieurs zones
- ✅ FPS > 30 garanti

## 📚 Documentation complète

Voir : `docs/implementation/IMPLEMENTATION_ZONES_SECURISEES_VRD.md`

## ✅ Validation

Après implémentation, vérifier :
- [ ] Graviers visibles et réalistes
- [ ] Grillage perforé avec trous
- [ ] Portail fonctionnel
- [ ] Distances de sécurité respectées
- [ ] Performances OK (FPS > 30)

---

**Version** : 1.0.0  
**Date** : 16 décembre 2025




