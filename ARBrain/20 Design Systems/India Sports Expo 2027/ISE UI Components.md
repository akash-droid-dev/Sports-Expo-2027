---
type: design-system
project: "[[India Sports Expo 2027]]"
tags:
  - design-system
  - components
  - project/ise
---

# ISE UI Components

| Component | Spec |
|---|---|
| **Header** | Sticky, 60 px, ink. Logo left; nav EXPLORE · EXHIBIT · ATTEND · CONNECT · PROGRAMME · WATCH (13 px / 600 / +0.08em, white; active saffron); right: Search (1 px `#3A3A3E` border), MY EXPO, REGISTER (saffron, 36 px, angled). Track stripe below. Phones: logo + ☰ menu. |
| **Back button** | Top left inside the header on every page except Home; back in history or Home. [[Back Button and Mobile Menu]] |
| **Primary button** | Saffron `#F07C12`, ink text, 46–56 px, uppercase 14 px / 700 / +0.08em, angled; hover light sweep. |
| **Secondary button** | 1 px ink or graphite border, transparent. |
| **Section kicker** | Mono `NN — TITLE`. |
| **Cards** | White, 1 px `#E3E0D8`; lift on hover. Dealt cards: 10 px radius, soft shadow. Zone cards: glass (blur on desktop, tint on phones), zone colour top bar, giant letter. |
| **Drawer** | Right side, `min(560–760px, 94–96vw)`, scrim closes on click, Esc closes. |
| **Wizard** | 260 px numbered rail, 4 px saffron progress, autosave text, BACK / CONTINUE; after submit a five-stage status track. |
| **Toast** | Bottom centre, ink, saffron ● dot, 14 px, ~2.4–2.6 s, `role="status"`. |
| **Search** | ⌘K / Ctrl+K full-screen overlay, grouped results (Exhibitors, Products, Sessions, Experiences, Federations, Startups, Speakers, Countries & States), Esc closes. |
| **Hall Plan** | Shared floor plan: zones / inventory modes, isometric, roof removal, route drawing, cluster/stall selection. See [[ISE Routes and Pages]]. |
| **Image slot** | `<image-slot id>` photo/video placeholder with credit chip. [[Image Slot Media Placeholders]] |
| **Video** | Poster first, plays on click; watch cards preview on hover (stills on phones). |
| **Brand curtain** | Full-screen ink with the logo, slides away. |
| **Bucky** | 150 px robot bottom-right + Ask panel (max 380 px). [[ISE Bucky Robot Guide]] |
| **Phone menu** | Full-screen list of the page's header links and actions; build label at the bottom. |
| **Boot-error overlay** | After 9 s without start: errors, browser, build — ready to screenshot. |
