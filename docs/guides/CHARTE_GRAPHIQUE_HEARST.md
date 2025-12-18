# 🎨 CHARTE GRAPHIQUE HEARST - COULEURS OFFICIELLES

## 🎯 COULEURS HEARST À APPLIQUER

### Couleur Principale Hearst
**Vert Hearst :** `#8AFD81`

Cette couleur est déjà utilisée, mais je vais m'assurer qu'elle est appliquée **partout de manière cohérente**.

---

## 📊 PALETTE COMPLÈTE

### Couleurs Primaires
```typescript
const HEARST_COLORS = {
  // Couleur signature Hearst
  primary: '#8AFD81',           // Vert Hearst
  primaryDark: '#6FD96A',       // Vert foncé (hover)
  primaryLight: '#A5FE9D',      // Vert clair
  
  // Backgrounds
  bgDark: '#0a0b0d',            // Noir profond
  bgSecondary: '#0b1120',       // Bleu très foncé
  
  // Texte
  text: '#0b1120',              // Texte principal
  textSecondary: '#64748b',     // Texte secondaire
  textLight: '#94a3b8',         // Texte clair
  
  // UI
  border: '#e5e7eb',            // Bordures
  borderDark: '#1f2937',        // Bordures foncées
  white: '#ffffff',             // Blanc
  
  // États
  success: '#8AFD81',           // Succès (vert Hearst)
  warning: '#f59e0b',           // Avertissement
  error: '#ef4444',             // Erreur
  info: '#3b82f6',              // Information
};
```

---

## 🎨 APPLICATION DANS LE SYSTÈME

### Composants à Mettre à Jour

#### 1. **Galerie**
- Bouton "Nouveau Projet" : `bg-[#8AFD81]` ✅
- Border hover cartes : `border-[#8AFD81]` → À vérifier
- Badge "Ultra" : `bg-[#8AFD81]` → À mettre à jour

#### 2. **Pages Modèles**
- Bouton "Retour" : `bg-[#8AFD81]` ✅
- Badge "Ultra" : `bg-[#8AFD81]` ✅

#### 3. **Configurateur**
- Toolbar borders : `border-[#8AFD81]` ✅
- Info panel : `text-[#8AFD81]` ✅
- Bouton "Modèles" : À vérifier

#### 4. **Header**
- Icônes et hover : `text-[#8AFD81]` ✅

#### 5. **Sidebar**
- Item actif : `bg-[#8AFD81]` ✅
- Hover : `text-[#8AFD81]` ✅

---

## 🔍 AUDIT ACTUEL

Je vais scanner tout le code pour trouver les couleurs non-Hearst à remplacer :

### Couleurs à Remplacer
- `#3b82f6` (bleu) → `#8AFD81` (vert Hearst) dans certains contextes
- `#10b981` (emerald) → `#8AFD81` (vert Hearst)
- `from-emerald-500` → `from-[#8AFD81]`
- `border-blue-400` → `border-[#8AFD81]`

### Couleurs à Garder
- Backgrounds sombres (`#0a0b0d`, slate)
- Texte (`#0b1120`, slate)
- Bordures neutres (gray, slate)

---

## 🎯 PLAN D'APPLICATION

### Phase 1 : Galerie
- ModelCard : Border hover
- Badge Ultra : Gradient Hearst
- Boutons : Vert Hearst

### Phase 2 : Pages Modèles
- Viewer 3D : Accents verts
- Sidebar : Sections avec vert Hearst

### Phase 3 : Configurateur
- Toolbar : Vert Hearst
- Info panel : Vert Hearst
- Sélection : Vert Hearst

### Phase 4 : Global
- Header : Vert Hearst
- Sidebar : Vert Hearst
- Footer : Vert Hearst

---

**Voulez-vous que j'applique la charte Hearst partout maintenant ?** 🎨

Je vais remplacer toutes les couleurs bleues/emerald par le **vert Hearst #8AFD81** !

**Dois-je continuer ? 🚀**






