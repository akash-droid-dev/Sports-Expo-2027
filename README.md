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
| `/register` | Visitor registration (sign in with an email code, short form, photo and ID) |
| `/me` | My pass: registration status and the accreditation card with its QR code |
| `/portal/register` | Exhibitor registration |
| `/portal` | Exhibitor dashboard (opens once the company is registered) |
| `/meetings` | Meetings portal: book meetings, conference seats, open discussions and rooms; follow requests; business pass |
| `/admin` | Super Admin: approvals, exhibitors, meetings, website content, page edits, media, forms, team |
| `/verify` | Card check that the QR code opens |
| `/mobile` | Companion app: full screen on phones, in a phone frame on computers |
| `/design-system` | Design system and prototype map |

The design's tweakable props can be set from the URL: `/?liveMode=true` shows the Day 2 live state, and `/?journey=reduced` turns off the scroll-driven globe.

## Beyond the design

- **Zone colours:** A red `#9E1B22`, B purple `#5B3A9E`, C blue `#0A62BF`, D green `#00803F` (set in `src/data/ise.js`, and in the zone-specific places of the Zones, Programme, Hall Plan and Design System pages).
- **Brand:** the India Sports Expo 2027 logo in every header, side rail, the loading screen and the Home book cover (`src/components/BrandLogo.jsx`). It is the original artwork (`public/brand/logo.png`) cut into two pieces at full resolution: the ring (`ring.png`), which turns clockwise without stopping (one turn every 16 s, still for visitors who prefer reduced motion), and the lettering (`wordmark.png`; `wordmark-on-dark.png` has white lettering for the dark bars).
- **Home hero** (`src/components/home/PosterHero.jsx`, `poster-hero.css`): key visual 01 (the sprinter, text and logos removed, `public/assets/hero-poster-*.webp`) with its lettering rebuilt as live text in the poster's type and colours: Montserrat Black italic for INDIA SPORTS EXPO and the headline, Bebas Neue for EXHIBIT | ENGAGE | EXCEL and the dates (both SIL Open Font License, served from `src/app/fonts/`). The poster's ring logo is left out (the header already carries the logo); its corner holds the wordmark, and the space beside it shows the key figures (213 stalls, 25 pavilions, 40+ countries, 3 days), which count up, and a live countdown to the opening on 15 October 2027, 10:00 IST. On landscape screens the artwork and the words share one 16:9 frame, so each line sits where it does on the poster; on 4:3 tablets the frame slides so the words stay on screen; on portrait screens the words stack above the runner, with the figures in one row under the dates. As the page curtain lifts, the runner glides in, the wordmark's letters rise out of a mask, each headline line is uncovered by a red, saffron or green wipe, EXHIBIT | ENGAGE | EXCEL slide in and the dates box draws in. The words of "The global sports economy meets India." rise in letter by letter (`src/components/anim/FoldWord.jsx`). Both animate transform and opacity only, once, and are static for visitors who prefer reduced motion; copying the title gives it as written.
- **Sleek theme** (`src/app/sleek.css`, `src/app/fonts.css`): soft, premium and minimal.
  - Type: Manrope for headlines and Inter for text and labels, served by the site itself (`src/app/fonts`, Latin character set, SIL Open Font License). Every screen uses the font variables `--f-display`, `--f-body` and `--f-label`, so changing a typeface is one line in `sleek.css`. Headlines and buttons are in sentence case; small eyebrow labels stay in spaced capitals.
  - No lines or boxes: separator rules are gone, bordered boxes are rounded cards (soft tint, or white with a soft shadow), list rows highlight softly on hover.
  - Buttons, tags, tabs and fields are pills; images and video are rounded.
  - Sections are rounded sheets that slide over the one before; Home's ways-in strip is a row of floating cards with a glow in their colour, and its closing calls to action are three rounded cards with the middle one stepped down.
  - Softer black, gentle lift on hover, and a soft glow on the orange primary buttons.
  - The screens mostly style themselves inline (generated from the design), so `sleek.css` matches those inline styles by their text, like `sporty.css` does.
  - Fonts are declared once per family on purpose: the font packages' own stylesheets split each font into many character-range faces, which made the first layout of the long Home page about 2.5 times slower on phones.
