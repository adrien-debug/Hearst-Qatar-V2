/**
 * Génère public/spline-positions.json à partir du layout 25MW (v2 DEFINITIVE).
 *
 * Objectif: avoir des points GPS cohérents avec les IDs d'équipements (TT1, TT1_A, ...)
 * pour que le mapping GPS <-> 3D soit stable et logique.
 *
 * Usage:
 *   npx tsx scripts/generate-spline-positions-25mw.ts
 */

import fs from 'fs';
import path from 'path';

import projectTemplates from '../config/project-templates.json';
import { getShapeByPower } from '../data/modularCampusShapes';
import { generateLayoutDefinitif } from '../lib/projectGenerator_v2_DEFINITIVE';
import type { GpsPoint } from '../utils/gpsToAnnotation';
import type { SiteConditions } from '../lib/projectGenerator';

function main() {
  const powerMW = 25;
  const powerConfig = (projectTemplates as any).power_configurations[String(powerMW)];
  const groundSize: number = powerConfig?.groundSize ?? 200;

  const shapeConfig = getShapeByPower(powerMW);
  if (!shapeConfig) {
    throw new Error(`Shape introuvable pour ${powerMW}MW`);
  }

  const conditions: SiteConditions = {
    soilType: 'sandy',
    climateType: 'desert',
    coolingType: 'air',
    hasConcreteSlabs: true,
    hasCirculation: true,
    hasMicroPerforatedWall: false,
  };

  const equipment = generateLayoutDefinitif(shapeConfig, conditions, groundSize);

  // Points GPS "logiques": on mappe uniquement les équipements sélectionnables
  // (transformers + containers). On ignore routes + dalles (fondations) pour éviter du bruit.
  const mappable = equipment.filter((e) => {
    if (e.type === 'road') return false;
    if (e.metadata?.isFoundation) return false;
    return e.type === 'transformer' || e.type === 'container' || e.type === 'substation' || e.type === 'switchgear';
  });

  const gpsPoints: GpsPoint[] = [];

  // Un point "substation" de référence au centre
  gpsPoints.push({
    x: 0,
    y: 0.5,
    z: 0,
    name: 'Substation_25MW',
    type: 'substation',
  });

  // Un point "powerblock" de référence (centre du layout)
  if (mappable.length > 0) {
    const xs = mappable.map((e) => e.position[0]);
    const zs = mappable.map((e) => e.position[2]);
    const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const centerZ = (Math.min(...zs) + Math.max(...zs)) / 2;

    gpsPoints.push({
      x: centerX,
      y: 0.5,
      z: centerZ,
      name: 'PowerBlock_25MW',
      type: 'powerblock',
    });
  }

  for (const e of mappable) {
    gpsPoints.push({
      x: e.position[0],
      y: e.position[1],
      z: e.position[2],
      name: e.id,
      // Types attendus par l'annotation tool
      type: e.type === 'substation' ? 'substation' : e.type,
    });
  }

  const outputJson = path.join(process.cwd(), 'public', 'spline-positions.json');
  fs.writeFileSync(outputJson, JSON.stringify(gpsPoints, null, 2), 'utf8');

  const outputCsv = path.join(process.cwd(), 'public', 'spline-positions.csv');
  const csvLines = ['Name,Type,X,Y,Z'];
  for (const p of gpsPoints) {
    csvLines.push(`${p.name},${p.type},${p.x},${p.y},${p.z}`);
  }
  fs.writeFileSync(outputCsv, csvLines.join('\n'), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`✅ spline-positions.json généré: ${outputJson}`);
  // eslint-disable-next-line no-console
  console.log(`📊 Points: ${gpsPoints.length} (mappables: ${mappable.length})`);
  // eslint-disable-next-line no-console
  console.log(`✅ spline-positions.csv généré: ${outputCsv}`);
}

main();


