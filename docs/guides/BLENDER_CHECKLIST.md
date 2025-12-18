# Checklist Blender - Modélisation Ferme Énergétique

Ce fichier liste toutes les étapes à suivre dans Blender pour compléter la modélisation 3D.

## ✅ Prérequis

- [x] Script Python `generate_hd5_containers.py` créé
- [x] Structure de données mise à jour dans `electricalMock.ts`
- [x] Composants React Three Fiber créés et fonctionnels

## 📋 Étapes de modélisation dans Blender

### 1. Setup initial
- [ ] Ouvrir Blender
- [ ] Configurer les unités: Metric, Scale: 1.0
- [ ] Configurer la grille: 1m
- [ ] Définir l'origine à (0, 0, 0)

### 2. Structure hiérarchique de base
- [ ] Créer `SubstationSystem` (Empty, type Plain Axes) à (0, 0, 0)
- [ ] Créer `Substation_200MW` (Empty, parent: SubstationSystem) à (0, 0, 0)

### 3. Substation 200 MW
- [ ] Modéliser `Busbars` (structure métallique horizontale)
- [ ] Modéliser 4 `HV_Breakers` (disjoncteurs HT, 2m x 1m x 1.5m)
- [ ] Modéliser `HV_Isolators` (sectionneurs céramiques)
- [ ] Modéliser `HV_IncomingLines` (lignes d'entrée)
- [ ] Modéliser 4 `HV_Towers` (pylônes support, 8m de haut)
- [ ] Modéliser `HV_DistributionFrame` (cadre de distribution)
- [ ] Appliquer matériaux PBR:
  - Busbars: Aluminium poli (metallic: 1.0, roughness: 0.1)
  - Isolateurs: Céramique blanche (metallic: 0.0, roughness: 0.3)
  - Structure: Acier galvanisé (metallic: 0.8, roughness: 0.4)

### 4. Power Blocks (4)
- [ ] Créer `PowerBlock_1` (Empty, parent: SubstationSystem) à (-60, -40, 0)
- [ ] Créer `PowerBlock_2` (Empty, parent: SubstationSystem) à (-20, -40, 0)
- [ ] Créer `PowerBlock_3` (Empty, parent: SubstationSystem) à (20, -40, 0)
- [ ] Créer `PowerBlock_4` (Empty, parent: SubstationSystem) à (60, -40, 0)

Pour chaque Power Block:
- [ ] Modéliser `PBx_Structure` (pavé 15m x 8m x 10m)
- [ ] Modéliser `PBx_Panels` (panneaux électriques latéraux)
- [ ] Modéliser `PBx_Connections` (connexions électriques visibles)
- [ ] Appliquer matériaux:
  - Structure: Béton industriel (metallic: 0.0, roughness: 0.7)
  - Panneaux: Métal peint gris (metallic: 0.3, roughness: 0.6)

### 5. Transformateurs (24)
Pour chaque Power Block (x = 1 à 4):
- [ ] Créer 6 transformateurs:
  - `PBx_Transformer_01` à (X du PB, -60, 0)
  - `PBx_Transformer_02` à (X du PB, -80, 0)
  - `PBx_Transformer_03` à (X du PB, -100, 0)
  - `PBx_Transformer_04` à (X du PB, -120, 0)
  - `PBx_Transformer_05` à (X du PB, -140, 0)
  - `PBx_Transformer_06` à (X du PB, -160, 0)

Pour chaque transformateur:
- [ ] Modéliser `TR_Core` (noyau magnétique)
- [ ] Modéliser `TR_Tank` (cuve 4m x 3m x 5m)
- [ ] Modéliser 6 `TR_Radiators` (radiateurs verticaux, 0.3m de large chacun)
- [ ] Modéliser 3 `TR_Bushings_HT` (sorties HT en haut)
- [ ] Modéliser 3 `TR_Bushings_BT` (sorties BT sur le côté)
- [ ] Modéliser `TR_Base` (socle béton 4.5m x 3.5m x 0.5m)
- [ ] Appliquer matériaux:
  - Cuve: Acier peint vert industriel (metallic: 0.2, roughness: 0.5)
  - Radiateurs: Métal gris (metallic: 0.7, roughness: 0.4)
  - Bushings: Porcelaine blanche (metallic: 0.0, roughness: 0.2)

### 6. Switchgears (24)
Pour chaque transformateur:
- [ ] Créer `PBx_SG_yy` (Mesh, parent: transformateur correspondant)
- [ ] Positionner à X+5m du transformateur
- [ ] Modéliser `SG_Enclosure` (boîtier 2m x 2m x 1.5m)
- [ ] Modéliser `SG_Controls` (panneau de contrôle avec voyants)
- [ ] Modéliser `SG_Cables` (connexions câbles visibles)
- [ ] Appliquer matériaux:
  - Boîtier: Métal gris RAL 7035 (metallic: 0.5, roughness: 0.6)
  - Contrôles: Plastique noir (metallic: 0.0, roughness: 0.8)

### 7. Containers HD5 (48)
**Option A: Utiliser le script Python**
- [ ] Ouvrir Blender Scripting workspace
- [ ] Charger `blender_scripts/generate_hd5_containers.py`
- [ ] Exécuter le script (Alt+P)
- [ ] Organiser les containers dans la hiérarchie avec leurs transformateurs parents

**Option B: Modélisation manuelle**
Pour chaque transformateur (24 total):
- [ ] Créer `PBx_TRyy_HD5_A` (Empty, parent: transformateur) à X-2m
- [ ] Créer `PBx_TRyy_HD5_B` (Empty, parent: transformateur) à X+2m

Pour chaque container HD5:
- [ ] Modéliser `HD5_Container` (structure 12.196m x 2.438m x 2.896m)
- [ ] Modéliser rainures industrielles (8 sur chaque côté)
- [ ] Modéliser `HD5_Doors_Rear` (2 portes arrière de 1.2m)
- [ ] Modéliser poignées de portes
- [ ] Modéliser `HD5_ElectricalBox` (coffret latéral 0.8m x 0.6m x 0.4m)
- [ ] Modéliser `HD5_Vents` (6 grilles de ventilation)
- [ ] Modéliser `HD5_Pipe_In` (pipe hydraulique entrée, diamètre 0.15m)
- [ ] Modéliser `HD5_Pipe_Out` (pipe hydraulique sortie)
- [ ] Créer `HD5_PowerIn` (Empty, point d'interface)
- [ ] Créer `HD5_CoolingIn` (Empty, point d'interface)
- [ ] Appliquer matériaux:
  - Container: Métal peint gris/vert (metallic: 0.3, roughness: 0.6)
  - Coffret: Métal jaune sécurité (metallic: 0.4, roughness: 0.5)
  - Pipes: Métal inox (metallic: 0.9, roughness: 0.2)

### 8. Vérification
- [ ] Vérifier que tous les 97 éléments sont présents:
  - 1 Substation
  - 4 Power Blocks
  - 24 Transformateurs
  - 24 Switchgears
  - 48 Containers HD5
- [ ] Vérifier le nommage exact (doit correspondre à `electricalMock.ts`)
- [ ] Vérifier la hiérarchie parent-enfant
- [ ] Vérifier les positions 3D selon le layout
- [ ] Vérifier que tous les matériaux PBR sont appliqués

### 9. Optimisation
- [ ] Compter les triangles (doit être < 500k)
- [ ] Si > 500k, utiliser Decimate modifier sur les éléments répétitifs
- [ ] Optimiser les textures (max 2048x2048)
- [ ] Vérifier que les textures sont en PBR (Albedo, Normal, Roughness, Metallic)

### 10. Export glTF
- [ ] Sélectionner `SubstationSystem` (racine)
- [ ] File > Export > glTF 2.0 (.glb/.gltf)
- [ ] Paramètres:
  - Format: **glTF Binary (.glb)**
  - Include: **Selected Objects**
  - Transform: **+Y Up**
  - Geometry:
    - ✓ Apply Modifiers
    - ✓ UVs
    - ✓ Normals
    - ✓ Vertex Colors
  - Materials:
    - ✓ Export
    - ✓ PBR Materials
  - Compression: Draco (optionnel)
- [ ] Exporter vers: `public/models/substation_200MW_schema.glb`
- [ ] Vérifier la taille du fichier (idéalement < 50 MB)

### 11. Test dans Next.js
- [ ] Lancer `npm run dev`
- [ ] Naviguer vers `/substation-3d`
- [ ] Vérifier que le modèle GLB charge correctement
- [ ] Tester les interactions (clic, rotation, zoom)
- [ ] Vérifier les performances (>30 FPS)

## 📝 Notes importantes

1. **Nommage**: Les noms d'objets dans Blender doivent EXACTEMENT correspondre aux IDs dans `electricalMock.ts`
2. **Hiérarchie**: Respecter la structure parent-enfant pour une exportation correcte
3. **Unités**: Toujours utiliser des mètres (système métrique)
4. **Origine**: Garder l'origine à (0, 0, 0) pour faciliter l'export
5. **Matériaux**: Utiliser Principled BSDF pour tous les matériaux PBR

## 🎯 Résultat attendu

Un fichier `substation_200MW_schema.glb` contenant:
- Tous les 97 éléments modélisés
- Hiérarchie correcte
- Matériaux PBR appliqués
- < 500k triangles
- Prêt pour intégration dans Next.js

## 🔗 Ressources

- Guide Blender: `blender_scripts/README.md`
- Guide intégration: `GUIDE_3D.md`
- Résumé implémentation: `IMPLEMENTATION_SUMMARY.md`

