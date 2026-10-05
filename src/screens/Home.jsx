'use client';
// Generated from design/site/Home.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import { isLite } from '@/lib/device';
import DemoVideo from '@/components/DemoVideo';
import { VenueMap } from '@/components/GettingThereMap';
import FoldWord from '@/components/anim/FoldWord';
import SportsTicker from '@/components/anim/SportsTicker';
import LockKeyLink from '@/components/anim/LockKeyLink';
import IntentBoxes from '@/components/home/IntentBoxes';
import HeroTitle from '@/components/home/HeroTitle';
import BoothStrip from '@/components/home/BoothStrip';
import WatchShuffle from '@/components/home/WatchShuffle';
import ProductShuffle from '@/components/home/ProductShuffle';
import ZoneTower from '@/components/home/ZoneTower';
import HallBook from '@/components/home/HallBook';
import '@/data/ise';
import HomeJourney from '@/components/home/HomeJourney';
import { framesMode } from '@/components/home/JourneyFrames';
import { camAt } from '@/lib/journey-camera.mjs';
import JOURNEY from '@/data/journey.json';

/* global maplibregl */
class Component extends DCLogic {
  state = { day: 2, zone: null, sel: null, searchOpen: false, q: 'football', gq: '', gmsgs: [{ me: false, text: 'Namaste. I am Bucky, your guide to India Sports Expo 2027 in Hall 2, Yashobhoomi. What are you looking for?' }], gbusy: false };
  guideLogRef = React.createRef();
  guideLocal(q) {
    const D = window.ISE; const t = q.toLowerCase(); if (!D) return null;
    const ex = D.exhibitors.find(e => t.includes(e.name.toLowerCase().split(' ')[0]) || t.includes(e.stall.toLowerCase()));
    if (ex) return { text: `${ex.name} is at stall ${ex.stall}, Zone ${ex.zone} (${D.cl(ex.cluster).name}). From the Main Entrance, follow the Sports Boulevard into Zone ${ex.zone}. About 4 minutes on foot. They make ${ex.products.slice(0, 3).join(', ')} and are looking for ${ex.seeking}.`, links: [{ t: 'NAVIGATE', href: withBase('/explore') }, { t: 'BOOK MEETING', href: withBase('/connect#meetings') }] };
    if (/live|now|watch|stream/.test(t)) { const s = D.sessions.find(x => x.status === 'live'); return { text: `Live now in the ${s.stage}: “${s.title}”, ${s.time}–${s.end}. Up next: ${D.sessions.filter(x => x.day === 2 && x.status === 'upcoming').slice(0, 2).map(x => x.time + ' ' + x.title).join('; ')}.`, links: [{ t: 'WATCH LIVE', href: withBase('/programme#watch') }] }; }
    if (/register|pass|ticket|badge|accredit/.test(t)) return { text: 'Register once as a visitor, buyer, investor, media or another participant type. After verification and approval you receive accreditation and a digital pass with a QR code, on the web and in the app.', links: [{ t: 'REGISTER', href: withBase('/attend#register') }] };
    if (/stall|booth|exhibit|space|pavilion/.test(t)) return { text: 'Seven exhibition products, from a Standard Booth (3 × 3 m, sample) to a Hero Experience (500+ m², sample). Choose a product, then pick an available stall on the live Hall 2 inventory.', links: [{ t: 'EXHIBITION PRODUCTS', href: withBase('/exhibit#products') }, { t: 'AVAILABLE STALLS', href: withBase('/exhibit#inventory') }] };
    if (/metro|airport|get there|reach|parking|hotel|travel/.test(t)) return { text: 'Yashobhoomi is in Dwarka Sector 25, New Delhi. The Airport Express metro line serves the venue; by car from IGI Airport is roughly 20–30 minutes (sample estimate). Shuttles run from partner hotels.', links: [{ t: 'GETTING THERE', href: withBase('/explore#getting-there') }] };
    if (/buyer|match|meet|distribut|invest/.test(t)) return { text: 'The India Sports Business Exchange in Zone D matches exhibitors, buyers, investors and distributors, then books a table, a time and a reminder. Top sample match: Global Sports Retail GmbH, 94%.', links: [{ t: 'FIND MATCHES', href: withBase('/connect') }] };
    const z = D.zones.find(z => t.includes(z.short.toLowerCase()) || t.includes('zone ' + z.id.toLowerCase()));
    if (z) return { text: `Zone ${z.id} · ${z.name}: ${z.blurb} Clusters: ${D.clusters.filter(c => c.zone === z.id).map(c => c.name).join(', ')}.`, links: [{ t: 'EXPLORE ZONE ' + z.id, href: withBase('/zones') }] };
    return null;
  }
  async guideAsk(q) {
    q = (q || '').trim(); if (!q || this.state.gbusy) return;
    const msgs = [...this.state.gmsgs, { me: true, text: q }];
    this.setState({ gmsgs: msgs, gq: '', gbusy: true }, () => this.guideScroll());
    const local = this.guideLocal(q);
    let reply = local;
    if (!local && window.claude && window.claude.complete) {
      try {
        const D = window.ISE;
        const ctx = JSON.stringify({ zones: D.zones.map(z => ({ id: z.id, name: z.name })), clusters: D.clusters.map(c => c.id + ' ' + c.name + ' (Zone ' + c.zone + ')'), exhibitors: D.exhibitors.map(e => e.name + ' · ' + e.stall + ' · ' + e.sector), sessions: D.sessions.map(s => 'Day ' + s.day + ' ' + s.time + ' ' + s.title + ' @ ' + s.stage) });
        const text = await window.claude.complete(`You are Bucky, the concise expo guide for India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi, New Delhi. Answer in at most 3 short sentences, plain text, no markdown. Only use this demo data; if unsure, say so and suggest the helpdesk. Data: ${ctx}\n\nVisitor: ${q}`);
        reply = { text: text.trim(), links: [] };
      } catch (e) { reply = null; }
    }
    if (!reply) reply = { text: 'I can help with exhibitors, stalls, sessions, live streams, registration, meetings and getting to Yashobhoomi. Try “Where is Apex Sports?”', links: [] };
    this.setState({ gmsgs: [...msgs, { me: false, ...reply }], gbusy: false }, () => this.guideScroll());
  }
  guideScroll() { const el = this.guideLogRef.current; if (el) el.scrollTop = el.scrollHeight; }
  journeyRef = React.createRef(); mapRef = React.createRef(); afterRef = React.createRef();
  KF = JOURNEY.keyframes;
  STAGES = [
    { at: 0, label: 'EARTH', k: '01 / 08', t: 'Earth', d: 'Every sporting economy on the planet, converging on one hall in New Delhi.' },
    { at: 0.1, label: 'ASIA', k: '02 / 08', t: 'Asia', d: 'The fastest-growing region for sport participation, media and manufacturing.' },
    { at: 0.22, label: 'INDIA', k: '03 / 08', t: 'India', d: 'A nation of 1.4 billion building the business of sport.' },
    { at: 0.34, label: 'NEW DELHI', k: '04 / 08', t: 'New Delhi', d: 'The capital. Host city of India Sports Expo 2027.' },
    { at: 0.45, label: 'DWARKA', k: '05 / 08', t: 'Dwarka', d: 'Sector 25, minutes from Indira Gandhi International Airport.' },
    { at: 0.55, label: 'YASHOBHOOMI', k: '06 / 08', t: 'Yashobhoomi', d: 'India International Convention & Expo Centre. Home of India Sports Expo 2027.' },
    { at: 0.62, label: 'HALL 2', k: '07 / 08', t: 'Exhibition Hall 2', d: 'Step inside the venue. One continuous exhibition floor, tied together by the Sports Boulevard.' },
    { at: 0.74, label: 'FOUR ZONES', k: '08 / 08', t: 'Four event zones', d: '' }
  ];
  componentDidMount() {
    this.reduced = this.props.journey === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._onScroll = () => { if (this._raf) return; this._raf = requestAnimationFrame(() => { this._raf = null; this.tick(); }); };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    // Phones, tablets and older browsers get the still-frame journey (JourneyFrames) and never
    // download the map library; everything else loads it here and flies the live globe.
    this.frames = framesMode();
    if (this.frames || this.reduced) return;
    import('@/lib/maplibre');
    // The globe is built in the browser's first idle moment, after the page's own start-up work.
    this._init = setInterval(() => { if (window.maplibregl && window.ISE && this.mapRef.current) { clearInterval(this._init); const idle = window.requestIdleCallback || (cb => setTimeout(cb, 50)); idle(() => { if (this._unmounted) return; this.initMap(); this.journeyStore.notify(); }, { timeout: 800 }); } }, 100);
  }
  componentWillUnmount() { this._unmounted = true; window.removeEventListener('scroll', this._onScroll); clearInterval(this._init); cancelAnimationFrame(this._camRaf); this.map && this.map.remove(); this.map = null; }
  initMap() {
    try {
      this.map = new maplibregl.Map({
        container: this.mapRef.current, interactive: false, attributionControl: { compact: true },
        // Smoother globe while scrolling: keep loading tiles mid-zoom, keep more of them,
        // cap the render resolution on high-density screens and skip wrapped world copies.
        cancelPendingTileRequestsWhileZooming: false, maxTileCacheSize: 300, pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        renderWorldCopies: false, fadeDuration: 0,
        style: { version: 8, projection: { type: 'globe' },
          sources: { sat: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: 'Esri, Maxar, Earthstar Geographics' } },
          layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#000' } }, { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-fade-duration': 160 } }],
          sky: { 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 8, 0] } },
        center: [55, 18], zoom: 0.9
      });
      this.map.on('load', () => { this._cam = undefined; this.tick(); });
    } catch (e) { this.map = null; }
  }
  progress() {
    const el = this.journeyRef.current; if (!el) return 0;
    const r = el.getBoundingClientRect(); const span = r.height - (window.innerHeight - 60);
    return Math.max(0, Math.min(1, (60 - r.top) / span));
  }
  // Journey progress lives in a small store so scrolling re-renders only the journey
  // (src/components/home/HomeJourney.jsx), not the whole page.
  journeyStore = (() => {
    let version = 0; const subs = new Set();
    const bump = () => { version++; subs.forEach(f => f()); };
    return {
      p: 0,
      get: () => version,
      subscribe: f => { subs.add(f); return () => subs.delete(f); },
      set(p) { if (p !== this.p && (Math.abs(p - this.p) > 0.002 || p === 0 || p === 1)) { this.p = p; bump(); } },
      notify: bump
    };
  })();
  getP = () => this.progress();
  tick() {
    const p = this.progress();
    // The globe has faded out by framesUntil (the venue and zone cards take over), so the camera
    // stops there: it used to keep flying, redrawing the hidden globe under the zone cards.
    const cam = Math.min(p, JOURNEY.framesUntil);
    this._target = cam;
    // Only move the camera when the journey position changed: above or below the journey every
    // scroll frame would otherwise redraw the globe for nothing.
    if (this.map && !this._camRaf && this._cam !== cam) this._camRaf = requestAnimationFrame(this.camStep);
    this.journeyStore.set(p);
  }
  // The globe camera eases toward the scroll position instead of jumping with every
  // scroll event, so wheel steps and touch flicks turn into one continuous glide.
  camStep = () => {
    this._camRaf = null;
    if (!this.map) return;
    const target = this._target ?? 0;
    const cur = this._cam ?? target;
    const d = target - cur;
    const next = Math.abs(d) < 0.0004 ? target : cur + d * 0.18;
    if (next === this._cam) return;
    this._cam = next;
    this.placeCamera(next);
    if (next !== target) this._camRaf = requestAnimationFrame(this.camStep);
  };
  placeCamera(p) {
    const c = camAt(this.KF, p);
    this.map.jumpTo({ center: [c.lon, c.lat], zoom: c.z, pitch: c.pitch, bearing: c.b });
  }
  scrollToP(p) {
    const el = this.journeyRef.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60; const span = el.offsetHeight - (window.innerHeight - 60);
    window.scrollTo({ top: top + span * p, behavior: this.reduced ? 'auto' : 'smooth' });
  }
  journeyVals(p) {
    const D = window.ISE;
    const reduced = this.reduced || this.props.journey === 'reduced';
    const ramp = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
    const stage = [...this.STAGES].reverse().find(s => p >= s.at) || this.STAGES[0];
    const zoneOrder = ['A', 'B', 'C', 'D']; const zoneAt = [0.8, 0.84, 0.88, 0.92];
    const lit = reduced ? zoneOrder : zoneOrder.filter((z, i) => p >= zoneAt[i]);
    const lastLit = lit.length ? lit[lit.length - 1] : null;
    let stageText = stage.d, stageTitle = stage.t;
    if (stage.label === 'FOUR ZONES' && D && lastLit && !reduced) { stageTitle = 'Zone ' + lastLit; stageText = D.Z[lastLit].name; }
    // The venue scene and the zone finale sit on a dark background, so captions stay light.
    const planOpacity = 0;
    const captionOpacity = reduced ? 0 : 1 - ramp(0.7, 0.74);
    // The still-frame journey has no map to ask, so its readout follows the camera path.
    const cam = this.map ? null : camAt(this.KF, Math.min(p, JOURNEY.framesUntil));
    const curCenter = this.map ? this.map.getCenter() : { lat: cam.lat, lng: cam.lon };
    const z = this.map ? this.map.getZoom() : cam.z;
    const alt = Math.round(40000000 / Math.pow(2, z));
    const crumbs = this.STAGES.map((s, i) => {
      const on = s === stage; const past = p >= s.at;
      return { label: s.label, go: () => this.scrollToP(s.at + 0.02), bar: on ? '36px' : '14px', color: planOpacity > 0.5 ? (on ? '#0E0E0F' : past ? '#3A3A3E' : '#A29E95') : (on ? '#F07C12' : past ? '#fff' : '#6B6A66') };
    });
    return {
      journeyRef: this.journeyRef, mapRef: this.mapRef, getP: this.getP, skip: this.skipIntro,
      journeyHeight: reduced ? '100vh' : '900vh',
      mapOpacity: reduced ? 0 : 1 - ramp(0.6, 0.66),
      arrivalScrim: reduced ? 0 : Math.min(0.35, ramp(0.56, 0.6) * 0.35),
      showPin: !reduced && p > 0.5 && p < 0.62, pinOpacity: Math.min(ramp(0.5, 0.55), 1 - ramp(0.58, 0.61)),
      journeyP: p, journeyReduced: reduced, captionOpacity, readoutOpacity: reduced ? 0 : 1 - ramp(0.58, 0.62),
      crumbs, stageKicker: stage.k + (stage.label === 'YASHOBHOOMI' ? ' · NEW DELHI' : ''), stageTitle, stageText,
      captionColor: planOpacity > 0.5 ? '#0E0E0F' : '#fff',
      coordText: `${curCenter.lat.toFixed(4)}° N · ${curCenter.lng.toFixed(4)}° E`, altText: alt > 1000 ? Math.round(alt / 1000).toLocaleString() + ' KM' : alt + ' M'
    };
  }
  skipIntro = () => { const el = this.afterRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60 }); };
  renderVals() {
    const D = window.ISE; const live = !!this.props.liveMode;
    const base = {
      afterRef: this.afterRef, live,
      journeyStore: this.journeyStore, journeyVals: p => this.journeyVals(p),
      enter: () => this.scrollToP(0.01), skip: this.skipIntro,
      openSearch: () => this.setState({ searchOpen: true }), closeSearch: () => this.setState({ searchOpen: false }), stop: e => e.stopPropagation(),
      q: this.state.q, setQ: e => this.setState({ q: e.target.value }), searchOpen: this.state.searchOpen,
      guideLogRef: this.guideLogRef, guideQ: this.state.gq, guideSetQ: e => this.setState({ gq: e.target.value }), guideBusy: this.state.gbusy,
      guideSubmit: e => { e.preventDefault(); this.guideAsk(this.state.gq); },
      guideSuggest: ['Where is Apex Sports?', 'What is live now?', 'How do I book a stall?', 'How do I get there by metro?', 'Find me buyers'].map(t => ({ t, ask: () => this.guideAsk(t) })),
      guideMsgs: this.state.gmsgs.map(m => ({ ...m, who: m.me ? 'YOU' : 'BUCKY', who_c: m.me ? '#8A877F' : '#F07C12', align: m.me ? 'flex-end' : 'flex-start', bg: m.me ? '#fff' : 'transparent', fg: m.me ? '#0E0E0F' : '#fff', pad: m.me ? '10px 14px' : '0', links: m.links || [], hasLinks: !!(m.links && m.links.length) }))
    };
    if (!D) return { ...base, intents: [], metrics: [], worlds: [], arch: [], featured: [], prods: [], matchPreview: [], stake: [], dayTabs: [], daySessions: [], videos: [], travel: [], zoneTabs: [], panel: { rows: [] }, upNext: [], results: [] };
    const zc = id => D.Z[id].color;
    const zoneHref = { A: withBase('/zones#zone-a'), B: withBase('/zones#zone-b'), C: withBase('/zones#zone-c'), D: withBase('/zones#zone-d') };
    const selZone = this.state.zone || 'B';
    const selC = this.state.sel ? D.cl(this.state.sel) : null;
    const panelZ = D.Z[selC ? selC.zone : selZone];
    const spk = s => s.speakers.map(id => D.sp(id).name).join(' · ');
    const q = this.state.q.trim().toLowerCase();
    const m = t => t && t.toLowerCase().includes(q);
    const groups = q.length < 2 ? [] : [
      { label: 'EXHIBITORS', items: D.exhibitors.filter(e => m(e.name) || m(e.sector) || m(e.sport) || m(e.stall) || m(e.country)).map(e => ({ t: e.name, s: e.city, m: e.stall, href: withBase('/exhibit') })) },
      { label: 'PRODUCTS', items: D.products.filter(x => m(x.name) || m(x.cat) || m(x.by)).map(x => ({ t: x.name, s: x.by, m: x.stall, href: withBase('/exhibit') })) },
      { label: 'SESSIONS', items: D.sessions.filter(s => m(s.title) || m(s.topic) || m(spk(s))).map(s => ({ t: s.title, s: s.stage, m: 'DAY ' + s.day + ' · ' + s.time, href: withBase('/programme') })) },
      { label: 'EXPERIENCES', items: [{ t: 'Football Reaction Challenge', s: 'Try Sport Arena', m: 'C-TSA' }, { t: 'Sprint Timing Experience', s: 'Try Sport Arena', m: 'C-TSA' }, { t: 'Archery Experience', s: 'Try Sport Arena', m: 'C-TSA' }].filter(x => m(x.t)).map(x => ({ ...x, href: withBase('/zones#zone-c') })) },
      { label: 'FEDERATIONS', items: ['Football', 'Hockey', 'Athletics', 'Archery', 'Badminton', 'Boxing'].filter(x => m(x)).map(x => ({ t: x + ' Federation (sample)', s: 'Federations & Institutions', m: 'A-FED', href: withBase('/zones#zone-a') })) },
      { label: 'STARTUPS', items: D.startups.filter(s => m(s.name) || m(s.sport) || m(s.tech)).map(s => ({ t: s.name, s: s.tech + ' · ' + s.sport, m: s.stall, href: withBase('/zones#zone-c') })) }
    ].filter(g => g.items.length).map(g => ({ ...g, count: g.items.length }));
    return {
      ...base,
      results: groups, noResults: q.length >= 2 && !groups.length,
      intents: [
        { n: '01', t: 'Explore', s: 'Discover the venue', href: withBase('/explore') },
        { n: '02', t: 'Exhibit', s: 'Build your presence', href: withBase('/exhibit') },
        { n: '03', t: 'Attend', s: 'Experience the Expo', href: withBase('/attend') },
        { n: '04', t: 'Connect', s: 'Do business', href: withBase('/connect') },
        { n: '05', t: 'Watch', s: 'Live & on demand', href: withBase('/programme') }
      ],
      metrics: [
        { v: '4', l: 'Event zones in Hall 2', src: 'HALL 2 LAYOUT' }, { v: '213', l: 'Exhibition stalls', src: 'HALL 2 LAYOUT LEGEND' },
        { v: '25', l: 'Pavilions', src: 'HALL 2 LAYOUT LEGEND' }, { v: '324', l: 'Innovation Arena seats', src: 'HALL 2 LAYOUT' },
        { v: '40+', l: 'Countries', src: 'DEMO TARGET' }, { v: '3,000', l: 'B2B meetings', src: 'DEMO TARGET' }
      ],
      zoneTabs: D.zones.map(z => ({ id: z.id, color: z.color, bg: panelZ.id === z.id ? z.color : '#fff', fg: panelZ.id === z.id ? '#fff' : z.color, pick: () => this.setState({ zone: z.id, sel: null }) })),
      hoverZone: this.state.sel ? null : (this.state.zone || null), selCluster: this.state.sel,
      pickCluster: c => this.setState({ sel: c.id, zone: c.zone }),
      panel: selC ? { color: panelZ.color, kicker: `ZONE ${panelZ.id} · ${selC.zone}-${selC.id}`, title: selC.name, text: selC.meta + '. ' + panelZ.blurb, rows: D.exhibitors.filter(e => e.cluster === selC.id).map(e => ({ name: e.name, meta: e.stall, pick: () => {} })) }
        : { color: panelZ.color, kicker: `ZONE ${panelZ.id}`, title: panelZ.name, text: panelZ.blurb, rows: D.clusters.filter(c => c.zone === panelZ.id).map(c => ({ name: c.name, meta: c.meta, pick: () => this.setState({ sel: c.id }) })) },
      worlds: D.zones.map(z => ({ ...z, href: zoneHref[z.id], items: D.clusters.filter(c => c.zone === z.id).slice(0, 6).map(c => ({ name: c.name, meta: c.meta })) })),
      arch: this.ARCH.map(a => ({ ...a })),
      featured: D.exhibitors.slice(0, 1).concat(D.exhibitors.filter(e => ['turf', 'motion', 'velocity', 'hayate'].includes(e.id))).map(e => ({ ...e, zc: zc(e.zone) })),
      prods: D.products.map((x, i) => ({ ...x, slot: i < 4 ? 'home-prod-' + i : 'prod-detail-' + i })),
      matchPreview: D.matches.slice(0, 3),
      stake: [{ t: 'Athlete', d: 'AI coaching · wearables · performance analytics' }, { t: 'Coach', d: 'Video analysis · tactical systems · data' }, { t: 'Venue', d: 'IoT · smart stadium · security · operations' }, { t: 'Event', d: 'Registration · accreditation · workforce' }, { t: 'Broadcast', d: 'AI production · streaming · graphics' }, { t: 'Fan', d: 'AR / VR · gamification · engagement' }],
      dayTabs: [1, 2, 3].map(d => ({ label: 'DAY ' + d, bg: this.state.day === d ? '#0E0E0F' : 'transparent', fg: this.state.day === d ? '#fff' : '#0E0E0F', pick: () => this.setState({ day: d }) })),
      daySessions: D.sessions.filter(s => s.day === this.state.day).map(s => ({ ...s, spk: spk(s), zc: zc(s.zone) })),
      upNext: D.sessions.filter(s => s.day === 2 && s.status === 'upcoming').slice(0, 4),
      videos: D.sessions.filter(s => s.status !== 'upcoming').sort((a, b) => (b.status === 'live') - (a.status === 'live')).map(s => ({ ...s, spk: spk(s), badge: s.status === 'live' ? '● LIVE' : 'ON DEMAND', badgeBg: s.status === 'live' ? '#9E1B22' : '#0E0E0F' })),
      travel: [
        { mode: 'Metro', how: 'Airport Express Line to Yashobhoomi Dwarka Sector 25 — an underground station inside the venue perimeter.', time: '~21 MIN', src: 'FROM NEW DELHI STN · PMO' },
        { mode: 'Airport', how: 'IGI Terminal 3 → Airport Express Line, southbound to Sector 25.', time: '15 MIN', src: 'SAMPLE · UNVERIFIED' },
        { mode: 'Car / Taxi', how: 'Via Dwarka Expressway / UER-II. Drop-off at the Hall 2 forecourt.', time: '45 MIN', src: 'SAMPLE · FROM CENTRAL DELHI' },
        { mode: 'Shuttle', how: 'Official hotel shuttle loop from Aerocity every 20 minutes.', time: '25 MIN', src: 'SAMPLE · DEMO SERVICE' },
        { mode: 'Parking', how: 'Pre-booked visitor parking with QR entry. Accessible bays at Hall 2.', time: 'P2', src: 'SAMPLE' }
      ]
    };
  }
  ARCH = [
    { name: 'Standard Booth', size: '3 × 3 m · 9 m²', w: 64, d: 34, h: 12 },
    { name: 'Premium Booth', size: '6 × 3 m · 18 m²', w: 78, d: 34, h: 32 },
    { name: 'Raw Space', size: 'from 36 m²', w: 84, d: 40, h: 64 },
    { name: 'Sector Pavilion', size: '100–300+ m²', w: 88, d: 40, h: 96 },
    { name: 'State Pavilion', size: '200–500+ m²', w: 90, d: 40, h: 132 },
    { name: 'Country Pavilion', size: '250–600+ m²', w: 92, d: 40, h: 160 },
    { name: 'Hero Experience', size: '500+ m²', w: 98, d: 44, h: 200 }
  ];
  arch(hi, dark = true) {
    const h = React.createElement; const W = 1000, B = 250, col = W / 7; const stroke = dark ? '#fff' : '#0E0E0F';
    const kids = this.ARCH.map((a, i) => {
      const x = i * col + 6, dx = a.d * 0.7, dy = a.d * 0.32, b = B, t = b - a.h;
      const on = hi === i;
      return h('g', { key: i },
        h('path', { d: `M${x},${t} L${x + dx},${t - dy} L${x + a.w + dx},${t - dy} L${x + a.w},${t} Z`, fill: on ? '#F07C12' : 'none', stroke, strokeWidth: 1.5, strokeLinejoin: 'round' }),
        h('path', { d: `M${x + a.w},${b} L${x + a.w + dx},${b - dy} L${x + a.w + dx},${t - dy} L${x + a.w},${t} Z`, fill: on ? '#C2610B' : 'none', stroke, strokeWidth: 1.5, strokeLinejoin: 'round' }),
        h('rect', { x, y: t, width: a.w, height: a.h, fill: on ? '#F07C12' : 'none', stroke, strokeWidth: 1.5 }));
    });
    return h('svg', { viewBox: `0 -20 ${W} ${B + 24}`, style: { width: '100%', height: 'auto', display: 'block' }, role: 'img', 'aria-label': 'Seven exhibition products of increasing scale' }, ...kids);
  }
}

