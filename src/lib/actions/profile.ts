'use server';

import { createClient } from '@/lib/supabase/server';
import type { LifeStage, Profile } from '@/types';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません' };

  const nickname = formData.get('nickname') as string;
  const currentStage = formData.get('current_stage') as LifeStage;

  const { error } = await supabase
    .from('profiles')
    .update({ nickname, current_stage: currentStage })
    .eq('id', user.id);

  if (error) return { error: error.message };
  return { success: 'プロフィールを更新しました' };
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data as Profile | null;
}
