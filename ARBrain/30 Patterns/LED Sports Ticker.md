---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/brand
status: proven
---

# LED Sports Ticker

> A stadium LED board: big amber dot-matrix text and inline SVG sport icons scrolling continuously.

**Used in:** Home, right under the hero.

## How it works

- Built on [[Infinite Marquee]].
- The dot matrix is a repeating radial-gradient overlay.
- Icons are inline SVG so they inherit the LED colour.

## Reuse it

- Swap the items array; keep each item short (2–4 words).

## Related

[[Infinite Marquee]] · [[ISE Sporty Finish]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/anim/SportsTicker.jsx`
```jsx
'use client';
// A stadium LED board: the Expo's headline facts scrolling past between sport icons
// (src/app/sporty.css).
import Marquee from './Marquee';

const ICONS = {
  football: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7l4 3-1.5 4.5h-5L8 10z" fill="currentColor" />
    </g>
  ),
  cricket: (
    <g>
      <path d="M15 3l3 3-9 11-3-3z" fill="currentColor" />
      <path d="M6 14l-3 6 1 1 6-3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="17" r="2.5" fill="currentColor" />
    </g>
  ),
  hockey: (
    <g>
      <path d="M8 2v15a3 3 0 0 0 3 3h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="18" cy="9" r="2.5" fill="currentColor" />
    </g>
  ),
  shuttle: (
    <g>
      <path d="M6 4l6 10 6-10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 4l3 10 3-10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="3" fill="currentColor" />
    </g>
  ),
  runner: (
    <g>
      <circle cx="14" cy="4" r="2.4" fill="currentColor" />
      <path d="M8 21l3-6 3 2 1 4M11 15l1-6 4 3 3-1M12 9l-4 1-2 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  trophy: (
    <g>
      <path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="currentColor" />
      <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 21l1-4h4l1 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </g>
  ),
};

const ITEMS = [
  ['football', '3 DAYS'],
  ['cricket', '4 EVENT ZONES'],
  ['hockey', '213 STALLS'],
  ['shuttle', '25 PAVILIONS'],
  ['runner', '40+ COUNTRIES'],
  ['trophy', 'BE A SPORT. SHAPE THE FUTURE.'],
  ['football', 'YASHOBHOOMI · NEW DELHI'],
  ['cricket', '3,000 B2B MEETINGS'],
];

export default function SportsTicker() {
  return (
    <div className="led" role="presentation">
      <Marquee
        dir="left"
        seconds={36}
        repeat={1}
        items={ITEMS}
        render={([icon, text], i, copy) => (
          <span className="led-item" aria-hidden={copy || undefined}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              {ICONS[icon]}
            </svg>
            <span className={i % 3 === 2 ? 'led-hot' : undefined}>{text}</span>
          </span>
        )}
      />
    </div>
  );
}
```

#### `src/app/sporty.css — Stadium LED board`
```css
/* ---------- Stadium LED board (SportsTicker) ---------- */
.led {
  position: relative;
  background: #060607;
  border-top: 3px solid var(--ise-orange);
  border-bottom: 3px solid var(--ise-orange);
  overflow: hidden;
}
/* The dot matrix of an LED panel. */
.led::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle, transparent 0 0.8px, rgba(6, 6, 7, 0.55) 1.4px);
  background-size: 4px 4px;
}
.led-item {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 14px 34px 14px 0;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-style: italic;
  font-weight: 900;
  font-size: 28px;
  letter-spacing: 0.04em;
  color: #fff;
  white-space: nowrap;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
}
.led-item svg {
  color: var(--ise-orange);
  filter: drop-shadow(0 0 6px rgba(240, 124, 18, 0.7));
}
.led-hot {
  color: var(--ise-orange);
  text-shadow: 0 0 12px rgba(240, 124, 18, 0.7);
}
@media (max-width: 600px) {
  .led-item {
    font-size: 20px;
    padding: 10px 24px 10px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  #dc-root header[style*='position: sticky']::after {
    animation: none;
  }
}

/* The angled buttons clip outside outlines: draw the keyboard focus ring inside instead. */
#dc-root a[style*='background: rgb(240, 124, 18)']:focus-visible,
#dc-root button[style*='background: rgb(240, 124, 18)']:focus-visible,
.lock-key:focus-visible {
  outline: 2px solid #0e0e0f;
  outline-offset: -6px;
}
```