- **Header buttons** (`src/app/liquid.css`): My Expo and Register are filled with moving liquid in two colours, saffron and green waves (Register mostly full, My Expo half full; on hover My Expo fills up). Static gradients for visitors who prefer reduced motion.
- **Brand finish** (`src/app/sporty.css`, `src/components/anim/SportsTicker.jsx`), in the logo's colours, kept quiet for the sleek theme: a thin colour line under every header, a stadium LED ticker with sport icons on Home, and footers that open with "Be a sport. Shape the future."
- **Home animations** (`src/components/home/`, `src/components/anim/`, `src/app/anim.css`):
  - Zone cards at the end of the Earth journey are dealt like playing cards, illustration up, then turn over to a see-through zone side as you scroll. The illustrations are flat SVG scenes in the poster's palette (`public/media/zones/zone-{a,b,c,d}.svg`): A the gate, the sun and crossed hockey sticks; B a stadium roof, ball and running shoe; C a phone with a live heart-rate line, a smartwatch and a VR headset; D a globe, a rising chart and a deal briefcase.
  - "Book a stall" is a padlock and key: the key turns, the lock opens, then the Exhibit page opens.
  - Explore, Exhibit, Attend, Connect and Watch are 3D boxes travelling left to right; the stall products are 3D booths travelling left to right (hover pauses and turns them); live and on-demand sessions are dealt from a deck, then roll right to left; the featured products (all eight) are dealt the same way, then roll left to right (shared timing in `src/components/anim/useDeal.js`).
  - "One hall. Four event zones." is a real hardcover zone guide: navy cloth with gold foil, spine, page block and ribbon. It opens large onto patterned endpapers and a title page with clickable contents, then one spread per zone (plan, areas, stalls, exhibitors) in book typography on cream paper; pages turn with Next, a click on the page, a swipe or the arrow keys, and the book closes itself after Zone D.
  - "05 The Four Worlds" is a live, rotating four-sided standee (`src/components/home/ZoneTower.jsx`): the section pins, the tower turns to each zone's face, the camera dollies in until the face becomes a screen (count-up numbers, Enter button, every area with counts, the zone lit on a mini Hall 2 plan, featured exhibitors or pavilions, and what is live or next in that zone), then pulls back and turns to the next zone. The A–D rail jumps to a zone.
- **Inner pages** each animate in their own way as you scroll (`src/lib/page-anim.js` and the `pg-…` rules in `src/app/anim.css`): Explore unfolds, Zones deals cards and spins its giant zone letters, Exhibit builds up from the floor, Attend flips like a departures board, Connect slides in, Programme runs like a ticker, and the Portal and Admin dashboards pop their tiles. Bars grow into place and big figures count up.
- **Home journey finale** (`src/components/home/`): when the globe reaches Yashobhoomi, the venue takes over behind four clickable zone cards (A–D), pinned until the journey ends. On computers it is the official virtual tour, embedded live and moving in the background; phones, tablets and computers without hardware 3D show a slowly drifting photo of the venue. The tour starts loading early, wakes up behind the globe just before the venue appears and fades in over the venue photo only once it has drawn, so it never shows as a black frame; scrolled well away, it stops drawing. To keep the end of the journey smooth, the zone sides are tinted glass rather than a live blur over the tour, the scrim is light, the card photos are decoded while the venue fades in, and the globe's camera stops once the globe has faded out. The journey is its own component (`HomeJourney.jsx`), so scrolling re-renders only the journey. To use a 360° image of the venue instead of the photo, rotating continuously, set `VENUE_PANORAMA` in `src/lib/venue.js`.
- **Motion** (`src/lib/motion.js`, `src/app/motion.css`): a brand curtain while pages load and change, scroll reveals with staggered items, heading wipes, number count-ups, a scroll progress bar and hover lifts. All of it is off for visitors who prefer reduced motion.
- **Hover and click feedback** (`src/app/motion.css`, `src/lib/motion.js`): buttons and cards lift, saffron buttons get a light sweep, nav and footer links draw an underline, every click sends a small pulse, and the Home banner drifts gently with the mouse.
- **Bucky's sounds and moves** (`src/lib/bucky-sounds.js`): hovering Bucky makes him wiggle or now and then hop, with a soft "boop-bip"; clicking him plays a chirp. Sounds are synthesised in the browser (no audio files) and start after the visitor's first click or tap, as browsers require. SOUND ON/OFF in his panel mutes them.
- **Google Maps:** Home's "Getting to Yashobhoomi" shows the venue on Google Maps. Explore → Getting there shows the Google Maps route for the selected tab (metro, airport, car, shuttle, parking), with the design's route schematic one click away. Both use Google's keyless embed and load only when scrolled near.
- **Demo media** (`public/media`): every photo slot, logo, portrait and video player is filled. See "Demo media" below.
- **Phones and tablets** (`src/lib/device.js`, `src/lib/mobile-fit.js`, `src/app/mobile.css`, `src/components/MobileMenu.tsx`):
  - They get still versions of the 3D views: Bucky bobs, and the venue finale shows a drifting venue photo instead of the live tour. The 3D runtime and Bucky's scene are not even downloaded; the hero photo is a smaller file.
  - The Earth journey is made of still frames of the live globe (`src/components/home/JourneyFrames.jsx`, `public/journey`): each scroll frame zooms, shifts and crossfades the two nearest frames on the GPU, following the same camera path as the desktop globe (`src/data/journey.json`). Phones get 1000 × 1300 frames and tablets 1500 × 1500; only the frames near the current position are loaded. The map library (about 1.1 MB) is never downloaded. The live globe managed only 10–18 frames a second on phones and iPads, and with the frames the journey scrolls as smoothly as the rest of the page. In a simulated Pixel 5 (4× slower processor, 9 Mbps) slow frames in the journey fell from 125 of 298 to 1–3, the page's download fell from 2.6 MB to 1.5 MB, and it is ready about 2 seconds sooner. On a simulated iPad Pro they fell from 304 of 488 to 4.
  - **Re-rendering the frames** after changing the camera path in `src/data/journey.json`: push any commit to the `journey-frames-request` branch. GitHub Actions (`.github/workflows/journey-frames.yml`) runs `scripts/journey/render-frames.mjs`, which needs internet for the satellite imagery, and publishes the result to the `journey-frames` branch. Copy its `p-*.webp` and `t-*.webp` into `public/journey` and its `frames.json` into `src/data/journey-frames.json`, keeping the `p`, `z`, `lon` and `lat` of each frame.
  - Google maps load on a tap, watch cards show still images, and the live player waits for a tap.
  - All of this keeps the page within mobile memory limits. Phones close a page that uses too much, and after repeated crashes Safari refuses to load it.
  - The phone menu shows the build date at the bottom, to check which version is live.
