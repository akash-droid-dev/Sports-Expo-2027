'use client';
// Sign in with a one-time code sent by email. Renders `children(user)` once signed in.
import { useEffect, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { useSession } from '@/lib/platform/hooks';
import { Loading, Spinner } from './ui';

const RESEND_AFTER = 60;

export function SignIn({ title = 'Sign in', text }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [wait, setWait] = useState(0);
  useEffect(() => {
    if (!wait) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const send = async (e) => {
    e?.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return setErr('Enter a valid email address.');
    setBusy(true);
    setErr('');
    try {
      const sb = await getClient();
      const { error } = await sb.auth.signInWithOtp({ email: addr, options: { shouldCreateUser: true } });
      if (error) throw error;
      setEmail(addr);
      setSent(true);
      setCode('');
      setWait(RESEND_AFTER);
    } catch (x) {
      setErr(errorText(x));
    } finally {
      setBusy(false);
    }
  };
  const verify = async (e) => {
    e.preventDefault();
    const token = code.replace(/\D/g, '');
    if (token.length < 6) return setErr('Enter the code from the email.');
    setBusy(true);
    setErr('');
    try {
      const sb = await getClient();
      const { error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
    } catch (x) {
      setErr(errorText(x));
      setBusy(false);
    }
  };

  return (
    <div className="pf-auth">
      <div className="pf-card">
        <span className="pf-kicker">India Sports Expo 2027</span>
        <h1 style={{ fontSize: 30 }}>{sent ? 'Check your email' : title}</h1>
        <p className="pf-muted" style={{ margin: '10px 0 24px' }}>
          {sent ? (
            <>
              We sent a sign-in code to <b style={{ color: 'var(--ink)' }}>{email}</b>. It can take a minute; check spam too.
            </>
          ) : (
            text || 'Enter your email and we’ll send you a one-time code. No password needed.'
          )}
        </p>
        {!sent ? (
          <form onSubmit={send} className="pf-grid" style={{ gap: 14 }}>
            <label className="pf-field">
              <span className="pf-label">Email</span>
              <input
                className="pf-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoFocus
              />
            </label>
            {err ? <p className="pf-err">{err}</p> : null}
            <button className="pf-btn orange block" disabled={busy}>
              {busy ? <Spinner /> : null}Email me a code
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="pf-grid" style={{ gap: 14 }}>
            <label className="pf-field">
              <span className="pf-label">Code</span>
              <input
                className="pf-input pf-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                autoFocus
              />
            </label>
            {err ? <p className="pf-err">{err}</p> : null}
            <button className="pf-btn block" disabled={busy}>
              {busy ? <Spinner /> : null}Sign in
            </button>
            <div className="pf-row pf-small" style={{ justifyContent: 'space-between' }}>
              <button type="button" className="pf-link" onClick={() => (setSent(false), setErr(''))}>
                Use another email
              </button>
              {wait ? (
                <span className="pf-muted">New code in {wait}s</span>
              ) : (
                <button type="button" className="pf-link" onClick={send}>
                  Send a new code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/** Shows sign-in until there is a session, then `children(user)`. */
export default function AuthGate({ children, title, text, frame }) {
  const { ready, user } = useSession();
  const wrap = frame || ((x) => x);
  if (!ready) return wrap(<Loading />, null);
  if (!user) return wrap(<SignIn title={title} text={text} />, null);
  return children(user);
}
