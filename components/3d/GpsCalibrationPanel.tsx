import type { ReactElement } from 'react';

type Props = {
  gpsPoints: any[];
  onUpdateGpsPoint: (id: string, patch: any) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function GpsCalibrationPanel({ gpsPoints, onSave, onCancel }: Props): ReactElement {
  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-4 border border-black/10">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Calibrage GPS</div>
        <div className="text-xs text-gray-600">{gpsPoints?.length ?? 0} points</div>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        UI de calibrage à implémenter. (Stub pour build)
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm" onClick={onSave}>
          Sauvegarder
        </button>
        <button className="flex-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
}


