'use client';
// The business pass: issued with a person's first confirmed booking. One QR (checked at /verify)
// and every confirmed meeting, seat and room on the back of the same card.
import BrandLogo from '@/components/BrandLogo';
import { colourOf, dayLabel, fmtTime, labelOf, whenOf } from '@/lib/platform/bookings';
import { verifyUrl } from '@/lib/platform/records';
import { QR } from '../Badge';
import './meetings.css';

export default function BusinessPass({ pass, bookings, sessions = {}, name, org }) {
  const ok = bookings
    .filter((b) => b.status === 'approved')
    .map((b) => ({ b, w: whenOf(b, sessions[b.session_id]) }))
    .sort((x, y) => (x.w.day || 9) - (y.w.day || 9) || String(x.w.time).localeCompare(String(y.w.time)));
  return (
    <div className="mt-pass">
      <div className="pf-badge is-biz">
        <div className="pf-badge-top">
          <BrandLogo />
          <span className="mt-pass-kind">Business pass</span>
        </div>
        <div className="pf-badge-band" />
        <div className="pf-badge-body">
          <div className="pf-badge-name">{name || pass.holder_name}</div>
          <div className="pf-badge-org">{org || pass.holder_org}</div>
          <div className="pf-badge-cat" style={{ background: '#FFED00' }}>
            {ok.length} confirmed {ok.length === 1 ? 'booking' : 'bookings'}
          </div>
          <ul className="mt-pass-list">
            {ok.slice(0, 3).map(({ b, w }) => (
              <li key={b.id}>
                <i style={{ background: colourOf(b) }} />
                <span>
                  D{w.day} {fmtTime(w.time)} · {labelOf(b)}
                </span>
              </li>
            ))}
            {ok.length > 3 ? <li className="more">+ {ok.length - 3} more</li> : null}
          </ul>
          <QR text={verifyUrl(pass.code)} />
          <div className="pf-badge-code">{pass.code}</div>
        </div>
      </div>
      <div className="mt-pass-sched">
        <span className="pf-kicker">Your confirmed schedule</span>
        {ok.map(({ b, w }) => (
          <div key={b.id} className="mt-sched-row" style={{ '--c': colourOf(b) }}>
            <div className="mt-sched-time">
              <b>{fmtTime(w.time) || '—'}</b>
              <span>{w.day ? dayLabel(w.day).split(' · ')[0] : ''}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="mt-tag">{labelOf(b)}</span>
              <h4>{b.kind === 'meeting' ? 'With ' + b.counterpart_org : sessions[b.session_id]?.title || b.title || b.room}</h4>
              <p className="pf-small pf-muted">
                {[w.venue, w.table].filter(Boolean).join(' · ')}
                {w.mins ? ` · ${w.mins} min` : ''}
                {b.party_size > 1 ? ` · ${b.party_size} people` : ''}
              </p>
            </div>
          </div>
        ))}
        <p className="pf-help">Show the QR at the business lounges and deal rooms. Staff scanning it see this schedule.</p>
      </div>
    </div>
  );
}
