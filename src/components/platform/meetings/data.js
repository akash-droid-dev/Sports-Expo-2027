'use client';
// Data for the Meetings portal: the signed-in person's bookings, requests to their company,
// sessions with seats, their business pass, and the directory of people and companies to meet.
import '@/data/ise';
import { BOOKING_COLUMNS } from '@/lib/platform/bookings';
import { useLive } from '@/lib/platform/hooks';

export function useMeetings(user) {
  return useLive(
    user?.id ?? null,
    async (sb) => {
      const [mine, sessions, pass, visitor, exhibitor, listed] = await Promise.all([
        sb.from('bookings').select(BOOKING_COLUMNS).eq('requester_id', user.id).order('created_at', { ascending: false }),
        sb.from('booking_sessions').select('*').eq('active', true).order('day').order('starts'),
        sb.from('business_passes').select('*').eq('user_id', user.id).maybeSingle(),
        sb.from('visitors').select('full_name,organisation,country,category,designation,status').eq('user_id', user.id).maybeSingle(),
        sb.from('exhibitors').select('id,company,contact_name,country,type,status').eq('owner_id', user.id).maybeSingle(),
        sb.from('exhibitors').select('id,company,country,sector,city').eq('listed', true).eq('status', 'active').order('company'),
      ]);
      for (const r of [mine, sessions]) if (r.error) throw r.error;
      let incoming = [];
      if (exhibitor.data) {
        const r = await sb.from('bookings').select(BOOKING_COLUMNS).eq('counterpart_exhibitor_id', exhibitor.data.id).order('created_at', { ascending: false });
        if (r.error) throw r.error;
        incoming = r.data.filter((b) => b.requester_id !== user.id);
      }
      return {
        mine: mine.data,
        incoming,
        sessions: sessions.data,
        pass: pass.data,
        visitor: visitor.data,
        exhibitor: exhibitor.data,
        listed: listed.data || [],
      };
    },
    user
      ? [
          { table: 'bookings' },
          { table: 'booking_sessions' },
          { table: 'business_passes', filter: 'user_id=eq.' + user.id },
        ]
      : [],
  );
}

/** Who the person is, for a new request (from their visitor or exhibitor registration). */
export function profileOf(data, user) {
  const v = data?.visitor;
  const x = data?.exhibitor;
  return {
    requester_name: v?.full_name || x?.contact_name || '',
    requester_org: x?.company || v?.organisation || '',
    requester_country: x?.country || v?.country || '',
    requester_role: v?.category || (x ? 'Exhibitor' : ''),
    email: user?.email || '',
  };
}

/**
 * Everyone you can ask for a meeting: exhibitors registered on the platform (they answer the
 * request themselves), plus the companies, startups, buyers, delegations and bodies on the
 * website (the organisers answer for them).
 */
export function directory(listed = [], ownExhibitorId = null) {
  const D = typeof window !== 'undefined' ? window.ISE : null;
  const out = [];
  const seen = new Set();
  const add = (o) => {
    const k = o.org.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(o);
  };
  for (const e of listed) {
    if (e.id === ownExhibitorId) continue;
    add({ org: e.company, country: e.country, about: [e.sector, e.city].filter(Boolean).join(' · '), exhibitorId: e.id, registered: true });
  }
  if (D) {
    D.exhibitors.forEach((e) => add({ org: e.name, country: e.country, about: `${e.sector} · Stall ${e.stall}` }));
    D.startups.forEach((s) => add({ org: s.name, country: s.country, about: `Startup · ${s.tech} · ${s.sport}` }));
    D.matches.forEach((m) => add({ org: m.name, country: m.country, about: `${m.role} · ${m.seeking}` }));
    D.countries.forEach((c) => add({ org: c.name + ' pavilion delegation', country: c.name, about: c.profile }));
    D.states.forEach((s) => add({ org: s.name + ' state sports delegation', country: 'India', about: s.identity }));
  }
  add({ org: 'Ministry of Youth Affairs & Sports (sample)', country: 'India', about: 'Government of India' });
  add({ org: 'Sample National Federation', country: 'India', about: 'National sports federation' });
  return out;
}
