import Link from 'next/link';
import { getFamilyMembers } from '@/lib/actions/family';
import { getProfile } from '@/lib/actions/profile';
import { STAGE_MAP } from '@/data/seed/stages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLocale, serverT } from '@/lib/i18n/server';
import type { TranslationKey } from '@/lib/i18n';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '家族 | Sprout',
  description: '家族メンバーの管理',
};
import { InviteSection } from '@/components/family/invite-section';
import { LeaveFamilySection } from '@/components/family/leave-family-section';

export default async function FamilyPage() {
  const [profile, members] = await Promise.all([getProfile(), getFamilyMembers()]);
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  const nearbyPediatricsUrl = 'https://www.google.com/maps/search/?api=1&query=%E4%BB%98%E8%BF%91%E3%81%AE%E5%B0%8F%E5%85%90%E7%A7%91';
  const pediatricsUrl = 'https://www.google.com/maps/search/?api=1&query=%E5%B0%8F%E5%85%90%E7%A7%91';
  const obgynUrl = 'https://www.google.com/maps/search/?api=1&query=%E7%94%A3%E5%A9%A6%E4%BA%BA%E7%A7%91';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('family.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('family.schedule')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('family.scheduleDesc')}</p>
          <Link
            href="/settings#profile-schedule"
            className="inline-flex h-9 items-center rounded-lg border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
          >
            {t('family.editSchedule')}
          </Link>
        </CardContent>
      </Card>

      {/* 近くの病院検索 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('family.nearbyHospitalTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('family.nearbyHospitalDesc')}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <a
              href={nearbyPediatricsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              {t('family.searchNearbyPediatrics')}
            </a>
            <a
              href={pediatricsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              {t('family.searchPediatrics')}
            </a>
            <a
              href={obgynUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              {t('family.searchObgyn')}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* メンバー一覧 */}
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

      {profile?.family_id && <LeaveFamilySection memberCount={members.length} />}
    </div>
  );
}
