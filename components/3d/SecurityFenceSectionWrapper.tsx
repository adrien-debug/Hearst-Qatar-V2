/**
 * Wrapper pour SecurityFenceSection compatible avec UnifiedModel
 * Adapte l'interface du composant pour la galerie
 */

import React from 'react';
import SecurityFenceSection from './SecurityFenceSection';

interface SecurityFenceSectionWrapperProps {
  position?: [number, number, number];
  isSelected?: boolean;
  fenceId?: string;
  [key: string]: any; // Pour accepter d'autres props
}

/**
 * Wrapper qui adapte SecurityFenceSection pour l'interface UnifiedModel
 * Utilisé dans la galerie avec Gallery3DEnvironment
 */
export default function SecurityFenceSectionWrapper({
  position = [0, 0, 0],
  isSelected = false,
  fenceId = 'security-fence-default',
  ...otherProps
}: SecurityFenceSectionWrapperProps) {
  return (
    <SecurityFenceSection
      position={position}
      isSelected={isSelected}
      fenceId={fenceId}
      length={5.0}
      height={2.5}
    />
  );
}


