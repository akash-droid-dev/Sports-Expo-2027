'use client';
// The Yashobhoomi venue backdrop for the Home journey finale: a photo of the venue, slowly
// drifting (or a local 360° panorama rotated continuously, see src/lib/venue.js).
// It used to embed the official virtual tour live on computers: a full-screen third-party 3D
// view, drawn under four glass cards, that made the end of the journey stutter and blank out
// on laptops. The tour is now a link in the finale (VenueStage.jsx).
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import { VENUE_PANORAMA } from '@/lib/venue';

export const VENUE_PHOTO = '/media/yasho-exterior.webp';

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

// `visible` is false while the venue is still faded out behind the globe: the scene then sleeps
// (venue-stage.css) and doesn't drift.
export default function VenueScene({ active, visible = true }) {
  // Mount once the journey gets close, then keep it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!active || mounted) return;
    setMounted(true);
    predecode([VENUE_PANORAMA || VENUE_PHOTO]);
  }, [active, mounted]);

  const pano = VENUE_PANORAMA ? withBase(VENUE_PANORAMA) : '';
  return (
    <div className={'vs-scene' + (visible ? '' : ' is-asleep')} aria-hidden="true">
      {mounted && pano ? <div className="vs-pano" style={{ backgroundImage: `url("${pano}")` }} /> : null}
      {mounted && !pano ? <div className="vs-photo" style={{ backgroundImage: `url("${withBase(VENUE_PHOTO)}")` }} /> : null}
    </div>
  );
}
