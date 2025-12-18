# 🏗️ ARCHITECTURE 2 SERVEURS - HEARST QATAR

## 📐 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                    HEARST QATAR PLATFORM                        │
│                     Architecture Séparée                        │
└─────────────────────────────────────────────────────────────────┘

         ┌──────────────────┐              ┌──────────────────┐
         │   SERVEUR 1      │              │   SERVEUR 2      │
         │   Port 1111      │◄────────────►│   Port 3333      │
         │                  │   Cross-     │                  │
         │   MAIN           │   Server     │   INFRA 3D       │
         └──────────────────┘   Links      └──────────────────┘
                │                                    │
                │                                    │
                ▼                                    ▼
         ┌──────────────────┐              ┌──────────────────┐
         │  Dashboard       │              │  Galerie 3D      │
         │  Monitoring      │              │  Modèles 3D      │
         │  Configurateur   │              │  Visualisation   │
         └──────────────────┘              └──────────────────┘
```

---

## 🖥️ SERVEUR 1 - MAIN (Port 1111)

### 📍 Localisation
- **Développement:** `http://localhost:1111`
- **Production:** `http://[IP_SERVEUR_1]:1111`

### 📦 Dossier
```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Main/
```

### 🎯 Fonction
**Dashboard Exécutif & Monitoring**

### 📄 Pages
```
├── / (index.tsx)
│   └── Executive Overview
│       ├── Métriques clés
│       ├── Graphiques
│       └── Liens rapides
│
├── /mining-dashboard
│   └── Mining & Reserve Dashboard
│       ├── Hashrate
│       ├── Revenus
│       └── Équipements
│
├── /infrastructure
│   └── Infrastructure Monitoring
│       ├── Électrique
│       ├── Refroidissement
│       └── Réseau
│
└── /configurator
    └── Configurateur 3D
        ├── Placement équipements
        ├── Canvas 3D
        └── Export configuration
```

### 🔗 Liens Sortants
```typescript
// Vers Infrastructure 3D
process.env.NEXT_PUBLIC_GALLERY_URL + '/gallery'
// → http://localhost:3333/gallery
```

### 📊 Caractéristiques
- **Taille:** ~50-100 MB
- **3D:** Léger (configurateur uniquement)
- **Performance:** Ultra-rapide
- **Dépendances:** React, Next.js, Recharts

---

## 🏗️ SERVEUR 2 - INFRASTRUCTURE 3D (Port 3333)

### 📍 Localisation
- **Développement:** `http://localhost:3333`
- **Production:** `http://[IP_SERVEUR_2]:3333`

### 📦 Dossier
```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Infrastructure 3D/
```

### 🎯 Fonction
**Galerie 3D & Visualisation de Modèles**

### 📄 Pages
```
├── / (redirige vers /gallery)
│
├── /gallery
│   └── Galerie de Modèles 3D
│       ├── Filtres (catégorie, qualité)
│       ├── Grille de modèles
│       └── Recherche
│
└── /models/[id]
    └── Page Détaillée Modèle
        ├── Visualiseur 3D interactif
        ├── Spécifications techniques
        ├── Dimensions
        └── Tags
```

### 🎨 Modèles Disponibles
```
├── antspace-hd5
│   └── Container Antspace HD5
│
├── pt-substation-ultra
│   └── Transformateur de Puissance
│
├── dt-renewable-ultra
│   └── Transformateur Distribution
│
└── hydro-cooling-system
    └── Système de Refroidissement
```

### 🔗 Liens Sortants
```typescript
// Vers Main
process.env.NEXT_PUBLIC_MAIN_URL
// → http://localhost:1111

process.env.NEXT_PUBLIC_MAIN_URL + '/configurator'
// → http://localhost:1111/configurator
```

### 📊 Caractéristiques
- **Taille:** ~500 MB - 2 GB (avec modèles 3D)
- **3D:** Lourd (modèles ultra-réalistes)
- **Performance:** Optimisée pour 3D
- **Dépendances:** React, Next.js, Three.js, React Three Fiber

