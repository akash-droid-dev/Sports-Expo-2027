'use client';
// Mounts the Bucky guide once for the whole site and provides window.claude.complete,
// which the design's guide code uses for answers outside its built-in topics.
import { useEffect } from 'react';
import '@/data/ise';
import { initBucky } from '@/lib/bucky-guide';
import { withBase } from '@/lib/base';
import { initMotion } from '@/lib/motion';
import { initMobileFit } from '@/lib/mobile-fit';

declare global {
  interface Window {
    claude?: { complete: (prompt: string) => Promise<string> };
  }
}

export default function ClientInit({ localBucky = false }: { localBucky?: boolean }) {
  useEffect(() => {
    window.claude ??= {
      async complete(prompt: string) {
        const res = await fetch(withBase('/api/bucky'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('Bucky answer unavailable (' + res.status + ')');
        const data = (await res.json()) as { text?: string };
        if (!data.text) throw new Error('Bucky answer was empty');
        return data.text;
      },
    };
    initMotion();
    initMobileFit();
    initBucky({ localScene: localBucky });
  }, [localBucky]);
  return null;
}
