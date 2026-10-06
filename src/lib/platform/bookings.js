// Meetings portal: the vocabulary shared by /meetings, Admin → Meetings, the companion app and
// the Connect overview (tables: supabase/migrations/0004_bookings.sql).

export const KINDS = [
  { id: 'meeting', label: 'One-to-one meeting', short: 'Meeting', text: 'Meet a company, buyer, investor or delegation.' },
  { id: 'conference', label: 'Conference seat', short: 'Conference', text: 'Reserve a seat at a keynote or panel.' },
  { id: 'discussion', label: 'Open discussion', short: 'Discussion', text: 'Join a roundtable or open floor.' },
  { id: 'room', label: 'Room booking', short: 'Room', text: 'Book a deal room, lounge or B2B table.' },
];
export const KIND = Object.fromEntries(KINDS.map((k) => [k.id, k]));

export const TYPES = ['B2B', 'B2G', 'G2G', 'Buyer–Seller', 'Investor', 'Federation', 'CEO / Strategic'];
export const TYPE_INFO = {
  B2B: 'Company to company',
  B2G: 'Company to government',
  G2G: 'Government to government',
  'Buyer–Seller': 'Sourcing and orders',
  Investor: 'Funding and partnerships',
  Federation: 'Federations and bodies',
  'CEO / Strategic': 'Leadership, invite only',
};
export const TYPE_COLOURS = {
  B2B: '#0A62BF',
  B2G: '#9E1B22',
  G2G: '#5B3A9E',
  'Buyer–Seller': '#F07C12',
  Investor: '#00803F',
  Federation: '#B54708',
  'CEO / Strategic': '#0E0E0F',
  conference: '#3D8BFF',
  discussion: '#2FC27A',
  room: '#8A8780',
};
export const colourOf = (b) => TYPE_COLOURS[b.kind === 'meeting' ? b.type : b.kind] || '#8A8780';
export const labelOf = (b) => (b.kind === 'meeting' ? b.type : KIND[b.kind]?.short || b.kind);

// Expo days (Yashobhoomi, 15–17 October 2027) and opening hours.
export const DAYS = [
  { n: 1, label: 'Day 1', date: 'Fri 15 Oct' },
  { n: 2, label: 'Day 2', date: 'Sat 16 Oct' },
  { n: 3, label: 'Day 3', date: 'Sun 17 Oct' },
];
export const dayLabel = (n) => (n ? DAYS[n - 1]?.label + ' · ' + DAYS[n - 1]?.date : '');
export const TIMES = [];
for (let m = 9 * 60; m <= 18 * 60; m += 15) TIMES.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'));
export const DURATIONS = [15, 30, 45, 60, 90, 120];

// Where business happens (Zone D of Hall 2, plus the stages for sessions).
export const VENUES = [
  { id: 'B2B Meeting Zone', units: 'Table', count: 40, kind: 'meeting' },
  { id: 'MoU / Deal Rooms', units: 'Deal Room', count: 6, kind: 'room' },
  { id: 'Hosted Buyer Lounge', kind: 'room' },
  { id: 'Investor Lounge', kind: 'room' },
  { id: 'Federation Lounge', kind: 'room' },
  { id: 'CEO Lounge', kind: 'room' },
  { id: 'Networking Café', kind: 'discussion' },
  { id: 'Business Exchange Stage', kind: 'conference' },
  { id: 'Innovation Arena', kind: 'conference' },
  { id: 'Plenary Hall', kind: 'conference' },
];
export const ROOMS = [
  ...Array.from({ length: 6 }, (_, i) => 'Deal Room ' + (i + 1)),
  'Hosted Buyer Lounge',
  'Investor Lounge',
  'Federation Lounge',
  'CEO Lounge',
  'B2B Meeting Zone table',
];
// The venue a room request or a meeting type naturally lands in.
export const defaultVenue = (b) => {
  if (b.kind === 'room') return /^Deal Room/.test(b.room || '') ? 'MoU / Deal Rooms' : /table/i.test(b.room || '') ? 'B2B Meeting Zone' : b.room;
  if (b.kind !== 'meeting') return '';
  return { Investor: 'Investor Lounge', Federation: 'Federation Lounge', 'CEO / Strategic': 'CEO Lounge', G2G: 'MoU / Deal Rooms', 'Buyer–Seller': 'Hosted Buyer Lounge' }[b.type] || 'B2B Meeting Zone';
};

export const STATUS_TEXT = {
  requested: 'Requested',
  accepted: 'Accepted · awaiting organisers',
  declined: 'Declined',
  approved: 'Confirmed',
  rejected: 'Not approved',
  cancelled: 'Cancelled',
};

// Effective schedule: what the organisers assigned, otherwise what was asked for.
export const whenOf = (b, s) => ({
  day: b.assigned_day || b.pref_day || s?.day || null,
  time: (b.assigned_time || b.pref_time || s?.starts || '').slice(0, 5),
  venue: b.assigned_venue || s?.venue || (b.kind === 'room' ? b.room : '') || '',
  table: b.assigned_table || '',
  mins: b.duration_min || (s ? minutes(s.ends) - minutes(s.starts) : 30),
});
export const minutes = (t) => {
  const [h, m] = String(t || '0:0').split(':').map(Number);
  return h * 60 + (m || 0);
};
export const fmtTime = (t) => (t ? String(t).slice(0, 5) : '');

// Approved bookings that overlap `b` (if it were held at `when`) for the same person, company,
// table or room. Times are free choice, so the organisers see these before approving.
export function clashes(b, when, all, sessions = {}) {
  if (!when.day || !when.time) return [];
  const start = minutes(when.time);
  const end = start + (when.mins || 30);
  const parties = (x) =>
    [
      x.requester_id && ['u:' + x.requester_id, x.requester_name || 'This person'],
      x.requester_org && ['o:' + x.requester_org.toLowerCase(), x.requester_org],
      x.counterpart_org && ['o:' + x.counterpart_org.toLowerCase(), x.counterpart_org],
    ].filter(Boolean);
  const mine = parties(b);
  const spot = (w, k) => (w.venue && (w.table || k === 'room') ? (w.venue + '|' + (w.table || '')).toLowerCase() : '');
  const place = spot(when, b.kind);
  const out = [];
  for (const o of all) {
    if (o.id === b.id || o.status !== 'approved') continue;
    if (o.session_id && o.session_id === b.session_id) continue; // same session, other seats
    const w = whenOf(o, sessions[o.session_id]);
    if (w.day !== when.day || !w.time) continue;
    const s2 = minutes(w.time);
    if (!(s2 < end && start < s2 + (w.mins || 30))) continue;
    const theirs = parties(o).map((p) => p[0]);
    const who = mine.find((p) => theirs.includes(p[0]));
    const where = place && place === spot(w, o.kind);
    if (who || where) out.push({ booking: o, when: w, reason: where ? `${w.venue}${w.table ? ' · ' + w.table : ''} is already taken` : `${who[1]} already has a confirmed booking` });
  }
  return out;
}

export const BOOKING_COLUMNS =
  'id,kind,type,title,purpose,requester_id,requester_name,requester_org,requester_country,requester_role,requester_email,counterpart_exhibitor_id,counterpart_name,counterpart_org,counterpart_country,session_id,room,pref_day,pref_time,duration_min,party_size,status,counterpart_note,admin_note,assigned_day,assigned_time,assigned_venue,assigned_table,answered_by,answered_at,approved_by,approved_at,sample,created_at,updated_at';
