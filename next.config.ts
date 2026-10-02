import type { NextConfig } from 'next';

// GitHub Pages: STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Sports-Expo-2027 builds a static site into out/.
// Netlify (and `npm run build` locally) build the full app, including the /api/r4x route.
const staticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  // The design logic runs effects once per mount (maps, scroll listeners), as in the prototype.
  reactStrictMode: false,
  basePath: basePath || undefined,
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
};

export default nextConfig;
