'use client';
// A side panel with a form for one record (product, team member, document, catalogue item…).
// `fields` use the same definitions as the registration forms.
import { useState } from 'react';
import { errorText } from '@/lib/platform/client';
import FieldList, { validate } from './Fields';
import { Drawer, Spinner } from './ui';

export default function RecordDrawer({ title, fields, initial = {}, existing = {}, onSave, onDelete, onClose, saveLabel = 'Save', readOnly }) {
  const [values, setValues] = useState(initial);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const save = async (e) => {
    e.preventDefault();
    const errs = validate(fields, values, files, existing);
    setErrors(errs);
    if (Object.keys(errs).length) return setErr('Please check the highlighted fields.');
    setBusy(true);
    setErr('');
    try {
      await onSave(values, files);
      onClose();
    } catch (x) {
      setErr(errorText(x));
    } finally {
      setBusy(false);
    }
  };
  const del = async () => {
    if (!confirm('Delete this? This can’t be undone.')) return;
    setBusy(true);
    try {
      await onDelete();
      onClose();
    } catch (x) {
      setErr(errorText(x));
      setBusy(false);
    }
  };
  return (
    <Drawer title={title} onClose={onClose}>
      <form onSubmit={save} noValidate className="pf-card" style={{ marginTop: 8 }}>
        <FieldList
          fields={fields}
          values={values}
          setValue={(k, v) => setValues((s) => ({ ...s, [k]: v }))}
          files={files}
          setFile={(k, f) => setFiles((s) => ({ ...s, [k]: f }))}
          existing={existing}
          errors={errors}
          disabled={busy || readOnly}
        />
        {err ? (
          <p className="pf-err" style={{ marginTop: 14 }} role="alert">
            {err}
          </p>
        ) : null}
        {readOnly ? null : (
          <div className="pf-row" style={{ marginTop: 22 }}>
            <button className="pf-btn" disabled={busy}>
              {busy ? <Spinner /> : null}
              {saveLabel}
            </button>
            <span className="pf-spacer" />
            {onDelete ? (
              <button type="button" className="pf-btn ghost" style={{ color: 'var(--red)' }} onClick={del} disabled={busy}>
                Delete
              </button>
            ) : null}
          </div>
        )}
      </form>
    </Drawer>
  );
}
