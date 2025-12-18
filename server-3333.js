/**
 * Serveur dédié Port 3333 - Système Modulaire 3D
 * Serveur Next.js autonome pour la création et visualisation de projets
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3333;

// Créer l'app Next.js
const app = next({ 
  dev, 
  hostname, 
  port,
  dir: __dirname,
  conf: {
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    distDir: '.next-3333',
  }
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 SYSTÈME MODULAIRE 3D - Port ${port}                      ║
║                                                            ║
║   📦 Serveur: http://${hostname}:${port}                        ║
║   🎨 Mode: ${dev ? 'Development' : 'Production'}                              ║
║                                                            ║
║   ✅ Wizard Création: http://${hostname}:${port}/              ║
║   ✅ Environnement 3D: http://${hostname}:${port}/environment  ║
║                                                            ║
║   🎯 Configurations disponibles:                          ║
║      • 5MW, 25MW, 50MW, 75MW                              ║
║      • 100MW, 125MW, 150MW, 175MW, 200MW                  ║
║                                                            ║
║   🎬 Modèles Ultra-Réalistes 4K uniquement                ║
║   🏗️  Infrastructure VRD complète                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
});
