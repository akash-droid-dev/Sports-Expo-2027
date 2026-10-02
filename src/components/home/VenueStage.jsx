'use client';
// End of the Home globe journey. After the map reaches Yashobhoomi, the venue scene takes
// over the screen and four zone cards (A–D) are dealt like playing cards, sport photo up;
// scrolling on turns each one over to its zone side (see-through glass).
// `p` is the journey's scroll progress (0–1); the stage stays pinned until the journey ends.
import { useState } from 'react';
import VenueScene from './VenueScene';
import { withBase } from '@/lib/base';
import '@/data/ise';
import './venue-stage.css';

const ramp = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
// Scroll progress at which each card is dealt, then turned over.
const CARD_AT = [0.79, 0.81, 0.83, 0.85];
const FLIP_AT = [0.88, 0.905, 0.93, 0.955];
// The face shown first: a sport photo for each zone (public/media).
const FACE = {
  A: { img: '/media/video/cricket-club.webp', sport: 'CRICKET' },
  B: { img: '/media/football.webp', sport: 'FOOTBALL' },
  C: { img: '/media/video/hockey-goal.webp', sport: 'HOCKEY' },
  D: { img: '/media/floodlights.webp', sport: 'STADIUM' },
};

function zoneSummary(D, z) {
  const clusters = D.clusters.filter((c) => c.zone === z.id);
  const stalls = clusters.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pavilions = clusters.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  const facts = [clusters.length + ' areas'];
  if (stalls) facts.push(stalls + ' stalls');
  if (pavilions) facts.push(pavilions + ' pavilions');
  return { facts: facts.join(' · '), highlights: clusters.slice(0, 3).map((c) => c.name) };
}

export default function VenueStage({ p = 0, reduced = false }) {
  const [hover, setHover] = useState(null);
  const D = typeof window !== 'undefined' ? window.ISE : null;

  const venueOpacity = reduced ? 1 : ramp(p, 0.56, 0.62);
  const finale = reduced ? 1 : ramp(p, 0.7, 0.76);
  const zoneHref = (id) => withBase('/zones#zone-' + id.toLowerCase());
  return (
    <div className="vs-root">
      <div className="vs-venue" style={{ opacity: venueOpacity }}>
        <VenueScene active={reduced || p > 0.3} />
        <div className="vs-scrim" style={{ opacity: 0.6 + finale * 0.3 }} />
      </div>

      <div className="vs-final" style={{ opacity: finale, pointerEvents: finale > 0.5 ? 'auto' : 'none' }}>
        <header className="vs-head">
          <span className="vs-kicker">08 / 08 · EXHIBITION HALL 2 · YASHOBHOOMI</span>
          <h2 className="vs-title">
            FOUR EVENT <span>ZONES</span>
          </h2>
        </header>

        <div className="vs-cards" role="list">
          {D
            ? D.zones.map((z, i) => {
                const shown = reduced || p >= CARD_AT[i];
                const flipped = reduced || p >= FLIP_AT[i];
                const { facts, highlights } = zoneSummary(D, z);
                const face = FACE[z.id] || FACE.A;
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
                        <span className="vs-front-img" style={{ backgroundImage: `url("${withBase(face.img)}")` }} />
                        <span className="vs-pip vs-pip-top">
                          <b>{z.id}</b>
                          <i />
                        </span>
                        <span className="vs-pip vs-pip-bot">
                          <b>{z.id}</b>
                          <i />
                        </span>
                        <span className="vs-front-label">{face.sport}</span>
                      </span>
                      <span className="vs-face vs-back">
                        <span className="vs-card-bar" />
                        <span className="vs-card-letter" aria-hidden="true">
                          {z.id}
                        </span>
                        <span className="vs-card-zone">ZONE {z.id}</span>
                        <span className="vs-card-name">{z.name}</span>
                        <span className="vs-card-blurb">{z.blurb}</span>
                        <span className="vs-card-facts">{facts}</span>
                        <span className="vs-card-list">{highlights.join(' · ')}</span>
                        <span className="vs-card-cta">EXPLORE ZONE {z.id} →</span>
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
