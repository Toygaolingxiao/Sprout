import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CHECKLIST_TEMPLATES } from '@/data/seed/templates';
import { STAGES } from '@/data/seed/stages';
import { CATEGORIES } from '@/data/seed/categories';

export async function POST() {
  const supabase = await createClient();

  // Verify authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: string[] = [];

  // Seed stages
  for (const stage of STAGES) {
    const { error } = await supabase
      .from('stages')
      .upsert({ id: stage.id, label: stage.label, sort_order: STAGES.indexOf(stage) }, { onConflict: 'id' });
    if (error) results.push(`Stage ${stage.id}: ${error.message}`);
  }

  // Seed categories
  for (const cat of CATEGORIES) {
    const { error } = await supabase
      .from('categories')
      .upsert({ id: cat.id, label: cat.label, icon: cat.icon, color: cat.color }, { onConflict: 'id' });
    if (error) results.push(`Category ${cat.id}: ${error.message}`);
  }

  // Clear existing templates and re-seed
  await supabase.from('checklist_templates').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const templateRows = CHECKLIST_TEMPLATES.map((t) => ({
    stage_id: t.stage_id,
    category_id: t.category_id,
    title: t.title,
    description: t.description ?? null,
    tips: t.tips ?? null,
    target_gender: t.target_gender,
    sort_order: t.sort_order,
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
