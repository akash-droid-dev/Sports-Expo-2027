---
type: index
tags:
  - index
  - pattern
---
# Patterns Index

Reusable building blocks proven in [[India Sports Expo 2027]]. Each note explains how it works, how to reuse it, the lessons learned, and carries the real source code.

## Animation
- [[Card Deal Strip]] — Cards wait stacked like a deck of playing cards, each slightly turned.
- [[Infinite Marquee]] — A strip that scrolls forever, left to right or right to left, without a visible seam.
- [[Fold Word Reveal]] — A word unfolds letter by letter like folded paper: each letter's top half drops in, then its bottom half swings down from behind it in 3D.
- [[Lock and Key Link]] — A link drawn as a padlock with a key.
- [[Playing Card Flip Finale]] — Scroll-driven: when the globe arrives at the venue, four see-through cards are dealt like playing cards (sport photo up), then each flips over to its zone side as you keep scrolling.
- [[CSS 3D Boxes]] — Pure-CSS 3D boxes (no WebGL): five faces with `transform-style: preserve-3d`, travelling in an [[Infinite Marquee]].
- [[Page-Turn Book]] — A closed book on the page.
- [[LED Sports Ticker]] — A stadium LED board: big amber dot-matrix text and inline SVG sport icons scrolling continuously.
- [[Scroll Reveals and Count-ups]] — Headings wipe in, grid items rise in one after another, big numbers count up, a scroll progress bar runs along the top, buttons lift and pulse on tap.
- [[Brand Curtain and Page Transitions]] — A dark curtain with the logo covers the page while it loads, then slides away; internal links slide it back in before navigating.
- [[Per-Page Signature Animations]] — Each page gets its own entrance style through an `html.pg-<route>` class set before first paint, plus bar-grow and giant-letter spins.

## Brand
- [[Spinning Logo Ring]] — The logo artwork (1580 × 639) is split into two images at full resolution — the ring (first 644 px) and the lettering — and laid back together.

## Scroll
- [[Scroll-Driven Globe Journey]] — A tall pinned section; scroll progress drives a MapLibre GL globe (satellite tiles) through keyframed camera positions, with titles and a progress rail.

## Assistant
- [[Robot Guide Widget]] — A small 3D robot (Spline) that blinks, wiggles or hops on hover with a soft synthesised sound, jumps and chirps on click, and opens an "Ask Bucky" panel.

## Mobile
- [[Lite Mode for Phones and Tablets]] — One build, two weights: phones and tablets (small screen or touch) get still or CSS-only versions of the heavy live 3D views, lazy maps and stills for video, so pages stay within mobile memory limits and scroll smoothly.

## Compatibility
- [[Old Browser Support]] — Production builds compile down to old browsers, the boot script fills in missing JS features, and a small script restores inline CSS that old engines ignore.

## Media
- [[Image Slot Media Placeholders]] — A web component that shows a placeholder until an image is mapped to its id, then shows the image with a credit chip.

## Tooling
- [[Design Component to JSX Converter]] — A Node script that converts "Design Components" — HTML templates with `{{ holes }}`, `<sc-for>`, `<sc-if>`, `<dc-import>` and a logic class — into React components, keeping the logic class as-is so every tab, filter and wizard behaves like the prototype.

## Navigation
- [[Back Button and Mobile Menu]] — A history-aware back button (goes back within the site, or Home after a direct visit) and a phone menu that collects the header links and buttons.
