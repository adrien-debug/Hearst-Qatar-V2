/**
 * Page d'Accueil Port 3333 - Hub avec Wizard et Galerie
 * Route: / (page d'accueil)
 */

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ProjectProvider, useProject } from '../contexts/ProjectContext';
import ProjectWizard from '../components/wizard/ProjectWizard';
import { ProjectConfiguration } from '../lib/projectGenerator';

function HomeContent() {
  const router = useRouter();
  const { setCurrentProject, clearProject } = useProject();
  const [showWizard, setShowWizard] = useState(false);

  const handleStartNewProject = () => {
    // Effacer TOUT le localStorage IMMÉDIATEMENT
    if (typeof window !== 'undefined') {
      localStorage.clear();
      console.log('🧹 LocalStorage effacé complètement');
    }
    
    // Effacer complètement l'ancien projet dans le context
    clearProject();
    
    // Ouvrir le wizard
    setShowWizard(true);
  };

  const handleProjectComplete = (config: ProjectConfiguration) => {
    console.log('🎯 Nouveau projet créé:', {
      name: config.name,
      powerMW: config.powerMW,
      equipmentCount: config.equipment.length,
      vrdCount: config.vrd.length,
      transformers: config.metadata.transformersCount,
      containers: config.metadata.containersCount,
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pages/index.tsx:handleProjectComplete',message:'Project complete handler called',data:{projectId:config.id,projectName:config.name,powerMW:config.powerMW,equipmentCount:config.equipment.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Définir le nouveau projet actif (le localStorage est déjà effacé dans handleStartNewProject)
    setCurrentProject(config);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pages/index.tsx:afterSetCurrentProject',message:'After setCurrentProject called',data:{projectId:config.id,equipmentCount:config.equipment.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    // Rediriger vers l'environnement 3D
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/662cfcf5-45d7-4a4c-8dee-f5adb339e61a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pages/index.tsx:beforeRedirect',message:'Before router.push',data:{targetPath:'/environment'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    router.push('/environment');
  };

  return (
    <>
      <Head>
        <title>Système Modulaire 3D - Hearst Qatar</title>
        <meta
          name="description"
          content="Créez votre projet modulaire 5-200MW avec infrastructure VRD complète"
        />
      </Head>

      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0b0d] via-[#1a1b1d] to-[#0a0b0d]">
        {/* Effet de grille */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        {/* Gradient lumineux */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8AFD81]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          {/* Header - Style Hearst */}
          <div className="text-center mb-16">
            {/* Logo Hearst */}
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/30">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[#8AFD81] text-sm font-semibold uppercase tracking-wider">Hearst Corporation</div>
                <div className="text-white/40 text-xs">Mining Infrastructure Platform</div>
              </div>
            </div>
            
            {/* Titre principal - Style Hearst */}
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              We make Crypto Mining<br />
              <span className="text-[#8AFD81]">More Sustainable</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
              Système modulaire 3D pour la conception d'infrastructures de mining Bitcoin institutionnelles - 5MW à 200MW
            </p>
            
            {/* Stats - Style Hearst */}
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8AFD81] mb-1">9</div>
                <div className="text-white/40 text-sm uppercase tracking-wide">Configurations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8AFD81] mb-1">7</div>
                <div className="text-white/40 text-sm uppercase tracking-wide">Modèles 4K</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8AFD81] mb-1">100%</div>
                <div className="text-white/40 text-sm uppercase tracking-wide">VRD Inclus</div>
              </div>
            </div>
          </div>

          {/* Cards principales - Style Hearst */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Créer un projet - Style Hearst */}
            <button
              onClick={handleStartNewProject}
              className="group relative overflow-hidden bg-[#0a0b0d] border-2 border-[#8AFD81]/40 rounded-3xl p-10 hover:border-[#8AFD81] hover:shadow-2xl hover:shadow-[#8AFD81]/30 transition-all duration-500 text-left"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#8AFD81]/5 rounded-full blur-3xl group-hover:bg-[#8AFD81]/15 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#8AFD81]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#8AFD81]/30 transition-all duration-300">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="mb-4">
                  <div className="text-[#8AFD81] text-xs font-semibold uppercase tracking-wider mb-2">Start Mining</div>
                  <h2 className="text-3xl font-bold text-white mb-3">Créer un Projet</h2>
                </div>
                <p className="text-white/60 text-base leading-relaxed mb-6">
                  Configuration modulaire 5-200MW avec calcul automatique des équipements et infrastructure VRD complète
                </p>
                <div className="flex items-center gap-2 text-[#8AFD81] text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Démarrer maintenant</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>

            {/* Explorer la galerie - Style Hearst */}
            <Link href="/gallery">
              <div className="group relative overflow-hidden bg-[#0a0b0d] border-2 border-white/20 rounded-3xl p-10 hover:border-[#8AFD81] hover:shadow-2xl hover:shadow-[#8AFD81]/30 transition-all duration-500 cursor-pointer text-left">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#8AFD81]/5 rounded-full blur-3xl group-hover:bg-[#8AFD81]/15 transition-all duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#8AFD81]/20 transition-all duration-300">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7h16M4 12h16M4 17h16" stroke="#8AFD81" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="mb-4">
                    <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Explore</div>
                    <h2 className="text-3xl font-bold text-white mb-3">Galerie de Modèles</h2>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed mb-6">
                    Découvrez tous les modèles 3D ultra-réalistes 4K : transformateurs, containers, systèmes de refroidissement
                  </p>
                  <div className="flex items-center gap-2 text-[#8AFD81] text-sm font-semibold group-hover:gap-3 transition-all">
                    <span>Explorer la galerie</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Features - Style Hearst */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-[#8AFD81] text-4xl font-bold mb-2">Sustainable</div>
              <div className="text-white/60 text-sm">Infrastructure VRD complète</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-[#8AFD81] text-4xl font-bold mb-2">Efficient</div>
              <div className="text-white/60 text-sm">Placement automatique optimisé</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-[#8AFD81] text-4xl font-bold mb-2">Secure</div>
              <div className="text-white/60 text-sm">Modèles ultra-réalistes 4K</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard modal */}
      {showWizard && (
        <ProjectWizard 
          onComplete={handleProjectComplete}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <ProjectProvider>
      <HomeContent />
    </ProjectProvider>
  );
}
