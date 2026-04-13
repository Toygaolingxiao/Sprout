import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks: Record<string, unknown> = {};

  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    checks.auth = authError ? { error: authError.message } : { ok: true, userId: user?.id };

    // 2. Table access checks
    const tables = ['profiles', 'families', 'tasks', 'stages', 'categories', 'checklist_templates'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      checks[table] = error
        ? { error: error.code + ': ' + error.message }
        : { ok: true, count: data };
    }

    // 3. Profile + family check (if authenticated)
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, nickname, family_id')
        .eq('id', user.id)
        .single();
      checks.userProfile = profileError
        ? { error: profileError.code + ': ' + profileError.message }
        : { ok: true, profile };
    }

    return NextResponse.json({ status: 'ok', checks }, { status: 200 });
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
      checks,
    }, { status: 500 });
  }
}
