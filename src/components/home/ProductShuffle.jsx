'use client';
// Home "Featured products": the product cards wait stacked like a deck; when the section scrolls
// into view they are dealt out into a row, which then keeps moving left to right
// (src/app/anim.css). Hover pauses it.
import { useRef } from 'react';
import Marquee from '@/components/anim/Marquee';
import useDeal from '@/components/anim/useDeal';
import { withBase } from '@/lib/base';

// Cards dealt from the deck: the ones on screen when the strip starts (the rest snap into place).
const DEALT = 6;

export default function ProductShuffle({ items = [] }) {
  const ref = useRef(null);
  const n = items.length;
  const phase = useDeal(ref, Math.min(n, DEALT));
  if (!n) return null;
  return (
    <div ref={ref} data-anim="" className={'ps ps-' + phase}>
      <Marquee
        dir="right"
        seconds={Math.max(30, n * 7)}
        repeat={n < 5 ? 2 : 1}
        paused={phase !== 'roll'}
        label="Featured products"
        items={items}
        render={(p, i, copy, { half, pos }) => {
          // A left-to-right strip starts half a loop along, so the second half is what shows first.
          const dealt = half === 1 && pos < DEALT;
          return (
            <a
              href={withBase('/exhibit#directory')}
              className={'ps-card' + (dealt ? '' : ' ps-off')}
              style={{ '--k': pos, '--r': ((pos * 47) % 22) - 11 + 'deg' }}
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
            >
              <span className="ps-photo">
                <image-slot id={p.slot} shape="rect" placeholder="Product photograph" />
              </span>
              <span className="ps-cat">
                {p.cat} · {p.stall}
              </span>
              <span className="ps-name">{p.name}</span>
              <span className="ps-by">
                {p.by} · {p.moq}
              </span>
            </a>
          );
        }}
      />
    </div>
  );
}
