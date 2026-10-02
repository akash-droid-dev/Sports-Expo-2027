// Path prefix the site is served under: '' on Netlify or a custom domain,
// '/Sports-Expo-2027' on GitHub Pages. Set NEXT_PUBLIC_BASE_PATH at build time.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefixes a site-absolute path ('/exhibit#directory') with the base path. */
export function withBase(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') ? BASE + path : path;
}
