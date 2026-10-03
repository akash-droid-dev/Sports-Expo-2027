---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - layout
  - project/ise
---

# ISE Layout, Shape and Spacing

## Layout
- Public pages are fluid: content `max-width: 1440px`, centred; grids use `repeat(auto-fit, minmax(…, 1fr))`.
- Sticky header 60 px; pinned sections (journey) use `position: sticky; top: 60px; height: calc(100vh - 60px)`.
- Portal and Admin: fixed left rails (232 / 240 px), desktop-first.
- Drawers: right side, `min(560–760px, 94–96vw)`, scrim `rgba(14,14,15,.55–.6)`.
- Wizards: 260 px numbered rail, 4 px saffron progress bar.

## Spacing
- Section padding 64–96 px vertical, **28 px horizontal** (16 px on phones).
- Grid gaps: 8 / 12 / 16 / 24 / 32 / 48 / 56.
- Buttons 46–56 px tall, 16–28 px horizontal padding (angled buttons pad `max(22px, 1.4em)`).

## Shape
- **Square corners everywhere.** Exceptions: phone frame (54 / 42 px), status dots, and the animated cards added later (zone cards, watch/product cards 10 px, booth cards).
- Borders: 1 px ink or `#E3E0D8`.

## Shadows (rare)
- Panels and phone: `0 24–30px 60px -24–30px rgba(14,14,15,.5–.55)`.
- Dealt cards: `0 18px 40px -26px rgba(14,14,15,.55)`, hover `0 28px 50px -24px rgba(14,14,15,.6)`.

## Breakpoints
| Width | What changes |
|---|---|
| ≤ 1024 px | `mobile-fit.js` reflows wide grids, rows, headlines |
| ≤ 900 px | Phone header (logo + ☰), phone zone cards, smaller logo |
| ≤ 600 px | Narrower dealt cards (240–260 px) |
| `(pointer: coarse)` | Lite mode even on wide tablets |
