'use client';
// Fits the Home hero 3D scene. The iframe renders at a fixed 1440×900 frame; this scales and
// offsets it so the hand + globe sit centred in the hero's right area.
// A poster (a still of the same frame) is fitted the same way and shows at once; the live
// scene fades in over it as soon as it draws (heroReady), then settles on its measured framing.
if (typeof window !== 'undefined') (function () {
  // Extent of the hand, globe and ring inside the 1440×900 frame, measured from a render.
  const DEFAULT_BOX = { l: 750, r: 1130, t: 160, b: 710 };
  let box = null, ready = false, onScreen = true;
  const sendPause = () => frames().forEach(f => f.contentWindow && f.contentWindow.postMessage({ heroPause: !onScreen }, '*'));
  const frames = () => document.querySelectorAll('iframe[data-hero-scene]');
  const posters = () => document.querySelectorAll('img[data-hero-poster]');
  function transformFor(host) {
    const cw = host.clientWidth, ch = host.clientHeight; if (!cw || !ch) return null;
    const b = box || DEFAULT_BOX;
    const bw = Math.max(1, b.r - b.l), bh = Math.max(1, b.b - b.t);
    const s = Math.min(cw * 0.58 / bw, ch * 0.84 / bh, 3);
    const cx = (b.l + b.r) / 2, cy = (b.t + b.b) / 2;
    return `translate(${cw * 0.68 - cx * s}px, ${ch / 2 - cy * s}px) scale(${s})`;
  }
  function fit() {
    frames().forEach(f => {
      const t = f.parentElement && transformFor(f.parentElement); if (!t) return;
      f.style.transform = t;
      f.style.opacity = ready || box ? '1' : '0';
    });
    posters().forEach(p => {
      // The poster keeps the typical framing so it lines up with the scene's first frame.
      const host = p.parentElement; if (!host) return;
      const saved = box; box = null; const t = transformFor(host); box = saved;
      if (!t) return;
      p.style.transform = t;
      p.style.opacity = ready ? '0' : '1';
      if (ready) p.style.transitionDelay = '.6s';
    });
  }
  addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.heroReady) { ready = true; fit(); sendPause(); }
    if (e.data.heroBox) {
      box = e.data.heroBox;
      frames().forEach(f => { f.style.transition = 'opacity .8s, transform .9s cubic-bezier(.2,.7,.2,1)'; });
      fit();
    }
  });
  addEventListener('resize', fit);
  // Pause the 3D scene while the hero is off screen.
  if ('IntersectionObserver' in window) {
    const watched = new WeakSet();
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      onScreen = en.isIntersecting;
      sendPause();
    }));
    setInterval(() => frames().forEach(f => {
      const host = f.parentElement;
      if (host && !watched.has(host)) { watched.add(host); io.observe(host); }
    }), 500);
  }
  // Fit as soon as the hero renders, then keep checking until the scene has measured itself.
  // Phones and tablets have no live scene (src/lib/device.js): fit the still once it renders.
  const iv = setInterval(() => { if (frames().length || posters().length) { fit(); if (box || !frames().length) clearInterval(iv); } }, 50);
  window.__heroFit = () => ({ box, ready, t: [...frames()].map(f => f.style.transform) });
})();
