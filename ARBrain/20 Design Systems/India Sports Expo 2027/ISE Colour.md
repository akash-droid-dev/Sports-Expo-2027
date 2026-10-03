---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - colour
  - project/ise
---

# ISE Colour

**Balance:** 70–80 % neutral, 20–30 % accent.

## Neutrals
| Token | Hex | Use |
|---|---|---|
| Ink | `#0E0E0F` | Text, nav, dark sections, header |
| White | `#FFFFFF` | Canvas |
| Stone | `#F6F4EF` | Alternate section background, Portal/Admin body |
| Stone 2 | `#F1EFEA` / `#FBFAF7` | Skeletons, rails, book pages |
| Rule | `#E3E0D8` | Hairlines, card borders |
| Muted | `#6B6A66` / `#8A877F` / `#BDB9B0` | Secondary text |
| Graphite | `#3A3A3E` / `#2A2A2D` / `#1A1A1C` | Dark-UI rules and surfaces |
| Zone D ink | `#141416` | Zone D, business exchange section |

## Accent
| Token | Hex | Use |
|---|---|---|
| Saffron | `#F07C12` | Primary action, Sports Boulevard, routes, progress (same as the logo's orange) |
| Saffron ink | `#C2610B` | Saffron text on white, link hover |
| Saffron tint | `#FFF3E6` | Selected row |
| Gold | `#C9A227` | Investor / accredited lounges |
| Info blue | `#1F4E9E` | Query/info status only |

## Zones
| Zone | Colour | Tint |
|---|---|---|
| A — India Sports & Heritage | `#9E1B22` deep red (also LIVE, errors) | `#F6E7E6` |
| B — Sports Goods & Infrastructure | `#3F4A56` steel | `#E8EBEE` |
| C — Sports Tech & Experience | `#0B6E4F` green (also success) | `#E3F1EB` |
| D — Sports Business & Investment | `#141416` ink | `#ECEBE8` |

## Logo colours (sporty layer)
| Token | Hex | Use |
|---|---|---|
| `--ise-navy` | `#2E3F8F` | Logo lettering |
| `--ise-blue` | `#0A62BF` | Track stripe, progress gradient |
| `--ise-orange` | `#F07C12` | Track stripe, footer gradient, angled buttons |
| `--ise-green` | `#00803F` | Track stripe, pitch markings |

## Gradients in use
- Scroll progress: `linear-gradient(90deg, #F07C12, #FFD23F 35%, #00803F 70%, #0A62BF)`.
- Header track stripe: repeating orange / white / green / white / blue / white (60 px blocks, 6 px gaps).
- Hero scrim: ink 92 % → 15 % left to right, plus a bottom fade to ink.

See [[ISE Design Tokens]] for copy-paste values.
