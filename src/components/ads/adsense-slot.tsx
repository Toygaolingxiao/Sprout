"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdsenseSlotProps {
  slotId?: string;
  ready: boolean;
  className?: string;
}

export function AdsenseSlot({ slotId, ready, className }: AdsenseSlotProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!ready || !slotId || initializedRef.current) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedRef.current = true;
    } catch (error) {
      console.error('[AdsenseSlot] failed to render ad slot', error);
    }
  }, [ready, slotId]);

  if (!ADSENSE_CLIENT_ID || !slotId) {
    return null;
  }

  return (
    <ins
      className={cn('adsbygoogle block w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20', className)}
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}