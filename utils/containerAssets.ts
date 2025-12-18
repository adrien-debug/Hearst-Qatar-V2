import * as THREE from 'three';

// Singleton state
let assetsInitialized = false;

interface ContainerAssets {
  concreteMap: THREE.CanvasTexture | null;
  metalTex: { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } | null;
  materials: {
    base: THREE.MeshStandardMaterial;
    container: THREE.MeshStandardMaterial;
    rib: THREE.MeshStandardMaterial;
    coolingFrame: THREE.MeshStandardMaterial;
    coolingPanel: THREE.MeshStandardMaterial;
    groove: THREE.MeshStandardMaterial;
    fin: THREE.MeshStandardMaterial;
    fanShroud: THREE.MeshStandardMaterial;
    fanHub: THREE.MeshStandardMaterial;
    fanBlade: THREE.MeshStandardMaterial;
    containerSelected: THREE.MeshStandardMaterial;
  };
  geometries: {
    boxConcrete: THREE.BoxGeometry;
    boxContainer: THREE.BoxGeometry;
    boxFrameV: THREE.BoxGeometry; // Vertical frame parts
    boxFrameH_X: THREE.BoxGeometry; // Horizontal X frame parts
    boxFrameH_Z: THREE.BoxGeometry; // Horizontal Z frame parts
    boxRib: THREE.BoxGeometry;
    boxGroove: THREE.BoxGeometry;
    boxFin: THREE.BoxGeometry;
    fanCylBase: THREE.CylinderGeometry;
    fanCylShroud: THREE.CylinderGeometry;
  };
}

let assets: ContainerAssets | null = null;

// Dimensions constants
export const CONTAINER_DIM = {
  length: 12.196,
  width: 2.438,
  height: 2.896,
  concreteBase: 0.4, // Épaisseur 40cm
} as const;

// Texture generators
function makeConcreteTexture(size: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(0, 0, size, size);

  const img = ctx.getImageData(0, 0, size, size);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() * 40 - 20) | 0;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.needsUpdate = true;
  return tex;
}

function makeMetalTexture(size: number): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#2a2a2a');
  grad.addColorStop(0.5, '#1a1a1a');
  grad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const lineSpacing = 14;
  for (let y = 0; y < size; y += lineSpacing) {
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, y, size, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, y + 2, size, 2);
    ctx.fillStyle = 'rgba(80,80,80,0.12)';
    ctx.fillRect(0, y + 4, size, 6);
  }

  // bruit
  const img = ctx.getImageData(0, 0, size, size);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = Math.random() * 50 - 25;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 3);
  map.needsUpdate = true;

  // normal map simple (stries)
  const normalSize = Math.max(256, Math.floor(size / 2));
  const nCanvas = document.createElement('canvas');
  nCanvas.width = normalSize;
  nCanvas.height = normalSize;
  const nctx = nCanvas.getContext('2d')!;
  for (let y = 0; y < normalSize; y += lineSpacing) {
    const g = nctx.createLinearGradient(0, y, 0, y + lineSpacing);
    g.addColorStop(0, '#8080ff');
    g.addColorStop(0.3, '#8080c0');
    g.addColorStop(0.7, '#808080');
    g.addColorStop(1, '#8080ff');
    nctx.fillStyle = g;
    nctx.fillRect(0, y, normalSize, lineSpacing);
  }
  const normalMap = new THREE.CanvasTexture(nCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(3, 3);
  normalMap.needsUpdate = true;

  return { map, normalMap };
}

export function getContainerAssets(): ContainerAssets {
  if (typeof document === 'undefined') {
    throw new Error('Cannot initialize assets on server side');
  }

  if (assets) return assets;

  // Initialize textures
  const concreteMap = makeConcreteTexture(256);
  const metalTex = makeMetalTexture(512);

  // Initialize Materials
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a, // Gris foncé béton
    roughness: 0.9,
    metalness: 0.1,
    map: concreteMap,
  });

  const containerMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f0f10,
    roughness: 0.4,
    metalness: 0.95,
    envMapIntensity: 1.5,
    map: metalTex.map,
    normalMap: metalTex.normalMap,
    normalScale: new THREE.Vector2(1.2, 1.2),
  });

  const containerSelectedMaterial = containerMaterial.clone();
  containerSelectedMaterial.color.setHex(0x3b82f6);

  const materials = {
    base: baseMaterial,
    container: containerMaterial,
    containerSelected: containerSelectedMaterial,
    rib: new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.3,
      metalness: 0.95,
      envMapIntensity: 2.0,
    }),
    coolingFrame: new THREE.MeshStandardMaterial({
      color: 0x0f0f10,
      roughness: 0.3,
      metalness: 0.9,
    }),
    coolingPanel: new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.4,
      metalness: 0.8,
    }),
    groove: new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.6,
      metalness: 0.9,
    }),
    fin: new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
      roughness: 0.1,
      metalness: 0.98,
      envMapIntensity: 4.0,
      emissive: new THREE.Color(0xf8f8f8),
      emissiveIntensity: 0.12,
    }),
    fanShroud: new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.28,
      metalness: 0.95,
      envMapIntensity: 2.0,
      emissive: new THREE.Color(0x0b0b0c),
      emissiveIntensity: 0.08,
    }),
    fanHub: new THREE.MeshStandardMaterial({
      color: 0x0b0b0c,
      roughness: 0.35,
      metalness: 0.9,
    }),
    fanBlade: new THREE.MeshStandardMaterial({
      color: 0x404247,
      roughness: 0.35,
      metalness: 0.8,
    }),
  };

  // Dimensions for Geometries
  const ribWidth = 0.15;
  const ribDepth = 0.12;
  const grooveWidth = 0.09; // approx from spacing - ribWidth
  const grooveDepth = 0.08;
  const finLength = CONTAINER_DIM.length - 0.2;
  const finThickness = 0.06;
  const finDepth = 0.25;
  const frameThickness = 0.15;
  const coolingHeight = CONTAINER_DIM.height;

  // Initialize Geometries
  const geometries = {
    // Dalle asymétrique : +1m arrière/côtés, +0.4m devant (entrée) -> Total Length + 1.4m
    boxConcrete: new THREE.BoxGeometry(CONTAINER_DIM.length + 1.4, CONTAINER_DIM.concreteBase, CONTAINER_DIM.width + 2.0),
    boxContainer: new THREE.BoxGeometry(CONTAINER_DIM.length, CONTAINER_DIM.height, CONTAINER_DIM.width),
    boxFrameV: new THREE.BoxGeometry(frameThickness, coolingHeight, frameThickness),
    boxFrameH_X: new THREE.BoxGeometry(CONTAINER_DIM.length, frameThickness, frameThickness),
    boxFrameH_Z: new THREE.BoxGeometry(frameThickness, frameThickness, CONTAINER_DIM.width),
    boxRib: new THREE.BoxGeometry(ribWidth, CONTAINER_DIM.height, ribDepth),
    boxGroove: new THREE.BoxGeometry(grooveWidth, CONTAINER_DIM.height - 0.2, grooveDepth),
    boxFin: new THREE.BoxGeometry(finLength, finThickness, finDepth),
    fanCylBase: new THREE.CylinderGeometry(1.35, 1.35, 0.05, 32),
    fanCylShroud: new THREE.CylinderGeometry(1.35, 1.35, 0.3, 32, 1, true),
  };

  assets = {
    concreteMap,
    metalTex,
    materials,
    geometries,
  };

  return assets;
}


