'use client';
// New booking: a one-to-one meeting, a conference seat, an open-discussion place or a room.
// Used by /meetings and the companion app.
import { useMemo, useState } from 'react';
import { DAYS, DURATIONS, KINDS, ROOMS, TIMES, TYPES, TYPE_INFO, TYPE_COLOURS, dayLabel, fmtTime } from '@/lib/platform/bookings';
import { errorText, getClient } from '@/lib/platform/client';
import { AsyncButton } from '../ui';
import './meetings.css';
import { directory, profileOf } from './data';

function Who({ list, value, onPick }) {
  const [q, setQ] = useState(value?.org || '');
  const [open, setOpen] = useState(false);
  const t = q.trim().toLowerCase();
  const hits = useMemo(
    () => (t ? list.filter((o) => (o.org + ' ' + o.country + ' ' + o.about).toLowerCase().includes(t)) : list).slice(0, 8),
    [list, t],
  );
  return (
    <div className="mt-who">
      <input
        className="pf-input"
        value={q}
        placeholder="Search a company, startup, buyer or delegation"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          onPick(e.target.value.trim() ? { org: e.target.value.trim(), country: '', about: '', custom: true } : null);
        }}
        aria-autocomplete="list"
      />
      {open && hits.length ? (
        <ul className="mt-who-list" role="listbox">
          {hits.map((o) => (
            <li key={o.org}>
              <button
                type="button"
                role="option"
                aria-selected={value?.org === o.org}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQ(o.org);
                  setOpen(false);
                  onPick(o);
                }}
              >
                <b>{o.org}</b>
                <span>
                  {[o.country, o.about].filter(Boolean).join(' · ')}
                  {o.registered ? <em>On the platform</em> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {value ? (
        <p className="pf-help" style={{ marginTop: 6 }}>
          {value.registered
            ? `${value.org} is registered here: they accept or decline, then the organisers confirm.`
            : 'The organisers contact them for you and confirm the meeting.'}
        </p>
      ) : null}
    </div>
  );
}

function Seats({ s }) {
  const left = Math.max(0, s.capacity - s.taken);
  return (
    <span className="mt-seats" title={`${s.taken} of ${s.capacity} places confirmed`}>
      <i style={{ width: Math.min(100, (s.taken / s.capacity) * 100) + '%' }} />
      <b>{left ? `${left} of ${s.capacity} left` : 'Full'}</b>
    </span>
  );
}

export default function BookForm({ user, data, initial = {}, show, onDone }) {
  const me = profileOf(data, user);
  const [kind, setKind] = useState(KINDS.some((k) => k.id === initial.kind) ? initial.kind : 'meeting');
  const [type, setType] = useState(TYPES.includes(initial.type) ? initial.type : 'B2B');
  const people = useMemo(() => directory(data?.listed, data?.exhibitor?.id), [data?.listed, data?.exhibitor?.id]);
  const [who, setWho] = useState(() => {
    if (!initial.with) return null;
    return people.find((o) => o.org.toLowerCase() === String(initial.with).toLowerCase()) || { org: initial.with, country: initial.country || '', about: '', custom: true };
  });
  const [f, setF] = useState({ ...me, day: 1, time: '10:00', duration: 30, party: 1, purpose: '', room: ROOMS[0], session: '' });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e?.target ? e.target.value : e }));
  const [err, setErr] = useState('');
  const sessions = (data?.sessions || []).filter((s) => s.kind === kind);
  const taken = new Set((data?.mine || []).filter((b) => ['requested', 'accepted', 'approved'].includes(b.status)).map((b) => b.session_id));

  const submit = async (sessionId) => {
    setErr('');
    if (!f.requester_name.trim()) return setErr('Add your name.');
    const row = {
      kind,
      requester_name: f.requester_name.trim(),
      requester_org: f.requester_org.trim() || null,
      requester_country: f.requester_country.trim() || null,
      requester_role: f.requester_role || null,
      party_size: Math.max(1, Math.min(50, Number(f.party) || 1)),
      purpose: f.purpose.trim() || null,
    };
    if (kind === 'meeting') {
      if (!who?.org) return setErr('Choose who you want to meet.');
      Object.assign(row, {
        type,
        counterpart_exhibitor_id: who.exhibitorId || null,
        counterpart_org: who.org,
        counterpart_country: who.country || null,
        pref_day: Number(f.day),
        pref_time: f.time,
        duration_min: Number(f.duration),
        title: (row.requester_org || row.requester_name) + ' × ' + who.org,
      });
    } else if (kind === 'room') {
      Object.assign(row, { room: f.room, pref_day: Number(f.day), pref_time: f.time, duration_min: Number(f.duration), title: f.room + ' for ' + (row.requester_org || row.requester_name) });
    } else {
      Object.assign(row, { session_id: sessionId });
    }
    try {
      const sb = await getClient();
      const { error } = await sb.from('bookings').insert(row);
      if (error) throw error;
      show?.(kind === 'meeting' ? 'Request sent' : kind === 'room' ? 'Room request sent' : 'Place requested');
      setWho(null);
      setF((x) => ({ ...x, purpose: '' }));
      onDone?.();
    } catch (x) {
      const m = errorText(x);
      setErr(/bookings_one_seat|already registered/i.test(m) ? 'You already have a place at this session.' : m);
    }
  };

  const you = (
    <div className="pf-form">
      <label className="pf-field">
        <span className="pf-label">Your name *</span>
        <input className="pf-input" value={f.requester_name} onChange={set('requester_name')} autoComplete="name" />
      </label>
      <label className="pf-field">
        <span className="pf-label">Organisation</span>
        <input className="pf-input" value={f.requester_org} onChange={set('requester_org')} autoComplete="organization" />
      </label>
      <label className="pf-field">
        <span className="pf-label">Country</span>
        <input className="pf-input" value={f.requester_country} onChange={set('requester_country')} autoComplete="country-name" />
      </label>
      <label className="pf-field">
        <span className="pf-label">{kind === 'room' ? 'People' : kind === 'meeting' ? 'Attendees from your side' : 'Places'}</span>
        <select className="pf-input" value={f.party} onChange={set('party')}>
          {Array.from({ length: kind === 'room' ? 16 : kind === 'meeting' ? 6 : 4 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
  const when = (
    <div className="pf-form">
      <div className="pf-field full">
        <span className="pf-label">Day</span>
        <div className="pf-chips">
          {DAYS.map((d) => (
            <button key={d.n} type="button" className="pf-chip" aria-pressed={Number(f.day) === d.n} onClick={() => set('day')(d.n)}>
              {d.label} <span className="pf-muted">{d.date}</span>
            </button>
          ))}
        </div>
      </div>
      <label className="pf-field">
        <span className="pf-label">Preferred time</span>
        <select className="pf-input" value={f.time} onChange={set('time')}>
          {TIMES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="pf-field">
        <span className="pf-label">Length</span>
        <select className="pf-input" value={f.duration} onChange={set('duration')}>
          {DURATIONS.map((m) => (
            <option key={m} value={m}>
              {m < 60 ? m + ' min' : m / 60 + (m === 60 ? ' hour' : ' hours')}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <div className="mt-book">
      <div className="mt-kinds" role="tablist" aria-label="What to book">
        {KINDS.map((k) => (
          <button key={k.id} role="tab" aria-selected={kind === k.id} className="mt-kind" onClick={() => (setKind(k.id), setErr(''))}>
            <b>{k.label}</b>
            <span>{k.text}</span>
          </button>
        ))}
      </div>

      {kind === 'meeting' ? (
        <>
          <div className="pf-field">
            <span className="pf-label">Meeting type</span>
            <div className="mt-types">
              {TYPES.map((t) => (
                <button key={t} type="button" className="mt-type" aria-pressed={type === t} style={{ '--c': TYPE_COLOURS[t] }} onClick={() => setType(t)}>
                  <b>{t}</b>
                  <span>{TYPE_INFO[t]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="pf-field">
            <span className="pf-label">Who do you want to meet? *</span>
            <Who list={people} value={who} onPick={setWho} />
          </div>
          {when}
          {you}
          <label className="pf-field">
            <span className="pf-label">What is it about?</span>
            <textarea value={f.purpose} onChange={set('purpose')} placeholder="e.g. Distribution of match footballs in Germany, 20,000 units a season" />
          </label>
        </>
      ) : null}

      {kind === 'room' ? (
        <>
          <label className="pf-field">
            <span className="pf-label">Room</span>
            <select className="pf-input" value={f.room} onChange={set('room')}>
              {ROOMS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          {when}
          {you}
          <label className="pf-field">
            <span className="pf-label">What is it for?</span>
            <textarea value={f.purpose} onChange={set('purpose')} placeholder="e.g. MoU signing with a state delegation, 6 people" />
          </label>
        </>
      ) : null}

      {kind === 'conference' || kind === 'discussion' ? (
        <>
          {you}
          <div className="mt-sessions">
            {sessions.length ? (
              sessions.map((s) => {
                const mine = taken.has(s.id);
                const full = s.taken >= s.capacity;
                return (
                  <div key={s.id} className="mt-session">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="pf-small pf-muted">
                        {dayLabel(s.day)} · {fmtTime(s.starts)}–{fmtTime(s.ends)} · {s.venue}
                      </span>
                      <h3>{s.title}</h3>
                      {s.host ? <p className="pf-small pf-muted">{s.host}</p> : null}
                      <Seats s={s} />
                    </div>
                    {mine ? (
                      <span className="pf-pill approved">Requested</span>
                    ) : (
                      <AsyncButton className="pf-btn small" disabled={full} onClick={() => submit(s.id)}>
                        {full ? 'Full' : 'Request a place'}
                      </AsyncButton>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="pf-empty">No {kind === 'conference' ? 'conferences' : 'open discussions'} open for booking yet.</p>
            )}
          </div>
        </>
      ) : null}

      {err ? (
        <p className="pf-err" role="alert">
          {err}
        </p>
      ) : null}
      {kind === 'meeting' || kind === 'room' ? (
        <AsyncButton className="pf-btn orange block" onClick={() => submit()}>
          {kind === 'meeting' ? 'Send meeting request' : 'Request the room'}
        </AsyncButton>
      ) : null}
      <p className="pf-help" style={{ marginTop: 10 }}>
        {kind === 'meeting'
          ? 'Pick any time that suits you. The organisers confirm the final time, venue and table.'
          : kind === 'room'
            ? 'The organisers confirm rooms in the order requests arrive.'
            : 'Places are confirmed by the organisers. Confirmed bookings appear on your business pass.'}
      </p>
    </div>
  );
}
