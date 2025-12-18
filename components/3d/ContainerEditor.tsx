/**
 * Composant pour créer et gérer des conteneurs HD5 avec dalle de béton de 40 cm
 * Utilisé dans SplineScene pour créer des objets 3D
 */

import * as THREE from 'three';
import type { Container3D } from '../../types/container3d';

/**
 * Créer un conteneur HD5 avec dalle de béton dans la scène Three.js
 */
export function createContainer3D(
  scene: THREE.Scene,
  container: Container3D
): THREE.Group | null {
  try {
    const group = new THREE.Group();
    group.name = `Container_${container.id}`;
    group.userData = { type: 'container', id: container.id, data: container };

    // Dimensions du conteneur
    const { length, width, height } = container.dimensions;
    const concreteThickness = container.concreteSlab.thickness;

    // ========== DALLE DE BÉTON (40 cm) ==========
    if (container.concreteSlab.enabled) {
      const concreteGeometry = new THREE.BoxGeometry(
        container.concreteSlab.length,
        concreteThickness,
        container.concreteSlab.width
      );
      const concreteMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080, // Gris béton
        roughness: 0.9,
        metalness: 0.1,
      });

      const concreteSlab = new THREE.Mesh(concreteGeometry, concreteMaterial);
      concreteSlab.position.set(
        container.position.x,
        container.position.y + concreteThickness / 2,
        container.position.z
      );
      concreteSlab.receiveShadow = true;
      concreteSlab.castShadow = true;
      concreteSlab.name = `ConcreteSlab_${container.id}`;

      group.add(concreteSlab);
    }

    // ========== CONTENEUR HD5 ==========
    // Position du conteneur : au-dessus de la dalle (y = concreteThickness)
    const containerY = container.position.y + concreteThickness;

    // Structure principale du conteneur
    const containerGeometry = new THREE.BoxGeometry(length, height, width);
    const containerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Blanc
      metalness: 0.1,
      roughness: 0.7,
    });

    const containerMesh = new THREE.Mesh(containerGeometry, containerMaterial);
    containerMesh.position.set(
      container.position.x,
      containerY + height / 2,
      container.position.z
    );
    containerMesh.castShadow = true;
    containerMesh.receiveShadow = true;
    containerMesh.name = `ContainerMesh_${container.id}`;

    // Appliquer la rotation
    group.rotation.set(
      THREE.MathUtils.degToRad(container.rotation.x),
      THREE.MathUtils.degToRad(container.rotation.y),
      THREE.MathUtils.degToRad(container.rotation.z)
    );

    group.add(containerMesh);

    // Panneaux corrugués sur les côtés (détails visuels)
    const corrugationCount = 12;
    for (let i = 0; i < corrugationCount; i++) {
      const corrugationGeometry = new THREE.BoxGeometry(0.8, height * 0.95, 0.02);
      const corrugationMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.7,
      });

      const corrugation = new THREE.Mesh(corrugationGeometry, corrugationMaterial);
      corrugation.position.set(
        container.position.x - length / 2 + 0.5 + i * 1,
        containerY + height / 2,
        container.position.z + width / 2 + 0.01
      );
      corrugation.castShadow = true;

      group.add(corrugation);
    }

    // Marquage "HD5" sur le côté
    const labelGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.01);
    const labelMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.0,
      roughness: 0.9,
    });

    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(
      container.position.x + length / 2 - 0.5,
      containerY + height / 2 - 0.8,
      container.position.z + width / 2 + 0.02
    );
    group.add(label);

    // Position du groupe
    group.position.set(container.position.x, 0, container.position.z);

    // Ajouter à la scène
    scene.add(group);

    return group;
  } catch (error) {
    console.error('Erreur lors de la création du conteneur 3D:', error);
    return null;
  }
}

/**
 * Mettre à jour la position d'un conteneur existant
 */
export function updateContainer3DPosition(
  containerObject: THREE.Group,
  newPosition: { x: number; y: number; z: number },
  concreteThickness: number
): void {
  containerObject.position.set(newPosition.x, 0, newPosition.z);

  // Mettre à jour la position de la dalle de béton
  const concreteSlab = containerObject.children.find(
    (child) => child.name.startsWith('ConcreteSlab_')
  ) as THREE.Mesh | undefined;

  if (concreteSlab) {
    concreteSlab.position.set(
      newPosition.x,
      newPosition.y + concreteThickness / 2,
      newPosition.z
    );
  }

  // Mettre à jour la position du conteneur
  const containerMesh = containerObject.children.find(
    (child) => child.name.startsWith('ContainerMesh_')
  ) as THREE.Mesh | undefined;

  if (containerMesh && containerMesh.geometry instanceof THREE.BoxGeometry) {
    containerMesh.position.set(
      newPosition.x,
      newPosition.y + concreteThickness + containerMesh.geometry.parameters.height / 2,
      newPosition.z
    );
  }
}

/**
 * Mettre à jour la rotation d'un conteneur existant
 */
export function updateContainer3DRotation(
  containerObject: THREE.Group,
  newRotation: { x: number; y: number; z: number }
): void {
  containerObject.rotation.set(
    THREE.MathUtils.degToRad(newRotation.x),
    THREE.MathUtils.degToRad(newRotation.y),
    THREE.MathUtils.degToRad(newRotation.z)
  );
}
















