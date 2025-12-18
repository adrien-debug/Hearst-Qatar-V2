// Fichier stub pour HD5Container - remplacé par AntspaceHD5Container
import AntspaceHD5Container from './AntspaceHD5Container';

export const HD5_DIMENSIONS = {
  length: 12.196,
  width: 2.438,
  height: 2.9,
  depth: 2.438, // Alias pour compatibilité
};

export type HD5DetailLevel = 'minimal' | 'standard' | 'detailed';

interface HD5ContainerProps {
  position: [number, number, number];
  containerId: string;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  detailLevel?: HD5DetailLevel;
  useLOD?: boolean;
}

export function HD5Container(props: HD5ContainerProps) {
  return <AntspaceHD5Container {...props} />;
}

interface HD5ContainerInstancedProps {
  instances: Array<{
    id: string;
    position: [number, number, number];
    isSelected?: boolean;
  }>;
  onSelect?: (id: string) => void;
  selectedObject?: string | null;
  detailLevel?: HD5DetailLevel;
}

export function HD5ContainerInstanced(props: HD5ContainerInstancedProps) {
  return (
    <>
      {props.instances.map((instance) => (
        <AntspaceHD5Container
          key={instance.id}
          position={instance.position}
          containerId={instance.id}
          onSelect={props.onSelect}
          isSelected={instance.isSelected || props.selectedObject === instance.id}
        />
      ))}
    </>
  );
}

