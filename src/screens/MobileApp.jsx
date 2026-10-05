'use client';
// Generated from design/site/Mobile App.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import '@/data/ise';
import HallPlan from './HallPlan';

/* global maplibregl */
class Component extends DCLogic {
  state = { tab: 'home', sub: null, expo: 'sched', mapMode: 'route', routing: false, checked: false, wallet: false, push: null };
  componentDidMount() { if (!window.ISE) this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); }
  componentWillUnmount() { clearInterval(this._t); clearTimeout(this._p); }
  renderVals() {
    const D = window.ISE; const s = this.state;
    const sel = on => ({ bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    if (!D) return { tabs: [], quick: [], today: [], qr: [], mapModes: [], routeSteps: [], mapFilters: [], expoTabs: [], meetings: [], saved: [], moreList: [], sub: { rows: [] }, pushes: [], decisions: [], mapLit: [] };
    const zc = z => D.Z[z].color;
    const go = (tab, sub = null) => () => this.setState({ tab, sub });
    const qr = []; let h = 11;
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { const lx = x >= 14 ? x - 14 : x, ly = y >= 14 ? y - 14 : y; const f = (x < 7 && y < 7) || (x >= 14 && y < 7) || (x < 7 && y >= 14); let on; if (f) on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4); else { h = (h * 1103515245 + 12345) & 0x7fffffff; on = (h >> 8) % 2 === 0; } qr.push(on ? '#0E0E0F' : '#fff'); }
    const SUB = {
      programme: { t: 'PROGRAMME · DAY 2', rows: D.sessions.filter(x => x.day === 2).map(x => ({ a: x.title, b: x.time + ' · ' + x.stage, c: x.status === 'live' ? '● LIVE' : 'SAVE', cc: x.status === 'live' ? '#9E1B22' : '#C2610B' })) },
      exhibitors: { t: 'EXHIBITORS', rows: D.exhibitors.slice(0, 8).map(e => ({ a: e.name, b: e.sector, c: e.stall, cc: '#0E0E0F' })) },
      products: { t: 'PRODUCTS', rows: D.products.map(p => ({ a: p.name, b: p.by, c: p.stall, cc: '#0E0E0F' })) },
      live: { t: 'LIVE', isLive: true, rows: [{ a: 'The Future of AI Coaching', b: 'Innovation Arena · now', c: '● LIVE', cc: '#9E1B22' }, ...D.sessions.filter(x => x.day === 2 && x.status === 'upcoming').slice(0, 3).map(x => ({ a: x.title, b: x.time + ' · ' + x.stage, c: 'UP NEXT', cc: '#6B6A66' }))] },
      notifications: { t: 'NOTIFICATIONS', rows: [{ a: 'Meeting in 15 min', b: 'Apex Sports India · Table 14', c: '10:45', cc: '#0B6E4F' }, { a: 'Buyer meeting request', b: 'Stridewell Footwear', c: '08:40', cc: '#C2610B' }, { a: 'Route changed', b: 'Zone B aisle 4 closed', c: '08:12', cc: '#3A3A3E' }] },
      helpdesk: { t: 'HELPDESK', rows: [{ a: 'Chat with the help desk', b: 'Average reply 2 min (sample)', c: 'OPEN', cc: '#0B6E4F' }, { a: 'HD-10482 · Visa letter', b: 'Resolved', c: 'RESOLVED', cc: '#0B6E4F' }, { a: 'HD-10511 · Change table', b: 'Waiting for exhibitor', c: 'WAITING', cc: '#C2610B' }, { a: 'Info desks', b: 'Main Entrance · Boulevard centre', c: '2', cc: '#0E0E0F' }, { a: 'Emergency', b: 'First aid next to Zone D lounges', c: 'SOS', cc: '#9E1B22' }] },
      visit: { t: 'PLAN YOUR VISIT', rows: [{ a: 'Metro', b: 'Airport Express Line to Yashobhoomi Dwarka Sector 25', c: 'SAMPLE', cc: '#6B6A66' }, { a: 'Airport', b: 'IGI Airport · approx. 20–30 min by car', c: 'SAMPLE', cc: '#6B6A66' }, { a: 'Hotel shuttle', b: 'Every 30 min from partner hotels', c: 'SAMPLE', cc: '#6B6A66' }, { a: 'Parking', b: 'Venue parking, pre-book in app', c: 'SAMPLE', cc: '#6B6A66' }] }
    };
    const PUSH = [
      ['MEETING', 'Meeting in 15 min', 'Apex Sports India · Table 14 · 4 min walk', '#0B6E4F'], ['SESSION', 'Your session begins soon', 'AI in Sport · Plenary Hall · 14:00', '#0E0E0F'], ['ROUTE', 'Route changed', 'Zone B aisle 4 closed. New route: +1 min.', '#3A3A3E'], ['TRANSPORT', 'Transport update', 'Shuttle 3 delayed 10 min at Aerocity (sample)', '#1F4E9E'],
      ['LIVE', 'Live session starting', 'The Future of AI Coaching · Innovation Arena', '#9E1B22'], ['BUYER', 'Buyer meeting request', 'Stridewell Footwear wants to meet on Day 3', '#C2610B'], ['EXHIBITOR', 'Exhibitor response', 'TurfLine Systems accepted. Choose a slot.', '#0B6E4F'], ['EMERGENCY', 'Emergency announcement', 'Please follow staff to the nearest exit. This is a drill. (demo)', '#9E1B22']
    ];
    const p = s.push != null ? PUSH[s.push] : null;
    const tabsDef = [['home', 'HOME', '⌂'], ['pass', 'MY PASS', '▣'], ['map', 'MAP', '◎'], ['expo', 'MY EXPO', '☰'], ['more', 'MORE', '⋯']];
    const activeTab = s.tab;
    return {
      sbBg: activeTab === 'pass' || activeTab === 'home' ? '#0E0E0F' : '#fff', sbFg: activeTab === 'pass' || activeTab === 'home' ? '#fff' : '#0E0E0F',
      sHome: activeTab === 'home', sPass: activeTab === 'pass', sMap: activeTab === 'map', sExpo: activeTab === 'expo', sMore: activeTab === 'more' && !s.sub, sSub: activeTab === 'more' && !!s.sub,
      tabs: tabsDef.map(([id, t, i]) => ({ t, i, cur: id === activeTab ? 'page' : 'false', fg: id === activeTab ? '#0E0E0F' : '#8A877F', bl: id === activeTab ? '#F07C12' : 'transparent', pick: go(id) })),
      goMeeting: () => this.setState({ tab: 'expo', expo: 'meet' }), goLive: go('more', 'live'), goHelp: go('more', 'helpdesk'),
      quick: [['▣', 'MY PASS', go('pass')], ['◎', 'NAVIGATE', go('map')], ['☰', 'PROGRAMME', go('more', 'programme')], ['⌕', 'EXHIBITORS', go('more', 'exhibitors')]].map(([i, t, g]) => ({ i, t, go: g })),
      today: [['09:30', 'Sports Goods Manufacturing', 'Zone B', 'B'], ['10:15', 'Apex Sports India', 'B-SGM-017', 'B'], ['11:00', 'Buyer meeting · Apex', 'B2B · Table 14', 'D'], ['12:00', 'SportsTech & Innovation', 'Zone C', 'C'], ['14:00', 'AI in Sport', 'Plenary Hall', 'C'], ['16:00', 'Buyer Exchange', 'Zone D', 'D']].map(([time, title, where, z]) => ({ time, title, where, zc: zc(z) })),
      qr, wallet: () => this.setState({ wallet: true }), walletLabel: s.wallet ? '✓ In wallet' : 'Add to wallet',
      mapModes: [['explore', '3D EXPLORE'], ['2d', '2D MAP'], ['live', 'LIVE'], ['route', 'MY ROUTE']].map(([id, t]) => ({ t, ...sel(id === s.mapMode), pick: () => this.setState({ mapMode: id }) })),
      routeOn: s.mapMode === 'route', mapLit: s.mapMode === 'route' ? ['SGM'] : [],
      routeSteps: [['1', 'Enter at Main Entrance · Registration'], ['2', 'Follow the Sports Boulevard north'], ['3', 'Turn left into Zone B'], ['4', 'Sports Goods Manufacturing · Stall 017 on your right']].map(([n, t]) => ({ n, t })),
      startRoute: () => this.setState({ routing: !s.routing }), routeLabel: s.routing ? '■ End route · 2 min left' : 'Start route',
      mapFilters: ['Exhibitors', 'Stages', 'Meeting rooms', 'Food', 'Toilets', 'Information', 'Accessibility', 'Emergency'],
      expoTabs: [['sched', 'SCHEDULE'], ['meet', 'MEETINGS'], ['saved', 'SAVED']].map(([id, t]) => ({ t, fg: id === s.expo ? '#0E0E0F' : '#8A877F', bl: id === s.expo ? '#F07C12' : 'transparent', pick: () => this.setState({ expo: id }) })),
      eSched: s.expo === 'sched', eMeet: s.expo === 'meet', eSaved: s.expo === 'saved',
      meetings: [{ when: 'TODAY · 11:00', with: 'Apex Sports India', room: 'B2B Zone · Table 14', st: s.checked ? '✓ CHECKED IN' : 'CONFIRMED', c: '#0B6E4F', canCheck: true, blabel: s.checked ? '✓ Checked in · 10:58' : 'Check in at table', bbg: s.checked ? '#E3F1EB' : '#0E0E0F', bfg: s.checked ? '#0B6E4F' : '#fff', check: () => this.setState({ checked: true }) }, { when: 'TODAY · 15:30', with: 'TurfLine Systems', room: 'Deal Room 3', st: 'AWAITING SLOT', c: '#C2610B', canCheck: false }, { when: 'DAY 3 · 10:30', with: 'Origin Supply Co.', room: 'TBC', st: 'REQUESTED', c: '#1F4E9E', canCheck: false }],
      saved: D.exhibitors.slice(0, 6).map(e => ({ ...e, zc: zc(e.zone) })),
      moreList: [['Programme', 'programme', '12'], ['Exhibitors', 'exhibitors', '412'], ['Products', 'products', ''], ['Live', 'live', '● LIVE'], ['Notifications', 'notifications', '3'], ['Helpdesk', 'helpdesk', ''], ['Plan your visit', 'visit', '']].map(([t, id, b]) => ({ t, b, c: b.includes('LIVE') ? '#9E1B22' : '#8A877F', go: go('more', id) })),
      sub: s.sub ? SUB[s.sub] : { rows: [] }, backMore: go('more'),
      pushes: PUSH.map(([k, t, d, c], i) => ({ k, t, d, c, show: () => { clearTimeout(this._p); this.setState({ push: i }); this._p = setTimeout(() => this.setState({ push: null }), 3200); } })),
      banner: !!p, bannerT: p ? p[1] : '', bannerD: p ? p[2] : '', bannerC: p ? p[3] : '#000',
      decisions: [['Pass in two taps', 'Home and the tab bar both open the pass. Screen brightens automatically.'], ['Offline first', 'Pass, map, routes and schedule are cached before arrival.'], ['2D map by default', '3D Explore is opt-in on mobile to save battery and data.'], ['Check-in at the table', 'Meetings check in by QR or tap, which releases no-show tables.'], ['One-thumb reach', 'Primary actions sit in the lower half of every screen.'], ['Emergency overrides', 'Emergency pushes bypass quiet hours and show full-screen.']].map(([t, d]) => ({ t, d }))
    };
  }
}

