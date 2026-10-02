'use client';
// Starts the poster downloads with the page. The 3D runtime and scenes are preloaded by the
// inline script in src/app/layout.tsx, and only on devices that show them (not phones or tablets).
import ReactDOM from 'react-dom';
import { withBase } from '@/lib/base';

// The hero still is preloaded by the same inline script, sized for the device.
export default function PreloadScenes(_props: { hero?: boolean }) {
  ReactDOM.preload(withBase('/assets/bucky-poster.png'), { as: 'image' });
  return null;
}
