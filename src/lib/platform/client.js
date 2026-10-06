// One Supabase client for the whole site, loaded on first use so pages that never need it
// (most public pages) don't download it.
import { SUPABASE_KEY, SUPABASE_URL } from './config';

let pending = null;

/** @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} */
export function getClient() {
  pending ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 5 } },
    }),
  );
  return pending;
}

/** Plain REST read for public data, without loading the client (anonymous access). */
export async function restSelect(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPABASE_KEY, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${table}: ${res.status}`);
  return res.json();
}

/** Turns a Supabase error into a sentence for the screen. */
export function errorText(err) {
  if (!err) return '';
  const m = err.message || String(err);
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'Can’t reach the server. Check your connection and try again.';
  if (/Token has expired|otp_expired|invalid/i.test(m) && /token|otp|code/i.test(m)) return 'That code is wrong or has expired. Request a new one.';
  if (/rate limit|too many/i.test(m)) return 'Too many attempts. Please wait a minute and try again.';
  if (/duplicate key/i.test(m)) return 'This is already registered.';
  if (/row-level security/i.test(m)) return 'You don’t have permission to do that.';
  return m;
}
