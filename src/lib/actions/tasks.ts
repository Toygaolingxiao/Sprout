"use server";

import { revalidatePath } from 'next/cache';
import { createClient, getAuthUser, getFamilyId } from '@/lib/supabase/server';
import { canUseFeature, normalizeTier } from '@/lib/billing/plans';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import type { LifeStage, CategoryId, Task, TaskPriority } from '@/types';

function resolveTemplatePriority(input: { priority?: TaskPriority; category_id: CategoryId }): TaskPriority {
  if (input.priority) return input.priority;
  if (input.category_id === 'procedure' || input.category_id === 'health') return 'high';
  if (input.category_id === 'money' || input.category_id === 'shopping') return 'medium';
  return 'low';
}

function calculateTemplateDueDate(
  template: { stage_id: LifeStage; days_offset?: number | null },
  dueDateBase: Date | null,
  pregnancyDateBase: Date | null,
) {
  if (template.stage_id === 'prenatal_care' && pregnancyDateBase) {
    const d = new Date(pregnancyDateBase);
    d.setDate(d.getDate() + (template.days_offset ?? -30));
    return d.toISOString().split('T')[0];
  }

  if (template.stage_id !== 'prenatal_care' && dueDateBase && (template.days_offset || template.days_offset === 0)) {
    const d = new Date(dueDateBase);
    d.setDate(d.getDate() + template.days_offset);
    return d.toISOString().split('T')[0];
  }

  return null;
}

export async function getTasks(stageId?: LifeStage): Promise<Task[]> {
  const user = await getAuthUser();
  if (!user) return [];

  const familyId = await getFamilyId(user.id);
  if (!familyId) return [];

  const supabase = await createClient();
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('family_id', familyId)
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
  priority?: TaskPriority;
}) {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const familyId = await getFamilyId(user.id);
  if (!familyId) return { error: '家族グループが見つかりません' };

  const supabase = await createClient();

  // Get max sort_order for this stage
  const { data: maxTask } = await supabase
    .from('tasks')
    .select('sort_order')
    .eq('family_id', familyId)
    .eq('stage_id', input.stage_id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single() as { data: { sort_order: number } | null };

  const { error } = await supabase.from('tasks').insert({
    family_id: familyId,
    stage_id: input.stage_id,
    category_id: input.category_id,
    title: input.title,
    description: input.description ?? null,
    due_date: input.due_date ?? null,
    priority: input.priority ?? 'medium',
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
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const supabase = await createClient();
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
  priority?: TaskPriority;
}) {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

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
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

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
  const user = await getAuthUser();
  if (!user) {
    console.error('[initializeTasksFromTemplates] Not authenticated');
    return { error: '認証されていません' };
  }

  const supabase = await createClient();
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

  // Use local seed data directly (no DB template dependency)
  const localTemplates = CHECKLIST_TEMPLATES.filter((t) => t.stage_id === stageId);

  if (localTemplates.length === 0) return { success: true, message: 'テンプレートがありません' };

  const dueDateBase = profile.expected_due_date ? new Date(profile.expected_due_date + 'T00:00:00') : null;
  const pregnancyDateBase = profile.expected_pregnancy_date ? new Date(profile.expected_pregnancy_date + 'T00:00:00') : null;

  // Do not auto-sync missing defaults on every page view.
  // Defaults can now be intentionally removed and restored via explicit template reset.
  if (count && count > 0) {
    return { success: true, message: '既にタスクが存在します' };
  }

  const tasks = localTemplates.map((t) => {
    const due_date = calculateTemplateDueDate(t, dueDateBase, pregnancyDateBase);
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
      priority: resolveTemplatePriority(t),
    };
  });

  const { error } = await supabase.from('tasks').insert(tasks as Record<string, unknown>[]);

  if (error) {
    console.error('[initializeTasksFromTemplates] Insert failed:', error.code, error.message);
    return { error: error.message };
  }

  return { success: true };
}

export async function getTaskStats() {
  const user = await getAuthUser();
  if (!user) return null;

  const familyId = await getFamilyId(user.id);
  if (!familyId) return null;

  const supabase = await createClient();
  const { data: tasks } = await supabase
    .from('tasks')
    .select('stage_id, is_completed, due_date, title')
    .eq('family_id', familyId);

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

export async function resetStageTemplates(input: {
  stageId: LifeStage;
  priorities: TaskPriority[];
}) {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const familyId = await getFamilyId(user.id);
  if (!familyId) return { error: '家族グループが見つかりません' };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('expected_due_date, expected_pregnancy_date')
    .eq('id', user.id)
    .single() as { data: { expected_due_date: string | null; expected_pregnancy_date: string | null } | null };

  const priorities = input.priorities.length > 0 ? input.priorities : ['high', 'medium', 'low'];
  const dueDateBase = profile?.expected_due_date ? new Date(profile.expected_due_date + 'T00:00:00') : null;
  const pregnancyDateBase = profile?.expected_pregnancy_date ? new Date(profile.expected_pregnancy_date + 'T00:00:00') : null;

  const templates = CHECKLIST_TEMPLATES
    .filter((t) => t.stage_id === input.stageId)
    .filter((t) => priorities.includes(resolveTemplatePriority(t)));

  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('family_id', familyId)
    .eq('stage_id', input.stageId)
    .eq('is_custom', false);

  if (deleteError) return { error: deleteError.message };

  if (templates.length === 0) {
    revalidatePath('/checklists');
    revalidatePath('/dashboard');
    return { success: true, insertedCount: 0 };
  }

  const payload = templates.map((t) => ({
    family_id: familyId,
    stage_id: t.stage_id,
    category_id: t.category_id,
    title: t.title,
    description: t.description ?? null,
    sort_order: t.sort_order,
    target_gender: t.target_gender,
    tips: t.tips ?? null,
    is_custom: false,
    created_by: user.id,
    due_date: calculateTemplateDueDate(t, dueDateBase, pregnancyDateBase),
    priority: resolveTemplatePriority(t),
  }));

  const { error: insertError } = await supabase.from('tasks').insert(payload as Record<string, unknown>[]);
  if (insertError) return { error: insertError.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true, insertedCount: payload.length };
}

export async function deleteCustomTasksByStage(stageId: LifeStage) {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const familyId = await getFamilyId(user.id);
  if (!familyId) return { error: '家族グループが見つかりません' };

  const supabase = await createClient();
  const { count, error: countError } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .eq('stage_id', stageId)
    .eq('is_custom', true);

  if (countError) return { error: countError.message };

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('family_id', familyId)
    .eq('stage_id', stageId)
    .eq('is_custom', true);

  if (error) return { error: error.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true, deletedCount: count ?? 0 };
}

export async function deleteAllCustomTasks() {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const familyId = await getFamilyId(user.id);
  if (!familyId) return { error: '家族グループが見つかりません' };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single() as { data: { subscription_tier: string | null } | null };

  const tier = normalizeTier(profile?.subscription_tier);
  if (!canUseFeature(tier, 'delete_all_custom_tasks')) {
    return { errorCode: 'pro_required_delete_all_custom_tasks' as const };
  }

  const { count, error: countError } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('family_id', familyId)
    .eq('is_custom', true);

  if (countError) return { error: countError.message };

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('family_id', familyId)
    .eq('is_custom', true);

  if (error) return { error: error.message };

  revalidatePath('/checklists');
  revalidatePath('/dashboard');
  return { success: true, deletedCount: count ?? 0 };
}
