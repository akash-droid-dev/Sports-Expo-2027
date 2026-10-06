// Builds supabase/seed_bookings.sql: sample meetings, conference seats, open-discussion places and
// room bookings for the Meetings portal, all marked `sample` (Admin → Meetings → "Remove sample
// data" deletes them). Companies come from the website catalogue (src/data/ise.js).
// Usage: node scripts/platform/make-booking-seed.cjs
const fs = require('fs');
global.window = {};
require('../../src/data/ise.js');
const D = window.ISE;
const q = (v) => (v === null || v === undefined ? 'null' : "'" + String(v).replace(/'/g, "''") + "'");

// Demo people asking for meetings (names and companies are samples).
const P = {
  lukas: ['Lukas Brandt', 'Global Sports Retail GmbH', 'Germany', 'Buyer'],
  emma: ['Emma Hartley', 'Northline Distribution Ltd', 'United Kingdom', 'Distributor'],
  omar: ['Omar Al Mansoori', 'Gulf Arena Supplies', 'UAE', 'Buyer'],
  priya: ['Priya Nair', 'Kinetic Ventures', 'India', 'Investor'],
  sarah: ['Sarah Okafor', 'Stadia Partners UK', 'United Kingdom', 'Investor'],
  kabir: ['Kabir Sethi', 'Sample National Federation', 'India', 'Federation'],
  hans: ['Hans Vogel', 'Bundesliga Academy Partners (sample)', 'Germany', 'Federation'],
  kenji: ['Kenji Watanabe', 'Japan Sports Agency delegation (sample)', 'Japan', 'Government'],
  anita: ['Anita Rao', 'Sports Authority of Gujarat (sample)', 'India', 'Government'],
  ravi: ['Ravi Kulkarni', 'Odisha Sports Department (sample)', 'India', 'Government'],
  mia: ['Mia Collins', 'Pacific Sport Holdings (sample)', 'Australia', 'CEO'],
  jake: ['Jake Miller', 'FanFirst Media (sample)', 'United States', 'Buyer'],
};
const ex = (id) => {
  const e = D.exhibitors.find((x) => x.id === id);
  if (!e) throw new Error('no exhibitor ' + id);
  return [e.name, e.country];
};
const st = (name) => {
  const s = D.startups.find((x) => x.name === name);
  return [s.name, s.country];
};
const MYAS = ['Ministry of Youth Affairs & Sports (sample)', 'India'];
const FED = ['Sample National Federation', 'India'];
const JSA = ['Japan Sports Agency delegation (sample)', 'Japan'];

// [type, who, [org, country], day, time, minutes, status, venue, table, purpose, note]
const meetings = [
  ['B2B', 'lukas', ex('apex'), 1, '10:00', 30, 'approved', 'B2B Meeting Zone', 'Table 4', 'Match footballs for the 2028 retail season'],
  ['Buyer–Seller', 'lukas', ex('stride'), 1, '11:00', 45, 'approved', 'Hosted Buyer Lounge', '', 'Private-label spike plates, 20k pairs'],
  ['Buyer–Seller', 'omar', ex('apex'), 1, '10:15', 30, 'accepted', '', '', 'Goal systems and nets for Gulf academies'],
  ['B2B', 'emma', ex('origin'), 1, '12:00', 30, 'approved', 'B2B Meeting Zone', 'Table 11', 'Recycled teamwear for UK grassroots clubs'],
  ['Investor', 'priya', ex('motion'), 2, '11:30', 45, 'approved', 'Investor Lounge', '', 'Series A follow-on'],
  ['Investor', 'priya', st('KheloLens'), 1, '16:45', 30, 'approved', 'Investor Lounge', '', 'Seed round after the pitch'],
  ['Investor', 'sarah', ex('arena'), 2, '14:00', 60, 'approved', 'MoU / Deal Rooms', 'Deal Room 2', 'Co-investment in modular stands'],
  ['B2G', 'anita', ex('arena'), 1, '15:00', 45, 'approved', 'MoU / Deal Rooms', 'Deal Room 1', 'District stadium upgrades'],
  ['G2G', 'kenji', MYAS, 1, '12:30', 60, 'approved', 'MoU / Deal Rooms', 'Deal Room 3', 'Sports science exchange MoU'],
  ['Federation', 'kabir', ex('velocity'), 2, '10:00', 30, 'approved', 'Federation Lounge', '', 'Testing protocol for national camps'],
  ['Federation', 'hans', FED, 3, '10:30', 45, 'approved', 'Federation Lounge', '', 'Coach education partnership'],
  ['CEO / Strategic', 'mia', ex('lumen'), 2, '16:00', 30, 'approved', 'CEO Lounge', '', 'Lighting for a stadium portfolio'],
  ['B2B', 'jake', ex('matrix'), 2, '12:00', 30, 'approved', 'B2B Meeting Zone', 'Table 18', 'Data feeds for fan apps'],
  ['Buyer–Seller', 'omar', ex('turf'), 2, '11:00', 30, 'approved', 'Hosted Buyer Lounge', '', 'Hockey turf for two venues'],
  ['B2G', 'ravi', ex('turf'), 3, '11:00', 45, 'approved', 'MoU / Deal Rooms', 'Deal Room 4', 'Climate-ready hockey pitches'],
  ['B2B', 'emma', ex('willow'), 3, '12:00', 30, 'accepted', '', '', 'Distribution of English willow bats'],
  ['Investor', 'priya', st('RecovR'), 3, '14:30', 30, 'requested', '', '', 'Pre-Series A conversation'],
  ['Buyer–Seller', 'jake', ex('hayate'), 2, '15:00', 30, 'requested', '', '', 'Timing systems for a US college league'],
  ['G2G', 'ravi', JSA, 2, '14:30', 60, 'accepted', '', '', 'Hockey high-performance exchange'],
  ['B2B', 'lukas', ex('lumen'), 3, '10:00', 30, 'declined', '', '', 'Retail display lighting', 'Fully booked on Day 3. Day 2 afternoon works.'],
  ['CEO / Strategic', 'sarah', ex('hayate'), 1, '17:00', 30, 'rejected', '', '', 'Venue technology roadmap', 'The CEO Lounge closes at 16:30 on Day 1. Please pick another slot.'],
  ['B2B', 'jake', ex('motion'), 1, '11:00', 30, 'cancelled', '', '', 'Broadcast overlays'],
  ['Investor', 'sarah', st('Turfsense'), 3, '11:45', 30, 'approved', 'Investor Lounge', '', 'Series A, UK expansion'],
  ['B2B', 'hans', ex('apex'), 2, '10:30', 30, 'approved', 'B2B Meeting Zone', 'Table 4', 'Academy kit bundles'],
  ['B2B', 'mia', ex('flex'), 1, '10:00', 30, 'accepted', '', '', 'Retractable seating for an arena'],
];
// [kind, title, topic, host, day, starts, ends, venue, capacity, description]
const sessions = [
  ['conference', 'Made in India: Scaling Sports Goods Exports', 'Manufacturing', 'Rahul Bhandari, Lukas Brandt', 1, '11:30', '12:15', 'Business Exchange Stage', 220, 'How Indian manufacturers win global retail orders.'],
  ['conference', 'The Future of AI Coaching', 'SportsTech', 'Arjun Mehta, Dr. Meera Raghavan', 2, '10:00', '10:45', 'Innovation Arena', 324, 'Computer vision, skill benchmarks and the coach of 2030.'],
  ['conference', 'Investing in Indian Sports Startups', 'Investment', 'Priya Nair, Arjun Mehta', 2, '15:30', '16:15', 'Business Exchange Stage', 220, 'What investors look for, and the deals done at the Expo.'],
  ['discussion', 'Open floor: export compliance and quality marks', 'Manufacturing', 'Moderated by the Exchange team', 1, '15:00', '16:00', 'Networking Café', 40, 'Bring your questions on certification, duties and shipping.'],
  ['discussion', 'Roundtable: stadiums as year-round assets', 'Infrastructure', 'Sarah Okafor', 2, '12:30', '13:30', 'Federation Lounge', 12, 'Twelve places for venue owners, operators and states.'],
  ['discussion', 'Open discussion: women in the business of sport', 'Leadership', 'Mia Collins, Anita Rao', 3, '11:00', '12:00', 'Networking Café', 40, 'An open conversation on careers, boards and investment.'],
];
// [kind, who, session title or room, status, party, day, time, minutes]
const places = [
  ['conference', 'emma', sessions[0][1], 'approved', 1],
  ['conference', 'jake', sessions[1][1], 'approved', 2],
  ['conference', 'omar', sessions[2][1], 'requested', 1],
  ['discussion', 'anita', sessions[4][1], 'approved', 3],
  ['discussion', 'ravi', sessions[4][1], 'approved', 4],
  ['discussion', 'sarah', sessions[5][1], 'approved', 1],
  ['discussion', 'kabir', sessions[3][1], 'requested', 2],
  ['room', 'lukas', 'Deal Room 5', 'approved', 4, 2, '16:30', 60],
  ['room', 'anita', 'Hosted Buyer Lounge', 'requested', 8, 1, '09:30', 90],
  ['room', 'mia', 'CEO Lounge', 'requested', 6, 3, '13:00', 60],
];

module.exports = { P, meetings, sessions, places };
if (require.main !== module) return;

const who = (k) => P[k].map(q).join(', ');
const out = [
  '-- Sample bookings for the Meetings portal. Generated by scripts/platform/make-booking-seed.cjs.',
  '-- Every row is marked sample = true; Admin → Meetings → "Remove sample data" deletes them.',
  'delete from public.bookings where sample;',
  'delete from public.booking_sessions where sample;',
  'insert into public.booking_sessions (kind, title, topic, host, day, starts, ends, venue, capacity, description, sample) values',
  sessions.map((s) => `  (${s.map(q).join(', ')}, true)`).join(',\n') + ';',
  'insert into public.bookings (kind, type, requester_name, requester_org, requester_country, requester_role, counterpart_org, counterpart_country, pref_day, pref_time, duration_min, status, assigned_day, assigned_time, assigned_venue, assigned_table, purpose, counterpart_note, admin_note, title, sample) values',
  meetings
    .map(([type, k, [org, country], day, time, mins, status, venue, table, purpose, note]) => {
      const ok = status === 'approved';
      return `  ('meeting', ${q(type)}, ${who(k)}, ${q(org)}, ${q(country)}, ${day}, ${q(time)}, ${mins}, ${q(status)}, ${ok ? day : 'null'}, ${ok ? q(time) : 'null'}, ${q(venue || null)}, ${q(table || null)}, ${q(purpose)}, ${q(status === 'declined' ? note : null)}, ${q(status === 'rejected' ? note : null)}, ${q(P[k][1] + ' × ' + org)}, true)`;
    })
    .join(',\n') + ';',
  'insert into public.bookings (kind, requester_name, requester_org, requester_country, requester_role, session_id, room, party_size, pref_day, pref_time, duration_min, status, assigned_day, assigned_time, assigned_venue, assigned_table, title, sample) values',
  places
    .map(([kind, k, what, status, party, day, time, mins]) => {
      const ok = status === 'approved';
      if (kind === 'room') {
        const deal = /^Deal Room/.test(what);
        return `  ('room', ${who(k)}, null, ${q(what)}, ${party}, ${day}, ${q(time)}, ${mins}, ${q(status)}, ${ok ? day : 'null'}, ${ok ? q(time) : 'null'}, ${ok ? q(deal ? 'MoU / Deal Rooms' : what) : 'null'}, ${ok && deal ? q(what) : 'null'}, ${q(what + ' for ' + P[k][1])}, true)`;
      }
      return `  (${q(kind)}, ${who(k)}, (select id from public.booking_sessions where sample and title = ${q(what)}), null, ${party}, null, null, 30, ${q(status)}, null, null, null, null, null, true)`;
    })
    .join(',\n') + ';',
];
fs.writeFileSync('supabase/seed_bookings.sql', out.join('\n') + '\n');
console.log(`supabase/seed_bookings.sql: ${sessions.length} sessions, ${meetings.length + places.length} bookings`);
