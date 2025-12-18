# Guide de Modélisation - Container Unique Hearst

## 🎯 Objectif
Créer un modèle 3D d'un container unique optimisé pour le configurateur Hearst Qatar.

## 📋 Spécifications du Container

### Structure Complète (1 seul objet)
```
Container Hearst HD
├── Dalle béton (40 cm d'épaisseur)
├── Container noir
├── Système de refroidissement (cooling)
└── Logo Hearst
```

## 🔧 Étapes de Modélisation dans Blender

### 1. Préparation de la Scène

```python
# Nettoyer la scène
import bpy

# Supprimer tous les objets
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Configurer les unités en mètres
bpy.context.scene.unit_settings.system = 'METRIC'
bpy.context.scene.unit_settings.length_unit = 'METERS'
```

### 2. Créer la Dalle Béton (40 cm)

**Dimensions:**
- Longueur: 6.5m (container 6m + débord)
- Largeur: 3.0m (container 2.44m + débord)
- Hauteur: 0.4m (40 cm)

```python
# Créer la dalle
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.2))
dalle = bpy.context.active_object
dalle.name = "Container_Hearst_HD"
dalle.scale = (3.25, 1.5, 0.2)
bpy.ops.object.transform_apply(scale=True)
```

### 3. Ajouter le Container Principal

**Dimensions standard 20ft:**
- Longueur: 6.058m
- Largeur: 2.438m
- Hauteur: 2.591m

```python
# Container principal
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.696))
container = bpy.context.active_object
container.scale = (3.029, 1.219, 1.296)
bpy.ops.object.transform_apply(scale=True)

# Joindre avec la dalle
dalle.select_set(True)
container.select_set(True)
bpy.context.view_layer.objects.active = dalle
bpy.ops.object.join()
```

### 4. Système de Refroidissement (Cooling)

**Composants:**
- Unité AC sur le toit
- Grilles de ventilation latérales

```python
# Unité AC sur le toit
bpy.ops.mesh.primitive_cube_add(size=1, location=(2.0, 0, 3.2))
ac_unit = bpy.context.active_object
ac_unit.scale = (0.8, 0.6, 0.3)
bpy.ops.object.transform_apply(scale=True)

# Grilles de ventilation (x2)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.22, 1.5))
vent1 = bpy.context.active_object
vent1.scale = (1.0, 0.05, 0.4)
bpy.ops.object.transform_apply(scale=True)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.22, 1.5))
vent2 = bpy.context.active_object
vent2.scale = (1.0, 0.05, 0.4)
bpy.ops.object.transform_apply(scale=True)

# Joindre tout
dalle.select_set(True)
ac_unit.select_set(True)
vent1.select_set(True)
vent2.select_set(True)
bpy.context.view_layer.objects.active = dalle
bpy.ops.object.join()
```

### 5. Logo Hearst

**Position:** Face avant du container

```python
# Créer un plan pour le logo
bpy.ops.mesh.primitive_plane_add(size=1, location=(-2.8, 0, 2.0))
logo = bpy.context.active_object
logo.scale = (0.6, 0.3, 1)
logo.rotation_euler[1] = 1.5708  # 90° rotation Y
bpy.ops.object.transform_apply(scale=True, rotation=True)

# Joindre avec le reste
dalle.select_set(True)
logo.select_set(True)
bpy.context.view_layer.objects.active = dalle
bpy.ops.object.join()
```

## 🎨 Matériaux et Couleurs

### Matériau Unique avec Zones

```python
# Créer le matériau principal
mat = bpy.data.materials.new(name="Container_Hearst_Material")
mat.use_nodes = True
nodes = mat.node_tree.nodes
nodes.clear()

# Shader principal
bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
output = nodes.new(type='ShaderNodeOutputMaterial')
mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

# Configuration des couleurs
# Béton: Gris clair #C0C0C0
# Container: Noir #000000
# Logo: Vert Hearst #00A651

# Assigner le matériau
obj = bpy.data.objects["Container_Hearst_HD"]
if obj.data.materials:
    obj.data.materials[0] = mat
else:
    obj.data.materials.append(mat)
```

### Zones de Couleur par Vertex Paint

