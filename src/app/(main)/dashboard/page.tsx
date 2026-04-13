import Link from 'next/link';
import { getTaskStats } from '@/lib/actions/tasks';
import { getProfile } from '@/lib/actions/profile';
import { STAGE_MAP } from '@/data/seed/stages';
import type { LifeStage } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const [profile, stats] = await Promise.all([getProfile(), getTaskStats()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          おかえりなさい{profile?.nickname ? `、${profile.nickname}さん` : ''} 👋
        </h1>
        <p className="text-muted-foreground">
          今日も一歩ずつ進みましょう
        </p>
      </div>

      {/* Stage Progress Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {stats?.stages.map((stage) => {
          const stageInfo = STAGE_MAP[stage.stage_id];
          return (
            <Link key={stage.stage_id} href={`/checklists/${stage.stage_id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span>{stageInfo.emoji}</span>
                    <span>{stageInfo.label}</span>
                    {stage.total > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {stage.completed}/{stage.total}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stage.total > 0 ? (
                    <div className="space-y-1">
                      <Progress value={stage.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {stage.percentage}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      タップしてチェックリストを開始
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Upcoming Tasks */}
      {stats?.upcoming && stats.upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">📅 直近の予定</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {stats.upcoming.map((task, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span>{task.stage_id && STAGE_MAP[task.stage_id as LifeStage]?.emoji}</span>
                  <Badge variant="outline">{task.due_date}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {(!stats?.stages.some((s) => s.total > 0)) && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-lg font-medium mb-2">はじめましょう！🌱</p>
            <p className="text-sm text-muted-foreground mb-4">
              ライフステージを選んで、チェックリストをはじめましょう
            </p>
            <Link
              href={`/checklists/${profile?.current_stage ?? 'prenatal_care'}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              チェックリストを開く
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
