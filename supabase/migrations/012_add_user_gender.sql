-- Add account-level gender on profile
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_gender TEXT NOT NULL DEFAULT 'unknown';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_user_gender_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_gender_check
      CHECK (user_gender IN ('female', 'male', 'other', 'unknown'));
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
