/**
 * Réseau d'Allées Piétonnes
 * Génère automatiquement un réseau logique d'allées autour de tous les équipements
 * pour la maintenance, l'inspection et l'accès aux conteneurs
 */

import React, { useMemo } from 'react';
import { EquipmentPosition } from '../../lib/projectGenerator';
import CirculationPath from './CirculationPath';

interface PathSegment {
  start: [number, number, number];
  end: [number, number, number];
  width: number;
  isMainPath: boolean;
}

interface PedestrianPathNetworkProps {
  equipment: EquipmentPosition[];
}

/**
 * Dimensions des équipements réels (en mètres)
 * Utilisées pour positionner les allées exactement à la largeur du conteneur
 */
const EQUIPMENT_DIMENSIONS: Record<string, [number, number, number]> = {
  container: [12.196, 2.438, 2.896], // Container HD5 : longueur × hauteur × profondeur
  transformer: [2.5, 2, 2.5], // Transformer : longueur × hauteur × profondeur
  switchgear: [2, 2, 3], // Switchgear : longueur × hauteur × profondeur
  substation: [40, 30, 15],
  cooling: [15, 3, 3],
};

/**
 * Dimensions des dalles de béton (en mètres)
 * Les dalles font 40cm de hauteur et sont légèrement plus larges que les équipements
 */
const CONCRETE_SLAB_DIMENSIONS: Record<string, [number, number, number]> = {
  container: [12.8, 0.4, 3], // Dalle HD5 : 12.8m × 0.4m × 3m (container = 12.196m × 2.896m)
  transformer: [3.1, 0.4, 2.6], // Dalle transformer : 3.1m × 0.4m × 2.6m (transformer = 2.5m × 2.5m)
  switchgear: [2.6, 0.4, 3.3], // Dalle switchgear : +30cm de chaque côté
  substation: [40, 0.4, 15],
  cooling: [15.6, 0.4, 3.6], // Dalle cooling : +30cm de chaque côté
};

/**
 * Calcule les dimensions réelles de l'équipement (pour positionner les allées)
 */
function getEquipmentDimensions(eq: EquipmentPosition): [number, number, number] {
  if (eq.type === 'container') return EQUIPMENT_DIMENSIONS.container;
  if (eq.type === 'transformer') return EQUIPMENT_DIMENSIONS.transformer;
  if (eq.type === 'switchgear') return EQUIPMENT_DIMENSIONS.switchgear;
  if (eq.type === 'substation') return EQUIPMENT_DIMENSIONS.substation;
  if (eq.type === 'cooling') return EQUIPMENT_DIMENSIONS.cooling;
  return [5, 2, 5]; // Par défaut
}

/**
 * Calcule les dimensions de la dalle de béton pour un équipement
 */
function getConcreteSlabDimensions(eq: EquipmentPosition): [number, number, number] {
  if (eq.type === 'container') return CONCRETE_SLAB_DIMENSIONS.container;
  if (eq.type === 'transformer') return CONCRETE_SLAB_DIMENSIONS.transformer;
  if (eq.type === 'switchgear') return CONCRETE_SLAB_DIMENSIONS.switchgear;
  if (eq.type === 'substation') return CONCRETE_SLAB_DIMENSIONS.substation;
  if (eq.type === 'cooling') return CONCRETE_SLAB_DIMENSIONS.cooling;
  return [5.6, 0.4, 5.6]; // Par défaut : +30cm de chaque côté
}

/**
 * Hauteur des allées : au niveau du haut de la dalle (0.2m = moitié de 0.4m)
 */
const PATH_HEIGHT = 0.2;

/**
 * Génère les allées autour d'un conteneur (collées à la largeur exacte du conteneur)
 * + Allées dans les angles pour combler les coins
 */
