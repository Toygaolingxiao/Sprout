-- 008_add_expected_pregnancy_date.sql
-- Add expected_pregnancy_date to profiles for prenatal care scheduling

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS expected_pregnancy_date DATE;

COMMENT ON COLUMN profiles.expected_pregnancy_date IS '妊娠予定時期。妊活ステージのスケジュール基準日';
