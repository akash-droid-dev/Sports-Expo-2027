import type { Metadata, Viewport } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Script from 'next/script';
import ClientInit from '@/components/ClientInit';
import PreloadScenes from '@/components/PreloadScenes';
import { BASE, withBase } from '@/lib/base';
import { LITE_QUERY } from '@/lib/device';
import './globals.css';
import './dc-pseudo.css';
import './motion.css';
import './mobile.css';
import BackButton from '@/components/BackButton';
import MobileMenu from '@/components/MobileMenu';

export const metadata: Metadata = {
  title: 'India Sports Expo 2027 · Yashobhoomi',
  description:
    'India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. Explore the hall, exhibit, attend, connect and watch.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// True when the build copied Bucky's scene into the site (scripts/vendor-assets.mjs).
const LOCAL_BUCKY = existsSync(join(process.cwd(), 'public', 'assets', 'bucky.splinecode'));

// Runs before the page renders: marks phones and tablets as "lite" (src/lib/device.js), and on
// other devices starts downloading the 3D runtime and scenes right away.
function deviceScript(localBucky: boolean) {
  const base = JSON.stringify(BASE);
  return `(function(){var d=document.documentElement,q=location.search,lite=false;
try{lite=matchMedia(${JSON.stringify(LITE_QUERY)}).matches}catch(e){}
if(/[?&]lite=1/.test(q))lite=true;if(/[?&]lite=0/.test(q))lite=false;
var b=${base},h=document.head,add=function(rel,href,as,img){var l=document.createElement('link');l.rel=rel;l.href=b+href;if(as){l.as=as;if(!img)l.crossOrigin='anonymous'}h.appendChild(l)};
var home=!location.pathname.slice(b.length).replace(/[/]$/,'');
if(lite){d.classList.add('lite');if(home)add('preload','/assets/hero-poster-mobile.webp','image',1);return}
if(home)add('preload','/assets/hero-poster.jpg','image',1);
add('modulepreload','/vendor/spline/runtime.js');
${localBucky ? "add('preload','/assets/bucky.splinecode','fetch');" : ''}
if(home)add('preload','/assets/hero-scene.splinecode','fetch');
})();`;
}

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: deviceScript(LOCAL_BUCKY) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <PreloadScenes />
        {/* Covers the page while it loads and during page changes (src/lib/motion.js). */}
        <div id="page-curtain" aria-hidden="true">
          <div className="curtain-brand">
            <span className="curtain-mark" />
            <span className="curtain-word">
              <span>
                INDIA SPORTS EXPO <b>2027</b>
              </span>
            </span>
          </div>
          <span className="curtain-line" />
        </div>
        {children}
        <BackButton />
        <MobileMenu />
        <ClientInit localBucky={LOCAL_BUCKY} />
        {/* <image-slot> media placeholders. Fill slots by id in public/image-slots.state.json. */}
        <Script src={withBase('/image-slot.js')} strategy="afterInteractive" />
      </body>
    </html>
  );
}
