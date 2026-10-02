'use client';
// Fits the hero 3D scene: the iframe renders at a fixed 1440×900 frame; this scales and offsets it so the measured hand + globe sit centred in the hero's right area.
if (typeof window !== "undefined") (function () {
  const W = 1440, H = 900;
  let box = null;
  const frames = () => document.querySelectorAll('iframe[data-hero-scene]');
  function fit() {
    frames().forEach(f => {
      const host = f.parentElement; if (!host) return;
      const cw = host.clientWidth, ch = host.clientHeight; if (!cw || !ch) return;
      const b = box || { l: 0, r: W, t: 0, b: H };
      const bw = Math.max(1, b.r - b.l), bh = Math.max(1, b.b - b.t);
      const s = Math.min(cw * 0.58 / bw, ch * 0.84 / bh, 3);
      const cx = (b.l + b.r) / 2, cy = (b.t + b.b) / 2;
      f.style.transform = `translate(${cw * 0.68 - cx * s}px, ${ch / 2 - cy * s}px) scale(${s})`;
      f.style.opacity = box ? '1' : '0';
    });
  }
  const R = window.__resources; if (R && R.heroScene) { const set = () => frames().forEach(fr => { if (fr.dataset.src !== 'set') { fr.dataset.src = 'set'; fr.src = R.heroScene; } }); set(); setInterval(set, 500); }
  addEventListener('message', e => { if (e.data && e.data.heroBox) { box = e.data.heroBox; fit(); } });
  addEventListener('resize', fit);
  const iv = setInterval(() => { if (frames().length) { fit(); if (box) clearInterval(iv); } }, 300);
  window.__heroFit = () => ({ box, t: [...frames()].map(f => f.style.transform) });
})();
