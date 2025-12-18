import React, { useEffect, useState } from 'react';
import { ProjectConfig } from '../NewProjectModal';
import HearstCard from '../ui/HearstCard';

export interface PowerConfigStepProps {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
}

interface PowerCalculations {
  containers: number;
  transformers: number;
  powerBlocks: number;
  coolingModules: number;
  surfaceM2: number;
}

function calculatePowerNeeds(powerMW: number): PowerCalculations {
  const containers = Math.ceil(powerMW / 1.6);
  const transformers = Math.ceil(powerMW / 5);
  const powerBlocks = powerMW < 20 ? 0 : Math.ceil(powerMW / 25);
  const coolingModules = containers;
  const surfaceM2 = Math.ceil(powerMW * 50);

  return { containers, transformers, powerBlocks, coolingModules, surfaceM2 };
}

export default function PowerConfigStep({ config, onChange }: PowerConfigStepProps) {
  const [calculations, setCalculations] = useState<PowerCalculations | null>(null);

  useEffect(() => {
    const calc = calculatePowerNeeds(config.power_target_mw);
    setCalculations(calc);
  }, [config.power_target_mw]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-black mb-2">Configuration de Puissance</h3>
        <p className="text-sm text-gray-600">
          Définissez la puissance cible. Les calculs sont automatiques.
        </p>
      </div>

      {/* Slider de puissance */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <label className="block text-sm font-bold text-black mb-4">
          Puissance Cible (MW)
        </label>
        <input
          type="range"
          min="5"
          max="200"
          step="5"
          value={config.power_target_mw}
          onChange={(e) => onChange({ ...config, power_target_mw: parseInt(e.target.value) })}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>5 MW</span>
          <span className="text-3xl font-bold text-black">{config.power_target_mw} MW</span>
          <span>200 MW</span>
        </div>
      </div>

      {/* Puissance future */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Puissance future prévue (MW)
        </label>
        <input
          type="number"
          min={config.power_target_mw}
          value={config.future_power_mw}
          onChange={(e) => onChange({ ...config, future_power_mw: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        />
      </div>

      {/* Calculs automatiques */}
      {calculations && (
        <div>
          <h4 className="text-sm font-bold text-black mb-3">Équipements Nécessaires</h4>
          <div className="grid grid-cols-2 gap-4">
            <HearstCard>
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Conteneurs HD5</div>
                <div className="text-3xl font-bold text-black">{calculations.containers}</div>
                <div className="text-xs text-green-500 mt-1">
                  {(calculations.containers * 1.6).toFixed(1)} MW total
                </div>
              </div>
            </HearstCard>

            <HearstCard>
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Transformateurs</div>
                <div className="text-3xl font-bold text-black">{calculations.transformers}</div>
                <div className="text-xs text-green-500 mt-1">
                  {calculations.transformers * 5} MVA total
                </div>
              </div>
            </HearstCard>

            <HearstCard>
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Power Blocks</div>
                <div className="text-3xl font-bold text-black">{calculations.powerBlocks}</div>
                <div className="text-xs text-green-500 mt-1">
                  {calculations.powerBlocks > 0 ? `${calculations.powerBlocks * 25} MW` : 'Non requis'}
                </div>
              </div>
            </HearstCard>

            <HearstCard>
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Surface Requise</div>
                <div className="text-3xl font-bold text-black">{calculations.surfaceM2.toLocaleString()}</div>
                <div className="text-xs text-green-500 mt-1">m²</div>
              </div>
            </HearstCard>
          </div>
        </div>
      )}
    </div>
  );
}
