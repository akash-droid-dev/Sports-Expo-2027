'use client';
// The Bharat Mandapam backdrop for the Home journey finale: a muted film of the venue, playing
// on a loop behind the zone cards on phones, tablets and computers (files in src/lib/venue.js).
// It is mounted with nothing downloaded once the Earth journey begins (`active`), starts loading
// and playing behind the still visible globe just before the venue appears (`warm`), and pauses
// whenever the scene is asleep or scrolled out of view, so it never plays unseen. Its first frame is the poster,
// so there is no blank moment; visitors who prefer reduced motion see that still frame only.
import { useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import { venueVideoFor } from '@/lib/venue';

// Decode images ahead of time, so they don't hold up the frame in which they first appear.
export function predecode(srcs) {
  if (typeof Image === 'undefined') return;
  srcs.forEach((src) => {
    const im = new Image();
    im.decoding = 'async';
    im.src = withBase(src);
    if (im.decode) im.decode().catch(() => {});
  });
}

// `active`: mount the scene. `warm`: load and play (it is about to be seen).
// `visible`: the venue is showing. Neither warm nor visible: the scene sleeps and the film pauses.
export default function VenueScene({ active, warm = false, visible = true }) {
  const ref = useRef(null);
  const root = useRef(null);
  const [inView, setInView] = useState(false);
  const [file, setFile] = useState(null);
  const [still, setStill] = useState(false);
  const [playing, setPlaying] = useState(false);
  const awake = warm || visible;

  // Scrolled past the journey (or not yet reached it), the film pauses.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || file) return;
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const f = venueVideoFor();
    setFile(f);
    predecode([f.poster]);
  }, [active, file]);

  // Turning a phone or tablet swaps between the tall and the wide cut.
  useEffect(() => {
    if (!file) return;
    const mq = window.matchMedia('(orientation: portrait)');
    const swap = () => { const f = venueVideoFor(); if (f.src !== file.src) { setPlaying(false); setFile(f); } };
    mq.addEventListener ? mq.addEventListener('change', swap) : mq.addListener(swap);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', swap) : mq.removeListener(swap));
  }, [file]);

  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    if (awake && inView) {
      v.preload = 'auto';
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [awake, inView, still, file]);

  return (
    <div ref={root} className={'vs-scene' + (awake ? '' : ' is-asleep') + (playing ? ' film-on' : '')} aria-hidden="true">
      {file ? <div className="vs-still" style={{ backgroundImage: `url("${withBase(file.poster)}")` }} /> : null}
      {file && !still ? (
        <video
          key={file.src}
          ref={ref}
          className="vs-film"
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="none"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
        >
          <source src={withBase(file.src)} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
