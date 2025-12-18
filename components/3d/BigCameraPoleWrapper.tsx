/**
 * Wrapper pour Grand Poteau Caméra (fixe / PTZ)
 */

import BigCameraPole from './BigCameraPole';
import type { BigCameraPoleProps } from './BigCameraPole';

export interface BigCameraPoleWrapperProps extends Omit<BigCameraPoleProps, 'id'> {
  id?: string;
  poleId?: string;
}

export default function BigCameraPoleWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  poleId,
  isSelected = false,
  variant = 'fixed',
  poleHeight = 6.5,
  poleRadius = 0.11,
  baseRadius = 0.28,
  baseHeight = 0.08,
  panSpeed = 0.45,
  pitchAmplitude = 0.22,
  pitchSpeed = 0.7,
}: BigCameraPoleWrapperProps) {
  const finalId = poleId || id || `big-camera-pole-${variant}-default`;

  return (
    <BigCameraPole
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      variant={variant}
      poleHeight={poleHeight}
      poleRadius={poleRadius}
      baseRadius={baseRadius}
      baseHeight={baseHeight}
      panSpeed={panSpeed}
      pitchAmplitude={pitchAmplitude}
      pitchSpeed={pitchSpeed}
    />
  );
}



