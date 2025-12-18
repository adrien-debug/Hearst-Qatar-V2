/**
 * Toolbar du configurateur 3D
 * Boutons d'actions et contrôles de manipulation
 */

import { TransformMode } from '../../types/configurator';

interface ConfiguratorToolbarProps {
  onOpenModelSelector: () => void;
  modelSelectorOpen: boolean;
  selectedObjectId: string | null;
  transformMode: TransformMode;
  onTransformModeChange: (mode: TransformMode) => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  objectCount: number;
  onSaveToDatabase?: () => void;
  isSaving?: boolean;
  saveStatus?: 'idle' | 'saving' | 'success' | 'error';
  isAuthenticated?: boolean;
}

export default function ConfiguratorToolbar({
  onOpenModelSelector,
  modelSelectorOpen,
  selectedObjectId,
  transformMode,
  onTransformModeChange,
  onDeleteSelected,
  onClearAll,
  objectCount,
  onSaveToDatabase,
  isSaving = false,
  saveStatus = 'idle',
  isAuthenticated = false,
}: ConfiguratorToolbarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-[#0a0b0d]/95 border border-[#8AFD81]/30 rounded-lg px-6 py-4 flex gap-3 backdrop-blur-sm shadow-2xl">
        {/* Bouton Sélection de Modèles */}
        <button
          onClick={onOpenModelSelector}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
            modelSelectorOpen
              ? 'bg-[#8AFD81] text-[#0a0b0d] shadow-lg'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          📦 Modèles
        </button>

        {/* Contrôles de manipulation (si objet sélectionné) */}
        {selectedObjectId && (
          <>
            <div className="w-px bg-white/20 self-stretch"></div>

            <button
              onClick={() => onTransformModeChange('translate')}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                transformMode === 'translate'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ↔️ Déplacer
            </button>

            <button
              onClick={() => onTransformModeChange('rotate')}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                transformMode === 'rotate'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🔄 Rotation
            </button>

            <button
              onClick={onDeleteSelected}
              className="px-4 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all text-sm shadow-lg"
            >
              🗑️ Supprimer
            </button>
          </>
        )}

        {/* Bouton Sauvegarder en base de données */}
        {objectCount > 0 && onSaveToDatabase && (
          <>
            <div className="w-px bg-white/20 self-stretch"></div>
            <button
              onClick={onSaveToDatabase}
              disabled={isSaving}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 ${
                saveStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : isSaving
                  ? 'bg-yellow-500 text-white cursor-wait'
                  : isAuthenticated
                  ? 'bg-[#8AFD81] text-[#0a0b0d] hover:bg-[#7AED71] shadow-lg shadow-[#8AFD81]/30'
                  : 'bg-gray-500 text-white cursor-not-allowed opacity-50'
              }`}
              title={!isAuthenticated ? 'Connectez-vous pour sauvegarder' : 'Sauvegarder en base de données'}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sauvegarde...</span>
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <span>✓</span>
                  <span>Sauvegardé</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>✕</span>
                  <span>Erreur</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Sauvegarder</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Bouton Tout Effacer (si objets présents) */}
        {objectCount > 0 && (
          <>
            <div className="w-px bg-white/20 self-stretch"></div>
            <button
              onClick={() => {
                if (confirm(`Supprimer tous les ${objectCount} objets ?`)) {
                  onClearAll();
                }
              }}
              className="px-4 py-2.5 rounded-lg bg-white/10 text-white/80 hover:bg-red-500/20 hover:text-red-400 font-semibold transition-all text-sm"
            >
              🗑️ Tout Effacer
            </button>
          </>
        )}
      </div>
    </div>
  );
}















