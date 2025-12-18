import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProject } from '../contexts/ProjectContext';
import AuthGuard from '../components/auth/AuthGuard';
import { loadProjects, deleteProject, duplicateProject } from '../lib/supabase/services/projects';
import { DeploymentRow } from '../lib/supabase/services/projects';

function MyProjectsContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { setCurrentProject } = useProject();
  
  const [projects, setProjects] = useState<DeploymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les projets au montage
  useEffect(() => {
    if (user) {
      loadUserProjects();
    }
  }, [user]);

  const loadUserProjects = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await loadProjects(user.id);
      
      if (error) {
        setError(error.message);
      } else {
        setProjects(data || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = (project: DeploymentRow) => {
    setCurrentProject(project.config);
    // Rediriger vers l'accueil après avoir chargé le projet
    router.push('/');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!user) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      const { error } = await deleteProject(projectId, user.id);
      if (error) {
        alert('Erreur lors de la suppression');
      } else {
        // Recharger la liste
        loadUserProjects();
      }
    } catch (err) {
      alert('Erreur inattendue');
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    if (!user) return;

    try {
      const { error } = await duplicateProject(projectId, user.id);
      if (error) {
        alert('Erreur lors de la duplication');
      } else {
        // Recharger la liste
        loadUserProjects();
      }
    } catch (err) {
      alert('Erreur inattendue');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Mes Projets - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mes Projets</h1>
              <p className="text-white/60">Gérez vos configurations 3D</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="text-white text-sm font-medium">{user?.email}</p>
                <button
                  onClick={handleSignOut}
                  className="text-white/60 hover:text-white text-xs transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
              <Link
                href="/"
                className="px-6 py-3 bg-[#8AFD81] hover:bg-[#7AED71] text-slate-900 font-semibold rounded-lg transition-all shadow-lg shadow-[#8AFD81]/30"
              >
                + Nouveau Projet
              </Link>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Chargement des projets...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 mb-6">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Aucun projet</h2>
              <p className="text-white/60 mb-6">Créez votre premier projet 3D</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#8AFD81] hover:bg-[#7AED71] text-slate-900 font-semibold rounded-lg transition-all shadow-lg shadow-[#8AFD81]/30"
              >
                Créer un projet
              </Link>
            </div>
          )}

          {/* Projects grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:border-[#8AFD81]/50 transition-all group"
                >
                  {/* Project info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8AFD81] transition-colors">
                      {project.config.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {project.config.powerMW} MW
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {project.config.equipment.length} équipements
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      Modifié le {new Date(project.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenProject(project)}
                      className="flex-1 px-4 py-2 bg-[#8AFD81] hover:bg-[#7AED71] text-slate-900 font-semibold rounded-lg transition-all text-sm"
                    >
                      Ouvrir
                    </button>
                    <button
                      onClick={() => handleDuplicateProject(project.id)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                      title="Dupliquer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function MyProjectsPage() {
  return (
    <AuthGuard>
      <MyProjectsContent />
    </AuthGuard>
  );
}















