-- Add self family-leave RPC.
-- Allows a user to leave current family safely under RLS.

CREATE OR REPLACE FUNCTION public.leave_my_family()
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

  IF current_family_id IS NULL THEN
    RAISE EXCEPTION 'no_family';
  END IF;

  SELECT owner_id INTO current_family_owner_id
  FROM public.families
  WHERE id = current_family_id;

  -- If family row no longer exists, just clear own family_id.
  IF current_family_owner_id IS NULL THEN
    UPDATE public.profiles
    SET family_id = NULL
    WHERE id = current_user_id;
    RETURN true;
  END IF;

  -- Clear references that would keep ex-member identity in active family timeline.
  UPDATE public.tasks
  SET assigned_to = NULL
  WHERE family_id = current_family_id
    AND assigned_to = current_user_id;

  UPDATE public.tasks
  SET completed_by = NULL,
      completed_at = NULL
  WHERE family_id = current_family_id
    AND completed_by = current_user_id;

  DELETE FROM public.activity_logs
  WHERE family_id = current_family_id
    AND user_id = current_user_id;

  UPDATE public.family_invitations
  SET used_by = NULL
  WHERE family_id = current_family_id
    AND used_by = current_user_id;

  IF current_family_owner_id = current_user_id THEN
    SELECT p.id INTO replacement_owner_id
    FROM public.profiles p
    WHERE p.family_id = current_family_id
      AND p.id <> current_user_id
    ORDER BY p.created_at ASC, p.id ASC
    LIMIT 1;

    IF replacement_owner_id IS NOT NULL THEN
      UPDATE public.families
      SET owner_id = replacement_owner_id
      WHERE id = current_family_id;

      UPDATE public.profiles
      SET family_id = NULL
      WHERE id = current_user_id;
    ELSE
      -- Last member (owner) leaving: detach then remove empty family.
      UPDATE public.profiles
      SET family_id = NULL
      WHERE id = current_user_id;

      DELETE FROM public.families
      WHERE id = current_family_id;
    END IF;
  ELSE
    UPDATE public.profiles
    SET family_id = NULL
    WHERE id = current_user_id;
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.leave_my_family() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.leave_my_family() TO authenticated;

NOTIFY pgrst, 'reload schema';
