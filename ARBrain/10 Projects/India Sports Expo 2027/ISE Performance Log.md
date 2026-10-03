---
type: log
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - performance
---

# ISE Performance Log

Every measured problem and fix, with numbers. Method and scripts: [[Playbook - Mobile and Tablet Performance Audit]], [[Test Harness]].

**Test setup:** Playwright + Chromium, production static build, device emulation, **CPU throttled 4×**, scrolling 14 px per frame from "03 Intro" for 5–6 s. Metrics: frames rendered, long frames (> 50 ms), 95th-percentile frame time, average frame time; GPU layer count via the LayerTree domain; main-thread breakdown via tracing.

## Round 4 — Earth journey scroll felt heavy
| Cause | Fix |
|---|---|
| Hero 3D iframe captured wheel/touch | Wheel/touch pass through to the page |
| Global smooth-scroll fought the journey | Removed |
| Whole Home re-rendered every scroll frame | Journey progress in an external store; only `HomeJourney` re-renders |
| Hero/Bucky appeared late | Posters first, live scenes fade in; runtimes self-hosted + preloaded |

## Round 7 — Phones crashed / wouldn't open
| Cause | Fix |
|---|---|
| 4 live WebGL views at once → out of memory → iOS kills tab, then refuses to load | Lite mode: stills for hero/Bucky/venue, lazy globe at DPR 1 with a small tile cache |
| Large hero poster | 2.5 KB still on phones (later the stadium photo, small version) |
| Maps/video loading eagerly | Tap to load |
| Old iOS syntax errors (class static blocks) | Safari 14 targets, polyfills, skip maps on legacy |

## Round 11 — Phones "smooth like butter" (Pixel 5)
| Metric | Before | After |
|---|---|---|
| GPU layers (mid-page) | ~406 | ~124 |
| Long frames / 6 s | 10–18 | 3–6 |
| Avg frame | 26–32 ms | 20 ms |
| p95 frame | 50–67 ms | 33 ms |

| Cause found | Fix |
|---|---|
| 28 CSS 3D booths × 9 faces = 252 layers, even off screen | Flatten when the strip is off screen; phones render one set |
| Fold-word letters kept 3D halves after unfolding | Swap to plain text after the last letter (`is-done`) |
| Header stripe animated `background-position` → repaint every frame | Transform-animated pseudo-element |
| Marquees ran off screen | IntersectionObserver pauses them |
| Live `backdrop-filter` over drifting venue photo | Tint on lite devices |
| Reveal checker measured every pending element | One measurement per section; skip sections below the fold |
| Grey tap flash | `-webkit-tap-highlight-color: transparent` |

## Round 12 — Tablets and iPads
| Device (lite, 4× CPU) | Before: long frames / avg | After: long frames / avg |
|---|---|---|
| iPad Pro 11 | 15 / 36 ms | **1 / 18 ms** |
| iPad Pro 11 landscape | 10 / 29 ms | **1 / 19 ms** |
| Galaxy Tab S4 | 8 / 25 ms | **0 / 18 ms** |
| iPad (gen 7) landscape | 10 / 24 ms | **0 / 17 ms** (portrait measured) |
| Pixel 5 | 4–6 / 21 ms | **0 / 17 ms** |

| Cause found | Fix |
|---|---|
| **Globe redrawn on every scroll frame** above/below the journey (camera re-sent unchanged) | Only move the camera when progress changed |
| `map.remove()` mid-scroll right after the journey (~0.9 s stall) | Free/create the map during scroll pauses (debounced), with hysteresis |
| Every photo slot had hidden edit buttons with `backdrop-filter` → layers | Not rendered for visitors |
| Credit chips with `backdrop-filter` | Solid darker fill |
| Fold-word `backface-visibility` before unfolding | Only while unfolding |
| iPad layers | ~250 → ~160 |

## Rules distilled
1. One live WebGL view at a time on phones.
2. No `backdrop-filter` over moving content on lite devices; avoid it on repeated elements anywhere.
3. Count GPU layers; flatten/disable 3D when off screen.
4. Animate only `transform`/`opacity`; never `background-position`, `left`, `box-shadow` loops on large areas.
5. Don't do work on scroll frames that produces the same result.
6. Create/destroy heavy objects only in scroll pauses.
7. Pause anything infinite when off screen.

## Related
[[ISE Device Support]] · [[Lite Mode for Phones and Tablets]] · [[CSS 3D Boxes]] · [[Scroll-Driven Globe Journey]]
