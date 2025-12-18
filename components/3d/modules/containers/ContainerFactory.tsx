import { HD5Container, HD5ContainerInstanced, HD5DetailLevel } from '../../HD5Container';

export type ContainerType = 'HD5';

interface ContainerConfig {
  type: ContainerType;
  detailLevel?: HD5DetailLevel;
  useLOD?: boolean;
}

/**
 * Factory pour créer différents types de containers
 */
export class ContainerFactory {
  static createContainer(
    type: ContainerType,
    props: {
      position: [number, number, number];
      containerId: string;
      onSelect?: (id: string) => void;
      isSelected?: boolean;
      config?: ContainerConfig;
    }
  ) {
    switch (type) {
      case 'HD5':
        return (
          <HD5Container
            position={props.position}
            containerId={props.containerId}
            onSelect={props.onSelect}
            isSelected={props.isSelected}
            detailLevel={props.config?.detailLevel || 'standard'}
            useLOD={props.config?.useLOD !== false}
          />
        );
      default:
        throw new Error(`Type de container non supporté: ${type}`);
    }
  }

  static createInstancedContainers(
    type: ContainerType,
    props: {
      instances: Array<{
        id: string;
        position: [number, number, number];
        isSelected?: boolean;
      }>;
      onSelect?: (id: string) => void;
      selectedObject?: string | null;
      config?: ContainerConfig;
    }
  ) {
    switch (type) {
      case 'HD5':
        return (
          <HD5ContainerInstanced
            instances={props.instances}
            onSelect={props.onSelect}
            selectedObject={props.selectedObject}
            detailLevel={props.config?.detailLevel || 'standard'}
          />
        );
      default:
        throw new Error(`Type de container non supporté: ${type}`);
    }
  }
}

















