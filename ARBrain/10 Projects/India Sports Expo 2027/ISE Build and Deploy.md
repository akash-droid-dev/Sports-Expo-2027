---
type: reference
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - build
  - deploy
---

# ISE Build and Deploy

## Run locally
```bash
git clone https://github.com/akash-droid-dev/Sports-Expo-2027.git && cd Sports-Expo-2027
npm install          # also copies Spline, MapLibre, Draco into public/vendor (scripts/vendor-assets.mjs)
npm run dev          # http://localhost:3000 (Turbopack)
npm run build && npm start   # full app incl. /api/bucky (webpack build)
```
Node 20+ (Netlify uses 22). Optional: `ANTHROPIC_API_KEY` for Bucky's AI answers (otherwise `/api/bucky` → 503 and Bucky uses built-in help).

## Static build (GitHub Pages / Netlify upload)
The static export can't include the API route, so move it aside first. Always clear `.next` first.
```bash
rm -rf .next out
mv src/app/api /tmp/api-aside
STATIC_EXPORT=1 npm run build                                   # Netlify / root domain
# or: STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Sports-Expo-2027 npm run build   # GitHub Pages
mv /tmp/api-aside src/app/api
```
Output: `out/`. Add `out/_headers` for Netlify caching:
```
# Netlify: let browsers reuse the 3D runtimes, scenes and demo media.
/vendor/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/assets/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/media/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/brand/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

## GitHub Pages (automatic)
- Every push to `main` runs `.github/workflows/pages.yml`: `npm ci` → remove `src/app/api` → `STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Sports-Expo-2027 npm run build` → publish `out/` to `gh-pages` (force orphan).
- Settings → Pages → Deploy from a branch → `gh-pages` / root.
- Live: https://akash-droid-dev.github.io/Sports-Expo-2027/ (about 1–2 min after a push).

## Netlify
- Project **`sports-expo-2027-yashobhoomi`**, site ID `a99d0c61-b76b-4c51-b119-439cf385ea77`, https://sports-expo-2027-yashobhoomi.netlify.app.
- How the client deploys today: **manual folder upload** — unzip the delivered `sports-expo-2027-netlify.zip` and drag the `sports-expo-2027-netlify` folder onto the project's **Deploys** page.
- CLI alternative: `npx netlify-cli deploy --dir out --prod --site sports-expo-2027-yashobhoomi`.
- Full-app alternative (with `/api/bucky`): link the repo in Netlify; `netlify.toml` runs `npm run build`, Node 22; set `ANTHROPIC_API_KEY` in site env vars.

## Checking which build is live
The phone menu (☰) shows the **build label** at the bottom (`NEXT_PUBLIC_BUILD`, set at build time, e.g. `2026-10-02 20:48 UTC`). The boot-error overlay also prints it.

## Pre-push checks used on this project
- `npx tsc --noEmit`
- Acorn parse of every `_next/static/chunks/*.js` at ES2019 (the MapLibre chunk uses BigInt and only loads on modern browsers) and the inline boot script at ES5 — `Harness/escheck.cjs`.
- Playwright: overflow (`over.mjs`), old Android/iOS emulation (`oldandroid.mjs`), desktop boot (`bootdesk.mjs`), frame timing (`jank.mjs`). See [[Test Harness]].

## Gotchas
- `browserslist` name: `samsung 9.2` (not `samsung 9`).
- `transpilePackages: ['maplibre-gl']` only in the production phase — Turbopack dev fails on it.
- In the TS template that becomes the inline boot script, escape `\n` as `\\n`.
- The sandbox Netlify API was unreachable at times → the client uploads manually.

## Related
[[Playbook - Deploy to GitHub Pages and Netlify]] · [[ISE Source Snapshot]] · [[India Sports Expo 2027]]
