#!/usr/bin/env node
// Builds the demo media in public/media from reviewed candidates plus generated artwork:
//   photos   picked candidates (scripts/media/fetch-candidates.mjs) → 1400px WebP
//   videos   picked candidate clips → MP4 (as fetched) + 960px WebP poster
//   artwork  exhibitor logos, speaker and pass portraits, two product drawings and the
//            athlete figure, drawn here as SVG (no real people or brands)
// and writes public/media/media.json (image-slot id → file + credit), which public/image-slot.js
// reads, and public/media/videos.json (session id → clip), which src/components/DemoVideo.jsx reads.
//
// Usage: node scripts/media/build-media.mjs <path to an unpacked media-candidates checkout>
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const SRC = process.argv[2];
if (!SRC) throw new Error('Pass the media candidates folder');
const OUT = 'public/media';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'video'), { recursive: true });

const meta = (kind, key) => JSON.parse(readFileSync(join(SRC, kind, key + '.json'), 'utf8'));
const creditOf = (m) => `${m.author ? m.author.replace(/\s*\(.*$/, '') + ' · ' : ''}${m.license}`;
const slots = {};
const credits = [];

// ---------- Photos ----------
// slot id(s) → candidate. Venue photos are Yashobhoomi itself; the rest are close matches.
const PHOTOS = {
  'yasho-exterior': ['venue-exterior/0', ['twin-yasho-hall']],
  'yasho-plaza': ['venue-exterior/1', ['twin-yasho-foyer']],
  'yasho-metro': ['venue-metro/0', ['twin-yasho-metro']],
  'football': ['prod-football/4', ['home-prod-0', 'prod-detail-0']],
  'goal': ['prod-goal/4', ['home-prod-1', 'prod-detail-1']],
  'cricket-bats': ['prod-cricket-bat/2', ['home-prod-2', 'prod-detail-2']],
  'hockey-turf': ['prod-hockey-turf/0', ['home-prod-3', 'prod-detail-3']],
  'floodlights': ['prod-floodlight/4', ['prod-detail-4']],
  'cricket-nets': ['prod-coaching/1', ['prod-detail-6']],
  'football-play': ['prod-football/2', ['new-product-img']],
  'expo-floor': ['expo-hall/0', ['theme-room-render']],
  'knit': ['mat-knit/1', ['mat-knit']],
  'compression': ['mat-knit/2', ['mat-comp']],
  'recycled-yarn': ['mat-knit/0', ['mat-sust']],
  'impact-foam': ['mat-prot/0', ['mat-prot']],
};
for (const [name, [key, ids]] of Object.entries(PHOTOS)) {
  const m = meta('images', key);
  await sharp(join(SRC, 'images', key + '.webp')).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 68 }).toFile(join(OUT, name + '.webp'));
  for (const id of ids) slots[id] = { src: name + '.webp', credit: creditOf(m), href: m.link };
  credits.push({ file: `media/${name}.webp`, title: m.title, author: m.author, license: m.license, licenseUrl: m.licenseUrl, source: m.link });
}

// ---------- Videos ----------
const CLIPS = {
  keynote: 'vid-conference/0',
  crowd: 'vid-athletics/0',
  stadium: 'vid-stadium/1',
  'cricket-ground': 'vid-cricket/0',
  'cricket-club': 'vid-cricket/1',
  'cricket-wicket': 'vid-cricket/2',
  'hockey-goal': 'vid-hockey/1',
  'hockey-save': 'vid-hockey/2',
};
for (const [name, key] of Object.entries(CLIPS)) {
  const m = meta('videos', key);
  copyFileSync(join(SRC, 'videos', key + '.mp4'), join(OUT, 'video', name + '.mp4'));
  const frame = join(OUT, 'video', name + '.tmp.jpg');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', '4', '-i', join(OUT, 'video', name + '.mp4'), '-frames:v', '1', '-q:v', '3', frame]);
  await sharp(frame).resize({ width: 960 }).webp({ quality: 66 }).toFile(join(OUT, 'video', name + '.webp'));
  rmSync(frame);
  credits.push({ file: `media/video/${name}.mp4`, title: m.title, author: m.author, license: m.license, licenseUrl: m.licenseUrl, source: m.link });
  CLIPS[name] = { mp4: `video/${name}.mp4`, poster: `video/${name}.webp`, credit: creditOf(m), href: m.link };
}
// Session → clip. The live player shows the keynote stage.
const SESSION_CLIP = { x1: 'keynote', x2: 'cricket-club', x3: 'stadium', x4: 'crowd', x5: 'cricket-ground', x6: 'hockey-goal', x7: 'cricket-wicket', x8: 'hockey-save', x9: 'keynote', x10: 'hockey-goal', x11: 'crowd', x12: 'stadium', live: 'keynote' };
const videos = Object.fromEntries(Object.entries(SESSION_CLIP).map(([id, c]) => [id, CLIPS[c]]));

