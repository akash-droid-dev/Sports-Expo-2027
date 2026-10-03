---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/animation
  - pattern/interaction
  - react
status: proven
---

# Page-Turn Book

> A closed book on the page. Click → it grows to fill the screen and opens; each spread covers one zone (plan, areas, stalls, exhibitors). Next/previous turn the page in 3D; after the last zone the book closes itself and shrinks back.

**Used in:** Home "One hall. Four event zones." — the zone guide book.

## How it works

- Leaves are 3D-rotated elements with front/back faces (`backface-visibility: hidden`).
- States: closed → opening → open → turning → closing; each has a CSS class.
- Backdrop: blurred on desktop, plain dark on phones/tablets.
- Keyboard: Arrow Right/Left turn pages, Esc closes.

## Reuse it

- Any step-through content with 3–6 chapters.
- Put the content as data (zones array) and render one spread per item.

## Gotchas and lessons

- Leaf faces need an opaque background or the back page shows through.

## Related

[[Home page]] · [[ISE Motion]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/home/HallBook.jsx`
```jsx
'use client';
// Home "One hall. Four event zones." as a book. The closed book sits in the section; opening
// it brings it up large, one zone per spread (left page: the zone and its plan; right page: its
// areas, stalls and exhibitors). Next turns the page; after the last zone the book closes and
// shrinks back. Phones show one page at a time (src/app/anim.css).
import { useCallback, useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';

const TURN_MS = 800;
const OPEN_MS = 900;

function zoneFacts(D, z) {
  const cl = D.clusters.filter((c) => c.zone === z.id);
  const stalls = cl.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pav = cl.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  return { cl, stalls, pav };
}

// The zone's areas drawn from the hall layout (cluster x, y, w, h).
function ZonePlan({ cl, color }) {
  const x0 = Math.min(...cl.map((c) => c.x)), y0 = Math.min(...cl.map((c) => c.y));
  const x1 = Math.max(...cl.map((c) => c.x + c.w)), y1 = Math.max(...cl.map((c) => c.y + c.h));
  return (
    <svg className="hb-plan" viewBox={`${x0 - 8} ${y0 - 8} ${x1 - x0 + 16} ${y1 - y0 + 16}`} aria-hidden="true">
      {cl.map((c) => (
        <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={color} fillOpacity={c.kind === 'stalls' ? 0.22 : 0.4} stroke={color} strokeWidth="2" />
          <text x={c.x + 6} y={c.y + 16} fontSize="12" fontFamily="JetBrains Mono, monospace" fill="#0E0E0F">
            {c.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Page({ page, n, D }) {
  if (!page) return <div className="hb-paper hb-blank" />;
  const { z } = page;
  const { cl, stalls, pav } = zoneFacts(D, z);
  if (page.kind === 'info') {
    return (
      <div className="hb-paper" style={{ '--zone': z.color }}>
        <span className="hb-kicker">ZONE {z.id} · EXHIBITION HALL 2</span>
        <span className="hb-letter">{z.id}</span>
        <h3 className="hb-title">{z.name}</h3>
        <p className="hb-text">{z.blurb}</p>
        <div className="hb-stats">
          <span>
            <b>{cl.length}</b>areas
          </span>
          {stalls ? (
            <span>
              <b>{stalls}</b>stalls
            </span>
          ) : null}
          {pav ? (
            <span>
              <b>{pav}</b>pavilions
            </span>
          ) : null}
        </div>
        <ZonePlan cl={cl} color={z.color} />
        <span className="hb-folio">{n}</span>
      </div>
    );
  }
  return (
    <div className="hb-paper" style={{ '--zone': z.color }}>
      <span className="hb-kicker">ZONE {z.id} · AREAS AND STALLS</span>
      <ol className="hb-list">
        {cl.map((c) => {
          const ex = D.exhibitors.filter((e) => e.cluster === c.id);
          return (
            <li key={c.id}>
              <span className="hb-code">
                {z.id}-{c.id}
              </span>
              <span className="hb-area">
                <b>{c.name}</b>
                <i>{c.meta}</i>
                {ex.length ? (
                  <span className="hb-ex">
                    {ex.map((e) => (
                      <span key={e.id}>
                        {e.name} <em>{e.stall}</em>
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
      <a className="hb-go" href={withBase('/zones#zone-' + z.id.toLowerCase())}>
        EXPLORE ZONE {z.id} →
      </a>
      <span className="hb-folio">{n}</span>
    </div>
  );
}

function Cover({ small = false }) {
  return (
    <div className={'hb-cover-art' + (small ? ' is-small' : '')}>
      <BrandLogo className="hb-cover-logo" />
      <span className="hb-cover-title">
        HALL 2
        <br />
        ZONE GUIDE
      </span>
      <span className="hb-cover-sub">4 ZONES · 213 STALLS · 25 PAVILIONS</span>
      {small ? <span className="hb-cover-cta">TAP TO OPEN</span> : null}
    </div>
  );
}

export default function HallBook() {
  const D = typeof window !== 'undefined' ? window.ISE : null;
  const pages = D ? D.zones.flatMap((z) => [{ kind: 'info', z }, { kind: 'list', z }]) : [];
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('closed'); // opening | open | turn-next | turn-prev | closing
  const [view, setView] = useState(0);
  const [single, setSingle] = useState(false);
  const [bounce, setBounce] = useState(false);
  const nextRef = useRef(null);
  const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const per = single ? 1 : 2;
  const views = Math.ceil(pages.length / per);
  const wait = (ms) => (reduced ? 0 : ms);

  const close = useCallback(() => {
    setPhase('closing');
    setTimeout(() => {
      setOpen(false);
      setPhase('closed');
      setView(0);
      setBounce(true);
      setTimeout(() => setBounce(false), 700);
    }, wait(OPEN_MS + 250));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    setSingle(innerWidth < 760);
    setView(0);
    setOpen(true);
    setPhase('opening');
    setTimeout(() => setPhase('open'), wait(OPEN_MS + 120));
  };
  const next = () => {
    if (phase !== 'open') return;
    if (view >= views - 1) return close();
    setPhase('turn-next');
    setTimeout(() => {
      setView((v) => v + 1);
      setPhase('open');
    }, wait(TURN_MS));
  };
  const prev = () => {
    if (phase !== 'open' || view === 0) return;
    setPhase('turn-prev');
    setTimeout(() => {
      setView((v) => v - 1);
      setPhase('open');
    }, wait(single ? 300 : TURN_MS));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nextRef.current && nextRef.current.click();
    };
    addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);
  useEffect(() => {
    if (phase === 'open' && nextRef.current) nextRef.current.focus({ preventScroll: true });
  }, [phase]);

  if (!D) return null;
  const at = (i) => pages[i] || null;
  const page = (i) => <Page page={at(i)} n={i + 1} D={D} />;
  const turningNext = phase === 'turn-next';
  const turningPrev = phase === 'turn-prev';

  // What lies under a turning leaf, and on its two sides.
  let left, right, leaf = null;
  if (!single) {
    const L = view * 2, R = L + 1;
    left = turningPrev ? page(L - 2) : page(L);
    right = turningNext ? page(R + 2) : page(R);
    if (turningNext) leaf = { side: 'right', front: page(R), back: page(R + 1) };
    if (turningPrev) leaf = { side: 'left', front: page(L), back: page(L - 1) };
  } else {
    right = turningNext ? page(view + 1) : page(view);
    if (turningNext) leaf = { side: 'right', front: page(view), back: <div className="hb-paper hb-blank" /> };
  }
  const zone = at(single ? view : view * 2)?.z;

  return (
    <div data-anim="" className="hb">
      <button type="button" className={'hb-closed' + (bounce ? ' is-bounce' : '') + (open ? ' is-away' : '')} onClick={start} aria-label="Open the Hall 2 zone guide">
        <span className="hb-closed-book">
          <span className="hb-closed-pages" aria-hidden="true" />
          <span className="hb-closed-cover">
            <Cover small />
          </span>
        </span>
      </button>

      {open ? (
        <div className={'hb-modal hb-' + phase + (single ? ' is-single' : '')} role="dialog" aria-modal="true" aria-label="Hall 2 zone guide">
          <div className="hb-backdrop" onClick={close} />
          <div className="hb-big">
            <div className="hb-spread">
              {!single ? <div className="hb-page hb-left">{left}</div> : null}
              <div className="hb-page hb-right">{right}</div>
              {leaf ? (
                <div className={'hb-leaf hb-leaf-' + leaf.side}>
                  <div className="hb-leaf-face hb-leaf-front">{leaf.front}</div>
                  <div className="hb-leaf-face hb-leaf-back">{leaf.back}</div>
                </div>
              ) : null}
              {/* The front cover: it swings open over the left page, and back shut at the end. */}
              <div className="hb-cover">
                <div className="hb-cover-front">
                  <Cover />
                </div>
                <div className="hb-cover-back">{single ? <div className="hb-paper hb-blank" /> : page(view * 2)}</div>
              </div>
            </div>
            <div className="hb-controls">
              <button type="button" onClick={prev} disabled={view === 0 || phase !== 'open'}>
                ← PREV
              </button>
              <span className="hb-where">
                {zone ? <i style={{ background: zone.color }} /> : null}
                {zone ? 'ZONE ' + zone.id : ''} · {view + 1} / {views}
              </span>
              <button type="button" ref={nextRef} onClick={next} disabled={phase !== 'open'} className="hb-next">
                {view >= views - 1 ? 'CLOSE BOOK ✕' : 'NEXT →'}
              </button>
            </div>
            <button type="button" className="hb-x" onClick={close} aria-label="Close the zone guide">
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
```

#### `src/app/anim.css — Hall 2 zone guide book`
```css
/* ---------- Hall 2 zone guide book (HallBook) ---------- */
.hb {
  display: flex;
  justify-content: center;
}
/* The closed book in the section. */
.hb-closed {
  border: 0;
  background: none;
  padding: 0 0 0 24px;
  cursor: pointer;
  perspective: 1400px;
  transition:
    opacity 0.35s ease,
    transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hb-closed.is-away {
  opacity: 0;
  transform: scale(0.92);
}
.hb-closed.is-bounce {
  animation: hbBounce 0.7s cubic-bezier(0.3, 1.6, 0.5, 1);
}
@keyframes hbBounce {
  0% {
    transform: scale(0.7);
  }
  100% {
    transform: none;
  }
}
.hb-closed-book {
  position: relative;
  display: block;
  width: min(340px, 78vw);
  aspect-ratio: 3 / 4;
  min-height: 300px;
  transform-style: preserve-3d;
  transform: rotateY(-22deg) rotateX(6deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hb-closed:hover .hb-closed-book,
.hb-closed:focus-visible .hb-closed-book {
  transform: rotateY(-8deg) rotateX(2deg) translateY(-6px);
}
/* Page edges, seen past the cover. */
.hb-closed-pages {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 4px;
  right: -14px;
  background: repeating-linear-gradient(90deg, #f6f4ef 0 2px, #e3e0d8 2px 3px);
  border-radius: 0 6px 6px 0;
  transform: translateZ(-16px);
  box-shadow: 30px 40px 60px -30px rgba(14, 14, 15, 0.6);
}
.hb-closed-cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  transform-origin: 0 50%;
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hb-closed:hover .hb-closed-cover {
  transform: rotateY(-24deg);
}
.hb-cover-art {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 24px 24px 34px;
  box-sizing: border-box;
  border-radius: 4px 10px 10px 4px;
  color: #fff;
  text-align: left;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0, rgba(255, 255, 255, 0.08) 10px, rgba(0, 0, 0, 0) 22px),
    radial-gradient(ellipse at 80% 0%, rgba(240, 124, 18, 0.35), transparent 60%),
    #0e0e0f;
  box-shadow: inset 0 0 0 1px #2a2a2d;
}
.hb-cover-logo {
  --logo-h: clamp(64px, 7vw, 96px);
}
.hb-cover-title {
  margin-top: auto;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 0.86;
}
.hb-cover-sub {
  font: 500 11px 'JetBrains Mono', monospace;
  letter-spacing: 0.14em;
  color: #bdb9b0;
}
.hb-cover-cta {
  align-self: flex-start;
  font: 700 12px 'Instrument Sans', sans-serif;
  letter-spacing: 0.12em;
  background: #f07c12;
  color: #0e0e0f;
  padding: 10px 14px;
  animation: hbPulse 1.8s ease-in-out infinite;
}
@keyframes hbPulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(240, 124, 18, 0.6);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(240, 124, 18, 0);
  }
}

/* The open book. */
.hb-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: 9500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hb-backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background: rgba(14, 14, 15, 0.78);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  animation: hbFade 0.4s ease both;
}
.hb-closing .hb-backdrop {
  animation: hbFadeOut 0.5s ease 0.75s both;
}
@keyframes hbFade {
  from {
    opacity: 0;
  }
}
@keyframes hbFadeOut {
  to {
    opacity: 0;
  }
}
.hb-big {
  --bw: min(1120px, 94vw);
  --bh: min(680px, 84vh);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: hbGrow 0.55s cubic-bezier(0.2, 0.8, 0.25, 1) both;
}
@keyframes hbGrow {
  from {
    opacity: 0;
    transform: scale(0.35) translateY(30vh);
  }
}
.hb-closing .hb-big {
  animation: hbShrink 0.5s cubic-bezier(0.5, 0, 0.7, 0.4) 0.85s both;
}
@keyframes hbShrink {
  to {
    opacity: 0;
    transform: scale(0.3) translateY(30vh);
  }
}
.hb-spread {
  position: relative;
  width: var(--bw);
  height: var(--bh);
  display: grid;
  grid-template-columns: 1fr 1fr;
  perspective: 2400px;
  transition: transform 0.9s cubic-bezier(0.3, 0.8, 0.3, 1);
}
.is-single .hb-spread {
  --bw: min(460px, 92vw);
  grid-template-columns: 1fr;
}
/* While shut, the book is centred on its cover (the right half). */
.hb-opening .hb-spread {
  animation: hbCentre 0.9s cubic-bezier(0.3, 0.8, 0.3, 1) 0.35s both;
}
.hb-closing .hb-spread {
  animation: hbCentre 0.8s cubic-bezier(0.5, 0, 0.3, 1) reverse both;
}
.is-single .hb-spread {
  animation: none !important;
}
@keyframes hbCentre {
  from {
    transform: translateX(-25%);
  }
  to {
    transform: none;
  }
}
.hb-page {
  position: relative;
  overflow: hidden;
  background: #fbfaf7;
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.8);
}
.hb-left {
  border-radius: 8px 0 0 8px;
  background: linear-gradient(270deg, rgba(14, 14, 15, 0.12), rgba(14, 14, 15, 0) 26px), #fbfaf7;
}
.hb-right {
  border-radius: 0 8px 8px 0;
  background: linear-gradient(90deg, rgba(14, 14, 15, 0.12), rgba(14, 14, 15, 0) 26px), #fbfaf7;
}
.is-single .hb-right {
  border-radius: 8px;
}
.hb-opening .hb-left {
  visibility: hidden;
}
.hb-closing .hb-left {
  animation: hbHide 0s linear 0.8s both;
}
@keyframes hbHide {
  to {
    visibility: hidden;
  }
}

/* A turning page: front = the page being turned, back = the page that lands on the other side. */
.hb-leaf {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  transform-style: preserve-3d;
  z-index: 3;
}
.is-single .hb-leaf {
  width: 100%;
}
.hb-leaf-right {
  left: 50%;
  transform-origin: 0 50%;
  animation: hbTurnNext 0.8s cubic-bezier(0.45, 0.05, 0.3, 1) both;
}
.is-single .hb-leaf-right {
  left: 0;
}
.hb-leaf-left {
  left: 0;
  transform-origin: 100% 50%;
  animation: hbTurnPrev 0.8s cubic-bezier(0.45, 0.05, 0.3, 1) both;
}
@keyframes hbTurnNext {
  to {
    transform: rotateY(-180deg);
  }
}
@keyframes hbTurnPrev {
  to {
    transform: rotateY(180deg);
  }
}
.hb-leaf-face {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  overflow: hidden;
  background: #fbfaf7;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.hb-leaf-back {
  transform: rotateY(180deg);
}
.hb-leaf-front::after,
.hb-leaf-back::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(14, 14, 15, 0.18), rgba(14, 14, 15, 0) 30%);
  animation: hbShade 0.8s ease both;
}
@keyframes hbShade {
  50% {
    opacity: 1;
  }
  from,
  to {
    opacity: 0.2;
  }
}
.is-single .hb-turn-prev .hb-right,
.is-single.hb-turn-prev .hb-right {
  animation: hbFade 0.3s ease both;
}

/* The front cover: shut over the right page, swings over to the left when opened. */
.hb-cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 50%;
  transform-style: preserve-3d;
  transform-origin: 0 50%;
  transform: rotateY(-180deg);
  visibility: hidden;
  z-index: 4;
}
.is-single .hb-cover {
  left: 0;
  width: 100%;
}
.hb-opening .hb-cover {
  visibility: visible;
  animation: hbCoverOpen 0.95s cubic-bezier(0.45, 0.05, 0.3, 1) 0.35s both;
}
.hb-closing .hb-cover {
  visibility: visible;
  animation: hbCoverOpen 0.8s cubic-bezier(0.45, 0.05, 0.3, 1) reverse both;
}
@keyframes hbCoverOpen {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(-180deg);
  }
}
.is-single.hb-opening .hb-cover {
  animation-name: hbCoverOpenSingle;
}
.is-single.hb-closing .hb-cover {
  animation-name: hbCoverOpenSingle;
}
@keyframes hbCoverOpenSingle {
  from {
    transform: rotateY(0deg);
    opacity: 1;
  }
  to {
    transform: rotateY(-180deg);
    opacity: 0;
  }
}
.hb-cover-front,
.hb-cover-back {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.hb-cover-front .hb-cover-art {
  border-radius: 0 10px 10px 0;
}
.hb-cover-back {
  transform: rotateY(180deg);
  background: #fbfaf7;
  overflow: hidden;
}

/* Page content. */
.hb-paper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px 34px 38px;
  overflow-y: auto;
  color: #0e0e0f;
  box-sizing: border-box;
}
.hb-blank {
  background: #fbfaf7;
}
.hb-kicker {
  font: 500 11px 'JetBrains Mono', monospace;
  letter-spacing: 0.18em;
  color: var(--zone);
}
.hb-letter {
  position: absolute;
  right: 26px;
  top: 6px;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: 150px;
  line-height: 1;
  color: var(--zone);
  opacity: 0.12;
}
.hb-title {
  margin: 6px 0 0;
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: clamp(32px, 3.4vw, 48px);
  line-height: 0.9;
  text-transform: uppercase;
  max-width: 85%;
}
.hb-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #3a3a3e;
}
.hb-stats {
  display: flex;
  gap: 22px;
  padding: 10px 0;
  border-top: 1px solid #e3e0d8;
  border-bottom: 1px solid #e3e0d8;
}
.hb-stats span {
  display: flex;
  flex-direction: column;
  font: 500 10px 'JetBrains Mono', monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b6a66;
}
.hb-stats b {
  font-family: 'Archivo', sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  font-size: 36px;
  line-height: 1;
  color: var(--zone);
  letter-spacing: 0;
}
.hb-plan {
  width: 100%;
  flex: 1;
  min-height: 140px;
  margin-top: 6px;
}
.hb-list {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.hb-list li {
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #e3e0d8;
}
.hb-code {
  font: 500 11px 'JetBrains Mono', monospace;
  color: var(--zone);
  padding-top: 3px;
}
.hb-area {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hb-area b {
  font-size: 15px;
}
.hb-area i {
  font-style: normal;
  font-size: 12px;
  color: #6b6a66;
}
.hb-ex {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-top: 4px;
  font-size: 12px;
}
.hb-ex em {
  font-style: normal;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #c2610b;
}
.hb-go {
  margin-top: auto;
  padding-top: 12px;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--zone);
  text-decoration: none;
}
.hb-folio {
  position: absolute;
  bottom: 12px;
  right: 18px;
  font: 500 10px 'JetBrains Mono', monospace;
  color: #8a877f;
}
.hb-left .hb-folio {
  right: auto;
  left: 18px;
}

.hb-controls {
  display: flex;
  align-items: center;
  gap: 18px;
  color: #fff;
}
.hb-opening .hb-controls,
.hb-closing .hb-controls {
  opacity: 0;
}
.hb-controls button {
  height: 44px;
  padding: 0 18px;
  border: 1px solid #55555a;
  background: #0e0e0f;
  color: #fff;
  font: 700 12px 'Instrument Sans', sans-serif;
  letter-spacing: 0.1em;
  cursor: pointer;
}
.hb-controls button:disabled {
  opacity: 0.4;
  cursor: default;
}
.hb-controls .hb-next {
  background: #f07c12;
  border-color: #f07c12;
  color: #0e0e0f;
}
.hb-where {
  display: flex;
  align-items: center;
  gap: 8px;
  font: 500 12px 'JetBrains Mono', monospace;
  letter-spacing: 0.14em;
}
.hb-where i {
  width: 10px;
  height: 10px;
  border: 1px solid #fff;
}
.hb-x {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #55555a;
  background: #0e0e0f;
  color: #fff;
  cursor: pointer;
  z-index: 6;
}
@media (max-width: 760px) {
  .hb-big {
    --bh: min(620px, 78vh);
  }
  .hb-paper {
    padding: 22px 20px 30px;
  }
  .hb-letter {
    font-size: 110px;
  }
  .hb-x {
    top: -14px;
    right: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hb-big,
  .hb-spread,
  .hb-leaf,
  .hb-cover,
  .hb-backdrop,
  .hb-closed-book,
  .hb-cover-cta {
    animation: none !important;
    transition: none !important;
  }
}
```
