'use client';
// A stadium LED board: the Expo's headline facts scrolling past between sport icons
// (src/app/sporty.css).
import Marquee from './Marquee';

const ICONS = {
  football: (
    <g>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7l4 3-1.5 4.5h-5L8 10z" fill="currentColor" />
    </g>
  ),
  cricket: (
    <g>
      <path d="M15 3l3 3-9 11-3-3z" fill="currentColor" />
      <path d="M6 14l-3 6 1 1 6-3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="17" r="2.5" fill="currentColor" />
    </g>
  ),
  hockey: (
    <g>
      <path d="M8 2v15a3 3 0 0 0 3 3h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="18" cy="9" r="2.5" fill="currentColor" />
    </g>
  ),
  shuttle: (
    <g>
      <path d="M6 4l6 10 6-10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 4l3 10 3-10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="3" fill="currentColor" />
    </g>
  ),
  runner: (
    <g>
      <circle cx="14" cy="4" r="2.4" fill="currentColor" />
      <path d="M8 21l3-6 3 2 1 4M11 15l1-6 4 3 3-1M12 9l-4 1-2 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  trophy: (
    <g>
      <path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="currentColor" />
      <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 21l1-4h4l1 4" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </g>
  ),
};

const ITEMS = [
  ['football', '3 DAYS'],
  ['cricket', '4 EVENT ZONES'],
  ['hockey', '213 STALLS'],
  ['shuttle', '25 PAVILIONS'],
  ['runner', '40+ COUNTRIES'],
  ['trophy', 'BE A SPORT. SHAPE THE FUTURE.'],
  ['football', 'BHARAT MANDAPAM · NEW DELHI'],
  ['cricket', '3,000 B2B MEETINGS'],
];

export default function SportsTicker() {
  return (
    <div className="led" role="presentation">
      <Marquee
        dir="left"
        seconds={36}
        repeat={1}
        items={ITEMS}
        render={([icon, text], i, copy) => (
          <span className="led-item" aria-hidden={copy || undefined}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              {ICONS[icon]}
            </svg>
            <span className={i % 3 === 2 ? 'led-hot' : undefined}>{text}</span>
          </span>
        )}
      />
    </div>
  );
}
