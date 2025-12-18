/**
 * Liste des Équipements
 * Affiche tous les équipements du projet avec possibilité de sélection
 */

import React, { useState } from 'react';
import { EquipmentPosition } from '../../lib/projectGenerator';

interface EquipmentListProps {
  equipment: EquipmentPosition[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EquipmentList({ equipment, selectedId, onSelect, onDelete }: EquipmentListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Grouper par type
  const groupedEquipment = equipment.reduce((acc, eq) => {
    if (!acc[eq.type]) acc[eq.type] = [];
    acc[eq.type].push(eq);
    return acc;
  }, {} as Record<string, EquipmentPosition[]>);

  const typeLabels: Record<string, string> = {
    transformer: 'Transformateurs',
    container: 'Containers',
    cooling: 'Refroidissement',
    switchgear: 'Switchgears',
    substation: 'Substations',
  };

  const typeIcons: Record<string, string> = {
    transformer: '⚡',
    container: '📦',
    cooling: '❄️',
    switchgear: '🔌',
    substation: '🏗️',
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="absolute top-6 left-6 z-10 w-12 h-12 bg-slate-900/90 backdrop-blur-xl border-2 border-[#8AFD81]/40 rounded-xl flex items-center justify-center hover:bg-slate-800/90 transition-all shadow-xl"
        title="Afficher la liste"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="absolute top-6 left-6 z-10 w-80">
      <div className="bg-slate-900/90 backdrop-blur-xl border-2 border-[#8AFD81]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#8AFD81]/20 bg-slate-800/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">Équipements</h3>
              <p className="text-[#8AFD81] text-xs font-medium">{equipment.length} objets</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/60 hover:text-white transition-colors p-1"
                title={isExpanded ? 'Réduire' : 'Développer'}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
                title="Masquer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Liste */}
        {isExpanded && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {Object.entries(groupedEquipment).map(([type, items]) => (
              <div key={type}>
                <div className="text-white/60 text-xs uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>{typeIcons[type]}</span>
                  <span>{typeLabels[type] || type}</span>
                  <span className="text-[#8AFD81]">({items.length})</span>
                </div>
                <div className="space-y-1">
                  {items.map((eq) => (
                    <div
                      key={eq.id}
                      onClick={() => onSelect(eq.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedId === eq.id
                          ? 'bg-[#8AFD81]/30 border-2 border-[#8AFD81] shadow-lg shadow-[#8AFD81]/20'
                          : 'bg-slate-800/60 border border-white/20 hover:bg-slate-700/60 hover:border-[#8AFD81]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium truncate">
                            {eq.modelId}
                          </div>
                          <div className="text-white/40 text-xs mt-1">
                            {eq.metadata?.powerBlockId && `Block ${eq.metadata.powerBlockId}`}
                            {eq.metadata?.transformerId && ` • T${eq.metadata.transformerId}`}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Supprimer cet équipement ?')) {
                              onDelete(eq.id);
                            }
                          }}
                          className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all"
                          title="Supprimer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {equipment.length === 0 && (
              <div className="text-center py-8 text-white/40">
                Aucun équipement
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

