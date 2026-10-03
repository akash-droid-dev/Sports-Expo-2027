---
type: playbook
tags:
  - playbook
  - media
proven_on: "[[India Sports Expo 2027]]"
---

# Playbook — Demo Media Sourcing

Fill every image and video slot with **relevant, openly licensed** demo media (Openverse / Wikimedia Commons), with credits, without bloating the site. Result for ISE: [[ISE Media and Credits]].

1. **Plan** — list what each slot should show (`scripts/media/plan.json`: per candidate key, a source — `commons` or `openverse` — and a search query; videos likewise).
2. **Find candidates** — a GitHub workflow (`.github/workflows/media-candidates.yml`, triggered by pushing to `media-request`) runs `scripts/media/fetch-candidates.mjs`, which searches Openverse / Wikimedia Commons for openly licensed photos (→ 1600 px WebP + title, author, licence, link) and Wikimedia Commons for clips (→ 18 s, 960 px H.264 MP4 without audio + poster), and commits them to the `media-candidates` branch. (Runs in CI because the sandbox can't reach the web.)
3. **Pick** — review candidates; map picks to slots in `scripts/media/build-media.mjs`.
4. **Build** — `node scripts/media/build-media.mjs <candidates folder>`: photos → 1400 px WebP (q≈68); clips → MP4 + 960 px WebP poster; draws SVG artwork where no photo fits (logos, portraits with initials — **no real faces**, product drawings); writes `media.json` (slot → file + credit), `videos.json`, `credits.json`.
5. **Show credits** on each photo (credit chip) and keep `credits.json` for the licence trail.
6. **Load lightly** — nothing downloads until needed: video posters first, hover previews on desktop only, stills on phones.
7. **Before launch** replace with official media (same slot ids).
