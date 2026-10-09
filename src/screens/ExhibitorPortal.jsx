'use client';
// Generated from design/site/Exhibitor Portal.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';
import HallPlan from './HallPlan';

/* global maplibregl */
class Component extends DCLogic {
  state = { mod: 'overview', phase: 'pre', req: {}, extra: [], np: { name: 'Futsal Pro Low-bounce Ball', cat: 'Football', moq: 'MOQ 500' }, meet: {}, toast: null };
  componentDidMount() { if (!window.ISE) this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); }
  componentWillUnmount() { clearInterval(this._t); clearTimeout(this._toast); }
  flash(t) { clearTimeout(this._toast); this.setState({ toast: t }); this._toast = setTimeout(() => this.setState({ toast: null }), 2400); }
  renderVals() {
    const D = window.ISE; const s = this.state;
    const sel = on => ({ bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    if (!D) return { mods: [], phases: [], metrics: [], checklist: [], topMatches: [], products: [], stallRows: [], bars: [], byCountry: [], leads: [], legacy: [], timeline: [], table: { cols: [], rows: [] }, np: {} };
    const ph = s.phase;
    const MODS = [['overview', 'Overview', ''], ['profile', 'Company Profile', '92%'], ['products', 'Products', ''], ['reps', 'Representatives', '3'], ['stall', 'Stall', ''], ['build', 'Build-Up', ''], ['logistics', 'Logistics', '2'], ['docs', 'Documents', '1!'], ['matches', 'Buyer Matches', '4'], ['meetings', 'Meetings', '5'], ['notif', 'Notifications', '3'], ['help', 'Helpdesk', '1'], ['analytics', 'Analytics', '']];
    const meta = { overview: ['Overview', 'What needs your attention before build-up.'], profile: ['Company Profile', 'This is what buyers see in the directory and in match results.'], products: ['Products', 'Products power buyer matching. Add at least five.'], reps: ['Representatives', 'Each representative receives an exhibitor accreditation.'], stall: ['Stall', 'Your allocated location on the venue digital twin.'], build: ['Build-Up', 'Shell-scheme booth. Organiser builds; you approve graphics.'], logistics: ['Logistics', 'Shipments to Bharat Mandapam via the official freight forwarder (sample).'], docs: ['Documents', 'Compliance and exhibitor manual submissions.'], matches: ['Buyer Matches', 'Scored by the Business Exchange from your products and buyer requirements.'], meetings: ['Meetings', 'Requests, confirmed slots and outcomes.'], notif: ['Notifications', 'Organiser and buyer updates.'], help: ['Helpdesk', 'One helpdesk for registration, stall, logistics and technical issues.'], analytics: ['Analytics', ph === 'post' ? 'Final results after the Expo.' : 'Live engagement with your profile and stall.'] };
    const M = { pre: [['Profile Completion', '92%', '+8 this week'], ['Profile Views', '1,284', '+212 / 7 days'], ['Product Views', '3,906', 'FQ-5 most viewed'], ['Saved By Visitors', '148', '62 international'], ['Buyer Matches', '24', '4 new'], ['Meeting Requests', '17', '5 pending'], ['Confirmed Meetings', '11', 'Day 2 busiest'], ['Leads Captured', '0', 'Starts Day 1']], live: [['Profile Completion', '100%', 'Complete'], ['Profile Views', '4,712', '+1,020 today'], ['Product Views', '9,340', ''], ['Saved By Visitors', '402', '+96 today'], ['Buyer Matches', '31', ''], ['Meeting Requests', '26', '3 pending'], ['Confirmed Meetings', '19', '6 today'], ['Leads Captured', '184', '+71 today']], post: [['Profile Completion', '100%', ''], ['Profile Views', '7,905', 'Final'], ['Product Views', '15,220', 'Final'], ['Saved By Visitors', '611', 'Final'], ['Buyer Matches', '31', ''], ['Meeting Requests', '29', ''], ['Confirmed Meetings', '23', '21 held'], ['Leads Captured', '412', '38 hot · 2 LoIs']] }[ph];
    const extra = s.extra;
    const prods = [...D.products.filter(p => p.by === 'Apex Sports India').map((p, i) => ({ ...p, views: [1840, 960][i], st: 'PUBLISHED', c: '#0B6E4F' })), { name: 'Training Ball TB-3', cat: 'Football', moq: 'MOQ 2,000', views: 610, st: 'PUBLISHED', c: '#0B6E4F' }, { name: 'Agility Ladder Set', cat: 'Fitness', moq: 'MOQ 300', views: 0, st: 'DRAFT', c: '#6B6A66' }, ...extra.map(p => ({ ...p, views: 0, st: 'IN REVIEW', c: '#C2610B' }))];
    const cell = (v, o = {}) => ({ v, c: o.c || '#0E0E0F', w: o.w || 400, f: o.mono ? "var(--f-label)" : "var(--f-body)", s: o.mono ? '12px' : '14px' });
    const st = (t, c) => cell(t, { c, mono: true });
    const G = '#0B6E4F', O = '#C2610B', R = '#9E1B22', K = '#6B6A66';
    const meetRows = [['Global Sports Retail GmbH', 'Germany', 'Buyer–Seller', 'Day 2 · 11:00 · Table 14', 'CONFIRMED', G], ['Northline Distribution Ltd', 'United Kingdom', 'B2B', 'Day 2 · 14:30 · Table 08', 'CONFIRMED', G], ['Gulf Arena Supplies', 'UAE', 'Buyer–Seller', 'Requested Day 3', 'PENDING', O], ['Kinetic Ventures', 'India', 'Investor', 'Day 3 · 10:00 · Deal Room 2', 'CONFIRMED', G], ['Odisha Sports Dept. (sample)', 'India', 'B2G', 'Requested Day 1', 'PENDING', O]];
    const TABLES = {
      profile: { cols: ['FIELD', 'VALUE', 'STATUS'], rows: [['Legal name', 'Apex Sports India Pvt. Ltd.', 'VERIFIED'], ['Founded', '1987 (demo)', 'COMPLETE'], ['Certifications', 'ISO 9001 · FIFA Quality licensee (sample)', 'COMPLETE'], ['Export markets', 'UK, Germany, UAE, Australia', 'COMPLETE'], ['Looking for', 'European Distributors', 'COMPLETE'], ['Company video', 'Not added', 'MISSING']].map(([a, b, c]) => ({ cells: [cell(a, { c: K }), cell(b, { w: 600 }), st(c, c === 'MISSING' ? O : G)] })), action: 'EDIT PUBLIC PROFILE' },
      reps: { cols: ['NAME', 'ROLE', 'ACCREDITATION', 'PASS', 'ACCESS'], rows: [['Rahul Bhandari', 'Managing Director · Admin', 'EXHIBITOR', 'ISSUED', 'Expo floor · B2B · Exchange'], ['Simran Kaur', 'Export Manager', 'EXHIBITOR', 'ISSUED', 'Expo floor · B2B'], ['Arvind Gill', 'Production Head', 'EXHIBITOR', 'PHOTO NEEDED', 'Expo floor']].map(([a, b, c, d, e]) => ({ cells: [cell(a, { w: 600 }), cell(b), st(c, K), st(d, d === 'ISSUED' ? G : O), cell(e)] })), action: '+ ADD REPRESENTATIVE (1 OF 4 REMAINING)' },
      build: { cols: ['ITEM', 'DETAIL', 'DEADLINE', 'STATUS'], rows: [['Fascia name', 'APEX SPORTS · B-SGM-017', '−21 days', 'APPROVED'], ['Back-wall graphic', '5.9 × 2.4 m PDF', '−14 days', 'IN REVIEW'], ['Extra furniture', '2 bar stools, 1 showcase', '−14 days', 'ORDERED'], ['Extra power', '1 × 15A for demo screen', '−10 days', 'ORDERED'], ['Badge for contractor', 'Graphics installer, 1 person', '−7 days', 'NOT STARTED']].map(([a, b, c, d]) => ({ cells: [cell(a, { w: 600 }), cell(b), st(c, K), st(d, d === 'APPROVED' || d === 'ORDERED' ? G : d === 'IN REVIEW' ? O : K)] })), action: 'OPEN EXHIBITOR MANUAL', timeline: [['DAY −3', 'Shell build', 'Organiser', G], ['DAY −2', 'Your build-up', '08:00–20:00', O], ['DAY −1', 'Final checks', 'Power on 14:00', '#E3E0D8'], ['DAY 1–3', 'Open', '10:00–18:00', '#E3E0D8'], ['DAY 3', 'Breakdown', 'From 18:30', '#E3E0D8']] },
      logistics: { cols: ['SHIPMENT', 'CONTENTS', 'ROUTE', 'ETA', 'STATUS'], rows: [['SHP-2207', '42 cartons · balls, goals', 'Jalandhar → Bharat Mandapam', 'Day −3', 'IN TRANSIT'], ['SHP-2215', 'Display mannequins', 'Ludhiana → Bharat Mandapam', 'Day −2', 'BOOKED'], ['SHP-2240', 'Return: samples', 'Bharat Mandapam → Jalandhar', 'Day 4', 'DRAFT']].map(([a, b, c, d, e]) => ({ cells: [st(a, '#0E0E0F'), cell(b), cell(c), st(d, K), st(e, e === 'IN TRANSIT' ? O : e === 'BOOKED' ? G : K)] })), action: '+ BOOK SHIPMENT' },
      docs: { cols: ['DOCUMENT', 'FILE', 'UPLOADED', 'STATUS'], rows: [['Certificate of incorporation', 'COI_ApexSports.pdf', '12 Mar', 'VERIFIED'], ['GST certificate', 'GSTIN_03AABCA.pdf', '12 Mar', 'VERIFIED'], ['Public liability insurance', '—', '—', 'REQUIRED'], ['Product catalogue', 'Apex_Catalogue.pdf', '14 Mar', 'VERIFIED'], ['Participation invoice', 'INV-27-0418.pdf', '18 Mar', 'PAID']].map(([a, b, c, d]) => ({ cells: [cell(a, { w: 600 }), st(b, K), st(c, K), st(d, d === 'REQUIRED' ? R : G)] })), action: 'UPLOAD INSURANCE CERTIFICATE' },
      matches: { cols: ['COMPANY', 'COUNTRY', 'LOOKING FOR', 'MATCH', 'ACTION'], rows: D.matches.map(m => ({ cells: [cell(m.name, { w: 600 }), cell(m.country), cell(m.seeking), st(m.score + '%', G), st(s.req[m.name] ? '✓ REQUESTED' : 'REQUEST →', s.req[m.name] ? G : '#0E0E0F')] })), action: 'REQUEST MEETINGS WITH ALL ≥ 80%' },
      meetings: { cols: ['WITH', 'COUNTRY', 'TYPE', 'WHEN / WHERE', 'STATUS'], rows: meetRows.map(([a, b, c, d, e, col], i) => { const acc = s.meet[i]; return { cells: [cell(a, { w: 600 }), cell(b), st(c, K), cell(d), st(acc ? '✓ ACCEPTED' : e, acc ? G : col)] }; }), action: 'ACCEPT ALL PENDING' },
      notif: { cols: ['TIME', 'TYPE', 'MESSAGE'], rows: [['09:12', 'BUYER', 'Gulf Arena Supplies requested a meeting on Day 3'], ['Yesterday', 'ORGANISER', 'Back-wall graphic received. Review within 48 hours.'], ['Yesterday', 'MATCH', '4 new buyer matches from Germany and UK'], ['2 days ago', 'LOGISTICS', 'SHP-2207 picked up from Jalandhar']].map(([a, b, c]) => ({ cells: [st(a, K), st(b, O), cell(c)] })), action: 'MARK ALL AS READ' },
      help: { cols: ['TICKET', 'CATEGORY', 'SUBJECT', 'OWNER', 'STATUS'], rows: [['HD-10377', 'STALL', 'Can we add a demo screen to back wall?', 'Venue Ops · Neha', 'IN PROGRESS'], ['HD-10301', 'EXHIBITOR', 'Change company logo on directory', 'Content · Arif', 'RESOLVED'], ['HD-10288', 'ACCREDITATION', 'Representative photo rejected', 'Accreditation · Kavya', 'WAITING']].map(([a, b, c, d, e]) => ({ cells: [st(a, '#0E0E0F'), st(b, K), cell(c, { w: 600 }), cell(d), st(e, e === 'RESOLVED' ? G : O)] })), action: '+ NEW REQUEST' }
    };
    const tbl = TABLES[s.mod];
    const days = ['−13', '−12', '−11', '−10', '−9', '−8', '−7', '−6', '−5', '−4', '−3', 'D1', 'D2', 'D3'];
    const vals = [40, 52, 48, 61, 70, 66, 82, 90, 104, 118, 130, 210, 260, 190];
    const ready = [['Company verified', 1, 'profile'], ['Stall allocated · B-SGM-017', 1, 'stall'], ['Invoice paid', 1, 'docs'], ['Add 5 products', prods.filter(p => p.st !== 'DRAFT').length >= 5 ? 1 : 0, 'products'], ['Representative photos', 0, 'reps'], ['Back-wall graphic approved', 0, 'build'], ['Public liability insurance', 0, 'docs']];
    const done = ready.filter(r => r[1]).length;
    const tableAction = () => {
      if (s.mod === 'matches') { const r = {}; D.matches.filter(m => m.score >= 80).forEach(m => r[m.name] = true); this.setState({ req: { ...s.req, ...r } }); this.flash('3 meeting requests sent'); }
      else if (s.mod === 'meetings') { this.setState({ meet: { 2: true, 4: true } }); this.flash('2 meetings accepted. Choose slots in Connect.'); }
      else this.flash(tbl.action.replace('+ ', '') + ' (demo)');
    };
    return {
      mods: MODS.map(([id, t, badge]) => ({ t, badge, bc: badge.includes('!') ? '#F07C12' : '#8A877F', bg: id === s.mod ? '#1A1A1C' : 'transparent', fg: id === s.mod ? '#fff' : '#BDB9B0', bl: id === s.mod ? '#F07C12' : 'transparent', pick: () => this.setState({ mod: id }) })),
      phases: [['pre', 'PRE-EVENT'], ['live', 'LIVE'], ['post', 'POST-EVENT']].map(([id, t]) => ({ t, ...sel(id === ph), pick: () => this.setState({ phase: id }) })),
      panelTitle: meta[s.mod][0], panelIntro: meta[s.mod][1],
      pOverview: s.mod === 'overview', pProducts: s.mod === 'products', pStall: s.mod === 'stall', pAnalytics: s.mod === 'analytics', pTable: !!tbl,
      metrics: M.map(([k, v, d]) => ({ k, v, d, dc: d.startsWith('+') ? '#0B6E4F' : '#6B6A66' })),
      readyPct: Math.round(done / ready.length * 100) + '%',
      checklist: ready.map(([t, ok, go]) => ({ t, i: ok ? '✓' : '○', st: ok ? 'DONE' : 'TO DO', c: ok ? '#0B6E4F' : '#C2610B', go: () => this.setState({ mod: go }) })),
      topMatches: D.matches.slice(0, 3).map(m => ({ ...m, label: s.req[m.name] ? '✓ SENT' : 'REQUEST', bg: s.req[m.name] ? '#fff' : 'transparent', fg: s.req[m.name] ? '#0E0E0F' : '#fff', request: () => { this.setState({ req: { ...s.req, [m.name]: true } }); this.flash('Meeting request sent to ' + m.name); } })),
      nextKey: ph === 'pre' ? 'NEXT DEADLINE · 6 DAYS' : ph === 'live' ? 'NEXT MEETING · 11:00' : 'FOLLOW-UP DUE',
      nextTitle: ph === 'pre' ? 'Upload public liability insurance' : ph === 'live' ? 'Global Sports Retail GmbH · Table 14' : 'Send pricing sheet to Global Sports Retail',
      nextDesc: ph === 'pre' ? 'Required before build-up access is granted on Day −2.' : ph === 'live' ? '3 min walk from B-SGM-017 via Sports Boulevard.' : 'Action from meeting MTG-27-01184 · due 14 days after the Expo.',
      products: prods,
      np: { ...s.np, setName: e => this.setState({ np: { ...s.np, name: e.target.value } }), setCat: e => this.setState({ np: { ...s.np, cat: e.target.value } }), setMoq: e => this.setState({ np: { ...s.np, moq: e.target.value } }), add: () => { if (!s.np.name) return; this.setState({ extra: [...extra, { ...s.np }], np: { name: '', cat: 'Football', moq: '' } }); this.flash('Product submitted for review'); } },
      forceAvail: ['SGM-017'],
      stallRows: [['Product', 'Premium Booth · 6 × 3 m · 18 m²'], ['Location', 'Zone B · Sports Goods Manufacturing · row 2'], ['Frontage', 'Corner, faces Sports Boulevard'], ['Neighbours', 'Meerut Willow Works (B-SGM-009), OEM cluster'], ['From entrance', '4 min walk'], ['Utilities', '2 × 15A · track lighting · Wi-Fi'], ['Build-up', 'Day −2 · 08:00–20:00 (sample)']].map(([k, v]) => ({ k, v })),
      bars: days.map((l, i) => ({ l, t: vals[i] + '', h: (vals[i] / 260 * 100) + '%', c: i > 10 ? (ph === 'pre' ? '#E3E0D8' : '#F07C12') : '#BDB9B0' })),
      byCountry: [['India', 142], ['Germany', 61], ['United Kingdom', 54], ['UAE', 48], ['Australia', 33], ['Japan', 21]].map(([t, v]) => ({ t, v: ph === 'pre' ? '—' : v, w: ph === 'pre' ? '0%' : (v / 142 * 100) + '%' })),
      leads: [['Lukas Brandt', 'Global Sports Retail GmbH', 'Match balls, goals', 'MEETING', 'HOT · LOI', '#9E1B22', 'D2 11:00'], ['Hannah Cole', 'Northline Distribution', 'Training range', 'MEETING', 'HOT', '#9E1B22', 'D2 14:30'], ['Omar Haddad', 'Gulf Arena Supplies', 'Goal systems', 'BADGE SCAN', 'WARM', '#C2610B', 'D2 16:12'], ['Meenakshi Rao', 'Sample State Sports Dept.', 'Community kits', 'BADGE SCAN', 'WARM', '#C2610B', 'D1 12:40'], ['Tom Price', 'Independent retailer', 'Futsal balls', 'APP SAVE', 'COLD', '#6B6A66', 'D1 15:05']].map(([name, org, interest, src, temp, c, when]) => ({ name, org, interest, src, temp, c, when })).slice(0, ph === 'pre' ? 0 : 5),
      exportLeads: () => this.flash(ph === 'pre' ? 'No leads yet — capture starts on Day 1' : 'leads_apex_ise27.csv downloaded (demo)'),
      isPost: ph === 'post',
      legacy: [{ t: 'Made in India: Scaling Sports Goods Exports', d: 'Recording · 44 min · Rahul Bhandari on stage', href: withBase('/programme#watch') }, { t: '21 meetings · 2 LoIs · 1 sample order', d: 'Outcome report for your board', href: withBase('/connect#meetings') }, { t: 'Rebook for 2028', d: 'Priority window for returning exhibitors', href: withBase('/exhibit') }],
      table: tbl ? { ...tbl, grid: tbl.cols.map((_, i) => i === 0 || (tbl.cols.length > 3 && i === 2) ? 'minmax(0,1.4fr)' : 'minmax(0,1fr)').join(' ') } : { cols: [], rows: [] }, hasAction: !!(tbl && tbl.action), tableAction,
      hasTimeline: !!(tbl && tbl.timeline), timeline: tbl && tbl.timeline ? tbl.timeline.map(([d, t, sub, c]) => ({ d, t, s: sub, c })) : [],
      toast: !!s.toast, toastText: s.toast || ''
    };
  }
}

function render(v) {
  return (
    <>
      <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "240px minmax(0,1fr)" }}>
        <aside style={{ background: "#0E0E0F", color: "#fff", display: "flex", flexDirection: "column", position: "sticky", top: "0", height: "100vh", overflow: "auto" }}>
          <a href={withBase("/")} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#fff", padding: "20px", borderBottom: "1px solid #2A2A2D" }}>
            <BrandLogo className="site-logo" />
            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#BDB9B0" }}>EXHIBITOR</span>
          </a>
          <nav aria-label="Exhibitor modules" style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {list(v.mods).map((m, $index) => (
              <Fragment key={$index}>
                <button onClick={m?.pick} style={sx(`display:flex;justify-content:space-between;align-items:center;height:42px;padding:0 20px;border:0;border-left:4px solid ${m?.bl ?? ""};background:${m?.bg ?? ""};color:${m?.fg ?? ""};font-size:13px;font-weight:600;text-align:left;cursor:pointer;`)}>
                  {txt(m?.t)}
                  <span style={sx(`font-family:var(--f-label);font-size:11px;color:${m?.bc ?? ""};`)}>{txt(m?.badge)}</span>
                </button>
              </Fragment>
            ))}
          </nav>
          <div style={{ marginTop: "auto", padding: "20px", borderTop: "1px solid #2A2A2D", display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#8A877F" }}>
            <span style={{ color: "#fff", fontWeight: "600" }}>Rahul Bhandari</span>
            <span>Managing Director · Admin</span>
            <a href={withBase("/exhibit")} style={{ color: "#BDB9B0", marginTop: "6px" }}>← Public site</a>
          </div>
        </aside>
        <main style={{ minWidth: "0", display: "flex", flexDirection: "column" }}>
          <header style={{ background: "#fff", borderBottom: "1px solid #0E0E0F", padding: "22px 32px", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "20px", alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.18em", color: "#6B6A66" }}>EXHIBITOR CONTROL CENTRE</span>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.88" }}>Apex Sports India</span>
              <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", fontSize: "13px", marginTop: "4px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.1em", color: "#0B6E4F", border: "1px solid #0B6E4F", padding: "4px 8px" }}>
                  ■ ALLOCATED
                </span>
                <span>
                  <span style={{ color: "#6B6A66" }}>Stall</span>
                  {" "}
                  <b style={{ fontFamily: "var(--f-label)" }}>B-SGM-017</b>
                </span>
                <span>
                  <span style={{ color: "#6B6A66" }}>Type</span>
                  {" "}
                  <b>Premium Booth · 6 × 3 m</b>
                </span>
                <span>
                  <span style={{ color: "#6B6A66" }}>Zone</span>
                  {" "}
                  <b>B · Sports Goods Manufacturing</b>
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>PROTOTYPE · PHASE</span>
              <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                {list(v.phases).map((p, $index) => (
                  <Fragment key={$index}>
                    <button onClick={p?.pick} style={sx(`height:34px;padding:0 12px;border:0;border-right:1px solid #0E0E0F;background:${p?.bg ?? ""};color:${p?.fg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.1em;cursor:pointer;`)}>
                      {txt(p?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </header>
          <div style={{ padding: "28px 32px 56px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
              <h1 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9", textTransform: "uppercase" }}>
                {txt(v.panelTitle)}
              </h1>
              <span style={{ fontSize: "14px", color: "#3A3A3E", maxWidth: "560px" }}>{txt(v.panelIntro)}</span>
            </div>
            {v.pOverview ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", background: "#fff", border: "1px solid #0E0E0F" }}>
                    {list(v.metrics).map((m, $index) => (
                      <Fragment key={$index}>
                        <div style={{ padding: "18px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(m?.k)}</span>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>{txt(m?.v)}</span>
                          <span style={sx(`font-family:var(--f-label);font-size:11px;color:${m?.dc ?? ""};`)}>{txt(m?.d)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "24px" }}>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>Readiness checklist</b>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(v.readyPct)}</span>
                      </div>
                      <div style={{ height: "6px", background: "#E3E0D8" }}>
                        <div style={sx(`height:6px;width:${v.readyPct ?? ""};background:#0B6E4F;`)} />
                      </div>
                      {list(v.checklist).map((c, $index) => (
                        <Fragment key={$index}>
                          <button onClick={c?.go} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: "10px", padding: "10px 0", border: "0", borderBottom: "1px solid #E3E0D8", background: "none", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "#0E0E0F", alignItems: "center" }}>
                            <span style={sx(`font-family:var(--f-label);color:${c?.c ?? ""};`)}>{txt(c?.i)}</span>
                            <span>{txt(c?.t)}</span>
                            <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.1em;color:${c?.c ?? ""};`)}>{txt(c?.st)}</span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div style={{ background: "#0E0E0F", color: "#fff", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#F07C12" }}>NEW BUYER MATCHES</span>
                        {list(v.topMatches).map((m, $index) => (
                          <Fragment key={$index}>
                            <div style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: "12px", padding: "10px 0", borderTop: "1px solid #2A2A2D", alignItems: "center" }}>
                              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "25px", color: "#F07C12" }}>{txt(m?.score)}%</span>
                              <span>
                                <b style={{ display: "block", fontSize: "15px" }}>{txt(m?.name)}</b>
                                <span style={{ fontSize: "12px", color: "#8A877F" }}>{txt(m?.country)}{" · "}{txt(m?.seeking)}</span>
                              </span>
                              <button onClick={m?.request} style={sx(`height:34px;padding:0 10px;border:1px solid #fff;background:${m?.bg ?? ""};color:${m?.fg ?? ""};font-size:11px;font-weight:700;cursor:pointer;`)}>
                                {txt(m?.label)}
                              </button>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>{txt(v.nextKey)}</span>
                        <b style={{ fontSize: "18px" }}>{txt(v.nextTitle)}</b>
                        <span style={{ fontSize: "14px", color: "#3A3A3E" }}>{txt(v.nextDesc)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.pProducts ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }}>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F" }}>
                    {list(v.products).map((p, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) auto auto", gap: "16px", padding: "14px 18px", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                          <span style={{ width: "64px", height: "64px", background: "repeating-linear-gradient(135deg,#F1EFEA 0 6px,#F6F4EF 6px 12px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-label)", fontSize: "9px", color: "#8A877F" }}>
                            IMG
                          </span>
                          <span>
                            <b style={{ display: "block", fontSize: "16px" }}>{txt(p?.name)}</b>
                            <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(p?.cat)}{" · "}{txt(p?.moq)}</span>
                          </span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", color: "#6B6A66" }}>{txt(p?.views)}{" views"}</span>
                          <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.1em;border:1px solid ${p?.c ?? ""};color:${p?.c ?? ""};padding:4px 8px;`)}>
                            {txt(p?.st)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Upload a product</b>
                    <div style={{ aspectRatio: "16/9", position: "relative" }}>
                      <image-slot id="new-product-img" shape="rect" placeholder="Drop product image" />
                    </div>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600" }}>Product name</span>
                      <input value={val(v.np?.name)} onChange={v.np?.setName} style={{ height: "44px", border: "1px solid #0E0E0F", padding: "0 12px", fontSize: "15px" }} />
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>Sport</span>
                        <select value={val(v.np?.cat)} onChange={v.np?.setCat} style={{ height: "44px", border: "1px solid #0E0E0F", padding: "0 10px", fontSize: "15px", background: "#fff" }}>
                          <option>Football</option>
                          <option>Hockey</option>
                          <option>Cricket</option>
                          <option>Athletics</option>
                          <option>Fitness</option>
                        </select>
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>Minimum order</span>
                        <input value={val(v.np?.moq)} onChange={v.np?.setMoq} style={{ height: "44px", border: "1px solid #0E0E0F", padding: "0 12px", fontSize: "15px" }} />
                      </label>
                    </div>
                    <button onClick={v.np?.add} style={{ height: "50px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                      Submit for review
                    </button>
                    <span style={{ fontSize: "12px", color: "#6B6A66" }}>Products are reviewed by the organiser before they appear in the public directory and buyer matching.</span>
                  </div>
                </div>
              </>
            ) : null}
            {v.pStall ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }}>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "18px" }}>
                    <HallPlan mode={"inventory"} activeZone={"B"} selectedCluster={"SGM"} selectedStall={"B-SGM-017"} forceAvail={v.forceAvail} />
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.85" }}>B-SGM-017</span>
                    <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "120px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                      {list(v.stallRows).map((r, $index) => (
                        <Fragment key={$index}>
                          <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                          <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                        </Fragment>
                      ))}
                    </dl>
                    <a href={withBase("/exhibit#products")} style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>View booth in 3D →</a>
                  </div>
                </div>
              </>
            ) : null}
            {v.pAnalytics ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "24px" }}>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>{"Profile & stall traffic"}</b>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(14,1fr)", gap: "6px", alignItems: "end", height: "200px", borderBottom: "1px solid #0E0E0F" }}>
                        {list(v.bars).map((b, $index) => (
                          <Fragment key={$index}>
                            <div title={b?.t} style={sx(`height:${b?.h ?? ""};background:${b?.c ?? ""};`)} />
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(14,1fr)", gap: "6px", fontFamily: "var(--f-label)", fontSize: "9px", color: "#6B6A66" }}>
                        {list(v.bars).map((b, $index) => (
                          <Fragment key={$index}>
                            <span>{txt(b?.l)}</span>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "18px", fontSize: "12px" }}>
                        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ width: "12px", height: "12px", background: "#BDB9B0" }} />
                          Online profile views (pre-event)
                        </span>
                        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ width: "12px", height: "12px", background: "#F07C12" }} />
                          Stall scans (event days)
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>Leads by country</b>
                      {list(v.byCountry).map((c, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 40px", gap: "10px", alignItems: "center", fontSize: "13px" }}>
                            <span>{txt(c?.t)}</span>
                            <span style={{ height: "14px", background: "#F1EFEA" }}>
                              <span style={sx(`display:block;height:14px;width:${c?.w ?? ""};background:#0E0E0F;`)} />
                            </span>
                            <span style={{ fontFamily: "var(--f-label)", textAlign: "right" }}>{txt(c?.v)}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #0E0E0F" }}>
                      <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>Leads captured</b>
                      <button onClick={v.exportLeads} style={{ height: "36px", padding: "0 14px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                        Export CSV
                      </button>
                    </div>
                    {list(v.leads).map((l, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr) 110px 110px 100px", gap: "14px", padding: "12px 18px", borderBottom: "1px solid #E3E0D8", fontSize: "14px", alignItems: "center" }}>
                          <span>
                            <b>{txt(l?.name)}</b>
                            <span style={{ display: "block", fontSize: "12px", color: "#6B6A66" }}>{txt(l?.org)}</span>
                          </span>
                          <span style={{ color: "#3A3A3E" }}>{txt(l?.interest)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(l?.src)}</span>
                          <span style={sx(`font-family:var(--f-label);font-size:11px;color:${l?.c ?? ""};`)}>{txt(l?.temp)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(l?.when)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {v.isPost ? (
                    <>
                      <div style={{ background: "#0E0E0F", color: "#fff", padding: "22px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#F07C12" }}>POST-EVENT · DIGITAL LEGACY</span>
                          <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "26px", lineHeight: "0.9" }}>{"Your recordings & outcomes"}</b>
                        </div>
                        {list(v.legacy).map((g, $index) => (
                          <Fragment key={$index}>
                            <a href={g?.href} style={{ color: "#fff", textDecoration: "none", borderTop: "1px solid #3A3A3E", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <b style={{ fontSize: "16px" }}>{txt(g?.t)}</b>
                              <span style={{ fontSize: "13px", color: "#BDB9B0" }}>{txt(g?.d)}</span>
                            </a>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {v.pTable ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {v.hasTimeline ? (
                    <>
                      <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", background: "#fff", border: "1px solid #0E0E0F" }}>
                        {list(v.timeline).map((t, $index) => (
                          <Fragment key={$index}>
                            <li style={sx(`padding:14px;border-right:1px solid #E3E0D8;border-top:4px solid ${t?.c ?? ""};display:flex;flex-direction:column;gap:4px;`)}>
                              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(t?.d)}</span>
                              <b style={{ fontSize: "14px" }}>{txt(t?.t)}</b>
                              <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(t?.s)}</span>
                            </li>
                          </Fragment>
                        ))}
                      </ol>
                    </>
                  ) : null}
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", overflowX: "auto" }}>
                    <div role="table" style={{ minWidth: "720px" }}>
                      <div role="row" style={sx(`display:grid;grid-template-columns:${v.table?.grid ?? ""};border-bottom:1px solid #0E0E0F;`)}>
                        {list(v.table?.cols).map((c, $index) => (
                          <Fragment key={$index}>
                            <span role="columnheader" style={{ padding: "12px 18px", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                              {txt(c)}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      {list(v.table?.rows).map((r, $index) => (
                        <Fragment key={$index}>
                          <div role="row" style={sx(`display:grid;grid-template-columns:${v.table?.grid ?? ""};border-bottom:1px solid #E3E0D8;align-items:center;`)}>
                            {list(r?.cells).map((c, $index) => (
                              <Fragment key={$index}>
                                <span role="cell" style={sx(`padding:12px 18px;color:${c?.c ?? ""};font-weight:${c?.w ?? ""};font-family:${c?.f ?? ""};font-size:${c?.s ?? ""};`)}>
                                  {txt(c?.v)}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  {v.hasAction ? (
                    <>
                      <button onClick={v.tableAction} style={{ alignSelf: "flex-start", height: "46px", padding: "0 20px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                        {txt(v.table?.action)}
                      </button>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </main>
        {v.toast ? (
          <>
            <div role="status" style={{ position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: "120", background: "#0E0E0F", color: "#fff", padding: "14px 20px", fontSize: "14px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ color: "#F07C12" }}>●</span>
              {txt(v.toastText)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default defineDC("Exhibitor Portal", Component, render);
