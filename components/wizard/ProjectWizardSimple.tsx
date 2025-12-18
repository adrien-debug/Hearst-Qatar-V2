/**
 * Wizard de Création de Projet - Version Simplifiée 25MW
 * Configuration fixe pour Qatar : 25MW, Desert, Sandy, Hydro
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { generateProjectConfig, ProjectConfiguration } from '../../lib/projectGenerator';
import projectTemplates from '../../config/project-templates.json';
import { useAuth } from '../../hooks/useAuth';

interface ProjectWizardProps {
  onComplete: (config: ProjectConfiguration) => void;
  onCancel?: () => void;
}

export default function ProjectWizardSimple({ onComplete, onCancel }: ProjectWizardProps) {
  // Utiliser useAuth de manière sécurisée
  let isAuthenticated = false;
  let userEmail = '';
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    userEmail = auth.user?.email || '';
  } catch (error) {
    // AuthProvider non disponible
  }

  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('Projet Qatar 25MW');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Configuration fixe pour Qatar 25MW
  const selectedPower = 25;
  const powerConfig = projectTemplates.power_configurations['25'];

  const handleNext = () => {
    if (!projectName.trim()) {
      setError('Veuillez entrer un nom de projet');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCreate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Configuration fixe Qatar
      const conditions = {
        soilType: 'sandy' as const,
        climateType: 'desert' as const,
        coolingType: 'hydro' as const,
        hasConcreteSlabs: true,
        hasCirculation: true,
        hasMicroPerforatedWall: true,
      };
      
      // Générer la configuration 25MW
      const config = generateProjectConfig(projectName, 25, conditions);
      
      // Simuler un délai pour l'effet visuel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onComplete(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-10 border-b border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wider mb-1">Hearst Corporation</div>
                <h2 className="text-4xl font-bold text-white">Nouveau Projet 25MW</h2>
                <p className="text-white/50 text-sm mt-1">
                  Configuration Qatar - Désert
                  {isAuthenticated && <span className="text-[#8AFD81] ml-2">• {userEmail}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <Link href="/my-projects">
                  <button className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 text-sm font-medium">
                    Mes Projets
                  </button>
                </Link>
              )}
              {!isAuthenticated && (
                <Link href="/login">
                  <button className="px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 text-sm font-medium">
                    Se connecter
                  </button>
                </Link>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-white/40 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Message si non authentifié */}
          {!isAuthenticated && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-200 text-sm">
                Votre projet sera sauvegardé localement. <Link href="/login" className="text-[#8AFD81] hover:underline font-medium">Connectez-vous</Link> pour sauvegarder dans le cloud.
              </p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center gap-3 mt-8">
            {[
              { num: 1, label: 'Configuration' },
              { num: 2, label: 'Création' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-3 transition-all duration-300 ${s.num <= step ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    s.num < step ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/30' : 
                    s.num === step ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/30 scale-110' : 
                    'bg-white/10 text-white/60 border border-white/20'
                  }`}>
                    {s.num < step ? '✓' : s.num}
                  </div>
                  <span className="text-white text-sm font-medium uppercase tracking-wide">
                    {s.label}
                  </span>
                </div>
                {idx < 1 && <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${s.num < step ? 'bg-[#8AFD81]' : 'bg-white/10'}`} />}
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
                  placeholder="Ex: Projet Qatar 25MW"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] focus:border-transparent text-lg"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-red-400 text-sm">{error}</p>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-medium mb-4 text-lg">Configuration Qatar 25MW</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-white/60 text-sm mb-2">Puissance</div>
                    <div className="text-[#8AFD81] text-3xl font-bold">25 MW</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-2">Module</div>
                    <div className="text-white text-3xl font-bold">1 × 25MW</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-2">Transformateurs</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.transformers}</div>
                    <div className="text-white/40 text-xs mt-1">PT-Substation Ultra</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-2">Containers</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.containers}</div>
                    <div className="text-white/40 text-xs mt-1">ANTSPACE HD5</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-2">Refroidissement</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.cooling}</div>
                    <div className="text-white/40 text-xs mt-1">Systèmes Hydro</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-2">Terrain</div>
                    <div className="text-white text-2xl font-bold">{powerConfig.groundSize}</div>
                    <div className="text-white/40 text-xs mt-1">m² surface</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#8AFD81]/10 backdrop-blur-md border border-[#8AFD81]/30 rounded-xl p-6">
                <h3 className="text-[#8AFD81] font-medium mb-3">Conditions Qatar</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-white/60 mb-1">Sol</div>
                    <div className="text-white font-medium">Sableux (Desert)</div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Climat</div>
                    <div className="text-white font-medium">Désert</div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Refroidissement</div>
                    <div className="text-white font-medium">Hydro</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-white/70 text-xs">
                    ✓ Dalles béton 40cm • ✓ Voies circulation 3m • ✓ Mur micro-perforé
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-medium mb-3">Infrastructure VRD Incluse</h3>
                <div className="grid grid-cols-2 gap-3 text-white/70 text-sm">
                  <div>✓ Portail d'entrée principal</div>
                  <div>✓ Poste de garde sécurisé</div>
                  <div>✓ Routes d'accès</div>
                  <div>✓ Hangar de maintenance</div>
                  <div>✓ Parking véhicules</div>
                  <div>✓ Signalétique complète</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Récapitulatif Final */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
                <h3 className="text-white font-medium text-2xl mb-6">Récapitulatif du Projet</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-white/70 text-lg">Nom du projet</span>
                    <span className="text-white font-medium text-lg">{projectName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-white/70 text-lg">Puissance totale</span>
                    <span className="text-[#8AFD81] font-bold text-3xl">25 MW</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-white/70 text-lg">Localisation</span>
                    <span className="text-white font-medium text-lg">Qatar - Désert</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Équipements */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                  <h3 className="text-white font-medium mb-4">Équipements</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Transformateurs:</span>
                      <span className="text-white font-bold text-xl">{powerConfig.transformers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Containers HD5:</span>
                      <span className="text-white font-bold text-xl">{powerConfig.containers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Systèmes Hydro:</span>
                      <span className="text-white font-bold text-xl">{powerConfig.cooling}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Surface:</span>
                      <span className="text-white font-bold text-xl">{powerConfig.groundSize}m²</span>
                    </div>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="bg-[#8AFD81]/10 backdrop-blur-md border border-[#8AFD81]/30 rounded-xl p-6">
                  <h3 className="text-[#8AFD81] font-medium mb-4">Infrastructure</h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dalles béton 40cm
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Voies circulation 3m
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mur micro-perforé
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Portail + Garde
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#8AFD81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Routes + Hangar
                    </li>
                  </ul>
                </div>
              </div>

              {isGenerating && (
                <div className="bg-[#8AFD81]/10 border border-[#8AFD81]/30 rounded-xl p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#8AFD81] mx-auto mb-4"></div>
                  <p className="text-[#8AFD81] font-medium">Génération du projet en cours...</p>
                  <p className="text-white/50 text-sm mt-2">Placement automatique des équipements</p>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-white/10 flex justify-between bg-slate-800/30 backdrop-blur-md">
          <button
            onClick={step === 1 ? onCancel : () => setStep(1)}
            disabled={isGenerating}
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-white/20"
          >
            {step === 1 ? 'Annuler' : 'Retour'}
          </button>
          
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="px-10 py-4 bg-[#8AFD81] text-slate-900 rounded-xl hover:bg-[#7AED71] hover:shadow-lg hover:shadow-[#8AFD81]/30 transition-all font-bold text-lg"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isGenerating}
              className="px-10 py-4 bg-[#8AFD81] text-slate-900 rounded-xl hover:bg-[#7AED71] hover:shadow-lg hover:shadow-[#8AFD81]/30 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-3 border-slate-900"></div>
                  Génération...
                </>
              ) : (
                <>
                  Créer le Projet 25MW
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















