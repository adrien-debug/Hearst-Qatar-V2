import React, { useMemo, useState } from 'react';

type AppearanceMaterial = {
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  emissiveIntensity?: number;
  opacity?: number;
};

type AppearanceState = {
  color?: string;
  material?: AppearanceMaterial;
};

interface HearstEditorToolbarProps {
  selectedObjectId: string | null;
  selectedObjectType: string | null;
  mode: 'translate' | 'rotate' | 'scale' | null;
  space: 'world' | 'local';
  snap: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onModeChange: (mode: 'translate' | 'rotate' | 'scale' | null) => void;
  onSpaceChange: (space: 'world' | 'local') => void;
  onSnapChange: (snap: boolean) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onShowDetails: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenLibrary: () => void;
  onReset?: () => void; // Nouvelle prop pour reset
  appearance: AppearanceState;
  onAppearanceStart: () => void;
  onAppearanceChange: (patch: { color?: string; material?: Partial<AppearanceMaterial> }) => void;
  onAppearanceEnd: () => void;
  onApplyAppearanceToSameType: () => void;
  onApplyTransformToSameType?: () => void; // Appliquer le même déplacement à tous les éléments du même type
  onFlipStairsForContainerLineA?: () => void; // Inverser côté marchepied pour tous les containers A (_CA)
  onApplyStairsPoseToLineA?: () => void; // Copier la pose de marchepied (ref -> tous les _CA)
  onSetSelectedPosition?: (pos: { x: number; y: number; z: number }) => void; // Déplacer l'objet sélectionné à XYZ
  onForceSave: () => void;
  onFocusObject?: () => void; // Nouveau bouton Focus
}

