import Link from 'next/link';
import { STAGES } from '@/data/seed/stages';
import { getTaskStats } from '@/lib/actions/tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default async function ChecklistsIndexPage() {
  const stats = await getTaskStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">チェックリスト</h1>
      <div className="grid gap-4">
        {STAGES.map((stage) => {
          const stat = stats?.stages.find((s) => s.stage_id === stage.id);
          return (
            <Link key={stage.id} href={`/checklists/${stage.id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{stage.emoji}</span>
                    <div>
                      <div className="text-lg">{stage.label}</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {stage.description}
                      </div>
                    </div>
                    {stat && stat.total > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {stat.completed}/{stat.total}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                {stat && stat.total > 0 && (
                  <CardContent>
                    <Progress value={stat.percentage} className="h-2" />
                  </CardContent>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
