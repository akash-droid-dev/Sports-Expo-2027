---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/scroll
  - react
status: proven
---

# Playing Card Flip Finale

> Scroll-driven: when the globe arrives at the venue, four see-through cards are dealt like playing cards (sport photo up), then each flips over to its zone side as you keep scrolling. The venue keeps moving behind (live virtual tour on desktop, a drifting photo on phones).

**Used in:** End of the Home Earth journey: the four zone cards (A–D) over the Yashobhoomi venue scene.

## How it works

- Journey progress `p` (0–1) drives everything: cards deal at `CARD_AT=[0.79,0.81,0.83,0.85]` and flip at `FLIP_AT=[0.88,0.905,0.93,0.955]`.
- Card = `.vs-card-inner` (rotated 0 → 180°) with `.vs-front` (sport image, pips, label) and `.vs-back` (glass zone side).
- Desktop glass: `backdrop-filter: blur(14px)`; phones/tablets (`html.lite`): a deeper tint instead — a live blur over a moving background is repainted every frame.
- Phones: 2×2 grid that fills the screen (4 across in landscape), shorter copy, Bucky hides (`html.vs-cards-on`).

## Reuse it

- Any "arrival" moment at the end of a pinned scroll section.
- Keep thresholds in one array so timing is easy to tune.

## Gotchas and lessons

- Test the phone layout at 375×667 (iPhone SE) and landscape — long names like INFRASTRUCTURE overflow first.

## Related

