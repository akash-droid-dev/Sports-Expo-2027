---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/scroll
  - pattern/3d
  - maps
  - performance
status: proven
---

# Scroll-Driven Globe Journey

> A tall pinned section; scroll progress drives a MapLibre GL globe (satellite tiles) through keyframed camera positions, with titles and a progress rail.

**Used in:** Home "02 Earth journey": Earth → Asia → India → New Delhi → Dwarka → Yashobhoomi → Hall 2 → four zones.

## How it works

- Progress `p` lives in a tiny external store; only `HomeJourney` re-renders on scroll (`useSyncExternalStore`), not the whole page.
- The camera eases toward the scroll position each frame (`cur + (target - cur) * 0.18`) for a gliding feel.
- The camera is only touched when `p` changed — otherwise every scroll frame redraws the globe for nothing (tablets went from 10–17 stutters to 0–1 after this fix).
- Phones/tablets: lower resolution (`pixelRatio: 1`), small tile cache, no raster fade; the map is created when the journey is near and freed when far away — both during a pause in scrolling, never mid-scroll.
- Browsers without class static blocks (old iOS/Android) skip the map.

## Reuse it

- Keyframes `{p, lon, lat, z, pitch, b}`; smoothstep between them.
- Keep the map out of React state.

## Gotchas and lessons

- `map.remove()` / `new Map()` stall the main thread ~0.5–0.9 s on mobile; schedule them in scroll pauses.

## Related

