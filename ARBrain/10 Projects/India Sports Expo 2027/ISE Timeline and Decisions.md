---
type: log
project: "[[India Sports Expo 2027]]"
tags:
  - project/ise
  - log/decisions
---

# ISE Timeline and Decisions

Each round: what the client asked (verbatim in [[ISE Request Log]]), what was built, the decisions behind it, and the commit. All dates 2026-10-02 (UTC) unless noted.

## Round 1 — Faithful build from the Claude Design handoff · `c8c6139`
**Ask:** build the attached Claude Design project live, with exactly the same design and logic.
**Built:** Next.js 16 / React 19 app. A converter turns each Design Component (`*.dc.html`) into a React screen, keeping the logic classes unchanged so every tab, filter, wizard, drawer and phase switch behaves as in the prototype. 11 routes, shared Hall Plan, R-4X robot guide with Ask panel, `/api/r4x` AI route.
**Decisions**
- Generate screens instead of hand-porting → pixel-faithful and re-runnable ([[Design Component to JSX Converter]]).
- Screens render client-only (`ssr: false`): the design logic reads `window`.
- Verified against the prototype with Playwright screenshot diffs.

## Round 2 — Publish on GitHub Pages and Netlify · `f32029e`, `14d1a8f`
**Ask:** publish on the repo, live on GitHub Pages, and on Netlify as "Sports Expo Yashobhoomi 2027".
**Built:** `STATIC_EXPORT=1` static build + base path for Pages; workflow publishing to `gh-pages`; `netlify.toml` for the full app. Netlify project created and later renamed `sports-expo-2027-yashobhoomi`.
**Decisions:** Pages can't run the AI route → static builds answer from built-in topics only. See [[ISE Build and Deploy]].

## Round 3 — Venue finale, premium motion, back button, Bucky · `ca2571c`
**Ask:** keep a copy; at the end of the globe journey show the Yashobhoomi virtual tour's opening scene, continuously rotating, with the four zone cards straight, sticky and clickable; premium motion across the site; sticky back button on every page; hero and robot appear late — fix; rename the robot **Bucky**.
**Built:** copy saved as branch `archive/v1-design-faithful`. Venue scene (official tour embedded live, or a rotating 360° still if provided) behind four zone cards and a Hall 2 chart. Site-wide motion system ([[Scroll Reveals and Count-ups]], [[Brand Curtain and Page Transitions]]). Back button. R-4X → Bucky (`/api/bucky`). 3D runtime and scenes preloaded and cached.

## Round 4 — Zone cards only, smooth scroll, faster 3D · `2583287`, `df66854`
**Ask:** remove the layout chart, keep only the 4 zone cards; scrolling the Earth journey takes effort; Bucky and the hero still appear late on web, mobile, tablet.
**Built:** chart removed. Hero 3D no longer captures wheel/touch; no global smooth-scroll; Home stops re-rendering per scroll frame (journey is its own component with a progress store). Hero poster shows at once, live scene fades in. Bucky's scene self-hosted, poster on first visit, cached snapshot later. Heading-clip bug fixed.
**Decision:** the journey's progress lives outside React state → only `HomeJourney` re-renders ([[Scroll-Driven Globe Journey]]).

## Round 5 — Hover/click effects, Bucky's moves and sounds, demo media, maps, admin · `0aa615f`, `b896dbc`, `a4c2dce`
**Ask:** hover/click effects on the banner and every clickable area; Bucky wiggles/jumps cutely on hover with two cute sounds (hover and click); relevant dummy images and videos in every slot (no empty placeholder); where is super admin; Google Maps in "Getting to Yashobhoomi" without making the site heavy; remove Design System from the prototype map; the hero hand/globe got rotated by accident — lock it; Earth not smooth while scrolling.
**Built:** lift/sweep/underline/pulse feedback; Bucky wiggle/hop + WebAudio sounds (no files) with a mute switch; a media pipeline (GitHub workflow finds openly licensed Wikimedia candidates → build script → `public/media` + credits) ([[Playbook - Demo Media Sourcing]]); Google Maps keyless embeds, loaded when near; `/admin` documented as super admin; hero scene locked; globe camera eases toward scroll.

## Round 6 — Back button at the top; manual Netlify steps · `f2d9f3a`
**Ask:** back button at the top, not the bottom; give the final file to push to Netlify manually, with Mac terminal steps.
**Built:** back button inside the header bar, top left. Zip of the static build + step-by-step guide; later a `deploy-netlify.sh` script when the terminal commands failed for the client.

## Round 7 — "Not opening on mobile" (three rounds) · `f9a7667`, `b82b812`, `ff81e43`
**Ask:** site not opening on mobile, not smooth, not responsive; then crashing and "unable to load"; still not opening.
**Root causes:** four live WebGL views at once (hero, Bucky, globe, venue tour) exceeded mobile memory → iOS kills the tab, and after repeated crashes refuses to load it. Separately, older iPhones (Safari < 16.4) failed on modern syntax (class static blocks).
**Built:** **lite mode** for phones/tablets ([[Lite Mode for Phones and Tablets]]): stills instead of live 3D, lazy globe at lower resolution, tap-to-load maps and video; phone ☰ menu; reflow of wide layouts (no sideways scroll); build label in the menu; Safari 14 targets, polyfills, and an on-screen boot-error report after 9 s.

## Round 8 — Old Android phones · `993a30e`
**Ask:** run on old Androids as well.
**Built:** Chrome 67 / Samsung 9.2 / Firefox 68 targets; production builds switched to **webpack** (Turbopack ignored browserslist); MapLibre transpiled; more polyfills; `legacy-css.js` for inline `inset` / `aspect-ratio` / flex `gap` ([[Old Browser Support]]).

