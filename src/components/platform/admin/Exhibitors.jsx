'use client';
// Registered exhibitors: allocate stalls, list them on the website, suspend, review documents,
// edit profiles and products.
import { useMemo, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import { loadFields } from '@/lib/platform/records';
import { privateUrl, publicUrl, removeFile } from '@/lib/platform/storage';
import ExhibitorForm from '../ExhibitorForm';
import { PRODUCT_FIELDS, saveProduct } from '../PortalPages';
import RecordDrawer from '../RecordDrawer';
import { AsyncButton, Drawer, Loading, Pill, Tabs, fmtDate } from '../ui';
import { csv, download } from './Visitors';

function Detail({ ex, all, fields, role, onClose, show }) {
  const [tab, setTab] = useState('manage');
  const [form, setForm] = useState({ stall_code: ex.stall_code || '', admin_note: ex.admin_note || '', zone: ex.zone || '' });
  const [prod, setProd] = useState(null);
  const products = all.products.filter((p) => p.exhibitor_id === ex.id);
  const docs = all.docs.filter((d) => d.exhibitor_id === ex.id);
  const team = all.team.filter((t) => t.exhibitor_id === ex.id);
  const editor = can(role, 'editor');
  const admin = can(role, 'admin');
  const update = async (patch, ok) => {
    try {
      const sb = await getClient();
      const { error } = await sb.from('exhibitors').update(patch).eq('id', ex.id);
      if (error) throw error;
      show(ok);
    } catch (x) {
      show(errorText(x), true);
    }
  };
  const docStatus = async (d, status) => {
    const note = status === 'rejected' ? prompt('Reason (shown to the exhibitor):', d.note || '') : null;
    if (status === 'rejected' && note === null) return;
    try {
      const sb = await getClient();
      const { error } = await sb.from('exhibitor_documents').update({ status, note }).eq('id', d.id);
      if (error) throw error;
      show('Document ' + status);
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <Drawer title={ex.company} onClose={onClose} actions={<Pill status={ex.status} />}>
      <Tabs
        tabs={[
          { id: 'manage', label: 'Manage' },
          { id: 'profile', label: 'Profile' },
          { id: 'products', label: 'Products', n: products.length || null },
          { id: 'docs', label: 'Documents', n: docs.length || null },
          { id: 'team', label: 'Team', n: team.length || null },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'manage' ? (
        <>
          <div className="pf-card">
            <dl className="pf-kv">
              <dt>Contact</dt>
              <dd>
                {ex.contact_name} · {ex.email} · {ex.phone}
              </dd>
              <dt>Stall product</dt>
              <dd>{ex.stall_product}</dd>
              <dt>Preferred area</dt>
              <dd>{ex.preferred_location || '—'}</dd>
              <dt>Registered</dt>
              <dd>{fmtDate(ex.created_at)}</dd>
            </dl>
          </div>
          <div className="pf-card">
            <h3>Stall and listing</h3>
            <div className="pf-form" style={{ marginTop: 16 }}>
              <label className="pf-field">
                <span className="pf-label">Stall code</span>
                <input className="pf-input" value={form.stall_code} onChange={(e) => setForm({ ...form, stall_code: e.target.value.toUpperCase() })} placeholder="e.g. B-SGM-017" disabled={!editor} />
              </label>
              <label className="pf-field">
                <span className="pf-label">Zone</span>
                <select value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} disabled={!editor}>
                  <option value="">—</option>
                  {['A', 'B', 'C', 'D'].map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              </label>
              <label className="pf-field full">
                <span className="pf-label">Note to the exhibitor (shown in their portal)</span>
                <textarea value={form.admin_note} onChange={(e) => setForm({ ...form, admin_note: e.target.value })} disabled={!editor} />
              </label>
            </div>
            {editor ? (
              <div className="pf-row" style={{ marginTop: 16 }}>
                <AsyncButton className="pf-btn" onClick={() => update({ stall_code: form.stall_code.trim() || null, zone: form.zone || null, admin_note: form.admin_note.trim() || null }, 'Saved')}>
                  Save
                </AsyncButton>
                <AsyncButton className={'pf-btn ' + (ex.listed ? 'soft' : 'green')} onClick={() => update({ listed: !ex.listed }, ex.listed ? 'Hidden from the website' : 'Now listed on the website')}>
                  {ex.listed ? 'Hide from website' : 'List on website'}
                </AsyncButton>
                <span className="pf-spacer" />
                <AsyncButton
                  className="pf-btn ghost"
                  style={{ color: ex.status === 'active' ? 'var(--red)' : undefined }}
                  onClick={() => update({ status: ex.status === 'active' ? 'suspended' : 'active' }, ex.status === 'active' ? 'Suspended' : 'Reactivated')}
                >
                  {ex.status === 'active' ? 'Suspend' : 'Reactivate'}
                </AsyncButton>
              </div>
            ) : null}
          </div>
          {admin ? (
            <AsyncButton
              className="pf-btn ghost small"
              style={{ color: 'var(--red)', marginTop: 20 }}
              onClick={async () => {
                if (!confirm(`Delete ${ex.company} with all its products, team and documents? This can’t be undone.`)) return;
                try {
                  const sb = await getClient();
                  const { error } = await sb.from('exhibitors').delete().eq('id', ex.id);
                  if (error) throw error;
                  show('Exhibitor deleted');
                  onClose();
                } catch (x) {
                  show(errorText(x), true);
                }
              }}
            >
              Delete exhibitor
            </AsyncButton>
          ) : null}
        </>
      ) : null}
      {tab === 'profile' ? (
        <div className="pf-card">
          {editor ? <ExhibitorForm user={{ email: ex.email }} fields={fields} row={ex} onDone={() => show('Profile saved')} /> : <p className="pf-muted">Editors can change profiles.</p>}
        </div>
      ) : null}
      {tab === 'products' ? (
        <div className="pf-card">
          <div className="pf-card-head">
            <h3>Products</h3>
            {editor ? (
              <button className="pf-btn small orange" onClick={() => setProd({})}>
                + Add
              </button>
            ) : null}
          </div>
          {products.length ? (
            <div className="pf-grid three">
              {products.map((p) => (
                <button key={p.id} className="pf-prod" style={{ border: 0, padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }} onClick={() => editor && setProd({ row: p })}>
                  <div className="pf-prod-img" style={p.image_path ? { backgroundImage: `url("${publicUrl('exhibitors', p.image_path)}")` } : undefined} />
                  <div className="pf-prod-body">
                    <b>{p.name}</b>
                    <span>{p.listed ? <Pill status="listed">Shown</Pill> : <Pill>Hidden</Pill>}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="pf-empty">No products.</p>
          )}
        </div>
      ) : null}
      {tab === 'docs' ? (
        <div className="pf-card">
          {docs.length ? (
            docs.map((d) => (
              <div key={d.id} className="pf-row" style={{ padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <b>{d.kind}</b>
                  <div className="pf-small pf-muted">
                    {d.file_name} · {fmtDate(d.created_at)}
                  </div>
                </div>
                <Pill status={d.status} />
                <button className="pf-btn small soft" onClick={async () => window.open(await privateUrl(d.path), '_blank')}>
                  Open
                </button>
                {admin ? (
                  <>
                    <button className="pf-btn small green" onClick={() => docStatus(d, 'accepted')}>
                      Accept
                    </button>
                    <button className="pf-btn small ghost" onClick={() => docStatus(d, 'rejected')}>
                      Reject
                    </button>
                  </>
                ) : null}
              </div>
            ))
          ) : (
            <p className="pf-empty">No documents uploaded.</p>
          )}
        </div>
      ) : null}
      {tab === 'team' ? (
        <div className="pf-card">
          {team.length ? (
            <dl className="pf-kv">
              {team.map((m) => [
                <dt key={m.id + 't'}>{m.name}</dt>,
                <dd key={m.id + 'd'}>{[m.role, m.email, m.phone].filter(Boolean).join(' · ')}</dd>,
              ])}
            </dl>
          ) : (
            <p className="pf-empty">No team members.</p>
          )}
        </div>
      ) : null}
      {prod ? (
        <RecordDrawer
          title={prod.row ? 'Edit product' : 'New product'}
          fields={PRODUCT_FIELDS}
          initial={prod.row ? { ...prod.row } : { listed: true }}
          existing={{ image: prod.row?.image_path ? publicUrl('exhibitors', prod.row.image_path) : '' }}
          onClose={() => setProd(null)}
          onSave={async (v, f) => {
            const sb = await getClient();
            await saveProduct(sb, ex.id, prod.row, v, f);
            show('Product saved');
          }}
          onDelete={
            prod.row
              ? async () => {
                  const sb = await getClient();
                  const { error } = await sb.from('products').delete().eq('id', prod.row.id);
                  if (error) throw error;
                  if (prod.row.image_path) removeFile('exhibitors', prod.row.image_path);
                  show('Product deleted');
                }
              : null
          }
        />
      ) : null}
    </Drawer>
  );
}

export default function Exhibitors({ role, show }) {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const { data, loading } = useLive(
    'exhibitors',
    async (sb) => {
      const [e, p, d, t, f] = await Promise.all([
        sb.from('exhibitors').select('*').order('created_at', { ascending: false }),
        sb.from('products').select('*').order('sort').order('created_at'),
        sb.from('exhibitor_documents').select('*').order('created_at', { ascending: false }),
        sb.from('exhibitor_team').select('*').order('created_at'),
        loadFields(sb, 'exhibitor', true),
      ]);
      if (e.error) throw e.error;
      return { rows: e.data, products: p.data || [], docs: d.data || [], team: t.data || [], fields: f };
    },
    [{ table: 'exhibitors' }, { table: 'products' }, { table: 'exhibitor_documents' }, { table: 'exhibitor_team' }],
  );
  const rows = data?.rows || [];
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === 'all' || (filter === 'unallocated' && !r.stall_code) || (filter === 'listed' && r.listed) || (filter === 'suspended' && r.status === 'suspended')) &&
        (!t || [r.company, r.email, r.contact_name, r.stall_code, r.sector, r.country].some((x) => (x || '').toLowerCase().includes(t))),
    );
  }, [rows, filter, q]);
  if (loading && !data) return <Loading />;
  const current = open && rows.find((r) => r.id === open);
  const pendingDocs = (id) => data.docs.filter((d) => d.exhibitor_id === id && d.status === 'submitted').length;
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Exhibitors</h1>
          <p>
            {rows.length} registered · {rows.filter((r) => r.listed).length} on the website
          </p>
        </div>
        <div className="pf-row">
          <input className="pf-input pf-search" placeholder="Search company, stall, sector…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button
            className="pf-btn ghost"
            onClick={() =>
              download(
                'exhibitors.csv',
                csv(shown, [
                  ['company', 'Company'],
                  ['contact_name', 'Contact'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['country', 'Country'],
                  ['city', 'City'],
                  ['sector', 'Sector'],
                  ['type', 'Type'],
                  ['zone', 'Zone'],
                  ['stall_product', 'Stall product'],
                  ['stall_code', 'Stall'],
                  ['listed', 'Listed'],
                  ['status', 'Status'],
                  ['created_at', 'Registered'],
                ]),
              )
            }
          >
            Export CSV
          </button>
        </div>
      </div>
      <Tabs
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'unallocated', label: 'No stall yet', n: rows.filter((r) => !r.stall_code).length || null },
          { id: 'listed', label: 'Listed' },
          { id: 'suspended', label: 'Suspended' },
        ]}
        value={filter}
        onChange={setFilter}
      />
      <div className="pf-card">
        {shown.length ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Zone / stall</th>
                  <th>Products</th>
                  <th>Website</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} className="click" onClick={() => setOpen(r.id)}>
                    <td>
                      <div className="pf-row" style={{ flexWrap: 'nowrap' }}>
                        <span className="pf-thumb" style={r.logo_path ? { background: `#fff url("${publicUrl('exhibitors', r.logo_path)}") center/contain no-repeat` } : undefined} />
                        <div>
                          <b>{r.company}</b>
                          <div className="pf-small pf-muted">
                            {r.sector} · {r.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {r.zone || '—'} · {r.stall_code || <span className="pf-muted">to allocate</span>}
                    </td>
                    <td>
                      {data.products.filter((p) => p.exhibitor_id === r.id).length}
                      {pendingDocs(r.id) ? <span className="pf-pill submitted" style={{ marginLeft: 8 }}>{pendingDocs(r.id)} docs to check</span> : null}
                    </td>
                    <td>{r.listed ? <Pill status="listed">Listed</Pill> : <Pill>Hidden</Pill>}</td>
                    <td>
                      <Pill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="pf-empty">No exhibitors here yet.</p>
        )}
      </div>
      {current ? <Detail ex={current} all={data} fields={data.fields.filter((f) => f.active)} role={role} show={show} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
