---
type: pattern
project: "[[India Sports Expo 2027]]"
source_commit: 6aaefbc
tags:
  - pattern
  - pattern/navigation
  - pattern/mobile
status: proven
---

# Back Button and Mobile Menu

> A history-aware back button (goes back within the site, or Home after a direct visit) and a phone menu that collects the header links and buttons.

**Used in:** Back button on every page except Home (top left inside the header). Phone header menu (☰) with the build label.

## How it works

- Back button hidden on Home (`show = !isHome`).
- The header content shifts right to make room.
- Phone menu lists nav + actions; shows `NEXT_PUBLIC_BUILD` at the bottom to confirm which build is live.

## Reuse it

- Always ship a visible build label on mobile — it settles "is the new version live?" instantly.

## Related

[[ISE UI Components]] · [[Lite Mode for Phones and Tablets]] · [[Patterns Index]]

## Source
From [https://github.com/akash-droid-dev/Sports-Expo-2027](https://github.com/akash-droid-dev/Sports-Expo-2027) at commit `6aaefbc`. Copied verbatim.

#### `src/components/BackButton.tsx`
```tsx
'use client';
// Back button at the top left of every page except Home, inside the header bar. Goes back when
// the visitor came from another page of this site, otherwise to Home.
import { useEffect, useState } from 'react';
import { BASE, withBase } from '@/lib/base';
import { leavePage } from '@/lib/motion';

// Pages with a left rail instead of the top header: the button sits at the top of the rail.
const RAIL_PAGES = ['/portal', '/admin'];
// Pages with neither: content moves down to make room.
const BARE_PAGES = ['/mobile'];

function cameFromThisSite() {
  try {
    return !!document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
  } catch {
    return false;
  }
}

export default function BackButton() {
  const [state, setState] = useState<{ show: boolean; back: boolean; rail: boolean } | null>(null);

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '');
    const isHome = path === BASE || path === '';
    const back = cameFromThisSite();
    const route = path.slice(BASE.length) || '/';
    const rail = RAIL_PAGES.includes(route);
    // Never on the Home page itself; every other page gets it.
    const show = !isHome;
    setState({ show, back, rail });
    // Lets the page header (or rail) make room for the button: src/app/motion.css.
    const root = document.documentElement;
    const bare = show && BARE_PAGES.includes(route);
    root.classList.toggle('has-back', show && !rail);
    root.classList.toggle('has-back-rail', show && rail);
    root.classList.toggle('has-back-bare', bare);
    return () => root.classList.remove('has-back', 'has-back-rail', 'has-back-bare');
  }, []);

  if (!state || !state.show) return null;
  const go = () => {
    if (state.back) leavePage(() => history.back());
    else leavePage(() => (location.href = withBase('/')));
  };
  return (
    <button
      type="button"
      className={state.rail ? 'back-btn on-rail' : 'back-btn'}
      onClick={go}
      aria-label={state.back ? 'Go back to the previous page' : 'Go to the home page'}
    >
      <span className="back-btn-arrow" aria-hidden="true">
        ←
      </span>
      <span className="back-btn-label">{state.back ? 'BACK' : 'HOME'}</span>
    </button>
  );
}
```

#### `src/components/MobileMenu.tsx`
```tsx
'use client';
// Phone and tablet menu. Below 900px the page header keeps only the logo (src/app/mobile.css);
// this ☰ button opens a full-screen menu built from that page's own header links and buttons,
// so every page keeps its own items (Register, My Expo, Search, Exhibitor login…).
import { useEffect, useState } from 'react';

type Item = { label: string; href?: string; current?: boolean; act?: () => void };

const HEADER = '#dc-root header[style*="position: sticky"]';

function readItems(): Item[] {
  const header = document.querySelector(HEADER);
  if (!header) return [];
  const items: Item[] = [];
  const add = (el: Element) => {
    const label = (el.textContent || '').replace(/\s+/g, ' ').replace(/^⌕\s*/, '').trim();
    if (!label) return;
    if (el instanceof HTMLAnchorElement) {
      items.push({ label, href: el.href, current: /240, 124, 18|#F07C12/i.test(el.getAttribute('style') || '') && !/background/.test(el.getAttribute('style') || '') });
    } else if (el instanceof HTMLButtonElement) {
      items.push({ label, act: () => el.click() });
    }
  };
  Array.from(header.children).forEach((el, i) => {
    if (i === 0) return; // the logo
    if (el.tagName === 'NAV') el.querySelectorAll('a,button').forEach(add);
    else add(el);
  });
  // The design repeats some links (Programme / Watch); keep the first of each label.
  return items.filter((it, i) => items.findIndex((x) => x.label === it.label) === i);
}

export default function MobileMenu() {
  const [hasHeader, setHasHeader] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  // Screens render in the browser, so wait for the header to appear.
  useEffect(() => {
    let tries = 0;
    const iv = setInterval(() => {
      const found = !!document.querySelector(HEADER);
      if (found || ++tries > 40) {
        clearInterval(iv);
        setHasHeader(found);
        document.documentElement.classList.toggle('has-header', found);
      }
    }, 150);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!hasHeader) return null;
  const toggle = () => {
    if (!open) setItems(readItems());
    setOpen(!open);
  };
  return (
    <>
      <button type="button" className="mm-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={toggle}>
        <span className={open ? 'mm-icon is-open' : 'mm-icon'} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
      {open ? (
        <nav className="mm-panel" aria-label="Menu">
          {items.map((it, i) =>
            it.href ? (
              <a key={i} href={it.href} className={'mm-item' + (it.current ? ' is-current' : '') + (i === items.length - 1 ? ' is-cta' : '')} style={{ animationDelay: i * 40 + 'ms' }} onClick={() => setOpen(false)}>
                {it.label}
              </a>
            ) : (
              <button
                key={i}
                type="button"
                className={'mm-item' + (i === items.length - 1 ? ' is-cta' : '')}
                style={{ animationDelay: i * 40 + 'ms' }}
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => it.act && it.act(), 50);
                }}
              >
                {it.label}
              </button>
            ),
          )}
          <span className="mm-build">
            BUILD {process.env.NEXT_PUBLIC_BUILD} · {document.documentElement.classList.contains('lite') ? 'PHONE VERSION' : 'FULL VERSION'}
          </span>
        </nav>
      ) : null}
    </>
  );
}
```

#### `src/app/motion.css — Back button`
```css
/* ---------- Back button ---------- */
/* Top left, inside the dark 60px header bar; the header's content shifts right to make room
   (html.has-back is set by src/components/BackButton.tsx). On the portal and admin pages it
   sits at the top of the left rail, above the rail's logo. */
.back-btn {
  position: fixed;
  left: 16px;
  top: 10px;
  z-index: 8999;
  height: 40px;
  padding: 0 14px 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0e0e0f;
  color: #fff;
  border: 1px solid #3a3a3e;
  border-left: 3px solid #f07c12;
  font: 700 12px 'Instrument Sans', sans-serif;
  letter-spacing: 0.14em;
  cursor: pointer;
  animation: backIn 0.7s var(--ease) 0.4s both;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}
.back-btn:hover {
  background: #1a1a1c;
  border-color: #f07c12;
}
.back-btn-arrow {
  color: #f07c12;
  font-size: 16px;
  transition: transform 0.3s var(--ease);
}
.back-btn:hover .back-btn-arrow {
  transform: translateX(-4px);
}
html.has-back #dc-root header[style*='position: sticky'] {
  padding-left: 132px !important;
}
.back-btn.on-rail {
  left: 12px;
  top: 12px;
}
/* Pages without the header bar (the companion app page): room above the content. */
html.has-back-bare #dc-root {
  padding-top: 56px;
}
html.has-back-rail #dc-root aside > a:first-child {
  padding-top: 64px !important;
}
@keyframes backIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
}
@media (max-width: 600px) {
  .back-btn {
    left: 10px;
    padding: 0 10px;
  }
  .back-btn-label {
    display: none;
  }
  html.has-back #dc-root header[style*='position: sticky'] {
    padding-left: 64px !important;
  }
}
```
