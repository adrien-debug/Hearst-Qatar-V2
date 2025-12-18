/**
 * Wrapper pour Power Block 25 MW - Compatible avec Gallery3DEnvironment
 * ======================================================================
 */

import PowerBlock25MW from './PowerBlock25MW';

interface PowerBlock25MWWrapperProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: (elementId: string, event?: React.MouseEvent) => void;
  id?: string;
  isSelected?: boolean;
  powerBlockId?: string;
  color?: string;
  secondaryColor?: string;
  selectedElementId?: string | null;
  selectedElementIds?: string[];
  elementStates?: Record<string, {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  }>;
}

export default function PowerBlock25MWWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  powerBlockId,
  color = '#1a1a1a',
  secondaryColor = '#00A651',
  selectedElementId = null,
  selectedElementIds = [],
  elementStates = {},
}: PowerBlock25MWWrapperProps) {
  const finalId = powerBlockId || id || 'power-block-25mw-default';

  return (
    <PowerBlock25MW
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      color={color}
      secondaryColor={secondaryColor}
      selectedElementId={selectedElementId}
      selectedElementIds={selectedElementIds}
      elementStates={elementStates}
    />
  );
}


