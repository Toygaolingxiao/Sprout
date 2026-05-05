import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTasks, initializeTasksFromTemplates } from '@/lib/actions/tasks';
import { STAGE_MAP, STAGES } from '@/data/seed/stages';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import { ProgressOverview } from '@/components/checklists/progress-overview';
import { ChecklistClient } from './checklist-client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLocale, serverT } from '@/lib/i18n/server';
import type { TranslationKey } from '@/lib/i18n';
import type { LifeStage, Task } from '@/types';

interface Props {
  params: Promise<{ stageId: string }>;
}

export default async function StageChecklistPage({ params }: Props) {
  const { stageId } = await params;
  const stage = STAGE_MAP[stageId as LifeStage];
  if (!stage) notFound();

  const initResult = await initializeTasksFromTemplates(stageId as LifeStage);

  let tasks = await getTasks(stageId as LifeStage);
  let dbOffline = false;
  let dbError = '';

  if (tasks.length === 0 && initResult && 'error' in initResult) {
    dbOffline = true;
    dbError = String(initResult.error);
    console.error('[StageChecklistPage] DB offline, error:', dbError);
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
        priority: 'medium',
        sort_order: t.sort_order,
        is_custom: false,
        target_gender: t.target_gender,
        tips: t.tips ?? null,
        created_by: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies Task));
  }

  const completed = tasks.filter((t) => t.is_completed).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-5">
      {/* Back + Stage tabs */}
      <div className="scroll-fade-right">
      <div className="flex items-center gap-2 -mx-4 px-4 overflow-x-auto pb-1 scrollbar-hide">
        {STAGES.map((s) => {
          const isActive = s.id === stageId;
          return (
            <Link
              key={s.id}
              href={`/checklists/${s.id}`}
              className={`flex-shrink-0 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{t(`stage.${s.id}` as TranslationKey)}</span>
            </Link>
          );
        })}
      </div>
      </div>

      {/* Stage header + progress */}
      <div>
        <div className="flex items-center justify-between min-w-0">
          <h1 className="text-xl font-bold flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0">{stage.emoji}</span>
            <span className="truncate">{t(`stage.${stageId}` as TranslationKey)}</span>
          </h1>
          <Badge variant="secondary" className="flex-shrink-0 ml-2">{completed}/{total} ({pct}%)</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{t(`stage.${stageId}.desc` as TranslationKey)}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t(`stage.${stageId}.period` as TranslationKey)}</p>
      </div>

      {dbOffline && (
        <Card className="border-amber-400 bg-amber-50">
          <CardContent className="py-3">
            <p className="text-sm text-amber-800">{t('dashboard.dbWarning')}</p>
            {dbError && <p className="text-xs text-amber-600 mt-1">{t('dashboard.cause')} {dbError}</p>}
          </CardContent>
        </Card>
      )}

      {/* Progress by category */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <ProgressOverview tasks={tasks} />
        </CardContent>
      </Card>

      {/* Full checklist */}
      <ChecklistClient
        tasks={tasks}
        stageId={stageId as LifeStage}
        dbOffline={dbOffline}
      />
    </div>
  );
}

export function generateStaticParams() {
  return STAGES.map((s) => ({ stageId: s.id }));
}
