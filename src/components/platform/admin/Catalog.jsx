'use client';
// Website catalogue: everything the public pages list (zones, hall areas, programme, speakers,
// featured exhibitors and products, pavilions, startups…). Changes show on the site live.
import { useMemo, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import { publicUrl, upload } from '@/lib/platform/storage';
import RecordDrawer from '../RecordDrawer';
import { Loading, Pill } from '../ui';

export const COLLECTIONS = [
  ['sessions', 'Programme sessions'],
  ['speakers', 'Speakers'],
  ['stages', 'Stages'],
  ['zones', 'Zones'],
  ['clusters', 'Hall areas'],
  ['exhibitors', 'Featured exhibitors'],
  ['products', 'Featured products'],
  ['startups', 'Startups'],
  ['states', 'State pavilions'],
  ['countries', 'Country pavilions'],
  ['matches', 'Buyer matches'],
];
const LONG = /blurb|profile|problem|identity|description|about|summary|text/i;
const MEDIA = /^(img|image|photo|logo|video|src|cover|poster)$/i;

/** Field definitions for a collection, from the keys its items use. */
function fieldsFor(items) {
  const keys = new Map();
  for (const it of items)
    for (const [k, v] of Object.entries(it.data || {})) {
      if (!keys.has(k)) keys.set(k, v);
      else if (keys.get(k) === null || keys.get(k) === '') keys.set(k, v);
    }
  const out = [];
  for (const [k, sample] of keys) {
    if (k === 'id') continue;
    const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ');
    if (Array.isArray(sample)) out.push({ key: k, label, type: 'text', help: 'Separate items with commas.', list: true });
    else if (typeof sample === 'number') out.push({ key: k, label, type: 'number', num: true });
    else if (typeof sample === 'boolean') out.push({ key: k, label, type: 'checkbox', placeholder: label });
    else if (MEDIA.test(k)) {
      out.push({ key: k, label: label + ' (link)', type: 'url' });
      out.push({ key: k + '__file', label: 'Or upload ' + label.toLowerCase(), type: 'image', upload: k });
    } else out.push({ key: k, label, type: LONG.test(k) || String(sample || '').length > 90 ? 'textarea' : 'text' });
  }
  out.push({ key: '__new_key', label: 'Add a field (optional)', type: 'text', placeholder: 'field name, e.g. img', help: 'Creates a new field on this item. Use “img” for a picture.' });
  return out;
}

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .slice(0, 60);

export default function Catalog({ role, show }) {
  const [coll, setColl] = useState('sessions');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState(null);
  const editor = can(role, 'editor');
  const { data, loading } = useLive(
    'catalog',
    async (sb) => {
      const { data, error } = await sb.from('catalog').select('*').order('collection').order('sort').order('id');
      if (error) throw error;
      return data;
    },
    [{ table: 'catalog' }],
  );
  const items = useMemo(() => (data || []).filter((r) => r.collection === coll), [data, coll]);
  const fields = useMemo(() => fieldsFor(items), [items]);
  if (loading && !data) return <Loading />;
  const title = (r) => r.data?.name || r.data?.title || r.id;
  const sub = (r) => {
    const d = r.data || {};
    return [d.role, d.org, d.stage, d.day ? 'Day ' + d.day + ' · ' + (d.time || '') : '', d.city, d.country, d.meta, d.stall, d.short].filter(Boolean).slice(0, 3).join(' · ');
  };
  const shown = items.filter((r) => !q.trim() || JSON.stringify(r.data).toLowerCase().includes(q.trim().toLowerCase()));

  const save = (row) => async (values, files) => {
    const sb = await getClient();
    const d = { ...(row?.data || {}) };
    for (const f of fields) {
      if (f.key === '__new_key' || f.upload) continue;
      let v = values[f.key];
      if (f.list) v = String(v || '').split(',').map((x) => x.trim()).filter(Boolean);
      else if (f.num) v = v === '' || v === undefined || v === null ? null : Number(v);
      else if (f.type === 'checkbox') v = !!v;
      else v = v ?? '';
      d[f.key] = v;
    }
    const id = row?.id || slug(values.__id || values.name || values.title) || 'item-' + Date.now().toString(36);
    if (!row && items.some((r) => r.id === id)) throw new Error('An item with the id “' + id + '” already exists.');
    if ('id' in (items[0]?.data || {}) || !row) d.id = d.id || id;
    for (const f of fields)
      if (f.upload && files[f.key]) {
        const path = await upload('media', `library/${coll}-${id}-${Date.now()}.jpg`, files[f.key]);
        d[f.upload] = publicUrl('media', path);
      }
    const nk = slug(values.__new_key || '').replace(/-/g, '_');
    if (nk && !(nk in d)) d[nk] = '';
    const rec = { collection: coll, id, data: d, sort: row ? row.sort : items.length ? Math.max(...items.map((r) => r.sort)) + 1 : 0 };
    const { error } = row ? await sb.from('catalog').update({ data: d }).eq('collection', coll).eq('id', row.id) : await sb.from('catalog').insert(rec);
    if (error) throw error;
    show('Saved · live on the website');
  };
  const move = async (r, dir) => {
    const i = items.indexOf(r);
    const o = items[i + dir];
    if (!o) return;
    try {
      const sb = await getClient();
      const a = r.sort === o.sort ? i : r.sort;
      const b = r.sort === o.sort ? i + dir : o.sort;
      await sb.from('catalog').update({ sort: b }).eq('collection', coll).eq('id', r.id);
      await sb.from('catalog').update({ sort: a }).eq('collection', coll).eq('id', o.id);
    } catch (x) {
      show(errorText(x), true);
    }
  };
  const toggle = async (r) => {
    try {
      const sb = await getClient();
      const { error } = await sb.from('catalog').update({ active: !r.active }).eq('collection', coll).eq('id', r.id);
      if (error) throw error;
      show(r.active ? 'Hidden from the website' : 'Shown on the website');
    } catch (x) {
      show(errorText(x), true);
    }
  };
  const initial = (r) => {
    const v = {};
    for (const f of fields) {
      const x = r?.data?.[f.key];
      v[f.key] = f.list ? (Array.isArray(x) ? x.join(', ') : '') : x ?? (f.type === 'checkbox' ? false : '');
    }
    return v;
  };
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Website content</h1>
          <p>Lists the public pages are built from. Edits, new items and hidden items show on the site for everyone straight away.</p>
        </div>
        <div className="pf-row">
          <input className="pf-input pf-search" placeholder="Search this list…" value={q} onChange={(e) => setQ(e.target.value)} />
          {editor ? (
            <button className="pf-btn orange" onClick={() => setEdit({})}>
              + New item
            </button>
          ) : null}
        </div>
      </div>
      <div className="pf-chips" style={{ marginBottom: 22 }}>
        {COLLECTIONS.map(([id, label]) => (
          <button key={id} className="pf-chip" aria-pressed={coll === id} onClick={() => setColl(id)}>
            {label} <span className="pf-muted" style={{ color: 'inherit', opacity: 0.6 }}>{(data || []).filter((r) => r.collection === id).length}</span>
          </button>
        ))}
      </div>
      <div className="pf-card">
        {shown.length ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} style={{ opacity: r.active ? 1 : 0.5 }}>
                    <td style={{ width: 48 }}>
                      {r.data?.img || r.data?.image ? <span className="pf-thumb" style={{ backgroundImage: `url("${r.data.img || r.data.image}")` }} /> : <span className="pf-thumb" style={{ background: r.data?.color || 'var(--paper)' }} />}
                    </td>
                    <td className="click" style={{ cursor: 'pointer' }} onClick={() => setEdit({ row: r })}>
                      <b>{title(r)}</b>
                      <div className="pf-small pf-muted">{sub(r)}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                      {r.active ? null : <Pill>Hidden</Pill>}
                      {editor ? (
                        <>
                          <button className="pf-btn small soft" title="Move up" onClick={() => move(r, -1)} disabled={q !== '' || items.indexOf(r) === 0} style={{ marginLeft: 6 }}>
                            ↑
                          </button>
                          <button className="pf-btn small soft" title="Move down" onClick={() => move(r, 1)} disabled={q !== '' || items.indexOf(r) === items.length - 1} style={{ marginLeft: 6 }}>
                            ↓
                          </button>
                          <button className="pf-btn small ghost" onClick={() => toggle(r)} style={{ marginLeft: 6 }}>
                            {r.active ? 'Hide' : 'Show'}
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="pf-empty">No items.</p>
        )}
      </div>
      {edit ? (
        <RecordDrawer
          title={edit.row ? title(edit.row) : 'New item · ' + COLLECTIONS.find((c) => c[0] === coll)[1]}
          fields={edit.row ? fields : [{ key: '__id', label: 'Id (optional)', type: 'text', help: 'A short unique name used in links; made from the name if left empty.' }, ...fields]}
          initial={initial(edit.row)}
          existing={Object.fromEntries(fields.filter((f) => f.upload).map((f) => [f.key, edit.row?.data?.[f.upload] || '']))}
          readOnly={!editor}
          onClose={() => setEdit(null)}
          onSave={save(edit.row)}
          onDelete={
            edit.row && editor
              ? async () => {
                  const sb = await getClient();
                  const { error } = await sb.from('catalog').delete().eq('collection', coll).eq('id', edit.row.id);
                  if (error) throw error;
                  show('Deleted');
                }
              : null
          }
        />
      ) : null}
    </>
  );
}