[[Scroll-Driven Globe Journey]] · [[Home page]] · [[Lite Mode for Phones and Tablets]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/home/VenueStage.jsx`
```jsx
'use client';
// End of the Home globe journey. After the map reaches Yashobhoomi, the venue scene takes
// over the screen and four zone cards (A–D) are dealt like playing cards, sport photo up;
// scrolling on turns each one over to its zone side (see-through glass).
// `p` is the journey's scroll progress (0–1); the stage stays pinned until the journey ends.
import { useEffect, useState } from 'react';
import VenueScene from './VenueScene';
import { withBase } from '@/lib/base';
import '@/data/ise';
import './venue-stage.css';

const ramp = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
// Scroll progress at which each card is dealt, then turned over.
const CARD_AT = [0.79, 0.81, 0.83, 0.85];
const FLIP_AT = [0.88, 0.905, 0.93, 0.955];
// The face shown first: a sport photo for each zone (public/media).
const FACE = {
  A: { img: '/media/video/cricket-club.webp', sport: 'CRICKET' },
  B: { img: '/media/football.webp', sport: 'FOOTBALL' },
  C: { img: '/media/video/hockey-goal.webp', sport: 'HOCKEY' },
  D: { img: '/media/floodlights.webp', sport: 'STADIUM' },
};

function zoneSummary(D, z) {
  const clusters = D.clusters.filter((c) => c.zone === z.id);
  const stalls = clusters.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pavilions = clusters.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  const facts = [clusters.length + ' areas'];
  if (stalls) facts.push(stalls + ' stalls');
  if (pavilions) facts.push(pavilions + ' pavilions');
  return { facts: facts.join(' · '), highlights: clusters.slice(0, 3).map((c) => c.name) };
}

export default function VenueStage({ p = 0, reduced = false }) {
  const [hover, setHover] = useState(null);
  const D = typeof window !== 'undefined' ? window.ISE : null;

  const venueOpacity = reduced ? 1 : ramp(p, 0.56, 0.62);
  const finale = reduced ? 1 : ramp(p, 0.7, 0.76);
  const zoneHref = (id) => withBase('/zones#zone-' + id.toLowerCase());
  // Lets Bucky step aside on phones while the cards are up (venue-stage.css).
  const cardsOn = finale > 0.5;
  useEffect(() => {
    document.documentElement.classList.toggle('vs-cards-on', cardsOn);
    return () => document.documentElement.classList.remove('vs-cards-on');
  }, [cardsOn]);
  return (
    <div className="vs-root">
      <div className="vs-venue" style={{ opacity: venueOpacity }}>
        <VenueScene active={reduced || p > 0.3} />
        <div className="vs-scrim" style={{ opacity: 0.6 + finale * 0.3 }} />
      </div>

      <div className="vs-final" style={{ opacity: finale, pointerEvents: finale > 0.5 ? 'auto' : 'none' }}>
        <header className="vs-head">
          <span className="vs-kicker">
            08 / 08 · EXHIBITION HALL 2<span className="vs-kicker-more"> · YASHOBHOOMI</span>
          </span>
          <h2 className="vs-title">
            FOUR EVENT <span>ZONES</span>
          </h2>
        </header>

        <div className="vs-cards" role="list">
          {D
            ? D.zones.map((z, i) => {
                const shown = reduced || p >= CARD_AT[i];
                const flipped = reduced || p >= FLIP_AT[i];
                const { facts, highlights } = zoneSummary(D, z);
                const face = FACE[z.id] || FACE.A;
                return (
                  <a
                    key={z.id}
                    role="listitem"
                    href={zoneHref(z.id)}
                    className={'vs-card' + (shown ? ' is-in' : '') + (flipped ? ' is-flipped' : '') + (hover === z.id ? ' is-hover' : '')}
                    style={{ '--zone': z.color, '--i': i }}
                    tabIndex={shown ? 0 : -1}
                    aria-hidden={!shown}
                    aria-label={`Zone ${z.id}: ${z.name}`}
                    onMouseEnter={() => setHover(z.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(z.id)}
                    onBlur={() => setHover(null)}
                  >
                    <span className="vs-card-inner">
                      <span className="vs-face vs-front" aria-hidden="true">
                        <span className="vs-front-img" style={{ backgroundImage: `url("${withBase(face.img)}")` }} />
                        <span className="vs-pip vs-pip-top">
                          <b>{z.id}</b>
                          <i />
                        </span>
                        <span className="vs-pip vs-pip-bot">
                          <b>{z.id}</b>
                          <i />
                        </span>
                        <span className="vs-front-label">{face.sport}</span>
                      </span>
                      <span className="vs-face vs-back">
                        <span className="vs-card-bar" />
                        <span className="vs-card-letter" aria-hidden="true">
                          {z.id}
                        </span>
                        <span className="vs-card-zone">ZONE {z.id}</span>
                        <span className="vs-card-name">{z.name}</span>
                        <span className="vs-card-blurb">{z.blurb}</span>
                        <span className="vs-card-facts">{facts}</span>
                        <span className="vs-card-list">{highlights.join(' · ')}</span>
                        <span className="vs-card-cta">
                          <span className="vs-cta-more">EXPLORE </span>ZONE {z.id} →
                        </span>
                      </span>
                    </span>
                  </a>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
```

#### `src/components/home/VenueScene.jsx`
```jsx
'use client';
// The Yashobhoomi venue backdrop for the Home journey: a local 360° panorama rotated
// continuously, or else the official virtual tour embedded live (see src/lib/venue.js); on
// phones and tablets, a photo of the venue.
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import { VENUE_PANORAMA, VENUE_TOUR_URL } from '@/lib/venue';
import { isLite } from '@/lib/device';

export default function VenueScene({ active }) {
  // Mount once the journey gets close, then keep it (no reloading the tour on scroll back).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  const pano = VENUE_PANORAMA ? withBase(VENUE_PANORAMA) : '';
  // Phones and tablets show a photo of the venue, slowly drifting, instead of the live 3D tour.
  const mode = !mounted ? null : pano ? 'pano' : isLite() ? 'photo' : 'tour';

  return (
    <div className="vs-scene" aria-hidden="true">
      {mode === 'pano' ? <div className="vs-pano" style={{ backgroundImage: `url("${pano}")` }} /> : null}
      {mode === 'photo' ? <div className="vs-photo" style={{ backgroundImage: `url("${withBase('/media/yasho-exterior.webp')}")` }} /> : null}
      {mode === 'tour' ? (
        <iframe
          className="vs-tour"
          src={VENUE_TOUR_URL}
          title="Yashobhoomi virtual tour"
          tabIndex={-1}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : null}
    </div>
  );
}
```

#### `src/components/home/venue-stage.css`
```css
/* Each `inset` is preceded by top/right/bottom/left for older browsers (Chrome before 87). */
/* Home journey finale: venue scene and the four zone cards. */
.vs-root {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
}

/* Venue backdrop */
.vs-venue {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  pointer-events: none;
}
.vs-scene {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  overflow: hidden;
  background: #0e0e0f;
}
.vs-pano {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background-repeat: repeat-x;
  background-size: auto 100%;
  transform: scale(1.06);
  /* An equirectangular image is twice as wide as it is tall: one loop = one full turn. */
  animation: vsPan 140s linear infinite;
}
@keyframes vsPan {
  from {
    background-position: 0 50%;
  }
  to {
    background-position: calc(-2 * (100vh - 60px)) 50%;
  }
}
.vs-photo {
  position: absolute;
  top: -4%;
  right: -4%;
  bottom: -4%;
  left: -4%;
  inset: -4%;
  background: center / cover no-repeat;
  animation: vsDrift 48s ease-in-out infinite alternate;
}
.vs-tour {
  position: absolute;
  left: -6%;
  top: -6%;
  width: 112%;
  height: 112%;
  border: 0;
  pointer-events: none;
  animation: vsDrift 48s ease-in-out infinite alternate;
}
@keyframes vsDrift {
  from {
    transform: scale(1.02) translateX(-2%);
  }
  to {
    transform: scale(1.1) translateX(2%);
  }
}
.vs-scrim {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(14, 14, 15, 0.7) 0%, rgba(14, 14, 15, 0.2) 34%, rgba(14, 14, 15, 0.25) 62%, rgba(14, 14, 15, 0.85) 100%),
    radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%);
}

/* Zone finale */
.vs-final {
  position: absolute;
  top: 24px;
  right: 28px;
  bottom: 24px;
  left: 220px;
  inset: 24px 28px 24px 220px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  align-content: stretch;
  gap: 28px;
  color: #fff;
}
.vs-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.vs-kicker {
  font: 500 12px 'JetBrains Mono', monospace;
  letter-spacing: 0.2em;
  color: #f07c12;
}
.vs-title {
  margin: 0;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: clamp(40px, 5vw, 76px);
  line-height: 0.86;
  letter-spacing: 0.005em;
}
.vs-title span {
  color: #f07c12;
}
.vs-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-self: center;
  gap: 18px;
  perspective: 1400px;
}

/* Each card is dealt like a playing card (sport photo up), then turned over to its zone side. */
.vs-card {
  position: relative;
  display: block;
  min-height: min(330px, 46vh);
  color: #fff;
  text-decoration: none;
  opacity: 0;
  /* Dealt from a deck below the middle of the screen. */
  transform: translate(calc((1.5 - var(--i)) * 105%), 70vh) rotate(calc((var(--i) - 1.5) * 18deg)) scale(0.7);
  pointer-events: none;
  transition:
    opacity 0.45s ease,
    transform 0.95s cubic-bezier(0.18, 0.9, 0.25, 1.08);
}
.vs-card.is-in {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.vs-card-inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  display: block;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.3, 0.9, 0.3, 1.05);
}
.vs-card.is-flipped .vs-card-inner {
  transform: rotateY(180deg);
}
.vs-card.is-flipped.is-in:hover .vs-card-inner,
.vs-card.is-flipped.is-hover .vs-card-inner {
  transform: rotateY(180deg) translateY(-6px);
}
.vs-face {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  border-radius: 14px;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Photo side: a playing card with the zone letter in two corners. */
.vs-front {
  background: #0e0e0f;
  border: 6px solid #fff;
  box-shadow: 0 30px 60px -28px rgba(0, 0, 0, 0.9);
}
.vs-front-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background: center / cover no-repeat;
  transform: scale(1.06);
}
.vs-front::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background: linear-gradient(180deg, rgba(14, 14, 15, 0.1) 40%, rgba(14, 14, 15, 0.75));
}
.vs-pip {
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 7px;
  background: #fff;
  border-radius: 8px;
  color: var(--zone);
}
.vs-pip b {
  font: 900 26px/0.9 'Archivo', sans-serif;
  font-stretch: 62%;
}
.vs-pip i {
  width: 12px;
  height: 12px;
  background: var(--zone);
  transform: rotate(45deg);
}
.vs-pip-top {
  left: 8px;
  top: 8px;
}
.vs-pip-bot {
  right: 8px;
  bottom: 8px;
  transform: rotate(180deg);
}
.vs-front-label {
  position: absolute;
  z-index: 1;
  left: 14px;
  bottom: 14px;
  font: 500 11px 'JetBrains Mono', monospace;
  letter-spacing: 0.2em;
  color: #fff;
}

/* Zone side: see-through glass over the venue, text kept crisp and readable. */
.vs-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px 22px 20px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05));
  background-color: rgba(14, 14, 15, 0.38);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  backdrop-filter: blur(14px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 30px 60px -30px rgba(0, 0, 0, 0.9);
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.55);
}
.vs-card:focus-visible {
  outline: none;
}
.vs-card:focus-visible .vs-face {
  outline: 2px solid #f07c12;
  outline-offset: 3px;
}
.vs-card-bar {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 6px;
  background: var(--zone);
  box-shadow: 0 0 18px var(--zone);
  transition: height 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.vs-card.is-in:hover .vs-card-bar,
.vs-card.is-hover .vs-card-bar {
  height: 10px;
}
.vs-card-letter {
  position: absolute;
  right: 14px;
  top: 4px;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: 120px;
  line-height: 1;
  color: #fff;
  opacity: 0.12;
  pointer-events: none;
}
.vs-card-zone {
  margin-top: 4px;
  font: 500 11px 'JetBrains Mono', monospace;
  letter-spacing: 0.18em;
  color: #fff;
  opacity: 0.85;
}
.vs-card-zone::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  background: var(--zone);
  box-shadow: 0 0 8px var(--zone);
}
.vs-card-name {
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 800;
  font-size: clamp(20px, 1.7vw, 26px);
  line-height: 0.95;
  text-transform: uppercase;
}
.vs-card-blurb {
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.92);
}
.vs-card-facts {
  font: 500 11px 'JetBrains Mono', monospace;
  letter-spacing: 0.08em;
  color: #ffd2a6;
}
.vs-card-list {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}
.vs-card-cta {
  margin-top: auto;
  padding-top: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #fff;
}
.vs-card.is-in:hover .vs-card-cta {
  color: #f07c12;
}

