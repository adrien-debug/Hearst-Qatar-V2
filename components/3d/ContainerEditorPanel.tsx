import { useState } from 'react';

interface ContainerData {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  type?: string;
}

interface ContainerEditorPanelProps {
  containers: ContainerData[];
  selectedContainer: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number; z: number }) => void;
  onDelete: (id: string) => void;
  onRotate: (id: string, rotation: { x: number; y: number; z: number }) => void;
}

export default function ContainerEditorPanel({
  containers,
  selectedContainer,
  onSelect,
  onMove,
  onDelete,
  onRotate,
}: ContainerEditorPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingPosition, setEditingPosition] = useState<{ id: string; x: number; y: number; z: number } | null>(null);
  const [editingRotation, setEditingRotation] = useState<{ id: string; x: number; y: number; z: number } | null>(null);

  const selected = containers.find((c) => c.id === selectedContainer);

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selected) return;
    const newPosition = { ...selected.position, [axis]: value };
    setEditingPosition({ id: selected.id, ...newPosition });
  };

  const handlePositionBlur = () => {
    if (editingPosition) {
      onMove(editingPosition.id, {
        x: editingPosition.x,
        y: editingPosition.y,
        z: editingPosition.z,
      });
      setEditingPosition(null);
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selected) return;
    const newRotation = { ...selected.rotation, [axis]: value };
    setEditingRotation({ id: selected.id, ...newRotation });
  };

  const handleRotationBlur = () => {
    if (editingRotation) {
      onRotate(editingRotation.id, {
        x: editingRotation.x,
        y: editingRotation.y,
        z: editingRotation.z,
      });
      setEditingRotation(null);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-sm">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📦</span>
          <h3 className="font-bold text-sm">Conteneurs ({containers.length})</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {/* Liste des conteneurs */}
          <div className="space-y-2">
            {containers.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                Aucun conteneur ajouté
              </p>
            ) : (
              containers.map((container) => (
                <div
                  key={container.id}
                  className={`p-2 rounded border cursor-pointer transition-all ${
                    selectedContainer === container.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSelect(container.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      Conteneur {container.id.slice(-6)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Supprimer ce conteneur ?')) {
                          onDelete(container.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Édition du conteneur sélectionné */}
          {selected && (
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <h4 className="text-xs font-semibold text-gray-700">Propriétés</h4>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Position (m)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">X</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPosition?.id === selected.id ? editingPosition.x : selected.position.x}
                      onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                      onBlur={handlePositionBlur}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Y</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPosition?.id === selected.id ? editingPosition.y : selected.position.y}
                      onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                      onBlur={handlePositionBlur}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Z</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPosition?.id === selected.id ? editingPosition.z : selected.position.z}
                      onChange={(e) => handlePositionChange('z', parseFloat(e.target.value) || 0)}
                      onBlur={handlePositionBlur}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Rotation (°)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">X</label>
                    <input
                      type="number"
                      step="1"
                      value={editingRotation?.id === selected.id ? editingRotation.x : selected.rotation.x}
                      onChange={(e) => handleRotationChange('x', parseFloat(e.target.value) || 0)}
                      onBlur={handleRotationBlur}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Y</label>
                    <input
                      type="number"
                      step="1"
                      value={editingRotation?.id === selected.id ? editingRotation.y : selected.rotation.y}
                      onChange={(e) => handleRotationChange('y', parseFloat(e.target.value) || 0)}
                      onBlur={handleRotationBlur}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Z</label>
                    <input
                      type="number"
                      step="1"
                      value={editingRotation?.id === selected.id ? editingRotation.z : selected.rotation.z}
                      onChange={(e) => handleRotationChange('z', parseFloat(e.target.value) || 0)}
                      onBlur={handleRotationBlur}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Informations */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Dimensions: 12.196m × 2.438m × 2.896m
                </p>
                <p className="text-xs text-gray-500">
                  Dalle béton: 40 cm
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
















