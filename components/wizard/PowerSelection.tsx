/**
 * Étape 1 : Sélection de la puissance
 */

import { PowerOption, PowerConfig } from '../../types/project-wizard';
import { POWER_OPTIONS } from '../../data/project-options';

interface PowerSelectionProps {
  selectedPower: PowerOption | null;
  onSelect: (power: PowerOption) => void;
}

export default function PowerSelection({ selectedPower, onSelect }: PowerSelectionProps) {
  const powers: PowerOption[] = [5, 10, 25, 50, 75, 100];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Sélectionnez la Puissance</h2>
        <p className="text-slate-400 text-sm">Choisissez la capacité électrique de votre projet</p>
      </div>

      {/* Grille de sélection */}
      <div className="grid grid-cols-3 gap-4">
        {powers.map((power) => {
          const config = POWER_OPTIONS[power];
          const isSelected = selectedPower === power;

          return (
            <button
              key={power}
              onClick={() => onSelect(power)}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'bg-[#8AFD81] border-[#8AFD81] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-white/5 border-white/10 hover:border-[#8AFD81]/50 hover:bg-white/10'
              }`}
            >
              <div className={`text-4xl font-bold mb-2 ${isSelected ? 'text-[#0a0b0d]' : 'text-[#8AFD81]'}`}>
                {power}
              </div>
              <div className={`text-lg font-semibold mb-3 ${isSelected ? 'text-[#0a0b0d]' : 'text-white'}`}>
                MW
              </div>
              <div className={`text-xs space-y-1 ${isSelected ? 'text-[#0a0b0d]/70' : 'text-slate-400'}`}>
                <div>{config.containers} Containers</div>
                <div>{config.transformers} Transformers</div>
                <div>{config.hashratePH} PH/s</div>
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

      {/* Détails de la configuration sélectionnée */}
      {selectedPower && (
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <div className="text-sm font-bold text-[#8AFD81] mb-3 uppercase tracking-wide">
            Configuration {selectedPower} MW
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Containers :</span>
              <span className="ml-2 font-bold text-white">{POWER_OPTIONS[selectedPower].containers}</span>
            </div>
            <div>
              <span className="text-slate-400">Transformateurs :</span>
              <span className="ml-2 font-bold text-white">{POWER_OPTIONS[selectedPower].transformers}</span>
            </div>
            <div>
              <span className="text-slate-400">Hashrate :</span>
              <span className="ml-2 font-bold text-[#8AFD81]">{POWER_OPTIONS[selectedPower].hashratePH} PH/s</span>
            </div>
            <div>
              <span className="text-slate-400">Production :</span>
              <span className="ml-2 font-bold text-[#8AFD81]">{POWER_OPTIONS[selectedPower].dailyBTC} BTC/jour</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}














