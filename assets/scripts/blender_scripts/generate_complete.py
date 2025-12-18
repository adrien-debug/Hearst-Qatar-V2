"""
Script complet pour générer tous les éléments de la ferme énergétique
Exécute tous les scripts dans le bon ordre et sauvegarde
"""

import bpy
import os

# Chemin du fichier blend
blend_file = os.path.join(os.path.dirname(__file__), '..', 'substation_200MW.blend')
blend_file = os.path.abspath(blend_file)
scripts_dir = os.path.dirname(__file__)

print("="*60)
print("🚀 GÉNÉRATION COMPLÈTE DE LA FERME ÉNERGÉTIQUE 200 MW")
print("="*60)

# Charger ou créer le fichier
if os.path.exists(blend_file):
    bpy.ops.wm.open_mainfile(filepath=blend_file)
    print(f"✅ Fichier chargé: {blend_file}\n")
else:
    print("⚠️  Fichier non trouvé, création d'une nouvelle scène...\n")
    # Setup initial
    exec(open(os.path.join(scripts_dir, 'setup_scene.py')).read())

# 1. Power Blocks
print("\n" + "-"*60)
print("📦 ÉTAPE 1/4: Création des 4 Power Blocks")
print("-"*60)
exec(open(os.path.join(scripts_dir, 'create_power_blocks.py')).read())

# 2. Transformateurs
print("\n" + "-"*60)
print("📦 ÉTAPE 2/4: Création des 24 Transformateurs")
print("-"*60)
exec(open(os.path.join(scripts_dir, 'create_transformers.py')).read())

# 3. Switchgears
print("\n" + "-"*60)
print("📦 ÉTAPE 3/4: Création des 24 Switchgears")
print("-"*60)
exec(open(os.path.join(scripts_dir, 'create_switchgears.py')).read())

# 4. Containers HD5
print("\n" + "-"*60)
print("📦 ÉTAPE 4/4: Création des 48 Containers HD5")
print("-"*60)
exec(open(os.path.join(scripts_dir, 'generate_hd5_containers.py')).read())

# Sauvegarder
print("\n" + "-"*60)
print("💾 Sauvegarde du fichier...")
bpy.ops.wm.save_as_mainfile(filepath=blend_file)

print("\n" + "="*60)
print("✅ GÉNÉRATION TERMINÉE AVEC SUCCÈS!")
print("="*60)
print(f"📁 Fichier sauvegardé: {blend_file}")
print("\n📊 RÉSUMÉ DES ÉLÉMENTS CRÉÉS:")
print("   ✅ 1 Substation (structure de base - à compléter manuellement)")
print("   ✅ 4 Power Blocks")
print("   ✅ 24 Transformateurs")
print("   ✅ 24 Switchgears")
print("   ✅ 48 Containers HD5")
print("\n   📦 TOTAL: 101 éléments modélisés")
print("\n➡️  PROCHAINES ÉTAPES:")
print("   1. Ouvrir substation_200MW.blend dans Blender")
print("   2. Compléter la modélisation de la Substation 200 MW")
print("   3. Vérifier la hiérarchie des objets")
print("   4. Exporter en glTF Binary (.glb)")
print("="*60)
