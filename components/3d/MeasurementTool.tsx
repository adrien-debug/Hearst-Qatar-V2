import React, { useState, useEffect, useRef } from 'react';
import { Html, Line, Sphere } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MeasurementToolProps {
  onMeasureStart?: () => void;
  onMeasureEnd?: (distance: number) => void;
}

export const MeasurementTool = ({ onMeasureStart, onMeasureEnd }: MeasurementToolProps) => {
  const { camera, raycaster, gl } = useThree();
  const [isActive, setIsActive] = useState(false);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [mousePos, setMousePos] = useState<THREE.Vector3 | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('📐 MeasurementTool - État:', { isActive, pointsCount: points.length });

  // Style CSS pour le bouton flottant
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: isActive ? '#ff6b00' : '#2d3436',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Intersection avec le sol (Plan Y=0) ou objets
      // Pour l'instant, on se base sur un plan Y=0 pour simplifier
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);

      if (target) {
        setMousePos(target);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!isActive || !mousePos) return;
      // Empêcher la propagation pour ne pas sélectionner des objets derrière
      e.stopPropagation();

      console.log('📍 Clic de mesure - Points actuels:', points.length);

      if (points.length === 0) {
        console.log('📌 Premier point placé:', mousePos);
        setPoints([mousePos.clone()]);
        if (onMeasureStart) onMeasureStart();
      } else if (points.length === 1) {
        const p2 = mousePos.clone();
        const distance = points[0].distanceTo(p2);
        console.log('📏 Distance mesurée:', distance.toFixed(2), 'm');
        setPoints([points[0], p2]);
        setIsActive(false); // Désactive l'outil après la mesure
        if (onMeasureEnd) onMeasureEnd(distance);
      } else {
        // Reset si on clique alors qu'il y a déjà une mesure
        console.log('🔄 Reset de la mesure');
        setPoints([mousePos.clone()]);
      }
    };

    // Attacher les écouteurs au Canvas
    const canvas = gl.domElement;
    if (isActive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
      canvas.style.cursor = 'crosshair';
    } else {
      canvas.style.cursor = 'default';
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.style.cursor = 'default';
    };
  }, [isActive, mousePos, points, camera, raycaster, gl, onMeasureStart, onMeasureEnd]);

  const toggleActive = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic de se propager au canvas
    console.log('🔧 Bouton Mesure cliqué - État actuel:', isActive);
    
    if (isActive) {
      // Annuler
      console.log('❌ Désactivation de l\'outil de mesure');
      setIsActive(false);
      setPoints([]);
      setMousePos(null);
    } else {
      // Activer
      console.log('✅ Activation de l\'outil de mesure');
      setIsActive(true);
      setPoints([]); // Reset points
    }
  };

  const calculateDistance = (p1: THREE.Vector3, p2: THREE.Vector3) => {
    return p1.distanceTo(p2).toFixed(2);
  };

  // Rendu de la ligne dynamique (Point 1 -> Souris)
  const renderDynamicLine = () => {
    if (points.length === 1 && mousePos) {
      return (
        <>
          <Line points={[points[0], mousePos]} color="yellow" lineWidth={2} dashed dashScale={0.5} />
          <Html position={mousePos} style={{ pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(0,0,0,0.8)', color: 'yellow', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              {calculateDistance(points[0], mousePos)}m
            </div>
          </Html>
        </>
      );
    }
    return null;
  };

  // Rendu de la mesure finale
  const renderFinalMeasurement = () => {
    if (points.length === 2) {
      const midPoint = points[0].clone().add(points[1]).multiplyScalar(0.5);
      return (
        <>
          <Sphere position={points[0]} args={[0.3]} material={new THREE.MeshBasicMaterial({ color: '#ff6b00' })} />
          <Sphere position={points[1]} args={[0.3]} material={new THREE.MeshBasicMaterial({ color: '#ff6b00' })} />
          <Line points={[points[0], points[1]]} color="#ff6b00" lineWidth={3} />
          <Html position={midPoint}>
            <div style={{ 
              background: '#ff6b00', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {calculateDistance(points[0], points[1])}m
              <button 
                onClick={(e) => { e.stopPropagation(); setPoints([]); }}
                style={{ marginLeft: '8px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
          </Html>
        </>
      );
    }
    return null;
  };

  return (
    <group>
      {/* UI Bouton (Overlay HTML) */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', position: 'absolute', bottom: '20px', right: '20px' }}>
           <button onClick={toggleActive} style={buttonStyle} title="Outil de Mesure">
             <span>📏</span>
             <span>{isActive ? 'Annuler Mesure' : 'Mesurer'}</span>
           </button>
        </div>
      </Html>

      {/* Point de départ */}
      {points.length > 0 && (
        <Sphere position={points[0]} args={[0.2]} material={new THREE.MeshBasicMaterial({ color: 'yellow' })} />
      )}

      {/* Lignes et Labels */}
      {renderDynamicLine()}
      {renderFinalMeasurement()}
    </group>
  );
};