- **Older phones and browsers:** the site runs on Android Chrome 67+ (2018), Samsung Internet 9.2+, iOS/Safari 14+ and Firefox 68+.
  - Builds use webpack (`next build --webpack`) because it compiles the code, MapLibre included, down to the `browserslist` targets in `package.json`. Turbopack, the Next.js 16 default, keeps newer syntax that those browsers can't run. `npm run dev` still uses Turbopack.
  - The inline script in `src/app/layout.tsx` fills in newer JavaScript features they lack. `src/lib/legacy-css.js` restores the inline `inset`, `aspect-ratio` and flex `gap` they ignore, and the stylesheets give top/right/bottom/left before each `inset`.
  - Browsers before Chrome 94 / iOS 16.4 skip the maps, except the Earth journey, which uses the still frames there too.
  - If the site still fails to start on a device, it shows the error, browser and build on screen after 9 seconds, ready to screenshot.
  - The header keeps the logo; its links and buttons move into a ☰ menu.
  - Explore's Hall 2 plan opens as the flat 2D map below laptop width (3D is one tap away) and keeps a readable size, panning sideways inside its frame, instead of shrinking until its labels collide.
  - Connect's matchmaking options wrap as compact chips; the country map is taller with neighbouring pins labelled on different sides; Exhibit shows an exhibitor's products two to a row; short pill tab bars stay on one line and slide sideways.
  - Layouts that are too wide for the screen are reflowed: wide grids get fewer columns, rows wrap, oversized headlines shrink. No page scrolls sideways.
  - Add `?lite=1` or `?lite=0` to a URL to force either version for testing.
  - The Home zone cards fit the screen in a two-by-two grid (four across in landscape), showing each zone's name, key facts and link; the longer text is on the Zones page. Bucky steps aside while they are up. Bucky is 54 px on phones, 78 px on tablets and 112 px on computers (`K` in `src/lib/bucky-guide.js` scales him), and steps half out of the way while the page scrolls.
  - Smooth scrolling on tablets and iPads: photo slots no longer carry hidden, blurred edit buttons (`public/image-slot.js`). On simulated iPads with a slowed processor, stutters while scrolling dropped from 10–17 to 0–1 in a 5-second scroll.
  - Smooth scrolling on phones: moving strips pause when off screen, the 3D booths lie flat when off screen (and phones get one set instead of two), the header stripe moves on the GPU without repainting, and the zone cards and Home book use a tint instead of a live blur. On a mid-range phone this cut the page's GPU layers from about 400 to about 120 and the stutters while scrolling by about two thirds.
