import type { ReactElement } from 'react';

type Props = {
  className?: string;
  onNewProject?: () => void;
  showNewProject?: boolean;
};

export default function DeploymentTabs({ className, onNewProject, showNewProject }: Props): ReactElement {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur border-b border-black/10 shadow-sm">
        <div className="font-semibold text-gray-900">Déploiement</div>
        <div className="flex-1" />
        {showNewProject && (
          <button
            onClick={onNewProject}
            className="px-3 py-2 rounded-lg bg-[#8AFD81] text-gray-900 font-semibold hover:brightness-95 transition"
          >
            Nouveau projet
          </button>
        )}
      </div>
    </div>
  );
}


