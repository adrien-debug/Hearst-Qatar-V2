import React from 'react';

interface PresetViewControlsProps {
  onSetView: (view: 'overview' | 'top' | 'front' | 'side' | 'entry') => void;
}

export default function PresetViewControls({ onSetView }: PresetViewControlsProps) {
  const btnClass = "w-10 h-10 bg-black/60 backdrop-blur-md border border-gray-700 text-gray-300 rounded-lg hover:bg-[var(--hearst-green)] hover:text-black hover:border-[var(--hearst-green)] transition-all flex items-center justify-center shadow-lg group relative";
  const tooltipClass = "absolute right-full mr-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-800 pointer-events-none";

  return (
    <div className="fixed top-24 right-4 z-40 flex flex-col gap-2">
      <button onClick={() => onSetView('overview')} className={btnClass}>
        <span className="text-xl">🌐</span>
        <span className={tooltipClass}>Vue d'ensemble</span>
      </button>
      
      <button onClick={() => onSetView('top')} className={btnClass}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="12" r="3" /></svg>
        <span className={tooltipClass}>Vue de dessus</span>
      </button>

      <button onClick={() => onSetView('front')} className={btnClass}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 20l14 0" /><path d="M5 20l0 -11" /><path d="M19 20l0 -11" /><path d="M12 4l-7 5" /><path d="M12 4l7 5" /></svg>
        <span className={tooltipClass}>Vue Face (Sud)</span>
      </button>

      <button onClick={() => onSetView('side')} className={btnClass}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="8" height="16" rx="1" /><path d="M16 8v8" /></svg>
        <span className={tooltipClass}>Vue Côté (Est)</span>
      </button>

      <button onClick={() => onSetView('entry')} className={btnClass}>
        <span className="text-xl">🚪</span>
        <span className={tooltipClass}>Entrée Site</span>
      </button>
    </div>
  );
}


