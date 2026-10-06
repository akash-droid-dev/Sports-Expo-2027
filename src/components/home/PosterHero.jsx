'use client';
// Home banner: the "India's first global platform for sports" key visual (01), with its
// lettering rebuilt as live text in the poster's own type and colours: Montserrat Black italic
// for the wordmark and headline, Bebas Neue for EXHIBIT | ENGAGE | EXCEL, the figures and the
// dates. (The expo logo is in the header, so the banner shows the key figures and a countdown
// where the poster had its logo.)
// On landscape screens the artwork and the text share one 16:9 stage that covers the banner, so
// every line sits where it sits on the poster; on portrait screens the text stacks above the
// runner. As the page curtain lifts: the runner glides in, the wordmark's letters rise one by
// one, each headline line is unveiled by a saffron or green wipe, the dates box draws itself and
// the figures count up.
// Artwork: public/assets/hero-poster-*.webp (scripts/brand/backgrounds.mjs, logos and text removed).
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import './poster-hero.css';

const OPENS = Date.parse('2027-10-15T10:00:00+05:30');
const FIGURES = [
  { n: 213, label: 'Stalls' },
  { n: 25, label: 'Pavilions' },
  { n: 40, plus: true, label: 'Countries' },
  { n: 3, label: 'Days' },
];

function useCurtainLifted() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t = 0;
    const go = () => {
      clearTimeout(t);
      t = setTimeout(() => setOn(true), 80);
    };
    const curtain = document.getElementById('page-curtain');
    if (!curtain || curtain.classList.contains('is-gone')) {
      go();
      return () => clearTimeout(t);
    }
    const mo = new MutationObserver(() => curtain.classList.contains('is-gone') && go());
    mo.observe(curtain, { attributes: true, attributeFilter: ['class'] });
    const fallback = setTimeout(go, 2600);
    return () => (mo.disconnect(), clearTimeout(fallback), clearTimeout(t));
  }, []);
  return on;
}

/** Counts from 0 to `to` once `start` is true (ease-out), after `delay` ms. */
function useCount(to, start, delay) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(to);
    let raf = 0;
    const t0 = performance.now() + delay;
    const step = (t) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 1300));
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, start, delay]);
  return v;
}

function useCountdown() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  if (now == null) return null;
  const ms = Math.max(0, OPENS - now);
  return { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60 };
}

/** The word as letters that rise one after another (screen readers get the word). */
function Letters({ text, d }) {
  return (
    <span className="ph-letters" style={{ '--d': d }} aria-hidden="true">
      {Array.from(text).map((c, j) => (
        <span key={j} style={{ '--j': j }}>
          {c}
        </span>
      ))}
    </span>
  );
}

function Figure({ f, on, i }) {
  const v = useCount(f.n, on, 900 + i * 120);
  return (
    <div className="ph-fig ph-rise" style={{ '--d': 700 + i * 90 }}>
      <b>
        {v}
        {f.plus ? '+' : ''}
      </b>
      <span>{f.label}</span>
    </div>
  );
}

export default function PosterHero({ enter, skip }) {
  const on = useCurtainLifted();
  const cd = useCountdown();
  const src = (w) => withBase(`/assets/hero-poster-${w}.webp`);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <section data-screen-label="01 Entry" className={'ph' + (on ? ' is-on' : '')}>
      <div className="ph-stage">
        <div className="ph-art" aria-hidden="true">
          <img
            src={src(1440)}
            srcSet={`${src(828)} 828w, ${src(1440)} 1440w, ${src(2560)} 2560w`}
            sizes="(max-aspect-ratio: 6/5) 190vw, max(100vw, (100vh - 60px) * 1.78)"
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <p className="ph-strip ph-rise" style={{ '--d': 100 }}>
          <span>SCROLL TO TRAVEL · EARTH → INDIA → DELHI → YASHOBHOOMI → HALL 2</span>
          <span>28.5549° N · 77.0446° E</span>
        </p>

        <div className="ph-word">
          <h1 className="ph-h1" aria-label="India Sports Expo 2027: India’s first global platform for sports">
            <span className="ph-wl">
              <Letters text="India" d={150} />
            </span>
            <span className="ph-wl">
              <Letters text="Sports" d={290} />
            </span>
            <span className="ph-wl ph-expo">
              <Letters text="Expo" d={450} />
              <span className="ph-year ph-rise" style={{ '--d': 620 }} aria-hidden="true">
                <span>20</span>
                <span>27</span>
              </span>
            </span>
          </h1>
          <p className="ph-tag ph-rise" style={{ '--d': 680 }}>
            Be a sport. Shape the future.
          </p>
        </div>

        <div className="ph-figs" aria-label="Key figures">
          <div className="ph-fig-grid">
            {FIGURES.map((f, i) => (
              <Figure key={f.label} f={f} on={on} i={i} />
            ))}
          </div>
          <p className="ph-count ph-rise" style={{ '--d': 1500 }}>
            <i aria-hidden="true" />
            {cd ? (
              <>
                Opens in <b>{cd.d}</b> days <b>{pad(cd.h)}</b> hrs <b>{pad(cd.m)}</b> min
              </>
            ) : (
              <>Opens 15 October 2027</>
            )}
          </p>
        </div>

        <p className="ph-eee">
          <span className="o ph-slide" style={{ '--d': 800 }}>
            Exhibit
          </span>
          <i className="bar o ph-rise" style={{ '--d': 880 }} aria-hidden="true" />
          <span className="n ph-slide" style={{ '--d': 920 }}>
            Engage
          </span>
          <i className="bar g ph-rise" style={{ '--d': 1000 }} aria-hidden="true" />
          <span className="g ph-slide" style={{ '--d': 1040 }}>
            Excel.
          </span>
        </p>

        <p className="ph-head" aria-hidden="true">
          <span className="ph-wipe l1" style={{ '--d': 1050, '--bar': 'var(--red)' }}>
            <span>India’s first</span>
          </span>
          <span className="ph-wipe l2" style={{ '--d': 1200, '--bar': 'var(--saffron)' }}>
            <span>Global platform</span>
          </span>
          <span className="ph-wipe l3" style={{ '--d': 1350, '--bar': 'var(--green)' }}>
            <span>For sports</span>
          </span>
        </p>

        <p className="ph-date ph-draw" style={{ '--d': 1500 }}>
          <span>15-16-17 October, 2027</span>
          <span>Yashobhoomi, Delhi</span>
        </p>

        <div className="ph-actions ph-rise" style={{ '--d': 1700 }}>
          <button className="ph-btn fill" onClick={enter}>
            Enter the expo ↓
          </button>
          <button className="ph-btn line" onClick={skip}>
            Skip intro
          </button>
        </div>
      </div>
    </section>
  );
}
