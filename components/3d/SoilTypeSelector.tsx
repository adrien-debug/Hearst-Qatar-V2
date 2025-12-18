import type { ReactElement } from 'react';

type Props = {
  projectConfig: any;
  onSoilSelected: (soilType: string) => void | Promise<void>;
  onCancel: () => void;
};

export default function SoilTypeSelector({ onSoilSelected, onCancel }: Props): ReactElement {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] max-w-[92vw]">
        <div className="font-semibold text-lg">Type de sol</div>
        <div className="text-sm text-gray-600 mt-1">Sélectionnez un type de sol (stub).</div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {['sandy', 'rocky', 'gravel', 'concrete'].map((s) => (
            <button
              key={s}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              onClick={() => onSoilSelected(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button className="px-4 py-2 rounded-lg bg-white border hover:bg-gray-50" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}


