---
type: reference
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - project/ise
  - source
---

# ISE Source Snapshot

| | |
|---|---|
| Repository | https://github.com/akash-droid-dev/Sports-Expo-2027 |
| Snapshot commit | `6aaefbc` on `main` — "Deal the featured products from a deck and roll them left to right; smooth tablets" |
| Build label of that build | 2026-10-02 20:48 UTC |
| This vault | branch `arbrain/india-sports-expo-2027` (= `main` at `6aaefbc` + `ARBrain/`) |
| First faithful build | branch `archive/v1-design-faithful` |

## Restore exactly this version
```bash
git clone https://github.com/akash-droid-dev/Sports-Expo-2027.git
cd Sports-Expo-2027
git checkout 6aaefbc          # or: git checkout arbrain/india-sports-expo-2027
npm install && npm run dev
```

## Start a new app from it
```bash
git clone --depth 1 https://github.com/akash-droid-dev/Sports-Expo-2027.git my-new-app
cd my-new-app && rm -rf .git ARBrain design src/screens/*.jsx && git init
```
Keep: `src/app/layout.tsx` (boot script), `src/lib/{motion,page-anim,mobile-fit,legacy-css,device,base}.js`, `src/components/anim/*`, the CSS layers, `scripts/dc-to-jsx.mjs`, `scripts/vendor-assets.mjs`, `next.config.ts`, `package.json` (browserslist + webpack build). Then follow [[Playbook - New Web App from a Claude Design Handoff]].

## Original inputs (in this vault)
- Claude Design handoff zip: `90 Assets/India Sports Expo 2027/uploads/claude-design-handoff-Main_File_of_Sports_Expo_2027.zip` (unpacked in the repo as `design/`).
- Client logo: `uploads/client-logo-original.png` (1580 × 639).
- Client stadium photo: `uploads/client-stadium-photo-original.jpg`.

## Key versions
`next 16.3.8` · `react 19.3.0` · `maplibre-gl 6.11.2` · `@splinetool/runtime 2.0.65` · `@anthropic-ai/sdk ^0.131.0` · `typescript ^5.9.3` · `sharp ^0.34.5` · `parse5 ^8.0.1` · Node ≥ 20.
