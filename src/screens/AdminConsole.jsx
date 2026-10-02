'use client';
// Generated from design/site/Admin Console.dc.html by scripts/dc-to-jsx.mjs.
// Logic class and template are carried over from the design unchanged; links point at app routes.
import React, { Fragment } from 'react';
import { DCLogic, defineDC, txt, str, sx, val, chk, list, hostStyle } from '@/dc/runtime';
import '@/data/ise';
import HallPlan from './HallPlan';

/* global maplibregl */
class Component extends DCLogic {
  state = { mod: 'command', phase: 'live', vz: 'B', vc: 'SGM', qf: 'ALL', qs: {}, cmsType: 'Announcements', cmsSel: 0, edMode: 'edit', edStage: {}, edTitle: {}, tk: {}, toast: null };
  componentDidMount() { if (!window.ISE) this._t = setInterval(() => { if (window.ISE) { clearInterval(this._t); this.forceUpdate(); } }, 60); }
  componentWillUnmount() { clearInterval(this._t); clearTimeout(this._toast); }
  flash(t) { clearTimeout(this._toast); this.setState({ toast: t }); this._toast = setTimeout(() => this.setState({ toast: null }), 2400); }
  renderVals() {
    const D = window.ISE; const s = this.state;
    const sel = on => ({ bg: on ? '#0E0E0F' : '#fff', fg: on ? '#fff' : '#0E0E0F' });
    if (!D) return { nav: [], phases: [], kpis: [], regBars: [], occ: [], mtypes: [], outcomes: [], alerts: [], vzones: [], vclusters: [], qFilters: [], queue: [], cmsTypes: [], cmsItems: [], edFlow: [], ed: {}, toolbar: [], kanban: [], tbl: { cols: [], rows: [] } };
    const NAV = [['OVERVIEW', [['command', 'Command Dashboard'], ['reports', 'Reports']]], ['VENUE', [['venue', 'Hall · Zones · Clusters · Stalls']]], ['PARTICIPANTS', [['registration', 'Registration', '128'], ['accreditation', 'Accreditation', '34'], ['users', 'Users & Roles'], ['exhibitors', 'Exhibitors', '12'], ['products', 'Products', '9'], ['buyers', 'Buyers'], ['investors', 'Investors'], ['startups', 'Startups']]], ['BUSINESS', [['matchmaking', 'Matchmaking'], ['meetings', 'Meetings']]], ['PROGRAMME', [['programme', 'Programme & Sessions'], ['speakers', 'Speakers'], ['experiences', 'Experiences'], ['streams', 'Live Streams & Videos']]], ['DIRECTORY', [['states', 'States'], ['countries', 'Countries'], ['federations', 'Federations']]], ['CONTENT', [['cms', 'CMS · Pages · News · Announcements'], ['notifications', 'Notifications']]], ['SUPPORT', [['helpdesk', 'Helpdesk', '17'], ['settings', 'System Settings']]]];
    const label = Object.fromEntries(NAV.flatMap(g => g[1].map(([id, t]) => [id, [g[0], t]])));
    const ph = s.phase; const f = { pre: 0.62, live: 1, post: 1 }[ph];
    const n = v => Math.round(v * f).toLocaleString('en-IN');
    const cell = (v, o = {}) => ({ v: String(v), c: o.c || '#0E0E0F', w: o.w || 400, f: o.mono ? "'JetBrains Mono',monospace" : "'Instrument Sans',sans-serif", s: o.mono ? '12px' : '14px' });
    const G = '#0B6E4F', O = '#C2610B', R = '#9E1B22', K = '#6B6A66';
    const stc = t => ({ v: t, c: /APPROVED|PUBLISHED|ACTIVE|LIVE|CONFIRMED|ISSUED|ALLOCATED|COMPLETE|HELD/.test(t) ? G : /PENDING|REVIEW|QUERY|SCHEDULED|DRAFT|UPCOMING|PRINT/.test(t) ? O : /REJECT|BLOCK|FAIL|NO-SHOW/.test(t) ? R : K, w: 500, f: "'JetBrains Mono',monospace", s: '11px' });
    const T = (cols, rows) => ({ cols, rows, n: rows.length, grid: cols.map((_, i) => i === 0 ? 'minmax(0,1.5fr)' : 'minmax(0,1fr)').join(' ') });
    const TABLES = {
      reports: T(['REPORT', 'SCOPE', 'FORMAT', 'SCHEDULE', 'LAST RUN'], [['Daily footfall & registrations', 'All zones', 'PDF · XLSX', '07:00 daily', 'Today 07:00'], ['Exhibitor ROI summary', 'Per exhibitor', 'PDF', 'Post-event', '—'], ['Meetings & outcomes', 'Business Exchange', 'XLSX', 'Hourly (live)', '10:00'], ['Ministry briefing pack', 'Senior management', 'PDF', 'On demand', 'Yesterday']].map(r => [cell(r[0], { w: 600 }), cell(r[1]), cell(r[2], { mono: true }), cell(r[3]), cell(r[4], { mono: true, c: K })])),
      accreditation: T(['NAME', 'CATEGORY', 'ACCESS', 'PHOTO', 'STATUS'], [['Lukas Brandt', 'BUYER', 'Hall 2 · Exchange · HBL', 'OK', 'ISSUED'], ['Arvind Gill', 'EXHIBITOR', 'Hall 2', 'REJECTED · BLUR', 'PENDING PHOTO'], ['Aiko Tanaka', 'SPEAKER', 'All stages · Green room', 'OK', 'ISSUED'], ['Priya Nair', 'INVESTOR', 'Investor Lounge · Deal Rooms', 'OK', 'PRINT QUEUE'], ['Sample Press Agency', 'MEDIA', 'Media Centre', 'OK', 'PENDING REVIEW']].map(r => [cell(r[0], { w: 600 }), cell(r[1], { mono: true }), cell(r[2]), stc(r[3]), stc(r[4])])),
      users: T(['USER', 'ROLE', 'SCOPE', 'MFA', 'STATUS'], [['Kavya Iyer', 'Super Admin', 'All', 'ON', 'ACTIVE'], ['Neha Kapoor', 'Venue Ops', 'Venue · Stalls · Helpdesk', 'ON', 'ACTIVE'], ['Arif Khan', 'Content Editor', 'CMS · News', 'ON', 'ACTIVE'], ['Sample Ministry Viewer', 'Read-only', 'Command Dashboard', 'ON', 'ACTIVE'], ['Temp Registration Desk 4', 'Desk Agent', 'Registration', 'OFF', 'SUSPENDED']].map(r => [cell(r[0], { w: 600 }), cell(r[1]), cell(r[2]), cell(r[3], { mono: true }), stc(r[4])])),
      products: T(['PRODUCT', 'EXHIBITOR', 'CATEGORY', 'STALL', 'STATUS'], D.products.map((p, i) => [cell(p.name, { w: 600 }), cell(p.by), cell(p.cat + ' · ' + p.type), cell(p.stall, { mono: true }), stc(i === 1 ? 'IN REVIEW' : 'PUBLISHED')])),
      buyers: T(['BUYER', 'COUNTRY', 'LOOKING FOR', 'HOSTED', 'MEETINGS'], D.matches.filter(m => m.role !== 'Investor').map((m, i) => [cell(m.name, { w: 600 }), cell(m.country), cell(m.seeking), stc(i ? 'PENDING' : 'APPROVED'), cell(6 - i, { mono: true })])),
      investors: T(['INVESTOR', 'TYPE', 'THESIS', 'TICKET', 'DEAL ROOMS'], [['Kinetic Ventures', 'VC', 'SportsTech, manufacturing', '₹5–40 Cr', '2'], ['Sample Family Office', 'Family office', 'Infrastructure PPP', '₹50 Cr+', '1'], ['Gulf Sports Fund (demo)', 'Sovereign-linked', 'Events, tourism', '$10M+', '0']].map(r => [cell(r[0], { w: 600 }), cell(r[1]), cell(r[2]), cell(r[3], { mono: true }), cell(r[4], { mono: true })])),
      startups: T(['STARTUP', 'COUNTRY', 'TECH · SPORT', 'STAGE', 'PITCH'], D.startups.map(x => [cell(x.name, { w: 600 }), cell(x.country), cell(x.tech + ' · ' + x.sport), cell(x.stage), cell(x.pitch, { mono: true })])),
      exhibitors: null,
      matchmaking: T(['RULE / MODEL', 'WEIGHT', 'APPLIES TO', 'MATCHES', 'STATUS'], [['Product fit', '35%', 'All', '4,210', 'ACTIVE'], ['Market fit', '25%', 'All', '3,980', 'ACTIVE'], ['Buyer requirement', '25%', 'Buyers', '2,115', 'ACTIVE'], ['Geographic interest', '15%', 'International', '1,804', 'ACTIVE'], ['Exclude competitors', 'Filter', 'Exhibitors', '—', 'ACTIVE']].map(r => [cell(r[0], { w: 600 }), cell(r[1], { mono: true }), cell(r[2]), cell(r[3], { mono: true }), stc(r[4])])),
      meetings: T(['MEETING', 'TYPE', 'WHEN', 'ROOM', 'STATUS'], [['Apex Sports × Global Sports Retail', 'BUYER–SELLER', 'D2 11:00', 'Table 14', 'CONFIRMED'], ['Odisha Sports Dept. × ArenaBuild', 'B2G', 'D2 12:00', 'Deal Room 1', 'CONFIRMED'], ['Japan delegation × MYAS (sample)', 'G2G', 'D2 15:00', 'CEO Lounge', 'CONFIRMED'], ['RecovR × Kinetic Ventures', 'INVESTOR', 'D2 13:30', 'Deal Room 2', 'PENDING'], ['TurfLine × Northline', 'B2B', 'D1 16:00', 'Table 03', 'NO-SHOW']].map(r => [cell(r[0], { w: 600 }), cell(r[1], { mono: true }), cell(r[2], { mono: true }), cell(r[3]), stc(r[4])])),
      programme: T(['SESSION', 'DAY · TIME', 'STAGE', 'CAPACITY', 'STATUS'], D.sessions.map(x => [cell(x.title, { w: 600 }), cell('D' + x.day + ' · ' + x.time, { mono: true }), cell(x.stage), cell(x.cap, { mono: true }), stc(x.status === 'live' ? 'LIVE' : x.status === 'ondemand' ? 'HELD' : 'SCHEDULED')])),
      speakers: T(['SPEAKER', 'ORGANISATION', 'SESSIONS', 'TRAVEL', 'STATUS'], D.speakers.map((p, i) => [cell(p.name, { w: 600 }), cell(p.org), cell(D.sessions.filter(x => x.speakers.includes(p.id)).length, { mono: true }), cell(i % 3 ? 'Booked' : 'Pending'), stc(i % 4 ? 'CONFIRMED' : 'PENDING')])),
      experiences: T(['EXPERIENCE', 'LOCATION', 'DURATION', 'CAPACITY', 'BOOKED'], [['Archery Experience', 'Try Sport Arena', '20 min', '12', '88%'], ['Wheelchair Basketball', 'Try Sport Arena', '30 min', '10', '64%'], ['Football Reaction Challenge', 'Try Sport Arena', '10 min', '20', '97%'], ['Sprint Timing Experience', 'Try Sport Arena', '20 min', '8', '100%'], ['VR Training', 'Interactive Experiences', '15 min', '6', '100%']].map(r => [cell(r[0], { w: 600 }), cell(r[1]), cell(r[2], { mono: true }), cell(r[3], { mono: true }), cell(r[4], { mono: true, c: r[4] === '100%' ? R : '#0E0E0F' })])),
      streams: T(['STREAM / VIDEO', 'SOURCE', 'VIEWERS', 'CAPTIONS', 'STATUS'], D.sessions.slice(0, 8).map(x => [cell(x.title, { w: 600 }), cell(x.stage), cell(x.status === 'live' ? '2,412' : x.status === 'ondemand' ? '1,0' + x.cap % 90 : '—', { mono: true }), cell('EN · HI', { mono: true }), stc(x.status === 'live' ? 'LIVE' : x.status === 'ondemand' ? 'PUBLISHED' : 'SCHEDULED')])),
      states: T(['STATE / UT', 'PAVILION', 'IDENTITY', 'SPORTS', 'PROFILE'], D.states.map(x => [cell(x.name, { w: 600 }), cell(x.pav, { mono: true }), cell(x.identity), cell(x.sports.join(', ')), stc('PUBLISHED')])),
      countries: T(['COUNTRY', 'PAVILION', 'PROFILE', 'COMPANIES', 'DELEGATION'], D.countries.map(x => [cell(x.name, { w: 600 }), cell(x.pav, { mono: true }), cell(x.profile), cell(x.companies, { mono: true }), stc('CONFIRMED')])),
      federations: T(['FEDERATION (SAMPLE)', 'SPORT', 'LOCATION', 'REPRESENTATIVES', 'PROFILE'], ['Football', 'Hockey', 'Athletics', 'Archery', 'Badminton', 'Boxing'].map((x, i) => [cell('National ' + x + ' Federation', { w: 600 }), cell(x), cell('A-FED-P' + (i % 2 + 1), { mono: true }), cell(2 + i % 3, { mono: true }), stc(i === 4 ? 'DRAFT' : 'PUBLISHED')])),
      notifications: T(['NOTIFICATION', 'AUDIENCE', 'CHANNEL', 'SENT', 'OPEN RATE'], [['Live session starting: AI Coaching', 'Saved this session · 3,180', 'PUSH', 'D2 09:55', '61%'], ['Route changed: Zone B aisle 4', 'Zone B visitors · 1,940', 'PUSH', 'D2 08:40', '48%'], ['Transport update: Airport Line', 'All on-site · 14,820', 'PUSH · SMS', 'D2 08:15', '37%'], ['EMERGENCY TEST (drill)', 'All', 'PUSH · PA · SMS', 'D−1 16:00', '92%']].map(r => [cell(r[0], { w: 600, c: r[0].startsWith('EMERGENCY') ? R : '#0E0E0F' }), cell(r[1]), cell(r[2], { mono: true }), cell(r[3], { mono: true }), cell(r[4], { mono: true })])),
      settings: T(['SETTING', 'VALUE', 'SCOPE', 'CHANGED', 'BY'], [['Event phase', ph.toUpperCase(), 'Global', 'D2 07:00', 'System'], ['Registration', 'Open · auto-verify GST', 'Registration', '12 Mar', 'Kavya Iyer'], ['Meeting slot length', '30 min', 'Business Exchange', '02 Apr', 'Kavya Iyer'], ['Data residency', 'India (sample)', 'Global', '—', '—'], ['Reduced-motion default', 'Follow OS', 'Website · App', '20 Apr', 'Arif Khan']].map(r => [cell(r[0], { w: 600 }), cell(r[1]), cell(r[2]), cell(r[3], { mono: true }), cell(r[4])]))
    };
    const QUEUES = {
      registration: [['ISE27-V-20931', 'Lukas Brandt', 'Global Sports Retail GmbH · Germany', 'Buyer · hosted request'], ['ISE27-V-20944', 'Hannah Cole', 'Northline Distribution · UK', 'Buyer'], ['ISE27-V-20951', 'Rohan Das', 'Sample University', 'Visitor'], ['ISE27-V-20958', 'Sample Press Agency', 'Media', 'Media'], ['ISE27-V-20962', 'Priya Nair', 'Kinetic Ventures', 'Investor'], ['ISE27-V-20970', 'Dept. of Sports (sample)', 'State Government', 'Government']],
      exhibitors: D.exhibitors.slice(0, 7).map((e, i) => ['ISE27-EXH-04' + (18 + i), e.name, e.city, e.booth + ' · ' + e.cluster])
    };
    const isQueue = !!QUEUES[s.mod];
    const DEF = { registration: ['PENDING', 'PENDING', 'APPROVED', 'QUERY', 'PENDING', 'PENDING'], exhibitors: ['ALLOCATED', 'APPROVED', 'PENDING', 'QUERY', 'PENDING', 'APPROVED', 'REJECTED'] };
    const qst = (i) => s.qs[s.mod + i] || (DEF[s.mod] || [])[i] || 'PENDING';
    const QI = { PENDING: ['◷', O], QUERY: ['?', '#1F4E9E'], APPROVED: ['✓', G], REJECTED: ['✕', R], ALLOCATED: ['■', '#0E0E0F'] };
    const qrows = isQueue ? QUEUES[s.mod].map((r, i) => ({ i, id: r[0], name: r[1], org: r[2], type: r[3], when: (i + 1) * 7 + ' min ago', st: qst(i) })) : [];
    const setQ = (i, v, nm) => () => { this.setState({ qs: { ...s.qs, [s.mod + i]: v } }); this.flash(nm + ' → ' + v); };
    const CMS = { Pages: [['Plan Your Visit', 'Page · /plan-your-visit'], ['Getting to Yashobhoomi', 'Page · /getting-there'], ['FAQ', 'Page · 42 questions']], News: [['Japan confirms country pavilion (sample)', 'News · 3 May'], ['Startup Village applications close', 'News · 28 Apr']], Announcements: [['Startup Pitch Final moved to 11:45', 'Announcement · Day 3'], ['Airport Line frequency increased', 'Announcement · Transport']], Speakers: D.speakers.slice(0, 3).map(p => [p.name, 'Speaker · ' + p.org]), Exhibitors: D.exhibitors.slice(0, 3).map(e => [e.name, 'Exhibitor profile · ' + e.stall]), Venue: [['Hall 2 facilities', 'Venue information'], ['Accessibility', 'Venue information']], Travel: [['Metro: Airport Express Line', 'Travel information'], ['Partner hotels', 'Travel information']], Videos: [['The Future of AI Coaching', 'Video · Day 2']], FAQs: [['Do I need a visa?', 'FAQ · Travel'], ['Can I bring a contractor?', 'FAQ · Exhibitor']], Partners: [['Title partner (TBC)', 'Partner · placeholder']] };
    const ESTAGES = ['DRAFT', 'IN REVIEW', 'SCHEDULED', 'PUBLISHED'];
    const items = CMS[s.cmsType];
    const key = s.cmsType + s.cmsSel;
    const est = s.edStage[key] ?? (s.cmsSel === 0 ? 1 : 3);
    const cur = items[s.cmsSel] || items[0];
    const edT = s.edTitle[key] ?? cur[0];
    const BODY = { Announcements: 'The Startup Pitch Final on Day 3 now begins at 11:45 in the Innovation Arena. Saved sessions in My Expo and the mobile app have been updated automatically. Seating opens at 11:30.' };
    const TK = [['HD-10482', 'VISA', 'Invitation letter for business visa', 'Travel desk'], ['HD-10511', 'MEETING', 'Change table for Apex meeting', 'Exchange desk'], ['HD-10533', 'ACCOMMODATION', 'Partner hotel shuttle times', 'Travel desk'], ['HD-10377', 'STALL', 'Demo screen on back wall', 'Venue ops'], ['HD-10288', 'ACCREDITATION', 'Representative photo rejected', 'Accreditation'], ['HD-10540', 'TECHNICAL', 'App login loop on Android', 'Digital'], ['HD-10541', 'PROGRAMME', 'Speaker slides not uploaded', 'Programme'], ['HD-10301', 'EXHIBITOR', 'Change company logo', 'Content']];
    const KCOL = ['OPEN', 'ASSIGNED', 'IN PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'];
    const tkPos = (i) => s.tk[i] ?? [0, 3, 1, 2, 3, 0, 1, 5][i];
    const zoneN = { A: 10, B: 119, C: 94, D: 6 };
    return {
      nav: NAV.map(([t, items]) => ({ t, items: items.map(([id, tt, badge]) => ({ t: tt, badge: badge || '', bg: id === s.mod ? '#F6F4EF' : '#fff', fg: '#0E0E0F', w: id === s.mod ? 700 : 500, bl: id === s.mod ? '#F07C12' : 'transparent', pick: () => this.setState({ mod: id }) })) })),
      crumb: 'ADMIN / ' + label[s.mod][0] + ' / ' + label[s.mod][1].toUpperCase(), title: label[s.mod][1],
      phases: [['pre', 'PRE-EVENT'], ['live', 'LIVE · DAY 2'], ['post', 'POST-EVENT']].map(([id, t]) => ({ t, ...sel(id === ph), pick: () => this.setState({ phase: id }) })),
      pCommand: s.mod === 'command', pVenue: s.mod === 'venue', pQueue: isQueue, pCms: s.mod === 'cms', pHelp: s.mod === 'helpdesk', pTable: !!TABLES[s.mod],
      kpis: [['Registrations', n(48210), '+1,284 today'], ['International Delegates', n(6940), '14% of total'], ['Countries', ph === 'pre' ? '38' : '46', 'target 40'], ['Exhibitors', n(412), '229 stalls · 25 pav.'], ['Stall Occupancy', ph === 'pre' ? '81%' : '97%', ''], ['Buyers', n(1860), '420 hosted'], ['Investors', n(212), ''], ['Meetings', n(3120), ph === 'live' ? '612 today' : ''], ['B2B', n(2240), ''], ['B2G', n(610), ''], ['G2G', n(48), ''], ['Sessions', ph === 'post' ? '96' : ph === 'live' ? '34 / 96' : '96', ''], ['Live Viewers', ph === 'pre' ? '—' : '8,412', ph === 'live' ? 'now' : 'peak'], ['App Users', n(31200), ''], ['MoUs', ph === 'pre' ? '0' : ph === 'live' ? '9' : '27', ''], ['LoIs', ph === 'pre' ? '0' : ph === 'live' ? '44' : '118', ''], ['Leads', n(ph === 'pre' ? 0 : 21400), ''], ['Orders / Outcomes', ph === 'post' ? '₹612 Cr' : ph === 'live' ? '₹184 Cr' : '—', 'declared (demo)']].map(([k, v, d], i) => ({ k, v, d, dc: d.startsWith('+') ? G : K, c: i === 4 ? '#0B6E4F' : i >= 14 ? '#C2610B' : '#0E0E0F' })),
      regBars: [12, 16, 20, 22, 28, 34, 40, 46, 55, 63, 72, 80, 96, 100, 88].map((v, i) => ({ d: v * 0.82 + '%', i: v * 0.18 + '%', o: i })),
      occ: D.zones.map(z => ({ id: z.id, name: z.name, c: z.color, a: { A: 90, B: 84, C: 78, D: 100 }[z.id] * f + '%', r: (ph === 'pre' ? 14 : 10) + '%', pct: Math.min(100, Math.round(({ A: 90, B: 84, C: 78, D: 100 }[z.id] * f + 10))) + '% · ' + zoneN[z.id] + ' units' })),
      mtypes: [['B2B', 2240], ['Buyer–Seller', 1410], ['B2G', 610], ['Investor', 220], ['G2G', 48]].map(([t, v]) => ({ t, v: n(v), w: (v / 2240 * 100 * f) + '%' })),
      outcomes: [['MoUs signed', ph === 'post' ? 27 : ph === 'live' ? 9 : 0, '#F07C12'], ['LoIs', ph === 'post' ? 118 : ph === 'live' ? 44 : 0, '#fff'], ['Leads', n(ph === 'pre' ? 0 : 21400), '#fff'], ['Declared value', ph === 'post' ? '₹612 Cr' : ph === 'live' ? '₹184 Cr' : '—', '#F07C12']].map(([k, v, c]) => ({ k, v: String(v), c })),
      alerts: [['Try Sport Arena at capacity', 'Sprint Timing fully booked · open waitlist', R, 'experiences'], ['128 registrations awaiting verification', 'Oldest 3h 12m', O, 'registration'], ['Helpdesk: 17 open tickets', '4 over SLA', O, 'helpdesk'], ['Deal Room 2 overrun', 'Next meeting delayed 10 min', K, 'meetings']].map(([t, d, c, go]) => ({ t, d, c, go: () => this.setState({ mod: go }) })),
      venueZone: s.vz, venueCluster: s.vc, pickCluster: c => this.setState({ vc: c.id, vz: c.zone }),
      vzones: D.zones.map(z => ({ id: z.id, bg: z.id === s.vz ? z.color : '#fff', fg: z.id === s.vz ? '#fff' : z.color, pick: () => this.setState({ vz: z.id, vc: D.clusters.find(c => c.zone === z.id).id }) })),
      vclusters: D.clusters.filter(c => c.zone === s.vz).map(c => ({ ...c, occ: c.kind === 'stalls' ? Math.round(c.n * 0.8) + '/' + c.n : c.n + ' unit', bg: c.id === s.vc ? '#FFF3E6' : '#fff', pick: () => this.setState({ vc: c.id }) })),
      demo: () => this.flash('Action recorded (demo)'),
      qFilters: ['ALL', 'PENDING', 'QUERY', 'APPROVED', 'REJECTED'].map(t => ({ t, n: t === 'ALL' ? qrows.length : qrows.filter(r => r.st === t).length, ...sel(t === s.qf), pick: () => this.setState({ qf: t }) })),
      queue: qrows.filter(r => s.qf === 'ALL' || r.st === s.qf).map(r => ({ ...r, icon: QI[r.st][0], c: QI[r.st][1], approve: setQ(r.i, 'APPROVED', r.name), query: setQ(r.i, 'QUERY', r.name), reject: setQ(r.i, 'REJECTED', r.name) })),
      queueEmpty: isQueue && qrows.filter(r => s.qf === 'ALL' || r.st === s.qf).length === 0,
      cmsTypes: Object.keys(CMS).map(t => ({ t: t.toUpperCase(), ...sel(t === s.cmsType), pick: () => this.setState({ cmsType: t, cmsSel: 0 }) })),
      cmsItems: items.map(([t, meta], i) => { const e = s.edStage[s.cmsType + i] ?? (i === 0 ? 1 : 3); return { t: s.edTitle[s.cmsType + i] ?? t, meta, st: ESTAGES[e], c: e === 3 ? G : O, bg: i === s.cmsSel ? '#FFF3E6' : '#fff', pick: () => this.setState({ cmsSel: i }) }; }),
      edFlow: ESTAGES.map((t, i) => ({ t: (i < est ? '✓ ' : '') + t, bg: i === est ? '#0E0E0F' : i < est ? '#E3F1EB' : '#F6F4EF', fg: i === est ? '#fff' : i < est ? '#0B6E4F' : '#8A877F' })),
      ed: { t: edT, type: s.cmsType.toUpperCase(), body: BODY[s.cmsType] || 'Content for “' + edT + '”. Editors write once; the platform publishes to the website, the mobile app and on-site screens. (Sample copy.)' },
      setEdTitle: e => this.setState({ edTitle: { ...s.edTitle, [key]: e.target.value } }),
      toolbar: ['B', 'I', 'H2', 'Link', 'Image', 'Embed', 'हि'],
      edEditing: s.edMode === 'edit', edPreviewing: s.edMode === 'preview',
      edEdit: () => this.setState({ edMode: 'edit' }), edPreview: () => this.setState({ edMode: 'preview' }),
      edEditBg: s.edMode === 'edit' ? '#0E0E0F' : '#fff', edEditFg: s.edMode === 'edit' ? '#fff' : '#0E0E0F', edPrevBg: s.edMode === 'preview' ? '#0E0E0F' : '#fff', edPrevFg: s.edMode === 'preview' ? '#fff' : '#0E0E0F',
      edSave: () => this.flash('Draft saved'), edNext: ['SUBMIT FOR REVIEW', 'APPROVE & SCHEDULE', 'PUBLISH NOW', 'UNPUBLISH'][est],
      edAdvance: () => { const nx = est === 3 ? 0 : est + 1; this.setState({ edStage: { ...s.edStage, [key]: nx } }); this.flash('Status → ' + ESTAGES[nx]); },
      kanban: KCOL.map((t, ci) => { const its = TK.map((x, i) => ({ x, i })).filter(({ i }) => tkPos(i) === ci); return { t, n: its.length, c: ci >= 4 ? G : ci === 3 ? '#1F4E9E' : O, items: its.map(({ x, i }) => ({ id: x[0], cat: x[1], t: x[2], who: x[3], move: () => this.setState({ tk: { ...s.tk, [i]: Math.min(5, ci + 1) } }) })) }; }),
      tbl: TABLES[s.mod] || { cols: [], rows: [], n: 0, grid: '1fr' },
      toast: !!s.toast, toastText: s.toast || ''
    };
  }
}

