---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/mobile
  - performance
status: proven
---

# Lite Mode for Phones and Tablets

> One build, two weights: phones and tablets (small screen or touch) get still or CSS-only versions of the heavy live 3D views, lazy maps and stills for video, so pages stay within mobile memory limits and scroll smoothly.

**Used in:** Site-wide. `html.lite` on phones and tablets.

## How it works

- Inline boot script (ES5) sets `lite` before first paint with `(max-width: 900px), (pointer: coarse)`; `?lite=1` / `?lite=0` override.
- Components ask `isLite()` — after mount when the answer changes the markup (hydration must match).
- `mobile-fit.js` reflows wide grids, rows and oversized headlines at ≤1024 px; nothing scrolls sideways.
- `mobile.css` holds the phone header/menu and fixes.

## Reuse it

- Start every new site with the boot script + `isLite()` + `mobile-fit.js`.

## Gotchas and lessons

- Live blurs (`backdrop-filter`) over moving backgrounds are the #1 phone jank cause — use a tint on lite.
- Phones kill tabs that use too much memory; after repeated crashes iOS refuses to load the page at all.

## Related

[[Old Browser Support]] · [[ISE Device Support]] · [[Playbook - Mobile and Tablet Performance Audit]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/lib/device.js`
```js
// "Lite" devices: phones and tablets (small screens or touch as the main input).
// They get still or CSS-animated versions of the live 3D views (hero hand and globe, Bucky,
// the venue tour) and a lighter Earth globe, so the page stays within mobile memory limits.
// The class is set before the page renders by the inline script in src/app/layout.tsx.
// Override for testing with ?lite=1 or ?lite=0.
export const LITE_QUERY = '(max-width: 900px), (pointer: coarse)';

export function isLite() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('lite');
}
```

#### `src/app/layout.tsx`
```tsx
import type { Metadata, Viewport } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Script from 'next/script';
import ClientInit from '@/components/ClientInit';
import PreloadScenes from '@/components/PreloadScenes';
import { BASE, withBase } from '@/lib/base';
import { LITE_QUERY } from '@/lib/device';
import './globals.css';
import './dc-pseudo.css';
import './motion.css';
import './mobile.css';
import './anim.css';
import './sporty.css';
import BackButton from '@/components/BackButton';
import MobileMenu from '@/components/MobileMenu';
import BrandLogo from '@/components/BrandLogo';

