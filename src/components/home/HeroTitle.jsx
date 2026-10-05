'use client';
// Home hero headline: "India Sports Expo" rising in word by word, then "2027" in the logo's
// colours with each digit rolling into place like a scoreboard, a light sweep across the year
// and a colour line drawing in underneath; the location pill and the tagline follow
// (src/components/home/hero-title.css). It starts as the page curtain lifts.
// Each word and digit appears once in the page, so copying the title gives it as written.
import { useEffect, useState } from 'react';
import './hero-title.css';

const WORDS = ['India', 'Sports', 'Expo'];
const YEAR = '2027';
const TAGLINE = ['Play India.', 'Build together.', 'Stronger tomorrow.'];

export default function HeroTitle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t = 0;
    const go = () => {
      clearTimeout(t);
      t = setTimeout(() => setOn(true), 120);
    };
    const curtain = document.getElementById('page-curtain');
    if (!curtain || curtain.classList.contains('is-gone')) {
      go();
      return () => clearTimeout(t);
    }
    // Start as the curtain lifts (src/lib/motion.js), or after a moment regardless.
    const mo = new MutationObserver(() => {
      if (curtain.classList.contains('is-gone')) go();
    });
    mo.observe(curtain, { attributes: true, attributeFilter: ['class'] });
    const fallback = setTimeout(go, 2600);
    return () => {
      mo.disconnect();
      clearTimeout(fallback);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className={'ht' + (on ? ' is-on' : '')}>
      <span className="ht-pill">
        <span className="ht-live" aria-hidden="true" />
        Yashobhoomi, New Delhi
        <span className="ht-sep" aria-hidden="true" />
        Hall 2
        <span className="ht-sep" aria-hidden="true" />
        Dates provisional
      </span>
      <h1 className="ht-title">
        <span className="ht-line">
          {WORDS.map((w, i) => (
            <span key={w} className="ht-w" style={{ '--i': i }}>
              {w}
              {i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
        <span className="ht-line ht-year">
          {' '}
          {Array.from(YEAR).map((d, i) => (
            <span key={i} className="ht-d" style={{ '--i': i, '--n': d }}>
              {d}
            </span>
          ))}
        </span>
      </h1>
      <span className="ht-rule" aria-hidden="true" />
      <p className="ht-tag">
        {TAGLINE.map((t, i) => (
          <span key={t} className="ht-t" style={{ '--i': i }}>
            {t}
          </span>
        ))}
      </p>
    </div>
  );
}
