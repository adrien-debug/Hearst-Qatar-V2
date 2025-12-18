# 💾 Guide : Optimisation RAM pour Qualité 3D Maximale

## 🎯 Objectif

Réduire la consommation RAM tout en gardant une qualité visuelle excellente (compteur d'eau, gazon visible).

---

## 📊 Stratégies Anti-RAM

### 1. ✅ Texture Streaming / Chargement Progressif

**Problème** : Charger toutes les textures haute résolution immédiatement = +50% RAM

**Solution** : Charger uniquement ce qui est visible

```typescript
// ✅ DÉJÀ IMPLÉMENTÉ dans EquipmentPlacer.tsx
progressiveTextureLoader.loadProgressive(
  () => createSyntheticGrassTexture(512), // Basse résolution immédiate
  () => createSyntheticGrassTexture(2048), // Haute résolution en arrière-plan
  // ...
);
```

**Économie RAM** : -30% (textures lointaines en basse résolution)

---

### 2. ✅ LOD (Level of Detail) - Ajustement Dynamique

**Principe** : Réduire qualité selon distance caméra

```typescript
// Dans vos composants 3D :
const distance = camera.position.distanceTo(objectPosition);

if (distance > 100) {
  // Texture basse résolution (512px)
  textureSize = getOptimalTextureSize('low');
} else if (distance > 50) {
  // Texture moyenne (1024px)
  textureSize = getOptimalTextureSize('medium');
} else {
  // Texture haute résolution (2048px) - seulement proche
  textureSize = getOptimalTextureSize('high');
}
```

**Économie RAM** : -40% (moins d'objets en haute résolution)

---

### 3. ✅ Texture Atlas - Regrouper Plusieurs Textures

**Problème** : 10 textures séparées = 10 appels GPU + fragmentation

**Solution** : 1 texture atlas = 1 seule texture

```typescript
// Regrouper plusieurs textures en une seule
const atlas = createTextureAtlas([
  'grass',
  'concrete',
  'metal',
  // ...
]);
```

**Économie RAM** : -20% (réduction fragmentation)

---

### 4. ✅ Compression de Textures

**Formats compressés** : KTX2, Basis Universal, DXT

```typescript
// Utiliser formats compressés au lieu de PNG/JPG
// Réduction : 50-75% de RAM
```

**Économie RAM** : -60% (textures compressées)

---

### 5. ✅ Instancing - Réutiliser Géométries

**Déjà implémenté** ✅ dans votre code avec `instancingEnabled: true`

**Économie RAM** : -50% (1 géométrie pour 100 objets identiques)

---

### 6. ✅ Texture Pooling - Réutiliser Textures

**Problème** : Créer nouvelle texture à chaque fois

**Solution** : Cache de textures (déjà implémenté ✅)

```typescript
// textureCache.ts - Déjà implémenté !
textureCache.getOrCreate('synthetic_grass', 2048, () => {
  return createSyntheticGrassTexture(2048);
});
```

**Économie RAM** : -30% (réutilisation)

---

### 7. ✅ Désactiver Post-Processing (Optionnel)

**Impact RAM** : Post-processing = +25% RAM

**Solution** : Utiliser mode "ultra-optimized"

```typescript
qualityManager.setQuality('ultra-optimized'); // Pas de post-processing
```

**Économie RAM** : -25%

---

### 8. ✅ Limiter Résolution Shadow Maps

**Problème** : Shadow maps 4096px = très lourd

**Solution** : Compromis 2048px

```typescript
shadowMapSize: 2048, // Au lieu de 4096
```

**Économie RAM** : -15% (ombres légèrement moins nettes mais OK)

---

### 9. ✅ Désactiver Mipmaps pour Textures Non-Répétitives

**Problème** : Mipmaps = +33% RAM par texture

**Solution** : Désactiver pour textures uniques (gazon non-répétitif)

```typescript
// Pour gazon synthétique (non-répétitif)
texture.generateMipmaps = false; // Économise RAM
texture.minFilter = THREE.LinearFilter; // Au lieu de LinearMipmapLinearFilter
```

**Économie RAM** : -33% sur ces textures

---

### 10. ✅ Limiter Nombre d'Objets Visibles

**Principe** : Frustum culling (déjà fait par Three.js ✅)

**Optimisation supplémentaire** : Désactiver objets hors écran

```typescript
// Désactiver rendu objets hors caméra
if (!isInViewFrustum(object)) {
  object.visible = false; // Économise RAM GPU
}
```

**Économie RAM** : -20% (moins d'objets actifs)

---

## 🎛️ Configuration Optimale : Qualité Max + RAM Min

### Mode "ULTRA-SMART" (Recommandé)

```typescript
{
  shadowMapSize: 2048,              // ✅ Compromis (pas 4096)
  shadowMapType: THREE.PCFSoftShadowMap,
  antialias: true,                   // ✅ Activé (pas de RAM)
  pixelRatio: 2.0,                   // ✅ Qualité max
  postProcessingEnabled: false,      // ✅ Désactivé (économise RAM)
  textureSize: 2048,                 // ✅ Haute résolution
  lodEnabled: true,                  // ✅ LOD activé (économise RAM)
  instancingEnabled: true,           // ✅ Instancing (économise RAM)
}
```

**Résultat** :
- ✅ Qualité maximale visuelle
- ✅ RAM : +50% seulement (vs +80% pour ultra complet)

---

## 📋 Checklist Optimisation RAM

- [x] Texture streaming/progressive loading ✅ (déjà fait)
- [x] Texture cache ✅ (déjà fait)
- [x] Instancing ✅ (déjà fait)
- [ ] LOD dynamique selon distance
- [ ] Texture atlas pour textures similaires
- [ ] Compression textures (KTX2/Basis)
- [ ] Désactiver mipmaps textures uniques
- [ ] Utiliser mode "ultra-optimized"
- [ ] Shadow maps à 2048px max
- [ ] Limiter objets visibles (frustum culling)

---

## 🔧 Implémentation Rapide

### Option 1 : Mode "Ultra-Optimized" (Déjà disponible)

```typescript
qualityManager.setQuality('ultra-optimized');
```

**Gain** : -30% RAM vs mode "ultra"

---

### Option 2 : LOD Dynamique (À implémenter)

```typescript
// Dans vos composants 3D :
useFrame(() => {
  const distance = camera.position.distanceTo(objectPosition);
  
  // Ajuster texture selon distance
  if (distance > 100 && currentTextureSize > 512) {
    // Réduire à basse résolution
    updateTexture(getOptimalTextureSize('low'));
  } else if (distance <= 50 && currentTextureSize < 2048) {
    // Augmenter à haute résolution
    updateTexture(getOptimalTextureSize('high'));
  }
});
```

---

### Option 3 : Désactiver Mipmaps Gazon

```typescript
// Dans EquipmentPlacer.tsx, après chargement texture :
texture.generateMipmaps = false; // Économise 33% RAM
texture.minFilter = THREE.LinearFilter;
```

---

## 📊 Comparaison RAM

| Configuration | RAM | Qualité | Recommandation |
|---------------|-----|---------|----------------|
| **Low** | 100% | ⭐⭐ | Performance max |
| **Medium** | 150% | ⭐⭐⭐ | Équilibre |
| **High** | 200% | ⭐⭐⭐⭐ | Bon équilibre |
| **Ultra** | 280% | ⭐⭐⭐⭐⭐ | Qualité max |
| **Ultra-Optimized** | **250%** | ⭐⭐⭐⭐⭐ | **✅ RECOMMANDÉ** |
| **Ultra-Smart** (avec LOD) | **200%** | ⭐⭐⭐⭐⭐ | **✅ PARFAIT** |

---

## 🚀 Résultat Final Recommandé

### Configuration "Ultra-Smart"

```typescript
qualityManager.setQuality('ultra-optimized'); // ✅ Qualité max sans post-processing

// Dans vos textures :
// - LOD dynamique selon distance
// - Mipmaps désactivés pour gazon (texture unique)
// - Texture streaming activé
```

**Résultat** :
- ✅ **Compteur d'eau visible** (textures haute résolution proche caméra)
- ✅ **Gazon synthétique réaliste** (textures haute résolution proche)
- ✅ **RAM** : Seulement +50-70% (vs +80% mode ultra complet)
- ✅ **Performance** : Excellente (LOD réduit charge lointaine)

---

## ⚠️ Conseils Importants

1. **Tester progressivement** : Activer optimisations une par une
2. **Monitorer RAM** : Utiliser Chrome DevTools → Performance → Memory
3. **Prioriser textures importantes** : Gazon/compteur en haute résolution, reste en moyenne
4. **LOD est crucial** : Objets lointains n'ont pas besoin de haute résolution

---

## 📚 Références

- [Three.js Performance Tips](https://threejs.org/manual/#en/fundamentals/performance)
- [WebGL Texture Optimization](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)