export const metadata: Metadata = {
  title: 'India Sports Expo 2027 · Yashobhoomi',
  description:
    'India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. Explore the hall, exhibit, attend, connect and watch.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// True when the build copied Bucky's scene into the site (scripts/vendor-assets.mjs).
const LOCAL_BUCKY = existsSync(join(process.cwd(), 'public', 'assets', 'bucky.splinecode'));

// Runs first, in old-style JavaScript so any phone can run it:
// - fills in newer JavaScript features that older iPhones (before iOS 15.4) and older Android
//   Chrome (back to 67) lack; the code itself is compiled for them ("browserslist", package.json);
// - marks browsers without class static blocks (iOS before 16.4) as "legacy": they skip the maps;
// - if the site has not started 9 s after loading, shows what went wrong on screen (errors,
//   browser, build) instead of leaving the loading screen up, so it can be reported.
const BOOT_SCRIPT = `(function(){
var def=function(o,k,v){if(!o[k])Object.defineProperty(o,k,{value:v,writable:true,configurable:true})};
if(typeof globalThis==='undefined')window.globalThis=window;
def(Object,'hasOwn',function(o,k){return Object.prototype.hasOwnProperty.call(o,k)});
def(Object,'fromEntries',function(it){var o={};Array.from(it).forEach(function(e){o[e[0]]=e[1]});return o});
var at=function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return i<0||i>=this.length?undefined:this[i]};
def(Array.prototype,'at',at);def(String.prototype,'at',at);
def(Array.prototype,'flat',function(d){d=d===undefined?1:Math.floor(d);var f=function(a,n){return a.reduce(function(r,x){return r.concat(Array.isArray(x)&&n>0?f(x,n-1):[x])},[])};return f(this,d)});
def(Array.prototype,'flatMap',function(fn,t){return Array.prototype.map.call(this,fn,t).flat(1)});
def(String.prototype,'replaceAll',function(p,r){if(p instanceof RegExp)return this.replace(p,r);return this.split(String(p)).join(typeof r==='function'?r(String(p)):r)});
def(String.prototype,'matchAll',function(re){var s=String(this),r=new RegExp(re.source,re.flags.indexOf('g')<0?re.flags+'g':re.flags),out=[],m;while((m=r.exec(s))){out.push(m);if(m[0]==='')r.lastIndex++}return out[Symbol.iterator]()});
def(Promise,'allSettled',function(ps){return Promise.all(Array.from(ps).map(function(p){return Promise.resolve(p).then(function(v){return{status:'fulfilled',value:v}},function(e){return{status:'rejected',reason:e}})}))});
def(window,'queueMicrotask',function(f){Promise.resolve().then(f)});
def(window,'structuredClone',function(v){return v===undefined?v:JSON.parse(JSON.stringify(v))});
[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(function(P){def(P,'replaceChildren',function(){while(this.lastChild)this.removeChild(this.lastChild);this.append.apply(this,arguments)})});
try{new Function('class A{static{}}')}catch(e){document.documentElement.classList.add('legacy')}
var errs=window.__bootErrors=[];
addEventListener('error',function(e){var t=e.target;if(t&&t!==window&&(t.src||t.href))errs.push('Could not load '+(t.src||t.href));else errs.push((e.message||'Error')+(e.filename?' ('+e.filename.split('/').pop()+':'+e.lineno+')':''))},true);
addEventListener('unhandledrejection',function(e){var r=e.reason;errs.push('Promise: '+(r&&r.message||r))});
addEventListener('load',function(){setTimeout(function(){
if(window.__booted)return;
var c=document.getElementById('page-curtain');if(c)c.style.display='none';
var b=document.createElement('div');b.id='boot-error';
b.setAttribute('style','position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#0E0E0F;color:#fff;padding:24px;font:14px/1.5 -apple-system,Helvetica,Arial,sans-serif;overflow:auto');
var esc=function(x){return String(x).replace(/[&<>]/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]})};
b.innerHTML='<p style="font-weight:700;font-size:20px;margin:0 0 12px">The site could not start on this browser.</p>'+
'<p style="margin:0 0 16px;color:#BDB9B0">Please take a screenshot of this screen and send it to the site team. Updating iOS (Settings, General, Software Update) usually fixes it.</p>'+
'<button onclick="location.reload()" style="background:#F07C12;color:#0E0E0F;border:0;padding:12px 18px;font-weight:700;margin-bottom:20px">TRY AGAIN</button>'+
'<pre style="white-space:pre-wrap;font:12px/1.5 ui-monospace,Menlo,monospace;color:#E3E0D8;margin:0">'+esc('Build: '+(window.__build||'?')+'\\nBrowser: '+navigator.userAgent+'\\nErrors:\\n'+(errs.length?errs.slice(0,8).join('\\n'):'none recorded'))+'</pre>';
document.body.appendChild(b);
},9000)});
})();`;

// Runs before the page renders: marks phones and tablets as "lite" (src/lib/device.js), and on
// other devices starts downloading the 3D runtime and scenes right away.
function deviceScript(localBucky: boolean) {
  const base = JSON.stringify(BASE);
  return `(function(){var d=document.documentElement,q=location.search,lite=false;
try{lite=matchMedia(${JSON.stringify(LITE_QUERY)}).matches}catch(e){}
if(/[?&]lite=1/.test(q))lite=true;if(/[?&]lite=0/.test(q))lite=false;
var b=${base},h=document.head,add=function(rel,href,as,img){var l=document.createElement('link');l.rel=rel;l.href=b+href;if(as){l.as=as;if(!img)l.crossOrigin='anonymous'}h.appendChild(l)};
var seg=location.pathname.slice(b.length).replace(/^[/]|[/]$/g,'').split('/')[0],home=!seg;
d.classList.add('pg-'+(seg||'home'));
if(lite)d.classList.add('lite');
if(home)add('preload',lite?'/assets/hero-stadium-sm.webp':'/assets/hero-stadium.webp','image',1);
if(lite)return;
add('modulepreload','/vendor/spline/runtime.js');
${localBucky ? "add('preload','/assets/bucky.splinecode','fetch');" : ''}
})();`;
}

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.__build=${JSON.stringify(process.env.NEXT_PUBLIC_BUILD || '')};` + BOOT_SCRIPT + deviceScript(LOCAL_BUCKY) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <PreloadScenes />
        {/* Covers the page while it loads and during page changes (src/lib/motion.js). */}
        <div id="page-curtain" aria-hidden="true">
          <div className="curtain-brand">
            <BrandLogo className="curtain-logo" />
          </div>
          <span className="curtain-line" />
        </div>
        {children}
        <BackButton />
        <MobileMenu />
        <ClientInit localBucky={LOCAL_BUCKY} />
        {/* <image-slot> media placeholders. Fill slots by id in public/image-slots.state.json. */}
        <Script src={withBase('/image-slot.js')} strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

#### `src/lib/mobile-fit.js`
```js
'use client';
// Fits the design's desktop layouts to phone and tablet screens.
// The screens are styled inline with fixed multi-column grids, one-line flex rows and very large
// headlines, which run off the side of a phone. On screens up to 1024px this finds the layouts
// that are actually too wide and reflows only those:
//   grids          columns that don't fit, flexible columns squeezed narrow, or cells whose
//                  content spills out get fewer columns (sticky tab bars scroll sideways instead)
//   flex rows      that overflow wrap onto more lines
//   big text       a headline word wider than its box shrinks to fit
//   wide boxes     anything wider than the screen is capped at the screen width
// It re-checks when the page changes (tabs, filters, drawers) and on rotation.

const MAX_WIDTH = 1024;

function tracksOf(style) {
  // Split an inline grid-template-columns value into tracks, keeping repeat()/minmax() intact.
  const m = /grid-template-columns:\s*([^;]+)/.exec(style || '');
  if (!m) return [];
  const out = [];
  let depth = 0, cur = '';
  for (const ch of m[1].trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ' ' && depth === 0) { if (cur) out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

const visible = (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed';
const innerWidth_ = (el) => {
  const c = getComputedStyle(el);
  return el.clientWidth - parseFloat(c.paddingLeft) - parseFloat(c.paddingRight);
};

function fitGrids(root, vw) {
  let changed = 0;
  root.querySelectorAll('[style*="grid-template-columns"]').forEach((el) => {
    if (el.dataset.fit || !visible(el)) return;
    const c = getComputedStyle(el);
    if (c.display !== 'grid') return;
    const cols = c.gridTemplateColumns.split(' ').map(parseFloat).filter((n) => !Number.isNaN(n));
    const n = cols.length;
    if (n < 2) return;
    const gap = parseFloat(c.columnGap) || 0;
    const need = cols.reduce((a, b) => a + b, 0) + gap * (n - 1);
    const avail = innerWidth_(el);
    // Which columns are flexible (fr) in the design: those are the ones a phone squeezes.
    const tracks = tracksOf(el.getAttribute('style'));
    const flex = tracks.length === n ? tracks.map((t) => /fr/.test(t)) : cols.map(() => /fr/.test(tracks.join(' ')));
    const tooWide = need > avail + 1;
    const squeezed = vw <= 700 && cols.some((w, i) => flex[i] && w < 120);
    const spills = [...el.children].some((k) => k.clientWidth > 0 && k.scrollWidth > k.clientWidth + 2 && getComputedStyle(k).overflowX === 'visible');
    if (!tooWide && !squeezed && !spills) return;
    if (c.position === 'sticky') {
      // Tab bars: keep one row and let it scroll sideways.
      el.style.overflowX = 'auto';
      el.style.gridTemplateColumns = `repeat(${n}, max-content)`;
      el.dataset.fit = 'scroll';
    } else {
      // Fewer columns: two or more where each can still be ~150px wide, otherwise one.
      const k = n <= 2 ? 1 : Math.max(1, Math.min(n - 1, Math.floor((avail + gap) / (150 + gap))));
      el.style.gridTemplateColumns = k === 1 ? 'minmax(0,1fr)' : `repeat(${k}, minmax(0,1fr))`;
      for (const kid of el.children) if (kid.style.gridColumn) kid.style.gridColumn = '1 / -1';
      // More rows now: a fixed height or row template would make them overlap what follows.
      if (el.style.height && el.style.height !== 'auto') { el.style.minHeight = el.style.height; el.style.height = 'auto'; }
      if (el.style.gridTemplateRows) el.style.gridTemplateRows = 'none';
      el.dataset.fit = String(k);
    }
    changed++;
  });
  return changed;
}

function fitFlexRows(root) {
  let changed = 0;
  root.querySelectorAll('[style*="display: flex"]').forEach((el) => {
    if (el.dataset.fit || !visible(el)) return;
    const c = getComputedStyle(el);
    if (c.flexDirection !== 'row' || c.flexWrap !== 'nowrap' || c.overflowX !== 'visible') return;
    if (el.scrollWidth <= el.clientWidth + 1) return;
    el.style.flexWrap = 'wrap';
    if (el.style.height && el.style.height !== 'auto') { el.style.minHeight = el.style.height; el.style.height = 'auto'; }
    el.dataset.fit = 'wrap';
    changed++;
  });
  return changed;
}

function fitText(root) {
  let changed = 0;
  root.querySelectorAll('h1,h2,h3,h4,[style*="font-size"]').forEach((el) => {
    if (el.dataset.fitText || !visible(el)) return;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 22 || el.scrollWidth <= el.clientWidth + 1 || !el.clientWidth) return;
    const k = Math.max(0.45, (el.clientWidth - 2) / el.scrollWidth);
    el.style.fontSize = Math.floor(size * k) + 'px';
    el.dataset.fitText = '1';
    changed++;
  });
  return changed;
}

function fitWide(root, vw) {
  let changed = 0;
  root.querySelectorAll('*').forEach((el) => {
    if (el.dataset.fitWide) return;
    const r = el.getBoundingClientRect();
    const parent = el.parentElement;
    // Wider than the screen, or running past its right edge while wider than its own box.
    if (r.width <= vw + 1 && !(r.right > vw + 1 && parent && el.offsetWidth > innerWidth_(parent) + 1)) return;
    const c = getComputedStyle(el);
    if (c.position === 'fixed' || c.position === 'absolute' || c.display === 'inline') return;
    if (parent && getComputedStyle(parent).overflowX !== 'visible') return;
    el.style.maxWidth = '100%';
    el.style.minWidth = '0';
    el.dataset.fitWide = '1';
    changed++;
  });
  return changed;
}

function fit() {
  const vw = document.documentElement.clientWidth;
  if (vw > MAX_WIDTH) return;
  const root = document.getElementById('dc-root');
  if (!root) return;
  for (let pass = 0; pass < 4; pass++) {
    const n = fitGrids(root, vw) + fitFlexRows(root) + fitWide(root, vw) + fitText(root);
    if (!n) break;
  }
}

let started = false;
export function initMobileFit() {
  if (started || typeof window === 'undefined') return;
  started = true;
  let t = null;
  const later = (ms = 250) => { clearTimeout(t); t = setTimeout(() => requestAnimationFrame(fit), ms); };
  // Screens render in the browser: fit as they appear, then whenever they change.
  [300, 900, 2000].forEach((ms) => setTimeout(fit, ms));
  // The Earth journey updates as you scroll; changes there don't need a re-check.
  const busy = (n) => n.nodeType === 1 && n.closest('[data-screen-label="02 Earth journey"]');
  const mo = new MutationObserver((list) => {
    if (list.some((m) => m.addedNodes.length && !busy(m.target))) later();
  });
  const watch = () => {
    const root = document.getElementById('dc-root');
    if (root) mo.observe(root, { childList: true, subtree: true });
    else setTimeout(watch, 200);
  };
  watch();
  let lastW = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastW) return; // phones fire resize when the toolbar hides
    lastW = innerWidth;
    later(300);
  });
  window.__fit = fit;
}
```

#### `src/app/mobile.css`
```css
/* Each `inset` is preceded by top/right/bottom/left for older browsers (Chrome before 87). */
/* Phone and tablet layout fixes for the design's pages (below 900px).
   The design's header holds the logo, six links, search and two buttons in one row, which
   is wider than a phone: here it keeps the logo, and the rest moves into the ☰ menu
   (src/components/MobileMenu.tsx). */

