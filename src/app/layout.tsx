import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import ClientInit from '@/components/ClientInit';
import './globals.css';
import './dc-pseudo.css';

export const metadata: Metadata = {
  title: 'India Sports Expo 2027 · Yashobhoomi',
  description:
    'India Sports Expo 2027 at Exhibition Hall 2, Yashobhoomi (IICC), Dwarka, New Delhi. Explore the hall, exhibit, attend, connect and watch.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        {children}
        <ClientInit />
        {/* <image-slot> media placeholders. Fill slots by id in public/image-slots.state.json. */}
        <Script src="/image-slot.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
