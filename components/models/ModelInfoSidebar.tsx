/**
 * Sidebar d'informations pour les pages de modèles
 * Design Hearst : Fond noir uniforme avec texte blanc et accents verts
 */

import Link from 'next/link';
import { UnifiedModel } from '../3d/UnifiedModelCatalog';

interface ModelInfoSidebarProps {
  model: UnifiedModel;
}

export default function ModelInfoSidebar({ model }: ModelInfoSidebarProps) {
  return (
    <div className="h-full bg-[#0a0b0d] flex flex-col">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Titre et badge - Plus discret */}
        <div className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-white/90">
              {model.name}
            </h2>
            {model.quality === 'ultra-realistic' && (
              <span className="px-2 py-0.5 bg-[#8AFD81]/20 text-[#8AFD81] rounded-md text-[10px] font-medium flex items-center gap-1 border border-[#8AFD81]/30">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Ultra</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {model.description}
          </p>
        </div>

        {/* Spécifications techniques - Plus subtiles */}
        <div className="border-b border-white/5 pb-4">
          <h3 className="text-[10px] font-medium text-slate-500 mb-3 uppercase tracking-widest">
            Spécifications
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Type</span>
              <span className="font-medium text-white/70 text-[11px]">{model.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Catégorie</span>
              <span className="font-medium text-white/70 text-[11px] capitalize">{model.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Qualité</span>
              <span className="font-medium text-[#8AFD81]/80 text-[11px] capitalize">{model.quality}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Source</span>
              <span className="font-medium text-[#8AFD81]/80 text-[11px] capitalize">{model.source}</span>
            </div>
          </div>
        </div>

        {/* Dimensions - Plus compactes */}
        <div className="border-b border-white/5 pb-4">
          <h3 className="text-[10px] font-medium text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-slate-500 opacity-60">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Dimensions</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Longueur</span>
              <span className="font-semibold text-white/80 text-sm">{model.dimensions.length} m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Largeur</span>
              <span className="font-semibold text-white/80 text-sm">{model.dimensions.width} m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Hauteur</span>
              <span className="font-semibold text-white/80 text-sm">{model.dimensions.height} m</span>
            </div>
          </div>
        </div>

        {/* Puissance - Plus discrète */}
        {model.power && (
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-[10px] font-medium text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-slate-500 opacity-60">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Puissance</span>
            </h3>
            <p className="text-2xl font-semibold text-white/90">{model.power}</p>
          </div>
        )}

        {/* Tags - Plus subtils */}
        <div>
          <h3 className="text-[10px] font-medium text-slate-500 mb-2 uppercase tracking-widest">
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/5 text-white/60 rounded-md text-[10px] font-medium border border-white/10 hover:border-[#8AFD81]/30 hover:text-[#8AFD81]/80 transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bouton de navigation - Plus discret */}
      <div className="p-4 border-t border-white/5 bg-[#0a0b0d]">
        <Link
          href="/"
          className="block w-full py-2.5 bg-[#8AFD81]/10 text-[#8AFD81] rounded-lg font-medium text-sm text-center hover:bg-[#8AFD81]/20 transition-all border border-[#8AFD81]/20 hover:border-[#8AFD81]/40 flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-80">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Retour</span>
        </Link>
      </div>
    </div>
  );
}














