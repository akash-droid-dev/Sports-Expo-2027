'use client';
// Small building blocks shared by the platform pages.
import { useCallback, useEffect, useRef, useState } from 'react';

export function Spinner() {
  return <span className="pf-spin" role="status" aria-label="Loading" />;
}

export function Loading() {
  return (
    <div className="pf-center">
      <Spinner />
    </div>
  );
}

const LABEL = {
  pending: 'Under review',
  approved: 'Approved',
  rejected: 'Not approved',
  changes: 'Changes requested',
  active: 'Active',
  suspended: 'Suspended',
  submitted: 'Submitted',
  accepted: 'Accepted',
  listed: 'Listed on website',
};
export function Pill({ status, children }) {
  return <span className={'pf-pill ' + (status || '')}>{children || LABEL[status] || status}</span>;
}

/** `const [toast, show] = useToast()`; render {toast}; call show('Saved') or show(msg, true) for errors. */
export function useToast() {
  const [t, setT] = useState(null);
  const timer = useRef(0);
  const show = useCallback((text, bad = false) => {
    clearTimeout(timer.current);
    setT({ text, bad });
    timer.current = setTimeout(() => setT(null), bad ? 6000 : 2600);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const el = t ? (
    <div className={'pf-toast' + (t.bad ? ' bad' : '')} role={t.bad ? 'alert' : 'status'}>
      {t.text}
    </div>
  ) : null;
  return [el, show];
}

export function Drawer({ title, onClose, children, actions }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    const o = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', k);
      document.body.style.overflow = o;
    };
  }, [onClose]);
  return (
    <>
      <div className="pf-drawer-bg" onClick={onClose} />
      <aside className="pf-drawer" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <div className="pf-drawer-head">
          <button className="pf-x" onClick={onClose} aria-label="Close">
            ×
          </button>
          <h2 style={{ fontSize: 20, flex: 1, minWidth: 0 }}>{title}</h2>
          {actions}
        </div>
        <div className="pf-drawer-body">{children}</div>
      </aside>
    </>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="pf-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>
          {t.label}
          {t.n ? <span className="n">{t.n}</span> : null}
        </button>
      ))}
    </div>
  );
}

/** A button that shows a spinner while its async onClick runs. */
export function AsyncButton({ onClick, children, className = 'pf-btn', disabled, ...rest }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      {...rest}
      className={className}
      disabled={disabled || busy}
      onClick={async (e) => {
        setBusy(true);
        try {
          await onClick(e);
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? <Spinner /> : null}
      {children}
    </button>
  );
}

export function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(d);
  }
}
