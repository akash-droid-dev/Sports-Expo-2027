---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/scroll
status: proven
---

# Per-Page Signature Animations

> Each page gets its own entrance style through an `html.pg-<route>` class set before first paint, plus bar-grow and giant-letter spins.

**Used in:** Inner pages: Explore unfolds, Zones deals cards and spins giant zone letters, Exhibit builds up from the floor, Attend flips like a departures board, Connect slides in, Programme runs like a ticker, Portal and Admin pop their tiles.

## How it works

- The boot script sets `pg-<route>` on `<html>`.
- `page-anim.js` marks bars and giant letters and animates them into view.
- CSS rules under "Inner pages" vary the reveal per page.

## Reuse it

- Give every page one signature motion; reuse the shared reveal engine for the rest.

## Related

[[Scroll Reveals and Count-ups]] · [[ISE Motion]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/lib/page-anim.js`
```js
'use client';
// Signature details for the inner pages, on top of the scroll reveals in src/lib/motion.js
// (whose style changes per page through the html "pg-…" class, src/app/anim.css):
//   bars       progress and chart bars grow into place when they come into view
//   giants     very large letters and numbers (zone letters, big figures) spin in
// Pieces with their own animation ([data-anim]) and the Home journey are left alone.

const SKIP = '[data-anim], [data-screen-label="02 Earth journey"], #bucky-bot, #bucky-panel, [role="dialog"]';

let io = null;
const seen = new WeakSet();

function watch(el, cls, i) {
  if (seen.has(el)) return;
  seen.add(el);
  el.classList.add(cls);
  el.style.setProperty('--pa-i', i);
  io.observe(el);
}

function scan() {
  const root = document.getElementById('dc-root');
  if (!root) return;
  const groups = new Map();
  root.querySelectorAll('[style*="width:"], [style*="height:"]').forEach((el) => {
    if (seen.has(el) || el.closest(SKIP) || !el.offsetParent) return;
    const st = el.getAttribute('style') || '';
    const bg = getComputedStyle(el).backgroundColor;
    if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') return;
    let cls = null;
    if (/(^|;)\s*width:\s*[\d.]+%/.test(st) && el.offsetHeight > 0 && el.offsetHeight <= 12) cls = 'pa-bar';
    else if (/(^|;)\s*height:\s*[\d.]+%/.test(st) && el.offsetWidth > 0 && el.offsetWidth <= 48 && el.offsetHeight > 8) cls = 'pa-vbar';
    if (!cls) return;
    const p = el.parentElement && el.parentElement.parentElement;
    const n = groups.get(p) || 0;
    groups.set(p, n + 1);
    watch(el, cls, Math.min(n, 12));
  });
  root.querySelectorAll('span, b, div, h1, h2, h3').forEach((el) => {
    if (seen.has(el) || el.children.length || el.closest(SKIP)) return;
    const t = (el.textContent || '').trim();
    if (!t || t.length > 3) return;
    if (parseFloat(getComputedStyle(el).fontSize) < 140) return;
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    watch(el, 'pa-giant', 0);
  });
}

let started = false;
export function initPageAnim() {
  if (started || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  started = true;
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('pa-on');
        io.unobserve(e.target);
      }),
    { threshold: 0.2 },
  );
  [700, 1800, 3500].forEach((ms) => setTimeout(scan, ms));
  let t = null;
  const busy = (n) => n.nodeType === 1 && n.closest('[data-screen-label="02 Earth journey"], #bucky-bot, #bucky-panel');
  new MutationObserver((list) => {
    if (list.every((m) => busy(m.target))) return;
    clearTimeout(t);
    t = setTimeout(scan, 400);
  }).observe(document.body, { childList: true, subtree: true });
}
```

#### `src/app/anim.css — Inner pages`
```css
/* ---------- Inner pages: each enters in its own way (html.pg-… set in src/app/layout.tsx) ---------- */
/* Items revealed on scroll (.m-r, src/lib/motion.js). */
html.m-on.pg-explore .m-r:not(.m-in) {
  translate: none;
  transform: perspective(900px) rotateX(-55deg);
  transform-origin: 50% 0;
}
html.m-on.pg-zones .m-r:not(.m-in) {
  translate: none;
  transform: translate(-50px, 70px) rotate(-7deg) scale(0.94);
}
html.m-on.pg-exhibit .m-r:not(.m-in) {
  translate: none;
  transform: translateY(46px) scaleY(0.55);
  transform-origin: 50% 100%;
}
html.m-on.pg-attend .m-r:not(.m-in) {
  translate: none;
  transform: perspective(700px) rotateX(88deg);
  transform-origin: 50% 50%;
}
html.m-on.pg-connect .m-r:not(.m-in) {
  translate: none;
  transform: translateX(90px) skewX(-8deg);
}
html.m-on.pg-programme .m-r:not(.m-in) {
  translate: none;
  transform: translateX(-90px);
}
html.m-on.pg-portal .m-r:not(.m-in),
html.m-on.pg-admin .m-r:not(.m-in) {
  translate: none;
  transform: perspective(900px) rotateY(28deg) scale(0.86);
  transform-origin: 0 50%;
}
html.m-on.pg-mobile .m-r:not(.m-in) {
  translate: none;
  transform: perspective(900px) rotate3d(1, -1, 0, 30deg) translateY(40px);
}
html.m-on[class*='pg-'] .m-r.m-in {
  transition:
    opacity 0.7s var(--ease) var(--m-d, 0ms),
    translate 0.9s var(--ease) var(--m-d, 0ms),
    transform 0.95s cubic-bezier(0.2, 0.8, 0.25, 1.04) var(--m-d, 0ms);
}

