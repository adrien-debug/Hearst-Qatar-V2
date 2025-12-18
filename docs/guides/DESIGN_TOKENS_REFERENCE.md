# 🎨 Guide des Tokens de Design - Hearst Qatar

## Vue d'ensemble

Ce document présente le système de tokens de design unifié pour le projet Hearst Qatar. Les tokens ont été extraits de la page **Overview** et appliqués au **Dashboard** pour créer une cohérence visuelle dans toute l'application.

---

## 🎯 Tokens de Couleur

### Couleurs Primaires

| Token | Valeur | Usage |
|-------|--------|-------|
| `primary.dark` | `#0a0b0d` | Fond sombre principal des cartes KPI |
| `primary.darkText` | `#0b1120` | Texte principal foncé sur fond clair |
| `primary.accent` | `#8AFD81` | **Vert néon** - Accent principal, valeurs importantes |
| `primary.accentHover` | `#6FD96A` | État hover pour les éléments accent |

### Couleurs de Texte

| Token | Valeur | Usage |
|-------|--------|-------|
| `text.primary` | `#0b1120` | Texte principal sur fond clair |
| `text.secondary` | `#64748b` | Texte secondaire, descriptions |
| `text.light` | `white` | Texte sur fond sombre |
| `text.muted` | `white/70` | Texte atténué sur fond sombre |
| `text.dimmed` | `white/60` | Texte très atténué sur fond sombre |

### Couleurs de Fond

| Token | Valeur | Usage |
|-------|--------|-------|
| `background.white` | `white` | Fond principal de page |
| `background.lightGray` | `#f8f9fa` | Fond de cartes secondaires |
| `background.dark` | `#0a0b0d` | Fond de cartes KPI principales |

### Couleurs de Bordure

| Token | Valeur | Usage |
|-------|--------|-------|
| `border.light` | `#e2e8f0` | Bordures sur fond clair |
| `border.subtle` | `white/5` | Bordures subtiles sur fond sombre |
| `border.accentHover` | `#8AFD81/20` | Bordure hover avec accent vert |

---

## 📐 Tokens de Forme

### Radius (Coins arrondis)

| Token | Valeur | Usage |
|-------|--------|-------|
| `radius.standard` | `8px` | Radius standard pour tous les éléments |
| `radius.default` | `rounded-[8px]` | Classe Tailwind équivalente |

### Spacing

| Token | Classe Tailwind | Usage |
|-------|-----------------|-------|
| `spacing.cardPadding` | `p-6` | Padding intérieur des cartes |
| `spacing.containerMax` | `max-w-7xl` | Largeur maximale du conteneur |

---

## 📝 Tokens Typographiques

### Titre Principal

```tsx
{
  size: 'text-3xl',
  weight: 'font-bold',
  color: 'text-[#0b1120]',
  tracking: 'tracking-wide'
}
```

**Exemple :** `QATAR - Strategic Bitcoin Dashboard`

### Label KPI

```tsx
{
  size: 'text-xs',
  weight: 'font-medium',
  color: 'text-white/70',
  transform: 'uppercase',
  tracking: 'tracking-wider'
}
```

**Exemple :** `PUISSANCE TOTALE`, `HASHRATE TOTAL`

### Valeur KPI

```tsx
{
  size: 'text-4xl',
  weight: 'font-bold',
  color: 'text-[#8AFD81]',
  tracking: 'tracking-tight'
}
```

**Exemple :** `100.0`, `1,020`

### Unité KPI

```tsx
{
  size: 'text-lg',
  weight: 'font-medium',
  color: 'text-white/60',
  tracking: 'tracking-wide'
}
```

**Exemple :** `MW`, `PH/s`, `BTC`

### Description

```tsx
{
  size: 'text-sm',
  color: 'text-[#64748b]',
  leading: 'leading-relaxed'
}
```

---

## 🧩 Composants Pré-configurés

### Carte KPI Principale (Fond Sombre)

```tsx
className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-colors"
```

**Caractéristiques :**
- Fond noir profond (`#0a0b0d`)
- Bordure subtile qui s'illumine au hover
- Transition fluide
- Texte en blanc avec valeurs en vert néon

### Carte Secondaire (Fond Clair)

```tsx
className="bg-[#f8f9fa] rounded-[8px] p-6 border border-[#e2e8f0]"
```

**Caractéristiques :**
- Fond gris très clair
- Bordure légère
- Texte en noir/gris foncé

### Bouton Principal

```tsx
className="bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold py-3 px-8 rounded-[8px] transition-colors"
```

**Caractéristiques :**
- Fond vert néon
- Texte noir pour contraste maximum
- Hover plus foncé
- Coins arrondis standard

### Bouton Tab Actif

```tsx
className="bg-[#8AFD81] text-black px-6 py-3 font-semibold text-sm tracking-wide rounded-[8px]"
```

### Bouton Tab Inactif

```tsx
className="bg-white text-[#64748b] hover:text-[#0b1120] border border-[#e2e8f0] px-6 py-3 font-semibold text-sm tracking-wide rounded-[8px]"
```

---

