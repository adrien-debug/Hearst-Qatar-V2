// Fichier stub pour AnnotationTool3D
// (suffisant pour compiler les pages qui l'importent)

import type { ReactElement } from 'react';

export interface AnnotationPoint {
  id: string;
  position: [number, number, number];
  type: PointType;
  label?: string;
  color?: string;
}

export type PointType = 'reference' | 'landmark' | 'measurement' | 'note' | 'substation' | 'powerblock' | 'transformer' | 'container' | 'switchgear';

export interface AnnotationLine {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  label?: string;
  color?: string;
}

export type AnnotationTool3DProps = {
  points?: AnnotationPoint[];
  lines?: AnnotationLine[];
  enabled?: boolean;
};

export default function AnnotationTool3D(_props: AnnotationTool3DProps): ReactElement | null {
  // Stub no-op: le vrai rendu/interaction peut être ajouté plus tard
  return null;
}

