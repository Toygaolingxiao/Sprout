"use server";

import { revalidatePath } from 'next/cache';
import { createClient, getAuthUser } from '@/lib/supabase/server';

function buildAlias(nickname: string | null | undefined) {
  const normalized = (nickname ?? '').trim();
  if (!normalized) return '匿名ユーザー';

  const first = Array.from(normalized)[0] ?? '匿';
  return `${first}***`;
}

export async function submitFeedbackComment(input: {
  comment: string;
  consentToPublish: boolean;
  locale: string;
}) {
  const user = await getAuthUser();
  if (!user) return { error: 'feedback.authRequired' };

  const comment = input.comment.trim();
  if (comment.length < 20) return { error: 'feedback.commentTooShort' };
  if (comment.length > 400) return { error: 'feedback.commentTooLong' };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, current_stage')
    .eq('id', user.id)
    .single() as { data: { nickname: string | null; current_stage: string | null } | null };

  const alias = buildAlias(profile?.nickname);

  const { error } = await supabase
    .from('feedback_comments')
    .insert({
      user_id: user.id,
      author_alias: alias,
      comment,
      stage_id: profile?.current_stage,
      locale: input.locale,
      consent_to_publish: input.consentToPublish,
    });

  if (error) return { error: 'feedback.submitFailed' };

  revalidatePath('/settings');
  revalidatePath('/');

  return {
    success: true,
    pendingApproval: input.consentToPublish,
  };
}
