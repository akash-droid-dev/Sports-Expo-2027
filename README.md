# India Sports Expo 2027

> **Project memory:** this branch carries [`ARBrain/`](ARBrain/README.md), an Obsidian vault with the full history, design system, patterns (with source), playbooks, templates and every asset of this project.

The digital platform for India Sports Expo 2027, Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. It is built with Next.js 16 and React 19 from the Claude Design handoff in [`design/`](design/HANDOFF.md).

## Run it

```bash
npm install      # also copies the Spline and MapLibre runtimes into public/vendor
npm run dev      # http://localhost:3000
npm run build && npm start
```

Node 20 or newer is required.

### Optional: AI answers for Bucky

Bucky, the robot guide (R-4X in the design files), answers common questions (exhibitors, stalls, live sessions, registration, travel, buyers, programme) from the demo data. To answer anything else with Claude, set `ANTHROPIC_API_KEY` on the server. Without it, `/api/bucky` returns 503 and Bucky replies with its built-in help message.

## Deploy

**GitHub Pages:** every push to `main` runs `.github/workflows/pages.yml`, which builds a static copy of the site and publishes it to the `gh-pages` branch. It is served at https://akash-droid-dev.github.io/Sports-Expo-2027/ once Pages is on (Settings → Pages → Source: Deploy from a branch → `gh-pages`, `/ (root)`). Pages only hosts static files, so Bucky there answers from its built-in topics only.

