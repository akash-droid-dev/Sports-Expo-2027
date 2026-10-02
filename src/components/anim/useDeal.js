'use client';
// Card-deal timing shared by the Home card strips (WatchShuffle, ProductShuffle): the cards wait
// stacked like a deck ('stack'), are dealt out into a row when the strip scrolls into view
// ('deal'), and the row starts moving once the last card has landed ('roll').
import { useEffect, useState } from 'react';

export const DEAL_STEP_MS = 110;
const DEAL_MS = 900;

export default function useDeal(ref, dealt) {
  const [phase, setPhase] = useState('stack');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return setPhase('roll');
    let t1, t2;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t1 = setTimeout(() => setPhase('deal'), 60);
        t2 = setTimeout(() => setPhase('roll'), 60 + DEAL_MS + dealt * DEAL_STEP_MS);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ref, dealt]);
  return phase;
}
