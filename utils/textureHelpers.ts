import * as THREE from 'three';

type MaybeCanvasTexture = THREE.CanvasTexture | undefined;

function isSSR(): boolean {
  return typeof document === 'undefined';
}

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function hash2D(ix: number, iy: number, seed: number): number {
  // Hash 32-bit déterministe, renvoie [0..1]
  let h = (ix | 0) * 374761393;
  h = (h + (iy | 0) * 668265263) | 0;
  h = (h ^ (seed | 0)) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177) | 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 0xffffffff;
}

function valueNoise2D(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const xf = x - x0;
  const yf = y - y0;

  const v00 = hash2D(x0, y0, seed);
  const v10 = hash2D(x0 + 1, y0, seed);
  const v01 = hash2D(x0, y0 + 1, seed);
  const v11 = hash2D(x0 + 1, y0 + 1, seed);

  const u = smoothstep(xf);
  const v = smoothstep(yf);
  const i1 = lerp(v00, v10, u);
  const i2 = lerp(v01, v11, u);
  return lerp(i1, i2, v);
}

/**
 * Bruit multi-octave déterministe (0..1).
 * Signature conservée car déjà utilisée dans plusieurs modules.
 */
export function multiOctaveNoise(x: number, y: number, octaves: number = 4, seed: number = 1337): number {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let norm = 0;

  for (let i = 0; i < Math.max(1, octaves); i++) {
    sum += valueNoise2D(x * frequency, y * frequency, seed + i * 1013) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return norm > 0 ? sum / norm : 0.5;
}

function configureColorTexture(tex: THREE.CanvasTexture, repeatX: number, repeatY: number): THREE.CanvasTexture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function configureDataTexture(tex: THREE.CanvasTexture, repeatX: number, repeatY: number): THREE.CanvasTexture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  return { canvas, ctx };
}

