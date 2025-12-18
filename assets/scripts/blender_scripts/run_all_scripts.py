"""
Script maître pour exécuter tous les scripts de génération dans l'ordre
"""

import bpy
import os

# Chemin du fichier blend
blend_file = os.path.join(os.path.dirname(__file__), '..', 'substation_200MW.blend')
blend_file = os.path.abspath(blend_file)

# Charger le fichier blend
if os.path.exists(blend_file):
    bpy.ops.wm.open_mainfile(filepath=blend_file)
    print(f"✅ Fichier {blend_file} chargé")
else:
    print("⚠️  Fichier blend non trouvé, création d'une nouvelle scène...")
    # Exécuter setup si le fichier n'existe pas
    exec(open(os.path.join(os.path.dirname(__file__), 'setup_scene.py')).read())

# Exécuter les scripts dans l'ordre
scripts_dir = os.path.dirname(__file__)

print("\n" + "="*50)
print("🚀 Génération automatique de tous les éléments")
print("="*50 + "\n")

# 1. Power Blocks
print("📦 Étape 1/4: Création des Power Blocks...")
exec(open(os.path.join(scripts_dir, 'create_power_blocks.py')).read())

# 2. Transformateurs
print("\n📦 Étape 2/4: Création des Transformateurs...")
exec(open(os.path.join(scripts_dir, 'create_transformers.py')).read())

# 3. Switchgears
print("\n📦 Étape 3/4: Création des Switchgears...")
exec(open(os.path.join(scripts_dir, 'create_switchgears.py')).read())

# 4. Containers HD5
print("\n📦 Étape 4/4: Création des Containers HD5...")
exec(open(os.path.join(scripts_dir, 'generate_hd5_containers.py')).read())

# Sauvegarder
bpy.ops.wm.save_as_mainfile(filepath=blend_file)

print("\n" + "="*50)
print("✅ TOUS LES ÉLÉMENTS CRÉÉS AVEC SUCCÈS!")
print("="*50)
print(f"📁 Fichier sauvegardé: {blend_file}")
print("\n📊 Résumé:")
print("   - 1 Substation (à modéliser manuellement)")
print("   - 4 Power Blocks")
print("   - 24 Transformateurs")
print("   - 24 Switchgears")
print("   - 48 Containers HD5")
print("\n➡️  Prochaine étape: Modéliser la Substation 200 MW manuellement")
print("   puis exporter en glTF Binary (.glb)")
