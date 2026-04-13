-- 007_add_expected_due_date.sql
-- Add expected_due_date to profiles for schedule calculation

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS expected_due_date DATE;

COMMENT ON COLUMN profiles.expected_due_date IS '出産予定日。タスクの期限を逆算する基準日';