function render(v) {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: "0", zIndex: "60", background: "#0E0E0F", color: "#fff", display: "flex", alignItems: "center", gap: "28px", padding: "0 28px", height: "60px", borderBottom: "1px solid #2A2A2D" }}>
          <a href={withBase("/")} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#fff" }}>
            <BrandLogo className="site-logo" />
          </a>
          <nav aria-label="Primary" style={{ display: "flex", gap: "22px", flex: "1", minWidth: "0", overflowX: "auto", scrollbarWidth: "none", whiteSpace: "nowrap", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em" }}>
            <a href={withBase("/explore")} style={{ color: "#fff", textDecoration: "none" }}>Explore</a>
            <a href={withBase("/exhibit")} style={{ color: "#fff", textDecoration: "none" }}>Exhibit</a>
            <a href={withBase("/attend")} style={{ color: "#fff", textDecoration: "none" }}>Attend</a>
            <a href={withBase("/connect")} style={{ color: "#fff", textDecoration: "none" }}>Connect</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Programme</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Watch</a>
          </nav>
          <button onClick={v.openSearch} aria-label="Search" style={{ background: "transparent", border: "1px solid #3A3A3E", color: "#BDB9B0", height: "36px", padding: "0 14px", font: "500 13px var(--f-body)", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", whiteSpace: "nowrap" }}>
            ⌕
            <span>Search</span>
          </button>
          <a href={withBase("/attend")} style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            My Expo
          </a>
          <a href={withBase("/attend")} style={{ background: "#F07C12", color: "#0E0E0F", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", height: "36px", display: "flex", alignItems: "center", padding: "0 16px" }}>
            Register
          </a>
        </header>
        {v.live ? (
          <>
            <div style={{ background: "#9E1B22", color: "#fff", display: "flex", alignItems: "center", gap: "18px", padding: "10px 28px", fontSize: "14px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--f-label)", letterSpacing: "0.14em", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", animation: "iseBlink 1.2s infinite" }} />
                DAY 2 — LIVE
              </span>
              <span style={{ opacity: "0.85" }}>Innovation Arena · The Future of AI Coaching</span>
              <a href={withBase("/programme")} style={{ color: "#fff", fontWeight: "700", letterSpacing: "0.08em" }}>Watch →</a>
            </div>
          </>
        ) : null}
        <section data-screen-label="01 Entry" style={{ height: "calc(100vh - 60px)", minHeight: "560px", background: "#0E0E0F", color: "#fff", display: "grid", gridTemplateRows: "1fr auto", padding: "48px 28px 32px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
          {/* Stadium photo behind the headline (public/assets/hero-stadium*.webp). */}
          <div className="hero-photo" aria-hidden="true">
            <img src={withBase(isLite() ? "/assets/hero-stadium-sm.webp" : "/assets/hero-stadium.webp")} alt="" decoding="async" fetchPriority="high" />
          </div>
          <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", gap: "28px", maxWidth: "1400px", position: "relative", zIndex: "1", pointerEvents: "none" }}>
            <HeroTitle />
            <div className="ht-actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap", pointerEvents: "auto" }}>
              <button onClick={v.enter} style={{ background: "#F07C12", color: "#0E0E0F", border: "0", height: "56px", padding: "0 28px", font: "700 15px var(--f-body)", letterSpacing: "0.08em", cursor: "pointer" }}>
                Enter the expo ↓
              </button>
              <button onClick={v.skip} style={{ background: "transparent", color: "#fff", border: "1px solid #55555A", height: "56px", padding: "0 24px", font: "600 14px var(--f-body)", letterSpacing: "0.08em", cursor: "pointer" }}>
                Skip intro
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#8A877F", position: "relative", zIndex: "1", pointerEvents: "none" }}>
            <span>SCROLL TO TRAVEL · EARTH → INDIA → DELHI → YASHOBHOOMI → HALL 2</span>
            <span>28.5549° N · 77.0446° E</span>
          </div>
        </section>
        <SportsTicker />
        <HomeJourney store={v.journeyStore} vals={v.journeyVals} />
        <div ref={v.afterRef} />
        <section data-screen-label="03 Intro" style={{ padding: "120px 28px 80px", maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "60px", alignItems: "end" }}>
          <div>
            <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#6B6A66", marginBottom: "24px" }}>
              EXHIBITION HALL 2 · YASHOBHOOMI · NEW DELHI
            </div>
            <h2 data-anim="" style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(64px,9vw,148px) * 0.72)", lineHeight: "0.84" }}>
              {"The "}
              <FoldWord text="global" delay={100} />
              <br />
              sports economy
              <br />
              <span style={{ color: "#C2610B" }}>
                {"meets "}
                <FoldWord text="India" delay={650} step={90} />.
              </span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "520px" }}>
            <p style={{ margin: "0", fontSize: "20px", lineHeight: "1.5", textWrap: "pretty" }}>
              Three days of exhibition, business matchmaking and programme across four event zones inside Exhibition Hall 2 — from India's sporting heritage to the manufacturers, technologists and investors building what comes next.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <LockKeyLink href={withBase("/exhibit")} style={{ background: "#F07C12", color: "#0E0E0F", textDecoration: "none", height: "52px", display: "flex", alignItems: "center", padding: "0 24px 0 16px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.08em" }}>
                Book a stall
              </LockKeyLink>
              <a href={withBase("/attend")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "52px", display: "flex", alignItems: "center", padding: "0 24px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.08em" }}>
                Register to visit
              </a>
            </div>
          </div>
        </section>
        <section data-screen-label="Intentions" style={{ borderTop: "1px solid #0E0E0F", borderBottom: "1px solid #0E0E0F", background: "#F6F4EF" }}>
          <IntentBoxes items={v.intents} />
        </section>
        {v.live ? (
          <>
            <section data-screen-label="Live now" style={{ background: "#0E0E0F", color: "#fff", padding: "72px 28px" }}>
              <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "40px" }}>
                <div style={{ position: "relative", aspectRatio: "16/9", background: "#1A1A1C", border: "1px solid #2A2A2D", display: "flex", alignItems: "flex-end", padding: "24px", boxSizing: "border-box" }}>
                  <span style={{ position: "absolute", left: "20px", top: "20px", background: "#9E1B22", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", padding: "6px 10px" }}>
                    ● LIVE · INNOVATION ARENA
                  </span>
                  <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-label)", fontSize: "12px", color: "#6B6A66", letterSpacing: "0.14em" }}>
                    STREAM EMBED PLACEHOLDER
                  </span>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "33px", lineHeight: "0.9" }}>The future of AI coaching</div>
                    <div style={{ color: "#BDB9B0", marginTop: "8px" }}>Arjun Mehta · Dr. Meera Raghavan · 1,842 watching (demo)</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#BDB9B0", paddingBottom: "16px", borderBottom: "1px solid #2A2A2D" }}>
                    UP NEXT · DAY 2
                  </div>
                  {list(v.upNext).map((s, $index) => (
                    <Fragment key={$index}>
                      <div style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: "16px", padding: "18px 0", borderBottom: "1px solid #2A2A2D", alignItems: "baseline" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "14px", color: "#F07C12" }}>{txt(s?.time)}</span>
                        <span>
                          <span style={{ display: "block", fontSize: "17px", fontWeight: "600" }}>{txt(s?.title)}</span>
                          <span style={{ fontSize: "13px", color: "#8A877F" }}>{txt(s?.stage)}</span>
                        </span>
                        <a href={withBase("/programme")} style={{ color: "#fff", fontSize: "12px", letterSpacing: "0.1em", fontWeight: "700" }}>Save</a>
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ marginTop: "24px", padding: "16px", border: "1px solid #2A2A2D", fontSize: "14px", color: "#BDB9B0" }}>
                    <b style={{ color: "#fff" }}>ANNOUNCEMENT ·</b>
                    {" Hosted Buyer Lounge opens 15 min early today at 09:15. (demo)"}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
        <section data-screen-label="Metrics" style={{ padding: "96px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em" }}>03 — THE EXPO IN NUMBERS</span>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", background: "#F6F4EF", padding: "6px 10px" }}>
              {"STALL & PAVILION COUNTS FROM HALL 2 LAYOUT · OTHER FIGURES DEMO TARGETS"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", borderTop: "2px solid #0E0E0F" }}>
            {list(v.metrics).map((m, $index) => (
              <Fragment key={$index}>
                <div style={{ padding: "24px 20px 24px 0", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,6vw,96px) * 0.72)", lineHeight: "0.9" }}>{txt(m?.v)}</span>
                  <span style={{ fontSize: "15px", fontWeight: "600" }}>{txt(m?.l)}</span>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(m?.src)}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section data-screen-label="04 Explore Hall 2" style={{ background: "#F6F4EF", padding: "96px 28px", overflow: "hidden" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", marginBottom: "16px" }}>04 — EXPLORE HALL 2</div>
              <h2 style={{ margin: "0 0 28px", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,6vw,96px) * 0.72)", lineHeight: "0.86" }}>
                One hall.
                <br />
                Four event zones.
              </h2>
              <p style={{ margin: "0 0 28px", fontSize: "18px", lineHeight: "1.5", color: "#3A3A3E", maxWidth: "520px" }}>
                Open the zone guide: one spread for each zone, with its plan, every area, its stalls and the exhibitors already allocated. Turn the pages with Next; after Zone D the book closes itself.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href={withBase("/explore")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "48px", display: "flex", alignItems: "center", padding: "0 22px", fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em" }}>
                  Open 3D digital twin →
                </a>
                <a href={withBase("/zones")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "48px", display: "flex", alignItems: "center", padding: "0 22px", fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em" }}>
                  Zone experiences →
                </a>
              </div>
            </div>
            <HallBook />
          </div>
        </section>
        <section data-screen-label="05 Four worlds" className="zt-section">
          <ZoneTower />
        </section>
        <section data-screen-label="06 Product architecture" style={{ background: "#0E0E0F", color: "#fff", padding: "96px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", alignItems: "end", marginBottom: "48px" }}>
              <div>
                <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#BDB9B0", marginBottom: "16px" }}>
                  06 — EXHIBITION PRODUCT ARCHITECTURE
                </div>
                <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,6vw,96px) * 0.72)", lineHeight: "0.86" }}>
                  Build your
                  <br />
                  presence.
                </h2>
              </div>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", border: "1px solid #55555A", padding: "6px 10px", color: "#BDB9B0" }}>
                DEMO / SAMPLE CONFIGURATION
              </span>
            </div>
            <BoothStrip items={v.arch} />
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "32px", color: "#BDB9B0", fontSize: "15px" }}>
              <span style={{ flex: "1", height: "1px", background: "#55555A" }} />
              Increasing scale, visibility and brand expression
              <span style={{ color: "#F07C12" }}>→</span>
            </div>
            <a href={withBase("/exhibit")} style={{ marginTop: "40px", display: "inline-flex", background: "#F07C12", color: "#0E0E0F", textDecoration: "none", height: "52px", alignItems: "center", padding: "0 24px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.08em" }}>
              Compare stall products →
            </a>
          </div>
        </section>
        <section data-screen-label="07 Featured exhibitors" style={{ padding: "96px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              07 — Featured exhibitors
            </h2>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", background: "#F6F4EF", padding: "6px 10px" }}>
              DEMO ENTITIES · NOT CONFIRMED PARTICIPANTS
            </span>
          </div>
          <div style={{ borderTop: "2px solid #0E0E0F" }}>
            {list(v.featured).map((e, $index) => (
              <Fragment key={$index}>
                <div style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) auto", gap: "24px", alignItems: "center", padding: "22px 0", borderBottom: "1px solid #E3E0D8" }}>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={sx(`width:10px;height:10px;background:${e?.zc ?? ""};`)} />
                    {txt(e?.stall)}
                  </span>
                  <span>
                    <span style={{ display: "block", fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "800", fontSize: "23px", lineHeight: "1", textTransform: "uppercase" }}>
                      {txt(e?.name)}
                    </span>
                    <span style={{ fontSize: "14px", color: "#6B6A66" }}>{txt(e?.city)}</span>
                  </span>
                  <span style={{ fontSize: "14px" }}>
                    {txt(e?.sector)}
                    <span style={{ display: "block", color: "#6B6A66", fontSize: "13px" }}>{txt(e?.type)}</span>
                  </span>
                  <span style={{ fontSize: "14px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66", display: "block" }}>LOOKING FOR</span>
                    {txt(e?.seeking)}
                  </span>
                  <span style={{ display: "flex", gap: "8px" }}>
                    <a href={withBase("/exhibit")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", padding: "0 14px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>
                      View
                    </a>
                    <a href={withBase("/connect")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", padding: "0 14px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>
                      Book meeting
                    </a>
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section data-screen-label="08 Featured products" style={{ padding: "0 28px 96px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", marginBottom: "24px" }}>08 — FEATURED PRODUCTS</div>
          <ProductShuffle items={list(v.prods)} />
        </section>
        <section data-screen-label="09 Business exchange" style={{ background: "#141416", color: "#fff", padding: "96px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "56px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#BDB9B0" }}>
                09 — INDIA SPORTS BUSINESS EXCHANGE · ZONE D
              </span>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,6vw,96px) * 0.72)", lineHeight: "0.86" }}>
                Build the
                <br />
                business of sport.
              </h2>
              <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.5", color: "#BDB9B0", maxWidth: "480px" }}>
                Tell us who you are and what you need. The Exchange matches exhibitors, buyers, investors, distributors and government delegations, then books the table.
              </p>
              <a href={withBase("/connect")} style={{ alignSelf: "flex-start", background: "#F07C12", color: "#0E0E0F", textDecoration: "none", height: "52px", display: "flex", alignItems: "center", padding: "0 24px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.08em" }}>
                Find matches →
              </a>
            </div>
            <div style={{ border: "1px solid #3A3A3E" }}>
              {list(v.matchPreview).map((m, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", padding: "22px 24px", borderBottom: "1px solid #3A3A3E" }}>
                    <span>
                      <span style={{ display: "block", fontSize: "18px", fontWeight: "600" }}>{txt(m?.name)}</span>
                      <span style={{ fontSize: "13px", color: "#8A877F" }}>{txt(m?.country)}{" · "}{txt(m?.role)}{" · Looking for "}{txt(m?.seeking)}</span>
                    </span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "33px", lineHeight: "1", color: "#F07C12" }}>
                      {txt(m?.score)}%
                    </span>
                  </div>
                </Fragment>
              ))}
              <div style={{ padding: "14px 24px", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#8A877F" }}>
                SAMPLE MATCHES FOR APEX SPORTS INDIA · DEMO
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="10 SportsTech" style={{ padding: "96px 28px", maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#0A62BF" }}>
              {"10 — SPORTSTECH & INNOVATION · ZONE C"}
            </span>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,6vw,96px) * 0.72)", lineHeight: "0.86" }}>
              Technology
              <br />
              for every
              <br />
              stakeholder.
            </h2>
            <a href={withBase("/zones")} style={{ alignSelf: "flex-start", border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "48px", display: "flex", alignItems: "center", padding: "0 20px", fontWeight: "700", fontSize: "13px", letterSpacing: "0.08em" }}>
              Explore Zone C →
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", borderTop: "1px solid #0E0E0F", borderLeft: "1px solid #0E0E0F" }}>
            {list(v.stake).map((s, $index) => (
              <Fragment key={$index}>
                <div style={{ padding: "20px", borderRight: "1px solid #0E0E0F", borderBottom: "1px solid #0E0E0F", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "25px", lineHeight: "0.9", color: "#0A62BF" }}>
                    {txt(s?.t)}
                  </span>
                  <span style={{ fontSize: "14px", color: "#3A3A3E" }}>{txt(s?.d)}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section data-screen-label="11 Programme" style={{ background: "#F6F4EF", padding: "96px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "24px", marginBottom: "32px" }}>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
                11 — Programme
              </h2>
              <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                {list(v.dayTabs).map((d, $index) => (
                  <Fragment key={$index}>
                    <button role="tab" onClick={d?.pick} style={sx(`height:44px;padding:0 22px;border:0;background:${d?.bg ?? ""};color:${d?.fg ?? ""};font:700 13px var(--f-body);letter-spacing:0.1em;cursor:pointer;`)}>
                      {txt(d?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ borderTop: "2px solid #0E0E0F" }}>
              {list(v.daySessions).map((s, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr) 220px auto", gap: "24px", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #D6D2C8" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "15px" }}>{txt(s?.time)}–{txt(s?.end)}</span>
                    <span>
                      <span style={{ display: "block", fontSize: "20px", fontWeight: "600" }}>{txt(s?.title)}</span>
                      <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(s?.spk)}</span>
                    </span>
                    <span style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={sx(`width:8px;height:8px;background:${s?.zc ?? ""};`)} />
                      {txt(s?.stage)}·{txt(s?.topic)}
                    </span>
                    <a href={withBase("/programme")} style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "#0E0E0F" }}>Add to My Expo</a>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="12 Watch" style={{ padding: "96px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              {"12 — Live & on demand"}
            </h2>
            <a href={withBase("/programme")} style={{ fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em" }}>Watch library →</a>
          </div>
          <WatchShuffle items={v.videos} />
        </section>
        <section data-screen-label="13 Plan your visit" style={{ borderTop: "1px solid #0E0E0F", padding: "96px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em" }}>13 — PLAN YOUR VISIT</span>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,6vw,96px) * 0.72)", lineHeight: "0.86" }}>
                Getting to
                <br />
                Yashobhoomi.
              </h2>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.5", color: "#3A3A3E", maxWidth: "460px" }}>
                Yashobhoomi sits in Sector 25, Dwarka, with its own underground station on the Delhi Airport Metro Express line.
              </p>
              <div style={{ aspectRatio: "16/10", position: "relative" }}>
                <VenueMap />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #0E0E0F" }}>
              {list(v.travel).map((t, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr) 110px", gap: "20px", padding: "22px 0", borderBottom: "1px solid #E3E0D8", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px", textTransform: "uppercase" }}>{txt(t?.mode)}</span>
                    <span style={{ fontSize: "15px", lineHeight: "1.45", color: "#3A3A3E" }}>{txt(t?.how)}</span>
                    <span style={{ textAlign: "right" }}>
                      <span style={{ display: "block", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "25px" }}>{txt(t?.time)}</span>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "9px", letterSpacing: "0.12em", color: "#6B6A66" }}>{txt(t?.src)}</span>
                    </span>
                  </div>
                </Fragment>
              ))}
              <a href={withBase("/explore#getting-there")} style={{ marginTop: "24px", fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em" }}>
                {"Full visitor guide & routes →"}
              </a>
            </div>
          </div>
        </section>
        <section data-screen-label="14 CTA" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          <a href={withBase("/exhibit")} style={{ background: "#F07C12", color: "#0E0E0F", textDecoration: "none", padding: "56px 28px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "300px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em" }}>{"FOR BRANDS & MANUFACTURERS"}</span>
            <span style={{ marginTop: "auto", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "67px", lineHeight: "0.85" }}>
              Exhibit →
            </span>
          </a>
          <a href={withBase("/attend")} style={{ background: "#fff", color: "#0E0E0F", textDecoration: "none", padding: "56px 28px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "300px", boxSizing: "border-box", borderTop: "1px solid #0E0E0F" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em" }}>{"FOR VISITORS & DELEGATES"}</span>
            <span style={{ marginTop: "auto", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "67px", lineHeight: "0.85" }}>
              Attend →
            </span>
          </a>
          <a href={withBase("/connect")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", padding: "56px 28px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "300px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#BDB9B0" }}>{"FOR BUYERS & INVESTORS"}</span>
            <span style={{ marginTop: "auto", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "67px", lineHeight: "0.85" }}>
              Connect →
            </span>
          </a>
        </section>
        <footer style={{ background: "#0E0E0F", color: "#BDB9B0", padding: "56px 28px", fontSize: "14px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "23px", color: "#fff" }}>
                {"India Sports Expo "}
                <span style={{ color: "#F07C12" }}>2027</span>
              </span>
              <span>Exhibition Hall 2, Yashobhoomi (IICC), Sector 25, Dwarka, New Delhi</span>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.12em" }}>
                {"PROTOTYPE · ALL PARTICIPANTS, DATES & FIGURES ARE DEMO UNLESS STATED"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ color: "#fff", fontWeight: "700", letterSpacing: "0.1em", fontSize: "12px" }}>PROTOTYPE MAP</span>
              <a href={withBase("/explore")} style={{ color: "#BDB9B0" }}>{"Hall 2 digital twin & map"}</a>
              <a href={withBase("/zones")} style={{ color: "#BDB9B0" }}>Zone experiences A–D</a>
              <a href={withBase("/exhibit")} style={{ color: "#BDB9B0" }}>{"Exhibit & stall booking"}</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ color: "#fff", fontWeight: "700", letterSpacing: "0.1em", fontSize: "12px" }} />
              <a href={withBase("/attend")} style={{ color: "#BDB9B0" }}>{"Attend, pass & My Expo"}</a>
              <a href={withBase("/connect")} style={{ color: "#BDB9B0" }}>{"Business Exchange & meetings"}</a>
              <a href={withBase("/programme")} style={{ color: "#BDB9B0" }}>{"Programme & Watch"}</a>
              <a href={withBase("/portal")} style={{ color: "#BDB9B0" }}>Exhibitor control centre</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ color: "#fff", fontWeight: "700", letterSpacing: "0.1em", fontSize: "12px" }} />
              <a href={withBase("/mobile")} style={{ color: "#BDB9B0" }}>Mobile app</a>
              <a href={withBase("/admin")} style={{ color: "#BDB9B0" }}>{"Super admin · Admin, CMS & command"}</a>
            </div>
          </div>
        </footer>
        {v.searchOpen ? (
          <>
            <div role="dialog" aria-label="Search" style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(14,14,15,0.6)", display: "flex", justifyContent: "center", paddingTop: "80px" }} onClick={v.closeSearch}>
              <div onClick={v.stop} style={{ background: "#fff", width: "min(880px,92vw)", maxHeight: "76vh", overflow: "auto", border: "1px solid #0E0E0F" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 24px", borderBottom: "2px solid #0E0E0F", height: "72px" }}>
                  <span style={{ fontSize: "22px" }}>⌕</span>
                  <input value={val(v.q)} onChange={v.setQ} autoFocus={true} placeholder="Search exhibitors, products, sports, countries, sessions, speakers or stalls..." style={{ flex: "1", border: "0", outline: "none", font: "500 22px var(--f-body)" }} />
                  <button onClick={v.closeSearch} style={{ border: "1px solid #0E0E0F", background: "none", height: "32px", padding: "0 10px", font: "600 11px var(--f-label)", cursor: "pointer" }}>
                    Esc
                  </button>
                </div>
                {list(v.results).map((g, $index) => (
                  <Fragment key={$index}>
                    <div style={{ padding: "16px 24px 8px" }}>
                      <div style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.18em", color: "#6B6A66", marginBottom: "6px" }}>
                        {txt(g?.label)}{" · "}{txt(g?.count)}
                      </div>
                      {list(g?.items).map((r, $index) => (
                        <Fragment key={$index}>
                          <a href={r?.href} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", padding: "10px 0", borderBottom: "1px solid #E3E0D8", textDecoration: "none", color: "#0E0E0F" }}>
                            <span style={{ fontSize: "16px", fontWeight: "600" }}>
                              {txt(r?.t)}{" "}
                              <span style={{ fontWeight: "400", color: "#6B6A66", fontSize: "14px" }}>{txt(r?.s)}</span>
                            </span>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(r?.m)}</span>
                          </a>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
                {" "}
                {v.noResults ? (
                  <>
                    <div style={{ padding: "40px 24px", color: "#6B6A66" }}>No results for “{txt(v.q)}”. Try a sport, country or stall ID such as B-SGM-017.</div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default defineDC("Home", Component, render);
