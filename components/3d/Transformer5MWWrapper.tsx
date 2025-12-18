/**
 * Wrapper pour Transformateur 5 MW - Compatible avec Gallery3DEnvironment
 * ========================================================================
 * 
 * Ce wrapper garantit que les transformateurs utilisent l'environnement 3D unifié
 * de la galerie (Gallery3DEnvironment) pour une cohérence visuelle parfaite.
 * 
 * ⚠️ IMPORTANT : Ce composant est utilisé dans UnifiedModelCatalog et ne doit
 * PAS inclure Gallery3DEnvironment lui-même (il sera ajouté par ModelCard/ModelViewer3D).
 */

import Transformer5MW from './Transformer5MW';

interface Transformer5MWWrapperProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  id?: string;
  model?: 'variant-1' | 'variant-2';
  isSelected?: boolean;
  transformerId?: string;
  variant?: 'variant-1' | 'variant-2';
  color?: string;
  secondaryColor?: string;
}

/**
 * Wrapper pour Transformateur 5 MW - Variante 1
 * 
 * Utilisé dans la galerie avec Gallery3DEnvironment
 */
export default function Transformer5MWWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  transformerId,
  variant = 'variant-1',
  color = '#E3E4E5',
  secondaryColor = '#4a4a4a',
}: Transformer5MWWrapperProps) {
  // Utiliser transformerId si fourni, sinon id
  const finalId = transformerId || id || 'transformer-5mw-default';

  return (
    <Transformer5MW
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

/**
 * Wrapper pour Transformateur 5 MW - Variante 2 (haute qualité)
 */
export function Transformer5MWWrapperVariant2({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  isSelected = false,
  transformerId,
  color = '#E3E4E5',
  secondaryColor = '#4a4a4a',
}: Omit<Transformer5MWWrapperProps, 'variant'>) {
  return (
    <Transformer5MWWrapper
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={id}
      transformerId={transformerId}
      isSelected={isSelected}
      variant="variant-2"
      color={color}
      secondaryColor={secondaryColor}
    />
  );
}


