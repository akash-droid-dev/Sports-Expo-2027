// Camera position of the Home Earth journey at scroll progress p (same maths as Home.jsx).
export function camAt(K, p) {
  let i = 0;
  while (i < K.length - 2 && p > K[i + 1].p) i++;
  const a = K[i], b = K[i + 1];
  let t = (p - a.p) / (b.p - a.p);
  t = Math.max(0, Math.min(1, t));
  t = t * t * (3 - 2 * t);
  const L = (x, y) => x + (y - x) * t;
  return { lon: L(a.lon, b.lon), lat: L(a.lat, b.lat), z: L(a.z, b.z), pitch: L(a.pitch, b.pitch), b: L(a.b, b.b) };
}
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
