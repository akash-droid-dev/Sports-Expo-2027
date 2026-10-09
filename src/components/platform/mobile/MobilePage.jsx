'use client';
// /mobile: on a phone the companion app fills the screen; on a computer or tablet it is shown in
// a phone frame, next to what it does. `?tab=pass` (home, programme, map, pass, more) opens a tab.
import { useEffect, useState } from 'react';
import { withBase } from '@/lib/base';
import CompanionApp from './CompanionApp';

const FEATURES = [
  ['Same account as the website', 'Sign in with your email and the one-time code; registrations, passes and exhibitor accounts are shared.'],
  ['Register and get the pass', 'Register in the app with a photo and ID. Once approved, the accreditation card with its QR code appears in Pass.'],
  ['Live programme', 'Sessions, stages and speakers from the organisers’ live programme. Save sessions to My Expo with ☆.'],
  ['Venue map', 'The expo floor plan by zone; tap an area to see who exhibits there.'],
  ['Exhibitors', 'Every listed company, with stall, products and what they are looking for.'],
  ['Updates by itself', 'Approvals, stall allocations and programme changes made by the organisers show up straight away.'],
];

export default function MobilePage() {
  const [phone, setPhone] = useState(null);
  const [start, setStart] = useState(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const tab = q.get('tab');
    if (tab) setStart({ tab, sub: q.get('sub') });
    const m = matchMedia('(max-width: 600px)');
    const on = () => setPhone(m.matches || q.get('frame') === '0');
    on();
    m.addEventListener?.('change', on);
    document.documentElement.classList.add('app-page');
    return () => m.removeEventListener?.('change', on);
  }, []);
  if (phone === null) return <div className="sc-host" />;
  if (phone) {
    return (
      <div className="sc-host ma-full">
        <CompanionApp framed={false} start={start} key={start?.tab || 'x'} />
      </div>
    );
  }
  return (
    <div className="sc-host pf ma-page">
      <div className="ma-page-in">
        <div className="ma-page-text">
          <a className="pf-kicker" href={withBase('/')} style={{ textDecoration: 'none' }}>
            ← India Sports Expo 2027
          </a>
          <h1>Companion app</h1>
          <p className="ma-lead">The Expo in your pocket: your pass, the programme and the venue map, on the same accounts and live data as the website. Try it here; on a phone this page opens the app full screen.</p>
          <div className="ma-feats">
            {FEATURES.map(([t, d]) => (
              <div key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ma-device">
          <CompanionApp framed start={start} key={start?.tab || 'x'} />
        </div>
      </div>
    </div>
  );
}
