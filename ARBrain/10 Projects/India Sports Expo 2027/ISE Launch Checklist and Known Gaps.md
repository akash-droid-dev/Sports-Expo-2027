---
type: checklist
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - launch
---

# ISE Launch Checklist and Known Gaps

## Replace before launch
- [ ] **Demo data** → backend data: names, figures, dates, stall IDs in `src/data/ise.js` and in the screens (marked SAMPLE / DEMO / PROVISIONAL). See [[ISE Data Model]].
- [ ] **Photos and videos** → official media: point each `<image-slot>` id at an official file in `public/media/media.json`; swap clips in `public/media/videos.json`. See [[ISE Media and Credits]].
- [ ] **QR codes** are decorative → generate real ones server-side.
- [ ] **Authentication** for `/portal`, `/admin`, My Expo (admin currently opens as Super Admin).
- [ ] **Bucky AI** → set `ANTHROPIC_API_KEY` on a server deploy (Netlify full build), or keep built-in answers only.
- [ ] **Venue tour** embed: confirm permission to embed the official Yashobhoomi virtual tour (`iiccnewdelhi.com/YashobhoomiAVT`), or provide a 360° still (`VENUE_PANORAMA` in `src/lib/venue.js`).
- [ ] **Dates** are provisional in the hero ("DATES PROVISIONAL").
- [ ] Analytics, cookie consent, privacy policy, SEO metadata per page, Open Graph images.
- [ ] Accessibility pass with real content (contrast on photo backgrounds, focus order in drawers/wizards).

## Known gaps
- Portal, Admin and My Expo are desktop layouts; on phones they are reflowed but best on larger screens.
- The Earth journey's satellite imagery sharpens a moment after a fast zoom.
- Netlify deploys are manual (folder upload); link the repo for automatic deploys.
- Real-device check on iPad Safari recommended (tests used Chromium emulation).
- Pages under the static host can't run `/api/bucky`.

## Related
[[India Sports Expo 2027]] · [[ISE Build and Deploy]]
