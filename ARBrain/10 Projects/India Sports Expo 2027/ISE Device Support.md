---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - mobile
  - compat
---

# ISE Device Support

## Targets
| Platform | Minimum | How |
|---|---|---|
| Desktop Chrome/Edge/Firefox/Safari | Current | Full experience: live Bucky 3D, live venue tour, globe at up to 1.5× DPR |
| iPhone / iPad | iOS/Safari **14** | Lite mode; maps skipped below iOS 16.4 (no class static blocks) |
| Android | Chrome **67**, Samsung Internet **9.2** | Lite mode; maps skipped below Chrome 94; legacy CSS fill-ins below Chrome 87/88 |
| Firefox | 68 | Compiled target |

`browserslist`: `chrome 67, samsung 9.2, firefox 68, edge 79, safari 14, ios_saf 14`.

## Lite mode (phones and tablets)
Set before first paint by the boot script when `(max-width: 900px), (pointer: coarse)` matches — so **iPads and touch laptops are lite too**. Force with `?lite=1` / `?lite=0`.

| Feature | Desktop | Lite |
|---|---|---|
| Bucky | Live Spline 3D (blinks, wiggle, hop) | Poster image that bobs; 3D runtime never downloaded |
| Venue finale | Official virtual tour iframe, live | Drifting venue photo |
| Earth globe | Live, DPR ≤ 1.5, tile cache 300, fade 160 ms | Live, DPR 1, tile cache 60, no fade; created/freed in scroll pauses near/far from the journey |
| Google Maps | Load when scrolled near | Load on tap |
| Video | Hover previews, live player | Stills; player waits for a tap |
| Hero photo | `hero-stadium.webp` | `hero-stadium-sm.webp` |
| Zone cards / book | Glass with live blur | Tint, no blur |
| Booth strip | 2 sets | 1 set |
| Header | Full nav | Logo + ☰ menu (with build label) |
| Layout | Design layout | `mobile-fit.js` reflows wide grids/rows/headlines (≤1024 px); no sideways scroll |

## Old-browser layer
Polyfills in the boot script (hasOwn, fromEntries, at, flat/flatMap, replaceAll, matchAll, allSettled, queueMicrotask, structuredClone, replaceChildren, globalThis); `legacy-css.js` for inline `inset`, `aspect-ratio`, flex `gap`; stylesheets give top/right/bottom/left before `inset`; boot-error overlay after 9 s. → [[Old Browser Support]]

## Why phones crashed (round 7)
Four live WebGL views at once (hero hand/globe, Bucky, the globe, the venue tour) pushed phones past their memory limit. iOS closes such tabs, and after repeated crashes refuses to load the page ("can't open page"). Rule since: **one live WebGL view at a time on phones**.

## Phone layout details worth remembering
- Zone cards: 2×2 grid filling the screen under the title, name `clamp(13px,3.9vw,18px)`, facts 9 px, CTA "ZONE A →"; landscape 4 across. Bucky hidden while cards show (`html.vs-cards-on`).
- Portal, Admin and My Expo are desktop layouts reflowed to fit — usable but best on larger screens.

## Related
[[Lite Mode for Phones and Tablets]] · [[ISE Performance Log]] · [[Playbook - Mobile and Tablet Performance Audit]] · [[Playbook - Old Browser Hardening]]
