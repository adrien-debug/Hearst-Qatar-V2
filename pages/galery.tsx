/**
 * Redirection vers /gallery (correction de l'orthographe)
 * Route: /galery -> /gallery
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function GaleryRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers /gallery
    router.replace('/gallery');
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirection... - Hearst Qatar</title>
      </Head>
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8AFD81] mx-auto mb-4"></div>
          <p className="text-white">Redirection vers la galerie...</p>
        </div>
      </div>
    </>
  );
}


