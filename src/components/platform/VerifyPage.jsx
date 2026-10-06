'use client';
// /verify?c=ISE27-XXXXXXXX: what the QR code on a card opens. Shows whether the card is valid,
// for gate staff; only approved cards return a holder.
import { useEffect, useState } from 'react';
import { getClient } from '@/lib/platform/client';
import Shell from './Shell';
import { Loading } from './ui';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [state, setState] = useState(null);
  const check = async (c) => {
    const v = c.trim().toUpperCase();
    if (!v) return;
    setState('loading');
    try {
      const sb = await getClient();
      const { data, error } = await sb.rpc('verify_badge', { code: v });
      if (error) throw error;
      setState(data?.[0] ? { ok: true, ...data[0] } : { ok: false });
    } catch {
      setState({ ok: false, error: true });
    }
  };
  useEffect(() => {
    const c = new URLSearchParams(location.search).get('c') || '';
    setCode(c);
    if (c) check(c);
    else setState(null);
  }, []);
  return (
    <Shell title="Card check" main="pf-main narrow">
      <div className="pf-card" style={{ textAlign: 'center' }}>
        <span className="pf-kicker">Accreditation check</span>
        {state === 'loading' ? (
          <Loading />
        ) : state?.ok ? (
          <>
            <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '12px auto 18px', display: 'grid', placeItems: 'center', background: 'var(--green)', color: '#fff', fontSize: 40 }}>✓</div>
            <h1 style={{ fontSize: 32 }}>Valid card</h1>
            <p style={{ marginTop: 14, fontSize: 20, fontWeight: 700 }}>{state.full_name}</p>
            <p className="pf-muted">{[state.organisation, state.country].filter(Boolean).join(' · ')}</p>
            <p style={{ marginTop: 12 }}>
              <span className="pf-pill approved">{state.category}</span>
            </p>
          </>
        ) : state ? (
          <>
            <div style={{ width: 84, height: 84, borderRadius: '50%', margin: '12px auto 18px', display: 'grid', placeItems: 'center', background: 'var(--red)', color: '#fff', fontSize: 40 }}>×</div>
            <h1 style={{ fontSize: 32 }}>{state.error ? 'Couldn’t check' : 'Not a valid card'}</h1>
            <p className="pf-muted" style={{ marginTop: 10 }}>{state.error ? 'Check the connection and try again.' : 'This code doesn’t belong to an approved registration.'}</p>
          </>
        ) : (
          <h1 style={{ fontSize: 30 }}>Check a card</h1>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            history.replaceState(null, '', '?c=' + encodeURIComponent(code.trim().toUpperCase()));
            check(code);
          }}
          className="pf-row"
          style={{ marginTop: 26, justifyContent: 'center' }}
        >
          <input className="pf-input" style={{ maxWidth: 240, textAlign: 'center', letterSpacing: '0.08em' }} placeholder="ISE27-XXXXXXXX" value={code} onChange={(e) => setCode(e.target.value)} />
          <button className="pf-btn">Check</button>
        </form>
      </div>
    </Shell>
  );
}
