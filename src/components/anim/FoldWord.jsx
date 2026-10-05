'use client';
// A word whose letters rise into place one after another. `when="load"` plays after the page
// appears, `when="view"` when the word scrolls into view (src/app/anim.css).
// Each letter appears once in the page, so copying the text gives the word as written.
import { useEffect, useRef, useState } from 'react';

export default function FoldWord({ text, when = 'view', delay = 0, step = 55, className = '', style }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (when === 'load' || !('IntersectionObserver' in window)) {
      const t = setTimeout(() => setOn(true), 30);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [when]);
  return (
    <span ref={ref} data-anim="" className={'fold-word' + (on ? ' is-on' : '') + (className ? ' ' + className : '')} style={style}>
      {Array.from(text).map((ch, i) =>
        ch === ' ' ? (
          ' '
        ) : (
          <span key={i} className="fw-l" style={{ '--d': delay + i * step + 'ms' }}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
