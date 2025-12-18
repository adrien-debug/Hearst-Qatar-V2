/**
 * Toolbar Compacte - Outils Essentiels Uniquement
 * Sélection, Déplacement, Rotation, Suppression, Sauvegarde
 */

import React from 'react';

interface CompactToolbarProps {
  selectedObjectId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale' | null;
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale' | null) => void;
  onDelete: () => void;
  onSave: () => void;
  equipmentCount: number;
}

export default function CompactToolbar({
  selectedObjectId,
  transformMode,
  onTransformModeChange,
  onDelete,
  onSave,
  equipmentCount,
}: CompactToolbarProps) {
  const tools = [
    {
      id: 'select',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Sélectionner',
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
      label: 'Déplacer',
      action: () => onTransformModeChange('translate'),
      active: transformMode === 'translate',
    },
    {
      id: 'rotate',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Tourner',
      action: () => onTransformModeChange('rotate'),
      active: transformMode === 'rotate',
    },
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-[#8AFD81]/40 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Outils de transformation */}
          <div className="flex items-center gap-2 pr-4 border-r border-white/20">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all font-medium text-sm border ${
                  tool.active
                    ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/30 border-[#8AFD81]'
                    : 'bg-slate-800/60 text-white hover:bg-slate-700/60 hover:text-[#8AFD81] border-white/20'
                }`}
                title={tool.label}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pr-4 border-r border-white/20">
            {/* Supprimer */}
            <button
              onClick={onDelete}
              disabled={!selectedObjectId}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all font-medium text-sm border ${
                selectedObjectId
                  ? 'bg-red-500/30 text-red-200 hover:bg-red-500/40 border-red-500/50'
                  : 'bg-slate-800/60 text-white/40 border-white/20 opacity-50 cursor-not-allowed'
              }`}
              title="Supprimer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Supprimer</span>
            </button>
          </div>

          {/* Sauvegarde */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSave}
              className="px-5 py-3 rounded-xl flex items-center gap-2 transition-all font-bold text-sm bg-[#8AFD81] text-slate-900 hover:bg-[#7AED71] shadow-lg shadow-[#8AFD81]/30"
              title="Sauvegarder"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sauvegarder</span>
            </button>
          </div>

          {/* Compteur */}
          <div className="pl-4 border-l border-white/20">
            <div className="text-white/40 text-xs uppercase tracking-wide">Objets</div>
            <div className="text-[#8AFD81] text-lg font-bold">{equipmentCount}</div>
          </div>
        </div>

        {/* Info objet sélectionné */}
        {selectedObjectId && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-xs">
                Objet sélectionné: <span className="text-white font-medium">{selectedObjectId.split('-').slice(-2).join('-')}</span>
              </div>
              <div className="text-[#8AFD81] text-xs font-medium">
                {transformMode === 'translate' && '↔️ Mode Déplacement'}
                {transformMode === 'rotate' && '🔄 Mode Rotation'}
                {!transformMode && '🎯 Double-clic pour sélectionner'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}















