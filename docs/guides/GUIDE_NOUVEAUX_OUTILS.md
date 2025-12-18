# Guide des Nouveaux Outils 3D

## Vue d'ensemble

Ce guide présente les nouveaux outils et fonctionnalités ajoutés au système 3D :
- Création de nouveau projet avec formulaire d'initialisation
- Outil de dessin rapide de modules
- Assistant IA pour génération de layouts
- Système de symétrie refait

## 1. Création de Nouveau Projet

### Accès
- Cliquez sur le bouton "Nouveau Projet" en haut à gauche de la page 3D
- Ou accédez directement à `/new-project`

### Formulaire d'initialisation

Le formulaire demande trois informations principales :

#### Type de sol
- **Sable Neutre** : Terrain désertique standard
- **Sable Désertique** : Terrain avec texture sable
- **Béton** : Surface en béton
- **Gravier** : Surface avec gravier
- **Personnalisé** : Configuration personnalisée

#### Type de puissance
- **50MW** : Projet de 50 MW
- **100MW** : Projet de 100 MW
- **200MW** : Projet de 200 MW (défaut)
- **500MW** : Projet de 500 MW
- **Personnalisé** : Valeur personnalisée en MW

#### Type d'énergie
- **Solaire** : Énergie solaire
- **Éolien** : Énergie éolienne
- **Mixte** : Combinaison solaire/éolien (défaut)
- **Personnalisé** : Description personnalisée

### Après création
Le projet est automatiquement créé et vous êtes redirigé vers la vue 3D avec la nouvelle configuration.

## 2. Outil de Dessin de Modules

### Accès
Cliquez sur le bouton "🖊️ Dessin" dans la barre d'outils en haut à droite.

### Modes de dessin

#### Mode Clic
- Cliquez sur le sol pour placer un module individuellement
- Le module est automatiquement aligné sur la grille
- Snapping intelligent vers les modules existants

#### Mode Glisser
- Cliquez et glissez pour dessiner une ligne de modules
- Les modules sont placés automatiquement le long de la ligne
- Espacement automatique selon les dimensions des modules

#### Mode Pattern
- Configurez un pattern (grille, ligne, cercle)
- Paramètres configurables :
  - **Grille** : Nombre de lignes et colonnes
  - **Ligne** : Nombre de modules et angle
  - **Cercle** : Nombre de modules et rayon
- Cliquez sur "Placer le pattern" pour créer tous les modules

### Prévisualisation
- Les modules à placer sont prévisualisés en temps réel
- Les positions invalides (collisions) sont marquées en rouge

## 3. Assistant IA

### Accès
Cliquez sur le bouton "🤖 IA" dans la barre d'outils.

### Fonctionnalités

#### Saisie textuelle
Tapez des commandes en langage naturel :
- `place 10 containers in 2 rows`
- `arrange containers in a grid 4x4`
- `create a line of 5 containers`
- `place containers in a circle with radius 15`

#### Reconnaissance vocale
- Cliquez sur le bouton 🎤 pour activer la reconnaissance vocale
- Parlez votre commande en français
- La commande est automatiquement transcrite et exécutée

#### Layouts prédéfinis
- **Grille 4x4** : 16 modules en grille 4x4
- **Ligne de 10** : 10 modules en ligne
- **Cercle de 8** : 8 modules en cercle
- **2 Rangées** : 10 modules en 2 rangées

#### Suggestions automatiques
L'IA génère automatiquement des suggestions de placement basées sur :
- Optimisation de l'espace
- Règles de sécurité
- Efficacité énergétique
- Contraintes spatiales

### Historique
Toutes les commandes sont enregistrées dans l'historique pour référence rapide.

## 4. Système de Symétrie

### Accès
Cliquez sur le bouton "🔄 Symétrie" dans la barre d'outils.

### Types de symétrie

#### Symétrie Axiale
- Symétrie par rapport à un axe (X, Y, ou Z)
- Sélectionnez l'axe et le centre de symétrie
- Les modules sélectionnés sont dupliqués de l'autre côté de l'axe

#### Symétrie Centrale
- Symétrie par rapport à un point
- Définissez le centre de symétrie
- Chaque module est dupliqué à la position symétrique

#### Symétrie Radiale
- Rotation autour d'un point
- Définissez le centre et le nombre de rotations
- Les modules sont dupliqués en rotation

#### Symétrie Miroir
- Symétrie par rapport à un plan (XY, XZ, ou YZ)
- Sélectionnez le plan de symétrie
- Les modules sont reflétés de l'autre côté du plan

### Détection automatique
Le système détecte automatiquement les symétries existantes dans votre layout et suggère les configurations appropriées.

### Utilisation
1. Sélectionnez les modules à symétriser
2. Choisissez le type de symétrie
3. Configurez les paramètres (axe, centre, plan)
4. Cliquez sur "Appliquer la symétrie"

## 5. Bibliothèque de Modules

### Structure modulaire
Tous les modules sont organisés dans une bibliothèque centralisée :
- `components/3d/modules/containers/` - Containers HD5
- `components/3d/modules/transformers/` - Transformateurs
- `components/3d/modules/generators/` - Générateurs
- `components/3d/modules/infrastructure/` - Routes, sols, etc.

### Composant HD5Container unifié
Le composant HD5Container unifié remplace 8 variantes différentes :
- Support de différents niveaux de détail (minimal, standard, detailed)
- LOD automatique selon la distance
- Support de l'instancing pour performance

### Utilisation
```tsx
import { HD5Container } from '../components/3d/HD5Container';

<HD5Container
  position={[0, 0, 0]}
  containerId="container_1"
  detailLevel="standard"
  useLOD={true}
/>
```

## 6. Contrôleur de Caméra Unifié

### Modes disponibles
- **Standard** : Navigation vers des cibles spécifiques
- **Animated** : Animation automatique en boucle
- **View-mode** : Navigation selon les modes de vue

### Utilisation
```tsx
import UnifiedCameraController from '../components/3d/UnifiedCameraController';

<UnifiedCameraController
  mode="view-mode"
  viewMode={viewMode}
  duration={1500}
/>
```

## Conseils et Astuces

1. **Performance** : Utilisez le niveau de détail "minimal" pour les vues d'ensemble
2. **Précision** : Activez le snapping pour un alignement parfait
3. **Efficacité** : Utilisez les layouts prédéfinis de l'IA pour gagner du temps
4. **Symétrie** : La détection automatique peut vous aider à identifier les patterns existants

## Support

Pour toute question ou problème, consultez la documentation technique dans `/docs`.









