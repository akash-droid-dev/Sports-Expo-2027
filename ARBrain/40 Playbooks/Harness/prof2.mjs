import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await b.newContext(devices[process.argv[3] || 'iPad Pro 11']); const p = await ctx.newPage();
await p.route(/google\.com|arcgisonline|iiccnewdelhi/, r => r.abort());
const cdp = await ctx.newCDPSession(p);
await p.goto(process.argv[2] || 'http://localhost:4100/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
const start = await p.evaluate(() => { const el = document.querySelector('[data-screen-label="03 Intro"]'); return el.getBoundingClientRect().top + scrollY; });
await p.evaluate(y => scrollTo(0, y), start); await p.waitForTimeout(3000);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
await p.evaluate(() => new Promise(res => { const t0 = performance.now(); const step = (now) => { scrollBy(0, 14); if (now - t0 < 5000) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); }));
const { profile } = await cdp.send('Profiler.stop');
const byId = new Map(profile.nodes.map(n => [n.id, n])); const parent = new Map();
profile.nodes.forEach(n => (n.children || []).forEach(c => parent.set(c, n.id)));
const dt = profile.timeDeltas; const tot = new Map();
profile.samples.forEach((id, i) => {
  // attribute each sample to the outermost frame that is from the app (not the maplibre chunk)
  let chain = []; for (let x = id; x; x = parent.get(x)) chain.push(byId.get(x).callFrame);
  const app = chain.filter(cf => cf.url && !/ca4dcb09/.test(cf.url)); const top = chain.find(cf => /ca4dcb09/.test(cf.url));
  if (!top) return;
  const k = app.length ? (app[0].functionName || '(anon)') + ' ' + app[0].url.split('/').pop().slice(0, 30) + ':' + app[0].lineNumber : '(maplibre root) ' + (chain[chain.length - 2]?.functionName || '');
  tot.set(k, (tot.get(k) || 0) + (dt[i] || 0));
});
[...tot].sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, t]) => console.log((t / 1000).toFixed(0).padStart(6), 'ms', k));
console.log('scrollY end', await p.evaluate(() => [scrollY, document.querySelector('[data-screen-label="02 Earth journey"]').getBoundingClientRect().bottom, innerHeight]));
await b.close();
