---
type: playbook
tags:
  - playbook
  - claude-design
proven_on: "[[India Sports Expo 2027]]"
---

# Playbook — New Web App from a Claude Design Handoff

Turn a Claude Design export (`*.dc.html` + `HANDOFF.md`) into a live, fast, premium web app. Proven on [[India Sports Expo 2027]] (11 pages in one session).

## 0. Set up the memory first
- [ ] Create the project from [[Template - Web App Project]] in `10 Projects/`, pick a 3-letter prefix.
- [ ] Log every client request verbatim ([[Template - Request]]) and every decision ([[Template - Decision]]) as you go.

## 1. Read the handoff
- [ ] Read `HANDOFF.md` fully: pages, global elements, props, interactions, tokens, assets, known gaps.
- [ ] Serve the prototype (`cd site && python3 -m http.server 8080`) and click through every page.
- [ ] Copy the tokens into a design-system note ([[ISE Design Tokens]] as a model).

## 2. Scaffold
- [ ] Next.js (App Router) + React. **Read `node_modules/next/dist/docs/`** — recent Next versions changed APIs.
- [ ] `package.json`: `"build": "next build --webpack"` and a `browserslist` for the oldest devices you must support ([[Old Browser Support]]).
- [ ] `next.config.ts` as a phase function: static-export switch, base path, build label env, production-only transpiles.
- [ ] Root layout with the ES5 boot script (polyfills, `lite`/`legacy`/`pg-` classes, boot-error overlay) — copy from [[Lite Mode for Phones and Tablets]].

## 3. Convert the design faithfully
- [ ] Run a converter like [[Design Component to JSX Converter]]: templates → JSX, inline styles kept, logic classes kept as-is.
- [ ] Route per page; screens client-only if the logic touches `window`.
- [ ] Verify against the prototype with Playwright screenshots side by side.
- [ ] **Save this faithful build as a branch** (`archive/v1-design-faithful`) before changing anything.

## 4. Ship early
- [ ] GitHub Pages workflow (static export) + Netlify ([[Playbook - Deploy to GitHub Pages and Netlify]]).
- [ ] Visible **build label** in the mobile menu.

## 5. Make it premium
- [ ] [[Playbook - Premium Motion Pass]].
- [ ] Brand layer (logo, colours, sporty/brand finish) in separate CSS that styles the generated screens from outside.
- [ ] Fill every media slot with relevant, licensed demo media ([[Playbook - Demo Media Sourcing]]).

## 6. Make it fast and robust everywhere
- [ ] [[Playbook - Mobile and Tablet Performance Audit]] (phones **and** tablets, CPU-throttled).
- [ ] [[Playbook - Old Browser Hardening]].

## 7. Close out
- [ ] README: run, deploy, pages, everything beyond the design, content to replace, known gaps.
- [ ] Launch checklist ([[ISE Launch Checklist and Known Gaps]] as a model).
- [ ] Promote reusable pieces to `30 Patterns/`; update [[00 Home]].
