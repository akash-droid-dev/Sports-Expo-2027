'use client';
// Site-wide motion: page curtain and transitions, scroll reveals, heading wipes, number
// count-ups and the scroll progress bar. Styles live in src/app/motion.css.
// Everything here is skipped when the visitor prefers reduced motion.

const EASE_MS = 520;
const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Page curtain ---------- */

function curtain() {
  return document.getElementById('page-curtain');
}

/** Lifts the curtain that covers the page while it loads. */
export function revealPage() {
  const c = curtain();
  if (!c) return;
  c.classList.remove('is-leaving');
  c.classList.add('is-gone');
}

/** Covers the page, then runs `go` (used for navigation). */
export function leavePage(go) {
  const c = curtain();
  if (!c || reducedMotion()) return go();
  c.classList.remove('is-gone', 'is-first');
  // Force a reflow so the transition runs from the off-screen position.
  void c.offsetWidth;
  c.classList.add('is-leaving');
  setTimeout(go, EASE_MS);
}

function interceptLinks() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    const samePage = url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') && url.search === location.search;
    if (samePage) return; // in-page anchors scroll natively
    e.preventDefault();
    leavePage(() => (location.href = url.href));
  });
  // Coming back through the browser cache restores the covered page: uncover it.
  addEventListener('pageshow', (e) => {
    if (e.persisted) revealPage();
  });
}

/* ---------- Scroll reveals ---------- */

const ROOTS = 'section[data-screen-label], main';
const SKIP = [
  '[data-screen-label="02 Earth journey"]',
  '[data-sc-name="Hall Plan"]',
  'image-slot',
  '[role="dialog"]',
  '#bucky-panel',
].join(',');

const seen = new WeakSet();
const pending = new Set();
let started_reveals = false;

function inlineStyle(el) {
  return (el.getAttribute('style') || '').replace(/\s+/g, '');
}

function eligible(el) {
  if (seen.has(el) || el.closest(SKIP)) return false;
  const st = inlineStyle(el);
  // Overlays and pinned layers keep their own positioning and timing.
  if (/position:(absolute|fixed|sticky)/.test(st) || /opacity:|transition:/.test(st)) return false;
  return true;
}

function mark(el, delay, kind) {
  seen.add(el);
  el.classList.add(kind);
  el.style.setProperty('--m-d', delay + 'ms');
  pending.add(el);
}

// Reveal what has scrolled into view. Uses geometry rather than IntersectionObserver,
// which reports clipped (hidden) headings and items in overflow-clipped boxes as never visible.
function check() {
  const vh = innerHeight;
  // At the very bottom nothing can scroll further up into view, so show what is on screen.
  const atBottom = scrollY + vh >= document.documentElement.scrollHeight - 2;
  const line = atBottom ? vh : vh * 0.94;
  pending.forEach((el) => {
    if (!el.isConnected) return pending.delete(el);
    if (el.offsetParent === null) return; // not displayed yet (closed tab, drawer)
    const r = el.getBoundingClientRect();
    if (r.top < line) {
      pending.delete(el);
      el.classList.add('m-in');
      countUp(el);
    }
  });
}

function scan() {
  if (!started_reveals) return;
  document.querySelectorAll(ROOTS).forEach((root) => {
    if (root.closest(SKIP)) return;
    // Big headings wipe in.
    root.querySelectorAll('h1, h2').forEach((h) => {
      if (eligible(h)) mark(h, 0, 'm-h');
    });
    // Items of grids and wrapping rows rise in, one after another.
    root.querySelectorAll('div, ul, ol, dl, nav').forEach((group) => {
      const st = inlineStyle(group);
      if (!/display:(grid|flex)/.test(st)) return;
      if (/display:flex/.test(st) && !/flex-wrap:wrap|grid/.test(st) && group.children.length < 3) return;
      const kids = [...group.children];
      if (kids.length < 2 || kids.length > 24) return;
      let i = 0;
      kids.forEach((k) => {
        if (eligible(k) && !k.matches('h1, h2')) mark(k, Math.min(i++, 8) * 70, 'm-r');
      });
    });
    // Remaining top-level blocks of the section.
    [...root.children].forEach((k, i) => {
      if (eligible(k) && !k.querySelector('.m-r, .m-h')) mark(k, Math.min(i, 4) * 60, 'm-r');
    });
  });
}

function startReveals() {
  started_reveals = true;
  scan();
  check();
  let raf = 0;
  const onScroll = () => raf || (raf = requestAnimationFrame(() => ((raf = 0), check())));
  // Capture catches inner scroll panels (portal, admin, drawers) as well as the page.
  document.addEventListener('scroll', onScroll, { capture: true, passive: true });
  addEventListener('resize', onScroll);
  // Layout also moves without scrolling (fonts, images, tabs): re-check while anything waits.
  setInterval(() => pending.size && check(), 500);
  // Screens render tabs, filters and drawers on demand: animate what they add.
  let t = 0;
  new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(() => {
      scan();
      check();
    }, 60);
  }).observe(document.body, { childList: true, subtree: true });
}

/* ---------- Count-ups ---------- */

const COUNT_ROOTS = '[data-screen-label="Metrics"]';

function countUp(el) {
  if (!el.closest(COUNT_ROOTS)) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.nodeValue.trim();
    const m = /^(\d{1,3}(?:,\d{3})*|\d+)(\+?)$/.exec(text);
    if (!m) continue;
    const target = Number(m[1].replace(/,/g, ''));
    if (target < 10) continue;
    const node = n, suffix = m[2], comma = m[1].includes(','), t0 = performance.now(), dur = 1400;
    const fmt = (v) => (comma ? v.toLocaleString('en-US') : String(v)) + suffix;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      node.nodeValue = fmt(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(step);
      else node.nodeValue = text;
    };
    requestAnimationFrame(step);
  }
}

/* ---------- Scroll progress ---------- */

function startProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', () => raf || (raf = requestAnimationFrame(update)), { passive: true });
  addEventListener('resize', update);
  update();
}

/* ---------- Boot ---------- */

let started = false;

/** Called once per page load from the root layout. */
export function initMotion() {
  if (started) return;
  started = true;
  if (reducedMotion()) {
    document.documentElement.classList.add('m-off');
    revealPage();
    return;
  }
  document.documentElement.classList.add('m-on');
  interceptLinks();
  startProgress();

  // Lift the curtain once the screen has rendered (or after a short cap on slow loads).
  // The brand curtain lingers on the first page of a visit, and only briefly after that.
  let first = true;
  try {
    first = !sessionStorage.getItem('ise-visited');
    sessionStorage.setItem('ise-visited', '1');
  } catch {}
  const minShow = first ? 700 : 150;
  const t0 = performance.now();
  // Reveals start as the curtain slides away, so the first screen animates in view.
  const lift = () =>
    setTimeout(() => {
      revealPage();
      startReveals();
    }, Math.max(0, minShow - (performance.now() - t0)));
  const ready = () => document.querySelector('#dc-root .sc-host');
  if (ready()) lift();
  else {
    const iv = setInterval(() => {
      if (ready() || performance.now() - t0 > 2500) {
        clearInterval(iv);
        lift();
      }
    }, 40);
  }
}
