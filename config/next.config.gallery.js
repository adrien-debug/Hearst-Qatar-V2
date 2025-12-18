/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Utiliser le dossier pages-gallery
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Build directory séparé
  distDir: '.next-gallery',
  // Pas de trailing slash
  trailingSlash: false,
  // Optimisations
  swcMinify: true,
  // Webpack config
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Alias pour les imports
      '@': __dirname,
    };
    return config;
  },
};

module.exports = nextConfig;