export default function HearstEditorToolbar({
  selectedObjectId,
  selectedObjectType,
  mode,
  space,
  snap,
  canUndo,
  canRedo,
  onModeChange,
  onSpaceChange,
  onSnapChange,
  onDelete,
  onDuplicate,
  onShowDetails,
  onUndo,
  onRedo,
  onOpenLibrary,
  onReset,
  appearance,
  onAppearanceStart,
  onAppearanceChange,
  onAppearanceEnd,
  onApplyAppearanceToSameType,
  onApplyTransformToSameType,
  onFlipStairsForContainerLineA,
  onApplyStairsPoseToLineA,
  onSetSelectedPosition,
  onForceSave,
  onFocusObject, // Récupération prop
}: HearstEditorToolbarProps) {
  
  const btnBaseClass = "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 group";
  const btnActiveClass = "bg-[var(--hearst-green)] text-[var(--hearst-black)] shadow-[0_0_15px_rgba(138,253,129,0.4)]";
  const btnInactiveClass = "bg-[#1a1b1d] text-[#95a5a6] border border-[#2d3436] hover:bg-[#2d3436] hover:text-white hover:border-[var(--hearst-green)]";
  const btnDisabledClass = "bg-[#1a1b1d] text-[#444] border border-[#222] cursor-not-allowed opacity-50";
  
  const tooltipClass = "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-[#2d3436]";

  const [showAppearancePanel, setShowAppearancePanel] = useState(false);

  const handlePasteXYZ = async () => {
    if (!onSetSelectedPosition) return;
    try {
      const text = await navigator.clipboard.readText();
      const rx = /X:\s*([-+]?\d+(?:\.\d+)?)/i.exec(text);
      const ry = /Y:\s*([-+]?\d+(?:\.\d+)?)/i.exec(text);
      const rz = /Z:\s*([-+]?\d+(?:\.\d+)?)/i.exec(text);
      if (!rx || !ry || !rz) return;
      const x = parseFloat(rx[1]);
      const y = parseFloat(ry[1]);
      const z = parseFloat(rz[1]);
      if ([x, y, z].some((n) => Number.isNaN(n))) return;
      onSetSelectedPosition({ x, y, z });
    } catch {
      // ignore (permissions / clipboard)
    }
  };

  const safeColor = useMemo(() => {
    const c = (appearance?.color || '').trim();
    // HTML color input accepte surtout le format #RRGGBB
    if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
    return '#1a1a1a';
  }, [appearance?.color]);

  const material = appearance?.material || {};
  const sliderDefaults = useMemo(
    () => ({
      roughness: material.roughness ?? 0.4,
      metalness: material.metalness ?? 0.5,
      envMapIntensity: material.envMapIntensity ?? 1.0,
      emissiveIntensity: material.emissiveIntensity ?? 0.0,
      opacity: material.opacity ?? 1.0,
    }),
    [material.emissiveIntensity, material.envMapIntensity, material.metalness, material.opacity, material.roughness]
  );

  // BOUTON FLOTTANT "AJOUTER" (Toujours visible même sans sélection)
  const AddButton = () => (
    <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onOpenLibrary}
        className="w-14 h-14 bg-[var(--hearst-green)] text-black rounded-full shadow-[0_0_30px_rgba(138,253,129,0.3)] hover:shadow-[0_0_50px_rgba(138,253,129,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span className="absolute bottom-full mb-3 right-0 px-3 py-1.5 bg-black text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#2d3436]">
          Bibliothèque
        </span>
      </button>
    </div>
  );

  // BOUTON RESET (Réutilisable)
  const ResetButton = () => (
    onReset ? (
      <button 
        onClick={() => {
          if(confirm('⚠️ ATTENTION : Voulez-vous vraiment réinitialiser tout le layout ? Toutes les modifications non sauvegardées seront perdues et la page sera rechargée.')) {
            onReset();
          }
        }} 
        className={`${btnBaseClass} bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-500 hover:text-white hover:border-red-500`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span className={tooltipClass}>⚠️ Réinitialiser Layout</span>
      </button>
    ) : null
  );

  const ForceSaveButton = ({ compact }: { compact?: boolean }) => (
    <button
      onClick={onForceSave}
      className={`${btnBaseClass} ${compact ? '' : ''} bg-[#0f1114] text-[var(--hearst-green)] border border-[var(--hearst-green)]/30 hover:border-[var(--hearst-green)] hover:bg-black/40`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
      <span className={tooltipClass}>Sauvegarder maintenant</span>
    </button>
  );

  if (!selectedObjectId) {
    // Si rien n'est sélectionné, on affiche au moins le bouton Undo/Redo et Reset et Ajouter
    return (
      <>
        {/* Undo/Redo/Reset Flottant (si pas de sélection) */}
        <div className="fixed bottom-8 left-8 z-50 flex gap-2">
           <button onClick={onUndo} disabled={!canUndo} className={`${btnBaseClass} ${!canUndo ? btnDisabledClass : btnInactiveClass}`}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
           </button>
           <button onClick={onRedo} disabled={!canRedo} className={`${btnBaseClass} ${!canRedo ? btnDisabledClass : btnInactiveClass}`}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14l5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
           </button>
           
           <div className="w-[1px] h-10 bg-[#2d3436] mx-1"></div>

           <ForceSaveButton compact />
           
           <ResetButton />
        </div>
        <AddButton />
      </>
    );
  }

  return (
    <>
      <AddButton />
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Label de l'objet sélectionné */}
        <div className="px-4 py-1 bg-black/80 backdrop-blur border border-[var(--hearst-green)] rounded-full text-[var(--hearst-green)] text-xs font-mono mb-1 uppercase tracking-wider shadow-[0_0_20px_rgba(138,253,129,0.1)]">
          Édition : {selectedObjectId.split('-')[0].toUpperCase()}
        </div>

        {/* Panel Apparence (Couleur + Matière) */}
        {showAppearancePanel && (
          <div className="w-[420px] max-w-[92vw] bg-[#0a0b0d]/95 backdrop-blur-md border border-[#2d3436] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                Apparence
                {selectedObjectType ? (
                  <span className="ml-2 text-[10px] font-mono text-gray-400">({selectedObjectType})</span>
                ) : null}
              </div>
              <button
                onClick={() => setShowAppearancePanel(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Couleur */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Couleur</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={safeColor}
                  onChange={(e) => {
                    const next = e.target.value;
                    onAppearanceStart();
                    onAppearanceChange({ color: next });
                    onAppearanceEnd();
                  }}
                  className="w-10 h-8 bg-transparent border border-[#2d3436] rounded cursor-pointer"
                  title="Choisir une couleur"
                />
                <input
                  type="text"
                  value={safeColor}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                      onAppearanceStart();
                      onAppearanceChange({ color: v });
                      onAppearanceEnd();
                    }
                  }}
                  className="w-24 bg-[#1a1b1d] text-white text-xs font-mono px-2 py-1 rounded border border-[#2d3436] focus:outline-none focus:border-[var(--hearst-green)]"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Sliders matière */}
            <div className="space-y-3">
              {([
                { key: 'roughness', label: 'Rugosité', min: 0, max: 1, step: 0.01, value: sliderDefaults.roughness },
                { key: 'metalness', label: 'Métal', min: 0, max: 1, step: 0.01, value: sliderDefaults.metalness },
                { key: 'envMapIntensity', label: 'Reflets', min: 0, max: 5, step: 0.05, value: sliderDefaults.envMapIntensity },
                { key: 'emissiveIntensity', label: 'Émission', min: 0, max: 5, step: 0.05, value: sliderDefaults.emissiveIntensity },
                { key: 'opacity', label: 'Opacité', min: 0, max: 1, step: 0.01, value: sliderDefaults.opacity },
              ] as const).map((s) => (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="w-24 text-[11px] text-gray-300 font-semibold uppercase tracking-wider">{s.label}</div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.value}
                    onPointerDown={() => onAppearanceStart()}
                    onMouseDown={() => onAppearanceStart()}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onAppearanceChange({ material: { [s.key]: v } as any });
                    }}
                    onPointerUp={() => onAppearanceEnd()}
                    onMouseUp={() => onAppearanceEnd()}
                    onTouchEnd={() => onAppearanceEnd()}
                    className="flex-1 accent-[var(--hearst-green)]"
                  />
                  <div className="w-14 text-right text-[11px] font-mono text-gray-200 tabular-nums">
                    {s.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 border-t border-[#2d3436] flex items-center justify-between gap-2">
              <div className="text-[10px] text-gray-500">
                Modifie l’objet principal. Utilise le bouton pour appliquer au même type.
              </div>
              <button
                onClick={onApplyAppearanceToSameType}
                className="px-3 py-2 bg-[#1a1b1d] text-[var(--hearst-green)] border border-[var(--hearst-green)]/40 hover:border-[var(--hearst-green)] hover:bg-[#0f1114] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Appliquer à tous les {selectedObjectType || 'éléments'}
              </button>
            </div>
          </div>
        )}

        {/* Barre d'outils principale */}
        <div className="flex items-center gap-2 p-2 bg-[#0a0b0d]/90 backdrop-blur-md border border-[#2d3436] rounded-xl shadow-2xl">
          
          {/* Groupe 0: Historique & Infos */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#2d3436]">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`${btnBaseClass} ${!canUndo ? btnDisabledClass : btnInactiveClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14L4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
              <span className={tooltipClass}>Annuler (Ctrl+Z)</span>
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`${btnBaseClass} ${!canRedo ? btnDisabledClass : btnInactiveClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14l5-5-5-5" />
                <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
              </svg>
              <span className={tooltipClass}>Rétablir (Ctrl+Y)</span>
            </button>

            <div className="w-[1px] h-6 bg-[#2d3436] mx-1"></div>

            <ForceSaveButton />

            <button
              onClick={onShowDetails}
              className={`${btnBaseClass} ${btnInactiveClass} text-blue-400 border-blue-900/30 hover:bg-blue-900/20 hover:border-blue-500`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span className={tooltipClass}>Détails & Propriétés</span>
            </button>

            {onFocusObject && (
              <button
                onClick={onFocusObject}
                className={`${btnBaseClass} ${btnInactiveClass} text-yellow-400 border-yellow-900/30 hover:bg-yellow-900/20 hover:border-yellow-500`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="22" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="12" x2="2" y2="12" />
                  <line x1="12" y1="6" x2="12" y2="2" />
                  <line x1="12" y1="22" x2="12" y2="18" />
                </svg>
                <span className={tooltipClass}>Centrer la vue (Focus)</span>
              </button>
            )}

            {onApplyTransformToSameType && (
              <button
                onClick={onApplyTransformToSameType}
                className={`${btnBaseClass} ${btnInactiveClass} text-[var(--hearst-green)] border-[var(--hearst-green)]/30 hover:bg-[var(--hearst-green)]/10 hover:border-[var(--hearst-green)]`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span className={tooltipClass}>
                  Appliquer le même déplacement à tous les {selectedObjectType || 'éléments'}
                </span>
              </button>
            )}

            {onFlipStairsForContainerLineA && (
              <button
                onClick={onFlipStairsForContainerLineA}
                className={`${btnBaseClass} ${btnInactiveClass} text-cyan-300 border-cyan-900/30 hover:bg-cyan-900/20 hover:border-cyan-400`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8" />
                  <path d="M17 12h8" />
                  <path d="M3 8v8" />
                  <path d="M7 12H-1" />
                  <path d="M9 6h6" />
                  <path d="M9 18h6" />
                </svg>
                <span className={tooltipClass}>
                  Inverser le côté des marchepieds (ligne A)
                </span>
              </button>
            )}

            {onApplyStairsPoseToLineA && (
              <button
                onClick={onApplyStairsPoseToLineA}
                className={`${btnBaseClass} ${btnInactiveClass} text-emerald-300 border-emerald-900/30 hover:bg-emerald-900/20 hover:border-emerald-400`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M6 17h12" />
                  <path d="M9 13h9" />
                  <path d="M12 9h6" />
                </svg>
                <span className={tooltipClass}>
                  Copier la pose du marchepied (PB2_TR5_CA → tous les CA)
                </span>
              </button>
            )}

            {onSetSelectedPosition && (
              <button
                onClick={handlePasteXYZ}
                className={`${btnBaseClass} ${btnInactiveClass} text-white border-[#2d3436] hover:bg-[#2d3436]`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <path d="M16 2v4" />
                  <path d="M10 2v4" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
                <span className={tooltipClass}>
                  Coller XYZ depuis le presse-papier (X: / Y: / Z:)
                </span>
              </button>
            )}
          </div>

          {/* Groupe 1: Transformation */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#2d3436]">
            <button
              onClick={() => onModeChange(null)}
              className={`${btnBaseClass} ${mode === null ? btnActiveClass : btnInactiveClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                <path d="M13 13l6 6" />
              </svg>
              <span className={tooltipClass}>Sélection (Echap)</span>
            </button>

            <button
              onClick={() => onModeChange('translate')}
              className={`${btnBaseClass} ${mode === 'translate' ? btnActiveClass : btnInactiveClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3 3M2 12h20M12 2v20" />
              </svg>
              <span className={tooltipClass}>Déplacer</span>
            </button>

            <button
              onClick={() => onModeChange('rotate')}
              className={`${btnBaseClass} ${mode === 'rotate' ? btnActiveClass : btnInactiveClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className={tooltipClass}>Pivoter</span>
            </button>

            <button
              onClick={() => onModeChange('scale')}
              className={`${btnBaseClass} ${mode === 'scale' ? btnActiveClass : btnInactiveClass}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 3L3 21" />
                <path d="M21 3h-6" />
                <path d="M21 3v6" />
                <path d="M10 14L3 21" />
                <path d="M3 14v7h7" />
                <path d="M14 10l7-7" />
              </svg>
              <span className={tooltipClass}>Échelle</span>
            </button>
          </div>

          {/* Groupe 2: Options */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#2d3436]">
            <button
              onClick={() => onSpaceChange(space === 'world' ? 'local' : 'world')}
              className={`${btnBaseClass} ${btnInactiveClass} ${space === 'local' ? 'text-[var(--hearst-green)] border-[var(--hearst-green)]' : ''}`}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-[10px] font-bold">{space === 'world' ? 'WRLD' : 'LOC'}</span>
              </div>
              <span className={tooltipClass}>Axe: {space === 'world' ? 'Monde' : 'Local'}</span>
            </button>

            <button
              onClick={() => onSnapChange(!snap)}
              className={`${btnBaseClass} ${btnInactiveClass} ${snap ? 'text-[var(--hearst-green)] border-[var(--hearst-green)]' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span className={tooltipClass}>Aimant (Snap): {snap ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Groupe 3: Apparence */}
          <div className="flex items-center gap-1 pr-2 border-r border-[#2d3436]">
            <button
              onClick={() => setShowAppearancePanel((v) => !v)}
              className={`${btnBaseClass} ${btnInactiveClass} ${showAppearancePanel ? 'text-[var(--hearst-green)] border-[var(--hearst-green)]' : ''}`}
            >
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-[#2d3436]" style={{ backgroundColor: safeColor }} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a10 10 0 1 1 10-10c0 1.1-.9 2-2 2h-1.5a2.5 2.5 0 0 0 0 5H12z" />
                <circle cx="7.5" cy="10.5" r="1" />
                <circle cx="12" cy="7.5" r="1" />
                <circle cx="16.5" cy="10.5" r="1" />
              </svg>
              <span className={tooltipClass}>Apparence (couleur & matière)</span>
            </button>
          </div>

          {/* Groupe 4: Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onDuplicate}
              className={`${btnBaseClass} bg-[#1e2329] text-blue-400 border border-blue-900/30 hover:bg-blue-900/20 hover:border-blue-500`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className={tooltipClass}>Dupliquer (Ctrl+D)</span>
            </button>

            <button
              onClick={onDelete}
              className={`${btnBaseClass} bg-[#1e2329] text-red-400 border border-red-900/30 hover:bg-red-900/20 hover:border-red-500`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span className={tooltipClass}>Supprimer (Del)</span>
            </button>

            <div className="w-[1px] h-6 bg-[#2d3436] mx-1"></div>

            <ResetButton />

          </div>

        </div>
      </div>
    </>
  );
}


