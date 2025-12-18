import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const LOG_PATH = path.join(process.cwd(), '.cursor', 'debug.log');
const logDebug = (location: string, message: string, data: any, hypothesisId: string) => {
  try {
    const logEntry = {
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId,
    };
    fs.appendFileSync(LOG_PATH, JSON.stringify(logEntry) + '\n');
  } catch (e) {
    // Ignore log errors
  }
};

const execAsync = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Chemin du script Python
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_excel_configurator.py');
    const outputPath = path.join(process.cwd(), 'mining_configurator.xlsx');


    // Vérifier que le script existe
    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({ error: 'Script Python introuvable' });
    }

    // Chercher le fichier JSON dans plusieurs emplacements possibles
    const possibleJsonPaths = [
      path.join(process.cwd(), 'data', 'mining_configurator_full_v2.json'),
      path.join(process.cwd(), 'mining_configurator_full_v2.json'),
      path.join(process.cwd(), '..', 'mining_configurator_full_v2.json'),
    ];

    let jsonPath: string | null = null;
    for (const candidatePath of possibleJsonPaths) {
      const exists = fs.existsSync(candidatePath);
      if (exists) {
        jsonPath = candidatePath;
        break;
      }
    }

    // Construire la commande Python avec le chemin JSON si trouvé
    let command = `python3 "${scriptPath}"`;
    if (jsonPath) {
      command += ` "${jsonPath}"`;
    }

    // Exécuter le script Python
    let stdout = '';
    let stderr = '';
    try {
      const result = await execAsync(command, {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024 * 10, // 10MB
      });
      stdout = result.stdout || '';
      stderr = result.stderr || '';
    } catch (execError: any) {
      stdout = execError.stdout || '';
      stderr = execError.stderr || '';
      // Re-throw pour que le catch principal gère l'erreur
      throw execError;
    }

    // Afficher la sortie du script pour le débogage
    if (stdout) {
      console.log('Sortie script Python:', stdout);
    }
    
    if (stderr && !stderr.includes('DeprecationWarning')) {
      console.error('Erreur script Python:', stderr);
    }

    // Vérifier que le fichier Excel a été créé
    const excelExists = fs.existsSync(outputPath);
    if (!excelExists) {
      const errorDetails = {
        stdout: stdout || '',
        stderr: stderr || '',
        jsonPath: jsonPath || 'non trouvé',
        scriptPath,
        outputPath,
      };
      console.error('Fichier Excel non généré:', errorDetails);
      return res.status(500).json({ 
        error: 'Fichier Excel non généré',
        details: stdout || stderr,
        debug: errorDetails
      });
    }

    // Lire le fichier Excel
    const fileBuffer = fs.readFileSync(outputPath);

    // Envoyer le fichier
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=mining_configurator.xlsx');
    res.send(fileBuffer);
  } catch (error: any) {
    console.error('Erreur génération Excel:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération',
      details: error.message 
    });
  }
}

















