"""
Script Blender - Création Container Hearst HD Unique
=====================================================

Ce script crée automatiquement un container complet avec:
- Dalle béton 40cm
- Container noir HD
- Système de refroidissement (cooling)
- Logo Hearst

Tout en 1 seul objet optimisé pour Three.js
"""

import bpy
import bmesh
from mathlib import Vector

# ============================================================================
# CONFIGURATION
# ============================================================================

# Couleurs Hearst
COLOR_BETON = (0.753, 0.753, 0.753, 1.0)      # #C0C0C0 Gris béton
COLOR_CONTAINER = (0.0, 0.0, 0.0, 1.0)        # #000000 Noir
COLOR_COOLING = (0.251, 0.251, 0.251, 1.0)    # #404040 Gris foncé
COLOR_LOGO = (0.0, 0.651, 0.318, 1.0)         # #00A651 Vert Hearst

# Dimensions (en mètres)
DALLE_LENGTH = 6.5
DALLE_WIDTH = 3.0
DALLE_HEIGHT = 0.4

CONTAINER_LENGTH = 6.058
CONTAINER_WIDTH = 2.438
CONTAINER_HEIGHT = 2.591

AC_LENGTH = 1.6
AC_WIDTH = 1.2
AC_HEIGHT = 0.6

VENT_LENGTH = 2.0
VENT_WIDTH = 0.1
VENT_HEIGHT = 0.8

LOGO_WIDTH = 1.2
LOGO_HEIGHT = 0.6

# ============================================================================
# FONCTIONS UTILITAIRES
# ============================================================================

def clean_scene():
    """Nettoyer la scène Blender"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    print("✅ Scène nettoyée")

def setup_units():
    """Configurer les unités en mètres"""
    bpy.context.scene.unit_settings.system = 'METRIC'
    bpy.context.scene.unit_settings.length_unit = 'METERS'
    print("✅ Unités configurées (mètres)")

def create_box(name, location, dimensions):
    """Créer une boîte avec dimensions spécifiques"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (dimensions[0]/2, dimensions[1]/2, dimensions[2]/2)
    bpy.ops.object.transform_apply(scale=True)
    return obj

