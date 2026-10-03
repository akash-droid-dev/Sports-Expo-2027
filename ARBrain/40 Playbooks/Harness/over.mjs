import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await b.newContext({ ...devices['iPhone 13'] });
const p = await ctx.newPage();
await p.route(/google\.com|arcgisonline|iiccnewdelhi|hero-scene\.html|bucky-scene\.html/, r => r.abort());
for (const path of process.argv[2].split(',')) {
  await p.goto('http://localhost:4100' + path, { waitUntil: 'domcontentloaded' });
  await p.addStyleTag({ content: '#dc-root{overflow-x:visible!important}' });
  await p.waitForTimeout(3500);
  const r = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const clipped = el => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const c = getComputedStyle(a); if (c.overflowX !== 'visible' || c.position === 'fixed') return true; } return false; };
    const out = new Map();
    document.querySelectorAll('#dc-root *').forEach(el => {
      const rc = el.getBoundingClientRect();
      if (!(rc.right > vw + 1 && rc.width > 0) || getComputedStyle(el).position === 'fixed' || clipped(el)) return;
      // container: nearest ancestor that fits
      let c = el.parentElement; while (c && c.getBoundingClientRect().right > vw + 1) c = c.parentElement;
      // the child of container that overflows
      let k = el; while (k.parentElement !== c) k = k.parentElement;
      if (!out.has(k)) out.set(k, { sec: k.closest('[data-screen-label]')?.dataset.screenLabel || '', cst: (c.getAttribute('style') || '').slice(0, 120), kst: k.tagName + ' ' + (k.getAttribute('style') || '').slice(0, 140), w: Math.round(k.getBoundingClientRect().width), right: Math.round(rc.right) });
    });
    return [...out.values()];
  });
  console.log('##', path, r.length, 'scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
  r.slice(0, 14).forEach(o => console.log(`  [${o.sec}] w=${o.w}\n     C: ${o.cst}\n     K: ${o.kst}`));
}
await b.close();
