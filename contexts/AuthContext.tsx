/**
 * Context d'Authentification
 * Gère l'état global de l'authentification avec Supabase
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';

interface AuthContextType {
  // État
  user: User | null;
  session: Session | null;
  loading: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  
  // Helpers
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider du contexte d'authentification
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialiser la session au montage
  useEffect(() => {
    // Récupérer la session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Connexion avec email et mot de passe
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erreur de connexion:', error.message);
        return { error };
      }

      setSession(data.session);
      setUser(data.user);
      
      console.log('✅ Connexion réussie:', data.user.email);
      return { error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de la connexion:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription avec email et mot de passe
   */
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Erreur d\'inscription:', error.message);
        return { error };
      }

      // Note: Selon la configuration Supabase, l'utilisateur peut devoir confirmer son email
      console.log('✅ Inscription réussie:', data.user?.email);
      
      // Si la confirmation email n'est pas requise, la session sera créée automatiquement
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de l\'inscription:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion
   */
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erreur de déconnexion:', error.message);
        throw error;
      }

      setSession(null);
      setUser(null);
      
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('Erreur inattendue lors de la déconnexion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook pour obtenir l'ID de l'utilisateur actuel
 */
export function useUserId(): string | null {
  const { user } = useAuth();
  return user?.id ?? null;
}

/**
 * Hook pour vérifier si l'utilisateur est authentifié
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}















