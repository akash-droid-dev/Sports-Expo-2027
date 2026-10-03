import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const [name, opt] of [['desk', { viewport: { width: 1280, height: 800 } }], ['ipad', devices['iPad Pro 11']]]) {
  const p = await (await b.newContext(opt)).newPage();
  await p.goto('http://localhost:4100/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  const pos = await p.evaluate(() => { const el = document.querySelector('[data-screen-label="02 Earth journey"]'); return { top: el.getBoundingClientRect().top + scrollY, span: el.offsetHeight - (innerHeight - 60) }; });
  const shots = [];
  for (const f of [0.05, 0.35, 0.6]) {
    // scroll in small steps like a user
    const target = pos.top - 60 + pos.span * f;
    await p.evaluate(async (t) => { while (Math.abs(scrollY - t) > 30) { scrollBy(0, Math.sign(t - scrollY) * Math.min(120, Math.abs(t - scrollY))); await new Promise(r => requestAnimationFrame(r)); } scrollTo(0, t); }, target);
    await p.waitForTimeout(2500);
    const canvas = await p.$('.maplibregl-canvas');
    const px = canvas ? await canvas.screenshot({ path: `globe-${name}-${f}.png` }).then(() => 'shot') : 'no canvas';
    shots.push(f + ':' + px);
  }
  console.log(name, shots.join(' '));
}
await b.close();
