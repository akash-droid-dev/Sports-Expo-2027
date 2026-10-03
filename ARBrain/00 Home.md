---
type: dashboard
tags:
  - home
  - index
---

# ARBrain · Web Apps

> The memory and toolkit for building web applications. Everything learned on one project is kept so the next one starts further ahead.

## Projects
| Project | Status | Live | Notes |
|---|---|---|---|
| [[India Sports Expo 2027]] | Live (demo data) | [GitHub Pages](https://akash-droid-dev.github.io/Sports-Expo-2027/) · [Netlify](https://sports-expo-2027-yashobhoomi.netlify.app) | Next.js 16 / React 19, 11 pages, 3D, scroll journey, premium motion |

## Start a new web app
1. Create a project folder from [[Template - Web App Project]] in `10 Projects/`.
2. Follow [[Playbook - New Web App from a Claude Design Handoff]].
3. Pick a design system from `20 Design Systems/` (or fork [[ISE Design System]]).
4. Pull building blocks from [[Patterns Index]].
5. Before launch: [[Playbook - Mobile and Tablet Performance Audit]], [[Playbook - Old Browser Hardening]], [[Playbook - Deploy to GitHub Pages and Netlify]].

## Design systems
- [[ISE Design System]] — India Sports Expo 2027: ink + saffron, condensed italic display type, sporty finish, motion language.

## Patterns
[[Patterns Index]] — 19 proven patterns: card deal strip, infinite marquee, fold-word reveal, lock and key link, playing-card flip, CSS 3D boxes, page-turn book, spinning logo ring, LED ticker, scroll reveals, page curtain, scroll-driven globe, per-page animations, robot guide, lite mode, old-browser support, image slots, design-to-JSX converter, back button and mobile menu.

## Playbooks
- [[Playbook - New Web App from a Claude Design Handoff]]
- [[Playbook - Premium Motion Pass]]
- [[Playbook - Mobile and Tablet Performance Audit]]
- [[Playbook - Old Browser Hardening]]
- [[Playbook - Deploy to GitHub Pages and Netlify]]
- [[Playbook - Demo Media Sourcing]]
- [[Test Harness]]

## Lessons that apply to every project
- Ship a **visible build label** (phone menu) so "is the new version live?" takes one look.
- Phones die from **memory**, not just CPU: one live 3D/WebGL view at a time, still images on phones.
- The biggest scroll-jank causes found: live `backdrop-filter` blurs, GPU layer explosions (3D faces, hidden blurred buttons), and **work done on every scroll frame that changes nothing** (a map redrawn with the same camera).
- Never create or destroy heavy objects (maps, WebGL) mid-scroll; do it in a scroll pause.
- Build with webpack + browserslist when old Android/iOS matter; Turbopack keeps modern syntax.
- Measure, don't guess: CPU-throttled Playwright runs, frame times, layer counts, traces ([[Test Harness]]).

## Templates
[[Template - Web App Project]] · [[Template - Page]] · [[Template - Decision]] · [[Template - Pattern]] · [[Template - Request]]

## Meta
[[Vault Conventions]] · [[README]]
