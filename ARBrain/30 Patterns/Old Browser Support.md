---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/compat
  - build
status: proven
---

# Old Browser Support

> Production builds compile down to old browsers, the boot script fills in missing JS features, and a small script restores inline CSS that old engines ignore. If the app still fails to start, an on-screen report appears after 9 s.

**Used in:** Site-wide: Android Chrome 67+, Samsung Internet 9.2+, iOS/Safari 14+, Firefox 68+, Edge 79+.

## How it works

- `browserslist` in package.json + `next build --webpack` (Turbopack keeps modern syntax).
- `transpilePackages: ['maplibre-gl']` only for production builds (Turbopack dev can't compile it).
- Boot polyfills: Object.hasOwn, fromEntries, at, flat/flatMap, replaceAll, matchAll, Promise.allSettled, queueMicrotask, structuredClone, replaceChildren, globalThis.
- `legacy-css.js` maps inline `inset`, `aspect-ratio`, flex `gap` to longhands/margins.
- Stylesheets list top/right/bottom/left before every `inset`.
- Check: acorn parse of every chunk at ES2019 and the boot script at ES5.

## Reuse it

- Copy browserslist, next.config phase function, the boot script and legacy-css.js.

## Gotchas and lessons

- Escape `\n` twice inside a TS template that becomes an inline script.
- Use "samsung 9.2", not "samsung 9".

## Related

[[Lite Mode for Phones and Tablets]] · [[Playbook - Old Browser Hardening]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/lib/legacy-css.js`
```js
'use client';
// Layout fill-ins for older browsers (Chrome before 87/88, e.g. old Android phones).
// The screens are styled inline with three newer CSS features those browsers ignore:
//   inset          → top / right / bottom / left
//   aspect-ratio   → a min-height that follows the element's width
//   gap (in flex)  → margins between the children
// An unsupported property set from JavaScript stays readable on the style object (React sets
// style.inset = '0', which the browser ignores but keeps), so this reads it back and applies the
// longhand. It runs only where needed, and re-checks when the page changes.

const supports = (p, v) => {
  try {
    return window.CSS && CSS.supports && CSS.supports(p, v);
  } catch (e) {
    return false;
  }
};

function flexGapWorks() {
  const d = document.createElement('div');
  d.style.cssText = 'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
  d.appendChild(document.createElement('div'));
  d.appendChild(document.createElement('div'));
  document.body.appendChild(d);
  const ok = d.scrollHeight === 1;
  d.remove();
  return ok;
}

function sides(v) {
  const p = String(v).trim().split(/\s+/);
  if (p.length === 1) return [p[0], p[0], p[0], p[0]];
  if (p.length === 2) return [p[0], p[1], p[0], p[1]];
  if (p.length === 3) return [p[0], p[1], p[2], p[1]];
  return p.slice(0, 4);
}

function ratioOf(v) {
  const m = /^\s*([\d.]+)\s*(?:\/\s*([\d.]+))?\s*$/.exec(String(v));
  if (!m) return 0;
  const r = parseFloat(m[1]) / (m[2] ? parseFloat(m[2]) : 1);
  return r > 0 ? r : 0;
}

let started = false;
export function initLegacyCss() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const needInset = !supports('inset', '0');
  const needRatio = !supports('aspect-ratio', '1 / 1');
  const needGap = !flexGapWorks();
  if (!needInset && !needRatio && !needGap) return;
  document.documentElement.classList.add('legacy-css');

  const ratioEls = new Set();
  const ro = needRatio && 'ResizeObserver' in window ? new ResizeObserver((entries) => entries.forEach((e) => fitRatio(e.target))) : null;
  function fitRatio(el) {
    const r = ratioOf(el.style.aspectRatio);
    if (r && el.offsetWidth) el.style.minHeight = el.offsetWidth / r + 'px';
  }

  function fix(el) {
    const st = el.style;
    if (needInset && st.inset && !el.__insetDone) {
      const [t, r, b, l] = sides(st.inset);
      if (!st.top) st.top = t;
      if (!st.right) st.right = r;
      if (!st.bottom) st.bottom = b;
      if (!st.left) st.left = l;
      el.__insetDone = true;
    }
    if (needRatio && st.aspectRatio && !ratioEls.has(el)) {
      ratioEls.add(el);
      fitRatio(el);
      if (ro) ro.observe(el);
    }
    if (needGap && st.gap && !el.__gapDone && getComputedStyle(el).display.indexOf('flex') >= 0) {
      const g = String(st.gap).trim().split(/\s+/);
      const rowGap = g[0], colGap = g[1] || g[0];
      const col = getComputedStyle(el).flexDirection.indexOf('column') === 0;
      const wrap = getComputedStyle(el).flexWrap !== 'nowrap';
      const kids = Array.from(el.children);
      kids.forEach((k, i) => {
        if (i === kids.length - 1 && !wrap) return;
        if (col) k.style.marginBottom = rowGap;
        else {
          k.style.marginRight = colGap;
          if (wrap) k.style.marginBottom = rowGap;
        }
      });
      el.__gapDone = true;
    }
  }

  const scan = () => {
    document.querySelectorAll('[style]').forEach(fix);
    if (!ro) ratioEls.forEach(fitRatio);
  };
  let t = null;
  const later = () => {
    clearTimeout(t);
    t = setTimeout(scan, 120);
  };
  scan();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  if (!ro) addEventListener('resize', later);
}
```

#### `next.config.ts`
```ts
import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

// GitHub Pages: STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Sports-Expo-2027 builds a static site into out/.
// Netlify (and `npm run build` locally) build the full app, including the /api/bucky route.
const staticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Shown at the bottom of the phone menu (src/components/MobileMenu.tsx), to check which build is live.
const BUILD = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

const config = (phase: string): NextConfig => ({
  env: { NEXT_PUBLIC_BUILD: BUILD },
  // Production builds (webpack, see package.json) ship code that older phones can run
  // ("browserslist" in package.json); MapLibre comes pre-built for new browsers only, so it is
  // compiled too. The dev server (Turbopack) can't compile MapLibre and doesn't need to.
  transpilePackages: phase === PHASE_PRODUCTION_BUILD ? ['maplibre-gl'] : [],
  // The design logic runs effects once per mount (maps, scroll listeners), as in the prototype.
  reactStrictMode: false,
  basePath: basePath || undefined,
  ...(staticExport
    ? { output: 'export', trailingSlash: true }
    : {
        // 3D runtimes, scenes and demo media are large and rarely change: let browsers (and the scene iframes) reuse them.
        async headers() {
          const cache = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }];
          return [
            { source: '/vendor/:path*', headers: cache },
            { source: '/assets/:path*', headers: cache },
            { source: '/media/:path*', headers: cache },
          ];
        },
      }),
});

export default config;
```
