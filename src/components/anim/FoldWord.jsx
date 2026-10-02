'use client';
// A word that unfolds letter by letter, like paper folded in half: each letter's lower half
// swings down from behind its upper half. `when="load"` plays after the page appears,
// `when="view"` when the word scrolls into view (src/app/anim.css).
import { useEffect, useRef, useState } from 'react';

export default function FoldWord({ text, when = 'view', delay = 0, step = 70, className = '', style }) {
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
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="fw-space" aria-hidden="true">
            {' '}
          </span>
        ) : (
          <span key={i} className="fw-l" aria-hidden="true" style={{ '--d': delay + i * step + 'ms' }}>
            <span className="fw-size">{ch}</span>
            <span className="fw-top">{ch}</span>
            <span className="fw-bot">{ch}</span>
          </span>
        ),
      )}
    </span>
  );
}
