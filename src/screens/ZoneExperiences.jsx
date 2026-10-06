'use client';
// Generated from design/site/Zone Experiences.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';
import '@/lib/maplibre';

/* global maplibregl */
class Component extends DCLogic {
  state = { a: 'states', state: 'OD', saved: {}, room: 0, sport: 'Hockey', b: 'market', sports: ['Football'], exportOnly: false, layer: 4, shoe: 2, surf: 'Hockey', c: 'tech', stake: 'ATHLETE', node: 'Heart / Endurance', phase: 'during', booked: {}, cty: 'JP' };
  indiaRef = React.createRef(); globeRef = React.createRef();
  CAP = { GJ: [72.65, 23.22], OD: [85.82, 20.30], HR: [76.78, 30.73], MH: [72.88, 19.08], TN: [80.27, 13.08], KA: [77.59, 12.97] };
  componentDidMount() {
    this._m = setInterval(() => { if (window.maplibregl && window.ISE && this.indiaRef.current && this.globeRef.current) { clearInterval(this._m); this.initMaps(); this.forceUpdate(); } }, 150);
    const h = location.hash; if (h) setTimeout(() => { const el = document.querySelector(h); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110 }); }, 400);
  }
  componentWillUnmount() { clearInterval(this._m); this.india && this.india.remove(); this.globe && this.globe.remove(); }
  marker(map, lngLat, text, onClick, dark, anchor = 'center') {
    const el = document.createElement('button');
    el.style.cssText = `font:700 12px var(--f-body);background:${dark ? '#fff' : '#9E1B22'};color:${dark ? '#0E0E0F' : '#fff'};border:0;padding:6px 10px;border-radius:999px;box-shadow:0 4px 12px -4px rgba(0,0,0,0.45);cursor:pointer;white-space:nowrap;`;
    el.textContent = text; el.onclick = onClick; new maplibregl.Marker({ element: el, anchor }).setLngLat(lngLat).addTo(map); return el;
  }
  initMaps() {
    const D = window.ISE;
    try {
      this.india = new maplibregl.Map({ container: this.indiaRef.current, center: [80, 22], zoom: 3.8, scrollZoom: false, attributionControl: { compact: true },
        style: { version: 8, sources: { t: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: 'Esri, HERE, Garmin' } }, layers: [{ id: 't', type: 'raster', source: 't' }] } });
      D.states.forEach(s => this.marker(this.india, this.CAP[s.id], s.name, () => this.setState({ state: s.id })));
      { const y = this.marker(this.india, [77.0446, 28.5549], '● YASHOBHOOMI', () => {}, true); y.style.background = '#0E0E0F'; y.style.color = '#fff'; }
    } catch (e) {}
    try {
      this.globe = new maplibregl.Map({ container: this.globeRef.current, center: [70, 25], zoom: 1.2, scrollZoom: false, attributionControl: { compact: true },
        style: { version: 8, projection: { type: 'globe' }, sources: { sat: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: 'Esri World Imagery' } }, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#16365a' } }, { id: 'sat', type: 'raster', source: 'sat' }],
        // A soft atmosphere around the globe; outside it the page's light background shows through.
        sky: { 'atmosphere-blend': 0.85 } } });
      // Neighbours (UK and Germany) would sit on top of each other: one label above its point, one below.
      D.countries.forEach(c => this.marker(this.globe, [c.lon, c.lat], c.name, () => this.pickCty(c.id), true, { GB: 'bottom', DE: 'top' }[c.id] || 'center'));
    } catch (e) {}
  }
  pickCty(id) { this.setState({ cty: id }); const c = window.ISE.countries.find(x => x.id === id); this.globe && this.globe.flyTo({ center: [c.lon, c.lat], zoom: 2.2, duration: 1600 }); }
  pickState(id) { this.setState({ state: id }); this.india && this.india.flyTo({ center: this.CAP[id], zoom: 5.4, duration: 1200 }); }
  renderVals() {
    const D = window.ISE; const s = this.state;
    const empty = { indiaRef: this.indiaRef, globeRef: this.globeRef, aDest: [], stateBtns: [], st: { rows: [] }, rooms: [], room: {}, sports: [], fed: { rows: [] }, timeline: [], trad: [], ministry: [], bTiles: [], sportChips: [], facetGroups: [], market: [], layers: [], layer: { groups: [] }, shoe: [], shoeSel: {}, materials: [], chain: [], surfTabs: [], surf: { layers: [] }, cTiles: [], stakeTabs: [], stakeItems: [], startups: [], nodes: [], node: { rows: [] }, phaseTabs: [], arena: { list: [] }, tryList: [], dSpaces: [], ctyBtns: [], cty: { rows: [] } };
    if (!D) return empty;
    const tab = (cur, id, on = '#9E1B22') => ({ bg: cur === id ? '#fff' : '#FBFAF7', bar: cur === id ? on : 'transparent' });
    const sel = (on, c = '#0E0E0F') => ({ bg: on ? c : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    // Zone A
    const aDest = [
      { id: 'states', code: 'A-STA', name: 'States & UTs Sports Destinations', meta: '4 pavilions' },
      { id: 'min', code: 'A-MYS', name: 'Ministry of Youth Affairs & Sports', meta: '2 pavilions' },
      { id: 'fed', code: 'A-FED', name: 'Federations & Institutions', meta: '2 pavilions' },
      { id: 'her', code: 'A-HER', name: 'India Sports Heritage & Interactive', meta: '2 pavilions' },
      { id: 'theme', code: 'A-THM', name: 'Theme Pavilion', meta: 'Hero pavilion · walkthrough' }
    ].map(d => ({ ...d, ...tab(s.a, d.id), pick: () => this.setState({ a: d.id }) }));
    const S = D.states.find(x => x.id === s.state);
    const SX = { GJ: ['GIFT City sports-tech cluster (sample)', 'Sports goods SEZ proposal (sample)', '2036 bid infrastructure (sample)'], OD: ['Hockey stadium network (sample)', 'High-performance centres (sample)', 'Sports tourism circuits (sample)'] };
    const st = { ...S, rows: [
      { k: 'Major sports', v: S.sports.join(', ') }, { k: 'Major venues', v: S.venues }, { k: 'Academies', v: '12 state academies · 4 HPCs (sample)' },
      { k: 'Sports tourism', v: 'Event hosting calendar and heritage circuits (sample)' }, { k: 'Manufacturing', v: S.id === 'MH' ? 'Equipment & apparel clusters (sample)' : 'Emerging (sample)' },
      { k: 'Key athletes', v: 'Athlete names to be supplied by the State' }, { k: 'Upcoming projects', v: (SX[S.id] || ['Multi-sport complex (sample)', 'District academies (sample)']).join(' · ') },
      { k: 'Investment', v: 'PPP venue operations, academies, sports tourism (sample)' }, { k: 'Participants', v: 'State Sports Department + 6 organisations (sample)' }
    ] };
    const rooms = [
      { t: 'India’s Sporting Journey', d: 'From traditional games to the first Olympic medals: an immersive corridor of archive imagery and artefacts.' },
      { t: 'India Today', d: 'A live data wall of participation, leagues, venues and athletes across every State and UT.' },
      { t: 'India’s Sports Economy', d: 'Manufacturing, media, events and services shown as one connected economy, with sample figures to be validated.' },
      { t: 'Global Sporting Ambition', d: 'India’s hosting ambitions and international partnerships, presented as a spatial map.' },
      { t: 'Future of Sport in India', d: 'A closing room where visitors record their own pledge for the future of Indian sport.' }
    ];
    const sportsList = ['Football', 'Hockey', 'Athletics', 'Archery', 'Badminton', 'Boxing', 'Basketball', 'Aquatics', 'Wrestling', 'Shooting', 'Kabaddi', 'Table Tennis'];
    // Zone B
    const bTiles = [
      { id: 'market', n: '31', unit: 'STALLS + 2 PAVILIONS', name: 'Sports Goods Manufacturing' }, { id: 'oem', n: '20', unit: 'STALLS', name: 'OEM / ODM & Supply Chain' },
      { id: 'infra', n: '32', unit: 'STALLS + 1 PAVILION', name: 'Sports Infrastructure & Venue Build' }, { id: 'apparel', n: '14', unit: 'STALLS + 1 PAVILION', name: 'Apparel & Footwear' },
      { id: 'surf', n: '9', unit: 'STALLS + 1 PAVILION', name: 'Surfaces & Turf' }, { id: 'infra2', n: '13', unit: 'STALLS', name: 'Lighting, Seating & Engineering' }
    ].map(t => ({ ...t, ...tab(s.b === 'infra' && t.id === 'infra2' ? 'x' : s.b, t.id, '#5B3A9E'), pick: () => this.setState({ b: t.id === 'infra2' ? 'infra' : t.id, layer: t.id === 'infra2' ? 1 : s.layer }) }));
    const chipSports = ['Football', 'Hockey', 'Cricket', 'Athletics', 'Racquet', 'Combat', 'Fitness', 'Indoor', 'Outdoor'];
    const mk = D.exhibitors.filter(e => e.zone === 'B' || e.zone === 'D').filter(e => !s.sports.length || s.sports.includes(e.sport) || (s.sports.includes('Outdoor') && e.sport === 'Multi-sport')).filter(e => !s.exportOnly || /Export|Manufacturer/.test(e.type));
    const layers = [
      { name: 'ROOF', d: 'Tensile, steel and retractable roof systems, rainwater harvesting and solar integration.', p: 'Modular roof systems · PTFE membranes', c: 'ArenaBuild Infrastructure (B-SIV-004)' },
      { name: 'LIGHTING', d: 'Broadcast-grade LED floodlighting, show control and energy management.', p: 'LX-2000 Broadcast Floodlight', c: 'Luminar Stadium Lighting (B-LSE-005)' },
      { name: 'SEATING', d: 'Fixed, tip-up, retractable and premium hospitality seating.', p: 'Retractable seating · tip-up seats', c: 'FlexSeat Arenas (B-LSE-011)' },
      { name: 'AV / SCOREBOARDS', d: 'Giant screens, ribbon boards, PA and broadcast infrastructure.', p: 'LED ribbon boards · PA systems', c: '3 exhibitors in B-LSE (demo)' },
      { name: 'PLAYING SURFACE', d: 'Natural hybrid, synthetic turf, athletics tracks and indoor sports floors.', p: 'AquaPlay Hockey Turf · shock pads', c: 'TurfLine Systems (B-SRF-003)' },
      { name: 'SECURITY', d: 'Access control, CCTV analytics, crowd management and perimeter systems.', p: 'Turnstiles · video analytics', c: '2 exhibitors in C-STI (demo)' },
      { name: 'VENUE IoT', d: 'Sensors for occupancy, pitch health, energy and maintenance.', p: 'Turfsense pitch sensors', c: 'Turfsense (C-SUV-017)' },
      { name: 'OPERATIONS', d: 'Venue management software, ticketing, workforce and facility services.', p: 'Venue OS · ticketing', c: 'ArenaBuild Infrastructure (B-SIV-004)' }
    ];
    const L = layers[s.layer];
    const shoeParts = [
      { name: 'Upper — engineered knit', h: '34px', r: '40px 60px 4px 4px', d: 'Single-piece engineered knit with zoned breathability.', by: 'Kinetic Fabrics (demo), Origin Supply Co.' },
      { name: 'Lacing & heel counter', h: '12px', r: '2px', d: 'Lock-down systems and moulded heel counters.', by: 'Stridewell Footwear' },
      { name: 'Midsole — PEBA foam', h: '28px', r: '4px 30px 30px 4px', d: 'Supercritical foams for energy return.', by: 'Stridewell Footwear (B-APF-008)' },
      { name: 'Carbon plate', h: '6px', r: '2px', d: 'Full-length carbon plates for sprint and distance spikes.', by: 'Stridewell Footwear (B-APF-008)' },
      { name: 'Outsole & spike plate', h: '12px', r: '2px 20px 20px 2px', d: 'Rubber compounds and spike plates for track and court.', by: '3 exhibitors in B-APF (demo)' }
    ];
    const surfaces = {
      Football: { d: 'FIFA Quality synthetic turf with shock pad, or hybrid natural grass for stadia.', by: 'TurfLine Systems (B-SRF-003)', layers: [['Turf fibres 50–60 mm', 40, '#3B8C55'], ['Rubber / organic infill', 22, '#4A3B2F'], ['Shock pad', 18, '#2A2A2D'], ['Engineered base', 48, '#A29E95']] },
      Hockey: { d: 'Water-based short-pile turf, the international standard for elite hockey.', by: 'TurfLine Systems (B-SRF-003)', layers: [['Short-pile turf 12 mm', 16, '#1F4E9E'], ['E-layer shock pad', 20, '#2A2A2D'], ['Asphalt layer', 28, '#55555A'], ['Drainage base', 48, '#A29E95']] },
      Athletics: { d: 'Prefabricated or sandwich polyurethane tracks.', by: '2 exhibitors in B-SRF (demo)', layers: [['PU wearing layer', 14, '#9E1B22'], ['Base mat', 22, '#2A2A2D'], ['Asphalt', 32, '#55555A'], ['Sub-base', 48, '#A29E95']] },
      Tennis: { d: 'Acrylic hard courts, clay and cushioned systems.', by: '1 exhibitor in B-SRF (demo)', layers: [['Acrylic colour coats', 10, '#1F4E9E'], ['Cushion layers', 18, '#2A2A2D'], ['Asphalt', 32, '#55555A'], ['Sub-base', 48, '#A29E95']] },
      Indoor: { d: 'Sprung timber and synthetic sports floors for badminton, basketball, volleyball.', by: '2 exhibitors in B-SRF (demo)', layers: [['Hardwood / PVC top', 16, '#C29A6B'], ['Sub-floor panels', 20, '#8A6B48'], ['Sprung battens', 28, '#2A2A2D'], ['Slab', 40, '#A29E95']] },
      'Multi-sport': { d: 'Convertible surfaces and modular systems for community venues.', by: '3 exhibitors in B-SRF (demo)', layers: [['Modular tiles', 18, '#0B6E4F'], ['Shock layer', 18, '#2A2A2D'], ['Asphalt', 28, '#55555A'], ['Sub-base', 44, '#A29E95']] }
    };
    const SF = surfaces[s.surf];
    // Zone C
    const cTiles = [{ id: 'tech', code: 'C-STI · 34+1', name: 'SportsTech & Innovation' }, { id: 'startup', code: 'C-SUV · 30+1', name: 'Startup Village' }, { id: 'body', code: 'C-PSS · 30+1', name: 'Performance & Sports Science' }, { id: 'arena', code: 'C-IAS · 324 seats', name: 'Innovation Arena Stage' }, { id: 'try', code: 'C-TSA', name: 'Try Sport Arena' }, { id: 'try', code: 'C-IEX', name: 'Interactive Experiences' }]
      .map((t, i) => ({ ...t, ...tab(s.c, t.id, '#0A62BF'), bar: s.c === t.id && (i < 5) ? '#0A62BF' : 'transparent', pick: () => this.setState({ c: t.id }) }));
    const stake = {
      ATHLETE: [['AI Coaching', 'Computer-vision technique feedback from a phone camera.', 'MotionIQ · C-STI-011'], ['Wearables', 'GPS, HRV and load monitoring.', 'RecovR · C-SUV-011'], ['Performance Analytics', 'Benchmarks across age groups and regions.', 'SportMatrix · C-STI-022']],
      COACH: [['Video Analysis', 'Tagging, telestration and clip sharing.', 'KheloLens · C-SUV-004'], ['Tactical Systems', 'Set-piece and formation planning.', 'SportMatrix · C-STI-022'], ['Data', 'Squad dashboards and talent IDs.', 'Paceline · C-SUV-028']],
      VENUE: [['IoT', 'Pitch, energy and occupancy sensors.', 'Turfsense · C-SUV-017'], ['Smart Stadium', 'Connected seats, concessions and wayfinding.', 'Demo exhibitor · C-STI-030'], ['Security & Operations', 'Access control and incident management.', 'Demo exhibitor · C-STI-018']],
      EVENT: [['Registration', 'Visitor and delegate registration.', 'Demo exhibitor · C-STI-005'], ['Accreditation', 'Credentialing and access zones.', 'Demo exhibitor · C-STI-006'], ['Workforce', 'Volunteer and staff rostering.', 'Demo exhibitor · C-STI-009']],
      BROADCAST: [['AI Production', 'Automated multi-camera production for grassroots sport.', 'Demo exhibitor · C-STI-014'], ['Streaming', 'OTT and low-latency delivery.', 'Demo exhibitor · C-STI-015'], ['Graphics', 'Real-time data graphics.', 'SportMatrix · C-STI-022']],
      FAN: [['AR / VR', 'Immersive replays and venue tours.', 'Demo exhibitor · C-IEX'], ['Gamification', 'Predictor games and loyalty.', 'FanLoop · C-SUV-020'], ['Fan Engagement', 'Second-screen and community apps.', 'Demo exhibitor · C-STI-027']]
    };
    const nodes = [['Brain / Cognition', '50%', '9%'], ['Heart / Endurance', '54%', '28%'], ['Muscle / Strength', '36%', '34%'], ['Movement', '62%', '52%'], ['Biomechanics', '44%', '64%'], ['Recovery', '58%', '78%'], ['Nutrition', '40%', '45%'], ['Sleep', '64%', '14%']];
    const nodeData = { tech: ['Neurotracking, reaction-time trainers', 'HRV, lactate and VO2 testing', 'Velocity-based training, force plates', 'Markerless motion capture', '3D gait and kinematics labs', 'Cryo, compression, sleep tracking', 'Body composition, personalised plans', 'Sleep staging wearables'] };
    const ni = nodes.findIndex(n => n[0] === s.node);
    const arenaPh = {
      before: { badge: 'DAY 1 · 09:00 OPENS', badgeBg: '#0E0E0F', player: 'PROGRAMME PREVIEW', title: 'PITCHES, DEMOS & KEYNOTES', listLabel: 'Pitch schedule', list: D.sessions.filter(x => x.stage === 'Innovation Arena').slice(0, 5).map(x => ({ a: 'D' + x.day + ' ' + x.time, b: x.title })) },
      during: { badge: '● LIVE NOW', badgeBg: '#9E1B22', player: 'EMBEDDED STREAM PLACEHOLDER', title: 'THE FUTURE OF AI COACHING', listLabel: 'Up next', list: D.sessions.filter(x => x.stage === 'Innovation Arena' && x.day >= 2).slice(1, 5).map(x => ({ a: 'D' + x.day + ' ' + x.time, b: x.title })) },
      after: { badge: 'RECORDING · 45 MIN', badgeBg: '#0E0E0F', player: 'ON-DEMAND PLAYER', title: 'HIGHLIGHTS: AI COACHING', listLabel: 'Related companies', list: [{ a: 'C-STI', b: 'MotionIQ SportsTech' }, { a: 'C-STI', b: 'SportMatrix Analytics' }, { a: 'C-SUV', b: 'KheloLens' }, { a: 'C-PSS', b: 'Velocity Performance Labs' }] }
    };
    const tryList = [['10:00', 'Archery Experience', '20 min', 24, 16, 'C-TSA-1', 'Age 10+ · coached'], ['10:30', 'Wheelchair Basketball', '30 min', 20, 18, 'C-TSA-2', 'All visitors'], ['11:15', 'Football Reaction Challenge', '10 min', 40, 12, 'C-IEX', 'All visitors'], ['12:00', 'Sprint Timing Experience', '15 min', 30, 30, 'C-TSA-3', 'Age 12+ · sports shoes'], ['13:00', 'VR Training', '15 min', 16, 9, 'C-IEX', 'Age 13+']];
    const C = D.countries.find(x => x.id === s.cty);
    return {
      indiaRef: this.indiaRef, globeRef: this.globeRef,
      aDest, aStates: s.a === 'states', aTheme: s.a === 'theme', aFed: s.a === 'fed', aHer: s.a === 'her', aMin: s.a === 'min',
      stateBtns: D.states.map(x => ({ name: x.name, ...sel(x.id === s.state, '#9E1B22'), pick: () => this.pickState(x.id) })), st,
      saveLabel: s.saved[s.state] ? '✓ In My Expo' : 'Add to My Expo', saveState: () => this.setState(p => ({ saved: { ...p.saved, [p.state]: !p.saved[p.state] } })),
      rooms: rooms.map((r, i) => ({ ...r, n: i + 1, bg: i === s.room ? '#F07C12' : i < s.room ? '#2A2A2D' : '#1A1A1C', fg: i === s.room ? '#0E0E0F' : '#fff', border: i === s.room ? '#F07C12' : '#3A3A3E', lift: i === s.room ? 'translateZ(30px)' : 'none', shadow: i === s.room ? '0 20px 30px rgba(0,0,0,.5)' : 'none', pick: () => this.setState({ room: i }) })),
      room: rooms[s.room], prevRoom: () => this.setState({ room: (s.room + 4) % 5 }), nextRoom: () => this.setState({ room: (s.room + 1) % 5 }),
      sports: sportsList.map(x => ({ name: x, ...sel(x === s.sport, '#9E1B22'), pick: () => this.setState({ sport: x }) })),
      fed: { name: s.sport + ' Federation of India (sample)', loc: 'A-FED-P' + (sportsList.indexOf(s.sport) % 2 + 1), rows: [{ k: 'Initiatives', v: 'Grassroots leagues, coach education, talent ID (sample)' }, { k: 'Key events', v: 'National championships · international qualifiers (sample)' }, { k: 'Representatives', v: '3 delegates attending (names TBC)' }, { k: 'Sessions', v: 'Federations & the Grassroots Pipeline · Day 3 10:00' }, { k: 'Expo location', v: 'Zone A · Federations & Institutions' }] },
      timeline: [['1928', 'OLYMPIC', 'First Olympic hockey gold, Amsterdam'], ['1951', 'HOSTING', 'New Delhi hosts the first Asian Games'], ['1983', 'CRICKET', 'Cricket World Cup won at Lord’s'], ['2008', 'OLYMPIC', 'First individual Olympic gold — shooting, Beijing'], ['2010', 'HOSTING', 'Commonwealth Games, Delhi'], ['2020', 'PARALYMPIC', 'Record Paralympic medal haul at Tokyo'], ['2020', 'OLYMPIC', 'Javelin gold at Tokyo — first in athletics'], ['2027', 'EXPO', 'India Sports Expo at Yashobhoomi']].map(([y, k, t]) => ({ y, k, t })),
      trad: ['Kabaddi', 'Kho-kho', 'Mallakhamb', 'Kalaripayattu', 'Gatka', 'Silambam'],
      ministry: [{ code: 'A-MYS-P1', t: 'National schemes', d: 'Athlete support, infrastructure and grassroots programmes.' }, { code: 'A-MYS-P2', t: 'Athlete pathways', d: 'Talent identification to podium, presented as an interactive journey.' }, { code: 'A-MYS · DESK', t: 'Policy & investment desk', d: 'Meetings with Ministry officials via the Business Exchange.' }],
      bTiles, bMarket: s.b === 'market', bInfra: s.b === 'infra', bApparel: s.b === 'apparel', bOem: s.b === 'oem', bSurf: s.b === 'surf',
      sportChips: chipSports.map(x => { const on = s.sports.includes(x); return { name: x, on, ...sel(on), pick: () => this.setState(p => ({ sports: on ? p.sports.filter(y => y !== x) : [...p.sports, x] })) }; }),
      facetGroups: [{ label: 'PRODUCT TYPE', opts: ['All types', 'Equipment', 'Surfaces', 'Infrastructure', 'Footwear'] }, { label: 'COUNTRY', opts: ['All countries', 'India', 'Germany', 'Netherlands', 'Japan', 'Australia'] }, { label: 'COMPANY TYPE', opts: ['Any', 'Manufacturer', 'Exporter', 'OEM / ODM', 'Contractor'] }, { label: 'BUYER INTEREST', opts: ['Any', 'Seeking distributors', 'Seeking OEM contracts', 'Seeking projects'] }],
      exportOnly: s.exportOnly, toggleExport: () => this.setState({ exportOnly: !s.exportOnly }),
      resultCount: mk.length, marketEmpty: !mk.length,
      market: mk.map(e => ({ ...e, logo: 'logo-' + e.id, plist: e.products.join(', '), saveLabel: s.saved[e.id] ? '✓ Saved to My Expo' : '+ Add to My Expo', saveBg: s.saved[e.id] ? '#E3F1EB' : '#F6F4EF', save: () => this.setState(p => ({ saved: { ...p.saved, [e.id]: !p.saved[e.id] } })) })),
      layers: layers.map((l, i) => ({ ...l, n: String(i + 1).padStart(2, '0'), bg: i === s.layer ? '#F07C12' : '#fff', fg: '#0E0E0F', shift: i === s.layer ? '60px' : '0px', pick: () => this.setState({ layer: i }) })),
      layer: { ...L, n: s.layer + 1, groups: [{ k: 'PRODUCTS', v: L.p }, { k: 'COMPANIES', v: L.c }, { k: 'TECHNOLOGIES', v: 'BIM-led delivery, digital twins, sustainability ratings' }, { k: 'RELATED SESSION', v: 'Stadiums as Year-round Assets · Day 1 14:00' }] },
      shoe: shoeParts.map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0'), bg: i === s.shoe ? '#F07C12' : '#fff', fg: i === s.shoe ? '#C2610B' : '#0E0E0F', x: i === s.shoe ? '24px' : '0px', pick: () => this.setState({ shoe: i }) })),
      shoeSel: shoeParts[s.shoe],
      materials: [{ id: 'mat-knit', t: 'TECHNICAL FABRIC', p: 'Macro: engineered knit' }, { id: 'mat-comp', t: 'COMPRESSION', p: 'Macro: compression weave' }, { id: 'mat-prot', t: 'PROTECTIVE WEAR', p: 'Macro: impact foam' }, { id: 'mat-sust', t: 'SUSTAINABLE MATERIALS', p: 'Macro: recycled yarn' }],
      chain: ['Design', 'Material', 'Manufacturing', 'Quality', 'Packaging', 'Logistics', 'Global Retail'].map((t, i) => ({ t: t.toUpperCase(), n: i + 1, cos: [['Origin Supply Co.', 'Stridewell (ODM)'], ['Kinetic Fabrics (demo)'], ['Origin Supply Co.', 'Apex Sports India'], ['TestLab India (demo)'], ['PackRight (demo)'], ['Bharat Freight (demo)'], ['Global Sports Retail GmbH', 'Northline Distribution']][i] })),
      surfTabs: Object.keys(surfaces).map(k => ({ name: k.toUpperCase(), ...sel(k === s.surf, '#5B3A9E'), pick: () => this.setState({ surf: k }) })),
      surf: { ...SF, layers: SF.layers.map(([n, h, c]) => ({ n, h: h * 2 + 'px', c })) },
      cTiles, cTech: s.c === 'tech', cStartup: s.c === 'startup', cBody: s.c === 'body', cArena: s.c === 'arena', cTry: s.c === 'try',
      stakeTabs: Object.keys(stake).map(k => ({ t: k.charAt(0) + k.slice(1).toLowerCase(), ...sel(k === s.stake, '#0A62BF'), pick: () => this.setState({ stake: k }) })),
      stakeItems: stake[s.stake].map(([t, d, co]) => ({ t, d, co })),
      startups: D.startups,
      nodes: nodes.map(([t, x, y]) => ({ t, x, y, bg: t === s.node ? '#F07C12' : '#0A62BF', pick: () => this.setState({ node: t }) })),
      node: { t: s.node, rows: [{ k: 'TECHNOLOGIES', v: nodeData.tech[ni] }, { k: 'RESEARCH', v: 'National Sports Science Centre (demo) — open data posters' }, { k: 'COMPANIES', v: 'Velocity Performance Labs (C-PSS-006) · RecovR (C-SUV-011)' }, { k: 'SESSIONS', v: 'Sports Science for the Next Olympic Cycle · Day 2 11:00' }, { k: 'DEMOS', v: 'Live testing at C-PSS, every hour on the hour (sample)' }] },
      phaseTabs: [['before', 'BEFORE'], ['during', '● DURING'], ['after', 'AFTER']].map(([id, t]) => ({ t, ...sel(id === s.phase, '#0A62BF'), pick: () => this.setState({ phase: id }) })),
      arena: arenaPh[s.phase],
      tryList: tryList.map(([time, name, dur, cap, taken, loc, elig]) => { const b = s.booked[name]; const full = taken >= cap && !b; return { time, name, dur, loc, elig, cap: (cap - taken - (b ? 1 : 0)) + ' of ' + cap + ' left', pct: Math.round((taken + (b ? 1 : 0)) / cap * 100) + '%', bookLabel: b ? '✓ Booked' : full ? 'Waitlist' : 'Book', bookBg: b ? '#E4EEFA' : full ? '#E3E0D8' : '#0A62BF', bookFg: b ? '#0A62BF' : full ? '#0E0E0F' : '#fff', book: () => this.setState(p => ({ booked: { ...p.booked, [name]: !p.booked[name] } })) }; }),
      dSpaces: D.clusters.filter(c => c.zone === 'D').map(c => ({ code: 'D-' + c.id, name: c.name, meta: c.meta, access: /Invite|Accredited/.test(c.meta) ? '◆ RESTRICTED' : 'OPEN' })),
      ctyBtns: D.countries.map(c => ({ name: c.name, bg: c.id === s.cty ? '#00803F' : '#fff', fg: c.id === s.cty ? '#fff' : '#0E0E0F', pick: () => this.pickCty(c.id) })),
      cty: { ...C, rows: [{ k: 'Pavilion location', v: 'Zone D · ' + C.pav }, { k: 'Delegation', v: 'Trade ministry + industry association (sample)' }, { k: 'Companies', v: C.companies + ' exhibiting (demo)' }, { k: 'Technologies', v: C.profile }, { k: 'Buyers', v: '4 hosted buyers (demo)' }, { k: 'Speakers', v: C.id === 'JP' ? 'Aiko Tanaka (demo)' : C.id === 'DE' ? 'Lukas Brandt (demo)' : 'TBC' }, { k: 'Sessions', v: 'Country briefing · Business Exchange Stage (sample)' }] }
    };
  }
}

function render(v) {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: "0", zIndex: "60", background: "#0E0E0F", color: "#fff", display: "flex", alignItems: "center", gap: "28px", padding: "0 28px", height: "60px" }}>
          <a href={withBase("/")} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#fff" }}>
            <BrandLogo className="site-logo" />
          </a>
          <nav aria-label="Primary" style={{ display: "flex", gap: "22px", flex: "1", minWidth: "0", overflowX: "auto", scrollbarWidth: "none", whiteSpace: "nowrap", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em" }}>
            <a href={withBase("/explore")} style={{ color: "#F07C12", textDecoration: "none" }}>Explore</a>
            <a href={withBase("/exhibit")} style={{ color: "#fff", textDecoration: "none" }}>Exhibit</a>
            <a href={withBase("/attend")} style={{ color: "#fff", textDecoration: "none" }}>Attend</a>
            <a href={withBase("/connect")} style={{ color: "#fff", textDecoration: "none" }}>Connect</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Programme</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Watch</a>
          </nav>
          <a href={withBase("/me/")} className="hdr-btn hdr-ghost">
            <span className="hdr-liq" aria-hidden="true" />
            <span className="hdr-t">My Expo</span>
          </a>
          <a href={withBase("/register/")} className="hdr-btn hdr-fill">
            <span className="hdr-liq" aria-hidden="true" />
            <span className="hdr-t">Register</span>
          </a>
        </header>
        <nav aria-label="Zones" style={{ position: "sticky", top: "60px", zIndex: "50", display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#fff", borderBottom: "1px solid #0E0E0F" }}>
          <a href="#zone-a" style={{ textDecoration: "none", color: "#0E0E0F", padding: "12px 20px", borderTop: "5px solid #9E1B22", borderRight: "1px solid #E3E0D8", fontWeight: "600", fontSize: "14px" }}>
            <b style={{ color: "#9E1B22" }}>A</b>
            {" · India Sports & Heritage"}
          </a>
          <a href="#zone-b" style={{ textDecoration: "none", color: "#0E0E0F", padding: "12px 20px", borderTop: "5px solid #5B3A9E", borderRight: "1px solid #E3E0D8", fontWeight: "600", fontSize: "14px" }}>
            <b style={{ color: "#5B3A9E" }}>B</b>
            {" · Sports Goods & Infrastructure"}
          </a>
          <a href="#zone-c" style={{ textDecoration: "none", color: "#0E0E0F", padding: "12px 20px", borderTop: "5px solid #0A62BF", borderRight: "1px solid #E3E0D8", fontWeight: "600", fontSize: "14px" }}>
            <b style={{ color: "#0A62BF" }}>C</b>
            {" · Sports Tech & Experience"}
          </a>
          <a href="#zone-d" style={{ textDecoration: "none", color: "#0E0E0F", padding: "12px 20px", borderTop: "5px solid #00803F", fontWeight: "600", fontSize: "14px" }}>
            <b>D</b>
            {" · Sports Business & Investment"}
          </a>
        </nav>
        <section id="zone-a" data-screen-label="Zone A" style={{ scrollMarginTop: "110px" }}>
          <div style={{ background: "#9E1B22", color: "#fff", padding: "72px 28px 56px" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "40px", alignItems: "end" }}>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "154px", lineHeight: "0.75" }}>A</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", opacity: "0.85" }}>
                  HALL 2 · NORTH-WEST QUADRANT · 11 PAVILIONS
                </span>
                <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,7vw,112px) * 0.72)", lineHeight: "0.85" }}>
                  India Sports
                  <br />
                  {"& Heritage"}
                </h2>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", borderLeft: "1px solid #E3E0D8", marginTop: "-1px" }}>
              {list(v.aDest).map((d, $index) => (
                <Fragment key={$index}>
                  <button onClick={d?.pick} style={sx(`text-align:left;border:0;border-right:1px solid #E3E0D8;border-bottom:4px solid ${d?.bar ?? ""};background:${d?.bg ?? ""};padding:20px;cursor:pointer;display:flex;flex-direction:column;gap:10px;min-height:150px;`)}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(d?.code)}</span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "800", fontSize: "20px", lineHeight: "1", textTransform: "uppercase", color: "#0E0E0F" }}>
                      {txt(d?.name)}
                    </span>
                    <span style={{ marginTop: "auto", fontSize: "13px", color: "#6B6A66" }}>{txt(d?.meta)}</span>
                  </button>
                </Fragment>
              ))}
            </div>
            {v.aStates ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "0", border: "1px solid #E3E0D8", borderTop: "0", minHeight: "620px" }}>
                  <div style={{ position: "relative", background: "#F1EFEA" }}>
                    <div ref={v.indiaRef} style={{ position: "absolute", inset: "0" }} />
                    <div style={{ position: "absolute", left: "16px", bottom: "16px", display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "80%" }}>
                      {list(v.stateBtns).map((s, $index) => (
                        <Fragment key={$index}>
                          <button onClick={s?.pick} style={sx(`height:34px;padding:0 12px;border:1px solid #0E0E0F;background:${s?.bg ?? ""};color:${s?.fg ?? ""};font:600 13px var(--f-body);cursor:pointer;`)}>
                            {txt(s?.name)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#9E1B22" }}>
                      {"STATE PROFILE · PAVILION "}{txt(v.st?.pav)}{" · DEMO DATA"}
                    </span>
                    <h3 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "50px", lineHeight: "0.85", textTransform: "uppercase" }}>
                      {txt(v.st?.name)}
                    </h3>
                    <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.4" }}>{txt(v.st?.identity)}</p>
                    <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "160px 1fr", borderTop: "1px solid #E3E0D8", fontSize: "14px" }}>
                      {list(v.st?.rows).map((r, $index) => (
                        <Fragment key={$index}>
                          <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                          <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                        </Fragment>
                      ))}
                    </dl>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "auto" }}>
                      <a href={withBase("/explore")} style={{ background: "#9E1B22", color: "#fff", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em" }}>
                        View pavilion
                      </a>
                      <button onClick={v.saveState} style={{ border: "1px solid #0E0E0F", background: "#fff", height: "46px", font: "700 12px var(--f-body)", letterSpacing: "0.1em", cursor: "pointer" }}>
                        {txt(v.saveLabel)}
                      </button>
                      <a href={withBase("/connect")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em", boxSizing: "border-box" }}>
                        Book meeting
                      </a>
                      <a href={withBase("/explore")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em", boxSizing: "border-box" }}>
                        Navigate
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.aTheme ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "40px 32px", background: "#0E0E0F", color: "#fff", display: "flex", flexDirection: "column", gap: "32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#F07C12" }}>
                      THEME PAVILION · A-THM · CUTAWAY WALKTHROUGH
                    </span>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", border: "1px solid #55555A", padding: "4px 8px", color: "#BDB9B0" }}>
                      ILLUSTRATIVE STORYLINE · DEMO CONTENT
                    </span>
                  </div>
                  <div style={{ perspective: "1600px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "6px", transform: "rotateX(38deg)", transformOrigin: "50% 100%" }}>
                      {list(v.rooms).map((r, $index) => (
                        <Fragment key={$index}>
                          <button onClick={r?.pick} style={sx(`height:150px;border:1px solid ${r?.border ?? ""};background:${r?.bg ?? ""};color:${r?.fg ?? ""};cursor:pointer;text-align:left;padding:14px;display:flex;flex-direction:column;justify-content:space-between;transition:background .4s,transform .4s;transform:${r?.lift ?? ""};box-shadow:${r?.shadow ?? ""};`)}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{"ROOM "}{txt(r?.n)}</span>
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "20px", lineHeight: "0.95", textTransform: "uppercase" }}>
                              {txt(r?.t)}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ height: "6px", background: "#F07C12", marginTop: "-2px" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "32px", alignItems: "start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "45px", lineHeight: "0.86" }}>{txt(v.room?.t)}</span>
                      <span style={{ fontSize: "17px", lineHeight: "1.5", color: "#BDB9B0" }}>{txt(v.room?.d)}</span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={v.prevRoom} style={{ height: "42px", padding: "0 16px", border: "1px solid #55555A", background: "none", color: "#fff", font: "700 12px var(--f-body)", cursor: "pointer" }}>
                          ← Previous
                        </button>
                        <button onClick={v.nextRoom} style={{ height: "42px", padding: "0 16px", border: "0", background: "#F07C12", color: "#0E0E0F", font: "700 12px var(--f-body)", cursor: "pointer" }}>
                          Next room →
                        </button>
                      </div>
                    </div>
                    <div style={{ aspectRatio: "16/9", position: "relative" }}>
                      <image-slot id="theme-room-render" shape="rect" placeholder="Pavilion render / walkthrough still" />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.aFed ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
                  <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.86" }}>Explore by sport</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0", borderTop: "1px solid #0E0E0F", borderLeft: "1px solid #0E0E0F" }}>
                      {list(v.sports).map((s, $index) => (
                        <Fragment key={$index}>
                          <button onClick={s?.pick} style={sx(`height:72px;border:0;border-right:1px solid #0E0E0F;border-bottom:1px solid #0E0E0F;background:${s?.bg ?? ""};color:${s?.fg ?? ""};font:800 20px var(--f-display);font-stretch:62%;text-transform:uppercase;cursor:pointer;`)}>
                            {txt(s?.name)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "32px", background: "#F6E7E6", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#9E1B22" }}>
                      {"FEDERATION PROFILE · SAMPLE · "}{txt(v.fed?.loc)}
                    </span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.88", textTransform: "uppercase" }}>
                      {txt(v.fed?.name)}
                    </span>
                    <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "14px", borderTop: "1px solid #D9BDBB" }}>
                      {list(v.fed?.rows).map((r, $index) => (
                        <Fragment key={$index}>
                          <dt style={{ padding: "9px 0", borderBottom: "1px solid #D9BDBB", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                          <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #D9BDBB" }}>{txt(r?.v)}</dd>
                        </Fragment>
                      ))}
                    </dl>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a href={withBase("/connect")} style={{ background: "#9E1B22", color: "#fff", textDecoration: "none", height: "44px", display: "flex", alignItems: "center", padding: "0 18px", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em" }}>
                        Request meeting
                      </a>
                      <a href={withBase("/explore")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "44px", display: "flex", alignItems: "center", padding: "0 18px", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em" }}>
                        Expo location
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.aHer ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "32px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 32px 20px", flexWrap: "wrap", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.86" }}>India’s sporting timeline</span>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", background: "#F6E7E6", color: "#9E1B22", padding: "6px 10px", alignSelf: "center" }}>
                      SAMPLE — VERIFY BEFORE PUBLICATION
                    </span>
                  </div>
                  <div style={{ overflowX: "auto", padding: "0 32px 12px" }}>
                    <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "280px", borderTop: "2px solid #9E1B22" }}>
                      {list(v.timeline).map((t, $index) => (
                        <Fragment key={$index}>
                          <div style={{ padding: "20px 24px 0 0", display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
                            <span style={{ position: "absolute", top: "-7px", left: "0", width: "12px", height: "12px", background: "#9E1B22" }} />
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.9", color: "#9E1B22" }}>
                              {txt(t?.y)}
                            </span>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(t?.k)}</span>
                            <span style={{ fontSize: "16px", fontWeight: "600", lineHeight: "1.3" }}>{txt(t?.t)}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "24px 32px 0", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66", marginRight: "8px" }}>
                      TRADITIONAL SPORTS · TRY IN THE INTERACTIVE ZONE
                    </span>
                    {list(v.trad).map((t, $index) => (
                      <Fragment key={$index}>
                        <span style={{ border: "1px solid #9E1B22", color: "#9E1B22", padding: "8px 14px", fontWeight: "600", fontSize: "14px" }}>{txt(t)}</span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.aMin ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.88" }}>
                      {"Ministry of Youth Affairs & Sports"}
                    </span>
                    <span style={{ fontSize: "15px", color: "#3A3A3E", lineHeight: "1.5" }}>
                      Two pavilions presenting national schemes, athlete pathways and public sports infrastructure. Content to be supplied by the Ministry; layout shown with placeholders.
                    </span>
                  </div>
                  {list(v.ministry).map((m, $index) => (
                    <Fragment key={$index}>
                      <div style={{ borderTop: "4px solid #9E1B22", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(m?.code)}</span>
                        <b style={{ fontSize: "18px" }}>{txt(m?.t)}</b>
                        <span style={{ fontSize: "14px", color: "#3A3A3E" }}>{txt(m?.d)}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section id="zone-b" data-screen-label="Zone B" style={{ scrollMarginTop: "110px", marginTop: "96px" }}>
          <div style={{ background: "#5B3A9E", color: "#fff", padding: "72px 28px 56px" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "40px", alignItems: "end" }}>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "154px", lineHeight: "0.75" }}>B</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", opacity: "0.85" }}>
                  HALL 2 · NORTH-EAST QUADRANT · 119 STALLS · 5 PAVILIONS
                </span>
                <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,7vw,112px) * 0.72)", lineHeight: "0.85" }}>
                  Sports Goods
                  <br />
                  {"& Infrastructure"}
                </h2>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", borderLeft: "1px solid #E3E0D8" }}>
              {list(v.bTiles).map((t, $index) => (
                <Fragment key={$index}>
                  <button onClick={t?.pick} style={sx(`text-align:left;border:0;border-right:1px solid #E3E0D8;border-bottom:4px solid ${t?.bar ?? ""};background:${t?.bg ?? ""};padding:20px 18px;cursor:pointer;display:flex;flex-direction:column;gap:8px;min-height:170px;`)}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "38px", lineHeight: "0.85", color: "#5B3A9E" }}>
                      {txt(t?.n)}
                    </span>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.12em", color: "#6B6A66" }}>{txt(t?.unit)}</span>
                    <span style={{ marginTop: "auto", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", color: "#0E0E0F" }}>{txt(t?.name)}</span>
                  </button>
                </Fragment>
              ))}
            </div>
            {v.bMarket ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0,1fr)", border: "1px solid #E3E0D8", borderTop: "0" }}>
                  <aside style={{ padding: "24px", borderRight: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "20px", background: "#FBFAF7" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "28px", lineHeight: "0.9" }}>Sports goods marketplace</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>SPORT</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {list(v.sportChips).map((c, $index) => (
                          <Fragment key={$index}>
                            <button onClick={c?.pick} aria-pressed={c?.on} style={sx(`height:30px;padding:0 10px;border:1px solid #0E0E0F;background:${c?.bg ?? ""};color:${c?.fg ?? ""};font:600 12px var(--f-body);cursor:pointer;`)}>
                              {txt(c?.name)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    {list(v.facetGroups).map((g, $index) => (
                      <Fragment key={$index}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(g?.label)}</span>
                          <select style={{ height: "38px", border: "1px solid #0E0E0F", background: "#fff", font: "500 14px var(--f-body)", padding: "0 8px" }}>
                            {list(g?.opts).map((o, $index) => (
                              <Fragment key={$index}>
                                <option>{str(o)}</option>
                              </Fragment>
                            ))}
                          </select>
                        </label>
                      </Fragment>
                    ))}
                    <label style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
                      <input type="checkbox" checked={chk(v.exportOnly)} onChange={v.toggleExport} style={{ width: "18px", height: "18px", accentColor: "#0E0E0F" }} />
                      Exporters only
                    </label>
                  </aside>
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "2px solid #0E0E0F" }}>
                      <b>{txt(v.resultCount)}{" exhibitors"}</b>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.12em", color: "#6B6A66" }}>DEMO ENTITIES</span>
                    </div>
                    {list(v.market).map((e, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "96px minmax(0,1fr) minmax(0,1fr)", gap: "20px", padding: "20px 0", borderBottom: "1px solid #E3E0D8" }}>
                          <div style={{ width: "96px", height: "96px", position: "relative" }}>
                            <image-slot id={e?.logo} src={e?.logoUrl || undefined} shape="rect" fit="contain" placeholder="Logo" />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{"STALL "}{txt(e?.stall)}</span>
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "800", fontSize: "23px", lineHeight: "1", textTransform: "uppercase" }}>
                              {txt(e?.name)}
                            </span>
                            <span style={{ fontSize: "14px", color: "#6B6A66" }}>{txt(e?.city)}{" · "}{txt(e?.sector)}{" · "}{txt(e?.type)}</span>
                            <span style={{ fontSize: "14px" }}>
                              <b>Products:</b>
                              {" "}{txt(e?.plist)}
                            </span>
                            <span style={{ fontSize: "14px" }}>
                              <b>Looking for:</b>
                              {" "}{txt(e?.seeking)}
                            </span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", alignContent: "start" }}>
                            <a href={withBase("/exhibit")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em" }}>
                              View exhibitor
                            </a>
                            <a href={withBase("/exhibit")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                              View products
                            </a>
                            <a href={withBase("/connect")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                              Book meeting
                            </a>
                            <a href={withBase("/explore")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                              View on map
                            </a>
                            <button onClick={e?.save} style={sx(`grid-column:1 / -1;border:0;background:${e?.saveBg ?? ""};height:36px;font:700 11px var(--f-body);letter-spacing:0.08em;cursor:pointer;`)}>
                              {txt(e?.saveLabel)}
                            </button>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                    {v.marketEmpty ? (
                      <>
                        <div style={{ padding: "48px 0", color: "#6B6A66", fontSize: "16px" }}>No exhibitors match these filters yet. Clear a sport or switch off “Exporters only”.</div>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.bInfra ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", border: "1px solid #E3E0D8", borderTop: "0", minHeight: "640px" }}>
                  <div style={{ background: "#EEE8F7", display: "flex", alignItems: "center", justifyContent: "center", perspective: "1800px", padding: "40px 0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0", transformStyle: "preserve-3d" }}>
                      {list(v.layers).map((l, $index) => (
                        <Fragment key={$index}>
                          <button onClick={l?.pick} style={sx(`width:420px;height:58px;margin-top:-6px;border:1.5px solid #0E0E0F;background:${l?.bg ?? ""};color:${l?.fg ?? ""};transform:rotateX(58deg) rotateZ(-32deg) translateX(${l?.shift ?? ""});transition:transform .5s, background .3s;cursor:pointer;font:800 16px var(--f-display);font-stretch:75%;letter-spacing:0.06em;display:flex;align-items:center;justify-content:space-between;padding:0 20px;`)}>
                            <span>{txt(l?.n)}</span>
                            <span>{txt(l?.name)}</span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#5B3A9E" }}>
                      {"EXPLODED STADIUM · LAYER "}{txt(v.layer?.n)}{" OF 8"}
                    </span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "45px", lineHeight: "0.86" }}>{txt(v.layer?.name)}</span>
                    <span style={{ fontSize: "16px", lineHeight: "1.5", color: "#3A3A3E" }}>{txt(v.layer?.d)}</span>
                    {list(v.layer?.groups).map((g, $index) => (
                      <Fragment key={$index}>
                        <div style={{ borderTop: "1px solid #0E0E0F", paddingTop: "10px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(g?.k)}</span>
                          <div style={{ fontSize: "15px", marginTop: "4px" }}>{txt(g?.v)}</div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.bApparel ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)" }}>
                  <div style={{ padding: "40px", background: "#fff", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "12px" }}>
                      <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontStyle: "italic", fontSize: "56px", lineHeight: "0.84" }}>
                        Engineered
                        <br />
                        to run.
                      </span>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                        {"APPAREL & FOOTWEAR · 14 STALLS · 1 PAVILION"}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {list(v.shoe).map((s, $index) => (
                        <Fragment key={$index}>
                          <button onClick={s?.pick} style={{ display: "grid", gridTemplateColumns: "44px minmax(0,1fr) 180px", alignItems: "center", gap: "16px", border: "0", background: "none", padding: "0", cursor: "pointer", textAlign: "left" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", color: "#6B6A66" }}>{txt(s?.n)}</span>
                            <span style={sx(`height:${s?.h ?? ""};background:${s?.bg ?? ""};border:1.5px solid #0E0E0F;transform:translateX(${s?.x ?? ""});transition:transform .5s, background .3s;border-radius:${s?.r ?? ""};`)} />
                            <span style={sx(`font-weight:700;font-size:14px;color:${s?.fg ?? ""};`)}>{txt(s?.name)}</span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3A3E", maxWidth: "560px" }}>
                      {txt(v.shoeSel?.d)}{" Exhibitors: "}
                      <b>{txt(v.shoeSel?.by)}</b>
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "4px", background: "#0E0E0F" }}>
                    {list(v.materials).map((m, $index) => (
                      <Fragment key={$index}>
                        <div style={{ position: "relative", minHeight: "220px" }}>
                          <image-slot id={m?.id} shape="rect" placeholder={m?.p} />
                          <span style={{ position: "absolute", left: "12px", top: "12px", background: "#fff", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", padding: "4px 8px", pointerEvents: "none" }}>
                            {txt(m?.t)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.bOem ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "32px" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.86", display: "block", marginBottom: "28px" }}>
                    From design to global retail
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))" }}>
                    {list(v.chain).map((c, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ width: "14px", height: "14px", background: "#5B3A9E" }} />
                            <span style={{ flex: "1", height: "3px", background: "#F07C12" }} />
                          </div>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>0{txt(c?.n)}</span>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px", lineHeight: "0.9" }}>{txt(c?.t)}</span>
                          {list(c?.cos).map((co, $index) => (
                            <Fragment key={$index}>
                              <span style={{ fontSize: "13px", borderLeft: "2px solid #5B3A9E", padding: "4px 0 4px 8px", marginRight: "12px" }}>{txt(co)}</span>
                            </Fragment>
                          ))}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.bSurf ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }}>
                  <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.86" }}>{"Surfaces & turf"}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {list(v.surfTabs).map((t, $index) => (
                        <Fragment key={$index}>
                          <button onClick={t?.pick} style={sx(`height:38px;padding:0 14px;border:1px solid #0E0E0F;background:${t?.bg ?? ""};color:${t?.fg ?? ""};font:700 12px var(--f-body);letter-spacing:0.08em;cursor:pointer;`)}>
                            {txt(t?.name)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <span style={{ fontSize: "16px", lineHeight: "1.5", color: "#3A3A3E" }}>{txt(v.surf?.d)}</span>
                    <span style={{ fontSize: "14px" }}>
                      <b>Exhibitors:</b>
                      {" "}{txt(v.surf?.by)}
                    </span>
                  </div>
                  <div style={{ padding: "32px", background: "#EEE8F7", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66", marginBottom: "10px" }}>
                      SYSTEM CROSS-SECTION · ILLUSTRATIVE
                    </span>
                    {list(v.surf?.layers).map((l, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 180px", alignItems: "stretch" }}>
                          <span style={sx(`height:${l?.h ?? ""};background:${l?.c ?? ""};border-bottom:1px solid #0E0E0F;`)} />
                          <span style={{ paddingLeft: "14px", fontSize: "13px", display: "flex", alignItems: "center", borderBottom: "1px solid #BDB9B0" }}>{txt(l?.n)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section id="zone-c" data-screen-label="Zone C" style={{ scrollMarginTop: "110px", marginTop: "96px" }}>
          <div style={{ background: "#0A62BF", color: "#fff", padding: "72px 28px 56px" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "40px", alignItems: "end" }}>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "154px", lineHeight: "0.75" }}>C</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", opacity: "0.85" }}>
                  HALL 2 · SOUTH-EAST QUADRANT · 94 STALLS · 324-SEAT ARENA
                </span>
                <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,7vw,112px) * 0.72)", lineHeight: "0.85" }}>
                  Sports Tech
                  <br />
                  {"& Experience"}
                </h2>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", borderLeft: "1px solid #E3E0D8" }}>
              {list(v.cTiles).map((t, $index) => (
                <Fragment key={$index}>
                  <button onClick={t?.pick} style={sx(`text-align:left;border:0;border-right:1px solid #E3E0D8;border-bottom:4px solid ${t?.bar ?? ""};background:${t?.bg ?? ""};padding:20px 18px;cursor:pointer;display:flex;flex-direction:column;gap:8px;min-height:130px;`)}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(t?.code)}</span>
                    <span style={{ marginTop: "auto", fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "800", fontSize: "18px", lineHeight: "1", textTransform: "uppercase", color: "#0E0E0F" }}>
                      {txt(t?.name)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            {v.cTech ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", display: "grid", gridTemplateColumns: "280px minmax(0,1fr)" }}>
                  <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid #E3E0D8" }}>
                    {list(v.stakeTabs).map((s, $index) => (
                      <Fragment key={$index}>
                        <button onClick={s?.pick} style={sx(`height:76px;border:0;border-bottom:1px solid #E3E0D8;background:${s?.bg ?? ""};color:${s?.fg ?? ""};font:900 28px var(--f-display);font-stretch:62%;text-align:left;padding:0 24px;cursor:pointer;`)}>
                          {txt(s?.t)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "24px", alignContent: "start" }}>
                    {list(v.stakeItems).map((i, $index) => (
                      <Fragment key={$index}>
                        <div style={{ borderTop: "3px solid #0A62BF", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "800", fontSize: "23px", textTransform: "uppercase", lineHeight: "1" }}>
                            {txt(i?.t)}
                          </span>
                          <span style={{ fontSize: "14px", color: "#3A3A3E", lineHeight: "1.45" }}>{txt(i?.d)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(i?.co)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.cStartup ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "32px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "0" }}>
                  {list(v.startups).map((s, $index) => (
                    <Fragment key={$index}>
                      <article style={{ border: "1px solid #E3E0D8", margin: "-1px 0 0 -1px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "900", fontSize: "26px", textTransform: "uppercase" }}>{txt(s?.name)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(s?.stall)}</span>
                        </div>
                        <span style={{ fontSize: "13px", color: "#6B6A66" }}>
                          {txt(s?.country)}{" · "}{txt(s?.tech)}{" · "}{txt(s?.sport)}{" · "}
                          <b style={{ color: "#0A62BF" }}>{txt(s?.stage)}</b>
                        </span>
                        <span style={{ fontSize: "16px", lineHeight: "1.4" }}>“{txt(s?.problem)}”</span>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66", alignSelf: "center" }}>LOOKING FOR</span>
                          {list(s?.seeking).map((k, $index) => (
                            <Fragment key={$index}>
                              <span style={{ background: "#E4EEFA", color: "#0A62BF", fontSize: "12px", fontWeight: "700", padding: "4px 8px" }}>{txt(k)}</span>
                            </Fragment>
                          ))}
                        </div>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{"PITCH · "}{txt(s?.pitch)}{" · INNOVATION ARENA"}</span>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px", marginTop: "auto" }}>
                          <a href={withBase("/connect")} style={{ gridColumn: "span 2", background: "#0A62BF", color: "#fff", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em" }}>
                            Request meeting
                          </a>
                          <a href={withBase("/programme")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", boxSizing: "border-box" }}>
                            Pitch
                          </a>
                          <a href={withBase("/explore")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", boxSizing: "border-box" }}>
                            Map
                          </a>
                        </div>
                      </article>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
            {" "}
            {v.cBody ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", minHeight: "640px" }}>
                  <div style={{ position: "relative", background: "#0E0E0F" }}>
                    <image-slot id="pss-athlete" shape="rect" placeholder="Athlete photograph (full body, dark background)" />
                    {" "}
                    {list(v.nodes).map((n, $index) => (
                      <Fragment key={$index}>
                        <button onClick={n?.pick} aria-label={n?.t} style={sx(`position:absolute;left:${n?.x ?? ""};top:${n?.y ?? ""};transform:translate(-50%,-50%);display:flex;align-items:center;gap:8px;border:0;background:none;cursor:pointer;padding:0;`)}>
                          <span style={sx(`width:18px;height:18px;border-radius:50%;background:${n?.bg ?? ""};border:2px solid #fff;box-shadow:0 0 0 6px rgba(11,110,79,0.35);`)} />
                          <span style={{ background: "#fff", color: "#0E0E0F", font: "700 11px var(--f-body)", letterSpacing: "0.08em", padding: "4px 8px", whiteSpace: "nowrap" }}>
                            {txt(n?.t)}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#0A62BF" }}>
                      {"PERFORMANCE & SPORTS SCIENCE · 30 STALLS"}
                    </span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "45px", lineHeight: "0.86", textTransform: "uppercase" }}>
                      {txt(v.node?.t)}
                    </span>
                    {list(v.node?.rows).map((r, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "12px", borderTop: "1px solid #E3E0D8", padding: "10px 0", fontSize: "14px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66", paddingTop: "2px" }}>{txt(r?.k)}</span>
                          <span>{txt(r?.v)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.cArena ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.86" }}>Innovation Arena</span>
                    <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                      {list(v.phaseTabs).map((p, $index) => (
                        <Fragment key={$index}>
                          <button onClick={p?.pick} style={sx(`height:40px;padding:0 16px;border:0;border-right:1px solid #0E0E0F;background:${p?.bg ?? ""};color:${p?.fg ?? ""};font:700 12px var(--f-body);letter-spacing:0.1em;cursor:pointer;`)}>
                            {txt(p?.t)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "28px" }}>
                    <div style={{ aspectRatio: "16/9", background: "#0E0E0F", color: "#fff", position: "relative", display: "flex", alignItems: "flex-end", padding: "20px", boxSizing: "border-box" }}>
                      <span style={sx(`position:absolute;left:16px;top:16px;background:${v.arena?.badgeBg ?? ""};font-family:var(--f-label);font-size:11px;letter-spacing:0.14em;padding:5px 9px;`)}>
                        {txt(v.arena?.badge)}
                      </span>
                      <span style={{ position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66", letterSpacing: "0.14em" }}>
                        {txt(v.arena?.player)}
                      </span>
                      <span style={{ position: "relative", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9" }}>
                        {txt(v.arena?.title)}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #0E0E0F" }}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66", padding: "12px 0" }}>
                        {txt(v.arena?.listLabel)}
                      </span>
                      {list(v.arena?.list).map((s, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #E3E0D8" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "13px", color: "#0A62BF" }}>{txt(s?.a)}</span>
                            <span style={{ fontSize: "15px", fontWeight: "600" }}>{txt(s?.b)}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.cTry ? (
              <>
                <div style={{ border: "1px solid #E3E0D8", borderTop: "0", padding: "32px" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.86", display: "block", marginBottom: "20px" }}>
                    Try Sport Arena · Live experience
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1.6fr) 90px 120px 130px minmax(0,1fr) 180px", gap: "12px", padding: "10px 0", borderBottom: "2px solid #0E0E0F", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                    <span>TIME</span>
                    <span>EXPERIENCE</span>
                    <span>DURATION</span>
                    <span>CAPACITY</span>
                    <span>LOCATION</span>
                    <span>ELIGIBILITY</span>
                    <span />
                  </div>
                  {list(v.tryList).map((t, $index) => (
                    <Fragment key={$index}>
                      <div style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1.6fr) 90px 120px 130px minmax(0,1fr) 180px", gap: "12px", padding: "14px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center", fontSize: "14px" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "15px" }}>{txt(t?.time)}</span>
                        <b style={{ fontSize: "17px" }}>{txt(t?.name)}</b>
                        <span>{txt(t?.dur)}</span>
                        <span>
                          <span style={{ display: "block", height: "4px", background: "#E3E0D8" }}>
                            <span style={sx(`display:block;height:4px;background:#0A62BF;width:${t?.pct ?? ""};`)} />
                          </span>
                          <span style={{ fontSize: "12px" }}>{txt(t?.cap)}</span>
                        </span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(t?.loc)}</span>
                        <span style={{ color: "#3A3A3E" }}>{txt(t?.elig)}</span>
                        <span style={{ display: "flex", gap: "6px" }}>
                          <button onClick={t?.book} style={sx(`flex:1;height:36px;border:0;background:${t?.bookBg ?? ""};color:${t?.bookFg ?? ""};font:700 11px var(--f-body);letter-spacing:0.08em;cursor:pointer;`)}>
                            {txt(t?.bookLabel)}
                          </button>
                          <button style={{ height: "36px", padding: "0 10px", border: "1px solid #0E0E0F", background: "#fff", font: "700 11px var(--f-body)", cursor: "pointer" }}>
                            Save
                          </button>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section id="zone-d" data-screen-label="Zone D" style={{ scrollMarginTop: "110px", marginTop: "96px", paddingBottom: "96px" }}>
          <div style={{ background: "#00803F", color: "#fff", padding: "72px 28px 56px" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "40px", alignItems: "end" }}>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "154px", lineHeight: "0.75" }}>D</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", opacity: "0.85" }}>
                  HALL 2 · SOUTH-WEST QUADRANT · 6 COUNTRY PAVILIONS · 7 BUSINESS SPACES
                </span>
                <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,7vw,112px) * 0.72)", lineHeight: "0.85" }}>
                  Sports Business
                  <br />
                  {"& Investment"}
                </h2>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", borderLeft: "1px solid #E3E0D8" }}>
              {list(v.dSpaces).map((d, $index) => (
                <Fragment key={$index}>
                  <div style={{ borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", padding: "20px", display: "flex", flexDirection: "column", gap: "8px", minHeight: "120px" }}>
                    <span style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
                      <span>{txt(d?.code)}</span>
                      <span>{txt(d?.access)}</span>
                    </span>
                    <b style={{ fontSize: "17px", marginTop: "auto" }}>{txt(d?.name)}</b>
                    <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(d?.meta)}</span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", border: "1px solid #E3E0D8", borderTop: "0", minHeight: "600px" }}>
              <div style={{ position: "relative", background: "radial-gradient(circle at 50% 46%, #E4F2EA 0%, #EEF4EF 38%, #F6F4EF 72%)", overflow: "hidden" }}>
                <div ref={v.globeRef} style={{ position: "absolute", inset: "0" }} />
                <div style={{ position: "absolute", left: "16px", bottom: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {list(v.ctyBtns).map((c, $index) => (
                    <Fragment key={$index}>
                      <button onClick={c?.pick} style={sx(`height:34px;padding:0 12px;border:0;box-shadow:0 4px 14px -6px rgba(18,19,23,0.35);background:${c?.bg ?? ""};color:${c?.fg ?? ""};font:600 13px var(--f-body);cursor:pointer;`)}>
                        {txt(c?.name)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>
                  {"COUNTRY PAVILION · "}{txt(v.cty?.pav)}{" · DEMO DATA"}
                </span>
                <h3 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "50px", lineHeight: "0.85", textTransform: "uppercase" }}>
                  {txt(v.cty?.name)}
                </h3>
                <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.4" }}>{txt(v.cty?.profile)}</p>
                <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "150px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                  {list(v.cty?.rows).map((r, $index) => (
                    <Fragment key={$index}>
                      <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                      <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                    </Fragment>
                  ))}
                </dl>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginTop: "auto" }}>
                  <a href={withBase("/explore")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em" }}>
                    View pavilion
                  </a>
                  <a href={withBase("/exhibit")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                    View companies
                  </a>
                  <a href={withBase("/connect")} style={{ background: "#F07C12", color: "#0E0E0F", textDecoration: "none", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em" }}>
                    Request meeting
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default defineDC("Zone Experiences", Component, render);
