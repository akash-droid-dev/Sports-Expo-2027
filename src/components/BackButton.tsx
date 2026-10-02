'use client';
// Sticky back button on every page. Goes back when the visitor came from another page of
// this site, otherwise to Home. Hidden on Home unless there is a page to go back to.
import { useEffect, useState } from 'react';
import { BASE, withBase } from '@/lib/base';
import { leavePage } from '@/lib/motion';

// Pages with a fixed left rail: keep the button clear of it.
const RAIL_WIDTH: Record<string, number> = { '/portal': 240, '/admin': 232 };

function cameFromThisSite() {
  try {
    return !!document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
  } catch {
    return false;
  }
}

export default function BackButton() {
  const [state, setState] = useState<{ show: boolean; back: boolean; left: number } | null>(null);

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '');
    const isHome = path === BASE || path === '';
    const back = cameFromThisSite();
    const route = path.slice(BASE.length) || '/';
    setState({ show: !isHome || back, back, left: RAIL_WIDTH[route] ?? 0 });
  }, []);

  if (!state || !state.show) return null;
  const go = () => {
    if (state.back) leavePage(() => history.back());
    else leavePage(() => (location.href = withBase('/')));
  };
  return (
    <button
      type="button"
      className="back-btn"
      style={state.left ? { left: state.left + 18 } : undefined}
      onClick={go}
      aria-label={state.back ? 'Go back to the previous page' : 'Go to the home page'}
    >
      <span className="back-btn-arrow" aria-hidden="true">
        ←
      </span>
      <span className="back-btn-label">{state.back ? 'BACK' : 'HOME'}</span>
    </button>
  );
}
