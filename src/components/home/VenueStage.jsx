'use client';
// End of the Home globe journey. After the map reaches Yashobhoomi, the venue scene takes
// over the screen and keeps rotating behind a flat Hall 2 zone chart and four zone cards.
// `p` is the journey's scroll progress (0–1); the stage stays pinned until the journey ends.
import { useState } from 'react';
import HallPlan from '@/screens/HallPlan';
import VenueScene from './VenueScene';
import { withBase } from '@/lib/base';
import '@/data/ise';
import './venue-stage.css';

const ramp = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const CARD_AT = [0.8, 0.84, 0.88, 0.92];

function zoneSummary(D, z) {
  const clusters = D.clusters.filter((c) => c.zone === z.id);
  const stalls = clusters.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pavilions = clusters.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  const facts = [clusters.length + ' areas'];
  if (stalls) facts.push(stalls + ' stalls');
  if (pavilions) facts.push(pavilions + ' pavilions');
  return { facts: facts.join(' · '), highlights: clusters.slice(0, 3).map((c) => c.name) };
}

export default function VenueStage({ p = 0, reduced = false, lit }) {
  const [hover, setHover] = useState(null);
  const D = typeof window !== 'undefined' ? window.ISE : null;

  const venueOpacity = reduced ? 1 : ramp(p, 0.56, 0.62);
  const finale = reduced ? 1 : ramp(p, 0.7, 0.76);
  const roof = reduced ? 0 : 1 - ramp(p, 0.74, 0.79);
  const zoneHref = (id) => withBase('/zones#zone-' + id.toLowerCase());
  const openZone = (id) => {
    window.location.href = zoneHref(id);
  };

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

        <div className="vs-chart">
          <div className="vs-chart-panel">
            <HallPlan
              roof={roof}
              lit={lit}
              activeZone={hover || ''}
              labels
              onCluster={(c) => openZone(c.zone)}
            />
          </div>
        </div>

        <div className="vs-cards" role="list">
          {D
            ? D.zones.map((z, i) => {
                const shown = reduced || p >= CARD_AT[i];
                const { facts, highlights } = zoneSummary(D, z);
                return (
                  <a
                    key={z.id}
                    role="listitem"
                    href={zoneHref(z.id)}
                    className={'vs-card' + (shown ? ' is-in' : '') + (hover === z.id ? ' is-hover' : '')}
                    style={{ '--zone': z.color }}
                    tabIndex={shown ? 0 : -1}
                    aria-hidden={!shown}
                    onMouseEnter={() => setHover(z.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(z.id)}
                    onBlur={() => setHover(null)}
                  >
                    <span className="vs-card-bar" />
                    <span className="vs-card-zone">ZONE {z.id}</span>
                    <span className="vs-card-name">{z.name}</span>
                    <span className="vs-card-blurb">{z.blurb}</span>
                    <span className="vs-card-facts">{facts}</span>
                    <span className="vs-card-list">{highlights.join(' · ')}</span>
                    <span className="vs-card-cta">EXPLORE ZONE {z.id} →</span>
                  </a>
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
}
