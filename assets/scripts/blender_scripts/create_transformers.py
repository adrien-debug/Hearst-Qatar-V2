"""
Script Blender pour créer les 24 transformateurs avec leur structure de base
Étape 5 de la checklist

Usage: Dans Blender, Scripting workspace > New > Coller ce script > Run
"""

import bpy

def create_transformer(pb_num, tr_num, position):
    """
    Crée un transformateur avec sa structure de base
    
    Args:
        pb_num: Numéro du Power Block (1-4)
        tr_num: Numéro du transformateur (1-6)
        position: Position (x, y, z) en mètres
    """
    # Trouver le Power Block parent
    pb_name = f"PowerBlock_{pb_num}"
    pb_group = bpy.data.objects.get(pb_name)
    
    if not pb_group:
        print(f"⚠️  PowerBlock_{pb_num} non trouvé. Exécutez d'abord create_power_blocks.py")
        return None
    
    # Créer le groupe transformateur
    tr_name = f"PB{pb_num}_Transformer_{tr_num:02d}"
    tr_group = bpy.data.objects.new(tr_name, None)
    tr_group.empty_display_type = 'PLAIN_AXES'
    tr_group.location = position
    tr_group.parent = pb_group
    bpy.context.collection.objects.link(tr_group)
    
    # Socle en béton (4.5m x 3.5m x 0.5m)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(position[0], position[1], position[2] - 1.75)
    )
    base = bpy.context.active_object
    base.name = f"{tr_name}_Base"
    base.scale = (4.5, 0.5, 3.5)
    base.parent = tr_group
    
    mat_base = bpy.data.materials.new(name=f"{tr_name}_Base_Material")
    mat_base.use_nodes = True
    bsdf = mat_base.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.6, 0.6, 0.65, 1.0)  # Béton
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = 0.7
    base.data.materials.append(mat_base)
    
    # Cuve principale (4m x 3m x 5m)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=position
    )
    tank = bpy.context.active_object
    tank.name = f"{tr_name}_Tank"
    tank.scale = (4, 3, 5)
    tank.parent = tr_group
    
    mat_tank = bpy.data.materials.new(name=f"{tr_name}_Tank_Material")
    mat_tank.use_nodes = True
    bsdf = mat_tank.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.02, 0.59, 0.41, 1.0)  # Vert industriel
    bsdf.inputs["Metallic"].default_value = 0.2
    bsdf.inputs["Roughness"].default_value = 0.5
    tank.data.materials.append(mat_tank)
    
    # Radiateurs verticaux (6 radiateurs de 0.3m de large)
    for i in range(6):
        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=(position[0] + 1.5 + i * 0.3, position[1], position[2] + 2.6)
        )
        radiator = bpy.context.active_object
        radiator.name = f"{tr_name}_Radiator_{i+1}"
        radiator.scale = (0.3, 2.5, 0.1)
        radiator.parent = tr_group
        
        mat_rad = bpy.data.materials.new(name=f"{tr_name}_Radiator_Material")
        mat_rad.use_nodes = True
        bsdf = mat_rad.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (0.42, 0.45, 0.50, 1.0)  # Métal gris
        bsdf.inputs["Metallic"].default_value = 0.7
        bsdf.inputs["Roughness"].default_value = 0.4
        radiator.data.materials.append(mat_rad)
    
    # Bushings HT (3 en haut)
    for i in range(3):
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.15,
            depth=0.4,
            location=(position[0] - 1.5 + i * 1.5, position[1] + 1.8, position[2])
        )
        bushing = bpy.context.active_object
        bushing.name = f"{tr_name}_Bushing_HT_{i+1}"
        bushing.rotation_euler = (1.5708, 0, 0)  # Rotation 90° sur X
        bushing.parent = tr_group
        
        mat_bushing = bpy.data.materials.new(name=f"{tr_name}_Bushing_Material")
        mat_bushing.use_nodes = True
        bsdf = mat_bushing.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (1.0, 1.0, 1.0, 1.0)  # Porcelaine blanche
        bsdf.inputs["Metallic"].default_value = 0.0
        bsdf.inputs["Roughness"].default_value = 0.2
        bushing.data.materials.append(mat_bushing)
    
    # Bushings BT (3 sur le côté)
    for i in range(3):
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.12,
            depth=0.3,
            location=(position[0] + 2.2, position[1] - 1 + i * 1, position[2])
        )
        bushing = bpy.context.active_object
        bushing.name = f"{tr_name}_Bushing_BT_{i+1}"
        bushing.parent = tr_group
        
        mat_bushing = bpy.data.materials.new(name=f"{tr_name}_Bushing_BT_Material")
        mat_bushing.use_nodes = True
        bsdf = mat_bushing.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (1.0, 1.0, 1.0, 1.0)
        bsdf.inputs["Metallic"].default_value = 0.0
        bsdf.inputs["Roughness"].default_value = 0.2
        bushing.data.materials.append(mat_bushing)
    
    return tr_group

# Positions des Power Blocks
pb_positions = [-60, -20, 20, 60]
# Positions Y des transformateurs (espacement 20m)
tr_y_positions = [-60, -80, -100, -120, -140, -160]

transformers_created = 0

# Créer les transformateurs pour chaque Power Block
for pb_num in range(1, 5):
    pb_x = pb_positions[pb_num - 1]
    
    for tr_num in range(1, 7):
        tr_y = tr_y_positions[tr_num - 1]
        position = (pb_x, tr_y, 0)
        
        create_transformer(pb_num, tr_num, position)
        transformers_created += 1

print(f"\n✅ {transformers_created} transformateurs créés avec succès!")
print("➡️  Prochaine étape: Créer les switchgears")
