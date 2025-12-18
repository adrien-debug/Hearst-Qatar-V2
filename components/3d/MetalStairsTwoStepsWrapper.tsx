/**
 * Wrapper pour Escalier métallique 2 marches
 * =========================================
 *
 * Aligne l'interface avec les autres assets utilisés par `UnifiedModelCatalog`.
 * Ne doit PAS embarquer d'environnement (Gallery3DEnvironment), il sera ajouté ailleurs.
 */
 
import MetalStairsTwoSteps from './MetalStairsTwoSteps';
import type { MetalStairsTwoStepsProps } from './MetalStairsTwoSteps';
 
export interface MetalStairsTwoStepsWrapperProps extends Omit<MetalStairsTwoStepsProps, 'id'> {
  id?: string;
  stairsId?: string;
}
 
export default function MetalStairsTwoStepsWrapper({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  id,
  stairsId,
  isSelected = false,
  width = 1.6,
  stepDepth = 0.45,
  stepHeight = 0.26,
  frameThickness = 0.035,
  sideColor = '#F59E0B',
  treadColor = '#9CA3AF',
}: MetalStairsTwoStepsWrapperProps) {
  const finalId = stairsId || id || 'metal-stairs-2-steps-default';
 
  return (
    <MetalStairsTwoSteps
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      id={finalId}
      isSelected={isSelected}
      width={width}
      stepDepth={stepDepth}
      stepHeight={stepHeight}
      frameThickness={frameThickness}
      sideColor={sideColor}
      treadColor={treadColor}
    />
  );
}



