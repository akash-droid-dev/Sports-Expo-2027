import type { NextConfig } from 'next';

// GitHub Pages: STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Sports-Expo-2027 builds a static site into out/.
// Netlify (and `npm run build` locally) build the full app, including the /api/bucky route.
const staticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Shown at the bottom of the phone menu (src/components/MobileMenu.tsx), to check which build is live.
const BUILD = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BUILD: BUILD },
  // Ship code that older phones can run (see "browserslist" in package.json); MapLibre comes
  // pre-built for new browsers only, so compile it too.
  transpilePackages: ['maplibre-gl'],
  // The design logic runs effects once per mount (maps, scroll listeners), as in the prototype.
  reactStrictMode: false,
  basePath: basePath || undefined,
  ...(staticExport
    ? { output: 'export', trailingSlash: true }
    : {
        // 3D runtimes, scenes and demo media are large and rarely change: let browsers (and the scene iframes) reuse them.
        async headers() {
          const cache = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }];
          return [
            { source: '/vendor/:path*', headers: cache },
            { source: '/assets/:path*', headers: cache },
            { source: '/media/:path*', headers: cache },
          ];
        },
      }),
};

export default nextConfig;
