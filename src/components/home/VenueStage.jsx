'use client';
// End of the Home globe journey. After the map reaches Bharat Mandapam, the venue film takes
// over the screen and four clear glass cards are dealt like playing cards, showing only their
// zone letter (A–D); scrolling on turns each one over to the zone's name and a short line.
// `p` is the journey's scroll progress (0–1); the stage stays pinned until the journey ends.
import { useEffect, useRef, useState } from 'react';
import VenueScene from './VenueScene';
import { withBase } from '@/lib/base';
import '@/data/ise';
import './venue-stage.css';

const ramp = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
// Scroll progress at which each card is dealt, then turned over.
const CARD_AT = [0.79, 0.81, 0.83, 0.85];
const FLIP_AT = [0.88, 0.905, 0.93, 0.955];

export default function VenueStage({ p = 0, reduced = false }) {
  const [hover, setHover] = useState(null);
  const D = typeof window !== 'undefined' ? window.ISE : null;

  const venueOpacity = reduced ? 1 : ramp(p, 0.56, 0.62);
  const finale = reduced ? 1 : ramp(p, 0.7, 0.76);
  const zoneHref = (id) => withBase('/zones#zone-' + id.toLowerCase());
  // Lets Bucky step aside on phones while the cards are up (venue-stage.css) — only while the
  // stage is actually on screen, not for the rest of the page below the journey.
  const rootRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cardsOn = finale > 0.5 && onScreen;
  useEffect(() => {
    document.documentElement.classList.toggle('vs-cards-on', cardsOn);
    return () => document.documentElement.classList.remove('vs-cards-on');
  }, [cardsOn]);
  return (
    <div className="vs-root" ref={rootRef}>
      <div className="vs-venue" style={{ opacity: venueOpacity }}>
        <VenueScene active={reduced || p > 0.01} warm={reduced || p > 0.45} visible={venueOpacity > 0} />
        <div className="vs-scrim" style={{ opacity: 0.45 + finale * 0.2 }} />
      </div>

      <div className="vs-final" style={{ opacity: finale, pointerEvents: finale > 0.5 ? 'auto' : 'none' }}>
        <header className="vs-head">
          <span className="vs-kicker">
            07 / 07 · BHARAT MANDAPAM<span className="vs-kicker-more"> · PRAGATI MAIDAN, NEW DELHI</span>
          </span>
          <h2 className="vs-title">
            Four event <span>zones</span>
          </h2>
        </header>

        <div className="vs-cards" role="list">
          {D
            ? D.zones.map((z, i) => {
                const shown = reduced || p >= CARD_AT[i];
                const flipped = reduced || p >= FLIP_AT[i];
                return (
                  <a
                    key={z.id}
                    role="listitem"
                    href={zoneHref(z.id)}
                    className={'vs-card' + (shown ? ' is-in' : '') + (flipped ? ' is-flipped' : '') + (hover === z.id ? ' is-hover' : '')}
                    style={{ '--zone': z.color, '--i': i }}
                    tabIndex={shown ? 0 : -1}
                    aria-hidden={!shown}
                    aria-label={`Zone ${z.id}: ${z.name}`}
                    onMouseEnter={() => setHover(z.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(z.id)}
                    onBlur={() => setHover(null)}
                  >
                    <span className="vs-card-inner">
                      <span className="vs-face vs-front" aria-hidden="true">
                        <span className="vs-front-kicker">Zone</span>
                        <span className="vs-front-letter">{z.id}</span>
                      </span>
                      <span className="vs-face vs-back">
                        <span className="vs-card-bar" />
                        <span className="vs-card-zone">Zone {z.id}</span>
                        <span className="vs-card-name">{z.name}</span>
                        <span className="vs-card-blurb">{z.blurb}</span>
                        <span className="vs-card-cta">
                          <span className="vs-cta-more">Explore </span>Zone {z.id} →
                        </span>
                      </span>
                    </span>
                  </a>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
