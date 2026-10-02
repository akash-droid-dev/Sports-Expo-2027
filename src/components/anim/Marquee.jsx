'use client';
// A strip that scrolls continuously, left to right (`dir="right"`) or right to left. Items are
// repeated so the loop is seamless; the copies are hidden from screen readers and keyboard.
// Hovering or focusing pauses it. Without motion it becomes a plain sideways-scrolling row.
import { Fragment } from 'react';

export default function Marquee({ items, render, dir = 'left', seconds = 40, repeat = 2, className = '', paused = false, label }) {
  const half = [];
  for (let r = 0; r < repeat; r++) items.forEach((it, i) => half.push({ it, i, copy: r > 0 }));
  return (
    <div data-anim="" className={'mq ' + (dir === 'right' ? 'mq-right' : 'mq-left') + (paused ? ' is-paused' : '') + (className ? ' ' + className : '')} aria-label={label} role={label ? 'region' : undefined}>
      <div className="mq-track" style={{ '--mq-dur': seconds + 's' }}>
        {[0, 1].map((h) => (
          <Fragment key={h}>
            {half.map(({ it, i, copy }, k) => (
              <Fragment key={h + '-' + k}>{render(it, i, copy || h > 0)}</Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
