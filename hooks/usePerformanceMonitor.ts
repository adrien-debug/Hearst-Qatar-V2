import { useState, useEffect } from 'react';
import { performanceMonitor, PerformanceMetrics, QualityLevel } from '../utils/performanceMonitor';

/**
 * Hook React pour utiliser le monitoring de performance
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    drawCalls: 0,
    triangles: 0,
    textures: 0,
  });

  const [quality, setQuality] = useState<QualityLevel>('high');

  useEffect(() => {
    const unsubscribe = performanceMonitor.onUpdate((newMetrics) => {
      setMetrics(newMetrics);
      setQuality(performanceMonitor.getQuality());
    });

    return unsubscribe;
  }, []);

  return { metrics, quality };
}
