import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await b.newContext(devices[process.argv[3] || 'Pixel 5']); const p = await ctx.newPage();
await p.route(/google\.com|arcgisonline|iiccnewdelhi/, r => r.abort());
const cdp = await ctx.newCDPSession(p);
const url = process.argv[2] || 'http://localhost:3000/';
await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
const start = await p.evaluate(() => { const el = document.querySelector('[data-screen-label="03 Intro"]'); return el ? el.getBoundingClientRect().top + scrollY : 0; });
await p.evaluate(y => scrollTo(0, y), start); await p.waitForTimeout(1500);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const r = await p.evaluate(() => new Promise(res => {
  const frames = []; let last = performance.now(); const t0 = last; const H = document.body.scrollHeight - innerHeight;
  const step = (now) => { frames.push(now - last); last = now; scrollBy(0, 14); if (now - t0 < 6000 && scrollY < H - 10) requestAnimationFrame(step); else res({ n: frames.length, long: frames.filter(f => f > 50).length, p95: frames.sort((a, b) => a - b)[Math.floor(frames.length * 0.95)], avg: frames.reduce((a, b) => a + b, 0) / frames.length }); };
  requestAnimationFrame(step);
}));
console.log(process.argv[3] || 'Pixel 5', await p.evaluate(() => document.documentElement.classList.contains('lite') ? 'lite' : 'full'), JSON.stringify({ frames: r.n, longFrames: r.long, p95ms: Math.round(r.p95), avgms: Math.round(r.avg) }));
await b.close();
