'use client';
// Connect → Meetings: what the Business Exchange has confirmed so far, live from the database
// (booking_board: confirmed bookings at company level, no personal details). Who meets whom,
// how many of each type, and how the days and venues fill up.
import { useEffect, useMemo, useState } from 'react';
import { withBase } from '@/lib/base';
import { DAYS, KIND, TYPES, TYPE_COLOURS, VENUES, fmtTime } from '@/lib/platform/bookings';
import { restSelect } from '@/lib/platform/client';
import './meetings.css';

function useBoard() {
  const [state, setState] = useState({ rows: null, error: false });
  useEffect(() => {
    let alive = true;
    const load = () =>
      restSelect('booking_board', 'select=*&order=day.asc,starts.asc')
        .then((rows) => alive && setState({ rows, error: false }))
        .catch(() => alive && setState((s) => ({ ...s, error: true })));
    load();
    const t = setInterval(() => document.visibilityState === 'visible' && load(), 60000);
    const v = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', v);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener('visibilitychange', v);
    };
  }, []);
  return state;
}

const keyOf = (r) => (r.kind === 'meeting' ? r.type : r.kind);
const short = (s, n = 30) => (s && s.length > n ? s.slice(0, n - 1) + '…' : s || '');

function Network({ rows, focus, setFocus }) {
  const left = [...new Set(rows.map((r) => r.requester_org))];
  const right = [...new Set(rows.map((r) => r.counterpart_org))];
  const H = Math.max(left.length, right.length) * 30 + 30;
  const W = 760;
  const y = (list, name) => 26 + list.indexOf(name) * ((H - 40) / Math.max(1, list.length - 1 || 1));
  const lit = (r) => !focus || r.requester_org === focus || r.counterpart_org === focus;
  return (
    <svg className="mo-net" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Who meets whom: confirmed meetings between companies">
      {rows.map((r) => {
        const y1 = y(left, r.requester_org);
        const y2 = y(right, r.counterpart_org);
        return (
          <path
            key={r.id}
            d={`M 250 ${y1} C 380 ${y1}, 380 ${y2}, 510 ${y2}`}
            stroke={TYPE_COLOURS[r.type] || '#8A8780'}
            strokeWidth={lit(r) ? 2.4 : 1.2}
            strokeOpacity={lit(r) ? 0.9 : 0.12}
            fill="none"
          />
        );
      })}
      {left.map((n) => (
        <g key={'l' + n} className="mo-node" transform={`translate(250 ${y(left, n)})`} onMouseEnter={() => setFocus(n)} onMouseLeave={() => setFocus(null)} onClick={() => setFocus(focus === n ? null : n)} opacity={!focus || focus === n || rows.some((r) => r.requester_org === n && lit(r)) ? 1 : 0.35}>
          <circle r="5" />
          <text x="-12" dy="4" textAnchor="end">
            {short(n)}
          </text>
        </g>
      ))}
      {right.map((n) => (
        <g key={'r' + n} className="mo-node" transform={`translate(510 ${y(right, n)})`} onMouseEnter={() => setFocus(n)} onMouseLeave={() => setFocus(null)} onClick={() => setFocus(focus === n ? null : n)} opacity={!focus || focus === n || rows.some((r) => r.counterpart_org === n && lit(r)) ? 1 : 0.35}>
          <circle r="5" />
          <text x="12" dy="4">
            {short(n)}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function MeetingsOverview() {
  const { rows, error } = useBoard();
  const [type, setType] = useState('all');
  const [focus, setFocus] = useState(null);
  const [cell, setCell] = useState(null);
  const [more, setMore] = useState(false);
  const all = rows || [];
  const meetings = all.filter((r) => r.kind === 'meeting');
  const shown = useMemo(() => meetings.filter((r) => type === 'all' || r.type === type), [meetings, type]);
  const counts = Object.fromEntries(TYPES.map((t) => [t, meetings.filter((r) => r.type === t).length]));
  const orgs = new Set(meetings.flatMap((r) => [r.requester_org, r.counterpart_org]));
  const countries = new Set(all.flatMap((r) => [r.requester_country, r.counterpart_country]).filter(Boolean));
  const seats = all.filter((r) => r.kind !== 'meeting').length;
  const venues = [...VENUES.map((v) => v.id), ...new Set(all.map((r) => r.venue).filter((v) => v && !VENUES.some((x) => x.id === v)))];
  const grid = venues.map((v) => ({ v, days: DAYS.map((d) => all.filter((r) => r.venue === v && r.day === d.n)) })).filter((g) => g.days.some((d) => d.length));
  const peak = Math.max(1, ...grid.flatMap((g) => g.days.map((d) => d.length)));
  const sample = all.some((r) => r.sample);
  const pairs = focus ? shown.filter((r) => r.requester_org === focus || r.counterpart_org === focus) : shown;
  const cellRows = cell ? all.filter((r) => r.venue === cell[0] && r.day === cell[1]) : [];

  return (
    <div className="mo">
      <div className="mo-head">
        <h2>03 — Meetings</h2>
        <div className="mo-head-r">
          <span className="mo-live">
            <i /> LIVE · CONFIRMED BY THE ORGANISERS{sample ? ' · SAMPLE DATA' : ''}
          </span>
          <a className="mo-cta" href={withBase('/meetings/')}>
            Book a meeting →
          </a>
        </div>
      </div>

      {error && !rows ? <p className="mo-empty">Live meeting data is unavailable right now.</p> : null}

      <div className="mo-stats">
        {[
          [meetings.length, 'one-to-one meetings confirmed'],
          [orgs.size, 'companies & delegations meeting'],
          [countries.size, 'countries'],
          [seats, 'conference seats, discussion places & rooms'],
        ].map(([n, t]) => (
          <div key={t}>
            <b>{rows ? n : '–'}</b>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div className="mo-types" role="tablist" aria-label="Meeting type">
        <button role="tab" aria-selected={type === 'all'} onClick={() => (setType('all'), setFocus(null))}>
          All types <span>{meetings.length}</span>
        </button>
        {TYPES.map((t) => (
          <button key={t} role="tab" aria-selected={type === t} onClick={() => (setType(t), setFocus(null))} style={{ '--c': TYPE_COLOURS[t] }}>
            <i />
            {t} <span>{counts[t] || 0}</span>
          </button>
        ))}
      </div>
      <div className="mo-bar" aria-hidden="true">
        {TYPES.map((t) => (counts[t] ? <i key={t} style={{ flex: counts[t], background: TYPE_COLOURS[t] }} title={`${t}: ${counts[t]}`} /> : null))}
      </div>

      <div className="mo-grid">
        <div className="mo-panel">
          <div className="mo-panel-h">
            <span>WHO MEETS WHOM</span>
            <span className="mo-dim">{focus ? short(focus, 40) + ' · ' : ''}{pairs.length} meetings</span>
          </div>
          {shown.length ? (
            <>
              <div className="mo-net-wrap">
                <div className="mo-net-cols">
                  <span>REQUESTED BY</span>
                  <span>MEETING</span>
                </div>
                <Network rows={shown} focus={focus} setFocus={setFocus} />
              </div>
              <ul className="mo-pairs">
                {(more ? pairs : pairs.slice(0, 8)).map((r) => (
                  <li key={r.id} style={{ '--c': TYPE_COLOURS[r.type] }}>
                    <span className="mo-pill">{r.type}</span>
                    <span className="mo-who">
                      <b>{r.requester_org}</b>
                      <em>{r.requester_country}</em>
                      <span className="mo-arrow">↔</span>
                      <b>{r.counterpart_org}</b>
                      <em>{r.counterpart_country}</em>
                    </span>
                    <span className="mo-when">
                      D{r.day} · {fmtTime(r.starts)} · {r.venue}
                    </span>
                  </li>
                ))}
              </ul>
              {pairs.length > 8 ? (
                <button className="mo-more" onClick={() => setMore((m) => !m)}>
                  {more ? 'Show fewer' : `Show all ${pairs.length}`}
                </button>
              ) : null}
            </>
          ) : (
            <p className="mo-empty">{rows ? 'No confirmed meetings of this type yet.' : 'Loading…'}</p>
          )}
        </div>

        <div className="mo-panel">
          <div className="mo-panel-h">
            <span>BY DAY AND VENUE</span>
            <span className="mo-dim">{all.length} confirmed bookings</span>
          </div>
          <table className="mo-table">
            <thead>
              <tr>
                <th>Venue</th>
                {DAYS.map((d) => (
                  <th key={d.n}>
                    {d.label}
                    <small>{d.date}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((g) => (
                <tr key={g.v}>
                  <th>{g.v}</th>
                  {g.days.map((list, i) => {
                    const on = cell && cell[0] === g.v && cell[1] === i + 1;
                    return (
                      <td key={i}>
                        <button
                          disabled={!list.length}
                          aria-pressed={on}
                          onClick={() => setCell(on ? null : [g.v, i + 1])}
                          style={{ '--a': list.length / peak }}
                          aria-label={`${g.v}, Day ${i + 1}: ${list.length} bookings`}
                        >
                          {list.length || '·'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {!grid.length ? <p className="mo-empty">{rows ? 'Nothing confirmed yet.' : 'Loading…'}</p> : null}
          {cell ? (
            <div className="mo-cell">
              <div className="mo-panel-h">
                <span>
                  {cell[0].toUpperCase()} · DAY {cell[1]}
                </span>
                <button className="mo-x" onClick={() => setCell(null)} aria-label="Close">
                  ×
                </button>
              </div>
              {cellRows.map((r) => (
                <div key={r.id} className="mo-cell-row" style={{ '--c': TYPE_COLOURS[keyOf(r)] }}>
                  <b>{fmtTime(r.starts)}</b>
                  <span className="mo-pill">{r.kind === 'meeting' ? r.type : KIND[r.kind]?.short}</span>
                  <span>{r.kind === 'meeting' ? `${r.requester_org} ↔ ${r.counterpart_org}` : r.session_title ? `${r.session_title} · ${r.requester_org}` : r.requester_org}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mo-hint">Tap a number to see who is meeting there.</p>
          )}
        </div>
      </div>
    </div>
  );
}
