'use client';
// Generated from design/site/Programme and Watch.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import DemoVideo from '@/components/DemoVideo';
import '@/data/ise';

/* global maplibregl */
class Component extends DCLogic {
  state = { phase: 'live', day: 2, view: 'agenda', saved: { x5: true, x8: true }, open: null, lib: [], transcript: false, search: false, q: 'football', toast: null };
  componentDidMount() { if (!window.ISE) this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); this._k = e => { if (e.key === 'Escape') this.setState({ search: false, open: null }); if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); this.setState({ search: true }); } }; window.addEventListener('keydown', this._k); }
  componentWillUnmount() { clearInterval(this._t); window.removeEventListener('keydown', this._k); clearTimeout(this._toast); }
  flash(t) { clearTimeout(this._toast); this.setState({ toast: t }); this._toast = setTimeout(() => this.setState({ toast: null }), 2400); }
  renderVals() {
    const D = window.ISE; const s = this.state;
    const sel = on => ({ bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    if (!D) return { phases: [], days: [], views: [], daySessions: [], hours: [], tlRows: [], sectors: [], speakers: [], arena: { cols: [] }, libFilters: [], library: [], happening: [], upNext: [], d: { spks: [], related: [], companies: [], chapters: [] }, results: [] };
    const zc = z => D.Z[z].color;
    const phase = s.phase;
    const statusFor = x => phase === 'pre' ? 'upcoming' : phase === 'post' ? 'ondemand' : x.status;
    const BADGE = { live: ['● LIVE NOW', '#9E1B22'], upcoming: ['UPCOMING', '#6B6A66'], ondemand: ['ON DEMAND', '#0B6E4F'] };
    const open = id => () => this.setState({ open: id });
    const toggle = id => () => { this.setState({ saved: { ...s.saved, [id]: !s.saved[id] } }); if (!s.saved[id]) this.flash('Added to My Expo · reminder 15 min before'); };
    const spk = x => x.speakers.map(id => D.sp(id).name).join(', ');
    const decorate = x => { const st = statusFor(x); return { ...x, zc: zc(x.zone), spk: spk(x), badge: BADGE[st][0], stc: BADGE[st][1], st, saveLabel: s.saved[x.id] ? '✓ In My Expo' : 'Add to My Expo', saveBg: s.saved[x.id] ? '#E3F1EB' : '#fff', save: toggle(x.id), open: open(x.id), cta: st === 'live' ? 'WATCH LIVE' : st === 'ondemand' ? 'WATCH' : 'DETAILS' }; };
    const daySes = D.sessions.filter(x => x.day === s.day).map(decorate);
    const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const tlRows = D.stages.map(st => { const items = daySes.filter(x => x.stage === st); return { stage: st, meta: st === 'Plenary Hall' ? '1,200 seats' : st === 'Innovation Arena' ? '324 seats · Zone C' : '220 seats · Zone D', empty: items.length === 0, items: items.map(x => ({ ...x, l: ((toMin(x.time) - 540) / 480 * 100) + '%', w: ((toMin(x.end) - toMin(x.time)) / 480 * 100) + '%', bg: x.st === 'live' ? '#0E0E0F' : '#F6F4EF', fg: x.st === 'live' ? '#fff' : '#0E0E0F' })) }; });
    const topics = [...new Set(D.sessions.map(x => x.topic))];
    const TC = { Investment: '#00803F', Manufacturing: '#5B3A9E', Infrastructure: '#5B3A9E', Startups: '#0A62BF', SportsTech: '#0A62BF', 'Sports Science': '#0A62BF', Federations: '#9E1B22' };
    const LIBF = ['LIVE', 'DAY 1', 'DAY 2', 'DAY 3', 'SPORTSTECH', 'MANUFACTURING', 'INVESTMENT', 'INFRASTRUCTURE', 'STARTUPS', 'SPORTS SCIENCE'];
    const lib = D.sessions.map(decorate).filter(x => phase === 'pre' ? false : x.st !== 'upcoming').filter(x => s.lib.every(f => f === 'LIVE' ? x.st === 'live' : f.startsWith('DAY') ? x.day === +f.slice(4) : x.topic.toUpperCase() === f));
    const det = s.open ? decorate(D.sessions.find(x => x.id === s.open)) : null;
    const DESC = { SportsTech: 'How computer vision, wearables and AI models are changing coaching, from academies to national teams, and what coaches need from the tools.', Manufacturing: 'Indian manufacturers and international buyers on quality, compliance, lead times and building export relationships that last.', Investment: 'Where capital is flowing in the sports economy, what investors look for, and how India fits into global portfolios.', Infrastructure: 'Designing venues that earn revenue beyond match days, from multi-use surfaces to smart operations.', Startups: 'Founders pitch to a jury of investors, buyers and federations. Audience vote in the app.', 'Sports Science': 'Evidence, load management and recovery for the next Olympic and Paralympic cycle.', Federations: 'National federations on talent identification, grassroots participation and partnerships.' };
    const q = (s.q || '').trim().toLowerCase();
    const m = t => t.toLowerCase().includes(q);
    const groups = !q ? [] : [
      { t: 'EXHIBITORS', items: D.exhibitors.filter(e => m(e.name + e.sector + e.sport + e.stall + e.country + e.products.join(' '))).map(e => ({ a: e.name, b: e.sector + ' · ' + e.city, c: e.stall, zc: zc(e.zone), href: withBase('/exhibit#directory') })) },
      { t: 'PRODUCTS', items: D.products.filter(p => m(p.name + p.cat + p.type + p.by)).map(p => ({ a: p.name, b: p.by, c: p.stall, zc: zc(p.stall[0]), href: withBase('/exhibit#directory') })) },
      { t: 'SESSIONS', items: D.sessions.filter(x => m(x.title + x.topic + x.stage + spk(x))).map(x => ({ a: x.title, b: 'Day ' + x.day + ' · ' + x.time + ' · ' + x.stage, c: x.topic.toUpperCase(), zc: zc(x.zone), href: '#programme' })) },
      { t: 'EXPERIENCES', items: [['Football Reaction Challenge', 'Try Sport Arena'], ['Archery Experience', 'Try Sport Arena'], ['Wheelchair Basketball', 'Try Sport Arena'], ['VR Training', 'Interactive Experiences']].filter(([a, b]) => m(a + b)).map(([a, b]) => ({ a, b, c: 'ZONE C', zc: zc('C'), href: withBase('/zones') })) },
      { t: 'FEDERATIONS', items: ['Football', 'Hockey', 'Athletics', 'Archery', 'Badminton', 'Boxing'].filter(x => m(x)).map(x => ({ a: x + ' federation (sample)', b: 'Federations & Institutions · A-FED', c: 'ZONE A', zc: zc('A'), href: withBase('/zones') })) },
      { t: 'STARTUPS', items: D.startups.filter(x => m(x.name + x.sport + x.tech + x.country)).map(x => ({ a: x.name, b: x.tech + ' · ' + x.sport + ' · ' + x.stage, c: x.stall, zc: zc('C'), href: withBase('/zones') })) },
      { t: 'SPEAKERS', items: D.speakers.filter(x => m(x.name + x.org)).map(x => ({ a: x.name, b: x.role + ' · ' + x.org, c: '', zc: '#0E0E0F', href: '#programme' })) },
      { t: 'COUNTRIES & STATES', items: [...D.countries.map(c => ({ a: c.name, b: 'Country pavilion ' + c.pav, c: c.pav })), ...D.states.map(c => ({ a: c.name, b: c.identity, c: c.pav }))].filter(x => m(x.a + x.b)).map(x => ({ ...x, zc: x.c[0] === 'A' ? zc('A') : zc('D'), href: x.c[0] === 'A' ? withBase('/zones') : withBase('/connect#countries') })) }
    ].filter(g => g.items.length).map(g => ({ ...g, n: g.items.length }));
    const arenaBy = {
      pre: { d: 'Programme, pitch schedule, speakers and demos for the three days. Save sessions to get reminders.', cols: [['Programme', D.sessions.filter(x => x.stage === 'Innovation Arena').slice(0, 4).map(x => [x.title, 'D' + x.day + ' ' + x.time])], ['Pitch schedule', D.startups.slice(0, 4).map(x => [x.name, x.pitch])], ['Speakers', D.speakers.slice(0, 4).map(x => [x.name, x.org.replace(' (demo)', '')])], ['Demos', [['CoachVision AI live analysis', 'D2 12:30'], ['ForceTrack jump testing', 'D2 13:15'], ['Turfsense pitch sensors', 'D3 13:00']]]] },
      live: { d: 'LIVE NOW: The Future of AI Coaching. Watch in the player above or take a seat in Zone C.', cols: [['Live now', [['The Future of AI Coaching', '● LIVE'], ['Seats available', '41 / 324']]], ['Up next', D.sessions.filter(x => x.stage === 'Innovation Arena' && x.day === 2 && x.status === 'upcoming').map(x => [x.title, x.time])], ['Pitch schedule', D.startups.slice(0, 3).map(x => [x.name, x.pitch])], ['Demos today', [['CoachVision AI', '12:30'], ['ForceTrack', '13:15']]]] },
      post: { d: 'Every session is recorded with highlights, speaker information and related companies.', cols: [['Recordings', D.sessions.filter(x => x.stage === 'Innovation Arena').slice(0, 4).map(x => [x.title, x.dur])], ['Highlights', [['Pitch Final: winning moment', '2:40'], ['AI Coaching: key exchange', '4:12']]], ['Speakers', D.speakers.slice(0, 3).map(x => [x.name, 'PROFILE'])], ['Related companies', D.exhibitors.filter(e => e.zone === 'C').map(e => [e.name, e.stall])]] }
    };
    const ar = arenaBy[phase];
    return {
      phases: [['pre', 'BEFORE EVENT'], ['live', 'DURING · DAY 2'], ['post', 'AFTER EVENT']].map(([id, t]) => ({ t, ...sel(id === phase), pick: () => this.setState({ phase: id }) })),
      phaseNote: { pre: 'Sessions show details and reminders. Watch shows trailers only.', live: 'Homepage and Watch switch to live mode with player, up next and announcements.', post: 'Every session shows its recording, highlights and downloads.' }[phase],
      isLive: phase === 'live',
      happening: [{ t: 'Startup Village open pitches', where: 'Zone C · C-SUV', st: 'NOW', c: '#0B6E4F' }, { t: 'Hosted buyer briefing: Football', where: 'Zone D · Hosted Buyer Lounge', st: 'NOW', c: '#F07C12' }, { t: 'Archery Experience · 12 places left', where: 'Try Sport Arena', st: '10:30', c: '#C2610B' }],
      upNext: D.sessions.filter(x => x.day === 2 && x.status === 'upcoming').slice(0, 3).map(x => ({ ...x, open: open(x.id) })),
      openLive: open('x5'), toggleTranscript: () => this.setState({ transcript: !s.transcript }), showTranscript: s.transcript, transcriptLabel: s.transcript ? 'Hide transcript' : 'Live transcript',
      days: [1, 2, 3].map(d => ({ t: 'DAY ' + d, ...sel(d === s.day), pick: () => this.setState({ day: d }) })),
      views: [['agenda', 'AGENDA'], ['timeline', 'TIMELINE'], ['stage', 'STAGE'], ['sector', 'SECTOR'], ['speaker', 'SPEAKER']].map(([id, t]) => ({ t, ...sel(id === s.view), pick: () => this.setState({ view: id }) })),
      vAgenda: s.view === 'agenda', vTimeline: s.view === 'timeline', vStage: s.view === 'stage', vSector: s.view === 'sector', vSpeaker: s.view === 'speaker',
      daySessions: daySes, hours: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'], tlRows,
      sectors: topics.map(t => { const items = D.sessions.filter(x => x.topic === t).map(x => ({ ...x, open: open(x.id) })); return { t, c: TC[t] || '#0E0E0F', n: items.length, items }; }),
      speakers: D.speakers.map(p => { const mine = D.sessions.filter(x => x.speakers.includes(p.id)); return { ...p, slot: 'spk-' + p.id, count: mine.length, bg: '#fff', open: open(mine[0].id) }; }),
      arena: { d: ar.d, cols: ar.cols.map(([t, rows]) => ({ t, rows: rows.map(([a, b]) => ({ a, b })) })) },
      libFilters: LIBF.map(t => { const on = s.lib.includes(t); return { t, on, ...sel(on), pick: () => this.setState({ lib: on ? s.lib.filter(x => x !== t) : [...s.lib.filter(x => !(t.startsWith('DAY') && x.startsWith('DAY'))), t] }) }; }),
      library: lib.map(x => ({ ...x, topicU: x.topic.toUpperCase(), badgeBg: x.st === 'live' ? '#9E1B22' : '#0E0E0F' })), libCount: lib.length, libEmpty: lib.length === 0,
      detailOpen: !!det, close: () => this.setState({ open: null }), stop: e => e.stopPropagation(),
      d: det ? { ...det, desc: DESC[det.topic] || '', hasPlayer: det.st !== 'upcoming', isAfter: det.st === 'ondemand', slot: 'player-' + det.id, playerPh: det.st === 'live' ? 'Live stream embed' : 'Full recording embed',
        watchLabel: det.st === 'live' ? '● Watch live' : det.st === 'ondemand' ? '▶ Play recording' : 'Set reminder', watch: () => this.flash(det.st === 'upcoming' ? 'Reminder set for 15 minutes before' : 'Playing in Expo player (demo)'),
        cal: () => this.flash('Calendar file downloaded (.ics, demo)'),
        chapters: [{ t: '00:00', d: 'Opening and context' }, { t: '06:20', d: 'Panel: what has changed since 2024' }, { t: '21:45', d: 'Case study from the floor' }, { t: '38:10', d: 'Audience Q&A' }],
        spks: det.speakers.map(id => ({ ...D.sp(id), slot: 'spk-' + id })),
        related: D.sessions.filter(x => x.topic === det.topic && x.id !== det.id).slice(0, 3).map(x => ({ ...x, open: open(x.id) })),
        companies: D.exhibitors.filter(e => e.zone === det.zone).slice(0, 3) } : { spks: [], related: [], companies: [], chapters: [] },
      openSearch: () => this.setState({ search: true }), closeSearch: () => this.setState({ search: false }), searchOpen: s.search, q: s.q, setQ: e => this.setState({ q: e.target.value }), results: groups, noResults: q && groups.length === 0,
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
            <a href={withBase("/connect")} style={{ color: "#fff", textDecoration: "none" }}>Connect</a>
            <a href="#programme" style={{ color: "#F07C12", textDecoration: "none" }}>Programme</a>
            <a href="#watch" style={{ color: "#F07C12", textDecoration: "none" }}>Watch</a>
          </nav>
          <button onClick={v.openSearch} aria-label="Search" style={{ background: "transparent", border: "1px solid #3A3A3E", color: "#BDB9B0", height: "36px", padding: "0 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", whiteSpace: "nowrap" }}>
            ⌕ Search the Expo
          </button>
          <a href={withBase("/me/")} className="hdr-btn hdr-ghost">
            <span className="hdr-liq" aria-hidden="true" />
            <span className="hdr-t">My Expo</span>
          </a>
        </header>
        <div style={{ background: "#F6F4EF", borderBottom: "1px solid #0E0E0F", display: "flex", alignItems: "center", gap: "16px", padding: "10px 28px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>PROTOTYPE · EVENT PHASE</span>
          <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F", background: "#fff" }}>
            {list(v.phases).map((p, $index) => (
              <Fragment key={$index}>
                <button role="tab" onClick={p?.pick} style={sx(`height:32px;padding:0 14px;border:0;border-right:1px solid #0E0E0F;background:${p?.bg ?? ""};color:${p?.fg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.1em;cursor:pointer;`)}>
                  {txt(p?.t)}
                </button>
              </Fragment>
            ))}
          </div>
          <span style={{ fontSize: "13px", color: "#3A3A3E" }}>{txt(v.phaseNote)}</span>
        </div>
        {v.isLive ? (
          <>
            <section data-screen-label="Live mode" style={{ background: "#0E0E0F", color: "#fff", padding: "40px 28px 56px" }}>
              <div style={{ maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "20px", flexWrap: "wrap" }}>
                  <h1 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,7vw,112px) * 0.72)", lineHeight: "0.85" }}>
                    {"Day 2 — "}
                    <span style={{ color: "#F07C12" }}>Live</span>
                  </h1>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.14em", color: "#BDB9B0" }}>
                    10:18 IST · EXPO FLOOR OPEN · 14,820 ON SITE (DEMO)
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr)", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ aspectRatio: "16/9", background: "#1A1A1C", position: "relative", border: "1px solid #2A2A2D" }}>
                      <DemoVideo id="live" live />
                      <span style={{ position: "absolute", left: "16px", top: "16px", background: "#9E1B22", color: "#fff", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", padding: "5px 10px", display: "flex", gap: "8px", alignItems: "center", pointerEvents: "none" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", animation: "iseBlink 1.4s infinite" }} />
                        LIVE · INNOVATION ARENA
                      </span>
                      <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "14px 16px", background: "linear-gradient(transparent,rgba(14,14,15,0.9))", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>00:18:42 · CC ENGLISH · हिन्दी</span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>2,412 WATCHING</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9" }}>The future of AI coaching</span>
                        <div style={{ fontSize: "14px", color: "#BDB9B0", marginTop: "6px" }}>Arjun Mehta · Dr. Meera Raghavan · 10:00–10:45</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={v.openLive} style={{ height: "44px", padding: "0 16px", border: "1px solid #fff", background: "none", color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                          Session page
                        </button>
                        <button onClick={v.toggleTranscript} style={{ height: "44px", padding: "0 16px", border: "1px solid #3A3A3E", background: "none", color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                          {txt(v.transcriptLabel)}
                        </button>
                      </div>
                    </div>
                    {v.showTranscript ? (
                      <>
                        <div style={{ border: "1px solid #3A3A3E", padding: "16px", fontSize: "14px", lineHeight: "1.6", color: "#BDB9B0", maxHeight: "140px", overflow: "auto" }}>
                          <b style={{ color: "#fff" }}>ARJUN MEHTA</b>
                          {" 00:17:58 — The question for coaches is not whether the model sees more than they do. It is whether it explains what it sees in a way a fifteen-year-old can act on in the next over."}
                          <br />
                          <b style={{ color: "#fff" }}>DR. MEERA RAGHAVAN</b>
                          {" 00:18:31 — And we have to be honest about load. More data on recovery means fewer injuries only if someone changes the plan. (Sample transcript.)"}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0", borderTop: "1px solid #3A3A3E" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#BDB9B0", padding: "12px 0" }}>WHAT'S HAPPENING</span>
                    {list(v.happening).map((h, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "10px 1fr auto", gap: "12px", padding: "12px 0", borderTop: "1px solid #2A2A2D", alignItems: "center" }}>
                          <span style={sx(`width:10px;height:10px;background:${h?.c ?? ""};`)} />
                          <span>
                            <b style={{ display: "block", fontSize: "15px" }}>{txt(h?.t)}</b>
                            <span style={{ fontSize: "12px", color: "#8A877F" }}>{txt(h?.where)}</span>
                          </span>
                          <span style={sx(`font-family:var(--f-label);font-size:11px;color:${h?.c ?? ""};`)}>{txt(h?.st)}</span>
                        </div>
                      </Fragment>
                    ))}
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#BDB9B0", padding: "20px 0 12px" }}>UP NEXT</span>
                    {list(v.upNext).map((u, $index) => (
                      <Fragment key={$index}>
                        <button onClick={u?.open} style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: "12px", padding: "12px 0", border: "0", borderTop: "1px solid #2A2A2D", background: "none", color: "#fff", textAlign: "left", cursor: "pointer" }}>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "13px", color: "#F07C12" }}>{txt(u?.time)}</span>
                          <span>
                            <b style={{ display: "block", fontSize: "15px" }}>{txt(u?.title)}</b>
                            <span style={{ fontSize: "12px", color: "#8A877F" }}>{txt(u?.stage)}</span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                    <div style={{ marginTop: "20px", background: "#F07C12", color: "#0E0E0F", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.16em" }}>ANNOUNCEMENT · 10:05</span>
                      <b style={{ fontSize: "15px" }}>Startup Pitch Final moved to 11:45 on Day 3. Saved sessions updated automatically.</b>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
        <section id="programme" data-screen-label="Programme" style={{ scrollMarginTop: "60px", padding: "64px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
            <div>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#6B6A66" }}>
                PROGRAMME · 3 STAGES · 12 SESSIONS SHOWN (SAMPLE)
              </span>
              <h2 style={{ margin: "8px 0 0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,6vw,104px) * 0.72)", lineHeight: "0.85" }}>
                Programme
              </h2>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div role="tablist" aria-label="Day" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                {list(v.days).map((d, $index) => (
                  <Fragment key={$index}>
                    <button role="tab" onClick={d?.pick} style={sx(`height:44px;padding:0 18px;border:0;border-right:1px solid #0E0E0F;background:${d?.bg ?? ""};color:${d?.fg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.1em;cursor:pointer;`)}>
                      {txt(d?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
              <div role="tablist" aria-label="View" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                {list(v.views).map((_v, $index) => (
                  <Fragment key={$index}>
                    <button role="tab" onClick={_v?.pick} style={sx(`height:44px;padding:0 14px;border:0;border-right:1px solid #0E0E0F;background:${_v?.bg ?? ""};color:${_v?.fg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                      {txt(_v?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          {v.vAgenda ? (
            <>
              <div style={{ borderTop: "2px solid #0E0E0F" }}>
                {list(v.daySessions).map((s, $index) => (
                  <Fragment key={$index}>
                    <div style={{ display: "grid", gridTemplateColumns: "120px 4px minmax(0,1fr) 200px auto", gap: "20px", padding: "20px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "15px" }}>
                        {txt(s?.time)}
                        <span style={{ color: "#8A877F" }}>–{txt(s?.end)}</span>
                      </span>
                      <span style={sx(`align-self:stretch;background:${s?.zc ?? ""};`)} />
                      <button onClick={s?.open} style={{ border: "0", background: "none", padding: "0", textAlign: "left", cursor: "pointer", color: "#0E0E0F" }}>
                        <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.14em;color:${s?.stc ?? ""};`)}>{txt(s?.badge)}</span>
                        <b style={{ display: "block", fontSize: "20px", lineHeight: "1.2" }}>{txt(s?.title)}</b>
                        <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(s?.spk)}</span>
                      </button>
                      <span style={{ fontSize: "13px", lineHeight: "1.4" }}>
                        {txt(s?.stage)}
                        <br />
                        <span style={{ color: "#6B6A66" }}>{txt(s?.topic)}{" · "}{txt(s?.cap)}{" seats"}</span>
                      </span>
                      <span style={{ display: "flex", gap: "6px" }}>
                        <button onClick={s?.save} style={sx(`height:38px;padding:0 12px;border:1px solid #0E0E0F;background:${s?.saveBg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                          {txt(s?.saveLabel)}
                        </button>
                        <button onClick={s?.open} style={{ height: "38px", padding: "0 12px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                          {txt(s?.cta)}
                        </button>
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {" "}
          {v.vTimeline ? (
            <>
              <div style={{ border: "1px solid #0E0E0F", overflowX: "auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "200px repeat(16,minmax(56px,1fr))", minWidth: "1100px" }}>
                  <span style={{ borderBottom: "1px solid #0E0E0F" }} />
                  {list(v.hours).map((h, $index) => (
                    <Fragment key={$index}>
                      <span style={{ gridColumn: "span 2", borderLeft: "1px solid #E3E0D8", borderBottom: "1px solid #0E0E0F", padding: "8px", fontFamily: "var(--f-label)", fontSize: "11px" }}>
                        {txt(h)}
                      </span>
                    </Fragment>
                  ))}
                  {list(v.tlRows).map((r, $index) => (
                    <Fragment key={$index}>
                      <span style={{ gridColumn: "1", padding: "14px", borderBottom: "1px solid #E3E0D8", fontWeight: "700", fontSize: "14px" }}>{txt(r?.stage)}</span>
                      <div style={{ gridColumn: "2 / -1", position: "relative", height: "86px", borderBottom: "1px solid #E3E0D8", background: "repeating-linear-gradient(90deg,transparent 0 calc(12.5% - 1px),#F1EFEA calc(12.5% - 1px) 12.5%)" }}>
                        {list(r?.items).map((i, $index) => (
                          <Fragment key={$index}>
                            <button onClick={i?.open} style={sx(`position:absolute;top:10px;bottom:10px;left:${i?.l ?? ""};width:${i?.w ?? ""};border:0;border-left:4px solid ${i?.zc ?? ""};background:${i?.bg ?? ""};color:${i?.fg ?? ""};text-align:left;padding:6px 8px;cursor:pointer;overflow:hidden;font-size:12px;font-weight:600;line-height:1.25;`)}>
                              {txt(i?.title)}
                            </button>
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
          {v.vStage ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", borderTop: "2px solid #0E0E0F" }}>
                {list(v.tlRows).map((r, $index) => (
                  <Fragment key={$index}>
                    <div style={{ borderRight: "1px solid #E3E0D8", padding: "16px 16px 16px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "25px", textTransform: "uppercase" }}>{txt(r?.stage)}</b>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(r?.meta)}</span>
                      {list(r?.items).map((i, $index) => (
                        <Fragment key={$index}>
                          <button onClick={i?.open} style={sx(`border:1px solid #E3E0D8;border-left:4px solid ${i?.zc ?? ""};background:#fff;padding:12px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px;`)}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(i?.time)}–{txt(i?.end)}</span>
                            <b style={{ fontSize: "15px", color: "#0E0E0F" }}>{txt(i?.title)}</b>
                          </button>
                        </Fragment>
                      ))}
                      {r?.empty ? (
                        <>
                          <span style={{ fontSize: "13px", color: "#8A877F" }}>No sessions on this stage today.</span>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {" "}
          {v.vSector ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "24px" }}>
                {list(v.sectors).map((g, $index) => (
                  <Fragment key={$index}>
                    <div style={sx(`border-top:4px solid ${g?.c ?? ""};padding-top:12px;display:flex;flex-direction:column;gap:6px;`)}>
                      <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "25px", textTransform: "uppercase" }}>{txt(g?.t)}</b>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(g?.n)}{" SESSIONS · ALL DAYS"}</span>
                      {list(g?.items).map((i, $index) => (
                        <Fragment key={$index}>
                          <button onClick={i?.open} style={{ border: "0", borderBottom: "1px solid #E3E0D8", background: "none", padding: "10px 0", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>
                              {"DAY "}{txt(i?.day)}{" · "}{txt(i?.time)}{" · "}{txt(i?.stage)}
                            </span>
                            <b style={{ fontSize: "15px", color: "#0E0E0F" }}>{txt(i?.title)}</b>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {" "}
          {v.vSpeaker ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "0", borderTop: "1px solid #0E0E0F", borderLeft: "1px solid #0E0E0F" }}>
                {list(v.speakers).map((p, $index) => (
                  <Fragment key={$index}>
                    <button onClick={p?.open} style={sx(`border:0;border-right:1px solid #0E0E0F;border-bottom:1px solid #0E0E0F;background:${p?.bg ?? ""};padding:18px;text-align:left;cursor:pointer;display:grid;grid-template-columns:72px 1fr;gap:14px;align-items:start;`)}>
                      <span style={{ width: "72px", height: "88px", position: "relative", display: "block" }}>
                        <image-slot id={p?.slot} shape="rect" placeholder="Portrait" />
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <b style={{ fontSize: "17px", color: "#0E0E0F" }}>{txt(p?.name)}</b>
                        <span style={{ fontSize: "13px", color: "#3A3A3E" }}>{txt(p?.role)}</span>
                        <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(p?.org)}</span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#C2610B", marginTop: "4px" }}>{txt(p?.count)}{" SESSIONS"}</span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
        </section>
        <section id="arena" data-screen-label="Innovation Arena" style={{ background: "#E3F1EB", padding: "64px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "48px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#0B6E4F" }}>ZONE C · C-IAS · 324 SEATS</span>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(48px,5vw,88px) * 0.72)", lineHeight: "0.86" }}>
                Innovation
                <br />
                Arena
              </h2>
              <span style={{ fontSize: "16px", lineHeight: "1.5", maxWidth: "440px" }}>{txt(v.arena?.d)}</span>
              <a href={withBase("/zones")} style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>Zone C experiences →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "24px" }}>
              {list(v.arena?.cols).map((c, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px", borderBottom: "1px solid #0E0E0F", paddingBottom: "8px", textTransform: "uppercase" }}>
                      {txt(c?.t)}
                    </b>
                    {list(c?.rows).map((r, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(11,110,79,0.25)", fontSize: "14px" }}>
                          <span>{txt(r?.a)}</span>
                          <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#0B6E4F" }}>{txt(r?.b)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section id="watch" data-screen-label="Watch library" style={{ scrollMarginTop: "60px", padding: "64px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#6B6A66" }}>WATCH · UPCOMING · LIVE · ON DEMAND</span>
              <h2 style={{ margin: "8px 0 0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(56px,6vw,104px) * 0.72)", lineHeight: "0.85" }}>
                Watch
              </h2>
            </div>
            <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(v.libCount)}{" videos · captions and transcripts on every recording"}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
            {list(v.libFilters).map((f, $index) => (
              <Fragment key={$index}>
                <button onClick={f?.pick} aria-pressed={f?.on} style={sx(`height:36px;padding:0 14px;border:1px solid #0E0E0F;background:${f?.bg ?? ""};color:${f?.fg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                  {txt(f?.t)}
                </button>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "32px 24px" }}>
            {list(v.library).map((_v, $index) => (
              <Fragment key={$index}>
                <button onClick={_v?.open} style={{ border: "0", background: "none", padding: "0", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px", color: "#0E0E0F" }}>
                  <span style={{ aspectRatio: "16/9", background: "#1A1A1C", position: "relative", display: "block", width: "100%" }}>
                    {" "}
                    <DemoVideo id={_v?.id} thumb />
                    {" "}
                    <span style={sx(`position:absolute;left:0;top:0;bottom:0;width:6px;background:${_v?.zc ?? ""};`)} />
                    {" "}
                    <span style={sx(`position:absolute;left:16px;top:12px;background:${_v?.badgeBg ?? ""};color:#fff;font-family:var(--f-label);font-size:10px;letter-spacing:0.14em;padding:4px 8px;`)}>
                      {txt(_v?.badge)}
                    </span>
                    {" "}
                    <span style={{ position: "absolute", right: "12px", bottom: "12px", fontFamily: "var(--f-label)", fontSize: "11px", color: "#fff", background: "rgba(14,14,15,0.8)", padding: "3px 6px" }}>
                      {txt(_v?.dur)}
                    </span>
                    {" "}
                  </span>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                    {"DAY "}{txt(_v?.day)}{" · "}{txt(_v?.topicU)}{" · ZONE "}{txt(_v?.zone)}
                  </span>
                  <b style={{ fontSize: "18px", lineHeight: "1.25" }}>{txt(_v?.title)}</b>
                  <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(_v?.spk)}</span>
                </button>
              </Fragment>
            ))}
          </div>
          {v.libEmpty ? (
            <>
              <div style={{ border: "1px dashed #BDB9B0", padding: "40px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "25px" }}>No videos match these filters</b>
                <span style={{ color: "#6B6A66" }}>Recordings are published within 2 hours of each session ending.</span>
              </div>
            </>
          ) : null}
        </section>
        {v.detailOpen ? (
          <>
            <div role="dialog" aria-label="Session detail" onClick={v.close} style={{ position: "fixed", inset: "0", zIndex: "100", background: "rgba(14,14,15,0.6)", display: "flex", justifyContent: "flex-end" }}>
              <div onClick={v.stop} style={{ width: "min(760px,96vw)", height: "100%", background: "#fff", overflow: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: "1px solid #E3E0D8" }}>
                  <span style={sx(`font-family:var(--f-label);font-size:11px;letter-spacing:0.14em;color:${v.d?.stc ?? ""};`)}>
                    {txt(v.d?.badge)}{" · SESSION PAGE"}
                  </span>
                  <button onClick={v.close} style={{ border: "1px solid #0E0E0F", background: "none", height: "34px", padding: "0 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                    Close ✕
                  </button>
                </div>
                {v.d?.hasPlayer ? (
                  <>
                    <div style={{ aspectRatio: "16/9", background: "#1A1A1C", position: "relative" }}>
                      <DemoVideo key={v.d?.id} id={v.d?.id} live={v.d?.st === 'live'} />
                    </div>
                  </>
                ) : null}
                <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
                  <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>
                    {"DAY "}{txt(v.d?.day)}{" · "}{txt(v.d?.time)}–{txt(v.d?.end)}{" · "}{txt(v.d?.stage)}{" · ZONE "}{txt(v.d?.zone)}
                  </span>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "38px", lineHeight: "0.88", textTransform: "uppercase" }}>
                    {txt(v.d?.title)}
                  </span>
                  <span style={{ fontSize: "16px", lineHeight: "1.55", color: "#3A3A3E" }}>{txt(v.d?.desc)}</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
                    <button onClick={v.d?.save} style={sx(`height:46px;border:0;background:${v.d?.saveBg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                      {txt(v.d?.saveLabel)}
                    </button>
                    <button onClick={v.d?.cal} style={{ height: "46px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                      Add to calendar
                    </button>
                    <a href={withBase("/explore")} style={{ height: "46px", border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                      Navigate
                    </a>
                    <button onClick={v.d?.watch} style={{ height: "46px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                      {txt(v.d?.watchLabel)}
                    </button>
                  </div>
                  {v.d?.isAfter ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66", paddingBottom: "8px", borderBottom: "1px solid #0E0E0F" }}>
                          HIGHLIGHTS · CHAPTERS
                        </span>
                        {list(v.d?.chapters).map((c, $index) => (
                          <Fragment key={$index}>
                            <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid #E3E0D8", fontSize: "14px" }}>
                              <span style={{ fontFamily: "var(--f-label)", color: "#C2610B" }}>{txt(c?.t)}</span>
                              <span>{txt(c?.d)}</span>
                            </div>
                          </Fragment>
                        ))}
                        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                          <span style={{ border: "1px solid #0E0E0F", padding: "8px 12px", fontSize: "13px" }}>⤓ Slides (PDF)</span>
                          <span style={{ border: "1px solid #0E0E0F", padding: "8px 12px", fontSize: "13px" }}>⤓ Transcript</span>
                          <span style={{ border: "1px solid #0E0E0F", padding: "8px 12px", fontSize: "13px" }}>CC English · हिन्दी</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66", paddingBottom: "8px", borderBottom: "1px solid #0E0E0F" }}>
                      SPEAKERS
                    </span>
                    {list(v.d?.spks).map((p, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                          <span style={{ width: "48px", height: "48px", position: "relative", display: "block" }}>
                            <image-slot id={p?.slot} shape="rect" placeholder="P" />
                          </span>
                          <span>
                            <b style={{ display: "block", fontSize: "15px" }}>{txt(p?.name)}</b>
                            <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(p?.role)}{" · "}{txt(p?.org)}</span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>RELATED SESSIONS</span>
                      {list(v.d?.related).map((r, $index) => (
                        <Fragment key={$index}>
                          <button onClick={r?.open} style={{ display: "block", width: "100%", border: "0", borderBottom: "1px solid #E3E0D8", background: "none", padding: "10px 0", textAlign: "left", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#0E0E0F" }}>
                            {txt(r?.title)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>RELATED COMPANIES</span>
                      {list(v.d?.companies).map((c, $index) => (
                        <Fragment key={$index}>
                          <a href={withBase("/exhibit#directory")} style={{ display: "block", borderBottom: "1px solid #E3E0D8", padding: "10px 0", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
                            {txt(c?.name)}{" "}
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66", fontWeight: "400" }}>{txt(c?.stall)}</span>
                          </a>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", color: "#6B6A66" }}>
                    {"Capacity "}{txt(v.d?.cap)}{" · Topic "}{txt(v.d?.topic)}{" · Seats are first come, first served (sample policy)."}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {" "}
        {v.searchOpen ? (
          <>
            <div role="dialog" aria-label="Search" onClick={v.closeSearch} style={{ position: "fixed", inset: "0", zIndex: "110", background: "rgba(14,14,15,0.7)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "80px" }}>
              <div onClick={v.stop} style={{ width: "min(860px,94vw)", maxHeight: "80vh", overflow: "auto", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 20px", borderBottom: "2px solid #0E0E0F" }}>
                  <span style={{ fontSize: "22px" }}>⌕</span>
                  <input autoFocus value={val(v.q)} onChange={v.setQ} placeholder="Search exhibitors, products, sports, countries, sessions, speakers or stalls..." style={{ flex: "1", height: "64px", border: "0", outline: "none", fontSize: "20px" }} />
                  <button onClick={v.closeSearch} style={{ border: "1px solid #0E0E0F", background: "none", height: "32px", padding: "0 10px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                    Esc
                  </button>
                </div>
                <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column" }}>
                  {list(v.results).map((g, $index) => (
                    <Fragment key={$index}>
                      <div style={{ paddingTop: "14px" }}>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>{txt(g?.t)}{" · "}{txt(g?.n)}</span>
                        {" "}
                        {list(g?.items).map((i, $index) => (
                          <Fragment key={$index}>
                            <a href={i?.href} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr) auto", gap: "12px", padding: "10px 0", borderBottom: "1px solid #E3E0D8", textDecoration: "none", alignItems: "center" }}>
                              <span style={sx(`width:10px;height:10px;background:${i?.zc ?? ""};`)} />
                              <span>
                                <b style={{ display: "block", fontSize: "15px" }}>{txt(i?.a)}</b>
                                <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(i?.b)}</span>
                              </span>
                              <span style={{ fontFamily: "var(--f-label)", fontSize: "11px" }}>{txt(i?.c)}</span>
                            </a>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  ))}
                  {v.noResults ? (
                    <>
                      <div style={{ padding: "32px 0", color: "#6B6A66" }}>No results for “{txt(v.q)}”. Try a sport, a country or a stall ID like B-SGM-017.</div>
                    </>
                  ) : null}
                </div>
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

export default defineDC("Programme and Watch", Component, render);
