// The platform on the public pages: live catalogue and page edits for every visitor, kept up to
// date while the page is open, and the organiser bar ("Edit this page") for signed-in staff.
import { withBase } from '@/lib/base';
import { getClient } from './client';
import { maybeSignedIn } from './config';
import { pageKey, refreshContent, startContent } from './content';
import { refreshLive, startLive } from './live';

const APP_PAGES = /^\/(admin|portal|me|register|verify)(\/|$)/;

function debounce(fn, ms = 400) {
  let t = 0;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}

export function initPublicPlatform() {
  const route = pageKey();
  if (APP_PAGES.test(route)) return;
  startLive();
  startContent();

  const later = (fn, ms) => setTimeout(() => (window.requestIdleCallback || ((cb) => cb()))(fn, { timeout: 3000 }), ms);
  const lite = document.documentElement.classList.contains('lite');
  if (lite) {
    // Phones and tablets: no always-open connection; catch up whenever the page comes back
    // into view, and every couple of minutes while it is open.
    const catchUp = () => document.visibilityState === 'visible' && (refreshLive(), refreshContent());
    document.addEventListener('visibilitychange', catchUp);
    setInterval(catchUp, 120000);
  } else {
    later(async () => {
      const sb = await getClient();
      const live = debounce(refreshLive);
      const content = debounce(refreshContent, 150);
      sb.channel('site-' + route)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'catalog' }, live)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'exhibitors' }, live)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, live)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'content', filter: 'page=eq.' + route }, content)
        .subscribe();
    }, 4000);
  }

  const wantEdit = /[?&]edit=1/.test(location.search);
  if (maybeSignedIn() || wantEdit) {
    later(() => import('./editor').then((m) => m.startEditor({ adminUrl: withBase('/admin/#pages'), wantEdit })), wantEdit ? 600 : 2500);
  }
}
