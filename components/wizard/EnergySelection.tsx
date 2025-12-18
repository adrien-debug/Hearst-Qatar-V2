/**
 * Étape 2 : Sélection de la source d'énergie
 */

import { EnergySource } from '../../types/project-wizard';
import { ENERGY_SOURCES, ENERGY_SOURCE_LABELS } from '../../data/project-options';

interface EnergySelectionProps {
  selectedEnergy: EnergySource | null;
  onSelect: (energy: EnergySource) => void;
}

export default function EnergySelection({ selectedEnergy, onSelect }: EnergySelectionProps) {
  const energySources: EnergySource[] = ['grid', 'solar', 'off-grid', 'hybrid', 'biogas', 'wind', 'flare-gas'];

  const getIcon = (icon: string) => {
    const icons: Record<string, JSX.Element> = {
      plug: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2v4M8 6V2M16 6V2M7 6h10v4a5 5 0 01-10 0V6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      sun: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="5" strokeWidth="2"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      battery: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="1" y="6" width="18" height="12" rx="2" strokeWidth="2"/>
          <path d="M23 10v4" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      hybrid: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="3" strokeWidth="2"/>
        </svg>
      ),
      leaf: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      wind: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      flame: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    };
    return icons[icon] || icons.plug;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Source d'Énergie</h2>
        <p className="text-slate-400 text-sm">Choisissez la source d'alimentation électrique</p>
      </div>

      {/* Grille de sélection */}
      <div className="grid grid-cols-2 gap-4">
        {energySources.map((source) => {
          const config = ENERGY_SOURCES[source];
          const label = ENERGY_SOURCE_LABELS[source];
          const isSelected = selectedEnergy === source;

          return (
            <button
              key={source}
              onClick={() => onSelect(source)}
              className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'bg-[#8AFD81] border-[#8AFD81] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-white/5 border-white/10 hover:border-[#8AFD81]/50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className={isSelected ? 'text-[#0a0b0d]' : 'text-[#8AFD81]'}>
                  {getIcon(label.icon)}
                </div>
                <div className="flex-1">
                  <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-[#0a0b0d]' : 'text-white'}`}>
                    {label.label}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-[#0a0b0d]/70' : 'text-slate-400'}`}>
                    {label.description}
                  </div>
                </div>
              </div>

              <div className={`text-xs space-y-1 ${isSelected ? 'text-[#0a0b0d]/70' : 'text-slate-400'}`}>
                <div>Coût : ${config.costPerKWh}/kWh</div>
                <div>Disponibilité : {config.availability}%</div>
                {config.renewable && <div className="text-[#8AFD81] font-semibold">♻️ Renouvelable</div>}
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}














