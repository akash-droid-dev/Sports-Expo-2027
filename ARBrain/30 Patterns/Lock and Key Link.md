---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/interaction
  - react
status: proven
---

# Lock and Key Link

> A link drawn as a padlock with a key. On click the key slides in and turns, the shackle lifts, and only then does the browser go to the target page.

**Used in:** Home "Book a stall" tile.

## How it works

- The click is intercepted (`preventDefault`) and `is-unlocking` plays the SVG animation: the key slides in and turns; at 650 ms `is-open` springs the shackle; at 1.5 s the brand curtain covers the page and it navigates.
- Modified clicks (Cmd/Ctrl/Shift/Alt) open normally; reduced motion skips straight to the page change.
- The key nudges gently on its own (`lkNudge`) to invite a click.

## Reuse it

- Use for one hero call to action per page, not for every link.
- Keep the total under ~1.5 s.

## Gotchas and lessons

- The site-wide link interceptor ignores events that are already `defaultPrevented`, so the two never fight.

## Related

[[Brand Curtain and Page Transitions]] · [[Home page]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/anim/LockKeyLink.jsx`
```jsx
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
```

#### `src/app/anim.css — Lock and key link`
```css
/* ---------- Lock and key link (LockKeyLink) ---------- */
.lock-key {
  gap: 12px;
}
.lk-icon {
  display: block;
  overflow: visible;
  flex: none;
}
.lk-icon * {
  transform-box: fill-box;
}
.lk-key {
  transform-origin: 50% 50%;
  animation: lkNudge 2.4s ease-in-out infinite;
}
.lk-hole {
  fill: #f07c12;
}
.lk-shackle {
  transform-origin: 100% 100%;
  transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
}
.lk-body {
  transition: fill 0.3s ease;
}
@keyframes lkNudge {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}
.lock-key:hover .lk-key {
  animation-duration: 0.9s;
}
/* Click: the key goes in and turns, then the shackle springs open. */
.lock-key.is-unlocking .lk-key {
  animation: lkInsert 0.65s cubic-bezier(0.5, 0, 0.3, 1) forwards;
}
@keyframes lkInsert {
  0% {
    transform: translateX(0);
  }
  55% {
    transform: translateX(19px);
  }
  100% {
    transform: translateX(19px) scaleY(-1);
  }
}
.lock-key.is-open .lk-shackle {
  transform: translateY(-5px) rotate(28deg);
}
.lock-key.is-open .lk-body {
  fill: #0b6e4f;
}
.lock-key.is-open .lk-label::after {
  content: ' · UNLOCKED';
}
@media (prefers-reduced-motion: reduce) {
  .lk-key {
    animation: none;
  }
}
```