## 📊 Tokens pour Graphiques (Recharts)

### Graphique sur Fond Sombre

```tsx
{
  cartesianGrid: { stroke: "rgba(255,255,255,0.1)" },
  axis: { stroke: "rgba(255,255,255,0.5)" },
  tooltip: {
    backgroundColor: '#0a0b0d',
    border: '1px solid rgba(138, 253, 129, 0.2)',
    color: '#8AFD81',
    borderRadius: '8px'
  },
  mainColor: '#8AFD81'
}
```

### Graphique sur Fond Clair

```tsx
{
  cartesianGrid: { stroke: "#e2e8f0" },
  axis: { stroke: "#64748b" },
  tooltip: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#0b1120',
    borderRadius: '8px'
  },
  mainColor: '#8AFD81'
}
```

### Dégradés pour Aires

```tsx
// Vert néon
<linearGradient id="colorHashrate" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.3}/>
  <stop offset="95%" stopColor="#8AFD81" stopOpacity={0}/>
</linearGradient>

// Barres avec dégradé vertical
<linearGradient id="colorBTC" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.8}/>
  <stop offset="95%" stopColor="#8AFD81" stopOpacity={0.3}/>
</linearGradient>
```

---

## 🎨 Palette de Dégradés Verts

Pour les graphiques avec plusieurs sections :

| Section | Couleur | Usage |
|---------|---------|-------|
| Section 1 | `#8AFD81` | Vert néon principal |
| Section 2 | `#6FD96A` | Vert moyen |
| Section 3 | `#5BC956` | Vert plus foncé |
| Section 4 | `#4AB847` | Vert le plus foncé |

---

## 🔧 Utilisation des Tokens

### Import dans un composant

```tsx
import { colorTokens, formTokens, getCardClasses } from '../config/design-tokens';
```

### Utilisation directe

```tsx
// Obtenir les classes CSS d'une carte complète
const cardClasses = getCardClasses();

// Utiliser les tokens individuellement
<div className={`${formTokens.components.card.background} ${formTokens.components.card.radius}`}>
  <h1 className={`${formTokens.typography.title.size} ${formTokens.typography.title.weight}`}>
    Titre
  </h1>
</div>
```

---

## 📱 Responsive Design

Tous les composants utilisent une grille responsive :

```tsx
// 1 colonne sur mobile, 2 sur tablette, 4 sur desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

// 1 colonne sur mobile, 3 sur desktop
className="grid grid-cols-1 md:grid-cols-3 gap-6"
```

---

## 🎯 Hiérarchie Visuelle

### Niveau 1 : Cartes KPI Principales
- Fond noir (`#0a0b0d`)
- Valeurs en vert néon (`#8AFD81`)
- Bordure hover lumineuse

### Niveau 2 : Cartes Secondaires
- Fond gris clair (`#f8f9fa`)
- Valeurs en vert néon ou noir selon contexte
- Bordure fixe

### Niveau 3 : Métriques Tertiaires
- Fond blanc
- Valeurs en noir
- Accents verts limités

---

## ✅ Checklist d'Application

Lors de la création de nouveaux composants, assurez-vous de :

- [ ] Utiliser `rounded-[8px]` pour tous les coins arrondis
- [ ] Appliquer le vert néon `#8AFD81` pour les valeurs importantes
- [ ] Utiliser le fond noir `#0a0b0d` pour les cartes KPI principales
- [ ] Appliquer `text-white/70` pour les labels sur fond sombre
- [ ] Utiliser `tracking-wider` pour les textes en majuscules
- [ ] Implémenter `transition-colors` pour les états hover
- [ ] Tester les contrastes pour l'accessibilité

---

## 🎨 Philosophie de Design

### Principes clés

1. **Contraste fort** : Le vert néon sur fond noir crée un impact visuel maximum
2. **Hiérarchie claire** : Les valeurs importantes ressortent immédiatement
3. **Modernité** : Le vert néon évoque la technologie et l'énergie
4. **Lisibilité** : Espacements généreux et typographie claire
5. **Cohérence** : Même radius, mêmes espacements partout

### Inspiration

Le design s'inspire de :
- Interfaces de trading crypto modernes
- Tableaux de bord énergétiques
- Design systems tech (GitHub, Vercel)
- Esthétique "high voltage" / haute tension

---

## 📄 Fichiers Modifiés

### Nouveaux fichiers
- `config/design-tokens.ts` - Configuration centralisée des tokens

### Fichiers mis à jour
- `pages/dashboard.tsx` - Application complète des tokens
- `pages/index.tsx` - Page Overview (source des tokens)

---

## 🚀 Prochaines Étapes

Pour étendre ce système de design :

1. Créer des composants réutilisables (`KPICard`, `MetricCard`, etc.)
2. Implémenter un mode sombre/clair complet
3. Ajouter des animations subtiles sur les transitions
4. Créer une bibliothèque de composants Storybook
5. Documenter les patterns d'accessibilité

---

**Dernière mise à jour :** Décembre 2025  
**Auteur :** Équipe Design Hearst Qatar  
**Version :** 1.0











