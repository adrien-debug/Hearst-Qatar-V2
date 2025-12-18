/**
 * Plan2DOverlay - Overlay du plan 2D de circulation et maintenance
 * Affiche le plan 2D comme référence dans la vue 3D
 */

import React, { useEffect, useRef, useState } from 'react';

interface Plan2DOverlayProps {
  visible?: boolean;
  onClose?: () => void;
}

export default function Plan2DOverlay({ visible = true, onClose }: Plan2DOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCirculation, setShowCirculation] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !visible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions du canvas
    canvas.width = 1600;
    canvas.height = 700;

    // Échelle : 1 mètre = 10 pixels
    const SCALE = 10;
    const ORIGIN_X = 50;
    const ORIGIN_Y = 350;

    // Dimensions réelles (mètres)
    const DIMS = {
      transformer: { w: 2.5, h: 2.5 },
      container: { w: 12.196, h: 2.896 },
      slab: { w: 13, h: 3.5 },
      guard: { w: 4, h: 4 },
      gate: { w: 6, h: 1 }
    };

    // DISPOSITION EXACTE : 6 transformateurs + 12 containers (2 par transfo)
    const line1 = {
      transformers: [
        { id: 'TT1', x: 10, y: 20 },
        { id: 'TT4', x: 70, y: 20 }
      ],
      containers: [
        { id: 'TT1_A', x: 30, y: 24, type: 'A' },
        { id: 'TT1_B', x: 30, y: 16, type: 'B' },
        { id: 'TT4_A', x: 50, y: 24, type: 'A' },
        { id: 'TT4_B', x: 50, y: 16, type: 'B' }
      ]
    };

    const line2 = {
      transformers: [
        { id: 'TT2', x: 10, y: 0 },
        { id: 'TT5', x: 70, y: 0 }
      ],
      containers: [
        { id: 'TT2_A', x: 30, y: 4, type: 'A' },
        { id: 'TT2_B', x: 30, y: -4, type: 'B' },
        { id: 'TT5_A', x: 50, y: 4, type: 'A' },
        { id: 'TT5_B', x: 50, y: -4, type: 'B' }
      ]
    };

    const line3 = {
      transformers: [
        { id: 'TT3', x: 10, y: -20 },
        { id: 'TT6', x: 70, y: -20 }
      ],
      containers: [
        { id: 'TT3_A', x: 30, y: -16, type: 'A' },
        { id: 'TT3_B', x: 30, y: -24, type: 'B' },
        { id: 'TT6_A', x: 50, y: -16, type: 'A' },
        { id: 'TT6_B', x: 50, y: -24, type: 'B' }
      ]
    };

    const transformers = [...line1.transformers, ...line2.transformers, ...line3.transformers];
    const containers = [...line1.containers, ...line2.containers, ...line3.containers];

    function toCanvas(x: number, y: number) {
      return {
        x: ORIGIN_X + (x * SCALE),
        y: ORIGIN_Y - (y * SCALE)
      };
    }

    function drawRect(x: number, y: number, w: number, h: number, fillColor: string, strokeColor: string, strokeWidth = 2, label = '') {
      if (!ctx) return;
      const pos = toCanvas(x, y);
      const width = w * SCALE;
      const height = h * SCALE;

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;

      ctx.fillRect(pos.x - width/2, pos.y - height/2, width, height);
      ctx.strokeRect(pos.x - width/2, pos.y - height/2, width, height);

      if (label) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, pos.x, pos.y);
      }
    }

    function drawPerimeter() {
      if (!showCirculation || !ctx) return;

      ctx.strokeStyle = '#FF5722';
      ctx.lineWidth = 4;
      ctx.setLineDash([]);
      const perimPos = toCanvas(40, 0);
      ctx.strokeRect(perimPos.x - 75*SCALE/2, perimPos.y - 50*SCALE/2, 75*SCALE, 50*SCALE);
    }

    function drawEntrance() {
      if (!showCirculation) return;

      drawRect(30, 30, 2, 5, '#FFC107', '#FF9800', 2, '');
      drawRect(40, 30, 2, 5, '#FFC107', '#FF9800', 2, '');
      drawRect(50, 30, 2, 5, '#FFC107', '#FF9800', 2, '');

      drawRect(5, 25, 5, 5, '#2196F3', '#1565C0', 2, 'GARDE');
    }

    function drawCirculation() {
      if (!showCirculation) return;

      drawRect(40, 0, 6, 50, 'rgba(255, 152, 0, 0.4)', '#FF9800', 3);
      drawRect(40, 10, 70, 4, 'rgba(255, 152, 0, 0.3)', '#FFA726', 2);
      drawRect(40, -10, 70, 4, 'rgba(255, 152, 0, 0.3)', '#FFA726', 2);

      containers.forEach(cont => {
        const w = DIMS.container.w + 6;
        const h = DIMS.container.h + 6;
        drawRect(cont.x, cont.y, w, h, 'rgba(255, 213, 79, 0.25)', '#FFD54F', 2);
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fond
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grille
      ctx.strokeStyle = 'rgba(138, 253, 129, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += SCALE * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += SCALE * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      drawPerimeter();
      drawEntrance();
      drawCirculation();

      // Dalles béton
      containers.forEach(cont => {
        drawRect(cont.x, cont.y, DIMS.slab.w, DIMS.slab.h, 'rgba(158, 158, 158, 0.5)', '#757575', 2);
      });

      // Containers
      containers.forEach(cont => {
        drawRect(cont.x, cont.y, DIMS.container.w, DIMS.container.h, '#8AFD81', '#4CAF50', 2, cont.type);
      });

      // Transformateurs
      transformers.forEach(tr => {
        drawRect(tr.x, tr.y, DIMS.transformer.w, DIMS.transformer.h, '#2196F3', '#1976D2', 2, tr.id);
      });
    }

    draw();
  }, [showCirculation, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#2a2a2a] rounded-xl shadow-2xl max-w-[95vw] max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#8AFD81] mb-2">Plan Circulation et Maintenance</h2>
              <p className="text-white/60 text-sm">Disposition réelle de votre site - 6 transformateurs + 12 containers</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowCirculation(false)}
              className={`px-6 py-2 rounded-lg border-2 transition-all ${
                !showCirculation
                  ? 'bg-[#8AFD81] border-[#8AFD81] text-[#1a1a1a] font-semibold'
                  : 'bg-transparent border-[#8AFD81] text-[#8AFD81] hover:bg-[#8AFD81]/10'
              }`}
            >
              Sans Allées
            </button>
            <button
              onClick={() => setShowCirculation(true)}
              className={`px-6 py-2 rounded-lg border-2 transition-all ${
                showCirculation
                  ? 'bg-[#8AFD81] border-[#8AFD81] text-[#1a1a1a] font-semibold'
                  : 'bg-transparent border-[#8AFD81] text-[#8AFD81] hover:bg-[#8AFD81]/10'
              }`}
            >
              Avec Allées Béton
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="p-6">
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden mb-6">
            <canvas ref={canvasRef} className="w-full h-auto" />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#2196F3] border-2 border-[#1976D2]"></div>
              <span className="text-white text-sm">Transformateur PT-Substation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#8AFD81] border-2 border-[#4CAF50]"></div>
              <span className="text-white text-sm">Container ANTSPACE HD5</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#9E9E9E] border-2 border-[#757575]"></div>
              <span className="text-white text-sm">Dalle Béton 40cm</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FFA726] border-2 border-[#FF9800]"></div>
              <span className="text-white text-sm">Allée Principale (6m)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#FFD54F] border-2 border-[#FFC107]"></div>
              <span className="text-white text-sm">Allée Périmétrique (3m)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border-4 border-[#FF5722]"></div>
              <span className="text-white text-sm">Périmètre Sécurité</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-2 border-white/10">
              <h3 className="text-[#8AFD81] text-xs uppercase mb-2">Transformateurs</h3>
              <div className="text-3xl font-bold text-white">6</div>
              <div className="text-white/60 text-xs mt-1">PT-Substation Ultra</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-2 border-white/10">
              <h3 className="text-[#8AFD81] text-xs uppercase mb-2">Containers</h3>
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-white/60 text-xs mt-1">ANTSPACE HD5</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-2 border-white/10">
              <h3 className="text-[#8AFD81] text-xs uppercase mb-2">Surface Béton</h3>
              <div className="text-3xl font-bold text-white">
                {showCirculation ? '1,950' : '0'} m²
              </div>
              <div className="text-white/60 text-xs mt-1">
                {showCirculation ? 'Allées complètes' : 'Sans allées'}
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-2 border-white/10">
              <h3 className="text-[#8AFD81] text-xs uppercase mb-2">Volume Béton</h3>
              <div className="text-3xl font-bold text-white">
                {showCirculation ? '488' : '0'} m³
              </div>
              <div className="text-white/60 text-xs mt-1">Épaisseur 25cm</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-2 border-white/10">
              <h3 className="text-[#8AFD81] text-xs uppercase mb-2">Accès Maintenance</h3>
              <div className="text-2xl font-bold text-white">
                {showCirculation ? 'Complet' : 'Limité'}
              </div>
              <div className="text-white/60 text-xs mt-1">
                {showCirculation ? 'Accès 360°' : 'Sans allées'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