.mm-btn {
  display: none;
}

@media (max-width: 900px) {
  #dc-root header[style*='position: sticky'] {
    gap: 12px !important;
    padding-right: 64px !important;
  }
  #dc-root header[style*='position: sticky'] > :not(:first-child) {
    display: none !important;
  }
  #dc-root header[style*='position: sticky'] > a:first-child {
    min-width: 0;
  }

  html.has-header .mm-btn {
    position: fixed;
    top: 10px;
    right: 12px;
    z-index: 9001;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0e0e0f;
    border: 1px solid #3a3a3e;
    cursor: pointer;
    padding: 0;
  }
  .mm-icon {
    position: relative;
    width: 18px;
    height: 12px;
    display: block;
  }
  .mm-icon i {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: #fff;
    transition:
      transform 0.3s ease,
      opacity 0.2s ease,
      top 0.3s ease;
  }
  .mm-icon i:nth-child(1) {
    top: 0;
  }
  .mm-icon i:nth-child(2) {
    top: 5px;
    background: #f07c12;
  }
  .mm-icon i:nth-child(3) {
    top: 10px;
  }
  .mm-icon.is-open i:nth-child(1) {
    top: 5px;
    transform: rotate(45deg);
  }
  .mm-icon.is-open i:nth-child(2) {
    opacity: 0;
  }
  .mm-icon.is-open i:nth-child(3) {
    top: 5px;
    transform: rotate(-45deg);
  }

  .mm-panel {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
    inset: 60px 0 0 0;
    z-index: 9000;
    background: #0e0e0f;
    display: flex;
    flex-direction: column;
    padding: 12px 20px 40px;
    overflow-y: auto;
    animation: mmIn 0.28s ease both;
  }
  .mm-panel .mm-item {
    display: block;
    text-align: left;
    padding: 16px 0;
    border: 0;
    border-bottom: 1px solid #2a2a2d;
    background: none;
    color: #fff;
    text-decoration: none;
    font-family: 'Archivo', sans-serif;
    font-weight: 900;
    font-size: 30px;
    line-height: 1;
    font-stretch: 62%;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    cursor: pointer;
    animation: mmItem 0.4s ease both;
  }
  .mm-panel .mm-item.is-current {
    color: #f07c12;
  }
  .mm-panel .mm-item.is-cta {
    margin-top: 20px;
    border: 0;
    background: #f07c12;
    color: #0e0e0f;
    text-align: center;
    font-family: 'Instrument Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    font-stretch: normal;
    letter-spacing: 0.12em;
  }
  .mm-build {
    order: 99;
    margin-top: 28px;
    font: 500 10px 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
    color: #6b6a66;
  }
  @keyframes mmIn {
    from {
      opacity: 0;
    }
  }
  @keyframes mmItem {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }
}

@media (max-width: 900px) {
  /* Safety net: nothing may widen the page past the screen (src/lib/mobile-fit.js reflows
     the layouts that would). */
  #dc-root {
    overflow-x: clip;
  }
  /* Portal and admin: the full-height side rail becomes a short scrollable block on top. */
  #dc-root aside[style*='height: 100vh'] {
    position: relative !important;
    height: auto !important;
    max-height: 300px;
  }
}

/* Taps show the orange pulse (src/lib/motion.js) instead of the grey browser flash. */
html {
  -webkit-tap-highlight-color: transparent;
}
```
