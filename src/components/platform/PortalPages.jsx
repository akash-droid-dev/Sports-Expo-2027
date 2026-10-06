'use client';
// /portal/register (exhibitor registration) and /portal (the exhibitor's own dashboard). The
// dashboard opens as soon as the company is registered; admins allocate the stall, decide when
// it is listed on the website and can suspend it.
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import { errorText, getClient } from '@/lib/platform/client';
import { useLive, useStaffRole } from '@/lib/platform/hooks';
import { loadFields } from '@/lib/platform/records';
import { extOf, privateUrl, publicUrl, removeFile, upload } from '@/lib/platform/storage';
import AuthGate from './AuthGate';
import ExhibitorForm from './ExhibitorForm';
import RecordDrawer from './RecordDrawer';
import Shell from './Shell';
import { Loading, Pill, Tabs, fmtDate, useToast } from './ui';

export const PRODUCT_FIELDS = [
  { key: 'name', label: 'Product name', type: 'text', required: true },
  { key: 'category', label: 'Sport / category', type: 'text', placeholder: 'e.g. Football' },
  { key: 'type', label: 'Type', type: 'select', options: ['Equipment', 'Apparel', 'Footwear', 'Surface', 'Infrastructure', 'Software', 'Sports Science', 'Service', 'Other'] },
  { key: 'moq', label: 'Minimum order', type: 'text', placeholder: 'e.g. MOQ 500' },
  { key: 'tag', label: 'Highlight', type: 'text', placeholder: 'e.g. Export ready' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'image', label: 'Photo', type: 'image' },
  { key: 'listed', label: 'Listed', type: 'checkbox', placeholder: 'Show this product on the website' },
];
export const TEAM_FIELDS = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'text', placeholder: 'e.g. Sales head' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
];
export const DOC_KINDS = ['Company registration', 'GST certificate', 'Stall design', 'Insurance', 'Product catalogue', 'Other'];
const DOC_FIELDS = [
  { key: 'kind', label: 'Document', type: 'select', options: DOC_KINDS, required: true },
  { key: 'file', label: 'File', type: 'file', required: true },
];

export async function saveProduct(sb, exhibitorId, row, values, files) {
  const data = {
    name: values.name?.trim(),
    category: values.category || null,
    type: values.type || null,
    moq: values.moq || null,
    tag: values.tag || null,
    description: values.description || null,
    listed: !!values.listed,
  };
  let id = row?.id;
  if (id) {
    const { error } = await sb.from('products').update(data).eq('id', id);
    if (error) throw error;
  } else {
    const { data: made, error } = await sb.from('products').insert({ ...data, exhibitor_id: exhibitorId }).select('id').single();
    if (error) throw error;
    id = made.id;
  }
  if (files.image) {
    const path = await upload('exhibitors', `${exhibitorId}/products/${id}-${Date.now()}.jpg`, files.image);
    const { error } = await sb.from('products').update({ image_path: path }).eq('id', id);
    if (error) throw error;
    if (row?.image_path) removeFile('exhibitors', row.image_path);
  }
}

function useExhibitor(user) {
  return useLive(
    user?.id ?? null,
    async (sb) => {
      const { data: ex, error } = await sb.from('exhibitors').select('*').eq('owner_id', user.id).maybeSingle();
      if (error) throw error;
      const fields = await loadFields(sb, 'exhibitor');
      if (!ex) return { ex: null, fields };
      const [p, t, d] = await Promise.all([
        sb.from('products').select('*').eq('exhibitor_id', ex.id).order('sort').order('created_at'),
        sb.from('exhibitor_team').select('*').eq('exhibitor_id', ex.id).order('created_at'),
        sb.from('exhibitor_documents').select('*').eq('exhibitor_id', ex.id).order('created_at', { ascending: false }),
      ]);
      return { ex, fields, products: p.data || [], team: t.data || [], docs: d.data || [] };
    },
    user
      ? [
          { table: 'exhibitors', filter: 'owner_id=eq.' + user.id },
          { table: 'products' },
          { table: 'exhibitor_team' },
          { table: 'exhibitor_documents' },
          { table: 'form_fields' },
        ]
      : [],
  );
}

function Frame({ user, children, title = 'Exhibitor portal', main }) {
  const { role } = useStaffRole(user);
  return (
    <Shell title={title} user={user} role={role} active="/portal" main={main}>
      {children}
    </Shell>
  );
}

