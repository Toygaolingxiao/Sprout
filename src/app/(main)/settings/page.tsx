import { getProfile } from '@/lib/actions/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { APP_VERSION } from '@/data/release-notes';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { ProfileSection } from '@/components/settings/profile-section';
import { ScheduleSection } from '@/components/settings/schedule-section';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { getLocale } from '@/lib/i18n/server';
import { serverT } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '設定 | Sprout',
};

export default async function SettingsPage() {
  const profile = await getProfile();
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      {/* Profile - inline edit */}
      {profile && <ProfileSection profile={profile} />}

      {/* Schedule - due dates */}
      {profile && <ScheduleSection profile={profile} />}

      {/* Language */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.appearance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSwitcher />
        </CardContent>
      </Card>

      {/* App info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.appInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('settings.version')}</span>
            <span className="font-mono text-xs">{APP_VERSION}</span>
          </div>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground">
            {t('settings.tagline')}
          </p>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.account')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form action={signOut}>
            <Button variant="outline" size="sm" className="w-full" type="submit">
              {t('nav.logout')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
