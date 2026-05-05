"use client";

import { useEffect, useRef, useState } from 'react';
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
  placeholderTitle?: string;
  placeholderDescription?: string;
}

export function AdsenseSlot({
  slotId,
  ready,
  className,
  placeholderTitle,
  placeholderDescription,
}: AdsenseSlotProps) {
  const initializedRef = useRef(false);
  const slotRef = useRef<HTMLModElement>(null);
  const [hasCreative, setHasCreative] = useState(false);

  useEffect(() => {
    if (!slotId) {
      setHasCreative(false);
      initializedRef.current = false;
      return;
    }
  }, [slotId]);

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

  useEffect(() => {
    const element = slotRef.current;
    if (!element || !slotId) return;

    const detectCreative = () => {
      const html = element.innerHTML.trim();
      if (html.length > 0) {
        setHasCreative(true);
      }
    };

    detectCreative();
    const observer = new MutationObserver(detectCreative);
    observer.observe(element, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [slotId]);

  if (!ADSENSE_CLIENT_ID || !slotId) {
    return null;
  }

  const showPlaceholder = !hasCreative;

  return (
    <div className="space-y-2">
      <ins
        ref={slotRef}
        className={cn('adsbygoogle block w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20', className)}
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {showPlaceholder && (
        <div className="rounded-md border border-dashed border-border/70 bg-muted/30 px-3 py-2">
          <p className="text-xs font-medium text-foreground/80">
            {placeholderTitle ?? 'Ad loading'}
          </p>
          <p className="text-xs text-muted-foreground">
            {placeholderDescription ?? 'This ad area may appear after review and ad delivery are ready.'}
          </p>
        </div>
      )}
    </div>
  );
}