import { getTasks, initializeTasksFromTemplates, getTaskStats } from '@/lib/actions/tasks';
import { getProfile } from '@/lib/actions/profile';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import { DashboardClient } from './dashboard-client';
import type { Metadata } from 'next';
import type { Task } from '@/types';

export const metadata: Metadata = {
  title: 'ホーム | Sprout',
  description: '今日のやることを確認しましょう',
};

export default async function DashboardPage() {
  let profile: Awaited<ReturnType<typeof getProfile>> = null;
  let tasks: Task[] = [];
  let stats: Awaited<ReturnType<typeof getTaskStats>> = null;
  let dbOffline = false;
  let dbError = '';

  try {
    profile = await getProfile();
  } catch (e) {
    console.error('[DashboardPage] getProfile failed:', e);
  }

  const currentStage = profile?.current_stage ?? 'prenatal_care';

  try {
    // Initialize current stage templates
    const initResult = await initializeTasksFromTemplates(currentStage);
    const [loadedTasks, loadedStats] = await Promise.all([
      getTasks(currentStage),
      getTaskStats(),
    ]);
    tasks = loadedTasks;
    stats = loadedStats;

    // Fallback to local templates if DB unavailable
    if (tasks.length === 0 && initResult && 'error' in initResult) {
      dbOffline = true;
      dbError = String(initResult.error);
      console.error('[DashboardPage] DB offline, error:', dbError);
      tasks = CHECKLIST_TEMPLATES
        .filter((t) => t.stage_id === currentStage)
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

  } catch (e) {
    console.error('[DashboardPage] Task loading failed:', e);
    dbOffline = true;
    dbError = e instanceof Error ? e.message : String(e);
  }

  return (
    <DashboardClient
      profile={profile}
      tasks={tasks}
      currentStage={currentStage}
      stats={stats}
      dbOffline={dbOffline}
      dbError={dbError}
    />
  );
}
