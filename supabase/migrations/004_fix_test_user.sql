-- ============================================================
-- Fix: Create profile and family for existing test user
-- The handle_new_user() trigger only fires on NEW signups.
-- Users created before the migration need manual setup.
-- ============================================================

-- Insert profile and family for ALL existing auth users that don't have profiles
DO $$
DECLARE
  _user RECORD;
  _family_id UUID;
BEGIN
  FOR _user IN 
    SELECT id, raw_user_meta_data->>'full_name' AS full_name, email 
    FROM auth.users 
    WHERE id NOT IN (SELECT id FROM public.profiles)
  LOOP
    -- Create family
    _family_id := gen_random_uuid();
    INSERT INTO public.families (id, name, owner_id)
    VALUES (_family_id, '我が家', _user.id);
    
    -- Create profile
    INSERT INTO public.profiles (id, nickname, family_id, current_stage)
    VALUES (
      _user.id,
      COALESCE(_user.full_name, split_part(_user.email, '@', 1), 'ユーザー'),
      _family_id,
      'prenatal_care'
    );
    
    RAISE NOTICE 'Created profile and family for user %', _user.id;
  END LOOP;
END $$;

-- Verify
SELECT p.id, p.nickname, p.family_id, f.name as family_name
FROM profiles p
JOIN families f ON f.id = p.family_id;
