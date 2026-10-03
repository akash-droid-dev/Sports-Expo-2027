import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const strip = () => {
  delete Object.fromEntries; delete Object.hasOwn; delete Array.prototype.flat; delete Array.prototype.flatMap; delete Array.prototype.at; delete String.prototype.at;
  delete Promise.allSettled; delete String.prototype.replaceAll; delete String.prototype.matchAll; delete window.queueMicrotask; delete window.structuredClone;
  delete Element.prototype.replaceChildren; delete Document.prototype.replaceChildren; delete DocumentFragment.prototype.replaceChildren; delete window.requestIdleCallback;
};
const fakeCss = () => { const o = CSS.supports.bind(CSS); CSS.supports = (p, v) => (/^(inset|aspect-ratio)$/.test(p) ? false : o(p, v)); };
const run = async (name, dev, inits) => {
  const ctx = await b.newContext(dev);
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  for (const f of inits) await p.addInitScript(f);
  await p.route(/google\.com|arcgisonline|iiccnewdelhi/, r => r.abort());
  await p.route(/hero-scene\.html|bucky-scene\.html/, r => r.fulfill({ body: '<html></html>', contentType: 'text/html' }));
  const out = [];
  for (const path of ['/', '/explore/', '/zones/', '/programme/', '/attend/', '/admin/']) {
    await p.goto('http://localhost:4100' + path, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(path === '/' ? 6000 : 3500);
    const r = await p.evaluate(() => ({ ok: !!window.__booted, err: !!document.getElementById('boot-error'), sec: document.querySelectorAll('#dc-root section').length, sw: document.documentElement.scrollWidth, legacy: document.documentElement.classList.contains('legacy-css'),
      zero: [...document.querySelectorAll('#dc-root [style]')].filter(e => e.style.aspectRatio && e.offsetWidth > 0 && e.offsetHeight < 5).length }));
    out.push(path + ' ' + JSON.stringify(r));
  }
  console.log('##', name); out.forEach(x => console.log('  ' + x)); console.log('  errors', errs.slice(0, 4));
  if (name.includes('css')) { await p.goto('http://localhost:4100/programme/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await p.evaluate(() => scrollTo(0, document.getElementById('watch').getBoundingClientRect().top + scrollY - 60)); await p.waitForTimeout(1500); await p.screenshot({ path: 'legacy-css.png' }); }
  await ctx.close();
};
await run('phone, old JS APIs removed', devices['Pixel 5'], [strip]);
await run('phone, old JS + old CSS', devices['Pixel 5'], [strip, fakeCss]);
await run('desktop, old JS APIs removed', { viewport: { width: 1440, height: 900 } }, [strip]);
await b.close();
