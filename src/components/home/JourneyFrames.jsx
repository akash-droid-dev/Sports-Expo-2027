'use client';
// The Earth journey for phones, tablets and older browsers: pre-rendered still frames of the
// live globe (scripts/journey/render-frames.mjs, public/journey) instead of a WebGL map.
// The live globe ran at 2-6 frames a second on real phones; here each scroll frame only
// moves and fades two images on the GPU. The camera follows the same path as the live one
// (src/data/journey.json): the frame either side of the current position is zoomed to the
// current zoom level, shifted to the current centre and crossfaded.
import { useEffect, useRef } from 'react';
import { withBase } from '@/lib/base';
import { isLite, noGpu } from '@/lib/device';
import { camAt } from '@/lib/journey-camera.mjs';
import { trackElement } from '@/lib/geo';
import { scrollTop, viewH } from '@/lib/viewport';
import J from '@/data/journey.json';
import M from '@/data/journey-frames.json';

const K = J.keyframes;
const F = M.frames;
const LAST = F[F.length - 1].p;
// Frames kept loaded either side of the current one.
const AHEAD = 3;

const mercX = (lon) => (lon + 180) / 360;
const mercY = (lat) => { const s = Math.sin((lat * Math.PI) / 180); return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI); };

// Phones, tablets, computers without hardware 3D and browsers too old for the map's worker code
// (src/app/layout.tsx marks them).
export function framesMode() {
  return typeof document !== 'undefined' && (isLite() || noGpu() || document.documentElement.classList.contains('legacy'));
}

export default function JourneyFrames({ getP, opacity, off }) {
  const box = useRef(null);
  useEffect(() => {
    if (off || !framesMode() || !box.current) return;
    const el = box.current;
    const vw0 = innerWidth, vh0 = innerHeight;
    // Phone frames for small screens, larger tablet frames otherwise.
    const set = (Math.min(vw0, vh0) < 600 && M.sets.p) || !M.sets.t ? 'p' : 't';
    const { width: W, height: H } = M.sets[set];
    const url = (i) => withBase(`/journey/${set}-${String(i).padStart(2, '0')}.webp`);

    // Two on-screen slots; frames are loaded and decoded ahead of time by Image objects.
    const slots = [0, 1].map(() => {
      const img = document.createElement('img');
      img.alt = ''; img.decoding = 'async'; img.draggable = false;
      img.style.cssText = `position:absolute;left:50%;top:50%;width:${W}px;height:${H}px;margin:${-H / 2}px 0 0 ${-W / 2}px;max-width:none;opacity:0;will-change:transform,opacity;transform-origin:50% 50%;pointer-events:none;user-select:none`;
      el.appendChild(img);
      return { img, frame: -1 };
    });
    const cache = new Map(); // frame index -> { im, ready }
    const want = (i) => {
      if (i < 0 || i >= F.length || cache.has(i)) return;
      const im = new Image(); const c = { im, ready: false };
      im.decoding = 'async'; im.src = url(i);
      (im.decode ? im.decode() : new Promise((r, j) => { im.onload = r; im.onerror = j; }))
        .then(() => { c.ready = true; kick(); }, () => {});
      cache.set(i, c);
    };
    const keep = (k) => {
      for (let i = k - 1; i <= k + AHEAD; i++) want(i);
      // Let go of frames far behind or ahead, so a long scroll doesn't pile up decoded images.
      for (const [i, c] of cache) if (i < k - AHEAD - 2 || i > k + AHEAD + 3) { c.im.src = ''; cache.delete(i); }
    };
    const ready = (i) => { const c = cache.get(i); return !!(c && c.ready); };

    // The box's size, kept up to date by an observer: reading clientWidth in the frame loop
    // made the browser lay the page out again after the journey text had just changed.
    const box_ = { w: el.clientWidth, h: el.clientHeight };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { box_.w = el.clientWidth; box_.h = el.clientHeight; kick(); }) : null;
    if (ro) ro.observe(el);
    let cur = null, target = 0, raf = 0, near = false;
    const place = (slot, i, cam, op, vw, vh) => {
      if (i < 0) { if (slot.img.style.opacity !== '0') slot.img.style.opacity = '0'; return; }
      if (slot.frame !== i) { slot.img.src = url(i); slot.frame = i; }
      const f = F[i];
      // Never show a frame smaller than the screen it has to fill.
      const fit = Math.max(1, vw / W, vh / H);
      const s = Math.pow(2, cam.z - f.z) * fit;
      // Where the frame's centre sits on screen at the current camera: flat-map maths, which is
      // close enough this near the centre. On the globe (zoomed out) the globe stays centred.
      const flat = Math.max(0, Math.min(1, (cam.z - 3) / 2));
      const ws = 512 * Math.pow(2, cam.z) * fit;
      let dx = (mercX(f.lon) - mercX(cam.lon)) * ws, dy = (mercY(f.lat) - mercY(cam.lat)) * ws;
      const a = (-cam.b * Math.PI) / 180;
      const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = (dx * Math.sin(a) + dy * Math.cos(a)) * Math.cos((cam.pitch * Math.PI) / 180);
      slot.img.style.transform = `translate3d(${(rx * flat).toFixed(1)}px,${(ry * flat).toFixed(1)}px,0) scale(${s.toFixed(4)})`;
      slot.img.style.opacity = op.toFixed(3);
    };
    const draw = (p) => {
      const q = Math.min(p, LAST);
      let k = 0; while (k < F.length - 2 && q > F[k + 1].p) k++;
      keep(k);
      const vw = box_.w || vw0, vh = box_.h || vh0;
      const cam = camAt(K, q);
      const t = Math.max(0, Math.min(1, (q - F[k].p) / (F[k + 1].p - F[k].p)));
      // Base frame: this one, or the nearest loaded one before it while it is still on its way.
      let a = k; while (a > 0 && !ready(a)) a--;
      if (!ready(a)) { a = k + 1; if (!ready(a)) a = -1; }
      const b = a === k && ready(k + 1) ? k + 1 : -1;
      place(slots[0], a, cam, 1, vw, vh);
      place(slots[1], b, cam, b < 0 ? 0 : t, vw, vh);
    };
    // Ease toward the scroll position like the live camera, so flicks become one glide.
    const step = () => {
      raf = 0;
      const d = target - (cur ?? target);
      cur = Math.abs(d) < 0.0003 ? target : (cur ?? target) + d * 0.2;
      draw(cur);
      if (cur !== target) raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!raf && near) raf = requestAnimationFrame(step); };
    // The section's position is measured when the layout changes, not on every scroll event.
    const geo = trackElement(el.closest('section'), () => onScroll());
    const onScroll = () => {
      const vh = viewH(), top = geo.g.top - scrollTop(), bottom = top + geo.g.height;
      const n = top < vh * 3 && bottom > -vh;
      if (!n) {
        if (near) {
          // Well away from the journey: drop the frames and keep only the first one ready.
          near = false; cur = null;
          for (const [i, c] of cache) if (i > 1) { c.im.src = ''; cache.delete(i); }
          slots.forEach((s) => { s.img.style.opacity = '0'; s.img.removeAttribute('src'); s.frame = -1; });
        }
        return;
      }
      near = true;
      target = getP();
      kick();
    };
    want(0); want(1);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    return () => {
      removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll);
      geo.stop();
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf);
      for (const c of cache.values()) c.im.src = '';
      slots.forEach((s) => s.img.remove());
    };
  }, [getP, off]);
  return <div ref={box} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity, transition: 'opacity .3s', contain: 'strict' }} />;
}
