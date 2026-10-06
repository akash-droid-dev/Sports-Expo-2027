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

/** Company ↔ company, the busiest ten on each side (desktop). */
function Network({ rows, focus, setFocus }) {
  const top = (key) => {
    const n = {};
    rows.forEach((r) => (n[r[key]] = (n[r[key]] || 0) + 1));
    return Object.keys(n).sort((a, b) => n[b] - n[a] || a.localeCompare(b)).slice(0, 10);
  };
  const left = top('requester_org');
  const right = top('counterpart_org');
  const shown = rows.filter((r) => left.includes(r.requester_org) && right.includes(r.counterpart_org));
  const ROW = 24;
  const H = Math.max(left.length, right.length) * ROW + 8;
  const y = (list, name) => 12 + list.indexOf(name) * ((H - 24) / Math.max(1, list.length - 1));
  const lit = (r) => !focus || r.requester_org === focus || r.counterpart_org === focus;
  const node = (n, side) => {
    const on = !focus || focus === n || shown.some((r) => (side === 'l' ? r.requester_org : r.counterpart_org) === n && lit(r));
    return (
      <g
        key={side + n}
        className="mo-node"
        transform={`translate(${side === 'l' ? 236 : 484} ${side === 'l' ? y(left, n) : y(right, n)})`}
        onMouseEnter={() => setFocus(n)}
        onMouseLeave={() => setFocus(null)}
        onClick={() => setFocus(focus === n ? null : n)}
        opacity={on ? 1 : 0.3}
      >
        <circle r="3.5" />
        <text x={side === 'l' ? -10 : 10} dy="3.5" textAnchor={side === 'l' ? 'end' : 'start'}>
          {short(n, 32)}
        </text>
      </g>
    );
  };
  return (
    <svg className="mo-net" viewBox={`0 0 720 ${H}`} role="img" aria-label="Who meets whom: confirmed meetings between companies">
      {shown.map((r) => {
        const y1 = y(left, r.requester_org);
        const y2 = y(right, r.counterpart_org);
        return (
          <path
            key={r.id}
            d={`M 240 ${y1} C 360 ${y1}, 360 ${y2}, 480 ${y2}`}
            stroke={TYPE_COLOURS[r.type] || '#8A8780'}
            strokeWidth={lit(r) ? 1.6 : 1}
            strokeOpacity={lit(r) ? 0.75 : 0.1}
            fill="none"
          />
        );
      })}
      {left.map((n) => node(n, 'l'))}
      {right.map((n) => node(n, 'r'))}
    </svg>
  );
}

