-- ============================================================
-- Migration: Add target_gender and tips to templates & tasks
-- ============================================================

-- target_gender: 'both' | 'female' | 'male'
ALTER TABLE checklist_templates
  ADD COLUMN target_gender TEXT NOT NULL DEFAULT 'both',
  ADD COLUMN tips TEXT;

ALTER TABLE tasks
  ADD COLUMN target_gender TEXT NOT NULL DEFAULT 'both',
  ADD COLUMN tips TEXT;
