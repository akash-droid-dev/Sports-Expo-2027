// The India Sports Expo 2027 logo, built from its two parts so the ring can turn: the ring
// (public/brand/ring.png, columns 0–643 of the original 1580 × 639 artwork) spins clockwise
// while the wordmark (columns 644–1579) stays put. Both sit exactly where they are in the
// original, so the still logo is unchanged. `onDark` uses the white-lettered wordmark.
import { withBase } from '@/lib/base';

export default function BrandLogo({ onDark = true, className = '' }) {
  return (
    <span className={'brand-logo' + (className ? ' ' + className : '')} role="img" aria-label="India Sports Expo 2027">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-ring" src={withBase('/brand/ring.png')} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-word" src={withBase(onDark ? '/brand/wordmark-on-dark.png' : '/brand/wordmark.png')} alt="" />
    </span>
  );
}
