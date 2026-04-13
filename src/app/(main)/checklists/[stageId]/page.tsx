import { notFound } from 'next/navigation';
import { getTasks, initializeTasksFromTemplates } from '@/lib/actions/tasks';
import { STAGE_MAP, STAGES } from '@/data/seed/stages';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import { ProgressOverview } from '@/components/checklists/progress-overview';
import { ChecklistClient } from './checklist-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LifeStage, Task } from '@/types';

interface Props {
  params: Promise<{ stageId: string }>;
}

export default async function StageChecklistPage({ params }: Props) {
  const { stageId } = await params;
  const stage = STAGE_MAP[stageId as LifeStage];
  if (!stage) notFound();

  // Initialize from templates if needed
  const initResult = await initializeTasksFromTemplates(stageId as LifeStage);

  let tasks = await getTasks(stageId as LifeStage);
  let dbOffline = false;

  // Fallback: if DB is unavailable, show local templates as read-only tasks
  if (tasks.length === 0 && initResult && 'error' in initResult) {
    dbOffline = true;
    tasks = CHECKLIST_TEMPLATES
      .filter((t) => t.stage_id === stageId)
      .map((t, i) => ({
        id: `local-${i}`,
        family_id: '',
        stage_id: t.stage_id,
        category_id: t.category_id,
        template_id: null,
        title: t.title,
        description: t.description ?? null,
        is_completed: false,
        completed_by: null,
        completed_at: null,
        assigned_to: null,
        due_date: null,
        sort_order: t.sort_order,
        is_custom: false,
        target_gender: t.target_gender,
        tips: t.tips ?? null,
        created_by: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies Task));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>{stage.emoji}</span>
          <span>{stage.label}</span>
        </h1>
        <p className="text-muted-foreground">{stage.description}</p>
      </div>

      {dbOffline && (
        <Card className="border-amber-500">
          <CardContent className="pt-4">
            <p className="text-sm text-amber-700">⚠️ DB接続待機中 — テンプレート項目をプレビュー表示しています</p>
            <p className="text-xs text-muted-foreground mt-1">
              チェックのON/OFFはDB接続後に有効になります。ページをリロードしてください。
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
