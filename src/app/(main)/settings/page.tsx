import Link from 'next/link';
import { getProfile } from '@/lib/actions/profile';
import { STAGE_MAP } from '@/data/seed/stages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">設定</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">プロフィール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ニックネーム</span>
            <span>{profile?.nickname || '未設定'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ライフステージ</span>
            <span>
              {profile?.current_stage
                ? STAGE_MAP[profile.current_stage]?.label
                : '未設定'}
            </span>
          </div>
          <Separator className="my-2" />
          <Link
            href="/settings/profile"
            className="block text-primary hover:underline"
          >
            プロフィールを編集
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
