-- Add subscription tier management for free/pro feature gating

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'subscription_tier' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.subscription_tier AS ENUM ('free', 'pro');
  END IF;
END;
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier public.subscription_tier NOT NULL DEFAULT 'free';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.profiles
SET
  subscription_tier = COALESCE(subscription_tier, 'free'),
  subscription_updated_at = COALESCE(subscription_updated_at, now())
WHERE subscription_tier IS NULL OR subscription_updated_at IS NULL;
