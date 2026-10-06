'use client';
// Admin → Meetings: confirm or turn down meeting, seat and room requests; set the day, time,
// venue and table (with clash warnings, since people pick their own times); manage conference
// and discussion sessions; see the numbers; remove the sample data.
import { useMemo, useState } from 'react';
import {
  BOOKING_COLUMNS,
  DAYS,
  DURATIONS,
  KIND,
  KINDS,
  STATUS_TEXT,
  TIMES,
  TYPES,
  TYPE_COLOURS,
  VENUES,
  clashes,
  colourOf,
  dayLabel,
  defaultVenue,
  fmtTime,
  labelOf,
  whenOf,
} from '@/lib/platform/bookings';
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import { StatusPill } from '../meetings/BookingCard';
import { AsyncButton, Drawer, Loading, Tabs, fmtDate } from '../ui';
import { csv, download } from './Visitors';
import '../meetings/meetings.css';

// Waiting on the organisers: meetings the other side accepted, meetings with a website company
// (the organisers ask them), and every seat and room request.
export const needsOrganisers = (b) =>
  (b.kind === 'meeting' && b.status === 'accepted') || (b.status === 'requested' && (b.kind !== 'meeting' || !b.counterpart_exhibitor_id));

function useBookings() {
  return useLive(
    'admin-bookings',
    async (sb) => {
      const [b, s] = await Promise.all([
        sb.from('bookings').select(BOOKING_COLUMNS).order('created_at', { ascending: false }).limit(5000),
        sb.from('booking_sessions').select('*').order('day').order('starts'),
      ]);
      if (b.error) throw b.error;
      if (s.error) throw s.error;
      return { rows: b.data, sessions: s.data };
    },
    [{ table: 'bookings' }, { table: 'booking_sessions' }],
  );
}

function Who({ b }) {
  if (b.kind === 'meeting') {
    return (
      <>
        <b>{b.requester_org || b.requester_name}</b>
        <span className="pf-muted"> ↔ </span>
        <b>{b.counterpart_org}</b>
        <div className="pf-small pf-muted">
          {b.requester_name}
          {b.counterpart_exhibitor_id ? ' · exhibitor answers' : ' · organisers arrange'}
        </div>
      </>
    );
  }
  return (
    <>
      <b>{b.requester_org || b.requester_name}</b>
      <div className="pf-small pf-muted">
        {b.requester_name} · {b.party_size} {b.party_size === 1 ? 'person' : 'people'}
      </div>
    </>
  );
}

