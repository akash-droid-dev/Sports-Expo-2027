'use client';
// Home "Live & on demand": the session cards wait stacked like a deck; when the section scrolls
// into view they are dealt out into a row, which then keeps moving right to left
// (src/app/anim.css). Hover pauses it.
import { useEffect, useRef, useState } from 'react';
import Marquee from '@/components/anim/Marquee';
import DemoVideo from '@/components/DemoVideo';
import { withBase } from '@/lib/base';

export default function WatchShuffle({ items = [] }) {
  const ref = useRef(null);
  const [phase, setPhase] = useState('stack');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return setPhase('roll');
    let t1, t2;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t1 = setTimeout(() => setPhase('deal'), 60);
        t2 = setTimeout(() => setPhase('roll'), 60 + 900 + Math.min(items.length, 6) * 110);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [items.length]);
  if (!items.length) return null;
  const n = items.length;
  return (
    <div ref={ref} data-anim="" className={'ws ws-' + phase}>
      <Marquee
        dir="left"
        seconds={Math.max(28, n * 9)}
        repeat={n < 4 ? 3 : 2}
        paused={phase !== 'roll'}
        label="Live and on-demand sessions"
        items={items}
        render={(v, i, copy) => {
          const k = copy ? i + n : i;
          return (
            <a
              href={withBase('/programme')}
              className="ws-card"
              style={{ '--k': k, '--r': ((k * 47) % 22) - 11 + 'deg' }}
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
            >
              <span className="ws-thumb">
                <DemoVideo id={v.id} thumb />
                <span className="ws-badge" style={{ background: v.badgeBg }}>
                  {v.badge}
                </span>
                <span className="ws-dur">{v.dur}</span>
                <span className="ws-play" aria-hidden="true">
                  ▶
                </span>
              </span>
              <span className="ws-title">{v.title}</span>
              <span className="ws-meta">
                {v.spk} · Day {v.day}
              </span>
            </a>
          );
        }}
      />
    </div>
  );
}