**Netlify:** project `sports-expo-2027-yashobhoomi` (https://sports-expo-2027-yashobhoomi.netlify.app). `netlify.toml` builds the full app, including the `/api/bucky` function. Link the GitHub repository in the Netlify project (branch `main`) to deploy on every push.

**Netlify, manual upload:** build the static copy without a base path and upload the folder:

```bash
mv src/app/api /tmp/api-aside && STATIC_EXPORT=1 npm run build; mv /tmp/api-aside src/app/api
npx netlify-cli deploy --dir out --prod --site sports-expo-2027-yashobhoomi
```

Or drag the `out` folder onto the project's Deploys page. The static copy has no `/api/bucky`, so Bucky answers from his built-in topics, as on GitHub Pages.

**Saved copy:** the branch `archive/v1-design-faithful` holds the first build, a pixel-faithful copy of the design before the changes below.

To build the static copy locally: `STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Sports-Expo-2027 npm run build` (move `src/app/api` aside first; static export can't include it). The output is in `out/`.

## Pages

| Route | Page |
|---|---|
| `/` | Home: hero, Earth journey, Hall 2, zones, programme, plan your visit |
| `/explore` | Hall 2 digital twin, getting there, visitor info |
| `/zones` | Zone experiences A–D |
| `/exhibit` | Why exhibit, booth products, stall inventory, directory, registration |
| `/attend` | Why attend, visitor registration, digital pass, My Expo, plan my day |
| `/connect` | Business exchange, matchmaking, meetings, country pavilions, lounges |
| `/programme` | Live mode, programme, Innovation Arena, watch library, search |
| `/portal` | Exhibitor control centre |
| `/admin` | Organiser admin and command console (super admin) |
| `/mobile` | Companion app prototype |
| `/design-system` | Design system and prototype map |

The design's tweakable props can be set from the URL: `/?liveMode=true` shows the Day 2 live state, and `/?journey=reduced` turns off the scroll-driven globe.

## Beyond the design

- **Brand:** the India Sports Expo 2027 logo in every header, side rail, the loading screen and the Home book cover (`src/components/BrandLogo.jsx`). It is the original artwork (`public/brand/logo.png`) cut into two pieces at full resolution: the ring (`ring.png`), which turns clockwise without stopping (one turn every 16 s, still for visitors who prefer reduced motion), and the lettering (`wordmark.png`; `wordmark-on-dark.png` has white lettering for the dark bars).
- **Home hero:** a stadium photo (`public/assets/hero-stadium*.webp`) behind the headline; SPORTS and 2027 fold open letter by letter when the page opens (`src/components/anim/FoldWord.jsx`), as do GLOBAL and INDIA in "The global sports economy meets India".
- **Sporty finish** (`src/app/sporty.css`, `src/components/anim/SportsTicker.jsx`), in the logo's colours: display type slants forward like the wordmark, primary buttons are angled, a running-track stripe moves along the bottom of every header, dark sections carry speed lines and feature sections pitch markings, Home has a stadium LED ticker with sport icons, and footers open with "Be a sport. Shape the future."
- **Home animations** (`src/components/home/`, `src/components/anim/`, `src/app/anim.css`):
  - Zone cards at the end of the Earth journey are dealt like playing cards, sport photo up, then turn over to a see-through zone side as you scroll.
  - "Book a stall" is a padlock and key: the key turns, the lock opens, then the Exhibit page opens.
  - Explore, Exhibit, Attend, Connect and Watch are 3D boxes travelling left to right; the stall products are 3D booths travelling left to right (hover pauses and turns them); live and on-demand sessions are dealt from a deck, then roll right to left; the featured products (all eight) are dealt the same way, then roll left to right (shared timing in `src/components/anim/useDeal.js`).
  - "One hall. Four event zones." is a zone guide book: it opens large, one spread per zone (plan, areas, stalls, exhibitors), turns its pages, and closes itself after Zone D.
- **Inner pages** each animate in their own way as you scroll (`src/lib/page-anim.js` and the `pg-…` rules in `src/app/anim.css`): Explore unfolds, Zones deals cards and spins its giant zone letters, Exhibit builds up from the floor, Attend flips like a departures board, Connect slides in, Programme runs like a ticker, and the Portal and Admin dashboards pop their tiles. Bars grow into place and big figures count up.
- **Home journey finale** (`src/components/home/`): when the globe reaches Yashobhoomi, the venue scene takes over (the official virtual tour, embedded live). It keeps moving behind four clickable zone cards (A–D), pinned until the journey ends. The journey is its own component (`HomeJourney.jsx`), so scrolling re-renders only the journey. To show a still of the tour's opening scene instead, rotating continuously, add a 360° image and set `VENUE_PANORAMA` in `src/lib/venue.js`.
- **Motion** (`src/lib/motion.js`, `src/app/motion.css`): a brand curtain while pages load and change, scroll reveals with staggered items, heading wipes, number count-ups, a scroll progress bar and hover lifts. All of it is off for visitors who prefer reduced motion.
- **Hover and click feedback** (`src/app/motion.css`, `src/lib/motion.js`): buttons and cards lift, saffron buttons get a light sweep, nav and footer links draw an underline, every click sends a small pulse, and the Home banner drifts gently with the mouse.
- **Bucky's sounds and moves** (`src/lib/bucky-sounds.js`): hovering Bucky makes him wiggle or now and then hop, with a soft "boop-bip"; clicking him plays a chirp. Sounds are synthesised in the browser (no audio files) and start after the visitor's first click or tap, as browsers require. SOUND ON/OFF in his panel mutes them.
- **Google Maps:** Home's "Getting to Yashobhoomi" shows the venue on Google Maps. Explore → Getting there shows the Google Maps route for the selected tab (metro, airport, car, shuttle, parking), with the design's route schematic one click away. Both use Google's keyless embed and load only when scrolled near.
- **Demo media** (`public/media`): every photo slot, logo, portrait and video player is filled. See "Demo media" below.
- **Phones and tablets** (`src/lib/device.js`, `src/lib/mobile-fit.js`, `src/app/mobile.css`, `src/components/MobileMenu.tsx`):
  - They get still versions of the 3D views: Bucky bobs, and the venue finale shows a drifting venue photo instead of the live tour. The 3D runtime and Bucky's scene are not even downloaded; the hero photo is a smaller file.
  - The Earth globe stays live, at a lower resolution, and only exists while you are near the journey; it is freed once you scroll well past.
  - Google maps load on a tap, watch cards show still images, and the live player waits for a tap.
  - All of this keeps the page within mobile memory limits. Phones close a page that uses too much, and after repeated crashes Safari refuses to load it.
  - The phone menu shows the build date at the bottom, to check which version is live.
- **Older phones and browsers:** the site runs on Android Chrome 67+ (2018), Samsung Internet 9.2+, iOS/Safari 14+ and Firefox 68+.
  - Builds use webpack (`next build --webpack`) because it compiles the code, MapLibre included, down to the `browserslist` targets in `package.json`. Turbopack, the Next.js 16 default, keeps newer syntax that those browsers can't run. `npm run dev` still uses Turbopack.
  - The inline script in `src/app/layout.tsx` fills in newer JavaScript features they lack. `src/lib/legacy-css.js` restores the inline `inset`, `aspect-ratio` and flex `gap` they ignore, and the stylesheets give top/right/bottom/left before each `inset`.
  - Browsers before Chrome 94 / iOS 16.4 skip the maps.
  - If the site still fails to start on a device, it shows the error, browser and build on screen after 9 seconds, ready to screenshot.
  - The header keeps the logo; its links and buttons move into a ☰ menu.
  - Layouts that are too wide for the screen are reflowed: wide grids get fewer columns, rows wrap, oversized headlines shrink. No page scrolls sideways.
  - Add `?lite=1` or `?lite=0` to a URL to force either version for testing.
  - The Home zone cards fit the screen in a two-by-two grid (four across in landscape), showing each zone's name, key facts and link; the longer text is on the Zones page. Bucky steps aside while they are up.
  - Smooth scrolling on tablets and iPads: the Earth globe only redraws while its position changes (it used to redraw on every scroll frame above and below the journey), is built and freed during a pause in scrolling rather than mid-scroll, and photo slots no longer carry hidden, blurred edit buttons (`public/image-slot.js`). On simulated iPads with a slowed processor, stutters while scrolling dropped from 10–17 to 0–1 in a 5-second scroll.
  - Smooth scrolling on phones: moving strips pause when off screen, the 3D booths lie flat when off screen (and phones get one set instead of two), folded headline letters turn back into plain text once unfolded, the header stripe moves on the GPU without repainting, and the zone cards and Home book use a tint instead of a live blur. On a mid-range phone this cut the page's GPU layers from about 400 to about 120 and the stutters while scrolling by about two thirds.
- **Back button** at the top left of every page except Home, inside the header bar (`src/components/BackButton.tsx`): goes back within the site, or to Home after a direct visit.
- **Faster 3D:**
  - Bucky's scene is served by the site (`public/assets/bucky.splinecode`; delete it and run `npm install` to pull a new version from Spline). A bundled poster shows him at once on a first visit, and a snapshot from that visit is reused on later pages.
  - The Spline runtime, its Draco mesh decoder (`vendor/draco`) and the scenes are served by the site, preloaded and cached.
  - The Earth journey's camera eases toward the scroll position each frame instead of jumping with every scroll event, keeps loading imagery while zooming and caps its render resolution on high-density screens.

## Admin

The organiser console is at `/admin` (on GitHub Pages: https://akash-droid-dev.github.io/Sports-Expo-2027/admin/). It opens signed in as "Super Admin" and covers the command centre, CMS, registrations, exhibitors, programme and alerts. It is also linked from the footer's prototype map. Like the rest of the prototype it has no real sign-in yet: add authentication before launch.

## Demo media

`public/media` holds openly licensed photos and clips plus artwork drawn for the site, so no slot is empty:

- **Photos:** Yashobhoomi's exterior, plaza and metro gate (Explore), product and material photos (Home, Exhibit, Zones, Portal). Credits show on each photo.
- **Video:** short muted clips (keynote stage, cricket, hockey, stadium, crowd) in the live player, session players and watch-card thumbnails, which preview on hover. Nothing downloads until a clip plays.
- **Artwork:** exhibitor logos, speaker and pass portraits (initials, no real faces), the spike plate and force plate drawings, and the athlete figure.

`public/media/media.json` maps each `<image-slot>` id to its file and credit, `public/media/videos.json` maps each session to a clip, and `public/media/credits.json` lists the source and licence of every photo and clip. Replace them with official media before launch.

To rebuild the set: push to the `media-request` branch (runs `.github/workflows/media-candidates.yml`, which collects candidates on the `media-candidates` branch), unpack that branch, adjust the picks in `scripts/media/build-media.mjs` and run `node scripts/media/build-media.mjs <candidates folder>`.

## How it is built

The handoff's pages are "Design Components": an HTML template plus a logic class, rendered at runtime by `design/site/support.js`. `scripts/dc-to-jsx.mjs` turns each one into a React component in `src/screens/`, applying the same rules as that runtime (template holes, loops, conditions, inline styles, hover styles, embedded components). The logic classes are kept as they were, so every tab, filter, wizard, drawer and phase switch behaves as in the design. Links point to the routes above.

- `src/screens/*.jsx`: generated screens. `HallPlan.jsx` is the shared Hall 2 floor plan.
- `src/screens/pages.json`: page titles and page-level CSS taken from each design file.
- `src/dc/runtime.js`: the small component wrapper the screens use (`defineDC`, `DCLogic`).
- `src/data/ise.js`: demo data, available as `window.ISE`.
- `src/lib/bucky-guide.js`: the Bucky robot and its Ask panel, mounted once in the root layout.
- `public/bucky-scene.html`: the robot's Spline scene.
- `public/image-slot.js`: the `<image-slot>` media placeholders.

Screens render in the browser only (`ssr: false`), because the design logic reads `window` (maps, scroll, the demo data).

To pull in a newer export from Claude Design, replace the files in `design/site/` and run:

```bash
node scripts/dc-to-jsx.mjs
```

This overwrites `src/screens/`. The screens have been edited by hand since (logo, Home sections, maps, media, video), so re-apply those edits after regenerating.

## Content to replace before launch

- **Demo data:** names, figures, dates and stall IDs in `src/data/ise.js` and in the screens are samples (marked SAMPLE, DEMO or PROVISIONAL in the UI).
- **Photos and videos:** the demo media above. Each `<image-slot>` has an id; point it at an official image in `public/media/media.json`, for example `{ "twin-yasho-hall": { "src": "hall-2.webp" } }`, and swap clips in `public/media/videos.json`.
- **QR codes** are decorative and encode nothing. Generate real ones server-side.

## Known gaps carried over from the design

- Portal, Admin and My Expo are desktop layouts; on phones they are reflowed to fit but are best used on a larger screen.
- The Earth journey's satellite imagery still sharpens a moment after a fast zoom.
