// The platform's Supabase project (database, sign-in, files, realtime). The publishable key is
// meant to be public: what anyone can read or change is decided by the database's row-level
// security (supabase/migrations). Override both at build time for another project.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adqmcpbwevpvybyolygm.supabase.co';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_YHepLbhwM_zAp7dB15_Ddw_FwWxW3lt';
// Where supabase-js keeps the signed-in session in this browser.
export const SESSION_KEY = 'sb-' + new URL(SUPABASE_URL).hostname.split('.')[0] + '-auth-token';

/** True if this browser has (or had) a signed-in session, without loading the client. */
export function maybeSignedIn() {
  try {
    return !!localStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}
