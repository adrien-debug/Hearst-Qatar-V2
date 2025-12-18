/**
 * Wrapper pour Barres de verrouillage arrière (container)
 * =======================================================
 *
 * Ne doit PAS inclure Gallery3DEnvironment (géré ailleurs).
 */

import ContainerDoorLockBars from './ContainerDoorLockBars';
import type { ContainerDoorLockBarsProps } from './ContainerDoorLockBars';

export interface ContainerDoorLockBarsWrapperProps extends Omit<ContainerDoorLockBarsProps, 'id'> {
  id?: string;
  barsId?: string;
}

export default function ContainerDoorLockBarsWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  barsId,
  isSelected = false,
  containerWidth = 2.438,
  doorHeight = 2.6,
  edgeInset = 0.18,
  outwardOffset = 0.06,
  steelColor = '#E5E7EB',
  keeperColor = '#CBD5E1',
}: ContainerDoorLockBarsWrapperProps) {
  const finalId = barsId || id || 'container-door-lock-bars-default';

  return (
    <ContainerDoorLockBars
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      containerWidth={containerWidth}
      doorHeight={doorHeight}
      edgeInset={edgeInset}
      outwardOffset={outwardOffset}
      steelColor={steelColor}
      keeperColor={keeperColor}
    />
  );
}



