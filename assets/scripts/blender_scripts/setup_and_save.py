"""
Script Blender pour configurer la scène et sauvegarder le fichier
"""

import bpy
import os

# Nettoyer la scène par défaut
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Configurer les unités métriques
bpy.context.scene.unit_settings.system = 'METRIC'
bpy.context.scene.unit_settings.scale_length = 1.0
bpy.context.scene.unit_settings.length_unit = 'METERS'

# Configurer la grille
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                space.overlay.grid_scale = 1.0
                space.overlay.grid_subdivisions = 10

# Créer l'objet racine SubstationSystem
substation_system = bpy.data.objects.new("SubstationSystem", None)
substation_system.empty_display_type = 'PLAIN_AXES'
substation_system.location = (0, 0, 0)
bpy.context.collection.objects.link(substation_system)

# Définir SubstationSystem comme objet actif
bpy.context.view_layer.objects.active = substation_system
substation_system.select_set(True)

# Créer Substation_200MW (Empty)
substation_200mw = bpy.data.objects.new("Substation_200MW", None)
substation_200mw.empty_display_type = 'PLAIN_AXES'
substation_200mw.location = (0, 0, 0)
substation_200mw.parent = substation_system
bpy.context.collection.objects.link(substation_200mw)

# Sauvegarder le fichier
blend_file_path = os.path.join(os.path.dirname(__file__), '..', 'substation_200MW.blend')
blend_file_path = os.path.abspath(blend_file_path)
bpy.ops.wm.save_as_mainfile(filepath=blend_file_path)

print(f"✅ Scène configurée et sauvegardée dans: {blend_file_path}")
print("📐 Unités: Métriques (mètres)")
print("📏 Grille: 1m par division")
print("🎯 Origine: (0, 0, 0)")
print("📦 Objets créés:")
print("   - SubstationSystem (racine)")
print("   - Substation_200MW (parent: SubstationSystem)")
