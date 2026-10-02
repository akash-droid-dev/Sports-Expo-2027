'use client';
// A word that unfolds letter by letter, like paper folded in half: each letter's lower half
// swings down from behind its upper half. `when="load"` plays after the page appears,
// `when="view"` when the word scrolls into view (src/app/anim.css).
import { useEffect, useRef, useState } from 'react';

export default function FoldWord({ text, when = 'view', delay = 0, step = 70, className = '', style }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(false);
  const letters = Array.from(text).filter((ch) => ch !== ' ').length;
  // After the last letter lands (src/app/anim.css: 180 ms lag + 900 ms swing), show plain text.
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setDone(true), delay + Math.max(0, letters - 1) * step + 1200);
    return () => clearTimeout(t);
  }, [on, delay, letters, step]);
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
    <span ref={ref} data-anim="" className={'fold-word' + (on ? ' is-on' : '') + (done ? ' is-done' : '') + (className ? ' ' + className : '')} style={style}>
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
