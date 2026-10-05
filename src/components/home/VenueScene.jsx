'use client';
// The Yashobhoomi venue backdrop for the Home journey finale. On computers it is the official
// virtual tour, embedded live and moving behind the zone cards; phones, tablets and computers
// without hardware 3D show a photo of the venue, slowly drifting (or a local 360° panorama,
// see src/lib/venue.js).
// So the tour never shows as a black or half-drawn frame: it loads early, wakes up behind the
// still-visible globe shortly before the venue appears (`warm`), and fades in over the venue
// photo only once it has loaded and had a moment to draw.
import { useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import { VENUE_PANORAMA, VENUE_TOUR_URL } from '@/lib/venue';
import { isLite, noGpu } from '@/lib/device';

export const VENUE_PHOTO = '/media/yasho-exterior.webp';
// Time the tour gets to draw, after loading and waking, before it fades in.
const SETTLE_MS = 1500;

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

// `active`: mount (load) the scene. `warm`: the tour may draw (it is about to be seen).
// `visible`: the venue is showing. Neither warm nor visible: the scene sleeps (venue-stage.css).
export default function VenueScene({ active, warm = false, visible = true }) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [shown, setShown] = useState(false);
  const awake = warm || visible;
  useEffect(() => {
    if (!active || mounted) return;
    setMounted(true);
    predecode([VENUE_PANORAMA || VENUE_PHOTO]);
  }, [active, mounted]);

  // Fade the tour in once it has loaded and been awake for a moment.
  const awakeAt = useRef(0);
  useEffect(() => {
    if (!awake) {
      awakeAt.current = 0;
      return;
    }
    if (!awakeAt.current) awakeAt.current = Date.now();
    if (!loaded || shown) return;
    const t = setTimeout(() => setShown(true), Math.max(0, SETTLE_MS - (Date.now() - awakeAt.current)));
    return () => clearTimeout(t);
  }, [awake, loaded, shown]);

  const pano = VENUE_PANORAMA ? withBase(VENUE_PANORAMA) : '';
  const tour = mounted && !pano && !isLite() && !noGpu();
  return (
    <div className={'vs-scene' + (awake ? '' : ' is-asleep') + (shown ? ' tour-on' : '')} aria-hidden="true">
      {mounted && pano ? <div className="vs-pano" style={{ backgroundImage: `url("${pano}")` }} /> : null}
      {mounted && !pano ? <div className="vs-photo" style={{ backgroundImage: `url("${withBase(VENUE_PHOTO)}")` }} /> : null}
      {tour ? (
        <iframe
          className={'vs-tour' + (shown ? ' is-shown' : '')}
          src={VENUE_TOUR_URL}
          title="Yashobhoomi virtual tour"
          tabIndex={-1}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoaded(true)}
        />
      ) : null}
    </div>
  );
}