- **Laptops and desktops** (`src/lib/bucky-guide.js`, `public/bucky-scene.html`, `src/components/home/VenueScene.jsx`, `src/app/layout.tsx`):
  - Bucky's 3D scene is a 1200 × 800 frame of which only a small square is shown, scaled down. It now renders at the resolution that square needs (0.3 × the screen's pixel density at his current size, about a sixth of the pixels it drew before) and at up to 30 frames a second. It stops drawing while the page scrolls, since he stands still then. It starts once the page has loaded; until then his still picture shows.
  - Computers without hardware 3D, because graphics acceleration is off or the browser has blocklisted the driver, would draw every 3D view in software, very slowly. The inline start-up script detects this and marks the page `no-gpu`. Those computers get the phone versions of the 3D views at full layout: the still-frame Earth journey, a venue photo and Bucky's still picture. Add `?gpu=0` or `?gpu=1` to a URL to force either version.
  - In a test browser drawing in software at 1440 × 900, the full Home scroll used to stall on the Earth journey; it now runs top to bottom. Its download fell from 6.1 MB to 1.7 MB and start-up blocking from 2.6 s to 0.1 s.
- **Back button** at the top left of every page except Home, inside the header bar (`src/components/BackButton.tsx`): goes back within the site, or to Home after a direct visit.
- **Faster 3D:**
  - Bucky's scene is served by the site (`public/assets/bucky.splinecode`; delete it and run `npm install` to pull a new version from Spline). A bundled poster shows him at once on a first visit, and a snapshot from that visit is reused on later pages.
  - The Spline runtime, its Draco mesh decoder (`vendor/draco`) and the scenes are served by the site, preloaded and cached.
  - The Earth journey's camera eases toward the scroll position each frame instead of jumping with every scroll event, keeps loading imagery while zooming and caps its render resolution on high-density screens.

## Platform (registration, dashboards, Super Admin)

