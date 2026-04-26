-- Background cleanup for orphan families.
-- If pg_cron is available, schedule a daily job.

CREATE OR REPLACE FUNCTION public.cleanup_orphan_families()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer := 0;
BEGIN
  -- If family owner is no longer a member, move ownership to the earliest member.
  WITH owner_replacements AS (
    SELECT DISTINCT ON (f.id)
      f.id AS family_id,
      p.id AS replacement_owner_id
    FROM public.families f
    JOIN public.profiles p ON p.family_id = f.id
    LEFT JOIN public.profiles owner_in_family
      ON owner_in_family.id = f.owner_id
     AND owner_in_family.family_id = f.id
    WHERE owner_in_family.id IS NULL
    ORDER BY f.id, p.created_at ASC, p.id ASC
  )
  UPDATE public.families f
  SET owner_id = o.replacement_owner_id
  FROM owner_replacements o
  WHERE f.id = o.family_id;

  -- Delete families with no members.
  DELETE FROM public.families f
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.family_id = f.id
  );

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_orphan_families() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cleanup_orphan_families() TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Remove existing jobs with the same name to avoid duplicates.
    PERFORM cron.unschedule(jobid)
    FROM cron.job
    WHERE jobname = 'sprout_cleanup_orphan_families_daily';

    PERFORM cron.schedule(
      'sprout_cleanup_orphan_families_daily',
      '15 3 * * *',
      'SELECT public.cleanup_orphan_families();'
    );
  END IF;
END;
$$;

NOTIFY pgrst, 'reload schema';
