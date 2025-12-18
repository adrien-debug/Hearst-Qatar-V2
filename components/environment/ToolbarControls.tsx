/**
 * Toolbar de Contrôles 3D
 * Outils pour manipuler les équipements (sélection, déplacement, rotation, suppression)
 */

import React from 'react';

interface ToolbarControlsProps {
  selectedObjectId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale' | null;
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale' | null) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onClearSelection: () => void;
  equipmentCount: number;
}

export default function ToolbarControls({
  selectedObjectId,
  transformMode,
  onTransformModeChange,
  onDelete,
  onDuplicate,
  onClearSelection,
  equipmentCount,
}: ToolbarControlsProps) {
  const tools = [
    {
      id: 'select',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Select',
      action: () => onTransformModeChange(null),
      active: transformMode === null,
    },
    {
      id: 'move',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Move',
      action: () => onTransformModeChange('translate'),
      active: transformMode === 'translate',
      disabled: !selectedObjectId,
    },
    {
      id: 'rotate',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Rotate',
      action: () => onTransformModeChange('rotate'),
      active: transformMode === 'rotate',
      disabled: !selectedObjectId,
    },
    {
      id: 'scale',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Scale',
      action: () => onTransformModeChange('scale'),
      active: transformMode === 'scale',
      disabled: !selectedObjectId,
    },
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-[#0a0b0d]/95 border-2 border-[#8AFD81]/40 rounded-2xl p-4 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Outils de transformation */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/20">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                disabled={tool.disabled}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  tool.active
                    ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30'
                    : tool.disabled
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20 hover:text-[#8AFD81]'
                }`}
                title={tool.label}
              >
                {tool.icon}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dupliquer */}
            {onDuplicate && (
              <button
                onClick={onDuplicate}
                disabled={!selectedObjectId}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  selectedObjectId
                    ? 'bg-white/10 text-white hover:bg-[#8AFD81]/20 hover:text-[#8AFD81]'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                title="Duplicate"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Supprimer */}
            <button
              onClick={onDelete}
              disabled={!selectedObjectId}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                selectedObjectId
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
              title="Delete"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Désélectionner */}
            {selectedObjectId && (
              <button
                onClick={onClearSelection}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-white/10 text-white hover:bg-white/20"
                title="Clear Selection"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Compteur */}
          <div className="pl-3 border-l border-white/20">
            <div className="text-white/40 text-xs uppercase tracking-wide mb-1">Objects</div>
            <div className="text-[#8AFD81] text-lg font-bold">{equipmentCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
