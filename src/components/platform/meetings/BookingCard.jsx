'use client';
// One booking with its progress: requested → accepted (meetings with a registered exhibitor) →
// confirmed by the organisers. The requester can cancel; the exhibitor asked can accept or decline.
import { useState } from 'react';
import { STATUS_TEXT, colourOf, dayLabel, fmtTime, labelOf, whenOf } from '@/lib/platform/bookings';
import { errorText, getClient } from '@/lib/platform/client';
import { AsyncButton } from '../ui';
import './meetings.css';

const PILL = { requested: 'pending', accepted: 'changes', declined: 'rejected', approved: 'approved', rejected: 'rejected', cancelled: '' };

export function StatusPill({ status }) {
  return <span className={'pf-pill ' + (PILL[status] ?? '')}>{STATUS_TEXT[status] || status}</span>;
}

function steps(b) {
  const twoSided = b.kind === 'meeting' && b.counterpart_exhibitor_id;
  const closed = ['declined', 'rejected', 'cancelled'].includes(b.status);
  const s = [['Requested', 'done']];
  if (twoSided) s.push([b.status === 'declined' ? 'Declined' : 'Accepted', b.status === 'requested' ? 'now' : b.status === 'declined' ? 'bad' : 'done']);
  else s.push(['Organisers review', b.status === 'approved' ? 'done' : closed ? 'bad' : 'now']);
  s.push([b.status === 'rejected' ? 'Not approved' : b.status === 'cancelled' ? 'Cancelled' : 'Confirmed', b.status === 'approved' ? 'done' : closed ? 'bad' : twoSided && b.status === 'accepted' ? 'now' : '']);
  return s;
}

export default function BookingCard({ b, session, side = 'mine', show, onChange }) {
  const w = whenOf(b, session);
  const [note, setNote] = useState(b.counterpart_note || '');
  const update = async (patch, msg) => {
    try {
      const sb = await getClient();
      const { error } = await sb.from('bookings').update(patch).eq('id', b.id);
      if (error) throw error;
      show?.(msg);
      onChange?.();
    } catch (x) {
      show?.(errorText(x), true);
    }
  };
  const other = side === 'mine' ? b.counterpart_org : [b.requester_name, b.requester_org].filter(Boolean).join(' · ');
  return (
    <article className={'mt-card is-' + b.status} style={{ '--c': colourOf(b) }}>
      <div className="mt-card-top">
        <span className="mt-tag">{labelOf(b)}</span>
        <span className="pf-spacer" />
        <StatusPill status={b.status} />
      </div>
      <h3>{b.kind === 'meeting' ? (side === 'mine' ? 'With ' : 'From ') + (other || '—') : session?.title || b.title || b.room}</h3>
      {side !== 'mine' && b.requester_country ? <p className="pf-small pf-muted">{b.requester_country}{b.requester_role ? ' · ' + b.requester_role : ''}</p> : null}
      {b.purpose ? <p className="mt-purpose">{b.purpose}</p> : null}
      <dl className="mt-when">
        <dt>When</dt>
        <dd>
          {w.day ? dayLabel(w.day) : 'Day to be set'}
          {w.time ? ' · ' + fmtTime(w.time) : ''}
          {b.kind === 'meeting' || b.kind === 'room' ? ` · ${w.mins} min` : ''}
          {b.status !== 'approved' && (b.kind === 'meeting' || b.kind === 'room') ? <span className="pf-muted"> (requested)</span> : null}
        </dd>
        <dt>Where</dt>
        <dd>{b.status === 'approved' ? [w.venue, w.table].filter(Boolean).join(' · ') || 'Venue to be announced' : session ? session.venue : b.kind === 'room' ? b.room + ' (requested)' : 'Assigned on confirmation'}</dd>
        {b.party_size > 1 ? (
          <>
            <dt>{b.kind === 'meeting' ? 'Attendees' : 'Places'}</dt>
            <dd>{b.party_size}</dd>
          </>
        ) : null}
      </dl>
      <div className="pf-steps mt-steps">
        {steps(b).map(([t, c]) => (
          <div key={t} className={'pf-step ' + c}>
            {t}
          </div>
        ))}
      </div>
      {b.counterpart_note && side === 'mine' ? <div className={'pf-note ' + (b.status === 'declined' ? 'bad' : 'info')}>{b.counterpart_org}: {b.counterpart_note}</div> : null}
      {b.admin_note ? <div className={'pf-note ' + (b.status === 'rejected' ? 'bad' : 'info')}>Organisers: {b.admin_note}</div> : null}
      {side === 'mine' && ['requested', 'accepted'].includes(b.status) ? (
        <div className="pf-row" style={{ marginTop: 12 }}>
          <AsyncButton className="pf-btn ghost small" onClick={() => confirm('Cancel this booking?') && update({ status: 'cancelled' }, 'Booking cancelled')}>
            Cancel booking
          </AsyncButton>
        </div>
      ) : null}
      {side === 'incoming' && ['requested', 'accepted', 'declined'].includes(b.status) ? (
        <div style={{ marginTop: 12 }}>
          <label className="pf-field">
            <span className="pf-label">Note to {b.requester_name} (optional)</span>
            <input className="pf-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please bring your sample range" />
          </label>
          <div className="pf-row" style={{ marginTop: 10 }}>
            {b.status !== 'accepted' ? (
              <AsyncButton className="pf-btn green small" onClick={() => update({ status: 'accepted', counterpart_note: note.trim() || null }, 'Accepted. The organisers will confirm.')}>
                Accept
              </AsyncButton>
            ) : null}
            {b.status !== 'declined' ? (
              <AsyncButton className="pf-btn ghost small" style={{ color: 'var(--red)' }} onClick={() => update({ status: 'declined', counterpart_note: note.trim() || null }, 'Declined')}>
                Decline
              </AsyncButton>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
