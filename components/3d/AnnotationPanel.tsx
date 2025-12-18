import type { ReactElement } from 'react';
import type { AnnotationLine, AnnotationPoint } from './AnnotationTool3D';

type Props = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  points: AnnotationPoint[];
  lines: AnnotationLine[];
  onClearAll: () => void;
  onDeletePoint: (id: string) => void;
  onDeleteLine: (id: string) => void;
  onExport: () => void;
  onImport: (data: any) => void;
  onUpdatePoint: (id: string, patch: Partial<AnnotationPoint>) => void;
};

export default function AnnotationPanel(props: Props): ReactElement {
  const {
    enabled,
    onToggle,
    points,
    lines,
    onClearAll,
    onDeletePoint,
    onDeleteLine,
    onExport,
  } = props;

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-4 w-80 border border-black/10">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Annotations</div>
        <button
          className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => onToggle(!enabled)}
        >
          {enabled ? 'Fermer' : 'Ouvrir'}
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Points</span>
          <span className="font-mono">{points.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Lignes</span>
          <span className="font-mono">{lines.length}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onExport}>
          Export
        </button>
        <button className="flex-1 text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200" onClick={onClearAll}>
          Clear
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-600 mb-2">Derniers points</div>
        <div className="max-h-40 overflow-auto space-y-1">
          {points.slice(-5).reverse().map((p) => (
            <div key={p.id} className="flex items-center justify-between text-xs">
              <span className="truncate">{p.label || p.type}</span>
              <button className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100" onClick={() => onDeletePoint(p.id)}>
                Suppr.
              </button>
            </div>
          ))}
          {points.length === 0 && <div className="text-xs text-gray-500">Aucun point.</div>}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-600 mb-2">Dernières lignes</div>
        <div className="max-h-28 overflow-auto space-y-1">
          {lines.slice(-5).reverse().map((l) => (
            <div key={l.id} className="flex items-center justify-between text-xs">
              <span className="truncate">{l.label || l.id}</span>
              <button className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100" onClick={() => onDeleteLine(l.id)}>
                Suppr.
              </button>
            </div>
          ))}
          {lines.length === 0 && <div className="text-xs text-gray-500">Aucune ligne.</div>}
        </div>
      </div>

      {/* NOTE: onImport/onUpdatePoint utilisés par la page; UI minimal ici */}
    </div>
  );
}


