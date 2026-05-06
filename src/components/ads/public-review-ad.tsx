"use client";

import { useEffect, useState } from 'react';
import { AdsenseScript } from '@/components/ads/adsense-script';
import { AdsenseSlot } from '@/components/ads/adsense-slot';
import { useTranslation } from '@/lib/i18n/context';

const ADSENSE_FALLBACK_SLOT_TOP = '5167037122';

export function PublicReviewAd() {
  const { t } = useTranslation();
  const [adsReady, setAdsReady] = useState(false);
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CHECKLIST_TOP ?? ADSENSE_FALLBACK_SLOT_TOP;

  useEffect(() => {
    const hasAdsSdk = () => {
      const adsState = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
      return Array.isArray(adsState);
    };

    if (hasAdsSdk()) {
      setAdsReady(true);
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;

      if (hasAdsSdk()) {
        setAdsReady(true);
        window.clearInterval(timer);
        return;
      }

      if (attempts >= 40) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-label="sponsored" className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <AdsenseScript enabled onLoaded={() => setAdsReady(true)} />
        <AdsenseSlot
          ready={adsReady}
          slotId={slotId}
          compact
          className="!h-[108px] sm:!h-[120px]"
          placeholderTitle={t('ads.slotPendingTitle')}
          placeholderDescription={t('ads.slotPendingDescription')}
        />
      </div>
    </section>
  );
}
