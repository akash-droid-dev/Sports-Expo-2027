// Files: public site media, exhibitor logos and product photos (public buckets) and visitor
// photos, ID documents and exhibitor documents (private bucket, shown through short-lived links).
import { getClient } from './client';
import { SUPABASE_URL } from './config';

export function publicUrl(bucket, path) {
  if (!path) return '';
  if (/^https?:/.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

const signed = new Map();
/** A link to a private file, valid for an hour (cached for 50 minutes). */
export async function privateUrl(path) {
  if (!path) return '';
  const hit = signed.get(path);
  if (hit && hit.until > Date.now()) return hit.url;
  const sb = await getClient();
  const { data, error } = await sb.storage.from('private').createSignedUrl(path, 3600);
  if (error) throw error;
  signed.set(path, { url: data.signedUrl, until: Date.now() + 50 * 60 * 1000 });
  return data.signedUrl;
}

/** Shrinks photos before upload (long side `max` px, JPEG), so uploads and pages stay fast. */
export async function shrinkImage(file, max = 1400, quality = 0.85) {
  if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 600 * 1024) return file;
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, file.type === 'image/png' ? '.png' : '.jpg'), { type: blob.type });
  } catch {
    return file;
  }
}

export function extOf(file) {
  const m = /\.([a-z0-9]{1,5})$/i.exec(file?.name || '');
  return m ? m[1].toLowerCase() : 'bin';
}

/** Uploads (replacing any file at the same path) and returns the stored path. */
export async function upload(bucket, path, file) {
  const sb = await getClient();
  const body = file.type?.startsWith('image/') ? await shrinkImage(file) : file;
  const { error } = await sb.storage.from(bucket).upload(path, body, { upsert: true, contentType: body.type || undefined, cacheControl: '3600' });
  if (error) throw error;
  return path;
}

export async function removeFile(bucket, path) {
  if (!path || /^https?:/.test(path)) return;
  const sb = await getClient();
  await sb.storage.from(bucket).remove([path]);
}

export const MAX_UPLOAD = 10 * 1024 * 1024;
