// Turns the four brand key visuals (CorelDRAW SVGs, 16:9) into site backgrounds.
//   node scripts/brand/backgrounds.mjs <folder with 01.svg … 04.svg>
// Each SVG is drawn in Chromium. Every shape that sits wholly inside the text and logo blocks
// (expo logo, tagline, headline, dates, the government logos) is removed, so only the artwork
// is left. The result is written as src/app/bg/bg-0N-{2560,1440,828}.webp.
// Needs playwright-core and a Chromium (PLAYWRIGHT_CHROMIUM or /opt/pw-browsers).
import { chromium } from 'playwright-core';
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

// Text and logo blocks per visual, as [left, top, right, bottom] fractions of the width and height.
const GOV = [0.805, 0.02, 0.98, 0.112];
const BLOCKS = {
  '01': [GOV, [0.07, 0.09, 0.43, 0.42], [0.135, 0.485, 0.525, 0.665], [0.368, 0.672, 0.522, 0.762]],
  '02': [GOV, [0.072, 0.06, 0.43, 0.385], [0.075, 0.405, 0.437, 0.635]],
  '03': [GOV, [0.447, 0.11, 0.87, 0.74]],
  '04': [GOV, [0.072, 0.06, 0.43, 0.385], [0.147, 0.415, 0.57, 0.675]],
};
const WIDTHS = [2560, 1440, 828];

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/brand/backgrounds.mjs <folder with the 01-04 SVGs>');
  process.exit(1);
}
const out = join('src', 'app', 'bg');
mkdirSync(out, { recursive: true });
const exe = process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(existsSync(exe) ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 2560, height: 1440 } });

for (const [key, blocks] of Object.entries(BLOCKS)) {
  const file = readdirSync(src).find((f) => new RegExp(`(^|-)${key}\\.svg$`).test(f));
  if (!file) {
    console.warn(`[bg] no ${key}.svg in ${src}, skipping`);
    continue;
  }
  const svg = readFileSync(join(src, file), 'utf8').replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, '');
  await page.setContent(
    `<style>html,body{margin:0}svg{display:block;width:2560px;height:1440px}</style>${svg}`,
  );
  const removed = await page.evaluate((blocks) => {
    const W = 2560, H = 1440;
    const inside = (r) =>
      blocks.some(([l, t, rr, b]) => r.left >= l * W && r.top >= t * H && r.right <= rr * W && r.bottom <= b * H);
    let n = 0;
    for (const el of document.querySelectorAll('svg path, svg polygon, svg rect, svg circle, svg ellipse, svg polyline, svg line')) {
      if (el.closest('defs, clipPath, mask, pattern')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (inside(r)) {
        el.remove();
        n++;
      }
    }
    return n;
  }, blocks);
  const png = await page.screenshot({ type: 'png' });
  for (const w of WIDTHS) {
    await sharp(png)
      .resize({ width: w })
      .webp({ quality: w > 1500 ? 70 : 74, effort: 6 })
      .toFile(join(out, `bg-${key}-${w}.webp`));
  }
  console.log(`[bg] ${key}: removed ${removed} text/logo shapes → bg-${key}-{${WIDTHS.join(',')}}.webp`);
}
await browser.close();
