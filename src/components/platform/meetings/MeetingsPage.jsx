'use client';
// /meetings: book one-to-one meetings, conference seats, open-discussion places and rooms; follow
// each request; answer requests made to your company; and the business pass once confirmed.
import { useEffect, useMemo, useState } from 'react';
import { withBase } from '@/lib/base';
import { useStaffRole } from '@/lib/platform/hooks';
import AuthGate from '../AuthGate';
import Shell from '../Shell';
import { Loading, Tabs, useToast } from '../ui';
import BookForm from './BookForm';
import BookingCard from './BookingCard';
import BusinessPass from './BusinessPass';
import { profileOf, useMeetings } from './data';

function readQuery() {
  if (typeof location === 'undefined') return {};
  const p = new URLSearchParams(location.search);
  return Object.fromEntries(['kind', 'type', 'with', 'country', 'tab'].map((k) => [k, p.get(k) || undefined]));
}

function Inner({ user }) {
  const { data, loading, error, reload } = useMeetings(user);
  const [toast, show] = useToast();
  const [q] = useState(readQuery);
  const [tab, setTab] = useState(q.tab || (q.with || q.kind ? 'book' : null));
  const sessions = useMemo(() => Object.fromEntries((data?.sessions || []).map((s) => [s.id, s])), [data?.sessions]);
  useEffect(() => {
    if (!tab && data) setTab(data.mine.length ? 'mine' : 'book');
  }, [tab, data]);
  if (loading && !data) return <Loading />;
  if (error && !data) return <p className="pf-note bad">Couldn’t load your bookings. {String(error.message || error)}</p>;
  const go = (t) => {
    setTab(t);
    history.replaceState(null, '', '?tab=' + t);
  };
  const waiting = data.incoming.filter((b) => b.status === 'requested').length;
  const confirmed = data.mine.filter((b) => b.status === 'approved');
  const me = profileOf(data, user);
  const tabs = [
    { id: 'book', label: 'Book' },
    { id: 'mine', label: 'My bookings', n: data.mine.length || null },
    ...(data.exhibitor ? [{ id: 'incoming', label: 'Requests to me', n: waiting || null }] : []),
    { id: 'pass', label: 'Business pass', n: confirmed.length || null },
  ];
  return (
    <>
      <div className="pf-head bgx-band">
        <div>
          <span className="pf-kicker">Meetings & bookings</span>
          <h1>Meet, book, confirm</h1>
          <p>Ask for one-to-one meetings, conference seats, open discussions and rooms. The organisers confirm every booking; confirmed ones go on your business pass.</p>
        </div>
      </div>
      <Tabs tabs={tabs} value={tab || 'book'} onChange={go} />

      {tab === 'book' ? (
        <div className="pf-card">
          <BookForm user={user} data={data} initial={q} show={show} onDone={() => (reload(), go('mine'))} />
        </div>
      ) : null}

      {tab === 'mine' ? (
        data.mine.length ? (
          <div className="mt-cards">
            {data.mine.map((b) => (
              <BookingCard key={b.id} b={b} session={sessions[b.session_id]} show={show} onChange={reload} />
            ))}
          </div>
        ) : (
          <div className="pf-card pf-empty">
            <p>No bookings yet.</p>
            <button className="pf-btn orange" style={{ marginTop: 14 }} onClick={() => go('book')}>
              Make your first booking
            </button>
          </div>
        )
      ) : null}

      {tab === 'incoming' ? (
        <>
          <p className="pf-muted" style={{ marginBottom: 16 }}>
            Meeting requests to <b>{data.exhibitor.company}</b>. Accept or decline; the organisers then confirm the time and table.
          </p>
          {data.incoming.length ? (
            <div className="mt-cards">
              {data.incoming.map((b) => (
                <BookingCard key={b.id} b={b} session={sessions[b.session_id]} side="incoming" show={show} onChange={reload} />
              ))}
            </div>
          ) : (
            <p className="pf-card pf-empty">No requests yet. Make sure your company is listed so people can find you.</p>
          )}
        </>
      ) : null}

      {tab === 'pass' ? (
        data.pass ? (
          <BusinessPass pass={data.pass} bookings={data.mine} sessions={sessions} name={me.requester_name} org={me.requester_org} />
        ) : (
          <div className="pf-card">
            <span className="pf-kicker">Business pass</span>
            <h2>Issued with your first confirmed booking</h2>
            <p className="pf-muted" style={{ marginTop: 8 }}>
              Once the organisers confirm a meeting, seat or room, your business pass appears here: one QR code for the business lounges, deal rooms and sessions, with your full schedule.
            </p>
            <div className="pf-row" style={{ marginTop: 16 }}>
              <button className="pf-btn orange" onClick={() => go('book')}>
                Book something
              </button>
              <a className="pf-btn ghost" href={withBase('/me/')}>
                Visitor pass
              </a>
            </div>
          </div>
        )
      ) : null}
      {toast}
    </>
  );
}

function Frame({ user, children }) {
  const { role } = useStaffRole(user);
  return (
    <Shell title="Meetings" user={user} role={role} active="/meetings" main="pf-main">
      {children}
    </Shell>
  );
}

export default function MeetingsPage() {
  return (
    <AuthGate
      title="Meetings & bookings"
      text="Sign in with your email to request meetings, seats and rooms. We’ll send a one-time code."
      frame={(x) => (
        <Shell title="Meetings" main="pf-main narrow">
          {x}
        </Shell>
      )}
    >
      {(user) => (
        <Frame user={user}>
          <Inner user={user} />
        </Frame>
      )}
    </AuthGate>
  );
}
