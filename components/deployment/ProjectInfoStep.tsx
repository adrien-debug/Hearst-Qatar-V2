import React from 'react';
import { ProjectConfig } from '../NewProjectModal';

export interface ProjectInfoStepProps {
  config: ProjectConfig;
  onChange: (config: ProjectConfig) => void;
}

const COUNTRIES = ['Qatar', 'UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman', 'USA', 'Canada', 'Other'];
const ENERGY_TYPES = [
  { value: 'grid', label: 'Réseau électrique' },
  { value: 'generator', label: 'Générateur' },
  { value: 'solar', label: 'Solaire' },
  { value: 'wind', label: 'Éolien' },
  { value: 'flare_gas', label: 'Gaz de torchère' },
  { value: 'biogas', label: 'Biogaz' }
];

export default function ProjectInfoStep({ config, onChange }: ProjectInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-black mb-4">Informations du Projet</h3>
        <p className="text-sm text-gray-600 mb-6">
          Commencez par renseigner les informations de base de votre projet mining.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Nom du projet */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input
            type="text"
            required
            value={config.project_name}
            onChange={(e) => onChange({ ...config, project_name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
            placeholder="Ex: Qatar Mining 100MW"
          />
        </div>

        {/* Pays */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pays *
          </label>
          <select
            required
            value={config.country}
            onChange={(e) => onChange({ ...config, country: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
          >
            <option value="">Sélectionner...</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Type d'énergie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'énergie *
          </label>
          <select
            required
            value={config.energy_type}
            onChange={(e) => onChange({ ...config, energy_type: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
          >
            {ENERGY_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Type de mining */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de refroidissement *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onChange({ ...config, mining_type: 'air' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                config.mining_type === 'air'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">💨</div>
              <div className="font-bold text-black">Air Cooling</div>
              <div className="text-xs text-gray-600 mt-1">Refroidissement par air</div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, mining_type: 'immersion' })}
              className={`p-4 border-2 rounded-lg transition-all ${
                config.mining_type === 'immersion'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-2xl mb-2">💧</div>
              <div className="font-bold text-black">Immersion Cooling</div>
              <div className="text-xs text-gray-600 mt-1">Refroidissement par immersion</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
