/**
 * AuthGuard Component
 * Protège les routes nécessitant une authentification
 */

import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Sauvegarder l'URL actuelle pour rediriger après connexion
      const returnUrl = router.asPath;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, loading, router]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#8AFD81]/30 border-t-[#8AFD81] rounded-full animate-spin mb-4"></div>
          <p className="text-white/60">Vérification...</p>
        </div>
      </div>
    );
  }

  // Afficher le fallback si non authentifié
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // Afficher le contenu protégé si authentifié
  return <>{children}</>;
}

/**
 * Hook pour protéger une page
 * Utilisation: const { isProtected } = useProtectedRoute();
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const returnUrl = router.asPath;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, loading, router]);

  return {
    isProtected: isAuthenticated,
    loading,
  };
}















