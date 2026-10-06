'use client';
// The companion app (/mobile): the same accounts, data and rules as the website, shaped for a
// phone. Home, Programme, Map, Pass and More; sign in with the same code, register in the app,
// and the pass shows the real accreditation card once the organisers approve it. Lists come
// from the live website catalogue (window.ISE, src/lib/platform/live.js), so admin edits show
// here too. On a computer it is shown inside a phone frame; on a phone it fills the screen.
import { useEffect, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import HallPlan from '@/screens/HallPlan';
import { withBase } from '@/lib/base';
import { sendCode, verifyCode } from '@/lib/platform/auth';
import { errorText, getClient } from '@/lib/platform/client';
import { useLive, useSession, useStaffRole } from '@/lib/platform/hooks';
import { loadFields } from '@/lib/platform/records';
import Badge from '../Badge';
import VisitorForm from '../VisitorForm';
import { Pill, Spinner } from '../ui';

const SAVED_KEY = 'ise-app-saved';

function useISE() {
  const [, setRev] = useState(0);
  useEffect(() => {
    const bump = () => setRev((r) => r + 1);
    window.addEventListener('ise:update', bump);
    const t = window.ISE ? 0 : setInterval(() => window.ISE && (clearInterval(t), bump()), 80);
    return () => (window.removeEventListener('ise:update', bump), clearInterval(t));
  }, []);
  return typeof window !== 'undefined' ? window.ISE : null;
}

function useSaved() {
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'));
    } catch {}
  }, []);
  const toggle = (id) =>
    setSaved((s) => {
      const n = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(n));
      } catch {}
      return n;
    });
  return [saved, toggle];
}

/** The signed-in person's registration, company and form fields, kept live. */
function useMe(user) {
  return useLive(
    user?.id ?? null,
    async (sb) => {
      const [v, x, f] = await Promise.all([
        sb.from('visitors').select('*').eq('user_id', user.id).maybeSingle(),
        sb.from('exhibitors').select('id,company,status,listed,stall_code,zone').eq('owner_id', user.id).maybeSingle(),
        loadFields(sb, 'visitor'),
      ]);
      if (v.error) throw v.error;
      return { visitor: v.data, exhibitor: x.data, fields: f };
    },
    user ? [{ table: 'visitors', filter: 'user_id=eq.' + user.id }, { table: 'exhibitors', filter: 'owner_id=eq.' + user.id }, { table: 'form_fields' }] : [],
  );
}

