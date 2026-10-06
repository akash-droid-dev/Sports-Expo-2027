'use client';
// Dashboard: live counts and the latest registrations.
import { useLive } from '@/lib/platform/hooks';
import { Loading, Pill, fmtDate } from '../ui';

export default function Overview({ go }) {
  const { data, loading } = useLive(
    'overview',
    async (sb) => {
      const [v, e, p, c] = await Promise.all([
        sb.from('visitors').select('id,full_name,category,status,created_at').order('created_at', { ascending: false }).limit(2000),
        sb.from('exhibitors').select('id,company,status,listed,stall_code,created_at').order('created_at', { ascending: false }),
        sb.from('products').select('id', { count: 'exact', head: true }),
        sb.from('content').select('page', { count: 'exact', head: true }),
      ]);
      return { visitors: v.data || [], exhibitors: e.data || [], products: p.count || 0, edits: c.count || 0 };
    },
    [{ table: 'visitors' }, { table: 'exhibitors' }, { table: 'products' }, { table: 'content' }],
  );
  if (loading && !data) return <Loading />;
  const V = data.visitors;
  const E = data.exhibitors;
  const stats = [
    ['To review', V.filter((x) => x.status === 'pending').length, 'visitors', 'var(--orange)'],
    ['Accredited visitors', V.filter((x) => x.status === 'approved').length, 'visitors'],
    ['All visitor registrations', V.length, 'visitors'],
    ['Exhibitors', E.length, 'exhibitors'],
    ['Stalls to allocate', E.filter((x) => !x.stall_code).length, 'exhibitors', 'var(--blue)'],
    ['Listed on website', E.filter((x) => x.listed).length, 'exhibitors'],
    ['Exhibitor products', data.products, 'exhibitors'],
    ['Page changes', data.edits, 'pages'],
  ];
  const cats = {};
  V.forEach((x) => (cats[x.category] = (cats[x.category] || 0) + 1));
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Overview</h1>
          <p>Live figures for India Sports Expo 2027. Everything on this panel updates by itself.</p>
        </div>
      </div>
      <div className="pf-grid four">
        {stats.map(([t, n, to, c]) => (
          <button key={t} className="pf-card pf-stat" onClick={() => go(to)} style={{ border: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>
            <span className="pf-small pf-muted">{t}</span>
            <b style={c ? { color: c } : undefined}>{n}</b>
          </button>
        ))}
      </div>
      <div className="pf-grid two" style={{ marginTop: 20, alignItems: 'start' }}>
        <div className="pf-card">
          <div className="pf-card-head">
            <h2>Latest visitors</h2>
            <button className="pf-link" onClick={() => go('visitors')}>
              All →
            </button>
          </div>
          {V.slice(0, 8).map((x) => (
            <div key={x.id} className="pf-row" style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{x.full_name}</b>
                <div className="pf-small pf-muted">
                  {x.category} · {fmtDate(x.created_at)}
                </div>
              </div>
              <Pill status={x.status} />
            </div>
          ))}
          {!V.length ? <p className="pf-empty">No registrations yet.</p> : null}
        </div>
        <div className="pf-card">
          <div className="pf-card-head">
            <h2>Latest exhibitors</h2>
            <button className="pf-link" onClick={() => go('exhibitors')}>
              All →
            </button>
          </div>
          {E.slice(0, 8).map((x) => (
            <div key={x.id} className="pf-row" style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{x.company}</b>
                <div className="pf-small pf-muted">
                  {x.stall_code || 'No stall yet'} · {fmtDate(x.created_at)}
                </div>
              </div>
              {x.listed ? <Pill status="listed">Listed</Pill> : <Pill status={x.status} />}
            </div>
          ))}
          {!E.length ? <p className="pf-empty">No exhibitors yet.</p> : null}
          {Object.keys(cats).length ? (
            <>
              <h3 style={{ marginTop: 24 }}>Visitors by category</h3>
              {Object.entries(cats)
                .sort((a, b) => b[1] - a[1])
                .map(([k, n]) => (
                  <div key={k} style={{ marginTop: 10 }}>
                    <div className="pf-row pf-small" style={{ justifyContent: 'space-between' }}>
                      <span>{k}</span>
                      <b>{n}</b>
                    </div>
                    <div style={{ height: 6, borderRadius: 6, background: 'var(--paper)', marginTop: 4 }}>
                      <div style={{ width: (n / V.length) * 100 + '%', height: '100%', borderRadius: 6, background: 'var(--ink)' }} />
                    </div>
                  </div>
                ))}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
