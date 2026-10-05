'use client';
// Demo clips for sessions (public/media/videos.json: session id → clip). Two forms:
//   <DemoVideo id="x1" />        a player: poster first, plays on click; `live` autoplays muted
//                                while on screen. Nothing downloads until it plays.
//   <DemoVideo id="x1" thumb />  a card thumbnail: the poster image, previewing the clip muted
//                                while hovered.
// Phones and tablets show only the poster on cards, and players wait for a tap.
import { useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import { isLite } from '@/lib/device';

let clipsP = null;
const loadClips = () =>
  (clipsP ||= fetch(withBase('/media/videos.json'))
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({})));
const url = (p) => withBase('/media/' + p);

function useClip(id) {
  const [clip, setClip] = useState(null);
  useEffect(() => {
    let on = true;
    loadClips().then((all) => on && setClip(all[id] || null));
    return () => { on = false; };
  }, [id]);
  return clip;
}

const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' };

export default function DemoVideo({ id, thumb = false, live = false }) {
  const clip = useClip(id);
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Live: play muted while on screen, pause when scrolled away.
  useEffect(() => {
    const v = ref.current;
    if (!live || !clip || !v || isLite() || !('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().then(() => setPlaying(true)).catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [live, clip]);

  // Thumbnails preview the clip while the card they sit in is hovered.
  useEffect(() => {
    const v = ref.current;
    const card = thumb && v && v.closest('a,button');
    if (!card || !matchMedia('(hover: hover)').matches) return;
    const on = () => { v.preload = 'auto'; v.play().catch(() => {}); };
    const off = () => v.pause();
    card.addEventListener('pointerenter', on);
    card.addEventListener('pointerleave', off);
    return () => { card.removeEventListener('pointerenter', on); card.removeEventListener('pointerleave', off); };
  }, [thumb, clip]);

  if (!clip) return <span style={{ ...fill, background: '#1A1A1C' }} />;

  if (thumb && isLite()) {
    return <img src={url(clip.poster)} alt="" loading="lazy" decoding="async" style={fill} />;
  }
  if (thumb) {
    return (
      <span style={{ ...fill, overflow: 'hidden', background: '#1A1A1C' }}>
        <video ref={ref} src={url(clip.mp4)} poster={url(clip.poster)} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} style={fill} />
      </span>
    );
  }

  return (
    <span style={{ ...fill, background: '#0E0E0F' }}>
      <video
        ref={ref}
        src={url(clip.mp4)}
        poster={url(clip.poster)}
        muted
        loop
        playsInline
        preload="none"
        controls={playing}
        onPlay={() => setPlaying(true)}
        style={fill}
      />
      {!playing ? (
        <button
          type="button"
          aria-label="Play video"
          onClick={() => ref.current && ref.current.play().catch(() => {})}
          style={{ ...fill, border: 0, background: 'rgba(14,14,15,.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1.5px solid #fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', background: 'rgba(14,14,15,.4)' }}>▶</span>
        </button>
      ) : null}
      <a
        href={clip.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: 'absolute', right: '8px', top: '8px', zIndex: 2, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'rgba(14,14,15,.7)', color: '#BDB9B0', fontFamily: "var(--f-label)", fontSize: '9px', letterSpacing: '0.08em', padding: '3px 6px', textDecoration: 'none' }}
      >
        Demo clip · {clip.credit}
      </a>
    </span>
  );
}
