import { getFamilyMembers } from '@/lib/actions/family';
import { getProfile } from '@/lib/actions/profile';
import { STAGE_MAP } from '@/data/seed/stages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '家族 | Sprout',
  description: '家族メンバーの管理',
};
import { InviteSection } from '@/components/family/invite-section';

export default async function FamilyPage() {
  const [profile, members] = await Promise.all([getProfile(), getFamilyMembers()]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">👨‍👩‍👧 家族</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">メンバー</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">メンバーがいません</p>
          ) : (
            <ul className="space-y-3">
              {members.map((member) => (
                <li key={member.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    {member.nickname?.[0] ?? '?'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {member.nickname || '未設定'}
                      {member.id === profile?.id && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          あなた
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {STAGE_MAP[member.current_stage]?.emoji}{' '}
                      {STAGE_MAP[member.current_stage]?.label}
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
