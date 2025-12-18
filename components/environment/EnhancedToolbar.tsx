/**
 * Toolbar Améliorée avec Sélection d'Objets
 * Permet de sélectionner, déplacer, tourner, supprimer les équipements
 */

import React, { useState } from 'react';
import { EquipmentPosition } from '../../lib/projectGenerator';

interface EnhancedToolbarProps {
  equipment: EquipmentPosition[];
  selectedObjectId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale' | null;
  onSelectObject: (id: string) => void;
  onTransformModeChange: (mode: 'translate' | 'rotate' | 'scale' | null) => void;
  onDelete: () => void;
  onSave: () => void;
}

export default function EnhancedToolbar({
  equipment,
  selectedObjectId,
  transformMode,
  onSelectObject,
  onTransformModeChange,
  onDelete,
  onSave,
}: EnhancedToolbarProps) {
  const [activeTab, setActiveTab] = useState<'transformers' | 'containers' | 'cooling'>('transformers');

  // Grouper les équipements par type
  const transformers = equipment.filter(eq => eq.type === 'transformer');
  const containers = equipment.filter(eq => eq.type === 'container');
  const cooling = equipment.filter(eq => eq.type === 'cooling');

  const tabs = [
    { id: 'transformers' as const, label: 'Transformateurs', icon: '⚡', items: transformers },
    { id: 'containers' as const, label: 'Containers', icon: '📦', items: containers },
    { id: 'cooling' as const, label: 'Refroidissement', icon: '❄️', items: cooling },
  ];

  const activeItems = tabs.find(t => t.id === activeTab)?.items || [];
  const selectedObject = equipment.find(eq => eq.id === selectedObjectId);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-[#8AFD81]/40 rounded-2xl shadow-2xl">
          {/* Header avec outils */}
          <div className="p-4 border-b border-[#8AFD81]/20 flex items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/30'
                      : 'bg-slate-800/60 text-white hover:bg-slate-700/60 border border-white/20'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-60">({tab.items.length})</span>
                </button>
              ))}
            </div>

            {/* Outils de transformation */}
            <div className="flex items-center gap-2">
              <div className="text-white/40 text-xs uppercase tracking-wide mr-2">Outils:</div>
              
              <button
                onClick={() => onTransformModeChange(transformMode === 'translate' ? null : 'translate')}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  transformMode === 'translate'
                    ? 'bg-[#8AFD81] text-slate-900 shadow-lg'
                    : 'bg-slate-800/60 text-white hover:bg-slate-700/60 border border-white/20'
                }`}
                title="Déplacer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Déplacer
              </button>

              <button
                onClick={() => onTransformModeChange(transformMode === 'rotate' ? null : 'rotate')}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  transformMode === 'rotate'
                    ? 'bg-[#8AFD81] text-slate-900 shadow-lg'
                    : 'bg-slate-800/60 text-white hover:bg-slate-700/60 border border-white/20'
                }`}
                title="Tourner"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Tourner
              </button>

              <button
                onClick={onDelete}
                disabled={!selectedObjectId}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  selectedObjectId
                    ? 'bg-red-500/30 text-red-200 hover:bg-red-500/40 border border-red-500/50'
                    : 'bg-slate-800/60 text-white/40 border border-white/20 opacity-50 cursor-not-allowed'
                }`}
                title="Supprimer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Supprimer
              </button>

              <button
                onClick={onSave}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 bg-[#8AFD81] text-slate-900 hover:bg-[#7AED71] shadow-lg shadow-[#8AFD81]/30"
                title="Sauvegarder"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Liste des objets */}
          <div className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {activeItems.length === 0 ? (
                <div className="text-white/40 text-sm py-4 text-center w-full">
                  Aucun {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}
                </div>
              ) : (
                activeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectObject(item.id)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all border-2 ${
                      selectedObjectId === item.id
                        ? 'bg-[#8AFD81]/30 border-[#8AFD81] shadow-lg shadow-[#8AFD81]/20'
                        : 'bg-slate-800/60 border-white/20 hover:bg-slate-700/60 hover:border-[#8AFD81]/40'
                    }`}
                  >
                    <div className="text-white font-medium text-sm whitespace-nowrap">
                      {item.modelId.split('-').slice(-2).join('-')}
                    </div>
                    {item.metadata?.powerBlockId && (
                      <div className="text-white/40 text-xs mt-1">
                        Block {item.metadata.powerBlockId}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Info objet sélectionné */}
          {selectedObject && (
            <div className="px-4 pb-4">
              <div className="bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wide mb-1">
                      Objet Sélectionné
                    </div>
                    <div className="text-white font-medium text-sm">{selectedObject.modelId}</div>
                    <div className="text-white/60 text-xs mt-1">
                      Position: [{selectedObject.position[0].toFixed(1)}, {selectedObject.position[1].toFixed(1)}, {selectedObject.position[2].toFixed(1)}]
                    </div>
                  </div>
                  <div className="text-white/40 text-xs">
                    {transformMode === 'translate' && '↔️ Mode Déplacement'}
                    {transformMode === 'rotate' && '🔄 Mode Rotation'}
                    {transformMode === 'scale' && '⚖️ Mode Échelle'}
                    {!transformMode && '🎯 Mode Sélection'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}















