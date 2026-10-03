---
type: page
project: "[[India Sports Expo 2027]]"
route: "/"
screen: src/screens/Home.jsx
design: design/site/Home.dc.html
tags:
  - project/ise
  - page
---

# Home page

> The flagship page: a stadium hero, a scroll-driven journey from Earth to Hall 2, then every part of the Expo in one long, animated scroll.

**Route** `/` · **Audience** Public · **Screen** `src/screens/Home.jsx` · **Design** `design/site/Home.dc.html`

![[90 Assets/India Sports Expo 2027/screenshots/desktop-home.jpg|560]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home.jpg|180]]

## Sections

- **01 Entry** — Hero: stadium photo, kicker "YASHOBHOOMI · NEW DELHI · DATES PROVISIONAL", headline INDIA / SPORTS / EXPO / 2027 with **SPORTS** and **2027** folding open on load ([[Fold Word Reveal]]), lines PLAY INDIA. / BUILD TOGETHER. / STRONGER TOMORROW., ENTER THE EXPO ↓. Banner drifts with the mouse on desktop. LED sports ticker right below ([[LED Sports Ticker]]).
- **02 Earth journey** — Pinned scroll section: MapLibre globe flies Earth → Asia → India → New Delhi → Dwarka → Yashobhoomi → Hall 2 → Four zones, with a step rail on the left and SKIP INTRO. Finale: venue scene + four zone cards dealt and flipped ([[Scroll-Driven Globe Journey]], [[Playing Card Flip Finale]]). `?journey=reduced` swaps camera moves for cuts.
- **03 Intro** — "The global sports economy meets India" — **GLOBAL** and **INDIA** fold open on scroll. The "Book a stall" tile is a padlock and key ([[Lock and Key Link]]).
- **Intentions** — EXPLORE · EXHIBIT · ATTEND · CONNECT · WATCH as 3D boxes travelling left to right ([[CSS 3D Boxes]]).
- **Live now** — Only in live mode (`?liveMode=true`): live player "● LIVE · INNOVATION ARENA" with what's happening now.
- **Metrics** — Headline figures that count up ([[Scroll Reveals and Count-ups]]).
- **04 Explore Hall 2** — "One hall. Four event zones." — the zone guide book: opens large, one spread per zone, closes after Zone D ([[Page-Turn Book]]).
- **05 Four worlds** — The four zones with their clusters.
- **06 Product architecture** — "Build your presence": seven stall products as 3D booths sized by product, moving left to right, hover turns them ([[CSS 3D Boxes]]).
- **07 Featured exhibitors** — Featured exhibitor cards with logos.
- **08 Featured products** — All eight products dealt from a deck, then rolling left to right ([[Card Deal Strip]]).
- **09 Business exchange** — "Build the business of sport." with sample match scores; FIND MATCHES →.
- **10 SportsTech** — SportsTech & innovation by stakeholder (athlete, coach, venue, event, broadcast, fan).
- **11 Programme** — Day tabs with sessions.
- **12 Watch** — "Live & on demand": session cards dealt from a deck, then rolling right to left ([[Card Deal Strip]]).
- **13 Plan your visit** — Getting to Yashobhoomi with Google Maps (loads when near; tap on phones), visitor info.
- **14 CTA** — Final call to action; footer with prototype map and "Be a sport. Shape the future."

## Props / URL switches
`liveMode` (boolean, default false) — DAY 2 LIVE state. `journey` (`scroll` | `reduced`).

## Motion and mobile
Lite: stadium photo (small), journey globe at DPR 1, venue photo instead of the live tour, zone cards 2×2, one booth set, tap-to-load map. No back button on Home.

## Section screenshots

![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-hero.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-hero.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-intro.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-intro.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-intentions.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-intentions.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-zone-cards.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-zone-cards.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-explore-hall.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-explore-hall.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-four-worlds.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-four-worlds.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-product-architecture.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-product-architecture.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-featured-products.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-featured-products.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-watch.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-watch.jpg|140]]
![[90 Assets/India Sports Expo 2027/screenshots/desktop-home-plan-visit.jpg|420]] ![[90 Assets/India Sports Expo 2027/screenshots/phone-home-plan-visit.jpg|140]]

## Related
[[ISE Routes and Pages]] · [[ISE Design System]] · [[India Sports Expo 2027]]
