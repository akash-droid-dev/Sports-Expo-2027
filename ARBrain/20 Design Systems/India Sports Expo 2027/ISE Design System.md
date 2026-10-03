---
type: design-system
project: "[[India Sports Expo 2027]]"
status: live
tags:
  - design-system
  - project/ise
---

# ISE Design System

> **Premium, editorial, sporty.** Ink and white with a saffron accent (70–80 % neutral, 20–30 % accent), condensed italic display type that leans forward like the logo, square corners, hairline rules, mono data labels, and motion that explains space. The client's logo adds navy, blue, orange and green for the sporty layer.

![[90 Assets/India Sports Expo 2027/brand/logo.png|360]]

## Parts
| Note | What |
|---|---|
| [[ISE Brand and Logo]] | Logo, spinning ring, clear space, on-dark version, tagline |
| [[ISE Colour]] | Neutrals, saffron, zone colours, logo colours, states |
| [[ISE Typography]] | Archivo 62 % italic display, Instrument Sans body, JetBrains Mono data |
| [[ISE Layout Shape and Spacing]] | Grid, widths, spacing scale, shape, shadows, breakpoints |
| [[ISE Motion]] | Easing, durations, the motion catalogue, reduced motion |
| [[ISE Sporty Finish]] | Slant, angled buttons, track stripe, speed lines, pitch markings, LED board |
| [[ISE UI Components]] | Header, buttons, cards, drawers, wizards, toasts, search, Hall Plan, Bucky |
| [[ISE Status and States]] | Status words + icons, stall states, empty and loading states |
| [[ISE Voice and Copy]] | Headline style, labels, demo markers |
| [[ISE Design Tokens]] | Copy-paste CSS variables and JSON |

## Principles
1. **Neutral first, saffron for action.** Saffron marks the primary action, the route, progress — nothing decorative.
2. **Type does the shouting.** Huge condensed italic headlines; quiet body; mono for data.
3. **Square and ruled.** No rounded corners except the phone frame, status dots and photo/card corners added for the dealt cards.
4. **Motion explains space** (zoom, roof removal, route drawing, dealing, unfolding) — and every effect has a reduced-motion fallback.
5. **Status is never colour alone** — always icon + word.
6. **Sample data is labelled** SAMPLE / DEMO / PROVISIONAL.
7. **Fast on every device** — see [[ISE Performance Log]].

## Source
Design handoff `design/HANDOFF.md` (tokens section) + the sporty layer `src/app/sporty.css` + motion `src/app/motion.css` / `src/app/anim.css`.
