---
type: playbook
tags:
  - playbook
  - motion
proven_on: "[[India Sports Expo 2027]]"
---

# Playbook — Premium Motion Pass

Make a site feel premium without making it heavy.

## Layers, in order
1. **Site-wide engine** — drop in `motion.js` + `motion.css` ([[Scroll Reveals and Count-ups]]): reveals, heading wipes, count-ups, progress bar, hover lift, light sweep on primary buttons, link underline draw, click pulse. Zero per-page work.
2. **Page transitions** — brand curtain ([[Brand Curtain and Page Transitions]]).
3. **Brand moment** — the logo does one signature thing ([[Spinning Logo Ring]]).
4. **Hero** — one typographic reveal ([[Fold Word Reveal]]) and a slow photo zoom.
5. **Section signatures** — one idea per section, matched to its meaning:
   - choices → moving 3D boxes ([[CSS 3D Boxes]])
   - products / sessions → cards dealt from a deck, then rolling ([[Card Deal Strip]])
   - a guide with chapters → a book ([[Page-Turn Book]])
   - "book / unlock / register" → lock and key ([[Lock and Key Link]])
   - arrival at a place → cards dealt then flipped over the venue ([[Playing Card Flip Finale]])
   - live facts → LED ticker ([[LED Sports Ticker]])
6. **Inner pages** — each gets its own entrance style ([[Per-Page Signature Animations]]).
7. **Delight** — the mascot reacts with movement and sound ([[Robot Guide Widget]]).

## Rules
- [ ] Every effect has a `prefers-reduced-motion` fallback.
- [ ] Loops pause off screen; 3D flattens off screen.
- [ ] Only `transform`/`opacity` in animations.
- [ ] Keep custom-animated components out of the generic reveal engine (`data-anim`).
- [ ] After the pass, run [[Playbook - Mobile and Tablet Performance Audit]] — motion is the usual source of jank.
