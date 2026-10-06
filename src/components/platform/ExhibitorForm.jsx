'use client';
// Exhibitor registration / company profile form.
import { useMemo, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { EXHIBITOR_COLUMNS, rowToValues, valuesToRow, zoneValue } from '@/lib/platform/records';
import { extOf, publicUrl, upload } from '@/lib/platform/storage';
import FieldList, { validate } from './Fields';
import { Spinner } from './ui';

export default function ExhibitorForm({ user, fields, row, onDone, onCancel, submitLabel }) {
  const [values, setValues] = useState(() => zoneValue(fields, rowToValues(row, EXHIBITOR_COLUMNS)));
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const existing = useMemo(() => ({ logo: row?.logo_path ? publicUrl('exhibitors', row.logo_path) : '' }), [row]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(fields, values, files, existing);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setErr('Please check the highlighted fields.');
      document.querySelector('.pf-field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErr('');
    try {
      const sb = await getClient();
      const data = valuesToRow(values, fields, EXHIBITOR_COLUMNS);
      setBusy('Saving…');
      let id = row?.id;
      if (id) {
        const { error } = await sb.from('exhibitors').update(data).eq('id', id);
        if (error) throw error;
      } else {
        const { data: made, error } = await sb.from('exhibitors').insert({ ...data, email: user.email }).select('id').single();
        if (error) throw error;
        id = made.id;
      }
      // The logo lives in the exhibitor's own folder, so it can only be uploaded once the row exists.
      if (files.logo) {
        setBusy('Uploading logo…');
        const path = await upload('exhibitors', `${id}/logo-${Date.now()}.${extOf(files.logo) === 'png' ? 'png' : 'jpg'}`, files.logo);
        const { error } = await sb.from('exhibitors').update({ logo_path: path }).eq('id', id);
        if (error) throw error;
      }
      onDone?.(id);
    } catch (x) {
      setErr(errorText(x));
    } finally {
      setBusy('');
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <FieldList
        fields={fields}
        values={values}
        setValue={(k, v) => (setValues((s) => ({ ...s, [k]: v })), setErr(''), errors[k] && setErrors((s) => ({ ...s, [k]: undefined })))}
        files={files}
        setFile={(k, f) => (setFiles((s) => ({ ...s, [k]: f })), setErr(''), errors[k] && setErrors((s) => ({ ...s, [k]: undefined })))}
        existing={existing}
        errors={errors}
        disabled={!!busy}
      />
      {err ? (
        <p className="pf-err" style={{ marginTop: 14 }} role="alert">
          {err}
        </p>
      ) : null}
      <div className="pf-row" style={{ marginTop: 22 }}>
        <button className="pf-btn orange" disabled={!!busy}>
          {busy ? <Spinner /> : null}
          {busy || submitLabel || (row ? 'Save profile' : 'Register company')}
        </button>
        {onCancel ? (
          <button type="button" className="pf-btn ghost" onClick={onCancel} disabled={!!busy}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
