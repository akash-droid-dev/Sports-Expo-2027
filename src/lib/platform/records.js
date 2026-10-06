// Mapping between registration form answers (by field key) and database rows. Core fields have
// their own columns; any field an admin adds is kept in `answers`.
import { withBase } from '@/lib/base';

export const VISITOR_COLUMNS = ['full_name', 'phone', 'category', 'organisation', 'designation', 'country'];
export const VISITOR_FILES = { photo: 'photo_path', id_document: 'id_doc_path' };
export const EXHIBITOR_COLUMNS = ['company', 'contact_name', 'phone', 'website', 'country', 'city', 'sector', 'type', 'zone', 'stall_product', 'preferred_location', 'looking_for', 'description'];
export const EXHIBITOR_FILES = { logo: 'logo_path' };

export async function loadFields(sb, form, all = false) {
  let q = sb.from('form_fields').select('*').eq('form', form).order('sort').order('label');
  if (!all) q = q.eq('active', true);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

const isFile = (f) => f.type === 'image' || f.type === 'file';

/** Row → form values. */
export function rowToValues(row, columns) {
  if (!row) return {};
  const v = { ...(row.answers || {}) };
  for (const c of columns) v[c] = row[c] ?? '';
  if (row.zone) v.zone = row.zone; // a letter; the select shows the matching option
  return v;
}

/** Form values → row fields (columns + answers), leaving files out. */
export function valuesToRow(values, fields, columns) {
  const row = {};
  const answers = {};
  for (const f of fields) {
    if (isFile(f)) continue;
    let v = values[f.key];
    if (typeof v === 'string') v = v.trim();
    if (columns.includes(f.key)) {
      if (f.key === 'zone' && v) v = String(v).trim().charAt(0).toUpperCase();
      if (f.key === 'website' && v && !/^https?:\/\//i.test(v)) v = 'https://' + v;
      row[f.key] = v === '' ? null : v;
    } else if (v !== undefined && v !== '') answers[f.key] = v;
  }
  row.answers = answers;
  return row;
}

/** The zone select stores 'A · …' options; the database keeps the letter. */
export function zoneFields(fields) {
  return fields.map((f) => (f.key === 'zone' ? { ...f, options: (f.options || []).map(String) } : f));
}
export function zoneValue(fields, values) {
  const f = fields.find((x) => x.key === 'zone');
  const v = values.zone;
  if (!f || !v || String(v).length > 1) return values;
  const opt = (f.options || []).find((o) => String(o).startsWith(v + ' ')) || v;
  return { ...values, zone: opt };
}

export function verifyUrl(code) {
  return location.origin + withBase('/verify/') + '?c=' + encodeURIComponent(code);
}

export const CATEGORY_COLOURS = {
  Visitor: '#F07C12',
  'Trade buyer': '#2FC27A',
  Delegate: '#3D8BFF',
  Media: '#FFD23F',
  Speaker: '#C792EA',
  Government: '#FF6B6B',
  VIP: '#FFFFFF',
  Student: '#7FD1FF',
};
