"use client";

import { useEffect, useState } from 'react';
import { AdsenseScript } from '@/components/ads/adsense-script';
import { AdsenseSlot } from '@/components/ads/adsense-slot';
import { TaskList } from '@/components/checklists/task-list';
import { TaskForm } from '@/components/checklists/task-form';
import { CategoryFilter } from '@/components/checklists/category-filter';
import { GenderFilter } from '@/components/checklists/gender-filter';
import { SponsorLinks } from '@/components/checklists/sponsor-links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';
import type { Task, LifeStage, CategoryId, TargetGender, SubscriptionTier } from '@/types';

const ADS_CONSENT_KEY = 'sprout-ads-consent-v1';

type AdsConsentState = 'granted' | 'denied' | null;

interface ChecklistClientProps {
  tasks: Task[];
  stageId: LifeStage;
  subscriptionTier: SubscriptionTier;
  dbOffline?: boolean;
}

export function ChecklistClient({ tasks, stageId, subscriptionTier, dbOffline }: ChecklistClientProps) {
  const { t } = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<TargetGender | 'all'>('all');
  const [adsConsent, setAdsConsent] = useState<AdsConsentState>(null);
  const [adsReady, setAdsReady] = useState(false);

  const isFreePlan = subscriptionTier === 'free';

  useEffect(() => {
    if (!isFreePlan) return;

    const saved = localStorage.getItem(ADS_CONSENT_KEY);
    if (saved === 'granted' || saved === 'denied') {
      setAdsConsent(saved);
    }
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

  const showAdsense = isFreePlan && adsConsent === 'granted';

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (genderFilter !== 'all' && t.target_gender !== genderFilter && t.target_gender !== 'both') return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <GenderFilter value={genderFilter} onChange={setGenderFilter} />
      </div>
      <TaskList tasks={filteredTasks} />

      {isFreePlan && adsConsent !== 'granted' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('ads.consentTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{t('ads.consentDescription')}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => updateAdsConsent('granted')}>
                {t('ads.consentAccept')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => updateAdsConsent('denied')}>
                {t('ads.consentDecline')}
              </Button>
            </div>
            {adsConsent === 'denied' && (
              <p className="text-xs text-muted-foreground">{t('ads.consentDeclinedHint')}</p>
            )}
          </CardContent>
        </Card>
      )}

      <AdsenseScript enabled={showAdsense} onLoaded={() => setAdsReady(true)} />
      {showAdsense && (
        <AdsenseSlot
          ready={adsReady}
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CHECKLIST_TOP}
          className="min-h-[110px]"
          placeholderTitle={t('ads.slotPendingTitle')}
          placeholderDescription={t('ads.slotPendingDescription')}
        />
      )}

      <SponsorLinks categoryFilter={categoryFilter} />

      {showAdsense && (
        <AdsenseSlot
          ready={adsReady}
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CHECKLIST_BOTTOM}
          className="min-h-[110px]"
          placeholderTitle={t('ads.slotPendingTitle')}
          placeholderDescription={t('ads.slotPendingDescription')}
        />
      )}

      {!dbOffline && <TaskForm stageId={stageId} />}
    </div>
  );
}