function generateContainerPaths(
  container: EquipmentPosition
): PathSegment[] {
  const [cx, cy, cz] = container.position;
  // Utiliser les dimensions RÉELLES du conteneur (pas la dalle) pour coller exactement
  const [containerLength, containerHeight, containerDepth] = getEquipmentDimensions(container);
  const pathWidth = 1.5;
  // Allées collées au conteneur : offset = largeur de l'allée / 2 + dimension du conteneur / 2
  const offsetX = pathWidth / 2 + containerLength / 2;
  const offsetZ = pathWidth / 2 + containerDepth / 2;

  // Position Y : au niveau du haut de la dalle (0.2m = moitié de 0.4m)
  const pathY = PATH_HEIGHT;

  const paths: PathSegment[] = [
    // Nord (côté +Z) - allée horizontale suivant la longueur du conteneur
    {
      start: [cx - offsetX, pathY, cz + offsetZ],
      end: [cx + offsetX, pathY, cz + offsetZ],
      width: pathWidth,
      isMainPath: false,
    },
    // Sud (côté -Z) - allée horizontale suivant la longueur du conteneur
    {
      start: [cx - offsetX, pathY, cz - offsetZ],
      end: [cx + offsetX, pathY, cz - offsetZ],
      width: pathWidth,
      isMainPath: false,
    },
    // Est (côté +X) - allée verticale suivant la profondeur du conteneur
    {
      start: [cx + offsetX, pathY, cz - offsetZ],
      end: [cx + offsetX, pathY, cz + offsetZ],
      width: pathWidth,
      isMainPath: false,
    },
    // Ouest (côté -X) - allée verticale suivant la profondeur du conteneur
    {
      start: [cx - offsetX, pathY, cz - offsetZ],
      end: [cx - offsetX, pathY, cz + offsetZ],
      width: pathWidth,
      isMainPath: false,
    },
  ];

  // COMBLER LES ANGLES : allées diagonales dans les 4 coins
  // Coin Nord-Est
  paths.push({
    start: [cx + offsetX, pathY, cz + offsetZ - pathWidth],
    end: [cx + offsetX - pathWidth, pathY, cz + offsetZ],
    width: pathWidth,
    isMainPath: false,
  });
  
  // Coin Nord-Ouest
  paths.push({
    start: [cx - offsetX, pathY, cz + offsetZ - pathWidth],
    end: [cx - offsetX + pathWidth, pathY, cz + offsetZ],
    width: pathWidth,
    isMainPath: false,
  });
  
  // Coin Sud-Est
  paths.push({
    start: [cx + offsetX, pathY, cz - offsetZ + pathWidth],
    end: [cx + offsetX - pathWidth, pathY, cz - offsetZ],
    width: pathWidth,
    isMainPath: false,
  });
  
  // Coin Sud-Ouest
  paths.push({
    start: [cx - offsetX, pathY, cz - offsetZ + pathWidth],
    end: [cx - offsetX + pathWidth, pathY, cz - offsetZ],
    width: pathWidth,
    isMainPath: false,
  });

  return paths;
}

/**
 * Génère les allées entre transformateurs adjacents
 */
