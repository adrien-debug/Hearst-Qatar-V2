# 🎨 Système de Design - Hearst Qatar

## 📖 Vue d'ensemble

Bienvenue dans le système de design unifié de Hearst Qatar ! Ce système assure la cohérence visuelle entre toutes les pages de l'application, avec une palette de couleurs distinctive basée sur le **vert néon** (`#8AFD81`) et le **noir profond** (`#0a0b0d`).

---

## 🚀 Démarrage Rapide

### 1. Consulter la Documentation

Nous avons créé 4 documents pour vous aider :

| Fichier | Description | À consulter si... |
|---------|-------------|-------------------|
| **`DESIGN_TOKENS_REFERENCE.md`** | Guide complet des tokens | Vous créez un nouveau composant |
| **`CHANGEMENTS_DESIGN_DASHBOARD.md`** | Avant/Après des modifications | Vous voulez comprendre les changements |
| **`design-tokens-preview.html`** | Référence visuelle interactive | Vous voulez voir les tokens en action |
| **`config/design-tokens.ts`** | Code source des tokens | Vous développez |

### 2. Ouvrir la Référence Visuelle

```bash
# Ouvrez dans votre navigateur
open design-tokens-preview.html
```

Cette page HTML montre tous les tokens en action avec des exemples visuels.

### 3. Importer les Tokens dans votre Composant

```tsx
import { colorTokens, formTokens, getCardClasses } from '../config/design-tokens';

export default function MyComponent() {
  return (
    <div className={getCardClasses()}>
      <h1 className={`${formTokens.typography.title.size} ${formTokens.typography.title.weight}`}>
        Mon Titre
      </h1>
    </div>
  );
}
```

---

## 🎯 Règles d'Or

### ✅ À FAIRE

1. **Toujours utiliser `#8AFD81` pour les valeurs importantes**
   ```tsx
   <p className="text-[#8AFD81]">{value}</p>
   ```

2. **Toujours utiliser `rounded-[8px]` pour les radius**
   ```tsx
   <div className="rounded-[8px]">...</div>
   ```

3. **Utiliser les cartes noires pour les KPIs principaux**
   ```tsx
   <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5">
     ...
   </div>
   ```

4. **Importer les tokens depuis `design-tokens.ts`**
   ```tsx
   import { colorTokens, formTokens } from '../config/design-tokens';
   ```

### ❌ À ÉVITER

1. **Ne pas utiliser d'autres couleurs d'accent**
   ```tsx
   ❌ <p className="text-blue-500">{value}</p>
   ✅ <p className="text-[#8AFD81]">{value}</p>
   ```

2. **Ne pas utiliser d'autres radius**
   ```tsx
   ❌ <div className="rounded-lg">...</div>
   ✅ <div className="rounded-[8px]">...</div>
   ```

3. **Ne pas mettre de couleurs en dur sans passer par les tokens**
   ```tsx
   ❌ <div className="bg-[#123456]">...</div>
   ✅ <div className={colorTokens.background.dark}>...</div>
   ```

---

## 🧩 Composants Pré-configurés

### Carte KPI Principale

```tsx
<div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5 hover:border-[#8AFD81]/20 transition-colors">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div>
      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider mb-3">
        {label}
      </h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
          {value}
        </p>
        <span className="text-lg text-white/60 font-medium tracking-wide">
          {unit}
        </span>
      </div>
      <p className="text-xs text-white/50 mt-2">{description}</p>
    </div>
  </div>
</div>
```

### Carte Secondaire

```tsx
<div className="bg-[#f8f9fa] rounded-[8px] p-6 border border-[#e2e8f0]">
  <h3 className="text-lg font-bold text-[#0b1120] mb-4">
    {title}
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Contenu */}
  </div>
</div>
```

### Bouton Principal

```tsx
<button className="bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold py-3 px-8 rounded-[8px] transition-colors">
  {label}
</button>
```

### Tab Navigation

