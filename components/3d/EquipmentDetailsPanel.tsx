import React from 'react';
import { EquipmentPosition } from '../../lib/mining100MWGenerator';

interface EquipmentDetailsPanelProps {
  equipment: EquipmentPosition | null;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function EquipmentDetailsPanel({
  equipment,
  onClose,
  onDelete,
  onDuplicate,
}: EquipmentDetailsPanelProps) {
  if (!equipment) return null;

  return (
    <div className="fixed top-20 left-4 z-50 w-80 bg-[#0a0b0d]/95 backdrop-blur-md border border-[#2d3436] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-left-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d3436] bg-[#1a1b1d]">
        <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--hearst-green)]"></span>
          {equipment.type.toUpperCase().replace('-', ' ')}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        
        {/* ID Section */}
        <div>
          <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">Identifiant</label>
          <div className="font-mono text-sm text-[var(--hearst-green)] bg-black/50 p-2 rounded border border-[#2d3436] truncate">
            {equipment.id}
          </div>
        </div>

        {/* Position & Rotation */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">Position (m)</label>
            <div className="text-sm text-gray-200 bg-[#1a1b1d] p-2 rounded border border-[#2d3436] space-y-1 font-mono">
              <div className="flex justify-between"><span>X:</span> <span className="text-white">{equipment.position[0].toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Y:</span> <span className="text-white">{equipment.position[1].toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Z:</span> <span className="text-white">{equipment.position[2].toFixed(2)}</span></div>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">Rotation (°)</label>
            <div className="text-sm text-gray-200 bg-[#1a1b1d] p-2 rounded border border-[#2d3436] space-y-1 font-mono">
              <div className="flex justify-between"><span>X:</span> <span className="text-white">{(equipment.rotation[0] * 180 / Math.PI).toFixed(0)}°</span></div>
              <div className="flex justify-between"><span>Y:</span> <span className="text-white">{(equipment.rotation[1] * 180 / Math.PI).toFixed(0)}°</span></div>
              <div className="flex justify-between"><span>Z:</span> <span className="text-white">{(equipment.rotation[2] * 180 / Math.PI).toFixed(0)}°</span></div>
            </div>
          </div>
        </div>

        {/* Dimensions (si présentes) */}
        {equipment.dimensions && (
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">Dimensions (m)</label>
            <div className="text-sm text-white font-mono bg-[#1a1b1d] p-2 rounded border border-[#2d3436] flex justify-between">
              <span>L: {equipment.dimensions.length.toFixed(2)}</span>
              <span className="text-gray-500">|</span>
              <span>W: {equipment.dimensions.width.toFixed(2)}</span>
              <span className="text-gray-500">|</span>
              <span>H: {equipment.dimensions.height.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Metadata (si présentes) */}
        {equipment.metadata && Object.keys(equipment.metadata).length > 0 && (
          <div>
            <label className="text-[10px] uppercase text-gray-400 font-semibold mb-1 block">Propriétés</label>
            <div className="bg-[#1a1b1d] rounded border border-[#2d3436] overflow-hidden">
              {Object.entries(equipment.metadata).map(([key, value]) => {
                if (typeof value === 'object') return null; // Skip complex objects like gps for now
                return (
                  <div key={key} className="flex justify-between items-center p-2 border-b border-[#2d3436] last:border-0 text-xs">
                    <span className="text-gray-400 capitalize">{key}:</span>
                    <span className="text-white font-medium truncate ml-2 max-w-[150px]">{String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions Rapides */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onDuplicate}
            className="flex-1 py-2 px-3 bg-[#2d3436] hover:bg-[#3d4446] text-white text-xs font-bold uppercase rounded transition-colors flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Dupliquer
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2 px-3 bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 text-red-400 hover:text-red-300 text-xs font-bold uppercase rounded transition-colors flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Supprimer
          </button>
        </div>

      </div>
    </div>
  );
}