function generateTransformerPaths(
  transformers: EquipmentPosition[]
): PathSegment[] {
  const paths: PathSegment[] = [];
  const pathWidth = 1.5;

  // Grouper par Power Block
  const byPowerBlock = transformers.reduce((acc, tr) => {
    const pbId = tr.metadata?.powerBlockId || 'other';
    if (!acc[pbId]) acc[pbId] = [];
    acc[pbId].push(tr);
    return acc;
  }, {} as Record<string, EquipmentPosition[]>);

  // Pour chaque Power Block
  Object.values(byPowerBlock).forEach((pbTransformers) => {
    // Trier par position Z (vertical)
    const sorted = [...pbTransformers].sort((a, b) => a.position[2] - b.position[2]);

    // Allées horizontales entre transformateurs adjacents
    for (let i = 0; i < sorted.length - 1; i++) {
      const tr1 = sorted[i];
      const tr2 = sorted[i + 1];
      const [x1, , z1] = tr1.position;
      const [x2, , z2] = tr2.position;

      // Si les transformateurs sont alignés verticalement (même X)
      if (Math.abs(x1 - x2) < 5) {
        const midZ = (z1 + z2) / 2;
        // Utiliser les dimensions de la dalle de béton
        const [w1] = getConcreteSlabDimensions(tr1);
        const [w2] = getConcreteSlabDimensions(tr2);
        const maxWidth = Math.max(w1, w2);
        // Collé à la dalle, pas de marge supplémentaire
        const offset = pathWidth / 2 + maxWidth / 2;

        // Allée horizontale entre les deux (au niveau de la dalle)
        paths.push({
          start: [x1 - offset, PATH_HEIGHT, midZ],
          end: [x1 + offset, PATH_HEIGHT, midZ],
          width: pathWidth,
          isMainPath: false,
        });
      }
    }

    // Allées verticales pour connexion (si plusieurs transformateurs)
    if (sorted.length > 1) {
      const firstTr = sorted[0];
      const lastTr = sorted[sorted.length - 1];
      const [x, , z1] = firstTr.position;
      const [, , z2] = lastTr.position;
      // Utiliser les dimensions de la dalle
      const [w] = getConcreteSlabDimensions(firstTr);
      // Collé à la dalle
      const offset = pathWidth / 2 + w / 2;

      // Allée verticale à gauche (au niveau de la dalle)
      paths.push({
        start: [x - offset, PATH_HEIGHT, z1 - 2],
        end: [x - offset, PATH_HEIGHT, z2 + 2],
        width: pathWidth,
        isMainPath: false,
      });

      // Allée verticale à droite (au niveau de la dalle)
      paths.push({
        start: [x + offset, PATH_HEIGHT, z1 - 2],
        end: [x + offset, PATH_HEIGHT, z2 + 2],
        width: pathWidth,
        isMainPath: false,
      });
    }
  });

  return paths;
}

/**
 * Génère l'axe principal de circulation et les allées perpendiculaires
 * Axe principal : passe au centre (où sont les transformateurs)
 * Allées perpendiculaires : accès aux conteneurs de chaque côté
 */
