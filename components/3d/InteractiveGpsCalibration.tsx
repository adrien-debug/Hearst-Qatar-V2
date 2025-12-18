import { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Raycaster, Vector2, Vector3, Plane } from 'three';
import { Html, Line } from '@react-three/drei';
import { GpsPoint } from '../../utils/gpsToAnnotation';

interface CalibrationStep {
  id: string;
  title: string;
  description: string;
  instruction: string;
  expectedAlignment?: 'horizontal' | 'vertical' | 'parallel';
  targetPoint?: string; // Nom du point GPS à calibrer
  checkAlignment?: (points: Vector3[]) => { valid: boolean; message: string };
}

interface InteractiveGpsCalibrationProps {
  enabled: boolean;
  gpsPoints: GpsPoint[];
  onPointCalibrated: (pointName: string, position: [number, number, number]) => void;
  onComplete: () => void;
  onCancel: () => void;
}

/**
 * Outil de calibrage GPS interactif guidé
 * Guide l'utilisateur pour calibrer les points en cliquant dans la scène 3D
 */
export default function InteractiveGpsCalibration({
  enabled,
  gpsPoints,
  onPointCalibrated,
  onComplete,
  onCancel,
}: InteractiveGpsCalibrationProps) {
  const { camera, raycaster, gl, scene } = useThree();
  const mouseRef = useRef(new Vector2());
  const planeRef = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [clickedPoints, setClickedPoints] = useState<Vector3[]>([]);
  const [calibrationResults, setCalibrationResults] = useState<Record<string, [number, number, number]>>({});

  // Étapes de calibrage
  const calibrationSteps: CalibrationStep[] = [
    {
      id: 'test-zone',
      title: 'Zone de test',
      description: 'Créons d\'abord une zone de test pour vérifier le calibrage',
      instruction: 'Cliquez sur 4 points au sol pour créer un rectangle de test. Ces points doivent former un rectangle parfait.',
      expectedAlignment: 'horizontal',
      checkAlignment: (points) => {
        if (points.length < 4) {
          return { valid: false, message: 'Cliquez sur 4 points' };
        }
        // Vérifier que les points forment un rectangle
        const [p1, p2, p3, p4] = points;
        const d1 = p1.distanceTo(p2);
        const d2 = p2.distanceTo(p3);
        const d3 = p3.distanceTo(p4);
        const d4 = p4.distanceTo(p1);
        const diagonal1 = p1.distanceTo(p3);
        const diagonal2 = p2.distanceTo(p4);
        
        const tolerance = 2; // 2 unités de tolérance
        const isRectangle = Math.abs(d1 - d3) < tolerance && Math.abs(d2 - d4) < tolerance;
        const diagonalsEqual = Math.abs(diagonal1 - diagonal2) < tolerance;
        
        if (isRectangle && diagonalsEqual) {
          return { valid: true, message: '✅ Rectangle parfait détecté !' };
        }
        return { valid: false, message: '⚠️ Les points ne forment pas un rectangle parfait. Réessayez.' };
      },
    },
    {
      id: 'substation',
      title: 'Calibrage Substation',
      description: 'Calibrez la position de la substation principale',
      instruction: 'Cliquez sur le centre de la substation 200 MW dans la scène 3D',
      targetPoint: 'Substation_200MW',
      expectedAlignment: 'horizontal',
    },
    {
      id: 'powerblock-1',
      title: 'Calibrage Power Block 1',
      description: 'Calibrez la position du Power Block 1',
      instruction: 'Cliquez sur le centre du Power Block 1',
      targetPoint: 'PowerBlock_1',
      expectedAlignment: 'horizontal',
    },
    {
      id: 'transformer-alignment',
      title: 'Vérification alignement transformateurs',
      description: 'Vérifions que les transformateurs sont bien alignés',
      instruction: 'Cliquez sur 3 transformateurs du même Power Block pour vérifier l\'alignement',
      expectedAlignment: 'parallel',
      checkAlignment: (points) => {
        if (points.length < 3) {
          return { valid: false, message: 'Cliquez sur 3 transformateurs' };
        }
        // Vérifier que les points sont alignés (parallèles)
        const [p1, p2, p3] = points;
        const v1 = new Vector3().subVectors(p2, p1);
        const v2 = new Vector3().subVectors(p3, p2);
        const cross = new Vector3().crossVectors(v1, v2);
        const alignment = cross.length() < 1; // Tolérance pour l'alignement
        
        if (alignment) {
          return { valid: true, message: '✅ Transformateurs bien alignés !' };
        }
        return { valid: false, message: '⚠️ Les transformateurs ne sont pas alignés. Ajustez les positions.' };
      },
    },
  ];

  const currentStep = calibrationSteps[currentStepIndex];
  const isLastStep = currentStepIndex === calibrationSteps.length - 1;

  useEffect(() => {
    if (!enabled) {
      setCurrentStepIndex(0);
      setClickedPoints([]);
      setCalibrationResults({});
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      if (
        target.closest('[data-html]') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('.calibration-ui')
      ) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const rect = gl.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);

      // Intersection avec le plan du sol (Y=0)
      const intersection = new Vector3();
      const hasIntersection = raycaster.ray.intersectPlane(planeRef.current, intersection);

      if (hasIntersection) {
        const newPoint = new Vector3(intersection.x, 0, intersection.z);
        const updatedPoints = [...clickedPoints, newPoint];
        setClickedPoints(updatedPoints);

        // Si c'est une étape avec un point cible, sauvegarder la position
        if (currentStep.targetPoint) {
          const position: [number, number, number] = [newPoint.x, newPoint.y, newPoint.z];
          setCalibrationResults((prev) => ({
            ...prev,
            [currentStep.targetPoint!]: position,
          }));
          onPointCalibrated(currentStep.targetPoint, position);
        }

        // Vérifier l'alignement si une fonction de vérification existe
        if (currentStep.checkAlignment) {
          const check = currentStep.checkAlignment(updatedPoints);
          if (check.valid && updatedPoints.length >= (currentStep.id === 'test-zone' ? 4 : 3)) {
            // Alignement validé, passer à l'étape suivante
            setTimeout(() => {
              if (currentStepIndex < calibrationSteps.length - 1) {
                setCurrentStepIndex(currentStepIndex + 1);
                setClickedPoints([]);
              }
            }, 1000);
          }
        } else if (currentStep.targetPoint) {
          // Point calibré, passer à l'étape suivante
          setTimeout(() => {
            if (currentStepIndex < calibrationSteps.length - 1) {
              setCurrentStepIndex(currentStepIndex + 1);
              setClickedPoints([]);
            }
          }, 500);
        }
      }
    };

    if (enabled) {
      gl.domElement.addEventListener('click', handleClick);
      gl.domElement.style.cursor = 'crosshair';
    }

    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      gl.domElement.style.cursor = 'default';
    };
  }, [enabled, camera, raycaster, gl, clickedPoints, currentStepIndex, currentStep, calibrationSteps, onPointCalibrated]);

  // Afficher les points cliqués
  const renderClickedPoints = () => {
    return clickedPoints.map((point, index) => (
      <Html key={`point-${index}`} position={[point.x, point.y + 1, point.z]} center>
        <div className="calibration-ui bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
          {index + 1}
        </div>
      </Html>
    ));
  };

  // Afficher la zone de test (rectangle)
  const renderTestZone = () => {
    if (clickedPoints.length < 4 || currentStep.id !== 'test-zone') return null;

    const [p1, p2, p3, p4] = clickedPoints;
    // Créer un rectangle fermé (retour au premier point)
    const points: [number, number, number][] = [
      [p1.x, p1.y, p1.z],
      [p2.x, p2.y, p2.z],
      [p3.x, p3.y, p3.z],
      [p4.x, p4.y, p4.z],
      [p1.x, p1.y, p1.z], // Fermer le rectangle
    ];
    
    return (
      <Line
        points={points}
        color="#00ff00"
        lineWidth={3}
      />
    );
  };

  if (!enabled) return null;

  return (
    <>
      {/* Points cliqués */}
      {renderClickedPoints()}

      {/* Zone de test */}
      {currentStep.id === 'test-zone' && clickedPoints.length >= 4 && renderTestZone()}

      {/* Panneau d'instructions */}
      <Html position={[0, 10, 0]} center>
        <div className="calibration-ui bg-white rounded-lg shadow-2xl p-6 max-w-md border-2 border-blue-500">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">{currentStep.title}</h3>
              <span className="text-sm text-gray-500">
                Étape {currentStepIndex + 1}/{calibrationSteps.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{currentStep.description}</p>
            <p className="text-base font-semibold text-blue-700">{currentStep.instruction}</p>
          </div>

          {/* Indicateur d'alignement */}
          {currentStep.expectedAlignment && (
            <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Alignement attendu:</span>{' '}
                {currentStep.expectedAlignment === 'horizontal' && 'Horizontal (au sol)'}
                {currentStep.expectedAlignment === 'vertical' && 'Vertical (perpendiculaire au sol)'}
                {currentStep.expectedAlignment === 'parallel' && 'Parallèle (aligné)'}
              </p>
            </div>
          )}

          {/* Points cliqués */}
          {clickedPoints.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Points cliqués: <span className="font-bold text-blue-600">{clickedPoints.length}</span>
                {currentStep.id === 'test-zone' && ' / 4'}
                {currentStep.id === 'transformer-alignment' && ' / 3'}
              </p>
              {currentStep.checkAlignment && (
                <div className="p-2 bg-gray-100 rounded text-sm">
                  {currentStep.checkAlignment(clickedPoints).message}
                </div>
              )}
            </div>
          )}

          {/* Instructions de zoom */}
          <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-xs text-yellow-800">
              💡 <span className="font-semibold">Astuce:</span> Utilisez la molette de la souris pour zoomer/dézoomer et mieux voir les points
            </p>
          </div>

          {/* Boutons de contrôle */}
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={() => {
                  setCurrentStepIndex(currentStepIndex - 1);
                  setClickedPoints([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded font-semibold text-sm transition-colors"
              >
                ← Précédent
              </button>
            )}
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold text-sm transition-colors"
            >
              Annuler
            </button>
            {isLastStep && (
              <button
                onClick={onComplete}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold text-sm transition-colors"
              >
                Terminer ✓
              </button>
            )}
          </div>
        </div>
      </Html>
    </>
  );
}

