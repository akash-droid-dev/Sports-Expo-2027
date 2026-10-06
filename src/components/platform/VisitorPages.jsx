'use client';
// /register (visitor registration) and /me (the visitor's own dashboard with their card).
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import { useLive, useStaffRole } from '@/lib/platform/hooks';
import { loadFields } from '@/lib/platform/records';
import AuthGate from './AuthGate';
import Badge from './Badge';
import Shell from './Shell';
import VisitorForm from './VisitorForm';
import { Loading, Pill, fmtDate } from './ui';

function useVisitor(user) {
  return useLive(
    user?.id ?? null,
    async (sb) => {
      const [v, f, x] = await Promise.all([
        sb.from('visitors').select('*').eq('user_id', user.id).maybeSingle(),
        loadFields(sb, 'visitor'),
        sb.from('exhibitors').select('id,company,status').eq('owner_id', user.id).maybeSingle(),
      ]);
      if (v.error) throw v.error;
      return { visitor: v.data, fields: f, exhibitor: x.data };
    },
    user ? [{ table: 'visitors', filter: 'user_id=eq.' + user.id }, { table: 'form_fields' }] : [],
  );
}

function Frame({ user, active, children, main }) {
  const { role } = useStaffRole(user);
  return (
    <Shell title={active === '/me' ? 'My pass' : 'Register to visit'} user={user} role={role} active={active} main={main}>
      {children}
    </Shell>
  );
}

function RegisterInner({ user }) {
  const { data, loading, error, reload } = useVisitor(user);
  useEffect(() => {
    if (data?.visitor) location.replace(withBase('/me/'));
  }, [data]);
  if (loading && !data) return <Loading />;
  if (error && !data) return <p className="pf-note bad">Couldn’t load the form. {String(error.message || error)}</p>;
  if (data.visitor) return <Loading />;
  return (
    <>
      <div className="pf-head bgx-band">
        <div>
          <span className="pf-kicker">Visitor registration</span>
          <h1>Register to visit</h1>
          <p>Three short steps: your details, a photo for your card and an ID. The organisers review every registration; approved visitors get their accreditation card here.</p>
        </div>
      </div>
      <div className="pf-card">
        <VisitorForm user={user} fields={data.fields} onDone={() => (reload(), location.replace(withBase('/me/')))} />
      </div>
    </>
  );
}

export function RegisterPage() {
  return (
    <AuthGate
      title="Register to visit"
      text="Start with your email. We’ll send a one-time code to confirm it’s you, then you fill in a short form."
      frame={(x) => (
        <Shell title="Register to visit" main="pf-main narrow">
          {x}
        </Shell>
      )}
    >
      {(user) => (
        <Frame user={user} active="/register" main="pf-main narrow">
          <RegisterInner user={user} />
        </Frame>
      )}
    </AuthGate>
  );
}

const STATUS_TEXT = {
  pending: ['Your registration is with the organisers', 'You’ll see your card here as soon as it’s approved. This page updates by itself.'],
  changes: ['Please update your registration', 'The organisers asked for a change. Edit your details below and submit again.'],
  approved: ['You’re accredited', 'Show the QR code at the entrance. Save it as a PDF or print it for a paper copy.'],
  rejected: ['Your registration wasn’t approved', 'Contact the organisers if you think this is a mistake.'],
};

