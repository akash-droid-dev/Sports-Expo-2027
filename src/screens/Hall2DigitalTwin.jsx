'use client';
// Generated from design/site/Hall 2 Digital Twin.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';
import '@/lib/maplibre';
import HallPlan from './HallPlan';
import GettingThereMap from '@/components/GettingThereMap';
import LockKeyLink from '@/components/anim/LockKeyLink';

/* global maplibregl */
class Component extends DCLogic {
  state = { w: window.innerWidth, mode: '3d', zone: null, cluster: null, roofOn: false, list: false, dest: 'apex', filters: { Food: true, Toilets: true, Information: true, Accessibility: true, Emergency: false, Stages: true, 'Meeting Rooms': false, Lounges: false }, load: 0, travel: 'Metro' };
  cityMapRef = React.createRef();
  componentDidMount() {
    this._rs = () => this.setState({ w: window.innerWidth }); window.addEventListener('resize', this._rs);
    this._l = setInterval(() => this.setState(s => { if (s.load >= 5) { clearInterval(this._l); return null; } return { load: s.load + 1 }; }), 450);
    // On phones the route schematic map is created only when asked for (src/components/GettingThereMap.jsx sets data-want).
    this._m = setInterval(() => { const el = this.cityMapRef.current; if (window.maplibregl && el && el.dataset.want) { clearInterval(this._m); this.initCity(); } }, 150);
    const h = (location.hash || '').toLowerCase(); if (h.startsWith('#zone-')) this.setState({ zone: h.slice(6).toUpperCase() });
  }
  componentWillUnmount() { clearInterval(this._l); clearInterval(this._m); this.city && this.city.remove(); }
  initCity() {
    if (document.documentElement.classList.contains('legacy')) return;
    const Y = [77.044636, 28.554862];
    const pts = { 'Yashobhoomi': Y, 'IGI Airport T3': [77.0880, 28.5555], 'Aerocity': [77.1210, 28.5490], 'New Delhi Rly Stn': [77.2194, 28.6430], 'Dwarka Sec 21 Metro': [77.0587, 28.5523] };
    try {
      const m = this.city = new maplibregl.Map({ container: this.cityMapRef.current, interactive: true, scrollZoom: false, center: [77.11, 28.585], zoom: 11.2,
        style: { version: 8, sources: { st: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, attribution: 'Esri, HERE, Garmin, © OpenStreetMap contributors' } }, layers: [{ id: 'st', type: 'raster', source: 'st' }] } });
      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      m.on('load', () => {
        const lines = [[pts['New Delhi Rly Stn'], pts['Aerocity'], pts['IGI Airport T3'], pts['Dwarka Sec 21 Metro'], Y]];
        m.addSource('r', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: lines[0] } } });
        m.addLayer({ id: 'r', type: 'line', source: 'r', paint: { 'line-color': '#F07C12', 'line-width': 4, 'line-dasharray': [2, 1] } });
        Object.entries(pts).forEach(([n, c]) => {
          const el = document.createElement('div'); const main = n === 'Yashobhoomi';
          el.style.cssText = `font:600 12px var(--f-body);background:${main ? '#0E0E0F' : '#fff'};color:${main ? '#fff' : '#0E0E0F'};border:1px solid #0E0E0F;padding:5px 8px;white-space:nowrap;`;
          el.textContent = main ? '● YASHOBHOOMI · HALL 2' : n; new maplibregl.Marker({ element: el }).setLngLat(c).addTo(m);
        });
      });
    } catch (e) {}
  }
  route(c) {
    const cx = Math.round(c.x + c.w / 2), top = c.y < 250;
    const ty = top ? c.y + c.h : c.y;
    if (c.id === 'SGM') return { pts: '500,500 500,250 643,250 643,118 643,66', len: 560 };
    const pts = `500,500 500,250 ${cx},250 ${cx},${ty}`;
    return { pts, len: 250 + Math.abs(cx - 500) + Math.abs(250 - ty) };
  }
  renderVals() {
    const D = window.ISE; const st = this.state;
    const modeDefs = [['3d', '3D EXPLORE'], ['2d', '2D MAP'], ['live', '● LIVE'], ['route', 'MY ROUTE']];
    const w = st.w, wide = w > 1280, mid = w > 860;
    const base = { cityMapRef: this.cityMapRef, cols: wide ? '220px minmax(0,1fr) 360px' : mid ? 'minmax(0,1fr) 340px' : 'minmax(0,1fr)', filterDir: wide ? 'column' : 'row', filterSpan: wide ? 'auto' : '1 / -1', loadDisplay: wide ? 'flex' : 'none', detailSpan: mid ? 'auto' : '1 / -1' };
    if (!D) return { ...base, modes: [], filters: [], loadSteps: [], zoneBtns: [], legend: [], listRows: [], panel: { rows: [] }, dest: { steps: [] }, destOpts: [], busiest: [], travelTabs: [], travel: { steps: [] }, info: [], pins: [] };
    const Z = st.zone ? D.Z[st.zone] : null; const C = st.cluster ? D.cl(st.cluster) : null;
    const dests = [
      { id: 'apex', name: 'Apex Sports India', code: 'B-SGM-017', c: 'SGM', steps: ['Follow the Sports Boulevard north', 'Turn right into Zone B', 'Enter Sports Goods Manufacturing', 'Stall 017, row 2 — on your left'] },
      { id: 'ias', name: 'Innovation Arena Stage', code: 'C-IAS', c: 'IAS', steps: ['Follow the Sports Boulevard north to the crossing', 'Turn right along the boulevard', 'Innovation Arena entrance, south side'] },
      { id: 'suv', name: 'Startup Village', code: 'C-SUV', c: 'SUV', steps: ['Follow the Sports Boulevard north', 'Turn right at the crossing', 'Startup Village, first cluster on the right'] },
      { id: 'hbl', name: 'Hosted Buyer Lounge', code: 'D-HBL', c: 'HBL', steps: ['Follow the Sports Boulevard north', 'Turn left into Zone D', 'Hosted Buyer Lounge — accreditation check'] }
    ];
    if (st.dest.startsWith('cl:')) { const cc = D.cl(st.dest.slice(3)); dests.push({ id: st.dest, name: cc.name, code: cc.zone + '-' + cc.id, c: cc.id, steps: ['Follow the Sports Boulevard north', `Turn ${cc.x < 500 ? 'left' : 'right'} into Zone ${cc.zone}`, cc.name] }); }
    const dsel = dests.find(d => d.id === st.dest) || dests[0];
    const r = this.route(D.cl(dsel.c)); const meters = Math.round(r.len * 0.62);
    const dest = { ...dsel, m: meters, min: Math.max(1, Math.round(meters / 80)) };
    const isRoute = st.mode === 'route', isLive = st.mode === 'live', is3d = st.mode === '3d';
    const pinDefs = {
      Food: [[500, 250, 'F'], [240, 250, 'F'], [760, 250, 'F']], Toilets: [[14, 250, 'WC'], [986, 250, 'WC'], [500, 14, 'WC']], Information: [[500, 462, 'i']],
      Accessibility: [[460, 486, '♿'], [540, 486, '♿']], Emergency: [[4, 120, 'EX'], [996, 120, 'EX'], [4, 380, 'EX'], [996, 380, 'EX']], Stages: [[871, 334, '★']], 'Meeting Rooms': [[318, 438, 'M'], [95, 438, 'M']], Lounges: [[228, 438, 'L'], [387, 418, 'L'], [442, 438, 'L']]
    };
    const pinBg = { Emergency: '#9E1B22', Accessibility: '#1F4E9E', Stages: '#0B6E4F', Food: '#C2610B' };
    const pins = Object.entries(pinDefs).filter(([k]) => st.filters[k]).flatMap(([k, arr]) => arr.map(([x, y, g]) => ({ x, y, glyph: g, label: k, bg: pinBg[k] })));
    const heatVals = { STA: .42, THM: .61, MYS: .2, FED: .33, HER: .55, SGM: .72, SIV: .48, OEM: .3, APF: .39, SRF: .22, LSE: .26, CTY: .5, ISX: .81, B2B: .66, HBL: .35, MOU: .4, INV: .2, FDL: .15, CEO: .1, STI: .77, IAS: .94, SUV: .58, PSS: .44, IEX: .68, TSA: .88 };
    const origin = { A: '25% 30%', B: '75% 30%', C: '75% 70%', D: '25% 70%' };
    const zoneHref = withBase('/zones#zone-') + ((C ? C.zone : st.zone) || 'b').toLowerCase();
    const walk = c => Math.max(1, Math.round(this.route(c).len * 0.62 / 80)) + ' min';
    const travelDefs = {
      Metro: { time: '~21 MIN', src: 'NEW DELHI → SECTOR 25 · PMO', steps: ['Board the Airport Express Line (orange) at New Delhi', 'Ride through Shivaji Stadium, Dhaula Kuan, Aerocity, IGI T3', 'Change at Dwarka Sector 21 only if your train terminates there', 'Exit at Yashobhoomi Dwarka Sector 25 — underground, inside the venue'] },
      Airport: { time: '15 MIN', src: 'SAMPLE · FROM IGI T3', steps: ['Follow signs to Airport Express Metro at Terminal 3', 'Board southbound towards Yashobhoomi Dwarka Sector 25', 'Exit to the Hall 2 concourse', 'International delegate desk at Main Entrance'] },
      'Car / Taxi': { time: '45 MIN', src: 'SAMPLE · FROM CONNAUGHT PLACE', steps: ['Take NH-48 towards the airport', 'Exit to Dwarka Expressway / UER-II', 'Follow Yashobhoomi Hall 2 signage', 'Drop-off at Hall 2 forecourt, Gate 3 (sample)'] },
      'Hotel Shuttle': { time: '25 MIN', src: 'SAMPLE · DEMO SERVICE', steps: ['Aerocity hotel cluster pick-up, every 20 minutes', 'First departure 08:15, last return 19:30', 'Show your digital pass to board', 'Arrives at Hall 2 forecourt'] },
      Parking: { time: 'P2', src: 'SAMPLE', steps: ['Pre-book a slot in My Expo', 'Scan the QR at the P2 barrier', 'Accessible bays nearest the Hall 2 lift core', 'Covered walkway to Main Entrance — 4 min'] }
    };
    const tv = travelDefs[st.travel];
    return {
      ...base,
      modes: modeDefs.map(([id, label]) => ({ label, bg: st.mode === id ? '#0E0E0F' : '#fff', fg: st.mode === id ? '#fff' : id === 'live' ? '#9E1B22' : '#0E0E0F', pick: () => this.setState({ mode: id }) })),
      hasZone: !!Z, zoneId: Z ? Z.id : '', zoneColor: Z ? Z.color : '', zoneNameUpper: Z ? Z.name.toUpperCase() : '', crumbHallColor: Z ? '#6B6A66' : '#0E0E0F',
      hasCluster: !!C, clusterId: st.cluster, clusterNameUpper: C ? C.name.toUpperCase() : '',
      resetZone: () => this.setState({ zone: null, cluster: null }),
      filters: ['Exhibitors', 'Products', 'Countries', 'States', 'Startups', 'Experiences', 'Stages', 'Meeting Rooms', 'Lounges', 'Food', 'Toilets', 'Information', 'Accessibility', 'Emergency'].map(k => {
        const on = !!st.filters[k]; const g = pinDefs[k] ? pinDefs[k][0][2] : '';
        return { label: k, on, glyph: g, box: on ? '#0E0E0F' : '#fff', check: on ? '✓' : '', toggle: () => this.setState(s => ({ filters: { ...s.filters, [k]: !s.filters[k] } })) };
      }),
      loadSteps: ['Page shell', 'Earth', 'Yashobhoomi assets', 'Hall 2 model', 'Zone detail', 'Stall model — on demand'].map((l, i) => ({ label: l, mark: i < st.load ? '✓' : i === st.load ? '…' : '·', color: i <= st.load ? '#0E0E0F' : '#A29E95' })),
      modeKicker: isRoute ? 'INDOOR ROUTING' : isLive ? 'LIVE VENUE' : is3d ? '3D EXPLORE · DIGITAL TWIN' : '2D MAP',
      headline: isRoute ? 'TO ' + dest.name.toUpperCase() : isLive ? 'WHERE IT’S HAPPENING' : C ? C.name.toUpperCase() : Z ? 'ZONE ' + Z.id + ' · ' + Z.name.toUpperCase() : 'EXHIBITION HALL 2',
      zoneBtns: D.zones.map(z => ({ id: z.id, color: z.color, bg: st.zone === z.id ? z.color : '#fff', fg: st.zone === z.id ? '#fff' : z.color, pick: () => this.setState({ zone: st.zone === z.id ? null : z.id, cluster: null, mode: st.mode === 'route' ? '3d' : st.mode }) })),
      is3d, roof: is3d && st.roofOn ? 1 : 0, roofLabel: st.roofOn ? 'Lift roof' : 'Show roof', toggleRoof: () => this.setState({ roofOn: !st.roofOn }),
      listView: st.list, showMap: !st.list, listLabel: st.list ? 'Map view' : 'List view', toggleList: () => this.setState({ list: !st.list }),
      camTransform: Z && !isRoute && !isLive ? 'scale(1.55)' : 'scale(1)', camOrigin: Z ? origin[Z.id] : '50% 50%',
      pickCluster: c => this.setState({ cluster: c.id, zone: c.zone, mode: st.mode === 'route' || st.mode === 'live' ? (st.mode === 'live' ? 'live' : '3d') : st.mode }),
      pins, heat: isLive ? heatVals : null, showRoute: isRoute, routePts: r.pts,
      legend: D.zones,
      listRows: D.clusters.map(c => ({ zone: 'Zone ' + c.zone, color: D.Z[c.zone].color, name: c.name, meta: c.meta, code: c.zone + '-' + c.id, walk: walk(c), go: () => this.setState({ mode: 'route', dest: 'cl:' + c.id, list: false }) })),
      isRoute, isLive, isExplore: !isRoute && !isLive, dest,
      destOpts: dests.slice(0, 4).map(d => ({ ...d, bg: d.id === dest.id ? '#F6F4EF' : 'transparent', pick: () => this.setState({ dest: d.id }) })),
      busiest: Object.entries(heatVals).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, v]) => ({ name: D.cl(id).name, pct: Math.round(v * 100) + '%' })),
      navHere: () => this.setState({ mode: 'route', dest: C ? (C.id === 'SGM' ? 'apex' : 'cl:' + C.id) : 'apex' }),
      panel: C ? { color: D.Z[C.zone].color, kicker: `ZONE ${C.zone} · ${C.zone}-${C.id}`, title: C.name, text: `${C.meta}. ${walk(C)} walk from Main Entrance.`, zoneHref, rows: (D.exhibitors.filter(e => e.cluster === C.id).map(e => ({ name: e.name, meta: e.stall, pick: () => {} }))).concat(D.exhibitors.some(e => e.cluster === C.id) ? [] : [{ name: 'Exhibitor list publishes after allocation', meta: 'PENDING', pick: () => {} }]) }
        : Z ? { color: Z.color, kicker: 'ZONE ' + Z.id, title: Z.name, text: Z.blurb, zoneHref, rows: D.clusters.filter(c => c.zone === Z.id).map(c => ({ name: c.name, meta: c.meta, pick: () => this.setState({ cluster: c.id }) })) }
        : { color: '#0E0E0F', kicker: 'EXHIBITION HALL 2 · YASHOBHOOMI', title: 'Four event zones', text: 'Select a zone or click any cluster on the plan. The Sports Boulevard connects every zone to the Main Entrance.', zoneHref, rows: D.zones.map(z => ({ name: 'Zone ' + z.id + ' · ' + z.name, meta: D.clusters.filter(c => c.zone === z.id).length + ' areas', pick: () => this.setState({ zone: z.id }) })) },
      travelTabs: Object.keys(travelDefs).map(k => ({ label: k.toUpperCase(), bg: st.travel === k ? '#0E0E0F' : '#fff', fg: st.travel === k ? '#fff' : '#0E0E0F', pick: () => this.setState({ travel: k }) })),
      travelKey: st.travel,
      travel: { ...tv, steps: tv.steps.map((t, i) => ({ n: String(i + 1).padStart(2, '0'), t })) },
      info: [
        { t: 'Food', color: '#C2610B', d: 'Three food courts on the Sports Boulevard and the Networking Café in Zone D. Vegetarian, vegan and Jain options marked. (sample)' },
        { t: 'Accessibility', color: '#1F4E9E', d: 'Step-free routes throughout Hall 2, accessible toilets at every core, wheelchair loan at Information, quiet room near the Main Entrance.' },
        { t: 'Registration', color: '#0E0E0F', d: 'Collect nothing — your digital pass is your entry. Badge printing desks for exhibitors and VIPs at the Registration Area.' },
        { t: 'Hotels', color: '#0E0E0F', d: 'Partner rates in Aerocity and Dwarka with a dedicated shuttle loop. (demo partners)' },
        { t: 'FAQ', color: '#0E0E0F', d: 'Entry age, bag policy, re-entry, Wi-Fi, lost and found, media access. 42 answers in the Helpdesk.' },
        { t: 'Emergency', color: '#9E1B22', d: 'Medical post beside Information. Emergency exits on all four façades. Push alerts override all app notifications.' }
      ]
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
          <a href={withBase("/attend")} style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            My Expo
          </a>
          <a href={withBase("/attend")} style={{ background: "#F07C12", color: "#0E0E0F", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", height: "36px", display: "flex", alignItems: "center", padding: "0 16px" }}>
            Register
          </a>
        </header>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", padding: "14px 28px", borderBottom: "1px solid #E3E0D8" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", gap: "10px", alignItems: "center", fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.12em", flexWrap: "wrap" }}>
            <a href={withBase("/")} style={{ color: "#6B6A66", textDecoration: "none" }}>YASHOBHOOMI</a>
            <span style={{ color: "#A29E95" }}>→</span>
            <button onClick={v.resetZone} style={sx(`background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;cursor:pointer;color:${v.crumbHallColor ?? ""};`)}>
              EXHIBITION HALL 2
            </button>
            {v.hasZone ? (
              <>
                <span style={{ color: "#A29E95" }}>→</span>
                <span style={sx(`color:${v.zoneColor ?? ""};font-weight:500;`)}>{"ZONE "}{txt(v.zoneId)}{" · "}{txt(v.zoneNameUpper)}</span>
              </>
            ) : null}
            {v.hasCluster ? (
              <>
                <span style={{ color: "#A29E95" }}>→</span>
                <span style={{ color: "#0E0E0F" }}>{txt(v.clusterNameUpper)}</span>
              </>
            ) : null}
          </nav>
          <div role="tablist" aria-label="Map mode" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
            {list(v.modes).map((m, $index) => (
              <Fragment key={$index}>
                <button role="tab" onClick={m?.pick} style={sx(`height:38px;padding:0 16px;border:0;border-right:1px solid #0E0E0F;background:${m?.bg ?? ""};color:${m?.fg ?? ""};font:700 12px var(--f-body);letter-spacing:0.1em;cursor:pointer;display:flex;align-items:center;gap:6px;`)}>
                  {txt(m?.label)}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
        <section data-screen-label="Hall 2 twin" style={sx(`display:grid;grid-template-columns:${v.cols ?? ""};min-height:calc(100vh - 128px);`)}>
          <aside aria-label="Map filters" style={sx(`border-right:1px solid #E3E0D8;padding:20px;display:flex;flex-direction:${v.filterDir ?? ""};flex-wrap:wrap;gap:4px 18px;background:#FBFAF7;grid-column:${v.filterSpan ?? ""};`)}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66", marginBottom: "8px" }}>SHOW ON MAP</span>
            {list(v.filters).map((f, $index) => (
              <Fragment key={$index}>
                <button onClick={f?.toggle} aria-pressed={f?.on} style={{ display: "flex", alignItems: "center", gap: "10px", height: "34px", border: "0", background: "none", padding: "0", cursor: "pointer", font: "500 14px var(--f-body)", color: "#0E0E0F", textAlign: "left" }}>
                  <span style={sx(`width:16px;height:16px;border:1.5px solid #0E0E0F;background:${f?.box ?? ""};display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;`)}>
                    {txt(f?.check)}
                  </span>
                  <span style={{ flex: "1" }}>{txt(f?.label)}</span>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", color: "#6B6A66" }}>{txt(f?.glyph)}</span>
                </button>
              </Fragment>
            ))}
            <div style={sx(`margin-top:auto;padding-top:20px;border-top:1px solid #E3E0D8;display:${v.loadDisplay ?? ""};flex-direction:column;gap:8px;`)}>
              {" "}
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>LOADING</span>
              {" "}
              {list(v.loadSteps).map((l, $index) => (
                <Fragment key={$index}>
                  <span style={sx(`display:flex;gap:8px;align-items:center;font-size:12px;color:${l?.color ?? ""};`)}>
                    <span style={{ fontFamily: "var(--f-label)", width: "14px" }}>{txt(l?.mark)}</span>
                    {txt(l?.label)}
                  </span>
                </Fragment>
              ))}
              {" "}
            </div>
          </aside>
          <div style={{ position: "relative", overflow: "hidden", background: "#F6F4EF", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px 28px 0", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.18em", color: "#6B6A66" }}>{txt(v.modeKicker)}</div>
                <h1 style={{ margin: "6px 0 0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(40px,4vw,64px) * 0.72)", lineHeight: "0.9" }}>
                  {txt(v.headline)}
                </h1>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {list(v.zoneBtns).map((z, $index) => (
                  <Fragment key={$index}>
                    <button onClick={z?.pick} style={sx(`height:40px;padding:0 14px;border:1px solid ${z?.color ?? ""};background:${z?.bg ?? ""};color:${z?.fg ?? ""};font:800 14px var(--f-display);font-stretch:75%;letter-spacing:0.04em;cursor:pointer;`)}>
                      {"Zone "}{txt(z?.id)}
                    </button>
                  </Fragment>
                ))}
                {v.is3d ? (
                  <>
                    <button onClick={v.toggleRoof} style={{ height: "40px", padding: "0 14px", border: "1px solid #0E0E0F", background: "#0E0E0F", color: "#fff", font: "700 12px var(--f-body)", letterSpacing: "0.1em", cursor: "pointer" }}>
                      {txt(v.roofLabel)}
                    </button>
                  </>
                ) : null}
                <button onClick={v.toggleList} style={{ height: "40px", padding: "0 14px", border: "1px solid #0E0E0F", background: "#fff", color: "#0E0E0F", font: "700 12px var(--f-body)", letterSpacing: "0.1em", cursor: "pointer" }}>
                  {txt(v.listLabel)}
                </button>
              </div>
            </div>
            {v.showMap ? (
              <>
                <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px", overflow: "hidden" }}>
                  <div style={sx(`width:100%;max-width:1100px;transition:transform 1.2s cubic-bezier(.2,.7,.2,1);transform:${v.camTransform ?? ""};transform-origin:${v.camOrigin ?? ""};`)}>
                    <HallPlan iso={v.is3d} roof={v.roof} activeZone={v.zoneId} selectedCluster={v.clusterId} onCluster={v.pickCluster} pins={v.pins} heat={v.heat} route={v.showRoute} routePts={v.routePts} cells={true} />
                  </div>
                </div>
              </>
            ) : null}
            {v.listView ? (
              <>
                <div style={{ flex: "1", padding: "24px 28px", overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <caption style={{ textAlign: "left", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66", paddingBottom: "12px" }}>
                      TEXT ALTERNATIVE TO THE HALL 2 MAP
                    </caption>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #0E0E0F", textAlign: "left" }}>
                        <th style={{ padding: "10px 8px 10px 0" }}>Zone</th>
                        <th style={{ padding: "10px 8px" }}>Destination</th>
                        <th style={{ padding: "10px 8px" }}>Capacity</th>
                        <th style={{ padding: "10px 8px" }}>Code</th>
                        <th style={{ padding: "10px 8px" }}>From entrance</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {list(v.listRows).map((r, $index) => (
                        <Fragment key={$index}>
                          <tr style={{ borderBottom: "1px solid #E3E0D8" }}>
                            <td style={{ padding: "10px 8px 10px 0" }}>
                              <span style={sx(`display:inline-block;width:10px;height:10px;background:${r?.color ?? ""};margin-right:8px;`)} />
                              {txt(r?.zone)}
                            </td>
                            <td style={{ padding: "10px 8px", fontWeight: "600" }}>{txt(r?.name)}</td>
                            <td style={{ padding: "10px 8px" }}>{txt(r?.meta)}</td>
                            <td style={{ padding: "10px 8px", fontFamily: "var(--f-label)" }}>{txt(r?.code)}</td>
                            <td style={{ padding: "10px 8px" }}>{txt(r?.walk)}</td>
                            <td>
                              <button onClick={r?.go} style={{ border: "1px solid #0E0E0F", background: "none", height: "30px", padding: "0 10px", font: "700 11px var(--f-body)", letterSpacing: "0.08em", cursor: "pointer" }}>
                                Navigate
                              </button>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
            <div style={{ display: "flex", gap: "20px", padding: "0 28px 20px", flexWrap: "wrap", fontSize: "12px", color: "#3A3A3E" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "22px", height: "8px", background: "#F07C12" }} />
                Sports Boulevard
              </span>
              {list(v.legend).map((l, $index) => (
                <Fragment key={$index}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={sx(`width:12px;height:12px;background:${l?.color ?? ""};`)} />
                    Zone{txt(l?.id)}·{txt(l?.short)}
                  </span>
                </Fragment>
              ))}
              <span style={{ marginLeft: "auto", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.12em", color: "#6B6A66" }}>
                SCHEMATIC · DERIVED FROM HALL 2 LAYOUT DRAWING · NOT TO SCALE
              </span>
            </div>
          </div>
          <aside aria-label="Details" style={sx(`grid-column:${v.detailSpan ?? ""};border-left:1px solid #E3E0D8;padding:24px;display:flex;flex-direction:column;gap:18px;overflow:auto;`)}>
            {v.isRoute ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>MY ROUTE</span>
                  <div style={{ border: "1px solid #0E0E0F" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #E3E0D8", display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F07C12", border: "2px solid #0E0E0F" }} />
                      <span>
                        <span style={{ display: "block", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>YOU ARE HERE</span>
                        <b>Main Entrance</b>
                      </span>
                    </div>
                    <div style={{ padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", background: "#0E0E0F" }} />
                      <span>
                        <span style={{ display: "block", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>DESTINATION</span>
                        <b>{txt(v.dest?.name)}</b>
                        {" "}
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(v.dest?.code)}</span>
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "50px", lineHeight: "0.85" }}>{txt(v.dest?.min)}{" min"}</span>
                    <span style={{ color: "#6B6A66" }}>{"walk · "}{txt(v.dest?.m)}{" m · step-free"}</span>
                  </div>
                  <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", borderLeft: "2px solid #F07C12", marginLeft: "5px" }}>
                    {list(v.dest?.steps).map((s, $index) => (
                      <Fragment key={$index}>
                        <li style={{ padding: "8px 0 8px 16px", fontSize: "15px", position: "relative" }}>
                          <span style={{ position: "absolute", left: "-6px", top: "14px", width: "10px", height: "10px", background: "#fff", border: "2px solid #0E0E0F", borderRadius: "50%" }} />
                          {txt(s)}
                        </li>
                      </Fragment>
                    ))}
                  </ol>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66", marginTop: "8px" }}>CHANGE DESTINATION</span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {list(v.destOpts).map((d, $index) => (
                      <Fragment key={$index}>
                        <button onClick={d?.pick} style={sx(`text-align:left;border:0;border-bottom:1px solid #E3E0D8;background:${d?.bg ?? ""};padding:10px 8px;font:500 14px var(--f-body);cursor:pointer;display:flex;justify-content:space-between;`)}>
                          <span>{txt(d?.name)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(d?.code)}</span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <a href={withBase("/mobile")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", letterSpacing: "0.1em" }}>
                    Send route to mobile app
                  </a>
                </div>
              </>
            ) : null}
            {v.isLive ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#9E1B22", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9E1B22", animation: "iseBlink 1.2s infinite" }} />
                    LIVE · DAY 2 · 10:12 (DEMO)
                  </span>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9" }}>Hall occupancy 6,420</span>
                  <span style={{ fontSize: "14px", color: "#3A3A3E" }}>Crowd density updates every 2 minutes from entry scans and Wi-Fi presence (demo data).</span>
                  <div style={{ borderTop: "1px solid #E3E0D8" }}>
                    {list(v.busiest).map((b, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 60px", gap: "8px", padding: "10px 0", borderBottom: "1px solid #E3E0D8", fontSize: "14px", alignItems: "center" }}>
                          <span>
                            {txt(b?.name)}
                            <span style={{ display: "block", height: "4px", background: "#E3E0D8", marginTop: "6px" }}>
                              <span style={sx(`display:block;height:4px;background:#9E1B22;width:${b?.pct ?? ""};`)} />
                            </span>
                          </span>
                          <span style={{ fontFamily: "var(--f-label)", textAlign: "right" }}>{txt(b?.pct)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ background: "#0E0E0F", color: "#fff", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#F07C12" }}>● LIVE NOW · INNOVATION ARENA</span>
                    <b style={{ fontSize: "17px" }}>The Future of AI Coaching</b>
                    <a href={withBase("/programme")} style={{ color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" }}>Watch →</a>
                  </div>
                </div>
              </>
            ) : null}
            {v.isExplore ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={sx(`font-family:var(--f-label);font-size:11px;letter-spacing:0.16em;color:${v.panel?.color ?? ""};`)}>{txt(v.panel?.kicker)}</span>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "33px", lineHeight: "0.88", textTransform: "uppercase" }}>
                    {txt(v.panel?.title)}
                  </span>
                  <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3A3E" }}>{txt(v.panel?.text)}</span>
                  <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #E3E0D8" }}>
                    {list(v.panel?.rows).map((r, $index) => (
                      <Fragment key={$index}>
                        <button onClick={r?.pick} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "11px 0", border: "0", borderBottom: "1px solid #E3E0D8", background: "none", cursor: "pointer", textAlign: "left", font: "500 14px var(--f-body)", color: "#0E0E0F" }}>
                          <span>{txt(r?.name)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66", whiteSpace: "nowrap" }}>{txt(r?.meta)}</span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <a href={v.panel?.zoneHref} style={{ gridColumn: "1 / -1", background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em" }}>
                      Enter zone experience →
                    </a>
                    <button onClick={v.navHere} style={{ border: "1px solid #0E0E0F", background: "#fff", height: "44px", font: "700 12px var(--f-body)", letterSpacing: "0.1em", cursor: "pointer" }}>
                      Navigate
                    </button>
                    <LockKeyLink href={withBase("/exhibit")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em", boxSizing: "border-box" }}>
                      Book a stall
                    </LockKeyLink>
                  </div>
                </div>
              </>
            ) : null}
          </aside>
        </section>
        <section id="getting-there" data-screen-label="Getting there" style={{ borderTop: "2px solid #0E0E0F", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", minHeight: "640px" }}>
          <div style={{ padding: "56px 28px", display: "flex", flexDirection: "column", gap: "22px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em" }}>PLAN YOUR VISIT · GETTING TO YASHOBHOOMI</span>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,5vw,88px) * 0.72)", lineHeight: "0.86" }}>
              Sector 25,
              <br />
              Dwarka.
            </h2>
            <div role="tablist" style={{ display: "flex", flexWrap: "wrap", border: "1px solid #0E0E0F", alignSelf: "flex-start" }}>
              {list(v.travelTabs).map((t, $index) => (
                <Fragment key={$index}>
                  <button role="tab" onClick={t?.pick} style={sx(`height:40px;padding:0 14px;border:0;border-right:1px solid #0E0E0F;background:${t?.bg ?? ""};color:${t?.fg ?? ""};font:700 12px var(--f-body);letter-spacing:0.08em;cursor:pointer;`)}>
                    {txt(t?.label)}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "56px", lineHeight: "0.85" }}>{txt(v.travel?.time)}</span>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.12em", color: "#6B6A66" }}>{txt(v.travel?.src)}</span>
            </div>
            <ol style={{ margin: "0", padding: "0", listStyle: "none", borderTop: "1px solid #E3E0D8" }}>
              {list(v.travel?.steps).map((s, $index) => (
                <Fragment key={$index}>
                  <li style={{ display: "grid", gridTemplateColumns: "32px 1fr", padding: "12px 0", borderBottom: "1px solid #E3E0D8", fontSize: "15px" }}>
                    <span style={{ fontFamily: "var(--f-label)", color: "#C2610B" }}>{txt(s?.n)}</span>
                    {txt(s?.t)}
                  </li>
                </Fragment>
              ))}
            </ol>
            <span style={{ fontSize: "13px", color: "#6B6A66" }}>Times are sample values unless a source is shown. Verify before travel.</span>
          </div>
          <GettingThereMap travel={v.travelKey} cityMapRef={v.cityMapRef} />
        </section>
        <section data-screen-label="Visitor info" style={{ padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "24px", marginBottom: "40px" }}>
            <div style={{ aspectRatio: "3/2", position: "relative" }}>
              <image-slot id="twin-yasho-hall" shape="rect" placeholder="Official photograph — Exhibition Hall 2 interior" />
            </div>
            <div style={{ aspectRatio: "3/2", position: "relative" }}>
              <image-slot id="twin-yasho-foyer" shape="rect" placeholder="Official photograph — Grand Foyer" />
            </div>
            <div style={{ aspectRatio: "3/2", position: "relative" }}>
              <image-slot id="twin-yasho-metro" shape="rect" placeholder="Official photograph — Sector 25 metro concourse" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", borderTop: "2px solid #0E0E0F" }}>
            {list(v.info).map((i, $index) => (
              <Fragment key={$index}>
                <div style={{ padding: "24px 24px 24px 0", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={sx(`font-family:var(--f-display);font-stretch:62%;font-weight:800;font-size:25px;text-transform:uppercase;color:${i?.color ?? ""};`)}>
                    {txt(i?.t)}
                  </span>
                  <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3A3E" }}>{txt(i?.d)}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default defineDC("Hall 2 Digital Twin", Component, render);
