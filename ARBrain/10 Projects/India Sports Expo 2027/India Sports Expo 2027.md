---
type: project
prefix: ISE
status: live
client: Akash (Beyond the Arena)
created: 2026-10-02
updated: 2026-10-03
source_commit: 6aaefbc
repo: https://github.com/akash-droid-dev/Sports-Expo-2027
live_pages: https://akash-droid-dev.github.io/Sports-Expo-2027/
live_netlify: https://sports-expo-2027-yashobhoomi.netlify.app
stack: [Next.js 16.3.8, React 19.3, MapLibre GL 6.11.2, Spline runtime 2.0.65, Anthropic SDK]
tags:
  - project
  - project/ise
---

# India Sports Expo 2027

> The complete digital platform for **India Sports Expo 2027** at **Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi**: a premium public website, exhibitor control centre, organiser admin, companion app prototype and design system, with **Bucky**, a 3D robot guide on every page. Built from a Claude Design handoff into a live Next.js app, then extended with premium motion, a sporty brand finish, and hard-won mobile and old-browser performance.

![[90 Assets/India Sports Expo 2027/screenshots/desktop-home.jpg|700]]

## Quick facts
| | |
|---|---|
| Client | Akash — akash@beyondthearena.co (GitHub `akash-droid-dev`) |
| Venue | Exhibition Hall 2, Yashobhoomi (India International Convention & Expo Centre), Dwarka Sector 25, New Delhi |
| Built | 2026-10-02, in one long build session (18 commits) |
| Repo | [akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) — `main` |
| Live | [GitHub Pages](https://akash-droid-dev.github.io/Sports-Expo-2027/) (auto on push to `main`) · [Netlify](https://sports-expo-2027-yashobhoomi.netlify.app) (manual folder upload) |
| Admin | `/admin` — opens as Super Admin (no auth yet) |
| Stack | Next.js 16.3.8 (App Router), React 19.3, MapLibre GL 6.11.2, Spline runtime 2.0.65, Anthropic SDK (Bucky answers) |
| Targets | Desktop, tablets, phones; Android Chrome 67+, Samsung Internet 9.2+, iOS/Safari 14+, Firefox 68+, Edge 79+ |
| Data | Demo data only (marked SAMPLE / DEMO / PROVISIONAL) |
| Last build label | 2026-10-02 20:48 UTC |

## Project memory
- [[ISE Brief and Scope]] — what was asked, for whom, what "done" means
- [[ISE Request Log]] — every client request, verbatim
- [[ISE Timeline and Decisions]] — every round: request → what was built → decisions → commit
- [[ISE Launch Checklist and Known Gaps]] — what to replace before going live
- [[ISE Source Snapshot]] — exact commit, branches, how to restore and run

## Design
- [[ISE Design System]] — brand, colour, type, layout, motion, sporty finish, components, states, voice
- [[ISE Screenshots]] — every page, desktop and phone
- [[India Sports Expo 2027 Map.canvas|Project map (Canvas)]]

## Build
- [[ISE Architecture]] — how the app is put together
- [[ISE Repo Map]] — every file and what it does
- [[ISE Routes and Pages]] — 11 routes, with a note per page
- [[ISE Data Model]] — zones, clusters, exhibitors, products, sessions…
- [[ISE Bucky Robot Guide]] — the 3D assistant
- [[ISE Build and Deploy]] — dev, static export, GitHub Pages, Netlify
- [[ISE Device Support]] — phones, tablets, old browsers
- [[ISE Performance Log]] — every measurement and fix

## Assets
- [[ISE Asset Inventory]] — every asset, with previews (copied into `90 Assets/India Sports Expo 2027/`)
- [[ISE Media and Credits]] — licences and slot mapping

## Pages
[[Home page]] · [[Explore page]] · [[Zones page]] · [[Exhibit page]] · [[Attend page]] · [[Connect page]] · [[Programme page]] · [[Portal page]] · [[Admin page]] · [[Mobile App page]] · [[Design System page]]

## Reusable output
Patterns born here: [[Patterns Index]]. Methods: [[Playbook - New Web App from a Claude Design Handoff]], [[Playbook - Premium Motion Pass]], [[Playbook - Mobile and Tablet Performance Audit]], [[Playbook - Old Browser Hardening]], [[Playbook - Deploy to GitHub Pages and Netlify]], [[Playbook - Demo Media Sourcing]].
