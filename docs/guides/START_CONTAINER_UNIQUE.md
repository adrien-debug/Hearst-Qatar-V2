# 🚀 Démarrage Rapide - Container Hearst HD

## 📦 Objectif

Créer un modèle 3D d'un **container unique** avec :
- Dalle béton 40 cm
- Container HD noir
- Système de refroidissement (cooling)
- Logo Hearst
- **Le tout en 1 seul objet**

---

## ⚡ Méthode Rapide (5 minutes)

### Étape 1 : Ouvrir Blender

Télécharger et installer [Blender 3.x](https://www.blender.org/download/) si nécessaire.

### Étape 2 : Charger le Script

Dans Blender :
1. Aller dans l'onglet **Scripting** (en haut)
2. Cliquer sur **Open** (📁)
3. Naviguer vers :
   ```
   /Users/adrienbeyondcrypto/Desktop/Hearst Qatar/blender_scripts/
   ```
4. Sélectionner **`create_container_hearst_hd.py`**

### Étape 3 : Exécuter

1. Cliquer sur le bouton **▶️ Run Script** (ou Alt+P)
2. Attendre 5-10 secondes
3. ✅ Container créé automatiquement !

### Étape 4 : Vérifier

Le script affiche :
```
✅ CONTAINER HEARST HD CRÉÉ AVEC SUCCÈS!
📊 Vertices: ~3500
📊 Faces: ~3200
💾 Export GLB: /public/models/container_hearst_hd.glb
```

### Étape 5 : Utiliser

Le fichier GLB est prêt à être utilisé dans le configurateur Three.js !

---

## 📚 Documentation Complète

### Pour Débutants

1. **`README_CONTAINER_UNIQUE.md`**
   - Vue d'ensemble
   - Instructions de base
   - Checklist de validation

### Pour Utilisateurs Avancés

2. **`GUIDE_MODELISATION_CONTAINER_UNIQUE.md`**
   - Guide complet étape par étape
   - Explications détaillées
   - Configuration manuelle

3. **`CONTAINER_HEARST_RECAP.md`**
   - Récapitulatif technique
   - Workflow complet
   - Dépannage

### Scripts Disponibles

4. **`blender_scripts/create_container_hearst_hd.py`**
   - Script automatique complet
   - Création + export automatique
   - Recommandé ⭐

5. **`blender_scripts/container_simple.py`**
   - Version simplifiée
   - Code court et lisible
   - Facile à modifier

### Preview Visuel

6. **`preview-container-hearst.html`**
   - Aperçu 3D animé
   - Spécifications visuelles
   - Code d'intégration

---

## 🎨 Aperçu Visuel

Ouvrir dans un navigateur :

```bash
open preview-container-hearst.html
```

Ou double-cliquer sur le fichier `preview-container-hearst.html`

---

## 📐 Spécifications Rapides

| Élément | Dimensions | Couleur |
|---------|-----------|---------|
| Dalle béton | 6.5m × 3.0m × 0.4m | #C0C0C0 (gris) |
| Container | 6.058m × 2.438m × 2.591m | #000000 (noir) |
| AC Unit | 1.6m × 1.2m × 0.6m | #404040 (gris foncé) |
| Logo Hearst | 1.2m × 0.6m | #00A651 (vert) |

**Total :** 1 seul objet fusionné, ~3500 polygones, format GLB

---

## 🔧 Intégration Three.js

```typescript
import { useGLTF } from '@react-three/drei'

export function ContainerHearstHD() {
  const { scene } = useGLTF('/models/container_hearst_hd.glb')
  return <primitive object={scene.clone()} />
}
```

---

## ✅ Checklist Rapide

- [ ] Blender 3.x installé
- [ ] Script chargé
- [ ] Script exécuté avec succès
- [ ] Container visible dans Blender (1 seul objet)
- [ ] Fichier GLB exporté dans `/public/models/`
- [ ] Test de chargement dans Three.js

---

## 🆘 Besoin d'Aide ?

### Problème : Je n'ai pas Blender

**Solution :** Télécharger gratuitement sur [blender.org](https://www.blender.org/download/)

### Problème : Le script ne fonctionne pas

**Solution :**
1. Vérifier que vous êtes dans l'onglet **Scripting**
2. Vérifier que le chemin du fichier est correct
3. Regarder la console pour les erreurs (Window > Toggle System Console)

### Problème : L'export ne fonctionne pas

**Solution :**
1. Vérifier que le dossier `/public/models/` existe
2. Créer le dossier si nécessaire
3. Modifier le chemin d'export dans le script si besoin

### Problème : Je veux modifier le modèle

**Solution :**
- Utiliser le script simple : `blender_scripts/container_simple.py`
- Modifier les dimensions dans les variables en haut du script
- Suivre le guide manuel : `GUIDE_MODELISATION_CONTAINER_UNIQUE.md`

---

## 📖 Navigation Documentation

```
START_CONTAINER_UNIQUE.md (vous êtes ici)
│
├─ README_CONTAINER_UNIQUE.md
│   └─ Vue d'ensemble et démarrage rapide
│
├─ GUIDE_MODELISATION_CONTAINER_UNIQUE.md
│   └─ Guide complet étape par étape
│
├─ CONTAINER_HEARST_RECAP.md
│   └─ Récapitulatif technique détaillé
│
├─ blender_scripts/
│   ├─ create_container_hearst_hd.py (automatique)
│   └─ container_simple.py (simple)
│
└─ preview-container-hearst.html
    └─ Aperçu visuel interactif
```

---

## 🎯 Prochaines Étapes

1. ✅ Créer le container avec le script
2. ✅ Vérifier l'export GLB
3. ✅ Intégrer dans le configurateur Three.js
4. ✅ Tester l'affichage
5. ✅ Créer des variantes si nécessaire

---

## 💡 Conseils

- **Utilisez le script automatique** pour gagner du temps
- **Vérifiez que c'est 1 seul objet** (critique !)
- **Testez dans Three.js** avant de créer des variantes
- **Gardez une copie du fichier .blend** pour modifications futures

---

**Hearst Qatar Project**  
Container HD Unique - Documentation Complète  
Version 1.0







