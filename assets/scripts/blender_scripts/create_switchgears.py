"""
Script Blender pour créer les 24 switchgears/disjoncteurs
Étape 6 de la checklist

Usage: Dans Blender, Scripting workspace > New > Coller ce script > Run
"""

import bpy

def create_switchgear(pb_num, tr_num, position):
    """
    Crée un switchgear pour un transformateur
    
    Args:
        pb_num: Numéro du Power Block (1-4)
        tr_num: Numéro du transformateur (1-6)
        position: Position (x, y, z) en mètres
    """
    # Trouver le transformateur parent
    tr_name = f"PB{pb_num}_Transformer_{tr_num:02d}"
    tr_group = bpy.data.objects.get(tr_name)
    
    if not tr_group:
        print(f"⚠️  {tr_name} non trouvé. Exécutez d'abord create_transformers.py")
        return None
    
    sg_name = f"PB{pb_num}_SG_{tr_num:02d}"
    
    # Boîtier principal (2m x 2m x 1.5m)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=position
    )
    enclosure = bpy.context.active_object
    enclosure.name = f"{sg_name}_Enclosure"
    enclosure.scale = (2, 2, 1.5)
    enclosure.parent = tr_group
    
    # Matériau boîtier (métal gris RAL 7035)
    mat_enclosure = bpy.data.materials.new(name=f"{sg_name}_Enclosure_Material")
    mat_enclosure.use_nodes = True
    bsdf = mat_enclosure.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.5, 0.52, 0.55, 1.0)  # Gris RAL 7035
    bsdf.inputs["Metallic"].default_value = 0.5
    bsdf.inputs["Roughness"].default_value = 0.6
    enclosure.data.materials.append(mat_enclosure)
    
    # Panneau de contrôle (avant)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(position[0], position[1] - 1.1, position[2])
    )
    panel = bpy.context.active_object
    panel.name = f"{sg_name}_Controls"
    panel.scale = (1.8, 0.1, 1.3)
    panel.parent = tr_group
    
    mat_panel = bpy.data.materials.new(name=f"{sg_name}_Panel_Material")
    mat_panel.use_nodes = True
    bsdf = mat_panel.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.1, 0.1, 0.1, 1.0)  # Plastique noir
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = 0.8
    panel.data.materials.append(mat_panel)
    
    # Voyants (3 petits cercles)
    for i in range(3):
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.05,
            depth=0.05,
            location=(position[0] - 0.5 + i * 0.5, position[1] - 1.15, position[2] + 0.5)
        )
        led = bpy.context.active_object
        led.name = f"{sg_name}_LED_{i+1}"
        led.rotation_euler = (1.5708, 0, 0)
        led.parent = tr_group
        
        mat_led = bpy.data.materials.new(name=f"{sg_name}_LED_Material")
        mat_led.use_nodes = True
        bsdf = mat_led.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (0.0, 1.0, 0.0, 1.0)  # Vert
        bsdf.inputs["Emission Color"].default_value = (0.0, 1.0, 0.0, 1.0)
        bsdf.inputs["Emission Strength"].default_value = 2.0
        led.data.materials.append(mat_led)
    
    return enclosure

# Positions des Power Blocks
pb_positions = [-60, -20, 20, 60]
# Positions Y des transformateurs
tr_y_positions = [-60, -80, -100, -120, -140, -160]

switchgears_created = 0

# Créer les switchgears pour chaque transformateur
for pb_num in range(1, 5):
    pb_x = pb_positions[pb_num - 1]
    
    for tr_num in range(1, 7):
        tr_y = tr_y_positions[tr_num - 1]
        # Switchgear positionné à X+5m du transformateur
        position = (pb_x + 5, tr_y, 0)
        
        create_switchgear(pb_num, tr_num, position)
        switchgears_created += 1

print(f"\n✅ {switchgears_created} switchgears créés avec succès!")
print("➡️  Prochaine étape: Générer les containers HD5 avec generate_hd5_containers.py")
