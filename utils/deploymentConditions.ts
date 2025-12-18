/**
 * Système de conditions de déploiement
 * Valide les déploiements selon des règles de puissance, distance et coupure électrique
 */

import { LayoutElement } from './layoutGenerator';
import { ProjectConfig } from '../components/NewProjectModal';

// Types de conditions
export interface PowerCondition {
  type: 'power';
  minPowerMW?: number;
  maxPowerMW?: number;
  targetPowerMW?: number;
  tolerancePercent?: number;
}

export interface DistanceCondition {
  type: 'distance';
  minDistanceBetweenContainers?: number;
  minDistanceToTransformer?: number;
  minDistanceToPowerBlock?: number;
  minDistanceToSubstation?: number;
}

export interface CutoffCondition {
  type: 'cutoff';
  maxPowerPerSection?: number;
  enableAutomaticCutoff?: boolean;
  cutoffThresholdPercent?: number;
}

export type DeploymentCondition = PowerCondition | DistanceCondition | CutoffCondition;

// Résultat de validation
export interface ValidationResult {
  isValid: boolean;
  status: 'ok' | 'warning' | 'error';
  message: string;
  violations?: ValidationViolation[];
}

export interface ValidationViolation {
  type: 'power' | 'distance' | 'cutoff';
  severity: 'error' | 'warning';
  message: string;
  details?: Record<string, any>;
}

// Configuration par défaut
const DEFAULT_POWER_PER_CONTAINER = 3.2; // MW par container HD5
const DEFAULT_CONTAINER_SPACING = 3; // mètres
const DEFAULT_TRANSFORMER_SPACING = 10; // mètres
const DEFAULT_POWERBLOCK_SPACING = 20; // mètres
const DEFAULT_SUBSTATION_SPACING = 30; // mètres

/**
 * Calcule la puissance totale du layout
 */
export function calculateTotalPower(layout: LayoutElement[]): number {
  const containers = layout.filter(el => el.type === 'Container');
  return containers.length * DEFAULT_POWER_PER_CONTAINER;
}

/**
 * Calcule la distance entre deux éléments
 */
