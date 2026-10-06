// Sign-in with a one-time code, shared by the website and the mobile app.
// Test mode (app_settings.sign_in.test_code, switched by the owner in Admin → Team & roles):
// no email is sent and every address signs in with the shared test code (123456) through the
// `test-sign-in` edge function. Otherwise Supabase emails a real code.
import { getClient, restSelect } from './client';
import { SUPABASE_KEY, SUPABASE_URL } from './config';

let mode = null;
/** 'test' or 'email'. */
export async function signInMode() {
  if (mode) return mode;
  try {
    const rows = await restSelect('app_settings', 'select=value&key=eq.sign_in');
    mode = rows?.[0]?.value?.test_code === true ? 'test' : 'email';
  } catch {
    // Settings not set up yet (migration 0003 and the test-sign-in function not deployed).
    mode = 'email';
  }
  return mode;
}

/** Step 1: in test mode nothing is sent; otherwise Supabase emails the code. */
export async function sendCode(email) {
  if ((await signInMode()) === 'test') return { test: true };
  const sb = await getClient();
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
  return { test: false };
}

/** Step 2: exchanges the code for a session. */
export async function verifyCode(email, code) {
  const sb = await getClient();
  if ((await signInMode()) === 'test') {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/test-sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY },
      body: JSON.stringify({ email, code }),
    });
    const body = await res.json().catch(() => ({}));
    if (body.off) {
      // Switched off meanwhile: fall back to email codes.
      mode = 'email';
      throw new Error('Test sign-in has been switched off. Use “Send a new code” to get one by email.');
    }
    if (!res.ok || !body.token_hash) throw new Error(body.error || 'Sign-in failed (' + res.status + ').');
    let r = await sb.auth.verifyOtp({ token_hash: body.token_hash, type: 'magiclink' });
    if (r.error) r = await sb.auth.verifyOtp({ token_hash: body.token_hash, type: 'email' });
    if (r.error) throw r.error;
    return r.data;
  }
  const { data, error } = await sb.auth.verifyOtp({ email, token: code, type: 'email' });
  if (error) throw error;
  return data;
}
