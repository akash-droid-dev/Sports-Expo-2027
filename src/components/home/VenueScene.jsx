'use client';
// The Yashobhoomi venue backdrop for the Home journey finale. On computers it is the official
// virtual tour, embedded live and moving behind the zone cards; phones, tablets and computers
// without hardware 3D show a photo of the venue, slowly drifting (or a local 360° panorama,
// see src/lib/venue.js).
// The tour starts loading as soon as the Earth journey begins and wakes up behind the still
// visible globe before the venue appears (`warm`), so on arrival the live tour is already
// running: no still image first. The photo only stands in if the tour can't be loaded.
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import { VENUE_PANORAMA, VENUE_TOUR_URL } from '@/lib/venue';
import { isLite, noGpu } from '@/lib/device';

export const VENUE_PHOTO = '/media/yasho-exterior.webp';
// If the tour hasn't loaded this long after the venue appears, the photo stands in.
const FALLBACK_MS = 4000;

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
  const [tourMode, setTourMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const awake = warm || visible;
  useEffect(() => {
    if (!active || mounted) return;
    setMounted(true);
    const t = !VENUE_PANORAMA && !isLite() && !noGpu();
    setTourMode(t);
    if (!t) predecode([VENUE_PANORAMA || VENUE_PHOTO]);
  }, [active, mounted]);

  // Only if the tour still hasn't loaded a while after the venue came on screen (no connection,
  // site down) does the venue photo stand in for it.
  useEffect(() => {
    if (!tourMode || loaded || failed || !visible) return;
    const t = setTimeout(() => setFailed(true), FALLBACK_MS);
    return () => clearTimeout(t);
  }, [tourMode, loaded, failed, visible]);

  const pano = VENUE_PANORAMA ? withBase(VENUE_PANORAMA) : '';
  const photo = mounted && !pano && (!tourMode || (failed && !loaded));
  return (
    <div className={'vs-scene' + (awake ? '' : ' is-asleep') + (tourMode && loaded ? ' tour-on' : '')} aria-hidden="true">
      {mounted && pano ? <div className="vs-pano" style={{ backgroundImage: `url("${pano}")` }} /> : null}
      {photo ? <div className="vs-photo" style={{ backgroundImage: `url("${withBase(VENUE_PHOTO)}")` }} /> : null}
      {tourMode ? (
        <iframe
          className={'vs-tour' + (loaded ? ' is-shown' : '')}
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
