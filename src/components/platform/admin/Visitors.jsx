'use client';
// Visitor registrations: review, approve (issues the card), request changes or reject.
import { useMemo, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import { loadFields } from '@/lib/platform/records';
import Badge, { usePrivateUrl } from '../Badge';
import { AsyncButton, Drawer, Loading, Pill, Tabs, fmtDate } from '../ui';

const FILTERS = [
  ['pending', 'To review'],
  ['changes', 'Changes requested'],
  ['approved', 'Approved'],
  ['rejected', 'Rejected'],
  ['all', 'All'],
];

export function csv(rows, cols) {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : Array.isArray(v) ? v.join('; ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [cols.map((c) => c[1]).join(','), ...rows.map((r) => cols.map((c) => esc(typeof c[0] === 'function' ? c[0](r) : r[c[0]])).join(','))].join('\n');
}
export function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function Detail({ v, fields, role, onClose, show }) {
  const photo = usePrivateUrl(v.photo_path);
  const idUrl = usePrivateUrl(v.id_doc_path);
  const [note, setNote] = useState(v.admin_note || '');
  const isPdf = /\.pdf$/i.test(v.id_doc_path || '');
  const act = (status) => async () => {
    if ((status === 'rejected' || status === 'changes') && !note.trim()) return show('Add a short message for the visitor first.', true);
    try {
      const sb = await getClient();
      const { error } = await sb.from('visitors').update({ status, admin_note: note.trim() || null }).eq('id', v.id);
      if (error) throw error;
      show({ approved: 'Approved, card issued', changes: 'Changes requested', rejected: 'Rejected', pending: 'Moved back to review' }[status]);
      onClose();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  const admin = can(role, 'admin');
  return (
    <Drawer title={v.full_name} onClose={onClose} actions={<Pill status={v.status} />}>
      <div className="pf-grid two" style={{ alignItems: 'start', marginTop: 8 }}>
        <div className="pf-card" style={{ padding: 18 }}>
          <span className="pf-kicker">Photo</span>
          {photo ? <img className="pf-doc" src={photo} alt="Visitor photo" /> : <p className="pf-muted">No photo</p>}
        </div>
        <div className="pf-card" style={{ padding: 18 }}>
          <span className="pf-kicker">ID document</span>
          {idUrl ? (
            isPdf ? (
              <a className="pf-btn small" href={idUrl} target="_blank" rel="noreferrer">
                Open PDF
              </a>
            ) : (
              <a href={idUrl} target="_blank" rel="noreferrer">
                <img className="pf-doc" src={idUrl} alt="ID document" />
              </a>
            )
          ) : (
            <p className="pf-muted">No document</p>
          )}
        </div>
      </div>
      <div className="pf-card">
        <dl className="pf-kv">
          <dt>Email</dt>
          <dd>{v.email}</dd>
          {fields
            .filter((f) => f.type !== 'image' && f.type !== 'file')
            .map((f) => {
              const val = f.key in v ? v[f.key] : v.answers?.[f.key];
              if (val === undefined || val === null || val === '') return null;
              return [<dt key={f.key + 't'}>{f.label}</dt>, <dd key={f.key + 'd'}>{Array.isArray(val) ? val.join(', ') : String(val)}</dd>];
            })}
          <dt>Registered</dt>
          <dd>{fmtDate(v.created_at)}</dd>
          {v.reviewed_at ? (
            <>
              <dt>Reviewed</dt>
              <dd>
                {fmtDate(v.reviewed_at)} by {v.reviewed_by}
              </dd>
            </>
          ) : null}
          {v.badge_code ? (
            <>
              <dt>Card number</dt>
              <dd>
                <b>{v.badge_code}</b>
              </dd>
            </>
          ) : null}
        </dl>
      </div>
      {admin ? (
        <div className="pf-card">
          <h3>Decision</h3>
          <label className="pf-field" style={{ margin: '14px 0' }}>
            <span className="pf-label">Message to the visitor (needed for “changes” and “reject”)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please upload a clearer photo." />
          </label>
          <div className="pf-row">
            {v.status !== 'approved' ? (
              <AsyncButton className="pf-btn green" onClick={act('approved')}>
                Approve & issue card
              </AsyncButton>
            ) : null}
            {v.status !== 'changes' ? (
              <AsyncButton className="pf-btn soft" onClick={act('changes')}>
                Request changes
              </AsyncButton>
            ) : null}
            {v.status !== 'rejected' ? (
              <AsyncButton className="pf-btn ghost" style={{ color: 'var(--red)' }} onClick={act('rejected')}>
                Reject
              </AsyncButton>
            ) : null}
            {v.status !== 'pending' ? (
              <AsyncButton className="pf-btn ghost" onClick={act('pending')}>
                Back to review
              </AsyncButton>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="pf-note">Only admins can approve registrations.</p>
      )}
      <div style={{ marginTop: 20 }}>
        <Badge visitor={v} />
      </div>
    </Drawer>
  );
}

export default function Visitors({ role, show }) {
  const [filter, setFilter] = useState('pending');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const { data, loading } = useLive(
    'visitors',
    async (sb) => {
      const [v, f] = await Promise.all([sb.from('visitors').select('*').order('created_at', { ascending: false }).limit(5000), loadFields(sb, 'visitor', true)]);
      if (v.error) throw v.error;
      return { rows: v.data, fields: f };
    },
    [{ table: 'visitors' }, { table: 'form_fields' }],
  );
  const rows = data?.rows || [];
  const count = (s) => rows.filter((r) => r.status === s).length;
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => (filter === 'all' || r.status === filter) && (!t || [r.full_name, r.email, r.organisation, r.badge_code, r.phone].some((x) => (x || '').toLowerCase().includes(t))));
  }, [rows, filter, q]);
  if (loading && !data) return <Loading />;
  const current = open && rows.find((r) => r.id === open);
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Visitors</h1>
          <p>{rows.length} registrations · updates live</p>
        </div>
        <div className="pf-row">
          <input className="pf-input pf-search" placeholder="Search name, email, company, card…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button
            className="pf-btn ghost"
            onClick={() =>
              download(
                'visitors.csv',
                csv(shown, [
                  ['full_name', 'Name'],
                  ['email', 'Email'],
                  ['phone', 'Phone'],
                  ['category', 'Category'],
                  ['organisation', 'Organisation'],
                  ['designation', 'Designation'],
                  ['country', 'Country'],
                  ['status', 'Status'],
                  ['badge_code', 'Card'],
                  [(r) => JSON.stringify(r.answers || {}), 'Other answers'],
                  ['created_at', 'Registered'],
                ]),
              )
            }
          >
            Export CSV
          </button>
        </div>
      </div>
      <Tabs tabs={FILTERS.map(([id, label]) => ({ id, label, n: id === 'all' ? null : count(id) || null }))} value={filter} onChange={setFilter} />
      <div className="pf-card">
        {shown.length ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Organisation</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} className="click" onClick={() => setOpen(r.id)}>
                    <td>
                      <b>{r.full_name}</b>
                      <div className="pf-small pf-muted">{r.email}</div>
                    </td>
                    <td>{r.category}</td>
                    <td>{r.organisation}</td>
                    <td>{r.country}</td>
                    <td>
                      <Pill status={r.status} />
                    </td>
                    <td className="pf-small">{fmtDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="pf-empty">Nothing here.</p>
        )}
      </div>
      {current ? <Detail v={current} fields={data.fields} role={role} show={show} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
