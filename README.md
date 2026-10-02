# India Sports Expo 2027

The digital platform for India Sports Expo 2027, Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. It is built with Next.js 16 and React 19 from the Claude Design handoff in [`design/`](design/HANDOFF.md).

## Run it

```bash
npm install      # also copies the Spline and MapLibre runtimes into public/vendor
npm run dev      # http://localhost:3000
npm run build && npm start
```

Node 20 or newer is required.

### Optional: AI answers for R-4X

R-4X, the robot guide, answers common questions (exhibitors, stalls, live sessions, registration, travel, buyers, programme) from the demo data. To answer anything else with Claude, set `ANTHROPIC_API_KEY` on the server. Without it, `/api/r4x` returns 503 and R-4X replies with its built-in help message.

## Deploy

**GitHub Pages:** every push to `main` runs `.github/workflows/pages.yml`, which builds a static copy of the site and publishes it to the `gh-pages` branch. It is served at https://akash-droid-dev.github.io/Sports-Expo-2027/ once Pages is on (Settings → Pages → Source: Deploy from a branch → `gh-pages`, `/ (root)`). Pages only hosts static files, so R-4X there answers from its built-in topics only.

**Netlify:** project `sports-expo-yashobhoomi-2027` (https://sports-expo-yashobhoomi-2027.netlify.app). `netlify.toml` builds the full app, including the `/api/r4x` function. Link the GitHub repository in the Netlify project (branch `main`) to deploy on every push.

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

## How it is built

The handoff's pages are "Design Components": an HTML template plus a logic class, rendered at runtime by `design/site/support.js`. `scripts/dc-to-jsx.mjs` turns each one into a React component in `src/screens/`, applying the same rules as that runtime (template holes, loops, conditions, inline styles, hover styles, embedded components). The logic classes are kept as they were, so every tab, filter, wizard, drawer and phase switch behaves as in the design. Links point to the routes above.

- `src/screens/*.jsx`: generated screens. `HallPlan.jsx` is the shared Hall 2 floor plan.
- `src/screens/pages.json`: page titles and page-level CSS taken from each design file.
- `src/dc/runtime.js`: the small component wrapper the screens use (`defineDC`, `DCLogic`).
- `src/data/ise.js`: demo data, available as `window.ISE`.
- `src/lib/r4x-guide.js`: the R-4X robot and its Ask panel, mounted once in the root layout.
- `src/lib/hero-fit.js`, `public/hero-scene.html`: the Home hero 3D scene.
- `public/r4x-scene.html`: the robot's Spline scene.
- `public/image-slot.js`: the `<image-slot>` media placeholders.

Screens render in the browser only (`ssr: false`), because the design logic reads `window` (maps, scroll, the demo data).

To pull in a newer export from Claude Design, replace the files in `design/site/` and run:

```bash
node scripts/dc-to-jsx.mjs
```

This overwrites `src/screens/`, so re-apply any hand edits made there.

## Content to replace before launch

- **Demo data:** names, figures, dates and stall IDs in `src/data/ise.js` and in the screens are samples (marked SAMPLE, DEMO or PROVISIONAL in the UI).
- **Photos and videos:** each `<image-slot>` has an id. Map ids to image URLs in `public/image-slots.state.json`, for example `{ "home-yasho-foyer": "/images/foyer.jpg" }`.
- **QR codes** are decorative and encode nothing. Generate real ones server-side.
- **The R-4X robot scene** loads from `prod.spline.design`. Re-export it from Spline into `public/assets/` to self-host it, as the hero scene already is.

## Known gaps carried over from the design

- Portal, Admin and My Expo are desktop layouts. Several public pages also scroll sideways on narrow phones.
- The Earth journey sharpens slowly while zooming.
