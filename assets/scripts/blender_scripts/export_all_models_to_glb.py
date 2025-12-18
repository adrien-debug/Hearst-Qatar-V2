"""
Script Blender pour exporter automatiquement tous les modèles en GLB
Usage: Exécutez ce script dans Blender pour exporter tous les modèles automatiquement
"""

import bpy
import os
from pathlib import Path

# Configuration
EXPORT_PATH = Path.home() / "Desktop" / "Hearst Qatar" / "public" / "models"
EXPORT_PATH.mkdir(parents=True, exist_ok=True)

# Liste des objets à exporter avec leurs noms de fichiers
MODELS_TO_EXPORT = [
    {
        "object_name": "HD5_Container",  # Nom de l'objet dans Blender
        "filename": "hd5_container.glb",
        "scale": (12.196, 2.438, 2.896),  # Dimensions en mètres
    },
    {
        "object_name": "Transformer",
        "filename": "transformer.glb",
        "scale": (4, 3, 5),
    },
    {
        "object_name": "Switchgear",
        "filename": "switchgear.glb",
        "scale": (2, 2, 3),
    },
    {
        "object_name": "PowerBlock",
        "filename": "power_block.glb",
        "scale": (15, 8, 10),
    },
    {
        "object_name": "Substation_200MW",
        "filename": "substation_200mw.glb",
        "scale": (40, 30, 15),
    },
]

def export_model(object_name, filename, scale=None):
    """Exporte un objet en GLB"""
    # Sélectionner l'objet
    if object_name not in bpy.data.objects:
        print(f"⚠️  Objet '{object_name}' non trouvé dans la scène")
        return False
    
    obj = bpy.data.objects[object_name]
    
    # Désélectionner tout
    bpy.ops.object.select_all(action='DESELECT')
    
    # Sélectionner l'objet
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    
    # Appliquer l'échelle si spécifiée
    if scale:
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    
    # Centrer l'objet à l'origine
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='MEDIAN')
    obj.location = (0, 0, 0)
    
    # Chemin d'export
    export_file = EXPORT_PATH / filename
    
    # Exporter en GLB
    bpy.ops.export_scene.gltf(
        filepath=str(export_file),
        export_format='GLB',
        export_selected=True,
        export_yup=True,
        export_apply=True,
        export_materials='EXPORT',
        export_colors=True,
        export_cameras=False,
        export_lights=False,
    )
    
    print(f"✅ Exporté : {filename} -> {export_file}")
    return True

def main():
    """Fonction principale"""
    print("🚀 Début de l'export automatique des modèles...")
    print(f"📁 Destination : {EXPORT_PATH}\n")
    
    exported = 0
    failed = 0
    
    for model in MODELS_TO_EXPORT:
        print(f"📦 Export de {model['object_name']}...")
        if export_model(
            model["object_name"],
            model["filename"],
            model.get("scale")
        ):
            exported += 1
        else:
            failed += 1
        print()
    
    print("=" * 50)
    print(f"✅ Exportés avec succès : {exported}/{len(MODELS_TO_EXPORT)}")
    if failed > 0:
        print(f"❌ Échecs : {failed}")
    print("=" * 50)
    
    if exported == len(MODELS_TO_EXPORT):
        print("\n🎉 Tous les modèles ont été exportés avec succès !")
        print(f"📁 Fichiers dans : {EXPORT_PATH}")
        print("\n💡 Prochaines étapes :")
        print("   1. Vérifiez les fichiers dans /public/models/")
        print("   2. Lancez : npm run dev")
        print("   3. Visitez : http://localhost:1111/substation-3d-auto")
    else:
        print("\n⚠️  Certains modèles n'ont pas pu être exportés")
        print("   Vérifiez que les objets existent dans votre scène Blender")
        print("   et que leurs noms correspondent à ceux dans le script")

if __name__ == "__main__":
    main()
