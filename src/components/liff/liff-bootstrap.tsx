'use client';

import { useEffect } from 'react';
import { initLiff } from '@/lib/liff/client';

export function LiffBootstrap() {
  useEffect(() => {
    void initLiff().catch(() => {
      // Ignore bootstrap failures; explicit login action will surface errors.
    });
  }, []);

  return null;
}
