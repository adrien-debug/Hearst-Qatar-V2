/**
 * Wrapper pour Barrière Standard - Compatible avec Gallery3DEnvironment
 * =======================================================================
 * 
 * Ce wrapper garantit que les barrières standard utilisent l'environnement 3D unifié
 * de la galerie (Gallery3DEnvironment) pour une cohérence visuelle parfaite.
 * 
 * ⚠️ IMPORTANT : Ce composant est utilisé dans UnifiedModelCatalog et ne doit
 * PAS inclure Gallery3DEnvironment lui-même (il sera ajouté par ModelCard/ModelViewer3D).
 */

import BarriereStandard from './BarriereStandard';

interface BarriereStandardWrapperProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  id?: string;
  isSelected?: boolean;
  barriereId?: string;
  length?: number;
  height?: number;
  numBars?: number;
  color?: string;
}

/**
 * Wrapper pour Barrière Standard
 * 
 * Utilisé dans la galerie avec Gallery3DEnvironment
 */
export default function BarriereStandardWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  barriereId,
  length = 5.0,
  height = 1.2,
  numBars = 2,
  color = '#2c2c2c',
}: BarriereStandardWrapperProps) {
  // Utiliser barriereId si fourni, sinon id
  const finalId = barriereId || id || 'barriere-standard-default';

  return (
    <BarriereStandard
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      length={length}
      height={height}
      numBars={numBars}
      color={color}
    />
  );
}


