---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/brand
  - pattern/animation
status: proven
---

# Spinning Logo Ring

> The logo artwork (1580 × 639) is split into two images at full resolution — the ring (first 644 px) and the lettering — and laid back together. Only the ring rotates, clockwise, one turn every 16 s. Nothing is redrawn, so the design is unchanged.

**Used in:** Every header, side rail, the loading curtain and the Home book cover.

## How it works

- `.brand-logo` keeps the original aspect ratio via `--logo-h`.
- Ring width 40.7595 %, lettering 59.2405 % (644 / 1580).
- `wordmark-on-dark.png` has white lettering for dark bars.
- Reduced motion: no spin.

## Reuse it

- Split any logo whose mark is rotationally symmetric. Verify the split: recombine and diff against the original.

## Gotchas and lessons

- Rotate only the ring image; rotating a cropped square of the full logo moves the lettering.

## Related

[[ISE Brand and Logo]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/BrandLogo.jsx`
```jsx
// The India Sports Expo 2027 logo, built from its two parts so the ring can turn: the ring
// (public/brand/ring.png, columns 0–643 of the original 1580 × 639 artwork) spins clockwise
// while the wordmark (columns 644–1579) stays put. Both sit exactly where they are in the
// original, so the still logo is unchanged. `onDark` uses the white-lettered wordmark.
import { withBase } from '@/lib/base';

export default function BrandLogo({ onDark = true, className = '' }) {
  return (
    <span className={'brand-logo' + (className ? ' ' + className : '')} role="img" aria-label="India Sports Expo 2027">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-ring" src={withBase('/brand/ring.png')} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-word" src={withBase(onDark ? '/brand/wordmark-on-dark.png' : '/brand/wordmark.png')} alt="" />
    </span>
  );
}
```

#### `src/app/motion.css — The logo`
```css
/* ---------- The logo (src/components/BrandLogo.jsx) ---------- */
/* Same proportions as the original artwork (1580 × 639): the ring takes the first 644 px. */
.brand-logo {
  --logo-h: 44px;
  position: relative;
  display: block;
  flex: none;
  height: var(--logo-h);
  width: calc(var(--logo-h) * 1580 / 639);
}
.brand-ring,
.brand-word {
  position: absolute;
  top: 0;
  height: 100%;
}
.brand-ring {
  left: 0;
  width: 40.7595%;
  transform-origin: 50% 50%;
  animation: brandSpin 16s linear infinite;
  will-change: transform;
}
.brand-word {
  left: 40.7595%;
  width: 59.2405%;
}
/* Left to right over the top: clockwise. */
@keyframes brandSpin {
  to {
    transform: rotate(360deg);
  }
}
aside .brand-logo {
  --logo-h: 52px;
}
@media (max-width: 900px) {
  .site-logo {
    --logo-h: 38px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .brand-ring {
    animation: none;
  }
}
.curtain-line {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: #f07c12;
  transform-origin: left;
  transform: scaleX(0);
  animation: curtainLine 1.1s var(--ease) 0.1s forwards;
}
@keyframes curtainLine {
  to {
    transform: scaleX(1);
  }
}
```
