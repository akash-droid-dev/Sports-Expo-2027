'use client';
// /admin: the Super Admin panel. Who sees what is decided by the staff role; the database
// enforces the same rules (supabase/migrations).
import { useEffect, useState } from 'react';
import { can, useStaffRole } from '@/lib/platform/hooks';
import AuthGate from '../AuthGate';
import Shell from '../Shell';
import { Loading, useToast } from '../ui';
import Catalog from './Catalog';
import Exhibitors from './Exhibitors';
import Forms from './Forms';
import Media from './Media';
import Meetings from './Meetings';
import Overview from './Overview';
import PageEdits from './PageEdits';
import Staff from './Staff';
import Visitors from './Visitors';

const SECTIONS = [
  ['People', [['overview', 'Overview'], ['visitors', 'Visitors'], ['exhibitors', 'Exhibitors'], ['meetings', 'Meetings']]],
  ['Website', [['pages', 'Edit pages'], ['catalog', 'Website content'], ['media', 'Media library']]],
  ['Settings', [['forms', 'Registration forms', 'admin'], ['staff', 'Team & roles']]],
];

function Panel({ user }) {
  const { role, loading } = useStaffRole(user);
  const [section, setSection] = useState('overview');
  const [toast, show] = useToast();
  useEffect(() => {
    const h = location.hash.slice(1);
    if (h) setSection(h);
  }, []);
  const go = (s) => {
    setSection(s);
    history.replaceState(null, '', '#' + s);
    scrollTo(0, 0);
  };
  if (loading) return <Loading />;
  if (!role) {
    return (
      <div className="pf-main narrow">
        <div className="pf-card">
          <span className="pf-kicker">Admin</span>
          <h1 style={{ fontSize: 30 }}>No admin access</h1>
          <p className="pf-muted" style={{ marginTop: 10 }}>
            {user.email} isn’t on the organisers’ team. Ask an admin to invite this email, then reload this page.
          </p>
        </div>
      </div>
    );
  }
  const props = { role, show, me: user.email.toLowerCase(), go };
  return (
    <div className="pf-admin">
      <nav className="pf-side" aria-label="Admin sections">
        {SECTIONS.map(([h, items]) => [
          <h4 key={h}>{h}</h4>,
          ...items
            .filter(([, , min]) => !min || can(role, 'viewer'))
            .map(([id, label]) => (
              <button key={id} aria-current={section === id} onClick={() => go(id)}>
                {label}
              </button>
            )),
        ])}
        <h4>You</h4>
        <p className="pf-small pf-muted" style={{ padding: '0 14px' }}>
          {user.email}
          <br />
          Role: <b style={{ color: 'var(--ink)' }}>{role}</b>
        </p>
      </nav>
      <div className="pf-admin-body">
        {section === 'overview' ? <Overview {...props} /> : null}
        {section === 'visitors' ? <Visitors {...props} /> : null}
        {section === 'exhibitors' ? <Exhibitors {...props} /> : null}
        {section === 'meetings' ? <Meetings {...props} /> : null}
        {section === 'pages' ? <PageEdits {...props} /> : null}
        {section === 'catalog' ? <Catalog {...props} /> : null}
        {section === 'media' ? <Media {...props} /> : null}
        {section === 'forms' ? <Forms {...props} /> : null}
        {section === 'staff' ? <Staff {...props} /> : null}
      </div>
      {toast}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGate
      title="Admin sign in"
      text="For the organisers’ team. Enter your email and we’ll send a one-time code."
      frame={(x) => (
        <Shell title="Admin" main="">
          {x}
        </Shell>
      )}
    >
      {(user) => (
        <AdminShell user={user}>
          <Panel user={user} />
        </AdminShell>
      )}
    </AuthGate>
  );
}

function AdminShell({ user, children }) {
  const { role } = useStaffRole(user);
  return (
    <Shell title="Super Admin" user={user} role={role} active="/admin" main="">
      {children}
    </Shell>
  );
}
