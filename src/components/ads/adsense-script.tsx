"use client";

import { useEffect } from 'react';
import Script from 'next/script';

const ADSENSE_FALLBACK_CLIENT_ID = 'ca-pub-3719155026592660';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? ADSENSE_FALLBACK_CLIENT_ID;

interface AdsenseScriptProps {
  enabled: boolean;
  onLoaded?: () => void;
}

export function AdsenseScript({ enabled, onLoaded }: AdsenseScriptProps) {
  useEffect(() => {
    if (!enabled) return;

    const adsState = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
    if (Array.isArray(adsState)) {
      onLoaded?.();
    }
  }, [enabled, onLoaded]);

  if (!enabled || !ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <Script
      id="sprout-adsense-sdk"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      onLoad={onLoaded}
    />
  );
}