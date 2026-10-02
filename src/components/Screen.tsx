'use client';
// Renders one routed screen in the browser. Props start from the design's defaults
// and can be overridden from the URL, e.g. /?liveMode=true or /?journey=reduced.
import { useEffect, useState, type ComponentType } from 'react';
import { SCREENS } from '@/screens';

type Props = Record<string, unknown>;

function propsFromUrl(defaults: Props): Props {
  const out: Props = { ...defaults };
  const q = new URLSearchParams(window.location.search);
  for (const key of Object.keys(defaults)) {
    const raw = q.get(key);
    if (raw === null) continue;
    const d = defaults[key];
    out[key] = typeof d === 'boolean' ? raw === 'true' || raw === '1' : typeof d === 'number' ? Number(raw) : raw;
  }
  return out;
}

export default function Screen({ route, defaults = {} }: { route: string; defaults?: Props }) {
  const [props, setProps] = useState<Props | null>(null);
  useEffect(() => setProps(propsFromUrl(defaults)), [defaults]);

  // Screens render after load, so the browser's own jump to #anchor has already passed.
  // Wait for the target to render, then jump to it unless the screen or the visitor already scrolled.
  useEffect(() => {
    if (!props || !window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const started = Date.now();
    const t = setInterval(() => {
      const el = document.getElementById(id);
      if (window.scrollY > 0 || Date.now() - started > 5000) clearInterval(t);
      else if (el) {
        clearInterval(t);
        el.scrollIntoView();
      }
    }, 50);
    return () => clearInterval(t);
  }, [props]);

  const Component = (SCREENS as Record<string, ComponentType<Props>>)[route];
  if (!props || !Component) return null;
  return <Component {...props} />;
}
