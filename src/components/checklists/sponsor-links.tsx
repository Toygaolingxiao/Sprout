"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/context';
import type { CategoryId } from '@/types';

interface SponsorLinksProps {
  categoryFilter: CategoryId | 'all';
}

export function SponsorLinks({ categoryFilter }: SponsorLinksProps) {
  const { t } = useTranslation();

  if (categoryFilter !== 'all' && categoryFilter !== 'shopping' && categoryFilter !== 'money') {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('affiliate.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{t('affiliate.disclaimer')}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <a
            href="/api/affiliate/amazon-baby"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
          >
            {t('affiliate.amazonBaby')}
          </a>
          <a
            href="/api/affiliate/rakuten-baby"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
          >
            {t('affiliate.rakutenBaby')}
          </a>
          <a
            href="/api/affiliate/insurance"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
          >
            {t('affiliate.insurance')}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
