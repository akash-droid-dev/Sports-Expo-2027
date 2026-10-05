'use client';
// The official Yashobhoomi 360° virtual tour, opened on request in a full-screen viewer over the
// page (from the Home journey finale, VenueStage.jsx). The tour is a heavy third-party 3D view,
// so it only loads while the viewer is open and is removed again on close. Until it has loaded,
// the venue photo shows behind a short message instead of a black frame.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { withBase } from '@/lib/base';
import { VENUE_TOUR_URL } from '@/lib/venue';
import { VENUE_PHOTO } from './VenueScene';
import './tour-viewer.css';

export default function TourViewer({ open, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const back = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    back.current = document.activeElement;
    const y = scrollY;
    const html = document.documentElement;
    html.classList.add('tour-open');
    // The page stays where it is underneath: wheel, touch and scroll keys over the viewer are
    // swallowed here (inside the tour's own frame they never reach the page). Hiding the page's
    // overflow instead resets this layout's scroll position to the top.
    const SCROLL_KEYS = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown']);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (SCROLL_KEYS.has(e.key) && !(e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName))) e.preventDefault();
    };
    const stop = (e) => e.preventDefault();
    // A wheel or swipe inside the tour that the tour doesn't use passes on to the page: the
    // page snaps back (unseen, the viewer covers it).
    const hold = () => {
      if (scrollY !== y) scrollTo(0, y);
    };
    const dlg = dialogRef.current;
    addEventListener('keydown', onKey);
    addEventListener('scroll', hold, { passive: true });
    if (dlg) {
      dlg.addEventListener('wheel', stop, { passive: false });
      dlg.addEventListener('touchmove', stop, { passive: false });
    }
    const t = setTimeout(() => closeRef.current && closeRef.current.focus({ preventScroll: true }), 30);
    return () => {
      clearTimeout(t);
      removeEventListener('keydown', onKey);
      removeEventListener('scroll', hold);
      if (dlg) {
        dlg.removeEventListener('wheel', stop);
        dlg.removeEventListener('touchmove', stop);
      }
      html.classList.remove('tour-open');
      if (Math.abs(scrollY - y) > 1) scrollTo(0, y);
      // Back to where the viewer was opened from, without scrolling the page (the link sits in
      // the pinned journey, so a scrolling focus would jump to another point of the journey).
      if (back.current && back.current.focus) back.current.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div ref={dialogRef} className="tv" role="dialog" aria-modal="true" aria-label="Yashobhoomi 360° virtual tour">
      <div className="tv-stage" style={{ backgroundImage: `url("${withBase(VENUE_PHOTO)}")` }}>
        {!loaded ? (
          <div className="tv-wait" aria-live="polite">
            <span className="tv-spin" aria-hidden="true" />
            Loading the tour…
          </div>
        ) : null}
        <iframe
          className={'tv-frame' + (loaded ? ' is-loaded' : '')}
          src={VENUE_TOUR_URL}
          title="Yashobhoomi 360° virtual tour"
          allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking; autoplay"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="tv-bar">
        <span className="tv-title">Yashobhoomi · 360° venue tour</span>
        <a className="tv-btn" href={VENUE_TOUR_URL} target="_blank" rel="noopener noreferrer">
          Open in new tab ↗
        </a>
        <button ref={closeRef} type="button" className="tv-btn tv-close" onClick={onClose}>
          Close ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
