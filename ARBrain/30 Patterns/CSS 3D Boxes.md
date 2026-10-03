---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/3d
  - performance
status: proven
---

# CSS 3D Boxes

> Pure-CSS 3D boxes (no WebGL): five faces with `transform-style: preserve-3d`, travelling in an [[Infinite Marquee]]. Booths turn with the pointer and bob gently.

**Used in:** Home "Intentions" (Explore / Exhibit / Attend / Connect / Watch as 3D boxes) and "Build your presence" (stall products as 3D booths sized by product).

## How it works

- Each face is absolutely positioned and rotated/translated by the box's `--w`, `--d`, `--h` custom properties.
- Pointer move sets `--turn` on the booth.
- Off screen (`.mq.is-off`) the boxes are flattened: `transform-style: flat; transform: none; animation: none` — 3D faces otherwise stay as separate GPU layers.
- Phones render one set of booths instead of two (decided after mount to keep hydration identical).

## Reuse it

- Good for "products of increasing size" or "five choices" rows.
- Budget: 9 layers per booth while visible; keep counts low on phones.

## Gotchas and lessons

- Measured on a Pixel 5: 28 booths = 252 GPU layers; flattening off screen + one set cut the page from ~400 to ~120 layers.

## Related

[[Infinite Marquee]] · [[Home page]] · [[Playbook - Mobile and Tablet Performance Audit]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/home/IntentBoxes.jsx`
```jsx
'use client';
// Home "Intentions": Explore, Exhibit, Attend, Connect and Watch as 3D boxes travelling left to
// right in a continuous strip (src/app/anim.css).
import Marquee from '@/components/anim/Marquee';

const TONES = ['#F07C12', '#1F4E9E', '#0B6E4F', '#7A2E8C', '#9E1B22'];

export default function IntentBoxes({ items = [] }) {
  if (!items.length) return null;
  return (
    <Marquee
      dir="right"
      seconds={38}
      repeat={2}
      label="Ways into the Expo"
      className="ibox-strip"
      items={items}
      render={(it, i, copy) => (
        <a href={it.href} className="ibox" style={{ '--tone': TONES[i % TONES.length] }} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined}>
          <span className="ibox-top" aria-hidden="true" />
          <span className="ibox-side" aria-hidden="true" />
          <span className="ibox-front">
            <span className="ibox-n">{it.n}</span>
            <span className="ibox-t">{it.t}</span>
            <span className="ibox-s">
              {it.s}
              <span className="ibox-arrow">→</span>
            </span>
          </span>
        </a>
      )}
    />
  );
}
```

#### `src/components/home/BoothStrip.jsx`
```jsx
'use client';
// Home "Build your presence": the seven stall products as 3D booth blocks (bigger product,
// taller block) travelling left to right. Hover pauses the strip and turns the booth with the
// pointer; each one opens the Exhibit page (src/app/anim.css).
import { useEffect, useState } from 'react';
import Marquee from '@/components/anim/Marquee';
import { withBase } from '@/lib/base';
import { isLite } from '@/lib/device';

function turn(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  e.currentTarget.style.setProperty('--turn', -32 + x * 50 + 'deg');
}

