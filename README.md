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
| `/admin` | Organiser admin and command console |
| `/mobile` | Companion app prototype |
| `/design-system` | Design system and prototype map |

The design's tweakable props can be set from the URL: `/?liveMode=true` shows the Day 2 live state, and `/?journey=reduced` turns off the scroll-driven globe.

## Beyond the design

- **Home journey finale** (`src/components/home/`): when the globe reaches Yashobhoomi, the venue scene takes over (the official virtual tour, embedded live). It keeps moving behind four clickable zone cards (A–D), pinned until the journey ends. The journey is its own component (`HomeJourney.jsx`), so scrolling re-renders only the journey. To show a still of the tour's opening scene instead, rotating continuously, add a 360° image and set `VENUE_PANORAMA` in `src/lib/venue.js`.
- **Motion** (`src/lib/motion.js`, `src/app/motion.css`): a brand curtain while pages load and change, scroll reveals with staggered items, heading wipes, number count-ups, a scroll progress bar and hover lifts. All of it is off for visitors who prefer reduced motion.
- **Back button** on every page (`src/components/BackButton.tsx`): goes back within the site, or to Home after a direct visit.
- **Faster 3D:**
  - The hero shows a still (`public/assets/hero-poster.jpg`) at once; the live scene fades in over it and pauses while scrolled out of view.
  - Bucky's scene is copied into the site at build time when the build machine can reach Spline (`public/assets/bucky.splinecode`), and a snapshot remembered from the first visit shows him instantly on later pages.
  - The Spline runtime, its Draco mesh decoder (`vendor/draco`) and the scenes are served by the site, preloaded and cached.
  - The hero scene takes no pointer input, so wheel and touch scrolling go straight to the page.

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
- **Photos and videos:** each `<image-slot>` has an id. Map ids to image URLs in `public/image-slots.state.json`, for example `{ "home-yasho-foyer": "/images/foyer.jpg" }`.
- **QR codes** are decorative and encode nothing. Generate real ones server-side.
- **The Bucky robot scene** loads from `prod.spline.design`. Re-export it from Spline into `public/assets/` to self-host it, as the hero scene already is.

## Known gaps carried over from the design

- Portal, Admin and My Expo are desktop layouts. Several public pages also scroll sideways on narrow phones.
- The Earth journey sharpens slowly while zooming.
