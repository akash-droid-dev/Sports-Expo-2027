---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/scroll
  - react
status: proven
---

# Card Deal Strip

> Cards wait stacked like a deck of playing cards, each slightly turned. When the strip scrolls into view they are dealt out one after another into a row, and once the last card lands the row starts moving continuously. Hover pauses it.

**Used in:** Home "12 Watch" (Live & on demand, rolls right to left) and Home "08 Featured products" (rolls left to right).

## How it works

- `useDeal(ref, dealt)` holds the phase: `stack` → `deal` (60 ms after the strip is 35 % visible) → `roll` (after 900 ms + 110 ms per dealt card).
- Each card gets `--k` (its place in the row) and `--r` (a pseudo-random tilt). In `stack`, CSS translates every card back to the deck position: `translateX(calc(var(--k) * -CARD_STEP + 40px)) rotate(var(--r))`. CARD_STEP = card width + margin (use `box-sizing: border-box`, or the deck is off by the padding).
- In `deal` the transform is removed; the transition delay `calc(var(--k) * 110ms)` deals them one by one.
- In `roll` the [[Infinite Marquee]] is un-paused.
- For a left-to-right strip the marquee starts half a loop along, so the **second half** is what shows first: deal those (`half === 1`), and hide the rest (`ps-off`) so they snap into place without a transition.
- Reduced motion or no IntersectionObserver → straight to `roll`.

## Reuse it

- Copy `useDeal.js`, `Marquee.jsx` and the `.ps-*` (or `.ws-*`) CSS block.
- Set the card width and CARD_STEP in the CSS (and the phone override).
- Pick `dir="left"` or `"right"`; for `right`, deal `half === 1` cards.
- Keep the number of dealt cards ≤ 6 so the deal finishes in about 1.6 s.

## Gotchas and lessons

- Phases must not depend on screenshots or timers in tests: log `className` per animation frame instead (see [[Playbook - Mobile and Tablet Performance Audit]]).
- Photos inside the cards: give the photo box a fixed ratio with `padding-top: 75%` (old browsers ignore `aspect-ratio` in stylesheets).

## Related

[[Infinite Marquee]] · [[ISE Motion]] · [[Home page]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/anim/useDeal.js`
```js
'use client';
// Card-deal timing shared by the Home card strips (WatchShuffle, ProductShuffle): the cards wait
// stacked like a deck ('stack'), are dealt out into a row when the strip scrolls into view
// ('deal'), and the row starts moving once the last card has landed ('roll').
import { useEffect, useState } from 'react';

export const DEAL_STEP_MS = 110;
const DEAL_MS = 900;

export default function useDeal(ref, dealt) {
  const [phase, setPhase] = useState('stack');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return setPhase('roll');
    let t1, t2;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t1 = setTimeout(() => setPhase('deal'), 60);
        t2 = setTimeout(() => setPhase('roll'), 60 + DEAL_MS + dealt * DEAL_STEP_MS);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ref, dealt]);
  return phase;
}
```

#### `src/components/home/ProductShuffle.jsx`
```jsx
'use client';
// Home "Featured products": the product cards wait stacked like a deck; when the section scrolls
// into view they are dealt out into a row, which then keeps moving left to right
// (src/app/anim.css). Hover pauses it.
import { useRef } from 'react';
import Marquee from '@/components/anim/Marquee';
import useDeal from '@/components/anim/useDeal';
import { withBase } from '@/lib/base';

// Cards dealt from the deck: the ones on screen when the strip starts (the rest snap into place).
const DEALT = 6;

