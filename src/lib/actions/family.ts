"use server";

import { createClient } from '@/lib/supabase/server';
import type { Profile, FamilyInvitation } from '@/types';

export async function createInvitation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single() as { data: { family_id: string | null } | null };

  if (!profile?.family_id) return { error: '家族グループが見つかりません' };

  // Verify user is family owner
  const { data: family } = await supabase
    .from('families')
    .select('owner_id')
    .eq('id', profile.family_id)
    .single() as { data: { owner_id: string } | null };

  if (family?.owner_id !== user.id) return { error: '家族のオーナーのみ招待できます' };

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const { error } = await supabase.from('family_invitations').insert({
    family_id: profile.family_id,
    token,
    expires_at: expiresAt,
  });

  if (error) return { error: error.message };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return { success: true, inviteUrl: `${baseUrl}/invite/${token}` };
}

export async function acceptInvitation(token: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '認証されていません' };

  const { data: invitation } = await supabase
    .from('family_invitations')
    .select('*')
    .eq('token', token)
    .is('used_by', null)
    .single() as { data: FamilyInvitation | null };

  if (!invitation) return { error: '無効な招待リンクです' };

  if (new Date(invitation.expires_at) < new Date()) {
    return { error: '招待リンクの有効期限が切れています' };
  }

  // Update user's family_id
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ family_id: invitation.family_id })
    .eq('id', user.id);

  if (profileError) return { error: profileError.message };

  // Mark invitation as used
  await supabase
    .from('family_invitations')
    .update({ used_by: user.id })
    .eq('id', invitation.id);

  return { success: true };
}

export async function getFamilyMembers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single() as { data: { family_id: string | null } | null };

  if (!profile?.family_id) return [];

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('family_id', profile.family_id);

  return (data ?? []) as Profile[];
}
