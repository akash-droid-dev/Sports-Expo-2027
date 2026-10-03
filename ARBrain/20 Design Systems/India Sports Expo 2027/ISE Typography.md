---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - typography
  - project/ise
---

# ISE Typography

All from Google Fonts:
`https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap`

| Role | Family | Settings |
|---|---|---|
| **Display** | Archivo | `font-stretch: 62%`, weight 900, **italic** (sporty layer), uppercase. XL 148 px / 0.84 (clamped 64–148), L 80 / 0.88, M weight 800 at 26–56 px. Slight right padding (0.06em) so italics don't clip. |
| **Body** | Instrument Sans | 400–700, 15–19 px, line height 1.45–1.55 |
| **UI labels** | Instrument Sans | 12–13 px, weight 600–700, letter-spacing +0.08–0.1em, uppercase (nav, buttons) |
| **Data / meta** | JetBrains Mono | 400–500, 10–15 px, letter-spacing +0.1–0.22em, often uppercase (kickers like `08 — FEATURED PRODUCTS`, stall IDs, coordinates, credits) |

## Patterns
- Section kicker: mono, 12 px, 0.2em, `NN — TITLE`.
- Headline: Archivo 62 % / 900 / italic, line height 0.84–0.9; a key word in saffron (e.g. FOUR EVENT **ZONES**).
- Fold-reveal words for hero moments ([[Fold Word Reveal]]).
- Footer line "BE A SPORT. SHAPE THE FUTURE." in display type with a gradient fill.

## Phones
Headlines are clamped (e.g. zone title `clamp(28px, 9vw, 40px)`); `mobile-fit.js` shrinks oversized inline headlines so nothing overflows.
