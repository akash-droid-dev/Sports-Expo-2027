---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - brand
  - project/ise
---

# ISE Brand and Logo

## The logo
![[90 Assets/India Sports Expo 2027/brand/logo.png|420]]

- Original artwork from the client: **1580 × 639 px** PNG (`uploads/client-logo-original.png`, in the repo as `public/brand/logo.png`).
- Two parts: a **ring** of sport figures in the logo's four colours (left, columns 0–643) and the **wordmark** "INDIA / SPORTS / EXPO 2027" with the line "BE A SPORT. SHAPE THE FUTURE." (columns 644–1579).
- Logo colours (sampled): navy `#2E3F8F`, blue `#0A62BF`, orange `#F07C12`, green `#00803F`. See [[ISE Colour]].

## Split files (used on the site)
| File | Use |
|---|---|
| ![[90 Assets/India Sports Expo 2027/brand/ring.png\|80]] `ring.png` | The ring — spins |
| ![[90 Assets/India Sports Expo 2027/brand/wordmark.png\|160]] `wordmark.png` | Lettering on light backgrounds |
| ![[90 Assets/India Sports Expo 2027/brand/wordmark-on-dark.png\|160]] `wordmark-on-dark.png` | Lettering on dark (navy → white, grey → `#E3E0D8`) |

Split at full resolution and resized to 360 px height; recombined, the parts match the original (difference ≈ 0). **The design is never redrawn.**

## The spinning ring
The ring turns **clockwise (left to right over the top), continuously, one turn every 16 s**; the lettering stays still. Off for reduced motion. Implementation: [[Spinning Logo Ring]].

## Sizes
| Place | Height |
|---|---|
| Header | 44 px (38 px on phones) |
| Side rail (Portal/Admin) | 52 px |
| Loading curtain | `clamp(84px, 14vw, 132px)` (with a rotateX entrance) |
| Home book cover | `clamp(64px, 7vw, 96px)` |

Width follows the artwork ratio: `height × 1580 / 639`.

## Tagline
**"Be a sport. Shape the future."** — from the logo; heads every footer in display type with a white → orange gradient.

## Earlier mark (design handoff, replaced)
A 22 × 22 white square with a saffron 6 px bar rotated −28°, plus the wordmark "INDIA SPORTS EXPO **2027**" in Archivo 62 %/900/24 px with 2027 in saffron.
