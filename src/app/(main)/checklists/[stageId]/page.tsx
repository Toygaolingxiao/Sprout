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
  const initResult = await initializeTasksFromTemplates(stageId as LifeStage);

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

      {initResult && 'error' in initResult && (
        <Card className="border-destructive">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">DB接続エラー: {initResult.error}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Supabase SQL Editorで 003_fix_postgrest.sql → 004_fix_test_user.sql を実行してください
            </p>
          </CardContent>
        </Card>
      )}

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
