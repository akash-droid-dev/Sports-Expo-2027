'use client';
// Fits the Home hero 3D scene. The iframe renders at a fixed 1440×900 frame; this scales and
// offsets it so the hand + globe sit centred in the hero's right area.
// The scene shows as soon as it starts drawing (heroReady) using a typical framing, then
// glides to the measured framing (heroBox) once the scene has measured itself.
if (typeof window !== 'undefined') (function () {
  const W = 1440, H = 900;
  // Typical extent of the hand + globe inside the 1440×900 frame, used until it is measured.
  const DEFAULT_BOX = { l: 330, r: 1110, t: 90, b: 810 };
  let box = null, ready = false;
  const frames = () => document.querySelectorAll('iframe[data-hero-scene]');
  function fit() {
    frames().forEach(f => {
      const host = f.parentElement; if (!host) return;
      const cw = host.clientWidth, ch = host.clientHeight; if (!cw || !ch) return;
      const b = box || DEFAULT_BOX;
      const bw = Math.max(1, b.r - b.l), bh = Math.max(1, b.b - b.t);
      const s = Math.min(cw * 0.58 / bw, ch * 0.84 / bh, 3);
      const cx = (b.l + b.r) / 2, cy = (b.t + b.b) / 2;
      f.style.transform = `translate(${cw * 0.68 - cx * s}px, ${ch / 2 - cy * s}px) scale(${s})`;
      f.style.opacity = ready || box ? '1' : '0';
    });
  }
  addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.heroReady) { ready = true; fit(); }
    if (e.data.heroBox) {
      box = e.data.heroBox;
      frames().forEach(f => { f.style.transition = 'opacity .6s, transform .9s cubic-bezier(.2,.7,.2,1)'; });
      fit();
    }
  });
  addEventListener('resize', fit);
  const iv = setInterval(() => { if (frames().length) { fit(); if (box) clearInterval(iv); } }, 200);
  window.__heroFit = () => ({ box, ready, t: [...frames()].map(f => f.style.transform) });
})();
