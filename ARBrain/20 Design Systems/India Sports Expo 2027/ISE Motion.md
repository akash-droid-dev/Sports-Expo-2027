---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - motion
  - project/ise
---

# ISE Motion

> Motion explains space and celebrates sport. Every effect has a reduced-motion fallback (`html.m-off`), and anything that loops pauses off screen.

## Easing and timing
| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Default: reveals, lifts, deals |
| `--ease-io` | `cubic-bezier(0.76, 0, 0.24, 1)` | Curtain in/out |
| Springy | `cubic-bezier(0.3, 1.4, 0.4, 1)` | Fold-word swing |
| Deal | `cubic-bezier(0.2, 0.9, 0.25, 1.05)` 850 ms, 110 ms stagger | Dealt cards |
| Durations | 400–1000 ms for transitions; loops 4 s (stripe) → 46–56 s (strips) → 140 s (panorama) | |

## Catalogue
| Moment | Effect | Pattern |
|---|---|---|
| Page load / link | Brand curtain slides away / back | [[Brand Curtain and Page Transitions]] |
| Logo | Ring spins clockwise, 16 s | [[Spinning Logo Ring]] |
| Hero | SPORTS, 2027 fold open; photo slow zoom (1.12 → 1, 26 s); banner parallax on mouse | [[Fold Word Reveal]] |
| Under hero | LED ticker | [[LED Sports Ticker]] |
| Scroll | Headings wipe, items rise staggered, figures count up, progress bar | [[Scroll Reveals and Count-ups]] |
| Earth journey | Globe flight eased to scroll | [[Scroll-Driven Globe Journey]] |
| Journey finale | Zone cards dealt, then flipped | [[Playing Card Flip Finale]] |
| Intro | GLOBAL, INDIA fold; Book a stall unlocks | [[Lock and Key Link]] |
| Strips | 3D intent boxes, 3D booths (left→right); watch cards (right→left) and products (left→right) dealt then rolling | [[CSS 3D Boxes]], [[Card Deal Strip]], [[Infinite Marquee]] |
| Zone guide | Book opens, pages turn, closes itself | [[Page-Turn Book]] |
| Inner pages | Explore unfolds · Zones deals + spins giant letters · Exhibit builds up · Attend flips like a departures board · Connect slides · Programme tickers · Portal/Admin pop tiles | [[Per-Page Signature Animations]] |
| Feedback | Lift on hover, saffron light sweep, link underline draw, click pulse | [[Scroll Reveals and Count-ups]] |
| Bucky | Blink, wiggle/hop + sound, jump + chirp | [[Robot Guide Widget]] |
| Header | Running-track stripe | [[ISE Sporty Finish]] |

## Performance rules for motion
Only `transform` and `opacity`; pause loops off screen; flatten 3D off screen; no live blur on phones; swap finished 3D effects for static content. See [[ISE Performance Log]].
