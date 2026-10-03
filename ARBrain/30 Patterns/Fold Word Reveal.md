---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/typography
  - react
status: proven
---

# Fold Word Reveal

> A word unfolds letter by letter like folded paper: each letter's top half drops in, then its bottom half swings down from behind it in 3D.

**Used in:** Home hero "SPORTS" and "2027" (on load); "GLOBAL" and "INDIA" in "The global sports economy meets India" (on scroll).

## How it works

- Each letter is three spans: an invisible `.fw-size` (keeps the width and baseline), `.fw-top` (clipped to the top half) and `.fw-bot` (clipped to the bottom half, starts at `rotateX(178deg)`).
- Staggered with `--d` = delay + index × step.
- `when="load"` starts after mount; `when="view"` waits until 60 % visible.
- After the last letter lands the component adds `.is-done`: the halves are removed and the plain letter shows. This frees the 3D GPU layers (big win on phones).
- `backface-visibility: hidden` is only applied while unfolding, for the same reason.

## Reuse it

- Wrap the word: `<FoldWord text="SPORTS" when="load" />`.
- Inherits font, size and colour from the parent.
- A visually hidden copy keeps the word readable to screen readers.

## Gotchas and lessons

- Do not add CSS filters on the letters (they caused a dark patch).

## Related

[[ISE Motion]] · [[Home page]] · [[ISE Typography]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/anim/FoldWord.jsx`
```jsx
'use client';
// A word that unfolds letter by letter, like paper folded in half: each letter's lower half
// swings down from behind its upper half. `when="load"` plays after the page appears,
// `when="view"` when the word scrolls into view (src/app/anim.css).
import { useEffect, useRef, useState } from 'react';

export default function FoldWord({ text, when = 'view', delay = 0, step = 70, className = '', style }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(false);
  const letters = Array.from(text).filter((ch) => ch !== ' ').length;
  // After the last letter lands (src/app/anim.css: 180 ms lag + 900 ms swing), show plain text.
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setDone(true), delay + Math.max(0, letters - 1) * step + 1200);
    return () => clearTimeout(t);
  }, [on, delay, letters, step]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (when === 'load' || !('IntersectionObserver' in window)) {
      const t = setTimeout(() => setOn(true), 30);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [when]);
  return (
    <span ref={ref} data-anim="" className={'fold-word' + (on ? ' is-on' : '') + (done ? ' is-done' : '') + (className ? ' ' + className : '')} style={style}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="fw-space" aria-hidden="true">
            {' '}
          </span>
        ) : (
          <span key={i} className="fw-l" aria-hidden="true" style={{ '--d': delay + i * step + 'ms' }}>
            <span className="fw-size">{ch}</span>
            <span className="fw-top">{ch}</span>
            <span className="fw-bot">{ch}</span>
          </span>
        ),
      )}
    </span>
  );
}
```

#### `src/app/anim.css — Fold and reveal words`
```css
/* ---------- Fold and reveal words (FoldWord) ---------- */
.fold-word {
  display: inline-block;
  white-space: nowrap;
}
.fw-space {
  display: inline-block;
  width: 0.28em;
}
.fw-l {
  position: relative;
  display: inline-block;
  perspective: 600px;
}
.fw-size {
  visibility: hidden;
}
.fw-top,
.fw-bot {
  position: absolute;
  left: 0;
  top: 0;
}
/* The upper half stays put; the lower half is folded up behind it and swings down. */
.fw-top {
  -webkit-clip-path: inset(-10% -10% 50% -10%);
  clip-path: inset(-10% -10% 50% -10%);
  opacity: 0;
  transform: translateY(-0.12em);
}
.fw-bot {
  -webkit-clip-path: inset(50% -10% -10% -10%);
  clip-path: inset(50% -10% -10% -10%);
  transform-origin: 50% 50%;
  opacity: 0;
}
/* Once unfolded, the plain letter takes over and the 3D halves go away (fewer GPU layers). */
.fold-word.is-done .fw-top,
.fold-word.is-done .fw-bot {
  display: none;
}
.fold-word.is-done .fw-size {
  visibility: visible;
}
.fold-word.is-done .fw-l {
  perspective: none;
}
.fold-word.is-on .fw-top {
  animation: fwTop 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d) forwards;
}
.fold-word.is-on .fw-bot {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  animation: fwBot 0.9s cubic-bezier(0.3, 1.4, 0.4, 1) calc(var(--d) + 0.18s) forwards;
}
@keyframes fwTop {
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fwBot {
  0% {
    opacity: 1;
    transform: rotateX(178deg);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg);
  }
}
```
