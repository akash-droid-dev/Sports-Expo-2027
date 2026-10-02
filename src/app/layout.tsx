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

// Runs first, in old-style JavaScript so any phone can run it:
// - fills in two newer JavaScript features that iOS before 15.4 lacks;
// - marks browsers without class static blocks (iOS before 16.4) as "legacy": they skip the maps;
// - if the site has not started 9 s after loading, shows what went wrong on screen (errors,
//   browser, build) instead of leaving the loading screen up, so it can be reported.
const BOOT_SCRIPT = `(function(){
if(!Object.hasOwn)Object.hasOwn=function(o,k){return Object.prototype.hasOwnProperty.call(o,k)};
var at=function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return i<0||i>=this.length?undefined:this[i]};
[Array,String].forEach(function(C){if(!C.prototype.at)Object.defineProperty(C.prototype,'at',{value:at,writable:true,configurable:true})});
try{new Function('class A{static{}}')}catch(e){document.documentElement.classList.add('legacy')}
var errs=window.__bootErrors=[];
addEventListener('error',function(e){var t=e.target;if(t&&t!==window&&(t.src||t.href))errs.push('Could not load '+(t.src||t.href));else errs.push((e.message||'Error')+(e.filename?' ('+e.filename.split('/').pop()+':'+e.lineno+')':''))},true);
addEventListener('unhandledrejection',function(e){var r=e.reason;errs.push('Promise: '+(r&&r.message||r))});
addEventListener('load',function(){setTimeout(function(){
if(window.__booted)return;
var c=document.getElementById('page-curtain');if(c)c.style.display='none';
var b=document.createElement('div');b.id='boot-error';
b.setAttribute('style','position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#0E0E0F;color:#fff;padding:24px;font:14px/1.5 -apple-system,Helvetica,Arial,sans-serif;overflow:auto');
var esc=function(x){return String(x).replace(/[&<>]/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]})};
b.innerHTML='<p style="font-weight:700;font-size:20px;margin:0 0 12px">The site could not start on this browser.</p>'+
'<p style="margin:0 0 16px;color:#BDB9B0">Please take a screenshot of this screen and send it to the site team. Updating iOS (Settings, General, Software Update) usually fixes it.</p>'+
'<button onclick="location.reload()" style="background:#F07C12;color:#0E0E0F;border:0;padding:12px 18px;font-weight:700;margin-bottom:20px">TRY AGAIN</button>'+
'<pre style="white-space:pre-wrap;font:12px/1.5 ui-monospace,Menlo,monospace;color:#E3E0D8;margin:0">'+esc('Build: '+(window.__build||'?')+'\\nBrowser: '+navigator.userAgent+'\\nErrors:\\n'+(errs.length?errs.slice(0,8).join('\\n'):'none recorded'))+'</pre>';
document.body.appendChild(b);
},9000)});
})();`;

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
        <script dangerouslySetInnerHTML={{ __html: `window.__build=${JSON.stringify(process.env.NEXT_PUBLIC_BUILD || '')};` + BOOT_SCRIPT + deviceScript(LOCAL_BUCKY) }} />
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
