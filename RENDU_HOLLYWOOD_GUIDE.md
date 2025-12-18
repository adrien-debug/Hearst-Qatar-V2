# GUIDE : RENDU "HOLLYWOOD" (QATAR 100MW)

Vous avez demandé "le mieux du mieux". Voici la procédure utilisée par les studios d'architecture professionnels pour transformer votre scène Web en images et vidéos photo-réalistes.

## PRÉ-REQUIS
Ce sont les outils standards de l'industrie (utilisés pour The Mandalorian, Avatar, etc.).
1.  **Unreal Engine 5.3** (Gratuit) - *Le moteur de rendu temps réel ultime.*
2.  **Quixel Bridge** (Gratuit avec Unreal) - *Bibliothèque de textures scannées (Sable, Béton, Métal).*

---

## ÉTAPE 1 : L'EXPORT (Depuis votre App)
1.  Ouvrez votre scène 100MW dans le navigateur.
2.  Cliquez sur le bouton orange **EXPORT BLENDER** (c'est un format universel GLTF).
3.  Vous obtenez un fichier `.glb` (ex: `hearst-qatar-scene-123456.glb`).

---

## ÉTAPE 2 : L'IMPORT DANS UNREAL ENGINE 5
1.  Ouvrez Unreal Engine 5 > **Games** > **Blank Project**.
    *   *Settings* : Blueprint, Desktop, Maximum, Starter Content (OFF), Raytracing (ON).
2.  Allez dans `Edit > Plugins` et activez **GLTF Importer**. Redémarrez si demandé.
3.  Dans le "Content Drawer" (en bas), faites un Glisser-Déposer de votre fichier `.glb`.
4.  Dans la fenêtre d'import qui s'ouvre :
    *   **Import Uniform Scale** : 100 (Unreal est en cm, Three.js en mètres).
    *   Cliquez sur **Import**.
5.  Glissez l'objet importé (l'asset bleu) dans votre scène 3D.

---

## ÉTAPE 3 : LE "VRAI" RENDU (Remplacer les matériaux)
C'est ici que la magie opère. Votre scène est là, mais elle a l'air "jeu vidéo". On va la rendre "réelle".

### A. Le Sol (Sable)
1.  Ouvrez **Quixel Bridge** (dans Unreal : Bouton "+ Add" > Quixel Bridge).
2.  Cherchez "Desert Sand". Trouvez une surface avec des ondulations.
3.  Cliquez sur "Download" puis "Add".
4.  Dans votre scène, sélectionnez le Sol.
5.  Dans le panneau de droite "Details", trouvez "Materials". Vous verrez `Site_Ground_Dark_Sand`.
6.  Glissez votre nouveau matériau Quixel Sand par-dessus.
    *   *Boum : Votre sol est maintenant du vrai sable scanné.*

### B. Les Conteneurs (Métal Peint)
1.  Dans Quixel, cherchez "Painted Steel" (Metal). Prenez un blanc un peu usé.
2.  Dans votre scène, trouvez un conteneur.
3.  Remplacez le matériau `HD5_Body_White_Metal` par le Steel de Quixel.
    *   *Tous vos 300 conteneurs se mettent à jour instantanément.*

---

## ÉTAPE 4 : L'ÉCLAIRAGE "LUMEN"
Unreal Engine 5 utilise "Lumen", une lumière globale automatique.
1.  Allez dans `Window > Env. Light Mixer`.
2.  Créez un **Skylight**, **Atmospheric Light** (Soleil), **Sky Atmosphere**, **Volumetric Cloud**.
3.  Tournez le soleil (Ctrl+L + Souris) pour avoir un coucher de soleil rasant (Golden Hour).
    *   *Lumen va calculer les rebonds de lumière rouge sur le sable et les conteneurs blancs.*

---

## ÉTAPE 5 : VIDÉO CINÉMATIQUE
1.  Créez une **Level Sequence**.
2.  Ajoutez une **CineCameraActor**.
3.  Animez la caméra (Clés d'animation) pour un survol lent des conteneurs.
4.  Cliquez sur l'icône "Clap" (Render Movie).
5.  Choisissez **4K ProRes** (Apple ProRes) pour la qualité maximale.

C'est ainsi que l'on obtient des vidéos "Vraies" impossibles à distinguer de la réalité.