function writeNormalMapFromHeight(
  data: Uint8ClampedArray,
  size: number,
  heightAt: (x: number, y: number) => number,
  strength: number
): void {
  // Compute normals via central differences
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const hL = heightAt(x - 1, y);
      const hR = heightAt(x + 1, y);
      const hD = heightAt(x, y - 1);
      const hU = heightAt(x, y + 1);

      const dx = (hR - hL) * strength;
      const dy = (hU - hD) * strength;

      // Normal points opposite gradient
      let nx = -dx;
      let ny = -dy;
      let nz = 1.0;
      const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx *= invLen;
      ny *= invLen;
      nz *= invLen;

      const idx = (y * size + x) * 4;
      data[idx] = clamp255((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = clamp255((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = clamp255((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
}

/**
 * Texture sable compacte (baseColor/albedo) pour le sol.
 */
export function createCompactSandTexture(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const baseA = parseHexColor('#d6c28f'); // sable compact
  const baseB = parseHexColor('#caa874'); // sable plus chaud / ocre
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Variations de teinte (zones plus ocre / plus claires)
      const hueT = multiOctaveNoise(x / 320, y / 320, 4, 110);
      const br = lerp(baseA.r, baseB.r, hueT);
      const bg = lerp(baseA.g, baseB.g, hueT);
      const bb = lerp(baseA.b, baseB.b, hueT);

      // Macro dunes + vent (streaks) + micro grains
      const dunes = Math.sin((x / 150) + multiOctaveNoise(x / 340, y / 340, 3, 100) * 3) * 0.16;
      const wind = Math.sin((x / 45) + multiOctaveNoise(x / 120, y / 120, 2, 111) * 2) * 0.06;
      const grain = (multiOctaveNoise(x / 7, y / 7, 2, 200) - 0.5) * 0.30;
      const stain = (multiOctaveNoise(x / 75, y / 75, 4, 300) - 0.5) * 0.18;

      // Petits cailloux / impuretés déterministes
      const pebble = hash2D(x, y, 112) > 0.9972 ? -0.45 : 0.0;
      const sparkle = hash2D(x, y, 113) > 0.9984 ? 0.28 : 0.0;

      const v = dunes + wind + grain + stain + pebble + sparkle;

      data[idx] = clamp255(br * (1 + v));
      data[idx + 1] = clamp255(bg * (1 + v));
      data[idx + 2] = clamp255(bb * (1 + v));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureColorTexture(new THREE.CanvasTexture(canvas), 6, 6);
}

/**
 * Texture asphalt (baseColor/albedo).
 */
export function createAsphaltTexture(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const base = parseHexColor('#2a2a2a');
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const fine = (multiOctaveNoise(x / 14, y / 14, 5, 10) - 0.5) * 0.35;
      const coarse = (multiOctaveNoise(x / 70, y / 70, 3, 11) - 0.5) * 0.25;

      // agrégats (petits cailloux) déterministes
      const aggregate = hash2D(x, y, 12) > 0.996 ? 0.35 : 0.0;

      const v = fine + coarse + aggregate;
      data[idx] = clamp255(base.r * (1 + v));
      data[idx + 1] = clamp255(base.g * (1 + v));
      data[idx + 2] = clamp255(base.b * (1 + v));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureColorTexture(new THREE.CanvasTexture(canvas), 4, 4);
}

/**
 * Texture béton (baseColor/albedo).
 */
export function createConcreteTexture(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const base = parseHexColor('#9ca3af');
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const speckle = (hash2D(x, y, 21) - 0.5) * 0.18;
      const pores = (multiOctaveNoise(x / 22, y / 22, 4, 22) - 0.5) * 0.25;
      const stain = (multiOctaveNoise(x / 140, y / 140, 3, 23) - 0.5) * 0.10;
      const v = speckle + pores + stain;

      data[idx] = clamp255(base.r * (1 + v));
      data[idx + 1] = clamp255(base.g * (1 + v));
      data[idx + 2] = clamp255(base.b * (1 + v));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureColorTexture(new THREE.CanvasTexture(canvas), 4, 4);
}

/**
 * Texture métal gris (baseColor/albedo) avec brossage.
 */
export function createGrayMetalTexture(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const base = parseHexColor('#6b7280');
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // brossage horizontal + micro-variations
      const brush = Math.sin((x / 6) + (multiOctaveNoise(x / 60, y / 60, 3, 31) * 2)) * 0.06;
      const micro = (multiOctaveNoise(x / 18, y / 18, 4, 32) - 0.5) * 0.10;
      const scratch = hash2D(x, y, 33) > 0.9992 ? -0.25 : 0.0;
      const v = brush + micro + scratch;

      data[idx] = clamp255(base.r * (1 + v));
      data[idx + 1] = clamp255(base.g * (1 + v));
      data[idx + 2] = clamp255(base.b * (1 + v));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureColorTexture(new THREE.CanvasTexture(canvas), 2, 2);
}

/**
 * Texture métal noir (baseColor/albedo) avec brossage.
 */
export function createBlackMetalTexture(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const base = parseHexColor('#1f2937');
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const brush = Math.sin((x / 5) + multiOctaveNoise(x / 70, y / 70, 3, 41) * 2) * 0.05;
      const micro = (multiOctaveNoise(x / 16, y / 16, 4, 42) - 0.5) * 0.12;
      const v = brush + micro;
      data[idx] = clamp255(base.r * (1 + v));
      data[idx + 1] = clamp255(base.g * (1 + v));
      data[idx + 2] = clamp255(base.b * (1 + v));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureColorTexture(new THREE.CanvasTexture(canvas), 2, 2);
}

/**
 * Normal map métal (data texture).
 */
export function createMetalNormalMap(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const heightAt = (x: number, y: number): number => {
    // Stries horizontales + micro défauts
    const nx = (x + size) % size;
    const ny = (y + size) % size;
    const striation = Math.sin(nx / 3.5) * 0.5 + 0.5;
    const micro = multiOctaveNoise(nx / 20, ny / 20, 4, 50);
    return (striation * 0.6 + micro * 0.4);
  };

  writeNormalMapFromHeight(data, size, heightAt, 1.2);
  ctx.putImageData(imageData, 0, 0);
  return configureDataTexture(new THREE.CanvasTexture(canvas), 2, 2);
}

/**
 * Roughness map métal (data texture).
 */
export function createMetalRoughnessMap(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  // métal plutôt lisse, mais avec variations + micro rayures
  const base = 0.28;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const micro = (multiOctaveNoise(x / 24, y / 24, 4, 60) - 0.5) * 0.18;
      const scratch = hash2D(x, y, 61) > 0.999 ? 0.25 : 0.0;
      const r = Math.max(0.02, Math.min(0.98, base + micro + scratch));
      const v = Math.floor(r * 255);
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureDataTexture(new THREE.CanvasTexture(canvas), 2, 2);
}

/**
 * Crée une normal map ULTRA-RÉALISTE pour le sable (dunes + grains)
 */
export function createSandNormalMap(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const heightAt = (x: number, y: number): number => {
    const nx = (x + size) % size;
    const ny = (y + size) % size;

    const dune = Math.sin(nx / 80 + multiOctaveNoise(nx / 240, ny / 240, 3, 70) * 2) * 0.62 + 0.5;
    const grain = multiOctaveNoise(nx / 5.5, ny / 5.5, 2, 71);
    const ripple = (Math.sin(nx / 20) * Math.cos(ny / 16)) * 0.16 + 0.5;
    const microRipples = Math.sin(nx / 8 + multiOctaveNoise(nx / 60, ny / 60, 2, 72) * 6) * 0.06 + 0.5;
    return dune * 0.52 + grain * 0.28 + ripple * 0.12 + microRipples * 0.08;
  };

  // Plus fort pour que le relief soit visible même sur grande surface
  writeNormalMapFromHeight(data, size, heightAt, 3.0);
  ctx.putImageData(imageData, 0, 0);
  return configureDataTexture(new THREE.CanvasTexture(canvas), 4, 4);
}

/**
 * Crée une roughness map pour le sable (mat + quelques grains brillants)
 */
export function createSandRoughnessMap(size: number = 1024): MaybeCanvasTexture {
  if (isSSR()) return undefined;
  const { canvas, ctx } = makeCanvas(size);
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  // Sable = très rugueux mais pas uniforme
  const base = 0.88;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Variations (zones compactées / zones plus friables)
      const variation = (multiOctaveNoise(x / 26, y / 26, 3, 80) - 0.5) * 0.12;
      const compaction = (multiOctaveNoise(x / 120, y / 120, 2, 82) - 0.5) * -0.08; // compacté => un peu plus lisse

      // Sparkles quartz en petits clusters (plus réaliste que du pixel isolé)
      const cluster = multiOctaveNoise(x / 10, y / 10, 1, 83);
      const sparkle = cluster > 0.985 ? -0.45 : 0.0;

      const r = Math.max(0.05, Math.min(0.98, base + variation + compaction + sparkle));
      const v = Math.floor(r * 255);
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return configureDataTexture(new THREE.CanvasTexture(canvas), 4, 4);
}
