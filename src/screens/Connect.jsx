'use client';
// Generated from design/site/Connect.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';

/* global maplibregl */
class Component extends DCLogic {
  state = { iam: 'EXHIBITOR', look: 'DISTRIBUTOR', f: { country: 'Germany', sector: 'Sports goods', product: 'Football equipment', opp: 'Distribution' }, loading: false, searched: true, req: {}, prof: null, mtype: 'BUYER–SELLER', step: 2, slot: '2-11:00', table: 14, out: ['Lead', 'LoI'], cty: 'DE', toast: null };
  componentDidMount() { if (!window.ISE) this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); }
  componentWillUnmount() { clearInterval(this._t); clearTimeout(this._l); clearTimeout(this._toast); }
  flash(t) { clearTimeout(this._toast); this.setState({ toast: t }); this._toast = setTimeout(() => this.setState({ toast: null }), 2600); }
  renderVals() {
    const D = window.ISE; const s = this.state;
    const sel = on => ({ bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    if (!D) return { iam: [], look: [], filters: [], results: [], skeleton: [], mtypes: [], flow: [], fs: { lines: [] }, slots: [], tables: [], outcomes: [], record: [], arcs: [], india: {}, ctyPins: [], cty: {}, ctyRows: [], ctyList: [], lounges: [], pr: { rows: [] } };
    const extra = [
      { name: 'Alpenline Sport AG', country: 'Switzerland', role: 'Distributor', seeking: 'Premium training equipment', score: 69, why: ['Product fit', 'Geographic interest'] },
      { name: 'Riyadh Sports Projects', country: 'Saudi Arabia', role: 'Government', seeking: 'Community pitch equipment', score: 64, why: ['Buyer requirement'] }
    ];
    const all = [...D.matches, ...extra];
    const FACT = { 'Product fit': 96, 'Market fit': 88, 'Buyer requirement': 91, 'Geographic interest': 84 };
    const pr = s.prof != null ? all[s.prof] : null;
    const reqd = n => s.req[n];
    const request = (m) => () => { this.setState({ req: { ...s.req, [m.name]: true } }); this.flash('Meeting request sent to ' + m.name); };
    const FLOW = [
      ['REQUEST', 'Request sent', 'Apex Sports India requested a meeting with Global Sports Retail GmbH through the Exchange.', [['✓', 'Purpose: European distribution of match and training footballs'], ['✓', 'Suggested duration: 30 min'], ['✓', 'Message attached with catalogue link']], 'MARK ACCEPTED →'],
      ['ACCEPT', 'Request accepted', 'Lukas Brandt accepted. Both calendars are now compared for mutual availability.', [['✓', 'Accepted by Lukas Brandt · 08 May 14:20 (demo)'], ['✓', 'Second attendee added: Simran Kaur, Export Manager']], 'CHOOSE SLOT →'],
      ['SELECT SLOT', 'Select a slot', 'Only times free for both parties are offered.', [], 'ALLOCATE TABLE →'],
      ['ROOM / TABLE', 'Room & table', 'B2B Meeting Zone & Networking Café · 40 tables. Deal rooms for MoU signings.', [], 'CONFIRM →'],
      ['CONFIRM', 'Meeting confirmed', 'Both parties receive the confirmation, calendar file and route.', [['✓', 'Calendar invite sent (.ics)'], ['✓', 'Added to both My Expo schedules'], ['✓', 'Route from B-SGM-017 to table generated']], 'SET REMINDERS →'],
      ['REMINDER', 'Reminders', 'Push and email reminders before the meeting.', [['◷', '24 hours before · email'], ['◷', '15 minutes before · push: “Meeting in 15 min”'], ['◷', 'Table change alerts if reallocated']], 'CHECK IN →'],
      ['CHECK-IN', 'Check-in', 'Scan the table QR or tap check-in in the app. No-shows release the table after 10 minutes.', [['✓', 'Apex Sports India checked in · 10:56'], ['✓', 'Global Sports Retail checked in · 10:58']], 'START MEETING →'],
      ['MEETING', 'In meeting', 'Timer runs on both devices. Notes are private to each party.', [['●', '00:18:42 elapsed of 30:00'], ['✓', 'Shared: Pro Match Football FQ-5 spec sheet']], 'RECORD OUTCOME →'],
      ['OUTCOME', 'Record outcome', 'Each party records what happened. Outcomes feed the Command Dashboard.', [], 'SCHEDULE FOLLOW-UP →'],
      ['FOLLOW-UP', 'Follow-up', 'Actions with owners and dates. Reminders continue after the Expo.', [['→', 'Send pricing sheet · Apex · Day 3'], ['→', 'Sample order PO · GSR · 30 days post-event'], ['→', 'Follow-up video call · 14 days post-event']], 'DONE ✓']
    ];
    const f = FLOW[s.step];
    const times = ['10:00', '10:30', '11:00', '11:30', '14:00', '15:30'];
    const busy = (d, t) => ((d * 7 + t.charCodeAt(1) + t.charCodeAt(3)) % 3 === 0);
    const C = D.countries;
    const cty = C.find(c => c.id === s.cty);
    const px = c => ((c.lon + 180) / 360 * 100), py = c => ((90 - c.lat) / 180 * 100);
    const IN = { lon: 77.1, lat: 28.6 };
    const slotLabel = s.slot ? 'Day ' + s.slot.split('-')[0] + ' · ' + s.slot.split('-')[1] : '—';
    const tableLabel = s.table <= 40 ? 'B2B Zone · Table ' + String(s.table).padStart(2, '0') : 'Deal Room ' + (s.table - 40);
    const DEL = { JP: ['18-member delegation led by trade agency (sample)', 'Precision timing, materials, venue engineering', 'Hayate Sports Engineering', 'Aiko Tanaka · Day 1 14:00'], DE: ['24-member delegation (sample)', 'Lighting, retail, football industry', 'Luminar Stadium Lighting, Global Sports Retail', 'Lukas Brandt · Day 1 11:30'], GB: ['20-member delegation (sample)', 'Venue operations, media, leagues', 'Stadia Partners UK', 'Sarah Okafor · Day 1 14:00'], AE: ['12-member delegation (sample)', 'Event hosting, sports tourism', 'Gulf Arena Supplies, FanLoop', 'Panel · Day 2 15:30'], AU: ['15-member delegation (sample)', 'Sports science, seating, stadium delivery', 'FlexSeat Arenas, Paceline', 'Panel · Day 3 14:00'], US: ['22-member delegation (sample)', 'Fan engagement, media rights', '11 companies (demo)', 'Panel · Day 2 14:00'] }[cty.id];
    return {
      iam: ['EXHIBITOR', 'BUYER', 'INVESTOR', 'DISTRIBUTOR', 'GOVERNMENT', 'STARTUP'].map(t => ({ t, ...sel(t === s.iam), pick: () => this.setState({ iam: t }) })),
      look: ['PRODUCT', 'SUPPLIER', 'PARTNER', 'INVESTMENT', 'DISTRIBUTOR', 'TECHNOLOGY'].map(t => ({ t, ...sel(t === s.look), pick: () => this.setState({ look: t }) })),
      filters: [['country', 'COUNTRY', ['Germany', 'United Kingdom', 'UAE', 'Japan', 'Any']], ['sector', 'SECTOR', ['Sports goods', 'Infrastructure', 'SportsTech', 'Apparel']], ['product', 'PRODUCT', ['Football equipment', 'Cricket equipment', 'Turf', 'Lighting']], ['opp', 'OPPORTUNITY', ['Distribution', 'Sourcing', 'Investment', 'Joint venture']]].map(([k, label, opts]) => ({ label, opts, value: s.f[k], set: e => this.setState({ f: { ...s.f, [k]: e.target.value } }) })),
      find: () => { this.setState({ loading: true, searched: false }); clearTimeout(this._l); this._l = setTimeout(() => this.setState({ loading: false, searched: true }), 1300); setTimeout(() => { const el = document.getElementById('matches'); el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); }, 60); },
      findLabel: s.loading ? 'Matching…' : 'Find matches →',
      loading: s.loading, showResults: s.searched && !s.loading,
      skeleton: ['Scoring product fit…', 'Checking market overlap…', 'Reading buyer requirements…', 'Comparing geographies…'],
      matchSummary: `${s.iam} → ${s.look} · ${s.f.country.toUpperCase()} · ${s.f.product.toUpperCase()} · ${all.length} MATCHES`,
      results: all.map((m, i) => ({ ...m, roleU: m.role.toUpperCase(), countryU: m.country.toUpperCase(), sc: m.score >= 85 ? '#0B6E4F' : m.score >= 70 ? '#0E0E0F' : '#8A877F',
        why: ['Product fit', 'Market fit', 'Buyer requirement', 'Geographic interest'].map(t => { const has = m.why.includes(t); const v = has ? Math.min(99, FACT[t] - (100 - m.score) / 3 | 0) : 20 + (i * 7) % 25; return { t, v: v + '', pct: v + '%', c: has ? '#0B6E4F' : '#BDB9B0' }; }),
        reqLabel: reqd(m.name) ? '✓ Requested' : 'Request meeting', reqBg: reqd(m.name) ? '#E3F1EB' : '#0E0E0F', reqFg: reqd(m.name) ? '#0B6E4F' : '#fff', request: request(m), profile: () => this.setState({ prof: i }) })),
      profileOpen: !!pr, closeProfile: () => this.setState({ prof: null }), stop: e => e.stopPropagation(),
      pr: pr ? { ...pr, roleU: pr.role.toUpperCase(), countryU: pr.country.toUpperCase(), reqLabel: reqd(pr.name) ? '✓ Meeting requested' : 'Request meeting', request: request(pr),
        rows: [{ k: 'Looking for', v: pr.seeking }, { k: 'Match score', v: pr.score + '% · ' + pr.why.join(', ') }, { k: 'Annual volume', v: pr.role === 'Investor' ? 'Ticket ₹5–40 Cr (sample)' : '€5–20M sourcing (sample)' }, { k: 'Markets', v: pr.country === 'Germany' ? 'DACH, Benelux' : pr.country }, { k: 'Attending', v: 'Day 1 – Day 3 · Hosted Buyer (sample)' }, { k: 'Availability', v: '6 open slots on Day 2' }] } : { rows: [] },
      mtypes: ['B2B', 'B2G', 'G2G', 'BUYER–SELLER', 'INVESTOR', 'FEDERATION', 'CEO / STRATEGIC'].map(t => ({ t, ...sel(t === s.mtype), pick: () => this.setState({ mtype: t }) })), mtype: s.mtype,
      flow: FLOW.map((x, i) => ({ t: x[0], n: String(i + 1).padStart(2, '0'), mark: i < s.step ? '✓' : '', bg: i === s.step ? '#0E0E0F' : i < s.step ? '#F6F4EF' : '#fff', fg: i === s.step ? '#fff' : i < s.step ? '#0E0E0F' : '#8A877F', go: () => this.setState({ step: i }) })),
      fs: { n: s.step + 1, title: f[1].toUpperCase(), d: f[2], lines: f[3].map(([i, t]) => ({ i, t })), cta: f[4] },
      isSlot: s.step === 2, isRoom: s.step === 3, isOutcome: s.step === 8, isGeneric: ![2, 3, 8].includes(s.step),
      prevStep: () => this.setState({ step: Math.max(0, s.step - 1) }), nextStep: () => s.step === 9 ? this.flash('Meeting record closed. Outcome sent to both parties.') : this.setState({ step: s.step + 1 }),
      slots: times.map(t => ({ t, cells: [1, 2, 3].map(d => { const id = d + '-' + t; const b = busy(d, t); const on = s.slot === id; return { busy: b, label: b ? 'BUSY' : on ? '✓ ' + t : 'FREE', bd: b ? '#BDB9B0' : '#0E0E0F', bg: on ? '#F07C12' : b ? 'repeating-linear-gradient(-45deg,#E3E0D8 0 1px,#F6F4EF 1px 5px)' : '#fff', fg: b ? '#8A877F' : '#0E0E0F', pick: () => !b && this.setState({ slot: id }) }; }) })),
      tables: Array.from({ length: 40 }, (_, i) => { const n = i + 1; const taken = (n * 13) % 5 === 0; const on = s.table === n; return { n: String(n).padStart(2, '0'), bd: taken ? '#BDB9B0' : '#0E0E0F', bg: on ? '#F07C12' : taken ? '#3A3A3E' : '#fff', fg: taken ? '#8A877F' : '#0E0E0F', pick: () => !taken && this.setState({ table: n }) }; }),
      outcomes: ['Lead', 'LoI', 'MoU', 'Order placed', 'No fit'].map(t => { const on = s.out.includes(t); return { t, mark: on ? '✓ ' : '', ...sel(on), pick: () => this.setState({ out: on ? s.out.filter(x => x !== t) : [...s.out, t] }) }; }),
      record: [
        ['Type', s.mtype], ['Companies', 'Apex Sports India · Global Sports Retail GmbH'], ['People', 'Rahul Bhandari, Simran Kaur · Lukas Brandt'], ['Purpose', 'European distribution, AW27 football range'],
        ['Time', s.step >= 2 ? slotLabel : '—'], ['Room', s.step >= 3 ? tableLabel : '—'], ['Status', FLOW[s.step][1]],
        ['Notes', s.step >= 7 ? 'Sample order of 2,000 FQ-5 balls discussed' : '—'], ['Outcomes', s.step >= 8 ? s.out.join(', ') || '—' : '—'],
        ['Actions', s.step >= 9 ? '3 actions · 2 owners' : '—'], ['LoI / MoU', s.step >= 8 && s.out.includes('LoI') ? 'LoI drafted · signature pending' : '—'], ['Follow-up', s.step >= 9 ? '14 days post-event' : '—']
      ].map(([k, v]) => ({ k, v, c: v === '—' ? '#BDB9B0' : '#0E0E0F' })),
      india: { x: px(IN) + '%', y: py(IN) + '%' },
      arcs: C.map(c => { const x1 = px(c), y1 = py(c), x2 = px(IN), y2 = py(IN); const dx = (x2 - x1), dy = (y2 - y1) / 2; const len = Math.sqrt(dx * dx + dy * dy); return { x: x1 + '%', y: y1 + '%', w: len + '%', r: Math.atan2(dy, dx) + 'rad', c: c.id === s.cty ? '#F07C12' : '#55555A', o: c.id === s.cty ? 1 : 0.6 }; }),
      ctyPins: C.map(c => ({ ...c, nameU: c.name.toUpperCase(), x: px(c) + '%', y: py(c) + '%', fill: c.id === s.cty ? '#F07C12' : '#0E0E0F', lbg: c.id === s.cty ? '#C2610B' : 'transparent', pick: () => this.setState({ cty: c.id }) })),
      cty, ctyRows: [{ k: 'Location', v: 'Zone D · International / Country Pavilions · ' + cty.pav }, { k: 'Delegation', v: DEL[0] }, { k: 'Technologies', v: DEL[1] }, { k: 'Companies', v: cty.companies + ' exhibiting · incl. ' + DEL[2] }, { k: 'Buyers', v: Math.round(cty.companies * 1.6) + ' hosted buyers (sample)' }, { k: 'Speaker', v: DEL[3] }],
      ctyMeet: () => this.flash('Meeting request sent to the ' + cty.name + ' delegation desk'),
      ctyList: C.map(c => ({ ...c, ...sel(c.id === s.cty), pick: () => this.setState({ cty: c.id }) })),
      lounges: [
        { t: 'Hosted Buyer Lounge', access: 'INVITE ONLY', c: '#F07C12', d: 'Concierge, private tables and buyer briefings.', cap: '80 seats' },
        { t: 'MoU / Deal Rooms', access: 'BOOKABLE', c: '#0B6E4F', d: 'Six closed rooms for signings and negotiations.', cap: '6 rooms · 8–16 seats' },
        { t: 'B2B Zone & Networking Café', access: 'BUYER / EXHIBITOR', c: '#0B6E4F', d: 'Scheduled meetings at numbered tables.', cap: '40 tables' },
        { t: 'Investor Lounge', access: 'ACCREDITED', c: '#C9A227', d: 'Startup pitches by appointment and deal flow.', cap: '40 seats' },
        { t: 'Federation Lounge', access: 'ACCREDITED', c: '#C9A227', d: 'Federations meet partners and suppliers.', cap: '40 seats' },
        { t: 'CEO Lounge', access: 'INVITE ONLY', c: '#F07C12', d: 'Senior leadership and G2G conversations.', cap: '30 seats' }
      ],
      toast: !!s.toast, toastText: s.toast || ''
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
            <a href={withBase("/exhibit")} style={{ color: "#fff", textDecoration: "none" }}>Exhibit</a>
            <a href={withBase("/attend")} style={{ color: "#fff", textDecoration: "none" }}>Attend</a>
            <a href={withBase("/connect")} style={{ color: "#F07C12", textDecoration: "none" }}>Connect</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Programme</a>
            <a href={withBase("/programme#watch")} style={{ color: "#fff", textDecoration: "none" }}>Watch</a>
          </nav>
          <a href={withBase("/attend#myexpo")} style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            My Expo
          </a>
          <a href="#exchange" style={{ background: "#F07C12", color: "#0E0E0F", textDecoration: "none", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", height: "36px", display: "flex", alignItems: "center", padding: "0 16px", whiteSpace: "nowrap" }}>
            Find matches
          </a>
        </header>
        <section id="exchange" data-screen-label="Business Exchange" style={{ scrollMarginTop: "60px", background: "#0E0E0F", color: "#fff", padding: "80px 28px 72px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,520px),1fr))", gap: "56px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#BDB9B0" }}>
                ZONE D · INDIA SPORTS BUSINESS EXCHANGE
              </span>
              <h1 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(64px,8vw,132px) * 0.72)", lineHeight: "0.84" }}>
                Build the
                <br />
                business
                <br />
                of sport.
              </h1>
              <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.5", color: "#BDB9B0", maxWidth: "520px" }}>
                Tell the Exchange who you are and what you need. Matches are scored on product, market, requirement and geography, then turned into meetings with a room, a time and an outcome.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid #3A3A3E", marginTop: "12px" }}>
                <div style={{ padding: "16px 12px 0 0" }}>
                  <span style={{ display: "block", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", color: "#F07C12", lineHeight: "0.9" }}>
                    3,200
                  </span>
                  <span style={{ fontSize: "13px", color: "#BDB9B0" }}>meetings targeted (demo)</span>
                </div>
                <div style={{ padding: "16px 12px 0 0" }}>
                  <span style={{ display: "block", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>40</span>
                  <span style={{ fontSize: "13px", color: "#BDB9B0" }}>B2B tables</span>
                </div>
                <div style={{ padding: "16px 12px 0 0" }}>
                  <span style={{ display: "block", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "36px", lineHeight: "0.9" }}>6</span>
                  <span style={{ fontSize: "13px", color: "#BDB9B0" }}>MoU / deal rooms</span>
                </div>
              </div>
            </div>
            <div style={{ background: "#fff", color: "#0E0E0F", padding: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              <div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>01 · I AM A</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid #0E0E0F", borderLeft: "1px solid #0E0E0F", marginTop: "8px" }}>
                  {list(v.iam).map((o, $index) => (
                    <Fragment key={$index}>
                      <button onClick={o?.pick} style={sx(`height:50px;border:0;border-right:1px solid #0E0E0F;border-bottom:1px solid #0E0E0F;background:${o?.bg ?? ""};color:${o?.fg ?? ""};font-size:13px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                        {txt(o?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>02 · I AM LOOKING FOR</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: "1px solid #0E0E0F", borderLeft: "1px solid #0E0E0F", marginTop: "8px" }}>
                  {list(v.look).map((o, $index) => (
                    <Fragment key={$index}>
                      <button onClick={o?.pick} style={sx(`height:50px;border:0;border-right:1px solid #0E0E0F;border-bottom:1px solid #0E0E0F;background:${o?.bg ?? ""};color:${o?.fg ?? ""};font-size:13px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                        {txt(o?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "14px" }}>
                {list(v.filters).map((f, $index) => (
                  <Fragment key={$index}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(f?.label)}</span>
                      <select value={val(f?.value)} onChange={f?.set} style={{ height: "46px", border: "1px solid #0E0E0F", background: "#fff", padding: "0 10px", fontSize: "15px" }}>
                        {list(f?.opts).map((o, $index) => (
                          <Fragment key={$index}>
                            <option>{str(o)}</option>
                          </Fragment>
                        ))}
                      </select>
                    </label>
                  </Fragment>
                ))}
              </div>
              <button onClick={v.find} style={{ height: "56px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "14px", fontWeight: "700", letterSpacing: "0.12em", cursor: "pointer" }}>
                {txt(v.findLabel)}
              </button>
            </div>
          </div>
        </section>
        <section id="matches" data-screen-label="Matchmaking results" style={{ scrollMarginTop: "60px", padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              02 — Your matches
            </h2>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.1em" }}>{txt(v.matchSummary)}</span>
          </div>
          {v.loading ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "0", borderTop: "1px solid #0E0E0F" }}>
                {list(v.skeleton).map((k, $index) => (
                  <Fragment key={$index}>
                    <div style={{ padding: "24px 24px 24px 0", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <span style={{ height: "14px", width: "40%", background: "#F1EFEA" }} />
                      <span style={{ height: "36px", width: "80%", background: "#F1EFEA" }} />
                      <span style={{ height: "10px", width: "100%", background: "#F6F4EF" }} />
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(k)}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {" "}
          {v.showResults ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #0E0E0F" }}>
                {list(v.results).map((m, $index) => (
                  <Fragment key={$index}>
                    <article style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1.3fr) minmax(0,1fr) auto", gap: "28px", padding: "24px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={sx(`font-family:var(--f-display);font-stretch:62%;font-weight:900;font-size:45px;line-height:0.85;color:${m?.sc ?? ""};`)}>{txt(m?.score)}%</span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>MATCH</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                          {txt(m?.roleU)}{" · "}{txt(m?.countryU)}
                        </span>
                        <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9", textTransform: "uppercase" }}>
                          {txt(m?.name)}
                        </b>
                        <span style={{ fontSize: "15px" }}>
                          <span style={{ color: "#6B6A66" }}>Looking for:</span>
                          {" "}{txt(m?.seeking)}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>WHY THIS MATCH</span>
                        {list(m?.why).map((w, $index) => (
                          <Fragment key={$index}>
                            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 36px", gap: "10px", alignItems: "center", fontSize: "13px" }}>
                              <span>{txt(w?.t)}</span>
                              <span style={{ height: "6px", background: "#F1EFEA" }}>
                                <span style={sx(`display:block;height:6px;width:${w?.pct ?? ""};background:${w?.c ?? ""};`)} />
                              </span>
                              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", textAlign: "right" }}>{txt(w?.v)}</span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "180px" }}>
                        <button onClick={m?.request} style={sx(`height:44px;border:0;background:${m?.reqBg ?? ""};color:${m?.reqFg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                          {txt(m?.reqLabel)}
                        </button>
                        <button onClick={m?.profile} style={{ height: "44px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                          View profile
                        </button>
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
        </section>
        <section id="meetings" data-screen-label="Meeting management" style={{ scrollMarginTop: "60px", background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
                03 — Meetings
              </h2>
              <div style={{ display: "flex", gap: "0", border: "1px solid #0E0E0F", background: "#fff", flexWrap: "wrap" }}>
                {list(v.mtypes).map((t, $index) => (
                  <Fragment key={$index}>
                    <button onClick={t?.pick} style={sx(`height:38px;padding:0 12px;border:0;border-right:1px solid #0E0E0F;background:${t?.bg ?? ""};color:${t?.fg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                      {txt(t?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <ol aria-label="Meeting lifecycle" style={{ margin: "0", padding: "0", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(10,minmax(0,1fr))", background: "#fff", border: "1px solid #0E0E0F" }}>
              {list(v.flow).map((f, $index) => (
                <Fragment key={$index}>
                  <li>
                    <button onClick={f?.go} style={sx(`width:100%;height:72px;border:0;border-right:1px solid #E3E0D8;background:${f?.bg ?? ""};color:${f?.fg ?? ""};text-align:left;padding:10px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;`)}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "10px" }}>{txt(f?.n)}{" "}{txt(f?.mark)}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em" }}>{txt(f?.t)}</span>
                    </button>
                  </li>
                </Fragment>
              ))}
            </ol>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)", border: "1px solid #0E0E0F", borderTop: "0", background: "#fff" }}>
              <div style={{ padding: "32px", borderRight: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "20px", minHeight: "460px" }}>
                <div>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#C2610B" }}>
                    {"STEP "}{txt(v.fs?.n)}{" OF 10 · "}{txt(v.mtype)}
                  </span>
                  <div style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "41px", lineHeight: "0.88", marginTop: "6px" }}>
                    {txt(v.fs?.title)}
                  </div>
                  <div style={{ fontSize: "15px", color: "#3A3A3E", marginTop: "8px", maxWidth: "600px" }}>{txt(v.fs?.d)}</div>
                </div>
                {v.isSlot ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "70px repeat(3,minmax(0,1fr))", gap: "4px", fontFamily: "var(--f-label)", fontSize: "11px" }}>
                        <span />
                        <span style={{ textAlign: "center" }}>DAY 1</span>
                        <span style={{ textAlign: "center" }}>DAY 2</span>
                        <span style={{ textAlign: "center" }}>DAY 3</span>
                        {list(v.slots).map((r, $index) => (
                          <Fragment key={$index}>
                            <span style={{ display: "flex", alignItems: "center" }}>{txt(r?.t)}</span>
                            {list(r?.cells).map((c, $index) => (
                              <Fragment key={$index}>
                                <button onClick={c?.pick} disabled={c?.busy} style={sx(`height:38px;border:1px solid ${c?.bd ?? ""};background:${c?.bg ?? ""};color:${c?.fg ?? ""};font:500 11px var(--f-label);cursor:pointer;`)}>
                                  {txt(c?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </Fragment>
                        ))}
                      </div>
                      <span style={{ fontSize: "12px", color: "#6B6A66" }}>Hatched = busy for either party. Mutual availability shown only.</span>
                    </div>
                  </>
                ) : null}
                {v.isRoom ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: "4px" }}>
                      {list(v.tables).map((t, $index) => (
                        <Fragment key={$index}>
                          <button onClick={t?.pick} style={sx(`aspect-ratio:1;border:1px solid ${t?.bd ?? ""};background:${t?.bg ?? ""};color:${t?.fg ?? ""};font:500 11px var(--f-label);cursor:pointer;`)}>
                            {txt(t?.n)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.isOutcome ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {list(v.outcomes).map((o, $index) => (
                          <Fragment key={$index}>
                            <button onClick={o?.pick} style={sx(`height:40px;padding:0 14px;border:1px solid #0E0E0F;background:${o?.bg ?? ""};color:${o?.fg ?? ""};font-size:13px;font-weight:600;cursor:pointer;`)}>
                              {txt(o?.mark)}{txt(o?.t)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>Notes</span>
                        <textarea style={{ minHeight: "90px", border: "1px solid #0E0E0F", padding: "10px", fontSize: "14px" }} defaultValue={"Agreed sample order of 2,000 FQ-5 match balls for spring trial in 40 stores. Pricing sheet by Day 3."} />
                      </label>
                    </div>
                  </>
                ) : null}
                {v.isGeneric ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #E3E0D8" }}>
                      {list(v.fs?.lines).map((l, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "10px", padding: "12px 0", borderBottom: "1px solid #E3E0D8", fontSize: "15px" }}>
                            <span style={{ fontFamily: "var(--f-label)", color: "#0B6E4F" }}>{txt(l?.i)}</span>
                            <span>{txt(l?.t)}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "auto" }}>
                  <button onClick={v.prevStep} style={{ height: "50px", padding: "0 22px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                    ← Back
                  </button>
                  <button onClick={v.nextStep} style={{ height: "50px", padding: "0 26px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                    {txt(v.fs?.cta)}
                  </button>
                </div>
              </div>
              <aside style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>MEETING RECORD · MTG-27-01184</span>
                <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "28px", lineHeight: "0.9" }}>
                  Apex Sports India
                  <br />
                  <span style={{ color: "#8A877F" }}>×</span>
                  {" Global Sports Retail"}
                </span>
                <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "110px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                  {list(v.record).map((r, $index) => (
                    <Fragment key={$index}>
                      <dt style={{ padding: "8px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                      <dd style={sx(`margin:0;padding:8px 0;border-bottom:1px solid #E3E0D8;color:${r?.c ?? ""};`)}>{txt(r?.v)}</dd>
                    </Fragment>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </section>
        <section id="countries" data-screen-label="Country pavilions" style={{ scrollMarginTop: "60px", padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              04 — Country pavilions
            </h2>
            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.1em" }}>ZONE D · 6 PAVILIONS · DELEGATIONS ILLUSTRATIVE</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", border: "1px solid #0E0E0F" }}>
            <div role="group" aria-label="World map of participating countries" style={{ position: "relative", aspectRatio: "2/1", background: "#0E0E0F", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: "0", background: "repeating-linear-gradient(0deg,transparent 0 calc(16.66% - 1px),#2A2A2D calc(16.66% - 1px) 16.66%),repeating-linear-gradient(90deg,transparent 0 calc(8.33% - 1px),#2A2A2D calc(8.33% - 1px) 8.33%)" }} />
              <div style={{ position: "absolute", left: "0", right: "0", top: "50%", height: "1px", background: "#3A3A3E" }} />
              {list(v.arcs).map((a, $index) => (
                <Fragment key={$index}>
                  <div style={sx(`position:absolute;left:${a?.x ?? ""};top:${a?.y ?? ""};width:${a?.w ?? ""};height:1px;background:${a?.c ?? ""};transform-origin:0 0;transform:rotate(${a?.r ?? ""});opacity:${a?.o ?? ""};`)} />
                </Fragment>
              ))}
              <div style={sx(`position:absolute;left:${v.india?.x ?? ""};top:${v.india?.y ?? ""};transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:4px;`)}>
                <span style={{ width: "16px", height: "16px", background: "#F07C12" }} />
                <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#F07C12" }}>NEW DELHI</span>
              </div>
              {list(v.ctyPins).map((c, $index) => (
                <Fragment key={$index}>
                  <button onClick={c?.pick} aria-label={c?.name} style={sx(`position:absolute;left:${c?.x ?? ""};top:${c?.y ?? ""};transform:translate(-50%,-50%);border:0;background:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px;`)}>
                    <span style={sx(`width:12px;height:12px;border:2px solid #fff;background:${c?.fill ?? ""};`)} />
                    <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.12em;color:#fff;white-space:nowrap;background:${c?.lbg ?? ""};padding:2px 4px;`)}>
                      {txt(c?.nameU)}
                    </span>
                  </button>
                </Fragment>
              ))}
              {" "}
              <span style={{ position: "absolute", left: "14px", bottom: "12px", fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#8A877F" }}>
                SCHEMATIC PROJECTION · NOT TO SCALE
              </span>
            </div>
            <div style={{ padding: "28px", borderLeft: "1px solid #0E0E0F", display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>{"PAVILION "}{txt(v.cty?.pav)}</span>
              <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "45px", lineHeight: "0.85", textTransform: "uppercase" }}>
                {txt(v.cty?.name)}
              </span>
              <span style={{ fontSize: "16px", lineHeight: "1.45" }}>{txt(v.cty?.profile)}</span>
              <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "120px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                {list(v.ctyRows).map((r, $index) => (
                  <Fragment key={$index}>
                    <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                    <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                  </Fragment>
                ))}
              </dl>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginTop: "auto" }}>
                <a href={withBase("/explore")} style={{ background: "#0E0E0F", color: "#fff", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" }}>
                  View pavilion
                </a>
                <a href={withBase("/exhibit#directory")} style={{ border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                  View companies
                </a>
                <button onClick={v.ctyMeet} style={{ height: "46px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                  Request meeting
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", border: "1px solid #0E0E0F", borderTop: "0" }}>
            {list(v.ctyList).map((c, $index) => (
              <Fragment key={$index}>
                <button onClick={c?.pick} style={sx(`border:0;border-right:1px solid #E3E0D8;background:${c?.bg ?? ""};color:${c?.fg ?? ""};padding:14px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px;`)}>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "20px", textTransform: "uppercase" }}>{txt(c?.name)}</span>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(c?.pav)}{" · "}{txt(c?.companies)}{" cos."}</span>
                </button>
              </Fragment>
            ))}
          </div>
        </section>
        <section data-screen-label="Lounges" style={{ background: "#0E0E0F", color: "#fff", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 28px", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              05 — Private spaces
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", borderTop: "1px solid #3A3A3E", borderLeft: "1px solid #3A3A3E" }}>
              {list(v.lounges).map((l, $index) => (
                <Fragment key={$index}>
                  <div style={{ padding: "22px", borderRight: "1px solid #3A3A3E", borderBottom: "1px solid #3A3A3E", display: "flex", flexDirection: "column", gap: "8px", minHeight: "180px" }}>
                    <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.14em;color:${l?.c ?? ""};`)}>{txt(l?.access)}</span>
                    <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px", lineHeight: "0.95", textTransform: "uppercase" }}>
                      {txt(l?.t)}
                    </b>
                    <span style={{ fontSize: "14px", color: "#BDB9B0", lineHeight: "1.4" }}>{txt(l?.d)}</span>
                    <span style={{ marginTop: "auto", fontFamily: "var(--f-label)", fontSize: "11px", color: "#8A877F" }}>{txt(l?.cap)}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        {v.profileOpen ? (
          <>
            <div role="dialog" aria-label="Profile" onClick={v.closeProfile} style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(14,14,15,0.55)", display: "flex", justifyContent: "flex-end" }}>
              <div onClick={v.stop} style={{ width: "min(560px,94vw)", height: "100%", background: "#fff", overflow: "auto", padding: "32px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
                <button onClick={v.closeProfile} style={{ alignSelf: "flex-end", border: "1px solid #0E0E0F", background: "none", height: "34px", padding: "0 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                  Close ✕
                </button>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                  {txt(v.pr?.roleU)}{" PROFILE · "}{txt(v.pr?.countryU)}{" · DEMO ENTITY"}
                </span>
                <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "38px", lineHeight: "0.88", textTransform: "uppercase" }}>
                  {txt(v.pr?.name)}
                </span>
                <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "14px", borderTop: "1px solid #E3E0D8" }}>
                  {list(v.pr?.rows).map((r, $index) => (
                    <Fragment key={$index}>
                      <dt style={{ padding: "9px 0", borderBottom: "1px solid #E3E0D8", color: "#6B6A66" }}>{txt(r?.k)}</dt>
                      <dd style={{ margin: "0", padding: "9px 0", borderBottom: "1px solid #E3E0D8" }}>{txt(r?.v)}</dd>
                    </Fragment>
                  ))}
                </dl>
                <button onClick={v.pr?.request} style={{ marginTop: "auto", height: "52px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                  {txt(v.pr?.reqLabel)}
                </button>
              </div>
            </div>
          </>
        ) : null}
        {" "}
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

export default defineDC("Connect", Component, render);
