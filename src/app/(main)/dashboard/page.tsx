import { getTasks, initializeTasksFromTemplates, getTaskStats } from '@/lib/actions/tasks';
import { getProfile } from '@/lib/actions/profile';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import { DashboardClient } from './dashboard-client';
import type { LifeStage, Task } from '@/types';

export default async function DashboardPage() {
  const profile = await getProfile();
  const currentStage = profile?.current_stage ?? 'prenatal_care';

  // Initialize current stage templates
  const initResult = await initializeTasksFromTemplates(currentStage);

  let tasks = await getTasks(currentStage);
  let dbOffline = false;

  // Fallback to local templates if DB unavailable
  if (tasks.length === 0 && initResult && 'error' in initResult) {
    dbOffline = true;
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
        sort_order: t.sort_order,
        is_custom: false,
        target_gender: t.target_gender,
        tips: t.tips ?? null,
        created_by: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies Task));
  }

  const stats = await getTaskStats();

  return (
    <DashboardClient
      profile={profile}
      tasks={tasks}
      currentStage={currentStage}
      stats={stats}
      dbOffline={dbOffline}
    />
  );
}
