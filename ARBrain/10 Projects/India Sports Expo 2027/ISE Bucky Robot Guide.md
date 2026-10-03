---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - assistant
---

# ISE Bucky Robot Guide

![[90 Assets/India Sports Expo 2027/bucky/bucky-poster.png|160]]

**Bucky** (called R-4X in the design files, renamed in round 3) is the Expo's guide: a small 3D robot fixed bottom-right on every page (150 × 150 px, 18 px from the edges, `z-index: 9000`).

## Behaviour
| Moment | Desktop | Phones/tablets |
|---|---|---|
| Load | Bundled poster at once (first visit), cached snapshot later; live Spline scene fades in | Poster only (runtime not downloaded), gentle bob |
| Idle | Blinks every 3–5 s (eyes squash to 10 % for 160 ms) | — |
| Hover | Wiggles left-right or now and then hops; soft "boop-bip" | — |
| Click | Jumps (560 ms arc, squash/stretch) + cheerful chirp; opens **Ask Bucky** | Opens panel |
| Zone cards visible on phones | — | Steps aside (`html.vs-cards-on`) |

Sounds are synthesised with Web Audio (no files), start after the first user gesture, and can be muted (SOUND ON/OFF in the panel).

## Ask panel
Ink header "EXPO GUIDE · ONLINE" (mono, saffron, green dot), title in display type, message log (`role=log`), five suggestion chips, input with a saffron ASK → button, footer "Demo assistant · answers use sample Expo data". Esc closes.

**Answers:** first matched locally against the demo data — exhibitor names or stall IDs, live sessions, zones, registration, stalls, travel, buyers, programme — each with links to the right page. Anything else goes to `window.claude.complete` → `POST /api/bucky` → Anthropic SDK with the Expo data as context. Without `ANTHROPIC_API_KEY` (or on static hosts), the route returns 503 and Bucky replies with his built-in help.

## Files
`src/lib/bucky-guide.js`, `src/lib/bucky-sounds.js`, `public/bucky-scene.html`, `public/assets/bucky.splinecode` (self-hosted Spline scene), `public/assets/bucky-poster.png`, `src/app/api/bucky/route.ts`, `src/components/ClientInit.tsx`. Source inlined in [[Robot Guide Widget]].

## Known quirks
- The Spline export throws `getPhysicsLocalMatrix` errors every frame; the scene page suppresses them. Fix the physics in Spline and re-export for production.
- Original remote scene id: `clZpIOGef0TGq99W` (pulled into the repo at install).
