'use client';
// Home "Build your presence": the seven stall products as 3D booth blocks (bigger product,
// taller block) travelling left to right. Hover pauses the strip and turns the booth with the
// pointer; each one opens the Exhibit page (src/app/anim.css).
import { useEffect, useState } from 'react';
import Marquee from '@/components/anim/Marquee';
import { withBase } from '@/lib/base';
import { isLite } from '@/lib/device';

function turn(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  e.currentTarget.style.setProperty('--turn', -32 + x * 50 + 'deg');
}

export default function BoothStrip({ items = [] }) {
  // Seven booths already outrun a phone screen: one set per half keeps the 3D layers down.
  // Decided after mounting so the server-rendered HTML still matches.
  const [lite, setLite] = useState(false);
  useEffect(() => setLite(isLite()), []);
  if (!items.length) return null;
  return (
    <Marquee
      dir="right"
      seconds={46}
      repeat={lite ? 1 : 2}
      label="Stall products"
      className="booth-strip"
      items={items}
      render={(b, i, copy) => {
        const w = Math.round(b.w * 0.95);
        const d = Math.round(b.d * 1.1);
        const h = Math.max(10, Math.round(b.h * 0.55));
        return (
          <a
            href={withBase('/exhibit#products')}
            className="booth"
            style={{ '--w': w + 'px', '--d': d + 'px', '--h': h + 'px', '--k': i }}
            aria-hidden={copy || undefined}
            tabIndex={copy ? -1 : undefined}
            onPointerMove={turn}
            onPointerLeave={(e) => e.currentTarget.style.removeProperty('--turn')}
          >
            <span className="booth-stage" aria-hidden="true">
              <span className="booth-cube">
                <span className="bc-face bc-front" />
                <span className="bc-face bc-back" />
                <span className="bc-face bc-left" />
                <span className="bc-face bc-right" />
                <span className="bc-face bc-top" />
              </span>
              <span className="booth-floor" />
            </span>
            <span className="booth-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="booth-name">{b.name}</span>
            <span className="booth-size">{b.size}</span>
            <span className="booth-cta">VIEW →</span>
          </a>
        );
      }}
    />
  );
}
