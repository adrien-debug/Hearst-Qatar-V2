# Guide d'Utilisation - Excel Configurateur Mining

## Génération du Fichier Excel

Le fichier Excel est généré à partir du JSON source (`mining_configurator_full_v2.json`) via le script Python :

```bash
python3 scripts/generate_excel_configurator.py
```

Le fichier `mining_configurator.xlsx` sera créé à la racine du projet.

## Structure du Fichier Excel

Le fichier Excel contient **5 onglets** :

### 1. SETUP_ADMIN

**Bibliothèques d'équipements et paramètres modifiables**

#### Sections :

- **Bibliothèque Containers** : Liste des containers disponibles avec leurs caractéristiques (puissance, dimensions, CAPEX)
- **Bibliothèque Transformateurs** : Liste des transformateurs disponibles
- **Bibliothèque PowerBlocks** : Liste des PowerBlocks disponibles
- **Bibliothèque Énergie** : Types d'énergie avec OPEX/MWh et besoin de buffer
- **Standards Génie Civil** : Couches de fondation (gravier, sable, béton armé)
- **Règles** : Règles métier (puissance container, limite PowerBlock, etc.)

**Important** : Vous pouvez ajouter/modifier des équipements, changer les coûts, ou ajuster les règles dans cet onglet.

### 2. INPUT_PROJECT

**Paramètres du projet à saisir**

- **Nom projet** : Texte libre
- **Pays** : Texte libre
- **Puissance IT cible (MW)** : Nombre
- **Puissance future (MW)** : Nombre
- **Type d'énergie** : Liste déroulante (grid, generator, solar, wind, flare_gas, biogas)
- **Type mining** : Liste déroulante (air, immersion)
- **Restriction surface** : Liste déroulante (Oui, Non)
- **Surface max (m²)** : Nombre (si restriction = Oui)
- **Phasage chantier** : Tableau extensible avec Phase et Puissance (MW)

**Note** : Toutes les formules des autres onglets se mettent à jour automatiquement lors de la modification de ces valeurs.

### 3. CALCUL_ENGINE

**Calculs automatiques basés sur INPUT_PROJECT**

#### Calculs Quantités :
- **Containers HD5** : `ARRONDI.SUP(puissance_cible / 1.6)`
- **Transformateurs** : `ARRONDI.SUP(puissance_cible / 5)`
- **PowerBlocks** : `SI(puissance < 20 MW; 0; ARRONDI.SUP(puissance / 25))`

#### Calculs CAPEX :
- CAPEX Containers = Quantité × Prix unitaire (depuis SETUP_ADMIN)
- CAPEX Transformateurs = Quantité × Prix unitaire
- CAPEX PowerBlocks = Quantité × Prix unitaire
- CAPEX Génie Civil = Surface totale × 100 USD/m² (à ajuster dans la formule)
- **CAPEX TOTAL** = Somme de tous les CAPEX

