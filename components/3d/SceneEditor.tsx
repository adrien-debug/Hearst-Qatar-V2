// Fichier stub pour SceneEditor
export type EditMode = 'none' | 'wall' | 'portal';

export interface PlacedObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  metadata?: Record<string, any>;
}



