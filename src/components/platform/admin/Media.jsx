'use client';
// Media library: images and videos for the website (public bucket “media”).
import { useCallback, useEffect, useState } from 'react';
import { errorText, getClient } from '@/lib/platform/client';
import { can } from '@/lib/platform/hooks';
import { publicUrl, upload } from '@/lib/platform/storage';
import { Loading, Spinner } from '../ui';

const isVideo = (n) => /\.(mp4|webm|mov|m4v)$/i.test(n);

export default function Media({ role, show }) {
  const [files, setFiles] = useState(null);
  const [busy, setBusy] = useState(false);
  const editor = can(role, 'editor');
  const load = useCallback(async () => {
    try {
      const sb = await getClient();
      const { data, error } = await sb.storage.from('media').list('library', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      setFiles(data.filter((f) => f.id));
    } catch (x) {
      show(errorText(x), true);
      setFiles([]);
    }
  }, [show]);
  useEffect(() => {
    load();
  }, [load]);
  const add = async (list) => {
    setBusy(true);
    try {
      for (const f of list) {
        if (f.size > 50 * 1024 * 1024) {
          show(f.name + ' is over 50 MB', true);
          continue;
        }
        const name = f.name.toLowerCase().replace(/[^\w.-]+/g, '-');
        await upload('media', `library/${Date.now().toString(36)}-${name}`, f);
      }
      show('Uploaded');
      load();
    } catch (x) {
      show(errorText(x), true);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (f) => {
    if (!confirm('Delete ' + f.name + '? Pages using it will show nothing in its place.')) return;
    try {
      const sb = await getClient();
      const { error } = await sb.storage.from('media').remove(['library/' + f.name]);
      if (error) throw error;
      show('Deleted');
      load();
    } catch (x) {
      show(errorText(x), true);
    }
  };
  return (
    <>
      <div className="pf-head">
        <div>
          <h1>Media library</h1>
          <p>Images and videos for the website. Copy a link to use it in Website content, or pick it while editing a page.</p>
        </div>
        {editor ? (
          <label className="pf-btn orange" style={{ position: 'relative' }}>
            {busy ? <Spinner /> : null}Upload files
            <input type="file" multiple accept="image/*,video/mp4,video/webm" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={(e) => e.target.files?.length && add([...e.target.files])} disabled={busy} />
          </label>
        ) : null}
      </div>
      {!files ? (
        <Loading />
      ) : files.length ? (
        <div className="pf-grid four">
          {files.map((f) => {
            const url = publicUrl('media', 'library/' + f.name);
            return (
              <div key={f.id} className="pf-prod" style={{ background: '#fff', boxShadow: 'var(--shadow)' }}>
                {isVideo(f.name) ? <video className="pf-prod-img" src={url} muted preload="metadata" style={{ width: '100%', objectFit: 'cover' }} /> : <div className="pf-prod-img" style={{ backgroundImage: `url("${url}")` }} />}
                <div className="pf-prod-body">
                  <span className="pf-small" style={{ wordBreak: 'break-all' }}>
                    {f.name.replace(/^[a-z0-9]+-/, '')}
                  </span>
                  <div className="pf-row" style={{ marginTop: 'auto' }}>
                    <button
                      className="pf-btn small soft"
                      onClick={() => navigator.clipboard?.writeText(url).then(() => show('Link copied'), () => prompt('Copy this link:', url))}
                    >
                      Copy link
                    </button>
                    {editor ? (
                      <button className="pf-btn small ghost" onClick={() => remove(f)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pf-card pf-empty">No files yet.</div>
      )}
    </>
  );
}
