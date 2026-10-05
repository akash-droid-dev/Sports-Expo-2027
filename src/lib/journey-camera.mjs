// Camera of the Home Earth journey at scroll progress p, eased between the keyframes in
// src/data/journey.json. Shared by the live globe (src/screens/Home.jsx), the still-frame
// version phones and tablets use (src/components/home/JourneyFrames.jsx) and the frame
// renderer (scripts/journey/render-frames.mjs), so all three follow the same path.
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
