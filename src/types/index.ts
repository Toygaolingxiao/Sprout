// Database types for Sprout
// These mirror the Supabase schema and can be replaced by `supabase gen types` output

export type LifeStage = 'prenatal_care' | 'pregnancy' | 'postpartum' | 'childcare';
export type ActivityAction = 'complete' | 'uncomplete' | 'create' | 'update' | 'delete';
export type CategoryId = 'procedure' | 'shopping' | 'health' | 'money' | 'other';
export type TargetGender = 'both' | 'female' | 'male';
export type BabyGender = 'female' | 'male' | 'unknown';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  current_stage: LifeStage;
  family_id: string | null;
  expected_due_date: string | null;
  expected_pregnancy_date: string | null;
  baby_gender: BabyGender;
  created_at: string;
  updated_at: string;
}

export interface Family {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface FamilyInvitation {
  id: string;
  family_id: string;
  token: string;
  expires_at: string;
  used_by: string | null;
  created_at: string;
}

export interface Stage {
  id: LifeStage;
  label: string;
  sort_order: number;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}

export interface ChecklistTemplate {
  id: string;
  stage_id: LifeStage;
  category_id: CategoryId;
  title: string;
  description: string | null;
  sort_order: number;
  reference_url: string | null;
  target_gender: TargetGender;
  tips: string | null;
}

export interface Task {
  id: string;
  family_id: string;
  stage_id: LifeStage;
  category_id: CategoryId;
  template_id: string | null;
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_by: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  due_date: string | null;
  priority: TaskPriority;
  sort_order: number;
  is_custom: boolean;
  target_gender: TargetGender;
  tips: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskNote {
  id: string;
  task_id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  family_id: string;
  user_id: string;
  action: ActivityAction;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface KnowledgeArticle {
  id: string;
  stage_id: LifeStage;
  category_id: CategoryId | null;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Supabase Database type helper
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      families: {
        Row: Family;
        Insert: Omit<Family, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Family, 'id'>>;
      };
      family_invitations: {
        Row: FamilyInvitation;
        Insert: Omit<FamilyInvitation, 'id' | 'created_at' | 'used_by'> & { id?: string; created_at?: string; used_by?: string | null };
        Update: Partial<Omit<FamilyInvitation, 'id'>>;
      };
      stages: {
        Row: Stage;
        Insert: Stage;
        Update: Partial<Stage>;
      };
      categories: {
        Row: Category;
        Insert: Category;
        Update: Partial<Category>;
      };
      checklist_templates: {
        Row: ChecklistTemplate;
        Insert: Omit<ChecklistTemplate, 'id'> & { id?: string };
        Update: Partial<Omit<ChecklistTemplate, 'id'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'is_completed' | 'completed_by' | 'completed_at' | 'assigned_to' | 'is_custom'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          is_completed?: boolean;
          completed_by?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          is_custom?: boolean;
        };
        Update: Partial<Omit<Task, 'id'>>;
      };
      task_notes: {
        Row: TaskNote;
        Insert: Omit<TaskNote, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<TaskNote, 'id'>>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<ActivityLog, 'id'>>;
      };
      knowledge_articles: {
        Row: KnowledgeArticle;
        Insert: Omit<KnowledgeArticle, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<KnowledgeArticle, 'id'>>;
      };
      push_subscriptions: {
        Row: { id: string; user_id: string; endpoint: string; keys: Record<string, unknown>; created_at: string };
        Insert: { user_id: string; endpoint: string; keys: Record<string, unknown>; id?: string; created_at?: string };
        Update: Partial<{ endpoint: string; keys: Record<string, unknown> }>;
      };
      notification_settings: {
        Row: { user_id: string; reminder_enabled: boolean; partner_activity_enabled: boolean; assignment_enabled: boolean };
        Insert: { user_id: string; reminder_enabled?: boolean; partner_activity_enabled?: boolean; assignment_enabled?: boolean };
        Update: Partial<{ reminder_enabled: boolean; partner_activity_enabled: boolean; assignment_enabled: boolean }>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      life_stage: LifeStage;
      activity_action: ActivityAction;
    };
  };
};