export default function ProductShuffle({ items = [] }) {
  const ref = useRef(null);
  const n = items.length;
  const phase = useDeal(ref, Math.min(n, DEALT));
  if (!n) return null;
  return (
    <div ref={ref} data-anim="" className={'ps ps-' + phase}>
      <Marquee
        dir="right"
        seconds={Math.max(30, n * 7)}
        repeat={n < 5 ? 2 : 1}
        paused={phase !== 'roll'}
        label="Featured products"
        items={items}
        render={(p, i, copy, { half, pos }) => {
          // A left-to-right strip starts half a loop along, so the second half is what shows first.
          const dealt = half === 1 && pos < DEALT;
          return (
            <a
              href={withBase('/exhibit#directory')}
              className={'ps-card' + (dealt ? '' : ' ps-off')}
              style={{ '--k': pos, '--r': ((pos * 47) % 22) - 11 + 'deg' }}
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
            >
              <span className="ps-photo">
                <image-slot id={p.slot} shape="rect" placeholder="Product photograph" />
              </span>
              <span className="ps-cat">
                {p.cat} · {p.stall}
              </span>
              <span className="ps-name">{p.name}</span>
              <span className="ps-by">
                {p.by} · {p.moq}
              </span>
            </a>
          );
        }}
      />
    </div>
  );
}
```

#### `src/components/home/WatchShuffle.jsx`
```jsx
'use client';
// Home "Live & on demand": the session cards wait stacked like a deck; when the section scrolls
// into view they are dealt out into a row, which then keeps moving right to left
// (src/app/anim.css). Hover pauses it.
import { useRef } from 'react';
import Marquee from '@/components/anim/Marquee';
import useDeal from '@/components/anim/useDeal';
import DemoVideo from '@/components/DemoVideo';
import { withBase } from '@/lib/base';

export default function WatchShuffle({ items = [] }) {
  const ref = useRef(null);
  const phase = useDeal(ref, Math.min(items.length, 6));
  if (!items.length) return null;
  const n = items.length;
  return (
    <div ref={ref} data-anim="" className={'ws ws-' + phase}>
      <Marquee
        dir="left"
        seconds={Math.max(28, n * 9)}
        repeat={n < 4 ? 3 : 2}
        paused={phase !== 'roll'}
        label="Live and on-demand sessions"
        items={items}
        render={(v, i, copy) => {
          const k = copy ? i + n : i;
          return (
            <a
              href={withBase('/programme')}
              className="ws-card"
              style={{ '--k': k, '--r': ((k * 47) % 22) - 11 + 'deg' }}
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
            >
              <span className="ws-thumb">
                <DemoVideo id={v.id} thumb />
                <span className="ws-badge" style={{ background: v.badgeBg }}>
                  {v.badge}
                </span>
                <span className="ws-dur">{v.dur}</span>
                <span className="ws-play" aria-hidden="true">
                  ▶
                </span>
              </span>
              <span className="ws-title">{v.title}</span>
              <span className="ws-meta">
                {v.spk} · Day {v.day}
              </span>
            </a>
          );
        }}
      />
    </div>
  );
}
```

#### `src/app/anim.css — Featured product cards`
```css
/* ---------- Featured product cards (ProductShuffle) ---------- */
.ps .mq {
  padding: 18px 0 26px;
  margin: 0 -28px;
}
.ps-card {
  position: relative;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  width: 280px;
  margin-right: 22px;
  padding: 10px 10px 16px;
  background: #fff;
  border: 1px solid #e3e0d8;
  border-radius: 10px;
  box-shadow: 0 18px 40px -26px rgba(14, 14, 15, 0.55);
  color: #0e0e0f;
  text-decoration: none;
  z-index: calc(100 - var(--k));
  transition:
    transform 0.85s cubic-bezier(0.2, 0.9, 0.25, 1.05) calc(var(--k) * 110ms),
    opacity 0.4s ease calc(var(--k) * 110ms),
    box-shadow 0.3s ease;
}
/* Stacked like a deck at the left edge, each card slightly turned; the cards off screen wait
   hidden and snap into place when the deal starts. */