function RegisterInner({ user }) {
  const { data, loading, error } = useExhibitor(user);
  useEffect(() => {
    if (data?.ex) location.replace(withBase('/portal/'));
  }, [data]);
  if (loading && !data) return <Loading />;
  if (error && !data) return <p className="pf-note bad">Couldn’t load the form. {String(error.message || error)}</p>;
  if (data.ex) return <Loading />;
  return (
    <>
      <div className="pf-head">
        <div>
          <span className="pf-kicker">Exhibitor registration</span>
          <h1>Register your company</h1>
          <p>Your exhibitor portal opens straight after this: add products, your team and documents. The organisers allocate your stall.</p>
        </div>
      </div>
      <div className="pf-card">
        <ExhibitorForm user={user} fields={data.fields} onDone={() => location.replace(withBase('/portal/'))} />
      </div>
    </>
  );
}

export function PortalRegisterPage() {
  return (
    <AuthGate
      title="Register as an exhibitor"
      text="Start with your work email. We’ll send a one-time code, then you fill in your company details."
      frame={(x) => (
        <Shell title="Exhibitor registration" main="pf-main narrow">
          {x}
        </Shell>
      )}
    >
      {(user) => (
        <Frame user={user} title="Exhibitor registration" main="pf-main narrow">
          <RegisterInner user={user} />
        </Frame>
      )}
    </AuthGate>
  );
}

function DocLink({ path, children }) {
  return (
    <button
      className="pf-link"
      onClick={async () => {
        const w = window.open('', '_blank');
        try {
          const url = await privateUrl(path);
          if (w) w.location.href = url;
        } catch {
          w?.close();
        }
      }}
    >
      {children}
    </button>
  );
}

