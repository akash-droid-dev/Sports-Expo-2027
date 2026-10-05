'use client';
// Map pane for "Getting to Yashobhoomi" on the Explore page.
// Google Maps (keyless embed) shows the route for the selected travel tab; the design's
// MapLibre route schematic stays mounted underneath and is one click away.
// Phones and tablets load neither map until asked (src/lib/device.js): both are heavy there.
import { useState } from 'react';
import { withBase } from '@/lib/base';
import { isLite } from '@/lib/device';

const VENUE = 'Yashobhoomi (IICC), Sector 25, Dwarka, New Delhi';
// Origin and Google travel mode for each tab: r = public transport, d = driving.
const ROUTES = {
  Metro: { from: 'New Delhi Metro Station, New Delhi', mode: 'r' },
  Airport: { from: 'Indira Gandhi International Airport Terminal 3, New Delhi', mode: 'd' },
  'Car / Taxi': { from: 'Connaught Place, New Delhi', mode: 'd' },
  'Hotel Shuttle': { from: 'Aerocity, New Delhi', mode: 'd' },
};

function embedUrl(travel) {
  const r = ROUTES[travel];
  const q = (s) => encodeURIComponent(s);
  if (!r) return `https://www.google.com/maps?q=${q('Yashobhoomi parking, Dwarka Sector 25, New Delhi')}&z=16&output=embed`;
  return `https://www.google.com/maps?saddr=${q(r.from)}&daddr=${q(VENUE)}&dirflg=${r.mode}&output=embed`;
}

function openUrl(travel) {
  const r = ROUTES[travel];
  const q = (s) => encodeURIComponent(s);
  if (!r) return `https://www.google.com/maps/search/?api=1&query=${q('Yashobhoomi parking Dwarka Sector 25')}`;
  const mode = r.mode === 'r' ? 'transit' : 'driving';
  return `https://www.google.com/maps/dir/?api=1&origin=${q(r.from)}&destination=${q(VENUE)}&travelmode=${mode}`;
}

const mono = { fontFamily: "var(--f-label)", fontSize: '10px', letterSpacing: '0.14em' };

// Stand-in shown before a map is loaded on phones: a photo of the venue.
function MapCover({ label, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `#0E0E0F center / cover no-repeat url("${withBase('/media/yasho-plaza.webp')}")`, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', padding: '56px 16px 64px', background: 'linear-gradient(transparent, rgba(14,14,15,.85))', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ ...mono, color: '#E3E0D8' }}>{label}</span>
        {children}
      </div>
    </div>
  );
}

export default function GettingThereMap({ travel, cityMapRef }) {
  const [view, setView] = useState(() => (isLite() ? 'none' : 'google'));
  const tab = (id, label) => (
    <button
      type="button"
      onClick={() => setView(id)}
      aria-pressed={view === id}
      style={{ ...mono, height: '30px', padding: '0 10px', border: 0, borderRight: id === 'google' ? '1px solid #0E0E0F' : 0, background: view === id ? '#0E0E0F' : '#fff', color: view === id ? '#fff' : '#0E0E0F', cursor: 'pointer' }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ position: 'relative', background: '#E3E0D8', minHeight: '480px', overflow: 'hidden' }}>
      <div ref={cityMapRef} data-want={view === 'schematic' || !isLite() ? '1' : undefined} style={{ position: 'absolute', inset: '0', zIndex: 0, visibility: view === 'schematic' ? 'visible' : 'hidden' }} />
      {view === 'none' ? <MapCover label="Tap Google Maps or Route schematic above to load a map" /> : null}
      {view === 'google' ? (
        <iframe
          key={travel}
          title={`Google Maps: route to Yashobhoomi (${travel})`}
          src={embedUrl(travel)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', border: 0, background: '#E3E0D8', zIndex: 1 }}
        />
      ) : null}
      <div style={{ position: 'absolute', left: '16px', top: '16px', display: 'flex', border: '1px solid #0E0E0F', background: '#fff', zIndex: 3 }}>
        {tab('google', 'GOOGLE MAPS')}
        {tab('schematic', 'ROUTE SCHEMATIC')}
      </div>
      <a
        href={openUrl(travel)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...mono, position: 'absolute', right: '16px', bottom: '16px', zIndex: 3, background: '#F07C12', color: '#0E0E0F', border: '1px solid #0E0E0F', padding: '8px 10px', textDecoration: 'none', fontWeight: 700 }}
      >
        Open directions ↗
      </a>
    </div>
  );
}

/** Google map of the venue itself, for the Home page's "Getting to Yashobhoomi". */
export function VenueMap() {
  const q = encodeURIComponent(VENUE);
  const [load, setLoad] = useState(() => !isLite());
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#E3E0D8', border: '1px solid #0E0E0F' }}>
      {!load ? (
        <MapCover label="YASHOBHOOMI · SECTOR 25, DWARKA">
          <button type="button" onClick={() => setLoad(true)} style={{ ...mono, background: '#fff', color: '#0E0E0F', border: '1px solid #0E0E0F', padding: '10px 12px', fontWeight: 700, cursor: 'pointer' }}>
            Load Google map
          </button>
        </MapCover>
      ) : null}
      {load ? <iframe
        title="Google Maps: Yashobhoomi, Sector 25, Dwarka"
        src={`https://www.google.com/maps?q=${q}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      /> : null}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...mono, position: 'absolute', right: '12px', top: '12px', zIndex: 2, background: '#F07C12', color: '#0E0E0F', border: '1px solid #0E0E0F', padding: '8px 10px', textDecoration: 'none', fontWeight: 700 }}
      >
        Open in Google Maps ↗
      </a>
    </div>
  );
}