def create_plane(name, location, dimensions, rotation=(0, 0, 0)):
    """Créer un plan avec dimensions spécifiques"""
    bpy.ops.mesh.primitive_plane_add(size=1, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (dimensions[0]/2, dimensions[1]/2, 1)
    obj.rotation_euler = rotation
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    return obj

def add_vertex_colors(obj):
    """Ajouter un calque de couleurs de vertex"""
    if not obj.data.vertex_colors:
        obj.data.vertex_colors.new()
    return obj.data.vertex_colors.active

def paint_vertices(obj, color, vertex_indices=None):
    """Peindre des vertices avec une couleur"""
    mesh = obj.data
    color_layer = mesh.vertex_colors.active
    
    if vertex_indices is None:
        # Peindre tous les vertices
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                color_layer.data[loop_idx].color = color
    else:
        # Peindre des vertices spécifiques
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                vert_idx = mesh.loops[loop_idx].vertex_index
                if vert_idx in vertex_indices:
                    color_layer.data[loop_idx].color = color

# ============================================================================
# CRÉATION DES COMPOSANTS
# ============================================================================

def create_dalle():
    """Créer la dalle béton 40cm"""
    dalle = create_box(
        "Dalle_Beton",
        location=(0, 0, DALLE_HEIGHT/2),
        dimensions=(DALLE_LENGTH, DALLE_WIDTH, DALLE_HEIGHT)
    )
    print(f"✅ Dalle béton créée: {DALLE_LENGTH}m x {DALLE_WIDTH}m x {DALLE_HEIGHT}m")
    return dalle

def create_container_body():
    """Créer le corps du container"""
    z_pos = DALLE_HEIGHT + CONTAINER_HEIGHT/2
    container = create_box(
        "Container_Body",
        location=(0, 0, z_pos),
        dimensions=(CONTAINER_LENGTH, CONTAINER_WIDTH, CONTAINER_HEIGHT)
    )
    print(f"✅ Container créé: {CONTAINER_LENGTH}m x {CONTAINER_WIDTH}m x {CONTAINER_HEIGHT}m")
    return container

def create_ac_unit():
    """Créer l'unité de climatisation sur le toit"""
    z_pos = DALLE_HEIGHT + CONTAINER_HEIGHT + AC_HEIGHT/2
    x_pos = CONTAINER_LENGTH/2 - AC_LENGTH/2 - 0.5
    
    ac = create_box(
        "AC_Unit",
        location=(x_pos, 0, z_pos),
        dimensions=(AC_LENGTH, AC_WIDTH, AC_HEIGHT)
    )
    print(f"✅ Unité AC créée: {AC_LENGTH}m x {AC_WIDTH}m x {AC_HEIGHT}m")
    return ac

def create_ventilation_grilles():
    """Créer les grilles de ventilation latérales"""
    z_pos = DALLE_HEIGHT + CONTAINER_HEIGHT/2
    y_offset = CONTAINER_WIDTH/2 + VENT_WIDTH/2
    
    # Grille gauche
    vent1 = create_box(
        "Vent_Left",
        location=(0, -y_offset, z_pos),
        dimensions=(VENT_LENGTH, VENT_WIDTH, VENT_HEIGHT)
    )
    
    # Grille droite
    vent2 = create_box(
        "Vent_Right",
        location=(0, y_offset, z_pos),
        dimensions=(VENT_LENGTH, VENT_WIDTH, VENT_HEIGHT)
    )
    
    print("✅ Grilles de ventilation créées (x2)")
    return [vent1, vent2]

def create_logo():
    """Créer le logo Hearst sur la face avant"""
    z_pos = DALLE_HEIGHT + CONTAINER_HEIGHT * 0.7
    x_pos = -CONTAINER_LENGTH/2 - 0.01  # Légèrement devant
    
    logo = create_plane(
        "Logo_Hearst",
        location=(x_pos, 0, z_pos),
        dimensions=(LOGO_WIDTH, LOGO_HEIGHT),
        rotation=(0, 1.5708, 0)  # 90° rotation Y
    )
    
    print(f"✅ Logo Hearst créé: {LOGO_WIDTH}m x {LOGO_HEIGHT}m")
    return logo

# ============================================================================
# ASSEMBLAGE ET MATÉRIAUX
# ============================================================================

def join_all_objects(objects):
    """Fusionner tous les objets en un seul"""
    # Désélectionner tout
    bpy.ops.object.select_all(action='DESELECT')
    
    # Sélectionner tous les objets
    for obj in objects:
        obj.select_set(True)
    
    # Le premier objet devient l'objet actif
    bpy.context.view_layer.objects.active = objects[0]
    
    # Fusionner
    bpy.ops.object.join()
    
    # Renommer
    final_obj = bpy.context.active_object
    final_obj.name = "Container_Hearst_HD"
    
    print("✅ Tous les objets fusionnés en: Container_Hearst_HD")
    return final_obj

def apply_vertex_colors(obj):
    """Appliquer les couleurs de vertex par zones"""
    # Ajouter le calque de couleurs
    add_vertex_colors(obj)
    
    # Mode édition pour sélectionner par zones
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')
    
    mesh = obj.data
    
    # Peindre par zones en fonction de la position Z
    for poly in mesh.polygons:
        # Calculer la position moyenne du polygone
        center_z = sum(mesh.vertices[v].co.z for v in poly.vertices) / len(poly.vertices)
        
        # Déterminer la couleur selon la hauteur
        if center_z < DALLE_HEIGHT:
            # Dalle béton
            color = COLOR_BETON
        elif center_z > DALLE_HEIGHT + CONTAINER_HEIGHT + 0.1:
            # Unité AC
            color = COLOR_COOLING
        else:
            # Container principal
            color = COLOR_CONTAINER
        
        # Appliquer la couleur
        for loop_idx in poly.loop_indices:
            mesh.vertex_colors.active.data[loop_idx].color = color
    
    print("✅ Couleurs de vertex appliquées")

def create_material():
    """Créer le matériau unique avec support vertex colors"""
    mat = bpy.data.materials.new(name="Container_Hearst_Material")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Nettoyer les nodes existants
    nodes.clear()
    
    # Créer les nodes
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (400, 0)
    
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Metallic'].default_value = 0.3
    bsdf.inputs['Roughness'].default_value = 0.7
    
    # Node pour les vertex colors
    vertex_color = nodes.new(type='ShaderNodeVertexColor')
    vertex_color.location = (-200, 0)
    
    # Connecter
    links.new(vertex_color.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    print("✅ Matériau créé avec vertex colors")
    return mat

def apply_material(obj, material):
    """Appliquer le matériau à l'objet"""
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)
    print("✅ Matériau appliqué")

# ============================================================================
# OPTIMISATION
# ============================================================================

def optimize_geometry(obj):
    """Optimiser la géométrie"""
    bpy.context.view_layer.objects.active = obj
    
    # Mode édition
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    
    # Supprimer les doublons
    bpy.ops.mesh.remove_doubles(threshold=0.001)
    
    # Recalculer les normales
    bpy.ops.mesh.normals_make_consistent(inside=False)
    
    # Retour en mode objet
    bpy.ops.object.mode_set(mode='OBJECT')
    
    print("✅ Géométrie optimisée")

def add_uv_mapping(obj):
    """Ajouter le mapping UV"""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    print("✅ UV mapping créé")

def center_origin(obj):
    """Centrer l'origine sur la dalle"""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    print("✅ Origine centrée")

# ============================================================================
# EXPORT
# ============================================================================

def export_glb(obj, filepath):
    """Exporter en GLB optimisé"""
    # Sélectionner uniquement l'objet
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    
    # Export
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=True,
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
    
    print(f"✅ Export GLB: {filepath}")

# ============================================================================
# SCRIPT PRINCIPAL
# ============================================================================

def main():
    """Fonction principale"""
    print("\n" + "="*60)
    print("CRÉATION CONTAINER HEARST HD")
    print("="*60 + "\n")
    
    # 1. Préparation
    clean_scene()
    setup_units()
    
    # 2. Création des composants
    print("\n--- Création des composants ---")
    dalle = create_dalle()
    container = create_container_body()
    ac_unit = create_ac_unit()
    vents = create_ventilation_grilles()
    logo = create_logo()
    
    # 3. Assemblage
    print("\n--- Assemblage ---")
    all_objects = [dalle, container, ac_unit] + vents + [logo]
    final_obj = join_all_objects(all_objects)
    
    # 4. Matériaux et couleurs
    print("\n--- Matériaux ---")
    apply_vertex_colors(final_obj)
    material = create_material()
    apply_material(final_obj, material)
    
    # 5. Optimisation
    print("\n--- Optimisation ---")
    optimize_geometry(final_obj)
    add_uv_mapping(final_obj)
    center_origin(final_obj)
    
    # 6. Statistiques
    print("\n--- Statistiques ---")
    mesh = final_obj.data
    print(f"Vertices: {len(mesh.vertices)}")
    print(f"Faces: {len(mesh.polygons)}")
    print(f"Dimensions: {final_obj.dimensions.x:.2f}m x {final_obj.dimensions.y:.2f}m x {final_obj.dimensions.z:.2f}m")
    
    # 7. Export
    print("\n--- Export ---")
    export_path = "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/public/models/container_hearst_hd.glb"
    export_glb(final_obj, export_path)
    
    print("\n" + "="*60)
    print("✅ CONTAINER HEARST HD CRÉÉ AVEC SUCCÈS!")
    print("="*60 + "\n")
    
    return final_obj

# ============================================================================
# EXÉCUTION
# ============================================================================

if __name__ == "__main__":
    container = main()