// ---------- Generated artwork ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svgFile = (name, svg, ids) => { writeFileSync(join(OUT, name + '.svg'), svg.trim() + '\n'); for (const id of ids) slots[id] = { src: name + '.svg' }; };

// Exhibitor logos: a monogram tile in the brand's zone colour, wordmark beside it.
const ZC = { A: '#C2610B', B: '#1F4E9E', C: '#0B6E4F', D: '#7A2E8C' };
const EXHIBITORS = [['apex', 'Apex Sports India', 'B', 'AP'], ['willow', 'Meerut Willow Works', 'B', 'MW'], ['arena', 'ArenaBuild Infrastructure', 'B', 'AB'], ['turf', 'TurfLine Systems', 'B', 'TL'], ['lumen', 'Luminar Stadium Lighting', 'B', 'LU'], ['stride', 'Stridewell Footwear', 'B', 'SW'], ['origin', 'Origin Supply Co.', 'B', 'OR'], ['motion', 'MotionIQ SportsTech', 'C', 'MQ'], ['matrix', 'SportMatrix Analytics', 'C', 'SM'], ['velocity', 'Velocity Performance Labs', 'C', 'VP'], ['hayate', 'Hayate Sports Engineering', 'D', 'HY'], ['flex', 'FlexSeat Arenas', 'B', 'FX']];
const MARKS = [
  (c) => `<path d="M40 30 L80 30 L60 70 Z" fill="${c}"/>`,
  (c) => `<circle cx="60" cy="50" r="22" fill="none" stroke="${c}" stroke-width="8"/>`,
  (c) => `<rect x="38" y="28" width="44" height="44" fill="none" stroke="${c}" stroke-width="8"/>`,
  (c) => `<path d="M36 68 L60 30 L84 68" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="miter"/>`,
];
EXHIBITORS.forEach(([id, name, zone, mono], i) => {
  const c = ZC[zone];
  const words = name.split(' ');
  const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' ').toUpperCase();
  const l2 = words.slice(Math.ceil(words.length / 2)).join(' ').toUpperCase();
  svgFile('logo-' + id, `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
  <rect width="400" height="240" fill="#F6F4EF"/>
  <g transform="translate(36 70)">
    <rect width="120" height="100" fill="#0E0E0F"/>
    <g opacity=".9">${MARKS[i % MARKS.length](c)}</g>
    <text x="60" y="92" text-anchor="middle" font-family="Archivo, Arial Narrow, Arial, sans-serif" font-weight="900" font-size="22" fill="#fff" letter-spacing="2">${mono}</text>
  </g>
  <text x="176" y="116" font-family="Archivo, Arial Narrow, Arial, sans-serif" font-weight="900" font-size="26" fill="#0E0E0F">${esc(l1)}</text>
  <text x="176" y="146" font-family="Archivo, Arial Narrow, Arial, sans-serif" font-weight="700" font-size="20" fill="${c}">${esc(l2)}</text>
</svg>`, ['logo-' + id]);
});

// Portraits: an illustrated head-and-shoulders figure with initials, no faces.
const PEOPLE = [['spk-s1', 'MR', '#0B6E4F', '#E3F1EB'], ['spk-s2', 'LB', '#1F4E9E', '#E4EAF5'], ['spk-s3', 'AM', '#C2610B', '#F8E9DA'], ['spk-s4', 'AT', '#7A2E8C', '#F0E4F3'], ['spk-s5', 'PN', '#9E1B22', '#F5E1E2'], ['spk-s6', 'RB', '#0E0E0F', '#E3E0D8'], ['spk-s7', 'SO', '#1F4E9E', '#E4EAF5'], ['spk-s8', 'KS', '#C2610B', '#F8E9DA'], ['pass-photo', 'YOU', '#0E0E0F', '#F6F4EF']];
for (const [id, ini, c, bg] of PEOPLE) {
  svgFile('portrait-' + id.replace(/^spk-/, ''), `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" fill="${bg}"/>
  <circle cx="150" cy="118" r="54" fill="${c}"/>
  <path d="M46 300 C52 214 98 186 150 186 C202 186 248 214 254 300 Z" fill="${c}"/>
  <rect x="0" y="246" width="300" height="54" fill="#0E0E0F" opacity=".88"/>
  <text x="150" y="282" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="24" fill="#fff" letter-spacing="6">${ini}</text>
</svg>`, [id]);
}

