"use client";

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { createBillingPortalSession, createCheckoutSession } from '@/lib/actions/billing';
import { useTranslation } from '@/lib/i18n/context';
import { cn } from '@/lib/utils';
import type { SubscriptionTier } from '@/types';

interface BillingSectionProps {
  subscriptionTier: SubscriptionTier;
}

export function BillingSection({ subscriptionTier }: BillingSectionProps) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const isPro = subscriptionTier === 'pro';

  function localizeError(message: string) {
    if (message === 'billing.authRequired') return t('billing.authRequired');
    if (message === 'billing.profileRequired') return t('billing.profileRequired');
    if (message === 'billing.alreadyPro') return t('billing.alreadyPro');
    if (message === 'billing.priceNotConfigured') return t('billing.priceNotConfigured');
    if (message === 'billing.noCustomer') return t('billing.noCustomer');
    if (message === 'billing.checkoutFailed') return t('billing.checkoutFailed');
    if (message === 'billing.portalFailed') return t('billing.portalFailed');
    return message;
  }

  function handleUpgrade() {
    startTransition(async () => {
      const result = await createCheckoutSession();
      if (result?.error) {
        toast.error(localizeError(result.error));
        return;
      }
      if (result?.url) {
        window.location.assign(result.url);
      }
    });
  }

  function handleManageBilling() {
    startTransition(async () => {
      const result = await createBillingPortalSession();
      if (result?.error) {
        toast.error(localizeError(result.error));
        return;
      }
      if (result?.url) {
        window.location.assign(result.url);
      }
    });
  }

  return (
    <div className="space-y-3 rounded-lg border px-3 py-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t('billing.title')}</p>
        <Badge variant={isPro ? 'default' : 'outline'}>
          {isPro ? t('settings.planPro') : t('settings.planFree')}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{isPro ? t('billing.proHint') : t('billing.freeHint')}</p>

      {!isPro ? (
        <Button size="sm" className="w-full" onClick={handleUpgrade} disabled={isPending}>
          {isPending ? t('settings.saving') : t('billing.upgradeToPro')}
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="w-full" onClick={handleManageBilling} disabled={isPending}>
          {isPending ? t('settings.saving') : t('billing.manageSubscription')}
        </Button>
      )}

      {isPro ? (
        <a href="/api/export/tasks" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}>
          {t('billing.exportTasksCsv')}
        </a>
      ) : (
        <Button size="sm" variant="outline" className="w-full" disabled>
          {t('billing.exportTasksCsvProOnly')}
        </Button>
      )}
    </div>
  );
}
