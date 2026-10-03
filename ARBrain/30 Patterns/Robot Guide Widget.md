---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/assistant
  - pattern/3d
  - ai
status: proven
---

# Robot Guide Widget

> A small 3D robot (Spline) that blinks, wiggles or hops on hover with a soft synthesised sound, jumps and chirps on click, and opens an "Ask Bucky" panel. Answers come from local demo data first, then from Claude via `/api/bucky`.

**Used in:** Bucky (R-4X in the design): bottom-right on every page.

## How it works

- Spline scene in an iframe (`public/bucky-scene.html`), cropped to the robot, upright-locked.
- First visit shows a bundled poster immediately; a snapshot is cached for later pages.
- Phones/tablets: no 3D runtime downloaded — the poster bobs instead.
- Sounds are WebAudio (no files), enabled after the first user gesture, mutable in the panel.
- Server route uses the Anthropic SDK with `ANTHROPIC_API_KEY`; without it, returns 503 and the panel shows built-in help.

## Reuse it

- Swap the Spline scene URL and the local answer topics.
- Keep the iframe out of the critical path (load after first paint).

## Gotchas and lessons

- The Spline export threw physics errors every frame; the scene wrapper suppresses them.

## Related

[[ISE Bucky Robot Guide]] · [[Lite Mode for Phones and Tablets]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/lib/bucky-guide.js`
```js
'use client';
// Bucky (named R-4X in the design), the Expo guide robot. Ported from design/site/r4x-guide.js; mounted once by the root layout.
import { withBase } from './base';
import { isLite } from './device';
import { isMuted, playClick, playHover, setMuted, unlockOnFirstGesture } from './bucky-sounds';

const POSTER_KEY = 'bucky-poster-v1';

/** @param {{ localScene?: boolean }} [opts] localScene: the robot scene is served by this site. */
export function initBucky(opts = {}) {
  if (window.__bucky) return; window.__bucky = true;
  // Smaller on phones, where he would otherwise cover a third of the screen width.
  const SIZE = isLite() && innerWidth < 600 ? 104 : 150, PAD = 16, TOP_SAFE = 72;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = `
  #bucky-bot{position:fixed;left:0;top:0;width:${SIZE}px;height:${SIZE}px;z-index:9000;will-change:transform;}
  #bucky-crop{position:absolute;inset:0;overflow:hidden;pointer-events:none}
  #bucky-poster{position:absolute;inset:0;background:center/cover no-repeat;transition:opacity .5s}
  #bucky-crop{transform-origin:50% 90%}
  html.lite #bucky-poster{animation:buckyIdle 3.2s ease-in-out infinite}
  @keyframes buckyIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @media (prefers-reduced-motion:reduce){html.lite #bucky-poster{animation:none}}
  #bucky-bot.bucky-wiggle #bucky-crop{animation:buckyWiggle .7s cubic-bezier(.36,.07,.19,.97)}
  #bucky-bot.bucky-hop #bucky-crop{animation:buckyHop .62s cubic-bezier(.3,.7,.4,1)}
  @keyframes buckyWiggle{0%,100%{transform:none}20%{transform:translateX(-7px) rotate(-5deg)}40%{transform:translateX(6px) rotate(4deg)}60%{transform:translateX(-4px) rotate(-3deg)}80%{transform:translateX(2px) rotate(1deg)}}
  @keyframes buckyHop{0%{transform:none}18%{transform:scale(1.08,.9)}45%{transform:translateY(-22px) scale(.96,1.05)}70%{transform:translateY(0) scale(1.07,.93)}85%{transform:translateY(-5px)}100%{transform:none}}
  #bucky-panel header .bucky-actions{display:flex;gap:6px}
  #bucky-bot iframe{position:absolute;left:0;top:0;width:1200px;height:800px;border:0;background:transparent;pointer-events:none;color-scheme:normal;transform-origin:0 0;transform:translate(-162px,-120px) scale(.4)}
  #bucky-bot button.bucky-hit{position:absolute;inset:14%;border:0;background:transparent;border-radius:50%;cursor:pointer;padding:0}
  #bucky-bot button.bucky-hit:focus-visible{outline:2px solid #F07C12;outline-offset:4px}
  #bucky-tip{position:absolute;left:50%;bottom:100%;transform:translate(-50%,4px);background:#0E0E0F;color:#fff;font:700 11px/1 'Instrument Sans',sans-serif;letter-spacing:.1em;padding:8px 10px;white-space:nowrap;opacity:0;transition:opacity .2s,transform .2s;pointer-events:none}
  #bucky-bot:hover #bucky-tip,#bucky-bot.bucky-hello #bucky-tip{opacity:1;transform:translate(-50%,-2px)}
  #bucky-panel{position:fixed;z-index:9001;width:min(380px,calc(100vw - 24px));max-height:min(560px,calc(100vh - 100px));background:#fff;color:#0E0E0F;border:1px solid #0E0E0F;box-shadow:0 24px 60px -24px rgba(14,14,15,.55);display:none;flex-direction:column;font-family:'Instrument Sans',sans-serif}
  #bucky-panel.open{display:flex}
  #bucky-panel header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#0E0E0F;color:#fff}
  #bucky-panel header b{font-family:'Archivo',sans-serif;font-stretch:62%;font-weight:900;font-size:24px;letter-spacing:.01em}
  #bucky-panel header span{font:500 10px 'JetBrains Mono',monospace;letter-spacing:.16em;color:#F07C12;display:flex;gap:6px;align-items:center}
  #bucky-panel header span i{width:7px;height:7px;border-radius:50%;background:#0B6E4F;display:inline-block}
  #bucky-panel header button{border:1px solid #3A3A3E;background:none;color:#fff;height:28px;padding:0 10px;font:700 11px 'Instrument Sans';cursor:pointer}
  #bucky-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:12px;min-height:160px}
  .bucky-m{display:flex;flex-direction:column;gap:5px;max-width:90%}
  .bucky-m small{font:500 10px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#C2610B}
  .bucky-m p{margin:0;font-size:14px;line-height:1.5;white-space:pre-wrap}
  .bucky-me{align-self:flex-end}.bucky-me small{color:#8A877F;text-align:right}.bucky-me p{background:#0E0E0F;color:#fff;padding:9px 12px}
  .bucky-links{display:flex;flex-wrap:wrap;gap:6px}
  .bucky-links a{height:30px;padding:0 10px;background:#F07C12;color:#0E0E0F;text-decoration:none;display:flex;align-items:center;font:700 11px 'Instrument Sans';letter-spacing:.08em}
  .bucky-busy{font:500 11px 'JetBrains Mono',monospace;letter-spacing:.14em;color:#C2610B}
  #bucky-sug{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
  #bucky-sug button{height:30px;padding:0 10px;border:1px solid #E3E0D8;background:#fff;font:500 12px 'Instrument Sans';cursor:pointer;color:#0E0E0F}
  #bucky-sug button:hover{border-color:#F07C12;color:#C2610B}
  #bucky-form{display:flex;border-top:1px solid #0E0E0F}
  #bucky-form input{flex:1;height:50px;border:0;padding:0 14px;font:15px 'Instrument Sans',sans-serif;outline:none;min-width:0}
  #bucky-form button{width:84px;border:0;background:#F07C12;color:#0E0E0F;font:700 12px 'Instrument Sans';letter-spacing:.1em;cursor:pointer}
  #bucky-panel footer{padding:6px 14px 10px;font-size:11px;color:#8A877F}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const bot = document.createElement('div'); bot.id = 'bucky-bot';
  bot.innerHTML = `<div id="bucky-crop"></div><span id="bucky-tip">ASK BUCKY</span><button class="bucky-hit" aria-label="Ask Bucky, the Expo guide" aria-expanded="false" aria-controls="bucky-panel"></button>`;
  const panel = document.createElement('div'); panel.id = 'bucky-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Ask Bucky');
  panel.innerHTML = `<header><div style="display:flex;flex-direction:column;gap:3px"><span><i></i>EXPO GUIDE · ONLINE</span><b>ASK BUCKY</b></div><div class="bucky-actions"><button type="button" data-sound aria-pressed="false">SOUND ON</button><button type="button" data-close>CLOSE ✕</button></div></header>
    <div id="bucky-log" role="log" aria-live="polite"></div>
    <div id="bucky-sug"></div>
    <form id="bucky-form"><input aria-label="Ask anything about the Expo" placeholder="Ask anything about the Expo…" autocomplete="off"><button type="submit">ASK →</button></form>
    <footer>Demo assistant · answers use sample Expo data</footer>`;
  const mount = () => { document.body.appendChild(bot); document.body.appendChild(panel); };
  // A still of Bucky shows at once while the 3D scene loads: the snapshot remembered from an
  // earlier visit, or the bundled poster on a first visit.
  let saved = null;
  try { saved = localStorage.getItem(POSTER_KEY); } catch (e) {}
  const poster = document.createElement('div'); poster.id = 'bucky-poster';
  poster.style.backgroundImage = `url("${saved || withBase('/assets/bucky-poster.png')}")`;
  bot.querySelector('#bucky-crop').appendChild(poster);
  addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.bucky === 'ready') setTimeout(() => { poster.style.opacity = '0'; }, 500);
    if (typeof e.data.buckyPoster === 'string' && e.data.buckyPoster.startsWith('data:image/')) {
      try { localStorage.setItem(POSTER_KEY, e.data.buckyPoster); } catch (err) {}
    }
  });
  const loadScene = () => { const f = document.createElement('iframe'); f.src = (window.__resources && window.__resources.buckyScene) || withBase('/bucky-scene.html') + (opts.localScene ? '?scene=local' : ''); f.title = ''; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; bot.querySelector('#bucky-crop').appendChild(f); };
  // Start loading the robot straight away (it used to wait for the whole page plus 800 ms).
  // Phones and tablets keep the still of Bucky (gently animated in CSS) instead of a second live 3D scene.
  if (!isLite()) requestAnimationFrame(loadScene);
  document.body ? mount() : addEventListener('DOMContentLoaded', mount);

  const log = panel.querySelector('#bucky-log'), input = panel.querySelector('input'), hit = bot.querySelector('.bucky-hit');
  const add = (me, text, links) => {
    const d = document.createElement('div'); d.className = 'bucky-m' + (me ? ' bucky-me' : '');
    d.innerHTML = `<small>${me ? 'YOU' : 'BUCKY'}</small><p></p>`; d.querySelector('p').textContent = text;
    if (links && links.length) { const l = document.createElement('div'); l.className = 'bucky-links'; links.forEach(k => { const a = document.createElement('a'); a.href = withBase(k.href); a.textContent = k.t; l.appendChild(a); }); d.appendChild(l); }
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  };
  add(false, 'Namaste. I am Bucky, your guide to India Sports Expo 2027 in Hall 2, Yashobhoomi. Ask me anything: exhibitors, stalls, sessions, meetings, routes or travel.');
  const SUG = ['Where is Apex Sports?', 'What is live now?', 'How do I book a stall?', 'How do I get there?', 'Find me buyers'];
  const sug = panel.querySelector('#bucky-sug');
  SUG.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.onclick = () => ask(t); sug.appendChild(b); });

  function local(q) {
    const D = window.ISE; const t = q.toLowerCase();
    if (D) {
      const ex = D.exhibitors.find(e => t.includes(e.name.toLowerCase().split(' ')[0]) || t.includes(e.stall.toLowerCase()));
      if (ex) return { text: `${ex.name} is at stall ${ex.stall}, Zone ${ex.zone} (${D.cl(ex.cluster).name}). From the Main Entrance follow the Sports Boulevard into Zone ${ex.zone}, about 4 minutes on foot. They offer ${ex.products.slice(0, 3).join(', ')} and are looking for ${ex.seeking}.`, links: [{ t: 'NAVIGATE', href: '/explore' }, { t: 'BOOK MEETING', href: '/connect#meetings' }] };
      if (/live|now|watch|stream/.test(t)) { const s = D.sessions.find(x => x.status === 'live'); return { text: `Live now in the ${s.stage}: “${s.title}”, ${s.time}–${s.end}. Up next: ${D.sessions.filter(x => x.day === 2 && x.status === 'upcoming').slice(0, 2).map(x => x.time + ' ' + x.title).join('; ')}.`, links: [{ t: 'WATCH LIVE', href: '/programme#watch' }] }; }
      const z = D.zones.find(z => t.includes(z.short.toLowerCase()) || t.includes('zone ' + z.id.toLowerCase()));
      if (z) return { text: `Zone ${z.id} · ${z.name}. ${z.blurb}`, links: [{ t: 'EXPLORE ZONE ' + z.id, href: '/zones' }] };
    }
    if (/register|pass|ticket|badge|accredit/.test(t)) return { text: 'Register once as a visitor, buyer, investor, media or another participant type. After verification and approval you receive accreditation and a digital pass with a QR code on the web and in the app.', links: [{ t: 'REGISTER', href: '/attend#register' }] };
    if (/stall|booth|exhibit|space|pavilion/.test(t)) return { text: 'There are seven exhibition products, from a Standard Booth (3 × 3 m, sample) to a Hero Experience (500+ m², sample). Pick a product, then choose an available stall on the live Hall 2 inventory.', links: [{ t: 'EXHIBITION PRODUCTS', href: '/exhibit#products' }, { t: 'AVAILABLE STALLS', href: '/exhibit#inventory' }] };
    if (/metro|airport|get there|reach|parking|hotel|travel|direction/.test(t)) return { text: 'Yashobhoomi is in Dwarka Sector 25, New Delhi. The Airport Express metro line serves the venue; by car from IGI Airport is roughly 20–30 minutes (sample estimate). Shuttles run from partner hotels.', links: [{ t: 'GETTING THERE', href: '/explore#getting-there' }] };
    if (/buyer|match|meet|distribut|invest|partner/.test(t)) return { text: 'The India Sports Business Exchange in Zone D matches exhibitors, buyers, investors and distributors, then books a table, a time and reminders.', links: [{ t: 'FIND MATCHES', href: '/connect' }] };
    if (/programme|program|session|agenda|speaker/.test(t)) return { text: 'Three days across the Plenary Hall, Innovation Arena and Business Exchange Stage. You can view by agenda, timeline, stage, sector or speaker and save sessions to My Expo.', links: [{ t: 'PROGRAMME', href: '/programme#programme' }] };
    return null;
  }
  let busy = false;
  async function ask(q) {
    q = (q || '').trim(); if (!q || busy) return; busy = true; input.value = '';
    add(true, q);
    const b = document.createElement('div'); b.className = 'bucky-busy'; b.textContent = 'BUCKY IS CHECKING HALL 2…'; log.appendChild(b); log.scrollTop = log.scrollHeight;
    let r = local(q);
    if (!r && window.claude && window.claude.complete) {
      try {
        const D = window.ISE; const ctx = D ? JSON.stringify({ zones: D.zones.map(z => z.id + ' ' + z.name), clusters: D.clusters.map(c => c.id + ' ' + c.name + ' (Zone ' + c.zone + ')'), exhibitors: D.exhibitors.map(e => e.name + ' · ' + e.stall + ' · ' + e.sector), sessions: D.sessions.map(s => 'Day ' + s.day + ' ' + s.time + ' ' + s.title + ' @ ' + s.stage) }) : '';
        const txt = await window.claude.complete(`You are Bucky, the friendly, concise guide for India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. Answer in at most 3 short sentences of plain text, no markdown. Prefer the demo data below; for anything unconfirmed say it is provisional and suggest the helpdesk. Demo data: ${ctx}\n\nVisitor: ${q}`);
        r = { text: String(txt).trim() };
      } catch (e) { r = null; }
    }
    if (!r) r = { text: 'I can help with exhibitors, stalls, sessions, live streams, registration, meetings and getting to Yashobhoomi. Try “Where is Apex Sports?”', links: [{ t: 'HELPDESK', href: '/attend#myexpo' }] };
    b.remove(); add(false, r.text, r.links); busy = false;
  }
  panel.querySelector('#bucky-form').addEventListener('submit', e => { e.preventDefault(); ask(input.value); });

  // Stationary on the right edge, vertically low. Eyes blink inside the scene; click = jump, then open chat.
  let open = false, jumping = false;
  const pos = () => ({ x: innerWidth - SIZE - 18, y: innerHeight - SIZE - 18 });
  function place() {
    const p = pos();
    if (!jumping) bot.style.transform = `translate(${p.x}px, ${p.y}px)`;
    if (!open) return;
    const pw = panel.offsetWidth, ph = panel.offsetHeight;
    let px = Math.max(12, p.x + SIZE - pw), py = Math.max(12, p.y - ph - 8);
    panel.style.left = px + 'px'; panel.style.top = py + 'px';
  }
  place(); addEventListener('resize', place);
  function jump(done) {
    if (reduced) return done();
    jumping = true; const p = pos(); const t0 = performance.now(), D = 560;
    const step = now => {
      const k = Math.min(1, (now - t0) / D);
      const h = Math.sin(k * Math.PI) * 46;
      const sq = k < 0.12 ? 1 - k * 0.9 : k > 0.88 ? 1 - (1 - k) * 0.9 : 1;
      bot.style.transform = `translate(${p.x}px, ${p.y - h}px) scale(${2 - sq}, ${sq})`;
      if (k < 1) requestAnimationFrame(step); else { jumping = false; place(); done(); }
    };
    bot.style.transformOrigin = '50% 100%';
    requestAnimationFrame(step);
  }
  function setOpen(v) { open = v; panel.classList.toggle('open', v); hit.setAttribute('aria-expanded', String(v)); if (v) { place(); setTimeout(() => input.focus(), 30); } }
  unlockOnFirstGesture();
  // Hover: a little side-to-side wiggle, or now and then a hop, with a soft "boop-bip".
  let lastPlay = 0;
  hit.addEventListener('pointerenter', e => {
    if (e.pointerType === 'touch' || jumping) return;
    const now = performance.now(); if (now - lastPlay < 700) return; lastPlay = now;
    playHover();
    if (reduced) return;
    const cls = Math.random() < 0.3 ? 'bucky-hop' : 'bucky-wiggle';
    bot.classList.remove('bucky-hop', 'bucky-wiggle'); void bot.offsetWidth; bot.classList.add(cls);
  });
  bot.querySelector('#bucky-crop').addEventListener('animationend', () => bot.classList.remove('bucky-hop', 'bucky-wiggle'));
  hit.addEventListener('click', () => { if (jumping) return; playClick(); if (open) return setOpen(false); jump(() => setOpen(true)); });
  const soundBtn = panel.querySelector('[data-sound]');
  const showSound = () => { const m = isMuted(); soundBtn.textContent = m ? 'SOUND OFF' : 'SOUND ON'; soundBtn.setAttribute('aria-pressed', String(!m)); };
  soundBtn.addEventListener('click', () => { setMuted(!isMuted()); showSound(); if (!isMuted()) playHover(); });
  showSound();
  panel.querySelector('[data-close]').addEventListener('click', () => setOpen(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false); });
  setTimeout(() => { bot.classList.add('bucky-hello'); setTimeout(() => bot.classList.remove('bucky-hello'), 3200); }, 2500);
}
```

#### `src/lib/bucky-sounds.js`
```js
'use client';
// Bucky's two little sounds, synthesised with Web Audio (no audio files to load).
//   hover  a soft rising "boop-bip"
//   click  a cheerful chirp with a sparkle on top
// Browsers only allow sound after the visitor has interacted with the page (a click, tap or
// key press), so the hover sound starts working after the first interaction.

const MUTE_KEY = 'bucky-muted';
let ctx = null;

function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** Resume audio on the visitor's first interaction anywhere on the page. */
export function unlockOnFirstGesture() {
  const unlock = () => {
    const a = audio();
    if (a && a.state === 'suspended') a.resume().catch(() => {});
  };
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) addEventListener(ev, unlock, { capture: true, passive: true });
}

export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {}
}

function tone(a, { type = 'sine', from, to = from, start = 0, dur, vol = 0.12 }) {
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function play(fn) {
  if (isMuted()) return;
  const a = audio();
  if (!a || a.state !== 'running') return;
  fn(a);
}

export function playHover() {
  play((a) => {
    tone(a, { from: 620, to: 700, dur: 0.09, vol: 0.09 });
    tone(a, { from: 930, to: 1180, start: 0.08, dur: 0.12, vol: 0.08 });
  });
}

export function playClick() {
  play((a) => {
    tone(a, { type: 'triangle', from: 480, to: 1320, dur: 0.16, vol: 0.14 });
    tone(a, { type: 'sine', from: 1760, to: 2100, start: 0.13, dur: 0.1, vol: 0.07 });
    tone(a, { type: 'sine', from: 2350, to: 2640, start: 0.2, dur: 0.09, vol: 0.05 });
  });
}
```

#### `public/bucky-scene.html`
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bucky</title>
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}#c{position:absolute;inset:0;width:100%;height:100%;outline:none;opacity:0;transition:opacity .5s}</style>
<script>
// Spline's physics step throws on every frame for this export. Run animation callbacks inside try/catch so nothing escapes to the console.
(function () { const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = cb => raf(t => { try { cb(t); } catch (e) {} }); })();
window.onerror = function () { return true; };
window.addEventListener('error', function (e) { e.preventDefault(); e.stopImmediatePropagation(); }, true);
window.addEventListener('unhandledrejection', function (e) { e.preventDefault(); });
</script>
</head>
<body>
<canvas id="c"></canvas>
<script type="module">
import { Application } from './vendor/spline/runtime.js';
const c = document.getElementById('c');
// Load Spline's WebAssembly helpers (Draco decoder, physics) from this site, not a CDN.
const app = new Application(c, { wasmPath: new URL('vendor/spline', location.href).href });
// The scene is copied into the site at build time when possible (scripts/vendor-assets.mjs);
// the page passes ?scene=local then. Otherwise it loads from Spline.
const REMOTE = 'https://prod.spline.design/clZpIOGef0TGq99W/scene.splinecode';
const local = new URLSearchParams(location.search).get('scene') === 'local';
await app.load(local ? new URL('assets/bucky.splinecode', location.href).href : REMOTE);
const keep = new Set(['Robot', 'Helmet', 'ear', 'Shield', 'Eyes', 'Collar', 'Body', 'Camera', 'Directional Light']);
app.getAllObjects().forEach(o => { if (!keep.has(o.name)) o.visible = false; });
try { app.setBackgroundColor('transparent'); } catch (e) {}
try { app.setGlobalEvents(false); } catch (e) {}
const straight = ['Robot', 'Helmet', 'Eyes', 'Body', 'Collar'].flatMap(n => app.getAllObjects().filter(o => o.name === n));
let rest = [];
const lock = () => { straight.forEach((o, i) => { const r = rest[i]; if (r) { o.rotation.x = r.x; o.rotation.y = r.y; o.rotation.z = r.z; } }); requestAnimationFrame(lock); };
setTimeout(() => { rest = straight.map(o => !o.rotation ? null : o.name === 'Robot' ? { x: 0, y: 0, z: 0 } : { x: o.rotation.x, y: o.rotation.y, z: o.rotation.z }); lock(); }, 300);
// Blink: squash the eyes vertically for ~140 ms every 3–5 s
const eyes = app.getAllObjects().filter(o => o.name === 'Eyes' && o.scale);
const base = eyes.map(o => o.scale.y);
const blink = () => {
  const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / 160); const f = k < 0.5 ? 1 - k * 1.8 : 0.1 + (k - 0.5) * 1.8; eyes.forEach((o, i) => o.scale.y = base[i] * Math.max(0.1, f)); if (k < 1) requestAnimationFrame(step); else eyes.forEach((o, i) => o.scale.y = base[i]); };
  requestAnimationFrame(step);
  setTimeout(blink, 3000 + Math.random() * 2200);
};
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(blink, 1500);
window.__app = app;
c.style.opacity = 1;
parent.postMessage({ bucky: 'ready' }, '*');
// Send a snapshot of the visible crop (x 405–780, y 300–675 of this 1200×800 frame) so the
// page can show Bucky instantly on later page loads while the 3D scene starts.
setTimeout(() => requestAnimationFrame(() => {
  try {
    const k = c.width / innerWidth, out = document.createElement('canvas');
    out.width = out.height = 300;
    out.getContext('2d').drawImage(c, 405 * k, 300 * k, 375 * k, 375 * k, 0, 0, 300, 300);
    parent.postMessage({ buckyPoster: out.toDataURL('image/webp', 0.85) }, '*');
  } catch (e) {}
}), 1800);
</script>
</body>
</html>
```

#### `src/app/api/bucky/route.ts`
```ts
// Bucky answers for questions the built-in topics don't cover.
// The browser calls this through window.claude.complete (see src/components/ClientInit.tsx).
// Set ANTHROPIC_API_KEY on the server to enable it; without credentials it returns 503
// and the guide falls back to its built-in reply.
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const MAX_PROMPT_CHARS = 12000;
const SYSTEM =
  'You are Bucky, the expo guide for India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. ' +
  'Only answer questions about the Expo, its venue, exhibitors, programme and travel. ' +
  'Reply in at most 3 short sentences of plain text, no markdown.';

let client: Anthropic | null = null;

export async function POST(req: Request) {
  let prompt: unknown;
  try {
    ({ prompt } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return Response.json({ error: 'prompt is required' }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return Response.json({ error: 'prompt is too long' }, { status: 413 });
  }
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json({ error: 'AI answers are not configured' }, { status: 503 });
  }

  client ??= new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 2000,
      output_config: { effort: 'low' },
      // If the model declines, the API retries on a fallback model in the same call.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });
    if (response.stop_reason === 'refusal') {
      return Response.json({ error: 'No answer available' }, { status: 422 });
    }
    const text = response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('')
      .trim();
    if (!text) return Response.json({ error: 'Empty answer' }, { status: 502 });
    return Response.json({ text });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'Busy, try again shortly' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error('[bucky] Claude API error', error.status, error.message);
      return Response.json({ error: 'AI answer failed' }, { status: 502 });
    }
    console.error('[bucky] unexpected error', error);
    return Response.json({ error: 'AI answer failed' }, { status: 500 });
  }
}
```
