import { NextResponse } from 'next/server';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import { STAGES } from '@/data/seed/stages';
import { CATEGORIES } from '@/data/seed/categories';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/security/rate-limit';
import { secretsMatch } from '@/lib/security/secret';

function clientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}

function authorized(request: Request) {
  const secret = process.env.SEED_SECRET;
  if (!secret) return false;
  const header = request.headers.get('authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (!provided) return false;
  return secretsMatch(provided, secret);
}

export async function POST(request: Request) {
  if (!rateLimit(`seed:${clientKey(request)}`, 5, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Seed admin is not configured' }, { status: 503 });
  }

  const supabase = createAdminClient();
  const results: string[] = [];

  for (const stage of STAGES) {
    const { error } = await supabase
      .from('stages')
      .upsert({ id: stage.id, label: stage.label, sort_order: STAGES.indexOf(stage) }, { onConflict: 'id' });
    if (error) results.push(`Stage ${stage.id}: ${error.message}`);
  }

  for (const cat of CATEGORIES) {
    const { error } = await supabase
      .from('categories')
      .upsert({ id: cat.id, label: cat.label, icon: cat.icon, color: cat.color }, { onConflict: 'id' });
    if (error) results.push(`Category ${cat.id}: ${error.message}`);
  }

  const { error: deleteError } = await supabase
    .from('checklist_templates')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message, details: results }, { status: 500 });
  }

  const templateRows = CHECKLIST_TEMPLATES.map((template) => ({
    stage_id: template.stage_id,
    category_id: template.category_id,
    title: template.title,
    description: template.description ?? null,
    tips: template.tips ?? null,
    target_gender: template.target_gender,
    sort_order: template.sort_order,
  }));

  const { error: insertError, data: inserted } = await supabase
    .from('checklist_templates')
    .insert(templateRows as Record<string, unknown>[])
    .select('id');

  if (insertError) {
    return NextResponse.json({ error: insertError.message, details: results }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    templatesInserted: inserted?.length ?? 0,
    warnings: results.length > 0 ? results : undefined,
  });
}