function render(v) {
  return (
    <>
      <div style={{ minHeight: "100vh", padding: "48px 28px 80px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <a href={withBase("/")} style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#6B6A66", textDecoration: "none" }}>
                ← India Sports Expo 2027
              </a>
              <h1 style={{ margin: "10px 0 0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,7vw,112px) * 0.72)", lineHeight: "0.85" }}>
                Companion app
              </h1>
            </div>
            <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", maxWidth: "520px", color: "#3A3A3E" }}>
              Built for the hall floor: one-thumb navigation, the pass always two taps away, offline map and routes. It does not repeat the marketing website.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "56px", alignItems: "start" }}>
            <div data-screen-label="Interactive app" style={{ width: "390px", height: "844px", background: "#0E0E0F", borderRadius: "54px", padding: "12px", boxSizing: "border-box", boxShadow: "0 30px 60px -30px rgba(14,14,15,0.5)" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "42px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column", position: "relative" }}>
                <div style={sx(`height:50px;flex:none;display:flex;justify-content:space-between;align-items:center;padding:0 28px;font-size:15px;font-weight:600;background:${v.sbBg ?? ""};color:${v.sbFg ?? ""};`)}>
                  <span>10:18</span>
                  <span style={{ width: "110px", height: "30px", background: "#0E0E0F", borderRadius: "20px" }} />
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>5G ▮▮▮</span>
                </div>
                <div style={{ flex: "1", overflow: "auto", display: "flex", flexDirection: "column" }}>
                  {v.sHome ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ background: "#0E0E0F", color: "#fff", padding: "12px 20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "20px" }}>
                              {"ISE "}
                              <span style={{ color: "#F07C12" }}>2027</span>
                            </span>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.12em", color: "#F07C12", display: "flex", gap: "6px", alignItems: "center" }}>
                              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#9E1B22", animation: "iseBlink 1.4s infinite" }} />
                              DAY 2 · LIVE
                            </span>
                          </div>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.88" }}>
                            Good morning,
                            <br />
                            Lukas.
                          </span>
                          <button onClick={v.goMeeting} style={{ background: "#F07C12", color: "#0E0E0F", border: "0", padding: "14px", textAlign: "left", display: "flex", flexDirection: "column", gap: "3px", cursor: "pointer" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em" }}>NEXT · IN 42 MIN</span>
                            <b style={{ fontSize: "17px" }}>Apex Sports India</b>
                            <span style={{ fontSize: "13px" }}>11:00 · B2B Zone · Table 14 · 4 min walk</span>
                          </button>
                        </div>
                        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          {list(v.quick).map((q, $index) => (
                            <Fragment key={$index}>
                              <button onClick={q?.go} style={{ height: "64px", border: "1px solid #0E0E0F", background: "#fff", textAlign: "left", padding: "10px 12px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "18px" }}>{txt(q?.i)}</span>
                                <b style={{ fontSize: "13px", letterSpacing: "0.04em" }}>{txt(q?.t)}</b>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ padding: "4px 20px 8px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.16em", color: "#6B6A66" }}>LIVE NOW</span>
                          <button onClick={v.goLive} style={{ marginTop: "8px", width: "100%", border: "0", background: "#1A1A1C", color: "#fff", padding: "0", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                            <span style={{ aspectRatio: "16/9", display: "flex", alignItems: "flex-start", padding: "10px", background: "repeating-linear-gradient(135deg,#1A1A1C 0 10px,#202023 10px 20px)" }}>
                              <span style={{ background: "#9E1B22", fontFamily: "var(--f-label)", fontSize: "10px", padding: "3px 6px" }}>● LIVE</span>
                            </span>
                            <span style={{ padding: "10px 12px" }}>
                              <b style={{ display: "block", fontSize: "15px" }}>The Future of AI Coaching</b>
                              <span style={{ fontSize: "12px", color: "#8A877F" }}>Innovation Arena · 2,412 watching</span>
                            </span>
                          </button>
                        </div>
                        <div style={{ padding: "12px 20px 20px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.16em", color: "#6B6A66" }}>TODAY</span>
                          {" "}
                          {list(v.today).map((t, $index) => (
                            <Fragment key={$index}>
                              <div style={{ display: "grid", gridTemplateColumns: "48px 4px 1fr", gap: "10px", padding: "10px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(t?.time)}</span>
                                <span style={sx(`align-self:stretch;background:${t?.zc ?? ""};`)} />
                                <span>
                                  <b style={{ display: "block", fontSize: "14px" }}>{txt(t?.title)}</b>
                                  <span style={{ fontSize: "11px", color: "#6B6A66" }}>{txt(t?.where)}</span>
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.sPass ? (
                    <>
                      <div style={{ flex: "1", background: "#0E0E0F", color: "#fff", padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <b style={{ fontSize: "13px", letterSpacing: "0.12em" }}>MY PASS</b>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", color: "#8A877F" }}>BRIGHTNESS ↑ AUTO</span>
                        </div>
                        <div style={{ background: "#fff", color: "#0E0E0F", display: "flex", flexDirection: "column" }}>
                          <div style={{ height: "8px", background: "#F07C12" }} />
                          <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.86" }}>
                              Lukas
                              <br />
                              Brandt
                            </span>
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "23px", color: "#C2610B" }}>Buyer</span>
                          </div>
                          <div style={{ padding: "0 18px 18px", display: "flex", justifyContent: "center" }}>
                            <div aria-label="QR code (demo)" style={{ width: "220px", height: "220px", display: "grid", gridTemplateColumns: "repeat(21,1fr)" }}>
                              {list(v.qr).map((q, $index) => (
                                <Fragment key={$index}>
                                  <span style={sx(`background:${q ?? ""};`)} />
                                </Fragment>
                              ))}
                            </div>
                          </div>
                          <div style={{ borderTop: "1px solid #E3E0D8", padding: "12px 18px", display: "flex", justifyContent: "space-between", fontFamily: "var(--f-label)", fontSize: "11px" }}>
                            <span>ISE27-BUY-20931</span>
                            <span>DAY 1–3</span>
                          </div>
                        </div>
                        <span style={{ fontSize: "12px", color: "#BDB9B0", lineHeight: "1.5" }}>Access: Hall 2 · Business Exchange · Hosted Buyer Lounge · B2B Zone. Works offline.</span>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <button onClick={v.wallet} style={{ height: "46px", border: "1px solid #fff", background: "none", color: "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                            {txt(v.walletLabel)}
                          </button>
                          <button onClick={v.goHelp} style={{ height: "46px", border: "1px solid #3A3A3E", background: "none", color: "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                            Pass issue?
                          </button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.sMap ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ padding: "8px 16px", display: "flex", gap: "6px", overflowX: "auto" }}>
                          {list(v.mapModes).map((m, $index) => (
                            <Fragment key={$index}>
                              <button onClick={m?.pick} style={sx(`height:32px;padding:0 12px;border:1px solid #0E0E0F;background:${m?.bg ?? ""};color:${m?.fg ?? ""};font-size:11px;font-weight:700;white-space:nowrap;cursor:pointer;`)}>
                                {txt(m?.t)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ background: "#F6F4EF", padding: "4px 6px" }}>
                          <HallPlan route={v.routeOn} lit={v.mapLit} labels={false} />
                        </div>
                        <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: "13px" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", color: "#6B6A66", paddingTop: "3px" }}>FROM</span>
                            <b>You are here · Main Entrance</b>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", color: "#6B6A66", paddingTop: "3px" }}>TO</span>
                            <b>Apex Sports · B-SGM-017</b>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                            <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "33px", lineHeight: "0.9", color: "#C2610B" }}>4 min</span>
                            <span style={{ fontSize: "13px", color: "#6B6A66" }}>260 m · step-free</span>
                          </div>
                          <ol style={{ margin: "0", padding: "0", listStyle: "none" }}>
                            {list(v.routeSteps).map((r, $index) => (
                              <Fragment key={$index}>
                                <li style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: "10px", padding: "9px 0", borderBottom: "1px solid #E3E0D8", fontSize: "14px" }}>
                                  <span style={{ fontFamily: "var(--f-label)", color: "#C2610B" }}>{txt(r?.n)}</span>
                                  <span>{txt(r?.t)}</span>
                                </li>
                              </Fragment>
                            ))}
                          </ol>
                          <button onClick={v.startRoute} style={{ height: "50px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                            {txt(v.routeLabel)}
                          </button>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {list(v.mapFilters).map((f, $index) => (
                              <Fragment key={$index}>
                                <span style={{ border: "1px solid #E3E0D8", padding: "5px 8px", fontSize: "11px" }}>{txt(f)}</span>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.sExpo ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ padding: "10px 20px 0" }}>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px" }}>My Expo</span>
                        </div>
                        <div style={{ display: "flex", borderBottom: "1px solid #0E0E0F", marginTop: "8px" }}>
                          {list(v.expoTabs).map((t, $index) => (
                            <Fragment key={$index}>
                              <button onClick={t?.pick} style={sx(`flex:1;height:44px;border:0;border-bottom:3px solid ${t?.bl ?? ""};background:#fff;font-size:12px;font-weight:700;letter-spacing:0.08em;color:${t?.fg ?? ""};cursor:pointer;`)}>
                                {txt(t?.t)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        {v.eSched ? (
                          <>
                            <div style={{ padding: "6px 20px 20px" }}>
                              {list(v.today).map((t, $index) => (
                                <Fragment key={$index}>
                                  <div style={{ display: "grid", gridTemplateColumns: "48px 4px 1fr auto", gap: "10px", padding: "12px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                                    <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(t?.time)}</span>
                                    <span style={sx(`align-self:stretch;background:${t?.zc ?? ""};`)} />
                                    <span>
                                      <b style={{ display: "block", fontSize: "14px" }}>{txt(t?.title)}</b>
                                      <span style={{ fontSize: "11px", color: "#6B6A66" }}>{txt(t?.where)}</span>
                                    </span>
                                    <span style={{ fontSize: "16px", color: "#C2610B" }}>→</span>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </>
                        ) : null}
                        {v.eMeet ? (
                          <>
                            <div style={{ padding: "6px 20px 20px" }}>
                              {list(v.meetings).map((m, $index) => (
                                <Fragment key={$index}>
                                  <div style={{ padding: "12px 0", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(m?.when)}</span>
                                      <span style={sx(`font-family:var(--f-label);font-size:10px;color:${m?.c ?? ""};`)}>{txt(m?.st)}</span>
                                    </div>
                                    <b style={{ fontSize: "15px" }}>{txt(m?.with)}</b>
                                    <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(m?.room)}</span>
                                    {m?.canCheck ? (
                                      <>
                                        <button onClick={m?.check} style={sx(`height:40px;border:0;background:${m?.bbg ?? ""};color:${m?.bfg ?? ""};font-size:12px;font-weight:700;cursor:pointer;`)}>
                                          {txt(m?.blabel)}
                                        </button>
                                      </>
                                    ) : null}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </>
                        ) : null}
                        {v.eSaved ? (
                          <>
                            <div style={{ padding: "6px 20px 20px" }}>
                              {list(v.saved).map((x, $index) => (
                                <Fragment key={$index}>
                                  <div style={{ display: "grid", gridTemplateColumns: "10px 1fr auto", gap: "10px", padding: "12px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                                    <span style={sx(`width:10px;height:10px;background:${x?.zc ?? ""};`)} />
                                    <span>
                                      <b style={{ display: "block", fontSize: "14px" }}>{txt(x?.name)}</b>
                                      <span style={{ fontSize: "11px", color: "#6B6A66" }}>{txt(x?.sector)}</span>
                                    </span>
                                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(x?.stall)}</span>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  {v.sMore ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", padding: "10px 20px 20px" }}>
                        <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", marginBottom: "8px" }}>More</span>
                        {list(v.moreList).map((m, $index) => (
                          <Fragment key={$index}>
                            <button onClick={m?.go} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "56px", border: "0", borderBottom: "1px solid #E3E0D8", background: "none", fontSize: "16px", fontWeight: "600", cursor: "pointer", color: "#0E0E0F" }}>
                              {txt(m?.t)}
                              <span style={sx(`font-family:var(--f-label);font-size:11px;color:${m?.c ?? ""};`)}>{txt(m?.b)}</span>
                            </button>
                          </Fragment>
                        ))}
                        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>ACCESSIBILITY</span>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ border: "1px solid #0E0E0F", padding: "6px 10px", fontSize: "12px" }}>Larger text</span>
                            <span style={{ border: "1px solid #0E0E0F", padding: "6px 10px", fontSize: "12px" }}>High contrast</span>
                            <span style={{ border: "1px solid #0E0E0F", padding: "6px 10px", fontSize: "12px" }}>Reduced motion</span>
                            <span style={{ border: "1px solid #0E0E0F", padding: "6px 10px", fontSize: "12px" }}>Step-free routes</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {v.sSub ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <button onClick={v.backMore} style={{ alignSelf: "flex-start", margin: "6px 14px", border: "0", background: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                          ← More
                        </button>
                        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9" }}>{txt(v.sub?.t)}</span>
                          {v.sub?.isLive ? (
                            <>
                              <div style={{ aspectRatio: "16/9", background: "repeating-linear-gradient(135deg,#1A1A1C 0 10px,#202023 10px 20px)", display: "flex", alignItems: "flex-end", padding: "10px", color: "#fff", fontFamily: "var(--f-label)", fontSize: "10px" }}>
                                ● LIVE · CC EN · हि · PLAYER EMBED
                              </div>
                            </>
                          ) : null}
                          {list(v.sub?.rows).map((r, $index) => (
                            <Fragment key={$index}>
                              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "10px", padding: "11px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                                <span>
                                  <b style={{ display: "block", fontSize: "14px" }}>{txt(r?.a)}</b>
                                  <span style={{ fontSize: "11px", color: "#6B6A66" }}>{txt(r?.b)}</span>
                                </span>
                                <span style={sx(`font-family:var(--f-label);font-size:10px;color:${r?.cc ?? ""};text-align:right;`)}>{txt(r?.c)}</span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <nav aria-label="App" style={{ flex: "none", height: "78px", borderTop: "1px solid #0E0E0F", display: "grid", gridTemplateColumns: "repeat(5,1fr)", background: "#fff", paddingBottom: "14px", boxSizing: "border-box" }}>
                  {list(v.tabs).map((t, $index) => (
                    <Fragment key={$index}>
                      <button onClick={t?.pick} aria-current={t?.cur} style={sx(`border:0;border-top:3px solid ${t?.bl ?? ""};background:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;color:${t?.fg ?? ""};`)}>
                        <span style={{ fontSize: "18px" }}>{txt(t?.i)}</span>
                        <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em" }}>{txt(t?.t)}</span>
                      </button>
                    </Fragment>
                  ))}
                </nav>
                {v.banner ? (
                  <>
                    <div role="alert" style={{ position: "absolute", left: "10px", right: "10px", top: "54px", background: "#0E0E0F", color: "#fff", padding: "12px 14px", display: "grid", gridTemplateColumns: "8px 1fr", gap: "10px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}>
                      <span style={sx(`background:${v.bannerC ?? ""};`)} />
                      <span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#BDB9B0" }}>ISE 2027 · NOW</span>
                        <b style={{ display: "block", fontSize: "14px" }}>{txt(v.bannerT)}</b>
                        <span style={{ fontSize: "12px", color: "#BDB9B0" }}>{txt(v.bannerD)}</span>
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "36px", minWidth: "0" }}>
              <div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#6B6A66" }}>
                  PUSH NOTIFICATION STATES · TAP TO PREVIEW ON DEVICE
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "10px", marginTop: "12px" }}>
                  {list(v.pushes).map((p, $index) => (
                    <Fragment key={$index}>
                      <button onClick={p?.show} style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "14px", textAlign: "left", cursor: "pointer", display: "grid", gridTemplateColumns: "6px 1fr", gap: "12px" }}>
                        <span style={sx(`background:${p?.c ?? ""};`)} />
                        <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.14em;color:${p?.c ?? ""};`)}>{txt(p?.k)}</span>
                          <b style={{ fontSize: "15px", color: "#0E0E0F" }}>{txt(p?.t)}</b>
                          <span style={{ fontSize: "12px", color: "#3A3A3E" }}>{txt(p?.d)}</span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#6B6A66" }}>MOBILE-SPECIFIC DECISIONS</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", borderTop: "2px solid #0E0E0F", marginTop: "12px" }}>
                  {list(v.decisions).map((d, $index) => (
                    <Fragment key={$index}>
                      <div style={{ padding: "14px 16px 14px 0", borderBottom: "1px solid #BDB9B0", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <b style={{ fontSize: "15px" }}>{txt(d?.t)}</b>
                        <span style={{ fontSize: "13px", color: "#3A3A3E", lineHeight: "1.45" }}>{txt(d?.d)}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a href={withBase("/attend#myexpo")} style={{ height: "46px", padding: "0 18px", background: "#0E0E0F", color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>
                  My Expo on web
                </a>
                <a href={withBase("/explore")} style={{ height: "46px", padding: "0 18px", border: "1px solid #0E0E0F", textDecoration: "none", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>
                  Full digital twin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default defineDC("Mobile App", Component, render);
