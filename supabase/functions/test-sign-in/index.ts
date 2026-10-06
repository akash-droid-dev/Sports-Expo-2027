// Test sign-in: while app_settings.sign_in.test_code is on, any email signs in with the shared
// code (app_settings.test_code, default 123456). No email is sent. The account is created if it
// doesn't exist; the browser then exchanges the returned token for a normal session
// (supabase.auth.verifyOtp({ token_hash, type: 'magiclink' })).
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  try {
    const { email, code } = await req.json();
    const addr = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr) || addr.length > 254) return json({ error: 'Enter a valid email address.' }, 400);
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: rows, error: e1 } = await admin.from('app_settings').select('key,value').in('key', ['sign_in', 'test_code']);
    if (e1) throw e1;
    const on = rows?.find((r) => r.key === 'sign_in')?.value?.test_code === true;
    const expected = String(rows?.find((r) => r.key === 'test_code')?.value?.code || '123456');
    if (!on) return json({ error: 'Test sign-in is switched off. Request a code by email.', off: true }, 403);
    if (String(code || '').replace(/\D/g, '') !== expected) return json({ error: 'That code is wrong or has expired. Request a new one.' }, 401);
    // Create the account the first time (an existing one is fine).
    const made = await admin.auth.admin.createUser({ email: addr, email_confirm: true });
    if (made.error && !/already|registered|exists/i.test(made.error.message)) throw made.error;
    const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email: addr });
    if (error) throw error;
    return json({ token_hash: data.properties.hashed_token });
  } catch (e) {
    return json({ error: (e as Error).message || String(e) }, 500);
  }
});
