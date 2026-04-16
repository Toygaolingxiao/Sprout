-- ============================================================
-- Fix signup trigger for production
-- Root causes:
-- 1. handle_new_user() referenced unqualified table names under auth trigger context.
-- 2. families.owner_id -> profiles.id FK requires profile creation before family creation.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_family_id UUID;
BEGIN
  INSERT INTO public.profiles (id, nickname, family_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', NEW.raw_user_meta_data ->> 'full_name', ''),
    NULL
  );

  INSERT INTO public.families (name, owner_id)
  VALUES ('我が家', NEW.id)
  RETURNING id INTO new_family_id;

  UPDATE public.profiles
  SET family_id = new_family_id
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Harden helper functions used from authenticated sessions as well.
CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_family_id UUID;
  _profile RECORD;
BEGIN
  SELECT * INTO _profile FROM public.profiles WHERE id = auth.uid();
  IF FOUND THEN
    RETURN row_to_json(_profile);
  END IF;

  INSERT INTO public.profiles (id, nickname, family_id)
  VALUES (
    auth.uid(),
    COALESCE(
      (SELECT raw_user_meta_data ->> 'full_name' FROM auth.users WHERE id = auth.uid()),
      (SELECT split_part(email, '@', 1) FROM auth.users WHERE id = auth.uid()),
      'ユーザー'
    ),
    NULL
  );

  INSERT INTO public.families (name, owner_id)
  VALUES ('我が家', auth.uid())
  RETURNING id INTO new_family_id;

  UPDATE public.profiles
  SET family_id = new_family_id
  WHERE id = auth.uid()
  RETURNING * INTO _profile;

  RETURN row_to_json(_profile);
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated;

NOTIFY pgrst, 'reload schema';