## Round 9 — Rebrand and animated sections (big redesign) · `6516a72`
**Ask:** new logo; replace the green globe/hand with the stadium photo; fold-reveal SPORTS and 2027; transparent zone cards dealt like playing cards (sport image first, zone side on scroll); fold-animate 2 words of "The global sports economy meets India"; "Book a stall" as lock and key; EXPLORE…WATCH as moving 3D boxes; "One hall. Four event zones." as a book (one page per zone, closes after the last); booth sizes moving and interactive; LIVE & ON DEMAND cards shuffled like cards then moving right to left; unique animation on every other page.
**Built:** [[Spinning Logo Ring|logo]] (first as a whole image), stadium hero, [[Fold Word Reveal]] (SPORTS, 2027, GLOBAL, INDIA), [[Playing Card Flip Finale]], [[Lock and Key Link]], [[CSS 3D Boxes]], [[Page-Turn Book]], [[Card Deal Strip]] (watch), [[Per-Page Signature Animations]].

## Round 10 — No back button on Home; sporty look · `5537b38`
**Built:** back button hidden on Home. [[ISE Sporty Finish]]: forward-slanted display type, angled buttons, moving running-track stripe under headers, speed lines and pitch markings, [[LED Sports Ticker]], footer line "Be a sport. Shape the future."

## Round 11 — Spinning ring, phone zone cards, butter-smooth phones · `386e294`
**Ask:** the logo ring rotates left to right continuously **without changing the design, not even 0.1 %**; the 4 zone cards overlap on mobile; make mobile smooth like butter.
**Built:** logo split at native resolution into ring + wordmark (recombined diff ≈ 0) — ring spins clockwise, 16 s/turn. Phone zone cards in a 2×2 grid (4 across landscape), copy trimmed, Bucky hides. Smoothness: marquees pause off screen, 3D booths flatten off screen and phones get one set, fold-words become plain text after unfolding, header stripe on a transform, no live blur on phones, reveal checks culled by section, no tap flash. **GPU layers ~400 → ~120; stutters −⅔** ([[ISE Performance Log]]).

## Round 12 — Featured products dealt; smooth tablets · `6aaefbc`
**Ask:** card-shuffle animation for "08 — Featured products", moving left to right; iPad/tablet smooth while scrolling.
**Built:** all eight products dealt from a deck then rolling left→right (shared `useDeal`). Tablet fixes: the globe only redraws when its position changes; the map is built/freed in scroll pauses; photo slots lose hidden blurred edit buttons; blur-free credit chips. **Tablet stutters 10–17 → 0–1.**

## Round 13 — ARBrain memory package (2026-10-03)
**Ask:** full memory package with every detail and asset, as a design structure in ARBrain (Obsidian), pushed to a new branch.
**Built:** this vault, branch `arbrain/india-sports-expo-2027`.

## Commit history
| Commit | Date (UTC) | Change |
|---|---|---|
| `c8c6139` | 2026-10-02 10:08 | Build India Sports Expo 2027 site from the Claude Design handoff |
| `f32029e` | 2026-10-02 10:18 | Add GitHub Pages and Netlify deployment |
| `14d1a8f` | 2026-10-02 10:20 | Document GitHub Pages and Netlify deployment |
| `ca2571c` | 2026-10-02 11:01 | Venue finale, site-wide motion, back button, faster 3D, rename to Bucky |
| `2583287` | 2026-10-02 11:39 | Zone cards only, smoother scrolling, faster hero and Bucky |
| `df66854` | 2026-10-02 11:54 | Show Bucky instantly, self-host his scene, fix heading clipping |
| `0aa615f` | 2026-10-02 12:01 | Add media candidate finder for demo photos and videos |
| `b896dbc` | 2026-10-02 12:01 | Let media candidates run on pushes to media-request |
| `a4c2dce` | 2026-10-02 12:26 | Add demo media, Google Maps, hover effects and Bucky sounds; lock the hero |
| `f2d9f3a` | 2026-10-02 12:37 | Move the back button to the top of every page |
| `f9a7667` | 2026-10-02 13:12 | Make the site open, fit and run smoothly on phones and tablets |
| `b82b812` | 2026-10-02 13:28 | Lighter phone build: lazy globe, tap-to-load maps, still images |
| `ff81e43` | 2026-10-02 13:43 | Run on older iPhones, and show why if the site can't start |
| `993a30e` | 2026-10-02 13:53 | Run on old Android phones as well |
| `6516a72` | 2026-10-02 19:36 | New logo, stadium hero and animated Home and inner pages |
| `5537b38` | 2026-10-02 20:01 | Hide the back button on Home; give the site a sporty finish |
| `386e294` | 2026-10-02 20:31 | Spinning logo ring, phone zone cards that fit, smoother phone scrolling |
| `6aaefbc` | 2026-10-02 20:56 | Deal the featured products from a deck and roll them left to right; smooth tablets |

## Branches
| Branch | What |
|---|---|
| `main` | The live site (Pages deploys from it) |
| `archive/v1-design-faithful` | First build, pixel-faithful to the design, before any changes |
| `claude/kind-darwin-8glnpv` | Development branch used while building |
| `gh-pages` | Generated static site (do not edit) |
| `media-request` / `media-candidates` | Media candidate finder trigger and output |
| `arbrain/india-sports-expo-2027` | This memory vault (+ the code at `6aaefbc`) |
