'use client';
// Home banner: the "India's first global platform for sports" key visual (01), with its
// lettering rebuilt as live text in the poster's own type and colours: Montserrat Black italic
// for the wordmark and headline, Bebas Neue for EXHIBIT | ENGAGE | EXCEL and the dates.
// On landscape screens the artwork and the text share one 16:9 stage that covers the banner, so
// every line sits where it sits on the poster; on portrait screens the text stacks above the
// runner. The lines rise in one after another as the page curtain lifts.
// Artwork: public/assets/hero-poster-*.webp (scripts/brand/backgrounds.mjs, logos and text removed).
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import './poster-hero.css';

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

export default function PosterHero({ enter, skip }) {
  const on = useCurtainLifted();
  const src = (w) => withBase(`/assets/hero-poster-${w}.webp`);
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

        <p className="ph-strip ph-l" style={{ '--i': 0 }}>
          <span>SCROLL TO TRAVEL · EARTH → INDIA → DELHI → YASHOBHOOMI → HALL 2</span>
          <span>28.5549° N · 77.0446° E</span>
        </p>

        <div className="ph-brand">
          <img className="ph-ring ph-l" style={{ '--i': 0 }} src={withBase('/brand/ring.png')} alt="" />
          <div className="ph-word">
            <h1 className="ph-h1" aria-label="India Sports Expo 2027: India’s first global platform for sports">
              <span className="ph-l" style={{ '--i': 1 }}>India</span>
              <span className="ph-l" style={{ '--i': 2 }}>Sports</span>
              <span className="ph-l ph-expo" style={{ '--i': 3 }}>
                Expo
                <span className="ph-year">
                  <span>20</span>
                  <span>27</span>
                </span>
              </span>
            </h1>
            <p className="ph-tag ph-l" style={{ '--i': 4 }}>
              Be a sport. Shape the future.
            </p>
          </div>
        </div>

        <p className="ph-eee ph-l" style={{ '--i': 5 }}>
          <span className="o">Exhibit</span>
          <i className="bar o" aria-hidden="true" />
          <span className="n">Engage</span>
          <i className="bar g" aria-hidden="true" />
          <span className="g">Excel.</span>
        </p>

        <p className="ph-head" aria-hidden="true">
          <span className="ph-l l1" style={{ '--i': 6 }}>India’s first</span>
          <span className="ph-l l2" style={{ '--i': 7 }}>Global platform</span>
          <span className="ph-l l3" style={{ '--i': 8 }}>For sports</span>
        </p>

        <p className="ph-date ph-l" style={{ '--i': 9 }}>
          <span>15-16-17 October, 2027</span>
          <span>Yashobhoomi, Delhi</span>
        </p>

        <div className="ph-actions ph-l" style={{ '--i': 10 }}>
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
