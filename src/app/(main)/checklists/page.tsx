import Link from 'next/link';
import { STAGES } from '@/data/seed/stages';
import { getTaskStats } from '@/lib/actions/tasks';
import { getProfile } from '@/lib/actions/profile';
import { Card, CardContent } from '@/components/ui/card';
import { getLocale, serverT } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'チェックリスト | Sprout',
  description: '妊活・妊娠・産後・育児のチェックリスト',
};
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { LifeStage } from '@/types';

export default async function ChecklistsIndexPage() {
  const [stats, profile] = await Promise.all([getTaskStats(), getProfile()]);
  const currentStage = profile?.current_stage ?? 'prenatal_care';
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('checklist.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('checklist.chooseStage')}</p>
      </div>
      <div className="grid gap-3">
        {STAGES.map((stage) => {
          const stat = stats?.stages.find((s) => s.stage_id === stage.id);
          const isCurrent = stage.id === currentStage;
          return (
            <Link key={stage.id} href={`/checklists/${stage.id}`}>
              <Card className={`transition-all hover:shadow-md ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}>
                <CardContent className="py-4 flex items-center gap-4">
                  <span className="text-3xl">{stage.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{t(`stage.${stage.id}` as any)}</span>
                      {isCurrent && <Badge className="text-[10px] h-4 px-1.5">{t('checklist.current')}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(`stage.${stage.id}.desc` as any)}</p>
                    {stat && stat.total > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={stat.percentage} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-16 text-right">
                          {stat.completed}/{stat.total}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-muted-foreground text-lg">›</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
