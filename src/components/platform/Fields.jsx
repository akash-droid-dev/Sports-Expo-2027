'use client';
// Renders a registration form from its field definitions (table form_fields), so admins can add,
// relabel, reorder or switch off fields without a code change. Values are kept by field key;
// image/file fields hand back a File to upload.
import { useEffect, useMemo, useState } from 'react';
import { MAX_UPLOAD } from '@/lib/platform/storage';

const CODES =
  'AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HK HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PS PA PG PY PE PH PL PT PR QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW';

let countries = null;
export function countryList() {
  if (countries) return countries;
  let names = [];
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    names = CODES.split(' ').map((c) => dn.of(c));
  } catch {
    names = ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Germany', 'Japan', 'Australia', 'Singapore'];
  }
  const rest = names.filter((n) => n && n !== 'India').sort((a, b) => a.localeCompare(b));
  countries = ['India', ...rest];
  return countries;
}

export const isFileField = (f) => f.type === 'image' || f.type === 'file';

/** Returns { key: message } for missing or malformed answers. */
export function validate(fields, values, files, existing = {}) {
  const errs = {};
  for (const f of fields) {
    const v = values[f.key];
    const empty = isFileField(f)
      ? !files[f.key] && !existing[f.key]
      : f.type === 'multiselect'
        ? !Array.isArray(v) || !v.length
        : f.type === 'checkbox'
          ? !v
          : v === undefined || v === null || String(v).trim() === '';
    if (f.required && empty) {
      errs[f.key] = f.type === 'checkbox' ? 'Please confirm.' : isFileField(f) ? 'Please add this file.' : 'Required.';
      continue;
    }
    if (empty) continue;
    if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())) errs[f.key] = 'Enter a valid email.';
    if (f.type === 'tel' && String(v).replace(/[^\d]/g, '').length < 7) errs[f.key] = 'Enter a valid phone number.';
    if (f.type === 'url' && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\S*)$/i.test(String(v).trim())) errs[f.key] = 'Enter a valid web address.';
    if (f.type === 'number' && Number.isNaN(Number(v))) errs[f.key] = 'Enter a number.';
    const file = files[f.key];
    if (file && file.size > MAX_UPLOAD) errs[f.key] = 'This file is over 10 MB.';
    if (file && f.type === 'image' && !/^image\//.test(file.type)) errs[f.key] = 'Choose an image (JPG, PNG or WebP).';
  }
  return errs;
}

function FileInput({ field, file, existing, onFile }) {
  const [over, setOver] = useState(false);
  const preview = useMemo(() => (file && /^image\//.test(file.type) ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);
  const thumb = preview || (field.type === 'image' && /^(https?:|blob:)/.test(existing || '') ? existing : '');
  const accept = field.type === 'image' ? 'image/jpeg,image/png,image/webp' : 'image/*,application/pdf';
  return (
    <label
      className={'pf-drop' + (over ? ' over' : '')}
      onDragOver={(e) => (e.preventDefault(), setOver(true))}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      <input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      <span className="pf-drop-thumb" style={thumb ? { backgroundImage: `url("${thumb}")`, ...(/logo/.test(field.key) ? { backgroundSize: 'contain', backgroundColor: '#fff' } : null) } : undefined}>
        {thumb ? '' : field.type === 'image' ? 'IMG' : 'PDF'}
      </span>
      <span className="pf-drop-text">
        <b>{file ? file.name : existing ? 'Uploaded ✓' : field.type === 'image' ? 'Add a photo' : 'Add a file'}</b>
        {file || existing ? 'Click to replace' : field.type === 'image' ? 'JPG, PNG or WebP, up to 10 MB' : 'PDF or image, up to 10 MB'}
      </span>
    </label>
  );
}

export function Field({ field: f, value, onChange, file, onFile, existing, error, disabled }) {
  const id = 'f-' + f.key;
  const wide = ['textarea', 'multiselect', 'checkbox', 'image', 'file'].includes(f.type);
  const opts = Array.isArray(f.options) ? f.options : [];
  let input;
  if (f.type === 'textarea') {
    input = <textarea id={id} value={value || ''} placeholder={f.placeholder || ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} maxLength={2000} />;
  } else if (f.type === 'select' || f.type === 'country') {
    const list = f.type === 'country' ? countryList() : opts;
    input = (
      <select id={id} value={value || ''} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        <option value="">{f.placeholder || 'Choose…'}</option>
        {list.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (f.type === 'multiselect') {
    const cur = Array.isArray(value) ? value : [];
    input = (
      <div className="pf-chips" role="group" aria-labelledby={id + '-l'}>
        {opts.map((o) => {
          const on = cur.includes(o);
          return (
            <button type="button" key={o} className="pf-chip" aria-pressed={on} disabled={disabled} onClick={() => onChange(on ? cur.filter((x) => x !== o) : [...cur, o])}>
              {on ? '✓ ' : ''}
              {o}
            </button>
          );
        })}
      </div>
    );
  } else if (f.type === 'checkbox') {
    input = (
      <label className="pf-check">
        <input type="checkbox" id={id} checked={!!value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
        <span>{f.placeholder || f.label}</span>
      </label>
    );
  } else if (f.type === 'image' || f.type === 'file') {
    input = <FileInput field={f} file={file} existing={existing} onFile={onFile} />;
  } else {
    const type = { email: 'email', tel: 'tel', url: 'url', number: 'number', date: 'date' }[f.type] || 'text';
    const auto = { full_name: 'name', phone: 'tel', organisation: 'organization', company: 'organization', designation: 'organization-title', website: 'url', city: 'address-level2', contact_name: 'name' }[f.key];
    input = (
      <input
        id={id}
        className="pf-input"
        type={type}
        inputMode={f.type === 'tel' ? 'tel' : undefined}
        autoComplete={auto}
        value={value ?? ''}
        placeholder={f.placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={300}
      />
    );
  }
  return (
    <div className={'pf-field' + (wide ? ' full' : '') + (error ? ' bad' : '')}>
      {f.type !== 'checkbox' || f.placeholder ? (
        <label className="pf-label" htmlFor={id} id={id + '-l'}>
          {f.label} {f.required ? <i>*</i> : null}
        </label>
      ) : null}
      {input}
      {error ? <span className="pf-err">{error}</span> : f.help ? <span className="pf-help">{f.help}</span> : null}
    </div>
  );
}

/** All fields, grouped under their section titles in order. */
export default function FieldList({ fields, values, setValue, files = {}, setFile = () => {}, existing = {}, errors = {}, disabled }) {
  let section = null;
  const out = [];
  for (const f of fields) {
    if (f.section && f.section !== section) {
      section = f.section;
      out.push(
        <div className="pf-section-title" key={'s-' + section + f.key}>
          {section}
        </div>,
      );
    }
    out.push(
      <Field
        key={f.key}
        field={f}
        value={values[f.key]}
        onChange={(v) => setValue(f.key, v)}
        file={files[f.key]}
        onFile={(file) => setFile(f.key, file)}
        existing={existing[f.key]}
        error={errors[f.key]}
        disabled={disabled}
      />,
    );
  }
  return <div className="pf-form">{out}</div>;
}
