'use client';
// Home "Intentions": Explore, Exhibit, Attend, Connect and Watch as 3D boxes travelling left to
// right in a continuous strip (src/app/anim.css).
import Marquee from '@/components/anim/Marquee';

const TONES = ['#F07C12', '#1F4E9E', '#0B6E4F', '#7A2E8C', '#9E1B22'];

export default function IntentBoxes({ items = [] }) {
  if (!items.length) return null;
  return (
    <Marquee
      dir="right"
      seconds={38}
      repeat={2}
      label="Ways into the Expo"
      className="ibox-strip"
      items={items}
      render={(it, i, copy) => (
        <a href={it.href} className="ibox" style={{ '--tone': TONES[i % TONES.length] }} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined}>
          <span className="ibox-top" aria-hidden="true" />
          <span className="ibox-side" aria-hidden="true" />
          <span className="ibox-front">
            <span className="ibox-n">{it.n}</span>
            <span className="ibox-t">{it.t}</span>
            <span className="ibox-s">
              {it.s}
              <span className="ibox-arrow">→</span>
            </span>
          </span>
        </a>
      )}
    />
  );
}
