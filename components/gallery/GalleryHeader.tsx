/**
 * Header de la galerie avec titre et boutons d'action
 */

import Link from 'next/link';

interface GalleryHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function GalleryHeader({
  title = 'Galerie de Modèles 3D',
  subtitle = 'Explorez notre collection de modèles 3D ultra-réalistes',
}: GalleryHeaderProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-white/60">
              {subtitle}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition-all text-sm flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Retour</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


