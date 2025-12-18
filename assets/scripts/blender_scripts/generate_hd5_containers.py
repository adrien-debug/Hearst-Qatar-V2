"""
Script Blender pour générer automatiquement les 48 containers Bitmain ANTSPACE HD5
Usage: Exécuter dans Blender (Scripting workspace > New > Coller le script > Run)
"""

import bpy
import bmesh
from mathutils import Vector

# Dimensions exactes du Bitmain ANTSPACE HD5 (en mètres)
HD5_LENGTH = 12.196
HD5_WIDTH = 2.438
HD5_HEIGHT = 2.896

def create_hd5_container(name, position, parent=None):
    """
    Crée un container HD5 complet avec tous ses éléments
    
    Args:
        name: Nom du container (ex: "PB1_TR01_HD5_A")
        position: Position (x, y, z) en mètres
        parent: Objet parent (transformateur)
    """
    # Créer le groupe principal
    container_group = bpy.data.objects.new(name, None)
    container_group.empty_display_type = 'PLAIN_AXES'
    container_group.location = position
    bpy.context.collection.objects.link(container_group)
    
    if parent:
        container_group.parent = parent
    
    # Structure principale du container
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(0, 0, 0)
    )
    container_main = bpy.context.active_object
    container_main.name = f"{name}_Container"
    container_main.scale = (HD5_LENGTH, HD5_HEIGHT, HD5_WIDTH)
    container_main.parent = container_group
    
    # Matériau container
    mat_container = bpy.data.materials.new(name=f"{name}_Material")
    mat_container.use_nodes = True
    bsdf = mat_container.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.3, 0.3, 0.35, 1.0)  # Gris/vert
    bsdf.inputs["Metallic"].default_value = 0.3
    bsdf.inputs["Roughness"].default_value = 0.6
    container_main.data.materials.append(mat_container)
    
    # Rainures industrielles sur les côtés
    for i in range(8):
        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=(0, 0, HD5_WIDTH/2 + 0.01)
        )
        groove = bpy.context.active_object
        groove.name = f"{name}_Groove_{i+1}"
        groove.scale = (0.1, HD5_HEIGHT * 0.8, 0.05)
        groove.location.x = -HD5_LENGTH/2 + 0.5 + i * 1.5
        groove.parent = container_group
        groove.data.materials.append(mat_container)
    
    # Portes arrière (2 portes)
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(HD5_LENGTH/2 - 0.1, 0, 0)
    )
    doors = bpy.context.active_object
    doors.name = f"{name}_Doors_Rear"
    doors.scale = (0.2, HD5_HEIGHT * 0.9, HD5_WIDTH * 0.9)
    doors.parent = container_group
    doors.data.materials.append(mat_container)
    
    # Poignées de portes
    for i in range(2):
        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=(HD5_LENGTH/2 - 0.05, -0.5 + i * 1, HD5_WIDTH/2 + 0.05)
        )
        handle = bpy.context.active_object
        handle.name = f"{name}_Handle_{i+1}"
        handle.scale = (0.1, 0.3, 0.1)
        handle.parent = container_group
        
        mat_handle = bpy.data.materials.new(name=f"{name}_Handle_Material")
        mat_handle.use_nodes = True
        bsdf = mat_handle.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (0.12, 0.12, 0.15, 1.0)
        bsdf.inputs["Metallic"].default_value = 0.8
        bsdf.inputs["Roughness"].default_value = 0.3
        handle.data.materials.append(mat_handle)
    
    # Coffret électrique latéral
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=(-HD5_LENGTH/2 + 0.4, HD5_HEIGHT/2 - 0.3, HD5_WIDTH/2 + 0.1)
    )
    electrical_box = bpy.context.active_object
    electrical_box.name = f"{name}_ElectricalBox"
    electrical_box.scale = (0.8, 0.6, 0.4)
    electrical_box.parent = container_group
    
    mat_electrical = bpy.data.materials.new(name=f"{name}_Electrical_Material")
    mat_electrical.use_nodes = True
    bsdf = mat_electrical.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.98, 0.75, 0.14, 1.0)  # Jaune sécurité
    bsdf.inputs["Metallic"].default_value = 0.4
    bsdf.inputs["Roughness"].default_value = 0.5
    electrical_box.data.materials.append(mat_electrical)
    
    # Grilles de ventilation
    for i in range(6):
        bpy.ops.mesh.primitive_cube_add(
            size=1,
            location=(-HD5_LENGTH/2 + 1 + i * 2, HD5_HEIGHT/2 - 0.2, HD5_WIDTH/2 + 0.01)
        )
        vent = bpy.context.active_object
        vent.name = f"{name}_Vent_{i+1}"
        vent.scale = (0.3, 0.3, 0.05)
        vent.parent = container_group
        
        mat_vent = bpy.data.materials.new(name=f"{name}_Vent_Material")
        mat_vent.use_nodes = True
        bsdf = mat_vent.node_tree.nodes["Principled BSDF"]
        bsdf.inputs["Base Color"].default_value = (0.12, 0.12, 0.15, 1.0)
        bsdf.inputs["Metallic"].default_value = 0.5
        bsdf.inputs["Roughness"].default_value = 0.4
        bsdf.inputs["Alpha"].default_value = 0.7
        mat_vent.blend_method = 'BLEND'
        vent.data.materials.append(mat_vent)
    
    # Pipes hydrauliques
    # Pipe entrée
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.075,
        depth=0.5,
        location=(-HD5_LENGTH/2 + 1, -HD5_HEIGHT/2 + 0.2, HD5_WIDTH/2 + 0.15)
    )
    pipe_in = bpy.context.active_object
    pipe_in.name = f"{name}_Pipe_In"
    pipe_in.rotation_euler = (1.5708, 0, 0)  # Rotation 90° sur X
    pipe_in.parent = container_group
    
    # Pipe sortie
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.075,
        depth=0.5,
        location=(-HD5_LENGTH/2 + 1, -HD5_HEIGHT/2 + 0.2, -HD5_WIDTH/2 - 0.15)
    )
    pipe_out = bpy.context.active_object
    pipe_out.name = f"{name}_Pipe_Out"
    pipe_out.rotation_euler = (1.5708, 0, 0)
    pipe_out.parent = container_group
    
    mat_pipe = bpy.data.materials.new(name=f"{name}_Pipe_Material")
    mat_pipe.use_nodes = True
    bsdf = mat_pipe.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.9, 0.9, 0.92, 1.0)  # Inox
    bsdf.inputs["Metallic"].default_value = 0.9
    bsdf.inputs["Roughness"].default_value = 0.2
    pipe_in.data.materials.append(mat_pipe)
    pipe_out.data.materials.append(mat_pipe)
    
    # Points d'interface (Empty objects)
    power_in = bpy.data.objects.new(f"{name}_PowerIn", None)
    power_in.empty_display_type = 'ARROWS'
    power_in.location = (-HD5_LENGTH/2 + 1, -HD5_HEIGHT/2, 0)
    power_in.parent = container_group
    bpy.context.collection.objects.link(power_in)
    
    cooling_in = bpy.data.objects.new(f"{name}_CoolingIn", None)
    cooling_in.empty_display_type = 'ARROWS'
    cooling_in.location = (-HD5_LENGTH/2 + 1, -HD5_HEIGHT/2, 0)
    cooling_in.parent = container_group
    bpy.context.collection.objects.link(cooling_in)
    
    return container_group


