import { getFamilyMembers } from '@/lib/actions/family';
import { getProfile } from '@/lib/actions/profile';
import { STAGE_MAP } from '@/data/seed/stages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLocale, serverT } from '@/lib/i18n/server';
import type { TranslationKey } from '@/lib/i18n';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '家族 | Sprout',
  description: '家族メンバーの管理',
};
import { InviteSection } from '@/components/family/invite-section';

export default async function FamilyPage() {
  const [profile, members] = await Promise.all([getProfile(), getFamilyMembers()]);
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('family.title')}</h1>

      <Card data-testid="family-schedule-card">
        <CardHeader>
          <CardTitle className="text-base">{t('family.schedule')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('family.scheduleDesc')}</p>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
              <dt className="text-muted-foreground">{t('settings.pregnancyDate')}</dt>
              <dd className="font-medium">{profile?.expected_pregnancy_date ?? t('family.notSet')}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
              <dt className="text-muted-foreground">{t('settings.dueDate')}</dt>
              <dd className="font-medium">{profile?.expected_due_date ?? t('family.notSet')}</dd>
            </div>
          </dl>
          <Link href="/settings" className="inline-flex text-sm font-medium text-primary hover:underline">
            {t('family.editSchedule')}
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('family.members')}</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('family.noMembers')}</p>
          ) : (
            <ul className="space-y-3">
              {members.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    {member.nickname?.[0] ?? '?'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm truncate">
                      {member.nickname || t('family.notSet')}
                      {member.id === profile?.id && (
                        <Badge variant="secondary" className="ml-2 text-xs flex-shrink-0">
                          {t('family.you')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {STAGE_MAP[member.current_stage]?.emoji}{' '}
                      {t(`stage.${member.current_stage}` as TranslationKey)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <InviteSection />
    </div>
  );
}