function generateMainAxisAndPerpendicularPaths(
  equipment: EquipmentPosition[]
): PathSegment[] {
  const paths: PathSegment[] = [];
  const mainAxisWidth = 2.0; // Axe principal plus large
  const perpendicularWidth = 1.5; // Allées perpendiculaires

  // Grouper les équipements par Power Block
  const containers = equipment.filter(eq => eq.type === 'container');
  const transformers = equipment.filter(eq => eq.type === 'transformer');
  
  const byPowerBlock = transformers.reduce((acc, tr) => {
    const pbId = tr.metadata?.powerBlockId || 'other';
    if (!acc[pbId]) {
      acc[pbId] = { transformers: [], containers: [] };
    }
    acc[pbId].transformers.push(tr);
    return acc;
  }, {} as Record<string, { transformers: EquipmentPosition[]; containers: EquipmentPosition[] }>);

  // Ajouter les conteneurs à leur Power Block
  containers.forEach(container => {
    const pbId = container.metadata?.powerBlockId || 'other';
    if (byPowerBlock[pbId]) {
      byPowerBlock[pbId].containers.push(container);
    }
  });

  // Pour chaque Power Block
  Object.values(byPowerBlock).forEach((pbData) => {
    const { transformers: pbTransformers, containers: pbContainers } = pbData;
    if (pbTransformers.length === 0) return;

    // Trier les transformateurs par Z
    const sortedTransformers = [...pbTransformers].sort((a, b) => a.position[2] - b.position[2]);
    
    // Calculer l'axe principal : passe au centre X des transformateurs
    const avgX = pbTransformers.reduce((sum, tr) => sum + tr.position[0], 0) / pbTransformers.length;
    
    // Trouver les limites Z (min et max)
    const zPositions = sortedTransformers.map(tr => tr.position[2]);
    const minZ = Math.min(...zPositions);
    const maxZ = Math.max(...zPositions);
    
    // Étendre l'axe principal un peu au-delà des transformateurs
    const axisStartZ = minZ - 5;
    const axisEndZ = maxZ + 5;

    // 1. AXE PRINCIPAL (au centre, où sont les transformateurs)
    paths.push({
      start: [avgX, PATH_HEIGHT, axisStartZ],
      end: [avgX, PATH_HEIGHT, axisEndZ],
      width: mainAxisWidth,
      isMainPath: true,
    });

    // 2. ALLÉES PERPENDICULAIRES vers les conteneurs
    // Grouper les conteneurs par transformateur
    pbContainers.forEach(container => {
      const [cx, , cz] = container.position;
      const [containerLength] = getEquipmentDimensions(container);
      
      // Si le conteneur est à gauche (A) ou à droite (B) de l'axe
      const isLeft = cx < avgX;
      
      // Allée perpendiculaire depuis l'axe principal vers le conteneur
      // Elle va jusqu'à la face du conteneur (côté le plus proche de l'axe)
      const containerEdgeX = isLeft 
        ? cx + containerLength / 2  // Face droite du conteneur (côté A)
        : cx - containerLength / 2;   // Face gauche du conteneur (côté B)
      
      // Allée perpendiculaire
      paths.push({
        start: [avgX, PATH_HEIGHT, cz],
        end: [containerEdgeX, PATH_HEIGHT, cz],
        width: perpendicularWidth,
        isMainPath: false,
      });
    });

    // 3. ALLÉES DANS L'ESPACE ENTRE LES CONTENEURS (entre A et B)
    // Grouper les conteneurs par transformateur
    const containersByTransformer = pbContainers.reduce((acc, container) => {
      const trId = container.metadata?.transformerId || 'unknown';
      if (!acc[trId]) acc[trId] = [];
      acc[trId].push(container);
      return acc;
    }, {} as Record<string, EquipmentPosition[]>);

    Object.values(containersByTransformer).forEach(trContainers => {
      if (trContainers.length === 2) {
        // Il y a 2 conteneurs (A et B)
        const [containerA, containerB] = trContainers.sort((a, b) => a.position[0] - b.position[0]);
        const [ax, , az] = containerA.position;
        const [bx, , bz] = containerB.position;
        const [containerLengthA] = getEquipmentDimensions(containerA);
        const [containerLengthB] = getEquipmentDimensions(containerB);
        
        // Allée dans l'espace entre les deux conteneurs
        // Elle passe au centre (où est le transformateur)
        const midZ = (az + bz) / 2;
        
        // Allée horizontale dans l'espace entre les conteneurs
        paths.push({
          start: [ax + containerLengthA / 2, PATH_HEIGHT, midZ],
          end: [bx - containerLengthB / 2, PATH_HEIGHT, midZ],
          width: perpendicularWidth,
          isMainPath: false,
        });
      }
    });
  });

  // 4. CONNEXION ENTRE POWER BLOCKS (routes principales)
  const powerBlockCenters: Array<{ id: string; center: [number, number, number] }> = [];
  
  Object.entries(byPowerBlock).forEach(([pbId, pbData]) => {
    if (pbData.transformers.length === 0) return;
    
    const avgX = pbData.transformers.reduce((sum, tr) => sum + tr.position[0], 0) / pbData.transformers.length;
    const avgZ = pbData.transformers.reduce((sum, tr) => sum + tr.position[2], 0) / pbData.transformers.length;
    
    powerBlockCenters.push({ 
      id: pbId, 
      center: [avgX, PATH_HEIGHT, avgZ] 
    });
  });

  // Trier par position X
  powerBlockCenters.sort((a, b) => a.center[0] - b.center[0]);

  // Connecter les Power Blocks adjacents
  for (let i = 0; i < powerBlockCenters.length - 1; i++) {
    const pb1 = powerBlockCenters[i];
    const pb2 = powerBlockCenters[i + 1];
    
    paths.push({
      start: [pb1.center[0], PATH_HEIGHT, pb1.center[2]],
      end: [pb2.center[0], PATH_HEIGHT, pb2.center[2]],
      width: mainAxisWidth,
      isMainPath: true,
    });
  }

  // Connecter avec la substation
  const substation = equipment.find(eq => eq.type === 'substation');
  if (substation && powerBlockCenters.length > 0) {
    const firstPB = powerBlockCenters[0];
    const [sx, , sz] = substation.position;
    
    paths.push({
      start: [sx, PATH_HEIGHT, sz],
      end: [firstPB.center[0], PATH_HEIGHT, firstPB.center[2]],
      width: mainAxisWidth,
      isMainPath: true,
    });
  }

  return paths;
}

