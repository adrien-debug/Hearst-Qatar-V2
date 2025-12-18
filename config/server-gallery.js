/**
 * Serveur dédié pour le Configurateur 3D - 100% Autonome
 * Port: 3333
 * Pages: pages-gallery/ (dossier séparé)
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3333;

const fs = require('fs');
const logPath = '/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/.cursor/debug.log';
function log(message, data, hypothesisId) {
  const entry = JSON.stringify({location:'server-gallery.js',message,data,timestamp:Date.now(),sessionId:'debug-session',hypothesisId}) + '\n';
  fs.appendFileSync(logPath, entry, 'utf8');
}

// #region agent log
log('Server starting', {dev, hostname, port, dir: __dirname}, 'B');
// #endregion

// Créer l'app Next.js avec le dossier pages standard
const projectRoot = path.join(__dirname, '..');
const pagesDir = path.join(projectRoot, 'pages');
const pagesGalleryDir = path.join(projectRoot, 'pages-gallery');

// #region agent log
const pagesExists = fs.existsSync(pagesDir);
const pagesGalleryExists = fs.existsSync(pagesGalleryDir);
log('Checking pages directories', {pagesExists, pagesGalleryExists, pagesDir, pagesGalleryDir}, 'K');
// #endregion

const app = next({ 
  dev, 
  hostname, 
  port,
  dir: projectRoot, // Racine du projet
  conf: {
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    distDir: '.next-gallery',
  }
});

// #region agent log
log('Next.js app created', {pagesDir: 'pages (standard)', distDir: '.next-gallery', projectRoot}, 'B');
// #endregion

// Custom getRequestHandler pour utiliser pages-gallery
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // #region agent log
      log('Request received', {pathname, query}, 'C');
      // #endregion

      // Toutes les routes sont gérées normalement par Next.js
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
╔════════════════════════════════════════════════╗
║                                                ║
║   🎨 GALERIE 3D - Serveur Autonome            ║
║                                                ║
║   📦 Port: ${port}                                 ║
║   🌐 URL: http://${hostname}:${port}              ║
║                                                ║
║   ✅ Galerie: http://${hostname}:${port}/          ║
║   ✅ Configurateur: http://${hostname}:${port}/configurator║
║   ✅ Modèles: http://${hostname}:${port}/models/...║
║                                                ║
║   🔒 3 pages uniquement - Pas de dashboard    ║
║                                                ║
╚════════════════════════════════════════════════╝
      `);
    });
});






