/**
 * Wizard de Création de Projet
 * Interface pour sélectionner la puissance et créer un projet modulaire
 */

import React, { useState } from 'react';
import { generateProjectConfig, ProjectConfiguration } from '../../lib/projectGenerator';
import projectTemplates from '../../config/project-templates.json';

interface ProjectWizardProps {
  onComplete: (config: ProjectConfiguration) => void;
  onCancel?: () => void;
}

const POWER_OPTIONS = [5, 10, 25, 50, 75, 100, 125, 150, 175, 200] as const;
type PowerOption = typeof POWER_OPTIONS[number];

type SoilType = 'sandy' | 'concrete' | 'gravel' | 'rocky';
type ClimateType = 'desert' | 'temperate' | 'tropical' | 'cold';
type CoolingType = 'air' | 'hydro' | 'immersion';

export default function ProjectWizard({ onComplete, onCancel }: ProjectWizardProps) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [selectedPower, setSelectedPower] = useState<PowerOption>(100);
  const [soilType, setSoilType] = useState<SoilType>('sandy');
  const [climateType, setClimateType] = useState<ClimateType>('desert');
  const [coolingType, setCoolingType] = useState<CoolingType>('hydro');
  const [hasConcreteSlabs, setHasConcreteSlabs] = useState(true);
  const [hasCirculation, setHasCirculation] = useState(true);
  const [hasMicroPerforatedWall, setHasMicroPerforatedWall] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const powerConfig = projectTemplates.power_configurations[selectedPower.toString() as keyof typeof projectTemplates.power_configurations];

  const handleNext = () => {
    if (step === 1) {
      if (!projectName.trim()) {
        setError('Veuillez entrer un nom de projet');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleCreate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Préparer les conditions du site
      const conditions = {
        soilType,
        climateType,
        coolingType,
        hasConcreteSlabs,
        hasCirculation,
        hasMicroPerforatedWall,
      };
      
      // Générer la configuration complète avec conditions
      const config = generateProjectConfig(projectName, selectedPower, conditions);
      
      // Simuler un délai pour l'effet visuel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onComplete(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0b0d] border-2 border-[#8AFD81]/40 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Style Hearst */}
        <div className="p-10 border-b border-white/10 bg-gradient-to-br from-[#0a0b0d] to-[#1a1b1d]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wider mb-1">Hearst Corporation</div>
                <h2 className="text-4xl font-bold text-white">Nouveau Projet</h2>
                <p className="text-white/50 text-sm mt-1">Configuration modulaire 5-200MW</p>
              </div>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-white/40 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-xl"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Progress Steps - Style Hearst */}
          <div className="flex items-center gap-3 mt-10">
            {[
              { num: 1, label: 'Name' },
              { num: 2, label: 'Power' },
              { num: 3, label: 'Conditions' },
              { num: 4, label: 'Infrastructure' },
              { num: 5, label: 'Overview' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-3 transition-all duration-300 ${s.num <= step ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    s.num < step ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30' : 
                    s.num === step ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg shadow-[#8AFD81]/30 scale-110' : 
                    'bg-white/10 text-white/60 border border-white/20'
                  }`}>
                    {s.num < step ? '✓' : s.num}
                  </div>
                  <span className="text-white text-sm font-medium uppercase tracking-wide">
                    {s.label}
                  </span>
                </div>
                {idx < 4 && <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${s.num < step ? 'bg-[#8AFD81]' : 'bg-white/10'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          {/* Step 1: Nom du projet */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3 text-lg">
                  Nom du projet
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ex: Projet Qatar 100MW"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] focus:border-transparent text-lg"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-red-400 text-sm">{error}</p>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-medium mb-3">À propos</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Ce wizard vous permet de créer un projet modulaire basé sur des blocs de 25MW. 
                  Tous les équipements seront automatiquement placés avec l'infrastructure VRD complète 
                  (routes, mur d'enceinte, poste de garde, hangar de maintenance).
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Sélection puissance */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-4 text-lg">
                  Sélectionnez la puissance
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {POWER_OPTIONS.map((power) => {
                    const config = projectTemplates.power_configurations[power.toString() as keyof typeof projectTemplates.power_configurations];
                    return (
                      <button
                        key={power}
                        onClick={() => setSelectedPower(power)}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          selectedPower === power
                            ? 'bg-[#8AFD81]/20 border-[#8AFD81] shadow-lg shadow-[#8AFD81]/20'
                            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-3xl font-bold text-white mb-2">{power}MW</div>
                        <div className="text-white/60 text-sm">
                          {Math.ceil(power / 25)} module{Math.ceil(power / 25) > 1 ? 's' : ''}
                        </div>
                        <div className="text-white/40 text-xs mt-2">
                          {config.transformers} transformers • {config.containers} containers
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {powerConfig && (
                <div className="bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-xl p-6">
                  <h3 className="text-[#8AFD81] font-medium mb-3">Configuration {selectedPower}MW</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-white/70">
                      <span className="font-medium text-white">Modules:</span> {Math.ceil(selectedPower / 25)} × 25MW
                    </div>
                    <div className="text-white/70">
                      <span className="font-medium text-white">Transformers:</span> {powerConfig.transformers}
                    </div>
                    <div className="text-white/70">
                      <span className="font-medium text-white">Containers:</span> {powerConfig.containers}
                    </div>
                    <div className="text-white/70">
                      <span className="font-medium text-white">Cooling:</span> {powerConfig.cooling} systèmes
                    </div>
                    <div className="text-white/70">
                      <span className="font-medium text-white">Terrain:</span> {powerConfig.groundSize}m²
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Conditions du site */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-4 text-lg">
                  Type de sol
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'sandy' as SoilType, label: 'Sable (Sandy)', desc: 'Désert Qatar - Standard' },
                    { value: 'concrete' as SoilType, label: 'Béton (Concrete)', desc: 'Dalle préparée' },
                    { value: 'gravel' as SoilType, label: 'Gravier (Gravel)', desc: 'Drainage naturel' },
                    { value: 'rocky' as SoilType, label: 'Rocheux (Rocky)', desc: 'Fondations complexes' },
                  ].map((soil) => (
                    <button
                      key={soil.value}
                      onClick={() => setSoilType(soil.value)}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        soilType === soil.value
                          ? 'bg-[#8AFD81]/20 border-[#8AFD81] shadow-lg shadow-[#8AFD81]/20'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-white font-semibold mb-1">{soil.label}</div>
                      <div className="text-white/50 text-xs">{soil.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-4 text-lg">
                  Type de climat
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'desert' as ClimateType, label: 'Désert (Desert)', desc: 'Qatar - Haute température' },
                    { value: 'temperate' as ClimateType, label: 'Tempéré (Temperate)', desc: '4 saisons' },
                    { value: 'tropical' as ClimateType, label: 'Tropical', desc: 'Humide et chaud' },
                    { value: 'cold' as ClimateType, label: 'Froid (Cold)', desc: 'Températures basses' },
                  ].map((climate) => (
                    <button
                      key={climate.value}
                      onClick={() => setClimateType(climate.value)}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        climateType === climate.value
                          ? 'bg-[#8AFD81]/20 border-[#8AFD81] shadow-lg shadow-[#8AFD81]/20'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-white font-semibold mb-1">{climate.label}</div>
                      <div className="text-white/50 text-xs">{climate.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-4 text-lg">
                  Type de refroidissement
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'air' as CoolingType, label: 'Air', desc: 'Ventilation' },
                    { value: 'hydro' as CoolingType, label: 'Hydro', desc: 'Liquide (recommandé)' },
                    { value: 'immersion' as CoolingType, label: 'Immersion', desc: 'Haute performance' },
                  ].map((cooling) => (
                    <button
                      key={cooling.value}
                      onClick={() => setCoolingType(cooling.value)}
                      className={`p-5 rounded-xl border-2 transition-all text-center ${
                        coolingType === cooling.value
                          ? 'bg-[#8AFD81]/20 border-[#8AFD81] shadow-lg shadow-[#8AFD81]/20'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-white font-semibold mb-1">{cooling.label}</div>
                      <div className="text-white/50 text-xs">{cooling.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Infrastructure */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-4 text-lg">
                  Options d'infrastructure
                </label>
                
                <div className="space-y-4">
                  {/* Dalles béton */}
                  <button
                    onClick={() => setHasConcreteSlabs(!hasConcreteSlabs)}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      hasConcreteSlabs
                        ? 'bg-[#8AFD81]/20 border-[#8AFD81]'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold mb-1">Dalles béton sous containers</div>
                        <div className="text-white/50 text-sm">40cm d'épaisseur - Stabilité optimale</div>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                        hasConcreteSlabs ? 'bg-[#8AFD81] border-[#8AFD81]' : 'border-white/40'
                      }`}>
                        {hasConcreteSlabs && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13l4 4L19 7" stroke="#0a0b0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Circulation */}
                  <button
                    onClick={() => setHasCirculation(!hasCirculation)}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      hasCirculation
                        ? 'bg-[#8AFD81]/20 border-[#8AFD81]'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold mb-1">Voies de circulation</div>
                        <div className="text-white/50 text-sm">Allées de 3m autour de chaque équipement</div>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                        hasCirculation ? 'bg-[#8AFD81] border-[#8AFD81]' : 'border-white/40'
                      }`}>
                        {hasCirculation && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13l4 4L19 7" stroke="#0a0b0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Mur micro-perforé */}
                  <button
                    onClick={() => setHasMicroPerforatedWall(!hasMicroPerforatedWall)}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      hasMicroPerforatedWall
                        ? 'bg-[#8AFD81]/20 border-[#8AFD81]'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold mb-1">Mur micro-perforé avec grille</div>
                        <div className="text-white/50 text-sm">Ventilation optimale + sécurité</div>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                        hasMicroPerforatedWall ? 'bg-[#8AFD81] border-[#8AFD81]' : 'border-white/40'
                      }`}>
                        {hasMicroPerforatedWall && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13l4 4L19 7" stroke="#0a0b0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Aperçu final */}
          {step === 5 && powerConfig && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-medium text-xl mb-4">Récapitulatif du projet</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">Nom du projet</span>
                    <span className="text-white font-medium">{projectName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">Puissance totale</span>
                    <span className="text-[#8AFD81] font-bold text-xl">{selectedPower} MW</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/70">Modules 25MW</span>
                    <span className="text-white font-medium">{Math.ceil(selectedPower / 25)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Équipements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Transformers</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.transformers}</div>
                    <div className="text-white/40 text-xs mt-1">PT-Substation Ultra</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Containers</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.containers}</div>
                    <div className="text-white/40 text-xs mt-1">ANTSPACE HD5</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Cooling</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.cooling}</div>
                    <div className="text-white/40 text-xs mt-1">Systèmes Hydro</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">Terrain</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.groundSize}</div>
                    <div className="text-white/40 text-xs mt-1">m² surface</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Conditions du site */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-medium mb-4">Conditions du site</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Sol:</span>
                      <span className="text-white font-medium capitalize">{soilType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Climat:</span>
                      <span className="text-white font-medium capitalize">{climateType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Refroidissement:</span>
                      <span className="text-white font-medium capitalize">{coolingType}</span>
                    </div>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-xl p-6">
                  <h3 className="text-[#8AFD81] font-medium mb-4">Infrastructure</h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    {hasConcreteSlabs && <li>✓ Dalles béton 40cm sous containers</li>}
                    {hasCirculation && <li>✓ Voies de circulation 3m</li>}
                    {hasMicroPerforatedWall && <li>✓ Mur micro-perforé avec grille</li>}
                    <li>✓ Portail + Poste de garde</li>
                    <li>✓ Routes + Hangar + Parking</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {error && step === 3 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer - Style Hearst */}
        <div className="p-10 border-t border-white/10 flex justify-between bg-[#0a0b0d]/50">
          <button
            onClick={step === 1 ? onCancel : handleBack}
            disabled={isGenerating}
            className="px-8 py-4 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-white/20"
          >
            {step === 1 ? 'Annuler' : 'Retour'}
          </button>
          
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-[#8AFD81] text-[#0a0b0d] rounded-2xl hover:bg-[#8AFD81]/90 hover:shadow-lg hover:shadow-[#8AFD81]/30 transition-all font-bold text-lg"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isGenerating}
              className="px-10 py-4 bg-[#8AFD81] text-[#0a0b0d] rounded-2xl hover:bg-[#8AFD81]/90 hover:shadow-lg hover:shadow-[#8AFD81]/30 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-[#0a0b0d]"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  Créer le projet
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
