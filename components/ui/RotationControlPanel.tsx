import React from 'react';
import HearstPanel from './HearstPanel';
import HearstButton from './HearstButton';

export interface RotationControlPanelProps {
  rotation: [number, number, number];
  onRotationChange: (rotation: [number, number, number]) => void;
  onReset?: () => void;
  onApply?: () => void;
}

export default function RotationControlPanel({
  rotation,
  onRotationChange,
  onReset,
  onApply
}: RotationControlPanelProps) {
  const handleXChange = (value: number) => {
    onRotationChange([value, rotation[1], rotation[2]]);
  };

  const handleYChange = (value: number) => {
    onRotationChange([rotation[0], value, rotation[2]]);
  };

  const handleZChange = (value: number) => {
    onRotationChange([rotation[0], rotation[1], value]);
  };

  const toDegrees = (rad: number) => ((rad * 180) / Math.PI).toFixed(1);

  return (
    <HearstPanel position="bottom-right" width="320px">
      <div className="p-4">
        <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
          <span className="text-green-500">🔄</span>
          Contrôles de Rotation
        </h3>
        
        {/* Rotation X */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-600">X (Pitch)</label>
            <span className="text-xs font-bold text-black">{toDegrees(rotation[0])}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={Math.PI * 2} 
            step="0.01"
            value={rotation[0]}
            onChange={(e) => handleXChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        
        {/* Rotation Y */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-600">Y (Yaw)</label>
            <span className="text-xs font-bold text-black">{toDegrees(rotation[1])}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={Math.PI * 2} 
            step="0.01"
            value={rotation[1]}
            onChange={(e) => handleYChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        
        {/* Rotation Z */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-600">Z (Roll)</label>
            <span className="text-xs font-bold text-black">{toDegrees(rotation[2])}°</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={Math.PI * 2} 
            step="0.01"
            value={rotation[2]}
            onChange={(e) => handleZChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {onReset && (
            <HearstButton 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="flex-1"
            >
              Réinitialiser
            </HearstButton>
          )}
          {onApply && (
            <HearstButton 
              variant="primary" 
              size="sm" 
              onClick={onApply}
              className="flex-1"
            >
              Appliquer
            </HearstButton>
          )}
        </div>
      </div>
    </HearstPanel>
  );
}
