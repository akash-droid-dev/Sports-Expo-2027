import { chromium, devices } from 'playwright-core';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await b.newContext(devices[process.argv[3] || 'Pixel 5']); const p = await ctx.newPage();
await p.route(/google\.com|arcgisonline|iiccnewdelhi/, r => r.abort());
const cdp = await ctx.newCDPSession(p);
await p.goto(process.argv[2] || 'http://localhost:4100/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
const H = await p.evaluate(() => document.body.scrollHeight);
await cdp.send('DOM.enable'); await cdp.send('LayerTree.enable');
let layers = [];
cdp.on('LayerTree.layerTreeDidChange', e => { if (e.layers) layers = e.layers; });
for (const f of [0.3, 0.5]) {
  await p.evaluate(y => scrollTo(0, y), Math.round(H * f)); await p.waitForTimeout(1200);
  const byNode = new Map();
  for (const l of layers) { if (!l.backendNodeId) continue; byNode.set(l.backendNodeId, (byNode.get(l.backendNodeId) || 0) + 1); }
  const desc = [];
  for (const [id, n] of byNode) { try { const { node } = await cdp.send('DOM.describeNode', { backendNodeId: id }); desc.push((node.localName || node.nodeName) + '.' + ((node.attributes || []).join(' ').match(/class (\S+( \S+)?)/) || [, ''])[1]); } catch {} }
  const c = new Map(); desc.forEach(d => c.set(d, (c.get(d) || 0) + 1));
  console.log('at', f, 'layers', layers.length, 'drawn', layers.filter(l => l.drawsContent).length);
  console.log([...c].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => v + ' ' + k).join('\n'));
}
await b.close();
