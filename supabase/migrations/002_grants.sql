-- ============================================================
-- Fix: Grant permissions to PostgREST roles (anon, authenticated)
-- Without these, PostgREST cannot see the tables (PGRST205 error)
-- ============================================================

-- Schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Sequences (needed for inserts with auto-generated ids)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Table grants for authenticated role (main app role)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Table grants for anon role (limited read access)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure future tables also get proper grants
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO anon;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
