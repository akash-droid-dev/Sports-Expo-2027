'use client';
// Registration form builder: add, edit, reorder, switch off or delete the fields of the visitor
// and exhibitor forms. Core fields (stored in their own columns) can be relabelled and moved but
// not removed or retyped.
import { useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import FieldList from '../Fields';
import RecordDrawer from '../RecordDrawer';
import { Loading, Pill, Tabs } from '../ui';

const TYPES = ['text', 'textarea', 'email', 'tel', 'url', 'number', 'date', 'select', 'multiselect', 'country', 'checkbox', 'image', 'file'];
const TYPE_LABEL = { text: 'Short text', textarea: 'Long text', email: 'Email', tel: 'Phone', url: 'Web address', number: 'Number', date: 'Date', select: 'Choose one', multiselect: 'Choose several', country: 'Country', checkbox: 'Tick box', image: 'Photo upload', file: 'File upload' };

function defFields(core, isNew) {
  return [
    ...(isNew ? [{ key: 'key', label: 'Field id', type: 'text', required: true, help: 'Lowercase letters, numbers and _ (e.g. dietary_needs). Can’t be changed later.' }] : []),
    { key: 'label', label: 'Question / label', type: 'text', required: true },
    ...(core ? [] : [{ key: 'type', label: 'Answer type', type: 'select', options: TYPES.map((t) => TYPE_LABEL[t]), required: true }]),
    { key: 'options', label: 'Choices (for “Choose one / several”)', type: 'textarea', help: 'One per line.' },
    { key: 'section', label: 'Section', type: 'text', help: 'Fields with the same section are grouped under one heading.' },
    { key: 'placeholder', label: 'Placeholder / tick-box text', type: 'text' },
    { key: 'help', label: 'Help text', type: 'text' },
    { key: 'required', label: 'Required', type: 'checkbox', placeholder: 'Answer required' },
    ...(core ? [] : [{ key: 'active', label: 'Shown', type: 'checkbox', placeholder: 'Show this field on the form' }]),
  ];
}

export default function Forms({ role, show }) {
  const [form, setForm] = useState('visitor');
  const [edit, setEdit] = useState(null);
  const [preview, setPreview] = useState(false);
  const admin = can(role, 'admin');
  const { data, loading } = useLive(
    'forms',
    async (sb) => {
      const { data, error } = await sb.from('form_fields').select('*').order('sort').order('label');
      if (error) throw error;
      return data;
    },
    [{ table: 'form_fields' }],
  );
  if (loading && !data) return <Loading />;
  const rows = (data || []).filter((r) => r.form === form);
  const exec = async (fn, ok) => {
    try {
      const sb = await getClient();
      await fn(sb);
      if (ok) show(ok);
    } catch (x) {
      show(errorText(x), true);
    }
  };
  const move = (r, dir) =>
    exec(async (sb) => {
      const i = rows.indexOf(r);
      const o = rows[i + dir];
      if (!o) return;
      // Renumber the whole form so equal sort values can't get stuck.
      const order = rows.map((x) => x.id);
      [order[i], order[i + dir]] = [order[i + dir], order[i]];
      await Promise.all(order.map((id, n) => sb.from('form_fields').update({ sort: n }).eq('id', id)));
    });
  const save = (row) => async (v) => {
    const sb = await getClient();
    const type = row?.core ? row.type : TYPES.find((t) => TYPE_LABEL[t] === v.type) || v.type || 'text';
    const data = {
      label: v.label.trim(),
      options: String(v.options || '')
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
      section: v.section?.trim() || 'Details',
      placeholder: v.placeholder?.trim() || null,
      help: v.help?.trim() || null,
      required: !!v.required,
      ...(row?.core ? {} : { type, active: v.active !== false }),
    };
    if ((type === 'select' || type === 'multiselect') && !data.options.length) throw new Error('Add at least one choice.');
    if (row) {
      const { error } = await sb.from('form_fields').update(data).eq('id', row.id);
      if (error) throw error;
    } else {
      const key = String(v.key || '').trim().toLowerCase();
      if (!/^[a-z][a-z0-9_]{1,40}$/.test(key)) throw new Error('Field id: start with a letter; use a–z, 0–9 and _ only.');
      const { error } = await sb.from('form_fields').insert({ ...data, form, key, sort: rows.length ? Math.max(...rows.map((r) => r.sort)) + 1 : 0 });
      if (error) throw error;
    }
    show('Saved · the form updates live');
  };
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Registration forms</h1>
          <p>Questions on the visitor and exhibitor forms. Changes apply to the live forms at once; answers to added questions appear with each registration.</p>
        </div>
        <div className="pf-row">
          <button className="pf-btn ghost" onClick={() => setPreview((p) => !p)}>
            {preview ? 'Hide preview' : 'Preview form'}
          </button>
          {admin ? (
            <button className="pf-btn orange" onClick={() => setEdit({})}>
              + Add question
            </button>
          ) : null}
        </div>
      </div>
      <Tabs
        tabs={[
          { id: 'visitor', label: 'Visitor form' },
          { id: 'exhibitor', label: 'Exhibitor form' },
        ]}
        value={form}
        onChange={setForm}
      />
      {preview ? (
        <div className="pf-card" style={{ marginBottom: 20 }}>
          <FieldList fields={rows.filter((r) => r.active)} values={{}} setValue={() => {}} />
        </div>
      ) : null}
      <div className="pf-card">
        <div className="pf-table-wrap">
          <table className="pf-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Type</th>
                <th>Section</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ opacity: r.active ? 1 : 0.5 }}>
                  <td className="click" style={{ cursor: 'pointer' }} onClick={() => setEdit({ row: r })}>
                    <b>{r.label}</b> {r.required ? <span style={{ color: 'var(--orange)' }}>*</span> : null}
                    <div className="pf-small pf-muted">
                      {r.key}
                      {r.core ? ' · core' : ''}
                      {r.options?.length ? ' · ' + r.options.length + ' choices' : ''}
                    </div>
                  </td>
                  <td>{TYPE_LABEL[r.type]}</td>
                  <td>{r.section}</td>
                  <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {r.active ? null : <Pill>Off</Pill>}
                    {admin ? (
                      <>
                        <button className="pf-btn small soft" onClick={() => move(r, -1)} disabled={i === 0} style={{ marginLeft: 6 }}>
                          ↑
                        </button>
                        <button className="pf-btn small soft" onClick={() => move(r, 1)} disabled={i === rows.length - 1} style={{ marginLeft: 6 }}>
                          ↓
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {edit ? (
        <RecordDrawer
          title={edit.row ? edit.row.label : 'New question'}
          fields={defFields(edit.row?.core, !edit.row)}
          initial={
            edit.row
              ? { ...edit.row, type: TYPE_LABEL[edit.row.type], options: (edit.row.options || []).join('\n') }
              : { type: TYPE_LABEL.text, section: rows[rows.length - 1]?.section || 'Details', active: true }
          }
          readOnly={!admin}
          onClose={() => setEdit(null)}
          onSave={save(edit.row)}
          onDelete={
            edit.row && !edit.row.core && admin
              ? async () => {
                  const sb = await getClient();
                  const { error } = await sb.from('form_fields').delete().eq('id', edit.row.id);
                  if (error) throw error;
                  show('Question removed');
                }
              : null
          }
        />
      ) : null}
    </>
  );
}
