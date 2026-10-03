import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const dev = process.argv[3] ? devices[process.argv[3]] : { viewport: { width: 1440, height: 900 } };
const p = await (await b.newContext(dev)).newPage();
await p.route(/google\.com|arcgisonline|iiccnewdelhi/, r => r.abort());
await p.goto(process.argv[2] || 'http://localhost:3000/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
const y = await p.evaluate(() => { const el = document.querySelector('[data-screen-label="08 Featured products"]'); return el.getBoundingClientRect().top + scrollY - 120; });
await p.evaluate(y => scrollTo(0, y - 1500), y); await p.waitForTimeout(800);
await p.screenshot({ path: 'pr3-stack.png', clip: { x: 0, y: 0, ...dev.viewport } }).catch(() => {});
// Record phase and track position in-page, frame by frame, while scrolling the section into view.
const log = await p.evaluate(y => new Promise(res => {
  const ps = document.querySelector('.ps'), tr = ps.querySelector('.mq-track'), out = []; const t0 = performance.now();
  scrollTo(0, y);
  const f = () => { const t = performance.now() - t0; out.push([Math.round(t), ps.className.split(' ')[1], Math.round(new DOMMatrix(getComputedStyle(tr).transform).m41)]); if (t < 5000) requestAnimationFrame(f); else res(out); };
  requestAnimationFrame(f);
}), y);
let last = ''; for (const [t, ph, x] of log) { if (ph !== last || t - (globalThis.lt || 0) > 400) { console.log(t, ph, x); globalThis.lt = t; } last = ph; }
await b.close();
