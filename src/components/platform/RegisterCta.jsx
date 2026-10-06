'use client';
// Registration entry on the Attend and Exhibit pages: the real forms live on their own pages
// (/register, /portal/register); this shows what happens and where to go, and who is signed in.
import { withBase } from '@/lib/base';
import { maybeSignedIn } from '@/lib/platform/config';

const STEPS = {
  visitor: [
    ['Sign in', 'With your email and a one-time code. No password.'],
    ['Short form', 'Your details, a photo for the card and an ID.'],
    ['Review', 'The organisers check every registration.'],
    ['Your card', 'Appears in My pass with a QR code for the gates.'],
  ],
  exhibitor: [
    ['Sign in', 'With your work email and a one-time code.'],
    ['Company details', 'Profile, logo, zone and stall product.'],
    ['Your portal', 'Opens at once: products, team and documents.'],
    ['Stall & listing', 'The organisers allocate your stall and list you on the site.'],
  ],
};

export default function RegisterCta({ kind = 'visitor' }) {
  const visitor = kind === 'visitor';
  const back = typeof window !== 'undefined' && maybeSignedIn();
  return (
    <div className="rcta">
      <ol className="rcta-steps">
        {STEPS[kind].map(([t, d], i) => (
          <li key={t}>
            <span className="rcta-n">{i + 1}</span>
            <b>{t}</b>
            <span>{d}</span>
          </li>
        ))}
      </ol>
      <div className="rcta-actions">
        <a className="rcta-btn" href={withBase(visitor ? '/register/' : '/portal/register/')}>
          {visitor ? 'Register to visit' : 'Register your company'} <span aria-hidden="true">→</span>
        </a>
        <a className="rcta-link" href={withBase(visitor ? '/me/' : '/portal/')}>
          {back ? (visitor ? 'Open My pass' : 'Open your exhibitor portal') : visitor ? 'Already registered? See your pass' : 'Already registered? Open your portal'}
        </a>
        <a className="rcta-link" href={withBase(visitor ? '/portal/register/' : '/register/')}>
          {visitor ? 'Exhibiting instead? Company registration' : 'Visiting instead? Visitor registration'}
        </a>
      </div>
    </div>
  );
}
