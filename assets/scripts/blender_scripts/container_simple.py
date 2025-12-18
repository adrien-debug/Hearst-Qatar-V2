"""
Script Blender Simple - Container Hearst HD
============================================

Version simplifiée pour créer rapidement un container unique.
Copier-coller dans Blender > Scripting > Nouveau > Coller > Run
"""

import bpy

# Nettoyer la scène
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Unités en mètres
bpy.context.scene.unit_settings.system = 'METRIC'

# 1. DALLE BÉTON (40 cm)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.2))
dalle = bpy.context.active_object
dalle.name = "Container_Hearst_HD"
dalle.scale = (3.25, 1.5, 0.2)
bpy.ops.object.transform_apply(scale=True)

# 2. CONTAINER PRINCIPAL (noir)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.696))
container = bpy.context.active_object
container.scale = (3.029, 1.219, 1.296)
bpy.ops.object.transform_apply(scale=True)

# 3. UNITÉ AC (toit)
bpy.ops.mesh.primitive_cube_add(size=1, location=(2.0, 0, 3.2))
ac = bpy.context.active_object
ac.scale = (0.8, 0.6, 0.3)
bpy.ops.object.transform_apply(scale=True)

# 4. GRILLES VENTILATION
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -1.22, 1.5))
vent1 = bpy.context.active_object
vent1.scale = (1.0, 0.05, 0.4)
bpy.ops.object.transform_apply(scale=True)

bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.22, 1.5))
vent2 = bpy.context.active_object
vent2.scale = (1.0, 0.05, 0.4)
bpy.ops.object.transform_apply(scale=True)

# 5. LOGO HEARST (face avant)
bpy.ops.mesh.primitive_plane_add(size=1, location=(-2.8, 0, 2.0))
logo = bpy.context.active_object
logo.scale = (0.6, 0.3, 1)
logo.rotation_euler[1] = 1.5708
bpy.ops.object.transform_apply(scale=True, rotation=True)

# 6. FUSIONNER TOUT EN 1 OBJET
dalle.select_set(True)
container.select_set(True)
ac.select_set(True)
vent1.select_set(True)
vent2.select_set(True)
logo.select_set(True)
bpy.context.view_layer.objects.active = dalle
bpy.ops.object.join()

# 7. CRÉER MATÉRIAU
mat = bpy.data.materials.new(name="Container_Material")
mat.use_nodes = True
nodes = mat.node_tree.nodes
bsdf = nodes.get("Principled BSDF")
bsdf.inputs['Base Color'].default_value = (0, 0, 0, 1)  # Noir
bsdf.inputs['Metallic'].default_value = 0.3
bsdf.inputs['Roughness'].default_value = 0.7

# Appliquer matériau
dalle.data.materials.append(mat)

# 8. OPTIMISER
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.001)
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.uv.smart_project(angle_limit=66)
bpy.ops.object.mode_set(mode='OBJECT')

# 9. CENTRER ORIGINE
bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

print("✅ Container Hearst HD créé avec succès!")
print(f"📊 Vertices: {len(dalle.data.vertices)}")
print(f"📊 Faces: {len(dalle.data.polygons)}")

# 10. EXPORT GLB (optionnel - décommenter si besoin)
# export_path = "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/public/models/container_hearst_hd.glb"
# bpy.ops.export_scene.gltf(
#     filepath=export_path,
#     export_format='GLB',
#     export_draco_mesh_compression_enable=True,
#     export_draco_mesh_compression_level=6
# )
# print(f"💾 Exporté: {export_path}")







