'use client';
// Home "One hall. Four event zones." as a real hardcover book: cloth cover with gold foil, a
// spine, page block and ribbon. Opening it brings it up large: endpapers and a title page with
// contents, then one spread per zone (left: the zone and its plan; right: its areas, stalls and
// exhibitors). Pages turn with Next, a click on a page, a swipe or the contents; after the last
// zone the book closes and shrinks back. Phones show one page at a time (src/app/anim.css).
import { useCallback, useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import BrandLogo from '@/components/BrandLogo';
import '@/data/ise';

const TURN_MS = 800;
const RIFFLE_MS = 380;
const OPEN_MS = 900;

function zoneFacts(D, z) {
  const cl = D.clusters.filter((c) => c.zone === z.id);
  const stalls = cl.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pav = cl.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  return { cl, stalls, pav };
}

// The zone's areas, drawn like a printed plate (cluster x, y, w, h from the hall layout).
function ZonePlan({ cl, color, id }) {
  const x0 = Math.min(...cl.map((c) => c.x)), y0 = Math.min(...cl.map((c) => c.y));
  const x1 = Math.max(...cl.map((c) => c.x + c.w)), y1 = Math.max(...cl.map((c) => c.y + c.h));
  const pat = 'hb-hatch-' + id;
  return (
    <svg className="hb-plan" viewBox={`${x0 - 10} ${y0 - 10} ${x1 - x0 + 20} ${y1 - y0 + 20}`} aria-hidden="true">
      <defs>
        <pattern id={pat} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1.2" strokeOpacity="0.45" />
        </pattern>
      </defs>
      <rect x={x0 - 6} y={y0 - 6} width={x1 - x0 + 12} height={y1 - y0 + 12} fill="none" stroke="#2b2620" strokeWidth="0.8" />
      {cl.map((c) => (
        <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={c.kind === 'stalls' ? `url(#${pat})` : color} fillOpacity={c.kind === 'stalls' ? 1 : 0.16} stroke="#2b2620" strokeWidth="1" />
          <text x={c.x + 6} y={c.y + 15} fontSize="11" letterSpacing="1" className="hb-plan-label">
            {c.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

function RunningHead({ left, children }) {
  return <span className={'hb-rh' + (left ? ' is-left' : '')}>{children}</span>;
}

function Folio({ n }) {
  return n ? <span className="hb-folio">{n}</span> : null;
}

function Page({ page, D, left, onJump }) {
  if (!page) return <div className="hb-paper hb-blank" />;
  if (page.kind === 'endpaper') {
    return (
      <div className="hb-paper hb-endpaper">
        <div className="hb-bookplate">
          <span className="hb-bp-ex">Ex Libris</span>
          <BrandLogo className="hb-bp-logo" onDark={false} />
          <span className="hb-bp-line">A guide for every visitor to Bharat Mandapam</span>
        </div>
      </div>
    );
  }
  if (page.kind === 'title') {
    return (
      <div className="hb-paper hb-titlepage">
        <span className="hb-tp-pre">India Sports Expo 2027</span>
        <span className="hb-tp-title">Expo</span>
        <span className="hb-tp-title is-sub">Zone Guide</span>
        <span className="hb-orn" aria-hidden="true">
          ❦
        </span>
        <span className="hb-tp-place">Bharat Mandapam · Pragati Maidan · New Delhi</span>
        <span className="hb-toc-h">Contents</span>
        <ol className="hb-toc">
          {D.zones.map((z, i) => (
            <li key={z.id}>
              <button type="button" onClick={() => onJump && onJump(z.id)}>
                <i style={{ background: z.color }} />
                <span>
                  Zone {z.id} · {z.name}
                </span>
                <em className="hb-leader" />
                <b>{i * 2 + 1}</b>
              </button>
            </li>
          ))}
        </ol>
        <span className="hb-tp-imprint">Demo edition · sample data · {D.zones.length} zones</span>
      </div>
    );
  }
  const { z } = page;
  const { cl, stalls, pav } = zoneFacts(D, z);
  if (page.kind === 'info') {
    return (
      <div className="hb-paper" style={{ '--zone': z.color }}>
        <RunningHead left={left}>India Sports Expo 2027</RunningHead>
        <span className="hb-chapter">Zone {z.id}</span>
        <h3 className="hb-title">{z.name}</h3>
        <span className="hb-rule" />
        <p className="hb-text">
          <span className="hb-dropcap">{z.blurb.charAt(0)}</span>
          {z.blurb.slice(1)} One of four event zones at Bharat Mandapam, reached along the Sports Boulevard.
        </p>
        <dl className="hb-facts">
          <div>
            <dt>Areas</dt>
            <dd>{cl.length}</dd>
          </div>
          {stalls ? (
            <div>
              <dt>Stalls</dt>
              <dd>{stalls}</dd>
            </div>
          ) : null}
          {pav ? (
            <div>
              <dt>Pavilions</dt>
              <dd>{pav}</dd>
            </div>
          ) : null}
        </dl>
        <figure className="hb-fig">
          <ZonePlan cl={cl} color={z.color} id={z.id} />
          <figcaption>
            <b>Fig. {z.id}.</b> Zone {z.id} on the expo floor (schematic, not to scale).
          </figcaption>
        </figure>
        <Folio n={page.folio} />
      </div>
    );
  }
  return (
    <div className="hb-paper" style={{ '--zone': z.color }}>
      <RunningHead left={left}>Expo · Zone Guide</RunningHead>
      <span className="hb-chapter">Zone {z.id} · Areas and stalls</span>
      <ol className="hb-list">
        {cl.map((c) => {
          const ex = D.exhibitors.filter((e) => e.cluster === c.id);
          return (
            <li key={c.id}>
              <span className="hb-entry">
                <b>{c.name}</b>
                <em className="hb-leader" />
                <span className="hb-code">
                  {z.id}-{c.id}
                </span>
              </span>
              <i className="hb-meta">{c.meta}</i>
              {ex.length ? (
                <span className="hb-ex">
                  {ex.map((e) => (
                    <span key={e.id}>
                      {e.name}, <em>stall {e.stall}</em>
                    </span>
                  ))}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <a className="hb-go" href={withBase('/zones#zone-' + z.id.toLowerCase())}>
        Explore Zone {z.id} in full →
      </a>
      <Folio n={page.folio} />
    </div>
  );
}

function Cover({ small = false }) {
  return (
    <div className={'hb-cover-art' + (small ? ' is-small' : '')}>
      <span className="hb-foil hb-cover-pre">India Sports Expo 2027</span>
      <BrandLogo className="hb-cover-logo" />
      <span className="hb-foil hb-cover-title">
        EXPO
        <br />
        ZONE GUIDE
      </span>
      <span className="hb-cover-bands" aria-hidden="true">
        <i style={{ background: '#9E1B22' }} />
        <i style={{ background: '#5B3A9E' }} />
        <i style={{ background: '#0A62BF' }} />
        <i style={{ background: '#00803F' }} />
      </span>
      <span className="hb-foil hb-cover-sub">4 ZONES · 213 STALLS · 25 PAVILIONS</span>
    </div>
  );
}

export default function HallBook() {
  const D = typeof window !== 'undefined' ? window.ISE : null;
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('closed'); // opening | open | turn-next | turn-prev | closing
  const [view, setView] = useState(0);
  const [single, setSingle] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [fast, setFast] = useState(false);
  const nextRef = useRef(null);
  const riffle = useRef(0); // pages still to turn when jumping from the contents
  const touch = useRef(null);
  const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Two-page spreads open on the endpaper and title page; phones start at the title page.
  const zonePages = D ? D.zones.flatMap((z, i) => [{ kind: 'info', z, folio: i * 2 + 1 }, { kind: 'list', z, folio: i * 2 + 2 }]) : [];
  const pages = single ? [{ kind: 'title' }, ...zonePages] : [{ kind: 'endpaper' }, { kind: 'title' }, ...zonePages];
  const per = single ? 1 : 2;
  const views = Math.ceil(pages.length / per);
  const wait = (ms) => (reduced ? 0 : ms);
  const turnMs = fast ? RIFFLE_MS : TURN_MS;

  const close = useCallback(() => {
    riffle.current = 0;
    setPhase('closing');
    setTimeout(() => {
      setOpen(false);
      setPhase('closed');
      setView(0);
      setBounce(true);
      setTimeout(() => setBounce(false), 700);
    }, wait(OPEN_MS + 250));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    setSingle(innerWidth < 760);
    setView(0);
    setOpen(true);
    setPhase('opening');
    setTimeout(() => setPhase('open'), wait(OPEN_MS + 120));
  };
  const turn = (dir, ms) => {
    setPhase(dir > 0 ? 'turn-next' : 'turn-prev');
    setTimeout(() => {
      setView((v) => v + dir);
      setPhase('open');
    }, wait(ms));
  };
  const next = () => {
    if (phase !== 'open') return;
    if (view >= views - 1) return close();
    turn(1, turnMs);
  };
  const prev = () => {
    if (phase !== 'open' || view === 0) return;
    turn(-1, single ? 300 : turnMs);
  };
  // Contents: riffle through the pages to the zone's opening page.
  const jump = (zoneId) => {
    if (phase !== 'open') return;
    const i = pages.findIndex((p) => p.kind === 'info' && p.z.id === zoneId);
    const target = Math.floor(i / per);
    if (target <= view) return;
    riffle.current = target - view;
    setFast(true);
  };
  // Keep turning while a riffle is in progress.
  useEffect(() => {
    if (phase !== 'open') return;
    if (riffle.current > 0) {
      riffle.current -= 1;
      turn(1, RIFFLE_MS);
    } else if (fast) setFast(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, fast]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nextRef.current && nextRef.current.click();
      if (e.key === 'ArrowLeft') prevRef.current && prevRef.current();
    };
    addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);
  const prevRef = useRef(null);
  prevRef.current = prev;
  useEffect(() => {
    if (phase === 'open' && nextRef.current && !riffle.current) nextRef.current.focus({ preventScroll: true });
  }, [phase]);

  if (!D) return null;
  const at = (i) => pages[i] || null;
  const page = (i, left = false) => <Page page={at(i)} D={D} left={left} onJump={jump} />;
  const turningNext = phase === 'turn-next';
  const turningPrev = phase === 'turn-prev';

  // What lies under a turning leaf, and on its two sides.
  let left, right, leaf = null;
  if (!single) {
    const L = view * 2, R = L + 1;
    left = turningPrev ? page(L - 2, true) : page(L, true);
    right = turningNext ? page(R + 2) : page(R);
    if (turningNext) leaf = { side: 'right', front: page(R), back: page(R + 1, true) };
    if (turningPrev) leaf = { side: 'left', front: page(L, true), back: page(L - 1) };
  } else {
    right = turningNext ? page(view + 1) : page(view);
    if (turningNext) leaf = { side: 'right', front: page(view), back: <div className="hb-paper hb-blank" /> };
  }
  const shown = at(single ? view : view * 2 + 1) || at(single ? view : view * 2);
  const zone = shown && shown.z;

  // A click on a page turns it (not on its links and buttons); a swipe does the same.
  const onPageClick = (dir) => (e) => {
    if (e.target.closest('a, button')) return;
    dir > 0 ? next() : prev();
  };
  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  };

  return (
    <div data-anim="" className="hb">
      <button type="button" className={'hb-closed' + (bounce ? ' is-bounce' : '') + (open ? ' is-away' : '')} onClick={start} aria-label="Open the expo zone guide">
        <span className="hb-closed-book">
          <span className="hb-b-back" aria-hidden="true" />
          <span className="hb-b-pages" aria-hidden="true" />
          <span className="hb-b-top" aria-hidden="true" />
          <span className="hb-b-spine" aria-hidden="true">
            <span>Expo · Zone guide</span>
          </span>
          <span className="hb-closed-cover">
            <span className="hb-closed-inside" aria-hidden="true" />
            <span className="hb-closed-front">
              <Cover small />
            </span>
          </span>
          <span className="hb-b-ribbon" aria-hidden="true" />
        </span>
        <span className="hb-closed-hint">Open the guide · {zonePages.length} pages</span>
      </button>

      {open ? (
        <div className={'hb-modal hb-' + phase + (single ? ' is-single' : '') + (fast ? ' is-riffle' : '')} role="dialog" aria-modal="true" aria-label="Expo zone guide" style={{ '--turn': turnMs + 'ms' }}>
          <div className="hb-backdrop" onClick={close} />
          <div className="hb-big">
            <div className="hb-spread" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="hb-boards" aria-hidden="true" />
              {!single ? (
                <div className="hb-page hb-left" onClick={onPageClick(-1)}>
                  {left}
                </div>
              ) : null}
              <div className="hb-page hb-right" onClick={onPageClick(1)}>
                {right}
                <span className="hb-curl" aria-hidden="true" />
              </div>
              {!single ? <div className="hb-gutter" aria-hidden="true" /> : null}
              <span className="hb-ribbon" aria-hidden="true" />
              {leaf ? (
                <div className={'hb-leaf hb-leaf-' + leaf.side}>
                  <div className="hb-leaf-face hb-leaf-front">{leaf.front}</div>
                  <div className="hb-leaf-face hb-leaf-back">{leaf.back}</div>
                </div>
              ) : null}
              {/* The front cover: it swings open over the left page, and back shut at the end. */}
              <div className="hb-cover">
                <div className="hb-cover-front">
                  <Cover />
                </div>
                <div className="hb-cover-back">{single ? <div className="hb-paper hb-endpaper" /> : page(view * 2, true)}</div>
              </div>
            </div>
            <div className="hb-controls">
              <button type="button" onClick={prev} disabled={view === 0 || phase !== 'open'}>
                ← Prev
              </button>
              <span className="hb-where">
                {zone ? <i style={{ background: zone.color }} /> : null}
                {zone ? 'Zone ' + zone.id : 'Contents'} · {view + 1} / {views}
              </span>
              <button type="button" ref={nextRef} onClick={next} disabled={phase !== 'open'} className="hb-next">
                {view >= views - 1 ? 'Close book ✕' : 'Next →'}
              </button>
            </div>
            <span className="hb-tip">Tap a page or swipe to turn</span>
            <button type="button" className="hb-x" onClick={close} aria-label="Close the zone guide">
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
