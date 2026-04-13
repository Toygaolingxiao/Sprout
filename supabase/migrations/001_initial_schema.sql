-- ============================================================
-- Sprout: Initial Database Schema
-- ============================================================

-- Lifecycle stages enum
CREATE TYPE life_stage AS ENUM ('prenatal_care', 'pregnancy', 'postpartum', 'childcare');

-- Activity action enum
CREATE TYPE activity_action AS ENUM ('complete', 'uncomplete', 'create', 'update', 'delete');

-- ============================================================
-- Families
-- ============================================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '我が家',
  owner_id UUID NOT NULL,  -- FK added after profiles table
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Profiles
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  current_stage life_stage NOT NULL DEFAULT 'prenatal_care',
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Now add families.owner_id FK
ALTER TABLE families
  ADD CONSTRAINT families_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES profiles(id);

-- ============================================================
-- Family Invitations
-- ============================================================
CREATE TABLE family_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_family_invitations_token ON family_invitations(token);

-- ============================================================
-- Stages (master)
-- ============================================================
CREATE TABLE stages (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INT NOT NULL
);

INSERT INTO stages (id, label, sort_order) VALUES
  ('prenatal_care', '妊活', 1),
  ('pregnancy', '妊娠', 2),
  ('postpartum', '産後', 3),
  ('childcare', '育児', 4);

-- ============================================================
-- Categories (master)
-- ============================================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL
);

INSERT INTO categories (id, label, icon, color) VALUES
  ('procedure', '手続き', 'FileText', '#6366f1'),
  ('shopping', '買い物', 'ShoppingCart', '#f59e0b'),
  ('health', '健康', 'Heart', '#ef4444'),
  ('money', 'お金', 'Wallet', '#10b981'),
  ('other', 'その他', 'MoreHorizontal', '#6b7280');

-- ============================================================
-- Checklist Templates (preset data)
-- ============================================================
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id TEXT NOT NULL REFERENCES stages(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  reference_url TEXT
);

-- ============================================================
-- Tasks (user data)
-- ============================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL REFERENCES stages(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  template_id UUID REFERENCES checklist_templates(id),
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  sort_order INT NOT NULL DEFAULT 0,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_family_id ON tasks(family_id);
CREATE INDEX idx_tasks_stage_id ON tasks(stage_id);

-- ============================================================
-- Task Notes (Phase 4)
-- ============================================================
CREATE TABLE task_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Activity Logs (Phase 2)
-- ============================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  action activity_action NOT NULL,
  target_type TEXT NOT NULL DEFAULT 'task',
  target_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_family_id ON activity_logs(family_id);

-- ============================================================
-- Push Subscriptions (Phase 3)
-- ============================================================
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Notification Settings (Phase 3)
-- ============================================================
CREATE TABLE notification_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_enabled BOOLEAN NOT NULL DEFAULT true,
  partner_activity_enabled BOOLEAN NOT NULL DEFAULT true,
  assignment_enabled BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- Knowledge Articles (Phase 3)
-- ============================================================
CREATE TABLE knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id TEXT NOT NULL REFERENCES stages(id),
  category_id TEXT REFERENCES categories(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER knowledge_articles_updated_at
  BEFORE UPDATE ON knowledge_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Auto-create profile + family on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_family_id UUID;
BEGIN
  -- Create a family for the new user
  INSERT INTO families (name, owner_id)
  VALUES ('我が家', NEW.id)
  RETURNING id INTO new_family_id;

  -- Create profile
  INSERT INTO profiles (id, nickname, family_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nickname', NEW.raw_user_meta_data ->> 'full_name', ''),
    new_family_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Helper function: get the user's family_id
CREATE OR REPLACE FUNCTION get_my_family_id()
RETURNS UUID AS $$
  SELECT family_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can view family members"
  ON profiles FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- Families
CREATE POLICY "Users can view own family"
  ON families FOR SELECT USING (id = get_my_family_id());
CREATE POLICY "Owner can update family"
  ON families FOR UPDATE USING (owner_id = auth.uid());

-- Family Invitations
CREATE POLICY "Family owner can create invitations"
  ON family_invitations FOR INSERT
  WITH CHECK (
    family_id = get_my_family_id()
    AND EXISTS (SELECT 1 FROM families WHERE id = family_id AND owner_id = auth.uid())
  );
CREATE POLICY "Anyone can read invitation by token"
  ON family_invitations FOR SELECT USING (true);
CREATE POLICY "Used_by can be set by authenticated user"
  ON family_invitations FOR UPDATE USING (used_by IS NULL);

-- Master data: read-only for all authenticated users
CREATE POLICY "Anyone can read stages" ON stages FOR SELECT USING (true);
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read templates" ON checklist_templates FOR SELECT USING (true);
CREATE POLICY "Anyone can read knowledge" ON knowledge_articles FOR SELECT USING (true);

-- Tasks
CREATE POLICY "Users can view family tasks"
  ON tasks FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Users can create family tasks"
  ON tasks FOR INSERT WITH CHECK (family_id = get_my_family_id());
CREATE POLICY "Users can update family tasks"
  ON tasks FOR UPDATE USING (family_id = get_my_family_id());
CREATE POLICY "Users can delete family tasks"
  ON tasks FOR DELETE USING (family_id = get_my_family_id());

-- Task Notes
CREATE POLICY "Users can view family task notes"
  ON task_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_notes.task_id AND tasks.family_id = get_my_family_id()));
CREATE POLICY "Users can create task notes"
  ON task_notes FOR INSERT
  WITH CHECK (author_id = auth.uid());

-- Activity Logs
CREATE POLICY "Users can view family activity"
  ON activity_logs FOR SELECT USING (family_id = get_my_family_id());
CREATE POLICY "Users can insert activity"
  ON activity_logs FOR INSERT WITH CHECK (user_id = auth.uid() AND family_id = get_my_family_id());

-- Push Subscriptions
CREATE POLICY "Users can manage own subscriptions"
  ON push_subscriptions FOR ALL USING (user_id = auth.uid());

-- Notification Settings
CREATE POLICY "Users can manage own notification settings"
  ON notification_settings FOR ALL USING (user_id = auth.uid());
