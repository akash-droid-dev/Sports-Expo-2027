// Copies browser runtime files from node_modules into public/vendor so the site
// serves them itself instead of a CDN. Runs on `npm install` and before `npm run build`.
//   public/vendor/spline    @splinetool/runtime build plus the Draco decoder (vendor/draco),
//                           imported by the 3D scene iframes
//                           (public/hero-scene.html, public/bucky-scene.html)
//   public/vendor/maplibre  MapLibre worker modules (see src/lib/maplibre.js)
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
// Spline decodes compressed meshes with Draco; serve the decoder alongside the runtime.
for (const f of ['draco_wasm_wrapper.js', 'draco_decoder.wasm']) {
  if (existsSync(join('public', 'vendor', 'spline'))) cpSync(join('vendor', 'draco', f), join('public', 'vendor', 'spline', f));
}
vendor('maplibre', join('node_modules', 'maplibre-gl', 'dist'),
  (f) => f === 'maplibre-gl-worker.mjs' || f === 'maplibre-gl-shared.mjs');

// Bucky's robot scene lives on Spline's servers. Copy it into the site when the build machine
// can reach it (GitHub Actions, Netlify), so it loads from the same origin and can be preloaded.
// public/bucky-scene.html falls back to Spline when the copy is missing.
const BUCKY_SCENE = 'https://prod.spline.design/clZpIOGef0TGq99W/scene.splinecode';
const buckyDest = join('public', 'assets', 'bucky.splinecode');
try {
  const res = await fetch(BUCKY_SCENE, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  writeFileSync(buckyDest, Buffer.from(await res.arrayBuffer()));
  console.log('[vendor] bucky scene → ' + buckyDest);
} catch (err) {
  console.warn('[vendor] could not download the Bucky scene (' + err.message + '); it will load from Spline');
}
