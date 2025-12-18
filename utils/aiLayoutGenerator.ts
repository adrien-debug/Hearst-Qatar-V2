import { ModulePlacement } from './moduleDrawingHelpers';
import { generatePattern } from './moduleDrawingHelpers';
import { HD5_DIMENSIONS } from '../components/3d/HD5Container';

export interface ParsedCommand {
  action: 'place' | 'arrange' | 'create';
  moduleType: string;
  count?: number;
  pattern?: 'grid' | 'line' | 'circle' | 'rows';
  params?: {
    rows?: number;
    columns?: number;
    spacing?: number;
    radius?: number;
    angle?: number;
  };
  position?: [number, number, number];
}

/**
 * Service IA avancé pour génération de layouts via commandes naturelles
 */
export class AILayoutGenerator {
  /**
   * Parse une commande textuelle naturelle
   */
  static parseCommand(command: string): ParsedCommand | null {
    const lowerCommand = command.toLowerCase().trim();

    // Patterns de reconnaissance
    const patterns = [
      // "place 10 containers in 2 rows"
      {
        regex: /place\s+(\d+)\s+(?:container|module|hd5)/i,
        action: 'place' as const,
        extractCount: (match: RegExpMatchArray) => parseInt(match[1]),
      },
      // "arrange containers in a grid 3x4"
      {
        regex: /arrange\s+(?:container|module|hd5).*grid\s+(\d+)x(\d+)/i,
        action: 'arrange' as const,
        extractGrid: (match: RegExpMatchArray) => ({
          rows: parseInt(match[1]),
          columns: parseInt(match[2]),
        }),
      },
      // "create a line of 5 containers"
      {
        regex: /create\s+(?:a\s+)?line\s+of\s+(\d+)/i,
        action: 'create' as const,
        pattern: 'line' as const,
        extractCount: (match: RegExpMatchArray) => parseInt(match[1]),
      },
      // "place containers in a circle with radius 15"
      {
        regex: /place.*circle.*radius\s+(\d+)/i,
        action: 'place' as const,
        pattern: 'circle' as const,
        extractRadius: (match: RegExpMatchArray) => parseFloat(match[1]),
      },
    ];

    for (const pattern of patterns) {
      const match = lowerCommand.match(pattern.regex);
      if (match) {
        const result: ParsedCommand = {
          action: pattern.action,
          moduleType: 'HD5',
        };

        if ('extractCount' in pattern && pattern.extractCount) {
          result.count = pattern.extractCount(match);
        }

        if ('extractGrid' in pattern && pattern.extractGrid) {
          const grid = pattern.extractGrid(match);
          result.pattern = 'grid';
          result.params = { rows: grid.rows, columns: grid.columns };
        }

        if ('pattern' in pattern) {
          result.pattern = pattern.pattern;
        }

        if ('extractRadius' in pattern && pattern.extractRadius) {
          result.params = { radius: pattern.extractRadius(match) };
        }

        // Détecter "rows" ou "columns"
        if (lowerCommand.includes('row')) {
          const rowMatch = lowerCommand.match(/(\d+)\s+row/i);
          if (rowMatch) {
            result.pattern = 'rows';
            result.params = { rows: parseInt(rowMatch[1]) };
          }
        }

        return result;
      }
    }

    return null;
  }

  /**
   * Génère un layout complet basé sur une commande
   */
  static generateLayout(
    command: string,
    center: [number, number, number] = [0, 0, 0]
  ): ModulePlacement[] {
    const parsed = this.parseCommand(command);
    if (!parsed) {
      return [];
    }

    const modules: ModulePlacement[] = [];
    const spacing = HD5_DIMENSIONS.width + 2;

    switch (parsed.action) {
      case 'place':
        if (parsed.pattern === 'rows' && parsed.params?.rows) {
          // Placement en rangées
          const count = parsed.count || 10;
          const rows = parsed.params.rows;
          const perRow = Math.ceil(count / rows);

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < perRow && modules.length < count; col++) {
              modules.push({
                id: `module_${Date.now()}_${modules.length}`,
                type: parsed.moduleType,
                position: [
                  center[0] + (col - perRow / 2) * spacing,
                  center[1],
                  center[2] + (row - rows / 2) * spacing,
                ],
              });
            }
          }
        } else if (parsed.pattern === 'grid' && parsed.params) {
          // Grille
          const positions = generatePattern('grid', center, {
            rows: parsed.params.rows,
            columns: parsed.params.columns,
            spacing: spacing,
          });

          positions.forEach((pos, index) => {
            modules.push({
              id: `module_${Date.now()}_${index}`,
              type: parsed.moduleType,
              position: pos,
            });
          });
        } else if (parsed.pattern === 'line' && parsed.count) {
          // Ligne
          const positions = generatePattern('line', center, {
            count: parsed.count,
            spacing: spacing,
            angle: parsed.params?.angle || 0,
          });

          positions.forEach((pos, index) => {
            modules.push({
              id: `module_${Date.now()}_${index}`,
              type: parsed.moduleType,
              position: pos,
            });
          });
        } else if (parsed.pattern === 'circle' && parsed.params?.radius) {
          // Cercle
          const positions = generatePattern('circle', center, {
            count: parsed.count || 8,
            radius: parsed.params.radius,
          });

          positions.forEach((pos, index) => {
            modules.push({
              id: `module_${Date.now()}_${index}`,
              type: parsed.moduleType,
              position: pos,
            });
          });
        } else if (parsed.count) {
          // Placement simple
          for (let i = 0; i < parsed.count; i++) {
            modules.push({
              id: `module_${Date.now()}_${i}`,
              type: parsed.moduleType,
              position: [
                center[0] + (i % 5) * spacing,
                center[1],
                center[2] + Math.floor(i / 5) * spacing,
              ],
            });
          }
        }
        break;

      case 'arrange':
        if (parsed.pattern === 'grid' && parsed.params) {
          const positions = generatePattern('grid', center, {
            rows: parsed.params.rows,
            columns: parsed.params.columns,
            spacing: spacing,
          });

          positions.forEach((pos, index) => {
            modules.push({
              id: `module_${Date.now()}_${index}`,
              type: parsed.moduleType,
              position: pos,
            });
          });
        }
        break;

      case 'create':
        if (parsed.pattern === 'line' && parsed.count) {
          const positions = generatePattern('line', center, {
            count: parsed.count,
            spacing: spacing,
          });

          positions.forEach((pos, index) => {
            modules.push({
              id: `module_${Date.now()}_${index}`,
              type: parsed.moduleType,
              position: pos,
            });
          });
        }
        break;
    }

    return modules;
  }

  /**
   * Génère des layouts prédéfinis
   */
  static getPredefinedLayouts(): Array<{
    name: string;
    description: string;
    command: string;
  }> {
    return [
      {
        name: 'Grille 4x4',
        description: '16 modules en grille 4x4',
        command: 'arrange containers in a grid 4x4',
      },
      {
        name: 'Ligne de 10',
        description: '10 modules en ligne',
        command: 'create a line of 10 containers',
      },
      {
        name: 'Cercle de 8',
        description: '8 modules en cercle',
        command: 'place containers in a circle with radius 15',
      },
      {
        name: '2 Rangées',
        description: '10 modules en 2 rangées',
        command: 'place 10 containers in 2 rows',
      },
    ];
  }
}















