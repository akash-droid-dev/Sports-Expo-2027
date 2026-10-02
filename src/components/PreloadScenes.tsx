'use client';
// Starts the poster downloads with the page. The 3D runtime and scenes are preloaded by the
// inline script in src/app/layout.tsx, and only on devices that show them (not phones or tablets).
import ReactDOM from 'react-dom';
import { withBase } from '@/lib/base';

export default function PreloadScenes({ hero = false }: { hero?: boolean }) {
  ReactDOM.preload(withBase('/assets/bucky-poster.png'), { as: 'image' });
  if (hero) ReactDOM.preload(withBase('/assets/hero-poster.jpg'), { as: 'image', fetchPriority: 'high' });
  return null;
}
