# Scripts Blender - Ferme Énergétique 200 MW

Ce dossier contient les scripts Python pour Blender permettant de générer automatiquement les éléments 3D de la ferme énergétique.

## generate_hd5_containers.py

Script pour générer automatiquement les 48 containers Bitmain ANTSPACE HD5.

### Utilisation

1. Ouvrir Blender
2. Aller dans l'onglet **Scripting**
3. Cliquer sur **New** pour créer un nouveau script
4. Copier-coller le contenu de `generate_hd5_containers.py`
5. Cliquer sur **Run Script** (ou appuyer sur Alt+P)

### Fonctionnalités

- Génère 48 containers HD5 avec dimensions exactes (12.196m x 2.438m x 2.896m)
- Positionne automatiquement selon le layout:
  - 4 Power Blocks
  - 6 Transformateurs par Power Block
  - 2 HD5 par Transformateur
- Applique les matériaux PBR de base
- Crée les points d'interface (PowerIn, CoolingIn)

### Structure générée

Chaque container HD5 contient:
- Structure principale (container 40ft)
- Rainures industrielles (8 sur chaque côté)
- Portes arrière (2 portes de 1.2m)
- Poignées de portes
- Coffret électrique latéral (jaune sécurité)
- Grilles de ventilation (6 grilles)
- Pipes hydrauliques (entrée et sortie)
- Points d'interface (Empty objects)

### Nommage

Les containers suivent la convention:
- `PB{x}_TR{yy}_HD5_A` (premier container)
- `PB{x}_TR{yy}_HD5_B` (second container)

Où:
- `x` = numéro du Power Block (1-4)
- `yy` = numéro du transformateur (01-06)

### Matériaux appliqués

- **Container**: Métal peint gris/vert (metallic: 0.3, roughness: 0.6)
- **Poignées**: Métal foncé (metallic: 0.8, roughness: 0.3)
- **Coffret électrique**: Jaune sécurité (metallic: 0.4, roughness: 0.5)
- **Grilles**: Métal foncé semi-transparent
- **Pipes**: Inox (metallic: 0.9, roughness: 0.2)

### Notes

- Les containers sont créés sans parent par défaut
- Vous devrez manuellement les organiser dans la hiérarchie avec leurs transformateurs parents
- Les positions sont en mètres (système métrique)

## Scripts disponibles

### 1. setup_scene.py
**Étape 1** - Configuration initiale de la scène Blender
- Configure les unités métriques
- Configure la grille (1m)
- Crée SubstationSystem et Substation_200MW

### 2. create_power_blocks.py
**Étape 4** - Crée les 4 Power Blocks avec structure de base
- Génère automatiquement les 4 Power Blocks
- Applique les matériaux de base
- Positionne correctement

### 3. create_transformers.py
**Étape 5** - Crée les 24 transformateurs avec structure complète
- Génère automatiquement les 24 transformateurs
- Inclut cuve, radiateurs, bushings HT/BT, socle
- Applique les matériaux PBR

### 4. create_switchgears.py
**Étape 6** - Crée les 24 switchgears/disjoncteurs
- Génère automatiquement les 24 switchgears
- Inclut boîtier, panneau de contrôle, voyants
- Applique les matériaux

### 5. generate_hd5_containers.py
**Étape 7** - Génère les 48 containers HD5
- Crée tous les containers avec dimensions exactes
- Applique les matériaux
- Positionne automatiquement

## Ordre d'exécution des scripts

1. ✅ **setup_scene.py** (Étape 1) - Configuration initiale
2. Modéliser manuellement la **Substation 200 MW** (Étape 3)
3. ✅ **create_power_blocks.py** (Étape 4) - Crée les 4 Power Blocks
4. ✅ **create_transformers.py** (Étape 5) - Crée les 24 Transformateurs
5. ✅ **create_switchgears.py** (Étape 6) - Crée les 24 Switchgears
6. ✅ **generate_hd5_containers.py** (Étape 7) - Crée les 48 Containers HD5
7. Vérifier la hiérarchie et ajuster si nécessaire
8. Finaliser les matériaux PBR
9. Exporter en glTF binaire (.glb)

## Export glTF

Une fois tous les éléments modélisés:

1. Sélectionner l'objet racine `SubstationSystem`
2. File > Export > glTF 2.0 (.glb/.gltf)
3. Paramètres recommandés:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects
   - Transform: +Y Up
   - Geometry: Apply Modifiers, UVs, Normals
   - Materials: Export, PBR Materials
   - Compression: Draco (optionnel)

