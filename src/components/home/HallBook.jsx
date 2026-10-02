'use client';
// Home "One hall. Four event zones." as a book. The closed book sits in the section; opening
// it brings it up large, one zone per spread (left page: the zone and its plan; right page: its
// areas, stalls and exhibitors). Next turns the page; after the last zone the book closes and
// shrinks back. Phones show one page at a time (src/app/anim.css).
import { useCallback, useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import '@/data/ise';

const TURN_MS = 800;
const OPEN_MS = 900;

function zoneFacts(D, z) {
  const cl = D.clusters.filter((c) => c.zone === z.id);
  const stalls = cl.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pav = cl.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  return { cl, stalls, pav };
}

// The zone's areas drawn from the hall layout (cluster x, y, w, h).
function ZonePlan({ cl, color }) {
  const x0 = Math.min(...cl.map((c) => c.x)), y0 = Math.min(...cl.map((c) => c.y));
  const x1 = Math.max(...cl.map((c) => c.x + c.w)), y1 = Math.max(...cl.map((c) => c.y + c.h));
  return (
    <svg className="hb-plan" viewBox={`${x0 - 8} ${y0 - 8} ${x1 - x0 + 16} ${y1 - y0 + 16}`} aria-hidden="true">
      {cl.map((c) => (
        <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={color} fillOpacity={c.kind === 'stalls' ? 0.22 : 0.4} stroke={color} strokeWidth="2" />
          <text x={c.x + 6} y={c.y + 16} fontSize="12" fontFamily="JetBrains Mono, monospace" fill="#0E0E0F">
            {c.id}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Page({ page, n, D }) {
  if (!page) return <div className="hb-paper hb-blank" />;
  const { z } = page;
  const { cl, stalls, pav } = zoneFacts(D, z);
  if (page.kind === 'info') {
    return (
      <div className="hb-paper" style={{ '--zone': z.color }}>
        <span className="hb-kicker">ZONE {z.id} · EXHIBITION HALL 2</span>
        <span className="hb-letter">{z.id}</span>
        <h3 className="hb-title">{z.name}</h3>
        <p className="hb-text">{z.blurb}</p>
        <div className="hb-stats">
          <span>
            <b>{cl.length}</b>areas
          </span>
          {stalls ? (
            <span>
              <b>{stalls}</b>stalls
            </span>
          ) : null}
          {pav ? (
            <span>
              <b>{pav}</b>pavilions
            </span>
          ) : null}
        </div>
        <ZonePlan cl={cl} color={z.color} />
        <span className="hb-folio">{n}</span>
      </div>
    );
  }
  return (
    <div className="hb-paper" style={{ '--zone': z.color }}>
      <span className="hb-kicker">ZONE {z.id} · AREAS AND STALLS</span>
      <ol className="hb-list">
        {cl.map((c) => {
          const ex = D.exhibitors.filter((e) => e.cluster === c.id);
          return (
            <li key={c.id}>
              <span className="hb-code">
                {z.id}-{c.id}
              </span>
              <span className="hb-area">
                <b>{c.name}</b>
                <i>{c.meta}</i>
                {ex.length ? (
                  <span className="hb-ex">
                    {ex.map((e) => (
                      <span key={e.id}>
                        {e.name} <em>{e.stall}</em>
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
      <a className="hb-go" href={withBase('/zones#zone-' + z.id.toLowerCase())}>
        EXPLORE ZONE {z.id} →
      </a>
      <span className="hb-folio">{n}</span>
    </div>
  );
}

function Cover({ small = false }) {
  return (
    <div className={'hb-cover-art' + (small ? ' is-small' : '')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBase('/brand/logo-on-dark@2x.png')} alt="" />
      <span className="hb-cover-title">
        HALL 2
        <br />
        ZONE GUIDE
      </span>
      <span className="hb-cover-sub">4 ZONES · 213 STALLS · 25 PAVILIONS</span>
      {small ? <span className="hb-cover-cta">TAP TO OPEN</span> : null}
    </div>
  );
}

export default function HallBook() {
  const D = typeof window !== 'undefined' ? window.ISE : null;
  const pages = D ? D.zones.flatMap((z) => [{ kind: 'info', z }, { kind: 'list', z }]) : [];
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('closed'); // opening | open | turn-next | turn-prev | closing
  const [view, setView] = useState(0);
  const [single, setSingle] = useState(false);
  const [bounce, setBounce] = useState(false);
  const nextRef = useRef(null);
  const reduced = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const per = single ? 1 : 2;
  const views = Math.ceil(pages.length / per);
  const wait = (ms) => (reduced ? 0 : ms);

  const close = useCallback(() => {
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
  const next = () => {
    if (phase !== 'open') return;
    if (view >= views - 1) return close();
    setPhase('turn-next');
    setTimeout(() => {
      setView((v) => v + 1);
      setPhase('open');
    }, wait(TURN_MS));
  };
  const prev = () => {
    if (phase !== 'open' || view === 0) return;
    setPhase('turn-prev');
    setTimeout(() => {
      setView((v) => v - 1);
      setPhase('open');
    }, wait(single ? 300 : TURN_MS));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nextRef.current && nextRef.current.click();
    };
    addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);
  useEffect(() => {
    if (phase === 'open' && nextRef.current) nextRef.current.focus({ preventScroll: true });
  }, [phase]);

  if (!D) return null;
  const at = (i) => pages[i] || null;
  const page = (i) => <Page page={at(i)} n={i + 1} D={D} />;
  const turningNext = phase === 'turn-next';
  const turningPrev = phase === 'turn-prev';

  // What lies under a turning leaf, and on its two sides.
  let left, right, leaf = null;
  if (!single) {
    const L = view * 2, R = L + 1;
    left = turningPrev ? page(L - 2) : page(L);
    right = turningNext ? page(R + 2) : page(R);
    if (turningNext) leaf = { side: 'right', front: page(R), back: page(R + 1) };
    if (turningPrev) leaf = { side: 'left', front: page(L), back: page(L - 1) };
  } else {
    right = turningNext ? page(view + 1) : page(view);
    if (turningNext) leaf = { side: 'right', front: page(view), back: <div className="hb-paper hb-blank" /> };
  }
  const zone = at(single ? view : view * 2)?.z;

  return (
    <div data-anim="" className="hb">
      <button type="button" className={'hb-closed' + (bounce ? ' is-bounce' : '') + (open ? ' is-away' : '')} onClick={start} aria-label="Open the Hall 2 zone guide">
        <span className="hb-closed-book">
          <span className="hb-closed-pages" aria-hidden="true" />
          <span className="hb-closed-cover">
            <Cover small />
          </span>
        </span>
      </button>

      {open ? (
        <div className={'hb-modal hb-' + phase + (single ? ' is-single' : '')} role="dialog" aria-modal="true" aria-label="Hall 2 zone guide">
          <div className="hb-backdrop" onClick={close} />
          <div className="hb-big">
            <div className="hb-spread">
              {!single ? <div className="hb-page hb-left">{left}</div> : null}
              <div className="hb-page hb-right">{right}</div>
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
                <div className="hb-cover-back">{single ? <div className="hb-paper hb-blank" /> : page(view * 2)}</div>
              </div>
            </div>
            <div className="hb-controls">
              <button type="button" onClick={prev} disabled={view === 0 || phase !== 'open'}>
                ← PREV
              </button>
              <span className="hb-where">
                {zone ? <i style={{ background: zone.color }} /> : null}
                {zone ? 'ZONE ' + zone.id : ''} · {view + 1} / {views}
              </span>
              <button type="button" ref={nextRef} onClick={next} disabled={phase !== 'open'} className="hb-next">
                {view >= views - 1 ? 'CLOSE BOOK ✕' : 'NEXT →'}
              </button>
            </div>
            <button type="button" className="hb-x" onClick={close} aria-label="Close the zone guide">
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
