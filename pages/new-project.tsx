import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import ProjectInitForm from '../components/ProjectInitForm';
import { Deployment, addDeployment } from '../data/deployments';
import { useDeployment } from '../contexts/DeploymentContext';
import { DeploymentProvider } from '../contexts/DeploymentContext';

function NewProjectContent() {
  const router = useRouter();
  const { setActiveDeployment, refreshDeployments } = useDeployment();
  const [isCreating, setIsCreating] = useState(false);

  const handleComplete = (deployment: Deployment) => {
    setIsCreating(true);
    
    // Ajouter le déploiement
    addDeployment(deployment);
    
    // Rafraîchir la liste
    refreshDeployments();
    
    // Définir comme actif
    setActiveDeployment(deployment);
    
    // Rediriger vers la vue 3D
    setTimeout(() => {
      router.push('/substation-3d');
    }, 100);
  };

  const handleCancel = () => {
    router.push('/substation-3d');
  };

  if (isCreating) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8AFD81] mx-auto mb-4"></div>
          <p className="text-white">Création du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Nouveau Projet 3D - Hearst Qatar</title>
        <meta name="description" content="Créer un nouveau projet 3D" />
      </Head>
      <ProjectInitForm onComplete={handleComplete} onCancel={handleCancel} />
    </>
  );
}

export default function NewProject() {
  return (
    <DeploymentProvider>
      <NewProjectContent />
    </DeploymentProvider>
  );
}



