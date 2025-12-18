/**
 * Contrôles de Transformation 3D
 * Permet de sélectionner, déplacer, tourner et supprimer des équipements
 */

import React, { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TransformControls3DProps {
  selectedObjectId: string | null;
  mode: 'translate' | 'rotate' | 'scale' | null;
  onTransform?: (objectId: string, position: [number, number, number], rotation: [number, number, number]) => void;
  children?: React.ReactNode;
}

export default function TransformControls3D({
  selectedObjectId,
  mode,
  onTransform,
  children,
}: TransformControls3DProps) {
  const transformRef = useRef<any>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (!transformRef.current || !selectedObjectId) return;

    // Trouver l'objet sélectionné dans la scène
    const selectedObject = scene.getObjectByName(selectedObjectId);
    
    if (selectedObject && transformRef.current) {
      transformRef.current.attach(selectedObject);
    }

    return () => {
      if (transformRef.current) {
        transformRef.current.detach();
      }
    };
  }, [selectedObjectId, scene]);

  if (!selectedObjectId || !mode) return <>{children}</>;

  return (
    <>
      <TransformControls
        ref={transformRef}
        mode={mode}
        onMouseUp={() => {
          if (transformRef.current && onTransform) {
            const object = transformRef.current.object;
            if (object) {
              onTransform(
                selectedObjectId,
                [object.position.x, object.position.y, object.position.z],
                [object.rotation.x, object.rotation.y, object.rotation.z]
              );
            }
          }
        }}
      />
      {children}
    </>
  );
}
