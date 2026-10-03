---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - brand
  - project/ise
---

# ISE Sporty Finish

The layer added in round 10 ("give this website a sporty look wherever possible"), in the logo's colours. All in `src/app/sporty.css` — it styles the generated screens from the outside, so the screens stay untouched.

| Element | How |
|---|---|
| **Forward-leaning display type** | Every Archivo 62 % headline (and card names, book titles, menu items) is italic, like the wordmark |
| **Angled primary buttons** | Saffron buttons clipped to a parallelogram: `clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)`; keyboard focus ring drawn inside |
| **Running-track stripe** | 3 px stripe under every header: orange / white / green / white / blue / white blocks moving continuously (transform-animated, 4 s) |
| **Speed lines** | Dark sections get faint 115° diagonal lines |
| **Pitch markings** | Intentions and Explore Hall 2 sections get a centre circle and halfway line in green at 16 % |
| **LED stadium board** | Amber dot-matrix ticker with sport icons under the hero — [[LED Sports Ticker]] |
| **Footer line** | "BE A SPORT. SHAPE THE FUTURE." in display type, white → orange gradient text |
| **Scroll progress** | Orange → yellow → green → blue gradient |
| **Curtain line** | Repeating orange/green/blue stripe |

![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-intentions.jpg|600]]
