import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';
import '../styles/hearst-theme.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { SidebarProvider } from '../contexts/SidebarContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ProjectProvider } from '../contexts/ProjectContext';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // TOUTES les pages sur le port 3333 sont en plein écran
  // Pas de Header, Sidebar ou Footer
  // Wrapper avec AuthProvider et ProjectProvider pour toute l'application
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
      </Head>
      <AuthProvider>
        <ProjectProvider>
          <Component {...pageProps} />
        </ProjectProvider>
      </AuthProvider>
    </>
  );
}

