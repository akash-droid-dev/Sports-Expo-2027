---
type: playbook
tags:
  - playbook
  - deploy
proven_on: "[[India Sports Expo 2027]]"
---

# Playbook — Deploy to GitHub Pages and Netlify

Full details for ISE: [[ISE Build and Deploy]].

## GitHub Pages (static, automatic)
- [ ] `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `basePath` from `NEXT_PUBLIC_BASE_PATH` when `STATIC_EXPORT=1`.
- [ ] A `withBase()` helper for every hard-coded asset URL.
- [ ] `public/.nojekyll`.
- [ ] Workflow on push to `main`: `npm ci` → remove `src/app/api` → build with `STATIC_EXPORT=1` and `NEXT_PUBLIC_BASE_PATH=/<repo>` → publish `out/` to `gh-pages` (peaceiris/actions-gh-pages, force orphan).
- [ ] Settings → Pages → `gh-pages` / root.

## Netlify
- **Full app** (API routes work): link the repo; `netlify.toml` with `npm run build`, Node 22; env vars (e.g. `ANTHROPIC_API_KEY`).
- **Static upload** (what the ISE client does): build without base path, add `out/_headers` (cache rules), zip `out/` as a named folder, the client drags the folder onto *Deploys*.
- CLI: `npx netlify-cli deploy --dir out --prod --site <name>`.

## Always
- [ ] `rm -rf .next` before every build.
- [ ] Build label visible in the UI to confirm the deploy.
- [ ] Give the client one clear path (zip + 3 steps), not several.
