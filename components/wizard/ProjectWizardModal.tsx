/**
 * Modal Wizard de création de projet
 * Flow complet : Puissance → Énergie → Terrain → Configurateur
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { PowerOption, EnergySource, TerrainType, ProjectWizardState } from '../../types/project-wizard';
import PowerSelection from './PowerSelection';
import EnergySelection from './EnergySelection';
import TerrainSelection from './TerrainSelection';

interface ProjectWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectWizardModal({ isOpen, onClose }: ProjectWizardModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPower, setSelectedPower] = useState<PowerOption | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergySource | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<TerrainType | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && selectedPower) {
      setStep(2);
    } else if (step === 2 && selectedEnergy) {
      setStep(3);
    } else if (step === 3 && selectedTerrain) {
      // Créer le projet et rediriger vers le configurateur
      const projectConfig = {
        power: selectedPower,
        energy: selectedEnergy,
        terrain: selectedTerrain,
      };
      // Sauvegarder dans localStorage
      localStorage.setItem('newProject', JSON.stringify(projectConfig));
      // Rediriger vers le configurateur (port 1111)
      window.location.href = 'http://localhost:1111/configurator';
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = 
    (step === 1 && selectedPower) ||
    (step === 2 && selectedEnergy) ||
    (step === 3 && selectedTerrain);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Modal */}
        <div className="bg-[#0a0b0d] rounded-2xl border-2 border-[#8AFD81]/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8AFD81]/20 to-transparent p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Nouveau Projet</h1>
                <p className="text-slate-400 text-sm">Étape {step}/3</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#8AFD81]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[400px]">
            {step === 1 && (
              <PowerSelection
                selectedPower={selectedPower}
                onSelect={setSelectedPower}
              />
            )}
            {step === 2 && (
              <EnergySelection
                selectedEnergy={selectedEnergy}
                onSelect={setSelectedEnergy}
              />
            )}
            {step === 3 && (
              <TerrainSelection
                selectedTerrain={selectedTerrain}
                onSelect={setSelectedTerrain}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-between">
            <button
              onClick={step === 1 ? onClose : handleBack}
              className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold"
            >
              {step === 1 ? 'Annuler' : '← Retour'}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                canProceed
                  ? 'bg-[#8AFD81] text-[#0a0b0d] hover:bg-[#6FD96A] shadow-lg hover:shadow-xl'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <span>{step === 3 ? 'Créer le Projet' : 'Suivant'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}