@media (max-height: 820px) {
  .vs-card-list {
    display: none;
  }
}
@media (max-width: 900px) {
  /* Phones: the heading on one line, the four cards filling exactly the space left below it. */
  .vs-final {
    top: 58px;
    right: 14px;
    bottom: calc(14px + env(safe-area-inset-bottom, 0px));
    left: 14px;
    inset: 58px 14px calc(14px + env(safe-area-inset-bottom, 0px));
    gap: 12px;
    grid-template-rows: auto minmax(0, 1fr);
  }
  .vs-kicker {
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .vs-kicker-more {
    display: none;
  }
  .vs-title {
    font-size: clamp(28px, 9vw, 40px);
    white-space: nowrap;
  }
  .vs-cards {
    align-self: stretch;
    height: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(0, 1fr);
    gap: 10px;
  }
  .vs-card {
    min-height: 0;
    height: 100%;
  }
  .vs-face {
    border-radius: 12px;
  }
  .vs-front {
    border-width: 4px;
  }
  .vs-back {
    gap: 4px;
    padding: 14px 12px 12px;
  }
  .vs-card-letter {
    display: none;
  }
  .vs-card-zone {
    font-size: 10px;
  }
  .vs-card-name {
    font-size: clamp(13px, 3.9vw, 18px);
    line-height: 1.02;
    hyphens: manual;
    overflow-wrap: normal;
    word-break: normal;
  }
  .vs-card-facts {
    display: block;
    font-size: 9px;
    letter-spacing: 0.04em;
  }
  .vs-card-blurb,
  .vs-card-list {
    display: none;
  }
  .vs-card-cta {
    font-size: 10px;
    white-space: nowrap;
  }
  .vs-cta-more {
    display: none;
  }
  .vs-pip {
    padding: 4px 5px;
    border-radius: 6px;
  }
  .vs-pip b {
    font-size: 16px;
  }
  .vs-pip i {
    width: 7px;
    height: 7px;
  }
  .vs-front-label {
    font-size: 9px;
    left: 10px;
    bottom: 10px;
  }
  /* Bucky steps aside while the cards are up. */
  html.vs-cards-on #bucky-bot {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
}
/* Phones held sideways: one row of four. */
@media (max-width: 900px) and (orientation: landscape) {
  .vs-cards {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .vs-card-name {
    font-size: clamp(12px, 1.9vw, 16px);
  }
  .vs-card-facts {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vs-pano,
  .vs-photo,
  .vs-tour {
    animation: none;
  }
  .vs-card,
  .vs-card-inner {
    transition: none;
  }
}

/* The journey's side navigation would sit on top of the cards on phones. */
@media (max-width: 900px) {
  nav[aria-label='Journey'] {
    display: none !important;
  }
}

/* Phones and tablets: a live blur over the drifting venue photo is redrawn every frame, so the
   zone side uses a deeper tint instead. Still see-through, text just as readable. */
html.lite .vs-back {
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
  background-color: rgba(14, 14, 15, 0.6);
}
```
