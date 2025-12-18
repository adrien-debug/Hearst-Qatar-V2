import { useMemo } from 'react';
import * as THREE from 'three';
import { ArchitecturalObject, Point3D, Line3D, areLinesParallel, areLinesPerpendicular } from '../../utils/architecturalHelpers';

interface WallObject {
  id: string;
  position: [number, number, number];
  length?: number;
  rotation?: number;
}

interface AlignmentVisualizerProps {
  objects: ArchitecturalObject[];
  lines: Line3D[];
  walls: WallObject[];
  enabled?: boolean;
  toleranceDegrees?: number;
}

export default function AlignmentVisualizer({
  objects,
  lines,
  walls,
  enabled = true,
  toleranceDegrees = 5,
}: AlignmentVisualizerProps) {
  const alignments = useMemo(() => {
    if (!enabled) return [];

    const alignmentGuides: Array<{
      type: 'parallel' | 'perpendicular';
      start: Point3D;
      end: Point3D;
      color: number;
    }> = [];

    // Analyser les lignes
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const line1 = {
          id: lines[i].id,
          start: lines[i].start,
          end: lines[i].end,
        };
        const line2 = {
          id: lines[j].id,
          start: lines[j].start,
          end: lines[j].end,
        };

        if (areLinesParallel(line1, line2, toleranceDegrees)) {
          // Lignes parallèles : afficher une ligne guide entre elles
          const mid1 = {
            x: (line1.start.x + line1.end.x) / 2,
            y: (line1.start.y + line1.end.y) / 2,
            z: (line1.start.z + line1.end.z) / 2,
          };
          const mid2 = {
            x: (line2.start.x + line2.end.x) / 2,
            y: (line2.start.y + line2.end.y) / 2,
            z: (line2.start.z + line2.end.z) / 2,
          };

          alignmentGuides.push({
            type: 'parallel',
            start: mid1,
            end: mid2,
            color: 0x00ff00, // Vert pour parallèle
          });
        } else if (areLinesPerpendicular(line1, line2, toleranceDegrees)) {
          // Lignes perpendiculaires : afficher un indicateur à l'intersection
          const intersection = findLineIntersection(line1, line2);
          if (intersection) {
            alignmentGuides.push({
              type: 'perpendicular',
              start: intersection,
              end: {
                x: intersection.x,
                y: intersection.y + 1,
                z: intersection.z,
              },
              color: 0xffa500, // Orange pour perpendiculaire
            });
          }
        }
      }
    }

    // Analyser les murs (simplifié : traiter comme des lignes)
    for (let i = 0; i < walls.length; i++) {
      for (let j = i + 1; j < walls.length; j++) {
        const wall1 = walls[i];
        const wall2 = walls[j];

        // Créer des lignes virtuelles pour les murs
        const length1 = wall1.length || 10;
        const rotation1 = wall1.rotation || 0;
        const line1 = {
          id: `wall-${wall1.id}`,
          start: {
            x: wall1.position[0] - (length1 / 2) * Math.cos(rotation1),
            y: wall1.position[1],
            z: wall1.position[2] - (length1 / 2) * Math.sin(rotation1),
          },
          end: {
            x: wall1.position[0] + (length1 / 2) * Math.cos(rotation1),
            y: wall1.position[1],
            z: wall1.position[2] + (length1 / 2) * Math.sin(rotation1),
          },
        };

        const length2 = wall2.length || 10;
        const rotation2 = wall2.rotation || 0;
        const line2 = {
          id: `wall-${wall2.id}`,
          start: {
            x: wall2.position[0] - (length2 / 2) * Math.cos(rotation2),
            y: wall2.position[1],
            z: wall2.position[2] - (length2 / 2) * Math.sin(rotation2),
          },
          end: {
            x: wall2.position[0] + (length2 / 2) * Math.cos(rotation2),
            y: wall2.position[1],
            z: wall2.position[2] + (length2 / 2) * Math.sin(rotation2),
          },
        };

        if (areLinesParallel(line1, line2, toleranceDegrees)) {
          const mid1 = {
            x: (line1.start.x + line1.end.x) / 2,
            y: (line1.start.y + line1.end.y) / 2,
            z: (line1.start.z + line1.end.z) / 2,
          };
          const mid2 = {
            x: (line2.start.x + line2.end.x) / 2,
            y: (line2.start.y + line2.end.y) / 2,
            z: (line2.start.z + line2.end.z) / 2,
          };

          alignmentGuides.push({
            type: 'parallel',
            start: mid1,
            end: mid2,
            color: 0x00ff00,
          });
        }
      }
    }

    return alignmentGuides;
  }, [objects, lines, walls, enabled, toleranceDegrees]);

  if (!enabled || alignments.length === 0) return null;

  return (
    <>
      {alignments.map((alignment, index) => (
        <AlignmentGuide
          key={`alignment-${index}`}
          start={alignment.start}
          end={alignment.end}
          color={alignment.color}
          type={alignment.type}
        />
      ))}
    </>
  );
}

function AlignmentGuide({
  start,
  end,
  color,
  type,
}: {
  start: Point3D;
  end: Point3D;
  color: number;
  type: 'parallel' | 'perpendicular';
}) {
  const startVec = new THREE.Vector3(start.x, start.y, start.z);
  const endVec = new THREE.Vector3(end.x, end.y, end.z);
  const center = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const length = startVec.distanceTo(endVec);
  const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();

  if (type === 'perpendicular') {
    // Pour perpendiculaire, afficher un indicateur vertical
    return (
      <group position={center}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.2, 0.3, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      </group>
    );
  }

  // Pour parallèle, afficher une ligne guide
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    direction
  );

  return (
    <group position={center} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function findLineIntersection(
  line1: { start: Point3D; end: Point3D },
  line2: { start: Point3D; end: Point3D }
): Point3D | null {
  // Simplification : intersection dans le plan XZ (Y=0)
  const dir1 = {
    x: line1.end.x - line1.start.x,
    z: line1.end.z - line1.start.z,
  };
  const dir2 = {
    x: line2.end.x - line2.start.x,
    z: line2.end.z - line2.start.z,
  };

  const det = dir1.x * dir2.z - dir1.z * dir2.x;
  if (Math.abs(det) < 0.0001) return null; // Lignes parallèles

  const diff = {
    x: line2.start.x - line1.start.x,
    z: line2.start.z - line1.start.z,
  };

  const t = (diff.x * dir2.z - diff.z * dir2.x) / det;

  return {
    x: line1.start.x + t * dir1.x,
    y: (line1.start.y + line2.start.y) / 2,
    z: line1.start.z + t * dir1.z,
  };
}
















