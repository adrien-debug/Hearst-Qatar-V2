# 🎨 HEARST QATAR - INSTITUTIONAL DESIGN SYSTEM

## Vue d'ensemble

Ce document définit le système de design institutionnel pour les dashboards Hearst Qatar. L'objectif est de créer une interface **professionnelle, sobre et premium** digne d'une présentation gouvernementale.

---

## 🎯 Principes de Design

### 1. **Professionnalisme**
- Couleurs sobres et élégantes
- Pas de néons criards
- Contraste élevé pour la lisibilité
- Hiérarchie visuelle claire

### 2. **Clarté**
- Information facile à comprendre
- Graphiques intuitifs
- Labels explicites
- Pas de surcharge visuelle

### 3. **Sophistication**
- Ombres subtiles
- Transitions fluides
- Espacements généreux
- Typographie soignée

---

## 🎨 Palette de Couleurs

### Couleurs Primaires (Autorité & Confiance)

```css
Deep Blue:     #1e40af  /* Autorité, confiance institutionnelle */
Blue:          #3b82f6  /* Couleur principale professionnelle */
Navy:          #1e3a8a  /* Profondeur, sérieux */
```

**Utilisation :**
- Éléments principaux (boutons, headers)
- Graphiques de données principales
- Accents institutionnels

### Couleurs Secondaires (Croissance & Succès)

```css
Emerald Green: #059669  /* Croissance, stabilité */
Green:         #10b981  /* Succès, positif */
Dark Green:    #047857  /* Profondeur verte */
```

**Utilisation :**
- Indicateurs de succès
- Métriques positives
- Status "optimal"

### Couleurs d'Accent (Sophistication)

```css
Gold:          #d97706  /* Premium, valeur */
Amber:         #f59e0b  /* Attention, avertissement */
Slate:         #475569  /* Neutre, professionnel */
```

**Utilisation :**
- Warnings (amber)
- Éléments premium (gold)
- Texte secondaire (slate)

### Couleurs de Status

```css
Success:       #059669  /* Emerald - Opérations normales */
Warning:       #d97706  /* Amber - Attention requise */
Error:         #dc2626  /* Red - Problème critique */
Info:          #0284c7  /* Sky Blue - Information */
```

### Échelle de Gris (Professionnelle)

```css
Gray 50:       #f8fafc  /* Background très clair */
Gray 100:      #f1f5f9  /* Background clair */
Gray 200:      #e2e8f0  /* Bordures légères */
Gray 300:      #cbd5e1  /* Bordures moyennes */
Gray 400:      #94a3b8  /* Texte désactivé */
Gray 500:      #64748b  /* Texte secondaire */
Gray 600:      #475569  /* Texte principal */
Gray 700:      #334155  /* Texte foncé */
Gray 800:      #1e293b  /* Background foncé */
Gray 900:      #0f172a  /* Background très foncé */
```

---

## 📊 Couleurs des Graphiques

### Palette Standard pour Charts

```javascript
const chartColors = {
  blue:    '#3b82f6',  // Données principales
  emerald: '#10b981',  // Données secondaires positives
  amber:   '#f59e0b',  // Avertissements
  red:     '#ef4444',  // Critiques
  purple:  '#8b5cf6',  // Données tertiaires
  cyan:    '#06b6d4',  // Données quaternaires
  pink:    '#ec4899',  // Accents
  indigo:  '#6366f1',  // Variations
};
```

### Utilisation par Type de Graphique

#### Line Charts
- Ligne principale: `#3b82f6` (Blue)
- Lignes secondaires: `#10b981`, `#8b5cf6`, `#f59e0b`
- Grille: `#e2e8f0` avec opacity 0.3

#### Area Charts
- Gradient du haut: Color @ 80% opacity
- Gradient du bas: Color @ 10% opacity
- Bordure: Color @ 100%

#### Bar Charts
- Bars positives: `#10b981` (Emerald)
- Bars négatives: `#dc2626` (Red)
- Bars neutres: `#3b82f6` (Blue)

#### Pie Charts
- Utiliser la palette standard dans l'ordre
- Éviter plus de 6 segments
- Labels en `#475569` (Slate 600)

#### Gauges
- 0-50%: `#3b82f6` (Blue) - Excellent
- 50-75%: `#10b981` (Emerald) - Bon
- 75-90%: `#d97706` (Amber) - Attention
- 90-100%: `#dc2626` (Red) - Critique

---

## 🔤 Typographie

### Famille de Polices

```css
Sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif

Monospace: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace
```

### Échelle de Tailles

```css
xs:   0.75rem  (12px)  /* Labels, footnotes */
sm:   0.875rem (14px)  /* Body text secondaire */
base: 1rem     (16px)  /* Body text principal */
lg:   1.125rem (18px)  /* Sous-titres */
xl:   1.25rem  (20px)  /* Titres de cards */
2xl:  1.5rem   (24px)  /* Titres de sections */
3xl:  1.875rem (30px)  /* Valeurs KPI */
4xl:  2.25rem  (36px)  /* Titres de pages */
```

### Poids de Polices

```css
Regular:  400  /* Texte courant */
Medium:   500  /* Labels, sous-titres */
Semibold: 600  /* Titres de cards */
Bold:     700  /* Titres principaux, valeurs KPI */
```

