import type { Metadata, Viewport } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Script from 'next/script';
import ClientInit from '@/components/ClientInit';
import PreloadScenes from '@/components/PreloadScenes';
import { BASE, withBase } from '@/lib/base';
import { LITE_QUERY } from '@/lib/device';
import './fonts.css';
import './globals.css';
import './dc-pseudo.css';
import './motion.css';
import './mobile.css';
import './anim.css';
import './sporty.css';
import './sleek.css';
import './liquid.css';
import './backgrounds.css';
import BackButton from '@/components/BackButton';
import MobileMenu from '@/components/MobileMenu';
import BrandLogo from '@/components/BrandLogo';

export const metadata: Metadata = {
  title: 'India Sports Expo 2027 · Bharat Mandapam',
  description:
    'India Sports Expo 2027 at Bharat Mandapam, Pragati Maidan, New Delhi. Explore the venue, exhibit, attend, connect and watch.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// True when the build copied Bucky's scene into the site (scripts/vendor-assets.mjs).
const LOCAL_BUCKY = existsSync(join(process.cwd(), 'public', 'assets', 'bucky.splinecode'));

// Runs first, in old-style JavaScript so any phone can run it:
// - fills in newer JavaScript features that older iPhones (before iOS 15.4) and older Android
//   Chrome (back to 67) lack; the code itself is compiled for them ("browserslist", package.json);
// - marks browsers without class static blocks (iOS before 16.4) as "legacy": they skip the maps;
// - if the site has not started 9 s after loading, shows what went wrong on screen (errors,
//   browser, build) instead of leaving the loading screen up, so it can be reported.
const BOOT_SCRIPT = `(function(){
var def=function(o,k,v){if(!o[k])Object.defineProperty(o,k,{value:v,writable:true,configurable:true})};
if(typeof globalThis==='undefined')window.globalThis=window;
def(Object,'hasOwn',function(o,k){return Object.prototype.hasOwnProperty.call(o,k)});
def(Object,'fromEntries',function(it){var o={};Array.from(it).forEach(function(e){o[e[0]]=e[1]});return o});
var at=function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return i<0||i>=this.length?undefined:this[i]};
def(Array.prototype,'at',at);def(String.prototype,'at',at);
def(Array.prototype,'flat',function(d){d=d===undefined?1:Math.floor(d);var f=function(a,n){return a.reduce(function(r,x){return r.concat(Array.isArray(x)&&n>0?f(x,n-1):[x])},[])};return f(this,d)});
def(Array.prototype,'flatMap',function(fn,t){return Array.prototype.map.call(this,fn,t).flat(1)});
def(String.prototype,'replaceAll',function(p,r){if(p instanceof RegExp)return this.replace(p,r);return this.split(String(p)).join(typeof r==='function'?r(String(p)):r)});
def(String.prototype,'matchAll',function(re){var s=String(this),r=new RegExp(re.source,re.flags.indexOf('g')<0?re.flags+'g':re.flags),out=[],m;while((m=r.exec(s))){out.push(m);if(m[0]==='')r.lastIndex++}return out[Symbol.iterator]()});
def(Promise,'allSettled',function(ps){return Promise.all(Array.from(ps).map(function(p){return Promise.resolve(p).then(function(v){return{status:'fulfilled',value:v}},function(e){return{status:'rejected',reason:e}})}))});
def(window,'queueMicrotask',function(f){Promise.resolve().then(f)});
def(window,'structuredClone',function(v){return v===undefined?v:JSON.parse(JSON.stringify(v))});
[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(function(P){def(P,'replaceChildren',function(){while(this.lastChild)this.removeChild(this.lastChild);this.append.apply(this,arguments)})});
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

// Runs before the page renders: marks phones and tablets as "lite" (src/lib/device.js), marks
// computers that draw 3D without a graphics chip as "no-gpu" (hardware acceleration off or the
// driver blocklisted, where 3D is drawn slowly in software), and on other devices starts
// downloading the 3D runtime and scenes right away.
function deviceScript(localBucky: boolean) {
  const base = JSON.stringify(BASE);
  return `(function(){var d=document.documentElement,q=location.search,lite=false;
try{lite=matchMedia(${JSON.stringify(LITE_QUERY)}).matches}catch(e){}
if(/[?&]lite=1/.test(q))lite=true;if(/[?&]lite=0/.test(q))lite=false;
var b=${base},h=document.head,add=function(rel,href,as,img){var l=document.createElement('link');l.rel=rel;l.href=b+href;if(as){l.as=as;if(!img)l.crossOrigin='anonymous'}h.appendChild(l)};
var seg=location.pathname.slice(b.length).replace(/^[/]|[/]$/g,'').split('/')[0],home=!seg;
d.classList.add('pg-'+(seg||'home'));
if(lite)d.classList.add('lite');
var nogpu=/[?&]gpu=0/.test(q);
if(!lite&&!nogpu&&!/[?&]gpu=1/.test(q)){try{var cv=document.createElement('canvas'),gl=cv.getContext('webgl',{failIfMajorPerformanceCaveat:true});
if(!gl)nogpu=true;else{var ri=gl.getExtension('WEBGL_debug_renderer_info'),rn=ri?String(gl.getParameter(ri.UNMASKED_RENDERER_WEBGL)):'';
if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(rn))nogpu=true;var lc=gl.getExtension('WEBGL_lose_context');if(lc)lc.loseContext()}}catch(e){}}
if(nogpu)d.classList.add('no-gpu');
if(home){var pl=document.createElement('link'),hp=b+'/assets/hero-poster-';pl.rel='preload';pl.as='image';pl.setAttribute('imagesrcset',hp+'828.webp 828w,'+hp+'1440.webp 1440w,'+hp+'2560.webp 2560w');pl.setAttribute('imagesizes','(max-aspect-ratio: 6/5) 190vw, max(100vw, (100vh - 60px) * 1.78)');pl.setAttribute('fetchpriority','high');h.appendChild(pl)}
if(lite||nogpu)return;
add('modulepreload','/vendor/spline/runtime.js');
${localBucky ? "add('preload','/assets/bucky.splinecode','fetch');" : ''}
})();`;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.__build=${JSON.stringify(process.env.NEXT_PUBLIC_BUILD || '')};` + BOOT_SCRIPT + deviceScript(LOCAL_BUCKY) }} />
      </head>
      <body>
        <PreloadScenes />
        {/* Covers the page while it loads and during page changes (src/lib/motion.js). */}
        <div id="page-curtain" aria-hidden="true">
          <div className="curtain-brand">
            <BrandLogo className="curtain-logo" />
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
