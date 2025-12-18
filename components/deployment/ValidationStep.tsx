import React from 'react';
import { ProjectConfig } from '../NewProjectModal';
import HearstCard from '../ui/HearstCard';

export interface ValidationStepProps {
  config: ProjectConfig;
}

export default function ValidationStep({ config }: ValidationStepProps) {
  const totalPhasePower = config.phasing?.reduce((sum, p) => sum + p.power_mw, 0) || 0;
  const hasPhasing = config.phasing && config.phasing.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-black mb-2">Validation du Projet</h3>
        <p className="text-sm text-gray-600">
          Vérifiez les informations avant de créer le projet
        </p>
      </div>

      {/* Résumé du projet */}
      <HearstCard>
        <div className="p-6">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">
            <span className="text-green-500">📋</span>
            Résumé du Projet
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Nom du projet</div>
              <div className="font-bold text-black">{config.project_name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Pays</div>
              <div className="font-bold text-black">{config.country}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Puissance cible</div>
              <div className="font-bold text-green-600">{config.power_target_mw} MW</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Puissance future</div>
              <div className="font-bold text-black">{config.future_power_mw} MW</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Type d'énergie</div>
              <div className="font-bold text-black capitalize">{config.energy_type.replace('_', ' ')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Refroidissement</div>
              <div className="font-bold text-black capitalize">{config.mining_type}</div>
            </div>
          </div>
        </div>
      </HearstCard>

      {/* Phasage */}
      {hasPhasing && (
        <HearstCard>
          <div className="p-6">
            <h4 className="font-bold text-black mb-4 flex items-center gap-2">
              <span className="text-green-500">📅</span>
              Phasage ({config.phasing!.length} phases)
            </h4>
            <div className="space-y-2">
              {config.phasing!.map((phase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-black">Phase {phase.phase}</span>
                  <span className="font-bold text-green-600">{phase.power_mw} MW</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-500">
                <span className="font-bold text-black">Total</span>
                <span className="font-bold text-green-600">{totalPhasePower} MW</span>
              </div>
            </div>
          </div>
        </HearstCard>
      )}

      {/* Équipements calculés */}
      <HearstCard>
        <div className="p-6">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">
            <span className="text-green-500">⚙️</span>
            Équipements Nécessaires
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Conteneurs HD5</div>
              <div className="text-2xl font-bold text-black">
                {Math.ceil(config.power_target_mw / 1.6)}
              </div>
              <div className="text-xs text-green-500 mt-1">
                {(Math.ceil(config.power_target_mw / 1.6) * 1.6).toFixed(1)} MW
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Transformateurs</div>
              <div className="text-2xl font-bold text-black">
                {Math.ceil(config.power_target_mw / 5)}
              </div>
              <div className="text-xs text-green-500 mt-1">
                {Math.ceil(config.power_target_mw / 5) * 5} MVA
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Power Blocks</div>
              <div className="text-2xl font-bold text-black">
                {config.power_target_mw < 20 ? 0 : Math.ceil(config.power_target_mw / 25)}
              </div>
              <div className="text-xs text-green-500 mt-1">
                {config.power_target_mw < 20 ? 'Non requis' : `${Math.ceil(config.power_target_mw / 25) * 25} MW`}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Surface Requise</div>
              <div className="text-2xl font-bold text-black">
                {(config.power_target_mw * 50).toLocaleString()}
              </div>
              <div className="text-xs text-green-500 mt-1">m²</div>
            </div>
          </div>
        </div>
      </HearstCard>

      {/* Statut de validation */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
            ✓
          </div>
          <div>
            <div className="font-bold text-black">Projet prêt à être créé</div>
            <div className="text-sm text-gray-600 mt-1">
              Toutes les informations sont valides. Cliquez sur "Créer le Projet" pour générer le layout 3D.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