#### Calculs OPEX (Annuel) :
- **OPEX Électricité** = Puissance (MW) × 8760 h/an × OPEX/MWh (selon type d'énergie)
- **OPEX Maintenance** = 2% du CAPEX Total (modifiable)
- **OPEX TOTAL** = Somme des OPEX

### 4. LAYOUT

**Génération et édition du layout du site**

#### Informations en haut :
- **Surface totale utilisée (m²)** : Calculée automatiquement
- **Surface limite (m²)** : Récupérée depuis INPUT_PROJECT
- **Alerte dépassement** : Affiche "⚠ DÉPASSEMENT" si la surface dépasse la limite

#### Tableau Layout :

| Colonne | Description | Modifiable |
|---------|-------------|------------|
| ID Élément | Identifiant unique | Non |
| Type | Container / Transformateur / Route / Gazon | Non |
| **X (m)** | Position X | **OUI** |
| **Y (m)** | Position Y | **OUI** |
| **Rotation (°)** | Angle de rotation | **OUI** |
| Phase | Phase du chantier | Non |
| Longueur (m) | Longueur de l'élément | Non |
| Largeur (m) | Largeur de l'élément | Non |
| Alerte | Alertes de chevauchement | Calculé |

**Layout automatique initial** :
- Containers organisés en lignes (max 3 par transformateur)
- Transformateurs placés adjacents aux containers
- Routes autour de chaque container (6m)
- Routes autour de chaque ligne
- Bandes de gazon entre les lignes (6m)
- Espacements : 3m entre containers, 10m entre lignes

**Modification du layout** : Les colonnes X, Y et Rotation sont modifiables en vert. Toute modification recalcule automatiquement la surface totale.

### 5. GRAPHIQUES

**Visualisations des données financières**

#### Graphiques inclus :

1. **Répartition CAPEX** (Camembert)
   - Pourcentage par type d'équipement
   - Données liées à CALCUL_ENGINE

2. **CAPEX vs OPEX Annuel** (Graphique en barres)
   - Comparaison visuelle des coûts

3. **Évolution par Phase** (Tableau)
   - Structure prête pour les données de phasage

## Comment Utiliser

### Étape 1 : Configuration Initiale

1. Ouvrir l'onglet **SETUP_ADMIN**
2. Vérifier/modifier les prix des équipements si nécessaire
3. Ajouter de nouveaux équipements si besoin (en ajoutant des lignes)
4. Vérifier les règles métier

### Étape 2 : Saisie du Projet

1. Ouvrir l'onglet **INPUT_PROJECT**
2. Remplir tous les paramètres :
   - Nom, pays, puissances
   - Sélectionner le type d'énergie
   - Définir les restrictions de surface si applicable
   - Ajouter les phases du chantier

### Étape 3 : Vérification des Calculs

1. Ouvrir l'onglet **CALCUL_ENGINE**
2. Vérifier que les quantités calculées sont correctes
3. Vérifier les CAPEX et OPEX
4. Ajuster les formules si nécessaire (ex: coût génie civil)

### Étape 4 : Ajustement du Layout

1. Ouvrir l'onglet **LAYOUT**
2. Le layout initial est généré automatiquement
3. Modifier les positions (X, Y) si nécessaire
4. Vérifier les alertes de dépassement de surface

### Étape 5 : Analyse des Graphiques

1. Ouvrir l'onglet **GRAPHIQUES**
2. Les graphiques se mettent à jour automatiquement
3. Analyser la répartition des coûts

## Ajouter un Nouvel Équipement

### Dans SETUP_ADMIN :

1. Aller à la section correspondante (Containers, Transformateurs, ou PowerBlocks)
2. Ajouter une nouvelle ligne après les équipements existants
3. Remplir toutes les colonnes :
   - ID unique
   - Nom
   - Puissance (MW)
   - CAPEX (USD)
   - Dimensions (Longueur, Largeur)
   - Fondation

**Important** : Pour que le nouvel équipement soit utilisé dans les calculs, vous devrez modifier les formules dans **CALCUL_ENGINE** pour référencer le nouvel équipement.

## Modifier une Règle

Dans l'onglet **SETUP_ADMIN**, section **Règles**, vous pouvez modifier :
- Puissance container (MW)
- Limite pour PowerBlock (MW)
- Taille PowerBlock (MW)
- Taille transformateur (MW)
- Max containers par transformateur
- Autres règles métier

Les formules dans **CALCUL_ENGINE** utilisent ces valeurs dynamiquement.

## Ajouter un Type d'Énergie

1. Dans **SETUP_ADMIN**, section **Bibliothèque Énergie**
2. Ajouter une nouvelle ligne
3. Remplir :
   - Type (nom unique)
   - Buffer requis (Oui/Non)
   - OPEX (USD/MWh)
4. Le nouveau type apparaîtra automatiquement dans la liste déroulante de **INPUT_PROJECT**

## Notes Importantes

- **Toutes les formules sont liées** : Modifier une valeur dans INPUT_PROJECT recalcule automatiquement CALCUL_ENGINE, LAYOUT et GRAPHIQUES
- **Les références sont dynamiques** : Les formules utilisent des références de cellules qui s'adaptent
- **Le layout est une proposition** : Vous pouvez modifier librement les positions X, Y, Rotation
- **Pas de validation stricte des chevauchements** : Les alertes de chevauchement sont basiques, une vérification manuelle est recommandée
- **Les graphiques nécessitent des données** : Assurez-vous que INPUT_PROJECT est rempli pour voir les graphiques

## Format des Données

- **Puissance** : En MW (Mégawatts)
- **Surface** : En m² (mètres carrés)
- **Longueurs** : En m (mètres)
- **CAPEX/OPEX** : En USD (Dollars américains)
- **OPEX** : Par MWh (Mégawattheure)

## Support Technique

Pour toute question ou problème :
1. Vérifier que le JSON source est valide
2. Vérifier que toutes les formules sont correctes
3. Relancer le script de génération si nécessaire









