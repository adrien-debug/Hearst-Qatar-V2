# 🏗️ Hearst 3D Configurator

Système modulaire 3D pour la conception d'infrastructures de mining Bitcoin institutionnelles - 5MW à 200MW

---

## ⚠️ IMPORTANT - PROJET SÉPARÉ

Les **dashboards institutionnels pour le Qatar** ont été déplacés vers un projet séparé :

### 📊 Hearst Qatar Dashboard (Port 1111)

**Emplacement :** `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/`

**Pages :**
- Executive Overview
- Mining Dashboard  
- Infrastructure Monitoring

**Pour y accéder :**
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard"
npm run dev
# → http://localhost:1111
```

**Documentation :** Voir `README.md` dans le projet Dashboard

---

## 🚀 Démarrage Rapide - Configurateur 3D

### Installation
```bash
npm install
```

### Lancement
```bash
npm run dev
```

### Accès
- **Application principale**: http://localhost:3333
- **Wizard de création**: http://localhost:3333/
- **Galerie de modèles**: http://localhost:3333/gallery
- **Environnement 3D**: http://localhost:3333/environment
- **Visualisation 3D**: http://localhost:3333/substation-3d
- **Éditeur Complet**: http://localhost:3333/substation-3d-complete-editor

## 📋 Fonctionnalités

### Tableaux de bord
- **Overview** (`/`) - Vue d'ensemble avec KPIs
- **Dashboard** (`/dashboard`) - Tableau de bord détaillé
- **Hardware** (`/hardware`) - Visualisation du matériel
- **Electrical** (`/electrical`) - Schéma électrique

### Visualisation 3D (Nouveau!)
- **3D View** (`/substation-3d`) - Visualisation 3D interactive complète
  - 1 Substation 200 MW
  - 4 Power Blocks
  - 24 Transformateurs
  - 24 Switchgears
  - 48 Containers Bitmain HD5

## 🎮 Contrôles 3D

| Action | Contrôle |
|--------|----------|
| Rotation | Clic gauche + glisser |
| Translation | Clic droit + glisser |
| Zoom | Molette de la souris |
| Sélection | Clic sur un objet 3D |
| Navigation rapide | Boutons de mode de vue |

## 🏗️ Structure du Projet

```
Hearst Qatar/
├── components/
│   ├── 3d/              # Composants 3D React Three Fiber
│   │   ├── Substation3D.tsx
│   │   ├── PowerBlock3D.tsx
│   │   ├── Transformer3D.tsx
│   │   ├── HD5Container3D.tsx
│   │   ├── SceneControls.tsx
│   │   ├── Lighting.tsx
│   │   └── ...
│   └── ...              # Autres composants
├── pages/
│   ├── substation-3d.tsx  # Page visualisation 3D
│   └── ...                # Autres pages
├── data/
│   └── electricalMock.ts  # Données structure électrique
├── utils/
│   └── 3dHelpers.ts        # Utilitaires 3D
├── config/
│   └── 3d.config.ts        # Configuration 3D
├── blender_scripts/
│   └── generate_hd5_containers.py  # Script Blender
└── public/
    └── models/            # Modèles 3D exportés (.glb)
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Guide de démarrage rapide 3D
- **[GUIDE_3D.md](./GUIDE_3D.md)** - Guide complet d'intégration 3D
- **[BLENDER_CHECKLIST.md](./BLENDER_CHECKLIST.md)** - Checklist modélisation Blender
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Résumé technique
- **[components/3d/README.md](./components/3d/README.md)** - Documentation composants

## 🛠️ Technologies

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **React Three Fiber** - Rendu 3D
- **Three.js** - Bibliothèque 3D
- **@react-three/drei** - Utilitaires 3D

### Modélisation 3D
- **Blender** - Modélisation 3D
- **glTF/GLB** - Format d'export

## 📦 Dépendances Principales

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "three": "^0.158.0"
}
```

## 🎯 Structure Électrique

### Configuration actuelle
- **1 Substation** - 200 MW
- **4 Power Blocks** - 50 MW chacun
- **24 Transformateurs** - 6 par Power Block
- **24 Switchgears** - 1 par transformateur
- **48 Containers HD5** - 2 par transformateur

### Dimensions
- **Container HD5**: 12.196m × 2.438m × 2.896m
- **Transformateur**: 4m × 3m × 5m
- **Power Block**: 15m × 8m × 10m
- **Substation**: 40m × 30m × 15m

## 🔧 Scripts Disponibles

```bash
npm run dev      # Démarrage développement
npm run build    # Build production
npm run start    # Démarrage production
npm run lint     # Vérification code
```

## 📝 Notes Importantes

### Visualisation 3D
- La version **procédurale** fonctionne immédiatement (génération en temps réel)
- Pour utiliser le modèle Blender, exporter vers `public/models/substation_200MW_schema.glb`
- Le modèle GLB remplacera automatiquement la version procédurale

### Modélisation Blender
- Suivre la checklist dans `BLENDER_CHECKLIST.md`
- Utiliser le script Python `blender_scripts/generate_hd5_containers.py`
- Respecter le nommage exact des objets

## 🐛 Dépannage

### Problèmes courants

**Le modèle 3D ne s'affiche pas**
- Vérifier la console du navigateur (F12)
- Vérifier que les dépendances sont installées
- La version procédurale devrait toujours fonctionner

**Erreurs TypeScript**
- Les erreurs JSX lors de la vérification directe sont normales
- Next.js gère automatiquement la compilation JSX

**Performances médiocres**
- Réduire le nombre de triangles dans Blender
- Utiliser l'instancing pour les éléments répétitifs
- Activer le frustum culling

## 🚧 Prochaines Étapes

1. ✅ **Visualisation 3D procédurale** - Terminé
2. ⏳ **Modélisation Blender complète** - En attente
3. ⏳ **Export et intégration GLB** - En attente
4. ⏳ **Optimisations avancées** - LOD, instancing, etc.

## 📄 Licence

Projet privé - Hearst Qatar

## 👥 Équipe

Développement et modélisation 3D pour la plateforme de gestion énergétique.

---

**Pour plus d'informations, consulter les guides dans le dossier racine.**
