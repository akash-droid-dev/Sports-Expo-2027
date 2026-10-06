'use client';
// Back button at the top left of every page except Home, inside the header bar. Goes back when
// the visitor came from another page of this site, otherwise to Home.
import { useEffect, useState } from 'react';
import { BASE, withBase } from '@/lib/base';
import { leavePage } from '@/lib/motion';

// Pages with a left rail instead of the top header: the button sits at the top of the rail.
const RAIL_PAGES: string[] = [];
// Pages with neither: content moves down to make room.
const BARE_PAGES = ['/mobile'];

function cameFromThisSite() {
  try {
    return !!document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
  } catch {
    return false;
  }
}

export default function BackButton() {
  const [state, setState] = useState<{ show: boolean; back: boolean; rail: boolean } | null>(null);

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '');
    const isHome = path === BASE || path === '';
    const back = cameFromThisSite();
    const route = path.slice(BASE.length) || '/';
    const rail = RAIL_PAGES.includes(route);
    // Never on the Home page itself; every other page gets it.
    const show = !isHome;
    setState({ show, back, rail });
    // Lets the page header (or rail) make room for the button: src/app/motion.css.
    const root = document.documentElement;
    const bare = show && BARE_PAGES.includes(route);
    root.classList.toggle('has-back', show && !rail);
    root.classList.toggle('has-back-rail', show && rail);
    root.classList.toggle('has-back-bare', bare);
    return () => root.classList.remove('has-back', 'has-back-rail', 'has-back-bare');
  }, []);

  if (!state || !state.show) return null;
  const go = () => {
    if (state.back) leavePage(() => history.back());
    else leavePage(() => (location.href = withBase('/')));
  };
  return (
    <button
      type="button"
      className={state.rail ? 'back-btn on-rail' : 'back-btn'}
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
