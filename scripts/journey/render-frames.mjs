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
const W = 1000, H = 1300; // covers a phone in portrait with room to zoom out, 1 image px = 1 CSS px
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
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
p.on('console', (m) => m.type() === 'error' && console.log('page:', m.text().slice(0, 200)));
await p.goto('http://localhost:4600/');
await p.waitForFunction(() => !!window.map, null, { timeout: 60000 });
await p.evaluate(() => Promise.race([window.ready, new Promise((r) => setTimeout(r, 30000))]));
const frames = [];
const points = framePoints(J);
for (let i = 0; i < points.length; i++) {
  const c = camAt(J.keyframes, points[i]);
  await p.evaluate((c) => window.shoot({ center: [c.lon, c.lat], zoom: c.z, pitch: c.pitch, bearing: c.b }), c);
  const png = await p.screenshot({ type: 'png' });
  const file = `f-${String(i).padStart(2, '0')}.webp`;
  await sharp(png).webp({ quality: 52, effort: 6 }).toFile(join(OUT, file));
  frames.push({ p: points[i], z: +c.z.toFixed(3), lon: +c.lon.toFixed(5), lat: +c.lat.toFixed(5), file });
  console.log(file, points[i], c.z.toFixed(2));
}
writeFileSync(join(OUT, 'frames.json'), JSON.stringify({ width: W, height: H, frames }, null, 1) + '\n');
await b.close();
srv.close();
