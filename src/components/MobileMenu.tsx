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
