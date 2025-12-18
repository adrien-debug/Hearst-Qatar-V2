import React, { useState, useEffect } from 'react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (projectData: ProjectConfig) => void;
}

export interface ProjectConfig {
  project_name: string;
  country: string;
  power_target_mw: number;
  future_power_mw: number;
  energy_type: string;
  mining_type: 'air' | 'immersion';
  surface_limit_m2: number | null;
  phasing: Array<{ phase: number; power_mw: number }>;
  soil_type?: string; // Type de sol (optionnel, défini après)
}

const ENERGY_TYPES = ['grid', 'generator', 'solar', 'wind', 'flare_gas', 'biogas'];
const MINING_TYPES = ['air', 'immersion'] as const;

export default function NewProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: NewProjectModalProps) {
  const [formData, setFormData] = useState<ProjectConfig>({
    project_name: '',
    country: '',
    power_target_mw: 50,
    future_power_mw: 100,
    energy_type: 'grid',
    mining_type: 'air',
    surface_limit_m2: null,
    phasing: [],
  });
  const [hasSurfaceLimit, setHasSurfaceLimit] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ne pas générer l'Excel maintenant, juste sauvegarder les données
    // Le layout 3D sera généré après la sélection du type de sol
    onProjectCreated(formData);
    onClose();
  };

  const addPhase = () => {
    const phaseNumber = formData.phasing.length + 1;
    setFormData({
      ...formData,
      phasing: [
        ...formData.phasing,
        { phase: phaseNumber, power_mw: 0 },
      ],
    });
  };

  const removePhase = (index: number) => {
    setFormData({
      ...formData,
      phasing: formData.phasing.filter((_, i) => i !== index).map((p, i) => ({
        ...p,
        phase: i + 1,
      })),
    });
  };

  const updatePhase = (index: number, power_mw: number) => {
    const newPhasing = [...formData.phasing];
    newPhasing[index] = { ...newPhasing[index], power_mw };
    setFormData({ ...formData, phasing: newPhasing });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-[8px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="bg-[#8AFD81] text-black p-6 rounded-t-[8px]">
          <h2 className="text-2xl font-bold text-[#0b1120]">Nouveau Projet Mining</h2>
          <p className="text-[#0b1120]/80 mt-1">Configurez votre projet et générez automatiquement l'Excel et le layout 3D</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1120] mb-2">
                Nom du projet *
              </label>
              <input
                type="text"
                required
                value={formData.project_name}
                onChange={(e) =>
                  setFormData({ ...formData, project_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
                placeholder="Ex: Qatar Mining 200MW"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1120] mb-2">
                Pays *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
                placeholder="Ex: Qatar"
              />
            </div>
          </div>

          {/* Puissances */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1120] mb-2">
                Puissance IT cible (MW) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.power_target_mw}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    power_target_mw: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1120] mb-2">
                Puissance future (MW)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.future_power_mw}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    future_power_mw: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
              />
            </div>
          </div>

          {/* Type d'énergie et mining */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1120] mb-2">
                Type d'énergie *
              </label>
              <select
                required
                value={formData.energy_type}
                onChange={(e) =>
                  setFormData({ ...formData, energy_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
              >
                {ENERGY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1120] mb-2">
                Type mining *
              </label>
              <select
                required
                value={formData.mining_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mining_type: e.target.value as 'air' | 'immersion',
                  })
                }
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
              >
                <option value="air">Air</option>
                <option value="immersion">Immersion</option>
              </select>
            </div>
          </div>

          {/* Restriction surface */}
          <div>
            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={hasSurfaceLimit}
                onChange={(e) => {
                  setHasSurfaceLimit(e.target.checked);
                  if (!e.target.checked) {
                    setFormData({ ...formData, surface_limit_m2: null });
                  }
                }}
                className="rounded border-[#e2e8f0] text-[#8AFD81] focus:ring-[#8AFD81]"
              />
              <span className="text-sm font-medium text-[#0b1120]">
                Restriction de surface
              </span>
            </label>
            {hasSurfaceLimit && (
              <input
                type="number"
                min="0"
                step="1"
                value={formData.surface_limit_m2 || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    surface_limit_m2: parseFloat(e.target.value) || null,
                  })
                }
                placeholder="Surface max (m²)"
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors mt-2"
              />
            )}
          </div>

          {/* Phasage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-[#0b1120]">
                Phasage du chantier
              </label>
              <button
                type="button"
                onClick={addPhase}
                className="text-sm text-[#8AFD81] hover:text-[#6FD96A] font-medium transition-colors"
              >
                + Ajouter une phase
              </button>
            </div>
            {formData.phasing.length > 0 && (
              <div className="space-y-2">
                {formData.phasing.map((phase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-[#64748b] w-20">
                      Phase {phase.phase}:
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={phase.power_mw}
                      onChange={(e) =>
                        updatePhase(index, parseFloat(e.target.value) || 0)
                      }
                      placeholder="Puissance (MW)"
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-[8px] focus:ring-2 focus:ring-[#8AFD81] focus:border-[#8AFD81] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removePhase(index)}
                      className="px-3 py-2 text-[#64748b] hover:text-[#0b1120] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#64748b] bg-[#f8f9fa] hover:bg-[#e2e8f0] rounded-[8px] transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2 bg-[#8AFD81] hover:bg-[#6FD96A] text-black font-semibold rounded-[8px] transition-colors disabled:bg-[#64748b] disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Génération en cours...
                </>
              ) : (
                '🚀 Créer le projet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

