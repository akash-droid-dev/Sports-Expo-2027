'use client';
// Changes made with “Edit this page” on the public pages: open a page in edit mode, see and
// undo individual changes.
import { withBase } from '@/lib/base';
import { errorText, getClient } from '@/lib/platform/client';
import { can, useLive } from '@/lib/platform/hooks';
import { Loading, Pill, fmtDate } from '../ui';

export const PAGES = [
  ['/', 'Home'],
  ['/explore', 'Explore Hall 2'],
  ['/zones', 'Zones'],
  ['/exhibit', 'Exhibit'],
  ['/attend', 'Attend'],
  ['/connect', 'Connect'],
  ['/programme', 'Programme & Watch'],
];
const KIND = { text: 'Text', image: 'Image', video: 'Video', link: 'Link', hide: 'Hidden', bg: 'Background' };

function preview(r) {
  const v = r.value || {};
  if (r.kind === 'text') return v.text;
  if (r.kind === 'link') return (v.text ? v.text + ' → ' : '') + (v.href || '');
  if (r.kind === 'hide') return 'Hidden on the page';
  return v.src || '';
}

export default function PageEdits({ role, show }) {
  const editor = can(role, 'editor');
  const { data, loading } = useLive(
    'content',
    async (sb) => {
      const { data, error } = await sb.from('content').select('*').order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    [{ table: 'content' }],
  );
  if (loading && !data) return <Loading />;
  const undo = async (r) => {
    try {
      const sb = await getClient();
      const { error } = await sb.from('content').delete().eq('page', r.page).eq('key', r.key);
      if (error) throw error;
      show('Change undone · the page shows the original again');
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Edit pages</h1>
          <p>Open a page in edit mode, then click any text, image, video or link on it to change it, or hide it. Visitors see changes immediately.</p>
        </div>
      </div>
      <div className="pf-grid four" style={{ marginBottom: 24 }}>
        {PAGES.map(([path, label]) => (
          <a key={path} className="pf-card" href={withBase(path === '/' ? '/?edit=1' : path + '/?edit=1')} style={{ textDecoration: 'none', padding: 20 }}>
            <span className="pf-kicker" style={{ marginBottom: 6 }}>
              {(data || []).filter((r) => r.page === path).length} changes
            </span>
            <h3>{label}</h3>
            <span className="pf-small pf-muted">{editor ? 'Edit this page →' : 'View →'}</span>
          </a>
        ))}
      </div>
      <div className="pf-card">
        <div className="pf-card-head">
          <h2>All changes</h2>
        </div>
        {data?.length ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Change</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.page + r.key}>
                    <td>{PAGES.find((p) => p[0] === r.page)?.[1] || r.page}</td>
                    <td style={{ maxWidth: 420 }}>
                      <Pill>{KIND[r.kind]}</Pill> <span className="pf-small">{r.label}</span>
                      <div className="pf-small pf-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {preview(r)}
                      </div>
                    </td>
                    <td className="pf-small">
                      {fmtDate(r.updated_at)}
                      <div className="pf-muted">{r.updated_by}</div>
                    </td>
                    <td>
                      {editor ? (
                        <button className="pf-btn small ghost" onClick={() => undo(r)}>
                          Undo
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="pf-empty">No page changes yet.</p>
        )}
      </div>
    </>
  );
}
