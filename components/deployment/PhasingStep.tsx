import React from 'react';
import { ProjectConfig } from '../NewProjectModal';
import HearstButton from '../ui/HearstButton';
import HearstCard from '../ui/HearstCard';

export interface PhasingStepProps {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
}

export default function PhasingStep({ config, onChange }: PhasingStepProps) {
  const phases = config.phasing || [];

  const addPhase = () => {
    const newPhases = [...phases, { phase: phases.length + 1, power_mw: 0 }];
    onChange({ ...config, phasing: newPhases });
  };

  const removePhase = (index: number) => {
    const newPhases = phases.filter((_, i) => i !== index).map((p, i) => ({
      ...p,
      phase: i + 1
    }));
    onChange({ ...config, phasing: newPhases });
  };

  const updatePhase = (index: number, power_mw: number) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], power_mw };
    onChange({ ...config, phasing: newPhases });
  };

  const totalPower = phases.reduce((sum, p) => sum + p.power_mw, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-black">Configuration du Phasage</h3>
          <p className="text-sm text-gray-600 mt-1">
            Divisez votre projet en phases de déploiement (optionnel)
          </p>
        </div>
        <HearstButton variant="secondary" onClick={addPhase} size="sm">
          + Ajouter une Phase
        </HearstButton>
      </div>

      {phases.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-gray-600 mb-4">Aucune phase définie</p>
          <p className="text-sm text-gray-500 mb-6">
            Le projet sera déployé en une seule fois
          </p>
          <HearstButton variant="primary" onClick={addPhase}>
            Créer un Phasage
          </HearstButton>
        </div>
      ) : (
        <>
          {/* Timeline des phases */}
          <div className="relative">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-start gap-4 mb-6">
                {/* Indicateur de phase */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {phase.phase}
                  </div>
                  {index < phases.length - 1 && (
                    <div className="w-0.5 h-16 bg-green-500 mt-2" />
                  )}
                </div>

                {/* Configuration de la phase */}
                <HearstCard className="flex-1">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-black">Phase {phase.phase}</h4>
                      <button
                        onClick={() => removePhase(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-600">Puissance (MW)</label>
                        <input
                          type="number"
                          min="0"
                          value={phase.power_mw}
                          onChange={(e) => updatePhase(index, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        />
                      </div>

                      {/* Calculs pour cette phase */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-600">Conteneurs</div>
                          <div className="font-bold text-black">
                            {Math.ceil(phase.power_mw / 1.6)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-600">Transformateurs</div>
                          <div className="font-bold text-black">
                            {Math.ceil(phase.power_mw / 5)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-600">Surface</div>
                          <div className="font-bold text-black">
                            {(phase.power_mw * 50).toFixed(0)} m²
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </HearstCard>
              </div>
            ))}
          </div>

          {/* Résumé total */}
          <HearstCard className="bg-green-50">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black">Total de toutes les phases</span>
                <span className="text-2xl font-bold text-green-600">
                  {totalPower} MW
                </span>
              </div>
              {totalPower !== config.power_target_mw && (
                <div className="mt-2 text-sm text-orange-600">
                  ⚠️ Le total ({totalPower} MW) diffère de la cible ({config.power_target_mw} MW)
                </div>
              )}
            </div>
          </HearstCard>
        </>
      )}
    </div>
  );
}
