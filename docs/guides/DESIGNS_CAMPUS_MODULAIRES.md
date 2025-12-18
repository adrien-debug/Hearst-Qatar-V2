# DESIGNS CAMPUS MODULAIRES - BITMAIN HD5
## Shapes d'implantation symétriques (5 MW → 100 MW+)

---

# 1️⃣ SHAPE 5 MW

## Schéma ASCII (vue de dessus)

```
                    N
                    |
                    |
        ┌───────────┴───────────┐
        │                       │
        │    [Grillage Noir]    │
        │                       │
    ┌───┴───────────────────────┴───┐
    │                                │
    │         [Hangar]               │
    │                                │
    │                                │
    │         ╔═══════╗              │
    │         ║  HD5  ║              │
    │         ║  (N)  ║              │
    │         ╚═══════╝              │
    │            │                   │
    │            │                   │
    │     ╔══════┴══════╗           │
    │     ║              ║           │
    │     ║  Transform.  ║           │
    │     ║    5 MW      ║           │
    │     ║              ║           │
    │     ╚══════┬═══════╝           │
    │            │                   │
    │            │                   │
    │    ╔═══════┴═══════╗          │
    │    ║      HD5       ║          │
    │    ║     (SW)       ║          │
    │    ╚═══════╦═══════╝          │
    │            │                   │
    │            │                   │
    │         ╔══╩═══╗               │
    │         ║ HD5  ║               │
    │         ║ (SE) ║               │
    │         ╚══════╝               │
    │                                │
    │    [Portail]                  │
    └────────────────────────────────┘
                    |
                    S

Légende:
- ═══ : Voie technique béton (6m)
- ─── : Chemin piéton béton (1.5m)
- ▓▓▓ : Pad maintenance (3m)
- ╔══╗ : Conteneur HD5 (long côté vers extérieur)
- ║T║ : Transformateur 5 MW
- [H] : Hangar
- [G] : Grillage noir
- [P] : Portail
```

## Description textuelle structurée

### Configuration électrique
- **1 session** = 1 transformateur 5 MW + 3 conteneurs Bitmain HD5
- **Puissance IT totale** : 4.8 MW (3 × 1.6 MW)
- **Distribution LV** : Radiale depuis le transformateur vers les 3 HD5
- **Orientation électrique** : Entrées latérales des conteneurs orientées vers le transformateur central

### Disposition géométrique
- **Symétrie** : Triangle équilatéral parfait (120° entre chaque conteneur)
- **Transformateur** : Position centrale
- **Conteneurs** : 
  - HD5-N (Nord) : face long côté vers le Nord
  - HD5-SW (Sud-Ouest) : face long côté vers le Sud-Ouest
  - HD5-SE (Sud-Est) : face long côté vers le Sud-Est
