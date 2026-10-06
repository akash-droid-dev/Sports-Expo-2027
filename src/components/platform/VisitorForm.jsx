'use client';
// Visitor registration form (new or editing a pending registration).
import { useMemo, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { VISITOR_COLUMNS, VISITOR_FILES, rowToValues, valuesToRow } from '@/lib/platform/records';
import { extOf, upload } from '@/lib/platform/storage';
import FieldList, { validate } from './Fields';
import { usePrivateUrl } from './Badge';
import { Spinner } from './ui';

export default function VisitorForm({ user, fields, row, onDone, onCancel }) {
  const [values, setValues] = useState(() => rowToValues(row, VISITOR_COLUMNS));
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const photoUrl = usePrivateUrl(row?.photo_path);
  const existing = useMemo(() => ({ photo: row?.photo_path ? photoUrl || '1' : '', id_document: row?.id_doc_path || '' }), [row, photoUrl]);

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
      const data = valuesToRow(values, fields, VISITOR_COLUMNS);
      // Files first (private/v/<user id>/…), so the row never points at a missing file.
      for (const [key, col] of Object.entries(VISITOR_FILES)) {
        const file = files[key];
        if (!file) continue;
        setBusy(key === 'photo' ? 'Uploading photo…' : 'Uploading document…');
        const name = key === 'photo' ? 'photo' : 'id-document';
        data[col] = await upload('private', `v/${user.id}/${name}-${Date.now()}.${key === 'photo' ? 'jpg' : extOf(file)}`, file);
      }
      setBusy('Saving…');
      if (row) {
        const { error } = await sb.from('visitors').update(data).eq('id', row.id);
        if (error) throw error;
      } else {
        const { error } = await sb.from('visitors').insert({ ...data, email: user.email });
        if (error) throw error;
      }
      onDone?.();
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
      <div className="pf-note" style={{ marginTop: 22 }}>
        Signing in as <b>{user.email}</b>. Your card is issued once the organisers approve your registration; you’ll see it on this
        account straight away.
      </div>
      {err ? (
        <p className="pf-err" style={{ marginTop: 14 }} role="alert">
          {err}
        </p>
      ) : null}
      <div className="pf-row" style={{ marginTop: 22 }}>
        <button className="pf-btn orange" disabled={!!busy}>
          {busy ? <Spinner /> : null}
          {busy || (row ? 'Save changes' : 'Submit registration')}
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
