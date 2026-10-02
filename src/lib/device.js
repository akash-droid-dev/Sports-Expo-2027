// "Lite" devices: phones and tablets (small screens or touch as the main input).
// They get still or CSS-animated versions of the live 3D views (hero hand and globe, Bucky,
// the venue tour) and a lighter Earth globe, so the page stays within mobile memory limits.
// The class is set before the page renders by the inline script in src/app/layout.tsx.
// Override for testing with ?lite=1 or ?lite=0.
export const LITE_QUERY = '(max-width: 900px), (pointer: coarse)';

export function isLite() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('lite');
}