export default function MeetingsOverview() {
  const { rows, error } = useBoard();
  const [type, setType] = useState('all');
  const [tab, setTab] = useState('who');
  const [focus, setFocus] = useState(null);
  const [cell, setCell] = useState(null);
  const [more, setMore] = useState(false);
  const all = rows || [];
  const meetings = all.filter((r) => r.kind === 'meeting');
  const shown = useMemo(() => meetings.filter((r) => type === 'all' || r.type === type), [meetings, type]);
  const counts = Object.fromEntries(TYPES.map((t) => [t, meetings.filter((r) => r.type === t).length]));
  const orgs = new Set(meetings.flatMap((r) => [r.requester_org, r.counterpart_org]));
  const countries = new Set(all.flatMap((r) => [r.requester_country, r.counterpart_country]).filter(Boolean));
  const places = all.filter((r) => r.kind !== 'meeting').length;
  const venues = [...VENUES.map((v) => v.id), ...new Set(all.map((r) => r.venue).filter((v) => v && !VENUES.some((x) => x.id === v)))];
  const grid = venues.map((v) => ({ v, days: DAYS.map((d) => all.filter((r) => r.venue === v && r.day === d.n)) })).filter((g) => g.days.some((d) => d.length));
  const peak = Math.max(1, ...grid.flatMap((g) => g.days.map((d) => d.length)));
  const sample = all.some((r) => r.sample);
  const pairs = focus ? shown.filter((r) => r.requester_org === focus || r.counterpart_org === focus) : shown;
  const cellRows = cell ? all.filter((r) => r.venue === cell[0] && r.day === cell[1]) : [];
  const pick = (t) => () => (setType(t), setFocus(null), setMore(false));

  return (
    <div className="mo">
      <div className="mo-head">
        <h2>03 — Meetings</h2>
        <div className="mo-head-r">
          <span className="mo-live">
            <i /> Live · confirmed by the organisers{sample ? ' · sample data' : ''}
          </span>
          <a className="mo-cta" href={withBase('/meetings/')}>
            Book a meeting <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="mo-card">
        {error && !rows ? <p className="mo-empty">Live meeting data is unavailable right now.</p> : null}
        <dl className="mo-stats">
          {[
            [meetings.length, 'meetings'],
            [orgs.size, 'companies'],
            [countries.size, 'countries'],
            [places, 'seats & rooms'],
          ].map(([n, t]) => (
            <div key={t}>
              <dt>{rows ? n : '–'}</dt>
              <dd>{t}</dd>
            </div>
          ))}
        </dl>

        <div className="mo-bar" aria-hidden="true">
          {TYPES.map((t) => (counts[t] ? <i key={t} style={{ flex: counts[t], background: TYPE_COLOURS[t], opacity: type === 'all' || type === t ? 1 : 0.25 }} /> : null))}
        </div>
        <div className="mo-legend" role="tablist" aria-label="Meeting type">
          <button role="tab" aria-selected={type === 'all'} onClick={pick('all')}>
            All <b>{meetings.length}</b>
          </button>
          {TYPES.map((t) => (
            <button key={t} role="tab" aria-selected={type === t} onClick={pick(t)} style={{ '--c': TYPE_COLOURS[t] }} disabled={!counts[t]}>
              <i />
              {t} <b>{counts[t] || 0}</b>
            </button>
          ))}
        </div>

        <div className="mo-tabs" role="tablist" aria-label="View">
          <button role="tab" aria-selected={tab === 'who'} onClick={() => setTab('who')}>
            Who meets whom
          </button>
          <button role="tab" aria-selected={tab === 'grid'} onClick={() => setTab('grid')}>
            By day & venue
          </button>
        </div>

        {tab === 'who' ? (
          shown.length ? (
            <div className="mo-who-panel">
              <div className="mo-net-wrap">
                <div className="mo-net-cols">
                  <span>Requested by</span>
                  <span>Meeting</span>
                </div>
                <Network rows={shown} focus={focus} setFocus={setFocus} />
              </div>
              <div className="mo-list">
                <ul className="mo-pairs">
                  {(more ? pairs : pairs.slice(0, 5)).map((r) => (
                    <li key={r.id} style={{ '--c': TYPE_COLOURS[r.type] }}>
                      <i />
                      <span className="mo-who">
                        {r.requester_org} <em>↔</em> {r.counterpart_org}
                      </span>
                      <span className="mo-meta">
                        {r.type} · D{r.day} {fmtTime(r.starts)}
                      </span>
                    </li>
                  ))}
                </ul>
                {pairs.length > 5 ? (
                  <button className="mo-more" onClick={() => setMore((m) => !m)}>
                    {more ? 'Show fewer' : `View all ${pairs.length}`}
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mo-empty">{rows ? 'No confirmed meetings of this type yet.' : 'Loading…'}</p>
          )
        ) : (
          <div className="mo-grid-panel">
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
                          <button disabled={!list.length} aria-pressed={on} onClick={() => setCell(on ? null : [g.v, i + 1])} style={{ '--a': list.length / peak }} aria-label={`${g.v}, Day ${i + 1}: ${list.length} bookings`}>
                            {list.length || ''}
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
                <div className="mo-cell-h">
                  <span>
                    {cell[0]} · Day {cell[1]}
                  </span>
                  <button className="mo-x" onClick={() => setCell(null)} aria-label="Close">
                    ×
                  </button>
                </div>
                {cellRows.map((r) => (
                  <div key={r.id} className="mo-cell-row" style={{ '--c': TYPE_COLOURS[keyOf(r)] }}>
                    <b>{fmtTime(r.starts)}</b>
                    <i />
                    <span>{r.kind === 'meeting' ? `${r.requester_org} ↔ ${r.counterpart_org}` : r.session_title ? `${r.session_title} · ${r.requester_org}` : `${KIND[r.kind]?.short} · ${r.requester_org}`}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mo-hint">Tap a number to see who meets there.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
