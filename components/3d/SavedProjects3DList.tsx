import type { ReactElement } from 'react';

type Props = {
  onLoadProject: (project: any, layout: any) => void;
  onClose: () => void;
};

export default function SavedProjects3DList({ onClose }: Props): ReactElement {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[560px] max-w-[92vw]">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg">Projets sauvegardés</div>
          <button className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">Stub: liste non branchée.</div>
      </div>
    </div>
  );
}


