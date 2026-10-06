'use client';
// Staff and roles. Owner: everything, can't be removed. Admin: everything including approvals,
// forms and staff. Editor: website content, exhibitors, programme, media. Viewer: read-only.
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import RecordDrawer from '../RecordDrawer';
import { Loading, Pill, fmtDate } from '../ui';
import { useState } from 'react';

const ROLES = ['admin', 'editor', 'viewer'];
const ROLE_TEXT = {
  owner: 'Everything; can’t be removed',
  admin: 'Everything: approvals, forms, staff',
  editor: 'Website content, exhibitors, programme, media',
  viewer: 'Can look, can’t change',
};

// Owner only: the shared test sign-in code (no emails) or real email codes.
function SignInSetting({ show }) {
  const { data, reload } = useLive(
    'settings',
    async (sb) => {
      const { data, error } = await sb.from('app_settings').select('key,value').in('key', ['sign_in', 'test_code']);
      if (error) throw error;
      return Object.fromEntries(data.map((r) => [r.key, r.value]));
    },
    [{ table: 'app_settings' }],
  );
  const [code, setCode] = useState('');
  if (!data) return null;
  const on = data.sign_in?.test_code !== false;
  const save = async (patch, msg) => {
    try {
      const sb = await getClient();
      for (const [key, value] of Object.entries(patch)) {
        const { error } = await sb.from('app_settings').update({ value, updated_by: null }).eq('key', key);
        if (error) throw error;
      }
      show(msg);
      reload();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <div className="pf-card" style={{ marginBottom: 22 }}>
      <div className="pf-card-head">
        <h2>Sign-in codes</h2>
        <Pill status={on ? 'pending' : 'approved'}>{on ? 'Test code on' : 'Email codes'}</Pill>
      </div>
      <p className="pf-muted" style={{ marginBottom: 16 }}>
        {on
          ? `Test mode: no emails are sent and every email address signs in with the code ${data.test_code?.code || '123456'}. Anyone who knows an address can sign in as that person (including the team), so switch to email codes before going live.`
          : 'Each person gets a one-time code by email. Needs the email sender (SMTP) set up in Supabase.'}
      </p>
      <div className="pf-row">
        <button className="pf-btn" onClick={() => save({ sign_in: { test_code: !on } }, on ? 'Email codes on' : 'Test code on')}>
          {on ? 'Switch to email codes' : 'Use the test code again'}
        </button>
        {on ? (
          <>
            <input className="pf-input" style={{ maxWidth: 160 }} inputMode="numeric" maxLength={6} placeholder={data.test_code?.code || '123456'} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
            <button className="pf-btn ghost" disabled={code.length !== 6} onClick={() => (save({ test_code: { code } }, 'Test code changed'), setCode(''))}>
              Change code
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function Staff({ role, me, show }) {
  const [edit, setEdit] = useState(null);
  const admin = can(role, 'admin');
  const { data, loading } = useLive(
    'staff',
    async (sb) => {
      const { data, error } = await sb.from('staff').select('*').order('created_at');
      if (error) throw error;
      return data;
    },
    [{ table: 'staff' }],
  );
  if (loading && !data) return <Loading />;
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Team & roles</h1>
          <p>People who can use this panel. They sign in at /admin with their email and a one-time code.</p>
        </div>
        {admin ? (
          <button className="pf-btn orange" onClick={() => setEdit({})}>
            + Invite
          </button>
        ) : null}
      </div>
      {role === 'owner' ? <SignInSetting show={show} /> : null}
      <div className="pf-grid four" style={{ marginBottom: 22 }}>
        {Object.entries(ROLE_TEXT).map(([r, t]) => (
          <div key={r} className="pf-card" style={{ padding: 18 }}>
            <Pill>{r}</Pill>
            <p className="pf-small pf-muted" style={{ marginTop: 8 }}>
              {t}
            </p>
          </div>
        ))}
      </div>
      <div className="pf-card">
        <div className="pf-table-wrap">
          <table className="pf-table">
            <tbody>
              {(data || []).map((s) => (
                <tr key={s.email} className={admin && s.role !== 'owner' ? 'click' : ''} onClick={() => admin && s.role !== 'owner' && setEdit({ row: s })}>
                  <td>
                    <b>{s.name || s.email}</b>
                    <div className="pf-small pf-muted">{s.email}</div>
                  </td>
                  <td>
                    <Pill status={s.role === 'owner' ? 'approved' : ''}>{s.role}</Pill> {s.email === me ? <span className="pf-small pf-muted">(you)</span> : null}
                  </td>
                  <td className="pf-small pf-muted">{s.invited_by ? 'Invited by ' + s.invited_by + ' · ' : ''}{fmtDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {edit ? (
        <RecordDrawer
          title={edit.row ? edit.row.email : 'Invite to the admin panel'}
          fields={[
            ...(edit.row ? [] : [{ key: 'email', label: 'Email', type: 'email', required: true }]),
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'role', label: 'Role', type: 'select', options: ROLES, required: true, help: 'Admin: everything. Editor: content and exhibitors. Viewer: read-only.' },
          ]}
          initial={edit.row ? { ...edit.row } : { role: 'editor' }}
          saveLabel={edit.row ? 'Save' : 'Invite'}
          onClose={() => setEdit(null)}
          onSave={async (v) => {
            const sb = await getClient();
            if (edit.row) {
              const { error } = await sb.from('staff').update({ role: v.role, name: v.name || null }).eq('email', edit.row.email);
              if (error) throw error;
              show('Role updated');
            } else {
              const email = v.email.trim().toLowerCase();
              const { error } = await sb.from('staff').insert({ email, role: v.role, name: v.name || null, invited_by: me });
              if (error) throw error;
              show('Invited · they can sign in at /admin with ' + email);
            }
          }}
          onDelete={
            edit.row
              ? async () => {
                  const sb = await getClient();
                  const { error } = await sb.from('staff').delete().eq('email', edit.row.email);
                  if (error) throw new Error(errorText(error));
                  show('Removed from the team');
                }
              : null
          }
        />
      ) : null}
    </>
  );
}
