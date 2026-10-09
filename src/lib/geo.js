'use client';
// Where an element sits on the page, measured only when the layout changes (the element or the
// page resizes, the window resizes, scrolling stops) and never while scrolling. Scroll handlers
// read `top` and `height` from here instead of calling getBoundingClientRect(), which makes the
// browser lay the page out again in the middle of every scroll frame (the main cause of stutter).
export function trackElement(el, onChange) {
  const g = { top: 0, height: 0, vh: typeof innerHeight === 'number' ? innerHeight : 0 };
  let ready = false;
  const measure = () => {
    if (!el.isConnected) return;
    const top = el.getBoundingClientRect().top + scrollY, height = el.offsetHeight, vh = innerHeight;
    if (top === g.top && height === g.height && vh === g.vh) return;
    g.top = top; g.height = height; g.vh = vh;
    // `onChange` runs for later changes, not for this first measurement.
    if (ready && onChange) onChange(g);
  };
  measure();
  ready = true;
  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    // The page's own size changes whenever something above the element grows or shrinks.
    ro = new ResizeObserver(() => measure());
    ro.observe(el);
    ro.observe(document.body);
  }
  // A last check once scrolling settles catches anything the observers miss.
  let idle = 0;
  const onScroll = () => { clearTimeout(idle); idle = setTimeout(measure, 250); };
  addEventListener('resize', measure);
  addEventListener('scroll', onScroll, { passive: true });
  return {
    g,
    measure,
    stop() {
      if (ro) ro.disconnect();
      clearTimeout(idle);
      removeEventListener('resize', measure);
      removeEventListener('scroll', onScroll);
    },
  };
}
