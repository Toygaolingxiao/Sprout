import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocale, serverT } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'マニュアル | Sprout',
  description: 'Sproutの利用マニュアル',
};

export default async function ManualPage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('manual.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('manual.subtitle')}</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1. {t('manual.section.start')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1">
            <li>{t('manual.start.step1')}</li>
            <li>{t('manual.start.step2')}</li>
            <li>{t('manual.start.step3')}</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2. {t('manual.section.family')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1">
            <li>{t('manual.family.step1')}</li>
            <li>{t('manual.family.step2')}</li>
            <li>{t('manual.family.step3')}</li>
          </ol>
          <p className="text-xs text-muted-foreground">{t('manual.family.note')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">3. {t('manual.section.checklist')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('manual.checklist.item1')}</li>
            <li>{t('manual.checklist.item2')}</li>
            <li>{t('manual.checklist.item3')}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">4. {t('manual.section.troubleshoot')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('manual.troubleshoot.item1')}</li>
            <li>{t('manual.troubleshoot.item2')}</li>
            <li>{t('manual.troubleshoot.item3')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}