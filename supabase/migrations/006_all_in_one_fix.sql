-- ============================================================
-- Sprout: 一括セットアップSQL（SQL Editorでこれだけ実行すればOK）
-- ============================================================

-- 1. GRANT権限（PostgRESTがテーブルを認識するために必須）
GRANT USAGE ON SCHEMA public TO anon, authenticated, authenticator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticator;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 2. ensure_profile() RPC関数（プロフィール自動作成）
CREATE OR REPLACE FUNCTION ensure_profile()
RETURNS json AS $$
DECLARE
  new_family_id UUID;
  _profile RECORD;
BEGIN
  SELECT * INTO _profile FROM profiles WHERE id = auth.uid();
  IF FOUND THEN
    RETURN row_to_json(_profile);
  END IF;

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

  INSERT INTO families (name, owner_id)
  VALUES ('我が家', auth.uid())
  RETURNING id INTO new_family_id;

  UPDATE profiles SET family_id = new_family_id WHERE id = auth.uid()
  RETURNING * INTO _profile;

  RETURN row_to_json(_profile);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION ensure_profile TO authenticated;

-- 3. 既存ユーザーのprofile+family自動作成
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
    _family_id := gen_random_uuid();
    -- profileを先に作成（family_idはNULL）
    INSERT INTO public.profiles (id, nickname, family_id, current_stage)
    VALUES (
      _user.id,
      COALESCE(_user.full_name, split_part(_user.email, '@', 1), 'ユーザー'),
      NULL,
      'prenatal_care'
    );
    -- familyを作成（owner_id → profiles.id が存在するようになった）
    INSERT INTO public.families (id, name, owner_id)
    VALUES (_family_id, '我が家', _user.id);
    -- profileにfamily_idを設定
    UPDATE public.profiles SET family_id = _family_id WHERE id = _user.id;
    RAISE NOTICE 'Created profile for %', _user.id;
  END LOOP;
END $$;

-- 4. PostgRESTキャッシュリロード
NOTIFY pgrst, 'reload schema';

-- 5. 確認
SELECT p.id, p.nickname, p.family_id, f.name as family_name
FROM profiles p JOIN families f ON f.id = p.family_id;
