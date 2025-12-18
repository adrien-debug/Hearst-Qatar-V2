import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ViewMode } from './ViewModeSelector';

type Props = {
  viewMode: ViewMode;
  duration?: number; // ms
};

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getPreset(viewMode: ViewMode): { position: THREE.Vector3; target: THREE.Vector3 } {
  switch (viewMode) {
    case 'substation':
      return { position: new THREE.Vector3(30, 22, 40), target: new THREE.Vector3(0, 6, 0) };
    case 'powerblock':
      return { position: new THREE.Vector3(40, 18, 30), target: new THREE.Vector3(0, 4, 0) };
    case 'transformer':
      return { position: new THREE.Vector3(18, 10, 18), target: new THREE.Vector3(0, 3, 0) };
    case 'container':
      return { position: new THREE.Vector3(22, 9, 22), target: new THREE.Vector3(0, 2.5, 0) };
    case 'overview':
    default:
      return { position: new THREE.Vector3(0, 85, 150), target: new THREE.Vector3(0, 0, 0) };
  }
}

export default function ViewModeCameraController({ viewMode, duration = 1200 }: Props) {
  const { camera } = useThree();

  const currentTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const animRef = useRef<{
    start: number;
    fromPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toPos: THREE.Vector3;
    toTarget: THREE.Vector3;
    active: boolean;
  } | null>(null);

  useEffect(() => {
    const preset = getPreset(viewMode);
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

    animRef.current = {
      start: now,
      fromPos: camera.position.clone(),
      fromTarget: currentTargetRef.current.clone(),
      toPos: preset.position,
      toTarget: preset.target,
      active: true,
    };
  }, [viewMode, camera]);

  useFrame(() => {
    const anim = animRef.current;
    if (!anim || !anim.active) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const rawT = duration > 0 ? (now - anim.start) / duration : 1;
    const t = Math.max(0, Math.min(1, rawT));
    const k = easeInOutCubic(t);

    const pos = new THREE.Vector3().lerpVectors(anim.fromPos, anim.toPos, k);
    const target = new THREE.Vector3().lerpVectors(anim.fromTarget, anim.toTarget, k);

    camera.position.copy(pos);
    camera.lookAt(target);
    camera.updateProjectionMatrix();

    currentTargetRef.current.copy(target);

    if (t >= 1) {
      anim.active = false;
    }
  });

  return null;
}


