"""
Script Blender pour créer les 4 Power Blocks avec leur structure de base
Étape 4 de la checklist

Usage: Dans Blender, Scripting workspace > New > Coller ce script > Run
"""

import bpy

def create_power_block(pb_num, position):
    """
    Crée un Power Block avec sa structure de base
    
    Args:
        pb_num: Numéro du Power Block (1-4)
        position: Position (x, y, z) en mètres
    """
    # Créer le groupe principal
    pb_name = f"PowerBlock_{pb_num}"
    pb_group = bpy.data.objects.new(pb_name, None)
    pb_group.empty_display_type = 'PLAIN_AXES'
    pb_group.location = position
    bpy.context.collection.objects.link(pb_group)
    
    # Parent: SubstationSystem
    substation_system = bpy.data.objects.get("SubstationSystem")
    if substation_system:
        pb_group.parent = substation_system
    
    # Structure principale (15m x 8m x 10m)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(position[0], position[1], position[2] + 4)
    )
    pb_structure = bpy.context.active_object
    pb_structure.name = f"PB{pb_num}_Structure"
    pb_structure.scale = (15, 8, 10)
    pb_structure.parent = pb_group
    
    # Matériau béton industriel
    mat_structure = bpy.data.materials.new(name=f"{pb_name}_Structure_Material")
    mat_structure.use_nodes = True
    bsdf = mat_structure.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.6, 0.6, 0.6, 1.0)  # Gris béton
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = 0.7
    pb_structure.data.materials.append(mat_structure)
    
    # Panneaux électriques latéraux
    for side in ['Left', 'Right']:
        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=(position[0] + (7.5 if side == 'Right' else -7.5), position[1], position[2] + 4)
        )
        panel = bpy.context.active_object
        panel.name = f"PB{pb_num}_Panel_{side}"
        panel.scale = (0.2, 6, 8)
        panel.parent = pb_group
        
        mat_panel = bpy.data.materials.new(name=f"{pb_name}_Panel_Material")
        mat_panel.use_nodes = True
        bsdf = mat_panel.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (0.3, 0.3, 0.35, 1.0)  # Gris métal
        bsdf.inputs["Metallic"].default_value = 0.5
        bsdf.inputs["Roughness"].default_value = 0.5
        panel.data.materials.append(mat_panel)
    
    return pb_group

# Positions des Power Blocks
pb_positions = [
    (-60, -40, 0),  # PB1
    (-20, -40, 0),  # PB2
    (20, -40, 0),   # PB3
    (60, -40, 0)    # PB4
]

# Créer les 4 Power Blocks
for i, pos in enumerate(pb_positions, 1):
    create_power_block(i, pos)
    print(f"✅ PowerBlock_{i} créé à {pos}")

print(f"\n✅ {len(pb_positions)} Power Blocks créés avec succès!")
print("➡️  Prochaine étape: Créer les transformateurs")
