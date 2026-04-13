"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import type { LifeStage, Profile } from '@/types';

/**
 * Ensure a profile and family exist for the current user.
 * Uses a SECURITY DEFINER RPC function to bypass RLS for creation.
 * Falls back to direct query if the RPC function is not yet deployed.
 */
export async function ensureProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません' };

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
  revalidatePath('/settings');
  return { success: 'プロフィールを更新しました' };
}

/** 出産予定日・妊娠予定時期から各タスクのdue_dateを逆算して更新 */
async function recalculateTaskDueDates(
  userId: string,
  dueDate: string | null,
  pregnancyDate: string | null,
) {
  if (!dueDate && !pregnancyDate) return;

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

  if (!tasks) return;

  const dueDateObj = dueDate ? new Date(dueDate + 'T00:00:00') : null;
  const pregnancyDateObj = pregnancyDate ? new Date(pregnancyDate + 'T00:00:00') : null;

  for (const task of tasks) {
    const template = CHECKLIST_TEMPLATES.find(
      (t) => t.title === task.title && t.stage_id === task.stage_id
    );

    if (!template) continue;

    let taskDateStr: string | null = null;

    if (task.stage_id === 'prenatal_care' && pregnancyDateObj) {
      // 妊活タスク: 妊娠予定時期を基準に逆算（days_offsetがnullの場合は予定時期の30日前）
      const base = new Date(pregnancyDateObj);
      const offset = template.days_offset ?? -30;
      base.setDate(base.getDate() + offset);
      taskDateStr = base.toISOString().split('T')[0];
    } else if (task.stage_id !== 'prenatal_care' && dueDateObj && (template.days_offset || template.days_offset === 0)) {
      // 妊娠・産後・育児: 出産予定日を基準
      const taskDate = new Date(dueDateObj);
      taskDate.setDate(taskDate.getDate() + template.days_offset);
      taskDateStr = taskDate.toISOString().split('T')[0];
    }

    if (taskDateStr) {
      await supabase
        .from('tasks')
        .update({ due_date: taskDateStr })
        .eq('id', task.id);
    }
  }
}

export async function getProfile(): Promise<Profile | null> {
  return ensureProfile();
}
