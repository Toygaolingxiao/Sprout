import { canUseFeature, normalizeTier } from '@/lib/billing/plans';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function escapeCsvCell(value: unknown) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id, subscription_tier')
    .eq('id', user.id)
    .single() as {
    data: {
      family_id: string | null;
      subscription_tier: string | null;
    } | null;
  };

  if (!profile?.family_id) {
    return new Response('Family not found', { status: 404 });
  }

  const tier = normalizeTier(profile.subscription_tier);
  if (!canUseFeature(tier, 'export_tasks_csv')) {
    return new Response('Pro plan required', { status: 403 });
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('stage_id, category_id, title, priority, is_completed, due_date, updated_at')
    .eq('family_id', profile.family_id)
    .order('stage_id', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    return new Response('Failed to export tasks', { status: 500 });
  }

  const rows = [
    ['stage_id', 'category_id', 'title', 'priority', 'is_completed', 'due_date', 'updated_at'],
    ...(tasks ?? []).map((task) => [
      task.stage_id,
      task.category_id,
      task.title,
      task.priority,
      task.is_completed ? '1' : '0',
      task.due_date ?? '',
      task.updated_at,
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\n');

  const dateTag = new Date().toISOString().slice(0, 10).replaceAll('-', '');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sprout-tasks-${dateTag}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
