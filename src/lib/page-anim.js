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