/**
 * Fusionne les segments qui se chevauchent
 */
function mergeOverlappingSegments(segments: PathSegment[]): PathSegment[] {
  const merged: PathSegment[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < segments.length; i++) {
    if (processed.has(i)) continue;

    let current = segments[i];
    processed.add(i);

    // Chercher des segments qui se chevauchent
    for (let j = i + 1; j < segments.length; j++) {
      if (processed.has(j)) continue;

      const other = segments[j];
      
      // Vérifier si les segments sont alignés et proches
      const dx1 = current.end[0] - current.start[0];
      const dz1 = current.end[2] - current.start[2];
      const dx2 = other.end[0] - other.start[0];
      const dz2 = other.end[2] - other.start[2];

      // Vérifier l'alignement (même direction)
      const angle1 = Math.atan2(dz1, dx1);
      const angle2 = Math.atan2(dz2, dx2);
      const angleDiff = Math.abs(angle1 - angle2);
      const isAligned = angleDiff < 0.1 || Math.abs(angleDiff - Math.PI) < 0.1;

      if (isAligned && current.width === other.width) {
        // Vérifier la proximité
        const dist1 = Math.sqrt(
          Math.pow(current.end[0] - other.start[0], 2) +
          Math.pow(current.end[2] - other.start[2], 2)
        );
        const dist2 = Math.sqrt(
          Math.pow(current.start[0] - other.end[0], 2) +
          Math.pow(current.start[2] - other.end[2], 2)
        );

        if (dist1 < 0.5 || dist2 < 0.5) {
          // Fusionner les segments
          const allPoints = [
            current.start,
            current.end,
            other.start,
            other.end,
          ];

          // Trouver les points extrêmes
          let minX = Infinity, maxX = -Infinity;
          let minZ = Infinity, maxZ = -Infinity;
          let y = current.start[1];

          allPoints.forEach(([x, , z]) => {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
          });

          current = {
            start: [minX, y, minZ],
            end: [maxX, y, maxZ],
            width: current.width,
            isMainPath: current.isMainPath || other.isMainPath,
          };

          processed.add(j);
        }
      }
    }

    merged.push(current);
  }

  return merged;
}

/**
 * Composant principal du réseau d'allées piétonnes
 */
export default function PedestrianPathNetwork({
  equipment,
}: PedestrianPathNetworkProps) {
  const paths = useMemo(() => {
    if (!equipment || equipment.length === 0) return [];

    const allPaths: PathSegment[] = [];

    // 1. Allées autour de chaque conteneur
    const containers = equipment.filter(eq => eq.type === 'container');
    containers.forEach(container => {
      allPaths.push(...generateContainerPaths(container));
    });

    // 2. Axe principal + allées perpendiculaires (remplace les anciennes routes principales)
    allPaths.push(...generateMainAxisAndPerpendicularPaths(equipment));

    // 3. Allées entre transformateurs (pour connexion)
    const transformers = equipment.filter(eq => eq.type === 'transformer');
    if (transformers.length > 0) {
      allPaths.push(...generateTransformerPaths(transformers));
    }

    // 4. Fusionner les segments qui se chevauchent
    const mergedPaths = mergeOverlappingSegments(allPaths);

    return mergedPaths;
  }, [equipment]);

  return (
    <group name="pedestrian-path-network">
      {paths.map((path, index) => (
        <CirculationPath
          key={`path-${index}`}
          start={path.start}
          end={path.end}
          width={path.width}
          isMainPath={path.isMainPath}
        />
      ))}
    </group>
  );
}