export default function BoothStrip({ items = [] }) {
  // Seven booths already outrun a phone screen: one set per half keeps the 3D layers down.
  // Decided after mounting so the server-rendered HTML still matches.
  const [lite, setLite] = useState(false);
  useEffect(() => setLite(isLite()), []);
  if (!items.length) return null;
  return (
    <Marquee
      dir="right"
      seconds={46}
      repeat={lite ? 1 : 2}
      label="Stall products"
      className="booth-strip"
      items={items}
      render={(b, i, copy) => {
        const w = Math.round(b.w * 0.95);
        const d = Math.round(b.d * 1.1);
        const h = Math.max(10, Math.round(b.h * 0.55));
        return (
          <a
            href={withBase('/exhibit#products')}
            className="booth"
            style={{ '--w': w + 'px', '--d': d + 'px', '--h': h + 'px', '--k': i }}
            aria-hidden={copy || undefined}
            tabIndex={copy ? -1 : undefined}
            onPointerMove={turn}
            onPointerLeave={(e) => e.currentTarget.style.removeProperty('--turn')}
          >
            <span className="booth-stage" aria-hidden="true">
              <span className="booth-cube">
                <span className="bc-face bc-front" />
                <span className="bc-face bc-back" />
                <span className="bc-face bc-left" />
                <span className="bc-face bc-right" />
                <span className="bc-face bc-top" />
              </span>
              <span className="booth-floor" />
            </span>
            <span className="booth-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="booth-name">{b.name}</span>
            <span className="booth-size">{b.size}</span>
            <span className="booth-cta">VIEW →</span>
          </a>
        );
      }}
    />
  );
}
```

#### `src/app/anim.css — Intention boxes`
```css
/* ---------- Intention boxes (IntentBoxes) ---------- */
.ibox-strip {
  padding: 40px 0 30px;
}
.ibox {
  --depth: 22px;
  position: relative;
  flex: none;
  display: block;
  width: 290px;
  height: 230px;
  margin: 0 calc(28px + var(--depth)) 0 0;
  color: #0e0e0f;
  text-decoration: none;
  transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.ibox-front {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 26px 24px 22px;
  background: #fff;
  border: 2px solid #0e0e0f;
  box-sizing: border-box;
}
/* Top and right faces give the tile depth, like a box seen from the front left. */
.ibox-top,
.ibox-side {
  position: absolute;
  border: 2px solid #0e0e0f;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}
.ibox-top {
  left: 0;
  bottom: 100%;
  width: 100%;
  height: var(--depth);
  margin-bottom: -2px;
  background: var(--tone);
  transform-origin: 0 100%;
  transform: skewX(-45deg);
}
.ibox-side {
  left: 100%;
  top: 0;
  width: var(--depth);
  height: 100%;
  margin-left: -2px;
  background: #0e0e0f;
  transform-origin: 0 0;
  transform: skewY(-45deg);
}
.ibox-n {
  font: 500 12px 'JetBrains Mono', monospace;
  letter-spacing: 0.16em;
  color: #6b6a66;
}
.ibox-t {
  margin-top: auto;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: 64px;
  line-height: 0.85;
}
.ibox-s {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 15px;
  color: #3a3a3e;
}
.ibox-arrow {
  color: var(--tone);
  transition: transform 0.3s ease;
}
.ibox:hover,
.ibox:focus-visible {
  transform: translate(-6px, 6px);
}
.ibox:hover .ibox-front,
.ibox:focus-visible .ibox-front {
  background: var(--tone);
  color: #fff;
}
.ibox:hover .ibox-n,
.ibox:hover .ibox-s,
.ibox:focus-visible .ibox-n,
.ibox:focus-visible .ibox-s {
  color: #fff;
}
.ibox:hover .ibox-arrow {
  color: #fff;
  transform: translateX(6px);
}
.ibox:hover .ibox-top {
  background: #0e0e0f;
}
@media (max-width: 600px) {
  .ibox {
    --depth: 16px;
    width: 220px;
    height: 190px;
  }
  .ibox-t {
    font-size: 40px;
  }
}
```

#### `src/app/anim.css — Booth products strip`
```css
/* ---------- Booth products strip (BoothStrip) ---------- */
.booth-strip {
  margin: 8px -28px 0;
  padding: 10px 0 6px;
}
.booth {
  --turn: -32deg;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 210px;
  margin-right: 18px;
  padding: 0 16px 18px;
  border: 1px solid #2a2a2d;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(180deg, #161618, #0e0e0f);
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.3s ease;
}
.booth:hover,
.booth:focus-visible {
  transform: translateY(-8px);
  border-color: #f07c12;
}
.booth-stage {
  position: relative;
  height: 170px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  perspective: 700px;
  perspective-origin: 50% 20%;
}
.booth-floor {
  position: absolute;
  bottom: 22px;
  left: 18%;
  right: 18%;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(240, 124, 18, 0.35), transparent 70%);
}
/* A box of width --w, depth --d and height --h, seen from above and turned. */
.booth-cube {
  position: relative;
  width: var(--w);
  height: var(--h);
  margin-bottom: 30px;
  transform-style: preserve-3d;
  transform: rotateX(-24deg) rotateY(var(--turn));
  transition: transform 0.25s ease-out;
  animation: boothRise 3.6s ease-in-out calc(var(--k) * -0.5s) infinite;
}
@keyframes boothRise {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}
.bc-face {
  position: absolute;
  left: 0;
  top: 0;
  border: 1.5px solid #f07c12;
  box-sizing: border-box;
}
.bc-front,
.bc-back {
  width: var(--w);
  height: var(--h);
}
.bc-front {
  background: rgba(240, 124, 18, 0.32);
  transform: translateZ(calc(var(--d) / 2));
}
.bc-back {
  background: rgba(240, 124, 18, 0.12);
  transform: rotateY(180deg) translateZ(calc(var(--d) / 2));
}
.bc-left,
.bc-right {
  width: var(--d);
  height: var(--h);
  left: calc((var(--w) - var(--d)) / 2);
  background: rgba(240, 124, 18, 0.2);
}
.bc-left {
  transform: rotateY(-90deg) translateZ(calc(var(--w) / 2));
}
.bc-right {
  transform: rotateY(90deg) translateZ(calc(var(--w) / 2));
}
.bc-top {
  width: var(--w);
  height: var(--d);
  top: calc(var(--d) / -2);
  background: rgba(240, 124, 18, 0.55);
  transform: rotateX(90deg);
}
.booth:hover .bc-face {
  border-color: #fff;
}
.booth:hover .bc-top {
  background: #f07c12;
}
.booth-n {
  font: 500 11px 'JetBrains Mono', monospace;
  color: #6b6a66;
}
.booth-name {
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 800;
  font-size: 26px;
  line-height: 0.95;
  text-transform: uppercase;
}
.booth-size {
  font: 500 11px 'JetBrains Mono', monospace;
  color: #bdb9b0;
}
.booth-cta {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #f07c12;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.booth:hover .booth-cta,
.booth:focus-visible .booth-cta {
  opacity: 1;
  transform: none;
}
```
