#!/usr/bin/env node
// Renders the still frames phones use for the Home Earth journey (src/components/home/JourneyFrames.jsx):
// the same MapLibre globe, satellite imagery and camera path as the live journey (src/data/journey.json),
// captured at progress points close enough together that a zoom-and-crossfade between them looks
// like the flight. Writes journey-frames/f-NN.webp + frames.json.
// Needs internet (satellite tiles) and a browser: it runs in GitHub Actions
// (.github/workflows/journey-frames.yml). Usage: node scripts/journey/render-frames.mjs
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { camAt, framePoints } from './camera.mjs';

const J = JSON.parse(readFileSync('src/data/journey.json', 'utf8'));
const OUT = 'journey-frames';
// Two sizes, 1 image px = 1 CSS px: phones (portrait, with room to zoom out) and tablets.
const SETS = [{ id: 'p', w: 1000, h: 1300, q: 52 }, { id: 't', w: 1500, h: 1500, q: 50 }];
const DIST = 'node_modules/maplibre-gl/dist';

const page = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/maplibre-gl.css"><style>html,body,#m{margin:0;width:100%;height:100%;background:#000}.maplibregl-control-container{display:none}</style>
</head><body><div id="m"></div><script type="module">
import * as maplibregl from '/maplibre-gl.mjs';
maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
window.map = new maplibregl.Map({ container: 'm', interactive: false, attributionControl: false, pixelRatio: 1,
  renderWorldCopies: false, fadeDuration: 0, maxTileCacheSize: 400, preserveDrawingBuffer: true,
  style: { version: 8, projection: { type: 'globe' },
    sources: { sat: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19 } },
    layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#000' } }, { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-fade-duration': 0 } }],
    sky: { 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 8, 0] } },
  center: [55, 18], zoom: 0.9 });
window.ready = new Promise(r => map.on('load', r));
window.shoot = (c) => new Promise(r => { map.jumpTo(c); let done = false; const fin = () => { if (!done) { done = true; setTimeout(r, 400); } }; map.once('idle', fin); setTimeout(fin, window.FRAME_WAIT || 45000); });
</script></body></html>`;

const srv = createServer((req, res) => {
  if (req.url === '/') return res.writeHead(200, { 'content-type': 'text/html' }).end(page);
  const name = req.url.slice(1);
  if (!/^[\w.-]+\.(mjs|css)$/.test(name)) return res.writeHead(404).end();
  try {
    res.writeHead(200, { 'content-type': name.endsWith('.css') ? 'text/css' : 'text/javascript' }).end(readFileSync(join(DIST, name)));
  } catch {
    res.writeHead(404).end();
  }
}).listen(4600);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const points = framePoints(J);
const out = { sets: {}, frames: points.map((pt) => { const c = camAt(J.keyframes, pt); return { p: pt, z: +c.z.toFixed(3), lon: +c.lon.toFixed(5), lat: +c.lat.toFixed(5) }; }) };
for (const set of SETS) {
  const p = await b.newPage({ viewport: { width: set.w, height: set.h }, deviceScaleFactor: 1 });
  p.on('console', (m) => m.type() === 'error' && !/AJAXError|Failed to load/.test(m.text()) && console.log('page:', m.text().slice(0, 200)));
  await p.goto('http://localhost:4600/');
  await p.waitForFunction(() => !!window.map, null, { timeout: 60000 });
  await p.evaluate(() => Promise.race([window.ready, new Promise((r) => setTimeout(r, 30000))]));
  for (let i = 0; i < points.length; i++) {
    const c = camAt(J.keyframes, points[i]);
    await p.evaluate((c) => window.shoot({ center: [c.lon, c.lat], zoom: c.z, pitch: c.pitch, bearing: c.b }), c);
    const png = await p.screenshot({ type: 'png' });
    const file = `${set.id}-${String(i).padStart(2, '0')}.webp`;
    await sharp(png).webp({ quality: set.q, effort: 6 }).toFile(join(OUT, file));
    console.log(file, points[i], c.z.toFixed(2));
  }
  out.sets[set.id] = { width: set.w, height: set.h };
  await p.close();
}
writeFileSync(join(OUT, 'frames.json'), JSON.stringify(out, null, 1) + '\n');
await b.close();
srv.close();
