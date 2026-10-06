'use client';
// Generated from design/site/Exhibit.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import RegisterCta from '@/components/platform/RegisterCta';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';
import HallPlan from './HallPlan';

/* global maplibregl */
class Component extends DCLogic {
  state = { prod: 1, view: '3d', chosen: null, invZone: 'B', invCluster: 'SGM', stall: null, preferred: null, dir: 'ex', ex: 'apex', saved: {}, prodOpen: null, step: 0, submitted: false, status: 'PENDING', form: {}, chips: { industry: ['Sports goods manufacturing'], reps: [] } };
  P = [
    { name: 'Standard Booth', size: '3 × 3 m · 9 m²', w: 3, d: 3, h: 2.5, custom: 'LOW', suit: 'First-time exhibitors, startups and SMEs', cap: '4 people', brand: 'Fascia name board + 3 wall panels', util: '1 × 5A socket · 3 spotlights', inc: ['Fascia', 'Table', '3 chairs', 'Info counter', 'Spotlights', 'Wastebasket'], zones: ['B', 'C'], furn: [{ x: .1, y: .55, w: .35, d: .25, z: 18, c: '#0E0E0F' }] },
    { name: 'Premium Booth', size: '6 × 3 m · 18 m²', w: 6, d: 3, h: 2.5, custom: 'MEDIUM', suit: 'Growing brands / premium product showcase', cap: '8 people', brand: 'Fascia, full back-wall graphic, counter wrap', util: '2 × 15A sockets · track lighting · Wi-Fi', inc: ['Reception counter', 'Display wall', 'Lighting', 'Furniture', 'Storage', 'Power'], zones: ['B', 'C'], furn: [{ x: .06, y: .6, w: .22, d: .25, z: 18, c: '#F07C12' }, { x: .6, y: .1, w: .3, d: .18, z: 30, c: '#fff' }, { x: .78, y: .55, w: .14, d: .35, z: 22, c: '#3A3A3E' }] },
    { name: 'Raw Space', size: 'from 36 m²', w: 6, d: 6, h: 4, custom: 'HIGH', suit: 'Established brands with their own stand builder', cap: '15+ people', brand: 'Fully custom build, up to 4 m height (sample)', util: '3-phase power on request · water point', inc: ['Floor space only', 'Power point on request', 'Build-up window'], zones: ['B', 'C', 'D'], furn: [] },
    { name: 'Sector Pavilion', size: '100–300+ m²', w: 12, d: 12, h: 4, custom: 'HIGH', suit: 'Industry associations, sector groupings and clusters', cap: '60+ people', brand: 'Pavilion identity, pod graphics, entrance arch', util: 'Distributed power, shared storage, meeting pod', inc: ['Shared lounge', 'Exhibitor pods', 'Meeting pod', 'Storage'], zones: ['B', 'C'], furn: [{ x: .08, y: .08, w: .25, d: .25, z: 14, c: '#fff' }, { x: .4, y: .08, w: .25, d: .25, z: 14, c: '#fff' }, { x: .08, y: .5, w: .25, d: .25, z: 14, c: '#fff' }, { x: .6, y: .55, w: .3, d: .3, z: 8, c: '#F07C12' }] },
    { name: 'State Pavilion', size: '200–500+ m²', w: 16, d: 16, h: 5, custom: 'HIGH', suit: 'State governments and Union Territories', cap: '120+ people', brand: 'State identity, immersive media walls', util: 'AV, stage power, hospitality', inc: ['Hero installation', 'Stage', 'Partner pods', 'Hospitality'], zones: ['A'], furn: [{ x: .3, y: .3, w: .4, d: .4, z: 30, c: '#9E1B22' }, { x: .05, y: .7, w: .2, d: .2, z: 10, c: '#fff' }] },
    { name: 'Country Pavilion', size: '250–600+ m²', w: 20, d: 16, h: 5, custom: 'HIGH', suit: 'National delegations and trade agencies', cap: '150+ people', brand: 'National identity, delegation lounge', util: 'AV, hospitality, private meeting rooms', inc: ['Delegation lounge', 'Company pods', 'Meeting rooms', 'Hospitality'], zones: ['D'], furn: [{ x: .05, y: .05, w: .3, d: .3, z: 24, c: '#0E0E0F' }, { x: .45, y: .55, w: .2, d: .2, z: 12, c: '#fff' }, { x: .7, y: .55, w: .2, d: .2, z: 12, c: '#fff' }] },
    { name: 'Hero Experience', size: '500+ m²', w: 24, d: 22, h: 6, custom: 'BESPOKE', suit: 'Title partners and flagship brands', cap: '250+ people', brand: 'Architectural build, rigging, content programme', util: 'Rigging points, broadcast power, dedicated crew', inc: ['Signature structure', 'Content stage', 'Try-zone', 'VIP lounge'], zones: ['A', 'C'], furn: [{ x: .2, y: .2, w: .6, d: .6, z: 50, c: '#F07C12' }] }
  ];
  renderVals() {
    const D = window.ISE; const s = this.state; const P = this.P[s.prod];
    const sel = (on, c = '#0E0E0F') => ({ bg: on ? c : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    const scale = Math.min(380 / P.w, 300 / P.d, 64);
    const fw = P.w * scale, fd = P.d * scale, wh = Math.min(P.h * scale, 170);
    const cams = { '3d': 'rotateX(58deg) rotateZ(-34deg)', top: 'rotateX(0deg)', front: 'rotateX(80deg) translateY(-30px)', interior: 'rotateX(64deg) rotateZ(-14deg) scale(1.5) translateY(20px)' };
    const chosenP = s.chosen != null ? this.P[s.chosen] : null;
    const ro = { why: [], steps: [], prodTabs: [], viewTabs: [], booth: { furn: [] }, prod: { rows: [], inc: [] }, invZones: [], invClusters: [], invStats: [], stallRows: [], dirTabs: [], exList: [], ex: { prods: [] }, prodList: [], wiz: [], cur: {}, fields: [], statusTabs: [], status: {}, track: [], pd: {} };
    if (!D) return ro;
    const cl = D.cl(s.invCluster);
    const stallInfo = s.stall;
    const exs = D.exhibitors; const E = exs.find(e => e.id === s.ex);
    const allProds = D.products;
    const pd = s.prodOpen != null ? { ...allProds[s.prodOpen], slot: 'prod-detail-' + s.prodOpen } : {};
    // stall stats
    const statusOf = st => ({ available: ['AVAILABLE', '#0B6E4F'], reserved: ['RESERVED', '#C2610B'], allocated: ['ALLOCATED', '#3A3A3E'], blocked: ['BLOCKED', '#6B6A66'] })[st];
    const zoneClusters = D.clusters.filter(c => c.zone === s.invZone);
    const stallRows = stallInfo ? (() => { const c = stallInfo.cluster; const row = Math.floor(stallInfo.index / (c.cols || 1)) + 1; const dist = Math.round((250 + Math.abs(c.x + c.w / 2 - 500) + Math.abs(250 - (c.y < 250 ? c.y + c.h : c.y))) * 0.62);
      return [{ k: 'Location', v: `Zone ${c.zone} · ${c.name} · row ${row}` }, { k: 'Size', v: chosenP && chosenP.w <= 6 ? chosenP.size : '3 × 3 m · 9 m² (combinable)' }, { k: 'Type', v: row === 1 || row === Math.ceil(c.n / c.cols) ? 'Corner / aisle-facing' : 'Inline' }, { k: 'Neighbours', v: D.clusters.filter(x => x.zone === c.zone && x.id !== c.id).slice(0, 3).map(x => x.name).join(', ') }, { k: 'From entrance', v: dist + ' m · ' + Math.max(1, Math.round(dist / 80)) + ' min walk' }, { k: 'Nearby', v: 'Food court 40 m · WC 60 m · Info 120 m (approx.)' }, { k: 'Boulevard', v: c.y < 250 ? 'Faces Sports Boulevard (south)' : 'Faces Sports Boulevard (north)' }]; })() : [];
    // wizard
    const W = [
      { t: 'Create account', d: 'One account for your company. Representatives are invited later.', f: [['email', 'Work email', 'rahul@apexsports.in'], ['pw', 'Password', '••••••••••'], ['name', 'Your name', 'Rahul Bhandari'], ['phone', 'Mobile (OTP)', '+91 98 7654 3210']] },
      { t: 'Company profile', d: 'This becomes your public exhibitor profile.', f: [['co', 'Company name', 'Apex Sports India Pvt. Ltd.'], ['city', 'City / country', 'Jalandhar, India'], ['web', 'Website', 'apexsports.example'], ['size', 'Company size', null, 'select', ['1–50', '51–250', '251–1,000', '1,000+']], ['about', 'About the company', 'Football equipment manufacturer and exporter since 1987 (demo).', 'text', null, '1 / -1']] },
      { t: 'Company verification', d: 'We verify every exhibitor before allocation.', f: [['gst', 'GSTIN', '03AABCA1234F1Z5'], ['iec', 'Import Export Code', '0301234567'], ['coi', 'Certificate of incorporation', 'COI_ApexSports.pdf', 'file'], ['ver', 'Status', 'Automatic GST check passed. Manual review in 1–2 working days.', 'info']] },
      { t: 'Select industry', d: 'Used for buyer matchmaking.', f: [['industry', 'Industries', null, 'chips', ['Sports goods manufacturing', 'Apparel & footwear', 'Infrastructure', 'SportsTech', 'Surfaces', 'Services'], '1 / -1']] },
      { t: 'Exhibition category', d: 'Choose the zone and cluster you belong in.', f: [['zone', 'Zone', null, 'select', ['B — Sports Goods & Infrastructure', 'A — India Sports & Heritage', 'C — Sports Tech & Experience', 'D — Sports Business & Investment']], ['cluster', 'Cluster', null, 'select', ['Sports Goods Manufacturing', 'OEM / ODM & Supply Chain', 'Apparel & Footwear']]] },
      { t: 'Stall product', d: 'Selected from the Exhibition Product Architecture.', f: [['p', 'Product', (chosenP || this.P[1]).name + ' · ' + (chosenP || this.P[1]).size + ' (sample configuration)', 'info', null, '1 / -1']] },
      { t: 'Available locations', d: 'Live inventory for your cluster.', f: [['loc', 'Inventory', `${cl.name}: ${Math.round(cl.n * 0.35)} available of ${cl.n} (demo). Open the map above to choose.`, 'info', null, '1 / -1']] },
      { t: 'Preferred location', d: 'Allocation is confirmed by the organiser after approval.', f: [['pref', 'First preference', s.preferred || 'B-SGM-017'], ['alt1', 'Second preference', 'B-SGM-019'], ['alt2', 'Third preference', 'B-SGM-024'], ['note', 'Note to organiser', 'Prefer boulevard-facing for demo footfall.']] },
      { t: 'Add representatives', d: 'Each gets an exhibitor accreditation.', f: [['r1', 'Representative 1', 'Rahul Bhandari — Managing Director'], ['r2', 'Representative 2', 'Simran Kaur — Export Manager'], ['r3', 'Representative 3', 'Arvind Gill — Production Head'], ['r4', 'Representative 4', '']] },
      { t: 'Upload documents', d: 'PDF or JPG, 10 MB max each.', f: [['d1', 'Company brochure', 'Apex_Brochure_2027.pdf', 'file'], ['d2', 'Product catalogue', 'Apex_Catalogue.pdf', 'file'], ['d3', 'Logo (vector)', 'apex-logo.svg', 'file'], ['d4', 'Stand design (raw space only)', 'Not required for Premium Booth', 'file']] },
      { t: 'Review & submit', d: 'Check your application. You can edit until approval.', f: [['sum', 'Summary', `Apex Sports India · Zone B · Sports Goods Manufacturing · ${(chosenP || this.P[1]).name} · Preferred ${s.preferred || 'B-SGM-017'} · 3 representatives · 3 documents`, 'info', null, '1 / -1'], ['tc', 'Declaration', 'I confirm the information is accurate and accept the exhibitor terms (demo).', 'info', null, '1 / -1']] }
    ];
    const cur = W[s.step];
    const docState = ['UPLOADED ✓', 'UPLOADED ✓', 'UPLOADED ✓', 'OPTIONAL'];
    const fields = cur.f.map(([key, label, def, type = 'text', opts, span = 'auto'], i) => {
      const value = s.form[key] ?? def ?? '';
      const set = e => this.setState({ form: { ...s.form, [key]: e.target.value } });
      const chipsOn = s.chips[key] || [];
      return { label, value, set, span, ph: '', opts: opts || [], isText: type === 'text', isSelect: type === 'select', isChips: type === 'chips', isFile: type === 'file', isInfo: type === 'info',
        st: type === 'file' ? (key === 'coi' ? 'VERIFIED ✓' : docState[i] || 'UPLOADED ✓') : '', stColor: '#0B6E4F',
        chips: (opts || []).map(t => { const on = chipsOn.includes(t); return { t, ...sel(on), pick: e => { e.preventDefault(); this.setState({ chips: { ...s.chips, [key]: on ? chipsOn.filter(x => x !== t) : [...chipsOn, t] } }); } }; }) };
    });
    const ST = {
      PENDING: { k: 'PENDING REVIEW', icon: '◷', color: '#C2610B', t: 'APPLICATION RECEIVED', d: 'Our team is verifying your company documents. Typical review time is 2 working days (sample).', cta: 'GO TO EXHIBITOR DASHBOARD', ctaHref: withBase('/portal') },
      QUERY: { k: 'QUERY RAISED', icon: '?', color: '#1F4E9E', t: 'WE NEED ONE MORE DOCUMENT', d: 'Please upload a recent export certificate (RCMC). Reply within 5 days to keep your preferred location on hold.', cta: 'RESPOND TO QUERY', ctaHref: withBase('/portal') },
      APPROVED: { k: 'APPROVED', icon: '✓', color: '#0B6E4F', t: 'YOU’RE APPROVED', d: 'Your application is approved. Pay the participation invoice to confirm allocation.', cta: 'VIEW INVOICE', ctaHref: withBase('/portal') },
      REJECTED: { k: 'NOT APPROVED', icon: '✕', color: '#9E1B22', t: 'APPLICATION NOT APPROVED', d: 'Your category is at capacity. You have been placed on the waitlist for OEM / ODM & Supply Chain.', cta: 'CONTACT HELPDESK', ctaHref: withBase('/admin') },
      ALLOCATED: { k: 'ALLOCATED', icon: '■', color: '#0E0E0F', t: 'STALL B-SGM-017 IS YOURS', d: 'Premium Booth, Zone B, Sports Goods Manufacturing. Build-up: Day −2, 08:00–20:00 (sample).', cta: 'OPEN EXHIBITOR CONTROL CENTRE', ctaHref: withBase('/portal') }
    };
    const order = ['PENDING', 'QUERY', 'APPROVED', 'ALLOCATED'];
    const idx = s.status === 'REJECTED' ? 1 : order.indexOf(s.status);
    return {
      why: [{ t: 'Hosted international buyers', d: 'Pre-qualified buyers from 40+ countries (demo target).' }, { t: 'Matchmaking built in', d: 'Meetings booked before you arrive.' }, { t: 'Your stall on the digital twin', d: 'Visitors find and route to you.' }, { t: 'Leads and recordings after', d: 'Every scan and meeting in one place.' }],
      steps: [['01', 'PRODUCTS', '#products'], ['02', 'LOCATIONS', '#inventory'], ['03', 'DIRECTORY', '#directory'], ['04', 'REGISTER', '#register']].map(([n, t, href]) => ({ n, t, href, bg: '#fff', fg: '#0E0E0F' })),
      prodTabs: this.P.map((p, i) => { const on = i === s.prod; return { name: p.name, size: p.size, bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F', bgc: on ? '#0E0E0F' : '#fff', fill: on ? '#F07C12' : 'transparent', bw: 26 + i * 8 + 'px', bh: [6, 16, 28, 40, 52, 62, 76][i] + 'px', pick: () => this.setState({ prod: i }) }; }),
      viewTabs: [['3d', '3D VIEW'], ['top', 'TOP VIEW'], ['front', 'FRONT VIEW'], ['interior', 'INTERIOR']].map(([id, t]) => ({ t, ...sel(id === s.view), pick: () => this.setState({ view: id }) })),
      booth: { fw: fw + 'px', fd: fd + 'px', wh: wh + 'px', grid: scale + 'px', cam: cams[s.view], fascia: s.prod < 2 ? 'APEX SPORTS · B-SGM-017' : P.name.toUpperCase(), fasciaTop: '0px',
        furn: P.furn.map(f => ({ x: f.x * fw + 'px', y: f.y * fd + 'px', w: f.w * fw + 'px', d: f.d * fd + 'px', z: f.z + 'px', c: f.c })) },
      prod: { ...P, n: s.prod + 1, dims: P.size, scaleNote: 'GRID = 1 M · ' + (s.prod > 2 ? 'SAMPLE FOOTPRINT ' + P.w + ' × ' + P.d + ' M' : 'TO SCALE'), rows: [{ k: 'Capacity', v: P.cap }, { k: 'Branding surfaces', v: P.brand }, { k: 'Utilities', v: P.util }, { k: 'Available in', v: P.zones.map(z => 'Zone ' + z).join(', ') }, { k: 'Customisation', v: P.custom }] },
      selectLabel: s.chosen === s.prod ? '✓ Selected — choose location ↓' : 'Select this product',
      selectProduct: () => { this.setState({ chosen: s.prod, invZone: P.zones[0], invCluster: D.clusters.find(c => c.zone === P.zones[0]).id }); setTimeout(() => { const el = document.getElementById('inventory'); el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'smooth' }); }, 80); },
      chosenName: chosenP ? chosenP.name.toUpperCase() : 'NONE YET',
      invZones: D.zones.map(z => ({ id: z.id, bg: s.invZone === z.id ? z.color : '#fff', fg: s.invZone === z.id ? '#fff' : z.color, pick: () => this.setState({ invZone: z.id, invCluster: D.clusters.find(c => c.zone === z.id).id, stall: null }) })),
      invClusters: zoneClusters.map(c => ({ id: c.id, label: c.name + ' — ' + c.meta })), invCluster: s.invCluster, invZone: s.invZone,
      pickCluster: e => this.setState({ invCluster: e.target.value, stall: null }),
      clusterClick: c => this.setState({ invCluster: c.id, invZone: c.zone }),
      pickStall: st => this.setState({ stall: st, invCluster: st.cluster.id }),
      forceAvail: ['SGM-017'],
      invStats: [{ v: cl.n, k: 'STALLS IN CLUSTER' }, { v: Math.round(cl.n * .35), k: 'AVAILABLE' }, { v: Math.round(cl.n * .2), k: 'RESERVED' }, { v: Math.round(cl.n * .45), k: 'ALLOCATED' }],
      invHint: cl.kind === 'stalls' ? 'Click any available (white) stall in ' + cl.name + '. Reserved stalls are held for 48 hours for applicants in review.' : cl.name + ' is a pavilion / organiser-managed space. Submit a preference and our team will configure the footprint with you.',
      hasStall: !!stallInfo, noStall: !stallInfo, stallId: stallInfo ? stallInfo.id : '',
      stallStatus: stallInfo ? statusOf(stallInfo.status)[0] : '', stallStatusColor: stallInfo ? statusOf(stallInfo.status)[1] : '',
      stallRows, stallUnavailable: stallInfo ? stallInfo.status !== 'available' : true,
      preferBg: stallInfo && stallInfo.status === 'available' ? '#F07C12' : '#E3E0D8',
      preferLabel: !stallInfo ? '' : stallInfo.status !== 'available' ? 'Not available' : s.preferred === stallInfo.id ? '✓ Preferred — continue to register ↓' : 'Select preferred location',
      preferStall: () => { if (stallInfo.status !== 'available') return; this.setState({ preferred: stallInfo.id, step: Math.max(s.step, 7) }); setTimeout(() => { const el = document.getElementById('register'); el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'smooth' }); }, 80); },
      dirTabs: [['ex', 'EXHIBITORS'], ['prod', 'PRODUCTS']].map(([id, t]) => ({ t, ...sel(id === s.dir), pick: () => this.setState({ dir: id }) })),
      dirEx: s.dir === 'ex', dirProd: s.dir === 'prod',
      exList: exs.map(e => ({ ...e, zc: D.Z[e.zone].color, bg: e.id === s.ex ? '#F6F4EF' : '#fff', pick: () => this.setState({ ex: e.id }) })),
      ex: { ...E, logo: 'logo-' + E.id, saveLabel: s.saved[E.id] ? '✓ Saved' : 'Add to My Expo', saveBg: s.saved[E.id] ? '#E3F1EB' : '#F6F4EF', save: () => this.setState(p => ({ saved: { ...p.saved, [E.id]: !p.saved[E.id] } })),
        prods: E.products.map(name => { const i = allProds.findIndex(p => p.name.includes(name.split(' ')[0]) && p.by === E.name); return { name, open: () => this.setState({ prodOpen: i >= 0 ? i : allProds.findIndex(p => p.by === E.name) >= 0 ? allProds.findIndex(p => p.by === E.name) : 0 }) }; }) },
      prodList: allProds.map((p, i) => ({ ...p, open: () => this.setState({ prodOpen: i }) })),
      prodOpen: s.prodOpen != null, pd, closeProd: () => this.setState({ prodOpen: null }), stop: e => e.stopPropagation(),
      wiz: W.map((w, i) => ({ n: String(i + 1).padStart(2, '0'), t: w.t, mark: i < s.step || s.submitted ? '✓' : '', bg: i === s.step && !s.submitted ? '#fff' : 'transparent', fg: i <= s.step || s.submitted ? '#0E0E0F' : '#6B6A66', weight: i === s.step && !s.submitted ? 700 : 500, go: () => this.setState({ step: i, submitted: false }) })),
      inWizard: !s.submitted, submitted: s.submitted, cur: { ...cur, n: s.step + 1 }, fields, wizPct: ((s.step + 1) / 11 * 100) + '%',
      back: () => this.setState({ step: Math.max(0, s.step - 1) }), next: () => s.step === 10 ? this.setState({ submitted: true, status: 'PENDING' }) : this.setState({ step: s.step + 1 }),
      nextLabel: s.step === 10 ? 'Submit application' : 'Continue →',
      statusTabs: ['PENDING', 'QUERY', 'APPROVED', 'REJECTED', 'ALLOCATED'].map(t => ({ t, ...sel(t === s.status), pick: () => this.setState({ status: t }) })),
      status: ST[s.status], restart: () => this.setState({ submitted: false, step: 0 }),
      track: [['SUBMITTED', '12 MAR'], ['VERIFICATION', '13 MAR'], ['APPROVAL', '15 MAR'], ['PAYMENT', '18 MAR'], ['ALLOCATION', '22 MAR']].map(([t, date], i) => ({ t, date: i <= idx + (s.status === 'ALLOCATED' ? 1 : 0) ? date + ' (demo)' : '—', c: s.status === 'REJECTED' && i === 2 ? '#9E1B22' : i <= idx + (s.status === 'ALLOCATED' ? 1 : 0) ? '#0B6E4F' : '#E3E0D8' }))
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
            <a href={withBase("/explore")} style={{ color: "#fff", textDecoration: "none" }}>Explore</a>
            <a href={withBase("/exhibit")} style={{ color: "#F07C12", textDecoration: "none" }}>Exhibit</a>
            <a href={withBase("/attend")} style={{ color: "#fff", textDecoration: "none" }}>Attend</a>
            <a href={withBase("/connect")} style={{ color: "#fff", textDecoration: "none" }}>Connect</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Programme</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Watch</a>
          </nav>
          <a href={withBase("/portal")} style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            Exhibitor login
          </a>
          <a href={withBase("/portal/register/")} className="hdr-btn hdr-fill">
            <span className="hdr-liq" aria-hidden="true" />
            <span className="hdr-t">Apply</span>
          </a>
        </header>
        <nav aria-label="Exhibit sections" style={{ position: "sticky", top: "60px", zIndex: "50", background: "#fff", borderBottom: "1px solid #0E0E0F", display: "flex", gap: "0", overflowX: "auto" }}>
          {list(v.steps).map((s, $index) => (
            <Fragment key={$index}>
              <a href={s?.href} style={sx(`text-decoration:none;color:${s?.fg ?? ""};padding:14px 22px;border-right:1px solid #E3E0D8;font-size:13px;font-weight:700;letter-spacing:0.08em;white-space:nowrap;display:flex;gap:8px;align-items:center;background:${s?.bg ?? ""};`)}>
                <span style={{ fontFamily: "var(--f-label)", fontWeight: "500" }}>{txt(s?.n)}</span>
                {txt(s?.t)}
              </a>
            </Fragment>
          ))}
        </nav>
        <section data-screen-label="Why exhibit" style={{ padding: "80px 28px 56px", maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px", alignItems: "end" }}>
          <div>
            <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#6B6A66", marginBottom: "20px" }}>
              EXHIBIT · HALL 2 · 213 STALLS · 25 PAVILIONS
            </div>
            <h1 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(64px,9vw,148px) * 0.72)", lineHeight: "0.84" }}>
              Build your
              <br />
              presence.
            </h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "2px solid #0E0E0F" }}>
            {list(v.why).map((w, $index) => (
              <Fragment key={$index}>
                <div style={{ padding: "18px 16px 18px 0", borderBottom: "1px solid #E3E0D8" }}>
                  <b style={{ display: "block", fontSize: "17px", marginBottom: "4px" }}>{txt(w?.t)}</b>
                  <span style={{ fontSize: "14px", color: "#3A3A3E" }}>{txt(w?.d)}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section id="products" data-screen-label="Product architecture" style={{ scrollMarginTop: "110px", background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
                01 — Exhibition product architecture
              </h2>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", background: "#fff", border: "1px solid #0E0E0F", padding: "6px 10px" }}>
                DEMO / SAMPLE CONFIGURATION · NOT CONFIRMED COMMERCIAL SPECIFICATIONS
              </span>
            </div>
            <div role="tablist" style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", border: "1px solid #0E0E0F", background: "#fff" }}>
              {list(v.prodTabs).map((p, $index) => (
                <Fragment key={$index}>
                  <button role="tab" onClick={p?.pick} style={sx(`border:0;border-right:1px solid #0E0E0F;background:${p?.bg ?? ""};color:${p?.fg ?? ""};padding:16px 14px 14px;text-align:left;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;min-height:150px;`)}>
                    <span style={sx(`display:block;width:${p?.bw ?? ""};height:${p?.bh ?? ""};border:1.5px solid ${p?.fg ?? ""};background:${p?.fill ?? ""};box-shadow:5px -5px 0 -1.5px ${p?.bgc ?? ""}, 5px -5px 0 0 ${p?.fg ?? ""};`)} />
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "20px", lineHeight: "0.95", textTransform: "uppercase", marginTop: "8px" }}>
                      {txt(p?.name)}
                    </span>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(p?.size)}</span>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", border: "1px solid #0E0E0F", borderTop: "0", background: "#fff" }}>
              <div style={{ position: "relative", background: "#FBFAF7", borderRight: "1px solid #E3E0D8", minHeight: "520px", display: "flex", flexDirection: "column" }}>
                <div role="tablist" style={{ display: "flex", gap: "0", borderBottom: "1px solid #E3E0D8" }}>
                  {list(v.viewTabs).map((_v, $index) => (
                    <Fragment key={$index}>
                      <button role="tab" onClick={_v?.pick} style={sx(`flex:1;height:42px;border:0;border-right:1px solid #E3E0D8;background:${_v?.bg ?? ""};color:${_v?.fg ?? ""};font:700 12px var(--f-body);letter-spacing:0.1em;cursor:pointer;`)}>
                        {txt(_v?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", perspective: "1400px", overflow: "hidden" }}>
                  <div style={sx(`position:relative;width:${v.booth?.fw ?? ""};height:${v.booth?.fd ?? ""};transform-style:preserve-3d;transform:${v.booth?.cam ?? ""};transition:transform 1s cubic-bezier(.2,.7,.2,1);`)}>
                    <div style={sx(`position:absolute;inset:0;background:repeating-linear-gradient(0deg,#E3E0D8 0 1px,transparent 1px ${v.booth?.grid ?? ""}),repeating-linear-gradient(90deg,#E3E0D8 0 1px,#fff 1px ${v.booth?.grid ?? ""});border:2px solid #0E0E0F;`)} />
                    <div style={sx(`position:absolute;left:0;top:0;width:100%;height:${v.booth?.wh ?? ""};background:#fff;border:1.5px solid #0E0E0F;transform-origin:top;transform:rotateX(-90deg);display:flex;align-items:flex-end;justify-content:center;box-sizing:border-box;`)}>
                      <span style={{ marginBottom: "30%", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                        BACK WALL · BRANDING
                      </span>
                      <div style={{ position: "absolute", left: "-1px", right: "-1px", bottom: "-1px", height: "24px", background: "#0E0E0F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: "800 11px var(--f-display)", fontStretch: "75%", letterSpacing: "0.12em" }}>
                        {txt(v.booth?.fascia)}
                      </div>
                    </div>
                    <div style={sx(`position:absolute;left:0;top:0;width:${v.booth?.wh ?? ""};height:100%;background:#F1EFEA;border:1.5px solid #0E0E0F;transform-origin:left;transform:rotateY(90deg);box-sizing:border-box;`)} />
                    {list(v.booth?.furn).map((f, $index) => (
                      <Fragment key={$index}>
                        <div style={sx(`position:absolute;left:${f?.x ?? ""};top:${f?.y ?? ""};width:${f?.w ?? ""};height:${f?.d ?? ""};background:${f?.c ?? ""};border:1.5px solid #0E0E0F;transform:translateZ(${f?.z ?? ""});box-sizing:border-box;`)} />
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", borderTop: "1px solid #E3E0D8", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.1em", color: "#6B6A66" }}>
                  <span>{txt(v.prod?.dims)}</span>
                  <span>{txt(v.prod?.scaleNote)}</span>
                </div>
              </div>
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#C2610B" }}>
                  {"PRODUCT "}{txt(v.prod?.n)}{" OF 7 · CUSTOMISATION "}{txt(v.prod?.custom)}
                </span>
                <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "50px", lineHeight: "0.85", textTransform: "uppercase" }}>
                  {txt(v.prod?.name)}
                </span>
                <span style={{ fontFamily: "var(--f-display)", fontStretch: "75%", fontWeight: "700", fontSize: "23px" }}>{txt(v.prod?.dims)}</span>
                <span style={{ fontSize: "16px", lineHeight: "1.45" }}>
                  <b>Suitable for:</b>
                  {" "}{txt(v.prod?.suit)}
                </span>
                <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "150px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                  {list(v.prod?.rows).map((r, $index) => (
                    <Fragment key={$index}>
                      <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                      <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                    </Fragment>
                  ))}
                </dl>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>INCLUDES</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {list(v.prod?.inc).map((i, $index) => (
                      <Fragment key={$index}>
                        <span style={{ border: "1px solid #0E0E0F", padding: "6px 10px", fontSize: "13px" }}>{txt(i)}</span>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <button onClick={v.selectProduct} style={{ marginTop: "auto", height: "54px", border: "0", background: "#F07C12", color: "#0E0E0F", font: "700 14px var(--f-body)", letterSpacing: "0.1em", cursor: "pointer" }}>
                  {txt(v.selectLabel)}
                </button>
              </div>
            </div>
          </div>
        </section>
        <section id="inventory" data-screen-label="Stall inventory" style={{ scrollMarginTop: "110px", padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              02 — Available locations
            </h2>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.1em" }}>
              {"SELECTED PRODUCT · "}
              <b>{txt(v.chosenName)}</b>
              {" · LIVE INVENTORY (DEMO) · UPDATED 2 MIN AGO"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto 1fr", gap: "24px", alignItems: "end", marginBottom: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>SELECT ZONE</span>
              <div style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                {list(v.invZones).map((z, $index) => (
                  <Fragment key={$index}>
                    <button onClick={z?.pick} style={sx(`height:42px;width:56px;border:0;border-right:1px solid #0E0E0F;background:${z?.bg ?? ""};color:${z?.fg ?? ""};font:800 16px var(--f-display);font-stretch:62%;cursor:pointer;`)}>
                      {txt(z?.id)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>SELECT CLUSTER</span>
              <select onChange={v.pickCluster} value={val(v.invCluster)} style={{ height: "44px", minWidth: "300px", border: "1px solid #0E0E0F", background: "#fff", font: "500 15px var(--f-body)", padding: "0 10px" }}>
                {list(v.invClusters).map((c, $index) => (
                  <Fragment key={$index}>
                    <option value={val(c?.id)}>{str(c?.label)}</option>
                  </Fragment>
                ))}
              </select>
            </label>
            <div style={{ display: "flex", gap: "18px", justifyContent: "flex-end", flexWrap: "wrap", fontSize: "13px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", background: "#fff", border: "1px solid #0B6E4F" }} />
                Available
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", background: "repeating-linear-gradient(45deg,#F07C12 0 2px,#FFF3E6 2px 5px)", border: "1px solid #C2610B" }} />
                Reserved
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", background: "#3A3A3E" }} />
                Allocated
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", background: "repeating-linear-gradient(-45deg,#BDB9B0 0 1px,#E9E6DF 1px 4px)", border: "1px solid #BDB9B0" }} />
                Blocked
              </span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: "0", border: "1px solid #0E0E0F" }}>
            <div style={{ padding: "24px", background: "#F6F4EF" }}>
              <HallPlan mode={"inventory"} activeZone={v.invZone} selectedCluster={v.invCluster} selectedStall={v.stallId} onStall={v.pickStall} onCluster={v.clusterClick} forceAvail={v.forceAvail} />
              <div style={{ display: "flex", gap: "24px", fontFamily: "var(--f-label)", fontSize: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                {list(v.invStats).map((s, $index) => (
                  <Fragment key={$index}>
                    <span>
                      <b>{txt(s?.v)}</b>
                      {" "}{txt(s?.k)}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
            <aside style={{ padding: "24px", borderLeft: "1px solid #0E0E0F", display: "flex", flexDirection: "column", gap: "14px" }}>
              {v.hasStall ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <span style={sx(`font-family:var(--f-label);font-size:11px;letter-spacing:0.16em;color:${v.stallStatusColor ?? ""};`)}>
                      {"● "}{txt(v.stallStatus)}
                    </span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.85" }}>{txt(v.stallId)}</span>
                    <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "130px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                      {list(v.stallRows).map((r, $index) => (
                        <Fragment key={$index}>
                          <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                          <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                        </Fragment>
                      ))}
                    </dl>
                    <button onClick={v.preferStall} disabled={v.stallUnavailable} style={sx(`height:52px;border:0;background:${v.preferBg ?? ""};color:#0E0E0F;font:700 13px var(--f-body);letter-spacing:0.1em;cursor:pointer;`)}>
                      {txt(v.preferLabel)}
                    </button>
                  </div>
                </>
              ) : null}
              {v.noStall ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#3A3A3E" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9", color: "#0E0E0F" }}>
                      Select a stall
                    </span>
                    <span style={{ fontSize: "15px", lineHeight: "1.5" }}>{txt(v.invHint)}</span>
                    <span style={{ fontSize: "14px" }}>
                      {"Tip: "}
                      <b>B-SGM-017</b>
                      {" is available in Sports Goods Manufacturing, row 2 — close to the Sports Boulevard."}
                    </span>
                  </div>
                </>
              ) : null}
            </aside>
          </div>
        </section>
        <section id="directory" data-screen-label="Exhibitor directory" style={{ scrollMarginTop: "110px", background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
                {"03 — Exhibitors & products"}
              </h2>
              <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F", background: "#fff" }}>
                {list(v.dirTabs).map((t, $index) => (
                  <Fragment key={$index}>
                    <button onClick={t?.pick} style={sx(`height:42px;padding:0 18px;border:0;border-right:1px solid #0E0E0F;background:${t?.bg ?? ""};color:${t?.fg ?? ""};font:700 12px var(--f-body);letter-spacing:0.1em;cursor:pointer;`)}>
                      {txt(t?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            {v.dirEx ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", border: "1px solid #0E0E0F", background: "#fff" }}>
                  <div style={{ borderRight: "1px solid #0E0E0F", maxHeight: "760px", overflow: "auto" }}>
                    {list(v.exList).map((e, $index) => (
                      <Fragment key={$index}>
                        <button onClick={e?.pick} style={sx(`width:100%;display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:14px;align-items:center;padding:16px 20px;border:0;border-bottom:1px solid #E3E0D8;background:${e?.bg ?? ""};text-align:left;cursor:pointer;`)}>
                          <span style={sx(`width:10px;height:10px;background:${e?.zc ?? ""};`)} />
                          <span>
                            <span style={{ display: "block", fontWeight: "700", fontSize: "16px", color: "#0E0E0F" }}>{txt(e?.name)}</span>
                            <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(e?.city)}{" · "}{txt(e?.sector)}</span>
                          </span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", color: "#0E0E0F" }}>{txt(e?.stall)}</span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "20px", alignItems: "center" }}>
                      <div style={{ width: "120px", height: "120px", position: "relative" }}>
                        <image-slot id={v.ex?.logo} src={v.ex?.logoUrl || undefined} shape="rect" fit="contain" placeholder="Logo" />
                      </div>
                      <div>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(v.ex?.stall)}{" · "}{txt(v.ex?.booth)}{" · ZONE "}{txt(v.ex?.zone)}</span>
                        <div style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "1.02", margin: "4px 0 6px", textTransform: "uppercase" }}>
                          {txt(v.ex?.name)}
                        </div>
                        <span style={{ color: "#6B6A66" }}>{txt(v.ex?.city)}{" · "}{txt(v.ex?.type)}</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid #E3E0D8", paddingTop: "16px", fontSize: "15px" }}>
                      <div>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66", display: "block" }}>SECTOR</span>
                        {txt(v.ex?.sector)}
                      </div>
                      <div>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66", display: "block" }}>LOOKING FOR</span>
                        {txt(v.ex?.seeking)}
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>PRODUCTS</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }}>
                      {list(v.ex?.prods).map((p, $index) => (
                        <Fragment key={$index}>
                          <button onClick={p?.open} style={{ border: "1px solid #E3E0D8", background: "#fff", padding: "0", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                            <span style={{ aspectRatio: "1", background: "repeating-linear-gradient(135deg,#F1EFEA 0 8px,#F6F4EF 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-label)", fontSize: "10px", color: "#6B6A66" }}>
                              PRODUCT IMAGE
                            </span>
                            <span style={{ padding: "10px", fontWeight: "600", fontSize: "14px", color: "#0E0E0F" }}>{txt(p?.name)}</span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginTop: "auto" }}>
                      <a href={withBase("/connect")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em" }}>
                        Book meeting
                      </a>
                      <a href={withBase("/explore")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                        View on map
                      </a>
                      <a href={withBase("/explore")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "11px", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                        Navigate
                      </a>
                      <button onClick={v.ex?.save} style={sx(`border:0;background:${v.ex?.saveBg ?? ""};height:46px;font:700 11px var(--f-body);letter-spacing:0.08em;cursor:pointer;`)}>
                        {txt(v.ex?.saveLabel)}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {" "}
            {v.dirProd ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "0", borderTop: "1px solid #0E0E0F", borderLeft: "1px solid #0E0E0F", background: "#fff" }}>
                  {list(v.prodList).map((p, $index) => (
                    <Fragment key={$index}>
                      <button onClick={p?.open} style={{ border: "0", borderRight: "1px solid #0E0E0F", borderBottom: "1px solid #0E0E0F", background: "#fff", padding: "20px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ aspectRatio: "4/3", background: "repeating-linear-gradient(135deg,#F1EFEA 0 8px,#F6F4EF 8px 16px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-label)", fontSize: "10px", color: "#6B6A66" }}>
                          PRODUCT IMAGE
                        </span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(p?.cat)}{" · "}{txt(p?.type)}</span>
                        <span style={{ fontWeight: "700", fontSize: "17px", color: "#0E0E0F" }}>{txt(p?.name)}</span>
                        <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(p?.by)}{" · "}{txt(p?.stall)}</span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section id="register" data-screen-label="Exhibitor registration" style={{ scrollMarginTop: "110px", padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              04 — Exhibitor registration
            </h2>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.1em" }}>OPEN NOW · YOUR PORTAL OPENS AT ONCE</span>
          </div>
          <RegisterCta kind="exhibitor" />
        </section>
        {v.prodOpen ? (
          <>
            <div role="dialog" aria-label="Product detail" onClick={v.closeProd} style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(14,14,15,0.55)", display: "flex", justifyContent: "flex-end" }}>
              <div onClick={v.stop} style={{ width: "min(560px,94vw)", height: "100%", background: "#fff", overflow: "auto", padding: "32px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
                <button onClick={v.closeProd} style={{ alignSelf: "flex-end", border: "1px solid #0E0E0F", background: "none", height: "34px", padding: "0 12px", font: "700 11px var(--f-body)", cursor: "pointer" }}>
                  Close ✕
                </button>
                <div style={{ aspectRatio: "4/3", position: "relative" }}>
                  <image-slot id={v.pd?.slot} shape="rect" placeholder="Product hero image" />
                </div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                  {txt(v.pd?.cat)}{" · "}{txt(v.pd?.type)}{" · "}{txt(v.pd?.tag)}
                </span>
                <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "38px", lineHeight: "0.88", textTransform: "uppercase" }}>
                  {txt(v.pd?.name)}
                </span>
                <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "130px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                  <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>Exhibitor</dt>
                  <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(v.pd?.by)}</dd>
                  <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>Stall</dt>
                  <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8", fontFamily: "var(--f-label)" }}>{txt(v.pd?.stall)}</dd>
                  <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>Order terms</dt>
                  <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(v.pd?.moq)}{" · FOB Mundra (sample)"}</dd>
                  <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>Live demo</dt>
                  <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>At stall, daily 11:00 and 15:00 (sample)</dd>
                </dl>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "auto" }}>
                  <a href={withBase("/connect")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", letterSpacing: "0.1em" }}>
                    Request quote / meeting
                  </a>
                  <button style={{ border: "1px solid #0E0E0F", background: "#fff", height: "48px", font: "700 12px var(--f-body)", letterSpacing: "0.1em", cursor: "pointer" }}>
                    Save product
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default defineDC("Exhibit", Component, render);