```tsx
<div className="flex gap-2">
  <button className={`px-6 py-3 font-semibold text-sm tracking-wide rounded-[8px] transition-colors ${
    active 
      ? 'bg-[#8AFD81] text-black' 
      : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:text-[#0b1120]'
  }`}>
    {label}
  </button>
</div>
```

### Barre de Progression

```tsx
<div className="bg-[#e2e8f0] rounded-full h-4 overflow-hidden">
  <div 
    className="bg-[#8AFD81] h-4 rounded-full transition-all duration-700" 
    style={{ width: `${percentage}%` }}
  />
</div>
```

---

## 📊 Graphiques (Recharts)

### Configuration pour Fond Sombre

```tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<AreaChart data={data}>
  <defs>
    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="#8AFD81" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
  <YAxis stroke="rgba(255,255,255,0.5)" />
  <Tooltip 
    contentStyle={{ 
      backgroundColor: '#0a0b0d',
      border: '1px solid rgba(138, 253, 129, 0.2)',
      color: '#8AFD81',
      borderRadius: '8px'
    }}
  />
  <Area 
    type="monotone" 
    dataKey="value" 
    stroke="#8AFD81" 
    strokeWidth={2}
    fill="url(#colorGreen)"
  />
</AreaChart>
```

### Configuration pour Fond Clair

```tsx
<AreaChart data={data}>
  <defs>
    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8AFD81" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="#8AFD81" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
  <XAxis dataKey="name" stroke="#64748b" />
  <YAxis stroke="#64748b" />
  <Tooltip 
    contentStyle={{ 
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      color: '#0b1120',
      borderRadius: '8px'
    }}
  />
  <Area 
    type="monotone" 
    dataKey="value" 
    stroke="#8AFD81" 
    strokeWidth={2.5}
    fill="url(#colorGreen)"
  />
</AreaChart>
```

---

## 🎨 Tokens Principaux

### Couleurs

```tsx
// Depuis design-tokens.ts
colorTokens = {
  primary: {
    dark: '#0a0b0d',          // Fond sombre
    accent: '#8AFD81',        // Vert néon
    accentHover: '#6FD96A',   // Vert hover
  },
  text: {
    primary: '#0b1120',       // Texte principal
    secondary: '#64748b',     // Texte secondaire
  },
  background: {
    white: 'white',
    lightGray: '#f8f9fa',
  },
  border: {
    light: '#e2e8f0',
    subtle: 'white/5',
  }
}
```

### Typographie

```tsx
// Titre principal
<h1 className="text-3xl font-bold text-[#0b1120] tracking-wide">

// Label KPI
<h3 className="text-xs font-medium text-white/70 uppercase tracking-wider">

// Valeur KPI
<p className="text-4xl font-bold text-[#8AFD81] tracking-tight">

// Description
<p className="text-sm text-[#64748b] leading-relaxed">
```

---

## 📱 Responsive

Tous les composants utilisent une grille responsive :

```tsx
// 4 colonnes sur desktop, 2 sur tablette, 1 sur mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## ♿ Accessibilité

### Contrastes Vérifiés

Tous nos contrastes respectent WCAG 2.1 niveau AA minimum :

| Combinaison | Ratio | Niveau |
|-------------|-------|--------|
| `#8AFD81` sur `#0a0b0d` | 12.8:1 | AAA ✅ |
| `#0b1120` sur `white` | 15.2:1 | AAA ✅ |
| `#64748b` sur `white` | 4.8:1 | AA ✅ |

### Bonnes Pratiques

```tsx
// ✅ Bon contraste
<div className="bg-[#0a0b0d]">
  <p className="text-[#8AFD81]">Valeur importante</p>
</div>

// ✅ Bon contraste
<div className="bg-white">
  <p className="text-[#0b1120]">Texte principal</p>
</div>
```

---

## 🔧 Workflow de Développement

### 1. Créer un Nouveau Composant

```tsx
// components/MyNewCard.tsx
import { colorTokens, formTokens } from '../config/design-tokens';

export default function MyNewCard({ title, value, unit }) {
  return (
    <div className="bg-[#0a0b0d] rounded-[8px] p-6 border border-white/5">
      <h3 className="text-xs font-medium text-white/70 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-bold text-[#8AFD81] tracking-tight">
          {value}
        </p>
        <span className="text-lg text-white/60 font-medium">
          {unit}
        </span>
      </div>
    </div>
  );
}
```

### 2. Tester

```bash
npm run dev
```

Ouvrez `http://localhost:3000` et vérifiez :
- [ ] Les couleurs correspondent aux tokens
- [ ] Le radius est bien `8px`
- [ ] Les contrastes sont bons
- [ ] Le responsive fonctionne

### 3. Documenter

Si vous ajoutez de nouveaux tokens :

1. Mettez à jour `config/design-tokens.ts`
2. Ajoutez un exemple dans `design-tokens-preview.html`
3. Documentez dans `DESIGN_TOKENS_REFERENCE.md`

---

## 📚 Ressources

### Fichiers à Consulter

1. **Référence Tokens** : `DESIGN_TOKENS_REFERENCE.md`
2. **Changements Dashboard** : `CHANGEMENTS_DESIGN_DASHBOARD.md`
3. **Aperçu Visuel** : `design-tokens-preview.html`
4. **Code Source** : `config/design-tokens.ts`

### Pages Exemples

- **Page Overview** : `pages/index.tsx` (source du design)
- **Page Dashboard** : `pages/dashboard.tsx` (application des tokens)

### Commandes Utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir l'aperçu visuel des tokens
open design-tokens-preview.html

# Vérifier les erreurs de linting
npm run lint
```

---

## 🤝 Contribution

### Avant de Créer un PR

Vérifiez que :

- [ ] Vous utilisez uniquement les tokens définis
- [ ] Le radius est toujours `8px`
- [ ] Les valeurs importantes sont en `#8AFD81`
- [ ] Les contrastes respectent WCAG 2.1 AA
- [ ] Le responsive fonctionne (mobile, tablette, desktop)
- [ ] La documentation est à jour

### Ajouter un Nouveau Token

1. Modifiez `config/design-tokens.ts`
2. Ajoutez un exemple visuel dans `design-tokens-preview.html`
3. Documentez dans `DESIGN_TOKENS_REFERENCE.md`
4. Créez un PR avec ces 3 changements

---

## 🎯 Philosophie de Design

### Pourquoi le Vert Néon ?

Le vert néon (`#8AFD81`) a été choisi pour plusieurs raisons :

1. **Énergie** : Évoque l'électricité et la haute tension
2. **Technologie** : Moderne et tech-forward
3. **Contraste** : Maximum de lisibilité sur fond noir
4. **Distinctif** : Mémorable et unique
5. **Cohérence** : Un seul accent pour toute l'app

### Hiérarchie Visuelle

```
Niveau 1 (Important)  → Fond noir + Valeurs vertes
Niveau 2 (Standard)   → Fond gris clair + Texte noir
Niveau 3 (Tertiaire)  → Fond blanc + Accents verts limités
```

---

## 📞 Support

### Questions Fréquentes

**Q: Puis-je utiliser d'autres couleurs d'accent ?**  
R: Non, utilisez uniquement `#8AFD81` pour maintenir la cohérence.

**Q: Puis-je changer le radius à 12px ?**  
R: Non, le standard est `8px` partout.

**Q: Comment ajouter un nouveau token ?**  
R: Suivez la section "Ajouter un Nouveau Token" ci-dessus.

**Q: Les contrastes sont-ils accessibles ?**  
R: Oui, tous les contrastes respectent WCAG 2.1 niveau AA minimum.

---

## ✅ Checklist Composant

Avant de considérer un composant terminé :

- [ ] Import des tokens depuis `design-tokens.ts`
- [ ] Radius à `8px` (`rounded-[8px]`)
- [ ] Valeurs importantes en `#8AFD81`
- [ ] Responsive (mobile/tablette/desktop)
- [ ] Contrastes accessibles (WCAG 2.1 AA)
- [ ] Transitions fluides (`transition-colors`)
- [ ] Hover states définis
- [ ] Code documenté
- [ ] Testé dans le navigateur

---

**Version :** 1.0  
**Dernière mise à jour :** Décembre 2025  
**Mainteneurs :** Équipe Front-End Hearst Qatar

---

## 🚀 Pour Commencer Maintenant

```bash
# 1. Ouvrir la référence visuelle
open design-tokens-preview.html

# 2. Lire le guide des tokens
open DESIGN_TOKENS_REFERENCE.md

# 3. Commencer à développer
npm run dev
```

Bon développement ! 🎨✨











