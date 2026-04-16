-- Add baby_gender column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS baby_gender TEXT NOT NULL DEFAULT 'unknown';

NOTIFY pgrst, 'reload schema';
