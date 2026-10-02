# Handoff: India Sports Expo 2027 — Complete Digital Platform

## Overview
The full digital platform for India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. It covers a public website (11 pages), an exhibitor control centre, an organiser admin and command console, a companion mobile app, a design system page, and **R-4X**, a 3D robot guide that appears on every page.

This package holds **every page and every supporting file** in the project. It is not just Home.

## About the design files
The files in `site/` are **design references built in HTML**. They are working prototypes that show the intended look and behaviour; they are not production code to ship as is. Your job is to **rebuild these designs in the target codebase's environment** (React or Next.js, Vue, and so on) using its patterns and libraries. If no codebase exists yet, pick the best framework; Next.js with TypeScript fits, since `reference/r_4_x_bot/` is already a Next.js app.

Each `*.dc.html` file is a "Design Component": a full HTML document with a template inside `<x-dc>…</x-dc>`, plus a logic class in `<script data-dc-script>`. Templates use `{{ path }}` holes, `<sc-for>` for loops, `<sc-if>` for conditions, and `<dc-import name="X">` to embed another DC. `support.js` is the runtime that renders them. All styling is inline. Treat the logic class like a React class component: its `renderVals()` returns the template's data and handlers.

### Running the prototypes locally
Serve `site/` with any static server; `file://` will not work because of fetch and iframes:
```
cd site && npx serve .      # or: python3 -m http.server 8080
```
Open `Home.dc.html`. Every page links to the others through the top nav, and `Design System.dc.html` has a full prototype map.

## Fidelity
**High fidelity.** Colours, type, spacing, copy and interactions are final-intent. Rebuild the UI pixel-faithfully. All company names, people, figures, dates and stall IDs are **demo data** (marked SAMPLE, DEMO or PROVISIONAL in the UI). Replace them with real data from the backend.

---

## Pages / screens