def generate_all_hd5_containers():
    """
    Génère tous les 48 containers HD5 selon la structure:
    - 4 Power Blocks
    - 6 Transformateurs par Power Block
    - 2 HD5 par Transformateur
    """
    # Positions des Power Blocks
    pb_positions = [
        (-60, -40, 0),  # PB1
        (-20, -40, 0),  # PB2
        (20, -40, 0),   # PB3
        (60, -40, 0)    # PB4
    ]
    
    # Positions des transformateurs (Y de -60 à -160, espacement 20m)
    transformer_y_positions = [-60, -80, -100, -120, -140, -160]
    
    containers_created = 0
    
    for pb_num in range(1, 5):
        pb_x = pb_positions[pb_num - 1][0]
        
        for tr_num in range(1, 7):
            tr_y = transformer_y_positions[tr_num - 1]
            
            # Créer les 2 HD5 pour ce transformateur
            # HD5_A: X du transformateur - 2m
            # HD5_B: X du transformateur + 2m
            
            hd5_a_name = f"PB{pb_num}_TR{tr_num:02d}_HD5_A"
            hd5_b_name = f"PB{pb_num}_TR{tr_num:02d}_HD5_B"
            
            hd5_a_pos = (pb_x - 2, tr_y, 0)
            hd5_b_pos = (pb_x + 2, tr_y, 0)
            
            # Note: Dans un vrai script, vous devriez trouver le parent transformateur
            # Ici on crée sans parent pour l'exemple
            create_hd5_container(hd5_a_name, hd5_a_pos)
            create_hd5_container(hd5_b_name, hd5_b_pos)
            
            containers_created += 2
    
    print(f"✅ {containers_created} containers HD5 créés avec succès!")
    return containers_created


# Exécution du script
if __name__ == "__main__":
    # Nettoyer la sélection
    bpy.ops.object.select_all(action='DESELECT')
    
    # Générer tous les containers
    generate_all_hd5_containers()
    
    print("\n📦 Génération terminée!")
    print("💡 Astuce: Organisez les containers dans la hiérarchie avec leurs transformateurs parents")

