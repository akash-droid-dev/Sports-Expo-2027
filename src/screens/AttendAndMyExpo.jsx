'use client';
// Generated from design/site/Attend and My Expo.dc.html by scripts/dc-to-jsx.mjs.
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
  state = { ptype: 'Buyer', step: 0, regDone: false, stage: 0, form: {}, chips: { interests: ['Football', 'SportsTech'], biz: ['Sourcing suppliers', 'Distribution partners'] }, consent: { a: true, b: true, c: false }, acc: null, wallet: false, dl: 0, role: 'buyer', tab: 'overview', day: 2, saved: null, itin: null, focus: null, planSaved: false, toast: null, help: 'Meeting' };
  componentDidMount() { if (!window.ISE) this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); }
  componentWillUnmount() { clearInterval(this._t); clearTimeout(this._toast); }
  flash(t) { clearTimeout(this._toast); this.setState({ toast: t }); this._toast = setTimeout(() => this.setState({ toast: null }), 2600); }
  go(id) { setTimeout(() => { const el = document.getElementById(id); el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'smooth' }); }, 60); }
  ITIN = [
    { time: '09:30', kind: 'Zone', title: 'Sports Goods Manufacturing', where: 'Zone B · SGM cluster', cl: 'SGM', z: 'B' },
    { time: '10:15', kind: 'Exhibitor', title: 'Apex Sports India', where: 'Stall B-SGM-017', cl: 'SGM', z: 'B' },
    { time: '11:00', kind: 'Meeting', title: 'Buyer meeting · Apex Sports India', where: 'B2B Meeting Zone · Table 14', cl: 'B2B', z: 'D' },
    { time: '12:00', kind: 'Zone', title: 'SportsTech & Innovation', where: 'Zone C · STI cluster', cl: 'STI', z: 'C' },
    { time: '13:00', kind: 'Networking', title: 'Networking Café', where: 'Zone D · B2B Zone', cl: 'B2B', z: 'D' },
    { time: '14:00', kind: 'Session', title: 'AI in Sport: Broadcast, Fans and Data', where: 'Plenary Hall', cl: 'IAS', z: 'C' },
    { time: '15:00', kind: 'Zone', title: 'Startup Village', where: 'Zone C · SUV cluster', cl: 'SUV', z: 'C' },
    { time: '16:00', kind: 'Exchange', title: 'Buyer Exchange', where: 'India Sports Business Exchange', cl: 'ISX', z: 'D' }
  ];
  SUG = [
    { kind: 'Exhibitor', title: 'TurfLine Systems', where: 'Stall B-SRF-003', cl: 'SRF', z: 'B' },
    { kind: 'Demo', title: 'Velocity Performance Labs · ForceTrack demo', where: 'Stall C-PSS-006', cl: 'PSS', z: 'C' },
    { kind: 'Experience', title: 'Sprint Timing Experience', where: 'Try Sport Arena', cl: 'TSA', z: 'C' }
  ];
  renderVals() {
    const D = window.ISE; const s = this.state;
    const sel = on => ({ bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    const empty = { types: [], wiz: [], fields: [], cur: {}, regTrack: [], stage: {}, accFlow: [], pass: {}, qr: [], accTypes: [], accessRows: [], roles: [], tabs: [], metrics: [], todayMini: [], nextUp: [], modules: [], days: [], schedule: [], meetings: [], savedGroups: [], routes: [], notifs: [], helpCats: [], tickets: [], itin: [], suggest: [], profileChips: [], routeLit: [], planLit: [] };
    if (!D) return empty;
    const zc = z => D.Z[z].color;
    const TYPES = [['Visitor', 'Trade and public visitors'], ['Delegate', 'Conference programme access'], ['Buyer', 'Hosted and trade buyers'], ['Investor', 'Funds, family offices, angels'], ['Government', 'Ministries, states, agencies'], ['Federation', 'National and state bodies'], ['Media', 'Press, broadcast, creators'], ['Speaker', 'Programme contributors'], ['Startup', 'Startup Village founders'], ['Partner', 'Sponsors and partners'], ['VIP / Guest', 'By invitation']];
    const W = [
      { t: 'Account', d: 'Sign in once. Your pass, schedule and meetings stay with this account.', f: [['email', 'Email', 'lukas.brandt@gsr-retail.example'], ['pw', 'Password', '••••••••••'], ['otp', 'Verification code', '482 913'], ['lang', 'Preferred language', null, 'select', ['English', 'Deutsch', 'हिन्दी', '日本語']]] },
      { t: 'Personal details', d: 'Must match your passport or government ID.', f: [['fn', 'First name', 'Lukas'], ['ln', 'Last name', 'Brandt'], ['nat', 'Nationality', null, 'select', ['Germany', 'India', 'United Kingdom', 'Japan', 'UAE']], ['doc', 'Passport number', 'C4X••••82'], ['visa', 'Visa support letter', null, 'select', ['Yes, I need an invitation letter', 'No']], ['access', 'Accessibility needs', 'None']] },
      { t: 'Organisation', d: 'Used for matchmaking and your pass.', f: [['org', 'Organisation', 'Global Sports Retail GmbH'], ['title', 'Job title', 'Chief Sourcing Officer'], ['sector', 'Sector', null, 'select', ['Retail & distribution', 'Manufacturing', 'Government', 'Federation', 'Media']], ['web', 'Website', 'gsr-retail.example']] },
      { t: 'Participant type', d: 'Selected above. Changing it changes accreditation.', f: [['ptype', 'You are attending as', null, 'select', TYPES.map(t => t[0])], ['why', 'Why this type', s.ptype === 'Buyer' ? 'Buyers can request hosted-buyer status and access the Hosted Buyer Lounge after approval.' : 'Your accreditation and access are set from this choice.', 'info']] },
      { t: 'Interests', d: 'Shapes your recommendations and Plan My Day.', f: [['interests', 'Sports & sectors', null, 'chips', ['Football', 'Cricket', 'Hockey', 'Athletics', 'SportsTech', 'Infrastructure', 'Apparel', 'Sports Science', 'Startups'], '1 / -1']] },
      { t: 'Business interests', d: 'What you want from the Expo. Used by the Business Exchange.', f: [['biz', 'I am looking for', null, 'chips', ['Sourcing suppliers', 'Distribution partners', 'OEM manufacturing', 'Investment', 'Technology', 'Government partnerships'], '1 / -1'], ['budget', 'Annual sourcing budget', null, 'select', ['€1–5M', '€5–20M', '€20M+', 'Prefer not to say']], ['markets', 'Markets you serve', 'Germany, Austria, Switzerland']] },
      { t: 'Consent', d: 'You can change these in My Expo at any time.', f: [['a', 'Terms', 'I accept the participant terms and code of conduct (demo).', 'check', null, '1 / -1'], ['b', 'Matchmaking', 'Share my profile with matched exhibitors so they can request meetings.', 'check', null, '1 / -1'], ['c', 'Marketing', 'Send me news from partners and future editions.', 'check', null, '1 / -1']] },
      { t: 'Review & submit', d: 'Check the summary. Verification starts immediately.', f: [['sum', 'Summary', `Lukas Brandt · Global Sports Retail GmbH · ${s.ptype} · Germany · Interests: ${(s.chips.interests || []).join(', ')} · Looking for: ${(s.chips.biz || []).join(', ')}`, 'info', null, '1 / -1']] }
    ];
    const cur = W[s.step];
    const fields = cur.f.map(([key, label, def, type = 'text', opts, span = 'auto']) => {
      const value = key === 'ptype' ? s.ptype : (s.form[key] ?? def ?? (opts ? opts[0] : ''));
      const set = e => key === 'ptype' ? this.setState({ ptype: e.target.value }) : this.setState({ form: { ...s.form, [key]: e.target.value } });
      const on = s.chips[key] || [];
      return { label, value, set, span, opts: opts || [], isText: type === 'text', isSelect: type === 'select', isChips: type === 'chips', isCheck: type === 'check', isInfo: type === 'info',
        tick: s.consent[key] ? '✓' : '', boxBg: s.consent[key] ? '#0E0E0F' : '#fff', toggle: e => { e.preventDefault(); this.setState({ consent: { ...s.consent, [key]: !s.consent[key] } }); },
        chips: (opts || []).map(t => { const o = on.includes(t); return { t, on: o, mark: o ? '✓ ' : '', ...sel(o), pick: e => { e.preventDefault(); this.setState({ chips: { ...s.chips, [key]: o ? on.filter(x => x !== t) : [...on, t] } }); } }; }) };
    });
    const STG = [
      { k: 'VERIFICATION', icon: '◷', color: '#C2610B', t: 'VERIFYING YOUR IDENTITY', d: 'We are checking your ID and organisation. Most checks complete within 24 hours (sample).' },
      { k: 'APPROVED', icon: '✓', color: '#0B6E4F', t: 'REGISTRATION APPROVED', d: `You are approved as a ${s.ptype}. Accreditation is now being issued for your participant type.` },
      { k: 'ACCREDITATION', icon: '■', color: '#1F4E9E', t: 'ACCREDITATION ASSIGNED', d: 'Your access category has been set. Your digital credential is being generated.' },
      { k: 'CREDENTIAL ISSUED', icon: '✓', color: '#0E0E0F', t: 'YOUR PASS IS READY', d: 'Your digital credential is live. Show the QR at the Main Entrance or open it in the mobile app.' }
    ];
    const stage = s.regDone ? STG[s.stage] : { k: 'NOT SUBMITTED', color: '#6B6A66' };
    const issued = s.regDone && s.stage === 3;
    const ACC = { Buyer: ['#F07C12', 'Hall 2 · Business Exchange · Hosted Buyer Lounge · B2B Zone'], Visitor: ['#FFFFFF', 'Hall 2 · Public programme'], Delegate: ['#0B6E4F', 'Hall 2 · All programme stages'], Investor: ['#C9A227', 'Hall 2 · Investor Lounge · Deal Rooms'], Government: ['#9E1B22', 'Hall 2 · Federation & CEO Lounges · Deal Rooms'], Media: ['#1F4E9E', 'Hall 2 · Media Centre · Stage pits'] };
    const accKey = s.acc || (ACC[s.ptype] ? s.ptype : 'Visitor');
    const [band, access] = ACC[accKey];
    // QR pattern
    const qr = []; let h = 7;
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (a, b) => x >= a && x < a + 7 && y >= b && y < b + 7;
      let on;
      if (finder(0, 0) || finder(14, 0) || finder(0, 14)) { const fx = x % 14 > 6 ? x - 14 : x % 14, fy = y % 14 > 6 ? y - 14 : y % 14; const lx = x >= 14 ? x - 14 : x, ly = y >= 14 ? y - 14 : y; on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4); }
      else { h = (h * 1103515245 + 12345) & 0x7fffffff; on = (h >> 8) % 2 === 0; }
      qr.push(on ? '#0E0E0F' : '#fff');
    }
    const ACCESS = [['Hall 2 exhibition floor', true], ['Programme stages', accKey !== 'Visitor' || true], ['India Sports Business Exchange', ['Buyer', 'Investor', 'Government', 'Delegate'].includes(accKey)], ['Hosted Buyer Lounge', accKey === 'Buyer'], ['Investor Lounge & Deal Rooms', ['Investor', 'Government'].includes(accKey)], ['Federation & CEO Lounges', accKey === 'Government'], ['Media Centre', accKey === 'Media']];
    // My Expo
    const role = s.role;
    const saved = s.saved || { ex: ['apex', 'turf', 'lumen', 'motion', 'stride', 'origin'], prod: [0, 1, 3, 6], ses: ['x5', 'x7', 'x8', 'x9'], expx: ['Sprint Timing Experience'] };
    const itin = s.itin || this.ITIN;
    const itinFull = itin.map((it, i) => ({ ...it, time: this.ITIN[i] ? this.ITIN[i].time : (16 + i - 7) + ':' + (i % 2 ? '30' : '00') }));
    const exs = D.exhibitors;
    const meetings = [
      { when: 'DAY 2 · 11:00', room: 'B2B · Table 14', type: 'BUYER–SELLER', with: 'Apex Sports India', purpose: 'Match footballs and goal systems for DACH retail, AW27', st: 'CONFIRMED', c: '#0B6E4F', icon: '✓' },
      { when: 'DAY 2 · 15:30', room: 'Deal Room 3', type: 'B2B', with: 'TurfLine Systems', purpose: 'Hockey turf distribution in Germany', st: 'AWAITING SLOT', c: '#C2610B', icon: '◷' },
      { when: 'DAY 3 · 10:30', room: 'TBC', type: 'B2B', with: 'Origin Supply Co.', purpose: 'Recycled teamwear OEM pilot', st: 'REQUESTED', c: '#1F4E9E', icon: '→' },
      { when: 'DAY 1 · 14:30', room: 'B2B · Table 06', type: 'BUYER–SELLER', with: 'Meerut Willow Works', purpose: 'Cricket bats for UK partner stores', st: 'COMPLETED · LOI', c: '#0E0E0F', icon: '■' }
    ];
    const modsBy = {
      visitor: [
        { t: 'Saved exhibitors', note: saved.ex.length + ' SAVED', rows: saved.ex.slice(0, 4).map(id => { const e = exs.find(x => x.id === id); return { a: e.name, b: e.sector, c: e.stall, cc: '#0E0E0F' }; }) },
        { t: 'Experience bookings', note: '1 BOOKED', rows: [{ a: 'Sprint Timing Experience', b: 'Try Sport Arena · 20 min', c: 'DAY 2 · 16:40', cc: '#0B6E4F' }, { a: 'VR Training', b: 'Interactive Experiences', c: 'WAITLIST #4', cc: '#C2610B' }] }
      ],
      buyer: [
        { t: 'Recommended companies', note: 'BY MATCH SCORE', rows: [['apex', 94], ['origin', 89], ['turf', 86], ['stride', 81]].map(([id, sc]) => { const e = exs.find(x => x.id === id); return { a: e.name, b: e.sector + ' · ' + e.stall, c: sc + '% MATCH', cc: '#0B6E4F' }; }) },
        { t: 'Meeting requests', note: '2 PENDING', rows: [{ a: 'Stridewell Footwear', b: 'Wants to present OEM spike plates', c: 'ACCEPT / DECLINE', cc: '#C2610B' }, { a: 'Luminar Stadium Lighting', b: 'Retail lighting for flagship stores', c: 'ACCEPT / DECLINE', cc: '#C2610B' }] },
        { t: 'Procurement interests', note: 'EDIT IN PROFILE', rows: [{ a: 'Match & training footballs', b: 'Volume 40,000 units / yr (sample)', c: 'ACTIVE', cc: '#0B6E4F' }, { a: 'Portable goal systems', b: 'Youth & 7-a-side', c: 'ACTIVE', cc: '#0B6E4F' }, { a: 'Recycled teamwear', b: 'Club licensing', c: 'EXPLORING', cc: '#6B6A66' }] },
        { t: 'Saved products', note: saved.prod.length + ' SAVED', rows: saved.prod.map(i => ({ a: D.products[i].name, b: D.products[i].by, c: D.products[i].moq, cc: '#0E0E0F' })) }
      ],
      investor: [
        { t: 'Recommended startups', note: 'BY THESIS FIT', rows: D.startups.slice(0, 4).map((st, i) => ({ a: st.name, b: st.tech + ' · ' + st.sport + ' · ' + st.stage, c: [92, 87, 83, 78][i] + '% FIT', cc: '#0B6E4F' })) },
        { t: 'Investment opportunities', note: 'SAMPLE', rows: [{ a: 'Odisha high-performance centre PPP', b: 'State pavilion A-STA-P2 · ₹420 Cr (illustrative)', c: 'DATA ROOM', cc: '#1F4E9E' }, { a: 'Apex Sports India capacity expansion', b: 'Growth round · manufacturing', c: 'TEASER', cc: '#6B6A66' }] },
        { t: 'Deal rooms', note: 'MOU / DEAL ROOMS', rows: [{ a: 'Deal Room 2 · RecovR', b: 'Term-sheet discussion', c: 'DAY 2 · 13:30', cc: '#0B6E4F' }, { a: 'Deal Room 5 · KheloLens', b: 'Due diligence Q&A', c: 'DAY 3 · 11:00', cc: '#C2610B' }] },
        { t: 'Meeting requests', note: '3 PENDING', rows: [{ a: 'Paceline', b: 'Seed round · Multi-sport data', c: 'ACCEPT / DECLINE', cc: '#C2610B' }, { a: 'GripAI', b: 'Pre-seed · Archery edge AI', c: 'ACCEPT / DECLINE', cc: '#C2610B' }] }
      ]
    };
    const tabsDef = [['overview', 'OVERVIEW', ''], ['pass', 'MY PASS', issued ? '●' : '◷'], ['schedule', 'MY SCHEDULE', saved.ses.length], ['meetings', 'MY MEETINGS', 4], ['saved', 'SAVED', saved.ex.length + saved.prod.length + saved.ses.length + saved.expx.length], ['routes', 'MY ROUTES', 3], ['notif', 'NOTIFICATIONS', 3], ['help', 'HELPDESK', 1]];
    const rm = (k, v) => () => this.setState({ saved: { ...saved, [k]: saved[k].filter(x => x !== v) } });
    const daySes = D.sessions.filter(x => x.day === s.day && saved.ses.includes(x.id));
    const T = ['OPEN', 'ASSIGNED', 'IN PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'];
    const ticket = (id, cat, t, last, at) => ({ id, cat, t, last, track: T.map((x, i) => ({ t: x, c: i <= at ? (at >= 4 ? '#0B6E4F' : '#F07C12') : '#E3E0D8', fg: i <= at ? '#0E0E0F' : '#8A877F' })) });
    const walk = Math.max(4, itin.length * 3 + 2);
    return {
      ptype: s.ptype, ptypeUpper: s.ptype.toUpperCase(),
      types: TYPES.map(([t, d], i) => ({ t, d, n: String(i + 1).padStart(2, '0'), bg: s.ptype === t ? '#0E0E0F' : '#fff', fg: s.ptype === t ? '#fff' : '#0E0E0F', pick: () => { this.setState({ ptype: t, acc: null }); this.go('register'); } })),
      wiz: W.map((w, i) => ({ n: String(i + 1).padStart(2, '0'), t: w.t, mark: i < s.step || s.regDone ? '✓' : '', bg: i === s.step && !s.regDone ? '#fff' : 'transparent', fg: i <= s.step || s.regDone ? '#0E0E0F' : '#6B6A66', weight: i === s.step && !s.regDone ? 700 : 500, go: () => this.setState({ step: i, regDone: false }) })),
      inWizard: !s.regDone, regDone: s.regDone, cur: { ...cur, n: s.step + 1 }, fields, wizPct: ((s.step + 1) / 8 * 100) + '%',
      back: () => this.setState({ step: Math.max(0, s.step - 1) }),
      next: () => s.step === 7 ? this.setState({ regDone: true, stage: 0 }) : this.setState({ step: s.step + 1 }),
      nextLabel: s.step === 7 ? 'Submit registration' : 'Continue →',
      stage, advanceLabel: s.stage < 3 ? 'Simulate next stage →' : 'Open my pass ↓',
      advance: () => { if (s.stage < 3) { this.setState({ stage: s.stage + 1 }); if (s.stage === 2) this.flash('Your digital credential has been issued'); } else this.go('accreditation'); },
      restartReg: () => this.setState({ regDone: false, step: 0, stage: 0 }),
      regTrack: ['SUBMITTED', 'VERIFICATION', 'APPROVAL', 'ACCREDITATION', 'CREDENTIAL'].map((t, i) => { const done = s.regDone && i <= s.stage + 1; return { t, date: done ? ['04 MAY', '04 MAY', '05 MAY', '05 MAY', '05 MAY'][i] + ' (demo)' : '—', c: done ? '#0B6E4F' : '#E3E0D8' }; }),
      accFlow: [['Registration', 'Your account and details'], ['Verification', 'ID and organisation checked'], ['Approval', 'Participant type confirmed'], ['Accreditation type', 'Access category assigned'], ['Digital credential', 'Pass issued to web and app']].map(([t, d], i) => { const done = s.regDone && i <= s.stage + 1; const now = s.regDone ? i === s.stage + 1 && s.stage < 3 : i === 0; return { t, d, n: '0' + (i + 1), st: done ? '✓' : now ? '◷' : '', c: done ? '#0B6E4F' : now ? '#C2610B' : '#8A877F', ink: done || now ? '#0E0E0F' : '#8A877F' }; }),
      pass: { band, access, cat: accKey, catUpper: accKey.toUpperCase(), id: 'ISE27-' + accKey.slice(0, 3).toUpperCase() + '-20931' },
      passLocked: !issued, qr,
      accTypes: Object.keys(ACC).map(k => ({ t: k.toUpperCase(), c: ACC[k][0] === '#FFFFFF' ? '#BDB9B0' : ACC[k][0], ...sel(k === accKey), pick: () => this.setState({ acc: k }) })),
      accessRows: ACCESS.map(([t, ok]) => ({ t, icon: ok ? '✓' : '—', st: ok ? 'INCLUDED' : 'NO ACCESS', c: ok ? '#0B6E4F' : '#8A877F' })),
      viewPass: () => { if (!issued) { this.flash('Pass not issued yet — complete registration first'); this.go('register'); } else this.go('accreditation'); },
      wallet: () => { this.setState({ wallet: true }); this.flash(issued ? 'Added to Wallet (mock)' : 'Wallet available once your pass is issued'); },
      walletLabel: s.wallet && issued ? '✓ In wallet' : 'Add to wallet',
      download: () => { if (!issued) return this.flash('Download available once your pass is issued'); this.setState({ dl: 1 }); setTimeout(() => this.setState({ dl: 2 }), 1400); },
      dlLabel: ['DOWNLOAD PDF', 'PREPARING…', '✓ DOWNLOADED'][s.dl],
      roles: [['visitor', 'VISITOR'], ['buyer', 'BUYER'], ['investor', 'INVESTOR']].map(([id, t]) => ({ t, ...sel(id === role), pick: () => this.setState({ role: id }) })),
      tabs: tabsDef.map(([id, t, count]) => ({ t, count: String(count), cc: id === s.tab ? '#F07C12' : '#6B6A66', ...sel(id === s.tab), pick: () => id === 'pass' ? this.go('accreditation') : this.setState({ tab: id }) })),
      tabOverview: s.tab === 'overview', tabSchedule: s.tab === 'schedule', tabMeetings: s.tab === 'meetings', tabSaved: s.tab === 'saved', tabRoutes: s.tab === 'routes', tabNotif: s.tab === 'notif', tabHelp: s.tab === 'help',
      metrics: [[saved.ex.length, 'Saved exhibitors'], [saved.prod.length, 'Saved products'], [saved.ses.length, 'Sessions'], [4, 'Meetings'], [saved.expx.length, 'Experiences']].map(([v, k]) => ({ v, k })),
      todayMini: itinFull.slice(0, 5).map((it, i) => ({ ...it, zc: zc(it.z), st: i === 0 ? 'NOW' : i === 2 ? 'CONFIRMED' : '', stc: i === 0 ? '#C2610B' : '#0B6E4F' })),
      nextUp: [
        { k: '● UPCOMING SESSION · 10:00', c: '#9E1B22', t: 'The Future of AI Coaching', d: 'Innovation Arena · Arjun Mehta, Dr. Meera Raghavan', cta: 'WATCH LIVE →', href: withBase('/programme#watch') },
        { k: 'UPCOMING MEETING · 11:00', c: '#0B6E4F', t: 'Apex Sports India', d: 'B2B Meeting Zone · Table 14 · 4 min walk', cta: 'NAVIGATE →', href: withBase('/explore') },
        { k: 'EXPERIENCE BOOKING · 16:40', c: '#C2610B', t: 'Sprint Timing Experience', d: 'Try Sport Arena · bring sports shoes', cta: 'VIEW BOOKING →', href: withBase('/zones') }
      ],
      modules: modsBy[role],
      days: [1, 2, 3].map(d => ({ t: 'DAY ' + d, ...sel(d === s.day), pick: () => this.setState({ day: d }) })),
      schedule: daySes.map(x => ({ ...x, zc: zc(x.zone), spk: x.speakers.map(id => D.sp(id).name).join(', '), cta: x.status === 'live' ? '● WATCH LIVE' : x.status === 'ondemand' ? 'WATCH RECORDING' : 'ADD TO CALENDAR' })),
      scheduleEmpty: daySes.length === 0,
      meetings,
      savedGroups: [
        { t: 'EXHIBITORS', n: saved.ex.length, items: saved.ex.map(id => { const e = exs.find(x => x.id === id); return { a: e.name, b: e.stall + ' · ' + e.sector, zc: zc(e.zone), remove: rm('ex', id) }; }) },
        { t: 'PRODUCTS', n: saved.prod.length, items: saved.prod.map(i => ({ a: D.products[i].name, b: D.products[i].by, zc: zc(D.products[i].stall[0]), remove: rm('prod', i) })) },
        { t: 'SESSIONS', n: saved.ses.length, items: saved.ses.map(id => { const x = D.sessions.find(y => y.id === id); return { a: x.title, b: 'Day ' + x.day + ' · ' + x.time + ' · ' + x.stage, zc: zc(x.zone), remove: rm('ses', id) }; }) },
        { t: 'EXPERIENCES', n: saved.expx.length, items: saved.expx.map(t => ({ a: t, b: 'Try Sport Arena · Day 2 · 16:40', zc: zc('C'), remove: rm('expx', t) })) }
      ],
      routeLit: ['SGM'],
      routes: [{ from: 'Main Entrance', to: 'Apex Sports · B-SGM-017', via: 'Sports Boulevard → Zone B → Sports Goods Manufacturing', min: 4 }, { from: 'B-SGM-017', to: 'B2B Table 14', via: 'Boulevard south → Zone D', min: 3 }, { from: 'B2B Zone', to: 'Plenary Hall', via: 'Boulevard east → Zone C', min: 5 }],
      notifs: [
        { time: '09:10', k: 'MEETING', t: 'Meeting in 15 min — not yet', d: 'Apex Sports India at 11:00 · Table 14. Reminder set for 10:45.', c: '#0B6E4F', cta: 'VIEW', href: withBase('/connect#meetings'), bg: '#FBFAF7' },
        { time: '09:02', k: 'LIVE', t: 'Live session starting', d: 'The Future of AI Coaching begins at 10:00 in the Innovation Arena.', c: '#9E1B22', cta: 'WATCH', href: withBase('/programme#watch'), bg: '#FBFAF7' },
        { time: '08:40', k: 'BUYER REQUEST', t: 'New meeting request', d: 'Stridewell Footwear wants to meet you on Day 2 or Day 3.', c: '#C2610B', cta: 'RESPOND', href: withBase('/connect#meetings'), bg: '#FBFAF7' },
        { time: '08:15', k: 'TRANSPORT', t: 'Transport update', d: 'Airport Express Line running every 10 min to Yashobhoomi Dwarka Sector 25 (sample).', c: '#1F4E9E', cta: 'DETAILS', href: withBase('/explore#getting-there'), bg: '#fff' },
        { time: 'YEST.', k: 'EXHIBITOR', t: 'Exhibitor response', d: 'TurfLine Systems accepted your request. Choose a slot.', c: '#0B6E4F', cta: 'CHOOSE SLOT', href: withBase('/connect#meetings'), bg: '#fff' },
        { time: 'YEST.', k: 'ROUTE', t: 'Route changed', d: 'Aisle 4 in Zone B is closed for build-up until 09:00. Your route avoids it.', c: '#3A3A3E', cta: 'VIEW ROUTE', href: withBase('/explore'), bg: '#fff' }
      ],
      helpCats: ['Registration', 'Exhibitor', 'Visa', 'Travel', 'Accommodation', 'Transport', 'Meeting', 'Stall', 'Accreditation', 'Programme', 'Technical', 'General'].map(t => ({ t, ...sel(t === s.help), pick: () => { this.setState({ help: t }); this.flash('New ' + t + ' request started (demo)'); } })),
      tickets: [ticket('HD-10482', 'VISA', 'Invitation letter for business visa', 'Agent Neha: letter issued, check your email (demo)', 4), ticket('HD-10511', 'MEETING', 'Change table for Apex meeting', 'Waiting for exhibitor confirmation', 3), ticket('HD-10533', 'ACCOMMODATION', 'Partner hotel shuttle times', 'Assigned to Travel Desk', 1)],
      profileChips: ['International Buyer', 'Germany', 'Football Equipment', 'SportsTech'],
      itin: itinFull.map((it, i) => ({ ...it, kindU: it.kind.toUpperCase(), zc: zc(it.z), bg: s.focus === it.cl ? '#FFF3E6' : 'transparent', hover: () => this.setState({ focus: it.cl }),
        up: () => { if (!i) return; const n = [...itin]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; this.setState({ itin: n, planSaved: false }); },
        down: () => { if (i === itin.length - 1) return; const n = [...itin]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; this.setState({ itin: n, planSaved: false }); },
        remove: () => this.setState({ itin: itin.filter((_, j) => j !== i), planSaved: false }) })),
      itinCount: itin.length, itinWalk: walk,
      suggest: this.SUG.filter(x => !itin.some(y => y.title === x.title)).map(x => ({ ...x, zc: zc(x.z), add: () => this.setState({ itin: [...itin, x], planSaved: false }) })),
      planLit: [...new Set(itin.map(x => x.cl))], planFocus: s.focus || '',
      savePlan: () => { this.setState({ planSaved: true }); this.flash('Plan saved to My Schedule and the mobile app'); },
      savePlanLabel: s.planSaved ? '✓ Saved to My Expo' : 'Save my day',
      resetPlan: () => this.setState({ itin: null, planSaved: false }),
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
            <a href={withBase("/attend")} style={{ color: "#F07C12", textDecoration: "none" }}>Attend</a>
            <a href={withBase("/connect")} style={{ color: "#fff", textDecoration: "none" }}>Connect</a>
            <a href={withBase("/programme")} style={{ color: "#fff", textDecoration: "none" }}>Programme</a>
            <a href={withBase("/programme#watch")} style={{ color: "#fff", textDecoration: "none" }}>Watch</a>
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
        <nav aria-label="Attend sections" style={{ position: "sticky", top: "60px", zIndex: "50", background: "#fff", borderBottom: "1px solid #0E0E0F", display: "flex", overflowX: "auto" }}>
          <a href="#why" style={{ textDecoration: "none", color: "#0E0E0F", padding: "14px 22px", borderRight: "1px solid #E3E0D8", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", whiteSpace: "nowrap", display: "flex", gap: "8px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontWeight: "500" }}>01</span>
            Why attend
          </a>
          <a href="#register" style={{ textDecoration: "none", color: "#0E0E0F", padding: "14px 22px", borderRight: "1px solid #E3E0D8", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", whiteSpace: "nowrap", display: "flex", gap: "8px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontWeight: "500" }}>02</span>
            Register
          </a>
          <a href="#accreditation" style={{ textDecoration: "none", color: "#0E0E0F", padding: "14px 22px", borderRight: "1px solid #E3E0D8", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", whiteSpace: "nowrap", display: "flex", gap: "8px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontWeight: "500" }}>03</span>
            Accreditation
          </a>
          <a href="#myexpo" style={{ textDecoration: "none", color: "#0E0E0F", padding: "14px 22px", borderRight: "1px solid #E3E0D8", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", whiteSpace: "nowrap", display: "flex", gap: "8px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontWeight: "500" }}>04</span>
            My Expo
          </a>
          <a href="#plan" style={{ textDecoration: "none", color: "#0E0E0F", padding: "14px 22px", borderRight: "1px solid #E3E0D8", fontSize: "13px", fontWeight: "700", letterSpacing: "0.08em", whiteSpace: "nowrap", display: "flex", gap: "8px" }}>
            <span style={{ fontFamily: "var(--f-label)", fontWeight: "500" }}>05</span>
            Plan my day
          </a>
        </nav>
        <section id="why" data-screen-label="Why attend" style={{ scrollMarginTop: "110px", padding: "80px 28px 64px", maxWidth: "1440px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "48px", alignItems: "end" }}>
            <div>
              <div style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.2em", color: "#6B6A66", marginBottom: "20px" }}>
                ATTEND · 3 DAYS · HALL 2 · YASHOBHOOMI, NEW DELHI
              </div>
              <h1 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(64px,9vw,148px) * 0.72)", lineHeight: "0.84" }}>
                Experience
                <br />
                the expo.
              </h1>
            </div>
            <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.5", maxWidth: "560px", textWrap: "pretty" }}>
              One registration gives you a verified digital pass, a personal schedule and a route through Hall 2. Choose how you are attending; the registration adapts to you.
            </p>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #0E0E0F", paddingBottom: "10px", marginBottom: "0" }}>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em" }}>I AM ATTENDING AS</span>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>
                {"Selected: "}
                <b style={{ color: "#0E0E0F" }}>{txt(v.ptype)}</b>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", borderLeft: "1px solid #E3E0D8" }}>
              {list(v.types).map((t, $index) => (
                <Fragment key={$index}>
                  <button onClick={t?.pick} style={sx(`border:0;border-right:1px solid #E3E0D8;border-bottom:1px solid #E3E0D8;background:${t?.bg ?? ""};color:${t?.fg ?? ""};padding:18px 16px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:6px;min-height:118px;`)}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", opacity: "0.7" }}>{txt(t?.n)}</span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px", lineHeight: "0.9", textTransform: "uppercase" }}>
                      {txt(t?.t)}
                    </span>
                    <span style={{ fontSize: "13px", lineHeight: "1.35", opacity: "0.85" }}>{txt(t?.d)}</span>
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section id="register" data-screen-label="Visitor registration" style={{ scrollMarginTop: "110px", background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
              <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
                02 — Registration
              </h2>
              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.1em" }}>
                {"OPEN NOW · EVERY REGISTRATION IS REVIEWED"}
              </span>
            </div>
            <RegisterCta kind="visitor" />
          </div>
        </section>
        <section id="accreditation" data-screen-label="Accreditation and digital pass" style={{ scrollMarginTop: "110px", padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              {"03 — Identity & accreditation"}
            </h2>
            <span style={{ fontSize: "15px", maxWidth: "520px", color: "#3A3A3E" }}>
              Registration tells us who you are. Accreditation decides where you can go. They are issued separately.
            </span>
          </div>
          <ol style={{ margin: "0 0 40px", padding: "0", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", borderTop: "1px solid #0E0E0F" }}>
            {list(v.accFlow).map((a, $index) => (
              <Fragment key={$index}>
                <li style={{ padding: "18px 16px 18px 0", borderRight: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={sx(`font-family:var(--f-label);font-size:11px;color:${a?.c ?? ""};`)}>{txt(a?.n)}{" "}{txt(a?.st)}</span>
                  <b style={sx(`font-family:var(--f-display);font-stretch:62%;font-weight:800;font-size:23px;line-height:0.95;text-transform:uppercase;color:${a?.ink ?? ""};`)}>
                    {txt(a?.t)}
                  </b>
                  <span style={{ fontSize: "13px", color: "#6B6A66", lineHeight: "1.4" }}>{txt(a?.d)}</span>
                </li>
              </Fragment>
            ))}
          </ol>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,440px) minmax(0,1fr)", gap: "56px", alignItems: "start" }}>
            <div style={{ background: "#0E0E0F", color: "#fff", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
              <div style={sx(`height:10px;background:${v.pass?.band ?? ""};`)} />
              <div style={{ padding: "24px 26px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "23px", lineHeight: "0.9" }}>
                  India sports
                  <br />
                  {"Expo "}
                  <span style={{ color: "#F07C12" }}>2027</span>
                </span>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#BDB9B0", textAlign: "right" }}>
                  YASHOBHOOMI
                  <br />
                  NEW DELHI
                </span>
              </div>
              <div style={{ padding: "22px 26px", display: "grid", gridTemplateColumns: "110px 1fr", gap: "18px", alignItems: "end" }}>
                <div style={{ width: "110px", height: "136px", position: "relative", background: "#2A2A2D" }}>
                  <image-slot id="pass-photo" shape="rect" placeholder="Photo" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "33px", lineHeight: "0.86" }}>
                    Lukas
                    <br />
                    Brandt
                  </span>
                  <span style={{ fontSize: "13px", color: "#BDB9B0" }}>Global Sports Retail GmbH (demo)</span>
                </div>
              </div>
              <div style={{ margin: "0 26px", padding: "14px 0", borderTop: "1px solid #3A3A3E", borderBottom: "1px solid #3A3A3E", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={sx(`font-family:var(--f-display);font-stretch:62%;font-weight:900;font-size:28px;line-height:0.9;color:${v.pass?.band ?? ""};text-transform:uppercase;`)}>
                  {txt(v.pass?.cat)}
                </span>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(v.pass?.id)}</span>
              </div>
              <div style={{ padding: "20px 26px 26px", display: "grid", gridTemplateColumns: "132px 1fr", gap: "20px", alignItems: "center" }}>
                <div aria-label="QR code (demo)" style={{ width: "132px", height: "132px", background: "#fff", padding: "8px", boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(21,1fr)" }}>
                  {list(v.qr).map((q, $index) => (
                    <Fragment key={$index}>
                      <span style={sx(`background:${q ?? ""};`)} />
                    </Fragment>
                  ))}
                </div>
                <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: "13px" }}>
                  <dt style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.12em", color: "#8A877F" }}>VALID</dt>
                  <dd style={{ margin: "0" }}>Day 1 – Day 3 · 2027 (dates TBC)</dd>
                  <dt style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.12em", color: "#8A877F" }}>ACCESS</dt>
                  <dd style={{ margin: "0" }}>{txt(v.pass?.access)}</dd>
                  <dt style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.12em", color: "#8A877F" }}>ENTRY</dt>
                  <dd style={{ margin: "0" }}>Main Entrance · Hall 2</dd>
                </dl>
              </div>
              {v.passLocked ? (
                <>
                  <div style={{ position: "absolute", inset: "10px 0 0", background: "rgba(14,14,15,0.86)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", textAlign: "center", padding: "24px" }}>
                    <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#F07C12" }}>◷ NOT YET ISSUED</span>
                    <span style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "30px", lineHeight: "0.9" }}>
                      Your pass appears
                      <br />
                      after accreditation
                    </span>
                    <span style={{ fontSize: "13px", color: "#BDB9B0" }}>{"Current stage: "}{txt(v.stage?.k)}</span>
                  </div>
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>ACCREDITATION TYPE · PREVIEW</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0", border: "1px solid #0E0E0F", marginTop: "10px", width: "fit-content" }}>
                  {list(v.accTypes).map((a, $index) => (
                    <Fragment key={$index}>
                      <button onClick={a?.pick} style={sx(`height:42px;padding:0 16px;border:0;border-right:1px solid #0E0E0F;background:${a?.bg ?? ""};color:${a?.fg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.08em;cursor:pointer;display:flex;align-items:center;gap:8px;`)}>
                        <span style={sx(`width:10px;height:10px;background:${a?.c ?? ""};`)} />
                        {txt(a?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: "2px solid #0E0E0F" }}>
                <span style={{ display: "block", fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66", padding: "14px 0 6px" }}>
                  {"ACCESS RIGHTS FOR "}{txt(v.pass?.catUpper)}
                </span>
                {list(v.accessRows).map((r, $index) => (
                  <Fragment key={$index}>
                    <div style={{ display: "grid", gridTemplateColumns: "28px 1fr auto", gap: "10px", padding: "11px 0", borderBottom: "1px solid #E3E0D8", fontSize: "15px", alignItems: "center" }}>
                      <span style={sx(`font-family:var(--f-label);font-weight:500;color:${r?.c ?? ""};`)}>{txt(r?.icon)}</span>
                      <span>{txt(r?.t)}</span>
                      <span style={sx(`font-family:var(--f-label);font-size:11px;letter-spacing:0.1em;color:${r?.c ?? ""};`)}>{txt(r?.st)}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px" }}>
                <button onClick={v.viewPass} style={{ height: "50px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                  View pass
                </button>
                <button onClick={v.wallet} style={{ height: "50px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                  {txt(v.walletLabel)}
                </button>
                <button onClick={v.download} style={{ height: "50px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                  {txt(v.dlLabel)}
                </button>
                <a href={withBase("/mobile")} style={{ height: "50px", border: "1px solid #0E0E0F", color: "#0E0E0F", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", boxSizing: "border-box" }}>
                  Open in app
                </a>
              </div>
              <span style={{ fontSize: "13px", color: "#6B6A66" }}>
                Wallet and download are mock actions in this prototype. The QR pattern is illustrative and does not encode data.
              </span>
            </div>
          </div>
        </section>
        <section id="myexpo" data-screen-label="My Expo dashboard" style={{ scrollMarginTop: "110px", background: "#F6F4EF", padding: "72px 28px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
              <div>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.16em", color: "#6B6A66" }}>
                  04 — MY EXPO · DAY 2 · 09:12 (DEMO CLOCK)
                </span>
                <h2 style={{ margin: "8px 0 0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
                  Welcome, Lukas.
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>VIEW AS</span>
                <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F", background: "#fff" }}>
                  {list(v.roles).map((r, $index) => (
                    <Fragment key={$index}>
                      <button role="tab" onClick={r?.pick} style={sx(`height:42px;padding:0 18px;border:0;border-right:1px solid #0E0E0F;background:${r?.bg ?? ""};color:${r?.fg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.1em;cursor:pointer;`)}>
                        {txt(r?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0,1fr)", border: "1px solid #0E0E0F", background: "#fff", minHeight: "720px" }}>
              <nav aria-label="My Expo" style={{ borderRight: "1px solid #0E0E0F", display: "flex", flexDirection: "column" }}>
                {list(v.tabs).map((t, $index) => (
                  <Fragment key={$index}>
                    <button onClick={t?.pick} style={sx(`display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border:0;border-bottom:1px solid #E3E0D8;background:${t?.bg ?? ""};color:${t?.fg ?? ""};font-size:13px;font-weight:700;letter-spacing:0.08em;text-align:left;cursor:pointer;`)}>
                      {txt(t?.t)}
                      <span style={sx(`font-family:var(--f-label);font-size:11px;font-weight:500;color:${t?.cc ?? ""};`)}>{txt(t?.count)}</span>
                    </button>
                  </Fragment>
                ))}
                <a href="#plan" style={{ margin: "18px", background: "#F07C12", color: "#0E0E0F", textDecoration: "none", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" }}>
                  Plan my day →
                </a>
              </nav>
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px", minWidth: "0" }}>
                {v.tabOverview ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", borderTop: "2px solid #0E0E0F" }}>
                        {list(v.metrics).map((m, $index) => (
                          <Fragment key={$index}>
                            <div style={{ padding: "14px 12px 14px 0", borderRight: "1px solid #E3E0D8" }}>
                              <span style={{ display: "block", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "38px", lineHeight: "0.9" }}>
                                {txt(m?.v)}
                              </span>
                              <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(m?.k)}</span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: "24px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #0E0E0F", paddingBottom: "8px" }}>
                            <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Today's plan</b>
                            <a href="#plan" style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>Edit</a>
                          </div>
                          {list(v.todayMini).map((i, $index) => (
                            <Fragment key={$index}>
                              <div style={{ display: "grid", gridTemplateColumns: "56px 10px 1fr auto", gap: "12px", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #E3E0D8" }}>
                                <span style={{ fontFamily: "var(--f-label)", fontSize: "13px" }}>{txt(i?.time)}</span>
                                <span style={sx(`width:10px;height:10px;background:${i?.zc ?? ""};`)} />
                                <span>
                                  <b style={{ display: "block", fontSize: "15px" }}>{txt(i?.title)}</b>
                                  <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(i?.kind)}{" · "}{txt(i?.where)}</span>
                                </span>
                                <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.1em;color:${i?.stc ?? ""};`)}>{txt(i?.st)}</span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {list(v.nextUp).map((n, $index) => (
                            <Fragment key={$index}>
                              <div style={{ border: "1px solid #0E0E0F", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.14em;color:${n?.c ?? ""};`)}>{txt(n?.k)}</span>
                                <b style={{ fontSize: "18px", lineHeight: "1.2" }}>{txt(n?.t)}</b>
                                <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(n?.d)}</span>
                                <a href={n?.href} style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", marginTop: "4px" }}>{txt(n?.cta)}</a>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: "24px" }}>
                        {list(v.modules).map((m, $index) => (
                          <Fragment key={$index}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #0E0E0F", paddingBottom: "8px" }}>
                                <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px", textTransform: "uppercase" }}>{txt(m?.t)}</b>
                                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(m?.note)}</span>
                              </div>
                              {list(m?.rows).map((r, $index) => (
                                <Fragment key={$index}>
                                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "12px", padding: "11px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                                    <span>
                                      <b style={{ display: "block", fontSize: "15px" }}>{txt(r?.a)}</b>
                                      <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(r?.b)}</span>
                                    </span>
                                    <span style={sx(`font-family:var(--f-label);font-size:11px;letter-spacing:0.08em;color:${r?.cc ?? ""};text-align:right;`)}>{txt(r?.c)}</span>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
                {v.tabSchedule ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", border: "1px solid #0E0E0F", width: "fit-content" }}>
                        {list(v.days).map((d, $index) => (
                          <Fragment key={$index}>
                            <button onClick={d?.pick} style={sx(`height:40px;padding:0 18px;border:0;border-right:1px solid #0E0E0F;background:${d?.bg ?? ""};color:${d?.fg ?? ""};font-size:12px;font-weight:700;letter-spacing:0.1em;cursor:pointer;`)}>
                              {txt(d?.t)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {list(v.schedule).map((s, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: "110px 4px minmax(0,1fr) auto", gap: "16px", padding: "14px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "13px" }}>{txt(s?.time)}–{txt(s?.end)}</span>
                            <span style={sx(`align-self:stretch;background:${s?.zc ?? ""};`)} />
                            <span>
                              <b style={{ display: "block", fontSize: "17px" }}>{txt(s?.title)}</b>
                              <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(s?.stage)}{" · "}{txt(s?.topic)}{" · "}{txt(s?.spk)}</span>
                            </span>
                            <span style={{ display: "flex", gap: "8px" }}>
                              <a href={withBase("/programme")} style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" }}>{txt(s?.cta)}</a>
                              <a href={withBase("/explore")} style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" }}>Navigate</a>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      {v.scheduleEmpty ? (
                        <>
                          <div style={{ border: "1px dashed #BDB9B0", padding: "32px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "23px" }}>Nothing saved for this day</b>
                            <span style={{ color: "#6B6A66" }}>Add sessions from the programme and they appear here with reminders.</span>
                            <a href={withBase("/programme")} style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>Browse programme →</a>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
                {v.tabMeetings ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {list(v.meetings).map((m, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0,1fr) auto", gap: "16px", padding: "16px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", lineHeight: "1.5" }}>
                              {txt(m?.when)}
                              <br />
                              <span style={{ color: "#6B6A66" }}>{txt(m?.room)}</span>
                            </span>
                            <span>
                              <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(m?.type)}</span>
                              <b style={{ display: "block", fontSize: "17px" }}>{txt(m?.with)}</b>
                              <span style={{ fontSize: "13px", color: "#3A3A3E" }}>{txt(m?.purpose)}</span>
                            </span>
                            <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                              <span style={sx(`font-family:var(--f-label);font-size:11px;letter-spacing:0.1em;border:1px solid ${m?.c ?? ""};color:${m?.c ?? ""};padding:5px 8px;`)}>
                                {txt(m?.icon)}{" "}{txt(m?.st)}
                              </span>
                              <a href={withBase("/connect#meetings")} style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" }}>Open</a>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.tabSaved ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "24px" }}>
                      {list(v.savedGroups).map((g, $index) => (
                        <Fragment key={$index}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #0E0E0F", paddingBottom: "8px" }}>
                              <b style={{ fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>{txt(g?.t)}</b>
                              <span style={{ fontFamily: "var(--f-label)", fontSize: "12px" }}>{txt(g?.n)}</span>
                            </div>
                            {list(g?.items).map((i, $index) => (
                              <Fragment key={$index}>
                                <div style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr) auto", gap: "12px", padding: "11px 0", borderBottom: "1px solid #E3E0D8", alignItems: "center" }}>
                                  <span style={sx(`width:10px;height:10px;background:${i?.zc ?? ""};`)} />
                                  <span>
                                    <b style={{ display: "block", fontSize: "15px" }}>{txt(i?.a)}</b>
                                    <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(i?.b)}</span>
                                  </span>
                                  <button onClick={i?.remove} aria-label="Remove" style={{ border: "0", background: "none", fontSize: "12px", fontWeight: "700", cursor: "pointer", color: "#6B6A66" }}>
                                    Remove
                                  </button>
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.tabRoutes ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: "24px", alignItems: "start" }}>
                      <div style={{ background: "#F6F4EF", padding: "16px" }}>
                        <HallPlan route={true} lit={v.routeLit} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {list(v.routes).map((r, $index) => (
                          <Fragment key={$index}>
                            <div style={{ padding: "14px 0", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#C2610B" }}>{txt(r?.min)}{" MIN WALK"}</span>
                              <b style={{ fontSize: "15px" }}>{txt(r?.from)}{" → "}{txt(r?.to)}</b>
                              <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(r?.via)}</span>
                            </div>
                          </Fragment>
                        ))}
                        <a href={withBase("/explore")} style={{ marginTop: "14px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" }}>Open full map →</a>
                      </div>
                    </div>
                  </>
                ) : null}
                {v.tabNotif ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {list(v.notifs).map((n, $index) => (
                        <Fragment key={$index}>
                          <div style={sx(`display:grid;grid-template-columns:8px 64px minmax(0,1fr) auto;gap:14px;padding:14px 0;border-bottom:1px solid #E3E0D8;align-items:center;background:${n?.bg ?? ""};`)}>
                            <span style={sx(`align-self:stretch;background:${n?.c ?? ""};`)} />
                            <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", color: "#6B6A66" }}>{txt(n?.time)}</span>
                            <span>
                              <span style={sx(`font-family:var(--f-label);font-size:10px;letter-spacing:0.14em;color:${n?.c ?? ""};`)}>{txt(n?.k)}</span>
                              <b style={{ display: "block", fontSize: "15px" }}>{txt(n?.t)}</b>
                              <span style={{ fontSize: "13px", color: "#3A3A3E" }}>{txt(n?.d)}</span>
                            </span>
                            <a href={n?.href} style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" }}>{txt(n?.cta)}</a>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.tabHelp ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <div>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>NEW REQUEST · CHOOSE A CATEGORY</span>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", borderLeft: "1px solid #E3E0D8", borderTop: "1px solid #E3E0D8", marginTop: "10px" }}>
                          {list(v.helpCats).map((h, $index) => (
                            <Fragment key={$index}>
                              <button onClick={h?.pick} style={sx(`height:52px;border:0;border-right:1px solid #E3E0D8;border-bottom:1px solid #E3E0D8;background:${h?.bg ?? ""};color:${h?.fg ?? ""};font-size:13px;font-weight:600;cursor:pointer;`)}>
                                {txt(h?.t)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>MY TICKETS</span>
                        {" "}
                        {list(v.tickets).map((t, $index) => (
                          <Fragment key={$index}>
                            <div style={{ padding: "16px 0", borderBottom: "1px solid #E3E0D8", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: "24px", alignItems: "center" }}>
                              <span>
                                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", color: "#6B6A66" }}>{txt(t?.id)}{" · "}{txt(t?.cat)}</span>
                                <b style={{ display: "block", fontSize: "16px" }}>{txt(t?.t)}</b>
                                <span style={{ fontSize: "13px", color: "#3A3A3E" }}>{txt(t?.last)}</span>
                              </span>
                              <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "3px" }}>
                                {list(t?.track).map((s, $index) => (
                                  <Fragment key={$index}>
                                    <li style={sx(`border-top:4px solid ${s?.c ?? ""};padding-top:6px;font-family:var(--f-label);font-size:9px;letter-spacing:0.06em;color:${s?.fg ?? ""};`)}>
                                      {txt(s?.t)}
                                    </li>
                                  </Fragment>
                                ))}
                              </ol>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
        <section id="plan" data-screen-label="Plan my day" style={{ scrollMarginTop: "110px", padding: "72px 28px", maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
            <h2 style={{ margin: "0", fontFamily: "var(--f-display)", fontStretch: "62%", fontWeight: "900", fontSize: "calc(clamp(44px,5vw,80px) * 0.72)", lineHeight: "0.88" }}>
              05 — Plan My Expo
            </h2>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {list(v.profileChips).map((c, $index) => (
                <Fragment key={$index}>
                  <span style={{ border: "1px solid #0E0E0F", padding: "7px 12px", fontSize: "13px", fontWeight: "600" }}>{txt(c)}</span>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: "32px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #0E0E0F", paddingBottom: "8px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "12px", letterSpacing: "0.14em" }}>RECOMMENDED ITINERARY · DAY 2</span>
                <span style={{ fontSize: "13px", color: "#6B6A66" }}>{txt(v.itinCount)}{" stops · "}{txt(v.itinWalk)}{" min walking"}</span>
              </div>
              <ol style={{ margin: "0", padding: "0", listStyle: "none" }}>
                {list(v.itin).map((i, $index) => (
                  <Fragment key={$index}>
                    <li onMouseEnter={i?.hover} style={sx(`display:grid;grid-template-columns:56px 4px minmax(0,1fr) auto;gap:14px;padding:12px 0;border-bottom:1px solid #E3E0D8;align-items:center;background:${i?.bg ?? ""};`)}>
                      <span style={{ fontFamily: "var(--f-label)", fontSize: "14px", fontWeight: "500" }}>{txt(i?.time)}</span>
                      <span style={sx(`align-self:stretch;background:${i?.zc ?? ""};`)} />
                      <span>
                        <span style={{ fontFamily: "var(--f-label)", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(i?.kindU)}</span>
                        <b style={{ display: "block", fontSize: "16px" }}>{txt(i?.title)}</b>
                        <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(i?.where)}</span>
                      </span>
                      <span style={{ display: "flex", gap: "2px" }}>
                        <button onClick={i?.up} aria-label="Move earlier" style={{ width: "32px", height: "32px", border: "1px solid #E3E0D8", background: "#fff", cursor: "pointer" }}>
                          ↑
                        </button>
                        <button onClick={i?.down} aria-label="Move later" style={{ width: "32px", height: "32px", border: "1px solid #E3E0D8", background: "#fff", cursor: "pointer" }}>
                          ↓
                        </button>
                        <button onClick={i?.remove} aria-label="Remove" style={{ width: "32px", height: "32px", border: "1px solid #E3E0D8", background: "#fff", cursor: "pointer" }}>
                          ✕
                        </button>
                      </span>
                    </li>
                  </Fragment>
                ))}
              </ol>
              <div style={{ marginTop: "20px" }}>
                <span style={{ fontFamily: "var(--f-label)", fontSize: "11px", letterSpacing: "0.16em", color: "#6B6A66" }}>ALSO MATCHES YOUR INTERESTS</span>
                <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}>
                  {list(v.suggest).map((s, $index) => (
                    <Fragment key={$index}>
                      <button onClick={s?.add} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr) auto", gap: "12px", alignItems: "center", padding: "12px 0", border: "0", borderBottom: "1px dashed #BDB9B0", background: "none", textAlign: "left", cursor: "pointer" }}>
                        <span style={sx(`width:10px;height:10px;background:${s?.zc ?? ""};`)} />
                        <span>
                          <b style={{ display: "block", fontSize: "15px", color: "#0E0E0F" }}>{txt(s?.title)}</b>
                          <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(s?.kind)}{" · "}{txt(s?.where)}</span>
                        </span>
                        <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "#C2610B" }}>+ Add</span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
                <button onClick={v.savePlan} style={{ height: "50px", padding: "0 24px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                  {txt(v.savePlanLabel)}
                </button>
                <button onClick={v.resetPlan} style={{ height: "50px", padding: "0 22px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "13px", fontWeight: "700", letterSpacing: "0.1em", cursor: "pointer" }}>
                  Reset to recommended
                </button>
              </div>
            </div>
            <div style={{ position: "sticky", top: "130px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "#F6F4EF", padding: "16px" }}>
                <HallPlan lit={v.planLit} selectedCluster={v.planFocus} />
              </div>
              <span style={{ fontSize: "13px", color: "#3A3A3E" }}>
                Highlighted clusters are on today's plan. Hover a stop to focus it on the hall plan. Routes are generated along the Sports Boulevard.
              </span>
            </div>
          </div>
        </section>
        {v.toast ? (
          <>
            <div role="status" style={{ position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: "120", background: "#0E0E0F", color: "#fff", padding: "14px 20px", fontSize: "14px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ color: "#F07C12", fontFamily: "var(--f-label)" }}>●</span>
              {txt(v.toastText)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default defineDC("Attend and My Expo", Component, render);
