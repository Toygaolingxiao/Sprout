"use client";

import { useEffect, useState } from 'react';
import { AdsenseScript } from '@/components/ads/adsense-script';
import { AdsenseSlot } from '@/components/ads/adsense-slot';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';

const ADSENSE_FALLBACK_SLOT_TOP = '5167037122';
const ADBLOCK_HELP_DISMISSED_KEY = 'sprout-adblock-help-dismissed-v1';

type BlockerOption = 'adblock' | 'abp' | 'ublock' | 'other';

export function PublicReviewAd() {
  const { t } = useTranslation();
  const [adsReady, setAdsReady] = useState(false);
  const [showAdblockHelp, setShowAdblockHelp] = useState(false);
  const [helpDismissed, setHelpDismissed] = useState(false);
  const [selectedBlocker, setSelectedBlocker] = useState<BlockerOption>('adblock');
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CHECKLIST_TOP ?? ADSENSE_FALLBACK_SLOT_TOP;

  useEffect(() => {
    const dismissed = localStorage.getItem(ADBLOCK_HELP_DISMISSED_KEY) === '1';
    setHelpDismissed(dismissed);
  }, []);

  useEffect(() => {
    const hasAdsSdk = () => {
      const adsState = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle;
      return Array.isArray(adsState);
    };

    if (hasAdsSdk()) {
      setAdsReady(true);
      setShowAdblockHelp(false);
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;

      if (hasAdsSdk()) {
        setAdsReady(true);
        setShowAdblockHelp(false);
        window.clearInterval(timer);
        return;
      }

      if (attempts >= 40) {
        if (!helpDismissed) {
          setShowAdblockHelp(true);
        }
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [helpDismissed]);

  const blockerOptions: Array<{ key: BlockerOption; label: string }> = [
    { key: 'adblock', label: t('ads.adblockHelp.option.adblock') },
    { key: 'abp', label: t('ads.adblockHelp.option.abp') },
    { key: 'ublock', label: t('ads.adblockHelp.option.ublock') },
    { key: 'other', label: t('ads.adblockHelp.option.other') },
  ];

  const blockerName = blockerOptions.find((item) => item.key === selectedBlocker)?.label ?? t('ads.adblockHelp.option.other');

  const dismissHelp = () => {
    setShowAdblockHelp(false);
    setHelpDismissed(true);
    localStorage.setItem(ADBLOCK_HELP_DISMISSED_KEY, '1');
  };

  return (
    <>
      <section aria-label="sponsored" className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-center text-[11px] tracking-wide text-muted-foreground">
            {t('affiliate.title')}
          </p>
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

      {showAdblockHelp && (
        <div className="fixed inset-0 z-[120] bg-black/55 px-4 py-8">
          <div className="mx-auto max-w-3xl rounded-2xl bg-background shadow-xl">
            <div className="flex justify-end p-3">
              <button
                type="button"
                className="size-8 rounded-full text-muted-foreground hover:bg-muted"
                aria-label={t('ads.adblockHelp.close')}
                onClick={dismissHelp}
              >
                ×
              </button>
            </div>

            <div className="px-6 pb-6 sm:px-10 sm:pb-10">
              <h3 className="text-center text-2xl font-bold">{t('ads.adblockHelp.question')}</h3>
              <p className="mt-4 text-center text-muted-foreground">{t('ads.adblockHelp.description')}</p>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {blockerOptions.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedBlocker(item.key)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      selectedBlocker === item.key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <ol className="mt-6 space-y-2 text-base leading-relaxed">
                <li>1. {t('ads.adblockHelp.step1', { name: blockerName })}</li>
                <li>2. {t('ads.adblockHelp.step2', { name: blockerName })}</li>
                <li>3. {t('ads.adblockHelp.step3')}</li>
              </ol>

              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => window.location.reload()}
                  className="min-w-52"
                >
                  {t('ads.adblockHelp.refresh')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
