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
      // A cell drawn only by absolutely placed layers (a map, a globe) has no height of its own
      // once it gets a row to itself: give it one, so its overlays don't spill onto its neighbours.
      if (k === 1)
        for (const kid of el.children)
          if (kid.offsetHeight < 40 && getComputedStyle(kid).position === 'relative' && [...kid.children].some((g) => getComputedStyle(g).position === 'absolute'))
            (kid.style.minHeight = '360px'), (kid.style.minHeight = 'min(100vw, 440px)');
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
