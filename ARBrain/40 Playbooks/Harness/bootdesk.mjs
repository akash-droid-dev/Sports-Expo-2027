import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.route(/google\.com|arcgisonline|iiccnewdelhi/, r => r.abort());
await p.route(/hero-scene\.html|bucky-scene\.html/, r => r.fulfill({ body: '<html></html>', contentType: 'text/html' }));
for (const path of ['/', '/explore/', '/programme/']) {
  await p.goto('http://localhost:4100' + path, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(10500);
  console.log(path, JSON.stringify(await p.evaluate(() => ({ booted: !!window.__booted, cls: document.documentElement.className, overlay: !!document.getElementById('boot-error'), hero: !!document.querySelector('iframe[data-hero-scene]'), maps: document.querySelectorAll('canvas.maplibregl-canvas').length, gmaps: document.querySelectorAll('iframe[src*="google.com/maps"]').length }))));
}
console.log('errors', errs.slice(0, 3));
await b.close();
