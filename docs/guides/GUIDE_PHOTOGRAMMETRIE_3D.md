# 📸 Guide de Photogrammétrie 3D - Hearst Qatar

## Vue d'ensemble

Ce guide explique comment créer des modèles 3D à partir de photos pour votre projet de ferme énergétique.

## 🎯 Objectif

Reconstruire en 3D les équipements suivants à partir de photos :
- Transformateurs haute tension
- Containers HD5
- Switchgears
- Structures de support
- Bâtiments industriels

## 📋 Prérequis

### Logiciels recommandés

1. **Photogrammétrie** (au choix) :
   - **Meshroom** (Gratuit, Open Source) - Recommandé pour débuter
   - **RealityCapture** (Payant, très performant)
   - **Polycam** (Application mobile iOS/Android)
   - **3DF Zephyr** (Version gratuite limitée)

2. **Nettoyage/Optimisation** :
   - **Blender** (Gratuit) - Pour nettoyer et optimiser les modèles
   - **MeshLab** (Gratuit) - Pour réduire les polygones

3. **Conversion** :
   - **Blender** - Pour exporter en GLB/GLTF

## 📸 Comment prendre les photos

### Règles essentielles

1. **Nombre de photos** : 50-200 photos par objet
2. **Qualité** : Haute résolution (12MP minimum)
3. **Éclairage** : Lumière naturelle diffuse (éviter le soleil direct)
4. **Heure** : Matin ou fin d'après-midi (lumière douce)
5. **Météo** : Ciel couvert idéal (pas d'ombres dures)

### Technique de prise de vue

```
Vue 1 : Cercle bas (30° vers le haut)
    📷 → 📷 → 📷 → 📷
   ↙                ↘
  📷                  📷
   ↖                ↗
    📷 ← 📷 ← 📷 ← 📷

Vue 2 : Cercle moyen (horizontal)
    📷 → 📷 → 📷 → 📷
   ↙                ↘
  📷                  📷
   ↖                ↗
    📷 ← 📷 ← 📷 ← 📷

Vue 3 : Cercle haut (30° vers le bas)
    📷 → 📷 → 📷 → 📷
   ↙                ↘
  📷                  📷
   ↖                ↗
    📷 ← 📷 ← 📷 ← 📷
```

### Checklist par objet

- [ ] **Transformateur**
  - [ ] 3 cercles complets (bas, milieu, haut)
  - [ ] Photos des détails (radiateurs, bushings)
  - [ ] Photos du sol autour (pour l'échelle)
  - [ ] Minimum 80 photos

- [ ] **Container HD5**
  - [ ] 2-3 cercles complets
  - [ ] Photos des portes et détails
  - [ ] Photos du toit
  - [ ] Minimum 60 photos

- [ ] **Switchgear**
  - [ ] 2 cercles complets
  - [ ] Photos des détails techniques
  - [ ] Minimum 40 photos

## 🔧 Workflow de traitement

### Étape 1 : Meshroom (Photogrammétrie)

1. **Installation** :
   ```bash
   # Télécharger depuis : https://alicevision.org/#meshroom
   # Ou via Homebrew (macOS)
   brew install --cask meshroom
   ```

2. **Import des photos** :
   - Glisser-déposer toutes les photos dans Meshroom
   - Vérifier que toutes les photos sont détectées

3. **Configuration** :
   - Preset : "Default" pour commencer
   - Si GPU disponible : activer CUDA
   - Qualité : "High" pour le résultat final

4. **Lancement** :
   - Cliquer sur "Start"
   - Temps de traitement : 30 min à 2h selon l'ordinateur

5. **Résultat** :
   - Le modèle 3D sera dans : `MeshroomCache/Texturing/`
   - Format : `.obj` avec textures

### Étape 2 : Blender (Nettoyage)

1. **Import** :
   ```
   File > Import > Wavefront (.obj)
   ```

2. **Nettoyage** :
   ```
   - Supprimer les artefacts (géométrie parasite)
   - Combler les trous
   - Lisser les surfaces
   ```

3. **Optimisation** :
   ```
   - Modifier > Decimate (réduire à 50k-100k triangles)
   - Recalculer les normales
   - Optimiser les UV maps
   ```

4. **Échelle** :
   ```
   - Mesurer un élément connu
   - Ajuster l'échelle (S + nombre)
   - Appliquer la transformation (Ctrl+A > Scale)
   ```

5. **Export GLB** :
   ```
   File > Export > glTF 2.0 (.glb)
   Options :
   - Format : Binary (.glb)
   - Include : Selected Objects
   - Transform : +Y Up
   - Geometry : Apply Modifiers
   - Materials : Export
   - Compression : Draco (optionnel)
   ```

### Étape 3 : Intégration dans le projet

1. **Copier le fichier GLB** :
   ```bash
   cp transformer_01.glb "public/models/equipment/"
   ```

2. **Créer le composant React** :
   ```tsx
   // components/3d/TransformerFromPhoto.tsx
   import { useGLTF } from '@react-three/drei';
   
   export function TransformerFromPhoto({ position = [0, 0, 0] }) {
     const { scene } = useGLTF('/models/equipment/transformer_01.glb');
     
     return (
       <primitive 
         object={scene} 
         position={position}
         scale={1}
       />
     );
   }
   
   useGLTF.preload('/models/equipment/transformer_01.glb');
   ```

3. **Utiliser dans la scène** :
   ```tsx
   <TransformerFromPhoto position={[0, 0, 0]} />
   ```

## 📊 Spécifications techniques

### Limites recommandées

| Élément | Triangles | Texture | Taille fichier |
|---------|-----------|---------|----------------|
| Transformateur | 80k-100k | 2048x2048 | < 5 MB |
| Container HD5 | 50k-70k | 2048x2048 | < 3 MB |
| Switchgear | 30k-50k | 1024x1024 | < 2 MB |
| Petit équipement | 10k-20k | 1024x1024 | < 1 MB |

### Optimisations WebGL

```javascript
// Compression Draco
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);
```

## 🎨 Amélioration des textures

### Post-traitement dans Blender

1. **Améliorer la netteté** :
   - Shading > Shader Editor
   - Ajouter un node "ColorRamp" après la texture
   - Ajuster le contraste

2. **Corriger l'exposition** :
   - Ajouter un node "Brightness/Contrast"
   - Ajuster selon l'éclairage de la scène

3. **Ajouter des détails PBR** :
   - Roughness map (rugosité)
   - Metallic map (métal)
   - Normal map (relief)

## 🚀 Alternatives rapides

### Option 1 : Application mobile (Polycam)

1. **Installation** :
   - iOS : App Store
   - Android : Google Play

2. **Capture** :
   - Mode "Object"
   - Suivre les instructions à l'écran
   - 2-5 minutes par objet

3. **Export** :
   - Format : GLB
   - Qualité : High
   - Télécharger sur ordinateur

### Option 2 : Service en ligne (Sketchfab)

1. **Upload des photos** sur Sketchfab
2. **Traitement automatique**
3. **Téléchargement du modèle 3D**

## 📝 Checklist finale

Avant d'intégrer un modèle :

- [ ] Modèle nettoyé (pas d'artefacts)
- [ ] Échelle correcte (mesures réelles)
- [ ] Nombre de triangles optimisé (< 100k)
- [ ] Textures compressées (< 2048x2048)
- [ ] Format GLB avec compression Draco
- [ ] Testé dans le navigateur (performances)
- [ ] Orientation correcte (+Y up)
- [ ] Pivot au centre de l'objet

## 🎯 Prochaines étapes

1. **Prendre les photos** selon le guide ci-dessus
2. **Traiter avec Meshroom** (ou alternative)
3. **Nettoyer dans Blender**
4. **Exporter en GLB**
5. **Intégrer dans le projet**
6. **Tester les performances**

## 💡 Conseils pratiques

### Pour de meilleurs résultats

- ✅ Nettoyer l'objet avant (enlever la poussière)
- ✅ Éviter les surfaces réfléchissantes
- ✅ Photographier par temps couvert
- ✅ Chevaucher les photos (60-70% de recouvrement)
- ✅ Garder la même exposition pour toutes les photos

### À éviter

- ❌ Soleil direct (ombres dures)
- ❌ Photos floues
- ❌ Changement d'éclairage entre les photos
- ❌ Objets en mouvement dans le cadre
- ❌ Surfaces transparentes ou brillantes

## 📚 Ressources

- [Meshroom Documentation](https://meshroom-manual.readthedocs.io/)
- [Blender Manual](https://docs.blender.org/manual/en/latest/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [glTF Optimization](https://www.khronos.org/gltf/)

## 🆘 Support

Si vous avez des questions ou rencontrez des problèmes :
1. Vérifier ce guide
2. Consulter les logs de Meshroom
3. Tester avec moins de photos d'abord
4. Vérifier la qualité des photos

---

**Prêt à commencer ?** Suivez les étapes ci-dessus et partagez vos photos pour que je puisse vous guider dans le processus !