```python
# Activer le vertex paint
bpy.ops.object.mode_set(mode='VERTEX_PAINT')

# Béton (base): Gris #C0C0C0
# Container (corps): Noir #000000
# AC Unit: Gris foncé #404040
# Logo: Vert Hearst #00A651
```

## 📐 Optimisation du Modèle

### 1. Réduire les Polygones

```python
# Ajouter un modificateur Decimate
obj = bpy.data.objects["Container_Hearst_HD"]
decimate = obj.modifiers.new(name="Decimate", type='DECIMATE')
decimate.ratio = 0.5  # Réduire de 50%
bpy.ops.object.modifier_apply(modifier="Decimate")
```

### 2. Nettoyer la Géométrie

```python
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.001)
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')
```

### 3. Optimiser les UV

```python
# Smart UV Project
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.02)
bpy.ops.object.mode_set(mode='OBJECT')
```

## 💾 Export pour Three.js

### Configuration d'Export GLB

```python
# Export GLB optimisé
import bpy

export_path = "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/public/models/container_hearst_hd.glb"

bpy.ops.export_scene.gltf(
    filepath=export_path,
    export_format='GLB',
    export_texcoords=True,
    export_normals=True,
    export_materials='EXPORT',
    export_colors=True,
    export_cameras=False,
    export_lights=False,
    export_apply=True,
    export_yup=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6
)

print(f"✅ Container exporté: {export_path}")
```

## 📊 Spécifications Finales

### Dimensions Totales
- **Longueur:** 6.5m (dalle) / 6.058m (container)
- **Largeur:** 3.0m (dalle) / 2.438m (container)
- **Hauteur totale:** 3.0m (dalle 0.4m + container 2.591m + AC 0.3m)

### Composition
- **1 seul objet:** `Container_Hearst_HD`
- **Polygones cibles:** < 5000 triangles
- **Matériau unique:** Multi-zones avec vertex colors
- **Format:** GLB avec compression Draco

### Couleurs Hearst
```css
--beton: #C0C0C0      /* Gris clair béton */
--container: #000000   /* Noir container */
--cooling: #404040     /* Gris foncé AC */
--logo: #00A651        /* Vert Hearst */
```

## 🚀 Intégration dans le Configurateur

### Chargement du Modèle

```typescript
// components/Container3D.tsx
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

### Placement dans la Scène

```typescript
// Exemple de placement multiple
const containers = [
  { id: 1, position: [0, 0, 0] },
  { id: 2, position: [7, 0, 0] },
  { id: 3, position: [14, 0, 0] },
]

return (
  <>
    {containers.map(c => (
      <ContainerHearstHD 
        key={c.id} 
        position={c.position} 
      />
    ))}
  </>
)
```

## ✅ Checklist de Validation

- [ ] Dalle béton 40cm présente
- [ ] Container noir HD modélisé
- [ ] Système cooling intégré (AC + grilles)
- [ ] Logo Hearst positionné (face avant)
- [ ] **1 seul objet** fusionné
- [ ] Matériau unique appliqué
- [ ] Couleurs Hearst respectées
- [ ] Optimisation < 5000 polygones
- [ ] Export GLB avec Draco
- [ ] Test de chargement Three.js
- [ ] Échelle correcte (mètres)
- [ ] Pivot au centre de la dalle

## 📝 Notes Importantes

1. **Un seul objet:** Tout doit être fusionné (Join) dans Blender
2. **Pivot point:** Au centre de la dalle béton (facilite le placement)
3. **Orientation:** Face avant = -X, Logo visible de face
4. **Échelle:** 1 unité Blender = 1 mètre réel
5. **Compression:** Draco niveau 6 pour optimiser le poids
6. **Nomenclature:** `Container_Hearst_HD` (respecter la casse)

## 🔄 Variantes Possibles

Si besoin de variantes, créer des modèles séparés:
- `container_hearst_hd_v1.glb` - Standard
- `container_hearst_hd_v2.glb` - Double cooling
- `container_hearst_hd_v3.glb` - Sans logo

---

**Créé pour:** Hearst Qatar Project  
**Format:** Blender 3.x → GLB → Three.js  
**Objectif:** Container unique optimisé et réaliste