/* Big headings (.m-h) wipe in from a different side on each page. */
html.m-on.pg-zones .m-h:not(.m-in),
html.m-on.pg-programme .m-h:not(.m-in),
html.m-on.pg-portal .m-h:not(.m-in),
html.m-on.pg-admin .m-h:not(.m-in) {
  clip-path: inset(-50% 100% -50% -100vw);
  translate: -0.2em 0;
}
html.m-on.pg-connect .m-h:not(.m-in) {
  clip-path: inset(-50% -100vw -50% 100%);
  translate: 0.2em 0;
}
html.m-on.pg-attend .m-h:not(.m-in) {
  clip-path: inset(-50% 50% -50% 50%);
  translate: none;
}
html.m-on.pg-exhibit .m-h:not(.m-in) {
  clip-path: inset(100% -100vw -50% -100vw);
  translate: 0 0.4em;
}

/* Bars grow into place; giant letters and figures spin in (src/lib/page-anim.js). */
.pa-bar {
  transform: scaleX(0);
  transform-origin: 0 50%;
  transition: transform 1.1s cubic-bezier(0.2, 0.8, 0.25, 1) calc(var(--pa-i, 0) * 70ms);
}
.pa-vbar {
  transform: scaleY(0);
  transform-origin: 50% 100%;
  transition: transform 1s cubic-bezier(0.2, 0.8, 0.25, 1) calc(var(--pa-i, 0) * 50ms);
}
.pa-bar.pa-on,
.pa-vbar.pa-on {
  transform: none;
}
.pa-giant {
  transform: perspective(800px) rotateY(-120deg) scale(0.6);
  opacity: 0;
  transition:
    transform 1.2s cubic-bezier(0.2, 0.9, 0.25, 1.1),
    opacity 0.6s ease;
}
.pa-giant.pa-on {
  transform: none;
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .pa-bar,
  .pa-vbar,
  .pa-giant {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}

/* Items waiting to slide in from the side must not widen the page. */
#dc-root {
  overflow-x: clip;
}

/* Phones and tablets: no live blur behind the open book. */
html.lite .hb-backdrop {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: rgba(14, 14, 15, 0.9);
}
```
