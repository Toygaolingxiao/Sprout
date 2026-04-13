import { notFound } from 'next/navigation';
import { getTasks, initializeTasksFromTemplates } from '@/lib/actions/tasks';
import { STAGE_MAP, STAGES } from '@/data/seed/stages';
import { ProgressOverview } from '@/components/checklists/progress-overview';
import { ChecklistClient } from './checklist-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LifeStage } from '@/types';

interface Props {
  params: Promise<{ stageId: string }>;
}

export default async function StageChecklistPage({ params }: Props) {
  const { stageId } = await params;
  const stage = STAGE_MAP[stageId as LifeStage];
  if (!stage) notFound();

  // Initialize from templates if needed
  await initializeTasksFromTemplates(stageId as LifeStage);

  const tasks = await getTasks(stageId as LifeStage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>{stage.emoji}</span>
          <span>{stage.label}</span>
        </h1>
        <p className="text-muted-foreground">{stage.description}</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">進捗</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressOverview tasks={tasks} />
        </CardContent>
      </Card>

      <ChecklistClient tasks={tasks} stageId={stageId as LifeStage} />
    </div>
  );
}

export function generateStaticParams() {
  return STAGES.map((s) => ({ stageId: s.id }));
}