The site runs on a Supabase project ("India Sports Expo 2027", ref `adqmcpbwevpvybyolygm`, Mumbai region): sign-in, database, file storage and realtime. The browser talks to it directly with the publishable key in `src/lib/platform/config.js` (set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_KEY` at build time to use another project). Who can read or change what is enforced in the database by row-level security: `supabase/migrations/`.

**How it works**

- **Sign in** everywhere with an email and a one-time code (no passwords).
- **Visitors** register at `/register` with a short form, a photo and an ID document. Every registration waits for an admin. Once approved, `/me` shows the accreditation card with a QR code (save as PDF / print); the code opens `/verify` at the gate. Visitors can edit while their registration is pending or when changes were requested.
- **Exhibitors** register at `/portal/register`; their dashboard at `/portal` opens at once: company profile and logo, products with photos, team, documents. Admins allocate the stall, list the company on the website and can suspend it. Listed exhibitors and their listed products appear on the public pages (Exhibit, Zones, search).
- **Super Admin** at `/admin`, by role: **owner** (akash@beyondthearena.co, can't be removed), **admin** (everything, incl. approvals, forms and team), **editor** (website content, exhibitors, programme, media), **viewer** (read-only). Invite people under Team & roles; they sign in at `/admin` with their email.
  - Visitors: review photo and ID, approve (issues the card), request changes or reject with a message; CSV export.
  - Exhibitors: stall code, zone, listing, suspend, documents (accept / reject), profile and products; CSV export.
  - Website content: every list the public pages are built from (programme sessions, speakers, stages, zones, hall areas, featured exhibitors and products, startups, state and country pavilions, buyer matches): edit, add, hide, reorder, delete.
  - Edit pages: opens any public page with the organiser bar. Click a text to retype it, a picture, video or background to swap it (link, upload or media library), a link to change its target, or hide anything. Every change can be undone.
  - Media library, and the registration form builder (add, relabel, reorder, require or switch off questions; core fields stay).
- **Live:** the dashboards and the admin panel update by themselves (Supabase realtime). Public pages pick up content changes while open on computers, and when brought back into view on phones and tablets (which don't keep a live connection, to stay light). Public pages render from the bundled data first and never wait for the database.

**Meetings portal** (`/meetings`, `src/components/platform/meetings/`, `src/lib/platform/bookings.js`): anyone signed in can request a one-to-one meeting (B2B, B2G, G2G, Buyer–Seller, Investor, Federation, CEO / Strategic) with any company, startup, buyer or delegation, a conference seat, an open-discussion place or a room (deal rooms, lounges, B2B tables), at any time they choose. A meeting with an exhibitor registered on the platform first goes to that exhibitor (`/meetings` → Requests to me: accept or decline); meetings with website companies, seats and rooms go straight to the organisers. In Admin → Meetings the organisers confirm each booking, setting the day, time, venue and table, with a warning when the same person, company, table or room already has a confirmed booking at that time; seats can't be confirmed past a session's capacity. The first confirmed booking issues the person's **business pass** (green card, `ISE27-BIZ-…`): one QR for all their confirmed bookings, checked at `/verify`. The Connect page's Meetings section shows the confirmed bookings live, at company level only, in one card: a line of figures, a thin bar of meeting types whose legend filters, and two tabs, *Who meets whom* (the busiest companies on each side, and the list) and *By day & venue* (a grid; tap a cell for who meets there). Connect's "Request meeting" buttons open the portal with the company and type filled in. The companion app has the same under More → Meetings, and the business pass under Pass.

**Sample bookings.** 35 sample bookings and 6 sessions (`supabase/seed_bookings.sql`, generated by `node scripts/platform/make-booking-seed.cjs`) are in the database so the pages show how it works. They are marked as samples; Admin → Meetings → Overview → *Remove sample data* deletes them and keeps real bookings.

**Backgrounds.** The four brand key visuals, with their text and logos taken out (`node scripts/brand/backgrounds.mjs <folder with 01–04.svg>` → `src/app/bg/`), are placed by `src/app/backgrounds.css`.
- **Main background:** every page is the poster's cream, with 01 (the sprinter) as a soft fixed layer behind it, about 15% visible and calmer in the middle where the text is. Full-width light bands are translucent so it shows through; dark sections stay dark.
- **One more visual per page,** faded into the foot of its light bands: Home 03, Explore 02, Zones 03, Exhibit 04, Attend 03, Connect 02, Programme 04.
- **Full colour:** 03 on the dashboard page headers and Attend's registration; 04 on the accreditation card, Exhibit's registration and the app's home; 02 on Connect's Business Exchange and the business pass; the Home closing tiles use 04, 01 and 02.
- Phones load 828px files, laptops 1440px, large screens 2560px.

**Companion app** (`/mobile`, `src/components/platform/mobile/`): the same accounts, rules and live data as the website, shaped for a phone. Home (pass status, live now, up next, zones), Programme (by day, ☆ saves to My Expo on the phone), Map (Hall 2 by zone and area, with who exhibits where), Pass (sign in, register with photo and ID, the card with QR once approved) and More (exhibitors, plan your visit, exhibitor portal or admin when the account has one). On a phone it fills the screen; `?tab=pass` (home, programme, map, pass, more) opens a tab.

**Test sign-in code.** While `sign_in.test_code` is on (table `app_settings`), no emails are sent and every address signs in with the code **123456** (row `test_code`), through the `test-sign-in` edge function (`supabase/functions/test-sign-in`). Anyone who knows an address can then sign in as that person, organisers included, so the owner switches it to email codes in Admin → Team & roles before launch (and can change the code there). Set up with `supabase/migrations/0003_test_sign_in.sql`; deploy the function with JWT verification off (it checks the code itself).

**Code:** `src/lib/platform/` (client, hooks, storage, live catalogue, page edits, editor), `src/components/platform/` (pages, forms, card, admin sections), `src/app/platform.css`.

**Database:** `supabase/migrations/0001_platform.sql` (tables, rules, storage, realtime) and `0002_harden.sql` (helpers moved out of the public API, faster policies); `supabase/seed.sql` is generated by `node scripts/platform/make-seed.cjs` from `src/data/ise.js` (catalogue and default form fields). `0003_test_sign_in.sql` (test code) and `0004_bookings.sql` (meetings, sessions, business passes, the public board) follow. All of these, and the sample bookings, are already applied to the project.

### To do in the Supabase dashboard before launch

These settings can't be changed from code:

0. **Test code:** while it is on, steps 1–3 can wait; turn it off before launch.
1. **Email template with the code.** Authentication → Emails → Templates → *Magic Link*: put the code in the message, e.g. `Your India Sports Expo sign-in code is {{ .Token }}`. Without `{{ .Token }}` people get a link instead of a code.
2. **Your own email sender (SMTP).** Authentication → Emails → SMTP settings. Supabase's built-in sender only delivers to your own team's addresses and a few emails an hour, so visitors won't receive codes until this is set (any provider: Resend, SendGrid, Amazon SES, Zoho, Gmail Workspace…). Then raise the email rate limit under Authentication → Rate limits.
3. **Site URL and redirect URLs.** Authentication → URL configuration: the site's address (for example `https://akash-droid-dev.github.io/Sports-Expo-2027/`) and any other address it is served from (Netlify).
4. **Backups / plan** as needed for an event of this size.

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
- **QR codes** on the Attend page's sample pass are decorative; the real cards at `/me` carry a working QR code.

## Known gaps carried over from the design

- On desktop, the Earth journey's satellite imagery still sharpens a moment after a fast zoom.
