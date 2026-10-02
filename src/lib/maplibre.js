'use client';
// The design's map code uses the global `maplibregl` (it was loaded from a CDN
// script tag). Screens that show a map import this module to provide it.
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

if (typeof window !== 'undefined') {
  // The worker can't be found next to the bundled chunk; it is served from public/vendor.
  maplibregl.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
  window.maplibregl = maplibregl;
}

export default maplibregl;
