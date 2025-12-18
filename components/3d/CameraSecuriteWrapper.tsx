/**
 * Wrapper pour Caméra de Sécurité - Compatible avec Gallery3DEnvironment
 * =======================================================================
 */

import CameraSecurite from './CameraSecurite';

interface CameraSecuriteWrapperProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  id?: string;
  isSelected?: boolean;
  cameraId?: string;
  color?: string;
  supportHeight?: number;
}

export default function CameraSecuriteWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  cameraId,
  color = '#1a1a1a',
  supportHeight = 2.5,
}: CameraSecuriteWrapperProps) {
  const finalId = cameraId || id || 'camera-securite-default';

  return (
    <CameraSecurite
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      color={color}
      supportHeight={supportHeight}
    />
  );
}