[[Playing Card Flip Finale]] · [[Home page]] · [[Playbook - Mobile and Tablet Performance Audit]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/home/HomeJourney.jsx`
```jsx
'use client';
// The Home "Earth journey": a scroll-driven globe zoom from Earth to Yashobhoomi, then the
// venue finale. Split out of Home.jsx so scrolling re-renders only this section.
// `store` holds the scroll progress; `vals(p)` (Home's logic) turns it into what to show.
import { Fragment, useSyncExternalStore } from 'react';
import { txt, sx, list } from '@/dc/runtime';
import VenueStage from './VenueStage';

export default function HomeJourney({ store, vals }) {
  useSyncExternalStore(store.subscribe, store.get, store.get);
  const v = vals(store.p);
  return (
    <section data-screen-label="02 Earth journey" ref={v.journeyRef} style={sx(`position:relative;height:${v.journeyHeight ?? ""};background:#000;`)}>
      <div style={{ position: "sticky", top: "60px", height: "calc(100vh - 60px)", overflow: "hidden", background: "#000" }}>
        <div ref={v.mapRef} style={sx(`position:absolute;inset:0;opacity:${v.mapOpacity ?? ""};transition:opacity .3s;`)} />
        <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.55) 100%)" }} />
        <div style={sx(`position:absolute;inset:0;background:#000;opacity:${v.arrivalScrim ?? ""};pointer-events:none;`)} />
        {v.showPin ? (
          <>
            <div style={sx(`position:absolute;left:50%;top:50%;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:none;opacity:${v.pinOpacity ?? ""};`)}>
              <span style={{ background: "#F07C12", color: "#0E0E0F", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", letterSpacing: "0.14em", padding: "6px 10px", fontWeight: "500", whiteSpace: "nowrap" }}>
                YASHOBHOOMI · IICC
              </span>
              <span style={{ width: "2px", height: "40px", background: "#F07C12" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F07C12", boxShadow: "0 0 0 6px rgba(240,124,18,0.3)" }} />
            </div>
          </>
        ) : null}
        <VenueStage p={v.journeyP} reduced={v.journeyReduced} />
        <nav aria-label="Journey" style={{ position: "absolute", left: "28px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "12px" }}>
          {list(v.crumbs).map((c, $index) => (
            <Fragment key={$index}>
              <button onClick={c?.go} style={sx(`background:none;border:0;padding:0;cursor:pointer;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;color:${c?.color ?? ""};text-align:left;`)}>
                <span style={sx(`width:${c?.bar ?? ""};height:2px;background:${c?.color ?? ""};transition:width .4s;`)} />
                {txt(c?.label)}
              </button>
            </Fragment>
          ))}
        </nav>
        <div style={sx(`position:absolute;left:28px;bottom:32px;max-width:640px;color:${v.captionColor ?? ""};pointer-events:none;opacity:${v.captionOpacity ?? ""};`)}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", letterSpacing: "0.2em", opacity: "0.8", marginBottom: "10px" }}>
            {txt(v.stageKicker)}
          </div>
          <div style={{ fontFamily: "'Archivo',sans-serif", fontStretch: "62%", fontWeight: "900", fontSize: "clamp(38px,8vw,128px)", lineHeight: "0.84" }}>
            {txt(v.stageTitle)}
          </div>
          <div style={{ fontSize: "17px", lineHeight: "1.45", marginTop: "14px", maxWidth: "520px", opacity: "0.9" }}>{txt(v.stageText)}</div>
        </div>
        <div style={sx(`position:absolute;right:28px;bottom:32px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;color:${v.captionColor ?? ""};opacity:${(v.readoutOpacity ?? 1) * 0.7};text-align:right;line-height:1.7;pointer-events:none;`)}>
          <div>{txt(v.coordText)}</div>
          <div>{"ALT "}{txt(v.altText)}</div>
          <div>IMAGERY: ESRI WORLD IMAGERY</div>
        </div>
        <button onClick={v.skip} style={{ position: "absolute", right: "28px", top: "24px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid #55555A", height: "36px", padding: "0 14px", font: "600 12px 'Instrument Sans'", letterSpacing: "0.1em", cursor: "pointer" }}>
          SKIP INTRO →
        </button>
      </div>
    </section>
  );
}
```

#### `src/screens/Home.jsx — excerpt`
```jsx
  componentDidMount() {
    this.reduced = this.props.journey === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._onScroll = () => { if (this._raf) return; this._raf = requestAnimationFrame(() => { this._raf = null; this.tick(); }); };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    // Phones and tablets create the globe only near the journey and free it once scrolled well
    // away (see liteMap), so its WebGL memory isn't held for the whole page.
    this._init = setInterval(() => { if (window.maplibregl && window.ISE && this.mapRef.current) { clearInterval(this._init); this._mapReady = true; if (!isLite()) this.initMap(); else this.liteMap(); this.journeyStore.notify(); } }, 100);
  }
  componentWillUnmount() { window.removeEventListener('scroll', this._onScroll); clearInterval(this._init); clearTimeout(this._freeT); clearTimeout(this._makeT); cancelAnimationFrame(this._camRaf); this.map && this.map.remove(); this.map = null; }
  liteMap() {
    const el = this.journeyRef.current; if (!el || !this._mapReady || this.reduced) return;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    // Creating or freeing the map stalls the page for a moment, so both wait for a pause in
    // scrolling; the map is only built mid-scroll when the journey is about to come on screen.
    const soon = r.top < vh * 3 && r.bottom > -vh * 2;
    const near = r.top < vh * 1.2 && r.bottom > -vh * 0.3;
    const far = !soon;
    if (soon && !this.map) {
      clearTimeout(this._freeT);
      if (near) this.initMap();
      else {
        clearTimeout(this._makeT);
        this._makeT = setTimeout(() => this.liteMapNow(), 250);
      }
    }
    else if (far && this.map) {
      clearTimeout(this._freeT);
      this._freeT = setTimeout(() => {
        const q = el.getBoundingClientRect();
        if (!this.map || (q.top < vh * 3 && q.bottom > -vh * 2)) return;
        cancelAnimationFrame(this._camRaf); this._camRaf = null; try { this.map.remove(); } catch (e) {} this.map = null; this._cam = undefined;
      }, 700);
    }
  }
  liteMapNow() {
    const el = this.journeyRef.current; if (!el || this.map || !this._mapReady || this.reduced) return;
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    if (r.top < vh * 3 && r.bottom > -vh * 2) this.initMap();
  }
  initMap() {
    // Browsers older than iOS 16.4 can't run the map's worker code (src/app/layout.tsx marks them).
    if (this.reduced || document.documentElement.classList.contains('legacy')) return;
    try {
      this.map = new maplibregl.Map({
        container: this.mapRef.current, interactive: false, attributionControl: { compact: true },
        // Smoother globe while scrolling: keep loading tiles mid-zoom, keep more of them,
        // cap the render resolution on high-density screens and skip wrapped world copies.
        // Phones and tablets: default tile cache and a lower render resolution, to stay well inside mobile GPU memory.
        cancelPendingTileRequestsWhileZooming: false, maxTileCacheSize: isLite() ? 60 : 300, pixelRatio: isLite() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5),
        renderWorldCopies: false, fadeDuration: 0,
        style: { version: 8, projection: { type: 'globe' },
          sources: { sat: { type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: 'Esri, Maxar, Earthstar Geographics' } },
          layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#000' } }, { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-fade-duration': isLite() ? 0 : 160 } }],
          sky: { 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 8, 0] } },
        center: [55, 18], zoom: 0.9
      });
      this.map.on('load', () => { this._cam = undefined; this.tick(); });
    } catch (e) { this.map = null; }
  }
  progress() {
    const el = this.journeyRef.current; if (!el) return 0;
    const r = el.getBoundingClientRect(); const span = r.height - (window.innerHeight - 60);
    return Math.max(0, Math.min(1, (60 - r.top) / span));
  }
  // Journey progress lives in a small store so scrolling re-renders only the journey
  // (src/components/home/HomeJourney.jsx), not the whole page.
  journeyStore = (() => {
    let version = 0; const subs = new Set();
    const bump = () => { version++; subs.forEach(f => f()); };
    return {
      p: 0,
      get: () => version,
      subscribe: f => { subs.add(f); return () => subs.delete(f); },
      set(p) { if (p !== this.p && (Math.abs(p - this.p) > 0.002 || p === 0 || p === 1)) { this.p = p; bump(); } },
      notify: bump
    };
  })();
  tick() {
    if (isLite()) this.liteMap();
    const p = this.progress();
    this._target = p;
    // Only move the camera when the journey position changed: above or below the journey every
    // scroll frame would otherwise redraw the globe for nothing.
    if (this.map && !this._camRaf && this._cam !== p) this._camRaf = requestAnimationFrame(this.camStep);
    this.journeyStore.set(p);
  }
  // The globe camera eases toward the scroll position instead of jumping with every
  // scroll event, so wheel steps and touch flicks turn into one continuous glide.
  camStep = () => {
    this._camRaf = null;
    if (!this.map) return;
    const target = this._target ?? 0;
    const cur = this._cam ?? target;
    const d = target - cur;
    const next = Math.abs(d) < 0.0004 ? target : cur + d * 0.18;
    if (next === this._cam) return;
    this._cam = next;
    this.placeCamera(next);
    if (next !== target) this._camRaf = requestAnimationFrame(this.camStep);
  };
  placeCamera(p) {
    const K = this.KF; let i = 0; while (i < K.length - 2 && p > K[i + 1].p) i++;
    const a = K[i], b = K[i + 1]; let t = (p - a.p) / (b.p - a.p); t = Math.max(0, Math.min(1, t)); t = t * t * (3 - 2 * t);
    const L = (x, y) => x + (y - x) * t;
    this.map.jumpTo({ center: [L(a.lon, b.lon), L(a.lat, b.lat)], zoom: L(a.z, b.z), pitch: L(a.pitch, b.pitch), bearing: L(a.b, b.b) });
  }
  scrollToP(p) {
    const el = this.journeyRef.current; if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60; const span = el.offsetHeight - (window.innerHeight - 60);
    window.scrollTo({ top: top + span * p, behavior: this.reduced ? 'auto' : 'smooth' });
  }
```

#### `src/lib/maplibre.js`
```js
'use client';
// The design's map code uses the global `maplibregl` (it was loaded from a CDN
// script tag). Screens that show a map import this module to provide it.
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { withBase } from './base';

if (typeof window !== 'undefined') {
  // The worker can't be found next to the bundled chunk; it is served from public/vendor.
  maplibregl.setWorkerUrl(withBase('/vendor/maplibre/maplibre-gl-worker.mjs'));
  window.maplibregl = maplibregl;
}

export default maplibregl;
```
