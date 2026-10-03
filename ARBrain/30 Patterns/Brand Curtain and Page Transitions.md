---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/navigation
status: proven
---

# Brand Curtain and Page Transitions

> A dark curtain with the logo covers the page while it loads, then slides away; internal links slide it back in before navigating. It lingers a little longer on the first page of a visit.

**Used in:** Every page load and every internal link.

## How it works

- `#page-curtain` is server-rendered in the layout, so it covers the first paint.
- `leavePage(go)` adds `.is-leaving`, waits 520 ms, then navigates.
- `pageshow` with `persisted` (back/forward cache) lifts it again.

## Reuse it

- Keep it under ~600 ms; never block on slow assets (2.5 s cap).

## Related

[[Scroll Reveals and Count-ups]] · [[Spinning Logo Ring]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/app/motion.css — Page curtain`
```css
/* ---------- Page curtain ---------- */
#page-curtain {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: 10000;
  background: #0e0e0f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: translateY(0);
  transition: transform 0.75s var(--ease-io);
  /* Safety net if scripts never run. */
  animation: curtainSafety 0.6s var(--ease-io) 4s forwards;
}
#page-curtain.is-gone {
  transform: translateY(-101%);
  animation: none;
}
#page-curtain.is-leaving {
  transform: translateY(0);
  transition: none;
  animation: curtainIn 0.52s var(--ease-io) both;
}
@keyframes curtainIn {
  from {
    transform: translateY(101%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes curtainSafety {
  to {
    transform: translateY(-101%);
  }
}
.curtain-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.curtain-logo {
  --logo-h: clamp(84px, 14vw, 132px);
  opacity: 0;
  transform: perspective(700px) rotateX(-70deg) translateY(12px);
  transform-origin: 50% 0;
  animation: curtainLogo 0.8s var(--ease) 0.12s forwards;
}
@keyframes curtainLogo {
  to {
    opacity: 1;
    transform: none;
  }
}
```
