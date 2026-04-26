-- Make account deletion resilient to existing FK constraints.
-- We clean or reassign profile references before deleting auth.users.

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_family_id uuid;
  current_family_owner_id uuid;
  replacement_owner_id uuid;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT family_id INTO current_family_id
  FROM public.profiles
  WHERE id = current_user_id;

  IF current_family_id IS NOT NULL THEN
    SELECT owner_id INTO current_family_owner_id
    FROM public.families
    WHERE id = current_family_id;

    IF EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE family_id = current_family_id
        AND id <> current_user_id
    ) THEN
      -- Keep the family when other members exist.
      IF current_family_owner_id <> current_user_id THEN
        replacement_owner_id := current_family_owner_id;
      ELSE
        SELECT id INTO replacement_owner_id
        FROM public.profiles
        WHERE family_id = current_family_id
          AND id <> current_user_id
        ORDER BY created_at ASC
        LIMIT 1;

        UPDATE public.families
        SET owner_id = replacement_owner_id
        WHERE id = current_family_id;
      END IF;

      -- Reassign or clear references pointing to the deleting profile.
      UPDATE public.tasks
      SET created_by = replacement_owner_id
      WHERE family_id = current_family_id
        AND created_by = current_user_id;

      UPDATE public.tasks
      SET assigned_to = NULL
      WHERE family_id = current_family_id
        AND assigned_to = current_user_id;

      UPDATE public.tasks
      SET completed_by = NULL
      WHERE family_id = current_family_id
        AND completed_by = current_user_id;

      DELETE FROM public.task_notes
      WHERE author_id = current_user_id
        AND EXISTS (
          SELECT 1
          FROM public.tasks t
          WHERE t.id = task_notes.task_id
            AND t.family_id = current_family_id
        );

      DELETE FROM public.activity_logs
      WHERE family_id = current_family_id
        AND user_id = current_user_id;

      UPDATE public.family_invitations
      SET used_by = NULL
      WHERE family_id = current_family_id
        AND used_by = current_user_id;
    ELSE
      -- If this is the only member, remove the family and related records.
      DELETE FROM public.families
      WHERE id = current_family_id;
    END IF;
  END IF;

  DELETE FROM auth.users
  WHERE id = current_user_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

NOTIFY pgrst, 'reload schema';
