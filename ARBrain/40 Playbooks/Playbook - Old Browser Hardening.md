---
type: playbook
tags:
  - playbook
  - compat
proven_on: "[[India Sports Expo 2027]]"
---

# Playbook — Old Browser Hardening

Make a modern Next.js app run on Android Chrome 67+, Samsung Internet 9.2+, iOS 14+. Details and code: [[Old Browser Support]], [[Lite Mode for Phones and Tablets]].

- [ ] `browserslist`: `["chrome 67","samsung 9.2","firefox 68","edge 79","safari 14","ios_saf 14"]`.
- [ ] Production build with **webpack** (`next build --webpack`) — Turbopack ignores browserslist.
- [ ] `transpilePackages` for dependencies shipped as modern-only (MapLibre) — production phase only.
- [ ] Inline **ES5** boot script with polyfills: `globalThis`, `Object.hasOwn`, `Object.fromEntries`, `Array.prototype.at/flat/flatMap`, `String.prototype.replaceAll/matchAll`, `Promise.allSettled`, `queueMicrotask`, `structuredClone`, `Element.replaceChildren`.
- [ ] Feature-detect class static blocks → `html.legacy` → skip libraries that need them (maps on iOS < 16.4 / Chrome < 94).
- [ ] `legacy-css.js` for inline `inset`, `aspect-ratio`, flex `gap`; in stylesheets write top/right/bottom/left before `inset`, and use `padding-top` ratios instead of `aspect-ratio` for critical boxes.
- [ ] Boot-error overlay after 9 s: errors + user agent + build label.
- [ ] Checks: acorn-parse every chunk at ES2019 (`escheck.cjs 2019 out/_next/static/chunks/*.js`), the boot script at ES5; Playwright run with modern APIs deleted (`oldandroid.mjs`).
- [ ] Watch: escape `\n` twice in TS template strings that become inline scripts.
