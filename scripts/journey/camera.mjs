import { camAt } from '../../src/lib/journey-camera.mjs';
export { camAt };
// Progress values to render: no more than maxZoomStep zoom levels or maxPStep apart.
export function framePoints(J) {
  const out = [0];
  let p = 0;
  while (p < J.framesUntil) {
    let q = Math.min(J.framesUntil, p + J.maxPStep);
    while (q - p > 0.002 && Math.abs(camAt(J.keyframes, q).z - camAt(J.keyframes, p).z) > J.maxZoomStep) q -= 0.001;
    p = +q.toFixed(4);
    out.push(p);
  }
  return out;
}