.ps-stack .ps-card {
  transform: translateX(calc(var(--k) * -302px + 40px)) translateY(30px) rotate(var(--r));
}
.ps-stack .ps-card.ps-off {
  opacity: 0;
}
.ps-card.ps-off {
  transition: box-shadow 0.3s ease;
}
.ps-deal .ps-card,
.ps-roll .ps-card {
  transform: none;
  opacity: 1;
}
.ps-roll .ps-card {
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 0.3s ease;
}
.ps-roll .ps-card:hover {
  transform: translateY(-8px) rotate(1.2deg);
  box-shadow: 0 28px 50px -24px rgba(14, 14, 15, 0.6);
}
.ps-photo {
  position: relative;
  display: block;
  height: 0;
  padding-top: 75%; /* 4:3, also on browsers without aspect-ratio */
  border-radius: 6px;
  overflow: hidden;
  background: #f6f4ef;
}
.ps-photo image-slot {
  position: absolute;
  top: 0;
  left: 0;
}
.ps-cat {
  font: 500 10px 'JetBrains Mono', monospace;
  letter-spacing: 0.14em;
  color: #6b6a66;
  padding: 0 4px;
}
.ps-name {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  padding: 0 4px;
}
.ps-by {
  font-size: 13px;
  color: #6b6a66;
  padding: 0 4px;
}
@media (max-width: 600px) {
  .ps-card {
    width: 240px;
  }
  .ps-stack .ps-card {
    transform: translateX(calc(var(--k) * -262px + 20px)) translateY(30px) rotate(var(--r));
  }
}
```

#### `src/app/anim.css — Live & on demand cards`
```css
/* ---------- Live & on demand cards (WatchShuffle) ---------- */
.ws .mq {
  padding: 18px 0 26px;
  margin: 0 -28px;
}
.ws-card {
  position: relative;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;
  margin-right: 22px;
  padding: 10px 10px 14px;
  background: #fff;
  border: 1px solid #e3e0d8;
  border-radius: 10px;
  box-shadow: 0 18px 40px -26px rgba(14, 14, 15, 0.55);
  color: #0e0e0f;
  text-decoration: none;
  z-index: calc(100 - var(--k));
  transition:
    transform 0.85s cubic-bezier(0.2, 0.9, 0.25, 1.05) calc(var(--k) * 110ms),
    opacity 0.4s ease calc(var(--k) * 110ms),
    box-shadow 0.3s ease;
}
/* Stacked like a deck on the left, each card slightly turned. */
.ws-stack .ws-card {
  transform: translateX(calc(var(--k) * -342px + 40px)) translateY(30px) rotate(var(--r));
  opacity: 0;
}
.ws-stack .ws-card:nth-child(-n + 6) {
  opacity: 1;
}
.ws-deal .ws-card,
.ws-roll .ws-card {
  transform: none;
  opacity: 1;
}
.ws-roll .ws-card {
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 0.3s ease;
}
.ws-roll .ws-card:hover {
  transform: translateY(-8px) rotate(-1.2deg);
  box-shadow: 0 28px 50px -24px rgba(14, 14, 15, 0.6);
}
.ws-thumb {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  background: #1a1a1c;
}
.ws-badge {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #fff;
  font: 500 10px 'JetBrains Mono', monospace;
  letter-spacing: 0.14em;
  padding: 4px 8px;
}
.ws-dur {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #fff;
  font: 500 11px 'JetBrains Mono', monospace;
  background: rgba(14, 14, 15, 0.7);
  padding: 2px 6px;
}
.ws-play {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 52px;
  height: 52px;
  margin: -26px 0 0 -26px;
  border: 1.5px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  background: rgba(14, 14, 15, 0.25);
  transition: transform 0.3s ease;
}
.ws-card:hover .ws-play {
  transform: scale(1.12);
  background: #f07c12;
  border-color: #f07c12;
}
.ws-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.25;
}
.ws-meta {
  font-size: 13px;
  color: #6b6a66;
}
@media (max-width: 600px) {
  .ws-card {
    width: 260px;
  }
  .ws-stack .ws-card {
    transform: translateX(calc(var(--k) * -282px + 20px)) translateY(30px) rotate(var(--r));
  }
}
```
