import React, { useState } from 'react';
import { ProjectConfig } from '../NewProjectModal';
import HearstModal from '../ui/HearstModal';
import HearstButton from '../ui/HearstButton';
import StepIndicator from './StepIndicator';
import ProjectInfoStep from './ProjectInfoStep';
import PowerConfigStep from './PowerConfigStep';
import PhasingStep from './PhasingStep';
import ValidationStep from './ValidationStep';

export interface DeploymentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: ProjectConfig) => void;
}

export default function DeploymentWizard({ isOpen, onClose, onComplete }: DeploymentWizardProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ProjectConfig>({
    project_name: '',
    country: '',
    power_target_mw: 50,
    future_power_mw: 100,
    energy_type: 'grid',
    mining_type: 'air',
    surface_limit_m2: null,
    phasing: []
  });

  const canProceed = () => {
    switch (step) {
      case 1:
        return config.project_name && config.country;
      case 2:
        return config.power_target_mw > 0;
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <HearstModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouveau Projet Mining"
      size="xl"
    >
      <div className="space-y-8">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          <StepIndicator number={1} title="Informations" active={step === 1} completed={step > 1} />
          <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
          <StepIndicator number={2} title="Puissance" active={step === 2} completed={step > 2} />
          <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
          <StepIndicator number={3} title="Phasage" active={step === 3} completed={step > 3} />
          <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
          <StepIndicator number={4} title="Validation" active={step === 4} completed={step > 4} />
        </div>

        {/* Contenu des étapes */}
        <div className="min-h-[400px]">
          {step === 1 && <ProjectInfoStep config={config} onChange={setConfig} />}
          {step === 2 && <PowerConfigStep config={config} onChange={setConfig} />}
          {step === 3 && <PhasingStep config={config} onChange={setConfig} />}
          {step === 4 && <ValidationStep config={config} />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <HearstButton
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            ← Précédent
          </HearstButton>

          <div className="text-sm text-gray-500">
            Étape {step} sur 4
          </div>

          <HearstButton
            variant={step === 4 ? 'secondary' : 'primary'}
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 4 ? '✓ Créer le Projet' : 'Suivant →'}
          </HearstButton>
        </div>
      </div>
    </HearstModal>
  );
}