function calculateDistance(
  el1: LayoutElement,
  el2: LayoutElement
): number {
  const dx = el1.x - el2.x;
  const dz = (el1.z || 0) - (el2.z || 0);
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Valide les conditions de puissance
 */
function validatePowerCondition(
  condition: PowerCondition,
  totalPower: number
): ValidationResult {
  const violations: ValidationViolation[] = [];
  let status: 'ok' | 'warning' | 'error' = 'ok';

  // Vérifier les limites min/max
  if (condition.minPowerMW !== undefined && totalPower < condition.minPowerMW) {
    violations.push({
      type: 'power',
      severity: 'error',
      message: `Puissance insuffisante: ${totalPower.toFixed(2)} MW < ${condition.minPowerMW} MW`,
      details: { current: totalPower, required: condition.minPowerMW },
    });
    status = 'error';
  }

  if (condition.maxPowerMW !== undefined && totalPower > condition.maxPowerMW) {
    violations.push({
      type: 'power',
      severity: 'error',
      message: `Puissance excessive: ${totalPower.toFixed(2)} MW > ${condition.maxPowerMW} MW`,
      details: { current: totalPower, max: condition.maxPowerMW },
    });
    status = 'error';
  }

  // Vérifier l'écart avec la cible
  if (condition.targetPowerMW !== undefined) {
    const tolerance = condition.tolerancePercent || 10;
    const toleranceMW = (condition.targetPowerMW * tolerance) / 100;
    const difference = Math.abs(totalPower - condition.targetPowerMW);

    if (difference > toleranceMW) {
      violations.push({
        type: 'power',
        severity: 'warning',
        message: `Écart avec la cible: ${totalPower.toFixed(2)} MW (cible: ${condition.targetPowerMW} MW, tolérance: ±${tolerance}%)`,
        details: {
          current: totalPower,
          target: condition.targetPowerMW,
          difference,
          tolerance: toleranceMW,
        },
      });
      if (status === 'ok') {
        status = 'warning';
      }
    }
  }

  return {
    isValid: violations.length === 0 || violations.every(v => v.severity === 'warning'),
    status,
    message: violations.length === 0
      ? `Puissance OK: ${totalPower.toFixed(2)} MW`
      : violations.map(v => v.message).join('; '),
    violations,
  };
}

/**
 * Valide les conditions de distance
 */
function validateDistanceCondition(
  condition: DistanceCondition,
  layout: LayoutElement[]
): ValidationResult {
  const violations: ValidationViolation[] = [];
  let status: 'ok' | 'warning' | 'error' = 'ok';

  const containers = layout.filter(el => el.type === 'Container');
  const transformers = layout.filter(el => el.type === 'Transformateur');
  const powerBlocks = layout.filter(el => el.type === 'PowerBlock');
  const substations = layout.filter(el => el.id.includes('Substation'));

  // Vérifier les distances entre containers
  if (condition.minDistanceBetweenContainers !== undefined) {
    for (let i = 0; i < containers.length; i++) {
      for (let j = i + 1; j < containers.length; j++) {
        const distance = calculateDistance(containers[i], containers[j]);
        if (distance < condition.minDistanceBetweenContainers) {
          violations.push({
            type: 'distance',
            severity: 'error',
            message: `Distance insuffisante entre containers: ${distance.toFixed(2)} m < ${condition.minDistanceBetweenContainers} m`,
            details: {
              container1: containers[i].id,
              container2: containers[j].id,
              distance,
              required: condition.minDistanceBetweenContainers,
            },
          });
          status = 'error';
        }
      }
    }
  }

  // Vérifier les distances aux transformateurs
  if (condition.minDistanceToTransformer !== undefined) {
    containers.forEach(container => {
      transformers.forEach(transformer => {
        const distance = calculateDistance(container, transformer);
        if (distance < condition.minDistanceToTransformer!) {
          violations.push({
            type: 'distance',
            severity: 'warning',
            message: `Container trop proche du transformateur: ${distance.toFixed(2)} m < ${condition.minDistanceToTransformer} m`,
            details: {
              container: container.id,
              transformer: transformer.id,
              distance,
              required: condition.minDistanceToTransformer,
            },
          });
          if (status === 'ok') {
            status = 'warning';
          }
        }
      });
    });
  }

  // Vérifier les distances aux Power Blocks
  if (condition.minDistanceToPowerBlock !== undefined) {
    containers.forEach(container => {
      powerBlocks.forEach(powerBlock => {
        const distance = calculateDistance(container, powerBlock);
        if (distance < condition.minDistanceToPowerBlock!) {
          violations.push({
            type: 'distance',
            severity: 'warning',
            message: `Container trop proche du Power Block: ${distance.toFixed(2)} m < ${condition.minDistanceToPowerBlock} m`,
            details: {
              container: container.id,
              powerBlock: powerBlock.id,
              distance,
              required: condition.minDistanceToPowerBlock,
            },
          });
          if (status === 'ok') {
            status = 'warning';
          }
        }
      });
    });
  }

  // Vérifier les distances à la substation
  if (condition.minDistanceToSubstation !== undefined) {
    containers.forEach(container => {
      substations.forEach(substation => {
        const distance = calculateDistance(container, substation);
        if (distance < condition.minDistanceToSubstation!) {
          violations.push({
            type: 'distance',
            severity: 'error',
            message: `Container trop proche de la substation: ${distance.toFixed(2)} m < ${condition.minDistanceToSubstation} m`,
            details: {
              container: container.id,
              substation: substation.id,
              distance,
              required: condition.minDistanceToSubstation,
            },
          });
          status = 'error';
        }
      });
    });
  }

  return {
    isValid: violations.length === 0,
    status,
    message: violations.length === 0
      ? 'Distances OK'
      : violations.map(v => v.message).join('; '),
    violations,
  };
}

/**
 * Valide les conditions de coupure
 */
function validateCutoffCondition(
  condition: CutoffCondition,
  layout: LayoutElement[]
): ValidationResult {
  const violations: ValidationViolation[] = [];
  let status: 'ok' | 'warning' | 'error' = 'ok';

  const maxPowerPerSection = condition.maxPowerPerSection || 50; // MW par défaut
  const threshold = condition.cutoffThresholdPercent || 90; // % par défaut

  // Grouper les containers par Power Block (section)
  const powerBlocks = layout.filter(el => el.type === 'PowerBlock');
  const containers = layout.filter(el => el.type === 'Container');

  // Calculer la puissance par section
  const powerBySection: Record<string, number> = {};
  
  powerBlocks.forEach(pb => {
    // Trouver les containers associés à ce Power Block (par proximité ou phase)
    const associatedContainers = containers.filter(c => {
      const distance = calculateDistance(c, pb);
      return distance < 50; // Rayon de 50m pour associer un container à un Power Block
    });
    
    const sectionPower = associatedContainers.length * DEFAULT_POWER_PER_CONTAINER;
    powerBySection[pb.id] = sectionPower;
    
    // Vérifier les surcharges
    const thresholdMW = (maxPowerPerSection * threshold) / 100;
    if (sectionPower > thresholdMW) {
      violations.push({
        type: 'cutoff',
        severity: sectionPower > maxPowerPerSection ? 'error' : 'warning',
        message: `Surcharge section ${pb.id}: ${sectionPower.toFixed(2)} MW (max: ${maxPowerPerSection} MW)`,
        details: {
          section: pb.id,
          current: sectionPower,
          max: maxPowerPerSection,
          threshold: thresholdMW,
        },
      });
      if (sectionPower > maxPowerPerSection) {
        status = 'error';
      } else if (status === 'ok') {
        status = 'warning';
      }
    }
  });

  return {
    isValid: violations.length === 0 || violations.every(v => v.severity === 'warning'),
    status,
    message: violations.length === 0
      ? 'Coupures OK'
      : violations.map(v => v.message).join('; '),
    violations,
  };
}

/**
 * Valide toutes les conditions de déploiement
 */
export function validateDeploymentConditions(
  layout: LayoutElement[],
  conditions: DeploymentCondition[],
  project?: ProjectConfig
): ValidationResult {
  if (conditions.length === 0) {
    return {
      isValid: true,
      status: 'ok',
      message: 'Aucune condition à valider',
    };
  }

  const allViolations: ValidationViolation[] = [];
  let overallStatus: 'ok' | 'warning' | 'error' = 'ok';
  const messages: string[] = [];

  // Calculer la puissance totale une seule fois
  const totalPower = calculateTotalPower(layout);

  // Valider chaque condition
  conditions.forEach(condition => {
    let result: ValidationResult;

    switch (condition.type) {
      case 'power':
        result = validatePowerCondition(condition, totalPower);
        break;
      case 'distance':
        result = validateDistanceCondition(condition, layout);
        break;
      case 'cutoff':
        result = validateCutoffCondition(condition, layout);
        break;
      default:
        return;
    }

    if (result.violations) {
      allViolations.push(...result.violations);
    }

    if (result.status === 'error') {
      overallStatus = 'error';
    } else if (result.status === 'warning' && overallStatus === 'ok') {
      overallStatus = 'warning';
    }

    messages.push(result.message);
  });

  return {
    isValid: allViolations.length === 0 || allViolations.every(v => v.severity === 'warning'),
    status: overallStatus,
    message: messages.join(' | '),
    violations: allViolations.length > 0 ? allViolations : undefined,
  };
}

/**
 * Crée des conditions par défaut basées sur la configuration du projet
 */
export function createDefaultConditions(project?: ProjectConfig): DeploymentCondition[] {
  const conditions: DeploymentCondition[] = [];

  if (project) {
    // Condition de puissance basée sur la cible du projet
    if (project.power_target_mw) {
      conditions.push({
        type: 'power',
        targetPowerMW: project.power_target_mw,
        tolerancePercent: 10,
        minPowerMW: project.power_target_mw * 0.9,
        maxPowerMW: project.power_target_mw * 1.1,
      });
    }

    // Condition de distance par défaut
    conditions.push({
      type: 'distance',
      minDistanceBetweenContainers: DEFAULT_CONTAINER_SPACING,
      minDistanceToTransformer: DEFAULT_TRANSFORMER_SPACING,
      minDistanceToPowerBlock: DEFAULT_POWERBLOCK_SPACING,
      minDistanceToSubstation: DEFAULT_SUBSTATION_SPACING,
    });

    // Condition de coupure par défaut
    conditions.push({
      type: 'cutoff',
      maxPowerPerSection: 50, // 50 MW par Power Block
      enableAutomaticCutoff: false,
      cutoffThresholdPercent: 90,
    });
  }

  return conditions;
}

















