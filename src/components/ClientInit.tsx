'use client';
// Mounts the R-4X guide once for the whole site and provides window.claude.complete,
// which the design's guide code uses for answers outside its built-in topics.
import { useEffect } from 'react';
import '@/data/ise';
import { initR4X } from '@/lib/r4x-guide';

declare global {
  interface Window {
    claude?: { complete: (prompt: string) => Promise<string> };
  }
}

export default function ClientInit() {
  useEffect(() => {
    window.claude ??= {
      async complete(prompt: string) {
        const res = await fetch('/api/r4x', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error('R-4X answer unavailable (' + res.status + ')');
        const data = (await res.json()) as { text?: string };
        if (!data.text) throw new Error('R-4X answer was empty');
        return data.text;
      },
    };
    initR4X();
  }, []);
  return null;
}