const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  programme: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 12h3M8 16h6',
  map: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  pass: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 10h4M8 14h8M15 9.5h2',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
};
function Icon({ d, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function statusOf(s) {
  return s.status === 'live' ? 'live' : s.status === 'ondemand' ? 'ondemand' : 'upcoming';
}

function SessionRow({ s, D, saved, toggle }) {
  const st = statusOf(s);
  const z = D.Z[s.zone];
  const speakers = (s.speakers || []).map((id) => D.sp?.(id)?.name).filter(Boolean).join(', ');
  return (
    <div className="ma-row">
      <div className="ma-time">
        <b>{s.time}</b>
        <span>{s.end}</span>
      </div>
      <div className="ma-row-main">
        <span className="ma-tag" style={{ color: z?.color }}>
          {st === 'live' ? <i className="ma-live" /> : null}
          {st === 'live' ? 'LIVE · ' : st === 'ondemand' ? 'ON DEMAND · ' : ''}
          {s.stage}
        </span>
        <b>{s.title}</b>
        {speakers ? <span className="ma-sub">{speakers}</span> : null}
      </div>
      <button className={'ma-star' + (saved.includes(s.id) ? ' on' : '')} onClick={() => toggle(s.id)} aria-pressed={saved.includes(s.id)} aria-label={saved.includes(s.id) ? 'Remove from My Expo' : 'Save to My Expo'}>
        {saved.includes(s.id) ? '★' : '☆'}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- Sign in */
function SignInPanel({ title = 'Sign in', text }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [code, setCode] = useState('');
  const [test, setTest] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const send = async (e) => {
    e.preventDefault();
    const a = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) return setErr('Enter a valid email address.');
    setBusy(true);
    setErr('');
    try {
      const r = await sendCode(a);
      setTest(r.test);
      setEmail(a);
      setStep('code');
    } catch (x) {
      setErr(errorText(x));
    } finally {
      setBusy(false);
    }
  };
  const verify = async (e) => {
    e.preventDefault();
    if (code.replace(/\D/g, '').length < 6) return setErr('Enter the 6-digit code.');
    setBusy(true);
    setErr('');
    try {
      await verifyCode(email, code.replace(/\D/g, ''));
    } catch (x) {
      setErr(errorText(x));
      setBusy(false);
    }
  };
  return (
    <div className="ma-pad">
      <div className="ma-card">
        <span className="pf-kicker">India Sports Expo 2027</span>
        <h2 className="ma-h">{step === 'code' ? (test ? 'Enter your code' : 'Check your email') : title}</h2>
        <p className="ma-sub" style={{ margin: '6px 0 16px' }}>
          {step === 'code' ? (test ? `Enter the 6-digit sign-in code for ${email}.` : `We sent a code to ${email}.`) : text || 'Your email and a one-time code. No password.'}
        </p>
        {step === 'email' ? (
          <form onSubmit={send} className="ma-stack">
            <input className="pf-input" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {err ? <span className="pf-err">{err}</span> : null}
            <button className="pf-btn orange block" disabled={busy}>
              {busy ? <Spinner /> : null}Continue
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="ma-stack">
            <input className="pf-input pf-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} autoFocus />
            {err ? <span className="pf-err">{err}</span> : null}
            <button className="pf-btn block" disabled={busy}>
              {busy ? <Spinner /> : null}Sign in
            </button>
            <button type="button" className="pf-link" onClick={() => (setStep('email'), setErr(''))}>
              Use another email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Tabs */
function Home({ D, user, me, go, saved, toggle }) {
  const v = me?.visitor;
  const name = v?.full_name?.split(' ')[0];
  const live = D.sessions.filter((s) => s.status === 'live');
  const next = D.sessions.filter((s) => s.status === 'upcoming').slice(0, 3);
  const passCard = !user
    ? { k: 'YOUR PASS', t: 'Sign in to register', d: 'Register once; your accreditation card lives here.', c: '#F07C12' }
    : !v
      ? { k: 'YOUR PASS', t: 'Register to visit', d: 'A short form with a photo and ID.', c: '#F07C12' }
      : v.status === 'approved'
        ? { k: 'ACCREDITED', t: 'Show my pass', d: v.badge_code + ' · ' + v.category, c: '#2FC27A' }
        : v.status === 'changes'
          ? { k: 'ACTION NEEDED', t: 'Update your registration', d: v.admin_note || 'The organisers asked for a change.', c: '#3D8BFF' }
          : v.status === 'rejected'
            ? { k: 'NOT APPROVED', t: 'See details', d: v.admin_note || 'Contact the organisers.', c: '#FF6B6B' }
            : { k: 'UNDER REVIEW', t: 'Registration received', d: 'Your card appears here once approved.', c: '#FFD23F' };
  return (
    <>
      <div className="ma-hero">
        <div className="ma-hero-top">
          <BrandLogo />
          <span className="ma-day">
            <i className="ma-live" /> 2027 · YASHOBHOOMI
          </span>
        </div>
        <h1 className="ma-hello">{name ? `Hello, ${name}` : 'Welcome to the Expo'}</h1>
        <button className="ma-passcard" style={{ '--c': passCard.c }} onClick={() => go('pass')}>
          <span className="ma-tag" style={{ color: passCard.c }}>
            {passCard.k}
          </span>
          <b>{passCard.t} →</b>
          <span>{passCard.d}</span>
        </button>
      </div>
      <div className="ma-pad">
        <div className="ma-quick">
          {[
            ['pass', 'My pass', ICONS.pass],
            ['map', 'Hall map', ICONS.map],
            ['programme', 'Programme', ICONS.programme],
            ['exhibitors', 'Exhibitors', 'M4 6h16M4 12h16M4 18h10'],
          ].map(([id, t, d]) => (
            <button key={id} onClick={() => go(id === 'exhibitors' ? 'more' : id, id === 'exhibitors' ? 'exhibitors' : null)}>
              <Icon d={d} />
              <b>{t}</b>
            </button>
          ))}
        </div>
        {live.length ? (
          <>
            <h3 className="ma-sec">Live now</h3>
            {live.map((s) => (
              <SessionRow key={s.id} s={s} D={D} saved={saved} toggle={toggle} />
            ))}
          </>
        ) : null}
        <h3 className="ma-sec">Up next</h3>
        {next.map((s) => (
          <SessionRow key={s.id} s={s} D={D} saved={saved} toggle={toggle} />
        ))}
        <h3 className="ma-sec">Four zones</h3>
        <div className="ma-zones">
          {D.zones.map((z) => (
            <button key={z.id} style={{ '--z': z.color, '--t': z.tint }} onClick={() => go('map', z.id)}>
              <span>{z.id}</span>
              <b>{z.name}</b>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function Programme({ D, saved, toggle }) {
  const days = [...new Set(D.sessions.map((s) => s.day))].sort();
  const [day, setDay] = useState(days.find((d) => D.sessions.some((s) => s.day === d && s.status === 'live')) || days[0]);
  const [mine, setMine] = useState(false);
  const list = D.sessions.filter((s) => (mine ? saved.includes(s.id) : s.day === day)).sort((a, b) => a.day - b.day || (a.time < b.time ? -1 : 1));
  return (
    <div className="ma-pad">
      <h1 className="ma-title">Programme</h1>
      <div className="ma-chips">
        {days.map((d) => (
          <button key={d} className="pf-chip" aria-pressed={!mine && day === d} onClick={() => (setMine(false), setDay(d))}>
            Day {d}
          </button>
        ))}
        <button className="pf-chip" aria-pressed={mine} onClick={() => setMine(true)}>
          ★ My Expo {saved.length ? `(${saved.length})` : ''}
        </button>
      </div>
      {list.length ? list.map((s) => <SessionRow key={s.id} s={s} D={D} saved={saved} toggle={toggle} />) : <p className="ma-empty">{mine ? 'Tap ☆ on any session to save it here.' : 'No sessions this day.'}</p>}
    </div>
  );
}

function MapTab({ D, zone: zone0 }) {
  const [zone, setZone] = useState(zone0 || null);
  const [cl, setCl] = useState(null);
  useEffect(() => setZone(zone0 || null), [zone0]);
  const clusters = D.clusters.filter((c) => !zone || c.zone === zone);
  const cluster = cl && D.clusters.find((c) => c.id === cl);
  const exs = cluster ? D.exhibitors.filter((e) => e.cluster === cluster.id) : [];
  return (
    <div className="ma-pad">
      <h1 className="ma-title">Hall 2</h1>
      <div className="ma-chips">
        <button className="pf-chip" aria-pressed={!zone} onClick={() => (setZone(null), setCl(null))}>
          All
        </button>
        {D.zones.map((z) => (
          <button key={z.id} className="pf-chip" aria-pressed={zone === z.id} onClick={() => (setZone(z.id), setCl(null))}>
            {z.id} · {z.short}
          </button>
        ))}
      </div>
      <div className="ma-plan">
        <HallPlan activeZone={zone} labels={false} selectedCluster={cl} onCluster={(c) => (setCl(c.id), setZone(c.zone))} />
      </div>
      <p className="ma-sub" style={{ margin: '8px 0 14px' }}>
        Tap an area on the plan or below. Main Entrance and Registration are at the bottom centre.
      </p>
      {cluster ? (
        <div className="ma-card" style={{ borderTop: `4px solid ${D.Z[cluster.zone].color}` }}>
          <span className="ma-tag" style={{ color: D.Z[cluster.zone].color }}>
            ZONE {cluster.zone} · {cluster.meta}
          </span>
          <h2 className="ma-h">{cluster.name}</h2>
          {exs.length ? (
            exs.map((e) => (
              <div key={e.id} className="ma-mini">
                <b>{e.name}</b>
                <span>{e.stall}</span>
              </div>
            ))
          ) : (
            <p className="ma-sub">Exhibitors are announced as stalls are allocated.</p>
          )}
          <button className="pf-link" style={{ marginTop: 10 }} onClick={() => setCl(null)}>
            Back to all areas
          </button>
        </div>
      ) : (
        clusters.map((c) => (
          <button key={c.id} className="ma-row ma-btnrow" onClick={() => setCl(c.id)}>
            <span className="ma-dot" style={{ background: D.Z[c.zone].color }} />
            <div className="ma-row-main">
              <b>{c.name}</b>
              <span className="ma-sub">
                Zone {c.zone} · {c.meta}
              </span>
            </div>
            <span className="ma-chev">›</span>
          </button>
        ))
      )}
    </div>
  );
}

function PassTab({ user, me, reload }) {
  const [editing, setEditing] = useState(false);
  // A new state (registered, approved…) starts at the top of the screen, not where the form was.
  const state = (me?.visitor?.status || 'none') + editing;
  useEffect(() => {
    document.querySelector('.ma-scroll')?.scrollTo(0, 0);
  }, [state]);
  if (!user) return <SignInPanel title="Your pass" text="Sign in with your email to register or see your accreditation card." />;
  if (!me) return <div className="ma-center"><Spinner /></div>;
  const v = me.visitor;
  if (!v || editing) {
    return (
      <div className="ma-pad">
        <h1 className="ma-title">{v ? 'Edit details' : 'Register to visit'}</h1>
        <p className="ma-sub" style={{ marginBottom: 16 }}>
          {v ? 'Saving sends your registration back for review.' : 'Your details, a photo for your card and an ID. The organisers review every registration.'}
        </p>
        <div className="ma-card">
          <VisitorForm user={user} fields={me.fields} row={v} onDone={() => (setEditing(false), reload())} onCancel={v ? () => setEditing(false) : undefined} />
        </div>
      </div>
    );
  }
  const steps = [
    ['Registered', 'done'],
    ['Review', v.status === 'pending' || v.status === 'changes' ? 'now' : 'done'],
    [v.status === 'rejected' ? 'Not approved' : 'Card issued', v.status === 'approved' ? 'done' : ''],
  ];
  return (
    <div className="ma-pad">
      <div className="ma-row-head">
        <h1 className="ma-title">My pass</h1>
        <Pill status={v.status} />
      </div>
      <Badge visitor={v} />
      <div className="ma-card" style={{ marginTop: 18 }}>
        <div className="pf-steps">
          {steps.map(([t, c]) => (
            <div key={t} className={'pf-step ' + c}>
              {t}
            </div>
          ))}
        </div>
        <p className="ma-sub" style={{ marginTop: 14 }}>
          {v.status === 'approved'
            ? 'Show the QR code at the entrance. Turn your screen brightness up.'
            : v.status === 'pending'
              ? 'The organisers are reviewing your registration. This screen updates by itself.'
              : v.status === 'changes'
                ? 'Please update your details and submit again.'
                : 'Contact the organisers if you think this is a mistake.'}
        </p>
        {v.admin_note && v.status !== 'approved' ? (
          <div className={'pf-note ' + (v.status === 'rejected' ? 'bad' : 'info')} style={{ marginTop: 12 }}>
            {v.admin_note}
          </div>
        ) : null}
        {v.status === 'pending' || v.status === 'changes' ? (
          <button className="pf-btn ghost block" style={{ marginTop: 14 }} onClick={() => setEditing(true)}>
            Edit details
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Exhibitors({ D, back }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const t = q.trim().toLowerCase();
  const list = D.exhibitors.filter((e) => !t || [e.name, e.sector, e.city, e.stall, ...(e.products || [])].join(' ').toLowerCase().includes(t));
  const e = open && D.exhibitors.find((x) => x.id === open);
  if (e) {
    const z = D.Z[e.zone];
    return (
      <div className="ma-pad">
        <button className="pf-link" onClick={() => setOpen(null)}>
          ‹ Exhibitors
        </button>
        <div className="ma-card" style={{ marginTop: 12, borderTop: `4px solid ${z?.color}` }}>
          {e.logoUrl ? <div className="ma-logo" style={{ backgroundImage: `url("${e.logoUrl}")` }} /> : null}
          <span className="ma-tag" style={{ color: z?.color }}>
            ZONE {e.zone} · {e.stall}
          </span>
          <h2 className="ma-h">{e.name}</h2>
          <p className="ma-sub">
            {[e.city, e.type].filter(Boolean).join(' · ')}
          </p>
          {e.about ? <p style={{ marginTop: 10 }}>{e.about}</p> : null}
          <dl className="ma-kv">
            <dt>Sector</dt>
            <dd>{e.sector}</dd>
            {e.products?.length ? (
              <>
                <dt>Products</dt>
                <dd>{e.products.join(', ')}</dd>
              </>
            ) : null}
            {e.seeking ? (
              <>
                <dt>Looking for</dt>
                <dd>{e.seeking}</dd>
              </>
            ) : null}
          </dl>
          {e.website ? (
            <a className="pf-btn ghost block" style={{ marginTop: 14 }} href={e.website} target="_blank" rel="noreferrer">
              Website
            </a>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div className="ma-pad">
      {back ? (
        <button className="pf-link" onClick={back}>
          ‹ More
        </button>
      ) : null}
      <h1 className="ma-title">Exhibitors</h1>
      <input className="pf-input" placeholder="Search company, product, stall…" value={q} onChange={(x) => setQ(x.target.value)} style={{ marginBottom: 12 }} />
      {list.map((x) => (
        <button key={x.id} className="ma-row ma-btnrow" onClick={() => setOpen(x.id)}>
          <span className="ma-dot" style={{ background: D.Z[x.zone]?.color }} />
          <div className="ma-row-main">
            <b>{x.name}</b>
            <span className="ma-sub">{x.sector}</span>
          </div>
          <span className="ma-stall">{x.stall}</span>
        </button>
      ))}
      {!list.length ? <p className="ma-empty">No exhibitor matches “{q}”.</p> : null}
    </div>
  );
}

const VISIT = [
  ['Venue', 'Exhibition Hall 2, Yashobhoomi (IICC), Sector 25, Dwarka, New Delhi'],
  ['Metro', 'Airport Express Line to Yashobhoomi Dwarka Sector 25; covered walkway to the hall'],
  ['Airport', 'IGI Airport, about 20–30 minutes by car'],
  ['Parking', 'P2, closest to Hall 2; accessible bays by the lift core'],
  ['Entry', 'Main Entrance and Registration; show your pass QR code'],
];

function More({ D, user, me, sub, go }) {
  const { role } = useStaffRole(user);
  if (sub === 'exhibitors') return <Exhibitors D={D} back={() => go('more')} />;
  if (sub === 'visit')
    return (
      <div className="ma-pad">
        <button className="pf-link" onClick={() => go('more')}>
          ‹ More
        </button>
        <h1 className="ma-title">Plan your visit</h1>
        {VISIT.map(([a, b]) => (
          <div key={a} className="ma-row">
            <div className="ma-row-main">
              <b>{a}</b>
              <span className="ma-sub">{b}</span>
            </div>
          </div>
        ))}
        <a className="pf-btn ghost block" style={{ marginTop: 16 }} href="https://maps.google.com/?q=Yashobhoomi+IICC+Dwarka+Sector+25" target="_blank" rel="noreferrer">
          Directions in Google Maps
        </a>
      </div>
    );
  const ex = me?.exhibitor;
  const rows = [
    ['Exhibitors', `${D.exhibitors.length} companies`, () => go('more', 'exhibitors')],
    ['Plan your visit', 'Metro, parking, entry', () => go('more', 'visit')],
    ex
      ? ['Exhibitor portal', `${ex.company} · ${ex.stall_code || 'stall to be allocated'}`, withBase('/portal/')]
      : ['Exhibit at the Expo', 'Register your company', withBase('/portal/register/')],
    ...(role ? [['Admin', `Signed in as ${role}`, withBase('/admin/')]] : []),
    ['Full website', 'Hall 2 twin, zones, business exchange', withBase('/')],
  ];
  return (
    <div className="ma-pad">
      <h1 className="ma-title">More</h1>
      {user ? (
        <div className="ma-card ma-account">
          <span className="pf-avatar">{(user.email || '?')[0]}</span>
          <div style={{ minWidth: 0 }}>
            <b>{me?.visitor?.full_name || 'Signed in'}</b>
            <span className="ma-sub" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </span>
          </div>
        </div>
      ) : (
        <button className="ma-card ma-account" onClick={() => go('pass')} style={{ width: '100%', textAlign: 'left', border: 0, font: 'inherit' }}>
          <span className="pf-avatar">?</span>
          <div>
            <b>Sign in</b>
            <span className="ma-sub" style={{ display: 'block' }}>
              Register and keep your pass on this phone
            </span>
          </div>
        </button>
      )}
      {rows.map(([t, d, act]) =>
        typeof act === 'string' ? (
          <a key={t} className="ma-row ma-btnrow" href={act}>
            <div className="ma-row-main">
              <b>{t}</b>
              <span className="ma-sub">{d}</span>
            </div>
            <span className="ma-chev">›</span>
          </a>
        ) : (
          <button key={t} className="ma-row ma-btnrow" onClick={act}>
            <div className="ma-row-main">
              <b>{t}</b>
              <span className="ma-sub">{d}</span>
            </div>
            <span className="ma-chev">›</span>
          </button>
        ),
      )}
      {user ? (
        <button
          className="pf-btn ghost block"
          style={{ marginTop: 18 }}
          onClick={async () => {
            const sb = await getClient();
            await sb.auth.signOut();
            go('home');
          }}
        >
          Sign out
        </button>
      ) : null}
      <p className="ma-sub" style={{ textAlign: 'center', marginTop: 22 }}>
        India Sports Expo 2027 · Be a sport. Shape the future.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- App */
export default function CompanionApp({ framed = true, start }) {
  const D = useISE();
  const { ready, user } = useSession();
  const { data: me, reload } = useMe(user);
  const [saved, toggle] = useSaved();
  const [nav, setNav] = useState(() => start || { tab: 'home', sub: null });
  const go = (tab, sub = null) => {
    setNav({ tab, sub });
    document.querySelector('.ma-scroll')?.scrollTo(0, 0);
  };
  const tabs = [
    ['home', 'Home', ICONS.home],
    ['programme', 'Programme', ICONS.programme],
    ['map', 'Map', ICONS.map],
    ['pass', 'Pass', ICONS.pass],
    ['more', 'More', ICONS.more],
  ];
  const meData = user ? me : null;
  const body =
    !D || !ready ? (
      <div className="ma-center">
        <Spinner />
      </div>
    ) : nav.tab === 'home' ? (
      <Home D={D} user={user} me={meData} go={go} saved={saved} toggle={toggle} />
    ) : nav.tab === 'programme' ? (
      <Programme D={D} saved={saved} toggle={toggle} />
    ) : nav.tab === 'map' ? (
      <MapTab D={D} zone={nav.sub} />
    ) : nav.tab === 'pass' ? (
      <PassTab user={user} me={meData} reload={reload} />
    ) : (
      <More D={D} user={user} me={meData} sub={nav.sub} go={go} />
    );
  return (
    <div className={'pf ma' + (framed ? ' ma-framed' : '')}>
      {framed ? (
        <div className="ma-status">
          <span>10:18</span>
          <span className="ma-notch" />
          <span>5G ▮▮▮</span>
        </div>
      ) : null}
      <div className={'ma-scroll' + (nav.tab === 'home' ? ' dark-top' : '')}>{body}</div>
      <nav className="ma-tabs" aria-label="App">
        {tabs.map(([id, t, d]) => (
          <button key={id} aria-current={nav.tab === id ? 'page' : undefined} onClick={() => go(id)}>
            <Icon d={d} size={21} />
            <span>{t}</span>
            {id === 'pass' && meData?.visitor?.status === 'approved' ? <i className="ma-badge-dot" /> : null}
          </button>
        ))}
      </nav>
    </div>
  );
}
