'use client';
// React hooks for the platform pages: the signed-in person, live queries that refresh when the
// underlying rows change (Supabase realtime), and the person's staff role.
import { useCallback, useEffect, useRef, useState } from 'react';
import { getClient } from './client';

/** The signed-in session; `ready` is false until it has been read from this browser. */
export function useSession() {
  const [state, setState] = useState({ ready: false, session: null });
  useEffect(() => {
    let off = () => {};
    let alive = true;
    getClient().then((sb) => {
      sb.auth.getSession().then(({ data }) => alive && setState({ ready: true, session: data.session }));
      const { data } = sb.auth.onAuthStateChange((_e, session) => alive && setState({ ready: true, session }));
      off = () => data.subscription.unsubscribe();
    });
    return () => {
      alive = false;
      off();
    };
  }, []);
  return { ...state, user: state.session?.user || null };
}

let channelSeq = 0;

/**
 * Runs `load(sb)` and runs it again whenever a row changes in one of `watch`
 * ([{ table, filter? }], filter in realtime syntax such as 'user_id=eq.<id>').
 * Pass `key` = null to wait (e.g. until signed in).
 */
export function useLive(key, load, watch = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const loadRef = useRef(load);
  loadRef.current = load;
  const run = useCallback(async () => {
    try {
      const sb = await getClient();
      const data = await loadRef.current(sb);
      setState({ loading: false, data, error: null });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error }));
    }
  }, []);
  const watchKey = JSON.stringify(watch);
  useEffect(() => {
    if (key === null) return;
    let alive = true;
    let timer = 0;
    let channel = null;
    let sbRef = null;
    setState((s) => ({ ...s, loading: true }));
    run();
    getClient().then((sb) => {
      if (!alive || !watch.length) return;
      sbRef = sb;
      channel = sb.channel('live-' + ++channelSeq);
      for (const w of watch) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table: w.table, ...(w.filter ? { filter: w.filter } : {}) }, () => {
          clearTimeout(timer);
          timer = setTimeout(() => alive && run(), 250);
        });
      }
      channel.subscribe();
    });
    // Coming back to the tab: catch up on anything missed while it slept.
    const onFocus = () => document.visibilityState === 'visible' && run();
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onFocus);
      if (channel && sbRef) sbRef.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, watchKey, run]);
  return { ...state, reload: run };
}

export const ROLE_RANK = { owner: 4, admin: 3, editor: 2, viewer: 1 };
export const can = (role, min) => (ROLE_RANK[role] || 0) >= ROLE_RANK[min];

/** The signed-in person's staff role ('owner' | 'admin' | 'editor' | 'viewer'), or null. */
export function useStaffRole(user) {
  const email = user?.email?.toLowerCase() || null;
  const { data, loading } = useLive(
    email,
    async (sb) => {
      const { data, error } = await sb.from('staff').select('role,name').eq('email', email).maybeSingle();
      if (error) throw error;
      return data;
    },
    email ? [{ table: 'staff', filter: 'email=eq.' + email }] : [],
  );
  return { role: data?.role || null, name: data?.name || '', loading: !!email && loading };
}
