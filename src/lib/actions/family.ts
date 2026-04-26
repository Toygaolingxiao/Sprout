"use server";

import { headers } from 'next/headers';
import { createClient, getAuthUser, getFamilyId } from '@/lib/supabase/server';
import type { Profile, FamilyInvitation } from '@/types';

export async function createInvitation() {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const familyId = await getFamilyId(user.id);
  if (!familyId) return { error: '家族グループが見つかりません' };

  const supabase = await createClient();

  // Verify user is family owner
  const { data: family } = await supabase
    .from('families')
    .select('owner_id')
    .eq('id', familyId)
    .single() as { data: { owner_id: string } | null };

  if (family?.owner_id !== user.id) return { error: '家族のオーナーのみ招待できます' };

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const { error } = await supabase.from('family_invitations').insert({
    family_id: familyId,
    token,
    expires_at: expiresAt,
  });

  if (error) return { error: error.message };

  const headerStore = await headers();
  const host = headerStore.get('host') ?? '';
  const proto = headerStore.get('x-forwarded-proto') ?? 'https';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;
  return { success: true, inviteUrl: `${baseUrl}/invite/${token}` };
}

export async function acceptInvitation(token: string) {
  const user = await getAuthUser();
  if (!user) return { error: '認証されていません' };

  const supabase = await createClient();

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('family_id')
    .eq('id', user.id)
    .single() as { data: { family_id: string | null } | null };
  const previousFamilyId = currentProfile?.family_id ?? null;

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

  // If user moved from another family, prevent leaving stale orphan family rows.
  if (previousFamilyId && previousFamilyId !== invitation.family_id) {
    const { data: members } = await supabase
      .from('profiles')
      .select('id')
      .eq('family_id', previousFamilyId) as { data: { id: string }[] | null };

    if (!members || members.length === 0) {
      await supabase.from('families').delete().eq('id', previousFamilyId);
    } else {
      const { data: previousFamily } = await supabase
        .from('families')
        .select('owner_id')
        .eq('id', previousFamilyId)
        .single() as { data: { owner_id: string } | null };

      if (previousFamily?.owner_id === user.id) {
        const replacementOwnerId = members[0]?.id;
        if (replacementOwnerId) {
          await supabase
            .from('families')
            .update({ owner_id: replacementOwnerId })
            .eq('id', previousFamilyId);
        }
      }
    }
  }

  return { success: true };
}

export async function getFamilyMembers(): Promise<Profile[]> {
  const user = await getAuthUser();
  if (!user) return [];

  const familyId = await getFamilyId(user.id);
  if (!familyId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('family_id', familyId);

  return (data ?? []) as Profile[];
}
