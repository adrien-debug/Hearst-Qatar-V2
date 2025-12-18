# Audit des Doublons - Composants 3D

## Fichiers à supprimer après migration

### Composants HD5Container (8 variantes → 1 unifié)

Les fichiers suivants doivent être supprimés après migration vers `components/3d/HD5Container.tsx` :

1. ✅ `components/3d/HD5Container3D.tsx` - Version détaillée originale
2. ✅ `components/3d/HD5ContainerDetailedInstanced.tsx` - Version instanciée détaillée
3. ✅ `components/3d/HD5ContainerFinal3D.tsx` - Version finale
4. ✅ `components/3d/HD5ContainerInstanced.tsx` - Version instanciée
5. ✅ `components/3d/HD5ContainerInstancedMinimal.tsx` - Version instanciée minimale
6. ✅ `components/3d/HD5ContainerMinimal.tsx` - Version minimale
7. ✅ `components/3d/HD5ContainerUltraSimplified.tsx` - Version ultra-simplifiée
8. ✅ `components/3d/OptimizedHD5Container.tsx` - Version optimisée

**Remplacement** : Utiliser `components/3d/HD5Container.tsx` avec props `detailLevel` et `useLOD`

### Contrôleurs de caméra (3 → 1 unifié)

Les fichiers suivants doivent être supprimés après migration vers `components/3d/UnifiedCameraController.tsx` :

1. ✅ `components/3d/CameraController.tsx` - Contrôleur standard
2. ✅ `components/3d/AnimatedCameraController.tsx` - Contrôleur animé
3. ✅ `components/3d/ViewModeCameraController.tsx` - Contrôleur par mode de vue

**Remplacement** : Utiliser `components/3d/UnifiedCameraController.tsx` avec prop `mode`

## Fichiers à vérifier pour mise à jour des imports

Les fichiers suivants utilisent les anciens composants et doivent être mis à jour :

- `components/3d/SubstationSystem3D.tsx`
- `components/3d/Substation3D.tsx`
- `components/3d/AutoPlacedScene3D.tsx`
- `components/3d/EquipmentPlacer.tsx`
- `components/3d/Overview3DScene.tsx`
- `pages/substation-3d.tsx`
- `pages/substation-3d-ultra-quality.tsx`
- `pages/substation-3d-auto.tsx`
- `pages/substation-3d-deployment.tsx`
- `pages/substation-container-test.tsx`

## Notes

- Le composant `HD5Container3D.tsx` original peut être conservé temporairement pour référence
- Les contrôleurs de caméra peuvent être supprimés immédiatement après migration
- Vérifier que tous les tests passent avant suppression définitive









