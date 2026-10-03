---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - react
  - performance
status: proven
---

# Infinite Marquee

> A strip that scrolls forever, left to right or right to left, without a visible seam. Hover/focus pauses it; it also pauses itself while off screen.

**Used in:** Intent boxes, booth strip, LED sports ticker, watch cards, featured products.

## How it works

- Items are rendered `repeat` times per half, and the track holds two identical halves. A CSS keyframe moves the track by exactly −50 % (one half), so the loop is seamless.
- `dir="right"` uses the reverse keyframe (from −50 % to 0).
- Copies are `aria-hidden` and `tabIndex=-1`, so screen readers and keyboards see each item once.
- An IntersectionObserver (120 px margin) toggles `.is-off`, which sets `animation-play-state: paused` — off-screen strips cost nothing.
- `render(item, index, isCopy, { half, pos })` lets callers know where a card sits (used by [[Card Deal Strip]]).

## Reuse it

- Copy `Marquee.jsx` and the "Continuous strips" CSS block.
- Make sure one half is wider than the widest screen (raise `repeat` if not).
- Duration: `seconds` for one half; ~7–9 s per item reads calmly.

## Gotchas and lessons

- Only animate `transform` (never `left` or `background-position`).
- Each strip is one GPU layer; do not add `will-change` on the children.

## Related

[[Card Deal Strip]] · [[CSS 3D Boxes]] · [[LED Sports Ticker]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/anim/Marquee.jsx`
```jsx
'use client';
// A strip that scrolls continuously, left to right (`dir="right"`) or right to left. Items are
// repeated so the loop is seamless; the copies are hidden from screen readers and keyboard.
// `render(item, index, isCopy, { half, pos })`: `pos` is the place within its half (0, 1, 2…).
// Hovering or focusing pauses it, and so does being off screen (saves phone battery and frames).
// Without motion it becomes a plain sideways-scrolling row.
import { Fragment, useEffect, useRef } from 'react';

export default function Marquee({ items, render, dir = 'left', seconds = 40, repeat = 2, className = '', paused = false, label }) {
  const half = [];
  for (let r = 0; r < repeat; r++) items.forEach((it, i) => half.push({ it, i, copy: r > 0 }));
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-off', !e.isIntersecting), { rootMargin: '120px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-anim="" className={'mq ' + (dir === 'right' ? 'mq-right' : 'mq-left') + (paused ? ' is-paused' : '') + (className ? ' ' + className : '')} aria-label={label} role={label ? 'region' : undefined}>
      <div className="mq-track" style={{ '--mq-dur': seconds + 's' }}>
        {[0, 1].map((h) => (
          <Fragment key={h}>
            {half.map(({ it, i, copy }, k) => (
              <Fragment key={h + '-' + k}>{render(it, i, copy || h > 0, { half: h, pos: k })}</Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
```

#### `src/app/anim.css — Continuous strips`
```css
/* ---------- Continuous strips (Marquee) ---------- */
.mq {
  overflow: hidden;
  position: relative;
}
.mq-track {
  display: flex;
  width: -webkit-max-content;
  width: max-content;
  animation: mqLeft var(--mq-dur, 40s) linear infinite;
  will-change: transform;
}
.mq-right .mq-track {
  animation-name: mqRight;
}
.mq:hover .mq-track,
.mq:focus-within .mq-track,
.mq.is-paused .mq-track,
.mq.is-off .mq-track {
  animation-play-state: paused;
}
/* Off screen, the 3D booths lie flat so their faces stop being separate GPU layers. */
.mq.is-off .booth-cube {
  transform-style: flat;
  transform: none;
  animation: none;
}
.mq.is-off .bc-face {
  transform: none;
}
@keyframes mqLeft {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}
@keyframes mqRight {
  from {
    transform: translate3d(-50%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
```
