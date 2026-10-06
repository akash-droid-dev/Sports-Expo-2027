'use client';
// The Expo's key figures and opening time, with the count-up and countdown hooks shared by the
// Home banner (src/components/home/PosterHero.jsx) and the companion app's home screen.
import { useEffect, useState } from 'react';

export const OPENS = Date.parse('2027-10-15T10:00:00+05:30');
export const FIGURES = [
  { n: 213, label: 'Stalls' },
  { n: 25, label: 'Pavilions' },
  { n: 40, plus: true, label: 'Countries' },
  { n: 3, label: 'Days' },
];

/** Counts from 0 to `to` once `start` is true (ease-out), after `delay` ms. */
export function useCount(to, start, delay) {
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

/** Days, hours and minutes to the opening, updated every 30 s (null before mount). */
export function useCountdown() {
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

export const pad2 = (n) => String(n).padStart(2, '0');
