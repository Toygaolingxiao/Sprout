import Link from 'next/link';
import { getProfile } from '@/lib/actions/profile';
import { STAGE_MAP } from '@/data/seed/stages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '設定 | Sprout',
};

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">設定</h1>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">👤 プロフィール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ニックネーム</span>
            <span className="font-medium">{profile?.nickname || '未設定'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ライフステージ</span>
            <span className="font-medium">
              {profile?.current_stage
                ? `${STAGE_MAP[profile.current_stage]?.emoji} ${STAGE_MAP[profile.current_stage]?.label}`
                : '未設定'}
            </span>
          </div>
          <Separator className="my-2" />
          <Link
            href="/settings/profile"
            className="block text-primary hover:underline text-sm"
          >
            プロフィールを編集 →
          </Link>
        </CardContent>
      </Card>

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
            <span className="font-mono text-xs">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">開発</span>
            <span>Sprout Team</span>
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
