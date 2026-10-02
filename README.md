# India Sports Expo 2027

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

- **Home journey finale** (`src/components/home/`): when the globe reaches Yashobhoomi, the venue scene takes over (the official virtual tour, embedded live). It keeps moving behind four clickable zone cards (A–D), pinned until the journey ends. The journey is its own component (`HomeJourney.jsx`), so scrolling re-renders only the journey. To show a still of the tour's opening scene instead, rotating continuously, add a 360° image and set `VENUE_PANORAMA` in `src/lib/venue.js`.
- **Motion** (`src/lib/motion.js`, `src/app/motion.css`): a brand curtain while pages load and change, scroll reveals with staggered items, heading wipes, number count-ups, a scroll progress bar and hover lifts. All of it is off for visitors who prefer reduced motion.
- **Hover and click feedback** (`src/app/motion.css`, `src/lib/motion.js`): buttons and cards lift, saffron buttons get a light sweep, nav and footer links draw an underline, every click sends a small pulse, and the Home banner drifts gently with the mouse.
- **Bucky's sounds and moves** (`src/lib/bucky-sounds.js`): hovering Bucky makes him wiggle or now and then hop, with a soft "boop-bip"; clicking him plays a chirp. Sounds are synthesised in the browser (no audio files) and start after the visitor's first click or tap, as browsers require. SOUND ON/OFF in his panel mutes them.
- **Google Maps:** Home's "Getting to Yashobhoomi" shows the venue on Google Maps. Explore → Getting there shows the Google Maps route for the selected tab (metro, airport, car, shuttle, parking), with the design's route schematic one click away. Both use Google's keyless embed and load only when scrolled near.
- **Demo media** (`public/media`): every photo slot, logo, portrait and video player is filled. See "Demo media" below.
- **Phones and tablets** (`src/lib/device.js`, `src/lib/mobile-fit.js`, `src/app/mobile.css`, `src/components/MobileMenu.tsx`):
  - They get still versions of the 3D views: a small still of the hand and globe floats in the hero, Bucky bobs, and the venue finale shows a drifting venue photo instead of the live tour. The 3D runtime and scenes are not even downloaded.
  - The Earth globe stays live, at a lower resolution, and only exists while you are near the journey; it is freed once you scroll well past.
  - Google maps load on a tap, watch cards show still images, and the live player waits for a tap.
  - All of this keeps the page within mobile memory limits. Phones close a page that uses too much, and after repeated crashes Safari refuses to load it.
  - The phone menu shows the build date at the bottom, to check which version is live.
- **Older iPhones and browsers:** the site is compiled for Safari 14 / iOS 14 and newer (`browserslist` in `package.json`; Next.js alone targets Safari 16.4+), with two small fill-ins for iOS before 15.4. Before iOS 16.4 the maps are skipped. If the site still fails to start on a device, it shows the error, browser and build on screen after 9 seconds (the inline script in `src/app/layout.tsx`), ready to screenshot.
  - The header keeps the logo; its links and buttons move into a ☰ menu.
  - Layouts that are too wide for the screen are reflowed: wide grids get fewer columns, rows wrap, oversized headlines shrink. No page scrolls sideways.
  - Add `?lite=1` or `?lite=0` to a URL to force either version for testing.
- **Back button** at the top left of every page, inside the header bar (`src/components/BackButton.tsx`): goes back within the site, or to Home after a direct visit.
- **Faster 3D:**
  - The hero shows a still (`public/assets/hero-poster.jpg`) at once; the live scene fades in over it and pauses while scrolled out of view.
  - Bucky's scene is served by the site (`public/assets/bucky.splinecode`; delete it and run `npm install` to pull a new version from Spline). A bundled poster shows him at once on a first visit, and a snapshot from that visit is reused on later pages.
  - The Spline runtime, its Draco mesh decoder (`vendor/draco`) and the scenes are served by the site, preloaded and cached.
  - The hero scene takes no pointer input, so wheel and touch scrolling go straight to the page, and the hand, globe and ring can't be dragged out of their pose.
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
- `src/lib/hero-fit.js`, `public/hero-scene.html`: the Home hero 3D scene.
- `public/bucky-scene.html`: the robot's Spline scene.
- `public/image-slot.js`: the `<image-slot>` media placeholders.

Screens render in the browser only (`ssr: false`), because the design logic reads `window` (maps, scroll, the demo data).

To pull in a newer export from Claude Design, replace the files in `design/site/` and run:

```bash
node scripts/dc-to-jsx.mjs
```

This overwrites `src/screens/`. `Home.jsx` has been edited by hand since (journey finale), so re-apply those edits after regenerating.

## Content to replace before launch

- **Demo data:** names, figures, dates and stall IDs in `src/data/ise.js` and in the screens are samples (marked SAMPLE, DEMO or PROVISIONAL in the UI).
- **Photos and videos:** the demo media above. Each `<image-slot>` has an id; point it at an official image in `public/media/media.json`, for example `{ "twin-yasho-hall": { "src": "hall-2.webp" } }`, and swap clips in `public/media/videos.json`.
- **QR codes** are decorative and encode nothing. Generate real ones server-side.

## Known gaps carried over from the design

- Portal, Admin and My Expo are desktop layouts; on phones they are reflowed to fit but are best used on a larger screen.
- The Earth journey's satellite imagery still sharpens a moment after a fast zoom.
