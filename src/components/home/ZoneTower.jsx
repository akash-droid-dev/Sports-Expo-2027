'use client';
// Home "05 The Four Worlds" as a live, rotating four-sided standee. The section pins while you
// scroll: the tower turns to each zone's face (A red, B purple, C blue, D green), the camera
// dollies in until the face fills the screen, and the face lights up as a screen with that
// zone's numbers, areas, plan, featured exhibitors and what is on now; then it pulls back and
// turns to the next zone. The rail jumps to a zone. Styles: zone-tower.css.
// Scroll work is done on refs (no React render per frame) and only while the section is near.
import { useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import '@/data/ise';
import './zone-tower.css';

const ramp = (x, a, b) => Math.max(0, Math.min(1, (x - a) / (b - a)));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function zoneData(D, z) {
  const cl = D.clusters.filter((c) => c.zone === z.id);
  const stalls = cl.filter((c) => c.kind === 'stalls').reduce((n, c) => n + c.n, 0);
  const pav = cl.filter((c) => c.kind === 'pav').reduce((n, c) => n + c.n, 0);
  let featured = D.exhibitors.filter((e) => e.zone === z.id).slice(0, 3).map((e) => ({ name: e.name, meta: 'Stall ' + e.stall }));
  if (z.id === 'A') featured = D.states.slice(0, 3).map((s) => ({ name: s.name + ' pavilion', meta: s.identity }));
  if (z.id === 'D') featured = D.countries.slice(0, 3).map((c) => ({ name: c.name + ' pavilion', meta: c.companies + ' companies · ' + c.pav }));
  const zs = D.sessions.filter((s) => s.zone === z.id);
  const live = zs.find((s) => s.status === 'live');
  const next = zs.find((s) => s.status === 'upcoming');
  const session = live ? { label: 'LIVE NOW', s: live } : next ? { label: 'NEXT UP', s: next } : zs[0] ? { label: 'ON DEMAND', s: zs[0] } : null;
  return { cl, stalls, pav, featured, session };
}

// The whole hall, with this zone's areas lit.
function MiniPlan({ D, z }) {
  return (
    <svg className="zt-plan" viewBox="0 0 1000 500" aria-hidden="true">
      <rect x="4" y="4" width="992" height="492" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      <rect x="478" y="10" width="44" height="480" fill="rgba(240,124,18,.35)" />
      {D.clusters.map((c) => {
        const on = c.zone === z.id;
        return <rect key={c.id} x={c.x} y={c.y} width={c.w} height={c.h} fill={on ? '#fff' : 'rgba(255,255,255,.08)'} fillOpacity={on ? 0.92 : 1} stroke={on ? '#fff' : 'rgba(255,255,255,.2)'} strokeWidth="2" className={on ? 'is-on' : ''} />;
      })}
    </svg>
  );
}

function Screen({ D, z, n, active }) {
  const d = zoneData(D, z);
  const nums = [
    ['Areas', d.cl.length],
    d.stalls ? ['Stalls', d.stalls] : null,
    d.pav ? ['Pavilions', d.pav] : null,
  ].filter(Boolean);
  return (
    <div className={'zt-screen-in' + (active ? ' is-on' : '')}>
      <div className="zt-col zt-col-main">
        <span className="zt-kicker">
          <i />
          ZONE {z.id} · {n} OF 4
        </span>
        <h3 className="zt-name">{z.name}</h3>
        <p className="zt-blurb">{z.blurb}</p>
        <div className="zt-nums">
          {nums.map(([k, v]) => (
            <span key={k}>
              <b data-count={v}>{v}</b>
              {k}
            </span>
          ))}
        </div>
        <a className="zt-enter" href={withBase('/zones#zone-' + z.id.toLowerCase())}>
          Enter Zone {z.id} →
        </a>
      </div>
      <div className="zt-col zt-col-areas">
        <span className="zt-label">AREAS</span>
        <ol className="zt-areas">
          {d.cl.map((c) => (
            <li key={c.id}>
              <span>{c.name}</span>
              <em>{c.meta}</em>
            </li>
          ))}
        </ol>
      </div>
      <div className="zt-col zt-col-side">
        <span className="zt-label">AT BHARAT MANDAPAM</span>
        <MiniPlan D={D} z={z} />
        <span className="zt-label">FEATURED</span>
        <ul className="zt-feat">
          {d.featured.map((f) => (
            <li key={f.name}>
              <b>{f.name}</b>
              <em>{f.meta}</em>
            </li>
          ))}
        </ul>
        {d.session ? (
          <div className={'zt-live' + (d.session.label === 'LIVE NOW' ? ' is-live' : '')}>
            <span>{d.session.label}</span>
            <b>{d.session.s.title}</b>
            <em>
              Day {d.session.s.day} · {d.session.s.time} · {d.session.s.stage}
            </em>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ZoneTower() {
  const D = typeof window !== 'undefined' ? window.ISE : null;
  const root = useRef(null);
  const cam = useRef(null);
  const tower = useRef(null);
  const screen = useRef(null);
  const glow = useRef(null);
  const bar = useRef(null);
  const [zone, setZone] = useState(0);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setReduced(true);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced || !D) return;
    let raf = 0, near = false, lastZone = -1, lastShown = null;
    const frame = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - (innerHeight - 60);
      const p = Math.max(0, Math.min(0.9999, (60 - r.top) / span));
      const seg = Math.min(3, Math.floor(p * 4));
      const s = p * 4 - seg;
      const turn = ease(ramp(s, 0, 0.2));
      const angle = seg === 0 ? -28 + 28 * turn : (seg - 1 + turn) * 90;
      const dolly = ease(ramp(s, 0.22, 0.42)) * (1 - ease(ramp(s, 0.8, 0.97)));
      const show = ramp(s, 0.36, 0.46) * (1 - ramp(s, 0.78, 0.86));
      const t = tower.current;
      if (t) {
        t.style.transform = `translateZ(calc(var(--tw) / -2)) rotateY(${-angle}deg)`;
        t.style.setProperty('--dolly', dolly.toFixed(3));
        // Light from the front: faces turned away get darker.
        const faces = t.querySelectorAll('.zt-face-shade');
        for (let i = 0; i < faces.length; i++) {
          const c = Math.cos(((i * 90 - angle) * Math.PI) / 180);
          faces[i].style.opacity = Math.max(0, Math.min(0.85, (1 - c) * 0.95)).toFixed(3);
        }
      }
      if (cam.current) cam.current.style.transform = `scale(${1 + dolly * 0.85})`;
      const sc = screen.current;
      if (sc) {
        sc.style.visibility = show > 0.01 ? 'visible' : 'hidden';
        sc.style.opacity = Math.min(1, show * 3).toFixed(3);
        // The screen grows out of the face: clipped to the face's outline, opening to full size.
        const face = t && t.children[seg];
        if (face && show > 0.01 && show < 1) {
          const fr = face.getBoundingClientRect(), sr = sc.getBoundingClientRect(), k = 1 - ease(show);
          sc.style.clipPath = sc.style.webkitClipPath = `inset(${Math.max(0, fr.top - sr.top) * k}px ${Math.max(0, sr.right - fr.right) * k}px ${Math.max(0, sr.bottom - fr.bottom) * k}px ${Math.max(0, fr.left - sr.left) * k}px)`;
        } else sc.style.clipPath = sc.style.webkitClipPath = show >= 1 ? 'none' : 'inset(50%)';
      }
      if (glow.current) glow.current.style.opacity = 0.55 + dolly * 0.45;
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
      if (seg !== lastZone) {
        lastZone = seg;
        setZone(seg);
      }
      const on = show > 0.3;
      if (on !== lastShown) {
        lastShown = on;
        setShown(on);
      }
    };
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) onScroll();
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    frame();
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, D]);

  // Numbers count up each time a zone's screen lights up.
  useEffect(() => {
    if (!shown || !screen.current) return;
    const els = screen.current.querySelectorAll('.zt-screen-in.is-on b[data-count]');
    const t0 = performance.now();
    let raf = 0;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      els.forEach((b) => (b.textContent = String(Math.round(+b.dataset.count * e))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown, zone]);

  if (!D) return null;
  const z = D.zones[zone];
  const go = (i) => {
    const el = root.current;
    if (!el) return;
    const span = el.offsetHeight - (innerHeight - 60);
    const top = el.getBoundingClientRect().top + scrollY - 60;
    scrollTo({ top: top + span * ((i + 0.6) / 4), behavior: 'smooth' });
  };

  if (reduced) {
    return (
      <div data-anim="" className="zt zt-static">
        {D.zones.map((zz, i) => (
          <div key={zz.id} className="zt-screen zt-screen-static" style={{ '--zc': zz.color }}>
            <Screen D={D} z={zz} n={i + 1} active />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={root} data-anim="" className="zt" style={{ '--zc': z.color }}>
      <div data-anim="" className="zt-stage">
        <div className="zt-head">
          <span className="zt-head-k">05 — THE FOUR WORLDS</span>
          <span className="zt-head-live">
            <i /> LIVE STANDEE
          </span>
        </div>
        <div ref={glow} className="zt-glow" aria-hidden="true" />
        <div className="zt-floor" aria-hidden="true" />
        <div className="zt-scene">
          <div ref={cam} className="zt-cam">
            <div ref={tower} className="zt-tower">
              {D.zones.map((zz, i) => {
                const d = zoneData(D, zz);
                return (
                  <button type="button" key={zz.id} className={'zt-face' + (i === zone ? ' is-front' : '')} style={{ '--fc': zz.color, '--i': i }} onClick={() => go(i)} tabIndex={-1} aria-hidden="true">
                    <span className="zt-face-led" />
                    <span className="zt-face-shade" />
                    <span className="zt-face-top">Zone</span>
                    <span className="zt-face-letter">{zz.id}</span>
                    <span className="zt-face-name">{zz.name}</span>
                    <span className="zt-face-meta">
                      {d.cl.length} areas{d.stalls ? ' · ' + d.stalls + ' stalls' : ''}
                      {d.pav ? ' · ' + d.pav + ' pavilions' : ''}
                    </span>
                    <span className="zt-face-foot">India Sports Expo 2027</span>
                  </button>
                );
              })}
              <span className="zt-cap" aria-hidden="true" />
            </div>
            <span className="zt-plinth" aria-hidden="true" />
          </div>
        </div>
        <div ref={screen} className="zt-screen" style={{ visibility: 'hidden', opacity: 0 }}>
          {D.zones.map((zz, i) => (i === zone ? <Screen key={zz.id} D={D} z={zz} n={i + 1} active={shown} /> : null))}
        </div>
        <nav className="zt-rail" aria-label="Zones">
          <span className="zt-rail-track">
            <span ref={bar} className="zt-rail-bar" />
          </span>
          {D.zones.map((zz, i) => (
            <button type="button" key={zz.id} className={i === zone ? 'is-on' : ''} style={{ '--fc': zz.color }} onClick={() => go(i)} aria-label={'Zone ' + zz.id + ': ' + zz.name}>
              {zz.id}
            </button>
          ))}
        </nav>
        <span className="zt-hint">Scroll to turn the standee</span>
      </div>
    </div>
  );
}
