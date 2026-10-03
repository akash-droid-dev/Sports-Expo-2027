---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - pages
---

# ISE Routes and Pages

| # | Route | Page note | Audience | Screen (generated) | Design file |
|---|---|---|---|---|---|
| 01 | `/` | [[Home page]] | Public | `Home.jsx` | `Home.dc.html` |
| 02 | `/explore` | [[Explore page]] | Public | `Hall2DigitalTwin.jsx` | `Hall 2 Digital Twin.dc.html` |
| 03 | `/zones` | [[Zones page]] | Public | `ZoneExperiences.jsx` | `Zone Experiences.dc.html` |
| 04 | `/exhibit` | [[Exhibit page]] | Exhibitors | `Exhibit.jsx` | `Exhibit.dc.html` |
| 05 | `/attend` | [[Attend page]] | Visitors | `AttendAndMyExpo.jsx` | `Attend and My Expo.dc.html` |
| 06 | `/connect` | [[Connect page]] | Business | `Connect.jsx` | `Connect.dc.html` |
| 07 | `/programme` | [[Programme page]] | Public | `ProgrammeAndWatch.jsx` | `Programme and Watch.dc.html` |
| 08 | `/portal` | [[Portal page]] | Exhibitor (signed in) | `ExhibitorPortal.jsx` | `Exhibitor Portal.dc.html` |
| 09 | `/admin` | [[Admin page]] | Organiser (super admin) | `AdminConsole.jsx` | `Admin Console.dc.html` |
| 10 | `/mobile` | [[Mobile App page]] | Mobile | `MobileApp.jsx` | `Mobile App.dc.html` |
| 11 | `/design-system` | [[Design System page]] | Team | `DesignSystem.jsx` | `Design System.dc.html` |
| — | (component) | Hall Plan | Shared | `HallPlan.jsx` | `Hall Plan.dc.html` |

## URL switches
- `/?liveMode=true` — Home in "DAY 2 — LIVE" state.
- `/?journey=reduced` — no scroll-driven camera (cuts instead).
- `?lite=1` / `?lite=0` — force phone (lite) or full version on any page.

## Global elements on every page
Sticky 60 px ink header with the logo (spinning ring), nav EXPLORE · EXHIBIT · ATTEND · CONNECT · PROGRAMME · WATCH, Search (⌘K), MY EXPO, angled saffron REGISTER; running-track stripe; back button (not on Home); ☰ menu on phones; brand curtain; scroll progress bar; Bucky bottom-right; footer with the prototype map and "Be a sport. Shape the future."

## Hall Plan component (shared)
Props: `iso` (isometric), `roof` (0–1 roof removal), `mode` (`zones` | `inventory`), `activeZone`, `route` (draw the saffron route), `lit` (cluster IDs), `selectedCluster`/`selectedStall`, `forceAvail`, `onCluster`/`onStall`, `labels`. Stall states: available (white, green border), reserved (saffron hatch), allocated (`#3A3A3E`), blocked (grey hatch).

## Screens
See [[ISE Screenshots]].
