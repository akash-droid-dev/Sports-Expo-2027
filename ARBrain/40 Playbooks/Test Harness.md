---
type: playbook
tags:
  - playbook
  - testing
  - performance
proven_on: "[[India Sports Expo 2027]]"
---

# Test Harness

Playwright scripts used to verify India Sports Expo 2027. Files are in `40 Playbooks/Harness/`.

## Setup
```bash
mkdir harness && cd harness && npm init -y && npm i playwright-core acorn
npx playwright install chromium        # or set CHROME_PATH to an existing Chrome/Chromium
# serve the production build: cd <app>/out && python3 -m http.server 4100
```

| Script | What it checks | Usage |
|---|---|---|
| `jank.mjs` | Scroll smoothness: frames, long frames > 50 ms, p95, avg — device emulation, CPU 4× | `node jank.mjs http://localhost:4100/ "iPad Pro 11"` |
| `layercount.mjs` | Composited GPU layers at 30 % / 50 % of the page, grouped by element | `node layercount.mjs <url> "Pixel 5"` |
| `trace.mjs` | Main-thread time by event (Layerize, Paint, Layout, JS by file) | `node trace.mjs <url> "<device>"` |
| `prof2.mjs` | JS sampling profile during scroll; attributes a heavy library's time to the app function that called it | `node prof2.mjs <url> "<device>"` |
| `over.mjs` | Elements wider than the phone screen (sideways scroll) per page | `node over.mjs /,/exhibit/,/zones/` (edit host inside) |
| `oldandroid.mjs` | Boots pages with modern JS APIs deleted and old-CSS mode; reports errors | `node oldandroid.mjs` |
| `bootdesk.mjs` | Desktop boot: booted flag, classes, overlay, maps present | `node bootdesk.mjs` |
| `prod3.mjs` | Card-deal phases logged per animation frame + strip position | `node prod3.mjs <url> [device]` |
| `globe.mjs` | Screenshots the globe canvas at journey points (desktop + iPad) | `node globe.mjs` |
| `vaultshots.mjs` | Screenshots every page and Home section, desktop + phone | `node vaultshots.mjs` |
| `escheck.cjs` | Parses JS files at a given ES version (old-browser syntax check) | `node escheck.cjs 2019 out/_next/static/chunks/*.js` |

Tips: block third-party hosts (`p.route(/google|arcgisonline/, r => r.abort())`) for stable runs; never judge timing from screenshots — log per frame in the page.
