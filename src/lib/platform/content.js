// Page edits made by the organisers ("Edit this page", src/lib/platform/editor.js): replaced
// texts, pictures, videos and links, and hidden elements, stored per page in the `content`
// table and applied here for every visitor. An element is found by a path from its nearest
// section (id or data-screen-label), and only changed while it still shows what it showed when
// it was edited, so a redesigned page never gets an edit meant for something else.
import { BASE } from '@/lib/base';
import { restSelect } from './client';

const CACHE = 'ise-content-v1:';
let rows = [];
let observer = null;
let queued = false;

export function pageKey() {
  const p = location.pathname.slice(BASE.length).replace(/\/+$/, '');
  return p || '/';
}

function root() {
  return document.querySelector('#dc-root > .sc-host') || document.getElementById('dc-root');
}

function anchorOf(el) {
  const r = root();
  for (let a = el; a && a !== r; a = a.parentElement) {
    if (a.id && a.id !== 'dc-root' && !/^f-/.test(a.id)) return a;
    if (a.dataset?.screenLabel) return a;
  }
  return r;
}
function anchorSel(a) {
  if (a === root()) return '';
  if (a.id) return '#' + a.id;
  return '[' + a.dataset.screenLabel + ']';
}

/** Stable key for an element: '<anchor>|i/j/k'. */
export function keyFor(el) {
  const a = anchorOf(el);
  const path = [];
  for (let n = el; n && n !== a; n = n.parentElement) path.unshift(Array.prototype.indexOf.call(n.parentElement.children, n));
  return anchorSel(a) + '|' + path.join('/');
}

export function findByKey(key) {
  const [sel, path] = key.split('|');
  const r = root();
  if (!r) return null;
  let a = r;
  if (sel.startsWith('#')) a = document.getElementById(sel.slice(1));
  else if (sel.startsWith('[')) a = r.querySelector(`[data-screen-label="${CSS.escape(sel.slice(1, -1))}"]`);
  if (!a) return null;
  let el = a;
  for (const i of path ? path.split('/') : []) {
    el = el?.children[+i];
    if (!el) return null;
  }
  return el;
}

export const textOf = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();
const bgOf = (el) => /url\(["']?([^"')]+)/.exec(el.style.backgroundImage || '')?.[1] || '';

function original(el, kind) {
  const d = el.dataset;
  if (d.pfOrig === undefined) {
    d.pfOrig =
      kind === 'text' ? textOf(el) : kind === 'image' ? el.getAttribute('src') || '' : kind === 'video' ? el.getAttribute('src') || el.querySelector('source')?.getAttribute('src') || '' : kind === 'bg' ? bgOf(el) : kind === 'link' ? el.getAttribute('href') || '' : '';
  }
  return d.pfOrig;
}

export function applyOne(row) {
  const el = findByKey(row.key);
  if (!el) return false;
  const v = row.value || {};
  const kind = row.kind;
  const orig = original(el, kind === 'hide' ? 'none' : kind);
  if (v.orig !== undefined && kind !== 'hide' && orig !== v.orig) return false;
  if (kind === 'text') {
    if (textOf(el) !== v.text) el.textContent = v.text;
  } else if (kind === 'image') {
    if (el.getAttribute('src') !== v.src) {
      el.removeAttribute('srcset');
      el.src = v.src;
    }
  } else if (kind === 'video') {
    const s = el.querySelector('source');
    if (s) s.remove();
    if (el.getAttribute('src') !== v.src) {
      el.src = v.src;
      el.load?.();
    }
  } else if (kind === 'bg') {
    if (bgOf(el) !== v.src) el.style.backgroundImage = `url("${v.src}")`;
  } else if (kind === 'link') {
    if (v.href) el.setAttribute('href', v.href);
    if (v.text && textOf(el) !== v.text) el.textContent = v.text;
    if (v.newTab) el.target = '_blank';
  } else if (kind === 'hide') {
    if (el.dataset.pfDisplay === undefined) el.dataset.pfDisplay = el.style.display || '';
    if (el.style.display !== 'none') el.style.display = 'none';
  }
  el.dataset.pfApplied = JSON.stringify(v) + kind;
  return true;
}

/** Puts an element back the way the page drew it (after an edit is undone). */
export function restore(row) {
  const el = findByKey(row.key);
  if (!el || el.dataset.pfOrig === undefined) {
    if (el && row.kind === 'hide') el.style.display = el.dataset.pfDisplay || '';
    return;
  }
  const o = el.dataset.pfOrig;
  if (row.kind === 'text') el.textContent = o;
  else if (row.kind === 'image') el.src = o;
  else if (row.kind === 'video') (el.src = o), el.load?.();
  else if (row.kind === 'bg') el.style.backgroundImage = o ? `url("${o}")` : '';
  else if (row.kind === 'link') el.setAttribute('href', o);
  else if (row.kind === 'hide') el.style.display = el.dataset.pfDisplay || '';
  delete el.dataset.pfApplied;
}

function applyAll() {
  queued = false;
  for (const r of rows) applyOne(r);
}
function schedule() {
  if (queued || !rows.length) return;
  queued = true;
  requestAnimationFrame(applyAll);
}

export function setRows(next) {
  const gone = rows.filter((r) => !next.some((n) => n.key === r.key && n.kind === r.kind));
  gone.forEach(restore);
  rows = next;
  try {
    localStorage.setItem(CACHE + pageKey(), JSON.stringify(rows));
  } catch {}
  schedule();
}
export const currentRows = () => rows;

export async function refreshContent() {
  try {
    const data = await restSelect('content', 'select=key,kind,value&page=eq.' + encodeURIComponent(pageKey()));
    setRows(data);
  } catch {}
}

export function startContent() {
  try {
    rows = JSON.parse(localStorage.getItem(CACHE + pageKey()) || '[]');
  } catch {
    rows = [];
  }
  const r = document.getElementById('dc-root');
  if (r && !observer) {
    observer = new MutationObserver(schedule);
    observer.observe(r, { childList: true, subtree: true });
  }
  schedule();
  refreshContent();
}
