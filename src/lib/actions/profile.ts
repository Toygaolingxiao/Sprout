"use server";

import { revalidatePath } from 'next/cache';
import { createClient, getAuthUser } from '@/lib/supabase/server';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import type { LifeStage, Profile } from '@/types';

/**
 * Ensure a profile and family exist for the current user.
 * Uses a SECURITY DEFINER RPC function to bypass RLS for creation.
 * Falls back to direct query if the RPC function is not yet deployed.
 */
export async function ensureProfile(): Promise<Profile | null> {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();

  // Check if profile exists
  const { data: existing, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existing) return existing as Profile;

  // Profile missing — try RPC function (SECURITY DEFINER, bypasses RLS)
  console.log('[ensureProfile] Creating profile via RPC for user', user.id);
  const { data: rpcResult, error: rpcError } = await supabase.rpc('ensure_profile');

  if (rpcError) {
    console.error('[ensureProfile] RPC failed:', rpcError.code, rpcError.message);
    // If selectError was PGRST205, the tables don't exist yet
    if (selectError?.code === 'PGRST205') {
      console.error('[ensureProfile] Tables not found in schema cache. Run migrations first.');
    }
    return null;
  }

  return rpcResult as Profile;
}

export async function updateProfile(formData: FormData) {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const supabase = await createClient();

  const nickname = formData.get('nickname') as string;
  const currentStage = formData.get('current_stage') as LifeStage;
  const expectedDueDateRaw = formData.get('expected_due_date') as string;
  const expectedDueDate = expectedDueDateRaw || null;
  const expectedPregnancyDateRaw = formData.get('expected_pregnancy_date') as string;
  const expectedPregnancyDate = expectedPregnancyDateRaw || null;

  const { error } = await supabase
    .from('profiles')
    .update({
      nickname,
      current_stage: currentStage,
      expected_due_date: expectedDueDate,
      expected_pregnancy_date: expectedPregnancyDate,
    } as Record<string, unknown>)
    .eq('id', user.id);

  if (error) return { error: error.message };

  // 予定日が設定されたら、テンプレートタスクのdue_dateを再計算
  await recalculateTaskDueDates(user.id, expectedDueDate, expectedPregnancyDate);

  revalidatePath('/dashboard');
  revalidatePath('/checklists');
  revalidatePath('/family');
  revalidatePath('/settings');
  return { success: 'プロフィールを更新しました' };
}

/** 出産予定日・妊娠予定時期から各タスクのdue_dateを逆算して更新 */
async function recalculateTaskDueDates(
  userId: string,
  dueDate: string | null,
  pregnancyDate: string | null,
) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', userId)
    .single() as { data: { family_id: string | null } | null };

  if (!profile?.family_id) return;

  // テンプレートベースのタスク（is_custom=false）のdue_dateを再計算
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, stage_id, is_custom')
    .eq('family_id', profile.family_id)
    .eq('is_custom', false) as { data: { id: string; title: string; stage_id: string; is_custom: boolean }[] | null };

  if (!tasks || tasks.length === 0) return;

  const dueDateObj = dueDate ? new Date(dueDate + 'T00:00:00') : null;
  const pregnancyDateObj = pregnancyDate ? new Date(pregnancyDate + 'T00:00:00') : null;

  // Build template lookup Map: "title|stage_id" → template (O(1) instead of O(M) per task)
  const templateMap = new Map(
    CHECKLIST_TEMPLATES.map((t) => [`${t.title}|${t.stage_id}`, t])
  );

  // Pre-compute all updates, then batch by due_date value
  const updatesByDate = new Map<string, string[]>();

  for (const task of tasks) {
    const template = templateMap.get(`${task.title}|${task.stage_id}`);
    if (!template) continue;

    let taskDateStr: string | null = null;
    let shouldUpdate = false;

    if (task.stage_id === 'prenatal_care' && pregnancyDateObj) {
      const base = new Date(pregnancyDateObj);
      const offset = template.days_offset ?? -30;
      base.setDate(base.getDate() + offset);
      taskDateStr = base.toISOString().split('T')[0];
      shouldUpdate = true;
    } else if (task.stage_id === 'prenatal_care') {
      shouldUpdate = true;
    } else if (task.stage_id !== 'prenatal_care' && dueDateObj && (template.days_offset || template.days_offset === 0)) {
      const taskDate = new Date(dueDateObj);
      taskDate.setDate(taskDate.getDate() + template.days_offset);
      taskDateStr = taskDate.toISOString().split('T')[0];
      shouldUpdate = true;
    } else if (task.stage_id !== 'prenatal_care' && (template.days_offset || template.days_offset === 0)) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      const updateKey = taskDateStr ?? '__NULL__';
      const ids = updatesByDate.get(updateKey) ?? [];
      ids.push(task.id);
      updatesByDate.set(updateKey, ids);
    }
  }

  // Batch update: one query per unique due_date (typically ~10-15 dates vs ~50 individual updates)
  await Promise.all(
    Array.from(updatesByDate.entries()).map(([dateStr, ids]) =>
      supabase.from('tasks').update({ due_date: dateStr === '__NULL__' ? null : dateStr }).in('id', ids)
    )
  );
}

export async function getProfile(): Promise<Profile | null> {
  return ensureProfile();
}
