"use client";

import Script from 'next/script';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

interface AdsenseScriptProps {
  enabled: boolean;
  onLoaded?: () => void;
}

export function AdsenseScript({ enabled, onLoaded }: AdsenseScriptProps) {
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