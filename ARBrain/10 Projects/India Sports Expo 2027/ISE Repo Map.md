---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - architecture
---

# ISE Repo Map

Every tracked file of the repository at commit `6aaefbc`, with what it does (taken from each file's header comment where there is one). Media and vendored runtimes are summarised.

### `./`
- `.gitignore` — Ignores node_modules, .next, out, vendored runtimes copied at install, env files.
- `AGENTS.md` — Agent note: this Next.js version differs from training data; read node_modules/next/dist/docs first.
- `CLAUDE.md` — Points Claude Code at AGENTS.md.
- `README.md` — Project README: run, deploy, pages, everything added beyond the design.
- `netlify.toml` — Netlify build for the full app (with the /api/bucky function).
- `next.config.ts` — Phase-based Next config: static export switch, base path, build label, MapLibre transpile in production.
- `package-lock.json` — Exact dependency versions (npm).
- `package.json` — Dependencies, scripts (`build` = `next build --webpack`) and browserslist targets.
- `tsconfig.json` — TypeScript config (`@/` → `src/`).

### `.github/workflows/`
- `media-candidates.yml` — Collects openly licensed photo/video candidates (push to media-request → media-candidates branch).
- `pages.yml` — Builds the static site and publishes it to the gh-pages branch on every push to main.

### `design/`
- `HANDOFF.md` — The Claude Design handoff spec: pages, global elements, tokens, interactions, assets.
- `pasted-reference.png` — Visual reference supplied by the client.

### `design/site/`
- `Admin Console.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Attend and My Expo.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Connect.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Design System.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Exhibit.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Exhibitor Portal.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Hall 2 Digital Twin.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Hall Plan.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Home.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Mobile App.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Programme and Watch.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `Zone Experiences.dc.html` — Original Claude Design prototype file (reference, not shipped).
- `hero-fit.js` — Original Claude Design prototype file (reference, not shipped).
- `hero-scene.html` — Original Claude Design prototype file (reference, not shipped).
- `image-slot.js` — Original Claude Design prototype file (reference, not shipped).
- `ise-data.js` — Original Claude Design prototype file (reference, not shipped).
- `r4x-guide.js` — Original Claude Design prototype file (reference, not shipped).
- `r4x-scene.html` — Original Claude Design prototype file (reference, not shipped).
- `support.js` — Original Claude Design prototype file (reference, not shipped).

### `public/`
- `.nojekyll` — Stops GitHub Pages from hiding `_next/`.
- `bucky-scene.html` — Bucky's Spline scene page (iframe): crops to the robot, keeps it upright, blinks, suppresses Spline physics errors.
- `image-slot.js` — The <image-slot> web component (from the design runtime): media placeholders filled from public/media/media.json. Edit controls removed for visitors.
- `image-slots.state.json` — Image slot state used by the design runtime (empty; media.json is the source).

### `public/assets/`
- `bucky-poster.png` — Bucky poster: shown at once on first visit and on phones/tablets.
- `bucky.splinecode` — Bucky 3D scene (Spline export, self-hosted).
- `hero-stadium-sm.webp` — Hero stadium photo, phone size.
- `hero-stadium.webp` — Hero stadium photo, desktop size.

### `public/brand/`
- `logo.png` — Original logo artwork (1580 × 639) supplied by the client.
- `ring.png` — Logo ring (columns 0–643 of the original), the part that spins.
- `wordmark-on-dark.png` — Logo lettering recoloured white for the dark header bars.
- `wordmark.png` — Logo lettering (columns 644–1579), for light backgrounds.

### `scripts/`
- `dc-to-jsx.mjs` — Converts the Claude Design components (design/site/*.dc.html) into React screens (src/screens/*.jsx) and pages.json.
- `vendor-assets.mjs` — Copies browser runtime files from node_modules into public/vendor so the site serves them itself instead of a CDN. Runs on `npm install` and before `npm run build`.

### `scripts/media/`
- `build-media.mjs` — Builds public/media from picked candidates plus generated SVG artwork; writes media.json, videos.json, credits.json.
- `fetch-candidates.mjs` — Searches Wikimedia Commons for openly licensed photo/video candidates per slot (runs in the media-candidates workflow).
- `plan.json` — Which slots need which kind of media (search terms per slot).

### `src/app/`
- `anim.css` — Feature animations (src/components/anim, src/components/home). All switch off for visitors
- `dc-pseudo.css` — Hover/pseudo styles generated from the design components.
- `globals.css` — Base styles, fonts, resets.
- `layout.tsx` — Root layout: fonts, the ES5 boot script (polyfills, lite/legacy/page classes, boot-error overlay, preloads), the brand curtain, global CSS and ClientInit.
- `mobile.css` — Phone/tablet styles: header → ☰ menu, Bucky size, journey titles, reflow fixes, tap highlight.
- `motion.css` — Site-wide motion styles: page curtain, logo ring spin, scroll reveals, progress bar, hover/press, back button, click pulse, reduced motion.
- `page.tsx` — Route entry: renders its screen through `Page`.
- `sporty.css` — Sporty finish across the site, in the logo's colours (public/brand):

### `src/app/admin/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/api/bucky/`
- `route.ts` — Bucky answers for questions the built-in topics don't cover. The browser calls this through window.claude.complete (see src/components/ClientInit.tsx).

### `src/app/attend/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/connect/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/design-system/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/exhibit/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/explore/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/mobile/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/portal/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/programme/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/app/zones/`
- `page.tsx` — Route entry: renders its screen through `Page`.

### `src/components/`
- `BackButton.tsx` — Back button at the top left of every page except Home, inside the header bar. Goes back when the visitor came from another page of this site, otherwise to Home.
- `BrandLogo.jsx` — The India Sports Expo 2027 logo, built from its two parts so the ring can turn: the ring (public/brand/ring.png, columns 0–643 of the original 1580 × 639 artwork) spins clockwise
- `ClientInit.tsx` — Mounts the Bucky guide once for the whole site and provides window.claude.complete, which the design's guide code uses for answers outside its built-in topics.
- `DemoVideo.jsx` — Demo clips for sessions (public/media/videos.json: session id → clip). Two forms: <DemoVideo id="x1" />        a player: poster first, plays on click; `live` autoplays muted
- `GettingThereMap.jsx` — Map pane for "Getting to Yashobhoomi" on the Explore page. Google Maps (keyless embed) shows the route for the selected travel tab; the design's
- `MobileMenu.tsx` — Phone and tablet menu. Below 900px the page header keeps only the logo (src/app/mobile.css); this ☰ button opens a full-screen menu built from that page's own header links and buttons,
- `Page.tsx` — Server wrapper for a routed screen: applies the page's own styles (from the design's <helmet>) and mounts the client-rendered screen inside #dc-root.
- `PreloadScenes.tsx` — Starts the poster downloads with the page. The 3D runtime and scenes are preloaded by the inline script in src/app/layout.tsx, and only on devices that show them (not phones or tablets).
- `Screen.tsx` — Renders one routed screen in the browser. Props start from the design's defaults and can be overridden from the URL, e.g. /?liveMode=true or /?journey=reduced.

### `src/components/anim/`
- `FoldWord.jsx` — A word that unfolds letter by letter, like paper folded in half: each letter's lower half swings down from behind its upper half. `when="load"` plays after the page appears,
- `LockKeyLink.jsx` — "Book a stall" link with a padlock and key. On click the key slides into the lock and turns, the shackle springs open, and then the page changes (src/app/anim.css).
- `Marquee.jsx` — A strip that scrolls continuously, left to right (`dir="right"`) or right to left. Items are repeated so the loop is seamless; the copies are hidden from screen readers and keyboard.
- `SportsTicker.jsx` — A stadium LED board: the Expo's headline facts scrolling past between sport icons (src/app/sporty.css).
- `useDeal.js` — Card-deal timing shared by the Home card strips (WatchShuffle, ProductShuffle): the cards wait stacked like a deck ('stack'), are dealt out into a row when the strip scrolls into view

### `src/components/home/`
- `BoothStrip.jsx` — Home "Build your presence": the seven stall products as 3D booth blocks (bigger product, taller block) travelling left to right. Hover pauses the strip and turns the booth with the
- `HallBook.jsx` — Home "One hall. Four event zones." as a book. The closed book sits in the section; opening it brings it up large, one zone per spread (left page: the zone and its plan; right page: its
- `HomeJourney.jsx` — The Home "Earth journey": a scroll-driven globe zoom from Earth to Yashobhoomi, then the venue finale. Split out of Home.jsx so scrolling re-renders only this section.
- `IntentBoxes.jsx` — Home "Intentions": Explore, Exhibit, Attend, Connect and Watch as 3D boxes travelling left to right in a continuous strip (src/app/anim.css).
- `ProductShuffle.jsx` — Home "Featured products": the product cards wait stacked like a deck; when the section scrolls into view they are dealt out into a row, which then keeps moving left to right
- `VenueScene.jsx` — The Yashobhoomi venue backdrop for the Home journey: a local 360° panorama rotated continuously, or else the official virtual tour embedded live (see src/lib/venue.js); on
- `VenueStage.jsx` — End of the Home globe journey. After the map reaches Yashobhoomi, the venue scene takes over the screen and four zone cards (A–D) are dealt like playing cards, sport photo up;
- `WatchShuffle.jsx` — Home "Live & on demand": the session cards wait stacked like a deck; when the section scrolls into view they are dealt out into a row, which then keeps moving right to left
- `venue-stage.css` — Journey finale: venue scene, dealt and flipping zone cards, phone 2×2 layout, lite tint instead of blur.

### `src/data/`
- `ise.js` — India Sports Expo 2027 demo data, shared by every screen as window.ISE. Copied from design/site/ise-data.js. Replace with backend data in production.

### `src/dc/`
- `runtime.js` — Runtime for the screens generated from the Claude Design components. It keeps the design's component model: each screen has a logic class (state, lifecycle, renderVals()) and a render(v) template, where `v` is the

### `src/lib/`
- `base.js` — Path prefix the site is served under: '' on Netlify or a custom domain, '/Sports-Expo-2027' on GitHub Pages. Set NEXT_PUBLIC_BASE_PATH at build time.
- `bucky-guide.js` — Bucky (named R-4X in the design), the Expo guide robot. Ported from design/site/r4x-guide.js; mounted once by the root layout.
- `bucky-sounds.js` — Bucky's two little sounds, synthesised with Web Audio (no audio files to load). hover  a soft rising "boop-bip" click  a cheerful chirp with a sparkle on top
- `device.js` — "Lite" devices: phones and tablets (small screens or touch as the main input). They get still or CSS-animated versions of the live 3D views (hero hand and globe, Bucky,
- `legacy-css.js` — Layout fill-ins for older browsers (Chrome before 87/88, e.g. old Android phones). The screens are styled inline with three newer CSS features those browsers ignore:
- `maplibre.js` — The design's map code uses the global `maplibregl` (it was loaded from a CDN script tag). Screens that show a map import this module to provide it.
- `mobile-fit.js` — Fits the design's desktop layouts to phone and tablet screens. The screens are styled inline with fixed multi-column grids, one-line flex rows and very large
- `motion.js` — Site-wide motion: page curtain and transitions, scroll reveals, heading wipes, number count-ups and the scroll progress bar. Styles live in src/app/motion.css.
- `page-anim.js` — Signature details for the inner pages, on top of the scroll reveals in src/lib/motion.js (whose style changes per page through the html "pg-…" class, src/app/anim.css):
- `venue.js` — Where the Home journey's venue scene comes from. By default the official Yashobhoomi virtual tour is embedded live. To use a still of the tour's opening scene instead, save it as an equirectangular 360° image

### `src/screens/`
- `AdminConsole.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `AttendAndMyExpo.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `Connect.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `DesignSystem.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `Exhibit.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `ExhibitorPortal.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `Hall2DigitalTwin.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `HallPlan.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `Home.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `MobileApp.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `ProgrammeAndWatch.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `ZoneExperiences.jsx` — Generated screen (from design/site via dc-to-jsx), hand-edited since.
- `index.js` — Maps routes to generated screen components.
- `pages.json` — Per-route title, page CSS and default props, taken from each design file.

### Summarised
- `public/media/` — 58 files: demo photos, SVG artwork, video clips and posters, `media.json`, `videos.json`, `credits.json`. See [[ISE Media and Credits]].
- `vendor/` and `public/vendor/` — 3 tracked files: Draco mesh decoder and runtimes served by the site (Spline, MapLibre are copied at install).

## Related
[[ISE Architecture]] · [[India Sports Expo 2027]]
