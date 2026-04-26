import { createClient } from '@/lib/supabase/server';

type ProfileRow = { nickname: string | null };

function isMissingRowError(code?: string) {
  return code === 'PGRST116' || code === 'PGRST205';
}

function pickDisplayName(metadata: Record<string, unknown> | undefined, email?: string | null) {
  const candidates = [
    metadata?.nickname,
    metadata?.full_name,
    metadata?.name,
    metadata?.displayName,
    metadata?.preferred_username,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  if (email && email.includes('@')) {
    return email.split('@')[0];
  }

  return 'ユーザー';
}

function shouldOverwriteNickname(current: string | null, fallbackFromEmail: string | null) {
  if (!current || current.trim().length === 0) return true;
  if (current === 'ユーザー') return true;
  if (fallbackFromEmail && current === fallbackFromEmail) return true;
  return false;
}

/**
 * Ensures profile/family exists for the current user and syncs nickname from OAuth metadata.
 * This is useful for LINE OAuth where we want account creation to feel automatic.
 */
export async function provisionCurrentUserFromOAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const displayName = pickDisplayName(
    user.user_metadata as Record<string, unknown> | undefined,
    user.email,
  );
  const emailPrefix = user.email?.includes('@') ? user.email.split('@')[0] : null;

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle() as { data: ProfileRow | null; error: { code?: string } | null };

  if (currentProfileError && isMissingRowError(currentProfileError.code)) {
    await supabase.rpc('ensure_profile');
  }

  const { data: profileAfterEnsure } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle() as { data: ProfileRow | null; error: { code?: string } | null };

  const nickname = profileAfterEnsure?.nickname ?? currentProfile?.nickname ?? null;
  if (!shouldOverwriteNickname(nickname, emailPrefix)) return;

  await supabase
    .from('profiles')
    .update({ nickname: displayName })
    .eq('id', user.id);
}
