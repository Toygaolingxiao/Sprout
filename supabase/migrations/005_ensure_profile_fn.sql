-- ============================================================
-- ensure_profile(): Auto-create profile + family for current user
-- Handles users created before the handle_new_user trigger existed.
-- Uses SECURITY DEFINER to bypass RLS (same as handle_new_user).
-- ============================================================

CREATE OR REPLACE FUNCTION ensure_profile()
RETURNS json AS $$
DECLARE
  new_family_id UUID;
  _profile RECORD;
BEGIN
  -- Check if profile already exists
  SELECT * INTO _profile FROM profiles WHERE id = auth.uid();
  IF FOUND THEN
    RETURN row_to_json(_profile);
  END IF;

  -- Create profile first (without family, to avoid circular FK issue)
  INSERT INTO profiles (id, nickname, family_id)
  VALUES (
    auth.uid(),
    COALESCE(
      (SELECT raw_user_meta_data ->> 'full_name' FROM auth.users WHERE id = auth.uid()),
      (SELECT split_part(email, '@', 1) FROM auth.users WHERE id = auth.uid()),
      'ユーザー'
    ),
    NULL
  );

  -- Create family (now profile exists, FK families.owner_id -> profiles.id is valid)
  INSERT INTO families (name, owner_id)
  VALUES ('我が家', auth.uid())
  RETURNING id INTO new_family_id;

  -- Link profile to family
  UPDATE profiles SET family_id = new_family_id WHERE id = auth.uid()
  RETURNING * INTO _profile;

  RETURN row_to_json(_profile);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION ensure_profile TO authenticated;
