import React, { useState } from 'react';
import { SoilType, PowerType, EnergyType, createCustomDeployment, Deployment } from '../data/deployments';

interface ProjectInitFormProps {
  onComplete: (deployment: Deployment) => void;
  onCancel: () => void;
}

export default function ProjectInitForm({ onComplete, onCancel }: ProjectInitFormProps) {
  const [projectName, setProjectName] = useState('');
  const [soilType, setSoilType] = useState<SoilType>('neutral-sand');
  const [powerType, setPowerType] = useState<PowerType>('200MW');
  const [energyType, setEnergyType] = useState<EnergyType>('mixed');
  const [customPowerValue, setCustomPowerValue] = useState<number>(200);
  const [customEnergyDescription, setCustomEnergyDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Le nom du projet est requis';
    }

    if (powerType === 'custom' && (!customPowerValue || customPowerValue <= 0)) {
      newErrors.customPowerValue = 'Veuillez entrer une valeur de puissance valide';
    }

    if (energyType === 'custom' && !customEnergyDescription.trim()) {
      newErrors.customEnergyDescription = 'Veuillez décrire le type d\'énergie personnalisé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const deployment = createCustomDeployment(
      projectName,
      soilType,
      powerType,
      energyType,
      powerType === 'custom' ? customPowerValue : undefined,
      energyType === 'custom' ? customEnergyDescription : undefined
    );

    onComplete(deployment);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0b0d] border border-[#8AFD81]/20 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8AFD81]/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Nouveau Projet 3D</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du projet */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nom du projet *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] ${
                  errors.projectName ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="Ex: Projet Qatar 200MW"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-400">{errors.projectName}</p>
              )}
            </div>

            {/* Type de sol */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Type de sol
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(['neutral-sand', 'sandy', 'concrete', 'gravel', 'custom'] as SoilType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSoilType(type)}
                    className={`px-4 py-3 rounded-lg border transition-all ${
                      soilType === type
                        ? 'bg-[#8AFD81] text-[#0a0b0d] border-[#8AFD81]'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {type === 'neutral-sand' && 'Sable Neutre'}
                    {type === 'sandy' && 'Sable Désertique'}
                    {type === 'concrete' && 'Béton'}
                    {type === 'gravel' && 'Gravier'}
                    {type === 'custom' && 'Personnalisé'}
                  </button>
                ))}
              </div>
            </div>

            {/* Type de puissance */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Type de puissance
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(['50MW', '100MW', '200MW', '500MW', 'custom'] as PowerType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPowerType(type)}
                    className={`px-4 py-3 rounded-lg border transition-all ${
                      powerType === type
                        ? 'bg-[#8AFD81] text-[#0a0b0d] border-[#8AFD81]'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {powerType === 'custom' && (
                <div className="mt-3">
                  <input
                    type="number"
                    value={customPowerValue}
                    onChange={(e) => setCustomPowerValue(Number(e.target.value))}
                    min="1"
                    step="0.1"
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] ${
                      errors.customPowerValue ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Puissance en MW"
                  />
                  {errors.customPowerValue && (
                    <p className="mt-1 text-sm text-red-400">{errors.customPowerValue}</p>
                  )}
                </div>
              )}
            </div>

            {/* Type d'énergie */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Type d'énergie
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['solar', 'wind', 'mixed', 'custom'] as EnergyType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEnergyType(type)}
                    className={`px-4 py-3 rounded-lg border transition-all ${
                      energyType === type
                        ? 'bg-[#8AFD81] text-[#0a0b0d] border-[#8AFD81]'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {type === 'solar' && '☀️ Solaire'}
                    {type === 'wind' && '💨 Éolien'}
                    {type === 'mixed' && '🔋 Mixte'}
                    {type === 'custom' && '⚙️ Personnalisé'}
                  </button>
                ))}
              </div>
              {energyType === 'custom' && (
                <div className="mt-3">
                  <textarea
                    value={customEnergyDescription}
                    onChange={(e) => setCustomEnergyDescription(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] ${
                      errors.customEnergyDescription ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Décrivez le type d'énergie personnalisé"
                  />
                  {errors.customEnergyDescription && (
                    <p className="mt-1 text-sm text-red-400">{errors.customEnergyDescription}</p>
                  )}
                </div>
              )}
            </div>

            {/* Aperçu de la configuration */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-3">Aperçu de la configuration</h3>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Sol:</span>
                  <span className="text-[#8AFD81]">
                    {soilType === 'neutral-sand' && 'Sable Neutre'}
                    {soilType === 'sandy' && 'Sable Désertique'}
                    {soilType === 'concrete' && 'Béton'}
                    {soilType === 'gravel' && 'Gravier'}
                    {soilType === 'custom' && 'Personnalisé'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Puissance:</span>
                  <span className="text-[#8AFD81]">
                    {powerType === 'custom' ? `${customPowerValue}MW` : powerType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Énergie:</span>
                  <span className="text-[#8AFD81]">
                    {energyType === 'solar' && 'Solaire'}
                    {energyType === 'wind' && 'Éolien'}
                    {energyType === 'mixed' && 'Mixte'}
                    {energyType === 'custom' && customEnergyDescription}
                  </span>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#8AFD81] text-[#0a0b0d] rounded-lg hover:bg-[#8AFD81]/80 transition-all font-medium"
              >
                Créer le projet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



