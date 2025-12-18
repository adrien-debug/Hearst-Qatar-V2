# Guide d'Édition 3D - Murs et Portails

## 🎯 Fonctionnalité

Cette fonctionnalité permet d'ajouter interactivement des **murs** et des **portails** dans la vue 3D de la substation sur `http://localhost:1111/substation-3d-spline`.

## 🚀 Utilisation

### 1. Accéder au mode édition

1. Ouvrez votre navigateur sur `http://localhost:1111/substation-3d-spline`
2. Un panneau d'édition apparaît en bas à droite de l'écran
3. Cliquez sur le panneau pour l'ouvrir/fermer

### 2. Placer un mur

1. Dans le panneau d'édition, cliquez sur le bouton **"🧱 Mur"**
2. Le mode édition est maintenant actif (indicateur bleu)
3. **Cliquez dans la scène 3D** à l'endroit où vous voulez placer le mur
4. Le mur apparaît automatiquement à la position cliquée
5. Le mode édition se désactive automatiquement après le placement

### 3. Placer un portail

1. Dans le panneau d'édition, cliquez sur le bouton **"🚪 Portail"**
2. Le mode édition est maintenant actif (indicateur bleu)
3. **Cliquez dans la scène 3D** à l'endroit où vous voulez placer le portail
4. Le portail apparaît automatiquement à la position cliquée
5. Le mode édition se désactive automatiquement après le placement

### 4. Gérer les objets placés

#### Voir la liste des objets
- Le panneau d'édition affiche automatiquement tous les objets placés
- Vous pouvez voir le nombre de murs et portails
- Chaque objet affiche sa position (x, y, z)

#### Supprimer un objet
- Cliquez sur le bouton **"✕"** à côté de l'objet dans la liste
- L'objet est immédiatement supprimé de la scène et de la liste

#### Supprimer tous les objets
- Cliquez sur **"Tout supprimer"** en haut de la liste
- Confirmez la suppression dans la boîte de dialogue

## 💾 Sauvegarde automatique

- Tous les objets placés sont **automatiquement sauvegardés** dans le navigateur (localStorage)
- Les objets persistent même après avoir fermé et rouvert la page
- Chaque navigateur a sa propre sauvegarde (données locales)

## 🎨 Caractéristiques des objets

### Mur
- **Dimensions**: 10m × 3m × 0.2m
- **Couleur**: Gris clair (#cccccc)
- **Matériau**: Standard avec métallicité et rugosité

### Portail
- **Dimensions**: 3m de largeur × 4m de hauteur
- **Couleur**: Brun (#8b7355)
- **Structure**: Cadre avec 4 piliers (2 latéraux, 1 linteau, 1 seuil)
- **Ouverture**: Centrale pour le passage

## 🔧 Contrôles de la scène

Pendant le mode édition, vous pouvez toujours :
- **Rotation**: Clic gauche + glisser
- **Pan**: Clic droit + glisser
- **Zoom**: Molette de la souris

⚠️ **Note**: En mode édition, un clic simple place un objet. Pour naviguer, utilisez clic + glisser.

## 🐛 Dépannage

### Les objets n'apparaissent pas
1. Vérifiez que la scène Spline est bien chargée
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Vérifiez que le mode édition est bien activé avant de cliquer

### Impossible de placer un objet
1. Assurez-vous d'avoir sélectionné un mode (Mur ou Portail)
2. Cliquez directement dans la zone de la scène 3D (pas sur les panneaux UI)
3. Si le problème persiste, rafraîchissez la page

### Les objets disparaissent après rafraîchissement
- Vérifiez que localStorage est activé dans votre navigateur
- Vérifiez la console pour des erreurs de sauvegarde

## 📝 Notes techniques

- Les objets sont créés avec **Three.js** et ajoutés dynamiquement à la scène Spline
- Le placement utilise un **raycasting** pour déterminer la position dans l'espace 3D
- Les objets sont placés sur le plan Y=0 (sol) par défaut
- Chaque objet a un ID unique pour la gestion et la sauvegarde

## 🎯 Cas d'usage

Cette fonctionnalité est utile pour :
- **Planification**: Visualiser l'emplacement de murs de séparation
- **Sécurité**: Marquer les zones d'accès avec des portails
- **Aménagement**: Tester différentes configurations de l'espace
- **Documentation**: Créer des vues annotées de la substation

## 🔄 Prochaines améliorations possibles

- Rotation des objets après placement
- Redimensionnement interactif
- Différents types de murs (hauteurs, matériaux)
- Portails avec portes animées
- Export des positions en JSON/CSV
- Import de configurations sauvegardées











