'use client';
// Starts the 3D downloads with the page instead of after the screen renders:
// Bucky's scene host and Spline's decoder host on every page, the hero scene on Home.
import ReactDOM from 'react-dom';
import { withBase } from '@/lib/base';

export default function PreloadScenes({ hero = false, bucky = false }: { hero?: boolean; bucky?: boolean }) {
  ReactDOM.preconnect('https://prod.spline.design', { crossOrigin: 'anonymous' });
  ReactDOM.preconnect('https://www.gstatic.com', { crossOrigin: 'anonymous' });
  ReactDOM.preloadModule(withBase('/vendor/spline/runtime.js'));
  if (bucky) ReactDOM.preload(withBase('/assets/bucky.splinecode'), { as: 'fetch', crossOrigin: 'anonymous' });
  if (hero) {
    ReactDOM.preload(withBase('/assets/hero-poster.jpg'), { as: 'image', fetchPriority: 'high' });
    ReactDOM.preload(withBase('/assets/hero-scene.splinecode'), { as: 'fetch', crossOrigin: 'anonymous' });
  }
  return null;
}
