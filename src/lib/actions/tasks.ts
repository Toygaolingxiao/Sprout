"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import type { LifeStage, CategoryId, Task } from '@/types';

export async function getTasks(stageId?: LifeStage): Promise<Task[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('tasks')
    .select('*')
    .order('sort_order', { ascending: true });

  if (stageId) {
    query = query.eq('stage_id', stageId);
  }

  const { data } = await query;
  return (data ?? []) as Task[];
}

export async function createTask(input: {
  title: string;
  stage_id: LifeStage;
  category_id: CategoryId;
  description?: string;
  due_date?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single() as { data: { family_id: string | null } | null };

  if (!profile?.family_id) return { error: '家族グループが見つかりません' };

  // Get max sort_order for this stage
  const { data: maxTask } = await supabase
    .from('tasks')
    .select('sort_order')
    .eq('family_id', profile.family_id)
    .eq('stage_id', input.stage_id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single() as { data: { sort_order: number } | null };

  const { error } = await supabase.from('tasks').insert({
    family_id: profile.family_id,
    stage_id: input.stage_id,
    category_id: input.category_id,
    title: input.title,
    description: input.description ?? null,
    due_date: input.due_date ?? null,
    sort_order: (maxTask?.sort_order ?? 0) + 1,
    is_custom: true,
    created_by: user.id,
  } as Record<string, unknown>);

  if (error) return { error: error.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません' };

  const { error } = await supabase
    .from('tasks')
    .update({
      is_completed: isCompleted,
      completed_by: isCompleted ? user.id : null,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', taskId);

  if (error) return { error: error.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateTask(taskId: string, input: {
  title?: string;
  description?: string;
  category_id?: CategoryId;
  due_date?: string | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', taskId);

  if (error) return { error: error.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) return { error: error.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function initializeTasksFromTemplates(stageId: LifeStage) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('[initializeTasksFromTemplates] Not authenticated');
    return { error: '認証されていません' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('family_id, expected_due_date, expected_pregnancy_date')
    .eq('id', user.id)
    .single() as { data: { family_id: string | null; expected_due_date: string | null; expected_pregnancy_date: string | null } | null; error: { code: string; message: string } | null };

  if (profileError) {
    console.error('[initializeTasksFromTemplates] Profile lookup failed:', profileError.code, profileError.message);
    return { error: `プロフィール取得エラー: ${profileError.code} - ${profileError.message}` };
  }

  if (!profile?.family_id) {
    console.error('[initializeTasksFromTemplates] No family_id for user', user.id);
    return { error: '家族グループが見つかりません' };
  }

  // Check if tasks already exist for this stage
  const { count, error: countError } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', profile.family_id)
    .eq('stage_id', stageId);

  if (countError) {
    console.error('[initializeTasksFromTemplates] Task count check failed:', countError.code, countError.message);
    return { error: `タスク確認エラー: ${countError.code} - ${countError.message}` };
  }

  if (count && count > 0) return { success: true, message: '既にタスクが存在します' };

  // Use local seed data directly (no DB template dependency)
  const localTemplates = CHECKLIST_TEMPLATES.filter((t) => t.stage_id === stageId);

  if (localTemplates.length === 0) return { success: true, message: 'テンプレートがありません' };

  const dueDateBase = profile.expected_due_date ? new Date(profile.expected_due_date + 'T00:00:00') : null;
  const pregnancyDateBase = profile.expected_pregnancy_date ? new Date(profile.expected_pregnancy_date + 'T00:00:00') : null;

  const tasks = localTemplates.map((t) => {
    let due_date: string | null = null;

    if (t.stage_id === 'prenatal_care' && pregnancyDateBase) {
      // 妊活: 妊娠予定時期を基準に
      const d = new Date(pregnancyDateBase);
      d.setDate(d.getDate() + (t.days_offset ?? -30));
      due_date = d.toISOString().split('T')[0];
    } else if (t.stage_id !== 'prenatal_care' && dueDateBase && (t.days_offset || t.days_offset === 0)) {
      // 妊娠・産後・育児: 出産予定日を基準
      const d = new Date(dueDateBase);
      d.setDate(d.getDate() + t.days_offset);
      due_date = d.toISOString().split('T')[0];
    }
    return {
      family_id: profile.family_id!,
      stage_id: t.stage_id,
      category_id: t.category_id,
      title: t.title,
      description: t.description ?? null,
      sort_order: t.sort_order,
      target_gender: t.target_gender,
      tips: t.tips ?? null,
      is_custom: false,
      created_by: user.id,
      due_date,
    };
  });

  const { error } = await supabase.from('tasks').insert(tasks as Record<string, unknown>[]);

  if (error) {
    console.error('[initializeTasksFromTemplates] Insert failed:', error.code, error.message);
    return { error: error.message };
  }

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getTaskStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single() as { data: { family_id: string | null } | null };

  if (!profile?.family_id) return null;

  const { data: tasks } = await supabase
    .from('tasks')
    .select('stage_id, is_completed, due_date, title')
    .eq('family_id', profile.family_id);

  if (!tasks) return null;

  const typedTasks = tasks as { stage_id: string; is_completed: boolean; due_date: string | null; title: string }[];

  const stages = ['prenatal_care', 'pregnancy', 'postpartum', 'childcare'] as const;
  const stats = stages.map((stageId) => {
    const stageTasks = typedTasks.filter((t) => t.stage_id === stageId);
    const completed = stageTasks.filter((t) => t.is_completed).length;
    return {
      stage_id: stageId,
      total: stageTasks.length,
      completed,
      percentage: stageTasks.length > 0 ? Math.round((completed / stageTasks.length) * 100) : 0,
    };
  });

  const today = new Date().toISOString().split('T')[0];
  const upcoming = typedTasks
    .filter((t) => !t.is_completed && t.due_date && t.due_date >= today)
    .sort((a, b) => (a.due_date! > b.due_date! ? 1 : -1))
    .slice(0, 5);

  return { stages: stats, upcoming };
}
