#!/usr/bin/env node
// Finds openly licensed candidate media for the demo placeholders listed in plan.json and
// writes web-ready versions to media-candidates/ for review:
//   images  Openverse or Wikimedia Commons → 1600px WebP + meta (title, author, licence, link)
//   videos  Wikimedia Commons → 18 s, 960px H.264 MP4 (no audio) + poster JPEG + meta
// Runs in GitHub Actions (.github/workflows/media-candidates.yml), which has internet access.
// Picked candidates are copied into public/media by scripts/media/use-candidates.mjs.
import { mkdirSync, writeFileSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const OUT = 'media-candidates';
const UA = 'SportsExpo2027-media/1.0 (https://github.com/akash-droid-dev/Sports-Expo-2027)';
const plan = JSON.parse(readFileSync(new URL('./plan.json', import.meta.url), 'utf8'));
const only = process.argv[2] ? process.argv[2].split(',') : null;
const PER_IMAGE = 5;
const PER_VIDEO = 3;

const strip = (html) => String(html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(res.status + ' ' + url);
  return res.json();
}
async function getBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(res.status + ' ' + url);
  return Buffer.from(await res.arrayBuffer());
}

async function openverse(query) {
  const u = new URL('https://api.openverse.org/v1/images/');
  u.searchParams.set('q', query);
  u.searchParams.set('license_type', 'commercial');
  u.searchParams.set('mature', 'false');
  u.searchParams.set('page_size', '20');
  const data = await getJson(u.href);
  return data.results
    .filter((r) => (r.width || 0) >= 1000)
    .map((r) => ({
      url: r.url,
      title: r.title,
      author: r.creator,
      license: (r.license === 'cc0' ? 'CC0' : r.license === 'pdm' ? 'Public Domain' : 'CC ' + r.license.toUpperCase()) + (r.license_version && !['cc0', 'pdm'].includes(r.license) ? ' ' + r.license_version : ''),
      licenseUrl: r.license_url,
      link: r.foreign_landing_url,
    }));
}

async function commons(query, kind) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  const p = {
    action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '20',
    gsrsearch: query + (kind === 'video' ? ' filetype:video' : ' filetype:bitmap'),
    prop: kind === 'video' ? 'videoinfo' : 'imageinfo',
  };
  if (kind === 'video') Object.assign(p, { viprop: 'url|size|mime|extmetadata|derivatives' });
  else Object.assign(p, { iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600' });
  for (const [k, v] of Object.entries(p)) u.searchParams.set(k, v);
  const data = await getJson(u.href);
  const pages = Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index);
  return pages
    .map((pg) => {
      const info = (pg.imageinfo || pg.videoinfo || [])[0];
      if (!info) return null;
      const m = info.extmetadata || {};
      const base = {
        title: pg.title.replace(/^File:/, ''),
        author: strip(m.Artist?.value),
        license: strip(m.LicenseShortName?.value),
        licenseUrl: m.LicenseUrl?.value || '',
        link: info.descriptionurl,
      };
      if (kind === 'video') {
        const ders = (info.derivatives || []).filter((d) => /mp4|webm/.test(d.type || d.src) && (d.height || 0) >= 360 && (d.height || 0) <= 720);
        ders.sort((a, b) => (a.height || 0) - (b.height || 0));
        const src = ders[0]?.src || (info.size < 80e6 ? info.url : null);
        return src ? { ...base, url: src } : null;
      }
      if ((info.width || 0) < 1000) return null;
      return { ...base, url: info.thumburl || info.url };
    })
    .filter(Boolean);
}

async function images() {
  for (const [slot, spec] of Object.entries(plan.images)) {
    if (only && !only.includes(slot)) continue;
    const dir = join(OUT, 'images', slot);
    mkdirSync(dir, { recursive: true });
    let found = [];
    try {
      found = spec.source === 'commons' ? await commons(spec.query, 'image') : await openverse(spec.query);
    } catch (e) {
      console.warn(`[${slot}] search failed: ${e.message}`);
    }
    let n = 0;
    for (const c of found) {
      if (n >= PER_IMAGE) break;
      try {
        const buf = await getBuffer(c.url);
        await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 72 }).toFile(join(dir, `${n}.webp`));
        writeFileSync(join(dir, `${n}.json`), JSON.stringify(c, null, 2));
        console.log(`[${slot}] ${n}: ${c.title} — ${c.license}`);
        n++;
      } catch (e) {
        console.warn(`[${slot}] skip ${c.url}: ${e.message}`);
      }
    }
  }
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

async function videos() {
  for (const [slot, spec] of Object.entries(plan.videos)) {
    if (only && !only.includes(slot)) continue;
    const dir = join(OUT, 'videos', slot);
    mkdirSync(dir, { recursive: true });
    let found = [];
    try {
      found = await commons(spec.query, 'video');
    } catch (e) {
      console.warn(`[${slot}] search failed: ${e.message}`);
    }
    let n = 0;
    for (const c of found) {
      if (n >= PER_VIDEO) break;
      const tmp = join(dir, 'source.tmp');
      try {
        writeFileSync(tmp, await getBuffer(c.url));
        const mp4 = join(dir, `${n}.mp4`);
        ffmpeg(['-ss', '3', '-i', tmp, '-t', '18', '-an', '-vf', 'scale=960:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
        ffmpeg(['-ss', '2', '-i', mp4, '-frames:v', '1', '-q:v', '4', join(dir, `${n}.jpg`)]);
        writeFileSync(join(dir, `${n}.json`), JSON.stringify(c, null, 2));
        console.log(`[${slot}] ${n}: ${c.title} — ${c.license} (${Math.round(statSync(mp4).size / 1024)} KB)`);
        n++;
      } catch (e) {
        console.warn(`[${slot}] skip ${c.title}: ${e.message}`);
      } finally {
        rmSync(tmp, { force: true });
      }
    }
  }
}

await images();
await videos();
