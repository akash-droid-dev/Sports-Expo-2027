'use client';
// Frame for the platform pages: dark top bar with the logo, links to the person's areas and an
// account menu (signed-in email, sign out).
import { useEffect, useRef, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { withBase } from '@/lib/base';
import { getClient } from '@/lib/platform/client';

export default function Shell({ title, user, role, active, children, main = 'pf-main' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const off = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    addEventListener('pointerdown', off);
    return () => removeEventListener('pointerdown', off);
  }, [open]);
  const links = [
    ['/me', 'My pass'],
    ['/meetings', 'Meetings'],
    ['/portal', 'Exhibitor portal'],
    ...(role ? [['/admin', 'Admin']] : []),
  ];
  const signOut = async () => {
    const sb = await getClient();
    await sb.auth.signOut();
    location.href = withBase('/');
  };
  return (
    <div className="sc-host pf">
      <header className="pf-top">
        <a className="pf-top-home" href={withBase('/')} aria-label="India Sports Expo 2027 home">
          <BrandLogo />
        </a>
        {title ? <span className="pf-top-title">{title}</span> : null}
        <nav className="pf-top-nav" aria-label="Your areas">
          {user
            ? links.map(([href, label]) => (
                <a key={href} href={withBase(href)} aria-current={active === href ? 'page' : undefined}>
                  {label}
                </a>
              ))
            : null}
        </nav>
        {user ? (
          <div className="pf-account" ref={ref}>
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
              <span className="pf-avatar">{(user.email || '?')[0]}</span>
              <span className="e" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 8 }}>
                {user.email}
              </span>
            </button>
            {open ? (
              <div className="pf-account-menu" role="menu">
                <p>Signed in as {user.email}</p>
                {links.map(([href, label]) => (
                  <a key={href} role="menuitem" href={withBase(href)}>
                    {label}
                  </a>
                ))}
                <button role="menuitem" onClick={signOut}>
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>
      <main className={main}>{children}</main>
    </div>
  );
}
