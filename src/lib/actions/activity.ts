'use server';

import { createClient, getAuthUser, getFamilyId } from '@/lib/supabase/server';
import type { ActivityAction, ActivityFeedItem } from '@/types';

export async function recordTaskActivity(input: {
  familyId: string;
  userId: string;
  action: ActivityAction;
  taskId: string;
  title: string;
  count?: number;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('activity_logs').insert({
      family_id: input.familyId,
      user_id: input.userId,
      action: input.action,
      target_type: 'task',
      target_id: input.taskId,
      metadata: {
        title: input.title.slice(0, 120),
        ...(input.count && input.count > 1 ? { count: input.count } : {}),
      },
    });
    if (error) console.error('[activity]', error.message);
  } catch (error) {
    console.error('[activity]', error instanceof Error ? error.message : error);
  }
}

export async function getRecentActivity(limit = 8): Promise<ActivityFeedItem[]> {
  const user = await getAuthUser();
  if (!user) return [];

  const familyId = await getFamilyId(user.id);
  if (!familyId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activity_logs')
    .select('id, action, metadata, created_at, user_id')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    if (error) console.error('[activity] read failed', error.message);
    return [];
  }

  const userIds = [...new Set(data.map((row) => row.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nickname')
    .in('id', userIds);

  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.nickname]));

  return data.map((row) => {
    const metadata = (row.metadata ?? {}) as { title?: unknown; count?: unknown };
    const count = typeof metadata.count === 'number' ? metadata.count : 1;
    return {
      id: row.id,
      action: row.action,
      createdAt: row.created_at,
      actorName: names.get(row.user_id)?.trim() || '',
      taskTitle: typeof metadata.title === 'string' ? metadata.title : '',
      count,
    };
  });
}
