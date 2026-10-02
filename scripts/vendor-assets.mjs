// Copies browser runtime files from node_modules into public/vendor so the site
// serves them itself instead of a CDN. Runs on `npm install`.
//   public/vendor/spline    @splinetool/runtime build, imported by the 3D scene iframes
//                           (public/hero-scene.html, public/r4x-scene.html)
//   public/vendor/maplibre  MapLibre worker modules (see src/lib/maplibre.js)
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

function vendor(name, src, filter) {
  const dest = join('public', 'vendor', name);
  if (!existsSync(src)) {
    console.warn(`[vendor] ${src} not installed, skipping ${name}`);
    return;
  }
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  for (const f of readdirSync(src)) if (filter(f)) cpSync(join(src, f), join(dest, f), { recursive: true });
  console.log(`[vendor] ${name} → ${dest}`);
}

vendor('spline', join('node_modules', '@splinetool', 'runtime', 'build'),
  (f) => !/\.(br|gz)$/.test(f) && !f.startsWith('runtime.standalone') && f !== 'runtime.cjs');
vendor('maplibre', join('node_modules', 'maplibre-gl', 'dist'),
  (f) => f === 'maplibre-gl-worker.mjs' || f === 'maplibre-gl-shared.mjs');
