-- Performance indexes for task-heavy queries
CREATE INDEX IF NOT EXISTS idx_tasks_family_stage_sort
  ON public.tasks (family_id, stage_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_tasks_family_stage_custom_title
  ON public.tasks (family_id, stage_id, is_custom, title);

CREATE INDEX IF NOT EXISTS idx_tasks_family_completed_due
  ON public.tasks (family_id, is_completed, due_date);

NOTIFY pgrst, 'reload schema';