---

## 🎴 Composants

### KPI Cards

```css
Background:     #ffffff
Border:         1px solid #e2e8f0
Border Radius:  0.75rem (12px)
Padding:        1.5rem (24px)
Shadow:         0 1px 2px 0 rgba(0, 0, 0, 0.05)
Hover Shadow:   0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

**Structure :**
- Label: `text-slate-500 text-xs uppercase tracking-wider font-semibold`
- Valeur: `text-3xl font-bold` avec couleur de status
- Trend: Avec icône ↑/↓ et pourcentage
- Sparkline: Mini-graphique 7 derniers jours

### Chart Containers

```css
Background:     #ffffff
Border:         1px solid #e2e8f0
Border Radius:  0.75rem (12px)
Padding:        2rem (32px)
Shadow:         0 1px 2px 0 rgba(0, 0, 0, 0.05)
```

**Header :**
- Titre: `text-xl font-semibold text-slate-900`
- Sous-titre: `text-sm text-slate-500`
- Séparateur: `border-b border-slate-200`

### Boutons

#### Primary
```css
Background:     linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)
Color:          #ffffff
Border:         none
Border Radius:  0.5rem (8px)
Padding:        0.625rem 1.25rem
Font Weight:    500
Shadow:         0 1px 2px 0 rgba(0, 0, 0, 0.05)
Hover:          translateY(-1px) + shadow-md
```

#### Secondary
```css
Background:     #ffffff
Color:          #0f172a
Border:         1px solid #cbd5e1
Border Radius:  0.5rem (8px)
Padding:        0.625rem 1.25rem
Font Weight:    500
Hover:          background #f8fafc, border #3b82f6
```

### Badges

```css
Border Radius:  9999px (full)
Padding:        0.25rem 0.75rem
Font Size:      0.75rem (12px)
Font Weight:    600
Text Transform: uppercase
Letter Spacing: 0.05em
```

**Variantes :**
- Success: `bg-emerald-100 text-emerald-700`
- Warning: `bg-amber-100 text-amber-700`
- Error: `bg-red-100 text-red-700`
- Info: `bg-sky-100 text-sky-700`

---

## 🎭 Ombres & Élévation

```css
sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

**Utilisation :**
- Cards au repos: `shadow-sm`
- Cards hover: `shadow-lg`
- Modals: `shadow-xl`
- Dropdowns: `shadow-lg`

---

## ⚡ Animations & Transitions

### Durées

```css
Fast: 150ms   /* Micro-interactions */
Base: 300ms   /* Transitions standard */
Slow: 500ms   /* Animations complexes */
```

### Easing

```css
ease-in-out   /* Transitions standard */
ease-out      /* Entrées */
ease-in       /* Sorties */
```

### Animations Communes

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hover Cards */
.card:hover {
  transform: translateY(-2px);
  transition: all 300ms ease-in-out;
}

/* Pulse Subtle */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

---

## 📐 Espacements

```css
xs:  0.25rem  (4px)
sm:  0.5rem   (8px)
md:  1rem     (16px)
lg:  1.5rem   (24px)
xl:  2rem     (32px)
2xl: 3rem     (48px)
```

**Utilisation :**
- Entre éléments d'une card: `md` (16px)
- Entre cards: `lg` (24px)
- Entre sections: `xl` (32px)
- Padding de cards: `lg` ou `xl`

---

## 📱 Responsive Design

### Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Grilles Adaptatives

```css
/* Mobile: 1 colonne */
grid-cols-1

/* Tablet: 2 colonnes */
sm:grid-cols-2

/* Desktop: 4 colonnes */
lg:grid-cols-4
```

---

## ✅ Checklist de Conformité

Avant de livrer un dashboard, vérifier :

- [ ] Toutes les couleurs proviennent de la palette institutionnelle
- [ ] Pas de couleurs néon (#8AFD81, #00ff00, etc.)
- [ ] Ombres subtiles (pas de shadow-2xl)
- [ ] Transitions fluides (300ms ease-in-out)
- [ ] Typographie cohérente (Slate pour texte secondaire)
- [ ] Espacements généreux (min 16px entre éléments)
- [ ] Contraste suffisant (WCAG AA minimum)
- [ ] Responsive sur mobile, tablet, desktop
- [ ] Graphiques avec légendes claires
- [ ] Status indicators cohérents (emerald/amber/red)

---

## 🎯 Exemples d'Application

### KPI Card Optimal

```tsx
<div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
  <div className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">
    Daily Production
  </div>
  <div className="text-3xl font-bold text-blue-600 mb-2">
    2.45 BTC
  </div>
  <div className="text-xs text-emerald-600 font-semibold">
    ↑ 8.3% vs yesterday
  </div>
</div>
```

### Chart Container Optimal

```tsx
<div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
  <div className="mb-6 pb-4 border-b border-slate-200">
    <h2 className="text-xl font-semibold text-slate-900">Hashrate Evolution</h2>
    <p className="text-sm text-slate-500 mt-1">Real-time performance by power block</p>
  </div>
  {/* Chart component */}
</div>
```

---

## 📚 Ressources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

**Version:** 1.0  
**Date:** Décembre 2024  
**Auteur:** Hearst Qatar Design Team