// Product drawings for the two products without a fitting photo.
svgFile('product-spike-plate', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#2A2A2D"/><stop offset="1" stop-color="#0E0E0F"/></linearGradient>
  <pattern id="w" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="18" fill="#26262A"/></pattern></defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <g transform="translate(160 250) rotate(-8)">
    <path d="M40 150 C40 60 160 10 420 20 C640 28 820 40 870 110 C900 160 860 230 760 250 C560 290 260 300 120 270 C70 260 40 210 40 150 Z" fill="url(#w)" stroke="#F07C12" stroke-width="6"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${560 + (i % 3) * 90} ${70 + Math.floor(i / 3) * 120} l18 -44 l18 44 z" fill="#F07C12"/>`).join('')}
    <text x="150" y="168" font-family="JetBrains Mono, monospace" font-size="30" fill="#E3E0D8" letter-spacing="6">CARBON · 6-PIN</text>
  </g>
  <text x="60" y="740" font-family="JetBrains Mono, monospace" font-size="22" fill="#8A877F" letter-spacing="5">PRODUCT RENDER · SAMPLE</text>
</svg>`, ['prod-detail-5']);
svgFile('product-force-plates', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <rect width="1200" height="800" fill="#0E0E0F"/>
  <g transform="translate(600 470)">
    <path d="M-470 0 L-250 -110 L-20 -110 L-240 0 Z" fill="#2A2A2D" stroke="#E3E0D8" stroke-width="4"/>
    <path d="M20 0 L240 -110 L470 -110 L250 0 Z" fill="#2A2A2D" stroke="#E3E0D8" stroke-width="4"/>
    <path d="M-470 0 L-240 0 L-240 26 L-470 26 Z M20 0 L250 0 L250 26 L20 26 Z" fill="#3A3A3E"/>
  </g>
  <polyline points="120,250 220,240 300,180 360,120 420,210 500,230 600,160 680,110 760,200 860,230 960,170 1080,190" fill="none" stroke="#F07C12" stroke-width="6" stroke-linejoin="round"/>
  <polyline points="120,300 220,290 300,250 360,210 420,270 500,280 600,240 680,200 760,260 860,280 960,240 1080,250" fill="none" stroke="#0B6E4F" stroke-width="4" stroke-linejoin="round"/>
  <text x="120" y="90" font-family="JetBrains Mono, monospace" font-size="22" fill="#8A877F" letter-spacing="5">GROUND REACTION FORCE · L / R</text>
  <text x="60" y="740" font-family="JetBrains Mono, monospace" font-size="22" fill="#8A877F" letter-spacing="5">PRODUCT RENDER · SAMPLE</text>
</svg>`, ['prod-detail-7']);

// Athlete figure for the performance-science body map (pictogram style, dark background).
svgFile('athlete-figure', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs><radialGradient id="h" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#26262A"/><stop offset="1" stop-color="#0E0E0F"/></radialGradient></defs>
  <rect width="600" height="900" fill="url(#h)"/>
  <g fill="none" stroke="#E3E0D8" stroke-linecap="round" stroke-linejoin="round" stroke-width="46">
    <path d="M300 250 L278 470"/>
    <path d="M296 285 L210 380 L160 330"/>
    <path d="M296 285 L380 360 L455 300"/>
    <path d="M278 470 L370 590 L330 760"/>
    <path d="M278 470 L200 610 L120 640"/>
  </g>
  <circle cx="318" cy="178" r="50" fill="#E3E0D8"/>
  <path d="M90 800 H510" stroke="#F07C12" stroke-width="6"/>
</svg>`, ['pss-athlete']);

writeFileSync(join(OUT, 'media.json'), JSON.stringify(slots, null, 1) + '\n');
writeFileSync(join(OUT, 'videos.json'), JSON.stringify(videos, null, 1) + '\n');
writeFileSync(join(OUT, 'credits.json'), JSON.stringify(credits, null, 1) + '\n');
console.log(Object.keys(slots).length, 'slots,', Object.keys(videos).length, 'session clips,', credits.length, 'credited files');
