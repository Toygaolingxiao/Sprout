import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get('limit'));
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 12) : 3;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feedback_comments')
    .select('comment, author_alias, stage_id')
    .eq('consent_to_publish', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return Response.json({ items: [] }, { status: 200 });
  }

  return Response.json({ items: data ?? [] }, { status: 200 });
}
