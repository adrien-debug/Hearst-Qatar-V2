# Container Hearst HD - Modélisation Unique

## 🎯 Objectif

Créer un modèle 3D unique d'un container avec :
- ✅ **Dalle béton 40 cm**
- ✅ **Container HD noir**
- ✅ **Système de refroidissement (cooling)**
- ✅ **Logo Hearst**
- ✅ **1 seul objet fusionné**

## 🚀 Démarrage Rapide

### Option 1 : Script Automatique (Recommandé)

1. **Ouvrir Blender 3.x**

2. **Charger le script**
   ```
   Scripting > Open > blender_scripts/create_container_hearst_hd.py
   ```

3. **Exécuter**
   ```
   Cliquer sur ▶️ Run Script
   ```

4. **Résultat**
   - Modèle créé automatiquement
   - Export GLB : `/public/models/container_hearst_hd.glb`
   - Prêt à l'emploi !

### Option 2 : Manuel

Suivre le guide détaillé : `GUIDE_MODELISATION_CONTAINER_UNIQUE.md`

## 📋 Fichiers Créés

```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/
├── GUIDE_MODELISATION_CONTAINER_UNIQUE.md    # Guide complet
├── blender_scripts/
│   └── create_container_hearst_hd.py         # Script automatique
├── preview-container-hearst.html              # Preview visuel
└── README_CONTAINER_UNIQUE.md                 # Ce fichier
```

## 🎨 Spécifications

### Dimensions
- **Dalle** : 6.5m × 3.0m × 0.4m
- **Container** : 6.058m × 2.438m × 2.591m
- **AC Unit** : 1.6m × 1.2m × 0.6m

### Couleurs Hearst
- **Béton** : `#C0C0C0` (gris clair)
- **Container** : `#000000` (noir)
- **Cooling** : `#404040` (gris foncé)
- **Logo** : `#00A651` (vert Hearst)

### Optimisation
- **Polygones** : < 5000 triangles
- **Format** : GLB avec compression Draco niveau 6
- **Taille cible** : < 500 KB

## 🔍 Preview Visuel

Ouvrir dans un navigateur :
```bash
open preview-container-hearst.html
```

## 🧪 Intégration Three.js

```typescript
import { useGLTF } from '@react-three/drei'

export function ContainerHearstHD() {
  const { scene } = useGLTF('/models/container_hearst_hd.glb')
  
  return (
    <primitive 
      object={scene.clone()} 
      position={[0, 0, 0]}
      scale={1}
    />
  )
}
```

## ✅ Checklist de Validation

- [ ] Dalle béton 40cm présente
- [ ] Container noir HD modélisé
- [ ] Système cooling intégré (AC + grilles)
- [ ] Logo Hearst positionné (face avant)
- [ ] **1 seul objet fusionné** ← IMPORTANT
- [ ] Matériau unique avec vertex colors
- [ ] Couleurs Hearst respectées
- [ ] Optimisation < 5000 polygones
- [ ] Export GLB avec Draco
- [ ] Test de chargement Three.js
- [ ] Échelle correcte (mètres)
- [ ] Pivot au centre de la dalle

## 📞 Support

Voir les guides détaillés :
- `GUIDE_MODELISATION_CONTAINER_UNIQUE.md` - Guide complet
- `GUIDE_BLENDER_DEBUTANT.md` - Si nouveau sur Blender
- `GUIDE_3D.md` - Intégration dans le configurateur

---

**Hearst Qatar Project**  
Modélisation 3D optimisée pour le configurateur







