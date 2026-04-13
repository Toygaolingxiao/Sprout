import { getProfile } from '@/lib/actions/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { APP_VERSION } from '@/data/release-notes';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { ProfileSection } from '@/components/settings/profile-section';
import { ScheduleSection } from '@/components/settings/schedule-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '設定 | Sprout',
};

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">設定</h1>

      {/* Profile - inline edit */}
      {profile && <ProfileSection profile={profile} />}

      {/* Schedule - due dates */}
      {profile && <ScheduleSection profile={profile} />}

      {/* Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🎨 外観</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSwitcher />
        </CardContent>
      </Card>

      {/* App info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ℹ️ アプリ情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">バージョン</span>
            <span className="font-mono text-xs">{APP_VERSION}</span>
          </div>
          <Separator className="my-2" />
          <p className="text-xs text-muted-foreground">
            🌱 Sprout — 夫婦で育てる、新しい命の準備
          </p>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🔐 アカウント</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <form action={signOut}>
            <Button variant="outline" size="sm" className="w-full" type="submit">
              ログアウト
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