---

## 🔄 COMMUNICATION CROSS-SERVEUR

### Navigation Utilisateur

```
┌─────────────────────────────────────────────────────────────┐
│                    PARCOURS UTILISATEUR                     │
└─────────────────────────────────────────────────────────────┘

1. Utilisateur arrive sur Main
   http://localhost:1111/
   
2. Clique sur "3D Models Gallery"
   → Redirigé vers Infrastructure 3D
   http://localhost:3333/gallery
   
3. Explore les modèles 3D
   Clique sur un modèle
   → http://localhost:3333/models/antspace-hd5
   
4. Clique sur "Nouveau Projet"
   → Redirigé vers Main
   http://localhost:1111/configurator
   
5. Dans le configurateur, clique sur "📦 Galerie"
   → Retour vers Infrastructure 3D
   http://localhost:3333/gallery
```

### Flux de Données

```
┌─────────────┐                           ┌─────────────┐
│   MAIN      │                           │  INFRA 3D   │
│   :1111     │                           │   :3333     │
└──────┬──────┘                           └──────┬──────┘
       │                                         │
       │  1. Utilisateur clique "Galerie"       │
       │────────────────────────────────────────>│
       │                                         │
       │  2. Affiche galerie avec modèles       │
       │<────────────────────────────────────────│
       │                                         │
       │  3. Utilisateur clique "Nouveau Projet"│
       │<────────────────────────────────────────│
       │                                         │
       │  4. Ouvre configurateur                 │
       │                                         │
```

---

## ⚙️ CONFIGURATION

### Variables d'Environnement

**Les deux serveurs partagent la même structure `.env.local` :**

```env
# URLs Cross-Serveur
NEXT_PUBLIC_MAIN_URL=http://localhost:1111
NEXT_PUBLIC_GALLERY_URL=http://localhost:3333

# Supabase (optionnel)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Environnement
NODE_ENV=development
```

### Pour Production

```env
# Remplacer par les IPs réelles
NEXT_PUBLIC_MAIN_URL=http://192.168.1.10:1111
NEXT_PUBLIC_GALLERY_URL=http://192.168.1.20:3333
```

---

## 🚀 DÉPLOIEMENT

### Scénario 1 : Deux Machines Physiques Différentes

```
┌─────────────────────┐         ┌─────────────────────┐
│   Machine 1         │         │   Machine 2         │
│   192.168.1.10      │         │   192.168.1.20      │
│                     │         │                     │
│   ┌─────────────┐   │         │   ┌─────────────┐   │
│   │   Main      │   │         │   │  Infra 3D   │   │
│   │   :1111     │   │◄───────►│   │   :3333     │   │
│   └─────────────┘   │         │   └─────────────┘   │
│                     │         │                     │
│   - Dashboard       │         │   - Galerie 3D      │
│   - Monitoring      │         │   - Modèles 3D      │
│   - Configurateur   │         │   - Visualisation   │
└─────────────────────┘         └─────────────────────┘
```

### Scénario 2 : Même Machine, Ports Différents

```
┌─────────────────────────────────────────┐
│   Machine Unique                        │
│   192.168.1.100                         │
│                                         │
│   ┌─────────────┐   ┌─────────────┐    │
│   │   Main      │   │  Infra 3D   │    │
│   │   :1111     │◄─►│   :3333     │    │
│   └─────────────┘   └─────────────┘    │
│                                         │
│   Deux processus Node.js séparés       │
└─────────────────────────────────────────┘
```

---

## 📊 COMPARAISON DÉTAILLÉE

