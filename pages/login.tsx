import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('admin@hearst.qa');
  const [password, setPassword] = useState('hearst2024');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà authentifié
  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Rediriger vers la page d'accueil après connexion réussie
      router.push('/');
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion - Hearst Qatar</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8AFD81]/5 rounded-full blur-3xl"></div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#8AFD81]/20 flex items-center justify-center border border-[#8AFD81]/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#8AFD81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[#8AFD81] text-lg font-bold">Hearst Qatar</div>
                <div className="text-white/40 text-xs">3D Configurator</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-white/60">Accédez à vos projets 3D</p>
          </div>

          {/* Formulaire */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8AFD81] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8AFD81] hover:bg-[#7AED71] text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#8AFD81]/30"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-white/60 text-sm">
                Pas encore de compte ?{' '}
                <Link href="/signup" className="text-[#8AFD81] hover:text-[#7AED71] font-medium transition-colors">
                  Créer un compte
                </Link>
              </p>
              <Link href="/" className="block text-white/40 hover:text-white/60 text-sm transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