function Detail({ b, all, sessions, role, show, onClose, onChange }) {
  const s = sessions[b.session_id];
  const w0 = whenOf(b, s);
  const [f, setF] = useState({
    day: w0.day || 1,
    time: w0.time || '10:00',
    mins: w0.mins || 30,
    venue: b.assigned_venue || s?.venue || defaultVenue(b) || VENUES[0].id,
    table: b.assigned_table || (b.kind === 'room' && /^Deal Room/.test(b.room || '') ? b.room : ''),
    note: b.admin_note || '',
  });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const sessionBooking = !!b.session_id;
  const when = sessionBooking ? w0 : { day: Number(f.day), time: f.time, mins: Number(f.mins), venue: f.venue, table: f.table.trim() };
  const hits = clashes(b, when, all, sessions);
  const venue = VENUES.find((v) => v.id === f.venue);
  const admin = can(role, 'admin');
  const save = (status, msg) => async () => {
    if (status === 'rejected' && !f.note.trim()) return show('Add a short reason for the person first.', true);
    try {
      const sb = await getClient();
      const patch = { status, admin_note: f.note.trim() || null };
      if (!sessionBooking && (status === 'approved' || b.status === 'approved')) {
        Object.assign(patch, { assigned_day: Number(f.day), assigned_time: f.time, assigned_venue: f.venue, assigned_table: f.table.trim() || null, duration_min: Number(f.mins) });
      }
      const { error } = await sb.from('bookings').update(patch).eq('id', b.id);
      if (error) throw error;
      show(msg);
      onChange?.();
      onClose();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <Drawer title={b.kind === 'meeting' ? `${b.type} meeting` : KIND[b.kind]?.label} onClose={onClose} actions={<StatusPill status={b.status} />}>
      <div className="pf-card">
        <dl className="pf-kv">
          <dt>Requested by</dt>
          <dd>
            <b>{b.requester_name}</b>
            {b.requester_org ? ' · ' + b.requester_org : ''}
            {b.requester_country ? ' · ' + b.requester_country : ''}
            {b.requester_role ? <div className="pf-small pf-muted">{b.requester_role}</div> : null}
            {b.requester_email ? <div className="pf-small pf-muted">{b.requester_email}</div> : null}
          </dd>
          {b.kind === 'meeting' ? (
            <>
              <dt>To meet</dt>
              <dd>
                <b>{b.counterpart_org}</b>
                {b.counterpart_country ? ' · ' + b.counterpart_country : ''}
                <div className="pf-small pf-muted">
                  {b.counterpart_exhibitor_id
                    ? b.status === 'requested'
                      ? 'Registered exhibitor: waiting for their answer'
                      : `Registered exhibitor: ${b.status === 'declined' ? 'declined' : 'accepted'}${b.answered_at ? ' ' + fmtDate(b.answered_at) : ''}`
                    : 'Website company or delegation: the organisers contact them'}
                </div>
              </dd>
            </>
          ) : null}
          {s ? (
            <>
              <dt>Session</dt>
              <dd>
                <b>{s.title}</b>
                <div className="pf-small pf-muted">
                  {dayLabel(s.day)} · {fmtTime(s.starts)}–{fmtTime(s.ends)} · {s.venue} · {s.taken}/{s.capacity} places confirmed
                </div>
              </dd>
            </>
          ) : null}
          {b.room ? (
            <>
              <dt>Room asked for</dt>
              <dd>{b.room}</dd>
            </>
          ) : null}
          {b.pref_day && !s ? (
            <>
              <dt>Asked for</dt>
              <dd>
                {dayLabel(b.pref_day)} · {fmtTime(b.pref_time)} · {b.duration_min} min
              </dd>
            </>
          ) : null}
          <dt>{b.kind === 'meeting' ? 'Attendees' : 'Places'}</dt>
          <dd>{b.party_size}</dd>
          {b.purpose ? (
            <>
              <dt>Purpose</dt>
              <dd>{b.purpose}</dd>
            </>
          ) : null}
          {b.counterpart_note ? (
            <>
              <dt>Their note</dt>
              <dd>{b.counterpart_note}</dd>
            </>
          ) : null}
          <dt>Requested</dt>
          <dd>{fmtDate(b.created_at)}</dd>
          {b.approved_at ? (
            <>
              <dt>Confirmed</dt>
              <dd>
                {fmtDate(b.approved_at)}
                {b.approved_by ? ' by ' + b.approved_by : ''}
              </dd>
            </>
          ) : null}
          {b.sample ? (
            <>
              <dt>Data</dt>
              <dd>
                <span className="pf-pill">Sample</span>
              </dd>
            </>
          ) : null}
        </dl>
      </div>

      {admin ? (
        <div className="pf-card">
          <h3>{b.status === 'approved' ? 'Confirmed slot' : 'Confirm a slot'}</h3>
          {sessionBooking ? (
            <p className="pf-muted" style={{ marginTop: 8 }}>
              Seats are held at the session’s own time and venue.
            </p>
          ) : (
            <div className="pf-form" style={{ marginTop: 14 }}>
              <label className="pf-field">
                <span className="pf-label">Day</span>
                <select value={f.day} onChange={set('day')}>
                  {DAYS.map((d) => (
                    <option key={d.n} value={d.n}>
                      {d.label} · {d.date}
                    </option>
                  ))}
                </select>
              </label>
              <label className="pf-field">
                <span className="pf-label">Time</span>
                <select value={f.time} onChange={set('time')}>
                  {[...new Set([f.time, ...TIMES])].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="pf-field">
                <span className="pf-label">Venue</span>
                <select value={f.venue} onChange={set('venue')}>
                  {[...new Set([f.venue, ...VENUES.map((v) => v.id)])].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="pf-field">
                <span className="pf-label">{venue?.units || 'Table / room'}</span>
                <input className="pf-input" list="mt-units" value={f.table} onChange={set('table')} placeholder={venue?.units ? venue.units + ' 1' : 'optional'} />
                <datalist id="mt-units">
                  {venue?.count ? Array.from({ length: venue.count }, (_, i) => <option key={i} value={`${venue.units} ${i + 1}`} />) : null}
                </datalist>
              </label>
              <label className="pf-field">
                <span className="pf-label">Length</span>
                <select value={f.mins} onChange={set('mins')}>
                  {[...new Set([Number(f.mins), ...DURATIONS])].map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {hits.length ? (
            <div className="pf-note bad" style={{ marginTop: 16 }}>
              <b>Clash{hits.length > 1 ? 'es' : ''} with confirmed bookings:</b>
              <ul className="mt-clash">
                {hits.map((h) => (
                  <li key={h.booking.id}>
                    {h.reason}: {labelOf(h.booking)} {h.booking.kind === 'meeting' ? `${h.booking.requester_org} ↔ ${h.booking.counterpart_org}` : h.booking.title || ''} · {dayLabel(h.when.day).split(' · ')[0]} {h.when.time}
                    {h.when.venue ? ' · ' + h.when.venue : ''}
                    {h.when.table ? ' ' + h.when.table : ''}
                  </li>
                ))}
              </ul>
              Change the time, venue or table, or confirm anyway if both can attend.
            </div>
          ) : (
            <div className="pf-note good" style={{ marginTop: 16 }}>
              No clashes with confirmed bookings at this time.
            </div>
          )}
          <label className="pf-field" style={{ margin: '16px 0' }}>
            <span className="pf-label">Message to {b.requester_name} (needed to turn it down)</span>
            <textarea value={f.note} onChange={set('note')} placeholder="e.g. Deal Room 2 is booked; we’ve moved you to 15:00." />
          </label>
          <div className="pf-row">
            {b.status !== 'approved' ? (
              <AsyncButton className="pf-btn green" onClick={save('approved', 'Confirmed. It’s on their business pass.')}>
                Confirm booking
              </AsyncButton>
            ) : (
              <AsyncButton className="pf-btn green" onClick={save('approved', 'Slot updated')}>
                Save changes
              </AsyncButton>
            )}
            {b.kind === 'meeting' && b.status === 'requested' && !b.counterpart_exhibitor_id ? (
              <AsyncButton className="pf-btn soft" onClick={save('accepted', 'Marked as accepted by ' + b.counterpart_org)}>
                They accepted
              </AsyncButton>
            ) : null}
            {b.status !== 'rejected' ? (
              <AsyncButton className="pf-btn ghost" style={{ color: 'var(--red)' }} onClick={save('rejected', 'Turned down')}>
                Turn down
              </AsyncButton>
            ) : null}
            {['approved', 'rejected'].includes(b.status) ? (
              <AsyncButton className="pf-btn ghost" onClick={save(b.counterpart_exhibitor_id && b.answered_at ? 'accepted' : 'requested', 'Moved back to the queue')}>
                Back to the queue
              </AsyncButton>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="pf-note">Only admins can confirm bookings.</p>
      )}
    </Drawer>
  );
}

function BookingTable({ rows, sessions, all, onOpen }) {
  if (!rows.length) return <p className="pf-empty">Nothing here.</p>;
  return (
    <div className="pf-table-wrap">
      <table className="pf-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Who</th>
            <th>When</th>
            <th>Where</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            const s = sessions[b.session_id];
            const w = whenOf(b, s);
            const clash = b.status !== 'approved' && !b.session_id && clashes(b, { ...w, venue: b.assigned_venue || defaultVenue(b) }, all, sessions).length;
            return (
              <tr key={b.id} className="click" onClick={() => onOpen(b.id)}>
                <td>
                  <span className="mt-tag" style={{ '--c': colourOf(b) }}>
                    {labelOf(b)}
                  </span>
                  {b.sample ? <div className="pf-small pf-muted">sample</div> : null}
                </td>
                <td>
                  {s ? (
                    <>
                      <b>{s.title}</b>
                      <div className="pf-small pf-muted">
                        {b.requester_org || b.requester_name} · {b.party_size} {b.party_size === 1 ? 'place' : 'places'}
                      </div>
                    </>
                  ) : (
                    <Who b={b} />
                  )}
                </td>
                <td className="pf-small">
                  {w.day ? `Day ${w.day}` : '—'} {w.time}
                  {clash ? <div className="mt-flag">Clash</div> : null}
                </td>
                <td className="pf-small">{b.status === 'approved' ? [w.venue, w.table].filter(Boolean).join(' · ') : b.room || (s ? s.venue : '—')}</td>
                <td>
                  <StatusPill status={b.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const EMPTY_SESSION = { kind: 'conference', title: '', topic: '', host: '', day: 1, starts: '10:00', ends: '11:00', venue: 'Business Exchange Stage', capacity: 100, description: '', active: true };

function SessionDrawer({ s, onClose, show, onChange }) {
  const [f, setF] = useState({ ...EMPTY_SESSION, ...(s || {}), starts: fmtTime(s?.starts) || '10:00', ends: fmtTime(s?.ends) || '11:00' });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const save = async () => {
    if (!f.title.trim()) return show('Add a title.', true);
    try {
      const sb = await getClient();
      const row = { kind: f.kind, title: f.title.trim(), topic: f.topic || null, host: f.host || null, day: Number(f.day), starts: f.starts, ends: f.ends, venue: f.venue, capacity: Math.max(1, Number(f.capacity) || 1), description: f.description || null, active: !!f.active };
      const { error } = s?.id ? await sb.from('booking_sessions').update(row).eq('id', s.id) : await sb.from('booking_sessions').insert(row);
      if (error) throw error;
      show(s?.id ? 'Session saved' : 'Session added');
      onChange?.();
      onClose();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  const remove = async () => {
    if (!confirm('Delete this session and every place booked on it?')) return;
    try {
      const sb = await getClient();
      const { error } = await sb.from('booking_sessions').delete().eq('id', s.id);
      if (error) throw error;
      show('Session deleted');
      onChange?.();
      onClose();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <Drawer title={s?.id ? 'Edit session' : 'New session'} onClose={onClose}>
      <div className="pf-card">
        <div className="pf-form">
          <label className="pf-field">
            <span className="pf-label">Kind</span>
            <select value={f.kind} onChange={set('kind')}>
              <option value="conference">Conference</option>
              <option value="discussion">Open discussion</option>
            </select>
          </label>
          <label className="pf-field">
            <span className="pf-label">Places</span>
            <input className="pf-input" type="number" min="1" value={f.capacity} onChange={set('capacity')} />
          </label>
          <label className="pf-field full">
            <span className="pf-label">Title</span>
            <input className="pf-input" value={f.title} onChange={set('title')} />
          </label>
          <label className="pf-field">
            <span className="pf-label">Topic</span>
            <input className="pf-input" value={f.topic || ''} onChange={set('topic')} />
          </label>
          <label className="pf-field">
            <span className="pf-label">Host / speakers</span>
            <input className="pf-input" value={f.host || ''} onChange={set('host')} />
          </label>
          <label className="pf-field">
            <span className="pf-label">Day</span>
            <select value={f.day} onChange={set('day')}>
              {DAYS.map((d) => (
                <option key={d.n} value={d.n}>
                  {d.label} · {d.date}
                </option>
              ))}
            </select>
          </label>
          <label className="pf-field">
            <span className="pf-label">Venue</span>
            <select value={f.venue} onChange={set('venue')}>
              {[...new Set([f.venue, ...VENUES.map((v) => v.id)])].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="pf-field">
            <span className="pf-label">Starts</span>
            <select value={f.starts} onChange={set('starts')}>
              {[...new Set([f.starts, ...TIMES])].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="pf-field">
            <span className="pf-label">Ends</span>
            <select value={f.ends} onChange={set('ends')}>
              {[...new Set([f.ends, ...TIMES])].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="pf-field full">
            <span className="pf-label">Description</span>
            <textarea value={f.description || ''} onChange={set('description')} />
          </label>
          <label className="pf-check pf-field full">
            <input type="checkbox" checked={!!f.active} onChange={set('active')} /> Open for booking
          </label>
        </div>
        <div className="pf-row" style={{ marginTop: 18 }}>
          <AsyncButton className="pf-btn" onClick={save}>
            {s?.id ? 'Save session' : 'Add session'}
          </AsyncButton>
          {s?.id ? (
            <AsyncButton className="pf-btn ghost" style={{ color: 'var(--red)' }} onClick={remove}>
              Delete
            </AsyncButton>
          ) : null}
        </div>
      </div>
    </Drawer>
  );
}

function Numbers({ rows, sessions, role, show, onChange }) {
  const live = rows.filter((b) => b.status !== 'cancelled');
  const statuses = ['requested', 'accepted', 'approved', 'declined', 'rejected'];
  const keys = [...TYPES, 'conference', 'discussion', 'room'];
  const by = (k) => live.filter((b) => (b.kind === 'meeting' ? b.type : b.kind) === k);
  const samples = rows.filter((b) => b.sample).length + Object.values(sessions).filter((s) => s.sample).length;
  const orgs = {};
  live
    .filter((b) => b.kind === 'meeting' && b.status === 'approved')
    .forEach((b) => [b.requester_org, b.counterpart_org].forEach((o) => o && (orgs[o] = (orgs[o] || 0) + 1)));
  const top = Object.entries(orgs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const removeSamples = async () => {
    if (!confirm(`Delete all ${samples} sample rows (bookings and sessions)? Real bookings are kept.`)) return;
    try {
      const sb = await getClient();
      const a = await sb.from('bookings').delete().eq('sample', true);
      if (a.error) throw a.error;
      const b = await sb.from('booking_sessions').delete().eq('sample', true);
      if (b.error) throw b.error;
      show('Sample data removed');
      onChange?.();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <>
      <div className="pf-card">
        <div className="pf-card-head">
          <h2>Bookings by type and status</h2>
        </div>
        <div className="pf-table-wrap">
          <table className="pf-table mt-matrix">
            <thead>
              <tr>
                <th>Type</th>
                {statuses.map((s) => (
                  <th key={s}>{STATUS_TEXT[s].split(' ·')[0]}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const list = by(k);
                return (
                  <tr key={k}>
                    <td>
                      <span className="mt-tag" style={{ '--c': TYPE_COLOURS[k] }}>
                        {KIND[k]?.short || k}
                      </span>
                    </td>
                    {statuses.map((s) => (
                      <td key={s}>{list.filter((b) => b.status === s).length || '·'}</td>
                    ))}
                    <td>
                      <b>{list.length}</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pf-grid two" style={{ marginTop: 20, alignItems: 'start' }}>
        <div className="pf-card">
          <h2>Confirmed per day</h2>
          {DAYS.map((d) => {
            const n = live.filter((b) => b.status === 'approved' && whenOf(b, sessions[b.session_id]).day === d.n).length;
            const max = Math.max(1, ...DAYS.map((x) => live.filter((b) => b.status === 'approved' && whenOf(b, sessions[b.session_id]).day === x.n).length));
            return (
              <div key={d.n} className="mt-barrow">
                <span>
                  {d.label} <em>{d.date}</em>
                </span>
                <i style={{ width: (n / max) * 100 + '%' }} />
                <b>{n}</b>
              </div>
            );
          })}
        </div>
        <div className="pf-card">
          <h2>Busiest companies</h2>
          {top.map(([o, n]) => (
            <div key={o} className="pf-row" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
              <span style={{ flex: 1, minWidth: 0 }}>{o}</span>
              <b>{n}</b>
            </div>
          ))}
          {!top.length ? <p className="pf-empty">No confirmed meetings yet.</p> : null}
        </div>
      </div>
      {can(role, 'admin') && samples ? (
        <div className="pf-card" style={{ marginTop: 20 }}>
          <h2>Sample data</h2>
          <p className="pf-muted" style={{ margin: '8px 0 14px' }}>
            {samples} rows are sample bookings and sessions, shown on the website for reference. Remove them before the real bookings open.
          </p>
          <AsyncButton className="pf-btn ghost" style={{ color: 'var(--red)' }} onClick={removeSamples}>
            Remove sample data
          </AsyncButton>
        </div>
      ) : null}
    </>
  );
}

export default function Meetings({ role, show }) {
  const { data, loading, reload } = useBookings();
  const [tab, setTab] = useState('queue');
  const [open, setOpen] = useState(null);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({ kind: '', type: '', status: '', day: '', q: '' });
  const rows = data?.rows || [];
  const sessions = useMemo(() => Object.fromEntries((data?.sessions || []).map((s) => [s.id, s])), [data?.sessions]);
  const queue = rows.filter(needsOrganisers);
  const waiting = rows.filter((b) => b.kind === 'meeting' && b.status === 'requested' && b.counterpart_exhibitor_id);
  const filtered = useMemo(() => {
    const t = filter.q.trim().toLowerCase();
    return rows.filter(
      (b) =>
        (!filter.kind || b.kind === filter.kind) &&
        (!filter.type || b.type === filter.type) &&
        (!filter.status || b.status === filter.status) &&
        (!filter.day || String(whenOf(b, sessions[b.session_id]).day) === filter.day) &&
        (!t || [b.requester_name, b.requester_org, b.counterpart_org, b.title, b.requester_email, b.room].some((x) => (x || '').toLowerCase().includes(t))),
    );
  }, [rows, filter, sessions]);
  if (loading && !data) return <Loading />;
  const current = open && rows.find((b) => b.id === open);
  const setF = (k) => (e) => setFilter((x) => ({ ...x, [k]: e.target.value }));
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Meetings</h1>
          <p>
            {rows.filter((b) => b.status === 'approved').length} confirmed · {queue.length} waiting for you · {waiting.length} waiting for exhibitors · updates live
          </p>
        </div>
        <button
          className="pf-btn ghost"
          onClick={() =>
            download(
              'bookings.csv',
              csv(filtered, [
                ['kind', 'Kind'],
                ['type', 'Type'],
                ['status', 'Status'],
                ['requester_name', 'Requested by'],
                ['requester_org', 'Organisation'],
                ['requester_country', 'Country'],
                ['requester_email', 'Email'],
                ['counterpart_org', 'Meeting with'],
                [(b) => sessions[b.session_id]?.title || b.room || '', 'Session / room'],
                [(b) => whenOf(b, sessions[b.session_id]).day, 'Day'],
                [(b) => whenOf(b, sessions[b.session_id]).time, 'Time'],
                [(b) => whenOf(b, sessions[b.session_id]).venue, 'Venue'],
                ['assigned_table', 'Table / room'],
                ['party_size', 'People'],
                ['purpose', 'Purpose'],
                ['sample', 'Sample'],
                ['created_at', 'Requested'],
              ]),
            )
          }
        >
          Export CSV
        </button>
      </div>
      <Tabs
        tabs={[
          { id: 'queue', label: 'To confirm', n: queue.length || null },
          { id: 'all', label: 'All bookings', n: rows.length || null },
          { id: 'sessions', label: 'Sessions', n: data.sessions.length || null },
          { id: 'numbers', label: 'Overview' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'queue' ? (
        <div className="pf-card">
          <p className="pf-muted" style={{ marginBottom: 14 }}>
            Meetings accepted by the other side, meetings with website companies, and seat and room requests. Times are chosen freely, so check the clash warnings.
          </p>
          <BookingTable rows={queue} sessions={sessions} all={rows} onOpen={setOpen} />
        </div>
      ) : null}
      {tab === 'all' ? (
        <>
          <div className="pf-row" style={{ marginBottom: 16 }}>
            <input className="pf-input pf-search" placeholder="Search name, company, email…" value={filter.q} onChange={setF('q')} />
            <select className="pf-input" style={{ width: 'auto' }} value={filter.kind} onChange={setF('kind')} aria-label="Kind">
              <option value="">All kinds</option>
              {KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.short}
                </option>
              ))}
            </select>
            <select className="pf-input" style={{ width: 'auto' }} value={filter.type} onChange={setF('type')} aria-label="Meeting type">
              <option value="">All types</option>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select className="pf-input" style={{ width: 'auto' }} value={filter.status} onChange={setF('status')} aria-label="Status">
              <option value="">Any status</option>
              {Object.entries(STATUS_TEXT).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <select className="pf-input" style={{ width: 'auto' }} value={filter.day} onChange={setF('day')} aria-label="Day">
              <option value="">Any day</option>
              {DAYS.map((d) => (
                <option key={d.n} value={d.n}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="pf-card">
            <BookingTable rows={filtered} sessions={sessions} all={rows} onOpen={setOpen} />
          </div>
        </>
      ) : null}
      {tab === 'sessions' ? (
        <div className="pf-card">
          <div className="pf-card-head">
            <h2>Conferences and open discussions</h2>
            {can(role, 'admin') ? (
              <button className="pf-btn small" onClick={() => setEditing({})}>
                Add session
              </button>
            ) : null}
          </div>
          {data.sessions.map((s) => (
            <button key={s.id} className="mt-srow" onClick={() => can(role, 'admin') && setEditing(s)}>
              <span className="mt-tag" style={{ '--c': TYPE_COLOURS[s.kind] }}>
                {KIND[s.kind].short}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b>{s.title}</b>
                <span className="pf-small pf-muted">
                  {dayLabel(s.day)} · {fmtTime(s.starts)}–{fmtTime(s.ends)} · {s.venue}
                  {s.active ? '' : ' · closed'}
                  {s.sample ? ' · sample' : ''}
                </span>
              </span>
              <span className="mt-seats">
                <i style={{ width: Math.min(100, (s.taken / s.capacity) * 100) + '%' }} />
                <b>
                  {s.taken}/{s.capacity}
                </b>
              </span>
            </button>
          ))}
          {!data.sessions.length ? <p className="pf-empty">No sessions yet.</p> : null}
        </div>
      ) : null}
      {tab === 'numbers' ? <Numbers rows={rows} sessions={sessions} role={role} show={show} onChange={reload} /> : null}
      {current ? <Detail key={current.id + current.updated_at} b={current} all={rows} sessions={sessions} role={role} show={show} onChange={reload} onClose={() => setOpen(null)} /> : null}
      {editing ? <SessionDrawer s={editing.id ? editing : null} show={show} onChange={reload} onClose={() => setEditing(null)} /> : null}
    </>
  );
}
