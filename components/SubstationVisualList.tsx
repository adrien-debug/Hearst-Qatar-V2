import React, { useState } from 'react';
import {
  mainSubstation,
  miningContainers,
  coolingSystems,
  asicMachines,
  transformers,
} from '../data/hardwareMock';
import { buildElectricalStructure } from '../data/electricalMock';

interface SubstationVisualListProps {
  onItemClick?: (itemId: string, itemType: string) => void;
}

export default function SubstationVisualList({ onItemClick }: SubstationVisualListProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    substation: true,
    powerBlocks: true,
    generators: true,
    cooling: true,
    asic: true,
  });

  const [expandedPowerBlocks, setExpandedPowerBlocks] = useState<{ [key: string]: boolean }>({});
  const [expandedTransformers, setExpandedTransformers] = useState<{ [key: string]: boolean }>({});

  const electricalStructure = buildElectricalStructure();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const togglePowerBlock = (pbId: string) => {
    setExpandedPowerBlocks(prev => ({
      ...prev,
      [pbId]: !prev[pbId],
    }));
  };

  const toggleTransformer = (trId: string) => {
    setExpandedTransformers(prev => ({
      ...prev,
      [trId]: !prev[trId],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
      case 'In Service':
        return 'bg-green-500';
      case 'Warning':
        return 'bg-yellow-500';
      case 'Maintenance':
      case 'Standby':
      case 'Off':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OK':
      case 'In Service':
        return 'Opérationnel';
      case 'Warning':
        return 'Avertissement';
      case 'Maintenance':
        return 'Maintenance';
      case 'Standby':
        return 'En attente';
      case 'Off':
        return 'Arrêté';
      default:
        return status;
    }
  };

  // Organiser les conteneurs par section
  const containersBySection = miningContainers.reduce((acc, container) => {
    const section = container.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(container);
    return acc;
  }, {} as { [key: string]: typeof miningContainers });

  // Organiser les transformateurs par Power Block
  const transformersByPowerBlock = electricalStructure.children?.filter(
    child => child.type === 'section'
  ) || [];

  // Organiser les générateurs
  const generators = electricalStructure.children?.filter(
    child => child.type === 'generator'
  ) || [];

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mainSubstation.name}
              </h1>
              <p className="text-gray-600">
                Capacité totale: <span className="font-semibold">{mainSubstation.totalCapacityMW} MW</span>
              </p>
              <p className="text-gray-600">
                Tension: <span className="font-semibold">{mainSubstation.inputVoltage} → {mainSubstation.outputVoltage}</span>
              </p>
              <p className="text-gray-600">
                Feeders: <span className="font-semibold">{mainSubstation.feedersCount}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">
                {mainSubstation.totalCapacityMW} MW
              </div>
              <div className="text-sm text-gray-500 mt-1">Capacité totale</div>
            </div>
          </div>
        </div>

        {/* Power Blocks */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('powerBlocks')}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-between hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-xl font-bold">Power Blocks</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                {transformersByPowerBlock.length}
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${expandedSections.powerBlocks ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.powerBlocks && (
            <div className="p-6 space-y-4">
              {transformersByPowerBlock.map((powerBlock) => {
                const pbNumber = powerBlock.id.replace('PowerBlock_', '');
                const pbTransformers = powerBlock.children || [];
                const isExpanded = expandedPowerBlocks[powerBlock.id];

                return (
                  <div key={powerBlock.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => togglePowerBlock(powerBlock.id)}
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(powerBlock.status)}`}></div>
                        <span className="font-semibold text-gray-900">{powerBlock.name}</span>
                        <span className="text-sm text-gray-600">
                          ({powerBlock.capacityMW} MW)
                        </span>
                        <span className="text-sm text-gray-500">
                          • {pbTransformers.length} transformateurs
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-gray-50 space-y-3">
                        {pbTransformers.map((transformer) => {
                          const trContainers = transformer.children || [];
                          const isTrExpanded = expandedTransformers[transformer.id];
                          const containerIds = trContainers.map(c => c.id);

                          return (
                            <div key={transformer.id} className="border border-gray-200 rounded-lg bg-white">
                              <button
                                onClick={() => toggleTransformer(transformer.id)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${getStatusColor(transformer.status || 'OK')}`}></div>
                                  <span className="font-medium text-gray-800">{transformer.name}</span>
                                  <span className="text-sm text-gray-600">
                                    ({transformer.capacityMVA} MVA)
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    • {trContainers.length} containers HD5
                                  </span>
                                </div>
                                <svg
                                  className={`w-5 h-5 text-gray-400 transition-transform ${isTrExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {isTrExpanded && (
                                <div className="p-4 space-y-3 bg-gray-50">
                                  {trContainers.map((containerNode) => {
                                    // Trouver le conteneur correspondant dans miningContainers
                                    const container = miningContainers.find(
                                      c => c.id === containerNode.id || 
                                      containerNode.id.includes(c.id.replace('C', '').replace('-', ''))
                                    );

                                    if (!container) {
                                      return (
                                        <div key={containerNode.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <h4 className="font-semibold text-gray-900">{containerNode.name}</h4>
                                              <p className="text-sm text-gray-600">Capacité: {containerNode.capacityMW} MW</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(containerNode.status)} text-white`}>
                                              {getStatusText(containerNode.status)}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div
                                        key={container.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => onItemClick?.(container.id, 'container')}
                                      >
                                        <div className="flex items-start justify-between mb-3">
                                          <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">{container.name}</h4>
                                            <p className="text-sm text-gray-600 mb-2">{container.type}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div>
                                                <span className="text-gray-500">Capacité:</span>
                                                <span className="font-semibold ml-1">{container.capacityMW} MW</span>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">Machines:</span>
                                                <span className="font-semibold ml-1">{container.machinesCount}</span>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">Hashrate:</span>
                                                <span className="font-semibold ml-1">{container.hashrateTHs.toLocaleString()} TH/s</span>
                                              </div>
                                              <div>
                                                <span className="text-gray-500">Uptime:</span>
                                                <span className="font-semibold ml-1">{container.uptime.toFixed(1)}%</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(container.status)} text-white`}>
                                            {getStatusText(container.status)}
                                          </div>
                                        </div>

                                        {/* Module de refroidissement */}
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                              <span>❄️</span>
                                              Module de Refroidissement
                                            </h5>
                                            <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(container.coolingModule.status)} text-white`}>
                                              {getStatusText(container.coolingModule.status)}
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div>
                                              <span>Capacité:</span>
                                              <span className="font-semibold ml-1">{container.coolingModule.coolingCapacitykW} kW</span>
                                            </div>
                                            <div>
                                              <span>Débit:</span>
                                              <span className="font-semibold ml-1">{container.coolingModule.flowRate}</span>
                                            </div>
                                            <div>
                                              <span>Temp. entrée:</span>
                                              <span className="font-semibold ml-1">{container.coolingModule.temperatureIn}°C</span>
                                            </div>
                                            <div>
                                              <span>Temp. sortie:</span>
                                              <span className="font-semibold ml-1">{container.coolingModule.temperatureOut}°C</span>
                                            </div>
                                            <div>
                                              <span>Efficacité:</span>
                                              <span className="font-semibold ml-1">{container.coolingModule.efficiency}%</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Mineurs ASIC */}
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <span>⛏️</span>
                                            Mineurs ASIC
                                          </h5>
                                          <div className="text-xs text-gray-600 space-y-1">
                                            <div className="flex justify-between">
                                              <span>Machines actives:</span>
                                              <span className="font-semibold">{container.activeMachines} / {container.machinesCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Consommation:</span>
                                              <span className="font-semibold">{container.powerConsumptionMW.toFixed(2)} MW</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Production BTC/jour:</span>
                                              <span className="font-semibold">{container.dailyProductionBTC.toFixed(6)} BTC</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Efficacité:</span>
                                              <span className="font-semibold">{container.efficiencyJTH} J/TH</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Générateurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('generators')}
            className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center justify-between hover:from-yellow-600 hover:to-yellow-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <h2 className="text-xl font-bold">Générateurs</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                {generators.length}
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${expandedSections.generators ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.generators && (
            <div className="p-6 space-y-4">
              {generators.map((generator) => {
                const genContainers = generator.children || [];
                return (
                  <div key={generator.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{generator.name}</h3>
                        <p className="text-sm text-gray-600">Capacité: {generator.capacityMW} MW</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(generator.status)} text-white`}>
                        {getStatusText(generator.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Containers HD5 associés:</p>
                      {genContainers.map((containerNode) => (
                        <div key={containerNode.id} className="bg-white border border-gray-200 rounded p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{containerNode.name}</span>
                            <span className="text-sm text-gray-600">{containerNode.capacityMW} MW</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Systèmes de refroidissement */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('cooling')}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white flex items-center justify-between hover:from-cyan-600 hover:to-cyan-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <h2 className="text-xl font-bold">Systèmes de Refroidissement</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                {coolingSystems.length}
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${expandedSections.cooling ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.cooling && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {coolingSystems.map((system) => (
                <div key={system.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{system.type}</h3>
                    <span className="text-sm font-semibold text-gray-700">{system.thermalCapacityMW} MW</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">ID:</span>
                      <span className="font-semibold ml-2">{system.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sections couvertes:</span>
                      <div className="mt-1">
                        {system.sectionsCovered.map((section, idx) => (
                          <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Containers:</span>
                      <span className="font-semibold ml-2">{system.containersCovered.length}</span>
                    </div>
                    {system.notes && (
                      <div className="text-gray-600 italic mt-2">
                        {system.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Machines ASIC - Vue globale */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('asic')}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center justify-between hover:from-indigo-600 hover:to-indigo-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <h2 className="text-xl font-bold">Machines ASIC (Mineurs)</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                {asicMachines.length} modèles
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${expandedSections.asic ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.asic && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {asicMachines.map((machine) => (
                <div key={machine.batch} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-2">{machine.model}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marque:</span>
                      <span className="font-semibold">{machine.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch:</span>
                      <span className="font-semibold">{machine.batch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hashrate:</span>
                      <span className="font-semibold">{machine.hashrateTHs} TH/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puissance:</span>
                      <span className="font-semibold">{machine.powerConsumptionkW} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficacité:</span>
                      <span className="font-semibold">{machine.efficiencyJTH} J/TH</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Installées:</span>
                        <span className="font-semibold">{machine.totalInstalled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actives:</span>
                        <span className="font-semibold text-green-600">{machine.activeCount}</span>
                      </div>
                      {machine.installationDate && (
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Installation:</span>
                          <span className="font-semibold text-xs">{machine.installationDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistiques globales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques Globales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {miningContainers.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Containers HD5</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {miningContainers.reduce((sum, c) => sum + c.machinesCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Machines ASIC</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {miningContainers.reduce((sum, c) => sum + c.hashrateTHs, 0).toLocaleString()} TH/s
              </div>
              <div className="text-sm text-gray-600 mt-1">Hashrate Total</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {miningContainers.reduce((sum, c) => sum + c.powerConsumptionMW, 0).toFixed(1)} MW
              </div>
              <div className="text-sm text-gray-600 mt-1">Consommation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