| Aspect | Serveur Main | Serveur Infrastructure 3D |
|--------|--------------|---------------------------|
| **Port** | 1111 | 3333 |
| **Fonction Principale** | Dashboard & Monitoring | Galerie 3D |
| **Pages** | 4 | 2 + dynamiques |
| **Taille** | 50-100 MB | 500 MB - 2 GB |
| **Modèles 3D** | Non (sauf configurateur) | Oui (lourds) |
| **Performance** | Ultra-rapide | Optimisée 3D |
| **RAM Requise** | ~200 MB | ~500 MB - 1 GB |
| **CPU** | Faible | Moyen-Élevé |
| **Stockage** | Minimal | Important |
| **Indépendance** | ✅ Totale | ✅ Totale |
| **Peut Redémarrer Seul** | ✅ Oui | ✅ Oui |
| **Mise à Jour Séparée** | ✅ Oui | ✅ Oui |

---

## 🔐 SÉCURITÉ

### Firewall

```bash
# Serveur 1 (Main)
sudo ufw allow 1111/tcp
sudo ufw enable

# Serveur 2 (Infrastructure 3D)
sudo ufw allow 3333/tcp
sudo ufw enable
```

### CORS (si domaines différents)

```javascript
// next.config.js (les deux serveurs)
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        ],
      },
    ];
  },
};
```

---

## ✅ AVANTAGES DE CETTE ARCHITECTURE

### 1. Indépendance Totale
```
Serveur Main tombe → Infrastructure 3D continue
Infrastructure 3D tombe → Main continue
```

### 2. Performance Optimale
```
Main : Ultra-rapide (pas de 3D lourd)
Infrastructure 3D : Optimisé pour rendu 3D
```

### 3. Scalabilité
```
Peut ajouter plusieurs serveurs Infrastructure 3D
Load balancing possible
CDN pour assets 3D
```

### 4. Maintenance Facilitée
```
Mettre à jour Main → Pas d'impact sur Infrastructure 3D
Mettre à jour Infrastructure 3D → Pas d'impact sur Main
Redémarrage indépendant
```

### 5. Déploiement Flexible
```
Même machine : Économique
Machines séparées : Performance maximale
Cloud distribué : Haute disponibilité
```

---

## 🎯 CAS D'USAGE

### Développement
```bash
# Terminal 1
cd "Hearst Qatar Main"
npm run dev
# → http://localhost:1111

# Terminal 2
cd "Hearst Qatar Infrastructure 3D"
npm run dev
# → http://localhost:3333
```

### Production - Machines Séparées
```bash
# Machine 1 (192.168.1.10)
cd "Hearst Qatar Main"
pm2 start npm --name "hearst-main" -- start

# Machine 2 (192.168.1.20)
cd "Hearst Qatar Infrastructure 3D"
pm2 start npm --name "hearst-infrastructure-3d" -- start
```

### Production - Même Machine
```bash
# Sur la machine unique
cd "Hearst Qatar Main"
pm2 start npm --name "hearst-main" -- start

cd "../Hearst Qatar Infrastructure 3D"
pm2 start npm --name "hearst-infrastructure-3d" -- start

pm2 list
# Affiche les deux processus
```

---

## 📈 ÉVOLUTION FUTURE

### Possibilités d'Extension

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Main      │     │  Infra 3D   │     │  Infra 3D   │
│   :1111     │────►│   :3333     │     │   :3334     │
└─────────────┘     └─────────────┘     └─────────────┘
                            │                   │
                            └───────┬───────────┘
                                    │
                            Load Balancer
```

### Ajout de Services
```
Main (1111) → API Backend (4000) → Database
Infrastructure 3D (3333) → CDN → S3 Storage
```

---

## 🎉 CONCLUSION

Architecture **COMPLÈTE, INDÉPENDANTE et SCALABLE** !

**Prêt pour :**
- ✅ Développement local
- ✅ Tests
- ✅ Production
- ✅ Scaling
- ✅ Maintenance

---

**Date:** 15 Décembre 2025  
**Version:** 1.0.0  
**Statut:** ✅ Production Ready  
**Architecture:** 2 Serveurs Indépendants