function Overview({ ex, products, team, docs, go }) {
  const checks = [
    ['Company logo', !!ex.logo_path, 'profile'],
    ['About the company', !!ex.description, 'profile'],
    ['At least one product', products.length > 0, 'products'],
    ['Team members', team.length > 0, 'team'],
    ['Documents', docs.length > 0, 'docs'],
  ];
  const done = checks.filter((c) => c[1]).length;
  return (
    <div className="pf-grid two" style={{ alignItems: 'start' }}>
      <div className="pf-card">
        <span className="pf-kicker">Your stall</span>
        <h2 style={{ fontSize: 34 }}>{ex.stall_code || 'To be allocated'}</h2>
        <dl className="pf-kv" style={{ marginTop: 18 }}>
          <dt>Zone</dt>
          <dd>{ex.zone || '—'}</dd>
          <dt>Stall product</dt>
          <dd>{ex.stall_product || '—'}</dd>
          <dt>Preferred area</dt>
          <dd>{ex.preferred_location || '—'}</dd>
          <dt>Website listing</dt>
          <dd>{ex.listed ? <Pill status="listed" /> : <Pill status="pending">Not listed yet</Pill>}</dd>
          <dt>Registered</dt>
          <dd>{fmtDate(ex.created_at)}</dd>
        </dl>
        {ex.admin_note ? (
          <div className="pf-note info" style={{ marginTop: 18 }}>
            <b>From the organisers:</b> {ex.admin_note}
          </div>
        ) : null}
      </div>
      <div className="pf-card">
        <div className="pf-card-head">
          <h2>Profile {Math.round((done / checks.length) * 100)}% complete</h2>
        </div>
        <div style={{ height: 8, borderRadius: 8, background: 'var(--paper)', overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ width: (done / checks.length) * 100 + '%', height: '100%', background: 'var(--green)', transition: 'width .6s' }} />
        </div>
        {checks.map(([t, ok, tab]) => (
          <button key={t} onClick={() => go(tab)} className="pf-row" style={{ width: '100%', padding: '12px 0', border: 0, borderTop: '1px solid var(--line)', background: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center', background: ok ? 'var(--green)' : 'var(--paper)', color: '#fff', fontSize: 13 }}>{ok ? '✓' : ''}</span>
            <span style={{ flex: 1 }}>{t}</span>
            <span className="pf-muted">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PortalInner({ user }) {
  const { data, loading, error, reload } = useExhibitor(user);
  const [tab, setTab] = useState('overview');
  const [edit, setEdit] = useState(null);
  const [toast, show] = useToast();
  if (loading && !data) return <Loading />;
  if (error && !data) return <p className="pf-note bad">Couldn’t load your portal. {String(error.message || error)}</p>;
  const { ex } = data;
  if (!ex) {
    return (
      <div className="pf-card" style={{ maxWidth: 640, margin: '6vh auto 0' }}>
        <span className="pf-kicker">Exhibitor portal</span>
        <h1 style={{ fontSize: 32 }}>Register your company first</h1>
        <p className="pf-muted" style={{ margin: '10px 0 22px' }}>
          Your exhibitor dashboard opens as soon as your company is registered. Signed in as {user.email}.
        </p>
        <a className="pf-btn orange" href={withBase('/portal/register/')}>
          Register as an exhibitor
        </a>
      </div>
    );
  }
  const { products, team, docs } = data;
  const locked = ex.status === 'suspended';
  const run = async (fn, ok) => {
    const sb = await getClient();
    await fn(sb);
    reload();
    if (ok) show(ok);
  };
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Company profile' },
    { id: 'products', label: 'Products', n: products.length || null },
    { id: 'team', label: 'Team', n: team.length || null },
    { id: 'docs', label: 'Documents', n: docs.length || null },
  ];
  return (
    <>
      <div className="pf-head">
        <div className="pf-row" style={{ gap: 18, alignItems: 'center' }}>
          <div className="pf-thumb" style={{ width: 64, height: 64, borderRadius: 18, background: ex.logo_path ? `#fff url("${publicUrl('exhibitors', ex.logo_path)}") center/contain no-repeat` : 'var(--ink)' }} />
          <div>
            <span className="pf-kicker" style={{ marginBottom: 6 }}>Exhibitor portal</span>
            <h1 style={{ fontSize: 'clamp(24px,3vw,36px)' }}>{ex.company}</h1>
          </div>
        </div>
        <Pill status={ex.status} />
      </div>
      {locked ? (
        <div className="pf-note bad" style={{ marginBottom: 20 }}>
          This account is suspended, so it can’t be changed. {ex.admin_note || 'Contact the organisers.'}
        </div>
      ) : null}
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === 'overview' ? <Overview ex={ex} products={products} team={team} docs={docs} go={setTab} /> : null}
      {tab === 'profile' ? (
        <div className="pf-card">
          {locked ? (
            <p className="pf-muted">Profile editing is unavailable while the account is suspended.</p>
          ) : (
            <ExhibitorForm user={user} fields={data.fields} row={ex} onDone={() => (reload(), show('Profile saved'))} />
          )}
        </div>
      ) : null}
      {tab === 'products' ? (
        <div className="pf-card">
          <div className="pf-card-head">
            <h2>Products</h2>
            {locked ? null : (
              <button className="pf-btn small orange" onClick={() => setEdit({ kind: 'product' })}>
                + Add product
              </button>
            )}
          </div>
          {products.length ? (
            <div className="pf-grid three">
              {products.map((p) => (
                <button key={p.id} className="pf-prod" style={{ border: 0, padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => !locked && setEdit({ kind: 'product', row: p })}>
                  <div className="pf-prod-img" style={p.image_path ? { backgroundImage: `url("${publicUrl('exhibitors', p.image_path)}")` } : undefined} />
                  <div className="pf-prod-body">
                    <h3>{p.name}</h3>
                    <span className="pf-small pf-muted">{[p.category, p.type, p.moq].filter(Boolean).join(' · ')}</span>
                    <span style={{ marginTop: 'auto' }}>{p.listed ? <Pill status="listed">Shown</Pill> : <Pill>Hidden</Pill>}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="pf-empty">No products yet. Add what you’ll show at the Expo; listed products appear on the website once your company is listed.</p>
          )}
        </div>
      ) : null}
      {tab === 'team' ? (
        <div className="pf-card">
          <div className="pf-card-head">
            <h2>Team at the stall</h2>
            {locked ? null : (
              <button className="pf-btn small orange" onClick={() => setEdit({ kind: 'team' })}>
                + Add person
              </button>
            )}
          </div>
          {team.length ? (
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((m) => (
                    <tr key={m.id} className="click" onClick={() => !locked && setEdit({ kind: 'team', row: m })}>
                      <td>
                        <b>{m.name}</b>
                      </td>
                      <td>{m.role}</td>
                      <td>{m.email}</td>
                      <td>{m.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="pf-empty">Add the people who’ll staff your stall.</p>
          )}
        </div>
      ) : null}
      {tab === 'docs' ? (
        <div className="pf-card">
          <div className="pf-card-head">
            <h2>Documents</h2>
            {locked ? null : (
              <button className="pf-btn small orange" onClick={() => setEdit({ kind: 'doc' })}>
                + Upload
              </button>
            )}
          </div>
          {docs.length ? (
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>File</th>
                    <th>Status</th>
                    <th>Uploaded</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <b>{d.kind}</b>
                        {d.note ? <div className="pf-small pf-muted">{d.note}</div> : null}
                      </td>
                      <td>
                        <DocLink path={d.path}>{d.file_name || 'Open'}</DocLink>
                      </td>
                      <td>
                        <Pill status={d.status} />
                      </td>
                      <td className="pf-small">{fmtDate(d.created_at)}</td>
                      <td>
                        {d.status === 'submitted' && !locked ? (
                          <button
                            className="pf-btn small ghost"
                            onClick={() =>
                              confirm('Remove this document?') &&
                              run(async (sb) => {
                                const { error } = await sb.from('exhibitor_documents').delete().eq('id', d.id);
                                if (error) throw error;
                                removeFile('private', d.path);
                              }, 'Removed').catch((x) => show(errorText(x), true))
                            }
                          >
                            Remove
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="pf-empty">Upload your company registration, GST certificate, stall design and insurance. Only you and the organisers can see them.</p>
          )}
        </div>
      ) : null}

      {edit?.kind === 'product' ? (
        <RecordDrawer
          title={edit.row ? 'Edit product' : 'New product'}
          fields={PRODUCT_FIELDS}
          initial={edit.row ? { ...edit.row } : { listed: true }}
          existing={{ image: edit.row?.image_path ? publicUrl('exhibitors', edit.row.image_path) : '' }}
          onClose={() => setEdit(null)}
          onSave={(v, f) => run((sb) => saveProduct(sb, ex.id, edit.row, v, f), 'Product saved')}
          onDelete={
            edit.row
              ? () =>
                  run(async (sb) => {
                    const { error } = await sb.from('products').delete().eq('id', edit.row.id);
                    if (error) throw error;
                    if (edit.row.image_path) removeFile('exhibitors', edit.row.image_path);
                  }, 'Product deleted')
              : null
          }
        />
      ) : null}
      {edit?.kind === 'team' ? (
        <RecordDrawer
          title={edit.row ? 'Edit team member' : 'Add team member'}
          fields={TEAM_FIELDS}
          initial={edit.row ? { ...edit.row } : {}}
          onClose={() => setEdit(null)}
          onSave={(v) =>
            run(async (sb) => {
              const data = { name: v.name.trim(), role: v.role || null, email: v.email || null, phone: v.phone || null };
              const { error } = edit.row ? await sb.from('exhibitor_team').update(data).eq('id', edit.row.id) : await sb.from('exhibitor_team').insert({ ...data, exhibitor_id: ex.id });
              if (error) throw error;
            }, 'Saved')
          }
          onDelete={
            edit.row
              ? () =>
                  run(async (sb) => {
                    const { error } = await sb.from('exhibitor_team').delete().eq('id', edit.row.id);
                    if (error) throw error;
                  }, 'Removed')
              : null
          }
        />
      ) : null}
      {edit?.kind === 'doc' ? (
        <RecordDrawer
          title="Upload a document"
          fields={DOC_FIELDS}
          saveLabel="Upload"
          onClose={() => setEdit(null)}
          onSave={(v, f) =>
            run(async (sb) => {
              const path = await upload('private', `x/${ex.id}/${Date.now()}.${extOf(f.file)}`, f.file);
              const { error } = await sb.from('exhibitor_documents').insert({ exhibitor_id: ex.id, kind: v.kind, path, file_name: f.file.name });
              if (error) throw error;
            }, 'Uploaded')
          }
        />
      ) : null}
      {toast}
    </>
  );
}

export function PortalPage() {
  return (
    <AuthGate
      title="Exhibitor portal"
      text="Sign in with your company email. We’ll send a one-time code."
      frame={(x) => (
        <Shell title="Exhibitor portal" main="pf-main">
          {x}
        </Shell>
      )}
    >
      {(user) => (
        <Frame user={user}>
          <PortalInner user={user} />
        </Frame>
      )}
    </AuthGate>
  );
}
