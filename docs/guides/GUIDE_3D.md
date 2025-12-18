# Guide d'Intégration 3D - Ferme Énergétique 200 MW

Ce guide explique comment utiliser la visualisation 3D de la ferme énergétique dans l'application Next.js.

## Structure du projet

```
Hearst Qatar/
├── components/
│   └── 3d/
│       ├── Substation3D.tsx          # Composant principal
│       ├── PowerBlock3D.tsx          # Power Block
│       ├── Transformer3D.tsx        # Transformateur
│       ├── HD5Container3D.tsx        # Container HD5
│       ├── OptimizedHD5Container.tsx # Version optimisée (instancing)
│       └── README.md                 # Documentation des composants
├── pages/
│   └── substation-3d.tsx             # Page de visualisation 3D
├── public/
│   └── models/
│       └── substation_200MW_schema.glb  # Modèle 3D exporté depuis Blender
├── blender_scripts/
│   ├── generate_hd5_containers.py    # Script de génération automatique
│   └── README.md                     # Documentation des scripts
└── data/
    └── electricalMock.ts             # Données de structure électrique (mise à jour)
```

## Installation

Les dépendances ont été ajoutées au `package.json`:

```json
{
  "dependencies": {
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "three": "^0.158.0"
  },
  "devDependencies": {
    "@types/three": "^0.158.0"
  }
}
```

Installer avec:
```bash
npm install
```

## Utilisation

### Accès à la visualisation 3D

1. Lancer le serveur de développement:
   ```bash
   npm run dev
   ```

2. Naviguer vers: `http://localhost:1111/substation-3d`

3. La page affiche la visualisation 3D interactive avec:
   - Contrôles de caméra (OrbitControls)
   - Sélection d'objets au clic
   - Panneau d'information
   - Statistiques de la structure

### Contrôles

- **Clic gauche + glisser**: Rotation de la caméra
- **Clic droit + glisser**: Translation (pan)
- **Molette**: Zoom in/out
- **Clic sur un objet**: Sélection et affichage des informations

### Version procédurale vs Modèle GLB

Par défaut, l'application utilise une **version procédurale** qui génère les éléments 3D en temps réel. Cette version fonctionne immédiatement sans nécessiter de fichier GLB.

Pour utiliser le modèle Blender exporté:

1. Exporter le modèle depuis Blender en `.glb`
2. Placer le fichier dans `public/models/substation_200MW_schema.glb`
3. Modifier `Substation3D` pour utiliser `useProcedural={false}`

## Structure des données

La structure électrique a été mise à jour dans `data/electricalMock.ts` pour correspondre à:

- **1 Substation 200 MW**
- **4 Power Blocks** (au lieu de "Sections")
- **24 Transformateurs** (6 par Power Block, au lieu de 4 par Section)
- **48 Containers HD5** (2 par transformateur)
- **24 Switchgears** (1 par transformateur)

### Nommage

Les identifiants suivent la convention:
- Power Blocks: `PowerBlock_1`, `PowerBlock_2`, etc.
- Transformateurs: `PB1_TR01`, `PB1_TR02`, etc.
- Containers: `PB1_TR01_HD5_A`, `PB1_TR01_HD5_B`, etc.
- Switchgears: `PB1_SG_01`, `PB1_SG_02`, etc.

## Modélisation dans Blender

### Hiérarchie requise

```
SubstationSystem (Empty)
├── Substation_200MW (Empty)
│   ├── Busbars (Mesh)
│   ├── HV_Breakers (Mesh)
│   ├── HV_Isolators (Mesh)
│   ├── HV_IncomingLines (Mesh)
│   ├── HV_Towers (Mesh)
│   └── HV_DistributionFrame (Mesh)
├── PowerBlock_1 (Empty)
│   ├── PB1_Structure (Mesh)
│   ├── PB1_Panels (Mesh)
│   ├── PB1_Connections (Mesh)
│   ├── PB1_Transformer_01 (Empty)
│   │   ├── TR_Core (Mesh)
│   │   ├── TR_Tank (Mesh)
│   │   ├── TR_Radiators (Mesh)
│   │   ├── TR_Bushings_HT (Mesh)
│   │   ├── TR_Bushings_BT (Mesh)
│   │   └── TR_Base (Mesh)
│   ├── PB1_SG_01 (Mesh)
│   ├── PB1_TR01_HD5_A (Empty)
│   │   └── [structure HD5]
│   └── PB1_TR01_HD5_B (Empty)
│       └── [structure HD5]
└── ... (PowerBlock_2, 3, 4 avec même structure)
```

### Positions 3D

- **Substation**: (0, 20, 0)
- **Power Blocks**: (-60, -40, 0), (-20, -40, 0), (20, -40, 0), (60, -40, 0)
- **Transformateurs**: X selon PB, Y de -60 à -160 (espacement 20m)
- **Switchgears**: X+5m du transformateur correspondant
- **HD5**: X±2m du transformateur correspondant

### Export glTF

1. Sélectionner `SubstationSystem`
2. File > Export > glTF 2.0
3. Format: Binary (.glb)
4. Options:
   - Apply Modifiers: ✓
   - UVs: ✓
   - Normals: ✓
   - Materials: Export, PBR Materials
   - Transform: +Y Up

## Optimisations

### Performance WebGL

1. **Instancing**: Utilisé pour les 48 containers HD5 identiques
2. **Frustum Culling**: Activé par défaut
3. **LOD**: À implémenter pour les vues éloignées
4. **Texture Compression**: Utiliser des textures < 2048x2048

### Limites recommandées

- Triangles: < 500k
- Textures: Max 2048x2048
- Matériaux: Réutiliser au maximum

## Dépannage

### Le modèle 3D ne s'affiche pas

- Vérifier que les dépendances sont installées: `npm install`
- Vérifier la console du navigateur pour les erreurs
- La version procédurale devrait toujours fonctionner

### Performances médiocres

- Réduire le nombre de triangles dans Blender (Decimate modifier)
- Utiliser l'instancing pour les éléments répétitifs
- Activer le frustum culling

### Le modèle GLB ne charge pas

- Vérifier que le fichier existe dans `public/models/`
- Vérifier le format (doit être .glb binaire)
- Vérifier les noms d'objets dans Blender (doivent correspondre)

## Prochaines étapes

1. ✅ Installation des dépendances
2. ✅ Création des composants React Three Fiber
3. ✅ Intégration avec les données existantes
4. ✅ Version procédurale fonctionnelle
5. ⏳ Modélisation complète dans Blender
6. ⏳ Export et intégration du modèle GLB
7. ⏳ Optimisations avancées (LOD, instancing)

## Support

Pour toute question ou problème, consulter:
- Documentation React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Documentation Three.js: https://threejs.org/docs
- Documentation Blender: https://docs.blender.org