| # | File | Audience | Sections (`data-screen-label`) |
|---|------|----------|-------------------------------|
| 01 | `Home.dc.html` | Public | 01 Entry (hero with 3D hand and globe), 02 Earth journey (scroll-driven globe zoom Earth → India → Delhi → Yashobhoomi → Hall 2), 03 Intro, Intentions, Live now, Metrics, 04 Explore Hall 2, 05 Four worlds, 06 Product architecture, 07 Featured exhibitors, 08 Featured products, 09 Business exchange, 10 SportsTech, 11 Programme, 12 Watch, 13 Plan your visit, 14 CTA |
| 02 | `Hall 2 Digital Twin.dc.html` | Public | Hall 2 twin (roof removal, zones, 2D/3D/live map modes, indoor routing), Getting there (map), Visitor info |
| 03 | `Zone Experiences.dc.html` | Public | Zone A India Sports & Heritage (states map, theme pavilion, federations), Zone B Sports Goods & Infrastructure (marketplace), Zone C Sports Tech & Experience (athlete body explorer, Try Sport Arena), Zone D Sports Business & Investment |
| 04 | `Exhibit.dc.html` | Exhibitors | Why exhibit, Product architecture (7 booth products, 3D booth previews), Stall inventory (live Hall Plan), Exhibitor directory (filters + drawer), Exhibitor registration wizard |
| 05 | `Attend and My Expo.dc.html` | Visitors | Why attend (11 participant types), Visitor registration (8-step wizard → verification → approval → accreditation → credential), Accreditation & digital pass (QR, access rights), My Expo dashboard (visitor / buyer / investor views, 8 tabs), Plan my day (reorderable itinerary on Hall Plan) |
| 06 | `Connect.dc.html` | Business | Business Exchange (I am / looking for + filters), Matchmaking results (scored, reasons, profile drawer), Meeting management (10-step lifecycle: request → follow-up, slot grid, 40-table picker, outcomes, meeting record), Country pavilions (world map + detail), Lounges |
| 07 | `Programme and Watch.dc.html` | Public | Event-phase switch (before / during / after), Live mode (player, transcript, what's happening, up next), Programme (Agenda / Timeline / Stage / Sector / Speaker views × Day 1–3), Innovation Arena (by phase), Watch library (filters), Session drawer, Universal search (⌘K, grouped results) |
| 08 | `Exhibitor Portal.dc.html` | Exhibitor (logged in) | 13 modules in a left rail: Overview, Company Profile, Products (+ upload), Representatives, Stall (Hall Plan inventory), Build-Up, Logistics, Documents, Buyer Matches, Meetings, Notifications, Helpdesk, Analytics. Each has PRE-EVENT / LIVE / POST-EVENT states |
| 09 | `Admin Console.dc.html` | Organiser staff | Command Dashboard (18 KPIs, charts, alerts), Reports, Venue (Hall Plan editor), Registration & Exhibitor approval queues, Accreditation, Users & Roles, Products, Buyers, Investors, Startups, Matchmaking rules, Meetings, Programme, Speakers, Experiences, Streams, States, Countries, Federations, CMS editor (draft → review → scheduled → published), Notifications, Helpdesk kanban, System settings. Phase switch PRE / LIVE / POST |
| 10 | `Mobile App.dc.html` | Mobile | Interactive 390×844 phone: Home, My Pass (QR), Map + route, My Expo (schedule / meetings + check-in / saved), More (programme, exhibitors, products, live, notifications, helpdesk, plan your visit); 8 push-notification states; mobile design decisions |
| 11 | `Design System.dc.html` | Team | Prototype map, colour, type, components, patterns, motion / accessibility / loading rules |
| — | `Hall Plan.dc.html` | Shared component | The Hall 2 floor plan used by Home, Twin, Exhibit, Attend, Portal, Admin and Mobile |

---

## Global elements (on every page)

### Header
Sticky, 60px tall, `#0E0E0F`. Logo mark: a 22×22 white square with a saffron (`#F07C12`) 6px bar rotated −28°. Wordmark "INDIA SPORTS EXPO **2027**" in Archivo 62% width, weight 900, 24px, with "2027" in saffron. Nav items EXPLORE, EXHIBIT, ATTEND, CONNECT, PROGRAMME, WATCH: 13px, weight 600, +0.08em letter-spacing, white; the active item is saffron. On the right: Search button (1px `#3A3A3E` border), MY EXPO link, and a saffron REGISTER button 36px tall.

### R-4X robot guide (`r4x-guide.js` + `r4x-scene.html`)
- **Placement:** fixed in the bottom-right corner, 150×150px, 18px from the right and bottom edges, `z-index: 9000`. It does not move.
- **Render:** an iframe loads `r4x-scene.html`, which runs the Spline scene `https://prod.spline.design/clZpIOGef0TGq99W/scene.splinecode`. Only these objects stay visible: Robot, Helmet, ear, Shield, Eyes, Collar, Body, Camera and Directional Light. The scene background is transparent. Mouse-follow is switched off (`setGlobalEvents(false)`), and head and body rotation are locked to their rest pose so the robot always stands upright, facing forward. The iframe renders at 1200×800 and is shown at `translate(-162px,-120px) scale(.4)` inside a 150px overflow-hidden box, which crops it to the robot.
- **Idle:** the only motion is blinking. The `Eyes` objects squash to 10% of their height over 160ms every 3–5s (random). Turned off under `prefers-reduced-motion`.
- **Click:** the robot jumps (560ms, 46px arc, squash and stretch from the bottom centre), then opens the **Ask R-4X** panel.
- **Panel:** max 380px wide, white, 1px ink border, shadow `0 24px 60px -24px rgba(14,14,15,.55)`. The header is ink with "EXPO GUIDE · ONLINE" (mono, saffron, with a green status dot) and the title "ASK R-4X" (Archivo 62% / 900 / 24px), plus a CLOSE ✕ button. It has a message log (role=log), five suggestion chips, an input with a saffron ASK → button, and the footer "Demo assistant · answers use sample Expo data". Esc closes it.
- **Answers:** matched locally first for exhibitor names or stall IDs, live sessions, zones, registration, stalls, travel, buyers and programme. Each answer can include links to the right page. Anything else goes to an LLM with the Expo data as context. In production, replace `window.claude.complete` with your own AI endpoint.
- **Console:** the Spline export throws `getPhysicsLocalMatrix` errors on every frame. `r4x-scene.html` wraps `requestAnimationFrame` to suppress them. Fix the physics on the broken object in Spline and re-export.

### Home hero 3D scene (`hero-scene.html` + `hero-fit.js` + `assets/r4x-robot.splinecode`)
- A hand, a globe (Inner and Outer circle), a translucent **Torus** shell and particles. Only `Backdrop` is hidden. Background is `#0E0E0F`, matching the page.
- The host box is absolutely positioned on the right of the hero: `width: min(66%, 1100px)`, full height, overflow hidden, with an 18% left-edge fade to `#0E0E0F`.
- The iframe renders at a fixed 1440×900 with `app.setZoom(0.85)`. For the first ~50 frames it samples itself into a 144×90 grid, counting any cell where |luminance − 14| > 5 and ignoring the outer 3% border. It then posts the bounding box to the parent with `postMessage({heroBox})`.
- `hero-fit.js` scales the iframe to `min(hostW·0.58/boxW, hostH·0.84/boxH, 3)` and places the centre of the content at **68% of the host width** and 50% of its height. It refits on resize and fades in once measured.
- Wheel events over the scene scroll the page instead of zooming the 3D camera.

---

## Tweakable settings (props)

### `Home.dc.html`
| Prop | Editor | Default | Effect |
|---|---|---|---|
| `liveMode` | boolean | `false` | Shows the red "DAY 2 — LIVE" banner and switches Home to live content. The user last had this **on** in the preview. |
| `journey` | enum `scroll` \| `reduced` | `scroll` | `scroll` = scroll-driven globe zoom; `reduced` = static, no camera motion |

### `Hall Plan.dc.html` (shared component)
| Prop | Type | Default | Effect |
|---|---|---|---|
| `iso` | boolean | false | Isometric (3D-tilted) view |
| `roof` | range 0–1 | 0 | Roof-removal animation progress |
| `mode` | `zones` \| `inventory` | `zones` | Zone colours vs stall availability |
| `activeZone` | `''` \| A–D | `''` | Highlights one zone |
| `route` | boolean | false | Draws the saffron route along the Sports Boulevard |
| `lit` | string[] | — | Cluster IDs to highlight |
| `selectedCluster` / `selectedStall` | string | — | Selection state |
| `forceAvail` | string[] | — | Stall IDs forced to "available" |
| `onCluster` / `onStall` | fn | — | Click callbacks |
| `labels` | boolean | true | Cluster labels |

### In-page state switches
These are not props, but they are part of the prototype:
- Programme and Watch: event phase (before / during / after).
- Exhibitor Portal: PRE-EVENT / LIVE / POST-EVENT.
- Admin Console: PRE / LIVE · DAY 2 / POST.
- My Expo: View as Visitor / Buyer / Investor.
- Registration: a "Simulate next stage" button.

---

## Interactions and behaviour
- **Earth journey (Home):** scroll progress drives a MapLibre globe (`maplibre-gl@5.6.0`, satellite raster tiles) from Earth through India and Delhi to Yashobhoomi. Then a hand-off to the Hall 2 plan with roof removal. `journey=reduced` swaps camera moves for cuts.
- **Drawers:** right-side panels for exhibitors, products, sessions and profiles, `min(560–760px, 94–96vw)`. A dark scrim (`rgba(14,14,15,.55–.6)`) closes them on click; Esc closes too.
- **Wizards:** a numbered left rail (260px), a 4px saffron progress bar, autosave text, BACK and CONTINUE buttons. After submit, a five-stage status track.
- **Toasts:** bottom centre, ink background, saffron ● dot, 14px text, ~2.4–2.6s, `role="status"`.
- **Search:** ⌘K / Ctrl+K opens a full-screen overlay; results are grouped (Exhibitors, Products, Sessions, Experiences, Federations, Startups, Speakers, Countries & States). Esc closes it.
- **Empty states:** a 1px dashed `#BDB9B0` box, a condensed headline and one next action.
- **Loading:** stone `#F1EFEA` skeleton bars with a mono line saying what is loading.
- **Motion:** ease `cubic-bezier(.2,.7,.2,1)`, 400–1000ms. Motion explains space (zoom, roof removal, route drawing); there are no decorative loops. Respect `prefers-reduced-motion` everywhere.
- **Responsive:** public pages are fluid (`max-width:1440px`, `auto-fit/minmax` grids). Portal and Admin have fixed side rails (240 / 232px) and are desktop-first; the mobile experience lives in the Mobile App page.

## State management
All demo data lives in `ise-data.js`, available as `window.ISE`:
- Zones (`Z`, `zones`) and clusters (`clusters`, with a `cl(id)` lookup).
- `exhibitors`, `products`, `sessions`, `speakers` (with an `sp(id)` lookup), `startups`, `matches`, `countries` and `states`.

Per-page UI state is in each logic class `state` (tabs, filters, wizard step, saved items, meetings, phase). Model it in your store; most of it should persist per user (My Expo saved items, itinerary, meeting status).

## Design tokens
**Colour:** 70–80% neutral, 20–30% accent.
| Token | Hex | Use |
|---|---|---|
| Ink | `#0E0E0F` | Text, nav, dark sections |
| White | `#FFFFFF` | Canvas |
| Stone | `#F6F4EF` | Alternate section background |
| Stone 2 | `#F1EFEA` / `#FBFAF7` | Skeleton, rails |
| Rule | `#E3E0D8` | Hairlines |
| Muted | `#6B6A66` / `#8A877F` / `#BDB9B0` | Secondary text |
| Graphite | `#3A3A3E` / `#2A2A2D` / `#1A1A1C` | Dark-UI rules and surfaces |
| Saffron | `#F07C12` | Primary action, Sports Boulevard, routes, progress |
| Saffron ink | `#C2610B` | Saffron text on white |
| Deep red | `#9E1B22` | Zone A, LIVE, errors |
| Steel | `#3F4A56` | Zone B |
| Green | `#0B6E4F` (tint `#E3F1EB`) | Zone C, success |
| Zone D ink | `#141416` | Zone D |
| Info blue | `#1F4E9E` | Query or info status only |
| Gold | `#C9A227` | Investor / accredited lounges |
| Saffron tint | `#FFF3E6` | Selected row |

**Type:**
- Display: **Archivo**, `font-stretch: 62%`, weight 900. XL 148px / 0.84 line height (clamped 64–148), L 80 / 0.88, M weight 800 at 26–56px.
- Body: **Instrument Sans** 400–700, 15–19px, 1.45–1.55 line height. UI labels 12–13px, weight 700, +0.08–0.1em.
- Data and meta: **JetBrains Mono** 400–500, 10–15px, +0.1–0.22em, often uppercase.
- Fonts load from Google Fonts.

**Shape:** square corners everywhere. The only round elements are the phone frame (54 / 42px) and status dots. Borders are 1px ink or `#E3E0D8`.

**Spacing:** section padding 64–80px vertical and 28px horizontal; grid gaps 8 / 12 / 16 / 24 / 32 / 48 / 56; buttons 46–56px tall with 16–28px horizontal padding.

**Shadows:** used rarely; the panel and phone use `0 24–30px 60px -24–30px rgba(14,14,15,.5–.55)`.

**Status:** always icon plus word, never colour alone: ◷ PENDING, ? QUERY, ✓ APPROVED, ✕ REJECTED, ■ ALLOCATED, ● LIVE.

**Stall inventory:** available = white with a green border; reserved = saffron hatch; allocated = `#3A3A3E`; blocked = grey hatch.

## Assets
| File | What |
|---|---|
| `site/assets/r4x-robot.splinecode` | Home hero 3D scene (hand, globe, Torus, particles). Spline export, ~1 MB. |
| Remote Spline scene `clZpIOGef0TGq99W` | R-4X robot. Re-export it into the repo for production. |
| Spline runtime | `https://unpkg.com/@splinetool/runtime@latest`. Pin a version in production. |
| MapLibre GL 5.6.0 + satellite raster tiles | Earth journey and Getting there maps |
| `<image-slot>` (`image-slot.js`) | Drag-and-drop photo and video placeholders: portraits, products, booth renders, live player. Replace them with real media. |
| `reference/Hall2_Layout_with_Legend.pdf` | Source Hall 2 floor layout that the Hall Plan follows |
| `reference/pasted-reference.png` | Visual reference supplied by the client |
| `reference/r_4_x_bot/` | Client's Next.js R-4X robot project (source of the robot scene) |
| `standalone/India Sports Expo 2027 - Home.html` | Single-file export of Home only |

QR codes are decorative patterns and do not encode data. Generate real ones server-side.

## Files
```
site/
  Home.dc.html                 01 Home
  Hall 2 Digital Twin.dc.html  02 Explore
  Zone Experiences.dc.html     03 Zones A–D
  Exhibit.dc.html              04 Exhibit
  Attend and My Expo.dc.html   05 Attend + My Expo
  Connect.dc.html              06 Business Exchange
  Programme and Watch.dc.html  07 Programme + Watch + Search
  Exhibitor Portal.dc.html     08 Exhibitor control centre
  Admin Console.dc.html        09 Admin + Command
  Mobile App.dc.html           10 Companion app
  Design System.dc.html        11 Design system + prototype map
  Hall Plan.dc.html            Shared Hall 2 plan component
  ise-data.js                  Demo data (window.ISE)
  r4x-guide.js                 R-4X robot + Ask panel (included on every page)
  r4x-scene.html               Robot Spline iframe (crop, upright lock, blink)
  hero-scene.html              Home hero Spline iframe (measure + report)
  hero-fit.js                  Fits hero iframe in its host
  assets/r4x-robot.splinecode  Hero 3D scene
  image-slot.js                Media placeholder web component
  support.js                   Design Component runtime (prototype only)
reference/                     Client source material
standalone/                    Home single-file export
```

## Known gaps
- Desktop dashboards (Portal, Admin, My Expo) are not yet laid out for small screens.
- The Earth journey sharpens slowly while zooming; a fix was tried and then reverted on request.
- The R-4X answers outside the built-in topics need a production AI endpoint.
