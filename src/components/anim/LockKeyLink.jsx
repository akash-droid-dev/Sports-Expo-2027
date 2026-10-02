'use client';
// "Book a stall" link with a padlock and key. On click the key slides into the lock and turns,
// the shackle springs open, and then the page changes (src/app/anim.css).
import { useState } from 'react';
import { leavePage } from '@/lib/motion';

export default function LockKeyLink({ href, children, className = '', style }) {
  const [state, setState] = useState('');
  const go = (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (state) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return leavePage(() => (location.href = href));
    setState('is-unlocking');
    setTimeout(() => setState('is-unlocking is-open'), 650);
    setTimeout(() => leavePage(() => (location.href = href)), 1500);
  };
  return (
    <a href={href} onClick={go} data-anim="" className={'lock-key ' + state + (className ? ' ' + className : '')} style={style}>
      <svg className="lk-icon" viewBox="0 0 76 34" width="66" height="30" aria-hidden="true">
        <g className="lk-key">
          <circle cx="9" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M16 17h20m-6 0v5m-5-5v4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="lk-lock">
          <path className="lk-shackle" d="M48 15v-5a8 8 0 0 1 16 0v5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <rect className="lk-body" x="44" y="14" width="24" height="18" rx="3" fill="currentColor" />
          <circle className="lk-hole" cx="56" cy="21.5" r="2.4" />
          <rect className="lk-hole" x="55" y="22" width="2" height="5" rx="1" />
        </g>
      </svg>
      <span className="lk-label">{children}</span>
    </a>
  );
}
