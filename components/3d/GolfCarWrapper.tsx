/**
 * Wrapper pour Golf Car - Compatible avec Gallery3DEnvironment
 * ============================================================
 */

import GolfCar from './GolfCar';

interface GolfCarWrapperProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  id?: string;
  isSelected?: boolean;
  golfCarId?: string;
  color?: string;
}

export default function GolfCarWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  golfCarId,
  color = '#00A651',
}: GolfCarWrapperProps) {
  const finalId = golfCarId || id || 'golf-car-default';

  return (
    <GolfCar
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      color={color}
    />
  );
}


