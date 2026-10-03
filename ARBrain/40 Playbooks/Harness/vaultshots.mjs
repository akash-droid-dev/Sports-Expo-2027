import { chromium, devices } from 'playwright-core';
const OUT = '../vault-shots';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const pages = [['home', '/'], ['explore', '/explore/'], ['zones', '/zones/'], ['exhibit', '/exhibit/'], ['attend', '/attend/'], ['connect', '/connect/'], ['programme', '/programme/'], ['portal', '/portal/'], ['admin', '/admin/'], ['mobile-app', '/mobile/'], ['design-system', '/design-system/']];
const homeSecs = [['hero', '01 Entry', 0], ['intro', '03 Intro', 0], ['intentions', 'Intentions', 0], ['explore-hall', '04 Explore Hall 2', 0], ['four-worlds', '05 Four worlds', 0], ['product-architecture', '06 Product architecture', 0], ['featured-products', '08 Featured products', 0], ['watch', '12 Watch', 0], ['plan-visit', '13 Plan your visit', 0]];
for (const [dev, opt] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['phone', devices['iPhone 13']]]) {
  const ctx = await b.newContext(opt); const p = await ctx.newPage();
  await p.route(/google\.com|arcgisonline|iiccnewdelhi|gstatic/, r => r.abort());
  for (const [name, path] of pages) {
    await p.goto('http://localhost:4100' + path, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3200);
    await p.screenshot({ path: `${OUT}/${dev}-${name}.jpg`, type: 'jpeg', quality: 70 });
    if (name === 'home') {
      for (const [s, label] of homeSecs) {
        const ok = await p.evaluate((l) => { const el = document.querySelector(`[data-screen-label="${l}"]`); if (!el) return false; scrollTo(0, el.getBoundingClientRect().top + scrollY - 60); return true; }, label);
        if (!ok) { console.log('missing', label); continue; }
        await p.waitForTimeout(2600);
        await p.screenshot({ path: `${OUT}/${dev}-home-${s}.jpg`, type: 'jpeg', quality: 70 });
      }
      // journey finale: zone cards
      await p.evaluate(() => { const el = document.querySelector('[data-screen-label="02 Earth journey"]'); const top = el.getBoundingClientRect().top + scrollY; const span = el.offsetHeight - (innerHeight - 60); scrollTo(0, top - 60 + span * 0.99); });
      await p.waitForTimeout(3000);
      await p.screenshot({ path: `${OUT}/${dev}-home-zone-cards.jpg`, type: 'jpeg', quality: 70 });
    }
  }
  await ctx.close();
}
await b.close();