function render(v) {
  return (
    <>
      <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "232px minmax(0,1fr)" }}>
        <aside style={{ background: "#fff", borderRight: "1px solid #0E0E0F", display: "flex", flexDirection: "column", position: "sticky", top: "0", height: "100vh", overflow: "auto" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#0E0E0F", padding: "18px 18px", borderBottom: "1px solid #0E0E0F", background: "#0E0E0F" }}>
            <span style={{ width: "20px", height: "20px", background: "#fff", display: "inline-block", position: "relative", overflow: "hidden" }}>
              <span style={{ position: "absolute", left: "-6px", top: "7px", width: "34px", height: "6px", background: "#F07C12", transform: "rotate(-28deg)" }} />
            </span>
            <span style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "900", fontSize: "20px", color: "#fff" }}>
              {"ISE "}
              <span style={{ color: "#F07C12" }}>2027</span>
              {" · ADMIN"}
            </span>
          </a>
          <nav aria-label="Admin" style={{ display: "flex", flexDirection: "column", padding: "6px 0 24px" }}>
            {list(v.nav).map((g, $index) => (
              <Fragment key={$index}>
                <span style={{ padding: "14px 18px 4px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#8A877F" }}>
                  {txt(g?.t)}
                </span>
                {list(g?.items).map((m, $index) => (
                  <Fragment key={$index}>
                    <button onClick={m?.pick} style={sx(`display:flex;justify-content:space-between;height:32px;align-items:center;padding:0 18px;border:0;border-left:3px solid ${m?.bl ?? ""};background:${m?.bg ?? ""};color:${m?.fg ?? ""};font-size:13px;font-weight:${m?.w ?? ""};text-align:left;cursor:pointer;`)}>
                      {txt(m?.t)}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#C2610B" }}>{txt(m?.badge)}</span>
                    </button>
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </nav>
        </aside>
        <main style={{ minWidth: "0", display: "flex", flexDirection: "column" }}>
          <header style={{ background: "#fff", borderBottom: "1px solid #0E0E0F", height: "60px", display: "flex", alignItems: "center", gap: "20px", padding: "0 28px" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6A66" }}>{txt(v.crumb)}</span>
            <span style={{ flex: "1" }} />
            <div role="tablist" style={{ display: "flex", border: "1px solid #0E0E0F" }}>
              {list(v.phases).map((p, $index) => (
                <Fragment key={$index}>
                  <button onClick={p?.pick} style={sx(`height:32px;padding:0 12px;border:0;border-right:1px solid #0E0E0F;background:${p?.bg ?? ""};color:${p?.fg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.1em;cursor:pointer;`)}>
                    {txt(p?.t)}
                  </button>
                </Fragment>
              ))}
            </div>
            <span style={{ fontSize: "13px" }}>
              {"Kavya Iyer · "}
              <b>Super Admin</b>
            </span>
          </header>
          <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "12px" }}>
              <h1 style={{ margin: "0", fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "900", fontSize: "48px", lineHeight: "0.88", textTransform: "uppercase" }}>
                {txt(v.title)}
              </h1>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.12em", color: "#6B6A66" }}>
                ALL FIGURES DEMO · LAST SYNC 10:18 IST
              </span>
            </div>
            {v.pCommand ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", background: "#fff", border: "1px solid #0E0E0F" }}>
                    {list(v.kpis).map((k, $index) => (
                      <Fragment key={$index}>
                        <div style={{ padding: "14px 16px", borderRight: "1px solid #E3E0D8", borderBottom: "1px solid #E3E0D8", display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(k?.k)}</span>
                          <span style={sx(`font-family:'Archivo',sans-serif;font-stretch:62%;font-weight:900;font-size:38px;line-height:0.95;color:${k?.c ?? ""};`)}>{txt(k?.v)}</span>
                          <span style={sx(`font-family:'JetBrains Mono',monospace;font-size:10px;color:${k?.dc ?? ""};`)}>{txt(k?.d)}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: "22px" }}>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <b style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>REGISTRATIONS · LAST 12 WEEKS + EVENT DAYS</b>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(15,1fr)", gap: "5px", alignItems: "end", height: "180px", borderBottom: "1px solid #0E0E0F" }}>
                        {list(v.regBars).map((b, $index) => (
                          <Fragment key={$index}>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                              <div style={sx(`height:${b?.i ?? ""};background:#F07C12;`)} />
                              <div style={sx(`height:${b?.d ?? ""};background:#0E0E0F;`)} />
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "18px", fontSize: "12px" }}>
                        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ width: "12px", height: "12px", background: "#0E0E0F" }} />
                          Domestic
                        </span>
                        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ width: "12px", height: "12px", background: "#F07C12" }} />
                          International
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <b style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>STALL OCCUPANCY BY ZONE</b>
                      {list(v.occ).map((o, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                              <span>
                                <b>{"Zone "}{txt(o?.id)}</b>
                                {" · "}{txt(o?.name)}
                              </span>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{txt(o?.pct)}</span>
                            </div>
                            <div style={{ display: "flex", height: "14px", background: "#F1EFEA" }}>
                              <span style={sx(`width:${o?.a ?? ""};background:${o?.c ?? ""};`)} />
                              <span style={sx(`width:${o?.r ?? ""};background:repeating-linear-gradient(45deg,${o?.c ?? ""} 0 2px,#fff 2px 5px);`)} />
                            </div>
                          </div>
                        </Fragment>
                      ))}
                      <span style={{ fontSize: "12px", color: "#6B6A66" }}>Solid = allocated · hatched = reserved / in review</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "22px" }}>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <b style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>MEETINGS BY TYPE</b>
                      {list(v.mtypes).map((m, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 54px", gap: "10px", alignItems: "center", fontSize: "13px" }}>
                            <span>{txt(m?.t)}</span>
                            <span style={{ height: "12px", background: "#F1EFEA" }}>
                              <span style={sx(`display:block;height:12px;width:${m?.w ?? ""};background:#0E0E0F;`)} />
                            </span>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", textAlign: "right" }}>{txt(m?.v)}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ background: "#0E0E0F", color: "#fff", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <b style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>BUSINESS OUTCOMES</b>
                      {list(v.outcomes).map((o, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid #2A2A2D", paddingTop: "8px" }}>
                            <span style={{ fontSize: "14px", color: "#BDB9B0" }}>{txt(o?.k)}</span>
                            <span style={sx(`font-family:'Archivo',sans-serif;font-stretch:62%;font-weight:900;font-size:34px;color:${o?.c ?? ""};`)}>{txt(o?.v)}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <b style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "800", fontSize: "22px" }}>ALERTS</b>
                      {list(v.alerts).map((a, $index) => (
                        <Fragment key={$index}>
                          <button onClick={a?.go} style={{ display: "grid", gridTemplateColumns: "8px 1fr", gap: "10px", border: "0", borderBottom: "1px solid #E3E0D8", background: "none", padding: "8px 0", textAlign: "left", cursor: "pointer" }}>
                            <span style={sx(`background:${a?.c ?? ""};`)} />
                            <span>
                              <b style={{ display: "block", fontSize: "14px", color: "#0E0E0F" }}>{txt(a?.t)}</b>
                              <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(a?.d)}</span>
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.pVenue ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "22px", alignItems: "start" }}>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", padding: "16px" }}>
                    <HallPlan mode={"inventory"} activeZone={v.venueZone} selectedCluster={v.venueCluster} onCluster={v.pickCluster} />
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #0E0E0F" }}>
                      {list(v.vzones).map((z, $index) => (
                        <Fragment key={$index}>
                          <button onClick={z?.pick} style={sx(`flex:1;height:42px;border:0;border-right:1px solid #0E0E0F;background:${z?.bg ?? ""};color:${z?.fg ?? ""};font-family:'Archivo',sans-serif;font-stretch:62%;font-weight:800;font-size:18px;cursor:pointer;`)}>
                            {"ZONE "}{txt(z?.id)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {list(v.vclusters).map((c, $index) => (
                      <Fragment key={$index}>
                        <button onClick={c?.pick} style={sx(`display:grid;grid-template-columns:minmax(0,1fr) 70px 90px;gap:10px;padding:12px 16px;border:0;border-bottom:1px solid #E3E0D8;background:${c?.bg ?? ""};text-align:left;cursor:pointer;align-items:center;`)}>
                          <span>
                            <b style={{ display: "block", fontSize: "14px", color: "#0E0E0F" }}>{txt(c?.name)}</b>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#6B6A66" }}>{txt(c?.id)}{" · "}{txt(c?.meta)}</span>
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px" }}>{txt(c?.occ)}</span>
                          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "#C2610B" }}>EDIT</span>
                        </button>
                      </Fragment>
                    ))}
                    <div style={{ padding: "14px 16px", display: "flex", gap: "8px" }}>
                      <button onClick={v.demo} style={{ height: "40px", padding: "0 14px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                        + ADD STALL
                      </button>
                      <button onClick={v.demo} style={{ height: "40px", padding: "0 14px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                        BLOCK SELECTED
                      </button>
                      <button onClick={v.demo} style={{ height: "40px", padding: "0 14px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                        EXPORT FLOOR PLAN
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.pQueue ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", gap: "0", border: "1px solid #0E0E0F", background: "#fff", width: "fit-content" }}>
                    {list(v.qFilters).map((f, $index) => (
                      <Fragment key={$index}>
                        <button onClick={f?.pick} style={sx(`height:38px;padding:0 14px;border:0;border-right:1px solid #0E0E0F;background:${f?.bg ?? ""};color:${f?.fg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;`)}>
                          {txt(f?.t)}{" · "}{txt(f?.n)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F" }}>
                    {list(v.queue).map((r, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "110px minmax(0,1.3fr) minmax(0,1fr) 120px 120px auto", gap: "14px", padding: "12px 16px", borderBottom: "1px solid #E3E0D8", alignItems: "center", fontSize: "14px" }}>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px" }}>{txt(r?.id)}</span>
                          <span>
                            <b style={{ display: "block" }}>{txt(r?.name)}</b>
                            <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(r?.org)}</span>
                          </span>
                          <span style={{ color: "#3A3A3E" }}>{txt(r?.type)}</span>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#6B6A66" }}>{txt(r?.when)}</span>
                          <span style={sx(`font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;color:${r?.c ?? ""};border:1px solid ${r?.c ?? ""};padding:4px 6px;text-align:center;`)}>
                            {txt(r?.icon)}{" "}{txt(r?.st)}
                          </span>
                          <span style={{ display: "flex", gap: "4px" }}>
                            <button onClick={r?.approve} style={{ height: "32px", padding: "0 10px", border: "0", background: "#0B6E4F", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                              APPROVE
                            </button>
                            <button onClick={r?.query} style={{ height: "32px", padding: "0 10px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                              QUERY
                            </button>
                            <button onClick={r?.reject} style={{ height: "32px", padding: "0 10px", border: "1px solid #9E1B22", background: "#fff", color: "#9E1B22", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                              REJECT
                            </button>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {" "}
                    {v.queueEmpty ? (
                      <>
                        <div style={{ padding: "32px", color: "#6B6A66" }}>Queue clear. Nothing waiting in this status.</div>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {v.pCms ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "22px", alignItems: "start" }}>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0", borderBottom: "1px solid #0E0E0F" }}>
                      {list(v.cmsTypes).map((t, $index) => (
                        <Fragment key={$index}>
                          <button onClick={t?.pick} style={sx(`height:36px;padding:0 12px;border:0;border-right:1px solid #E3E0D8;background:${t?.bg ?? ""};color:${t?.fg ?? ""};font-size:11px;font-weight:700;letter-spacing:0.06em;cursor:pointer;`)}>
                            {txt(t?.t)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {list(v.cmsItems).map((i, $index) => (
                      <Fragment key={$index}>
                        <button onClick={i?.pick} style={sx(`width:100%;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:12px 16px;border:0;border-bottom:1px solid #E3E0D8;background:${i?.bg ?? ""};text-align:left;cursor:pointer;align-items:center;`)}>
                          <span>
                            <b style={{ display: "block", fontSize: "14px", color: "#0E0E0F" }}>{txt(i?.t)}</b>
                            <span style={{ fontSize: "12px", color: "#6B6A66" }}>{txt(i?.meta)}</span>
                          </span>
                          <span style={sx(`font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;color:${i?.c ?? ""};`)}>{txt(i?.st)}</span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #0E0E0F", gap: "10px", flexWrap: "wrap" }}>
                      <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", gap: "0" }}>
                        {list(v.edFlow).map((f, $index) => (
                          <Fragment key={$index}>
                            <li style={sx(`padding:6px 10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;background:${f?.bg ?? ""};color:${f?.fg ?? ""};`)}>
                              {txt(f?.t)}
                            </li>
                          </Fragment>
                        ))}
                      </ol>
                      <div style={{ display: "flex", border: "1px solid #0E0E0F" }}>
                        <button onClick={v.edEdit} style={sx(`height:30px;padding:0 10px;border:0;border-right:1px solid #0E0E0F;background:${v.edEditBg ?? ""};color:${v.edEditFg ?? ""};font-size:11px;font-weight:700;cursor:pointer;`)}>
                          EDIT
                        </button>
                        <button onClick={v.edPreview} style={sx(`height:30px;padding:0 10px;border:0;background:${v.edPrevBg ?? ""};color:${v.edPrevFg ?? ""};font-size:11px;font-weight:700;cursor:pointer;`)}>
                          PREVIEW
                        </button>
                      </div>
                    </div>
                    {v.edEditing ? (
                      <>
                        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "600" }}>Title</span>
                            <input value={val(v.ed?.t)} onChange={v.setEdTitle} style={{ height: "44px", border: "1px solid #0E0E0F", padding: "0 12px", fontSize: "16px", fontWeight: "600" }} />
                          </label>
                          <div style={{ display: "flex", gap: "4px", border: "1px solid #E3E0D8", padding: "6px" }}>
                            {list(v.toolbar).map((b, $index) => (
                              <Fragment key={$index}>
                                <span style={{ minWidth: "30px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E3E0D8", fontSize: "12px", fontWeight: "700", padding: "0 6px" }}>
                                  {txt(b)}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                          <textarea style={{ minHeight: "160px", border: "1px solid #0E0E0F", padding: "12px", fontSize: "15px", lineHeight: "1.55" }} key={str(v.ed?.body)} defaultValue={str(v.ed?.body)} />
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: "600" }}>Language</span>
                              <select style={{ height: "40px", border: "1px solid #0E0E0F", background: "#fff" }}>
                                <option>English</option>
                                <option>हिन्दी</option>
                              </select>
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: "600" }}>Audience</span>
                              <select style={{ height: "40px", border: "1px solid #0E0E0F", background: "#fff" }}>
                                <option>All participants</option>
                                <option>Exhibitors</option>
                                <option>Buyers</option>
                              </select>
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: "600" }}>Publish at</span>
                              <input defaultValue={"Day 2 · 10:05"} style={{ height: "40px", border: "1px solid #0E0E0F", padding: "0 10px" }} />
                            </label>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.edPreviewing ? (
                      <>
                        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "12px", background: "#FBFAF7" }}>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.14em", color: "#C2610B" }}>{txt(v.ed?.type)}{" · PREVIEW"}</span>
                          <span style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "900", fontSize: "44px", lineHeight: "0.9", textTransform: "uppercase" }}>
                            {txt(v.ed?.t)}
                          </span>
                          <span style={{ fontSize: "16px", lineHeight: "1.55" }}>{txt(v.ed?.body)}</span>
                        </div>
                      </>
                    ) : null}
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", padding: "14px 16px", borderTop: "1px solid #E3E0D8" }}>
                      <button onClick={v.edSave} style={{ height: "42px", padding: "0 16px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                        SAVE DRAFT
                      </button>
                      <button onClick={v.edAdvance} style={{ height: "42px", padding: "0 18px", border: "0", background: "#F07C12", color: "#0E0E0F", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                        {txt(v.edNext)}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {v.pHelp ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "10px" }}>
                  {list(v.kanban).map((col, $index) => (
                    <Fragment key={$index}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={sx(`display:flex;justify-content:space-between;border-top:4px solid ${col?.c ?? ""};padding-top:8px;`)}>
                          <b style={{ fontSize: "12px", letterSpacing: "0.08em" }}>{txt(col?.t)}</b>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px" }}>{txt(col?.n)}</span>
                        </div>
                        {list(col?.items).map((t, $index) => (
                          <Fragment key={$index}>
                            <button onClick={t?.move} title="Move to next status" style={{ background: "#fff", border: "1px solid #E3E0D8", padding: "10px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#6B6A66" }}>{txt(t?.id)}{" · "}{txt(t?.cat)}</span>
                              <b style={{ fontSize: "13px", lineHeight: "1.3", color: "#0E0E0F" }}>{txt(t?.t)}</b>
                              <span style={{ fontSize: "11px", color: "#6B6A66" }}>{txt(t?.who)}</span>
                              <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", color: "#C2610B" }}>MOVE →</span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
            {v.pTable ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input placeholder={`Filter ${v.title ?? ""}…`} style={{ height: "40px", border: "1px solid #0E0E0F", padding: "0 12px", fontSize: "14px", width: "280px", background: "#fff" }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#6B6A66" }}>{txt(v.tbl?.n)}{" RECORDS"}</span>
                    <span style={{ flex: "1" }} />
                    <button onClick={v.demo} style={{ height: "40px", padding: "0 14px", border: "0", background: "#0E0E0F", color: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                      + NEW
                    </button>
                    <button onClick={v.demo} style={{ height: "40px", padding: "0 14px", border: "1px solid #0E0E0F", background: "#fff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", cursor: "pointer" }}>
                      EXPORT
                    </button>
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #0E0E0F", overflowX: "auto" }}>
                    <div role="table" style={{ minWidth: "760px" }}>
                      <div role="row" style={sx(`display:grid;grid-template-columns:${v.tbl?.grid ?? ""};border-bottom:1px solid #0E0E0F;`)}>
                        {list(v.tbl?.cols).map((c, $index) => (
                          <Fragment key={$index}>
                            <span role="columnheader" style={{ padding: "11px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: "0.14em", color: "#6B6A66" }}>
                              {txt(c)}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      {list(v.tbl?.rows).map((r, $index) => (
                        <Fragment key={$index}>
                          <div role="row" style={sx(`display:grid;grid-template-columns:${v.tbl?.grid ?? ""};border-bottom:1px solid #E3E0D8;align-items:center;`)}>
                            {list(r).map((c, $index) => (
                              <Fragment key={$index}>
                                <span role="cell" style={sx(`padding:11px 16px;font-size:${c?.s ?? ""};font-family:${c?.f ?? ""};color:${c?.c ?? ""};font-weight:${c?.w ?? ""};`)}>
                                  {txt(c?.v)}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
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

export default defineDC("Admin Console", Component, render);
