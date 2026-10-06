// Live website data. The public pages are built from window.ISE (src/data/ise.js, bundled so
// pages render instantly and offline). This replaces its lists with the catalogue the Super
// Admin edits, adds exhibitors and products that are listed on the website, and keeps them up
// to date while the page is open. Screens re-render on the 'ise:update' event (Screen.tsx).
import { restSelect } from './client';
import { publicUrl } from './storage';

const CACHE = 'ise-live-v1';
const LISTS = ['clusters', 'exhibitors', 'products', 'speakers', 'sessions', 'states', 'countries', 'startups', 'matches'];
let base = null;

function original() {
  if (!base && window.ISE) {
    const I = window.ISE;
    base = { Z: I.Z, zones: I.zones, stages: I.stages };
    for (const k of LISTS) base[k] = I[k];
  }
  return base;
}

function clusterFor(stall, zone, clusters) {
  const seg = /^[A-D]-([A-Z0-9]{3})/.exec(stall || '')?.[1];
  if (seg && clusters.some((c) => c.id === seg)) return seg;
  return clusters.find((c) => c.zone === zone && c.kind === 'stalls')?.id || clusters.find((c) => c.zone === zone)?.id || clusters[0]?.id;
}

function build({ rows, exhibitors, products }) {
  const b = original();
  const by = (c) => rows.filter((r) => r.collection === c).sort((x, y) => x.sort - y.sort || (x.id < y.id ? -1 : 1)).map((r) => r.data);
  const pick = (c) => {
    const l = by(c);
    return l.length ? l : b[c];
  };
  const out = {};
  for (const k of LISTS) out[k] = pick(k);
  const zones = by('zones').filter((z) => z && /^[A-D]$/.test(z.id));
  // Every page expects all four zones; a missing one keeps its built-in text.
  const Z = { ...b.Z };
  for (const z of zones) Z[z.id] = { ...b.Z[z.id], ...z };
  out.Z = Z;
  out.zones = ['A', 'B', 'C', 'D'].map((id) => Z[id]);
  const st = by('stages').map((s) => s.name).filter(Boolean);
  out.stages = st.length ? st : b.stages;

  // Registered exhibitors the organisers have listed, with their listed products.
  const byEx = new Map();
  for (const p of products) {
    const ex = exhibitors.find((e) => e.id === p.exhibitor_id);
    if (!ex) continue;
    if (!byEx.has(ex.id)) byEx.set(ex.id, []);
    byEx.get(ex.id).push(p);
  }
  const live = exhibitors.map((e) => ({
    id: 'x' + e.id.slice(0, 8),
    name: e.company,
    city: [e.city, e.country].filter(Boolean).join(', '),
    country: e.country || '',
    sector: e.sector || '',
    stall: e.stall_code || 'To be allocated',
    zone: e.zone || 'B',
    cluster: clusterFor(e.stall_code, e.zone || 'B', out.clusters),
    type: e.type || '',
    products: (byEx.get(e.id) || []).map((p) => p.name).slice(0, 6).concat(byEx.has(e.id) ? [] : [e.sector || 'Products']),
    seeking: e.looking_for || '',
    sport: e.sector || '',
    booth: (e.stall_product || 'Standard Booth').replace(/\s*\(.*\)$/, ''),
    logoUrl: e.logo_path ? publicUrl('exhibitors', e.logo_path) : '',
    website: e.website || '',
    about: e.description || '',
    registered: true,
  }));
  const liveProducts = products
    .map((p) => {
      const ex = exhibitors.find((e) => e.id === p.exhibitor_id);
      return ex && { name: p.name, by: ex.company, stall: ex.stall_code || 'To be allocated', cat: p.category || '', type: p.type || '', moq: p.moq || '', tag: p.tag || '', img: p.image_path ? publicUrl('exhibitors', p.image_path) : '', registered: true };
    })
    .filter(Boolean);
  out.exhibitors = [...live, ...out.exhibitors];
  out.products = [...liveProducts, ...out.products];
  return out;
}

function apply(data) {
  const I = window.ISE;
  if (!I) return;
  Object.assign(I, data);
  window.dispatchEvent(new Event('ise:update'));
}

async function fetchAll() {
  const [rows, exhibitors, products] = await Promise.all([
    restSelect('catalog', 'select=collection,id,data,sort&active=eq.true&order=sort.asc'),
    restSelect('exhibitors', 'select=id,company,city,country,sector,type,zone,stall_code,stall_product,looking_for,description,logo_path,website&listed=eq.true&status=eq.active&order=created_at.asc'),
    restSelect('products', 'select=exhibitor_id,name,category,type,moq,tag,image_path,sort&listed=eq.true&order=sort.asc'),
  ]);
  return { rows, exhibitors, products };
}

let started = false;
let refreshing = null;

export async function refreshLive() {
  refreshing ??= fetchAll()
    .then((raw) => {
      try {
        localStorage.setItem(CACHE, JSON.stringify(raw));
      } catch {}
      apply(build(raw));
    })
    .catch(() => {})
    .finally(() => (refreshing = null));
  return refreshing;
}

/** Applies the last known live data at once, then fetches the current data. */
export function startLive() {
  if (started || typeof window === 'undefined' || !window.ISE) return;
  started = true;
  original();
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE) || 'null');
    if (cached?.rows) Object.assign(window.ISE, build(cached));
  } catch {}
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
  idle(() => refreshLive(), { timeout: 2000 });
}
