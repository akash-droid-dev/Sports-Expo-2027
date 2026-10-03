---
type: brief
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
---

# ISE Brief and Scope

## The ask
Take the Claude Design handoff (`Main_File_of_Sports_Expo_2027.zip`) and build it as a **live, working site with exactly the same design and logic**, publish it on GitHub (Pages) and Netlify, then raise it to a premium, animated, sporty standard that works smoothly on every device, including old Android phones and iPads.

## Audience
| Audience | Where |
|---|---|
| Public visitors, fans, buyers, investors | Home, Explore, Zones, Attend, Programme/Watch |
| Exhibitors (prospective) | Exhibit (why exhibit, booth products, stall inventory, directory, registration) |
| Exhibitors (signed in) | Exhibitor Portal (13 modules, pre/live/post event) |
| Business delegates | Connect (business exchange, matchmaking, meetings, pavilions, lounges) |
| Organiser staff | Admin & Command console (super admin) |
| Mobile visitors | Companion app prototype |
| Team | Design System page |

## The event (as modelled)
- **Four event zones** in Hall 2: **A** India Sports & Heritage, **B** Sports Goods & Infrastructure, **C** Sports Tech & Experience, **D** Sports Business & Investment.
- A saffron **Sports Boulevard** runs through the hall; an **Innovation Arena** stage (324 seats); B2B meeting zone with 40 tables; deal rooms; buyer, investor, federation and CEO lounges.
- Three days of programme; live and on-demand sessions.
- See [[ISE Data Model]].

## Scope delivered
1. **Faithful rebuild** of all 11 pages + the shared Hall Plan component (Next.js, generated from the design by [[Design Component to JSX Converter]]). Saved as branch `archive/v1-design-faithful`.
2. **Deployment**: GitHub Pages (automatic) and Netlify (`sports-expo-2027-yashobhoomi`).
3. **Home journey finale**: after the scroll-driven Earth globe reaches Yashobhoomi, the official venue virtual tour takes over with four zone cards ([[Playing Card Flip Finale]]).
4. **Premium motion everywhere** ([[ISE Motion]]): brand curtain, reveals, count-ups, per-page signatures, hover/click feedback.
5. **Bucky** (renamed from R-4X): instant appearance, cute hover/click moves and sounds, AI answers ([[ISE Bucky Robot Guide]]).
6. **Demo media** in every slot, Google Maps for getting there, super admin access.
7. **Mobile**: lite mode, phone menu, no sideways scroll, crash fixes, old iPhone and old Android support ([[ISE Device Support]]).
8. **Rebrand**: client's logo (with spinning ring), stadium hero photo, fold-reveal words, card-dealt zone cards, lock-and-key "Book a stall", 3D intent boxes, zone guide book, 3D booth strip, dealt watch and product cards, sporty finish ([[ISE Design System]]).
9. **Butter-smooth phones and tablets** ([[ISE Performance Log]]).

## Out of scope / not yet done
Real authentication, real backend data, real QR codes, official media, production AI endpoint keys on static hosts. See [[ISE Launch Checklist and Known Gaps]].