- **Dégagements aérauliques** : ≥ 4 m libres devant chaque grand côté (vers l'extérieur)

### Infrastructure béton
- **Anneaux piétonniers** : Continu ≥ 1.5 m autour de chaque conteneur
- **Pads maintenance** : ≥ 3 m devant chaque entrée/switchboard de conteneur
- **Voies techniques** : 6 m de largeur pour accès véhicules de maintenance
- **Chemin central** : Axe béton reliant le transformateur aux 3 conteneurs
- **Accès transformateur** : Pad béton ≥ 3 m autour du transformateur

### Sécurité et bâtiments
- **Grillage noir** : Périmètre complet autour du site
- **Portail de sécurité** : Accès principal (position Sud)
- **Hangar** : 1 hangar dans l'enceinte (position Nord-Est)

### Dimensions estimées
- **Diamètre du triangle** : ~40 m (centre transformateur → conteneur)
- **Dégagement périmétrique** : +4 m minimum autour des conteneurs
- **Surface totale** : ~60 m × 60 m (3600 m²)

## JSON structuré

```json
{
  "shape": "5MW",
  "power": {
    "total": 5,
    "it": 4.8,
    "sessions": 1
  },
  "transformers": [
    {
      "id": "T1",
      "power": 5,
      "position": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "containers": ["HD5-N", "HD5-SW", "HD5-SE"]
    }
  ],
  "containers": [
    {
      "id": "HD5-N",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 0,
        "y": 20,
        "z": 0
      },
      "orientation": 0,
      "longSideDirection": "N",
      "electricalInput": "lateral",
      "facingTransformer": "T1"
    },
    {
      "id": "HD5-SW",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -17.32,
        "y": -10,
        "z": 0
      },
      "orientation": 240,
      "longSideDirection": "SW",
      "electricalInput": "lateral",
      "facingTransformer": "T1"
    },
    {
      "id": "HD5-SE",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 17.32,
        "y": -10,
        "z": 0
      },
      "orientation": 120,
      "longSideDirection": "SE",
      "electricalInput": "lateral",
      "facingTransformer": "T1"
    }
  ],
  "electrical": {
    "distribution": {
      "lv": {
        "type": "radial",
        "from": "T1",
        "to": ["HD5-N", "HD5-SW", "HD5-SE"]
      },
      "mv": null
    }
  },
  "civil": {
    "pedestrianRings": [
      {
        "containerId": "HD5-N",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SW",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SE",
        "width": 1.5,
        "continuous": true
      }
    ],
    "maintenancePads": [
      {
        "containerId": "HD5-N",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SW",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SE",
        "width": 3,
        "position": "front"
      },
      {
        "transformerId": "T1",
        "width": 3,
        "position": "around"
      }
    ],
    "technicalRoads": [
      {
        "id": "R1",
        "width": 6,
        "path": "perimeter"
      },
      {
        "id": "R2",
        "width": 6,
        "path": "center_to_containers"
      }
    ],
    "pedestrianPaths": [
      {
        "id": "P1",
        "width": 1.5,
        "path": "transformer_to_HD5-N"
      },
      {
        "id": "P2",
        "width": 1.5,
        "path": "transformer_to_HD5-SW"
      },
      {
        "id": "P3",
        "width": 1.5,
        "path": "transformer_to_HD5-SE"
      }
    ]
  },
  "aerodynamic": {
    "clearances": [
      {
        "containerId": "HD5-N",
        "direction": "N",
        "minimum": 4
      },
      {
        "containerId": "HD5-SW",
        "direction": "SW",
        "minimum": 4
      },
      {
        "containerId": "HD5-SE",
        "direction": "SE",
        "minimum": 4
      }
    ]
  },
  "security": {
    "fence": {
      "type": "black",
      "perimeter": true,
      "dimensions": {
        "length": 60,
        "width": 60
      }
    },
    "gate": {
      "position": "S",
      "type": "security"
    }
  },
  "buildings": {
    "hangars": [
      {
        "id": "H1",
        "position": {
          "x": 25,
          "y": 25,
          "z": 0
        },
        "withinEnclosure": true
      }
    ]
  },
  "extension": {
    "logic": "duplicate_5MW_blocks",
    "nextShape": "10MW"
  }
}
```

---

# 2️⃣ SHAPE 10 MW

## Schéma ASCII (vue de dessus)

```
                    N
                    |
                    |
        ┌───────────┴───────────┐
        │                       │
        │    [Grillage Noir]    │
        │                       │
    ┌───┴───────────────────────┴───┐
    │                                │
    │         [Hangar]               │
    │                                │
    │    ╔═══════╗      ╔═══════╗   │
    │    ║ HD5-N1║      ║ HD5-N2║   │
    │    ╚═══════╝      ╚═══════╝   │
    │         │              │       │
    │         │              │       │
    │    ╔════┴════╗    ╔════┴════╗ │
    │    ║   T1    ║    ║   T2    ║ │
    │    ║  5 MW   ║═══║  5 MW   ║ │
    │    ╚════┬════╝    ╚════┬════╝ │
    │         │              │       │
    │         │              │       │
    │    ╔════┴════╗    ╔════┴════╗ │
    │    ║ HD5-SW1 ║    ║ HD5-SW2 ║ │
    │    ╚═══════╦╝    ╚╦═══════╝ │
    │            │       │         │
    │            │       │         │
    │         ╔══╩═══╗ ╔═╩═══╗     │
    │         ║HD5-SE1║║HD5-SE2║   │
    │         ╚═══════╝╚═══════╝   │
    │                                │
    │    [Portail]                  │
    └────────────────────────────────┘
                    |
                    S

Légende:
- ═══ : Voie technique béton (6m) / Axe central béton
- ─── : Chemin piéton béton (1.5m)
- ▓▓▓ : Pad maintenance (3m)
- ╔══╗ : Conteneur HD5
- ║T║ : Transformateur 5 MW
- [H] : Hangar
- [G] : Grillage noir
- [P] : Portail
- === : Boucle MV entre T1 et T2
```

## Description textuelle structurée

### Configuration électrique
- **2 sessions** = 2 transformateurs 5 MW + 6 conteneurs Bitmain HD5
- **Puissance IT totale** : 9.6 MW (6 × 1.6 MW)
- **Distribution LV** : Radiale depuis chaque transformateur vers ses 3 HD5
- **Distribution MV** : Boucle (ring) entre T1 et T2
- **Orientation électrique** : Entrées latérales des conteneurs orientées vers leur transformateur respectif

### Disposition géométrique
- **Symétrie** : Disposition miroir parfaite par rapport à l'axe central Nord-Sud
- **Session Ouest (T1)** :
  - Transformateur T1 : Position Ouest
  - HD5-N1 (Nord) : face long côté vers le Nord
  - HD5-SW1 (Sud-Ouest) : face long côté vers le Sud-Ouest
  - HD5-SE1 (Sud-Est) : face long côté vers le Sud-Est
- **Session Est (T2)** :
  - Transformateur T2 : Position Est (miroir de T1)
  - HD5-N2 (Nord) : face long côté vers le Nord
  - HD5-SW2 (Sud-Ouest) : face long côté vers le Sud-Ouest
  - HD5-SE2 (Sud-Est) : face long côté vers le Sud-Est
- **Axe central** : Voie béton technique Nord-Sud séparant les deux sessions
- **Dégagements aérauliques** : ≥ 4 m libres devant chaque grand côté (vers l'extérieur)

### Infrastructure béton
- **Anneaux piétonniers** : Continu ≥ 1.5 m autour de chaque conteneur
- **Pads maintenance** : ≥ 3 m devant chaque entrée/switchboard de conteneur
- **Axe central béton** : Voie technique 6 m de largeur (Nord-Sud)
- **Voies techniques** : 6 m de largeur pour accès véhicules de maintenance
- **Chemins piétonniers** : 1.5 m reliant chaque transformateur à ses 3 conteneurs

### Sécurité et bâtiments
- **Grillage noir** : Périmètre complet autour du site
- **Portail de sécurité** : Accès principal (position Sud)
- **Hangar** : 1 hangar dans l'enceinte (position Nord)

### Dimensions estimées
- **Largeur** : ~80 m (2 sessions côte à côte)
- **Longueur** : ~60 m
- **Surface totale** : ~80 m × 60 m (4800 m²)

## JSON structuré

```json
{
  "shape": "10MW",
  "power": {
    "total": 10,
    "it": 9.6,
    "sessions": 2
  },
  "transformers": [
    {
      "id": "T1",
      "power": 5,
      "position": {
        "x": -20,
        "y": 0,
        "z": 0
      },
      "containers": ["HD5-N1", "HD5-SW1", "HD5-SE1"]
    },
    {
      "id": "T2",
      "power": 5,
      "position": {
        "x": 20,
        "y": 0,
        "z": 0
      },
      "containers": ["HD5-N2", "HD5-SW2", "HD5-SE2"]
    }
  ],
  "containers": [
    {
      "id": "HD5-N1",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -20,
        "y": 20,
        "z": 0
      },
      "orientation": 0,
      "longSideDirection": "N",
      "electricalInput": "lateral",
      "facingTransformer": "T1"
    },
    {
      "id": "HD5-SW1",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -37.32,
        "y": -10,
        "z": 0
      },
      "orientation": 240,
      "longSideDirection": "SW",
      "electricalInput": "lateral",
      "facingTransformer": "T1"
    },
    {
      "id": "HD5-SE1",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -2.68,
        "y": -10,
        "z": 0
      },
      "orientation": 120,
      "longSideDirection": "SE",
      "electricalInput": "lateral",
      "facingTransformer": "T1"
    },
    {
      "id": "HD5-N2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 20,
        "y": 20,
        "z": 0
      },
      "orientation": 0,
      "longSideDirection": "N",
      "electricalInput": "lateral",
      "facingTransformer": "T2"
    },
    {
      "id": "HD5-SW2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 2.68,
        "y": -10,
        "z": 0
      },
      "orientation": 240,
      "longSideDirection": "SW",
      "electricalInput": "lateral",
      "facingTransformer": "T2"
    },
    {
      "id": "HD5-SE2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 37.32,
        "y": -10,
        "z": 0
      },
      "orientation": 120,
      "longSideDirection": "SE",
      "electricalInput": "lateral",
      "facingTransformer": "T2"
    }
  ],
  "electrical": {
    "distribution": {
      "lv": {
        "type": "radial",
        "sessions": [
          {
            "transformer": "T1",
            "to": ["HD5-N1", "HD5-SW1", "HD5-SE1"]
          },
          {
            "transformer": "T2",
            "to": ["HD5-N2", "HD5-SW2", "HD5-SE2"]
          }
        ]
      },
      "mv": {
        "type": "ring",
        "transformers": ["T1", "T2"],
        "topology": "loop"
      }
    }
  },
  "civil": {
    "centralAxis": {
      "direction": "N-S",
      "width": 6,
      "type": "technical_road"
    },
    "pedestrianRings": [
      {
        "containerId": "HD5-N1",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SW1",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SE1",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-N2",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SW2",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SE2",
        "width": 1.5,
        "continuous": true
      }
    ],
    "maintenancePads": [
      {
        "containerId": "HD5-N1",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SW1",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SE1",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-N2",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SW2",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SE2",
        "width": 3,
        "position": "front"
      },
      {
        "transformerId": "T1",
        "width": 3,
        "position": "around"
      },
      {
        "transformerId": "T2",
        "width": 3,
        "position": "around"
      }
    ],
    "technicalRoads": [
      {
        "id": "R1",
        "width": 6,
        "path": "perimeter"
      },
      {
        "id": "R2",
        "width": 6,
        "path": "central_axis_N-S"
      }
    ],
    "pedestrianPaths": [
      {
        "id": "P1",
        "width": 1.5,
        "path": "T1_to_containers"
      },
      {
        "id": "P2",
        "width": 1.5,
        "path": "T2_to_containers"
      }
    ]
  },
  "aerodynamic": {
    "clearances": [
      {
        "containerId": "HD5-N1",
        "direction": "N",
        "minimum": 4
      },
      {
        "containerId": "HD5-SW1",
        "direction": "SW",
        "minimum": 4
      },
      {
        "containerId": "HD5-SE1",
        "direction": "SE",
        "minimum": 4
      },
      {
        "containerId": "HD5-N2",
        "direction": "N",
        "minimum": 4
      },
      {
        "containerId": "HD5-SW2",
        "direction": "SW",
        "minimum": 4
      },
      {
        "containerId": "HD5-SE2",
        "direction": "SE",
        "minimum": 4
      }
    ]
  },
  "security": {
    "fence": {
      "type": "black",
      "perimeter": true,
      "dimensions": {
        "length": 80,
        "width": 60
      }
    },
    "gate": {
      "position": "S",
      "type": "security"
    }
  },
  "buildings": {
    "hangars": [
      {
        "id": "H1",
        "position": {
          "x": 0,
          "y": 35,
          "z": 0
        },
        "withinEnclosure": true
      }
    ]
  },
  "extension": {
    "logic": "duplicate_5MW_blocks",
    "nextShape": "25MW"
  }
}
```

---

# 3️⃣ SHAPE 25 MW

## Schéma ASCII (vue de dessus)

```
                    N
                    |
                    |
        ┌───────────┴───────────┐
        │                       │
        │    [Grillage Noir]    │
        │                       │
    ┌───┴───────────────────────┴───┐
    │                                │
    │         [Hangar]               │
    │                                │
    │         ╔═══════╗              │
    │         ║ HD5-N ║              │
    │         ╚═══════╝              │
    │            │                   │
    │    ╔═══════┴═══════╗           │
    │    ║ HD5-NW ║ HD5-NE║          │
    │    ╚═══════╦═══════╝           │
    │            │                   │
    │    ╔═══════┴═══════╗           │
    │    ║   T-N (5MW)    ║           │
    │    ╚═══════┬═══════╝           │
    │            │                   │
    │    ╔═══════╦═══════╗           │
    │    ║ HD5-W ║ HD5-E ║           │
    │    ╚═══════╦═══════╝           │
    │            │                   │
    │    ╔═══════┴═══════╗           │
    │    ║   T-C (5MW)    ║           │
    │    ╚═══════┬═══════╝           │
    │            │                   │
    │    ╔═══════╦═══════╗           │
    │    ║ HD5-SW║ HD5-SE║           │
    │    ╚═══════╦═══════╝           │
    │            │                   │
    │    ╔═══════┴═══════╗           │
    │    ║   T-S (5MW)    ║           │
    │    ╚═══════┬═══════╝           │
    │            │                   │
    │    ╔═══════╦═══════╗           │
    │    ║ HD5-SW2║HD5-SE2║          │
    │    ╚═══════╝╚═══════╝          │
    │                                │
    │    [Portail]                  │
    └────────────────────────────────┘
                    |
                    S

Légende:
- ═══ : Voie technique béton (6m)
- ─── : Chemin piéton béton (1.5m)
- ▓▓▓ : Pad maintenance (3m)
- ╔══╗ : Conteneur HD5
- ║T║ : Transformateur 5 MW
- [H] : Hangar
- [G] : Grillage noir
- [P] : Portail
- === : Boucle MV (T-C ↔ T-N ↔ T-E ↔ T-S ↔ T-W ↔ T-C)
```

## Description textuelle structurée

### Configuration électrique
- **5 sessions** = 5 transformateurs 5 MW + 15 conteneurs Bitmain HD5
- **Puissance IT totale** : 24 MW (15 × 1.6 MW)
- **Distribution LV** : Radiale depuis chaque transformateur vers ses 3 HD5
- **Distribution MV** : Boucle (ring) fermée connectant les 5 transformateurs (T-C ↔ T-N ↔ T-E ↔ T-S ↔ T-W ↔ T-C)
- **Orientation électrique** : Entrées latérales des conteneurs orientées vers leur transformateur respectif

### Disposition géométrique
- **Symétrie** : Croix parfaite (centre + 4 points cardinaux)
- **Session Centre (T-C)** :
  - Transformateur T-C : Position centrale
  - HD5-W (Ouest) : face long côté vers l'Ouest
  - HD5-E (Est) : face long côté vers l'Est
  - HD5-S (Sud) : face long côté vers le Sud
- **Session Nord (T-N)** :
  - Transformateur T-N : Position Nord
  - HD5-N (Nord) : face long côté vers le Nord
  - HD5-NW (Nord-Ouest) : face long côté vers le Nord-Ouest
  - HD5-NE (Nord-Est) : face long côté vers le Nord-Est
- **Session Est (T-E)** :
  - Transformateur T-E : Position Est
  - HD5-E (Est) : face long côté vers l'Est
  - HD5-NE2 (Nord-Est) : face long côté vers le Nord-Est
  - HD5-SE (Sud-Est) : face long côté vers le Sud-Est
- **Session Sud (T-S)** :
  - Transformateur T-S : Position Sud
  - HD5-S (Sud) : face long côté vers le Sud
  - HD5-SW (Sud-Ouest) : face long côté vers le Sud-Ouest
  - HD5-SE2 (Sud-Est) : face long côté vers le Sud-Est
- **Session Ouest (T-W)** :
  - Transformateur T-W : Position Ouest
  - HD5-W (Ouest) : face long côté vers l'Ouest
  - HD5-NW2 (Nord-Ouest) : face long côté vers le Nord-Ouest
  - HD5-SW2 (Sud-Ouest) : face long côté vers le Sud-Ouest
- **Dégagements aérauliques** : ≥ 4 m libres devant chaque grand côté (vers l'extérieur)

### Infrastructure béton
- **Anneaux piétonniers** : Continu ≥ 1.5 m autour de chaque conteneur
- **Pads maintenance** : ≥ 3 m devant chaque entrée/switchboard de conteneur
- **Axes béton** : 
  - Axe Nord-Sud (6 m)
  - Axe Est-Ouest (6 m)
- **Voies techniques** : 6 m de largeur pour accès véhicules de maintenance
- **Chemins piétonniers** : 1.5 m reliant chaque transformateur à ses 3 conteneurs

### Sécurité et bâtiments
- **Grillage noir** : Périmètre complet autour du site
- **Portail de sécurité** : Accès principal (position Sud)
- **Hangar** : 1 hangar dans l'enceinte (position Nord)

### Dimensions estimées
- **Largeur** : ~120 m
- **Longueur** : ~120 m
- **Surface totale** : ~120 m × 120 m (14400 m²)

## JSON structuré

```json
{
  "shape": "25MW",
  "power": {
    "total": 25,
    "it": 24,
    "sessions": 5
  },
  "transformers": [
    {
      "id": "T-C",
      "power": 5,
      "position": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "containers": ["HD5-W", "HD5-E", "HD5-S"]
    },
    {
      "id": "T-N",
      "power": 5,
      "position": {
        "x": 0,
        "y": 40,
        "z": 0
      },
      "containers": ["HD5-N", "HD5-NW", "HD5-NE"]
    },
    {
      "id": "T-E",
      "power": 5,
      "position": {
        "x": 40,
        "y": 0,
        "z": 0
      },
      "containers": ["HD5-E", "HD5-NE2", "HD5-SE"]
    },
    {
      "id": "T-S",
      "power": 5,
      "position": {
        "x": 0,
        "y": -40,
        "z": 0
      },
      "containers": ["HD5-S", "HD5-SW", "HD5-SE2"]
    },
    {
      "id": "T-W",
      "power": 5,
      "position": {
        "x": -40,
        "y": 0,
        "z": 0
      },
      "containers": ["HD5-W", "HD5-NW2", "HD5-SW2"]
    }
  ],
  "containers": [
    {
      "id": "HD5-N",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 0,
        "y": 60,
        "z": 0
      },
      "orientation": 0,
      "longSideDirection": "N",
      "electricalInput": "lateral",
      "facingTransformer": "T-N"
    },
    {
      "id": "HD5-NW",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -17.32,
        "y": 50,
        "z": 0
      },
      "orientation": 300,
      "longSideDirection": "NW",
      "electricalInput": "lateral",
      "facingTransformer": "T-N"
    },
    {
      "id": "HD5-NE",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 17.32,
        "y": 50,
        "z": 0
      },
      "orientation": 60,
      "longSideDirection": "NE",
      "electricalInput": "lateral",
      "facingTransformer": "T-N"
    },
    {
      "id": "HD5-E",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 60,
        "y": 0,
        "z": 0
      },
      "orientation": 90,
      "longSideDirection": "E",
      "electricalInput": "lateral",
      "facingTransformer": "T-E"
    },
    {
      "id": "HD5-NE2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 50,
        "y": 17.32,
        "z": 0
      },
      "orientation": 30,
      "longSideDirection": "NE",
      "electricalInput": "lateral",
      "facingTransformer": "T-E"
    },
    {
      "id": "HD5-SE",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 50,
        "y": -17.32,
        "z": 0
      },
      "orientation": 150,
      "longSideDirection": "SE",
      "electricalInput": "lateral",
      "facingTransformer": "T-E"
    },
    {
      "id": "HD5-S",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 0,
        "y": -60,
        "z": 0
      },
      "orientation": 180,
      "longSideDirection": "S",
      "electricalInput": "lateral",
      "facingTransformer": "T-S"
    },
    {
      "id": "HD5-SW",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -17.32,
        "y": -50,
        "z": 0
      },
      "orientation": 240,
      "longSideDirection": "SW",
      "electricalInput": "lateral",
      "facingTransformer": "T-S"
    },
    {
      "id": "HD5-SE2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 17.32,
        "y": -50,
        "z": 0
      },
      "orientation": 120,
      "longSideDirection": "SE",
      "electricalInput": "lateral",
      "facingTransformer": "T-S"
    },
    {
      "id": "HD5-W",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -60,
        "y": 0,
        "z": 0
      },
      "orientation": 270,
      "longSideDirection": "W",
      "electricalInput": "lateral",
      "facingTransformer": "T-W"
    },
    {
      "id": "HD5-NW2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -50,
        "y": 17.32,
        "z": 0
      },
      "orientation": 330,
      "longSideDirection": "NW",
      "electricalInput": "lateral",
      "facingTransformer": "T-W"
    },
    {
      "id": "HD5-SW2",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -50,
        "y": -17.32,
        "z": 0
      },
      "orientation": 210,
      "longSideDirection": "SW",
      "electricalInput": "lateral",
      "facingTransformer": "T-W"
    },
    {
      "id": "HD5-W-C",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": -20,
        "y": 0,
        "z": 0
      },
      "orientation": 270,
      "longSideDirection": "W",
      "electricalInput": "lateral",
      "facingTransformer": "T-C"
    },
    {
      "id": "HD5-E-C",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 20,
        "y": 0,
        "z": 0
      },
      "orientation": 90,
      "longSideDirection": "E",
      "electricalInput": "lateral",
      "facingTransformer": "T-C"
    },
    {
      "id": "HD5-S-C",
      "type": "Bitmain HD5",
      "power": 1.6,
      "position": {
        "x": 0,
        "y": -20,
        "z": 0
      },
      "orientation": 180,
      "longSideDirection": "S",
      "electricalInput": "lateral",
      "facingTransformer": "T-C"
    }
  ],
  "electrical": {
    "distribution": {
      "lv": {
        "type": "radial",
        "sessions": [
          {
            "transformer": "T-C",
            "to": ["HD5-W-C", "HD5-E-C", "HD5-S-C"]
          },
          {
            "transformer": "T-N",
            "to": ["HD5-N", "HD5-NW", "HD5-NE"]
          },
          {
            "transformer": "T-E",
            "to": ["HD5-E", "HD5-NE2", "HD5-SE"]
          },
          {
            "transformer": "T-S",
            "to": ["HD5-S", "HD5-SW", "HD5-SE2"]
          },
          {
            "transformer": "T-W",
            "to": ["HD5-W", "HD5-NW2", "HD5-SW2"]
          }
        ]
      },
      "mv": {
        "type": "ring",
        "transformers": ["T-C", "T-N", "T-E", "T-S", "T-W"],
        "topology": "loop",
        "path": "T-C ↔ T-N ↔ T-E ↔ T-S ↔ T-W ↔ T-C"
      }
    }
  },
  "civil": {
    "axes": [
      {
        "id": "A1",
        "direction": "N-S",
        "width": 6,
        "type": "technical_road"
      },
      {
        "id": "A2",
        "direction": "E-W",
        "width": 6,
        "type": "technical_road"
      }
    ],
    "pedestrianRings": [
      {
        "containerId": "HD5-N",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-NW",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-NE",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-E",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-NE2",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SE",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-S",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SW",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SE2",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-W",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-NW2",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-SW2",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-W-C",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-E-C",
        "width": 1.5,
        "continuous": true
      },
      {
        "containerId": "HD5-S-C",
        "width": 1.5,
        "continuous": true
      }
    ],
    "maintenancePads": [
      {
        "containerId": "HD5-N",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-NW",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-NE",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-E",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-NE2",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SE",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-S",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SW",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SE2",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-W",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-NW2",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-SW2",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-W-C",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-E-C",
        "width": 3,
        "position": "front"
      },
      {
        "containerId": "HD5-S-C",
        "width": 3,
        "position": "front"
      },
      {
        "transformerId": "T-C",
        "width": 3,
        "position": "around"
      },
      {
        "transformerId": "T-N",
        "width": 3,
        "position": "around"
      },
      {
        "transformerId": "T-E",
        "width": 3,
        "position": "around"
      },
      {
        "transformerId": "T-S",
        "width": 3,
        "position": "around"
      },
      {
        "transformerId": "T-W",
        "width": 3,
        "position": "around"
      }
    ],
    "technicalRoads": [
      {
        "id": "R1",
        "width": 6,
        "path": "perimeter"
      },
      {
        "id": "R2",
        "width": 6,
        "path": "axis_N-S"
      },
      {
        "id": "R3",
        "width": 6,
        "path": "axis_E-W"
      }
    ],
    "pedestrianPaths": [
      {
        "id": "P1",
        "width": 1.5,
        "path": "T-C_to_containers"
      },
      {
        "id": "P2",
        "width": 1.5,
        "path": "T-N_to_containers"
      },
      {
        "id": "P3",
        "width": 1.5,
        "path": "T-E_to_containers"
      },
      {
        "id": "P4",
        "width": 1.5,
        "path": "T-S_to_containers"
      },
      {
        "id": "P5",
        "width": 1.5,
        "path": "T-W_to_containers"
      }
    ]
  },
  "aerodynamic": {
    "clearances": [
      {
        "containerId": "HD5-N",
        "direction": "N",
        "minimum": 4
      },
      {
        "containerId": "HD5-NW",
        "direction": "NW",
        "minimum": 4
      },
      {
        "containerId": "HD5-NE",
        "direction": "NE",
        "minimum": 4
      },
      {
        "containerId": "HD5-E",
        "direction": "E",
        "minimum": 4
      },
      {
        "containerId": "HD5-NE2",
        "direction": "NE",
        "minimum": 4
      },
      {
        "containerId": "HD5-SE",
        "direction": "SE",
        "minimum": 4
      },
      {
        "containerId": "HD5-S",
        "direction": "S",
        "minimum": 4
      },
      {
        "containerId": "HD5-SW",
        "direction": "SW",
        "minimum": 4
      },
      {
        "containerId": "HD5-SE2",
        "direction": "SE",
        "minimum": 4
      },
      {
        "containerId": "HD5-W",
        "direction": "W",
        "minimum": 4
      },
      {
        "containerId": "HD5-NW2",
        "direction": "NW",
        "minimum": 4
      },
      {
        "containerId": "HD5-SW2",
        "direction": "SW",
        "minimum": 4
      },
      {
        "containerId": "HD5-W-C",
        "direction": "W",
        "minimum": 4
      },
      {
        "containerId": "HD5-E-C",
        "direction": "E",
        "minimum": 4
      },
      {
        "containerId": "HD5-S-C",
        "direction": "S",
        "minimum": 4
      }
    ]
  },
  "security": {
    "fence": {
      "type": "black",
      "perimeter": true,
      "dimensions": {
        "length": 120,
        "width": 120
      }
    },
    "gate": {
      "position": "S",
      "type": "security"
    }
  },
  "buildings": {
    "hangars": [
      {
        "id": "H1",
        "position": {
          "x": 0,
          "y": 70,
          "z": 0
        },
        "withinEnclosure": true
      }
    ]
  },
  "extension": {
    "logic": "duplicate_25MW_blocks",
    "nextShape": "100MW",
    "blocks": 1
  }
}
```

---

# 4️⃣ SHAPE 100 MW

## Schéma ASCII (vue de dessus)

```
                    N
                    |
                    |
    ┌───────────────┴───────────────┐
    │                               │
    │      [Grillage Noir]          │
    │                               │
┌───┴───────────────────────────────┴───┐
│                                       │
│  [Hangar G]      [Hangar D]          │
│                                       │
│  ┌───────────┐   ┌───────────┐      │
│  │           │   │           │      │
│  │  Bloc 25MW│   │  Bloc 25MW│      │
│  │  NW       │   │  NE       │      │
│  │           │   │           │      │
│  │  (Croix)  │   │  (Croix)  │      │
│  │           │   │           │      │
│  └───────────┘   └───────────┘      │
│       │               │             │
│       │               │             │
│  ┌────┴───────────────┴────┐        │
│  │   Axe Béton E-W         │        │
│  └────┬───────────────┬────┘        │
│       │               │             │
│  ┌───────────┐   ┌───────────┐      │
│  │           │   │           │      │
│  │  Bloc 25MW│   │  Bloc 25MW│      │
│  │  SW       │   │  SE       │      │
│  │           │   │           │      │
│  │  (Croix)  │   │  (Croix)  │      │
│  │           │   │           │      │
│  └───────────┘   └───────────┘      │
│                                       │
│    [Portail]                         │
└───────────────────────────────────────┘
                    |
                    S

Légende:
- ═══ : Voie technique béton (6m)
- ─── : Chemin piéton béton (1.5m)
- ▓▓▓ : Pad maintenance (3m)
- ╔══╗ : Conteneur HD5
- ║T║ : Transformateur 5 MW
- [H-G] : Hangar Gauche
- [H-D] : Hangar Droite
- [G] : Grillage noir
- [P] : Portail
- === : Boucles MV hiérarchisées (intra-bloc + inter-blocs)
```

## Description textuelle structurée

### Configuration électrique
- **20 sessions** = 20 transformateurs 5 MW + 60 conteneurs Bitmain HD5
- **Puissance IT totale** : 96 MW (60 × 1.6 MW)
- **Architecture modulaire** : 4 blocs de 25 MW en grille 2×2 parfaitement symétrique
- **Distribution LV** : Radiale depuis chaque transformateur vers ses 3 HD5 (au sein de chaque bloc)
- **Distribution MV** : 
  - **Intra-bloc** : Boucle MV fermée dans chaque bloc 25 MW (5 transformateurs)
  - **Inter-blocs** : Boucle MV principale connectant les 4 blocs (20 transformateurs)
- **Orientation électrique** : Entrées latérales des conteneurs orientées vers leur transformateur respectif

### Disposition géométrique
- **Symétrie globale** : Grille 2×2 parfaitement symétrique
- **Bloc Nord-Ouest (25 MW)** :
  - Structure identique au shape 25 MW
  - Position : Quadrant Nord-Ouest
  - 5 transformateurs + 15 conteneurs HD5
- **Bloc Nord-Est (25 MW)** :
  - Structure identique au shape 25 MW (miroir)
  - Position : Quadrant Nord-Est
  - 5 transformateurs + 15 conteneurs HD5
- **Bloc Sud-Ouest (25 MW)** :
  - Structure identique au shape 25 MW
  - Position : Quadrant Sud-Ouest
  - 5 transformateurs + 15 conteneurs HD5
- **Bloc Sud-Est (25 MW)** :
  - Structure identique au shape 25 MW (miroir)
  - Position : Quadrant Sud-Est
  - 5 transformateurs + 15 conteneurs HD5
- **Dégagements aérauliques** : ≥ 4 m libres devant chaque grand côté (vers l'extérieur)

### Infrastructure béton
- **Anneaux piétonniers** : Continu ≥ 1.5 m autour de chaque conteneur (dans chaque bloc)
- **Pads maintenance** : ≥ 3 m devant chaque entrée/switchboard de conteneur
- **Axes béton principaux** : 
  - Axe Nord-Sud central (6 m)
  - Axe Est-Ouest central (6 m)
- **Axes béton secondaires** : Axes Nord-Sud et Est-Ouest dans chaque bloc 25 MW
- **Voies techniques** : 6 m de largeur pour accès véhicules de maintenance
- **Chemins piétonniers** : 1.5 m dans chaque bloc

### Sécurité et bâtiments
- **Grillage noir** : Périmètre complet autour du site (englobant les 4 blocs)
- **Portail de sécurité** : Accès principal (position Sud)
- **Hangars** : 2 hangars parfaitement symétriques
  - Hangar Gauche (Ouest) : Position Ouest
  - Hangar Droite (Est) : Position Est

### Dimensions estimées
- **Largeur** : ~250 m (2 blocs × 120 m + espacement)
- **Longueur** : ~250 m (2 blocs × 120 m + espacement)
- **Surface totale** : ~250 m × 250 m (62500 m²)

### Logique d'extension
- **125 MW** : 5 blocs 25 MW (grille 2×3 ou 3×2)
- **150 MW** : 6 blocs 25 MW (grille 2×3 ou 3×2)
- **200 MW** : 8 blocs 25 MW (grille 2×4 ou 4×2)
- **250 MW** : 10 blocs 25 MW (grille 2×5 ou 5×2)
- **Toujours** : Conservation de la symétrie, axes béton, boucles MV hiérarchisées

## JSON structuré

```json
{
  "shape": "100MW",
  "power": {
    "total": 100,
    "it": 96,
    "sessions": 20,
    "blocks": 4
  },
  "blocks": [
    {
      "id": "B-NW",
      "power": 25,
      "position": {
        "x": -65,
        "y": 65,
        "z": 0
      },
      "type": "25MW_cross",
      "transformers": ["T-NW-C", "T-NW-N", "T-NW-E", "T-NW-S", "T-NW-W"],
      "containers": 15
    },
    {
      "id": "B-NE",
      "power": 25,
      "position": {
        "x": 65,
        "y": 65,
        "z": 0
      },
      "type": "25MW_cross",
      "transformers": ["T-NE-C", "T-NE-N", "T-NE-E", "T-NE-S", "T-NE-W"],
      "containers": 15
    },
    {
      "id": "B-SW",
      "power": 25,
      "position": {
        "x": -65,
        "y": -65,
        "z": 0
      },
      "type": "25MW_cross",
      "transformers": ["T-SW-C", "T-SW-N", "T-SW-E", "T-SW-S", "T-SW-W"],
      "containers": 15
    },
    {
      "id": "B-SE",
      "power": 25,
      "position": {
        "x": 65,
        "y": -65,
        "z": 0
      },
      "type": "25MW_cross",
      "transformers": ["T-SE-C", "T-SE-N", "T-SE-E", "T-SE-S", "T-SE-W"],
      "containers": 15
    }
  ],
  "electrical": {
    "distribution": {
      "lv": {
        "type": "radial",
        "scope": "intra_block",
        "description": "Chaque transformateur alimente radialement ses 3 HD5 au sein de son bloc"
      },
      "mv": {
        "intra_block": {
          "type": "ring",
          "description": "Boucle MV fermée dans chaque bloc 25 MW (5 transformateurs)"
        },
        "inter_blocks": {
          "type": "hierarchical_ring",
          "description": "Boucle MV principale connectant les 4 blocs (20 transformateurs)",
          "topology": "B-NW ↔ B-NE ↔ B-SE ↔ B-SW ↔ B-NW"
        }
      }
    }
  },
  "civil": {
    "mainAxes": [
      {
        "id": "A1",
        "direction": "N-S",
        "width": 6,
        "type": "technical_road",
        "position": "central"
      },
      {
        "id": "A2",
        "direction": "E-W",
        "width": 6,
        "type": "technical_road",
        "position": "central"
      }
    ],
    "secondaryAxes": {
      "description": "Chaque bloc 25 MW possède ses propres axes N-S et E-W (6m)"
    },
    "pedestrianRings": {
      "description": "Continu ≥ 1.5 m autour de chaque conteneur (60 conteneurs au total)"
    },
    "maintenancePads": {
      "description": "≥ 3 m devant chaque entrée/switchboard (60 conteneurs + 20 transformateurs)"
    },
    "technicalRoads": [
      {
        "id": "R1",
        "width": 6,
        "path": "perimeter"
      },
      {
        "id": "R2",
        "width": 6,
        "path": "main_axis_N-S"
      },
      {
        "id": "R3",
        "width": 6,
        "path": "main_axis_E-W"
      },
      {
        "id": "R4",
        "width": 6,
        "path": "inter_block_connections"
      }
    ]
  },
  "aerodynamic": {
    "clearances": {
      "description": "≥ 4 m libres devant chaque grand côté de conteneur (vers l'extérieur)",
      "totalContainers": 60
    }
  },
  "security": {
    "fence": {
      "type": "black",
      "perimeter": true,
      "dimensions": {
        "length": 250,
        "width": 250
      },
      "description": "Grillage noir périmétrique englobant les 4 blocs"
    },
    "gate": {
      "position": "S",
      "type": "security"
    }
  },
  "buildings": {
    "hangars": [
      {
        "id": "H-G",
        "position": {
          "x": -130,
          "y": 0,
          "z": 0
        },
        "side": "left",
        "withinEnclosure": true
      },
      {
        "id": "H-D",
        "position": {
          "x": 130,
          "y": 0,
          "z": 0
        },
        "side": "right",
        "withinEnclosure": true
      }
    ],
    "symmetry": "perfect_mirror"
  },
  "extension": {
    "logic": "duplicate_25MW_blocks",
    "baseBlock": "25MW_cross",
    "scalability": {
      "125MW": {
        "blocks": 5,
        "grid": "2x3_or_3x2",
        "description": "Ajout d'un 5ème bloc 25 MW"
      },
      "150MW": {
        "blocks": 6,
        "grid": "2x3_or_3x2",
        "description": "Ajout d'un 6ème bloc 25 MW"
      },
      "200MW": {
        "blocks": 8,
        "grid": "2x4_or_4x2",
        "description": "Ajout de 4 blocs 25 MW supplémentaires"
      },
      "250MW": {
        "blocks": 10,
        "grid": "2x5_or_5x2",
        "description": "Ajout de 6 blocs 25 MW supplémentaires"
      }
    },
    "constraints": [
      "Conservation stricte de la symétrie",
      "Axes béton N-S / E-O",
      "Boucles MV hiérarchisées (intra-bloc + inter-blocs)",
      "2 hangars symétriques (gauche/droite)",
      "Grillage noir périmétrique",
      "Dégagements aérauliques ≥ 4m"
    ]
  }
}
```

---

# RÉSUMÉ DES RÈGLES TECHNIQUES APPLIQUÉES

## Électricité
- ✅ 1 session = 1 transformateur 5 MW + 3 conteneurs HD5 (1.6 MW chacun)
- ✅ Distribution LV radiale du transformateur vers ses 3 conteneurs
- ✅ Distribution MV en boucle (ring) dès qu'il y a plus d'une session
- ✅ Entrées électriques latérales des conteneurs orientées vers le transformateur

## Aéraulique
- ✅ Grands côtés des conteneurs orientés vers l'extérieur
- ✅ Dégagement minimal ≥ 4 m libres devant chaque grand côté
- ✅ Aucun obstacle dans les zones de dégagement

## Génie Civil
- ✅ Anneaux béton piéton continu ≥ 1.5 m autour de chaque conteneur
- ✅ Pads maintenance béton ≥ 3 m devant chaque entrée/switchboard
- ✅ Voies techniques béton ≈ 6 m pour véhicules de maintenance
- ✅ Chemins piétonniers béton continus (1.5 m)

## Sécurité & Bâtiments
- ✅ Grillage noir périmétrique complet
- ✅ Portail de sécurité
- ✅ Hangars : 1 hangar (5-25 MW) / 2 hangars symétriques (>25 MW)

## Modularité & Extension
- ✅ Shapes 5 MW, 10 MW, 25 MW : blocs de base
- ✅ Shapes >25 MW : duplication de blocs 25 MW
- ✅ Symétrie parfaite prioritaire
- ✅ Scalabilité garantie (125 MW, 150 MW, 200 MW, 250 MW...)

---

*Document généré selon les spécifications techniques du prompt officiel*