function MeInner({ user }) {
  const { data, loading, error, reload } = useVisitor(user);
  const [editing, setEditing] = useState(false);
  if (loading && !data) return <Loading />;
  if (error && !data) return <p className="pf-note bad">Couldn’t load your registration. {String(error.message || error)}</p>;
  const v = data.visitor;
  if (!v) {
    return (
      <>
        <div className="pf-head bgx-band">
          <div>
            <span className="pf-kicker">Welcome</span>
            <h1>What brings you to the Expo?</h1>
            <p>Signed in as {user.email}. Choose how you’re taking part.</p>
          </div>
        </div>
        <div className="pf-grid two">
          <a className="pf-card" href={withBase('/register/')} style={{ textDecoration: 'none' }}>
            <span className="pf-kicker">Visitor · Buyer · Media · Delegate</span>
            <h2>Register to visit</h2>
            <p className="pf-muted" style={{ margin: '8px 0 18px' }}>
              A short form with a photo and ID. Get your accreditation card with a QR code once approved.
            </p>
            <span className="pf-btn orange">Register</span>
          </a>
          <a className="pf-card" href={withBase(data.exhibitor ? '/portal/' : '/portal/register/')} style={{ textDecoration: 'none' }}>
            <span className="pf-kicker">Companies · Pavilions · Startups</span>
            <h2>{data.exhibitor ? 'Open your exhibitor portal' : 'Register as an exhibitor'}</h2>
            <p className="pf-muted" style={{ margin: '8px 0 18px' }}>
              {data.exhibitor ? data.exhibitor.company : 'Your company dashboard opens as soon as you register: profile, products, team and documents.'}
            </p>
            <span className="pf-btn">{data.exhibitor ? 'Open portal' : 'Register company'}</span>
          </a>
        </div>
      </>
    );
  }
  const [head, sub] = STATUS_TEXT[v.status] || ['', ''];
  const canEdit = v.status === 'pending' || v.status === 'changes';
  const steps = [
    ['Registered', 'done'],
    ['Review', v.status === 'pending' || v.status === 'changes' ? 'now' : 'done'],
    [v.status === 'rejected' ? 'Not approved' : 'Card issued', v.status === 'approved' ? 'done' : ''],
  ];
  return (
    <>
      <div className="pf-head bgx-band">
        <div>
          <span className="pf-kicker">My pass</span>
          <h1>Hello, {v.full_name.split(' ')[0]}</h1>
        </div>
        {data.exhibitor ? (
          <a className="pf-btn ghost" href={withBase('/portal/')}>
            Exhibitor portal →
          </a>
        ) : null}
      </div>
      <div className="pf-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', alignItems: 'start' }}>
        <div>
          <Badge visitor={v} />
          {v.status === 'approved' ? (
            <div className="pf-row" style={{ justifyContent: 'center', marginTop: 20 }}>
              <button className="pf-btn" onClick={() => print()}>
                Save as PDF / print
              </button>
            </div>
          ) : null}
        </div>
        <div>
          <div className="pf-card">
            <div className="pf-card-head">
              <h2>{head}</h2>
              <Pill status={v.status} />
            </div>
            <p className="pf-muted">{sub}</p>
            <div className="pf-steps" style={{ marginTop: 22 }}>
              {steps.map(([t, c]) => (
                <div key={t} className={'pf-step ' + c}>
                  {t}
                </div>
              ))}
            </div>
            {v.admin_note && v.status !== 'approved' ? (
              <div className={'pf-note ' + (v.status === 'rejected' ? 'bad' : 'info')} style={{ marginTop: 20 }}>
                <b>Message from the organisers:</b> {v.admin_note}
              </div>
            ) : null}
          </div>
          <div className="pf-card">
            <div className="pf-card-head">
              <h2>Your details</h2>
              {canEdit && !editing ? (
                <button className="pf-btn small ghost" onClick={() => setEditing(true)}>
                  Edit
                </button>
              ) : null}
            </div>
            {editing ? (
              <VisitorForm user={user} fields={data.fields} row={v} onDone={() => (setEditing(false), reload())} onCancel={() => setEditing(false)} />
            ) : (
              <dl className="pf-kv">
                <dt>Email</dt>
                <dd>{v.email}</dd>
                {data.fields
                  .filter((f) => f.type !== 'image' && f.type !== 'file')
                  .map((f) => {
                    const val = f.key in v ? v[f.key] : v.answers?.[f.key];
                    if (val === undefined || val === null || val === '' || (Array.isArray(val) && !val.length)) return null;
                    return [<dt key={f.key + 't'}>{f.label}</dt>, <dd key={f.key + 'd'}>{Array.isArray(val) ? val.join(', ') : val === true ? 'Yes' : String(val)}</dd>];
                  })}
                <dt>Registered</dt>
                <dd>{fmtDate(v.created_at)}</dd>
              </dl>
            )}
            {!canEdit ? <p className="pf-help" style={{ marginTop: 16 }}>Reviewed registrations are locked. Contact the organisers to change them.</p> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export function MePage() {
  return (
    <AuthGate
      title="My pass"
      text="Sign in with the email you registered with. We’ll send a one-time code."
      frame={(x) => (
        <Shell title="My pass" main="pf-main">
          {x}
        </Shell>
      )}
    >
      {(user) => (
        <Frame user={user} active="/me">
          <MeInner user={user} />
        </Frame>
      )}
    </AuthGate>
  );
}
