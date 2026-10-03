---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - architecture
---

# ISE Architecture

## Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.3.8** App Router, **React 19.3**, TypeScript for the shell, JSX for screens | Handoff recommended Next.js; static export for Pages, full app for Netlify |
| Dev bundler | Turbopack (`npm run dev`) | Fast |
| Prod bundler | **webpack** (`next build --webpack`) | Compiles down to `browserslist` (Turbopack keeps modern syntax) — [[Old Browser Support]] |
| Maps | **MapLibre GL 6.11.2** (globe projection, Esri World Imagery raster tiles); Google Maps keyless embeds | Earth journey; getting there |
| 3D | **Spline runtime 2.0.65** (self-hosted in `public/vendor`) + Draco decoder | Bucky robot (hero 3D was replaced by a photo in round 9) |
| AI | **Anthropic SDK** in `/api/bucky` (server) | Bucky answers beyond built-in topics; needs `ANTHROPIC_API_KEY` |
| Styling | Inline styles from the design + global CSS layers (`motion.css`, `anim.css`, `sporty.css`, `mobile.css`, `venue-stage.css`, `dc-pseudo.css`) | Keep the generated screens faithful; add behaviour in layers |
| Hosting | GitHub Pages (static) + Netlify | See [[ISE Build and Deploy]] |

> **Note (AGENTS.md):** this Next.js version has breaking changes vs. older training data — read `node_modules/next/dist/docs/` before writing Next code.

## How a page renders
```
src/app/<route>/page.tsx        server route: metadata + <Page route=…>
  └ src/components/Page.tsx     applies the page's own CSS (pages.json) and mounts #dc-root
      └ Screen.tsx (client)     props = design defaults + URL overrides (?liveMode=true, ?journey=reduced); waits for #anchor
          └ src/screens/<Name>.jsx   generated from design/site/<Name>.dc.html (logic class kept as-is)
               uses src/dc/runtime.js (defineDC, DCLogic, txt, sx, list) and window.ISE (src/data/ise.js)
```
Screens render **client-only**: the design logic reads `window` (maps, scroll, data).

## Root layout (`src/app/layout.tsx`) — order matters
1. **Inline ES5 boot script** (first thing in `<head>`): `window.__build`, polyfills, `legacy` class (no class static blocks → skip maps), `lite` class (phones/tablets; `?lite=` override), `pg-<route>` class, device-aware preloads, boot-error overlay after 9 s if `window.__booted` is not set.
2. Google Fonts: Archivo (variable width 62–125, italic), Instrument Sans, JetBrains Mono.
3. `#page-curtain` with the logo (server-rendered, covers first paint).
4. `{children}` → the page.
5. `BackButton`, `MobileMenu`, `ClientInit` (mounts Bucky, provides `window.claude.complete` → `/api/bucky`, starts motion, page-anim, mobile-fit, legacy-css).
6. `image-slot.js` (afterInteractive).

## Client systems (all started once)
| System | File | Pattern |
|---|---|---|
| Motion: curtain, reveals, count-ups, progress, tap pulse, hero parallax | `src/lib/motion.js` | [[Scroll Reveals and Count-ups]], [[Brand Curtain and Page Transitions]] |
| Per-page signature animation | `src/lib/page-anim.js` | [[Per-Page Signature Animations]] |
| Phone/tablet reflow | `src/lib/mobile-fit.js` | [[Lite Mode for Phones and Tablets]] |
| Old CSS fill-ins | `src/lib/legacy-css.js` | [[Old Browser Support]] |
| Bucky | `src/lib/bucky-guide.js`, `bucky-sounds.js` | [[Robot Guide Widget]] |
| Device check | `src/lib/device.js` → `isLite()` | |
| Base path | `src/lib/base.js` → `withBase()` | `''` on Netlify, `/Sports-Expo-2027` on Pages |

## Home specifics
- Home is a class component (generated) with a **journey store** (external store, `useSyncExternalStore`) so only `HomeJourney` re-renders on scroll.
- Feature components in `src/components/home/` (VenueStage, VenueScene, HallBook, IntentBoxes, BoothStrip, WatchShuffle, ProductShuffle) and `src/components/anim/` (FoldWord, LockKeyLink, Marquee, SportsTicker, useDeal).

## Data
`window.ISE` from `src/data/ise.js` — see [[ISE Data Model]]. Media mapping in `public/media/*.json` — see [[ISE Media and Credits]].

## Build-time scripts
- `scripts/vendor-assets.mjs` (postinstall + prebuild): copies Spline, MapLibre, Draco into `public/vendor`, Bucky's scene into `public/assets`.
- `scripts/dc-to-jsx.mjs`: regenerates screens from `design/site`.
- `scripts/media/*`: demo media pipeline.

## Related
[[ISE Repo Map]] · [[ISE Routes and Pages]] · [[ISE Build and Deploy]] · [[India Sports Expo 2027]]
