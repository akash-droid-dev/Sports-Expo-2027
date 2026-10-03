---
type: playbook
tags:
  - playbook
  - performance
  - mobile
proven_on: "[[India Sports Expo 2027]]"
---

# Playbook — Mobile and Tablet Performance Audit

How the India Sports Expo site went from crashing on phones to 0–1 stutters per 5 s scroll on iPads ([[ISE Performance Log]]). Scripts: [[Test Harness]].

## 1. Can it open at all? (memory)
- [ ] Count live WebGL/3D views per page. **Phones: one at a time.** Replace the rest with stills/posters on lite devices.
- [ ] Lazy-load maps/video (tap to load on phones).
- [ ] Ship a build label + boot-error overlay so a client's screenshot tells you what failed.

## 2. Measure on a production build
```bash
rm -rf .next out && (mv src/app/api /tmp/api-aside; STATIC_EXPORT=1 npm run build; mv /tmp/api-aside src/app/api)
cd out && python3 -m http.server 4100 &
node jank.mjs http://localhost:4100/ "Pixel 5"
node jank.mjs http://localhost:4100/ "iPad Pro 11"
node jank.mjs http://localhost:4100/ "iPad Pro 11 landscape"
node jank.mjs http://localhost:4100/ "Galaxy Tab S4"
```
Dev-server numbers are noise (React dev mode) — always measure the production build. Run each 2–3 times.

**Good:** 0–2 long frames (> 50 ms) per 5–6 s scroll at 4× CPU throttle, avg ≤ 20 ms.

## 3. Find the cause
- [ ] **Layers:** `node layercount.mjs <url> "<device>"` — more than ~150 composited layers is a smell. Look for 3D faces, `backdrop-filter`, `will-change`, hidden elements with blur.
- [ ] **Main thread:** `node trace.mjs <url> "<device>"` — `Layerize`/`Paint` heavy → layers/repaints; a JS chunk heavy → profile it.
- [ ] **JS attribution:** `prof2.mjs` style sampling (who calls the heavy library on scroll?).

## 4. Usual fixes (in order of payoff seen)
1. Work on every scroll frame that changes nothing (e.g. re-sending the same map camera) → skip when unchanged.
2. Creating/destroying heavy objects mid-scroll → do it in scroll pauses (debounce), with hysteresis.
3. `backdrop-filter` on repeated or moving things → solid tints on lite; remove from invisible elements.
4. 3D layer explosions → flatten off screen; fewer copies on phones; swap finished 3D effects for static content.
5. Repainting animations (`background-position`) → transform-based.
6. Infinite animations off screen → pause with IntersectionObserver.
7. Scroll handlers measuring everything → throttle, cull by section.

## 5. Verify nothing broke
- [ ] Overflow check on phone widths (`over.mjs`) — no sideways scroll.
- [ ] Old-device boot (`oldandroid.mjs`), desktop boot (`bootdesk.mjs`).
- [ ] Visual check of every changed section (screenshots), and the scroll-driven parts still move (`globe.mjs`).
- [ ] Real iPad Safari when possible (emulation is Chromium).
