'use client';
// The Yashobhoomi venue backdrop for the Home journey: a local 360° panorama rotated
// continuously, or else the official virtual tour embedded live (see src/lib/venue.js).
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import { VENUE_PANORAMA, VENUE_TOUR_URL } from '@/lib/venue';

export default function VenueScene({ active }) {
  // Mount once the journey gets close, then keep it (no reloading the tour on scroll back).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (active) setMounted(true);
  }, [active]);

  const pano = VENUE_PANORAMA ? withBase(VENUE_PANORAMA) : '';
  const mode = !mounted ? null : pano ? 'pano' : 'tour';

  return (
    <div className="vs-scene" aria-hidden="true">
      {mode === 'pano' ? <div className="vs-pano" style={{ backgroundImage: `url("${pano}")` }} /> : null}
      {mode === 'tour' ? (
        <iframe
          className="vs-tour"
          src={VENUE_TOUR_URL}
          title="Yashobhoomi virtual tour"
          tabIndex={-1}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : null}
    </div>
  );
}
