-- Feedback comments for collecting real user voices

CREATE TABLE IF NOT EXISTS public.feedback_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_alias TEXT NOT NULL DEFAULT '匿名ユーザー',
  comment TEXT NOT NULL CHECK (
    char_length(btrim(comment)) >= 20
    AND char_length(comment) <= 400
  ),
  stage_id life_stage,
  locale TEXT NOT NULL DEFAULT 'ja',
  consent_to_publish BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_comments_public
  ON public.feedback_comments (is_approved, consent_to_publish, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_comments_user_id
  ON public.feedback_comments (user_id, created_at DESC);

ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can submit own feedback" ON public.feedback_comments;
CREATE POLICY "Users can submit own feedback"
  ON public.feedback_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own feedback" ON public.feedback_comments;
CREATE POLICY "Users can read own feedback"
  ON public.feedback_comments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can read approved feedback" ON public.feedback_comments;
CREATE POLICY "Public can read approved feedback"
  ON public.feedback_comments FOR SELECT
  USING (consent_to_publish = true AND is_approved = true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at'
  ) THEN
    DROP TRIGGER IF EXISTS feedback_comments_updated_at ON public.feedback_comments;
    CREATE TRIGGER feedback_comments_updated_at
      BEFORE UPDATE ON public.feedback_comments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END;
$$;

GRANT SELECT, INSERT ON public.feedback_comments TO authenticated;
GRANT SELECT ON public.feedback_comments TO anon;
