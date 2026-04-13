"use server";

import { createClient } from '@/lib/supabase/server';
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

  const { error } = await supabase
    .from('profiles')
    .update({ nickname, current_stage: currentStage })
    .eq('id', user.id);

  if (error) return { error: error.message };
  return { success: 'プロフィールを更新しました' };
}

export async function getProfile(): Promise<Profile | null> {
  return ensureProfile();
}
