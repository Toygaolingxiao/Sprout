"use client";

import { useEffect, useState } from 'react';
import { AdsenseScript } from '@/components/ads/adsense-script';
import { AdsenseSlot } from '@/components/ads/adsense-slot';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';
import type { SubscriptionTier } from '@/types';

const ADS_CONSENT_KEY = 'sprout-ads-consent-v1';

type AdsConsentState = 'granted' | 'denied' | null;

interface HeaderAdBannerProps {
  subscriptionTier: SubscriptionTier;
}

export function HeaderAdBanner({ subscriptionTier }: HeaderAdBannerProps) {
  const { t } = useTranslation();
  const [adsConsent, setAdsConsent] = useState<AdsConsentState>(null);
  const [adsReady, setAdsReady] = useState(false);

  const isFreePlan = subscriptionTier === 'free';

  useEffect(() => {
    if (!isFreePlan) return;

    const saved = localStorage.getItem(ADS_CONSENT_KEY);
    if (saved === 'granted' || saved === 'denied') {
      setAdsConsent(saved);
      return;
    }

    setAdsConsent('granted');
    localStorage.setItem(ADS_CONSENT_KEY, 'granted');
  }, [isFreePlan]);

  useEffect(() => {
    if (!isFreePlan) return;

    const adsState = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
    if (Array.isArray(adsState)) {
      setAdsReady(true);
    }
  }, [isFreePlan]);

  const updateAdsConsent = (value: Exclude<AdsConsentState, null>) => {
    setAdsConsent(value);
    localStorage.setItem(ADS_CONSENT_KEY, value);

    if (value === 'granted') {
      const adsState = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
      if (Array.isArray(adsState)) {
        setAdsReady(true);
      }
    }
  };

  if (!isFreePlan) {
    return null;
  }

  const showAdsense = adsConsent === 'granted';

  return (
    <div className="w-full border-b border-border/40 bg-background/95">
      <div className="mx-auto w-full max-w-lg px-4 py-2">
        {showAdsense ? (
          <>
            <AdsenseScript enabled onLoaded={() => setAdsReady(true)} />
            <AdsenseSlot
              ready={adsReady}
              slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CHECKLIST_TOP}
              className="min-h-[96px]"
              placeholderTitle={t('ads.slotPendingTitle')}
              placeholderDescription={t('ads.slotPendingDescription')}
            />
          </>
        ) : (
          <div className="rounded-md border border-border/70 bg-muted/30 px-3 py-2">
            <p className="text-xs text-muted-foreground">{t('ads.consentDescription')}</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => updateAdsConsent('granted')}>
                {t('ads.consentAccept')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => updateAdsConsent('denied')}>
                {t('ads.consentDecline')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
