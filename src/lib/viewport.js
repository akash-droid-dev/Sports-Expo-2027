'use client';
// The page's scroll position and the window size, read once per scroll or resize event and
// shared. Reading window.scrollY or innerHeight makes the browser bring its layout up to date
// first, so every scroll handler reading them on its own (often after another one has just
// changed styles) laid the page out several times a frame. Read these instead.
let y = 0, vh = 0, vw = 0, ready = false;
const read = () => { y = window.scrollY; vh = window.innerHeight; vw = window.innerWidth; };
function init() {
  if (ready || typeof window === 'undefined') return;
  ready = true;
  read();
  // Capture listeners on the window run before any other scroll or resize handler.
  window.addEventListener('scroll', (e) => { if (e.target === document) y = window.scrollY; }, { capture: true, passive: true });
  window.addEventListener('resize', read, { capture: true, passive: true });
}
init();

export const scrollTop = () => (init(), y);
export const viewH = () => (init(), vh);
export const viewW = () => (init(), vw);
